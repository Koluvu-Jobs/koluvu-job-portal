from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from authentication.models import SocialAccount
import logging

logger = logging.getLogger(__name__)


class SetPasswordView(APIView):
    """
    Allow users who signed up with OAuth (Google, GitHub, LinkedIn) to set their password
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            new_password = request.data.get('password')
            confirm_password = request.data.get('confirm_password')
            
            # Validate input
            if not new_password or not confirm_password:
                return Response({
                    'success': False,
                    'error': 'Both password and confirm_password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if new_password != confirm_password:
                return Response({
                    'success': False,
                    'error': 'Passwords do not match'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate password strength
            try:
                validate_password(new_password, user)
            except ValidationError as e:
                return Response({
                    'success': False,
                    'error': list(e.messages)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user signed up via OAuth
            has_social_account = SocialAccount.objects.filter(user=user).exists()
            
            if not has_social_account and user.has_usable_password():
                return Response({
                    'success': False,
                    'error': 'This account already has a password. Use change password instead.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set the password
            user.set_password(new_password)
            user.save()
            
            logger.info(f"Password set for OAuth user: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Password set successfully. You can now login with email and password.'
            })
            
        except Exception as e:
            logger.error(f"Error setting password: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to set password. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordView(APIView):
    """
    Allow users to change their existing password
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')
            
            # Validate input
            if not current_password or not new_password or not confirm_password:
                return Response({
                    'success': False,
                    'error': 'Current password, new password, and confirm password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if new_password != confirm_password:
                return Response({
                    'success': False,
                    'error': 'New passwords do not match'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user has a password (not OAuth-only user)
            if not user.has_usable_password():
                return Response({
                    'success': False,
                    'error': 'This account was created with social login. Please set a password first.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify current password
            if not user.check_password(current_password):
                return Response({
                    'success': False,
                    'error': 'Current password is incorrect'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate new password strength
            try:
                validate_password(new_password, user)
            except ValidationError as e:
                return Response({
                    'success': False,
                    'error': list(e.messages)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Change the password
            user.set_password(new_password)
            user.save()
            
            logger.info(f"Password changed for user: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Password changed successfully'
            })
            
        except Exception as e:
            logger.error(f"Error changing password: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to change password. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckPasswordStatusView(APIView):
    """
    Check if user has a password set or is OAuth-only
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            has_password = user.has_usable_password()
            has_social_account = SocialAccount.objects.filter(user=user).exists()
            
            # Get social account providers
            social_accounts = SocialAccount.objects.filter(user=user).values_list('provider', flat=True)
            
            return Response({
                'success': True,
                'has_password': has_password,
                'has_social_account': has_social_account,
                'social_providers': list(social_accounts),
                'can_set_password': has_social_account and not has_password,
                'can_change_password': has_password
            })
            
        except Exception as e:
            logger.error(f"Error checking password status: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to check password status'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ForgotPasswordView(APIView):
    """
    Handle password reset requests
    """
    permission_classes = []
    
    def post(self, request):
        try:
            email = request.data.get('email')
            
            if not email:
                return Response({
                    'success': False,
                    'error': 'Email is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Don't reveal if email exists or not for security
                return Response({
                    'success': True,
                    'message': 'If an account with this email exists, a password reset link will be sent.'
                })
            
            # Check if user has social accounts only
            has_social_account = SocialAccount.objects.filter(user=user).exists()
            has_password = user.has_usable_password()
            
            if has_social_account and not has_password:
                # OAuth-only user
                return Response({
                    'success': False,
                    'error': 'This account uses social login. Please sign in with your social account and set a password in settings.',
                    'social_only': True
                })
            
            # Create OTP for password reset
            from authentication.models import OTPSession
            otp_session = OTPSession.create_otp_session(
                identifier=email,
                verification_type='password_reset',
                user=user
            )
            
            # Send password reset OTP
            from authentication.views import SendOTPView
            send_otp_view = SendOTPView()
            email_sent = send_otp_view.send_password_reset_otp(email, otp_session.otp_code)
            
            if not email_sent:
                return Response({
                    'success': False,
                    'error': 'Failed to send password reset email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.info(f"Password reset OTP sent to: {email}")
            
            return Response({
                'success': True,
                'message': 'Password reset code sent to your email'
            })
            
        except Exception as e:
            logger.error(f"Error in forgot password: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to process password reset request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    """
    Reset password using OTP
    """
    permission_classes = []
    
    def post(self, request):
        try:
            email = request.data.get('email')
            otp_code = request.data.get('otp')
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')
            
            # Validate input
            if not email or not otp_code or not new_password or not confirm_password:
                return Response({
                    'success': False,
                    'error': 'All fields are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if new_password != confirm_password:
                return Response({
                    'success': False,
                    'error': 'Passwords do not match'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify OTP
            from authentication.models import OTPSession
            session, message = OTPSession.verify_otp(
                identifier=email,
                otp_code=otp_code,
                verification_type='password_reset'
            )
            
            if not session:
                return Response({
                    'success': False,
                    'error': message
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Validate password strength
            try:
                validate_password(new_password, user)
            except ValidationError as e:
                return Response({
                    'success': False,
                    'error': list(e.messages)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Reset password
            user.set_password(new_password)
            user.save()
            
            logger.info(f"Password reset successful for: {email}")
            
            return Response({
                'success': True,
                'message': 'Password reset successfully. You can now login with your new password.'
            })
            
        except Exception as e:
            logger.error(f"Error resetting password: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to reset password'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)