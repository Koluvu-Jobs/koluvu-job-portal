"""
Employee Settings Serializers
Handles serialization for employee settings with comprehensive validation and real-time updates.
"""

from rest_framework import serializers
from .models import EmployeeSettings
from authentication.models import User


class EmployeeSettingsSerializer(serializers.ModelSerializer):
    """Comprehensive serializer for employee settings with validation."""
    
    class Meta:
        model = EmployeeSettings
        fields = '__all__'
        read_only_fields = ('employee', 'created_at', 'updated_at')

    def validate_salary_range_min(self, value):
        """Validate minimum salary range."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Minimum salary cannot be negative.")
        return value

    def validate_salary_range_max(self, value):
        """Validate maximum salary range."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Maximum salary cannot be negative.")
        return value

    def validate(self, data):
        """Cross-field validation."""
        salary_min = data.get('salary_range_min')
        salary_max = data.get('salary_range_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError({
                'salary_range_max': 'Maximum salary must be greater than minimum salary.'
            })
        
        return data


class EmployeeProfileSettingsSerializer(serializers.ModelSerializer):
    """Serializer for profile-related employee settings."""
    
    class Meta:
        model = EmployeeSettings
        fields = [
            'profile_visibility', 'show_profile_picture', 'show_contact_info',
            'show_experience', 'show_education', 'show_skills', 'show_resume',
            'allow_profile_indexing', 'profile_completion_reminder'
        ]


class EmployeeJobPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for job preference settings."""
    
    class Meta:
        model = EmployeeSettings
        fields = [
            'job_alert_frequency', 'preferred_job_types', 'preferred_work_modes',
            'preferred_industries', 'preferred_company_sizes', 'salary_range_min',
            'salary_range_max', 'preferred_locations', 'exclude_companies',
            'auto_apply_enabled', 'auto_apply_criteria'
        ]


class EmployeeNotificationSettingsSerializer(serializers.ModelSerializer):
    """Serializer for notification settings."""
    
    class Meta:
        model = EmployeeSettings
        fields = [
            'email_notifications', 'sms_notifications', 'push_notifications',
            'job_recommendations', 'application_updates', 'interview_reminders',
            'profile_views', 'new_messages', 'skills_suggestions',
            'course_recommendations', 'newsletter_subscription', 'marketing_emails',
            'notification_sound', 'quiet_hours_enabled', 'quiet_hours_start',
            'quiet_hours_end'
        ]


class EmployeePrivacySettingsSerializer(serializers.ModelSerializer):
    """Serializer for privacy settings."""
    
    class Meta:
        model = EmployeeSettings
        fields = [
            'profile_visibility', 'allow_recruiter_contact', 'allow_employer_search',
            'show_salary_expectations', 'show_current_employer', 'anonymous_profile_views',
            'data_retention_period', 'allow_data_export', 'third_party_sharing',
            'analytics_tracking', 'cookie_preferences'
        ]


class EmployeeApplicationSettingsSerializer(serializers.ModelSerializer):
    """Serializer for application tracking settings."""
    
    class Meta:
        model = EmployeeSettings
        fields = [
            'application_status_updates', 'track_application_views',
            'save_application_drafts', 'auto_save_frequency',
            'application_reminder_days', 'follow_up_reminders',
            'application_analytics', 'export_applications'
        ]


class EmployeeResumeSettingsSerializer(serializers.ModelSerializer):
    """Serializer for resume management settings."""
    
    class Meta:
        model = EmployeeSettings
        fields = [
            'default_resume_template', 'auto_save_resume', 'resume_version_history',
            'max_resume_versions', 'resume_backup_enabled', 'resume_sharing_enabled',
            'resume_analytics', 'watermark_enabled', 'password_protect_resume'
        ]