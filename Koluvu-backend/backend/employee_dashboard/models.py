from django.db import models
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


class EmployeeProfile(models.Model):
    """Employee profile model linked to Django's User model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    phone_number = models.CharField(max_length=20, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')  # Keep for compatibility
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    linkedin_profile = models.URLField(blank=True, default='')  # Keep for compatibility
    github_url = models.URLField(blank=True, default='')
    github_profile = models.URLField(blank=True, default='')  # Keep for compatibility
    portfolio_url = models.URLField(blank=True, default='')
    bio = models.TextField(blank=True, default='')
    profile_picture = models.URLField(blank=True, default='')  # For Google profile pictures
    image_field_picture = models.ImageField(upload_to='employee_photos/', blank=True, null=True)  # For uploaded files
    background_image = models.ImageField(upload_to='employee_backgrounds/', blank=True, null=True)  # For background images
    current_designation = models.CharField(max_length=255, blank=True, default='')
    current_position = models.CharField(max_length=255, blank=True, default='')  # Keep for compatibility
    experience_years = models.IntegerField(null=True, blank=True)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    resume_url = models.URLField(blank=True, default='')
    is_job_seeker = models.BooleanField(default=True)
    is_profile_complete = models.BooleanField(default=False)  # Track onboarding completion
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employee_dashboard_employeeprofile'
    
    def __str__(self):
        return f"{self.user.username} - {self.current_position}"


class Education(models.Model):
    """Education model for employee"""
    DEGREE_CHOICES = [
        ('high_school', 'High School'),
        ('bachelor', 'Bachelor\'s Degree'),
        ('master', 'Master\'s Degree'),
        ('phd', 'PhD'),
        ('diploma', 'Diploma'),
        ('certificate', 'Certificate'),
    ]
    
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=50, choices=DEGREE_CHOICES)
    field_of_study = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=10, blank=True)
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.degree} in {self.field_of_study} from {self.institution}"


class Experience(models.Model):
    """Work experience model for employee"""
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='experience')
    company_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    skills_used = models.TextField(blank=True)

    def __str__(self):
        return f"{self.position} at {self.company_name}"


class Skill(models.Model):
    """Skills model for employee"""
    PROFICIENCY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)
    years_of_experience = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.proficiency}"


class Resume(models.Model):
    """Resume model for employee with builder support"""
    TEMPLATE_CHOICES = [
        ('modern', 'Modern'),
        ('classic', 'Classic'),
        ('creative', 'Creative'),
        ('professional', 'Professional'),
        ('minimal', 'Minimal'),
        ('executive', 'Executive'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('completed', 'Completed'),
        ('published', 'Published'),
    ]
    
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255)
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='modern')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Resume builder fields - JSON data for flexible structure
    personal_info = models.JSONField(default=dict, blank=True)  # Name, contact, summary
    education_data = models.JSONField(default=list, blank=True)  # Education entries
    experience_data = models.JSONField(default=list, blank=True)  # Work experience
    skills_data = models.JSONField(default=list, blank=True)  # Skills and proficiencies
    projects_data = models.JSONField(default=list, blank=True)  # Projects/portfolio
    certifications_data = models.JSONField(default=list, blank=True)  # Certifications
    languages_data = models.JSONField(default=list, blank=True)  # Languages
    custom_sections = models.JSONField(default=list, blank=True)  # Custom sections
    
    # File handling
    file = models.FileField(upload_to='resumes/', blank=True, null=True)  # Generated PDF/DOC
    is_primary = models.BooleanField(default=False)
    
    # Builder settings
    color_scheme = models.CharField(max_length=50, default='blue')
    font_family = models.CharField(max_length=50, default='Arial')
    font_size = models.IntegerField(default=12)
    page_margins = models.CharField(max_length=20, default='normal')  # normal, narrow, wide
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.user.username} - {self.title}"
    
    class Meta:
        ordering = ['-updated_at']


class ResumeTemplate(models.Model):
    """Resume template configurations"""
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    preview_image = models.URLField(blank=True)
    template_config = models.JSONField(default=dict)  # Template-specific styling config
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.display_name


class ResumeSharingLink(models.Model):
    """Shareable links for resumes"""
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='sharing_link')
    link_id = models.CharField(max_length=32, unique=True)  # UUID-based unique identifier
    is_active = models.BooleanField(default=True)
    view_count = models.PositiveIntegerField(default=0)
    password_protected = models.BooleanField(default=False)
    password = models.CharField(max_length=128, blank=True)  # Hashed password
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Share link for {self.resume.title}"


class CandidateSearchProfile(models.Model):
    """Extended profile for candidates with search-specific fields"""
    employee = models.OneToOneField(EmployeeProfile, on_delete=models.CASCADE, related_name='search_profile')
    
    # Professional Information
    department = models.CharField(max_length=255, blank=True, default='')
    industry = models.CharField(max_length=255, blank=True, default='')
    key_skills = models.TextField(blank=True, default='')  # Comma-separated skills
    
    # Compensation Details
    present_ctc = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    expected_ctc = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Availability
    notice_period = models.CharField(max_length=50, blank=True, default='')  # e.g., "30 Days", "Immediate"
    preferred_location = models.CharField(max_length=255, blank=True, default='')  # Comma-separated
    actively_looking = models.BooleanField(default=False)
    
    # Additional Details
    languages = models.CharField(max_length=255, blank=True, default='')  # Comma-separated
    achievements = models.TextField(blank=True, default='')  # JSON or newline-separated
    availability_schedule = models.CharField(max_length=255, blank=True, default='')
    
    # Contact preferences
    whatsapp_number = models.CharField(max_length=20, blank=True, default='')
    contact_call = models.CharField(max_length=20, blank=True, default='')
    contact_email = models.EmailField(blank=True, default='')
    contact_sms = models.CharField(max_length=20, blank=True, default='')
    
    # Search metadata
    last_active = models.DateTimeField(auto_now=True)
    is_searchable = models.BooleanField(default=True)  # Opt-in/out of search
    match_score = models.IntegerField(default=0)  # Calculated match score
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Search Profile - {self.employee.user.get_full_name()}"
    
    class Meta:
        db_table = 'employee_dashboard_candidatesearchprofile'


class CandidateProject(models.Model):
    """Projects/portfolio for candidates"""
    candidate = models.ForeignKey(CandidateSearchProfile, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField()
    technologies_used = models.TextField(blank=True)
    project_url = models.URLField(blank=True, default='')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} - {self.candidate.employee.user.get_full_name()}"
    
    class Meta:
        db_table = 'employee_dashboard_candidateproject'


class CandidateAchievement(models.Model):
    """Achievements and awards for candidates"""
    candidate = models.ForeignKey(CandidateSearchProfile, on_delete=models.CASCADE, related_name='achievement_details')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date_received = models.DateField(null=True, blank=True)
    issuing_organization = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.candidate.employee.user.get_full_name()}"
    
    class Meta:
        db_table = 'employee_dashboard_candidateachievement'


class EmployeeSettings(models.Model):
    """Comprehensive settings model for employee preferences"""
    employee = models.OneToOneField(EmployeeProfile, on_delete=models.CASCADE, related_name='settings')
    
    # Profile Settings
    profile_visibility = models.CharField(
        max_length=20, 
        choices=[('public', 'Public'), ('private', 'Private'), ('connections', 'Connections Only')], 
        default='public'
    )
    show_profile_picture = models.BooleanField(default=True)
    show_contact_info = models.BooleanField(default=True)
    show_experience = models.BooleanField(default=True)
    show_education = models.BooleanField(default=True)
    show_skills = models.BooleanField(default=True)
    show_resume = models.BooleanField(default=True)
    allow_profile_indexing = models.BooleanField(default=True)
    profile_completion_reminder = models.BooleanField(default=True)
    
    # Job Preferences  
    job_alert_frequency = models.CharField(
        max_length=20,
        choices=[('immediate', 'Immediate'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('never', 'Never')],
        default='daily'
    )
    preferred_job_types = models.JSONField(default=list)  # ['full-time', 'part-time', 'contract', 'internship']
    preferred_work_modes = models.JSONField(default=list)  # ['remote', 'hybrid', 'onsite']
    preferred_industries = models.JSONField(default=list)
    preferred_company_sizes = models.JSONField(default=list)  # ['startup', 'small', 'medium', 'large', 'enterprise']
    salary_range_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_range_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    preferred_locations = models.JSONField(default=list)
    exclude_companies = models.JSONField(default=list)  # Companies to exclude from recommendations
    auto_apply_enabled = models.BooleanField(default=False)
    auto_apply_criteria = models.JSONField(default=dict)
    
    # Notification Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    job_recommendations = models.BooleanField(default=True)
    application_updates = models.BooleanField(default=True)
    interview_reminders = models.BooleanField(default=True)
    profile_views = models.BooleanField(default=True)
    new_messages = models.BooleanField(default=True)
    skills_suggestions = models.BooleanField(default=True)
    course_recommendations = models.BooleanField(default=True)
    newsletter_subscription = models.BooleanField(default=False)
    marketing_emails = models.BooleanField(default=False)
    notification_sound = models.BooleanField(default=True)
    quiet_hours_enabled = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(null=True, blank=True)
    quiet_hours_end = models.TimeField(null=True, blank=True)
    
    # Privacy Settings
    allow_recruiter_contact = models.BooleanField(default=True)
    allow_employer_search = models.BooleanField(default=True)
    show_salary_expectations = models.BooleanField(default=False)
    show_current_employer = models.BooleanField(default=True)
    anonymous_profile_views = models.BooleanField(default=False)
    data_retention_period = models.CharField(
        max_length=20,
        choices=[('1year', '1 Year'), ('2years', '2 Years'), ('5years', '5 Years'), ('indefinite', 'Indefinite')],
        default='2years'
    )
    allow_data_export = models.BooleanField(default=True)
    third_party_sharing = models.BooleanField(default=False)
    analytics_tracking = models.BooleanField(default=True)
    cookie_preferences = models.JSONField(default=dict)
    
    # Application Tracking Settings
    application_status_updates = models.BooleanField(default=True)
    track_application_views = models.BooleanField(default=True)
    save_application_drafts = models.BooleanField(default=True)
    auto_save_frequency = models.IntegerField(default=30)  # seconds
    application_reminder_days = models.IntegerField(default=7)
    follow_up_reminders = models.BooleanField(default=True)
    application_analytics = models.BooleanField(default=True)
    export_applications = models.BooleanField(default=True)
    
    # Resume Management Settings
    default_resume_template = models.CharField(max_length=50, default='modern')
    auto_save_resume = models.BooleanField(default=True)
    resume_version_history = models.BooleanField(default=True)
    max_resume_versions = models.IntegerField(default=10)
    resume_backup_enabled = models.BooleanField(default=True)
    resume_sharing_enabled = models.BooleanField(default=True)
    resume_analytics = models.BooleanField(default=True)
    watermark_enabled = models.BooleanField(default=False)
    password_protect_resume = models.BooleanField(default=False)
    
    # Interview & Assessment Settings
    interview_reminder_time = models.IntegerField(default=60)  # minutes before
    mock_interview_enabled = models.BooleanField(default=True)
    skill_assessment_reminders = models.BooleanField(default=True)
    practice_question_difficulty = models.CharField(
        max_length=20,
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard'), ('mixed', 'Mixed')],
        default='mixed'
    )
    interview_feedback_sharing = models.BooleanField(default=True)
    assessment_history_retention = models.IntegerField(default=12)  # months
    
    # Communication Settings
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=[('email', 'Email'), ('phone', 'Phone'), ('whatsapp', 'WhatsApp'), ('platform', 'Platform Message')],
        default='email'
    )
    response_time_expectation = models.CharField(
        max_length=20,
        choices=[('immediate', 'Immediate'), ('1hour', '1 Hour'), ('24hours', '24 Hours'), ('3days', '3 Days')],
        default='24hours'
    )
    language_preference = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Dashboard & UI Settings
    dashboard_layout = models.CharField(
        max_length=20,
        choices=[('grid', 'Grid'), ('list', 'List'), ('compact', 'Compact')],
        default='grid'
    )
    items_per_page = models.IntegerField(default=20)
    show_quick_stats = models.BooleanField(default=True)
    show_progress_bars = models.BooleanField(default=True)
    show_recommendations = models.BooleanField(default=True)
    show_activity_feed = models.BooleanField(default=True)
    theme_preference = models.CharField(
        max_length=20,
        choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')],
        default='light'
    )
    color_scheme = models.CharField(max_length=20, default='blue')
    sidebar_collapsed = models.BooleanField(default=False)
    
    # Security Settings
    two_factor_enabled = models.BooleanField(default=False)
    login_notifications = models.BooleanField(default=True)
    session_timeout = models.IntegerField(default=1440)  # minutes (24 hours)
    password_expiry_days = models.IntegerField(default=90)
    security_alerts = models.BooleanField(default=True)
    
    # Integration Settings
    linkedin_sync = models.BooleanField(default=False)
    github_sync = models.BooleanField(default=False)
    google_calendar_sync = models.BooleanField(default=False)
    external_job_boards = models.JSONField(default=list)
    api_access_enabled = models.BooleanField(default=False)
    webhook_urls = models.JSONField(default=list)
    
    # Subscription & Billing Settings
    subscription_type = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('basic', 'Basic'), ('premium', 'Premium'), ('enterprise', 'Enterprise')],
        default='free'
    )
    auto_renewal = models.BooleanField(default=True)
    billing_notifications = models.BooleanField(default=True)
    usage_alerts = models.BooleanField(default=True)
    feature_access = models.JSONField(default=dict)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_sync = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'employee_dashboard_employeesettings'

    def __str__(self):
        return f"Settings for {self.employee.user.get_full_name()}"
    
    def get_notification_preferences(self):
        """Get all notification preferences as a dict"""
        return {
            'email': self.email_notifications,
            'sms': self.sms_notifications,
            'push': self.push_notifications,
            'job_recommendations': self.job_recommendations,
            'application_updates': self.application_updates,
            'interview_reminders': self.interview_reminders,
            'profile_views': self.profile_views,
            'new_messages': self.new_messages,
            'skills_suggestions': self.skills_suggestions,
            'course_recommendations': self.course_recommendations,
            'newsletter': self.newsletter_subscription,
            'marketing': self.marketing_emails,
            'sound': self.notification_sound,
            'quiet_hours': {
                'enabled': self.quiet_hours_enabled,
                'start': self.quiet_hours_start.strftime('%H:%M') if self.quiet_hours_start else None,
                'end': self.quiet_hours_end.strftime('%H:%M') if self.quiet_hours_end else None,
            }
        }
    
    def get_privacy_settings(self):
        """Get all privacy settings as a dict"""
        return {
            'profile_visibility': self.profile_visibility,
            'recruiter_contact': self.allow_recruiter_contact,
            'employer_search': self.allow_employer_search,
            'salary_visibility': self.show_salary_expectations,
            'current_employer_visibility': self.show_current_employer,
            'anonymous_views': self.anonymous_profile_views,
            'data_retention': self.data_retention_period,
            'data_export': self.allow_data_export,
            'third_party_sharing': self.third_party_sharing,
            'analytics': self.analytics_tracking,
            'cookies': self.cookie_preferences,
        }
    
    def get_job_preferences(self):
        """Get job preferences as a dict"""
        return {
            'alert_frequency': self.job_alert_frequency,
            'job_types': self.preferred_job_types,
            'work_modes': self.preferred_work_modes,
            'industries': self.preferred_industries,
            'company_sizes': self.preferred_company_sizes,
            'salary_range': {
                'min': float(self.salary_range_min) if self.salary_range_min else None,
                'max': float(self.salary_range_max) if self.salary_range_max else None,
            },
            'locations': self.preferred_locations,
            'exclude_companies': self.exclude_companies,
            'auto_apply': {
                'enabled': self.auto_apply_enabled,
                'criteria': self.auto_apply_criteria,
            }
        }
    
    def broadcast_settings_update(self, section=None):
        """Broadcast settings update to connected clients"""
        from shared_services.realtime_notifications import broadcast_to_user
        
        data = {
            'type': 'employee_settings_update',
            'section': section,
            'user_id': self.employee.user.id,
            'timestamp': self.updated_at.isoformat(),
        }
        
        if section:
            # Broadcast specific section update
            if section == 'notifications':
                data['settings'] = self.get_notification_preferences()
            elif section == 'privacy':
                data['settings'] = self.get_privacy_settings()
            elif section == 'job_preferences':
                data['settings'] = self.get_job_preferences()
        
        broadcast_to_user(self.employee.user.id, data)


@receiver(post_save, sender=EmployeeProfile)
def create_employee_settings(sender, instance, created, **kwargs):
    """Create default settings when employee profile is created"""
    if created:
        EmployeeSettings.objects.create(employee=instance)


@receiver(post_save, sender=EmployeeSettings)
def employee_settings_saved(sender, instance, **kwargs):
    """Clear cache and broadcast update when settings are saved"""
    cache_key = f"employee_settings_{instance.employee.user.id}"
    cache.delete(cache_key)
    
    # Broadcast real-time update
    instance.broadcast_settings_update()
