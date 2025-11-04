from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from google.auth.transport import requests
from google.oauth2 import id_token
from datetime import datetime, timezone
import logging

from authentication.models import SocialAccount, UserSession
from authentication.serializers import GoogleOAuthSerializer, AuthResponseSerializer, UserSerializer
from employee_dashboard.models import EmployeeProfile
from employer_dashboard.models import EmployerProfile
from backend.partner_dashboard.models import PartnerProfile
from django.http import HttpResponseRedirect
import requests as http_requests
import uuid
from urllib.parse import urlencode
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)


class GoogleOAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleOAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Handle both access_token (old format) and credential (new format)
        access_token = serializer.validated_data.get('access_token')
        credential = serializer.validated_data.get('credential')
        user_type = serializer.validated_data['user_type']

        # Use credential if available, otherwise use access_token
        token_to_verify = credential or access_token

        try:
            # Verify the Google token with clock tolerance
            idinfo = id_token.verify_oauth2_token(
                token_to_verify, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=60  # Allow 60 seconds of clock skew
            )
            
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # Extract user information from Google
            google_id = idinfo['sub']
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            profile_picture = idinfo.get('picture', '')
            
            # Check if user exists
            user = None
            social_account = None
            created = False
            
            # Try to find existing social account
            try:
                social_account = SocialAccount.objects.get(
                    provider='google', 
                    social_id=google_id
                )
                user = social_account.user
            except SocialAccount.DoesNotExist:
                # Try to find user by email
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    # Create new user
                    username = email.split('@')[0]
                    # Ensure unique username
                    base_username = username
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1
                    
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        first_name=first_name,
                        last_name=last_name
                    )
                    created = True
                
                # Create social account
                social_account = SocialAccount.objects.create(
                    user=user,
                    provider='google',
                    social_id=google_id,
                    email=email,
                    profile_picture_url=profile_picture
                )
            
            # Create or get profile based on user type with Google data
            # IMPORTANT: Check if user already has a DIFFERENT profile type
            logger.info(f"Processing user_type: {user_type} for user {email}")
            
            # Validate user doesn't already have a different profile type
            # Note: Partner dashboard not implemented yet, so skipping partner checks
            if user_type == 'employee':
                if EmployerProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {email} already has an employer profile, cannot create employee profile")
                    return Response(
                        {
                            'error': 'This account is already registered as an employer. Please use the employer login.',
                            'existing_user_type': 'employer'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if PartnerProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {email} already has a partner profile, cannot create employee profile")
                    return Response(
                        {
                            'error': 'This account is already registered as a partner. Please use the partner login.',
                            'existing_user_type': 'partner'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            elif user_type == 'employer':
                if EmployeeProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {email} already has an employee profile, cannot create employer profile")
                    return Response(
                        {
                            'error': 'This account is already registered as an employee. Please use the employee login.',
                            'existing_user_type': 'employee'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if PartnerProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {email} already has a partner profile, cannot create employer profile")
                    return Response(
                        {
                            'error': 'This account is already registered as a partner. Please use the partner login.',
                            'existing_user_type': 'partner'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            elif user_type == 'partner':
                if EmployeeProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {email} already has an employee profile, cannot create partner profile")
                    return Response(
                        {
                            'error': 'This account is already registered as an employee. Please use the employee login.',
                            'existing_user_type': 'employee'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if EmployerProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {email} already has an employer profile, cannot create partner profile")
                    return Response(
                        {
                            'error': 'This account is already registered as an employer. Please use the employer login.',
                            'existing_user_type': 'employer'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            try:
                if user_type == 'employee':
                    logger.info(f"Entered employee profile creation block")
                    try:
                        employee_profile = EmployeeProfile.objects.get(user=user)
                        logger.info(f"Found existing employee profile for user {user.email}")
                    except EmployeeProfile.DoesNotExist:
                        employee_profile = EmployeeProfile.objects.create(
                            user=user,
                            bio=f'Software professional with expertise in technology solutions.',
                            phone_number='',
                            location='',
                            experience_years=0,
                            current_designation='',
                            profile_picture=profile_picture,
                            is_profile_complete=False,
                            resume_url='',
                            linkedin_url='',
                            github_url='',
                            portfolio_url=''
                        )
                        logger.info(f"Created new employee profile for user {user.email}")
                        if not user.first_name and first_name:
                            user.first_name = first_name
                        if not user.last_name and last_name:
                            user.last_name = last_name
                        user.save()
                elif user_type == 'employer':
                    logger.info(f"Entered employer profile creation block")
                    try:
                        employer_profile = EmployerProfile.objects.get(user=user)
                        logger.info(f"Found existing employer profile for user {user.email}")
                    except EmployerProfile.DoesNotExist:
                        employer_profile = EmployerProfile.objects.create(
                            user=user,
                            company_name=f'{first_name} {last_name} Company' if first_name or last_name else 'Company',
                            contact_person=f'{first_name} {last_name}' if first_name or last_name else email.split('@')[0],
                            company_location='Location not specified',
                            phone='',
                            website='',
                            company_size='',
                            industry_type='',
                            designation='',
                        )
                        logger.info(f"Created new employer profile for user {user.email}")
                elif user_type == 'partner':
                    logger.info(f"Entered partner profile creation block")
                    try:
                        partner_profile = PartnerProfile.objects.get(user=user)
                        logger.info(f"Found existing partner profile for user {user.email}")
                    except PartnerProfile.DoesNotExist:
                        partner_profile = PartnerProfile.objects.create(
                            user=user,
                            organization_name=f'{first_name} {last_name} Organization' if first_name or last_name else 'Organization',
                            contact_person=f'{first_name} {last_name}' if first_name or last_name else email.split('@')[0],
                            phone_number='',
                            email=email,
                            website='',
                            address='',
                            profile_picture=profile_picture,
                            is_verified=False,
                            is_profile_complete=False,
                        )
                        logger.info(f"Created new partner profile for user {user.email}")
                        if not user.first_name and first_name:
                            user.first_name = first_name
                        if not user.last_name and last_name:
                            user.last_name = last_name
                        user.save()
            except Exception as profile_error:
                logger.error(f"Error creating profile: {str(profile_error)}")
                raise
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Add custom claims to the token
            refresh['user_type'] = user_type
            refresh.access_token['user_type'] = user_type
            
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Store session
            # Convert Unix timestamp to datetime
            exp_timestamp = refresh.get('exp')
            if exp_timestamp:
                expires_at = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
            else:
                expires_at = None
                
            UserSession.objects.create(
                user=user,
                refresh_token=refresh_token,
                expires_at=expires_at
            )
            
            # Determine user type for response - prioritize the requested type if that profile exists
            response_user_type = user_type  # Use the requested type by default
            
            # Verify the requested profile actually exists by querying the database
            if user_type == 'employer':
                if not EmployerProfile.objects.filter(user=user).exists():
                    # Fallback to employee if employer profile doesn't exist
                    response_user_type = 'employee'
            elif user_type == 'employee':
                if not EmployeeProfile.objects.filter(user=user).exists():
                    # Fallback to employer if employee profile doesn't exist
                    response_user_type = 'employer'
            
            logger.info(f"Authentication successful for {email} as {response_user_type}")
            
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user_type': response_user_type,
                'created': created
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.error(f"Google OAuth error: {str(e)}")
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error during Google OAuth: {str(e)}")
            return Response(
                {'error': 'Authentication failed'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GitHubInitiateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Check if GitHub OAuth is properly configured
            if not settings.GITHUB_CLIENT_ID:
                return Response(
                    {'error': 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your environment variables.'}, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Get user_type from query parameter (employee or employer)
            user_type = request.GET.get('user_type', 'employee')
            logger.info(f"GitHub OAuth initiated for user_type: {user_type}")
            
            state = str(uuid.uuid4())
            # Store both state and user_type in session
            request.session['oauth_state'] = state
            request.session['user_type'] = user_type
            
            params = {
                'client_id': settings.GITHUB_CLIENT_ID,
                'redirect_uri': f"{settings.FRONTEND_URL.rstrip('/')}/auth/github/callback",
                'scope': 'user:email',
                'state': state,
            }

            auth_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
            
            # Return JSON response instead of redirect
            return Response({
                'auth_url': auth_url,
                'state': state
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"GitHub OAuth initiation error: {str(e)}")
            return Response(
                {'error': f'GitHub OAuth initiation failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class GitHubCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """Handle GitHub OAuth callback via POST with JSON body"""
        try:
            code = request.data.get('code')
            state = request.data.get('state')
            user_type = request.data.get('user_type', 'employee')
            
            if not code:
                return Response(
                    {'error': 'No authorization code provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            logger.info(f"GitHub callback for user_type: {user_type}")

            token_url = 'https://github.com/login/oauth/access_token'
            token_data = {
                'client_id': settings.GITHUB_CLIENT_ID,
                'client_secret': settings.GITHUB_CLIENT_SECRET,
                'code': code,
                'redirect_uri': f"{settings.FRONTEND_URL.rstrip('/')}/auth/github/callback",
            }
            headers = {'Accept': 'application/json'}

            token_resp = http_requests.post(token_url, data=token_data, headers=headers)
            token_resp.raise_for_status()
            tokens = token_resp.json()

            access_token = tokens.get('access_token')
            if not access_token:
                raise Exception('No access token from GitHub')

            # fetch user
            user_info = http_requests.get('https://api.github.com/user', headers={'Authorization': f'token {access_token}'})
            user_info.raise_for_status()
            user_data = user_info.json()

            # fetch emails
            emails_resp = http_requests.get('https://api.github.com/user/emails', headers={'Authorization': f'token {access_token}'})
            emails_resp.raise_for_status()
            emails = emails_resp.json()
            primary_email = None
            for e in emails:
                if e.get('primary'):
                    primary_email = e.get('email')
                    break
            if not primary_email and emails:
                primary_email = emails[0].get('email')

            user_data['email'] = primary_email
            github_id = str(user_data.get('id'))
            profile_picture = user_data.get('avatar_url', '')
            first_name = (user_data.get('name') or '').split(' ')[0] if user_data.get('name') else ''
            last_name = ' '.join((user_data.get('name') or '').split(' ')[1:]) if user_data.get('name') else ''

            # Check if user exists
            user = None
            social_account = None
            created = False
            
            # Try to find existing social account
            try:
                social_account = SocialAccount.objects.get(
                    provider='github',
                    social_id=github_id
                )
                user = social_account.user
            except SocialAccount.DoesNotExist:
                # Try to find user by email
                try:
                    user = User.objects.get(email=primary_email)
                except User.DoesNotExist:
                    # Create new user
                    username = (primary_email.split('@')[0] if primary_email else f'github_{github_id}')
                    base_username = username
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1

                    user = User.objects.create_user(
                        username=username,
                        email=primary_email,
                        first_name=first_name,
                        last_name=last_name
                    )
                    created = True

                # Create social account
                social_account = SocialAccount.objects.create(
                    user=user,
                    provider='github',
                    social_id=github_id,
                    email=primary_email,
                    profile_picture_url=profile_picture
                )

            # Create or get profile based on user type with GitHub data
            logger.info(f"Processing GitHub auth for user_type: {user_type}")
            
            # Validate user doesn't already have a different profile type
            if user_type == 'employee':
                # Check if user already has an employer profile
                if EmployerProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {primary_email} already has an employer profile, cannot create employee profile")
                    return Response(
                        {
                            'error': 'This account is already registered as an employer. Please use the employer login.',
                            'existing_user_type': 'employer'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            elif user_type == 'employer':
                # Check if user already has an employee profile
                if EmployeeProfile.objects.filter(user=user).exists():
                    logger.warning(f"User {primary_email} already has an employee profile, cannot create employer profile")
                    return Response(
                        {
                            'error': 'This account is already registered as an employee. Please use the employee login.',
                            'existing_user_type': 'employee'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            try:
                if user_type == 'employee':
                    # Try to get existing profile first
                    try:
                        employee_profile = EmployeeProfile.objects.get(user=user)
                        logger.info(f"Found existing employee profile for user {user.email}")
                    except EmployeeProfile.DoesNotExist:
                        # Create new employee profile
                        employee_profile = EmployeeProfile.objects.create(
                            user=user,
                            bio=f'Software professional with expertise in technology solutions.',
                            phone_number='',
                            location='',
                            experience_years=0,
                            current_designation='',
                            profile_picture=profile_picture,
                            is_profile_complete=False,
                            resume_url='',
                            linkedin_url='',
                            github_url=user_data.get('html_url', ''),
                            portfolio_url=user_data.get('blog', '')
                        )
                        logger.info(f"Created new employee profile for user {user.email}")
                        
                elif user_type == 'employer':
                    # Try to get existing profile first
                    try:
                        employer_profile = EmployerProfile.objects.get(user=user)
                        logger.info(f"Found existing employer profile for user {user.email}")
                    except EmployerProfile.DoesNotExist:
                        # Create new employer profile with correct field names
                        employer_profile = EmployerProfile.objects.create(
                            user=user,
                            company_name=f'{first_name} {last_name} Company' if first_name or last_name else 'Company',
                            contact_person=f'{first_name} {last_name}' if first_name or last_name else primary_email.split('@')[0],
                            company_location='Location not specified',
                            phone='',
                            website=user_data.get('blog', ''),
                            company_size='',
                            industry_type='',
                            designation='',
                        )
                        logger.info(f"Created new employer profile for user {user.email}")
            except Exception as profile_error:
                logger.error(f"Error creating profile: {str(profile_error)}")
                raise

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Add custom claims to the token
            refresh['user_type'] = user_type
            refresh.access_token['user_type'] = user_type
            
            access_token_jwt = str(refresh.access_token)
            refresh_token_jwt = str(refresh)

            # Store session
            exp_timestamp = refresh.get('exp')
            expires_at = None
            if exp_timestamp:
                from datetime import datetime, timezone
                expires_at = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)

            UserSession.objects.create(user=user, refresh_token=refresh_token_jwt, expires_at=expires_at)

            # Determine user type for response - use the requested type if that profile exists
            response_user_type = user_type  # Use requested type by default
            
            # Verify the requested profile actually exists by querying the database
            if user_type == 'employer':
                if not EmployerProfile.objects.filter(user=user).exists():
                    response_user_type = 'employee'  # Fallback
            elif user_type == 'employee':
                if not EmployeeProfile.objects.filter(user=user).exists():
                    response_user_type = 'employer'  # Fallback
            
            logger.info(f"GitHub authentication successful for {primary_email} as {response_user_type}")

            # Return JSON response with tokens
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': access_token_jwt,
                'refresh_token': refresh_token_jwt,
                'user_type': response_user_type,
                'created': created
            }
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"GitHub OAuth error: {str(e)}")
            return Response(
                {'error': f'GitHub authentication failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LinkedInInitiateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Check if LinkedIn OAuth is properly configured
        if not settings.LINKEDIN_CLIENT_ID or settings.LINKEDIN_CLIENT_ID == 'your_linkedin_client_id_here':
            return Response(
                {'error': 'LinkedIn OAuth is not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in your environment variables.'}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        state = str(uuid.uuid4())
        request.session['oauth_state'] = state
        params = {
            'response_type': 'code',
            'client_id': settings.LINKEDIN_CLIENT_ID,
            'redirect_uri': f"{settings.BACKEND_URL.rstrip('/')}/api/auth/linkedin/callback/",
            'scope': 'r_liteprofile r_emailaddress',
            'state': state,
        }
        auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}"
        return HttpResponseRedirect(auth_url)


class LinkedInCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('code')
        state = request.GET.get('state')
        if state != request.session.get('oauth_state'):
            return HttpResponseRedirect(f"{getattr(settings, 'FRONTEND_URL', '/')}/auth/error?error=invalid_state")

        token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': f"{settings.BACKEND_URL.rstrip('/')}/api/auth/linkedin/callback/",
            'client_id': settings.LINKEDIN_CLIENT_ID,
            'client_secret': settings.LINKEDIN_CLIENT_SECRET,
        }

        try:
            token_resp = http_requests.post(token_url, data=token_data)
            token_resp.raise_for_status()
            tokens = token_resp.json()
            access_token = tokens.get('access_token')
            if not access_token:
                raise Exception('No access token from LinkedIn')

            headers = {'Authorization': f'Bearer {access_token}'}
            profile_url = 'https://api.linkedin.com/v2/me'
            profile_resp = http_requests.get(profile_url, headers=headers)
            profile_resp.raise_for_status()
            profile = profile_resp.json()

            email_url = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'
            email_resp = http_requests.get(email_url, headers=headers)
            email_resp.raise_for_status()
            email_data = email_resp.json()

            email = None
            if email_data.get('elements'):
                email = email_data['elements'][0]['handle~']['emailAddress']

            # Create or get user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                username = (email.split('@')[0] if email else f'linkedin_{profile.get("id")}')
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=profile.get('localizedFirstName', ''),
                    last_name=profile.get('localizedLastName', '')
                )

                SocialAccount.objects.create(
                    user=user,
                    provider='linkedin',
                    social_id=profile.get('id'),
                    email=email,
                )

            # Generate tokens and set cookies similar to GitHub
            refresh = RefreshToken.for_user(user)
            
            # Add custom claims to the token - LinkedIn defaults to employee
            user_type = request.session.get('user_type', 'employee')
            refresh['user_type'] = user_type
            refresh.access_token['user_type'] = user_type
            
            access_token_jwt = str(refresh.access_token)
            refresh_token_jwt = str(refresh)

            exp_timestamp = refresh.get('exp')
            expires_at = None
            if exp_timestamp:
                from datetime import datetime, timezone
                expires_at = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
            UserSession.objects.create(user=user, refresh_token=refresh_token_jwt, expires_at=expires_at)

            redirect_url = f"{getattr(settings, 'FRONTEND_URL', '/')}/auth/auth-success?provider=linkedin"
            response = HttpResponseRedirect(redirect_url)
            secure_flag = not getattr(settings, 'DEBUG', True)
            response.set_cookie('access_token', access_token_jwt, httponly=True, secure=secure_flag, samesite=None)
            response.set_cookie('refresh_token', refresh_token_jwt, httponly=True, secure=secure_flag, samesite=None)
            return response

        except Exception as e:
            return HttpResponseRedirect(f"{getattr(settings, 'FRONTEND_URL', '/')}/auth/error?error={str(e)}")


class VerifyTokenView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user_type = 'employee'
        
        if hasattr(user, 'employer_profile'):
            user_type = 'employer'
        elif hasattr(user, 'employee_profile'):
            user_type = 'employee'
            
        return Response({
            'user': UserSerializer(user).data,
            'user_type': user_type,
            'valid': True
        })



class TokenFromCookieView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Return access token and user info using refresh token stored in httpOnly cookie."""
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'No refresh token cookie'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            user = User.objects.get(id=refresh['user_id'])
            return Response({'access_token': access_token, 'user': UserSerializer(user).data})
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            return Response({
                'access_token': access_token
            })
        except Exception as e:
            return Response(
                {'error': 'Invalid refresh token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # The main goal is to deactivate user sessions
            if request.user and request.user.is_authenticated:
                UserSession.objects.filter(user=request.user, is_active=True).update(is_active=False)
            
            # Try to blacklist refresh token if provided
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except Exception:
                    # Silently ignore token blacklisting errors
                    # The user session deactivation is what matters most
                    pass
            
            return Response({'message': 'Successfully logged out'})
        except Exception as e:
            print(f"Logout error: {e}")
            # Always return success for logout to ensure frontend can complete logout
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
