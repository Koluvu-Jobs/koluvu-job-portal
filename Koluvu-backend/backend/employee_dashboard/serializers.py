from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import (
    EmployeeProfile, Education, Experience, Skill, Resume, ResumeTemplate, 
    ResumeSharingLink, CandidateSearchProfile, CandidateProject, CandidateAchievement
)


class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.SerializerMethodField()
    google_profile_picture = serializers.SerializerMethodField()
    skills_list = serializers.SerializerMethodField()
    effective_profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone_number', 'phone', 'date_of_birth', 'location', 
            'linkedin_url', 'linkedin_profile', 'github_url', 'github_profile', 
            'portfolio_url', 'bio', 'profile_picture', 'image_field_picture', 
            'background_image', 'google_profile_picture', 'effective_profile_picture',
            'current_designation', 'current_position', 'experience_years', 
            'expected_salary', 'resume_url', 'is_job_seeker', 'is_profile_complete',
            'skills_list', 'created_at', 'updated_at'
        ]
    
    def validate_experience_years(self, value):
        """Validate experience years"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Experience years cannot be negative")
        return value
    
    def validate_expected_salary(self, value):
        """Validate expected salary"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Expected salary cannot be negative")
        return value
    
    def validate_phone_number(self, value):
        """Validate phone number"""
        if value and len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits")
        return value
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
    
    def get_google_profile_picture(self, obj):
        # Get profile picture from Google OAuth if available
        social_account = obj.user.social_accounts.filter(provider='google').first()
        if social_account and social_account.profile_picture_url:
            return social_account.profile_picture_url
        return obj.profile_picture
    
    def get_skills_list(self, obj):
        # Get skills from the related Skill model
        return [
            {
                'name': skill.name,
                'proficiency': skill.proficiency,
                'years_of_experience': skill.years_of_experience
            }
            for skill in obj.skills.all()
        ]
    
    def get_effective_profile_picture(self, obj):
        """Get the most appropriate profile picture URL"""
        # Priority: uploaded image > Google profile picture > profile_picture field
        if obj.image_field_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_field_picture.url)
            return obj.image_field_picture.url
        
        # Check for Google profile picture from social account
        social_account = obj.user.social_accounts.filter(provider='google').first()
        if social_account and social_account.profile_picture_url:
            return social_account.profile_picture_url
            
        # Fall back to profile_picture field (URL)
        return obj.profile_picture if obj.profile_picture else None


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True, required=False)
    profile = EmployeeProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'confirm_password', 'profile']
    
    def validate(self, data):
        """Validate password match and other constraints"""
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        # Check if passwords match (if confirm_password is provided)
        if confirm_password and password != confirm_password:
            raise serializers.ValidationError({
                'confirm_password': "Passwords don't match"
            })
        
        # Check if email already exists
        email = data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                'email': "A user with this email already exists"
            })
        
        return data
    
    def create(self, validated_data):
        # Remove confirm_password before creating user
        validated_data.pop('confirm_password', None)
        profile_data = validated_data.pop('profile', {})
        
        # Generate username from email if not provided
        if 'username' not in validated_data or not validated_data['username']:
            email = validated_data.get('email', '')
            if not email:
                raise serializers.ValidationError("Email is required")
            
            username = email.split('@')[0]
            # Ensure uniqueness by adding number if needed
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            validated_data['username'] = username
        
        try:
            user = User.objects.create_user(**validated_data)
            EmployeeProfile.objects.create(user=user, **profile_data)
            return user
        except Exception as e:
            # Clean up any OTP sessions if user creation fails
            from authentication.models import OTPSession
            email = validated_data.get('email')
            if email:
                OTPSession.objects.filter(identifier=email).delete()
            raise e


class EducationSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date', 'grade', 'is_current', 'duration'
        ]
    
    def get_duration(self, obj):
        if obj.start_date:
            end_date = obj.end_date or timezone.now().date()
            duration = end_date - obj.start_date
            years = duration.days // 365
            months = (duration.days % 365) // 30
            
            if years > 0:
                return f"{years} year{'s' if years != 1 else ''}"
            elif months > 0:
                return f"{months} month{'s' if months != 1 else ''}"
            else:
                return "Less than a month"
        return None
    
    def validate(self, data):
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] <= data['start_date']:
                raise serializers.ValidationError("End date must be after start date")
        return data


class ExperienceSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    skills_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Experience
        fields = [
            'id', 'company_name', 'position', 'location',
            'start_date', 'end_date', 'is_current', 'description', 
            'skills_used', 'duration', 'skills_list'
        ]
    
    def get_duration(self, obj):
        if obj.start_date:
            end_date = obj.end_date or timezone.now().date()
            duration = end_date - obj.start_date
            years = duration.days // 365
            months = (duration.days % 365) // 30
            
            if years > 0:
                if months > 6:
                    return f"{years + 1} year{'s' if years + 1 != 1 else ''}"
                return f"{years} year{'s' if years != 1 else ''}"
            elif months > 0:
                return f"{months} month{'s' if months != 1 else ''}"
            else:
                return "Less than a month"
        return None
    
    def get_skills_list(self, obj):
        if obj.skills_used:
            return [skill.strip() for skill in obj.skills_used.split(',')]
        return []
    
    def validate(self, data):
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] <= data['start_date']:
                raise serializers.ValidationError("End date must be after start date")
        return data


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'proficiency', 'years_of_experience']


class ResumeSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = Resume
        fields = ['id', 'title', 'file', 'file_url', 'file_size', 'is_primary', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def get_file_size(self, obj):
        if obj.file:
            try:
                return obj.file.size
            except:
                return None
        return None


class ResumeBuilderSerializer(serializers.ModelSerializer):
    """Enhanced serializer for resume builder functionality"""
    file_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    section_counts = serializers.SerializerMethodField()
    
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'template', 'status', 'personal_info', 'education_data',
            'experience_data', 'skills_data', 'projects_data', 'certifications_data',
            'languages_data', 'custom_sections', 'color_scheme', 'font_family',
            'font_size', 'page_margins', 'file', 'file_url', 'file_size', 
            'is_primary', 'completion_percentage', 'section_counts', 'created_at', 'updated_at'
        ]
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def get_file_size(self, obj):
        if obj.file:
            try:
                return obj.file.size
            except:
                return None
        return None
    
    def get_completion_percentage(self, obj):
        """Calculate resume completion percentage"""
        total_sections = 7  # personal_info, education, experience, skills, projects, certifications, languages
        completed_sections = 0
        
        # Check each section
        if obj.personal_info and len(obj.personal_info) > 0:
            completed_sections += 1
        if obj.education_data and len(obj.education_data) > 0:
            completed_sections += 1
        if obj.experience_data and len(obj.experience_data) > 0:
            completed_sections += 1
        if obj.skills_data and len(obj.skills_data) > 0:
            completed_sections += 1
        if obj.projects_data and len(obj.projects_data) > 0:
            completed_sections += 1
        if obj.certifications_data and len(obj.certifications_data) > 0:
            completed_sections += 1
        if obj.languages_data and len(obj.languages_data) > 0:
            completed_sections += 1
            
        return int((completed_sections / total_sections) * 100)
    
    def get_section_counts(self, obj):
        """Get counts for each section"""
        return {
            'education': len(obj.education_data) if obj.education_data else 0,
            'experience': len(obj.experience_data) if obj.experience_data else 0,
            'skills': len(obj.skills_data) if obj.skills_data else 0,
            'projects': len(obj.projects_data) if obj.projects_data else 0,
            'certifications': len(obj.certifications_data) if obj.certifications_data else 0,
            'languages': len(obj.languages_data) if obj.languages_data else 0,
            'custom_sections': len(obj.custom_sections) if obj.custom_sections else 0,
        }
    
    def validate_personal_info(self, value):
        """Validate personal info structure"""
        if value and not isinstance(value, dict):
            raise serializers.ValidationError("Personal info must be a dictionary")
        return value
    
    def validate_education_data(self, value):
        """Validate education data structure"""
        if value and not isinstance(value, list):
            raise serializers.ValidationError("Education data must be a list")
        return value
    
    def validate_experience_data(self, value):
        """Validate experience data structure"""
        if value and not isinstance(value, list):
            raise serializers.ValidationError("Experience data must be a list")
        return value


class ResumeTemplateSerializer(serializers.ModelSerializer):
    """Serializer for resume templates"""
    class Meta:
        model = ResumeTemplate
        fields = [
            'id', 'name', 'display_name', 'description', 'preview_image',
            'template_config', 'is_active', 'is_premium', 'created_at'
        ]


class ResumeSharingLinkSerializer(serializers.ModelSerializer):
    """Serializer for resume sharing links"""
    resume_title = serializers.CharField(source='resume.title', read_only=True)
    share_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ResumeSharingLink
        fields = [
            'id', 'link_id', 'resume_title', 'share_url', 'is_active', 
            'view_count', 'password_protected', 'expires_at', 'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_share_url(self, obj):
        """Generate the shareable URL"""
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/shared-resume/{obj.link_id}/')
        return f'/shared-resume/{obj.link_id}/'


class ResumeQuickCreateSerializer(serializers.ModelSerializer):
    """Serializer for quickly creating resumes from profile data"""
    auto_populate = serializers.BooleanField(write_only=True, default=True)
    
    class Meta:
        model = Resume
        fields = ['title', 'template', 'auto_populate']
    
    def create(self, validated_data):
        """Create resume and auto-populate with profile data if requested"""
        auto_populate = validated_data.pop('auto_populate', True)
        employee = self.context['request'].user.employee_profile
        
        resume = Resume.objects.create(
            employee=employee,
            **validated_data
        )
        
        if auto_populate:
            # Auto-populate with user's profile data
            self._populate_from_profile(resume, employee)
        
        return resume
    
    def _populate_from_profile(self, resume, employee):
        """Populate resume with data from employee profile"""
        # Personal info
        resume.personal_info = {
            'first_name': employee.user.first_name,
            'last_name': employee.user.last_name,
            'email': employee.user.email,
            'phone': employee.phone_number,
            'location': employee.location,
            'bio': employee.bio,
            'linkedin_url': employee.linkedin_url,
            'github_url': employee.github_url,
            'portfolio_url': employee.portfolio_url,
            'current_designation': employee.current_designation,
        }
        
        # Education data
        education_entries = []
        for edu in employee.education.all():
            education_entries.append({
                'institution': edu.institution,
                'degree': edu.degree,
                'field_of_study': edu.field_of_study,
                'start_date': edu.start_date.isoformat() if edu.start_date else None,
                'end_date': edu.end_date.isoformat() if edu.end_date else None,
                'grade': edu.grade,
                'is_current': edu.is_current,
            })
        resume.education_data = education_entries
        
        # Experience data
        experience_entries = []
        for exp in employee.experience.all():
            experience_entries.append({
                'company_name': exp.company_name,
                'position': exp.position,
                'location': exp.location,
                'start_date': exp.start_date.isoformat() if exp.start_date else None,
                'end_date': exp.end_date.isoformat() if exp.end_date else None,
                'is_current': exp.is_current,
                'description': exp.description,
                'skills_used': exp.skills_used.split(',') if exp.skills_used else [],
            })
        resume.experience_data = experience_entries
        
        # Skills data
        skills_entries = []
        for skill in employee.skills.all():
            skills_entries.append({
                'name': skill.name,
                'proficiency': skill.proficiency,
                'years_of_experience': skill.years_of_experience,
            })
        resume.skills_data = skills_entries
        
        resume.save()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating profile basic information"""
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    
    class Meta:
        model = EmployeeProfile
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 'date_of_birth',
            'location', 'bio', 'current_designation', 'experience_years',
            'expected_salary', 'linkedin_url', 'github_url', 'portfolio_url',
            'is_job_seeker'
        ]
    
    def update(self, instance, validated_data):
        # Handle user fields
        user_data = validated_data.pop('user', {})
        if user_data:
            for field, value in user_data.items():
                setattr(instance.user, field, value)
            instance.user.save()
        
        # Handle profile fields
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        
        return instance


class ProfileStatsSerializer(serializers.Serializer):
    """Serializer for profile statistics"""
    profile_completion = serializers.IntegerField()
    education_count = serializers.IntegerField()
    experience_count = serializers.IntegerField()
    skills_count = serializers.IntegerField()
    resumes_count = serializers.IntegerField()
    years_of_experience = serializers.IntegerField()
    applications = serializers.IntegerField()
    profile_views = serializers.IntegerField()


class CandidateProjectSerializer(serializers.ModelSerializer):
    """Serializer for candidate projects"""
    class Meta:
        model = CandidateProject
        fields = ['id', 'name', 'description', 'technologies_used', 'project_url', 'start_date', 'end_date', 'is_current']


class CandidateAchievementSerializer(serializers.ModelSerializer):
    """Serializer for candidate achievements"""
    class Meta:
        model = CandidateAchievement
        fields = ['id', 'title', 'description', 'date_received', 'issuing_organization']


class CandidateSearchProfileSerializer(serializers.ModelSerializer):
    """Serializer for candidate search profiles"""
    # Employee profile information
    name = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()
    
    # Related data
    projects = CandidateProjectSerializer(many=True, read_only=True)
    achievement_details = CandidateAchievementSerializer(many=True, read_only=True)
    
    # Contact information
    contact = serializers.SerializerMethodField()
    
    # Computed fields
    last_active_display = serializers.SerializerMethodField()
    
    class Meta:
        model = CandidateSearchProfile
        fields = [
            'id', 'name', 'designation', 'department', 'industry', 'key_skills',
            'experience', 'location', 'present_ctc', 'expected_ctc', 'notice_period',
            'preferred_location', 'actively_looking', 'profile_picture', 'contact',
            'education', 'languages', 'achievements', 'projects', 'achievement_details',
            'availability_schedule', 'last_active', 'last_active_display', 
            'match_score', 'is_searchable'
        ]
    
    def get_name(self, obj):
        return obj.employee.user.get_full_name() or obj.employee.user.username
    
    def get_designation(self, obj):
        return obj.employee.current_designation or obj.employee.current_position
    
    def get_location(self, obj):
        return obj.employee.location
    
    def get_experience(self, obj):
        if obj.employee.experience_years:
            years = obj.employee.experience_years
            if years == 1:
                return "1 year"
            return f"{years} years"
        return "N/A"
    
    def get_profile_picture(self, obj):
        if obj.employee.profile_picture:
            return obj.employee.profile_picture
        elif obj.employee.image_field_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.employee.image_field_picture.url)
            return obj.employee.image_field_picture.url
        return "https://randomuser.me/api/portraits/lego/1.jpg"  # Default avatar
    
    def get_education(self, obj):
        # Get the most recent or highest education
        educations = obj.employee.education.all().order_by('-end_date')
        if educations.exists():
            edu = educations.first()
            return f"{edu.degree} in {edu.field_of_study} - {edu.institution} ({edu.start_date.year if edu.start_date else 'N/A'})"
        return "N/A"
    
    def get_contact(self, obj):
        return {
            'call': obj.contact_call or obj.employee.phone_number or obj.employee.phone,
            'email': obj.contact_email or obj.employee.user.email,
            'whatsapp': obj.whatsapp_number or obj.contact_call or obj.employee.phone_number or obj.employee.phone,
            'sms': obj.contact_sms or obj.contact_call or obj.employee.phone_number or obj.employee.phone,
        }
    
    def get_last_active_display(self, obj):
        if not obj.last_active:
            return "N/A"
        
        now = timezone.now()
        diff = now - obj.last_active
        
        if diff.days == 0:
            return "Active today"
        elif diff.days == 1:
            return "Active yesterday"
        elif diff.days < 7:
            return f"Active {diff.days} days ago"
        elif diff.days < 30:
            weeks = diff.days // 7
            return f"Active {weeks} week{'s' if weeks > 1 else ''} ago"
        else:
            months = diff.days // 30
            return f"Active {months} month{'s' if months > 1 else ''} ago"


class BooleanSearchRequestSerializer(serializers.Serializer):
    """Serializer for boolean search request"""
    query = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=True)
    department = serializers.CharField(required=True)
    designation = serializers.CharField(required=True)
    experience = serializers.CharField(required=True)
    notice_period = serializers.CharField(required=True, allow_blank=True)
    salary_range = serializers.CharField(required=True)
    actively_looking = serializers.BooleanField(default=False)
    
    def validate_experience(self, value):
        """Validate experience range"""
        valid_ranges = ['0-1 years', '1-3 years', '3-5 years', '5+ years']
        if value not in valid_ranges:
            raise serializers.ValidationError(f"Experience must be one of: {', '.join(valid_ranges)}")
        return value
    
    def validate_salary_range(self, value):
        """Validate salary range"""
        valid_ranges = ['0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15+ LPA']
        if value not in valid_ranges:
            raise serializers.ValidationError(f"Salary range must be one of: {', '.join(valid_ranges)}")
        return value


class CandidateSearchResponseSerializer(serializers.Serializer):
    """Serializer for boolean search response"""
    candidates = CandidateSearchProfileSerializer(many=True)
    total_count = serializers.IntegerField()
    search_criteria = serializers.DictField()
