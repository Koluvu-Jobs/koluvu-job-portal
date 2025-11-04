# shared_services/messaging.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json

class InboxMessage(models.Model):
    sender = models.ForeignKey(User, related_name='inbox_sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='inbox_received_messages', on_delete=models.CASCADE)
    subject = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Message types for different contexts
    MESSAGE_TYPES = [
        ('application', 'Job Application'),
        ('interview', 'Interview'),
        ('general', 'General'),
        ('system', 'System'),
    ]
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='general')
    
    # Optional reference to related objects
    job_id = models.IntegerField(null=True, blank=True)
    application_id = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"From {self.sender.username} to {self.recipient.username}: {self.subject[:50]}"
    
    @property
    def preview(self):
        """Return a preview of the message content"""
        return self.content[:100] + "..." if len(self.content) > 100 else self.content
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.read:
            self.read = True
            self.read_at = timezone.now()
            self.save()

class InboxMessageThread(models.Model):
    """Group messages between two users"""
    participants = models.ManyToManyField(User)
    subject = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Optional reference to job/application
    job_id = models.IntegerField(null=True, blank=True)
    application_id = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        participant_names = ", ".join([p.username for p in self.participants.all()])
        return f"Thread: {participant_names} - {self.subject}"
    
    def get_messages(self):
        """Get all messages in this thread"""
        participants_list = list(self.participants.all())
        if len(participants_list) >= 2:
            user1, user2 = participants_list[0], participants_list[1]
            return InboxMessage.objects.filter(
                models.Q(sender=user1, recipient=user2) |
                models.Q(sender=user2, recipient=user1)
            ).order_by('timestamp')
        return InboxMessage.objects.none()
    
    def get_unread_count(self, user):
        """Get unread message count for a specific user"""
        return self.get_messages().filter(recipient=user, read=False).count()