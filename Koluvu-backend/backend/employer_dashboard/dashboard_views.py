"""
Dashboard views for employer statistics and company profile
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
import logging

from .models import EmployerProfile, Job, JobApplication, Message
from .serializers import EmployerProfileSerializer

logger = logging.getLogger(__name__)


class DashboardStatsView(APIView):
    """Get employer dashboard statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            logger.info(f"Dashboard stats requested by user: {request.user.id}")
            
            # Get employer profile
            employer_profile = get_object_or_404(EmployerProfile, user=request.user)
            logger.info(f"Found employer profile: {employer_profile.company_name}")
            
            # Get current date for filtering
            now = timezone.now()
            today = now.date()
            week_ago = now - timedelta(days=7)
            month_ago = now - timedelta(days=30)
            
            # Calculate stats with error handling
            try:
                active_jobs_count = Job.objects.filter(employer=employer_profile, status='active').count()
            except Exception as e:
                logger.error(f"Error counting active jobs: {e}")
                active_jobs_count = 0
                
            try:
                total_applications_count = JobApplication.objects.filter(job__employer=employer_profile).count()
            except Exception as e:
                logger.error(f"Error counting total applications: {e}")
                total_applications_count = 0
                
            try:
                pending_applications_count = JobApplication.objects.filter(
                    job__employer=employer_profile, 
                    status='pending'
                ).count()
            except Exception as e:
                logger.error(f"Error counting pending applications: {e}")
                pending_applications_count = 0
            
            # Today's views - simplified
            try:
                today_views_count = Job.objects.filter(
                    employer=employer_profile, 
                    created_at__date=today
                ).count()
            except Exception as e:
                logger.error(f"Error counting today's views: {e}")
                today_views_count = 0
            
            # Weekly stats
            try:
                weekly_applications = JobApplication.objects.filter(
                    job__employer=employer_profile,
                    applied_at__gte=week_ago
                ).count()
            except Exception as e:
                logger.error(f"Error counting weekly applications: {e}")
                weekly_applications = 0
            
            # Monthly stats
            try:
                monthly_applications = JobApplication.objects.filter(
                    job__employer=employer_profile,
                    applied_at__gte=month_ago
                ).count()
            except Exception as e:
                logger.error(f"Error counting monthly applications: {e}")
                monthly_applications = 0
            
            # Unread messages count
            try:
                unread_messages_count = Message.objects.filter(
                    recipient=request.user,
                    is_read=False
                ).count()
            except Exception as e:
                logger.error(f"Error counting unread messages: {e}")
                unread_messages_count = 0
            
            response_data = {
                'active_jobs_count': active_jobs_count,
                'total_applications_count': total_applications_count,
                'pending_applications_count': pending_applications_count,
                'today_views_count': today_views_count,
                'weekly_applications_count': weekly_applications,
                'monthly_applications_count': monthly_applications,
                'unread_messages_count': unread_messages_count,
                'company_name': employer_profile.company_name or 'Unknown Company',
                'profile_completion': self.calculate_profile_completion(employer_profile),
            }
            
            logger.info(f"Dashboard stats response: {response_data}")
            return Response(response_data)
            
        except EmployerProfile.DoesNotExist:
            logger.error(f"Employer profile not found for user: {request.user.id}")
            return Response({
                'error': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in dashboard stats: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def calculate_profile_completion(self, profile):
        """Calculate profile completion percentage"""
        fields_to_check = [
            'company_name', 'company_description', 'industry_type',
            'company_size', 'company_location', 'website_url',
            'company_logo', 'profile_picture_url'
        ]
        
        completed_fields = 0
        for field in fields_to_check:
            if getattr(profile, field, None):
                completed_fields += 1
        
        return round((completed_fields / len(fields_to_check)) * 100)


class CompanyProfileView(APIView):
    """Get company profile information"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            employer_profile = get_object_or_404(EmployerProfile, user=request.user)
            serializer = EmployerProfileSerializer(employer_profile)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except EmployerProfile.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Company profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        try:
            employer_profile = get_object_or_404(EmployerProfile, user=request.user)
            serializer = EmployerProfileSerializer(employer_profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Company profile updated successfully',
                    'data': serializer.data
                })
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except EmployerProfile.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Company profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)