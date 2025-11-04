from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.conf import settings
import base64
import os
import json
import logging

logger = logging.getLogger(__name__)


class DataEncryption:
    """
    Utility class for encrypting and decrypting sensitive data
    """
    
    def __init__(self):
        self.fernet = self._get_fernet()
    
    def _get_fernet(self):
        """
        Get Fernet encryption instance using the encryption key from settings
        """
        try:
            key = settings.FIELD_ENCRYPTION_KEY
            if isinstance(key, str):
                key = key.encode()
            
            # Ensure key is exactly 32 bytes for Fernet
            if len(key) < 32:
                # Pad with zeros if too short
                key = key.ljust(32, b'0')
            elif len(key) > 32:
                # Truncate if too long
                key = key[:32]
            
            # Encode to base64 for Fernet
            encoded_key = base64.urlsafe_b64encode(key)
            return Fernet(encoded_key)
            
        except Exception as e:
            logger.error(f"Error initializing encryption: {e}")
            # Fallback to a default key for development
            default_key = base64.urlsafe_b64encode(b'development-key-32-chars-long!')
            return Fernet(default_key)
    
    def encrypt(self, data):
        """
        Encrypt a string or bytes object
        Returns base64 encoded encrypted data
        """
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            
            encrypted_data = self.fernet.encrypt(data)
            return base64.b64encode(encrypted_data).decode('utf-8')
            
        except Exception as e:
            logger.error(f"Encryption error: {e}")
            return None
    
    def decrypt(self, encrypted_data):
        """
        Decrypt base64 encoded encrypted data
        Returns the original string
        """
        try:
            if isinstance(encrypted_data, str):
                encrypted_data = base64.b64decode(encrypted_data.encode('utf-8'))
            
            decrypted_data = self.fernet.decrypt(encrypted_data)
            return decrypted_data.decode('utf-8')
            
        except Exception as e:
            logger.error(f"Decryption error: {e}")
            return None
    
    def encrypt_json(self, data):
        """
        Encrypt a JSON-serializable object
        """
        try:
            json_str = json.dumps(data)
            return self.encrypt(json_str)
        except Exception as e:
            logger.error(f"JSON encryption error: {e}")
            return None
    
    def decrypt_json(self, encrypted_data):
        """
        Decrypt and parse JSON data
        """
        try:
            json_str = self.decrypt(encrypted_data)
            if json_str:
                return json.loads(json_str)
            return None
        except Exception as e:
            logger.error(f"JSON decryption error: {e}")
            return None


# Global encryption instance
encryption = DataEncryption()


def encrypt_sensitive_field(value):
    """
    Helper function to encrypt sensitive field values
    """
    if not value:
        return value
    
    return encryption.encrypt(str(value))


def decrypt_sensitive_field(encrypted_value):
    """
    Helper function to decrypt sensitive field values
    """
    if not encrypted_value:
        return encrypted_value
    
    return encryption.decrypt(encrypted_value)


class EncryptedField:
    """
    Custom field descriptor for automatic encryption/decryption
    """
    
    def __init__(self, field_name):
        self.field_name = field_name
        self.encrypted_field_name = f"_{field_name}_encrypted"
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        
        encrypted_value = getattr(obj, self.encrypted_field_name, None)
        if encrypted_value:
            return decrypt_sensitive_field(encrypted_value)
        return None
    
    def __set__(self, obj, value):
        if value:
            encrypted_value = encrypt_sensitive_field(value)
            setattr(obj, self.encrypted_field_name, encrypted_value)
        else:
            setattr(obj, self.encrypted_field_name, None)


def encrypt_user_data(user_data):
    """
    Encrypt sensitive user data before storing
    """
    sensitive_fields = [
        'phone_number', 'phone', 'address', 'location',
        'ssn', 'national_id', 'passport_number',
        'emergency_contact', 'medical_info'
    ]
    
    encrypted_data = {}
    
    for key, value in user_data.items():
        if key in sensitive_fields and value:
            encrypted_data[key] = encrypt_sensitive_field(value)
        else:
            encrypted_data[key] = value
    
    return encrypted_data


def decrypt_user_data(encrypted_data):
    """
    Decrypt sensitive user data for display
    """
    sensitive_fields = [
        'phone_number', 'phone', 'address', 'location',
        'ssn', 'national_id', 'passport_number',
        'emergency_contact', 'medical_info'
    ]
    
    decrypted_data = {}
    
    for key, value in encrypted_data.items():
        if key in sensitive_fields and value:
            decrypted_value = decrypt_sensitive_field(value)
            decrypted_data[key] = decrypted_value if decrypted_value else value
        else:
            decrypted_data[key] = value
    
    return decrypted_data


class SecureSessionManager:
    """
    Manage secure session data with encryption
    """
    
    @staticmethod
    def encrypt_session_data(session_data):
        """
        Encrypt session data before storing
        """
        return encryption.encrypt_json(session_data)
    
    @staticmethod
    def decrypt_session_data(encrypted_session_data):
        """
        Decrypt session data after retrieval
        """
        return encryption.decrypt_json(encrypted_session_data)
    
    @staticmethod
    def create_secure_token(data):
        """
        Create a secure token containing encrypted data
        """
        token_data = {
            'data': data,
            'timestamp': os.urandom(16).hex(),  # Add randomness
        }
        return encryption.encrypt_json(token_data)
    
    @staticmethod
    def verify_secure_token(token):
        """
        Verify and extract data from secure token
        """
        token_data = encryption.decrypt_json(token)
        if token_data and 'data' in token_data:
            return token_data['data']
        return None


def generate_encryption_key():
    """
    Generate a new encryption key for the system
    """
    return Fernet.generate_key().decode()


def hash_sensitive_data(data):
    """
    Hash sensitive data for search indexing without exposing original values
    """
    try:
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
        
        # Use a consistent salt for searching
        salt = b'search_index_salt_koluvu_2025'
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(data.encode()))
        return key.decode()
        
    except Exception as e:
        logger.error(f"Hashing error: {e}")
        return None