from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import re


class CustomPasswordValidator:
    """
    Custom password validator for enhanced security
    """
    
    def validate(self, password, user=None):
        """
        Validate the password against custom rules:
        - At least 8 characters
        - Contains at least one uppercase letter
        - Contains at least one lowercase letter  
        - Contains at least one digit
        - Contains at least one special character
        """
        errors = []
        
        if len(password) < 8:
            errors.append(_("Password must be at least 8 characters long."))
        
        if not re.search(r'[A-Z]', password):
            errors.append(_("Password must contain at least one uppercase letter."))
        
        if not re.search(r'[a-z]', password):
            errors.append(_("Password must contain at least one lowercase letter."))
        
        if not re.search(r'\d', password):
            errors.append(_("Password must contain at least one digit."))
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append(_("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)."))
        
        # Check for common patterns
        if re.search(r'(.)\1{2,}', password):
            errors.append(_("Password cannot contain three or more consecutive identical characters."))
        
        # Check for keyboard patterns
        keyboard_patterns = [
            'qwerty', '123456', 'abcdef', 'password', 'admin', 'user',
            'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'
        ]
        
        password_lower = password.lower()
        for pattern in keyboard_patterns:
            if pattern in password_lower:
                errors.append(_("Password cannot contain common keyboard patterns."))
                break
        
        if errors:
            raise ValidationError(errors)
    
    def get_help_text(self):
        return _(
            "Your password must contain at least 8 characters including "
            "uppercase letters, lowercase letters, digits, and special characters."
        )