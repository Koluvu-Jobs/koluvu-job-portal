from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q


class EmployerProfile(models.Model):
    """Employer profile model linked to Django's User model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    
    # Company Information
    company_name = models.CharField(max_length=255, default='')
    industry_type = models.CharField(max_length=100, blank=True, default='')
    company_size = models.CharField(max_length=50, blank=True, default='')
    website = models.URLField(blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    company_location = models.TextField(blank=True, default='')
    total_employees = models.IntegerField(null=True, blank=True)
    
    # Contact Person Information
    contact_person = models.CharField(max_length=255, default='')
    designation = models.CharField(max_length=100, blank=True, default='')
    
    # Profile Pictures - Both URL and File Storage
    profile_picture = models.ImageField(upload_to='employer_profiles/', blank=True, null=True, 
                                       help_text="Employer's profile picture stored in database")
    profile_picture_url = models.URLField(blank=True, default='', help_text="Profile picture from social media")
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True,
                                     help_text="Company logo stored in database")
    company_logo_url = models.URLField(blank=True, default='', help_text="Company logo URL")
    
    # Social Media & Professional Links
    linkedin_profile_url = models.URLField(blank=True, default='')
    github_profile_url = models.URLField(blank=True, default='')
    twitter_profile_url = models.URLField(blank=True, default='')
    facebook_profile_url = models.URLField(blank=True, default='')
    instagram_profile_url = models.URLField(blank=True, default='')
    social_media_data = models.JSONField(default=dict, blank=True, help_text="Raw social media profile data")
    
    # Bio and Introduction
    bio = models.TextField(blank=True, default='', help_text="Company bio or introduction")
    employer_introduction = models.TextField(blank=True, default='', help_text="Personal introduction from employer")
    
    # Name Change Restrictions
    last_name_change = models.DateTimeField(null=True, blank=True, help_text="Last time employer/company name was changed")
    employer_name = models.CharField(max_length=255, default="", help_text="Employer's display name")
    
    # Activation Status (Employer-only control)
    is_active = models.BooleanField(default=True, help_text="Company activation status - can only be changed by employer")
    
    # Profile Completion Tracking
    is_profile_complete = models.BooleanField(default=False)
    profile_completion_percentage = models.IntegerField(default=0)
    
    # Verification & Status
    is_verified = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    last_login_location = models.CharField(max_length=255, blank=True, default='')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} - {self.contact_person}"
    
    def save(self, *args, **kwargs):
        """Update profile completion percentage when saving"""
        self.profile_completion_percentage = self.calculate_completion_percentage()
        self.is_profile_complete = self.profile_completion_percentage >= 80
        super().save(*args, **kwargs)
    
    def can_change_names(self):
        """Check if employer/company names can be changed (30-day restriction)"""
        if not self.last_name_change:
            return True, None
        
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        if self.last_name_change > thirty_days_ago:
            next_allowed_date = self.last_name_change + timedelta(days=30)
            return False, next_allowed_date
        
        return True, None
    
    def days_until_next_change(self):
        """Calculate days remaining until names can be changed again"""
        if not self.last_name_change:
            return 0
        
        from datetime import timedelta
        from django.utils import timezone
        
        next_change_date = self.last_name_change + timedelta(days=30)
        days_remaining = (next_change_date - timezone.now()).days
        return max(0, days_remaining)
    
    def update_names(self, employer_name=None, company_name=None):
        """Update employer and company names with 30-day restriction"""
        can_change, next_date = self.can_change_names()
        if not can_change:
            raise ValueError(f"Names can only be changed once every 30 days. Next allowed date: {next_date.strftime('%B %d, %Y')}")
        
        from django.utils import timezone
        
        if employer_name is not None:
            self.employer_name = employer_name
        if company_name is not None:
            self.company_name = company_name
        
        self.last_name_change = timezone.now()
        self.save()
        return True
    
    def calculate_completion_percentage(self):
        """Calculate profile completion percentage"""
        # Required fields (essential for a complete profile)
        required_fields = [
            (self.company_name, "company_name"), 
            (self.contact_person, "contact_person"), 
            (self.phone, "phone"),
            (self.company_location, "company_location"), 
            (self.industry_type, "industry_type"), 
            (self.website, "website")
        ]
        
        # Optional fields (nice to have)
        optional_fields = [
            (self.designation, "designation"), 
            (self.company_size, "company_size"),
            (self.profile_picture or self.profile_picture_url, "profile_picture"),
            (self.company_logo or self.company_logo_url, "company_logo"),
            (self.bio, "bio"), 
            (self.linkedin_profile_url, "linkedin_profile"),
            (self.employer_introduction, "employer_introduction")
        ]
        
        # Count completed fields (non-empty strings, not None, not just whitespace)
        required_completed = sum(1 for field, name in required_fields if field and str(field).strip())
        optional_completed = sum(1 for field, name in optional_fields if field and str(field).strip())
        
        # Required fields worth 70%, optional fields worth 30%
        required_percentage = (required_completed / len(required_fields)) * 70 if required_fields else 0
        optional_percentage = (optional_completed / len(optional_fields)) * 30 if optional_fields else 0
        
        # Debug logging to understand why it shows 28%
        total = int(required_percentage + optional_percentage)
        
        # Return 0 if no meaningful data has been entered
        if required_completed == 0 and optional_completed == 0:
            return 0
            
        return total
    
    def update_from_social_media(self, provider, social_data):
        """Update profile with data from social media platforms"""
        if provider == 'linkedin':
            self._update_from_linkedin(social_data)
        elif provider == 'google':
            self._update_from_google(social_data)
        elif provider == 'github':
            self._update_from_github(social_data)
        
        # Store raw social media data
        if not self.social_media_data:
            self.social_media_data = {}
        self.social_media_data[provider] = social_data
        self.save()
    
    def _update_from_linkedin(self, linkedin_data):
        """Update profile from LinkedIn data"""
        # Update profile picture
        if linkedin_data.get('picture') and not self.profile_picture_url:
            self.profile_picture_url = linkedin_data['picture']
        
        # Update company information if available
        if linkedin_data.get('positions') and linkedin_data['positions'].get('values'):
            current_position = linkedin_data['positions']['values'][0]
            company = current_position.get('company', {})
            
            if company.get('name') and not self.company_name:
                self.company_name = company['name']
            
            if company.get('industry') and not self.industry_type:
                self.industry_type = company['industry']
            
            if company.get('size') and not self.company_size:
                self.company_size = company['size']
            
            if current_position.get('title') and not self.designation:
                self.designation = current_position['title']
        
        # Update LinkedIn profile URL
        if linkedin_data.get('publicProfileUrl'):
            self.linkedin_profile_url = linkedin_data['publicProfileUrl']
    
    def _update_from_google(self, google_data):
        """Update profile from Google data"""
        if google_data.get('picture') and not self.profile_picture_url:
            self.profile_picture_url = google_data['picture']
        
        # Update contact person name from Google
        if google_data.get('given_name') and google_data.get('family_name'):
            full_name = f"{google_data['given_name']} {google_data['family_name']}"
            if not self.contact_person or self.contact_person == self.user.email.split('@')[0]:
                self.contact_person = full_name
                
        # Update employer name if not set
        if not self.employer_name:
            self.employer_name = full_name
    
    def _update_from_github(self, github_data):
        """Update profile from GitHub data"""
        if github_data.get('avatar_url') and not self.profile_picture_url:
            self.profile_picture_url = github_data['avatar_url']
        
        if github_data.get('company') and not self.company_name:
            self.company_name = github_data['company']
        
        if github_data.get('location') and not self.company_location:
            self.company_location = github_data['location']
        
        if github_data.get('blog') and not self.website:
            self.website = github_data['blog']
        
        if github_data.get('html_url'):
            self.github_profile_url = github_data['html_url']
    
    def get_profile_picture(self):
        """Get profile picture URL with fallback"""
        if self.profile_picture:
            return self.profile_picture.url
        elif self.profile_picture_url:
            return self.profile_picture_url
        else:
            # Return default profile picture
            return '/static/images/default-profile.png'
    
    def get_company_logo(self):
        """Get company logo URL with fallback"""
        if self.company_logo:
            return self.company_logo.url
        elif self.company_logo_url:
            return self.company_logo_url
        else:
            # Return default company logo
            return '/static/images/default-company-logo.png'


class Job(models.Model):
    """Comprehensive job posting model with all required fields"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]
    
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('temporary', 'Temporary'),
        ('freelance', 'Freelance'),
    ]
    
    URGENCY_CHOICES = [
        ('normal', 'Normal'),
        ('urgent', 'Urgent'),
    ]
    
    INTERVIEW_METHOD_CHOICES = [
        ('virtual', 'Virtual Interview'),
        ('walkin', 'Walk-in Interview'),
        ('hybrid', 'Hybrid'),
    ]
    
    EDUCATION_LEVEL_CHOICES = [
        ('high_school', 'High School'),
        ('associate', 'Associate Degree'),
        ('bachelor', 'Bachelor\'s Degree'),
        ('master', 'Master\'s Degree'),
        ('phd', 'PhD'),
        ('any', 'Any Education Level'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level (0-1 years)'),
        ('junior', 'Junior (1-3 years)'),
        ('mid', 'Mid Level (3-5 years)'),
        ('senior', 'Senior (5-8 years)'),
        ('lead', 'Lead (8+ years)'),
        ('executive', 'Executive'),
    ]
    
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='jobs')
    
    # ===== BASIC JOB INFORMATION =====
    # 1. Job Title
    title = models.CharField(max_length=255, help_text="Job Title")
    
    # 2. Company Name (automatically populated from employer profile)
    company_name = models.CharField(max_length=255, blank=True, default='', help_text="Company Name")
    
    # 3. Location
    location = models.CharField(max_length=255, help_text="Job Location")
    
    # 4. Industry Type
    industry = models.CharField(max_length=100, blank=True, help_text="Industry Type")
    
    # 5. Salary Range (min, max)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Minimum Salary")
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Maximum Salary")
    salary_currency = models.CharField(max_length=10, default='INR', blank=True, help_text="Currency Code")
    
    # 6. Description
    description = models.TextField(blank=True, default='', help_text="Job Description")
    job_brief = models.TextField(blank=True, default='', help_text="Brief overview of the job")
    responsibilities = models.JSONField(default=list, blank=True, help_text="Job Responsibilities as JSON array")
    
    # 7. Requirements
    requirements = models.JSONField(default=list, blank=True, help_text="Job Requirements as JSON array")
    
    # 8. Benefits
    benefits = models.JSONField(default=list, blank=True, help_text="Benefits and Perks as JSON array")
    perks = models.TextField(blank=True, default='', help_text="Additional Perks (deprecated - use benefits)")  # Deprecated
    
    # 9. FAQs and Screening Questions
    faqs = models.JSONField(default=list, blank=True, help_text="Frequently Asked Questions as JSON list")
    screening_questions = models.JSONField(default=list, blank=True, help_text="Screening questions for applicants")
    
    # 10. Hiring Process
    hiring_process_stages = models.JSONField(default=list, blank=True, help_text="Hiring process stages")
    
    # 11. Application Deadline
    application_deadline = models.DateField(null=True, blank=True, help_text="Application Deadline")
    
    # 12. Contact Information
    contact_email = models.EmailField(blank=True, help_text="Contact Email")
    
    # 13. Job Type (Full-time, Part-time, Internship)
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='full_time', help_text="Job Type")
    
    # 14. Education Level Required
    education_level = models.CharField(max_length=50, choices=EDUCATION_LEVEL_CHOICES, default='any', 
                                      help_text="Required Education Level")
    education = models.CharField(max_length=100, blank=True, default='', help_text="Specific Education Requirements")
    
    # 15. Experience Level Required
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE_LEVEL_CHOICES, default='entry',
                                       help_text="Required Experience Level")
    experience_min = models.IntegerField(default=0, help_text="Minimum Years of Experience")
    experience_max = models.IntegerField(default=0, help_text="Maximum Years of Experience")
    
    # 16. Skills Required
    skills = models.JSONField(default=list, blank=True, help_text="Required Skills as JSON array")
    skills_required = models.JSONField(default=list, blank=True, help_text="Required Skills (deprecated - use skills)")
    
    # 17. Language Proficiency Required
    language_proficiency = models.JSONField(default=list, blank=True, 
                                           help_text="Required Languages with proficiency levels")
    
    # 18. Additional Notes or Instructions
    additional_notes = models.TextField(blank=True, default='', help_text="Additional Notes or Instructions")
    
    # 19. ATS Keywords
    ats_keywords = models.TextField(blank=True, default='', help_text="ATS Keywords for resume matching")
    
    # ===== EMPLOYER DETAILS =====
    # 17. Employer's Name (from employer profile)
    employer_name = models.CharField(max_length=255, blank=True, default='', help_text="Employer's Display Name")
    
    # 18. Employer's Email Address
    employer_email = models.EmailField(blank=True, default='', help_text="Employer's Email")
    
    # 19. Employer's Phone Number
    employer_phone = models.CharField(max_length=20, blank=True, default='', help_text="Employer's Phone Number")
    
    # 20. Employer's LinkedIn Profile URL
    employer_linkedin_url = models.URLField(blank=True, default='', help_text="Employer's LinkedIn Profile")
    
    # 21. Employer's Website URL
    employer_website_url = models.URLField(blank=True, default='', help_text="Employer's Website")
    
    # 22. Employer's Logo Image (from employer profile or custom)
    # NOTE: Use employer_logo for uploaded files, employer_logo_url for external URLs
    # Priority: employer_logo > employer_logo_url > employer.company_logo
    employer_logo = models.ImageField(upload_to='job_employer_logos/', blank=True, null=True,
                                     help_text="Custom employer logo for this job posting (uploaded file)")
    employer_logo_url = models.URLField(blank=True, default='', help_text="Employer logo URL (external link)")
    
    # 23. Employer's Bio or Introduction
    employer_bio = models.TextField(blank=True, default='', help_text="Employer's Bio or Company Introduction")
    
    # 24. Employer's Social Media Handles
    employer_social_media = models.JSONField(default=dict, blank=True,
                                            help_text="Social media handles (Twitter, Facebook, etc.)")
    
    # 25. Company Size (job-specific, may differ from employer profile)
    company_size = models.CharField(max_length=50, blank=True, default='', 
                                   help_text="Company size for this job posting")
    
    # 26. Company Benefits (company-wide benefits information)
    # NOTE: Use 'benefits' field for job-specific benefits (JSONField)
    # Use 'company_benefits' for general company-wide benefits description (TextField)
    company_benefits = models.TextField(blank=True, default='', 
                                       help_text="Company-wide benefits and culture description")
    
    # ===== ADDITIONAL FIELDS =====
    designation = models.CharField(max_length=100, blank=True, help_text="Job Designation")
    department = models.CharField(max_length=100, blank=True, help_text="Department")
    employment_type = models.CharField(max_length=50, blank=True, help_text="Employment Type (On-site, Remote, Hybrid)")
    gender_preference = models.CharField(max_length=20, blank=True, help_text="Gender Preference")
    candidate_profile = models.TextField(blank=True, help_text="Ideal Candidate Profile")
    
    # Interview Details
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='normal', help_text="Job Urgency")
    interview_method = models.CharField(max_length=20, choices=INTERVIEW_METHOD_CHOICES, blank=True, default='',
                                       help_text="Interview Method")
    virtual_platform = models.CharField(max_length=100, blank=True, default='', help_text="Virtual Interview Platform")
    walkin_address = models.TextField(blank=True, default='', help_text="Walk-in Interview Address")
    contact_preferences = models.JSONField(default=list, blank=True, help_text="Contact Preferences")
    notification_preferences = models.JSONField(default=list, blank=True, help_text="Notification Preferences")
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', help_text="Job Status")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Metrics
    views_count = models.IntegerField(default=0, help_text="Number of Views")
    applications_count = models.IntegerField(default=0, help_text="Number of Applications")

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['employer', 'status']),
            models.Index(fields=['job_type', 'status']),
            models.Index(fields=['industry', 'status']),
        ]

    def __str__(self):
        return f"{self.title} at {self.company_name}"
    
    def save(self, *args, **kwargs):
        """Auto-populate employer details from profile if not provided"""
        if not self.company_name:
            self.company_name = self.employer.company_name
        if not self.employer_name:
            self.employer_name = self.employer.employer_name or self.employer.contact_person
        if not self.employer_email:
            self.employer_email = self.employer.user.email
        if not self.employer_phone:
            self.employer_phone = self.employer.phone
        if not self.employer_linkedin_url:
            self.employer_linkedin_url = self.employer.linkedin_profile_url
        if not self.employer_website_url:
            self.employer_website_url = self.employer.website
        if not self.employer_bio:
            self.employer_bio = self.employer.bio
        if not self.company_size:
            self.company_size = self.employer.company_size
        
        # Populate employer logo from profile if not custom
        if not self.employer_logo and not self.employer_logo_url:
            if self.employer.company_logo:
                self.employer_logo_url = self.employer.company_logo.url
            elif self.employer.company_logo_url:
                self.employer_logo_url = self.employer.company_logo_url
        
        super().save(*args, **kwargs)
    
    def increment_views(self):
        """Increment job view count"""
        self.views_count += 1
        self.save(update_fields=['views_count'])
    
    def increment_applications(self):
        """Increment applications count"""
        self.applications_count += 1
        self.save(update_fields=['applications_count'])
    
    def get_employer_logo(self):
        """Get employer logo with fallback"""
        if self.employer_logo:
            return self.employer_logo.url
        elif self.employer_logo_url:
            return self.employer_logo_url
        else:
            return self.employer.get_company_logo()
    
    def extract_keywords_from_description(self):
        """Extract keywords from job description, requirements, and skills for ATS matching"""
        keywords = set()
        
        # Add skills
        if isinstance(self.skills, list):
            keywords.update([skill.lower().strip() for skill in self.skills if skill])
        
        # Add requirements keywords
        if isinstance(self.requirements, list):
            for req in self.requirements:
                if req:
                    # Extract tech terms (simple extraction, can be enhanced)
                    words = req.lower().split()
                    keywords.update([w.strip('.,!?;:') for w in words if len(w) > 3])
        
        # Save to ats_keywords field
        self.ats_keywords = ', '.join(sorted(keywords))
        return list(keywords)


class JobApplication(models.Model):
    """Job application model - Enhanced with employee link and ATS scoring"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]
    
    # Foreign Keys
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    employee = models.ForeignKey('employee_dashboard.EmployeeProfile', on_delete=models.CASCADE, 
                                related_name='job_applications', null=True, blank=True)
    
    # Legacy fields (for backward compatibility)
    candidate_name = models.CharField(max_length=255)
    candidate_email = models.EmailField()
    candidate_phone = models.CharField(max_length=20, blank=True, default='')
    
    # Application Data
    resume = models.FileField(upload_to='application_resumes/', null=True, blank=True)
    resume_file_name = models.CharField(max_length=255, blank=True, default='')
    resume_file_size = models.IntegerField(default=0, help_text='File size in bytes')
    cover_letter = models.TextField(blank=True, default='')
    
    # Screening Questions
    screening_answers = models.JSONField(default=list, blank=True, 
                                        help_text='[{"question": "", "answer": ""}]')
    
    # ATS Scoring
    ats_score = models.FloatField(default=0.0, help_text='ATS match score 0-100')
    matching_keywords = models.JSONField(default=list, blank=True, 
                                        help_text='Keywords matched from job requirements')
    missing_keywords = models.JSONField(default=list, blank=True,
                                       help_text='Important keywords missing from resume')
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    viewed_by_employer = models.BooleanField(default=False)
    viewed_at = models.DateTimeField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        indexes = [
            models.Index(fields=['job', '-ats_score']),
            models.Index(fields=['employee', '-applied_at']),
            models.Index(fields=['status', '-applied_at']),
        ]

    def __str__(self):
        if self.employee:
            return f"{self.employee.user.get_full_name() or self.employee.user.username} - {self.job.title}"
        return f"{self.candidate_name} - {self.job.title}"
    
    def mark_as_viewed(self):
        """Mark application as viewed by employer"""
        if not self.viewed_by_employer:
            from django.utils import timezone
            self.viewed_by_employer = True
            self.viewed_at = timezone.now()
            self.save(update_fields=['viewed_by_employer', 'viewed_at'])


class Candidate(models.Model):
    """Candidate model for interview scheduling"""
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    current_position = models.CharField(max_length=255, blank=True)
    experience_years = models.IntegerField(default=0)
    skills = models.TextField(blank=True)  # Comma separated
    resume = models.FileField(upload_to='candidate_resumes/', null=True, blank=True)
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, null=True, blank=True, related_name='candidate_profile')
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='candidates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.current_position}"


class Interviewer(models.Model):
    """Interviewer model"""
    name = models.CharField(max_length=255)
    email = models.EmailField()
    designation = models.CharField(max_length=255)
    department = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='interviewers')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.designation}"


class Interview(models.Model):
    """Interview model"""
    INTERVIEW_TYPE_CHOICES = [
        ('video', 'Video Interview'),
        ('phone', 'Phone Interview'),
        ('inperson', 'In-Person Interview'),
        ('assessment', 'Assessment'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
        ('no_show', 'No Show'),
    ]
    
    DURATION_CHOICES = [
        (30, '30 minutes'),
        (45, '45 minutes'),
        (60, '1 hour'),
        (90, '1 hour 30 minutes'),
        (120, '2 hours'),
    ]
    
    # Basic Details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPE_CHOICES, default='video')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Participants
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='interviews')
    job_position = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='interviews')
    interviewers = models.ManyToManyField(Interviewer, related_name='interviews')
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='interviews')
    
    # Scheduling
    interview_date = models.DateField()
    interview_time = models.TimeField()
    duration = models.IntegerField(choices=DURATION_CHOICES, default=60)  # in minutes
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Location/Platform
    location = models.TextField(blank=True)  # For in-person or meeting link
    meeting_link = models.URLField(blank=True)  # Auto-generated for video interviews
    meeting_id = models.CharField(max_length=100, blank=True)
    meeting_password = models.CharField(max_length=50, blank=True)
    
    # Notifications
    send_reminder = models.BooleanField(default=True)
    reminder_sent = models.BooleanField(default=False)
    
    # Feedback & Results
    feedback = models.TextField(blank=True)
    result = models.CharField(max_length=50, blank=True)  # passed, failed, pending
    next_round = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['interview_date', 'interview_time']
        indexes = [
            models.Index(fields=['interview_date', 'interview_time']),
            models.Index(fields=['employer', 'status']),
            models.Index(fields=['candidate', 'status']),
        ]

    def __str__(self):
        return f"{self.title} - {self.candidate.name} on {self.interview_date}"
    
    @property
    def datetime_local(self):
        """Get interview datetime in local timezone"""
        from datetime import datetime, time
        return datetime.combine(self.interview_date, self.interview_time)
    
    def generate_meeting_link(self):
        """Generate meeting link for video interviews"""
        if self.interview_type == 'video':
            import uuid
            meeting_id = str(uuid.uuid4())[:8]
            self.meeting_id = meeting_id
            self.meeting_link = f"https://meet.koluvu.com/interview/{meeting_id}"
            self.save(update_fields=['meeting_id', 'meeting_link'])
    
    def send_calendar_invite(self):
        """Send calendar invite to all participants"""
        # This would integrate with email service to send calendar invites
        pass


class InterviewNote(models.Model):
    """Notes taken during interviews"""
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='notes')
    interviewer = models.ForeignKey(Interviewer, on_delete=models.CASCADE)
    note = models.TextField()
    rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])  # 1-5 scale
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.interviewer.name} for {self.interview.title}"


class InterviewTimeSlot(models.Model):
    """Available time slots for interviews"""
    interviewer = models.ForeignKey(Interviewer, on_delete=models.CASCADE, related_name='time_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    is_blocked = models.BooleanField(default=False)  # Manually blocked by interviewer
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['interviewer', 'date', 'start_time']
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.interviewer.name} - {self.date} {self.start_time}-{self.end_time}"


class ProxyScanSession(models.Model):
    """Model to track proxy scanning sessions"""
    SCAN_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scanning', 'Scanning'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    RISK_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='proxy_scans')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='proxy_scans', null=True, blank=True)
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='proxy_scans', null=True, blank=True)
    
    # Scan Details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    scan_status = models.CharField(max_length=20, choices=SCAN_STATUS_CHOICES, default='pending')
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES, default='low')
    
    # Detection Results
    is_proxy = models.BooleanField(default=False)
    is_vpn = models.BooleanField(default=False)
    is_tor = models.BooleanField(default=False)
    is_hosting = models.BooleanField(default=False)
    is_datacenter = models.BooleanField(default=False)
    
    # Location Data
    country = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    
    # ISP Information
    isp = models.CharField(max_length=255, blank=True)
    organization = models.CharField(max_length=255, blank=True)
    as_number = models.CharField(max_length=50, blank=True)
    as_name = models.CharField(max_length=255, blank=True)
    
    # Threat Intelligence
    threat_score = models.IntegerField(default=0)  # 0-100 scale
    is_malicious = models.BooleanField(default=False)
    is_suspicious = models.BooleanField(default=False)
    
    # API Response Data
    raw_response = models.JSONField(default=dict, blank=True)
    api_sources = models.JSONField(default=list, blank=True)  # List of APIs used
    
    # Timestamps
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['employer', '-started_at']),
            models.Index(fields=['ip_address']),
            models.Index(fields=['scan_status']),
            models.Index(fields=['risk_level']),
        ]
    
    def __str__(self):
        return f"Proxy Scan - {self.ip_address} ({self.scan_status})"
    
    @property
    def duration(self):
        """Calculate scan duration"""
        if self.completed_at:
            return self.completed_at - self.started_at
        return None
    
    @property
    def location_string(self):
        """Get formatted location string"""
        location_parts = [self.city, self.region, self.country]
        return ", ".join(filter(None, location_parts))


class ProxyDetectionRule(models.Model):
    """Custom rules for proxy detection"""
    RULE_TYPE_CHOICES = [
        ('ip_range', 'IP Range'),
        ('asn', 'ASN Block'),
        ('country', 'Country Block'),
        ('isp', 'ISP Block'),
        ('keyword', 'Keyword Block'),
    ]
    
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='proxy_rules')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPE_CHOICES)
    rule_value = models.CharField(max_length=500)  # IP range, ASN, country code, etc.
    is_active = models.BooleanField(default=True)
    block_access = models.BooleanField(default=True)  # Whether to block or just flag
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        unique_together = ['employer', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.rule_type})"


class ProxyAlert(models.Model):
    """Alerts generated from proxy detection"""
    ALERT_TYPE_CHOICES = [
        ('proxy_detected', 'Proxy Detected'),
        ('vpn_detected', 'VPN Detected'),
        ('tor_detected', 'Tor Detected'),
        ('suspicious_location', 'Suspicious Location'),
        ('multiple_locations', 'Multiple Locations'),
        ('high_risk_ip', 'High Risk IP'),
        ('custom_rule', 'Custom Rule Triggered'),
    ]
    
    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]
    
    scan_session = models.ForeignKey(ProxyScanSession, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=30, choices=ALERT_TYPE_CHOICES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='warning')
    title = models.CharField(max_length=255)
    description = models.TextField()
    recommendation = models.TextField(blank=True)
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['scan_session', '-created_at']),
            models.Index(fields=['severity']),
            models.Index(fields=['is_resolved']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.severity})"


# ============= INTERVIEW FEEDBACK SYSTEM =============

class InterviewFeedback(models.Model):
    """Interview feedback model for post-interview evaluation"""
    STATUS_CHOICES = [
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
        ('hold', 'Hold'),
        ('shortlisted', 'Shortlisted'),
        ('next_round', 'Next Round'),
    ]
    
    RATING_CHOICES = [
        (1, 'Poor'),
        (2, 'Below Average'),
        (3, 'Average'),
        (4, 'Good'),
        (5, 'Excellent'),
    ]
    
    # Foreign keys
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='interview_feedbacks')
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='feedbacks', null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='feedbacks')
    interviewer = models.ForeignKey(Interviewer, on_delete=models.CASCADE, related_name='given_feedbacks')
    
    # Basic Information
    candidate_name = models.CharField(max_length=255)
    position_applied = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    interview_date = models.DateField()
    interview_duration = models.DurationField(null=True, blank=True)
    
    # Interview Status and Decision
    interview_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    decision_rationale = models.TextField(blank=True)
    
    # Detailed Feedback Sections
    skills_assessment = models.TextField()
    behavior_assessment = models.TextField()
    technical_skills = models.TextField()
    
    # Rating System
    overall_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    skills_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    communication_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    technical_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    culture_fit_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    
    # Additional Information
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    improvement_suggestions = models.TextField(blank=True)
    next_steps = models.TextField(blank=True)
    
    # Compensation and Offer Details (if selected)
    offered_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    offer_details = models.JSONField(null=True, blank=True)
    
    # Metadata
    is_submitted = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Internal Notes
    internal_notes = models.TextField(blank=True)
    hr_notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'employer_interview_feedback'
        unique_together = ['interview', 'interviewer']  # One feedback per interviewer per interview
        indexes = [
            models.Index(fields=['employer', 'interview_status']),
            models.Index(fields=['candidate', 'interview_date']),
            models.Index(fields=['interviewer', 'submitted_at']),
            models.Index(fields=['interview_status', 'created_at']),
            models.Index(fields=['overall_rating', 'interview_date']),
        ]
        ordering = ['-interview_date', '-created_at']

    def __str__(self):
        return f"Feedback for {self.candidate_name} - {self.position_applied} ({self.interview_status})"

    def save(self, *args, **kwargs):
        # Auto-populate candidate name if not provided
        if not self.candidate_name and self.candidate:
            self.candidate_name = self.candidate.name
        
        # Set submitted timestamp when feedback is submitted
        if self.is_submitted and not self.submitted_at:
            from django.utils import timezone
            self.submitted_at = timezone.now()
            
        super().save(*args, **kwargs)

    @property
    def average_rating(self):
        """Calculate average rating across all rating fields"""
        ratings = [
            self.overall_rating,
            self.skills_rating,
            self.communication_rating,
            self.technical_rating,
            self.culture_fit_rating
        ]
        valid_ratings = [r for r in ratings if r is not None]
        if valid_ratings:
            return sum(valid_ratings) / len(valid_ratings)
        return None

    @property
    def feedback_completion_percentage(self):
        """Calculate how complete the feedback is"""
        required_fields = [
            self.skills_assessment,
            self.behavior_assessment,
            self.technical_skills,
            self.interview_status
        ]
        completed_fields = sum(1 for field in required_fields if field)
        return (completed_fields / len(required_fields)) * 100


class FeedbackTemplate(models.Model):
    """Template for standardized feedback forms"""
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='feedback_templates')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Template Configuration
    template_data = models.JSONField()  # Store template structure as JSON
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Usage tracking
    usage_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employer_feedback_templates'
        indexes = [
            models.Index(fields=['employer', 'is_active']),
            models.Index(fields=['is_default', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} - {self.employer.company_name}"


class FeedbackReminder(models.Model):
    """Reminder system for pending feedback"""
    REMINDER_TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('system', 'System Notification'),
    ]
    
    feedback = models.ForeignKey(InterviewFeedback, on_delete=models.CASCADE, related_name='reminders')
    interviewer = models.ForeignKey(Interviewer, on_delete=models.CASCADE, related_name='feedback_reminders')
    
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPE_CHOICES)
    message = models.TextField()
    scheduled_at = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'employer_feedback_reminders'
        indexes = [
            models.Index(fields=['scheduled_at', 'is_sent']),
            models.Index(fields=['interviewer', 'is_sent']),
        ]

    def __str__(self):
        return f"Reminder for {self.interviewer.name} - {self.feedback.candidate_name}"


class Notification(models.Model):
    """Enhanced real-time notifications for job-related activities"""
    NOTIFICATION_TYPES = [
        ('application', 'New Application'),
        ('interview', 'Interview Scheduled'),
        ('message', 'New Message'),
        ('system', 'System Notification'),
        ('job_update', 'Job Update'),
        ('profile_update', 'Profile Update'),
        ('account_update', 'Account Update'),
        ('application_status', 'Application Status Change'),
        ('interview_reminder', 'Interview Reminder'),
        ('job_expired', 'Job Expired'),
        ('new_candidate', 'New Candidate'),
    ]
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    
    # Enhanced notification fields
    type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)  # Renamed for consistency
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Related objects for job-based notifications
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    application = models.ForeignKey('JobApplication', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    interview = models.ForeignKey('Interview', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    
    # Metadata for rich notifications
    metadata = models.JSONField(default=dict, blank=True)  # Additional data like URLs, actions
    
    # Status fields
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    is_dismissed = models.BooleanField(default=False)
    dismissed_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # For time-sensitive notifications
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['type', 'created_at']),
            models.Index(fields=['job', 'type']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.username}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def dismiss(self):
        """Dismiss notification"""
        if not self.is_dismissed:
            self.is_dismissed = True
            self.dismissed_at = timezone.now()
            self.save(update_fields=['is_dismissed', 'dismissed_at'])
    
    def is_expired(self):
        """Check if notification is expired"""
        if not self.expires_at:
            return False
        return timezone.now() > self.expires_at
    
    @classmethod
    def create_job_application_notification(cls, job, application):
        """Create notification when someone applies to a job"""
        return cls.objects.create(
            recipient=job.employer.user,
            sender=application.applicant if hasattr(application, 'applicant') else None,
            type='application',
            title=f'New Application for {job.title}',
            message=f'Someone has applied for your job posting "{job.title}". Review the application to proceed.',
            job=job,
            application=application,
            metadata={
                'job_id': job.id,
                'job_title': job.title,
                'application_id': application.id,
                'action_url': f'/employer/applications/{application.id}',
                'priority': 'high'
            }
        )
    
    @classmethod
    def create_job_status_notification(cls, job, status_change):
        """Create notification when job status changes"""
        return cls.objects.create(
            recipient=job.employer.user,
            type='job_update',
            title=f'Job Status Updated: {job.title}',
            message=f'Your job "{job.title}" status has been changed to {status_change}.',
            job=job,
            metadata={
                'job_id': job.id,
                'job_title': job.title,
                'status': status_change,
                'action_url': f'/employer/jobs/{job.id}',
                'priority': 'medium'
            }
        )
    
    @classmethod
    def create_interview_notification(cls, interview):
        """Create notification for interview scheduling"""
        # Notify employer
        employer_notification = cls.objects.create(
            recipient=interview.employer.user,
            type='interview',
            title=f'Interview Scheduled: {interview.title}',
            message=f'Interview for {interview.candidate.name} has been scheduled for {interview.interview_date} at {interview.interview_time}.',
            interview=interview,
            job=interview.job_position if hasattr(interview, 'job_position') else None,
            metadata={
                'interview_id': interview.id,
                'candidate_name': interview.candidate.name,
                'interview_date': interview.interview_date.isoformat(),
                'interview_time': interview.interview_time.isoformat(),
                'action_url': f'/employer/interviews/{interview.id}',
                'priority': 'high'
            }
        )
        
        # Notify candidate if they have a user account
        if hasattr(interview.candidate, 'user') and interview.candidate.user:
            cls.objects.create(
                recipient=interview.candidate.user,
                sender=interview.employer.user,
                type='interview',
                title=f'Interview Scheduled: {interview.title}',
                message=f'You have an interview scheduled for {interview.interview_date} at {interview.interview_time}.',
                interview=interview,
                metadata={
                    'interview_id': interview.id,
                    'company_name': interview.employer.company_name,
                    'interview_date': interview.interview_date.isoformat(),
                    'interview_time': interview.interview_time.isoformat(),
                    'action_url': f'/employee/interviews/{interview.id}',
                    'priority': 'high'
                }
            )
        
        return employer_notification


class Message(models.Model):
    """Enhanced messages between users with job context"""
    MESSAGE_TYPES = [
        ('general', 'General Message'),
        ('application', 'Application Related'),
        ('interview', 'Interview Related'),
        ('job_inquiry', 'Job Inquiry'),
        ('system', 'System Message'),
    ]
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    
    # Message content
    subject = models.CharField(max_length=255)
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='general')
    
    # Related objects for context
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    application = models.ForeignKey('JobApplication', on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    interview = models.ForeignKey('Interview', on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    
    # Attachments and metadata
    attachments = models.JSONField(default=list, blank=True)  # File attachments
    metadata = models.JSONField(default=dict, blank=True)  # Additional message data
    
    # Status and tracking
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['sender', 'created_at']),
            models.Index(fields=['job', 'message_type']),
        ]
    
    def __str__(self):
        return f"{self.subject} - From {self.sender.username} to {self.recipient.username}"
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def get_conversation_thread(self):
        """Get all messages in this conversation thread"""
        if self.reply_to:
            # This is a reply, get the original message's thread
            root_message = self.reply_to
            while root_message.reply_to:
                root_message = root_message.reply_to
            return Message.objects.filter(
                Q(id=root_message.id) | Q(reply_to=root_message)
            ).order_by('created_at')
        else:
            # This is the root message, get all replies
            return Message.objects.filter(
                Q(id=self.id) | Q(reply_to=self)
            ).order_by('created_at')


# ============= EMPLOYER SETTINGS SYSTEM =============

class EmployerSettings(models.Model):
    """Comprehensive settings for employer dashboard and preferences"""
    
    # Notification Types
    NOTIFICATION_TYPES = [
        ('email', 'Email'),
        ('push', 'Push Notification'),
        ('sms', 'SMS'),
        ('in_app', 'In-App Notification'),
    ]
    
    # Theme Choices
    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('auto', 'Auto'),
        ('purple', 'Purple'),
        ('blue', 'Blue'),
        ('green', 'Green'),
    ]
    
    # Language Choices
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('de', 'German'),
        ('hi', 'Hindi'),
        ('ja', 'Japanese'),
        ('zh', 'Chinese'),
    ]
    
    # Privacy Levels
    PRIVACY_LEVELS = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('connections', 'Connections Only'),
        ('verified', 'Verified Users Only'),
    ]
    
    # Dashboard Layouts
    DASHBOARD_LAYOUTS = [
        ('grid', 'Grid View'),
        ('list', 'List View'),
        ('compact', 'Compact View'),
        ('detailed', 'Detailed View'),
    ]
    
    employer = models.OneToOneField(EmployerProfile, on_delete=models.CASCADE, related_name='settings')
    
    # ===== PROFILE SETTINGS =====
    # Auto-update profile from social media
    auto_update_from_linkedin = models.BooleanField(default=True)
    auto_update_from_google = models.BooleanField(default=True)
    auto_sync_company_info = models.BooleanField(default=True)
    
    # Profile visibility
    profile_visibility = models.CharField(max_length=20, choices=PRIVACY_LEVELS, default='public')
    show_contact_info = models.BooleanField(default=True)
    show_company_size = models.BooleanField(default=True)
    show_website = models.BooleanField(default=True)
    show_social_media = models.BooleanField(default=True)
    allow_profile_search = models.BooleanField(default=True)
    
    # ===== NOTIFICATION PREFERENCES =====
    # Job-related notifications
    notify_new_applications = models.JSONField(default=list, blank=True)
    notify_application_updates = models.JSONField(default=list, blank=True)
    notify_interview_scheduled = models.JSONField(default=list, blank=True)
    notify_interview_reminders = models.JSONField(default=list, blank=True)
    notify_candidate_messages = models.JSONField(default=list, blank=True)
    
    # System notifications
    notify_system_updates = models.JSONField(default=list, blank=True)
    notify_security_alerts = models.JSONField(default=list, blank=True)
    notify_billing_updates = models.JSONField(default=list, blank=True)
    notify_feature_updates = models.JSONField(default=list, blank=True)
    
    # Notification frequency
    notification_frequency = models.CharField(
        max_length=20,
        choices=[
            ('instant', 'Instant'),
            ('hourly', 'Hourly Digest'),
            ('daily', 'Daily Digest'),
            ('weekly', 'Weekly Digest'),
        ],
        default='instant'
    )
    
    # Quiet hours
    enable_quiet_hours = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(default='22:00')
    quiet_hours_end = models.TimeField(default='08:00')
    quiet_hours_timezone = models.CharField(max_length=50, default='UTC')
    
    # ===== SECURITY SETTINGS =====
    # Two-factor authentication
    require_2fa = models.BooleanField(default=False)
    backup_email = models.EmailField(blank=True, default='')
    
    # Session security
    auto_logout_minutes = models.IntegerField(default=120)  # 2 hours
    require_ip_verification = models.BooleanField(default=False)
    allowed_ip_addresses = models.JSONField(default=list, blank=True)
    
    # Login notifications
    notify_new_login = models.BooleanField(default=True)
    notify_suspicious_login = models.BooleanField(default=True)
    
    # Data security
    enable_activity_logging = models.BooleanField(default=True)
    enable_audit_trail = models.BooleanField(default=True)
    data_retention_days = models.IntegerField(default=365)
    
    # ===== DASHBOARD PREFERENCES =====
    # Theme and appearance
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default='light')
    custom_theme_colors = models.JSONField(default=dict, blank=True)
    sidebar_collapsed = models.BooleanField(default=False)
    show_animations = models.BooleanField(default=True)
    
    # Language and localization
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    date_format = models.CharField(
        max_length=20,
        choices=[
            ('MM/DD/YYYY', 'MM/DD/YYYY'),
            ('DD/MM/YYYY', 'DD/MM/YYYY'),
            ('YYYY-MM-DD', 'YYYY-MM-DD'),
        ],
        default='MM/DD/YYYY'
    )
    time_format = models.CharField(
        max_length=10,
        choices=[
            ('12h', '12 Hour'),
            ('24h', '24 Hour'),
        ],
        default='12h'
    )
    
    # Dashboard layout
    dashboard_layout = models.CharField(max_length=20, choices=DASHBOARD_LAYOUTS, default='grid')
    items_per_page = models.IntegerField(default=10)
    default_job_view = models.CharField(max_length=20, default='active')
    show_analytics_widgets = models.BooleanField(default=True)
    widget_positions = models.JSONField(default=dict, blank=True)
    
    # ===== JOB POSTING PREFERENCES =====
    # Default job settings
    default_job_type = models.CharField(max_length=50, default='full_time')
    default_experience_level = models.CharField(max_length=50, default='entry')
    default_interview_method = models.CharField(max_length=20, default='virtual')
    auto_close_expired_jobs = models.BooleanField(default=True)
    auto_repost_expired_jobs = models.BooleanField(default=False)
    
    # Application preferences
    require_cover_letter = models.BooleanField(default=False)
    allow_anonymous_applications = models.BooleanField(default=False)
    auto_acknowledge_applications = models.BooleanField(default=True)
    application_deadline_days = models.IntegerField(default=30)
    
    # ===== INTERVIEW PREFERENCES =====
    # Default interview settings
    default_interview_duration = models.IntegerField(default=60)  # minutes
    default_interview_buffer = models.IntegerField(default=15)  # minutes between interviews
    auto_generate_meeting_links = models.BooleanField(default=True)
    send_interview_reminders = models.BooleanField(default=True)
    reminder_hours_before = models.JSONField(default=list, blank=True)
    
    # Interview feedback
    require_interview_feedback = models.BooleanField(default=True)
    feedback_deadline_hours = models.IntegerField(default=24)
    auto_send_feedback_reminders = models.BooleanField(default=True)
    default_feedback_template = models.CharField(max_length=255, blank=True)
    
    # ===== PROXY DETECTION SETTINGS =====
    enable_proxy_detection = models.BooleanField(default=True)
    proxy_detection_sensitivity = models.CharField(
        max_length=10,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
        ],
        default='medium'
    )
    block_known_proxies = models.BooleanField(default=True)
    block_datacenter_ips = models.BooleanField(default=False)
    allowed_countries = models.JSONField(default=list, blank=True)
    blocked_countries = models.JSONField(default=list, blank=True)
    
    # ===== INTEGRATION SETTINGS =====
    # Email integrations
    email_integration_enabled = models.BooleanField(default=False)
    email_provider = models.CharField(max_length=50, blank=True)
    email_api_key = models.CharField(max_length=500, blank=True)
    
    # Calendar integrations
    calendar_integration_enabled = models.BooleanField(default=False)
    calendar_provider = models.CharField(max_length=50, blank=True)
    auto_create_calendar_events = models.BooleanField(default=False)
    
    # ATS integrations
    ats_integration_enabled = models.BooleanField(default=False)
    ats_provider = models.CharField(max_length=50, blank=True)
    ats_webhook_url = models.URLField(blank=True)
    
    # Social media integrations
    linkedin_integration_enabled = models.BooleanField(default=False)
    linkedin_access_token = models.CharField(max_length=500, blank=True)
    auto_post_jobs_linkedin = models.BooleanField(default=False)
    
    # ===== BILLING PREFERENCES =====
    preferred_currency = models.CharField(max_length=3, default='USD')
    billing_email = models.EmailField(blank=True)
    auto_renew_subscriptions = models.BooleanField(default=True)
    billing_notifications = models.BooleanField(default=True)
    
    # ===== PRIVACY SETTINGS =====
    # Data sharing
    allow_data_analytics = models.BooleanField(default=True)
    share_anonymous_usage = models.BooleanField(default=True)
    allow_marketing_emails = models.BooleanField(default=False)
    allow_partner_communications = models.BooleanField(default=False)
    
    # Candidate data
    candidate_data_retention_days = models.IntegerField(default=730)  # 2 years
    auto_delete_rejected_applications = models.BooleanField(default=False)
    allow_candidate_data_export = models.BooleanField(default=True)
    
    # ===== ADVANCED SETTINGS =====
    # API access
    api_access_enabled = models.BooleanField(default=False)
    api_rate_limit = models.IntegerField(default=1000)  # requests per hour
    webhook_notifications = models.BooleanField(default=False)
    
    # Custom fields
    custom_job_fields = models.JSONField(default=list, blank=True)
    custom_application_fields = models.JSONField(default=list, blank=True)
    custom_candidate_fields = models.JSONField(default=list, blank=True)
    
    # Backup and export
    auto_backup_enabled = models.BooleanField(default=True)
    backup_frequency = models.CharField(
        max_length=10,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
        ],
        default='weekly'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_sync_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'employer_settings'
        verbose_name = 'Employer Settings'
        verbose_name_plural = 'Employer Settings'
    
    def __str__(self):
        return f"Settings for {self.employer.company_name}"
    
    def save(self, *args, **kwargs):
        """Update last sync timestamp"""
        from django.utils import timezone
        self.last_sync_at = timezone.now()
        super().save(*args, **kwargs)
        
        # Trigger real-time notification for settings update
        self.broadcast_settings_update()
    
    def broadcast_settings_update(self):
        """Broadcast settings update to all connected clients"""
        try:
            from backend.shared_services.realtime_notifications import NotificationManager
            NotificationManager.broadcast_settings_update(self.employer.user.id, {
                'type': 'settings_update',
                'employer_id': self.employer.id,
                'updated_at': self.updated_at.isoformat(),
                'settings_summary': self.get_settings_summary()
            })
        except Exception as e:
            print(f"Error broadcasting settings update: {str(e)}")
    
    def get_settings_summary(self):
        """Get summary of current settings for frontend"""
        return {
            'theme': self.theme,
            'language': self.language,
            'timezone': self.timezone,
            'notification_frequency': self.notification_frequency,
            'dashboard_layout': self.dashboard_layout,
            'proxy_detection_enabled': self.enable_proxy_detection,
            'two_factor_enabled': self.require_2fa,
            'profile_visibility': self.profile_visibility,
        }
    
    def get_notification_preferences(self):
        """Get all notification preferences as a dictionary"""
        return {
            'new_applications': self.notify_new_applications,
            'application_updates': self.notify_application_updates,
            'interview_scheduled': self.notify_interview_scheduled,
            'interview_reminders': self.notify_interview_reminders,
            'candidate_messages': self.notify_candidate_messages,
            'system_updates': self.notify_system_updates,
            'security_alerts': self.notify_security_alerts,
            'billing_updates': self.notify_billing_updates,
            'feature_updates': self.notify_feature_updates,
            'frequency': self.notification_frequency,
            'quiet_hours_enabled': self.enable_quiet_hours,
            'quiet_hours': {
                'start': self.quiet_hours_start.strftime('%H:%M') if self.quiet_hours_start else None,
                'end': self.quiet_hours_end.strftime('%H:%M') if self.quiet_hours_end else None,
                'timezone': self.quiet_hours_timezone,
            } if self.enable_quiet_hours else None
        }
    
    def update_notification_preferences(self, preferences):
        """Update notification preferences from a dictionary"""
        preference_mapping = {
            'new_applications': 'notify_new_applications',
            'application_updates': 'notify_application_updates',
            'interview_scheduled': 'notify_interview_scheduled',
            'interview_reminders': 'notify_interview_reminders',
            'candidate_messages': 'notify_candidate_messages',
            'system_updates': 'notify_system_updates',
            'security_alerts': 'notify_security_alerts',
            'billing_updates': 'notify_billing_updates',
            'feature_updates': 'notify_feature_updates',
        }
        
        for pref_key, field_name in preference_mapping.items():
            if pref_key in preferences:
                setattr(self, field_name, preferences[pref_key])
        
        if 'frequency' in preferences:
            self.notification_frequency = preferences['frequency']
        
        # Handle quiet hours
        if 'quiet_hours_enabled' in preferences:
            self.enable_quiet_hours = preferences['quiet_hours_enabled']
        
        if 'quiet_hours' in preferences and preferences['quiet_hours']:
            quiet_hours = preferences['quiet_hours']
            if 'start' in quiet_hours:
                from datetime import datetime
                self.quiet_hours_start = datetime.strptime(quiet_hours['start'], '%H:%M').time()
            if 'end' in quiet_hours:
                from datetime import datetime
                self.quiet_hours_end = datetime.strptime(quiet_hours['end'], '%H:%M').time()
            if 'timezone' in quiet_hours:
                self.quiet_hours_timezone = quiet_hours['timezone']
        
        self.save()
    
    def get_security_settings(self):
        """Get security settings summary"""
        return {
            'two_factor_enabled': self.require_2fa,
            'backup_email': self.backup_email,
            'auto_logout_minutes': self.auto_logout_minutes,
            'ip_verification_enabled': self.require_ip_verification,
            'allowed_ips': self.allowed_ip_addresses,
            'login_notifications': self.notify_new_login,
            'suspicious_login_alerts': self.notify_suspicious_login,
            'activity_logging': self.enable_activity_logging,
            'audit_trail': self.enable_audit_trail,
            'data_retention_days': self.data_retention_days,
        }
    
    def get_dashboard_preferences(self):
        """Get dashboard preferences"""
        return {
            'theme': self.theme,
            'custom_colors': self.custom_theme_colors,
            'sidebar_collapsed': self.sidebar_collapsed,
            'show_animations': self.show_animations,
            'language': self.language,
            'timezone': self.timezone,
            'date_format': self.date_format,
            'time_format': self.time_format,
            'layout': self.dashboard_layout,
            'items_per_page': self.items_per_page,
            'default_job_view': self.default_job_view,
            'show_analytics': self.show_analytics_widgets,
            'widget_positions': self.widget_positions,
        }
    
    def reset_to_defaults(self):
        """Reset all settings to default values"""
        # Get all field defaults
        for field in self._meta.fields:
            if hasattr(field, 'default') and field.default is not models.NOT_PROVIDED:
                if callable(field.default):
                    setattr(self, field.name, field.default())
                else:
                    setattr(self, field.name, field.default)
        
        self.save()
    
    def set_default_notification_preferences(self):
        """Set default notification preferences"""
        if not self.notify_new_applications:
            self.notify_new_applications = ['email', 'in_app']
        if not self.notify_application_updates:
            self.notify_application_updates = ['in_app']
        if not self.notify_interview_scheduled:
            self.notify_interview_scheduled = ['email', 'in_app']
        if not self.notify_interview_reminders:
            self.notify_interview_reminders = ['email', 'push']
        if not self.notify_candidate_messages:
            self.notify_candidate_messages = ['email', 'in_app']
        if not self.notify_system_updates:
            self.notify_system_updates = ['in_app']
        if not self.notify_security_alerts:
            self.notify_security_alerts = ['email', 'in_app']
        if not self.notify_billing_updates:
            self.notify_billing_updates = ['email']
        if not self.notify_feature_updates:
            self.notify_feature_updates = ['in_app']
        if not self.reminder_hours_before:
            self.reminder_hours_before = [24, 2]
    
    @classmethod
    def get_or_create_for_employer(cls, employer):
        """Get or create settings for an employer"""
        settings, created = cls.objects.get_or_create(
            employer=employer,
            defaults={
                'theme': 'light',
                'language': 'en',
                'timezone': 'UTC',
                'notification_frequency': 'instant',
                'dashboard_layout': 'grid',
            }
        )
        
        # Set default notification preferences if this is a new record
        if created:
            settings.set_default_notification_preferences()
            settings.save()
        
        return settings