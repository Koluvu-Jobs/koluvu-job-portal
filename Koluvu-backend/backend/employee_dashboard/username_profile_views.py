# Username-based Employee Profile Views for LinkedIn-style URLs
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer


class EmployeeProfileView(APIView):
    """
    Get, create, or update employee profile
    Supports both regular authenticated access and username-based access
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile"""
        try:
            employee_profile = EmployeeProfile.objects.get(user=request.user)
            serializer = EmployeeProfileSerializer(employee_profile, context={'request': request})
            return Response(serializer.data)
        except EmployeeProfile.DoesNotExist:
            # Return default profile structure
            return Response({
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                },
                'phone_number': '',
                'location': '',
                'bio': '',
                'linkedin_url': '',
                'github_url': '',
                'portfolio_url': '',
                'profile_picture': None,
                'image_field_picture': None,
                'current_designation': '',
                'experience_years': 0,
                'is_profile_complete': False,
            })
    
    def post(self, request):
        """Create or update profile"""
        employee_profile, created = EmployeeProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'current_designation': '',
                'is_profile_complete': False
            }
        )
        
        serializer = EmployeeProfileSerializer(employee_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            resp = EmployeeProfileSerializer(employee_profile, context={'request': request})
            return Response(resp.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Update profile"""
        try:
            employee_profile = EmployeeProfile.objects.get(user=request.user)
        except EmployeeProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EmployeeProfileSerializer(employee_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            resp = EmployeeProfileSerializer(employee_profile, context={'request': request})
            return Response(resp.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsernameBasedEmployeeProfileView(APIView):
    """
    Username-based employee profile view for LinkedIn-style URLs
    GET /api/employee/{username}/profile - View any user's profile
    """
    # Public-facing profile should be viewable without authentication
    permission_classes = [AllowAny]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        # Support lookup by KJS- public identifier stored on EmployeeProfile
        if isinstance(username, str) and username.upper().startswith("KJS-"):
            try:
                profile = EmployeeProfile.objects.get(public_identifier=username.upper())
                return profile.user
            except EmployeeProfile.DoesNotExist:
                pass

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
            employee_profile = EmployeeProfile.objects.get(user=target_user)
            serializer = EmployeeProfileSerializer(employee_profile, context={'request': request})
            profile_data = serializer.data
            
            # Add username info for frontend
            profile_data['username'] = username
            profile_data['can_edit'] = target_user == request.user
            
            return Response(profile_data)
        except EmployeeProfile.DoesNotExist:
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
                'phone_number': '',
                'location': '',
                'bio': '',
                'linkedin_url': '',
                'github_url': '',
                'portfolio_url': '',
                'profile_picture': None,
                'image_field_picture': None,
                'current_designation': '',
                'experience_years': 0,
                'is_profile_complete': False,
            })


class UsernameBasedEmployeeProfileUpdateView(APIView):
    """
    Update employee profile via username
    PATCH /api/employee/{username}/profile/update
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        # Support lookup by KJS- public identifier stored on EmployeeProfile
        if isinstance(username, str) and username.upper().startswith("KJS-"):
            try:
                profile = EmployeeProfile.objects.get(public_identifier=username.upper())
                return profile.user
            except EmployeeProfile.DoesNotExist:
                pass

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
        
        # Get or create profile
        employee_profile, created = EmployeeProfile.objects.get_or_create(
            user=target_user,
            defaults={
                'current_designation': '',
                'is_profile_complete': False
            }
        )
        
        serializer = EmployeeProfileSerializer(employee_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            resp = EmployeeProfileSerializer(employee_profile, context={'request': request})
            return Response(resp.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsernameBasedEmployeeProfilePictureUploadView(APIView):
    """
    Upload profile picture via username
    POST /api/employee/{username}/profile/upload-picture
    """
    permission_classes = [IsAuthenticated]
    
    def get_user_by_username(self, username):
        """Get user by username or email prefix"""
        # Support lookup by public identifier as well
        if isinstance(username, str) and username.upper().startswith("KJS-"):
            try:
                profile = EmployeeProfile.objects.get(public_identifier=username.upper())
                return profile.user
            except EmployeeProfile.DoesNotExist:
                pass

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
        employee_profile, created = EmployeeProfile.objects.get_or_create(
            user=target_user,
            defaults={
                'current_designation': '',
                'is_profile_complete': False
            }
        )
        
        # Update profile picture (use the uploaded image field)
        employee_profile.image_field_picture = request.FILES['profile_picture']
        employee_profile.save()
        
        serializer = EmployeeProfileSerializer(employee_profile, context={'request': request})
        return Response({
            'message': 'Profile picture uploaded successfully',
            'profile_picture_url': serializer.data.get('image_field_picture'),
            'profile': serializer.data
        })


# Legacy views for backward compatibility
class RegisterEmployeeView(APIView):
    """Employee registration with username support"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Extract data from request
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            full_name = request.data.get('fullName') or request.data.get('full_name')
            mobile_number = request.data.get('mobileNumber') or request.data.get('mobile_number')
            
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
            
            # Parse full name
            name_parts = full_name.split(' ', 1) if full_name else ['', '']
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Create user with username
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            
            # Create employee profile  
            employee_profile = EmployeeProfile.objects.create(
                user=user,
                phone_number=mobile_number or '',
                current_designation='',
                is_profile_complete=False
            )
            
            return Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'profile_url': f'/dashboard/employee/{username}/profile'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeLoginView(APIView):
    """Employee login"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Implementation needed
        return Response({'message': 'Employee login endpoint'})