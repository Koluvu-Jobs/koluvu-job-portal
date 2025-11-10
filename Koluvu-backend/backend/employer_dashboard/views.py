from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Count, F, Avg
from django.db import IntegrityError
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
import re
import json
from .models import (
    EmployerProfile, Job, JobApplication, Candidate, Interviewer, 
    Interview, InterviewNote, InterviewTimeSlot, ProxyScanSession, 
    ProxyDetectionRule, ProxyAlert, InterviewFeedback, FeedbackTemplate, 
    FeedbackReminder, Notification, Message, EmployerSettings
)
# Import username-based profile views
from .username_profile_views import (
    EmployerProfileView, UsernameBasedEmployerProfileView, 
    UsernameBasedEmployerProfileUpdateView, UsernameBasedCompanyLogoUploadView,
    UsernameBasedProfilePictureUploadView, EmployerRegisterView, 
    EmployerLoginView, SocialMediaSyncView, ProfileCompletionView
)
from .serializers import (
    EmployerProfileSerializer, 
    JobSerializer, 
    JobListSerializer,
    JobApplicationSerializer,
    CandidateSerializer,
    InterviewerSerializer,
    InterviewSerializer,
    InterviewListSerializer,
    InterviewNoteSerializer,
    InterviewTimeSlotSerializer,
    ProxyScanSessionSerializer,
    ProxyScanSessionListSerializer,
    ProxyDetectionRuleSerializer,
    ProxyAlertSerializer,
    InterviewFeedbackSerializer,
    InterviewFeedbackListSerializer,
    InterviewFeedbackCreateSerializer,
    FeedbackSummarySerializer,
    CandidateFeedbackSerializer,
    FeedbackTemplateSerializer,
    FeedbackReminderSerializer,
    ProxyScanRequestSerializer,
    EmployerSettingsSerializer,
    EmployerSettingsUpdateSerializer,
    ProxyStatisticsSerializer
)
# Import from employee_dashboard for candidate search
from employee_dashboard.models import CandidateSearchProfile
from employee_dashboard.serializers import (
    CandidateSearchProfileSerializer,
    BooleanSearchRequestSerializer
)
# Import username-based profile views
from .username_profile_views import (
    EmployerProfileView, UsernameBasedEmployerProfileView, 
    UsernameBasedEmployerProfileUpdateView, UsernameBasedCompanyLogoUploadView,
    UsernameBasedProfilePictureUploadView, EmployerRegisterView, 
    EmployerLoginView, SocialMediaSyncView, ProfileCompletionView
)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_employer_names(request):
    """Update employer name and/or company name with 30-day restriction"""
    try:
        # Get or create employer profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': 'Pavansai',
                'is_active': True,
                'last_name_change': timezone.now() - timedelta(days=31)  # Allow immediate change for new profiles
            }
        )
        
        # Check if user can change names
        if not employer_profile.can_change_names():
            days_remaining = employer_profile.days_until_next_change()
            return Response({
                'error': f'You can only change names once every 30 days. Please wait {days_remaining} more days.',
                'can_change': False,
                'days_remaining': days_remaining
            }, status=400)
        
        # Get the new names from request
        data = request.data
        employer_name = data.get('employer_name', '').strip()
        company_name = data.get('company_name', '').strip()
        
        # Validate input
        if not employer_name and not company_name:
            return Response({
                'error': 'At least one name (employer_name or company_name) must be provided'
            }, status=400)
        
        if employer_name and len(employer_name) < 2:
            return Response({
                'error': 'Employer name must be at least 2 characters long'
            }, status=400)
            
        if company_name and len(company_name) < 2:
            return Response({
                'error': 'Company name must be at least 2 characters long'
            }, status=400)
        
        # Update names using the model method
        success = employer_profile.update_names(employer_name, company_name)
        
        if not success:
            return Response({
                'error': 'Unable to update names. Please try again.',
                'can_change': False
            }, status=400)
        
        # Refresh from database
        employer_profile.refresh_from_db()
        
        # Create notification for successful name change
        Notification.objects.create(
            recipient=request.user,
            type='profile_update',
            title='Names Updated Successfully',
            message=f'Your names have been updated successfully. Next change will be available after {timezone.now().strftime("%B %d, %Y")}',
            is_read=False
        )
        
        # Serialize updated profile
        serializer = EmployerProfileSerializer(employer_profile)
        
        return Response({
            'message': 'Names updated successfully',
            'profile': serializer.data,
            'can_change_names': employer_profile.can_change_names(),
            'days_until_next_change': employer_profile.days_until_next_change(),
            'next_change_date': (timezone.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        }, status=200)
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_activation(request):
    """Toggle company activation status - employer only"""
    try:
        # Get or create employer profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': 'Pavansai',
                'is_active': True,
                'last_name_change': timezone.now() - timedelta(days=31)
            }
        )
        
        # Get the new activation status
        is_active = request.data.get('is_active')
        
        if is_active is None:
            return Response({
                'error': 'is_active field is required'
            }, status=400)
        
        # Ensure it's a boolean
        if not isinstance(is_active, bool):
            return Response({
                'error': 'is_active must be a boolean value'
            }, status=400)
        
        # Update activation status
        employer_profile.is_active = is_active
        employer_profile.save()
        
        # Create notification for activation change
        status_text = "activated" if is_active else "deactivated"
        Notification.objects.create(
            recipient=request.user,
            type='account_update',
            title=f'Company {status_text.title()}',
            message=f'Your company has been {status_text} successfully.',
            is_read=False
        )
        
        # Serialize updated profile
        serializer = EmployerProfileSerializer(employer_profile)
        
        return Response({
            'message': f'Company {status_text} successfully',
            'profile': serializer.data,
            'is_active': is_active
        }, status=200)
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_employer_profile(request):
    """
    Comprehensive employer profile update endpoint
    Handles ALL profile fields including file uploads (profile picture, company logo)
    """
    try:
        # Get or create employer profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': 'Your Company',
                'contact_person': request.user.get_full_name() or request.user.username,
                'employer_name': request.user.get_full_name() or request.user.username,
                'is_active': True
            }
        )
        
        # Track changes for notification
        changes_made = []
        
        # Update basic company information
        basic_fields = [
            'company_name', 'industry_type', 'company_size', 'website', 
            'phone', 'company_location', 'contact_person', 'designation', 
            'total_employees'
        ]
        
        for field in basic_fields:
            if field in request.data:
                old_value = getattr(employer_profile, field)
                new_value = request.data[field]
                if old_value != new_value:
                    setattr(employer_profile, field, new_value)
                    changes_made.append(field)
        
        # Update social media links
        social_fields = [
            'linkedin_profile_url', 'github_profile_url', 
            'twitter_profile_url', 'facebook_profile_url', 'instagram_profile_url'
        ]
        
        for field in social_fields:
            if field in request.data:
                setattr(employer_profile, field, request.data[field])
        
        # Update bio and introduction
        if 'bio' in request.data:
            employer_profile.bio = request.data['bio']
            changes_made.append('bio')
        
        if 'employer_introduction' in request.data:
            employer_profile.employer_introduction = request.data['employer_introduction']
            changes_made.append('employer_introduction')
        
        # Handle profile picture upload (FILE)
        if 'profile_picture' in request.FILES:
            employer_profile.profile_picture = request.FILES['profile_picture']
            changes_made.append('profile_picture')
        
        # Handle company logo upload (FILE)
        if 'company_logo' in request.FILES:
            employer_profile.company_logo = request.FILES['company_logo']
            changes_made.append('company_logo')
        
        # Handle URL-based images
        if 'profile_picture_url' in request.data:
            employer_profile.profile_picture_url = request.data['profile_picture_url']
        
        if 'company_logo_url' in request.data:
            employer_profile.company_logo_url = request.data['company_logo_url']
        
        # Update employer name (if provided and within restrictions)
        if 'employer_name' in request.data:
            try:
                employer_profile.update_names(employer_name=request.data['employer_name'])
                changes_made.append('employer_name')
            except ValueError as e:
                return Response({
                    'error': str(e),
                    'field': 'employer_name'
                }, status=400)
        
        # Save the profile
        employer_profile.save()
        
        # Update User model fields if provided
        user_updated = False
        if 'first_name' in request.data:
            request.user.first_name = request.data['first_name']
            user_updated = True
        
        if 'last_name' in request.data:
            request.user.last_name = request.data['last_name']
            user_updated = True
        
        if user_updated:
            request.user.save()
            changes_made.append('name')
        
        # Create notification for profile update
        if changes_made:
            Notification.objects.create(
                recipient=request.user,
                type='profile_update',
                title='Profile Updated',
                message=f'Your profile has been updated successfully. Changes: {", ".join(changes_made)}',
                is_read=False
            )
        
        # Serialize and return updated profile
        serializer = EmployerProfileSerializer(employer_profile)
        
        return Response({
            'message': 'Profile updated successfully',
            'changes_made': changes_made,
            'profile': serializer.data
        }, status=200)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    """Get enhanced job-based notifications for the authenticated user"""
    try:
        # Get query parameters
        notification_type = request.GET.get('type', None)
        is_read = request.GET.get('is_read', None)
        job_id = request.GET.get('job_id', None)
        limit = int(request.GET.get('limit', 20))
        
        # Base queryset
        queryset = Notification.objects.filter(
            recipient=request.user
        ).select_related('sender', 'job', 'application', 'interview')
        
        # Apply filters
        if notification_type:
            queryset = queryset.filter(type=notification_type)
        
        if is_read is not None:
            is_read_bool = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read_bool)
        
        if job_id:
            queryset = queryset.filter(job_id=job_id)
        
        # Order and limit
        notifications = queryset.order_by('-created_at')[:limit]
        
        notifications_data = []
        for notification in notifications:
            notification_data = {
                'id': notification.id,
                'type': notification.type,
                'title': notification.title,
                'message': notification.message,
                'is_read': notification.is_read,
                'read_at': notification.read_at.isoformat() if notification.read_at else None,
                'created_at': notification.created_at.isoformat(),
                'expires_at': notification.expires_at.isoformat() if notification.expires_at else None,
                'sender': {
                    'id': notification.sender.id,
                    'username': notification.sender.username,
                    'first_name': notification.sender.first_name,
                    'last_name': notification.sender.last_name,
                } if notification.sender else None,
                'metadata': notification.metadata,
            }
            
            # Add related object data
            if notification.job:
                notification_data['job'] = {
                    'id': notification.job.id,
                    'title': notification.job.title,
                    'status': notification.job.status,
                    'location': notification.job.location,
                }
            
            if notification.application:
                notification_data['application'] = {
                    'id': notification.application.id,
                    'status': notification.application.status,
                }
            
            if notification.interview:
                notification_data['interview'] = {
                    'id': notification.interview.id,
                    'title': notification.interview.title,
                    'interview_date': notification.interview.interview_date.isoformat(),
                    'status': notification.interview.status,
                }
            
            notifications_data.append(notification_data)
        
        # Get counts
        unread_count = Notification.objects.filter(
            recipient=request.user, 
            is_read=False
        ).count()
        
        total_count = Notification.objects.filter(
            recipient=request.user
        ).count()
        
        # Get notification counts by type
        type_counts = {}
        for choice in Notification.NOTIFICATION_TYPES:
            type_key = choice[0]
            type_counts[type_key] = Notification.objects.filter(
                recipient=request.user,
                type=type_key,
                is_read=False
            ).count()
        
        return Response({
            'notifications': notifications_data,
            'unread_count': unread_count,
            'total_count': total_count,
            'type_counts': type_counts,
            'pagination': {
                'limit': limit,
                'has_more': total_count > limit
            }
        })
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        notification = get_object_or_404(
            Notification, 
            id=notification_id, 
            recipient=request.user
        )
        
        notification.is_read = True
        notification.save()
        
        return Response({
            'message': 'Notification marked as read',
            'notification_id': notification_id
        })
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    """Delete a notification"""
    try:
        notification = get_object_or_404(
            Notification, 
            id=notification_id, 
            recipient=request.user
        )
        
        notification.delete()
        
        return Response({
            'message': 'Notification deleted successfully',
            'notification_id': notification_id
        })
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request):
    """Get messages for the authenticated user"""
    try:
        messages = Message.objects.filter(
            recipient=request.user
        ).order_by('-created_at')[:50]  # Get latest 50 messages
        
        messages_data = []
        for message in messages:
            messages_data.append({
                'id': message.id,
                'sender': message.sender.username if message.sender else 'System',
                'subject': message.subject,
                'content': message.content,
                'is_read': message.is_read,
                'created_at': message.created_at.isoformat(),
            })
        
        return Response({
            'messages': messages_data,
            'unread_count': Message.objects.filter(
                recipient=request.user, 
                is_read=False
            ).count()
        })
        
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=500)


class CompaniesListView(generics.ListAPIView):
    """List all companies (employer profiles) - public endpoint"""
    queryset = EmployerProfile.objects.filter(is_verified=True)
    serializer_class = EmployerProfileSerializer
    permission_classes = []  # Public endpoint

    def get_queryset(self):
        queryset = EmployerProfile.objects.filter(is_verified=True)
        
        # Add filtering based on query parameters
        search = self.request.query_params.get('search', None)
        industry = self.request.query_params.get('industry', None)
        location = self.request.query_params.get('location', None)
        
        if search:
            queryset = queryset.filter(company_name__icontains=search)
        if industry:
            queryset = queryset.filter(industry_type__icontains=industry)
        if location:
            queryset = queryset.filter(company_location__icontains=location)
            
        return queryset


class EmployerRegisterView(generics.CreateAPIView):
    """Register a new employer with CAPTCHA verification"""
    permission_classes = []  # Allow unauthenticated access for registration
    
    def post(self, request):
        try:
            # CAPTCHA verification
            captcha_key = request.data.get('captcha_key')
            captcha_value = request.data.get('captcha_value')
            recaptcha_token = request.data.get('recaptcha_token')
            
            # Verify CAPTCHA (prefer reCAPTCHA if provided)
            if recaptcha_token:
                from authentication.captcha_views import verify_recaptcha_required
                is_valid, error_msg, score = verify_recaptcha_required(recaptcha_token, 'register')
                if not is_valid:
                    return Response({
                        'success': False,
                        'error': f'CAPTCHA verification failed: {error_msg}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                from authentication.captcha_views import verify_captcha_required
                is_valid, error_msg = verify_captcha_required(captcha_key, captcha_value)
                if not is_valid:
                    return Response({
                        'success': False,
                        'error': f'CAPTCHA verification failed: {error_msg}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate required fields
            email = request.data.get('email')
            password = request.data.get('password')
            confirm_password = request.data.get('confirm_password')
            
            if not email or not password:
                return Response({
                    'success': False,
                    'error': 'Email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check password match
            if confirm_password and password != confirm_password:
                # Clean up OTP sessions on validation failure
                from authentication.models import OTPSession, RegistrationCache
                OTPSession.objects.filter(identifier=email).delete()
                RegistrationCache.objects.filter(email=email).delete()
                
                return Response({
                    'success': False,
                    'error': "Passwords don't match"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                # Clean up OTP sessions
                from authentication.models import OTPSession, RegistrationCache
                OTPSession.objects.filter(identifier=email).delete()
                RegistrationCache.objects.filter(email=email).delete()
                
                return Response({
                    'success': False,
                    'error': 'A user with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate username from email if not provided
            username = request.data.get('username')
            if not username:
                username = email.split('@')[0]
                # Ensure uniqueness by adding number if needed
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
            
            # Create User first
            user_data = {
                'username': username,
                'email': email,
                'password': password,
                'first_name': request.data.get('first_name', ''),
                'last_name': request.data.get('last_name', ''),
            }
            
            if User.objects.filter(username=user_data['username']).exists():
                return Response({
                    'success': False,
                    'error': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create_user(**user_data)
            
            # Create EmployerProfile
            profile_data = {
                'user': user,
                'company_name': request.data.get('company_name'),
                'industry_type': request.data.get('industry_type', ''),
                'phone': request.data.get('phone'),
                'company_location': request.data.get('company_location'),
                'contact_person': request.data.get('contact_person'),
            }
            
            profile = EmployerProfile.objects.create(**profile_data)
            serializer = EmployerProfileSerializer(profile)
            
            # Clean up OTP sessions after successful registration
            from authentication.models import OTPSession, RegistrationCache
            OTPSession.objects.filter(identifier=email).delete()
            RegistrationCache.objects.filter(email=email).delete()
            
            return Response({
                'success': True,
                'message': 'Employer registered successfully',
                'profile': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Clean up OTP sessions on any error
            email = request.data.get('email')
            if email:
                from authentication.models import OTPSession, RegistrationCache
                OTPSession.objects.filter(identifier=email).delete()
                RegistrationCache.objects.filter(email=email).delete()
            
            return Response({
                'success': False,
                'error': f'Registration failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployerProfileView(generics.RetrieveUpdateAPIView):
    """Get and update employer profile"""
    serializer_class = EmployerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = EmployerProfile.objects.get_or_create(user=self.request.user)
        
        # Update last login information
        if self.request.method == 'GET':
            # Get client IP address
            x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = self.request.META.get('REMOTE_ADDR')
            
            # Update last login IP
            if ip and ip != profile.last_login_ip:
                profile.last_login_ip = ip
                # In production, you could use a GeoIP service to get location
                # For now, we'll just update the IP
                profile.save(update_fields=['last_login_ip'])
        
        return profile
    
    def retrieve(self, request, *args, **kwargs):
        """Enhanced retrieve to include social media sync status"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Add additional context data
        data = serializer.data
        data['social_accounts'] = []
        
        # Get associated social accounts
        from authentication.models import SocialAccount
        social_accounts = SocialAccount.objects.filter(user=request.user)
        for account in social_accounts:
            data['social_accounts'].append({
                'provider': account.provider,
                'email': account.email,
                'profile_picture_url': account.profile_picture_url,
                'created_at': account.created_at
            })
        
        return Response(data)


class SocialMediaSyncView(APIView):
    """Sync profile data from social media platforms"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Manually trigger sync with social media platforms"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        from authentication.models import SocialAccount
        social_accounts = SocialAccount.objects.filter(user=request.user)
        
        updated_data = {}
        sync_results = []
        
        for account in social_accounts:
            try:
                if account.provider == 'linkedin':
                    # For LinkedIn, we could fetch fresh data if we had a valid access token
                    # For now, we'll use the stored social media data
                    if employer_profile.social_media_data.get('linkedin'):
                        employer_profile.update_from_social_media('linkedin', employer_profile.social_media_data['linkedin'])
                        sync_results.append({'provider': 'linkedin', 'status': 'success', 'message': 'Profile updated from stored LinkedIn data'})
                
                elif account.provider == 'google':
                    if employer_profile.social_media_data.get('google'):
                        employer_profile.update_from_social_media('google', employer_profile.social_media_data['google'])
                        sync_results.append({'provider': 'google', 'status': 'success', 'message': 'Profile updated from stored Google data'})
                
                elif account.provider == 'github':
                    if employer_profile.social_media_data.get('github'):
                        employer_profile.update_from_social_media('github', employer_profile.social_media_data['github'])
                        sync_results.append({'provider': 'github', 'status': 'success', 'message': 'Profile updated from stored GitHub data'})
                
            except Exception as e:
                sync_results.append({
                    'provider': account.provider, 
                    'status': 'error', 
                    'message': f'Failed to sync: {str(e)}'
                })
        
        # Return updated profile data
        serializer = EmployerProfileSerializer(employer_profile)
        
        return Response({
            'message': 'Social media sync completed',
            'sync_results': sync_results,
            'profile': serializer.data
        })


class ProfileCompletionView(APIView):
    """Get profile completion status and recommendations"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calculate detailed completion status
        completion_data = {
            'completion_percentage': employer_profile.profile_completion_percentage,
            'is_complete': employer_profile.is_profile_complete,
            'missing_fields': [],
            'recommendations': []
        }
        
        # Check required fields
        required_fields = {
            'company_name': 'Company Name',
            'contact_person': 'Contact Person Name',
            'phone': 'Phone Number',
            'company_location': 'Company Location',
            'industry_type': 'Industry Type',
            'website': 'Company Website'
        }
        
        for field, label in required_fields.items():
            if not getattr(employer_profile, field):
                completion_data['missing_fields'].append({
                    'field': field,
                    'label': label,
                    'required': True
                })
        
        # Check optional fields for recommendations
        optional_fields = {
            'designation': 'Your Designation',
            'company_size': 'Company Size',
            'company_logo': 'Company Logo'
        }
        
        recommendations = []
        for field, label in optional_fields.items():
            if not getattr(employer_profile, field):
                recommendations.append(f"Add {label} to improve your profile visibility")
        
        # Social media recommendations
        from authentication.models import SocialAccount
        social_accounts = SocialAccount.objects.filter(user=request.user)
        connected_providers = [acc.provider for acc in social_accounts]
        
        if 'linkedin' not in connected_providers:
            recommendations.append("Connect your LinkedIn account to auto-fill professional details")
        if 'github' not in connected_providers and employer_profile.industry_type in ['Technology', 'Software', 'IT']:
            recommendations.append("Connect your GitHub account to showcase your technical background")
        
        completion_data['recommendations'] = recommendations
        
        return Response(completion_data)


class EmployerLoginView(generics.GenericAPIView):
    """Employer login view with CAPTCHA verification"""
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # CAPTCHA verification
        captcha_key = request.data.get('captcha_key')
        captcha_value = request.data.get('captcha_value')
        recaptcha_token = request.data.get('recaptcha_token')
        
        # Verify CAPTCHA (prefer reCAPTCHA if provided)
        if recaptcha_token:
            from authentication.captcha_views import verify_recaptcha_required
            is_valid, error_msg, score = verify_recaptcha_required(recaptcha_token, 'login')
            if not is_valid:
                return Response({
                    'success': False,
                    'error': f'CAPTCHA verification failed: {error_msg}'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            from authentication.captcha_views import verify_captcha_required
            is_valid, error_msg = verify_captcha_required(captcha_key, captcha_value)
            if not is_valid:
                return Response({
                    'success': False,
                    'error': f'CAPTCHA verification failed: {error_msg}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                try:
                    profile = EmployerProfile.objects.get(user=user)
                    serializer = EmployerProfileSerializer(profile)
                    return Response({
                        'message': 'Login successful',
                        'profile': serializer.data
                    })
                except EmployerProfile.DoesNotExist:
                    return Response({
                        'error': 'Employer profile not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)


class JobListCreateView(generics.ListCreateAPIView):
    """List jobs and create new job"""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return JobListSerializer
        return JobSerializer

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = Job.objects.filter(employer=employer_profile)
            
            # Filter by status if provided
            status_filter = self.request.query_params.get('status', None)
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Job.objects.none()

    def perform_create(self, serializer):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            serializer.save(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            raise serializers.ValidationError("Employer profile not found")
    
    def create(self, request, *args, **kwargs):
        """Enhanced create with better error handling and support for all new fields"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found. Please complete your profile first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Map frontend field names to backend field names
        data = request.data.copy()
        
        # Basic field mappings (backwards compatible)
        field_mappings = {
            'jobTitle': 'title',
            'jobType': 'job_type',
            'jobLocation': 'location',
            'employmentType': 'employment_type',
            'experienceMin': 'experience_min',
            'experienceMax': 'experience_max',
            'salaryMin': 'salary_min',
            'salaryMax': 'salary_max',
            'jobDescription': 'description',
            'candidateProfile': 'candidate_profile',
            'contactEmail': 'contact_email',
            'virtualPlatform': 'virtual_platform',
            'walkinAddress': 'walkin_address',
            'contactPreference': 'contact_preferences',
            'notificationPreference': 'notification_preferences',
            'deadline': 'application_deadline',
            'gender': 'gender_preference',
            # New field mappings for comprehensive job posting
            'companyName': 'company_name',
            'industryType': 'industry',
            'salaryCurrency': 'salary_currency',
            'educationLevel': 'education_level',
            'experienceLevel': 'experience_level',
            'skillsRequired': 'skills_required',
            'languageProficiency': 'language_proficiency',
            'additionalNotes': 'additional_notes',
            'employerName': 'employer_name',
            'employerEmail': 'employer_email',
            'employerPhone': 'employer_phone',
            'employerLinkedin': 'employer_linkedin_url',
            'employerWebsite': 'employer_website_url',
            'employerBio': 'employer_bio',
            'employerSocialMedia': 'employer_social_media',
            'companySize': 'company_size',
            'companyBenefits': 'company_benefits',
        }
        
        for frontend_name, backend_name in field_mappings.items():
            if frontend_name in data:
                data[backend_name] = data.pop(frontend_name)
        
        # Convert interview method
        if 'interviewMethod' in data:
            interview_method_map = {
                'Virtual Interview': 'virtual',
                'Walk-in Interview': 'walkin',
                'Hybrid': 'hybrid'
            }
            data['interview_method'] = interview_method_map.get(
                data.pop('interviewMethod'), 
                data.get('interviewMethod', '')
            )
        
        # Convert urgency to lowercase
        if 'urgency' in data:
            data['urgency'] = data['urgency'].lower() if isinstance(data['urgency'], str) else data['urgency']
        
        # Auto-populate employer details from profile if not provided
        if 'company_name' not in data or not data.get('company_name'):
            data['company_name'] = employer_profile.company_name
        
        if 'employer_name' not in data or not data.get('employer_name'):
            data['employer_name'] = employer_profile.employer_name or employer_profile.contact_person
        
        if 'employer_email' not in data or not data.get('employer_email'):
            data['employer_email'] = request.user.email
        
        if 'employer_phone' not in data or not data.get('employer_phone'):
            data['employer_phone'] = employer_profile.phone
        
        if 'employer_linkedin_url' not in data or not data.get('employer_linkedin_url'):
            data['employer_linkedin_url'] = employer_profile.linkedin_profile_url
        
        if 'employer_website_url' not in data or not data.get('employer_website_url'):
            data['employer_website_url'] = employer_profile.website
        
        if 'employer_bio' not in data or not data.get('employer_bio'):
            data['employer_bio'] = employer_profile.bio
        
        # Handle file uploads for employer logo
        if 'employer_logo' in request.FILES:
            data['employer_logo'] = request.FILES['employer_logo']
        
        # DEBUG: Print incoming data after mapping
        print("[DEBUG] Job POST incoming data:", dict(data))
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            job = serializer.save(employer=employer_profile)
            # DEBUG: Print saved job instance fields
            print("[DEBUG] Job instance after save:", job.__dict__)
            
            # Create notification for job posting
            Notification.objects.create(
                recipient=request.user,
                type='job_update',
                title=f'Job Posted: {job.title}',
                message=f'Your job posting "{job.title}" has been created successfully and is now live.',
                job=job,
                metadata={
                    'job_id': job.id,
                    'action_url': f'/employer/jobs/{job.id}',
                    'priority': 'medium'
                }
            )
            
            # Send real-time notifications to all employees
            try:
                from backend.shared_services.realtime_notifications import NotificationManager
                NotificationManager.notify_job_posted(job)
            except Exception as e:
                # Log the error but don't fail the job creation
                print(f"Error sending notifications: {str(e)}")
            
            return Response({
                'message': 'Job posted successfully!',
                'job': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific job"""
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return Job.objects.filter(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return Job.objects.none()
    
    def update(self, request, *args, **kwargs):
        """Enhanced update method to handle all new fields"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Map frontend field names to backend field names (same as create)
        data = request.data.copy()
        field_mappings = {
            'jobTitle': 'title',
            'jobType': 'job_type',
            'jobLocation': 'location',
            'employmentType': 'employment_type',
            'experienceMin': 'experience_min',
            'experienceMax': 'experience_max',
            'salaryMin': 'salary_min',
            'salaryMax': 'salary_max',
            'jobDescription': 'description',
            'candidateProfile': 'candidate_profile',
            'contactEmail': 'contact_email',
            'virtualPlatform': 'virtual_platform',
            'walkinAddress': 'walkin_address',
            'contactPreference': 'contact_preferences',
            'notificationPreference': 'notification_preferences',
            'deadline': 'application_deadline',
            'gender': 'gender_preference',
            'companyName': 'company_name',
            'industryType': 'industry',
            'salaryCurrency': 'salary_currency',
            'educationLevel': 'education_level',
            'experienceLevel': 'experience_level',
            'skillsRequired': 'skills_required',
            'languageProficiency': 'language_proficiency',
            'additionalNotes': 'additional_notes',
            'employerName': 'employer_name',
            'employerEmail': 'employer_email',
            'employerPhone': 'employer_phone',
            'employerLinkedin': 'employer_linkedin_url',
            'employerWebsite': 'employer_website_url',
            'employerBio': 'employer_bio',
            'employerSocialMedia': 'employer_social_media',
            'companySize': 'company_size',
            'companyBenefits': 'company_benefits',
        }
        
        for frontend_name, backend_name in field_mappings.items():
            if frontend_name in data:
                data[backend_name] = data.pop(frontend_name)
        
        # Handle file uploads
        if 'employer_logo' in request.FILES:
            data['employer_logo'] = request.FILES['employer_logo']
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            
            # Create notification for job update
            Notification.objects.create(
                recipient=request.user,
                type='job_update',
                title=f'Job Updated: {instance.title}',
                message=f'Your job posting "{instance.title}" has been updated successfully.',
                job=instance,
                metadata={
                    'job_id': instance.id,
                    'action_url': f'/employer/jobs/{instance.id}',
                    'priority': 'low'
                }
            )
            
            return Response({
                'message': 'Job updated successfully',
                'job': serializer.data
            })
        
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete method with better error handling"""
        try:
            # Get the job instance
            instance = self.get_object()
            
            # Verify ownership through the get_queryset method (which already filters by employer)
            # If get_object() succeeds, it means the user owns this job
            
            # Store job info for response
            job_title = instance.title
            job_id = instance.id
            
            # Log the deletion attempt
            print(f"Attempting to delete job: ID={job_id}, Title='{job_title}', User={request.user.username}")
            
            # Create notification before deletion
            Notification.objects.create(
                recipient=request.user,
                type='job_update',
                title=f'Job Deleted: {job_title}',
                message=f'Your job posting "{job_title}" has been deleted.',
                metadata={
                    'job_id': job_id,
                    'action': 'deleted'
                }
            )
            
            # Perform the deletion
            instance.delete()
            
            print(f"Successfully deleted job: ID={job_id}")
            
            return Response({
                'message': f'Job "{job_title}" deleted successfully',
                'deleted_job_id': job_id
            }, status=status.HTTP_200_OK)
            
        except Job.DoesNotExist:
            print(f"Job not found for user {request.user.username}")
            return Response({
                'error': 'Job not found or you do not have permission to delete it'
            }, status=status.HTTP_404_NOT_FOUND)
        except EmployerProfile.DoesNotExist:
            print(f"Employer profile not found for user {request.user.username}")
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError as e:
            print(f"Database integrity error during deletion for user {request.user.username}: {str(e)}")
            return Response({
                'error': 'Cannot delete job due to related data. Please remove all applications first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error during deletion for user {request.user.username}: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Failed to delete job: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobApplicationListView(generics.ListAPIView):
    """List applications for employer's jobs"""
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return JobApplication.objects.filter(job__employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return JobApplication.objects.none()


class JobApplicationDetailView(generics.RetrieveUpdateAPIView):
    """Get and update job application status"""
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return JobApplication.objects.filter(job__employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return JobApplication.objects.none()


# Public Job Views for Employees
class PublicJobListView(generics.ListAPIView):
    """Public endpoint for employees to view active jobs"""
    serializer_class = JobListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Get all active jobs with filters"""
        queryset = Job.objects.filter(
            status='active',
            application_deadline__gte=timezone.now().date()
        ).select_related('employer')
        
        # Search by title, description, or skills
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(skills__icontains=search) |
                Q(employer__company_name__icontains=search)
            )
        
        # Filter by location
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by job type
        job_type = self.request.query_params.get('job_type', None)
        if job_type:
            queryset = queryset.filter(job_type__icontains=job_type)
        
        # Filter by employment type
        employment_type = self.request.query_params.get('employment_type', None)
        if employment_type:
            queryset = queryset.filter(employment_type__icontains=employment_type)
        
        # Filter by industry
        industry = self.request.query_params.get('industry', None)
        if industry:
            queryset = queryset.filter(industry__icontains=industry)
        
        # Filter by experience
        exp_min = self.request.query_params.get('exp_min', None)
        exp_max = self.request.query_params.get('exp_max', None)
        if exp_min:
            queryset = queryset.filter(experience_min__gte=int(exp_min))
        if exp_max:
            queryset = queryset.filter(experience_max__lte=int(exp_max))
        
        # Filter by salary
        salary_min = self.request.query_params.get('salary_min', None)
        if salary_min:
            queryset = queryset.filter(salary_min__gte=float(salary_min))
        
        # Sort options
        sort_by = self.request.query_params.get('sort_by', '-created_at')
        if sort_by in ['created_at', '-created_at', 'salary_min', '-salary_min', 'title', '-title']:
            queryset = queryset.order_by(sort_by)
        
        return queryset


class PublicJobDetailView(APIView):
    """Public endpoint to view job details and increment view count"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            job = Job.objects.select_related('employer').get(
                pk=pk,
                status='active'
            )
            
            # Increment view count
            job.increment_views()
            
            serializer = JobSerializer(job)
            return Response(serializer.data)
        except Job.DoesNotExist:
            return Response({
                'error': 'Job not found or no longer active'
            }, status=status.HTTP_404_NOT_FOUND)


class JobStatsView(APIView):
    """Get statistics for employer's jobs"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            jobs = Job.objects.filter(employer=employer_profile)
            
            stats = {
                'total_jobs': jobs.count(),
                'active_jobs': jobs.filter(status='active').count(),
                'draft_jobs': jobs.filter(status='draft').count(),
                'closed_jobs': jobs.filter(status='closed').count(),
                'expired_jobs': jobs.filter(status='expired').count(),
                'total_applications': JobApplication.objects.filter(
                    job__employer=employer_profile
                ).count(),
                'pending_applications': JobApplication.objects.filter(
                    job__employer=employer_profile,
                    status='pending'
                ).count(),
                'total_views': sum(job.views_count for job in jobs),
            }
            
            return Response(stats)
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class RecentJobsView(generics.ListAPIView):
    """Get recently posted jobs - public endpoint"""
    serializer_class = JobListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Job.objects.filter(
            status='active',
            application_deadline__gte=timezone.now().date()
        ).select_related('employer').order_by('-created_at')[:10]


class JobBulkActionView(APIView):
    """Bulk actions on multiple jobs"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Perform bulk actions on jobs
        Body: {
            "job_ids": [1, 2, 3],
            "action": "close" | "delete" | "activate" | "draft"
        }
        """
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        job_ids = request.data.get('job_ids', [])
        action = request.data.get('action', '')
        
        print(f"Bulk action request: job_ids={job_ids}, action={action}, user={request.user.username}")
        
        if not job_ids or not action:
            return Response({
                'error': 'job_ids and action are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get jobs owned by this employer
        jobs = Job.objects.filter(
            id__in=job_ids,
            employer=employer_profile
        )
        
        found_job_count = jobs.count()
        requested_job_count = len(job_ids)
        
        print(f"Found {found_job_count} jobs out of {requested_job_count} requested")
        
        if found_job_count != requested_job_count:
            return Response({
                'error': f'Some jobs not found or not owned by you. Found {found_job_count} out of {requested_job_count}.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Perform action
            if action == 'close':
                jobs.update(status='closed')
                print(f"Successfully closed {found_job_count} jobs")
            elif action == 'delete':
                count = jobs.count()
                jobs.delete()
                print(f"Successfully deleted {count} jobs")
                return Response({
                    'message': f'{count} jobs deleted successfully'
                })
            elif action == 'activate':
                jobs.update(status='active')
                print(f"Successfully activated {found_job_count} jobs")
            elif action == 'draft':
                jobs.update(status='draft')
                print(f"Successfully set {found_job_count} jobs to draft")
            else:
                return Response({
                    'error': 'Invalid action'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'message': f'{jobs.count()} jobs updated successfully'
            })
            
        except IntegrityError as e:
            print(f"Database integrity error during bulk action: {str(e)}")
            return Response({
                'error': 'Database integrity error. Some jobs may have related data that prevents the action.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error during bulk action: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Failed to perform bulk action: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobCloseView(APIView):
    """Close a specific job"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            job = Job.objects.get(pk=pk, employer=employer_profile)
            
            job.status = 'closed'
            job.save()
            
            return Response({
                'message': 'Job closed successfully',
                'job': JobSerializer(job).data
            })
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({
                'error': 'Job not found'
            }, status=status.HTTP_404_NOT_FOUND)


class JobActivateView(APIView):
    """Activate a specific job"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            job = Job.objects.get(pk=pk, employer=employer_profile)
            
            job.status = 'active'
            job.save()
            
            return Response({
                'message': 'Job activated successfully',
                'job': JobSerializer(job).data
            })
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({
                'error': 'Job not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ActiveJobsView(generics.ListAPIView):
    """Get all active jobs for employer - optimized for active jobs page"""
    serializer_class = JobListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            
            queryset = Job.objects.filter(
                employer=employer_profile,
                status='active'
            ).select_related('employer').annotate(
                total_applications=Count('applications')
            ).order_by('-created_at')
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(location__icontains=search) |
                    Q(department__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Job.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add summary statistics
        total_active = queryset.count()
        total_applications = sum(job.applications_count for job in queryset)
        total_views = sum(job.views_count for job in queryset)
        
        return Response({
            'jobs': serializer.data,
            'summary': {
                'total_active_jobs': total_active,
                'total_applications': total_applications,
                'total_views': total_views,
            }
        })


class ExpiredJobsView(generics.ListAPIView):
    """Get all expired jobs for employer - optimized for expired jobs page"""
    serializer_class = JobListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            
            # Get jobs that are either marked as expired OR have passed deadline
            today = timezone.now().date()
            
            queryset = Job.objects.filter(
                employer=employer_profile
            ).filter(
                Q(status='expired') |
                Q(application_deadline__lt=today, status='active')
            ).select_related('employer').order_by('-created_at')
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(location__icontains=search) |
                    Q(department__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Job.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add summary statistics - handle None values safely
        total_expired = queryset.count()
        total_applications = sum(job.applications_count or 0 for job in queryset)
        total_views = sum(job.views_count or 0 for job in queryset)
        
        return Response({
            'jobs': serializer.data,
            'summary': {
                'total_expired_jobs': total_expired,
                'total_applications': total_applications,
                'total_views': total_views,
            }
        })


class JobReactivateView(APIView):
    """Reactivate an expired or closed job"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            job = Job.objects.get(pk=pk, employer=employer_profile)
            
            # Update status and optionally extend deadline
            job.status = 'active'
            
            # If deadline is in the past, extend it by 30 days
            today = timezone.now().date()
            if job.application_deadline and job.application_deadline < today:
                from datetime import timedelta
                job.application_deadline = today + timedelta(days=30)
            
            job.save()
            
            return Response({
                'message': 'Job reactivated successfully',
                'job': JobSerializer(job).data
            })
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({
                'error': 'Job not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ExpiredJobsBulkActionView(APIView):
    """Bulk actions on expired jobs"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Perform bulk actions on expired jobs
        Body: {
            "job_ids": [1, 2, 3],
            "action": "reactivate" | "delete" | "archive"
        }
        """
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        job_ids = request.data.get('job_ids', [])
        action = request.data.get('action', '')
        
        if not job_ids or not action:
            return Response({
                'error': 'job_ids and action are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get jobs owned by this employer
        jobs = Job.objects.filter(
            id__in=job_ids,
            employer=employer_profile
        )
        
        if jobs.count() != len(job_ids):
            return Response({
                'error': 'Some jobs not found or not owned by you'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Perform action
        if action == 'reactivate':
            # Reactivate and extend deadline
            today = timezone.now().date()
            from datetime import timedelta
            
            for job in jobs:
                job.status = 'active'
                if job.application_deadline and job.application_deadline < today:
                    job.application_deadline = today + timedelta(days=30)
                job.save()
            
            return Response({
                'message': f'{jobs.count()} jobs reactivated successfully'
            })
        elif action == 'delete':
            count = jobs.count()
            jobs.delete()
            return Response({
                'message': f'{count} jobs deleted successfully'
            })
        elif action == 'archive':
            jobs.update(status='closed')
            return Response({
                'message': f'{jobs.count()} jobs archived successfully'
            })
        else:
            return Response({
                'error': 'Invalid action. Use: reactivate, delete, or archive'
            }, status=status.HTTP_400_BAD_REQUEST)


class ClosedJobsView(generics.ListAPIView):
    """Get all closed jobs for employer - optimized for closed jobs page"""
    serializer_class = JobListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            
            queryset = Job.objects.filter(
                employer=employer_profile,
                status='closed'
            ).select_related('employer').order_by('-updated_at')
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(location__icontains=search) |
                    Q(department__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Job.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add summary statistics - handle None values safely
        total_closed = queryset.count()
        total_applications = sum(job.applications_count or 0 for job in queryset)
        total_views = sum(job.views_count or 0 for job in queryset)
        
        return Response({
            'jobs': serializer.data,
            'summary': {
                'total_closed_jobs': total_closed,
                'total_applications': total_applications,
                'total_views': total_views,
            }
        })


class ClosedJobsBulkActionView(APIView):
    """Bulk actions on closed jobs"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Perform bulk actions on closed jobs
        Body: {
            "job_ids": [1, 2, 3],
            "action": "reactivate" | "delete" | "archive_permanently"
        }
        """
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        job_ids = request.data.get('job_ids', [])
        action = request.data.get('action', '')
        
        if not job_ids or not action:
            return Response({
                'error': 'job_ids and action are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get jobs owned by this employer
        jobs = Job.objects.filter(
            id__in=job_ids,
            employer=employer_profile,
            status='closed'
        )
        
        if jobs.count() != len(job_ids):
            return Response({
                'error': 'Some jobs not found, not owned by you, or not in closed status'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Perform action
        if action == 'reactivate':
            # Reactivate and extend deadline if needed
            today = timezone.now().date()
            from datetime import timedelta
            
            for job in jobs:
                job.status = 'active'
                if job.application_deadline and job.application_deadline < today:
                    job.application_deadline = today + timedelta(days=30)
                job.save()
            
            return Response({
                'message': f'{jobs.count()} jobs reactivated successfully'
            })
        elif action == 'delete':
            count = jobs.count()
            jobs.delete()
            return Response({
                'message': f'{count} jobs deleted successfully'
            })
        elif action == 'archive_permanently':
            # Could add an archived status or just keep as closed
            return Response({
                'message': f'{jobs.count()} jobs archived successfully'
            })
        else:
            return Response({
                'error': 'Invalid action. Use: reactivate, delete, or archive_permanently'
            }, status=status.HTTP_400_BAD_REQUEST)


class BooleanCandidateSearchView(APIView):
    """Advanced boolean search for candidates"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Search for candidates using boolean logic and filters
        Body: {
            "query": "React AND (TypeScript OR JavaScript) NOT Junior",
            "location": "Hyderabad",
            "department": "IT",
            "designation": "Senior Developer",
            "experience": "3-5 years",
            "notice_period": "30 Days",
            "salary_range": "10-15 LPA",
            "actively_looking": true
        }
        """
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Validate request data
        serializer = BooleanSearchRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        
        # Start with all searchable candidates
        queryset = CandidateSearchProfile.objects.filter(
            is_searchable=True
        ).select_related('employee__user').prefetch_related(
            'projects',
            'achievement_details',
            'employee__education',
            'employee__experience',
            'employee__skills'
        )
        
        # Apply filters
        
        # Location filter
        location = validated_data.get('location')
        if location:
            queryset = queryset.filter(
                Q(employee__location__icontains=location) |
                Q(preferred_location__icontains=location)
            )
        
        # Department filter
        department = validated_data.get('department')
        if department:
            queryset = queryset.filter(department__iexact=department)
        
        # Designation filter
        designation = validated_data.get('designation')
        if designation:
            queryset = queryset.filter(
                Q(employee__current_designation__icontains=designation) |
                Q(employee__current_position__icontains=designation)
            )
        
        # Experience filter
        experience = validated_data.get('experience')
        if experience:
            exp_min, exp_max = self._parse_experience_range(experience)
            if exp_min is not None:
                queryset = queryset.filter(employee__experience_years__gte=exp_min)
            if exp_max is not None:
                queryset = queryset.filter(employee__experience_years__lte=exp_max)
        
        # Notice period filter
        notice_period = validated_data.get('notice_period')
        if notice_period:
            queryset = queryset.filter(notice_period__icontains=notice_period)
        
        # Salary range filter
        salary_range = validated_data.get('salary_range')
        if salary_range:
            sal_min, sal_max = self._parse_salary_range(salary_range)
            if sal_min is not None:
                queryset = queryset.filter(
                    Q(expected_ctc__gte=sal_min) | Q(expected_ctc__isnull=True)
                )
            if sal_max is not None:
                queryset = queryset.filter(
                    Q(expected_ctc__lte=sal_max) | Q(expected_ctc__isnull=True)
                )
        
        # Actively looking filter
        actively_looking = validated_data.get('actively_looking', False)
        if actively_looking:
            queryset = queryset.filter(actively_looking=True)
        
        # Boolean query filter (if provided)
        query = validated_data.get('query', '').strip()
        if query:
            queryset = self._apply_boolean_query(queryset, query)
        
        # Calculate match scores
        queryset = self._calculate_match_scores(queryset, validated_data)
        
        # Order by match score
        queryset = queryset.order_by('-match_score', '-last_active')
        
        # Serialize results
        candidates = list(queryset[:50])  # Limit to 50 results
        serializer = CandidateSearchProfileSerializer(
            candidates, 
            many=True, 
            context={'request': request}
        )
        
        return Response({
            'candidates': serializer.data,
            'total_count': len(candidates),
            'search_criteria': validated_data
        })
    
    def _parse_experience_range(self, experience_str):
        """Parse experience range string to min and max years"""
        if '0-1' in experience_str:
            return 0, 1
        elif '1-3' in experience_str:
            return 1, 3
        elif '3-5' in experience_str:
            return 3, 5
        elif '5+' in experience_str:
            return 5, None
        return None, None
    
    def _parse_salary_range(self, salary_str):
        """Parse salary range string to min and max in lakhs"""
        if '0-3' in salary_str:
            return 0, 300000
        elif '3-6' in salary_str:
            return 300000, 600000
        elif '6-10' in salary_str:
            return 600000, 1000000
        elif '10-15' in salary_str:
            return 1000000, 1500000
        elif '15+' in salary_str:
            return 1500000, None
        return None, None
    
    def _apply_boolean_query(self, queryset, query):
        """Apply boolean search query to the queryset"""
        # Parse boolean query (simplified version)
        # Supports: AND, OR, NOT
        
        # Replace operators with Python operators
        query = query.replace(' AND ', ' & ')
        query = query.replace(' OR ', ' | ')
        query = query.replace(' NOT ', ' -')
        
        # Split into terms
        terms = re.findall(r'[&|]?\s*-?\s*"[^"]+"|[&|]?\s*-?\s*\S+', query)
        
        q_objects = Q()
        current_op = '&'  # Default to AND
        
        for term in terms:
            term = term.strip()
            
            # Determine operator
            if term.startswith('&'):
                current_op = '&'
                term = term[1:].strip()
            elif term.startswith('|'):
                current_op = '|'
                term = term[1:].strip()
            
            # Check for NOT
            is_not = term.startswith('-')
            if is_not:
                term = term[1:].strip()
            
            # Remove quotes
            term = term.strip('"')
            
            if not term:
                continue
            
            # Build Q object for this term
            term_q = (
                Q(key_skills__icontains=term) |
                Q(employee__current_designation__icontains=term) |
                Q(employee__current_position__icontains=term) |
                Q(department__icontains=term) |
                Q(industry__icontains=term) |
                Q(employee__skills__name__icontains=term)
            )
            
            if is_not:
                term_q = ~term_q
            
            # Combine with previous Q objects
            if not q_objects:
                q_objects = term_q
            elif current_op == '&':
                q_objects = q_objects & term_q
            else:  # OR
                q_objects = q_objects | term_q
        
        if q_objects:
            queryset = queryset.filter(q_objects).distinct()
        
        return queryset
    
    def _calculate_match_scores(self, queryset, criteria):
        """Calculate match scores for candidates based on criteria"""
        # This is a simplified scoring system
        # In production, you'd want a more sophisticated algorithm
        
        for candidate in queryset:
            score = 70  # Base score
            
            # Location match
            if criteria.get('location'):
                if criteria['location'].lower() in candidate.employee.location.lower():
                    score += 10
                elif criteria['location'].lower() in candidate.preferred_location.lower():
                    score += 5
            
            # Department exact match
            if criteria.get('department'):
                if candidate.department.lower() == criteria['department'].lower():
                    score += 10
            
            # Actively looking bonus
            if candidate.actively_looking:
                score += 5
            
            # Recent activity bonus
            if candidate.last_active:
                days_since_active = (timezone.now() - candidate.last_active).days
                if days_since_active < 7:
                    score += 5
                elif days_since_active < 30:
                    score += 2
            
            # Cap score at 100
            candidate.match_score = min(score, 100)
            candidate.save(update_fields=['match_score'])
        
        return queryset


class JobViewCountUpdateView(APIView):
    """Update view count for a specific job"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            job = Job.objects.get(pk=pk, employer=employer_profile)

            job.views_count = F('views_count') + 1
            job.save(update_fields=['views_count'])

            return Response({
                'message': 'View count updated successfully',
                'job': JobSerializer(job).data
            })
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({
                'error': 'Job not found'
            }, status=status.HTTP_404_NOT_FOUND)


# ===== INTERVIEW SCHEDULER VIEWS =====

class CandidateListCreateView(generics.ListCreateAPIView):
    """List and create candidates for interview scheduling"""
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = Candidate.objects.filter(employer=employer_profile).order_by('-created_at')
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search) |
                    Q(email__icontains=search) |
                    Q(current_position__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Candidate.objects.none()

    def perform_create(self, serializer):
        employer_profile = EmployerProfile.objects.get(user=self.request.user)
        serializer.save(employer=employer_profile)


class CandidateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a candidate"""
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return Candidate.objects.filter(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return Candidate.objects.none()


class InterviewerListCreateView(generics.ListCreateAPIView):
    """List and create interviewers"""
    serializer_class = InterviewerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = Interviewer.objects.filter(employer=employer_profile, is_active=True).order_by('name')
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search) |
                    Q(designation__icontains=search) |
                    Q(department__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Interviewer.objects.none()

    def perform_create(self, serializer):
        employer_profile = EmployerProfile.objects.get(user=self.request.user)
        serializer.save(employer=employer_profile)


class InterviewerDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an interviewer"""
    serializer_class = InterviewerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return Interviewer.objects.filter(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return Interviewer.objects.none()


class InterviewListCreateView(generics.ListCreateAPIView):
    """List and create interviews"""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InterviewSerializer
        return InterviewListSerializer

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = Interview.objects.filter(employer=employer_profile).select_related(
                'candidate', 'job_position'
            ).prefetch_related('interviewers').order_by('interview_date', 'interview_time')
            
            # Filter by status
            status_filter = self.request.query_params.get('status', None)
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            # Filter by date range
            start_date = self.request.query_params.get('start_date', None)
            end_date = self.request.query_params.get('end_date', None)
            if start_date:
                queryset = queryset.filter(interview_date__gte=start_date)
            if end_date:
                queryset = queryset.filter(interview_date__lte=end_date)
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(candidate__name__icontains=search) |
                    Q(job_position__title__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return Interview.objects.none()

    def perform_create(self, serializer):
        employer_profile = EmployerProfile.objects.get(user=self.request.user)
        interview = serializer.save(employer=employer_profile)
        
        # Generate meeting link for video interviews
        if interview.interview_type == 'video':
            interview.generate_meeting_link()


class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an interview"""
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return Interview.objects.filter(employer=employer_profile).select_related(
                'candidate', 'job_position'
            ).prefetch_related('interviewers', 'notes__interviewer')
        except EmployerProfile.DoesNotExist:
            return Interview.objects.none()


class InterviewStatusUpdateView(APIView):
    """Update interview status"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            interview = Interview.objects.get(pk=pk, employer=employer_profile)
            
            new_status = request.data.get('status')
            if not new_status:
                return Response({
                    'error': 'Status is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate status
            valid_statuses = [choice[0] for choice in Interview.STATUS_CHOICES]
            if new_status not in valid_statuses:
                return Response({
                    'error': f'Invalid status. Must be one of: {valid_statuses}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            interview.status = new_status
            interview.save(update_fields=['status', 'updated_at'])
            
            return Response({
                'message': 'Interview status updated successfully',
                'interview': InterviewSerializer(interview).data
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Interview.DoesNotExist:
            return Response({
                'error': 'Interview not found'
            }, status=status.HTTP_404_NOT_FOUND)


class InterviewRescheduleView(APIView):
    """Reschedule an interview"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            interview = Interview.objects.get(pk=pk, employer=employer_profile)
            
            new_date = request.data.get('interview_date')
            new_time = request.data.get('interview_time')
            
            if not new_date or not new_time:
                return Response({
                    'error': 'Both interview_date and interview_time are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            interview.interview_date = new_date
            interview.interview_time = new_time
            interview.status = 'rescheduled'
            interview.save(update_fields=['interview_date', 'interview_time', 'status', 'updated_at'])
            
            return Response({
                'message': 'Interview rescheduled successfully',
                'interview': InterviewSerializer(interview).data
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Interview.DoesNotExist:
            return Response({
                'error': 'Interview not found'
            }, status=status.HTTP_404_NOT_FOUND)


class InterviewNotesView(generics.ListCreateAPIView):
    """List and create interview notes"""
    serializer_class = InterviewNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        interview_id = self.kwargs.get('interview_id')
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            # Verify the interview belongs to this employer
            interview = Interview.objects.get(pk=interview_id, employer=employer_profile)
            return InterviewNote.objects.filter(interview=interview).select_related('interviewer')
        except (EmployerProfile.DoesNotExist, Interview.DoesNotExist):
            return InterviewNote.objects.none()

    def perform_create(self, serializer):
        interview_id = self.kwargs.get('interview_id')
        interview = Interview.objects.get(pk=interview_id)
        serializer.save(interview=interview)


class InterviewTimeSlotView(generics.ListCreateAPIView):
    """List and create interview time slots"""
    serializer_class = InterviewTimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            
            # Get time slots for this employer's interviewers
            queryset = InterviewTimeSlot.objects.filter(
                interviewer__employer=employer_profile
            ).select_related('interviewer')
            
            # Filter by date range
            start_date = self.request.query_params.get('start_date', None)
            end_date = self.request.query_params.get('end_date', None)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
            
            # Filter by interviewer
            interviewer_id = self.request.query_params.get('interviewer', None)
            if interviewer_id:
                queryset = queryset.filter(interviewer_id=interviewer_id)
            
            # Filter available slots only
            available_only = self.request.query_params.get('available_only', 'false')
            if available_only.lower() == 'true':
                queryset = queryset.filter(is_available=True, is_blocked=False)
            
            return queryset.order_by('date', 'start_time')
            
        except EmployerProfile.DoesNotExist:
            return InterviewTimeSlot.objects.none()


class InterviewDashboardView(APIView):
    """Get interview dashboard data"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            today = timezone.now().date()
            
            # Get interview statistics
            interviews = Interview.objects.filter(employer=employer_profile)
            
            # Today's interviews
            todays_interviews = interviews.filter(interview_date=today)
            
            # Upcoming interviews (next 7 days)
            upcoming_interviews = interviews.filter(
                interview_date__gt=today,
                interview_date__lte=today + timezone.timedelta(days=7),
                status='scheduled'
            )
            
            # Statistics by status
            stats = {
                'total_interviews': interviews.count(),
                'scheduled': interviews.filter(status='scheduled').count(),
                'completed': interviews.filter(status='completed').count(),
                'in_progress': interviews.filter(status='in_progress').count(),
                'cancelled': interviews.filter(status='cancelled').count(),
                'todays_count': todays_interviews.count(),
                'upcoming_count': upcoming_interviews.count(),
            }
            
            # Recent interviews
            recent_interviews = interviews.select_related(
                'candidate', 'job_position'
            ).prefetch_related('interviewers').order_by('-created_at')[:5]
            
            # Live interview (currently in progress)
            live_interview = interviews.filter(
                status='in_progress',
                interview_date=today
            ).first()
            
            return Response({
                'statistics': stats,
                'todays_interviews': InterviewListSerializer(todays_interviews, many=True).data,
                'upcoming_interviews': InterviewListSerializer(upcoming_interviews, many=True).data,
                'recent_interviews': InterviewListSerializer(recent_interviews, many=True).data,
                'live_interview': InterviewSerializer(live_interview).data if live_interview else None,
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


# =====================================
# PROXY DETECTION VIEWS
# =====================================

class ProxyScanListCreateView(generics.ListCreateAPIView):
    """List proxy scans and create new scans"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProxyScanRequestSerializer
        return ProxyScanSessionListSerializer
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = ProxyScanSession.objects.filter(employer=employer_profile).select_related(
                'candidate', 'interview'
            ).prefetch_related('alerts').order_by('-started_at')
            
            # Filter by status
            status_filter = self.request.query_params.get('status', None)
            if status_filter:
                queryset = queryset.filter(scan_status=status_filter)
            
            # Filter by risk level
            risk_filter = self.request.query_params.get('risk_level', None)
            if risk_filter:
                queryset = queryset.filter(risk_level=risk_filter)
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(ip_address__icontains=search) |
                    Q(candidate__name__icontains=search) |
                    Q(country__icontains=search) |
                    Q(city__icontains=search)
                )
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return ProxyScanSession.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Create a new proxy scan"""
        from .proxy_detection_service import ProxyDetectionService
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            # Get client IP if not provided
            ip_address = serializer.validated_data.get('ip_address')
            if not ip_address:
                ip_address = self._get_client_ip(request)
                if not ip_address:
                    return Response({
                        'error': 'Could not determine IP address'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Start proxy scan
            service = ProxyDetectionService()
            scan_session = service.scan_ip(
                ip_address=ip_address,
                employer_id=employer_profile.id,
                candidate_id=serializer.validated_data.get('candidate_id'),
                interview_id=serializer.validated_data.get('interview_id'),
                user_agent=serializer.validated_data.get('user_agent', '')
            )
            
            return Response(
                ProxyScanSessionSerializer(scan_session).data,
                status=status.HTTP_201_CREATED
            )
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({
                'error': f'Invalid request: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': f'Scan failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
        
        # For development, use a test IP if localhost
        if ip in ['127.0.0.1', '::1', 'localhost']:
            ip = '8.8.8.8'  # Use Google DNS for testing
        
        return ip


class ProxyScanDetailView(generics.RetrieveAPIView):
    """Retrieve detailed proxy scan results"""
    serializer_class = ProxyScanSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return ProxyScanSession.objects.filter(employer=employer_profile).select_related(
                'candidate', 'interview'
            ).prefetch_related('alerts')
        except EmployerProfile.DoesNotExist:
            return ProxyScanSession.objects.none()


class ProxyScanStatisticsView(APIView):
    """Get proxy detection statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            from .proxy_detection_service import ProxyDetectionService
            
            employer_profile = EmployerProfile.objects.get(user=request.user)
            days = int(request.query_params.get('days', 30))
            
            service = ProxyDetectionService()
            stats = service.get_scan_statistics(employer_profile.id, days)
            
            serializer = ProxyStatisticsSerializer(stats)
            return Response(serializer.data)
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({
                'error': 'Invalid days parameter'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProxyDetectionRuleListCreateView(generics.ListCreateAPIView):
    """List and create proxy detection rules"""
    serializer_class = ProxyDetectionRuleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return ProxyDetectionRule.objects.filter(employer=employer_profile).order_by('name')
        except EmployerProfile.DoesNotExist:
            return ProxyDetectionRule.objects.none()
    
    def perform_create(self, serializer):
        employer_profile = EmployerProfile.objects.get(user=self.request.user)
        serializer.save(employer=employer_profile)


class ProxyDetectionRuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a proxy detection rule"""
    serializer_class = ProxyDetectionRuleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return ProxyDetectionRule.objects.filter(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return ProxyDetectionRule.objects.none()


class ProxyAlertListView(generics.ListAPIView):
    """List proxy detection alerts"""
    serializer_class = ProxyAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = ProxyAlert.objects.filter(
                scan_session__employer=employer_profile
            ).select_related('scan_session').order_by('-created_at')
            
            # Filter by severity
            severity = self.request.query_params.get('severity', None)
            if severity:
                queryset = queryset.filter(severity=severity)
            
            # Filter by resolved status
            resolved = self.request.query_params.get('resolved', None)
            if resolved is not None:
                is_resolved = resolved.lower() == 'true'
                queryset = queryset.filter(is_resolved=is_resolved)
            
            return queryset
        except EmployerProfile.DoesNotExist:
            return ProxyAlert.objects.none()


class ProxyAlertResolveView(APIView):
    """Resolve a proxy alert"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, alert_id):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            alert = ProxyAlert.objects.get(
                id=alert_id,
                scan_session__employer=employer_profile
            )
            
            alert.is_resolved = True
            alert.resolved_by = request.user
            alert.resolved_at = timezone.now()
            alert.save()
            
            return Response({
                'message': 'Alert resolved successfully'
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except ProxyAlert.DoesNotExist:
            return Response({
                'error': 'Alert not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ProxyDashboardView(APIView):
    """Get proxy detection dashboard data"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            from .proxy_detection_service import ProxyDetectionService
            from django.utils import timezone
            from datetime import timedelta
            
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            # Get recent scans
            recent_scans = ProxyScanSession.objects.filter(
                employer=employer_profile
            ).select_related('candidate').order_by('-started_at')[:10]
            
            # Get active alerts
            active_alerts = ProxyAlert.objects.filter(
                scan_session__employer=employer_profile,
                is_resolved=False
            ).order_by('-created_at')[:10]
            
            # Get statistics
            service = ProxyDetectionService()
            stats = service.get_scan_statistics(employer_profile.id, 30)
            
            # Get risk distribution
            risk_distribution = ProxyScanSession.objects.filter(
                employer=employer_profile
            ).values('risk_level').annotate(count=Count('id'))
            
            # Get top countries
            top_countries = ProxyScanSession.objects.filter(
                employer=employer_profile
            ).exclude(country='').values('country').annotate(
                count=Count('id')
            ).order_by('-count')[:5]
            
            return Response({
                'statistics': stats,
                'recent_scans': ProxyScanSessionListSerializer(recent_scans, many=True).data,
                'active_alerts': ProxyAlertSerializer(active_alerts, many=True).data,
                'risk_distribution': list(risk_distribution),
                'top_countries': list(top_countries),
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


# ============= INTERVIEW FEEDBACK VIEWS =============

class InterviewFeedbackListCreateView(generics.ListCreateAPIView):
    """List all feedbacks or create new feedback"""
    serializer_class = InterviewFeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            queryset = InterviewFeedback.objects.filter(
                employer=employer_profile
            ).select_related(
                'candidate', 'interviewer', 'interview'
            ).order_by('-interview_date', '-created_at')
            
            # Filter by status
            status_filter = self.request.query_params.get('status', None)
            if status_filter:
                queryset = queryset.filter(interview_status=status_filter)
            
            # Filter by submitted status
            submitted = self.request.query_params.get('submitted', None)
            if submitted is not None:
                is_submitted = submitted.lower() == 'true'
                queryset = queryset.filter(is_submitted=is_submitted)
            
            # Filter by date range
            date_from = self.request.query_params.get('date_from', None)
            date_to = self.request.query_params.get('date_to', None)
            if date_from:
                queryset = queryset.filter(interview_date__gte=date_from)
            if date_to:
                queryset = queryset.filter(interview_date__lte=date_to)
            
            # Search functionality
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(candidate_name__icontains=search) |
                    Q(position_applied__icontains=search) |
                    Q(department__icontains=search)
                )
            
            return queryset
            
        except EmployerProfile.DoesNotExist:
            return InterviewFeedback.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InterviewFeedbackCreateSerializer
        elif self.request.query_params.get('format') == 'list':
            return InterviewFeedbackListSerializer
        return InterviewFeedbackSerializer
    
    def perform_create(self, serializer):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            serializer.save(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            raise ValidationError("Employer profile not found")


class InterviewFeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete feedback"""
    serializer_class = InterviewFeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return InterviewFeedback.objects.filter(
                employer=employer_profile
            ).select_related('candidate', 'interviewer', 'interview')
        except EmployerProfile.DoesNotExist:
            return InterviewFeedback.objects.none()


class FeedbackSummaryView(APIView):
    """Get feedback summary and statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            # Get date range (default last 30 days)
            days = int(request.query_params.get('days', 30))
            date_from = timezone.now().date() - timedelta(days=days)
            
            feedbacks = InterviewFeedback.objects.filter(
                employer=employer_profile,
                interview_date__gte=date_from
            )
            
            # Calculate statistics
            total_feedbacks = feedbacks.count()
            submitted_feedbacks = feedbacks.filter(is_submitted=True).count()
            pending_feedbacks = total_feedbacks - submitted_feedbacks
            
            # Count by status
            status_counts = feedbacks.filter(is_submitted=True).values(
                'interview_status'
            ).annotate(count=Count('id'))
            
            feedback_by_status = {item['interview_status']: item['count'] for item in status_counts}
            selected_candidates = feedback_by_status.get('selected', 0)
            rejected_candidates = feedback_by_status.get('rejected', 0)
            
            # Calculate average rating
            avg_rating = feedbacks.filter(
                is_submitted=True,
                overall_rating__isnull=False
            ).aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0
            
            # Completion rate
            completion_rate = (submitted_feedbacks / total_feedbacks * 100) if total_feedbacks > 0 else 0
            
            # Recent feedbacks
            recent_feedbacks = feedbacks.order_by('-created_at')[:5]
            
            summary_data = {
                'total_feedbacks': total_feedbacks,
                'submitted_feedbacks': submitted_feedbacks,
                'pending_feedbacks': pending_feedbacks,
                'selected_candidates': selected_candidates,
                'rejected_candidates': rejected_candidates,
                'average_overall_rating': round(avg_rating, 2),
                'completion_rate': round(completion_rate, 2),
                'feedback_by_status': feedback_by_status,
                'recent_feedbacks': recent_feedbacks
            }
            
            serializer = FeedbackSummarySerializer(summary_data)
            return Response(serializer.data)
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class CandidateFeedbackView(APIView):
    """Get all feedback for a specific candidate"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, candidate_id):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            feedbacks = InterviewFeedback.objects.filter(
                employer=employer_profile,
                candidate_id=candidate_id,
                is_submitted=True
            ).select_related('interviewer').order_by('-interview_date')
            
            if not feedbacks.exists():
                return Response({
                    'error': 'No feedback found for this candidate'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = CandidateFeedbackSerializer(feedbacks, many=True)
            
            # Calculate aggregate data
            avg_ratings = feedbacks.aggregate(
                avg_overall=Avg('overall_rating'),
                avg_skills=Avg('skills_rating'),
                avg_communication=Avg('communication_rating'),
                avg_technical=Avg('technical_rating'),
                avg_culture_fit=Avg('culture_fit_rating')
            )
            
            # Get candidate info
            candidate = feedbacks.first().candidate
            
            return Response({
                'candidate': CandidateSerializer(candidate).data,
                'feedbacks': serializer.data,
                'aggregate_ratings': {
                    'overall': round(avg_ratings['avg_overall'] or 0, 2),
                    'skills': round(avg_ratings['avg_skills'] or 0, 2),
                    'communication': round(avg_ratings['avg_communication'] or 0, 2),
                    'technical': round(avg_ratings['avg_technical'] or 0, 2),
                    'culture_fit': round(avg_ratings['avg_culture_fit'] or 0, 2),
                },
                'total_interviews': feedbacks.count()
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class FeedbackTemplateListCreateView(generics.ListCreateAPIView):
    """List all feedback templates or create new template"""
    serializer_class = FeedbackTemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return FeedbackTemplate.objects.filter(
                employer=employer_profile,
                is_active=True
            ).order_by('-is_default', 'name')
        except EmployerProfile.DoesNotExist:
            return FeedbackTemplate.objects.none()
    
    def perform_create(self, serializer):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            serializer.save(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            raise ValidationError("Employer profile not found")


class FeedbackTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete feedback template"""
    serializer_class = FeedbackTemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            return FeedbackTemplate.objects.filter(employer=employer_profile)
        except EmployerProfile.DoesNotExist:
            return FeedbackTemplate.objects.none()


class PendingFeedbackView(APIView):
    """Get pending feedback list for quick actions"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            # Get pending feedbacks (not submitted or incomplete)
            pending_feedbacks = InterviewFeedback.objects.filter(
                employer=employer_profile,
                is_submitted=False
            ).select_related('candidate', 'interviewer', 'interview').order_by('interview_date')
            
            # Get overdue feedbacks (interview date > 7 days ago)
            overdue_date = timezone.now().date() - timedelta(days=7)
            overdue_feedbacks = pending_feedbacks.filter(interview_date__lt=overdue_date)
            
            # Group by interviewer
            interviewer_pending = {}
            for feedback in pending_feedbacks:
                interviewer_name = feedback.interviewer.name
                if interviewer_name not in interviewer_pending:
                    interviewer_pending[interviewer_name] = []
                interviewer_pending[interviewer_name].append({
                    'id': feedback.id,
                    'candidate_name': feedback.candidate_name,
                    'position': feedback.position_applied,
                    'interview_date': feedback.interview_date,
                    'completion_percentage': feedback.feedback_completion_percentage
                })
            
            return Response({
                'total_pending': pending_feedbacks.count(),
                'overdue_count': overdue_feedbacks.count(),
                'pending_by_interviewer': interviewer_pending,
                'recent_pending': InterviewFeedbackListSerializer(pending_feedbacks[:10], many=True).data
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class SubmitFeedbackView(APIView):
    """Submit feedback and mark as complete"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, feedback_id):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            feedback = InterviewFeedback.objects.get(
                id=feedback_id,
                employer=employer_profile
            )
            
            # Check if already submitted
            if feedback.is_submitted:
                return Response({
                    'error': 'Feedback already submitted'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate required fields
            required_fields = ['skills_assessment', 'behavior_assessment', 'technical_skills', 'interview_status']
            missing_fields = []
            
            for field in required_fields:
                if not getattr(feedback, field):
                    missing_fields.append(field)
            
            if missing_fields:
                return Response({
                    'error': 'Missing required fields',
                    'missing_fields': missing_fields
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Submit feedback
            feedback.is_submitted = True
            feedback.submitted_at = timezone.now()
            feedback.save()
            
            return Response({
                'message': 'Feedback submitted successfully',
                'feedback': InterviewFeedbackSerializer(feedback).data
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except InterviewFeedback.DoesNotExist:
            return Response({
                'error': 'Feedback not found'
            }, status=status.HTTP_404_NOT_FOUND)


class UpdateEmployerNamesView(APIView):
    """Update employer and company names with 30-day restriction"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            employer_name = request.data.get('employer_name')
            company_name = request.data.get('company_name')
            
            if not employer_name and not company_name:
                return Response({
                    'error': 'Either employer_name or company_name must be provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if names can be changed
            can_change, next_date = employer_profile.can_change_names()
            if not can_change:
                return Response({
                    'error': 'Names can only be changed once every 30 days',
                    'next_allowed_date': next_date.isoformat(),
                    'next_allowed_date_formatted': next_date.strftime('%B %d, %Y')
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Update names
            try:
                employer_profile.update_names(employer_name, company_name)
                return Response({
                    'message': 'Names updated successfully',
                    'employer_name': employer_profile.employer_name,
                    'company_name': employer_profile.company_name,
                    'next_change_allowed': (timezone.now() + timedelta(days=30)).isoformat()
                })
            except ValueError as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_403_FORBIDDEN)
                
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ToggleActivationStatusView(APIView):
    """Toggle company activation status - Employer only"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Check if user is an employer
            employer_profile = EmployerProfile.objects.get(user=request.user)
            
            # Toggle activation status
            employer_profile.is_active = not employer_profile.is_active
            employer_profile.save()
            
            return Response({
                'message': f'Company {"activated" if employer_profile.is_active else "deactivated"} successfully',
                'is_active': employer_profile.is_active
            })
            
        except EmployerProfile.DoesNotExist:
            return Response({
                'error': 'Permission denied. Only employers can change activation status.'
            }, status=status.HTTP_403_FORBIDDEN)


class NotificationListView(APIView):
    """Get user notifications with real-time support"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)[:20]
        unread_count = notifications.filter(is_read=False).count()
        
        notification_data = []
        for notification in notifications:
            notification_data.append({
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'sender': notification.sender.get_full_name() if notification.sender else 'System',
                'is_read': notification.is_read,
                'created_at': notification.created_at.isoformat(),
                'time_ago': self.get_time_ago(notification.created_at)
            })
        
        return Response({
            'notifications': notification_data,
            'unread_count': unread_count
        })
    
    def get_time_ago(self, created_at):
        """Calculate time ago string"""
        now = timezone.now()
        diff = now - created_at
        
        if diff.days > 0:
            return f"{diff.days}d ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours}h ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes}m ago"
        else:
            return "Just now"


class MarkNotificationReadView(APIView):
    """Mark notification as read"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, recipient=request.user)
            notification.mark_as_read()
            
            return Response({'message': 'Notification marked as read'})
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)


class MessageListView(APIView):
    """Get user messages"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        messages = Message.objects.filter(recipient=request.user)[:20]
        unread_count = messages.filter(is_read=False).count()
        
        message_data = []
        for message in messages:
            message_data.append({
                'id': message.id,
                'subject': message.subject,
                'content': message.content[:100] + '...' if len(message.content) > 100 else message.content,
                'sender': message.sender.get_full_name(),
                'is_read': message.is_read,
                'created_at': message.created_at.isoformat(),
                'time_ago': self.get_time_ago(message.created_at)
            })
        
        return Response({
            'messages': message_data,
            'unread_count': unread_count
        })
    
    def get_time_ago(self, created_at):
        """Calculate time ago string"""
        now = timezone.now()
        diff = now - created_at
        
        if diff.days > 0:
            return f"{diff.days}d ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours}h ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes}m ago"
        else:
            return "Just now"
