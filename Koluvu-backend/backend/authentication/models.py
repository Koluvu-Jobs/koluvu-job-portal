from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random
import string


class SocialAccount(models.Model):
    """Model to store social account information"""
    PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('github', 'GitHub'),
        ('linkedin', 'LinkedIn'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    social_id = models.CharField(max_length=100)
    email = models.EmailField()
    profile_picture_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('provider', 'social_id')
    
    def __str__(self):
        return f"{self.user.username} - {self.provider}"


class UserSession(models.Model):
    """Model to track user sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    refresh_token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - Session {self.id}"


class UserActivity(models.Model):
    """Model to track user activities for security auditing"""
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('profile_update', 'Profile Update'),
        ('settings_change', 'Settings Change'),
        ('upload', 'Upload'),
        ('download', 'Download'),
        ('search', 'Search'),
        ('view', 'View'),
        ('rate_limit_exceeded', 'Rate Limit Exceeded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'User Activities'
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} at {self.created_at}"


class OTPSession(models.Model):
    """Model to store OTP sessions for email and mobile verification"""
    VERIFICATION_TYPES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('login', 'Login'),
        ('password_reset', 'Password Reset'),
    ]
    
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    otp_code = models.CharField(max_length=6)
    verification_type = models.CharField(max_length=20, choices=VERIFICATION_TYPES)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=3)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        identifier = self.email or self.phone
        return f"{identifier} - {self.verification_type} - {self.otp_code}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def can_attempt(self):
        return self.attempts < self.max_attempts and not self.is_expired()
    
    def generate_otp(self):
        """Generate a 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
    
    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = self.generate_otp()
        if not self.expires_at:
            # OTP expires in 30 minutes
            self.expires_at = timezone.now() + timezone.timedelta(minutes=30)
        super().save(*args, **kwargs)
    
    @classmethod
    def create_otp_session(cls, identifier, verification_type, user=None):
        """Create a new OTP session for the given identifier and verification type"""
        # Clean up expired sessions for this identifier
        cls.objects.filter(
            email=identifier if '@' in identifier else None,
            phone=identifier if '@' not in identifier else None,
            verification_type=verification_type,
            expires_at__lt=timezone.now()
        ).delete()
        
        # Check for existing valid session
        existing_session = cls.objects.filter(
            email=identifier if '@' in identifier else None,
            phone=identifier if '@' not in identifier else None,
            verification_type=verification_type,
            is_verified=False,
            expires_at__gt=timezone.now()
        ).first()
        
        if existing_session and existing_session.can_attempt():
            return existing_session
        
        # Create new session
        session_data = {
            'verification_type': verification_type,
            'is_verified': False,
            'attempts': 0
        }
        
        if '@' in identifier:
            session_data['email'] = identifier
        else:
            session_data['phone'] = identifier
            
        return cls.objects.create(**session_data)
    
    @classmethod
    def verify_otp(cls, identifier, otp_code, verification_type):
        """Verify OTP for the given identifier and verification type"""
        # Find the latest OTP session
        session = cls.objects.filter(
            email=identifier if '@' in identifier else None,
            phone=identifier if '@' not in identifier else None,
            verification_type=verification_type,
            is_verified=False
        ).order_by('-created_at').first()
        
        if not session:
            return None, "No valid OTP session found"
        
        if session.is_expired():
            return None, "OTP has expired"
        
        if not session.can_attempt():
            return None, "Maximum attempts exceeded"
        
        # Increment attempts
        session.attempts += 1
        session.save()
        
        if session.otp_code != otp_code:
            return None, "Invalid OTP code"
        
        # Mark as verified
        session.is_verified = True
        session.save()
        
        return session, "OTP verified successfully"