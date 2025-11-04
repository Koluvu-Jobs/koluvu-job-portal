from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django_otp.models import Device
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_static.models import StaticDevice, StaticToken
from django_otp.util import random_hex
from authentication.models import UserActivity, UserSession
import qrcode
from io import BytesIO
import base64
import logging

logger = logging.getLogger(__name__)


class Setup2FAView(APIView):
    """
    Set up Two-Factor Authentication for a user
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            
            # Check if user already has 2FA enabled
            if TOTPDevice.objects.filter(user=user, confirmed=True).exists():
                return Response({
                    'success': False,
                    'error': '2FA is already enabled for this account'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Delete any unconfirmed devices
            TOTPDevice.objects.filter(user=user, confirmed=False).delete()
            
            # Create new TOTP device
            device = TOTPDevice.objects.create(
                user=user,
                name=f'{user.username}-totp',
                confirmed=False
            )
            
            # Generate QR code
            qr_url = device.config_url
            qr_img = qrcode.make(qr_url)
            
            # Convert QR code to base64
            buffer = BytesIO()
            qr_img.save(buffer, format='PNG')
            qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            # Generate backup codes
            static_device = StaticDevice.objects.create(
                user=user,
                name=f'{user.username}-backup'
            )
            
            backup_codes = []
            for _ in range(10):
                token = StaticToken.objects.create(
                    device=static_device,
                    token=random_hex(length=10)
                )
                backup_codes.append(token.token)
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='settings_change',
                description='2FA setup initiated',
                metadata={'setup_type': '2fa_totp'},
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'success': True,
                'qr_code': f'data:image/png;base64,{qr_code_base64}',
                'secret_key': device.key,
                'backup_codes': backup_codes,
                'device_id': device.id,
                'message': 'Scan the QR code with your authenticator app and verify with a code'
            })
            
        except Exception as e:
            logger.error(f"Error setting up 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to set up 2FA'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class Verify2FASetupView(APIView):
    """
    Verify 2FA setup with a TOTP code
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            token = request.data.get('token')
            device_id = request.data.get('device_id')
            
            if not token or not device_id:
                return Response({
                    'success': False,
                    'error': 'Token and device ID are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the device
            try:
                device = TOTPDevice.objects.get(id=device_id, user=user, confirmed=False)
            except TOTPDevice.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Invalid device or device already confirmed'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Verify token
            if device.verify_token(token):
                device.confirmed = True
                device.save()
                
                # Log activity
                UserActivity.objects.create(
                    user=user,
                    activity_type='settings_change',
                    description='2FA setup completed',
                    metadata={'setup_type': '2fa_totp', 'device_id': device.id},
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                return Response({
                    'success': True,
                    'message': '2FA has been successfully enabled'
                })
            else:
                return Response({
                    'success': False,
                    'error': 'Invalid token. Please try again.'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error verifying 2FA setup: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to verify 2FA setup'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class Disable2FAView(APIView):
    """
    Disable Two-Factor Authentication
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            password = request.data.get('password')
            token = request.data.get('token')  # 2FA token or backup code
            
            if not password:
                return Response({
                    'success': False,
                    'error': 'Password is required to disable 2FA'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify password
            if not user.check_password(password):
                return Response({
                    'success': False,
                    'error': 'Invalid password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if 2FA is enabled
            totp_devices = TOTPDevice.objects.filter(user=user, confirmed=True)
            if not totp_devices.exists():
                return Response({
                    'success': False,
                    'error': '2FA is not enabled for this account'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify 2FA token if provided
            if token:
                # Try TOTP first
                verified = False
                for device in totp_devices:
                    if device.verify_token(token):
                        verified = True
                        break
                
                # Try backup codes if TOTP fails
                if not verified:
                    static_devices = StaticDevice.objects.filter(user=user)
                    for device in static_devices:
                        if device.verify_token(token):
                            verified = True
                            break
                
                if not verified:
                    return Response({
                        'success': False,
                        'error': 'Invalid 2FA token'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Disable 2FA
            TOTPDevice.objects.filter(user=user).delete()
            StaticDevice.objects.filter(user=user).delete()
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='settings_change',
                description='2FA disabled',
                metadata={'action': '2fa_disabled'},
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'success': True,
                'message': '2FA has been disabled'
            })
            
        except Exception as e:
            logger.error(f"Error disabling 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to disable 2FA'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class Check2FAStatusView(APIView):
    """
    Check if 2FA is enabled for the user
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            
            # Check for confirmed TOTP devices
            totp_enabled = TOTPDevice.objects.filter(user=user, confirmed=True).exists()
            
            # Get backup codes count
            backup_codes_count = 0
            static_devices = StaticDevice.objects.filter(user=user)
            for device in static_devices:
                backup_codes_count += StaticToken.objects.filter(device=device).count()
            
            return Response({
                'success': True,
                'is_2fa_enabled': totp_enabled,
                'backup_codes_remaining': backup_codes_count,
                'devices': [
                    {
                        'id': device.id,
                        'name': device.name,
                        'confirmed': device.confirmed,
                        'created': device.key  # Don't expose the actual key
                    }
                    for device in TOTPDevice.objects.filter(user=user)
                ]
            })
            
        except Exception as e:
            logger.error(f"Error checking 2FA status: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to check 2FA status'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Regenerate2FABackupCodesView(APIView):
    """
    Regenerate backup codes for 2FA
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            password = request.data.get('password')
            
            if not password:
                return Response({
                    'success': False,
                    'error': 'Password is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify password
            if not user.check_password(password):
                return Response({
                    'success': False,
                    'error': 'Invalid password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if 2FA is enabled
            if not TOTPDevice.objects.filter(user=user, confirmed=True).exists():
                return Response({
                    'success': False,
                    'error': '2FA must be enabled to generate backup codes'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Delete existing backup codes
            StaticDevice.objects.filter(user=user).delete()
            
            # Generate new backup codes
            static_device = StaticDevice.objects.create(
                user=user,
                name=f'{user.username}-backup'
            )
            
            backup_codes = []
            for _ in range(10):
                token = StaticToken.objects.create(
                    device=static_device,
                    token=random_hex(length=10)
                )
                backup_codes.append(token.token)
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='settings_change',
                description='2FA backup codes regenerated',
                metadata={'action': 'backup_codes_regenerated'},
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'success': True,
                'backup_codes': backup_codes,
                'message': 'New backup codes generated. Please save them securely.'
            })
            
        except Exception as e:
            logger.error(f"Error regenerating backup codes: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to regenerate backup codes'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ActiveSessionsView(APIView):
    """
    View and manage active user sessions
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Get all active sessions for the user
        """
        try:
            user = request.user
            
            # Get active sessions
            sessions = UserSession.objects.filter(
                user=user,
                is_active=True
            ).order_by('-last_activity')
            
            sessions_data = []
            current_session_id = request.session.session_key
            
            for session in sessions:
                session_data = {
                    'id': session.id,
                    'device_type': session.device_type,
                    'device_info': session.device_info,
                    'ip_address': session.ip_address,
                    'location': session.get_location_display(),
                    'login_time': session.login_time,
                    'last_activity': session.last_activity,
                    'is_current': session.session_id == current_session_id,
                    'user_agent': session.user_agent[:100] + '...' if len(session.user_agent) > 100 else session.user_agent
                }
                sessions_data.append(session_data)
            
            return Response({
                'success': True,
                'sessions': sessions_data,
                'total_sessions': len(sessions_data)
            })
            
        except Exception as e:
            logger.error(f"Error getting active sessions: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to get active sessions'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        """
        Terminate specific sessions
        """
        try:
            user = request.user
            session_ids = request.data.get('session_ids', [])
            terminate_all_others = request.data.get('terminate_all_others', False)
            
            current_session_id = request.session.session_key
            
            if terminate_all_others:
                # Terminate all sessions except current
                terminated_count = UserSession.objects.filter(
                    user=user,
                    is_active=True
                ).exclude(session_id=current_session_id).update(is_active=False)
                
                message = f'Terminated {terminated_count} other sessions'
            
            elif session_ids:
                # Terminate specific sessions
                terminated_count = UserSession.objects.filter(
                    user=user,
                    id__in=session_ids,
                    is_active=True
                ).exclude(session_id=current_session_id).update(is_active=False)
                
                message = f'Terminated {terminated_count} sessions'
            
            else:
                return Response({
                    'success': False,
                    'error': 'No sessions specified for termination'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='settings_change',
                description='Sessions terminated',
                metadata={
                    'action': 'sessions_terminated',
                    'session_ids': session_ids,
                    'terminate_all_others': terminate_all_others,
                    'terminated_count': terminated_count
                },
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'success': True,
                'message': message,
                'terminated_count': terminated_count
            })
            
        except Exception as e:
            logger.error(f"Error terminating sessions: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to terminate sessions'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip