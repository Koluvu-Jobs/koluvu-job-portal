"""
Middleware for automatic encryption/decryption of sensitive data
"""
from django.utils.deprecation import MiddlewareMixin
from .encryption import encrypt_user_data, decrypt_user_data
import json
import logging

logger = logging.getLogger(__name__)


class DataEncryptionMiddleware(MiddlewareMixin):
    """
    Middleware to automatically encrypt sensitive data in responses
    and decrypt it in requests
    """
    
    SENSITIVE_ENDPOINTS = [
        '/api/employer/profile/',
        '/api/employee/profile/',
        '/api/employer/jobs/',
        '/api/employee/applications/',
    ]
    
    SENSITIVE_FIELDS = [
        'phone', 'phone_number', 'contact_phone', 'employer_phone',
        'contact_email', 'employer_email', 'candidate_email',
        'address', 'location', 'company_location',
        'contact_person', 'candidate_name', 'employer_name',
    ]
    
    def should_process_request(self, request):
        """Check if request should be processed for encryption"""
        return any(endpoint in request.path for endpoint in self.SENSITIVE_ENDPOINTS)
    
    def process_request(self, request):
        """
        Decrypt incoming data if it contains encrypted fields
        """
        if not self.should_process_request(request):
            return None
        
        try:
            # Get content type and normalize to lowercase
            content_type = request.META.get('CONTENT_TYPE', '').lower()
            
            # Skip multipart/form-data requests (file uploads)
            if content_type.startswith('multipart/'):
                return None
            
            # Skip binary data requests
            if 'application/octet-stream' in content_type:
                return None
            
            # Only process JSON requests
            if 'application/json' not in content_type:
                return None
            
            if request.method in ['POST', 'PUT', 'PATCH'] and request.body:
                # Parse JSON body
                try:
                    data = json.loads(request.body)
                    # Decrypt sensitive fields if they are marked as encrypted
                    decrypted_data = self._decrypt_sensitive_fields(data)
                    # Update request body with decrypted data
                    request._body = json.dumps(decrypted_data).encode('utf-8')
                except json.JSONDecodeError:
                    pass  # Not JSON, skip
                except UnicodeDecodeError:
                    logger.warning(f"Skipping encryption middleware - binary data detected")
                    pass  # Binary data, skip
        except Exception as e:
            logger.error(f"Encryption middleware request error: {e}")
        
        return None
    
    def process_response(self, request, response):
        """
        Encrypt outgoing data for sensitive endpoints
        """
        if not self.should_process_request(request):
            return response
        
        try:
            # Only process JSON responses
            if 'application/json' in response.get('Content-Type', ''):
                # Get response content
                content = response.content.decode('utf-8')
                data = json.loads(content)
                
                # Add encryption status to response
                if isinstance(data, dict):
                    data['_encryption_enabled'] = True
                
                # Update response with encrypted data
                response.content = json.dumps(data).encode('utf-8')
                
        except Exception as e:
            logger.error(f"Encryption middleware response error: {e}")
        
        return response
    
    def _decrypt_sensitive_fields(self, data):
        """Decrypt sensitive fields in data"""
        from .encryption import decrypt_sensitive_field
        
        if isinstance(data, dict):
            decrypted_data = {}
            for key, value in data.items():
                if key in self.SENSITIVE_FIELDS and isinstance(value, str) and value.startswith('enc:'):
                    # This is an encrypted value
                    decrypted_value = decrypt_sensitive_field(value[4:])  # Remove 'enc:' prefix
                    decrypted_data[key] = decrypted_value if decrypted_value else value
                elif isinstance(value, dict):
                    decrypted_data[key] = self._decrypt_sensitive_fields(value)
                elif isinstance(value, list):
                    decrypted_data[key] = [self._decrypt_sensitive_fields(item) if isinstance(item, dict) else item for item in value]
                else:
                    decrypted_data[key] = value
            return decrypted_data
        
        return data


class SecureHeadersMiddleware(MiddlewareMixin):
    """
    Add security headers to all responses
    """
    
    def process_response(self, request, response):
        """Add security headers"""
        # Prevent clickjacking
        response['X-Frame-Options'] = 'DENY'
        
        # Enable XSS protection
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-XSS-Protection'] = '1; mode=block'
        
        # HSTS (for HTTPS)
        if request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # Content Security Policy
        response['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response
