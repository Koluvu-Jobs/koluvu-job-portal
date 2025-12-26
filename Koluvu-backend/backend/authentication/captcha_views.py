from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
import requests
import logging
import secrets
import string
from django.core.cache import cache
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import base64

logger = logging.getLogger(__name__)


class CaptchaView(APIView):
    """
    Generate and serve CAPTCHA challenges
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Generate a new CAPTCHA challenge
        """
        try:
            # Generate CAPTCHA
            captcha_key, captcha_text, captcha_image = self.generate_captcha()
            
            # Store in cache for 5 minutes
            cache.set(f"captcha:{captcha_key}", captcha_text, 300)
            
            return Response({
                'success': True,
                'captcha_key': captcha_key,
                'captcha_image': captcha_image
            })
            
        except Exception as e:
            logger.error(f"Error generating CAPTCHA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to generate CAPTCHA'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def generate_captcha(self):
        """
        Generate a simple CAPTCHA image with minimum 8 characters
        """
        # Generate random text (minimum 8 characters)
        captcha_text = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        captcha_key = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(16))
        
        # Create image (wider for 8 characters)
        width, height = 200, 50
        image = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(image)
        
        # Try to use a simple font
        try:
            # Use default PIL font
            font_size = 24
        except:
            font_size = 20
        
        # Draw text
        text_width = len(captcha_text) * 18
        text_height = 20
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        draw.text((x, y), captcha_text, fill='black')
        
        # Add some noise
        for _ in range(50):
            x1 = secrets.randbelow(width)
            y1 = secrets.randbelow(height)
            draw.point((x1, y1), fill='gray')
        
        # Convert to base64
        buffer = BytesIO()
        image.save(buffer, format='PNG')
        image_data = base64.b64encode(buffer.getvalue()).decode()
        captcha_image = f"data:image/png;base64,{image_data}"
        
        return captcha_key, captcha_text, captcha_image


class VerifyCaptchaView(APIView):
    """
    Verify CAPTCHA responses
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Verify CAPTCHA response
        """
        try:
            captcha_key = request.data.get('captcha_key')
            captcha_value = request.data.get('captcha_value')
            
            if not captcha_key or not captcha_value:
                return Response({
                    'success': False,
                    'error': 'CAPTCHA key and value are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify CAPTCHA from cache
            stored_text = cache.get(f"captcha:{captcha_key}")
            if stored_text is None:
                return Response({
                    'success': False,
                    'verified': False,
                    'error': 'CAPTCHA expired or invalid'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if stored_text.upper() == captcha_value.upper():
                # Delete the used CAPTCHA
                cache.delete(f"captcha:{captcha_key}")
                return Response({
                    'success': True,
                    'verified': True
                })
            else:
                return Response({
                    'success': False,
                    'verified': False,
                    'error': 'Invalid CAPTCHA'
                }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error verifying CAPTCHA: {str(e)}")
            return Response({
                'success': False,
                'error': 'CAPTCHA verification failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReCaptchaView(APIView):
    """
    Google reCAPTCHA v3 verification
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Verify Google reCAPTCHA v3 token
        """
        try:
            recaptcha_token = request.data.get('recaptcha_token')
            action = request.data.get('action', 'submit')
            
            if not recaptcha_token:
                return Response({
                    'success': False,
                    'error': 'reCAPTCHA token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # In development mode, skip reCAPTCHA verification
            if settings.DEBUG and recaptcha_token == 'test-token':
                return Response({
                    'success': True,
                    'verified': True,
                    'score': 0.9,
                    'action': action,
                    'message': 'Development mode - reCAPTCHA verified'
                })
            
            # Verify with Google
            verify_url = 'https://www.google.com/recaptcha/api/siteverify'
            data = {
                'secret': settings.RECAPTCHA_PRIVATE_KEY,
                'response': recaptcha_token,
                'remoteip': self.get_client_ip(request)
            }
            
            response = requests.post(verify_url, data=data)
            result = response.json()
            
            if result.get('success'):
                score = result.get('score', 0)
                verified_action = result.get('action', '')
                
                # Check score threshold
                if score >= settings.RECAPTCHA_REQUIRED_SCORE:
                    return Response({
                        'success': True,
                        'verified': True,
                        'score': score,
                        'action': verified_action
                    })
                else:
                    logger.warning(
                        f"reCAPTCHA score too low: {score} (required: {settings.RECAPTCHA_REQUIRED_SCORE})"
                    )
                    return Response({
                        'success': False,
                        'verified': False,
                        'error': 'reCAPTCHA verification failed - score too low',
                        'score': score
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                error_codes = result.get('error-codes', [])
                logger.error(f"reCAPTCHA verification failed: {error_codes}")
                return Response({
                    'success': False,
                    'verified': False,
                    'error': 'reCAPTCHA verification failed',
                    'error_codes': error_codes
                }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error verifying reCAPTCHA: {str(e)}")
            return Response({
                'success': False,
                'error': 'reCAPTCHA verification failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


def verify_captcha_required(captcha_key, captcha_value):
    """
    Helper function to verify CAPTCHA in other views
    Returns (is_valid, error_message)
    """
    try:
        if not captcha_key or not captcha_value:
            return False, "CAPTCHA is required"
        
        # Check cache
        stored_text = cache.get(f"captcha:{captcha_key}")
        if stored_text is None:
            return False, "CAPTCHA expired or invalid"
        
        if stored_text.upper() == captcha_value.upper():
            cache.delete(f"captcha:{captcha_key}")
            return True, None
        else:
            return False, "Invalid CAPTCHA"
            
    except Exception as e:
        logger.error(f"CAPTCHA verification error: {str(e)}")
        return False, "CAPTCHA verification failed"


def verify_recaptcha_required(recaptcha_token, action='submit'):
    """
    Helper function to verify reCAPTCHA in other views
    Returns (is_valid, error_message, score)
    """
    try:
        # In development mode, accept test token
        if settings.DEBUG and recaptcha_token == 'test-token':
            return True, None, 0.9
        
        if not recaptcha_token:
            return False, "reCAPTCHA is required", 0
        
        # Verify with Google
        verify_url = 'https://www.google.com/recaptcha/api/siteverify'
        data = {
            'secret': settings.RECAPTCHA_PRIVATE_KEY,
            'response': recaptcha_token
        }
        
        response = requests.post(verify_url, data=data)
        result = response.json()
        
        if result.get('success'):
            score = result.get('score', 0)
            if score >= settings.RECAPTCHA_REQUIRED_SCORE:
                return True, None, score
            else:
                return False, f"reCAPTCHA score too low ({score})", score
        else:
            error_codes = result.get('error-codes', [])
            return False, f"reCAPTCHA verification failed: {error_codes}", 0
            
    except Exception as e:
        logger.error(f"reCAPTCHA verification error: {str(e)}")
        return False, "reCAPTCHA verification failed", 0