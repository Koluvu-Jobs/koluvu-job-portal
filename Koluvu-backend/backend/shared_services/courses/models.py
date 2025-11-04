from django.db import models
from django.contrib.auth.models import User


class SkillCategory(models.Model):
    """Categories for different skills"""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or emoji")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'skill_categories'
        verbose_name_plural = 'Skill Categories'


class Skill(models.Model):
    """Individual skills that can be learned"""
    
    DIFFICULTY_LEVELS = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
        ('EXPERT', 'Expert'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    description = models.TextField(blank=True)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    
    # Market demand data
    market_demand = models.IntegerField(default=0, help_text="Market demand score (0-100)")
    average_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Tags for search and filtering
    tags = models.JSONField(default=list, help_text="Tags for search and filtering")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'skills'
        unique_together = ['name', 'category']


class Course(models.Model):
    """Skill enhancement courses"""
    
    COURSE_TYPES = [
        ('SELF_PACED', 'Self-Paced'),
        ('INSTRUCTOR_LED', 'Instructor-Led'),
        ('BLENDED', 'Blended Learning'),
        ('WORKSHOP', 'Workshop'),
    ]
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('ARCHIVED', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    
    # Course details
    course_type = models.CharField(max_length=20, choices=COURSE_TYPES)
    duration_hours = models.IntegerField(help_text="Course duration in hours")
    difficulty_level = models.CharField(max_length=20, choices=Skill.DIFFICULTY_LEVELS)
    
    # Content and media
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    video_preview = models.URLField(blank=True, help_text="Preview video URL")
    syllabus = models.JSONField(default=list, help_text="Course syllabus as list of modules")
    
    # Relationships
    skills = models.ManyToManyField(Skill, related_name='courses', help_text="Skills taught in this course")
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses_taught')
    
    # Pricing and enrollment
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_free = models.BooleanField(default=False)
    max_enrollments = models.IntegerField(null=True, blank=True)
    
    # Course status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    is_featured = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_enrollments = models.IntegerField(default=0)
    
    # SEO and discoverability
    seo_keywords = models.JSONField(default=list)
    target_audience = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-created_at']


class CourseModule(models.Model):
    """Modules within a course"""
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField()
    
    # Content
    video_url = models.URLField(blank=True)
    reading_materials = models.JSONField(default=list, help_text="List of reading materials")
    assignments = models.JSONField(default=list, help_text="List of assignments")
    
    # Progress tracking
    estimated_hours = models.FloatField(default=1.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'course_modules'
        ordering = ['course', 'order']
        unique_together = ['course', 'order']


class CourseEnrollment(models.Model):
    """Track user enrollments in courses"""
    
    ENROLLMENT_STATUS = [
        ('ENROLLED', 'Enrolled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('DROPPED', 'Dropped'),
        ('REFUNDED', 'Refunded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    
    # Enrollment details
    status = models.CharField(max_length=20, choices=ENROLLMENT_STATUS, default='ENROLLED')
    enrolled_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    # Progress tracking
    progress_percentage = models.FloatField(default=0.0)
    completed_modules = models.JSONField(default=list)
    current_module = models.IntegerField(default=1)
    
    # Engagement metrics
    total_study_time = models.FloatField(default=0.0, help_text="Total study time in hours")
    last_accessed = models.DateTimeField(auto_now=True)
    
    # Assessment and certification
    final_score = models.FloatField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)
    certificate_url = models.URLField(blank=True)
    
    class Meta:
        db_table = 'course_enrollments'
        unique_together = ['user', 'course']


class UserSkillProfile(models.Model):
    """User's skill assessment and learning path"""
    
    PROFICIENCY_LEVELS = [
        ('NONE', 'No Experience'),
        ('BASIC', 'Basic'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
        ('EXPERT', 'Expert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    
    # Current proficiency
    current_level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS, default='NONE')
    target_level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)
    
    # Learning progress - Remove the through relationship to fix the error
    learning_path = models.JSONField(default=list, help_text="Recommended course sequence")
    
    # Assessment and validation
    self_assessed = models.BooleanField(default=True)
    verified_by_employer = models.BooleanField(default=False)
    certification_earned = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_skill_profiles'
        unique_together = ['user', 'skill']


class CourseReview(models.Model):
    """Course reviews and ratings"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment = models.OneToOneField(CourseEnrollment, on_delete=models.CASCADE)
    
    # Review content
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=200, blank=True)
    review_text = models.TextField()
    
    # Review categories
    content_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    instructor_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    value_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    
    # Moderation
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'course_reviews'
        unique_together = ['user', 'course']