from django.contrib import admin
from .models import PartnerProfile

@admin.register(PartnerProfile)
class PartnerProfileAdmin(admin.ModelAdmin):
    list_display = ['organization_name', 'contact_person', 'user', 'is_verified', 'is_profile_complete', 'created_at']
    list_filter = ['is_verified', 'is_profile_complete', 'created_at']
    search_fields = ['organization_name', 'contact_person', 'user__email', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'organization_name', 'contact_person')
        }),
        ('Contact Details', {
            'fields': ('phone_number', 'email', 'website', 'address')
        }),
        ('Profile Settings', {
            'fields': ('profile_picture', 'is_verified', 'is_profile_complete')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )