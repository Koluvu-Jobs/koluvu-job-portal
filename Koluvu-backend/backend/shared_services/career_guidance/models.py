from django.db import models
from django.contrib.auth.models import User
from employee_dashboard.models import EmployeeProfile


class CareerField(models.Model):
    """Career fields/domains model"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='briefcase')  # Icon name for frontend
    color = models.CharField(max_length=20, default='blue')  # Color theme
    average_salary_range = models.CharField(max_length=50, blank=True)
    growth_rate = models.CharField(max_length=20, blank=True)  # e.g., "15% annually"
    is_trending = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class CareerPath(models.Model):
    """Specific career paths within fields"""
    EXPERIENCE_LEVELS = [
        ('entry', 'Entry Level (0-2 years)'),
        ('mid', 'Mid Level (3-5 years)'),
        ('senior', 'Senior Level (6-10 years)'),
        ('lead', 'Lead/Manager (10+ years)'),
        ('executive', 'Executive Level (15+ years)'),
    ]

    field = models.ForeignKey(CareerField, on_delete=models.CASCADE, related_name='career_paths')
    title = models.CharField(max_length=150)
    description = models.TextField()
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS)
    required_skills = models.JSONField(default=list)  # List of required skills
    preferred_skills = models.JSONField(default=list)  # List of preferred skills
    education_requirements = models.TextField(blank=True)
    average_salary = models.CharField(max_length=50, blank=True)
    job_outlook = models.TextField(blank=True)  # Future prospects
    typical_responsibilities = models.JSONField(default=list)
    career_progression = models.JSONField(default=list)  # Next career steps
    is_remote_friendly = models.BooleanField(default=False)
    demand_level = models.CharField(max_length=20, choices=[
        ('low', 'Low Demand'),
        ('medium', 'Medium Demand'),
        ('high', 'High Demand'),
        ('very_high', 'Very High Demand'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.experience_level})"

    class Meta:
        ordering = ['field', 'experience_level', 'title']


class SkillAssessment(models.Model):
    """Skills assessment for career guidance"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=50)  # technical, soft_skills, domain_specific
    questions = models.JSONField(default=list)  # Assessment questions
    scoring_criteria = models.JSONField(default=dict)  # How to score the assessment
    duration_minutes = models.IntegerField(default=30)
    difficulty_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='intermediate')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['category', 'name']


class UserSkillAssessment(models.Model):
    """User's skill assessment results"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_assessments')
    assessment = models.ForeignKey(SkillAssessment, on_delete=models.CASCADE)
    score = models.FloatField()  # Percentage score
    answers = models.JSONField(default=dict)  # User's answers
    time_taken_minutes = models.IntegerField()
    strengths = models.JSONField(default=list)  # Identified strengths
    improvement_areas = models.JSONField(default=list)  # Areas for improvement
    recommendations = models.JSONField(default=list)  # Personalized recommendations
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.assessment.name} ({self.score}%)"

    class Meta:
        ordering = ['-completed_at']
        unique_together = ['user', 'assessment']


class CareerRecommendation(models.Model):
    """AI-generated career recommendations for users"""
    RECOMMENDATION_TYPES = [
        ('career_change', 'Career Change'),
        ('skill_development', 'Skill Development'),
        ('job_search', 'Job Search Strategy'),
        ('education', 'Education/Certification'),
        ('networking', 'Networking'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_recommendations')
    recommendation_type = models.CharField(max_length=30, choices=RECOMMENDATION_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    recommended_paths = models.ManyToManyField(CareerPath, blank=True)
    action_items = models.JSONField(default=list)  # Specific steps to take
    resources = models.JSONField(default=list)  # Helpful resources/links
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low Priority'),
        ('medium', 'Medium Priority'),
        ('high', 'High Priority'),
        ('urgent', 'Urgent'),
    ], default='medium')
    is_read = models.BooleanField(default=False)
    is_implemented = models.BooleanField(default=False)
    confidence_score = models.FloatField(default=0.0)  # AI confidence in recommendation
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"

    class Meta:
        ordering = ['-created_at']


class CareerGoal(models.Model):
    """User's career goals and tracking"""
    GOAL_TYPES = [
        ('skill', 'Skill Development'),
        ('position', 'Position/Role Change'),
        ('salary', 'Salary Increase'),
        ('education', 'Education/Certification'),
        ('industry', 'Industry Change'),
        ('location', 'Location Change'),
    ]

    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_goals')
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.IntegerField(default=0)
    milestones = models.JSONField(default=list)  # Goal milestones
    resources_needed = models.JSONField(default=list)
    obstacles = models.JSONField(default=list)
    success_metrics = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"

    class Meta:
        ordering = ['target_date', '-created_at']


class MentorshipRequest(models.Model):
    """Mentorship requests and connections"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_requests')
    mentor_email = models.EmailField()  # For now, just email - can be expanded later
    career_field = models.ForeignKey(CareerField, on_delete=models.CASCADE)
    specific_areas = models.JSONField(default=list)  # Specific areas of guidance needed
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    session_count = models.IntegerField(default=0)
    last_session_date = models.DateTimeField(null=True, blank=True)
    feedback_rating = models.IntegerField(null=True, blank=True)  # 1-5 rating
    feedback_comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.mentee.username} -> {self.mentor_email}"

    class Meta:
        ordering = ['-created_at']


class CareerResource(models.Model):
    """Career development resources"""
    RESOURCE_TYPES = [
        ('article', 'Article'),
        ('video', 'Video'),
        ('course', 'Online Course'),
        ('book', 'Book'),
        ('tool', 'Tool/Software'),
        ('website', 'Website'),
        ('podcast', 'Podcast'),
        ('webinar', 'Webinar'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    url = models.URLField()
    career_fields = models.ManyToManyField(CareerField, blank=True)
    career_paths = models.ManyToManyField(CareerPath, blank=True)
    tags = models.JSONField(default=list)  # Searchable tags
    difficulty_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='intermediate')
    estimated_time = models.CharField(max_length=50, blank=True)  # e.g., "2 hours", "1 week"
    is_free = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)
    view_count = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-is_featured', '-rating', '-view_count']