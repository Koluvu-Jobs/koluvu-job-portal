from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import EmployeeProfile, Education, Experience, Skill, Resume, ResumeTemplate, ResumeSharingLink
from .serializers import (
    EmployeeProfileSerializer, UserRegistrationSerializer, EducationSerializer, ExperienceSerializer,
    SkillSerializer, ResumeSerializer
)
# Import username-based profile views
from .username_profile_views import (
    EmployeeProfileView, UsernameBasedEmployeeProfileView, 
    UsernameBasedEmployeeProfileUpdateView, UsernameBasedEmployeeProfilePictureUploadView,
    RegisterEmployeeView, EmployeeLoginView
)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    """Get comprehensive dashboard data for employee"""
    try:
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'User not found', 'code': 'user_not_found'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get or create employee profile
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Serialize profile data
        profile_serializer = EmployeeProfileSerializer(profile)
        
        # Get additional data
        education = Education.objects.filter(employee=profile)
        experience = Experience.objects.filter(employee=profile)
        skills = Skill.objects.filter(employee=profile)
        resumes = Resume.objects.filter(employee=profile)
        
        # Calculate profile completion percentage
        profile_fields = [
            profile.phone_number, profile.location, profile.bio,
            profile.current_designation, profile.linkedin_url
        ]
        completed_fields = sum(1 for field in profile_fields if field)
        profile_completion = int((completed_fields / len(profile_fields)) * 100)
        
        # Get social account info (Google OAuth data) - safely handle if social accounts don't exist
        social_account = None
        try:
            social_account = request.user.social_accounts.filter(provider='google').first()
        except AttributeError:
            # social_accounts relation might not be set up yet
            pass
        
        # Calculate real stats from database
        # TODO: Implement job application tracking model to get real application count
        applications_count = 0  # Will be dynamic when job application model is added
        interviews_count = 0    # Will be dynamic when interview scheduling is added
        profile_views_count = 0  # Will be dynamic when profile view tracking is added
        
        dashboard_data = {
            'user': profile_serializer.data,
            'profile_completion': profile_completion,
            'stats': {
                'applications': applications_count,
                'interviews': interviews_count,
                'profile_views': profile_views_count,
            },
            'education_count': education.count(),
            'experience_count': experience.count(),
            'skills_count': skills.count(),
            'resumes_count': resumes.count(),
            'social_account': {
                'provider': social_account.provider if social_account else None,
                'profile_picture': social_account.profile_picture_url if social_account else None,
                'connected_at': social_account.created_at if social_account else None
            } if social_account else None,
            'onboarding_complete': profile.is_profile_complete,
            'needs_onboarding': not profile.is_profile_complete
        }
        
        return Response(dashboard_data)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch dashboard data: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class RegisterEmployeeView(generics.CreateAPIView):
    """Register a new employee with CAPTCHA verification"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # Allow unauthenticated access for registration
    
    def create(self, request, *args, **kwargs):
        """Custom create method with CAPTCHA verification, error handling and OTP cleanup"""
        # Log the received data for debugging
        import json
        print("=" * 50)
        print("REGISTRATION REQUEST RECEIVED")
        print("=" * 50)
        print("Request data:", json.dumps(request.data, indent=2, default=str))
        print("=" * 50)
        
        # CAPTCHA verification
        captcha_key = request.data.get('captcha_key')
        captcha_value = request.data.get('captcha_value')
        recaptcha_token = request.data.get('recaptcha_token')
        
        print(f"CAPTCHA Key: {captcha_key}")
        print(f"CAPTCHA Value: {captcha_value}")
        print(f"reCAPTCHA Token: {recaptcha_token}")
        print("=" * 50)
        
        # Note: CAPTCHA is already verified by frontend via /api/auth/captcha/verify/
        # We trust the frontend verification since it happens just before submission
        
        serializer = self.get_serializer(data=request.data)
        
        try:
            if not serializer.is_valid():
                # Clean up OTP sessions on validation failure
                email = request.data.get('email')
                if email:
                    from authentication.models import OTPSession
                    OTPSession.objects.filter(email=email).delete()
                    # Note: RegistrationCache model doesn't exist anymore
                
                return Response({
                    'success': False,
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Perform creation
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            
            # Clean up OTP sessions after successful registration
            email = request.data.get('email')
            if email:
                from authentication.models import OTPSession
                OTPSession.objects.filter(email=email).delete()
            
            return Response({
                'success': True,
                'message': 'Registration successful',
                'user': serializer.data
            }, status=status.HTTP_201_CREATED, headers=headers)
            
        except Exception as e:
            # Clean up OTP sessions on any error
            email = request.data.get('email')
            if email:
                from authentication.models import OTPSession
                OTPSession.objects.filter(email=email).delete()
            
            return Response({
                'success': False,
                'error': f'Registration failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeProfileView(generics.RetrieveUpdateAPIView):
    """Get and update employee profile"""
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def update(self, request, *args, **kwargs):
        """Custom update method with better error handling"""
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            
            if serializer.is_valid():
                self.perform_update(serializer)
                return Response({
                    'message': 'Profile updated successfully',
                    'profile': serializer.data
                })
            else:
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            import traceback
            print(f"Profile update error: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            
            return Response({
                'error': f'Failed to update profile: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeLoginView(generics.GenericAPIView):
    """Employee login view with JWT token support and CAPTCHA verification"""
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Note: CAPTCHA is already verified by frontend via /api/auth/captcha/verify/
        # We trust the frontend verification since it happens just before submission
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                # Get or create employee profile
                profile, created = EmployeeProfile.objects.get_or_create(user=user)
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                serializer = EmployeeProfileSerializer(profile)
                
                return Response({
                    'message': 'Login successful',
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'user': serializer.data,
                    'user_type': 'employee'
                })
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)


class EducationListCreateView(generics.ListCreateAPIView):
    """List and create education records"""
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Education.objects.filter(employee=profile)

    def perform_create(self, serializer):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        serializer.save(employee=profile)


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete education record"""
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Education.objects.filter(employee=profile)


class ExperienceListCreateView(generics.ListCreateAPIView):
    """List and create experience records"""
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Experience.objects.filter(employee=profile)

    def perform_create(self, serializer):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        serializer.save(employee=profile)


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete experience record"""
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Experience.objects.filter(employee=profile)


class SkillListCreateView(generics.ListCreateAPIView):
    """List and create skills"""
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Skill.objects.filter(employee=profile)

    def perform_create(self, serializer):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        serializer.save(employee=profile)


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete skill"""
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Skill.objects.filter(employee=profile)


class ResumeListCreateView(generics.ListCreateAPIView):
    """List and create resumes"""
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Resume.objects.filter(employee=profile)

    def perform_create(self, serializer):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        serializer.save(employee=profile)


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete resume"""
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Resume.objects.filter(employee=profile)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def complete_profile_data(request):
    """Get complete profile data including all related information"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Get all related data
        education = Education.objects.filter(employee=profile).order_by('-start_date')
        experience = Experience.objects.filter(employee=profile).order_by('-start_date')
        skills = Skill.objects.filter(employee=profile).order_by('name')
        resumes = Resume.objects.filter(employee=profile).order_by('-created_at')
        
        # Serialize all data
        profile_serializer = EmployeeProfileSerializer(profile)
        education_serializer = EducationSerializer(education, many=True)
        experience_serializer = ExperienceSerializer(experience, many=True)
        skills_serializer = SkillSerializer(skills, many=True)
        resumes_serializer = ResumeSerializer(resumes, many=True)
        
        # Calculate profile completion
        profile_fields = [
            profile.phone_number, profile.location, profile.bio,
            profile.current_designation, profile.linkedin_url,
            profile.github_url, profile.portfolio_url, profile.date_of_birth
        ]
        completed_fields = sum(1 for field in profile_fields if field)
        total_fields = len(profile_fields)
        
        # Add points for having education, experience, skills
        if education.exists():
            completed_fields += 1
            total_fields += 1
        if experience.exists():
            completed_fields += 1
            total_fields += 1
        if skills.exists():
            completed_fields += 1 
            total_fields += 1
        
        profile_completion = int((completed_fields / total_fields) * 100) if total_fields > 0 else 0
        
        # Get social account info
        social_accounts = []
        for provider in ['google', 'github', 'linkedin']:
            social_account = request.user.social_accounts.filter(provider=provider).first()
            if social_account:
                social_accounts.append({
                    'provider': social_account.provider,
                    'email': social_account.email,
                    'profile_picture_url': social_account.profile_picture_url,
                    'connected_at': social_account.created_at
                })
        
        return Response({
            'profile': profile_serializer.data,
            'education': education_serializer.data,
            'experience': experience_serializer.data,
            'skills': skills_serializer.data,
            'resumes': resumes_serializer.data,
            'social_accounts': social_accounts,
            'profile_completion': profile_completion,
            'stats': {
                'education_count': education.count(),
                'experience_count': experience.count(),
                'skills_count': skills.count(),
                'resumes_count': resumes.count(),
                'years_of_experience': profile.experience_years or 0,
                'applications': 0,  # This can be calculated based on job applications
                'profile_views': 0  # This can be tracked separately
            }
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch profile data: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT', 'PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_basic_info(request):
    """Update basic profile information"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Validate and update user fields
        user_fields = ['first_name', 'last_name', 'email']
        user_updated = False
        
        # Check for email uniqueness before updating
        if 'email' in request.data:
            email = request.data['email']
            if User.objects.filter(email=email).exclude(id=request.user.id).exists():
                return Response(
                    {'error': 'This email is already registered with another account'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        for field in user_fields:
            if field in request.data:
                value = request.data[field]
                # Basic validation
                if field == 'email' and value:
                    from django.core.validators import validate_email
                    from django.core.exceptions import ValidationError
                    try:
                        validate_email(value)
                    except ValidationError:
                        return Response(
                            {'error': 'Invalid email format'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                setattr(request.user, field, value)
                user_updated = True
        
        if user_updated:
            request.user.full_clean()  # Validate before saving
            request.user.save()
        
        # Update profile fields
        profile_fields = [
            'phone_number', 'date_of_birth', 'location', 'bio',
            'current_designation', 'experience_years', 'expected_salary',
            'linkedin_url', 'github_url', 'portfolio_url', 'is_job_seeker'
        ]
        
        for field in profile_fields:
            if field in request.data:
                value = request.data[field]
                
                # Handle date_of_birth validation
                if field == 'date_of_birth' and value:
                    from datetime import datetime
                    try:
                        if isinstance(value, str):
                            # Try different date formats
                            for fmt in ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y']:
                                try:
                                    datetime.strptime(value, fmt)
                                    break
                                except ValueError:
                                    continue
                            else:
                                return Response(
                                    {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                                    status=status.HTTP_400_BAD_REQUEST
                                )
                    except (ValueError, TypeError):
                        return Response(
                            {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                # Handle numeric fields
                if field == 'experience_years' and value is not None:
                    try:
                        value = int(value)
                        if value < 0:
                            return Response(
                                {'error': 'Experience years cannot be negative'}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except (ValueError, TypeError):
                        return Response(
                            {'error': 'Experience years must be a number'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                if field == 'expected_salary' and value is not None:
                    try:
                        value = float(value)
                        if value < 0:
                            return Response(
                                {'error': 'Expected salary cannot be negative'}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except (ValueError, TypeError):
                        return Response(
                            {'error': 'Expected salary must be a number'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                setattr(profile, field, value)
        
        profile.full_clean()  # Validate before saving
        profile.save()
        
        serializer = EmployeeProfileSerializer(profile)
        return Response({
            'message': 'Profile updated successfully',
            'profile': serializer.data
        })
        
    except ValidationError as e:
        return Response(
            {'error': f'Validation error: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        # Log the full error for debugging
        import traceback
        print(f"Profile update error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        return Response(
            {'error': f'Failed to update profile. Error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """Upload profile picture"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        if 'profile_picture' in request.FILES:
            profile.image_field_picture = request.FILES['profile_picture']
            profile.save()
            
            return Response({
                'message': 'Profile picture uploaded successfully',
                'profile_picture_url': profile.image_field_picture.url if profile.image_field_picture else None
            })
        
        return Response(
            {'error': 'No profile picture provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    except Exception as e:
        return Response(
            {'error': f'Failed to upload profile picture: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_picture(request):
    """Delete profile picture"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        if profile.image_field_picture:
            profile.image_field_picture.delete()
            profile.save()
        
        return Response({'message': 'Profile picture deleted successfully'})
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete profile picture: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def upload_background_image(request):
    """Upload background image"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        if 'background_image' in request.FILES:
            profile.background_image = request.FILES['background_image']
            profile.save()
            
            return Response({
                'message': 'Background image uploaded successfully',
                'background_image_url': profile.background_image.url if profile.background_image else None
            })
        
        return Response(
            {'error': 'No background image provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    except Exception as e:
        return Response(
            {'error': f'Failed to upload background image: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_background_image(request):
    """Delete background image"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        if profile.background_image:
            profile.background_image.delete()
            profile.save()
        
        return Response({'message': 'Background image deleted successfully'})
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete background image: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_add_skills(request):
    """Add multiple skills at once"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        skills_data = request.data.get('skills', [])
        
        if not isinstance(skills_data, list):
            return Response(
                {'error': 'Skills data must be a list'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_skills = []
        for skill_data in skills_data:
            # Check if skill already exists
            existing_skill = Skill.objects.filter(
                employee=profile, 
                name__iexact=skill_data.get('name')
            ).first()
            
            if not existing_skill:
                skill = Skill.objects.create(
                    employee=profile,
                    name=skill_data.get('name'),
                    proficiency=skill_data.get('proficiency', 'beginner'),
                    years_of_experience=skill_data.get('years_of_experience')
                )
                created_skills.append(SkillSerializer(skill).data)
        
        return Response({
            'message': f'Successfully added {len(created_skills)} skills',
            'skills': created_skills
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to add skills: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def bulk_delete_skills(request):
    """Delete multiple skills by IDs"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        skill_ids = request.data.get('skill_ids', [])
        
        if not isinstance(skill_ids, list):
            return Response(
                {'error': 'skill_ids must be a list'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        deleted_count = Skill.objects.filter(
            employee=profile, 
            id__in=skill_ids
        ).delete()[0]
        
        return Response({
            'message': f'Successfully deleted {deleted_count} skills'
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete skills: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_summary(request):
    """Get a quick summary of user profile for dashboard widgets"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Quick stats
        education_count = Education.objects.filter(employee=profile).count()
        experience_count = Experience.objects.filter(employee=profile).count()
        skills_count = Skill.objects.filter(employee=profile).count()
        resumes_count = Resume.objects.filter(employee=profile).count()
        
        # Latest items
        latest_education = Education.objects.filter(employee=profile).order_by('-start_date').first()
        latest_experience = Experience.objects.filter(employee=profile).order_by('-start_date').first()
        
        # Profile completion score
        required_fields = [
            profile.phone_number, profile.location, profile.current_designation,
            profile.bio, profile.linkedin_url
        ]
        completed = sum(1 for field in required_fields if field)
        completion_score = (completed / len(required_fields)) * 100
        
        # Get profile picture URL (prioritize uploaded image, then social account)
        profile_picture_url = None
        if profile.image_field_picture:
            profile_picture_url = request.build_absolute_uri(profile.image_field_picture.url)
        elif profile.profile_picture:
            profile_picture_url = profile.profile_picture
        else:
            # Get from social account
            social_account = request.user.social_accounts.filter(
                profile_picture_url__isnull=False
            ).first()
            if social_account:
                profile_picture_url = social_account.profile_picture_url
        
        return Response({
            'user_info': {
                'full_name': f"{request.user.first_name} {request.user.last_name}".strip(),
                'email': request.user.email,
                'username': request.user.username,
                'profile_picture_url': profile_picture_url,
                'current_designation': profile.current_designation,
                'location': profile.location,
                'is_job_seeker': profile.is_job_seeker
            },
            'counts': {
                'education': education_count,
                'experience': experience_count,
                'skills': skills_count,
                'resumes': resumes_count
            },
            'latest': {
                'education': EducationSerializer(latest_education).data if latest_education else None,
                'experience': ExperienceSerializer(latest_experience).data if latest_experience else None
            },
            'completion': {
                'score': int(completion_score),
                'is_complete': completion_score >= 80,
                'missing_fields': [
                    field_name for field_name, field_value in [
                        ('phone_number', profile.phone_number),
                        ('location', profile.location), 
                        ('current_designation', profile.current_designation),
                        ('bio', profile.bio),
                        ('linkedin_url', profile.linkedin_url)
                    ] if not field_value
                ]
            }
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch profile summary: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def applications_list(request):
    """Get employee's job applications"""
    try:
        # TODO: Implement job application model and logic
        # For now, return empty list with proper structure
        return Response({
            'applications': [],
            'total_count': 0,
            'status_counts': {
                'applied': 0,
                'under_review': 0,
                'interviewed': 0,
                'offered': 0,
                'rejected': 0
            },
            'message': 'Job applications feature coming soon'
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch applications: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def location_based_jobs(request):
    """Get location-based job recommendations"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        user_location = profile.location or 'Not specified'
        
        # TODO: Implement job matching logic based on location
        # For now, return empty list with proper structure
        return Response({
            'jobs': [],
            'user_location': user_location,
            'search_radius': 50,  # km
            'total_count': 0,
            'message': 'Location-based job matching feature coming soon'
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch location-based jobs: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def job_recommendations(request):
    """Get personalized job recommendations"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Get user's skills for matching
        user_skills = list(profile.skills.values_list('name', flat=True))
        
        # TODO: Implement AI-based job recommendation logic
        # For now, return empty list with proper structure
        return Response({
            'recommendations': [],
            'user_skills': user_skills,
            'match_criteria': {
                'skills_match': True,
                'location_preference': bool(profile.location),
                'experience_level': profile.experience_years or 0,
                'salary_expectation': float(profile.expected_salary) if profile.expected_salary else None
            },
            'total_count': 0,
            'message': 'AI-powered job recommendations feature coming soon'
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch job recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def api_endpoints_info(request):
    """Get information about all available API endpoints"""
    endpoints = {
        'authentication': {
            'register': 'POST /api/employee/register/',
            'login': 'POST /api/employee/login/',
        },
        'profile_management': {
            'get_profile': 'GET /api/employee/profile/',
            'update_profile': 'PUT/PATCH /api/employee/profile/',
            'complete_profile_data': 'GET /api/employee/profile/complete/',
            'update_basic_info': 'PUT/PATCH /api/employee/profile/update-basic/',
            'profile_summary': 'GET /api/employee/profile/summary/',
            'upload_profile_picture': 'POST /api/employee/profile/picture/upload/',
            'delete_profile_picture': 'DELETE /api/employee/profile/picture/delete/',
        },
        'dashboard': {
            'dashboard_data': 'GET /api/employee/dashboard/',
        },
        'education': {
            'list_create_education': 'GET/POST /api/employee/education/',
            'education_detail': 'GET/PUT/PATCH/DELETE /api/employee/education/{id}/',
        },
        'experience': {
            'list_create_experience': 'GET/POST /api/employee/experience/',
            'experience_detail': 'GET/PUT/PATCH/DELETE /api/employee/experience/{id}/',
        },
        'skills': {
            'list_create_skills': 'GET/POST /api/employee/skills/',
            'skill_detail': 'GET/PUT/PATCH/DELETE /api/employee/skills/{id}/',
            'bulk_add_skills': 'POST /api/employee/skills/bulk-add/',
            'bulk_delete_skills': 'DELETE /api/employee/skills/bulk-delete/',
        },
        'resumes': {
            'list_create_resumes': 'GET/POST /api/employee/resumes/',
            'resume_detail': 'GET/PUT/PATCH/DELETE /api/employee/resumes/{id}/',
        }
    }
    
    return Response({
        'message': 'Employee Dashboard API Endpoints',
        'base_url': '/api/employee/',
        'authentication': 'JWT Bearer Token required for most endpoints',
        'endpoints': endpoints
    })


# ================== RESUME BUILDER VIEWS ==================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resume_builder_dashboard(request):
    """Get resume builder dashboard data"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Get all resumes for the user
        resumes = Resume.objects.filter(employee=profile).order_by('-updated_at')
        
        # Get templates
        from .models import ResumeTemplate
        templates = ResumeTemplate.objects.filter(is_active=True).order_by('name')
        
        # Statistics
        total_resumes = resumes.count()
        completed_resumes = resumes.filter(status='completed').count()
        draft_resumes = resumes.filter(status='draft').count()
        
        # Recent activity
        recent_resumes = resumes[:5]
        
        from .serializers import ResumeBuilderSerializer, ResumeTemplateSerializer
        
        return Response({
            'statistics': {
                'total_resumes': total_resumes,
                'completed_resumes': completed_resumes,
                'draft_resumes': draft_resumes,
            },
            'recent_resumes': ResumeBuilderSerializer(recent_resumes, many=True, context={'request': request}).data,
            'available_templates': ResumeTemplateSerializer(templates, many=True).data,
            'profile_completion': {
                'education': profile.education.count() > 0,
                'experience': profile.experience.count() > 0,
                'skills': profile.skills.count() > 0,
                'basic_info': bool(profile.phone_number and profile.location),
            }
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch resume builder dashboard: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ResumeBuilderListCreateView(generics.ListCreateAPIView):
    """List and create resumes with builder functionality"""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        from .serializers import ResumeBuilderSerializer
        return ResumeBuilderSerializer

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Resume.objects.filter(employee=profile).order_by('-updated_at')

    def perform_create(self, serializer):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        serializer.save(employee=profile)


class ResumeBuilderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete resume with builder functionality"""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        from .serializers import ResumeBuilderSerializer
        return ResumeBuilderSerializer

    def get_queryset(self):
        profile, created = EmployeeProfile.objects.get_or_create(user=self.request.user)
        return Resume.objects.filter(employee=profile)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_resume_from_profile(request):
    """Create a new resume and auto-populate with profile data"""
    try:
        from .serializers import ResumeQuickCreateSerializer, ResumeBuilderSerializer
        serializer = ResumeQuickCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            resume = serializer.save()
            response_serializer = ResumeBuilderSerializer(resume, context={'request': request})
            return Response({
                'message': 'Resume created successfully',
                'resume': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {'error': f'Failed to create resume: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def duplicate_resume(request, resume_id):
    """Duplicate an existing resume"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        original_resume = Resume.objects.get(id=resume_id, employee=profile)
        
        # Create a copy
        new_resume = Resume.objects.create(
            employee=profile,
            title=f"{original_resume.title} (Copy)",
            template=original_resume.template,
            personal_info=original_resume.personal_info,
            education_data=original_resume.education_data,
            experience_data=original_resume.experience_data,
            skills_data=original_resume.skills_data,
            projects_data=original_resume.projects_data,
            certifications_data=original_resume.certifications_data,
            languages_data=original_resume.languages_data,
            custom_sections=original_resume.custom_sections,
            color_scheme=original_resume.color_scheme,
            font_family=original_resume.font_family,
            font_size=original_resume.font_size,
            page_margins=original_resume.page_margins,
            status='draft'  # Always create as draft
        )
        
        from .serializers import ResumeBuilderSerializer
        serializer = ResumeBuilderSerializer(new_resume, context={'request': request})
        return Response({
            'message': 'Resume duplicated successfully',
            'resume': serializer.data
        })
        
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to duplicate resume: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_resume_section(request, resume_id):
    """Update specific sections of a resume"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        resume = Resume.objects.get(id=resume_id, employee=profile)
        
        section = request.data.get('section')
        data = request.data.get('data')
        
        if not section or data is None:
            return Response(
                {'error': 'Section and data are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the specific section
        valid_sections = [
            'personal_info', 'education_data', 'experience_data', 'skills_data',
            'projects_data', 'certifications_data', 'languages_data', 'custom_sections'
        ]
        
        if section not in valid_sections:
            return Response(
                {'error': f'Invalid section. Valid sections: {valid_sections}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        setattr(resume, section, data)
        resume.save()
        
        from .serializers import ResumeBuilderSerializer
        serializer = ResumeBuilderSerializer(resume, context={'request': request})
        return Response({
            'message': f'{section.replace("_", " ").title()} updated successfully',
            'resume': serializer.data
        })
        
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to update resume section: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_resume_styling(request, resume_id):
    """Update resume styling (template, colors, fonts)"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        resume = Resume.objects.get(id=resume_id, employee=profile)
        
        # Update styling fields
        styling_fields = ['template', 'color_scheme', 'font_family', 'font_size', 'page_margins']
        updated_fields = []
        
        for field in styling_fields:
            if field in request.data:
                setattr(resume, field, request.data[field])
                updated_fields.append(field)
        
        if updated_fields:
            resume.save()
        
        from .serializers import ResumeBuilderSerializer
        serializer = ResumeBuilderSerializer(resume, context={'request': request})
        return Response({
            'message': f'Styling updated successfully: {", ".join(updated_fields)}',
            'resume': serializer.data
        })
        
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to update resume styling: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def resume_templates_list(request):
    """Get list of available resume templates (no auth required)"""
    try:
        from .models import ResumeTemplate
        from .serializers import ResumeTemplateSerializer
        templates = ResumeTemplate.objects.filter(is_active=True).order_by('name')
        serializer = ResumeTemplateSerializer(templates, many=True)
        return Response({
            'templates': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch templates: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_resume_pdf(request, resume_id):
    """Generate PDF/DOC file for resume"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        resume = Resume.objects.get(id=resume_id, employee=profile)
        
        # TODO: Implement actual PDF generation logic here
        # This would integrate with a PDF generation library like ReportLab, WeasyPrint, or Puppeteer
        
        # For now, just update the status and return success
        resume.status = 'completed'
        resume.save()
        
        return Response({
            'message': 'Resume PDF generation initiated',
            'resume_id': resume.id,
            'status': 'processing'  # In real implementation, this would be async
        })
        
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to generate PDF: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_resume_sharing_link(request, resume_id):
    """Create a shareable link for a resume"""
    try:
        import uuid
        from .models import ResumeSharingLink
        from .serializers import ResumeSharingLinkSerializer
        
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        resume = Resume.objects.get(id=resume_id, employee=profile)
        
        # Generate or get existing sharing link
        sharing_link, created = ResumeSharingLink.objects.get_or_create(
            resume=resume,
            defaults={
                'link_id': str(uuid.uuid4()).replace('-', ''),
                'is_active': True,
                'password_protected': request.data.get('password_protected', False),
                'expires_at': request.data.get('expires_at')
            }
        )
        
        if request.data.get('password') and sharing_link.password_protected:
            from django.contrib.auth.hashers import make_password
            sharing_link.password = make_password(request.data['password'])
            sharing_link.save()
        
        serializer = ResumeSharingLinkSerializer(sharing_link, context={'request': request})
        return Response({
            'message': 'Sharing link created successfully',
            'sharing_link': serializer.data
        })
        
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to create sharing link: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ================== JOB RELATED VIEWS ==================

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def employee_applications(request):
    """Get job applications for the employee"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # TODO: Implement actual job application model
        # For now, return empty data structure
        applications = []
        
        return Response({
            'applications': applications,
            'total_count': 0,
            'pending_count': 0,
            'interviewed_count': 0,
            'rejected_count': 0,
            'accepted_count': 0,
            'message': 'Job application tracking will be available soon'
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch applications: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def location_based_jobs(request):
    """Get jobs based on employee's location"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # TODO: Implement actual job matching based on location
        # For now, return empty data structure
        jobs = []
        
        return Response({
            'jobs': jobs,
            'total_count': 0,
            'location': profile.location or 'Not specified',
            'radius': 50,  # km
            'message': 'Location-based job matching will be available soon'
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch location-based jobs: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def job_recommendations(request):
    """Get personalized job recommendations for the employee"""
    try:
        profile, created = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Get employee skills for recommendations
        skills = Skill.objects.filter(employee=profile).values_list('name', flat=True)
        
        # TODO: Implement actual AI-based job recommendation system
        # For now, return empty data structure with profile-based info
        recommendations = []
        
        return Response({
            'recommendations': recommendations,
            'total_count': 0,
            'match_criteria': {
                'skills': list(skills),
                'experience_years': profile.experience_years or 0,
                'preferred_location': profile.location or 'Any',
                'current_designation': profile.current_designation or 'Any'
            },
            'message': 'AI-powered job recommendations will be available soon'
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch job recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
