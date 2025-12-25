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
from datetime import datetime
from django.utils import timezone
import logging
from datetime import timezone as dt_timezone

from authentication.models import SocialAccount, UserSession, OTPSession
from authentication.serializers import GoogleOAuthSerializer, AuthResponseSerializer, UserSerializer
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
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
            # Enhanced debug logging
            logger.info(f"=== GOOGLE OAUTH DEBUG ===")
            logger.info(f"Attempting to verify Google token for user_type: {user_type}")
            logger.info(f"Token present: {'Yes' if token_to_verify else 'No'}")
            logger.info(f"Token length: {len(token_to_verify) if token_to_verify else 0}")
            logger.info(f"Token first 50 chars: {token_to_verify[:50] if token_to_verify else 'None'}...")
            logger.info(f"GOOGLE_CLIENT_ID present: {'Yes' if settings.GOOGLE_CLIENT_ID else 'No'}")
            logger.info(f"GOOGLE_CLIENT_ID full: {settings.GOOGLE_CLIENT_ID}")
            
            if not token_to_verify:
                raise ValueError("No token provided")
            
            if not settings.GOOGLE_CLIENT_ID:
                raise ValueError("Google Client ID not configured")
            
            # Verify the Google token with clock tolerance
            logger.info("Starting token verification...")
            idinfo = id_token.verify_oauth2_token(
                token_to_verify, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=120  # Increased clock skew tolerance
            )
            logger.info(f"Token verification successful. User: {idinfo.get('email', 'Unknown')}")
            
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
                    logger.info(f"Checking employer profile for user {user.email}")
                    # DO NOT auto-create profile for new Google OAuth users
                    # They will be redirected to setup-profile page to create it manually
                    # Only check if existing profile exists
                    try:
                        employer_profile = EmployerProfile.objects.get(user=user)
                        logger.info(f"Found existing employer profile for user {user.email}")
                    except EmployerProfile.DoesNotExist:
                        logger.info(f"No employer profile exists for user {user.email} - will redirect to setup")
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
                expires_at = datetime.fromtimestamp(exp_timestamp, tz=dt_timezone.utc)
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
            
            # Check profile completion for employers
            is_new_user = created
            profile_completion_percentage = 0
            
            if user_type == 'employer':
                try:
                    employer_profile = EmployerProfile.objects.get(user=user)
                    profile_completion_percentage = employer_profile.profile_completion_percentage or 0
                    # Consider it a new user if profile doesn't exist or is incomplete
                    is_new_user = profile_completion_percentage < 20
                except EmployerProfile.DoesNotExist:
                    # No profile exists - definitely a new user who needs to complete setup
                    is_new_user = True
                    profile_completion_percentage = 0
            
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user_type': response_user_type,
                'created': created,
                'is_new_user': is_new_user,
                'profile_completion_percentage': profile_completion_percentage,
                'username': user.username
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.error(f"=== GOOGLE OAUTH ERROR ===")
            logger.error(f"ValueError during Google token verification: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Token being verified (length {len(token_to_verify) if token_to_verify else 0}): {token_to_verify[:100] if token_to_verify else 'None'}...")
            logger.error(f"GOOGLE_CLIENT_ID: {settings.GOOGLE_CLIENT_ID}")
            
            # More specific error messages
            error_msg = str(e).lower()
            if 'wrong issuer' in error_msg:
                return Response({'error': 'Invalid token issuer'}, status=status.HTTP_400_BAD_REQUEST)
            elif 'expired' in error_msg:
                return Response({'error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
            elif 'invalid' in error_msg:
                return Response({'error': 'Invalid token format'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': f'Token verification failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
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
                expires_at = datetime.fromtimestamp(exp_timestamp, tz=dt_timezone.utc)

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
                expires_at = datetime.fromtimestamp(exp_timestamp, tz=dt_timezone.utc)
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


class SendOTPView(APIView):
    """Send OTP for email or mobile verification"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            phone = request.data.get('phone')
            username = request.data.get('username')  # Get username from request
            verification_type = request.data.get('type', 'email')
            
            if not email and not phone:
                return Response({
                    'success': False,
                    'message': 'Email or phone number is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Clean up expired OTP sessions
            OTPSession.objects.filter(expires_at__lt=timezone.now()).delete()
            
            # Check for existing valid OTP session
            if email and verification_type == 'email':
                existing_otp = OTPSession.objects.filter(
                    email=email,
                    verification_type='email',
                    is_verified=False,
                    expires_at__gt=timezone.now()
                ).first()
                
                if existing_otp:
                    # Check if it's within the 60-second cooldown period
                    time_diff = timezone.now() - existing_otp.created_at
                    if time_diff < timezone.timedelta(seconds=60):
                        remaining_seconds = 60 - int(time_diff.total_seconds())
                        return Response({
                            'success': False,
                            'message': f'Please wait {remaining_seconds} seconds before requesting a new OTP',
                            'retry_after': remaining_seconds,
                            'countdown': remaining_seconds
                        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
                    else:
                        # Delete old session and create new one
                        existing_otp.delete()
            
            elif phone and verification_type == 'phone':
                existing_otp = OTPSession.objects.filter(
                    phone=phone,
                    verification_type='phone',
                    is_verified=False,
                    expires_at__gt=timezone.now()
                ).first()
                
                if existing_otp:
                    # Check if it's within the 60-second cooldown period
                    time_diff = timezone.now() - existing_otp.created_at
                    if time_diff < timezone.timedelta(seconds=60):
                        remaining_seconds = 60 - int(time_diff.total_seconds())
                        return Response({
                            'success': False,
                            'message': f'Please wait {remaining_seconds} seconds before requesting a new OTP',
                            'retry_after': remaining_seconds,
                            'countdown': remaining_seconds
                        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
                    else:
                        existing_otp.delete()
            
            # Create new OTP session
            if verification_type == 'email' and email:
                otp_session = OTPSession.objects.create(
                    email=email,
                    verification_type='email'
                )
                
                # Send email
                success = self.send_email_otp(email, otp_session.otp_code, username)
                
                if success:
                    return Response({
                        'success': True,
                        'message': 'OTP sent to your email successfully'
                    })
                else:
                    otp_session.delete()
                    return Response({
                        'success': False,
                        'message': 'Failed to send email. Please try again.'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            elif verification_type == 'login' and email:
                otp_session = OTPSession.objects.create(
                    email=email,
                    verification_type='login'
                )
                
                # Send login OTP email
                success = self.send_login_otp(email, otp_session.otp_code)
                
                if success:
                    return Response({
                        'success': True,
                        'message': 'Login OTP sent to your email successfully'
                    })
                else:
                    otp_session.delete()
                    return Response({
                        'success': False,
                        'message': 'Failed to send login OTP. Please try again.'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            elif verification_type == 'phone' and phone:
                otp_session = OTPSession.objects.create(
                    phone=phone,
                    verification_type='phone'
                )
                
                # For development, just log the OTP
                logger.info(f"SMS OTP for {phone}: {otp_session.otp_code}")
                print(f"SMS OTP for {phone}: {otp_session.otp_code}")  # Console output for development
                
                return Response({
                    'success': True,
                    'message': 'OTP sent to your mobile number successfully'
                })
            
            else:
                return Response({
                    'success': False,
                    'message': 'Invalid verification type or missing contact information'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error sending OTP: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to send OTP. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def send_email_otp(self, email, otp_code, username=None):
        """Send OTP via email using professional HTML template"""
        try:
            from .email_utils import get_logo_url
            
            subject = 'Koluvu - Email Verification Code'
            
            # Try to get username from email if not provided
            if not username:
                # Extract potential username from email (before @)
                username = email.split('@')[0]
            
            # Context for the template
            context = {
                'otp_code': otp_code,
                'username': username,
                'registration_url': f"{settings.FRONTEND_URL}/auth/register/employee",
                'frontend_url': settings.FRONTEND_URL,
                'logo_url': get_logo_url(),
                'user_email': email,
                'company_name': 'Koluvu',
                'support_email': settings.DEFAULT_FROM_EMAIL,
                'current_year': timezone.now().year
            }
            
            # Render HTML content (using simple template to avoid Gmail clipping)
            html_content = render_to_string('emails/otp_verification_simple.html', context)
            
            # Plain text fallback
            text_content = f"""
Hello {username}!

Welcome to Koluvu! Your email verification code is: {otp_code}

This code is valid for 30 minutes. Please do not share this code with anyone.

If you didn't request this verification, please ignore this email.

To complete your registration, please login at: {settings.FRONTEND_URL}/auth/login/employee

Best regards,
Koluvu Team

---
About Koluvu: We are India's leading job portal connecting talented professionals with their dream careers.

© {timezone.now().year} Koluvu Jobs. All rights reserved.
            """
            
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            
            # Create EmailMultiAlternatives object for HTML email
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipient_list
            )
            
            # Attach HTML content
            email_message.attach_alternative(html_content, "text/html")
            
            # Send email
            email_message.send(fail_silently=False)
            
            logger.info(f"Professional HTML OTP email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send OTP email to {email}: {str(e)}")
            return False
    
    def send_password_reset_otp(self, email, otp_code):
        """Send password reset OTP via email using professional HTML template"""
        try:
            from .email_utils import get_logo_url
            
            subject = 'Koluvu - Password Reset Code'
            
            # Context for the template
            context = {
                'otp_code': otp_code,
                'user_email': email,
                'frontend_url': settings.FRONTEND_URL,
                'logo_url': get_logo_url(),
                'reset_url': f"{settings.FRONTEND_URL}/auth/reset-password",
                'login_url': f"{settings.FRONTEND_URL}/auth/login",
                'current_year': timezone.now().year
            }
            
            # Render HTML content
            html_content = render_to_string('emails/password_reset_otp.html', context)
            
            # Plain text fallback
            text_content = f"""
Hello,

We received a request to reset your password for {email}.

Your password reset code is: {otp_code}

This code is valid for 30 minutes. If you didn't request this reset, please ignore this email.

Best regards,
Koluvu Team

© {timezone.now().year} Koluvu Jobs. All rights reserved.
            """
            
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            
            # Create EmailMultiAlternatives object for HTML email
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipient_list
            )
            
            # Attach HTML content
            email_message.attach_alternative(html_content, "text/html")
            
            # Send email
            email_message.send(fail_silently=False)
            
            logger.info(f"Password reset OTP email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send password reset OTP email to {email}: {str(e)}")
            return False
    
    def send_login_otp(self, email, otp_code):
        """Send login OTP via email using professional HTML template"""
        try:
            from .email_utils import get_logo_url
            
            subject = 'Koluvu - Login Verification Code'
            
            # Context for the template
            context = {
                'otp_code': otp_code,
                'user_email': email,
                'frontend_url': settings.FRONTEND_URL,
                'logo_url': get_logo_url(),
                'login_url': f"{settings.FRONTEND_URL}/auth/login",
                'current_year': timezone.now().year
            }
            
            # Render HTML content
            html_content = render_to_string('emails/login_otp.html', context)
            
            # Plain text fallback
            text_content = f"""
Hello,

We received a login attempt for {email}.

Your login verification code is: {otp_code}

This code is valid for 30 minutes. If you didn't attempt to log in, please secure your account.

Best regards,
Koluvu Team

© {timezone.now().year} Koluvu Jobs. All rights reserved.
            """
            
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            
            # Create EmailMultiAlternatives object for HTML email
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipient_list
            )
            
            # Attach HTML content
            email_message.attach_alternative(html_content, "text/html")
            
            # Send email
            email_message.send(fail_silently=False)
            
            logger.info(f"Login OTP email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send login OTP email to {email}: {str(e)}")
            return False
    
    def send_welcome_email(self, user_email, user_name=None):
        """Send welcome email after successful registration"""
        try:
            from .email_utils import get_logo_url
            
            subject = 'Welcome to Koluvu - Your Career Journey Begins!'
            
            # Context for the template
            context = {
                'user_name': user_name or user_email.split('@')[0].title(),
                'user_email': user_email,
                'frontend_url': settings.FRONTEND_URL,
                'logo_url': get_logo_url(),
                'profile_url': f"{settings.FRONTEND_URL}/dashboard/profile",
                'jobs_url': f"{settings.FRONTEND_URL}/jobs",
                'current_year': timezone.now().year
            }
            
            # Render HTML content
            html_content = render_to_string('emails/welcome.html', context)
            
            # Plain text fallback
            text_content = f"""
Welcome to Koluvu, {user_name or user_email.split('@')[0].title()}!

Congratulations! Your account has been successfully created.

We're excited to help you discover amazing career opportunities and connect with your dream job.

What you can do with Koluvu:
• Smart Job Search - AI-powered job matching
• Profile Analytics - Track your progress
• Company Insights - Detailed company information
• Career Growth - Skill assessments and training

Ready to get started?
Complete your profile: {settings.FRONTEND_URL}/dashboard/profile
Browse jobs: {settings.FRONTEND_URL}/jobs

Need help? Contact us at support@koluvu.com

Best regards,
Koluvu Team

© {timezone.now().year} Koluvu Jobs. All rights reserved.
Building careers, connecting futures.
            """
            
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user_email]
            
            # Create EmailMultiAlternatives object for HTML email
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipient_list
            )
            
            # Attach HTML content
            email_message.attach_alternative(html_content, "text/html")
            
            # Send email
            email_message.send(fail_silently=False)
            
            logger.info(f"Welcome email sent successfully to {user_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send welcome email to {user_email}: {str(e)}")
            return False
    

class VerifyOTPView(APIView):
    """Verify OTP for email or mobile verification"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            phone = request.data.get('phone')
            otp = request.data.get('otp')
            verification_type = request.data.get('type', 'email')
            
            if not otp:
                return Response({
                    'success': False,
                    'message': 'OTP is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Find OTP session
            otp_session = None
            
            if verification_type == 'email' and email:
                otp_session = OTPSession.objects.filter(
                    email=email,
                    verification_type='email',
                    is_verified=False
                ).order_by('-created_at').first()
                
            elif verification_type == 'login' and email:
                otp_session = OTPSession.objects.filter(
                    email=email,
                    verification_type='login',
                    is_verified=False
                ).order_by('-created_at').first()
                
            elif verification_type == 'phone' and phone:
                otp_session = OTPSession.objects.filter(
                    phone=phone,
                    verification_type='phone',
                    is_verified=False
                ).order_by('-created_at').first()
            
            if not otp_session:
                return Response({
                    'success': False,
                    'message': 'No valid OTP session found. Please request a new OTP.'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Check if OTP session is expired
            if otp_session.is_expired():
                return Response({
                    'success': False,
                    'message': 'OTP has expired. Please request a new one.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if maximum attempts exceeded
            if not otp_session.can_attempt():
                return Response({
                    'success': False,
                    'message': 'Maximum OTP attempts exceeded. Please request a new OTP.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Increment attempts
            otp_session.attempts += 1
            otp_session.save()
            
            # Verify OTP
            if otp_session.otp_code == otp:
                otp_session.is_verified = True
                otp_session.save()
                
                # Send welcome email after successful registration verification
                if verification_type == 'email' and email:
                    try:
                        # Try to get user's name from User model if they exist
                        user_name = None
                        try:
                            user = User.objects.get(email=email)
                            user_name = f"{user.first_name} {user.last_name}".strip() or user.username
                        except User.DoesNotExist:
                            user_name = email.split('@')[0].title()
                        
                        self.send_welcome_email(email, user_name)
                    except Exception as e:
                        logger.warning(f"Failed to send welcome email to {email}: {str(e)}")
                        # Don't fail the OTP verification if welcome email fails
                
                return Response({
                    'success': True,
                    'message': f'{verification_type.title()} verified successfully'
                })
            else:
                return Response({
                    'success': False,
                    'message': f'Invalid OTP. {otp_session.max_attempts - otp_session.attempts} attempts remaining.'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error verifying OTP: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to verify OTP. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrentUserView(APIView):
    """
    Get current authenticated user's details
    Used for authorization checks in Next.js API routes
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Return current user's basic information"""
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })
