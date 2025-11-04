from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited
from django.contrib.auth.models import User
from authentication.models import UserActivity, UserSession
import logging
import json
import time

logger = logging.getLogger('security')


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Add security headers to all responses
    """
    
    def process_response(self, request, response):
        # Content Security Policy
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://api.github.com https://api.linkedin.com; "
            "frame-src 'self' https://www.google.com;"
        )
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy
        response['Permissions-Policy'] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=(), "
            "usb=(), "
            "magnetometer=(), "
            "gyroscope=(), "
            "speaker=()"
        )
        
        # Additional security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Remove server information
        if 'Server' in response:
            del response['Server']
        
        return response


class RateLimitMiddleware(MiddlewareMixin):
    """
    Advanced rate limiting middleware
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        super().__init__(get_response)
    
    def process_request(self, request):
        # Skip rate limiting for certain paths
        exempt_paths = [
            '/admin/',
            '/static/',
            '/media/',
            '/api/auth/verify-token/',  # Allow token verification
        ]
        
        if any(request.path.startswith(path) for path in exempt_paths):
            return None
        
        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        
        # Define rate limits for different endpoints
        rate_limits = {
            '/api/auth/login/': '5/m',  # 5 attempts per minute for login
            '/api/auth/register/': '3/m',  # 3 attempts per minute for registration
            '/api/auth/send-otp/': '3/m',  # 3 OTP requests per minute
            '/api/auth/password/forgot/': '3/m',  # 3 password reset per minute
            '/api/': '100/m',  # 100 API calls per minute for general API
        }
        
        # Apply rate limiting
        for path_pattern, limit in rate_limits.items():
            if request.path.startswith(path_pattern):
                try:
                    # Create a key for this IP and endpoint
                    cache_key = f"ratelimit:{ip}:{path_pattern}"
                    
                    # Apply rate limiting logic
                    if self.is_rate_limited(cache_key, limit):
                        logger.warning(
                            f"Rate limit exceeded for IP {ip} on endpoint {request.path}",
                            extra={
                                'ip': ip,
                                'path': request.path,
                                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                                'method': request.method
                            }
                        )
                        return HttpResponseForbidden(
                            json.dumps({
                                'error': 'Rate limit exceeded. Please try again later.',
                                'retry_after': 60
                            }),
                            content_type='application/json'
                        )
                except Exception as e:
                    logger.error(f"Rate limiting error: {e}")
                break
        
        return None
    
    def is_rate_limited(self, cache_key, limit):
        """
        Simple rate limiting implementation using Django cache
        """
        from django.core.cache import cache
        
        # Parse limit (e.g., "5/m" means 5 per minute)
        count, period = limit.split('/')
        count = int(count)
        
        period_seconds = {
            's': 1,
            'm': 60,
            'h': 3600,
            'd': 86400
        }.get(period, 60)
        
        # Get current count
        current_count = cache.get(cache_key, 0)
        
        if current_count >= count:
            return True
        
        # Increment count
        cache.set(cache_key, current_count + 1, period_seconds)
        return False


class ActivityTrackingMiddleware(MiddlewareMixin):
    """
    Track user activities for security auditing
    """
    
    def process_request(self, request):
        # Skip tracking for static files and admin
        if request.path.startswith(('/static/', '/media/', '/admin/favicon.ico')):
            return None
        
        # Track request start time
        request._activity_start_time = time.time()
        return None
    
    def process_response(self, request, response):
        # Skip tracking for certain paths
        if request.path.startswith(('/static/', '/media/')):
            return response
        
        # Only track for authenticated users
        if hasattr(request, 'user') and request.user.is_authenticated:
            try:
                # Get processing time
                processing_time = None
                if hasattr(request, '_activity_start_time'):
                    processing_time = time.time() - request._activity_start_time
                
                # Get client info
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip = x_forwarded_for.split(',')[0]
                else:
                    ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
                
                user_agent = request.META.get('HTTP_USER_AGENT', '')
                
                # Determine activity type
                activity_type = self.get_activity_type(request)
                
                # Create activity record
                if activity_type:
                    metadata = {
                        'method': request.method,
                        'path': request.path,
                        'status_code': response.status_code,
                        'processing_time': processing_time,
                        'query_params': dict(request.GET) if request.GET else {},
                    }
                    
                    # Don't log sensitive data in POST requests
                    if request.method == 'POST' and request.content_type == 'application/json':
                        # Only log non-sensitive fields
                        try:
                            data = json.loads(request.body) if request.body else {}
                            safe_data = {}
                            sensitive_fields = ['password', 'token', 'otp', 'secret']
                            
                            for key, value in data.items():
                                if not any(field in key.lower() for field in sensitive_fields):
                                    safe_data[key] = value
                                else:
                                    safe_data[key] = '[REDACTED]'
                            
                            metadata['post_data'] = safe_data
                        except:
                            metadata['post_data'] = '[INVALID_JSON]'
                    
                    UserActivity.objects.create(
                        user=request.user,
                        activity_type=activity_type,
                        description=f"{request.method} {request.path}",
                        metadata=metadata,
                        ip_address=ip,
                        user_agent=user_agent
                    )
                    
            except Exception as e:
                logger.error(f"Activity tracking error: {e}")
        
        return response
    
    def get_activity_type(self, request):
        """
        Determine activity type based on request path and method
        """
        path = request.path.lower()
        
        if 'login' in path:
            return 'login'
        elif 'logout' in path:
            return 'logout'
        elif 'register' in path:
            return 'profile_update'
        elif 'password' in path:
            return 'settings_change'
        elif 'upload' in path:
            return 'upload'
        elif 'download' in path:
            return 'download'
        elif request.method == 'GET' and any(keyword in path for keyword in ['search', 'filter']):
            return 'search'
        elif request.method == 'GET':
            return 'view'
        else:
            return None


class SuspiciousActivityMiddleware(MiddlewareMixin):
    """
    Detect and respond to suspicious activities
    """
    
    def process_request(self, request):
        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
        
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Check for suspicious patterns
        suspicious_patterns = [
            # Common bot user agents
            'bot', 'crawler', 'spider', 'scraper',
            # Security scanners
            'nikto', 'sqlmap', 'nessus', 'burp',
            # Suspicious requests
            'script', 'eval', 'javascript:', 'vbscript:',
        ]
        
        if any(pattern in user_agent.lower() for pattern in suspicious_patterns):
            logger.warning(
                f"Suspicious user agent detected from IP {ip}",
                extra={
                    'ip': ip,
                    'user_agent': user_agent,
                    'path': request.path,
                    'method': request.method
                }
            )
            # Could implement blocking here if needed
        
        # Check for common attack patterns in URL
        attack_patterns = [
            '../', '..\\', '/etc/passwd', '/proc/', 'cmd.exe',
            'union+select', 'script>', 'javascript:', 'eval(',
            'base64_decode', 'file_get_contents'
        ]
        
        full_path = request.get_full_path()
        if any(pattern in full_path.lower() for pattern in attack_patterns):
            logger.critical(
                f"Potential attack attempt detected from IP {ip}",
                extra={
                    'ip': ip,
                    'user_agent': user_agent,
                    'path': full_path,
                    'method': request.method
                }
            )
            return HttpResponseForbidden(
                json.dumps({'error': 'Suspicious activity detected'}),
                content_type='application/json'
            )
        
        return None