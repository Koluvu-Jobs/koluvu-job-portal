# Profile Views for username-based URLs (LinkedIn-style)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import EmployerProfile
from .serializers import EmployerProfileSerializer


class EmployerProfileView(APIView):
    """
    Get, create, or update employer profile
    Supports both regular authenticated access and username-based access
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            serializer = EmployerProfileSerializer(employer_profile)
            return Response(serializer.data)
        except EmployerProfile.DoesNotExist:
            # Return default profile structure
            return Response({
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                },
                'company_name': '',
                'employer_name': '',
                'contact_person': '',
                'designation': '',
                'phone': '',
                'company_location': '',
                'website': '',
                'industry_type': '',
                'company_size': '',
                'total_employees': '',
                'bio': '',
                'employer_introduction': '',
                'linkedin_profile_url': '',
                'github_profile_url': '',
                'twitter_profile_url': '',
                'facebook_profile_url': '',
                'instagram_profile_url': '',
                'company_logo': None,
                'profile_picture': None,
                'profile_completion_percentage': 0,
            })
    
    def post(self, request):
        """Create or update profile"""
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': request.user.first_name or 'Employer',
                'is_active': True
            }
        )
        
        serializer = EmployerProfileSerializer(employer_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Update profile"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
        except EmployerProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EmployerProfileSerializer(employer_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsernameBasedEmployerProfileView(APIView):
    """
    Username-based employer profile view for LinkedIn-style URLs
    GET /api/employer/{username}/profile - View any user's profile
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        try:
            # First try exact username match
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            # Try to find by email prefix
            try:
                user = User.objects.get(email__startswith=f"{username}@")
                return user
            except User.DoesNotExist:
                return None
    
    def get(self, request, username):
        """Get profile by username"""
        target_user = self.get_user_by_username(username)
        if not target_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            employer_profile = EmployerProfile.objects.get(user=target_user)
            serializer = EmployerProfileSerializer(employer_profile)
            profile_data = serializer.data
            
            # Add username info for frontend
            profile_data['username'] = username
            profile_data['can_edit'] = target_user == request.user
            
            return Response(profile_data)
        except EmployerProfile.DoesNotExist:
            # Return basic user info even if no profile exists
            return Response({
                'user': {
                    'id': target_user.id,
                    'username': target_user.username,
                    'email': target_user.email,
                    'first_name': target_user.first_name,
                    'last_name': target_user.last_name,
                },
                'username': username,
                'can_edit': target_user == request.user,
                'company_name': '',
                'employer_name': target_user.first_name or target_user.username,
                'contact_person': '',
                'designation': '',
                'phone': '',
                'company_location': '',
                'website': '',
                'industry_type': '',
                'company_size': '',
                'total_employees': '',
                'bio': '',
                'employer_introduction': '',
                'linkedin_profile_url': '',
                'github_profile_url': '',
                'twitter_profile_url': '',
                'facebook_profile_url': '',
                'instagram_profile_url': '',
                'company_logo': None,
                'profile_picture': None,
                'profile_completion_percentage': 0,
            })


class UsernameBasedEmployerProfileCreateView(APIView):
    """
    Create employer profile via username (first-time setup)
    POST /api/employer/{username}/profile/create
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        try:
            # First try exact username match
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            # Try to find by email prefix
            try:
                user = User.objects.get(email__startswith=f"{username}@")
                return user
            except User.DoesNotExist:
                return None
    
    def post(self, request, username):
        """Create profile - only allowed for own profile"""
        target_user = self.get_user_by_username(username)
        if not target_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Security check: Users can only create their own profile
        if target_user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if profile already exists
        if EmployerProfile.objects.filter(user=target_user).exists():
            return Response({'error': 'Profile already exists. Use update endpoint instead.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract email update if provided
        new_email = request.data.get('email')
        if new_email and new_email != target_user.email:
            # Validate email format
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError
            try:
                validate_email(new_email)
            except ValidationError:
                return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email is already taken
            if User.objects.filter(email=new_email).exclude(id=target_user.id).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update user email
            target_user.email = new_email
            target_user.save()
        
        # Remove email from profile data as it's handled at user level
        profile_data = request.data.copy()
        if 'email' in profile_data:
            del profile_data['email']
        
        # Validate required fields
        if not profile_data.get('company_name'):
            return Response({'error': 'Company name is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not profile_data.get('employer_name'):
            return Response({'error': 'Employer name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Set default is_active
        profile_data['is_active'] = True
        
        serializer = EmployerProfileSerializer(data=profile_data)
        if serializer.is_valid():
            employer_profile = serializer.save(user=target_user)
            response_data = serializer.data
            # Include user email in response
            response_data['user'] = {
                'id': target_user.id,
                'username': target_user.username,
                'email': target_user.email,
                'first_name': target_user.first_name,
                'last_name': target_user.last_name,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsernameBasedEmployerProfileUpdateView(APIView):
    """
    Update employer profile via username
    PATCH /api/employer/{username}/profile/update
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        try:
            # First try exact username match
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            # Try to find by email prefix
            try:
                user = User.objects.get(email__startswith=f"{username}@")
                return user
            except User.DoesNotExist:
                return None
    
    def patch(self, request, username):
        """Update profile - only allowed for own profile"""
        target_user = self.get_user_by_username(username)
        if not target_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Security check: Users can only edit their own profile
        if target_user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Extract email update if provided
        new_email = request.data.get('email')
        if new_email and new_email != target_user.email:
            # Validate email format
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError
            try:
                validate_email(new_email)
            except ValidationError:
                return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email is already taken
            if User.objects.filter(email=new_email).exclude(id=target_user.id).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update user email
            target_user.email = new_email
            target_user.save()
        
        # Get or create profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=target_user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': target_user.first_name or 'Employer',
                'is_active': True
            }
        )
        
        # Remove email from profile data as it's handled at user level
        profile_data = request.data.copy()
        if 'email' in profile_data:
            del profile_data['email']
        
        serializer = EmployerProfileSerializer(employer_profile, data=profile_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response_data = serializer.data
            # Include updated user email in response
            response_data['user']['email'] = target_user.email
            return Response(response_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsernameBasedCompanyLogoUploadView(APIView):
    """
    Upload company logo via username
    POST /api/employer/{username}/profile/upload-logo
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        try:
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            try:
                user = User.objects.get(email__startswith=f"{username}@")
                return user
            except User.DoesNotExist:
                return None
    
    def post(self, request, username):
        """Upload company logo - only allowed for own profile"""
        target_user = self.get_user_by_username(username)
        if not target_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Security check: Users can only upload to their own profile
        if target_user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if 'company_logo' not in request.FILES:
            return Response({'error': 'No logo file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=target_user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': target_user.first_name or 'Employer',
                'is_active': True
            }
        )
        
        # Update logo
        employer_profile.company_logo = request.FILES['company_logo']
        employer_profile.save()
        
        serializer = EmployerProfileSerializer(employer_profile)
        return Response({
            'message': 'Company logo uploaded successfully',
            'company_logo_url': serializer.data.get('company_logo'),
            'profile': serializer.data
        })


class UsernameBasedProfilePictureUploadView(APIView):
    """
    Upload profile picture via username
    POST /api/employer/{username}/profile/upload-picture
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        try:
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            try:
                user = User.objects.get(email__startswith=f"{username}@")
                return user
            except User.DoesNotExist:
                return None
    
    def post(self, request, username):
        """Upload profile picture - only allowed for own profile"""
        target_user = self.get_user_by_username(username)
        if not target_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Security check: Users can only upload to their own profile
        if target_user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No profile picture file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=target_user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': target_user.first_name or 'Employer',
                'is_active': True
            }
        )
        
        # Update profile picture
        employer_profile.profile_picture = request.FILES['profile_picture']
        employer_profile.save()
        
        serializer = EmployerProfileSerializer(employer_profile)
        return Response({
            'message': 'Profile picture uploaded successfully',
            'profile_picture_url': serializer.data.get('profile_picture'),
            'profile': serializer.data
        })


class UsernameBasedDeleteAccountView(APIView):
    """
    Delete employer account via username
    DELETE /api/employer/{username}/delete-account
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        try:
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            try:
                user = User.objects.get(email__startswith=f"{username}@")
                return user
            except User.DoesNotExist:
                return None
    
    def delete(self, request, username):
        """Delete account - only allowed for own account"""
        target_user = self.get_user_by_username(username)
        if not target_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Security check: Users can only delete their own account
        if target_user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Store username for response
            deleted_username = target_user.username
            deleted_email = target_user.email
            
            # Delete user (will cascade delete profile and related data)
            target_user.delete()
            
            return Response({
                'message': 'Account deleted successfully',
                'username': deleted_username,
                'email': deleted_email
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to delete account: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Legacy views for backward compatibility
class EmployerRegisterView(APIView):
    """Employer registration with username support"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Extract data from request
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            company_name = request.data.get('company_name')
            contact_person = request.data.get('contact_person')
            
            # Validate required fields
            if not username:
                return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            if not password:
                return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate username format
            if len(username) < 3:
                return Response({'error': 'Username must be at least 3 characters'}, status=status.HTTP_400_BAD_REQUEST)
            if not username.replace('_', '').replace('-', '').isalnum():
                return Response({'error': 'Username can only contain letters, numbers, underscore and dash'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if username already exists
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user with username
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=contact_person or '',
            )
            
            # Create employer profile
            employer_profile = EmployerProfile.objects.create(
                user=user,
                company_name=company_name or 'Your Company',
                employer_name=contact_person or username,
                is_active=True
            )
            
            return Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'profile_url': f'/dashboard/employer/{username}/profile'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployerLoginView(APIView):
    """Employer login"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Implementation needed
        return Response({'message': 'Login endpoint'})


class SocialMediaSyncView(APIView):
    """Social media sync"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        return Response({'message': 'Social media sync endpoint'})


class ProfileCompletionView(APIView):
    """Profile completion status"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({'completion_percentage': 0})