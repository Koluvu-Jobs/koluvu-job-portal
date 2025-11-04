from rest_framework import serializers
from .models import (
    SkillCategory, Skill, Course, CourseModule, 
    CourseEnrollment, UserSkillProfile, CourseReview
)


class SkillCategorySerializer(serializers.ModelSerializer):
    skills_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'description', 'icon', 'skills_count', 'created_at']
    
    def get_skills_count(self, obj):
        return obj.skills.count()


class SkillSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    courses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'category', 'category_name', 'description',
            'difficulty_level', 'market_demand', 'average_salary',
            'tags', 'courses_count', 'created_at'
        ]
    
    def get_courses_count(self, obj):
        return obj.courses.filter(status='PUBLISHED').count()


class CourseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModule
        fields = [
            'id', 'title', 'description', 'order', 'video_url',
            'reading_materials', 'assignments', 'estimated_hours'
        ]


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    skills_names = serializers.StringRelatedField(source='skills', many=True, read_only=True)
    modules = CourseModuleSerializer(many=True, read_only=True)
    modules_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'short_description', 'course_type',
            'duration_hours', 'difficulty_level', 'thumbnail', 'video_preview',
            'syllabus', 'skills', 'skills_names', 'instructor', 'instructor_name',
            'price', 'is_free', 'max_enrollments', 'status', 'is_featured',
            'rating', 'total_enrollments', 'seo_keywords', 'target_audience',
            'modules', 'modules_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['rating', 'total_enrollments']
    
    def get_modules_count(self, obj):
        return obj.modules.count()


class CourseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating courses"""
    
    class Meta:
        model = Course
        fields = [
            'title', 'description', 'short_description', 'course_type',
            'duration_hours', 'difficulty_level', 'thumbnail', 'video_preview',
            'syllabus', 'skills', 'price', 'is_free', 'max_enrollments',
            'seo_keywords', 'target_audience'
        ]
    
    def create(self, validated_data):
        # Set instructor to current user
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_thumbnail = serializers.ImageField(source='course.thumbnail', read_only=True)
    instructor_name = serializers.CharField(source='course.instructor.get_full_name', read_only=True)
    
    class Meta:
        model = CourseEnrollment
        fields = [
            'id', 'course', 'course_title', 'course_thumbnail', 'instructor_name',
            'status', 'enrolled_date', 'completion_date', 'progress_percentage',
            'completed_modules', 'current_module', 'total_study_time',
            'last_accessed', 'final_score', 'certificate_issued', 'certificate_url'
        ]
        read_only_fields = [
            'enrolled_date', 'completion_date', 'certificate_issued',
            'certificate_url'
        ]


class EnrollCourseSerializer(serializers.Serializer):
    """Serializer for course enrollment"""
    course_id = serializers.IntegerField()
    
    def validate_course_id(self, value):
        try:
            course = Course.objects.get(id=value, status='PUBLISHED')
            return value
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course not found or not published")


class UserSkillProfileSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    skill_category = serializers.CharField(source='skill.category.name', read_only=True)
    completed_courses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSkillProfile
        fields = [
            'id', 'skill', 'skill_name', 'skill_category', 'current_level',
            'target_level', 'learning_path', 'self_assessed',
            'verified_by_employer', 'certification_earned',
            'completed_courses_count', 'created_at', 'updated_at'
        ]
    
    def get_completed_courses_count(self, obj):
        # Count completed courses for this user and skill
        return CourseEnrollment.objects.filter(
            user=obj.user,
            course__skills=obj.skill,
            status='COMPLETED'
        ).count()


class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = CourseReview
        fields = [
            'id', 'user', 'user_name', 'course', 'course_title',
            'rating', 'title', 'review_text', 'content_rating',
            'instructor_rating', 'value_rating', 'is_verified',
            'is_featured', 'created_at'
        ]
        read_only_fields = ['user', 'is_verified', 'is_featured']


class CourseReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating course reviews"""
    
    class Meta:
        model = CourseReview
        fields = [
            'course', 'rating', 'title', 'review_text',
            'content_rating', 'instructor_rating', 'value_rating'
        ]
    
    def validate(self, data):
        user = self.context['request'].user
        course = data['course']
        
        # Check if user has enrolled in the course
        if not CourseEnrollment.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError(
                "You must be enrolled in this course to leave a review."
            )
        
        # Check if user already reviewed this course
        if CourseReview.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError(
                "You have already reviewed this course."
            )
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        course = validated_data['course']
        
        # Get enrollment
        enrollment = CourseEnrollment.objects.get(user=user, course=course)
        
        # Create review
        validated_data['user'] = user
        validated_data['enrollment'] = enrollment
        
        return super().create(validated_data)