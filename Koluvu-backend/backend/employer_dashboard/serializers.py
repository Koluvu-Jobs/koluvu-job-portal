from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    EmployerProfile, Job, JobApplication, Candidate, 
    Interviewer, Interview, InterviewNote, InterviewTimeSlot,
    ProxyScanSession, ProxyDetectionRule, ProxyAlert,
    InterviewFeedback, FeedbackTemplate, FeedbackReminder,
    EmployerSettings
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_picture = serializers.SerializerMethodField()
    company_logo_display = serializers.SerializerMethodField()
    profile_completion_percentage = serializers.ReadOnlyField()
    can_change_names = serializers.SerializerMethodField()
    days_until_next_change = serializers.SerializerMethodField()
    
    def get_profile_picture(self, obj):
        return obj.get_profile_picture()
    
    def get_company_logo_display(self, obj):
        return obj.get_company_logo()
    
    def get_can_change_names(self, obj):
        can_change, _ = obj.can_change_names()
        return can_change
    
    def get_days_until_next_change(self, obj):
        return obj.days_until_next_change()
    
    class Meta:
        model = EmployerProfile
        fields = [
            'id', 'user', 'company_name', 'industry_type', 'company_size', 
            'website', 'phone', 'company_location', 'contact_person', 
            'designation', 'total_employees', 'employer_name',
            # Profile Pictures & Logos
            'profile_picture', 'profile_picture_url', 'profile_picture',
            'company_logo', 'company_logo_url', 'company_logo_display',
            # Social Media Links
            'linkedin_profile_url', 'github_profile_url', 
            'twitter_profile_url', 'facebook_profile_url', 'instagram_profile_url',
            # Bio & Introduction
            'bio', 'employer_introduction',
            # Status & Verification
            'is_active', 'is_verified', 'is_profile_complete', 'profile_completion_percentage',
            # Social Media Data
            'social_media_data',
            # Security & Login Info
            'last_login_ip', 'last_login_location',
            # Name Change Management
            'last_name_change', 'can_change_names', 'days_until_next_change',
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'profile_picture', 'company_logo_display', 
            'profile_completion_percentage', 'is_profile_complete', 
            'last_login_ip', 'last_login_location', 'can_change_names', 
            'days_until_next_change', 'created_at', 'updated_at'
        ]


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    employer_profile_picture = serializers.SerializerMethodField()
    employer_logo_display = serializers.SerializerMethodField()
    
    def get_employer_profile_picture(self, obj):
        return obj.employer.get_profile_picture()
    
    def get_employer_logo_display(self, obj):
        return obj.get_employer_logo()
    
    class Meta:
        model = Job
        fields = [
            # Basic Job Information (1-13)
            'id', 'title', 'company_name', 'location', 'industry',
            'salary_min', 'salary_max', 'salary_currency',
            'description', 'job_brief', 'responsibilities', 'requirements', 
            'benefits', 'perks', 'faqs', 'screening_questions', 'hiring_process_stages',
            'application_deadline', 'contact_email', 'job_type',
            
            # Qualification Requirements (14-19)
            'education_level', 'education', 
            'experience_level', 'experience_min', 'experience_max',
            'skills', 'skills_required', 'language_proficiency',
            'additional_notes', 'ats_keywords',
            
            # Employer Details (20-29)
            'employer_name', 'employer_email', 'employer_phone',
            'employer_linkedin_url', 'employer_website_url',
            'employer_logo', 'employer_logo_url', 'employer_logo_display',
            'employer_bio', 'employer_social_media', 'company_size', 'company_benefits',
            
            # Additional Fields
            'designation', 'department', 'employment_type', 'gender_preference',
            'candidate_profile', 'urgency', 'interview_method', 
            'virtual_platform', 'walkin_address', 
            'contact_preferences', 'notification_preferences',
            
            # Status & Metrics
            'status', 'created_at', 'updated_at',
            'views_count', 'applications_count',
            
            # Relationships
            'employer', 'employer_name', 'employer_profile_picture'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'views_count', 
            'applications_count', 'employer', 'employer_name', 
            'employer_profile_picture', 'employer_logo_display'
        ]
    
    def create(self, validated_data):
        """Auto-populate employer details from profile if not provided"""
        employer = self.context['request'].user.employer_profile
        
        # Auto-populate company name if not provided
        if 'company_name' not in validated_data or not validated_data.get('company_name'):
            validated_data['company_name'] = employer.company_name
        
        return super().create(validated_data)


class JobListSerializer(serializers.ModelSerializer):
    """Simplified serializer for job listings"""
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    employer_logo_display = serializers.SerializerMethodField()
    
    def get_employer_logo_display(self, obj):
        return obj.get_employer_logo()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'job_type', 'location', 'industry',
            'employment_type', 'salary_min', 'salary_max', 'salary_currency',
            'experience_min', 'experience_max', 'experience_level',
            'education_level', 'status', 'application_deadline', 
            'created_at', 'views_count', 'applications_count',
            'employer_name', 'employer_logo_display', 'urgency'
        ]


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'candidate_name',
            'candidate_email', 'candidate_phone', 'resume', 'cover_letter',
            'status', 'applied_at', 'updated_at'
        ]


class CandidateSerializer(serializers.ModelSerializer):
    application_details = JobApplicationSerializer(source='application', read_only=True)
    
    class Meta:
        model = Candidate
        fields = [
            'id', 'name', 'email', 'phone', 'current_position', 
            'experience_years', 'skills', 'resume', 'application',
            'application_details', 'created_at', 'updated_at'
        ]


class InterviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interviewer
        fields = [
            'id', 'name', 'email', 'designation', 'department', 
            'phone', 'is_active', 'created_at'
        ]


class InterviewNoteSerializer(serializers.ModelSerializer):
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    
    class Meta:
        model = InterviewNote
        fields = [
            'id', 'interview', 'interviewer', 'interviewer_name',
            'note', 'rating', 'created_at'
        ]


class InterviewTimeSlotSerializer(serializers.ModelSerializer):
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    
    class Meta:
        model = InterviewTimeSlot
        fields = [
            'id', 'interviewer', 'interviewer_name', 'date', 
            'start_time', 'end_time', 'is_available', 'is_blocked'
        ]


class InterviewSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    job_title = serializers.CharField(source='job_position.title', read_only=True)
    interviewer_details = InterviewerSerializer(source='interviewers', many=True, read_only=True)
    notes = InterviewNoteSerializer(many=True, read_only=True)
    datetime_local = serializers.ReadOnlyField()
    
    class Meta:
        model = Interview
        fields = [
            'id', 'title', 'description', 'interview_type', 'status',
            'candidate', 'candidate_name', 'candidate_email',
            'job_position', 'job_title', 'interviewers', 'interviewer_details',
            'interview_date', 'interview_time', 'duration', 'timezone',
            'location', 'meeting_link', 'meeting_id', 'meeting_password',
            'send_reminder', 'reminder_sent', 'feedback', 'result', 
            'next_round', 'datetime_local', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'meeting_link', 'meeting_id', 'reminder_sent', 'created_at', 'updated_at']


class InterviewListSerializer(serializers.ModelSerializer):
    """Simplified serializer for interview listings"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    job_title = serializers.CharField(source='job_position.title', read_only=True)
    interviewer_count = serializers.SerializerMethodField()
    
    def get_interviewer_count(self, obj):
        return obj.interviewers.count()
    
    class Meta:
        model = Interview
        fields = [
            'id', 'title', 'interview_type', 'status', 'candidate_name',
            'job_title', 'interview_date', 'interview_time', 'duration',
            'interviewer_count', 'meeting_link', 'created_at'
        ]


class ProxyAlertSerializer(serializers.ModelSerializer):
    """Serializer for proxy detection alerts"""
    class Meta:
        model = ProxyAlert
        fields = [
            'id', 'alert_type', 'severity', 'title', 'description',
            'recommendation', 'is_resolved', 'resolved_by', 'resolved_at',
            'created_at'
        ]


class ProxyScanSessionSerializer(serializers.ModelSerializer):
    """Serializer for proxy scan sessions"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    location_string = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()
    alerts = ProxyAlertSerializer(many=True, read_only=True)
    alert_count = serializers.SerializerMethodField()
    critical_alerts = serializers.SerializerMethodField()
    
    def get_alert_count(self, obj):
        return obj.alerts.count()
    
    def get_critical_alerts(self, obj):
        return obj.alerts.filter(severity='critical').count()
    
    class Meta:
        model = ProxyScanSession
        fields = [
            'id', 'candidate', 'candidate_name', 'interview', 'ip_address',
            'user_agent', 'scan_status', 'risk_level', 'is_proxy', 'is_vpn',
            'is_tor', 'is_hosting', 'is_datacenter', 'country', 'region',
            'city', 'latitude', 'longitude', 'timezone', 'isp', 'organization',
            'as_number', 'as_name', 'threat_score', 'is_malicious', 'is_suspicious',
            'location_string', 'duration', 'alerts', 'alert_count', 'critical_alerts',
            'api_sources', 'started_at', 'completed_at'
        ]


class ProxyScanSessionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for proxy scan session listings"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    location_string = serializers.ReadOnlyField()
    alert_count = serializers.SerializerMethodField()
    
    def get_alert_count(self, obj):
        return obj.alerts.count()
    
    class Meta:
        model = ProxyScanSession
        fields = [
            'id', 'candidate_name', 'ip_address', 'scan_status', 'risk_level',
            'is_proxy', 'is_vpn', 'is_tor', 'threat_score', 'location_string',
            'alert_count', 'started_at', 'completed_at'
        ]


class ProxyDetectionRuleSerializer(serializers.ModelSerializer):
    """Serializer for proxy detection rules"""
    class Meta:
        model = ProxyDetectionRule
        fields = [
            'id', 'name', 'description', 'rule_type', 'rule_value',
            'is_active', 'block_access', 'created_at', 'updated_at'
        ]


class ProxyScanRequestSerializer(serializers.Serializer):
    """Serializer for proxy scan requests"""
    ip_address = serializers.IPAddressField()
    candidate_id = serializers.IntegerField(required=False, allow_null=True)
    interview_id = serializers.IntegerField(required=False, allow_null=True)
    user_agent = serializers.CharField(required=False, allow_blank=True, max_length=1000)


class ProxyStatisticsSerializer(serializers.Serializer):
    """Serializer for proxy detection statistics"""
    total_scans = serializers.IntegerField()
    proxy_detected = serializers.IntegerField()
    vpn_detected = serializers.IntegerField()
    tor_detected = serializers.IntegerField()
    high_risk_connections = serializers.IntegerField()
    clean_connections = serializers.IntegerField()
    detection_rate = serializers.FloatField()


# ============= INTERVIEW FEEDBACK SERIALIZERS =============

class InterviewFeedbackSerializer(serializers.ModelSerializer):
    """Complete serializer for interview feedback"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    interviewer_email = serializers.CharField(source='interviewer.email', read_only=True)
    interview_title = serializers.CharField(source='interview.title', read_only=True)
    average_rating = serializers.ReadOnlyField()
    feedback_completion_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = InterviewFeedback
        fields = [
            'id', 'interview', 'interview_title', 'candidate', 'candidate_name',
            'interviewer', 'interviewer_name', 'interviewer_email',
            'position_applied', 'department', 'interview_date', 'interview_duration',
            'interview_status', 'decision_rationale', 'skills_assessment',
            'behavior_assessment', 'technical_skills', 'overall_rating',
            'skills_rating', 'communication_rating', 'technical_rating',
            'culture_fit_rating', 'strengths', 'weaknesses', 'improvement_suggestions',
            'next_steps', 'offered_salary', 'joining_date', 'offer_details',
            'is_submitted', 'submitted_at', 'internal_notes', 'hr_notes',
            'average_rating', 'feedback_completion_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'candidate_name', 'interviewer_name', 'interviewer_email',
            'interview_title', 'average_rating', 'feedback_completion_percentage',
            'submitted_at', 'created_at', 'updated_at'
        ]
    
    def validate(self, data):
        """Custom validation for feedback data"""
        # Ensure required fields are filled when submitting
        if data.get('is_submitted', False):
            required_fields = ['skills_assessment', 'behavior_assessment', 'technical_skills', 'interview_status']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f"{field} is required when submitting feedback")
        
        # Validate salary if candidate is selected
        if data.get('interview_status') == 'selected' and not data.get('offered_salary'):
            raise serializers.ValidationError("Offered salary is required for selected candidates")
        
        return data


class InterviewFeedbackListSerializer(serializers.ModelSerializer):
    """Simplified serializer for feedback listings"""
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    feedback_completion_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = InterviewFeedback
        fields = [
            'id', 'candidate_name', 'interviewer_name', 'position_applied',
            'interview_date', 'interview_status', 'average_rating',
            'feedback_completion_percentage', 'is_submitted', 'submitted_at', 'created_at'
        ]


class InterviewFeedbackCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating feedback based on frontend form"""
    class Meta:
        model = InterviewFeedback
        fields = [
            'interview', 'candidate', 'interviewer', 'candidate_name',
            'position_applied', 'department', 'interview_date',
            'interview_status', 'skills_assessment', 'behavior_assessment',
            'technical_skills', 'overall_rating', 'strengths', 'weaknesses',
            'decision_rationale', 'offered_salary', 'joining_date', 'is_submitted'
        ]
    
    def create(self, validated_data):
        # Set employer from request context
        request = self.context.get('request')
        if request and hasattr(request.user, 'employer_profile'):
            validated_data['employer'] = request.user.employer_profile
        
        return super().create(validated_data)


class FeedbackTemplateSerializer(serializers.ModelSerializer):
    """Serializer for feedback templates"""
    class Meta:
        model = FeedbackTemplate
        fields = [
            'id', 'name', 'description', 'template_data', 'is_default',
            'is_active', 'usage_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'usage_count', 'created_at', 'updated_at']


class FeedbackReminderSerializer(serializers.ModelSerializer):
    """Serializer for feedback reminders"""
    feedback_candidate = serializers.CharField(source='feedback.candidate_name', read_only=True)
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    
    class Meta:
        model = FeedbackReminder
        fields = [
            'id', 'feedback', 'feedback_candidate', 'interviewer',
            'interviewer_name', 'reminder_type', 'message', 'scheduled_at',
            'sent_at', 'is_sent', 'created_at'
        ]
        read_only_fields = ['id', 'sent_at', 'is_sent', 'created_at']


class FeedbackSummarySerializer(serializers.Serializer):
    """Serializer for feedback summary statistics"""
    total_feedbacks = serializers.IntegerField()
    submitted_feedbacks = serializers.IntegerField()
    pending_feedbacks = serializers.IntegerField()
    selected_candidates = serializers.IntegerField()
    rejected_candidates = serializers.IntegerField()
    average_overall_rating = serializers.FloatField()
    completion_rate = serializers.FloatField()
    feedback_by_status = serializers.DictField()
    recent_feedbacks = InterviewFeedbackListSerializer(many=True)


class CandidateFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for candidate-specific feedback view"""
    interviewer_name = serializers.CharField(source='interviewer.name', read_only=True)
    interviewer_designation = serializers.CharField(source='interviewer.designation', read_only=True)
    average_rating = serializers.ReadOnlyField()
    
    class Meta:
        model = InterviewFeedback
        fields = [
            'id', 'interviewer_name', 'interviewer_designation', 'interview_date',
            'interview_status', 'skills_assessment', 'behavior_assessment',
            'technical_skills', 'overall_rating', 'skills_rating',
            'communication_rating', 'technical_rating', 'culture_fit_rating',
            'average_rating', 'strengths', 'weaknesses', 'improvement_suggestions',
            'submitted_at'
        ]


class EmployerSettingsSerializer(serializers.ModelSerializer):
    """Comprehensive serializer for employer settings"""
    
    # Read-only computed fields
    settings_summary = serializers.SerializerMethodField()
    notification_preferences = serializers.SerializerMethodField()
    security_settings = serializers.SerializerMethodField()
    dashboard_preferences = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployerSettings
        fields = [
            'id', 'employer',
            
            # Profile Settings
            'auto_update_from_linkedin', 'auto_update_from_google', 'auto_sync_company_info',
            'profile_visibility', 'show_contact_info', 'show_company_size', 'show_website',
            'show_social_media', 'allow_profile_search',
            
            # Notification Preferences
            'notify_new_applications', 'notify_application_updates', 'notify_interview_scheduled',
            'notify_interview_reminders', 'notify_candidate_messages', 'notify_system_updates',
            'notify_security_alerts', 'notify_billing_updates', 'notify_feature_updates',
            'notification_frequency', 'enable_quiet_hours', 'quiet_hours_start',
            'quiet_hours_end', 'quiet_hours_timezone',
            
            # Security Settings
            'require_2fa', 'backup_email', 'auto_logout_minutes', 'require_ip_verification',
            'allowed_ip_addresses', 'notify_new_login', 'notify_suspicious_login',
            'enable_activity_logging', 'enable_audit_trail', 'data_retention_days',
            
            # Dashboard Preferences
            'theme', 'custom_theme_colors', 'sidebar_collapsed', 'show_animations',
            'language', 'timezone', 'date_format', 'time_format', 'dashboard_layout',
            'items_per_page', 'default_job_view', 'show_analytics_widgets', 'widget_positions',
            
            # Job Posting Preferences
            'default_job_type', 'default_experience_level', 'default_interview_method',
            'auto_close_expired_jobs', 'auto_repost_expired_jobs', 'require_cover_letter',
            'allow_anonymous_applications', 'auto_acknowledge_applications', 'application_deadline_days',
            
            # Interview Preferences
            'default_interview_duration', 'default_interview_buffer', 'auto_generate_meeting_links',
            'send_interview_reminders', 'reminder_hours_before', 'require_interview_feedback',
            'feedback_deadline_hours', 'auto_send_feedback_reminders', 'default_feedback_template',
            
            # Proxy Detection Settings
            'enable_proxy_detection', 'proxy_detection_sensitivity', 'block_known_proxies',
            'block_datacenter_ips', 'allowed_countries', 'blocked_countries',
            
            # Integration Settings
            'email_integration_enabled', 'email_provider', 'calendar_integration_enabled',
            'calendar_provider', 'auto_create_calendar_events', 'ats_integration_enabled',
            'ats_provider', 'linkedin_integration_enabled', 'auto_post_jobs_linkedin',
            
            # Billing Preferences
            'preferred_currency', 'billing_email', 'auto_renew_subscriptions', 'billing_notifications',
            
            # Privacy Settings
            'allow_data_analytics', 'share_anonymous_usage', 'allow_marketing_emails',
            'allow_partner_communications', 'candidate_data_retention_days',
            'auto_delete_rejected_applications', 'allow_candidate_data_export',
            
            # Advanced Settings
            'api_access_enabled', 'api_rate_limit', 'webhook_notifications',
            'custom_job_fields', 'custom_application_fields', 'custom_candidate_fields',
            'auto_backup_enabled', 'backup_frequency',
            
            # Timestamps and computed fields
            'created_at', 'updated_at', 'last_sync_at',
            'settings_summary', 'notification_preferences', 'security_settings', 'dashboard_preferences'
        ]
        read_only_fields = ['id', 'employer', 'created_at', 'updated_at', 'last_sync_at']
    
    def get_settings_summary(self, obj):
        """Get summary of settings for quick overview"""
        return obj.get_settings_summary()
    
    def get_notification_preferences(self, obj):
        """Get formatted notification preferences"""
        return obj.get_notification_preferences()
    
    def get_security_settings(self, obj):
        """Get security settings summary"""
        return obj.get_security_settings()
    
    def get_dashboard_preferences(self, obj):
        """Get dashboard preferences"""
        return obj.get_dashboard_preferences()
    
    def validate_quiet_hours_start(self, value):
        """Validate quiet hours start time"""
        if value and not isinstance(value, str):
            try:
                from datetime import datetime
                datetime.strptime(str(value), '%H:%M')
            except ValueError:
                raise serializers.ValidationError("Invalid time format. Use HH:MM format.")
        return value
    
    def validate_quiet_hours_end(self, value):
        """Validate quiet hours end time"""
        if value and not isinstance(value, str):
            try:
                from datetime import datetime
                datetime.strptime(str(value), '%H:%M')
            except ValueError:
                raise serializers.ValidationError("Invalid time format. Use HH:MM format.")
        return value
    
    def validate_allowed_ip_addresses(self, value):
        """Validate IP addresses format"""
        if value:
            import ipaddress
            for ip in value:
                try:
                    ipaddress.ip_address(ip)
                except ValueError:
                    raise serializers.ValidationError(f"Invalid IP address: {ip}")
        return value
    
    def validate_api_rate_limit(self, value):
        """Validate API rate limit"""
        if value is not None and value < 1:
            raise serializers.ValidationError("API rate limit must be at least 1 request per hour.")
        return value
    
    def validate_data_retention_days(self, value):
        """Validate data retention period"""
        if value is not None and value < 30:
            raise serializers.ValidationError("Data retention period must be at least 30 days.")
        return value
    
    def update(self, instance, validated_data):
        """Custom update method to handle notification preferences"""
        # Handle notification preferences update
        if any(field.startswith('notify_') for field in validated_data.keys()):
            # Set default notification preferences if needed
            instance.set_default_notification_preferences()
        
        # Update all fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class EmployerSettingsUpdateSerializer(serializers.ModelSerializer):
    """Simplified serializer for partial settings updates"""
    
    class Meta:
        model = EmployerSettings
        fields = '__all__'
        read_only_fields = ['id', 'employer', 'created_at', 'updated_at', 'last_sync_at']
    
    def validate(self, data):
        """Validate settings data"""
        # Ensure notification preferences are lists
        notification_fields = [
            'notify_new_applications', 'notify_application_updates', 'notify_interview_scheduled',
            'notify_interview_reminders', 'notify_candidate_messages', 'notify_system_updates',
            'notify_security_alerts', 'notify_billing_updates', 'notify_feature_updates'
        ]
        
        for field in notification_fields:
            if field in data and not isinstance(data[field], list):
                raise serializers.ValidationError(f"{field} must be a list of notification types.")
        
        return data
