from django.db import models
from django.contrib.auth.models import User


class ATSProfile(models.Model):
    """ATS Profile that can be used by both Employees and Employers"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ats_score = models.FloatField(default=0.0, help_text="ATS compatibility score (0-100)")
    keywords_optimized = models.JSONField(default=list, help_text="List of optimized keywords")
    last_scan_date = models.DateTimeField(auto_now=True)
    scan_count = models.IntegerField(default=0)
    
    # Different usage for Employee vs Employer
    usage_type = models.CharField(
        max_length=20,
        choices=[
            ('RESUME_OPTIMIZATION', 'Resume Optimization'),
            ('JOB_DESCRIPTION', 'Job Description Analysis'),
        ],
        default='RESUME_OPTIMIZATION'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ats_profiles'
        verbose_name = 'ATS Profile'
        verbose_name_plural = 'ATS Profiles'


class ATSAnalysis(models.Model):
    """ATS Analysis results for documents"""
    
    ANALYSIS_TYPES = [
        ('RESUME', 'Resume Analysis'),
        ('JOB_DESCRIPTION', 'Job Description Analysis'),
        ('COVER_LETTER', 'Cover Letter Analysis'),
    ]
    
    ats_profile = models.ForeignKey(ATSProfile, on_delete=models.CASCADE, related_name='analyses')
    analysis_type = models.CharField(max_length=20, choices=ANALYSIS_TYPES)
    
    # Document content
    document_text = models.TextField()
    document_file = models.FileField(upload_to='ats_documents/', null=True, blank=True)
    
    # Analysis results
    score = models.FloatField(help_text="ATS compatibility score (0-100)")
    feedback = models.JSONField(default=dict, help_text="Detailed feedback and suggestions")
    keywords_found = models.JSONField(default=list)
    keywords_missing = models.JSONField(default=list)
    
    # Improvement suggestions
    suggestions = models.JSONField(default=list, help_text="List of improvement suggestions")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ats_analyses'
        verbose_name = 'ATS Analysis'
        verbose_name_plural = 'ATS Analyses'
        ordering = ['-created_at']


class ATSKeywordLibrary(models.Model):
    """Shared keyword library for different industries and roles"""
    
    industry = models.CharField(max_length=100)
    role_category = models.CharField(max_length=100)
    keywords = models.JSONField(default=list, help_text="List of relevant keywords")
    importance_score = models.IntegerField(default=1, help_text="Keyword importance (1-10)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ats_keyword_library'
        unique_together = ['industry', 'role_category']
        verbose_name = 'ATS Keyword Library'
        verbose_name_plural = 'ATS Keyword Libraries'


class ATSSettings(models.Model):
    """Global ATS settings and configuration"""
    
    minimum_score_threshold = models.FloatField(default=70.0)
    max_analyses_per_day = models.IntegerField(default=10)
    premium_max_analyses = models.IntegerField(default=50)
    
    # AI/ML model settings
    model_version = models.CharField(max_length=20, default='v1.0')
    model_accuracy = models.FloatField(default=85.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ats_settings'
        verbose_name = 'ATS Settings'