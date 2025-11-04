from django.db import models
from django.contrib.auth.models import User


class TrainingProviderProfile(models.Model):
    """Training provider profile model linked to Django's User model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='training_provider_profile')
    organization_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    website = models.URLField(blank=True)
    certification_number = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to='training_logos/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'training_dashboard_trainingproviderprofile'

    def __str__(self):
        return f"{self.organization_name} - {self.contact_person}"


class TrainingProgram(models.Model):
    """Training program model"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('draft', 'Draft'),
        ('completed', 'Completed'),
    ]
    
    CATEGORY_CHOICES = [
        ('web_development', 'Web Development'),
        ('mobile_development', 'Mobile Development'),
        ('data_science', 'Data Science'),
        ('artificial_intelligence', 'Artificial Intelligence'),
        ('cybersecurity', 'Cybersecurity'),
        ('cloud_computing', 'Cloud Computing'),
        ('digital_marketing', 'Digital Marketing'),
        ('business_analysis', 'Business Analysis'),
        ('project_management', 'Project Management'),
        ('soft_skills', 'Soft Skills'),
        ('other', 'Other'),
    ]
    
    provider = models.ForeignKey(TrainingProviderProfile, on_delete=models.CASCADE, related_name='programs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    duration_weeks = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.IntegerField()
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    prerequisites = models.TextField(blank=True)
    learning_outcomes = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    syllabus = models.FileField(upload_to='training_materials/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='training_banners/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.provider.organization_name}"

    @property
    def enrolled_count(self):
        return self.enrollments.count()

    @property
    def available_slots(self):
        return self.capacity - self.enrolled_count


class TrainingEnrollment(models.Model):
    """Training enrollment model"""
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
        ('failed', 'Failed'),
    ]
    
    program = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='enrollments')
    student_name = models.CharField(max_length=255)
    student_email = models.EmailField()
    student_phone = models.CharField(max_length=20)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    progress_percentage = models.IntegerField(default=0)
    completion_date = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)
    final_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.student_name} - {self.program.title}"


class Internship(models.Model):
    """Internship model"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('filled', 'Filled'),
        ('cancelled', 'Cancelled'),
    ]
    
    provider = models.ForeignKey(TrainingProviderProfile, on_delete=models.CASCADE, related_name='internships')
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField()
    duration_months = models.IntegerField()
    stipend = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255)
    is_remote = models.BooleanField(default=False)
    start_date = models.DateField()
    application_deadline = models.DateField()
    slots_available = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.provider.organization_name}"


class Placement(models.Model):
    """Placement model for tracking student placements"""
    student_name = models.CharField(max_length=255)
    student_email = models.EmailField()
    training_program = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='placements')
    company_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    placement_date = models.DateField()
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} placed at {self.company_name}"
