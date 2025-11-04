# shared_services/admin.py

from django.contrib import admin
from .messaging import InboxMessage, InboxMessageThread

@admin.register(InboxMessage)
class InboxMessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'subject', 'message_type', 'read', 'timestamp']
    list_filter = ['message_type', 'read', 'timestamp']
    search_fields = ['sender__username', 'recipient__username', 'subject', 'content']
    readonly_fields = ['timestamp', 'read_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('sender', 'recipient')

@admin.register(InboxMessageThread)
class InboxMessageThreadAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['subject']
    readonly_fields = ['created_at', 'updated_at']