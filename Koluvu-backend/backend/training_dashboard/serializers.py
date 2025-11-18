from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TrainingProviderProfile, TrainingProgram, TrainingEnrollment, Internship, Placement


class TrainingProviderProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = TrainingProviderProfile
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'organization_name', 'contact_person', 'phone', 'address',
            'website', 'certification_number', 'specialization', 'logo',
            'description', 'qualifications', 'experience_years', 
            'founded_year', 'team_size', 'linkedin_url', 'facebook_url',
            'twitter_url', 'youtube_url', 'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['username', 'email', 'first_name', 'last_name', 'is_verified', 'created_at', 'updated_at']


class TrainingProviderRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = TrainingProviderProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'profile']
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create_user(**validated_data)
        TrainingProviderProfile.objects.create(user=user, **profile_data)
        return user


class TrainingProgramSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.organization_name', read_only=True)
    provider = serializers.SerializerMethodField()
    enrolled_count = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()
    
    class Meta:
        model = TrainingProgram
        fields = [
            'id', 'title', 'description', 'category', 'duration_weeks',
            'start_date', 'end_date', 'capacity', 'fee', 'prerequisites',
            'learning_outcomes', 'status', 'syllabus', 'banner_image',
            'provider', 'provider_name', 'enrolled_count', 'available_slots',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['provider', 'provider_name', 'enrolled_count', 'available_slots', 'created_at', 'updated_at']
    
    def get_provider(self, obj):
        """Include basic provider information with the program"""
        if obj.provider:
            return {
                'id': obj.provider.id,
                'organization_name': obj.provider.organization_name,
                'contact_person': obj.provider.contact_person,
                'website': obj.provider.website,
                'specialization': obj.provider.specialization,
                'is_verified': obj.provider.is_verified
            }
        return None


class TrainingEnrollmentSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source='program.title', read_only=True)
    provider_name = serializers.CharField(source='program.provider.organization_name', read_only=True)
    
    class Meta:
        model = TrainingEnrollment
        fields = [
            'id', 'program', 'program_title', 'provider_name',
            'student_name', 'student_email', 'student_phone',
            'enrollment_date', 'status', 'progress_percentage',
            'completion_date', 'certificate_issued', 'final_score'
        ]


class InternshipSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.organization_name', read_only=True)
    
    class Meta:
        model = Internship
        fields = [
            'id', 'title', 'description', 'requirements', 'duration_months',
            'stipend', 'location', 'is_remote', 'start_date',
            'application_deadline', 'slots_available', 'status',
            'provider', 'provider_name', 'created_at', 'updated_at'
        ]


class PlacementSerializer(serializers.ModelSerializer):
    training_program_title = serializers.CharField(source='training_program.title', read_only=True)
    
    class Meta:
        model = Placement
        fields = [
            'id', 'student_name', 'student_email', 'training_program',
            'training_program_title', 'company_name', 'position',
            'salary', 'placement_date', 'is_verified', 'created_at'
        ]
