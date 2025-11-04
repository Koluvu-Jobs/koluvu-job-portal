from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


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