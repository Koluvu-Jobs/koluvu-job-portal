from django.db import models
from django.core.exceptions import ValidationError
from authentication.encryption import encrypt_sensitive_field, decrypt_sensitive_field
import json


class EncryptedTextField(models.TextField):
    """
    Custom field that automatically encrypts/decrypts text data
    """
    
    def __init__(self, *args, **kwargs):
        # Remove our custom arguments before passing to parent
        self.encrypted = kwargs.pop('encrypted', True)
        super().__init__(*args, **kwargs)
    
    def from_db_value(self, value, expression, connection):
        """
        Convert database value to Python value (decrypt)
        """
        if value is None or not self.encrypted:
            return value
        
        decrypted_value = decrypt_sensitive_field(value)
        return decrypted_value if decrypted_value is not None else value
    
    def to_python(self, value):
        """
        Convert value to Python type
        """
        if value is None:
            return value
        
        # If it's already a string, return as-is
        if isinstance(value, str):
            return value
        
        return str(value)
    
    def get_prep_value(self, value):
        """
        Convert Python value to database value (encrypt)
        """
        if value is None or not self.encrypted:
            return value
        
        # Convert to string first
        value = str(value)
        
        if not value.strip():
            return value
        
        encrypted_value = encrypt_sensitive_field(value)
        return encrypted_value if encrypted_value is not None else value


class EncryptedCharField(models.CharField):
    """
    Custom field that automatically encrypts/decrypts char data
    """
    
    def __init__(self, *args, **kwargs):
        self.encrypted = kwargs.pop('encrypted', True)
        super().__init__(*args, **kwargs)
    
    def from_db_value(self, value, expression, connection):
        """
        Convert database value to Python value (decrypt)
        """
        if value is None or not self.encrypted:
            return value
        
        decrypted_value = decrypt_sensitive_field(value)
        return decrypted_value if decrypted_value is not None else value
    
    def to_python(self, value):
        """
        Convert value to Python type
        """
        if value is None:
            return value
        
        if isinstance(value, str):
            return value
        
        return str(value)
    
    def get_prep_value(self, value):
        """
        Convert Python value to database value (encrypt)
        """
        if value is None or not self.encrypted:
            return value
        
        value = str(value)
        
        if not value.strip():
            return value
        
        encrypted_value = encrypt_sensitive_field(value)
        return encrypted_value if encrypted_value is not None else value


class EncryptedJSONField(models.JSONField):
    """
    Custom field that automatically encrypts/decrypts JSON data
    """
    
    def __init__(self, *args, **kwargs):
        self.encrypted = kwargs.pop('encrypted', True)
        super().__init__(*args, **kwargs)
    
    def from_db_value(self, value, expression, connection):
        """
        Convert database value to Python value (decrypt)
        """
        if value is None or not self.encrypted:
            return super().from_db_value(value, expression, connection)
        
        # First decrypt the string, then parse JSON
        if isinstance(value, str):
            decrypted_value = decrypt_sensitive_field(value)
            if decrypted_value:
                try:
                    return json.loads(decrypted_value)
                except json.JSONDecodeError:
                    # If decryption fails, try to parse original value
                    try:
                        return json.loads(value)
                    except json.JSONDecodeError:
                        return {}
        
        return super().from_db_value(value, expression, connection)
    
    def get_prep_value(self, value):
        """
        Convert Python value to database value (encrypt)
        """
        if value is None or not self.encrypted:
            return super().get_prep_value(value)
        
        # First convert to JSON string, then encrypt
        json_str = json.dumps(value, ensure_ascii=False)
        encrypted_value = encrypt_sensitive_field(json_str)
        
        return encrypted_value if encrypted_value is not None else json_str


class SecureModelMixin:
    """
    Mixin to add encryption capabilities to Django models
    """
    
    def encrypt_field(self, field_name, value):
        """
        Encrypt a specific field value
        """
        if value and isinstance(value, str):
            return encrypt_sensitive_field(value)
        return value
    
    def decrypt_field(self, field_name, encrypted_value):
        """
        Decrypt a specific field value
        """
        if encrypted_value and isinstance(encrypted_value, str):
            return decrypt_sensitive_field(encrypted_value)
        return encrypted_value
    
    def get_sensitive_fields(self):
        """
        Override this method to specify which fields should be encrypted
        """
        return []
    
    def encrypt_sensitive_data(self):
        """
        Encrypt all sensitive fields before saving
        """
        sensitive_fields = self.get_sensitive_fields()
        
        for field_name in sensitive_fields:
            if hasattr(self, field_name):
                current_value = getattr(self, field_name)
                if current_value:
                    encrypted_value = self.encrypt_field(field_name, current_value)
                    setattr(self, field_name, encrypted_value)
    
    def decrypt_sensitive_data(self):
        """
        Decrypt all sensitive fields after loading
        """
        sensitive_fields = self.get_sensitive_fields()
        
        for field_name in sensitive_fields:
            if hasattr(self, field_name):
                encrypted_value = getattr(self, field_name)
                if encrypted_value:
                    decrypted_value = self.decrypt_field(field_name, encrypted_value)
                    setattr(self, field_name, decrypted_value)
    
    def to_secure_dict(self):
        """
        Convert model instance to dictionary with decrypted sensitive data
        """
        data = {}
        
        for field in self._meta.fields:
            field_name = field.name
            value = getattr(self, field_name)
            
            if field_name in self.get_sensitive_fields():
                # Decrypt sensitive fields
                value = self.decrypt_field(field_name, value)
            
            data[field_name] = value
        
        return data


class AuditMixin(models.Model):
    """
    Mixin to add audit trail functionality
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='%(class)s_created'
    )
    updated_by = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='%(class)s_updated'
    )
    
    class Meta:
        abstract = True


class SecureStorageMixin:
    """
    Mixin for secure storage of sensitive data
    """
    
    def save_secure_data(self, field_name, data):
        """
        Save encrypted data to a specific field
        """
        if hasattr(self, field_name):
            encrypted_data = encrypt_sensitive_field(json.dumps(data))
            setattr(self, field_name, encrypted_data)
            self.save(update_fields=[field_name])
    
    def load_secure_data(self, field_name):
        """
        Load and decrypt data from a specific field
        """
        if hasattr(self, field_name):
            encrypted_data = getattr(self, field_name)
            if encrypted_data:
                decrypted_json = decrypt_sensitive_field(encrypted_data)
                if decrypted_json:
                    try:
                        return json.loads(decrypted_json)
                    except json.JSONDecodeError:
                        return {}
        return {}