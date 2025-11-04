from rest_framework import serializers
from .models import (
    CareerField, CareerPath, SkillAssessment, UserSkillAssessment,
    CareerRecommendation, CareerGoal, MentorshipRequest, CareerResource
)


class CareerFieldSerializer(serializers.ModelSerializer):
    career_paths_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CareerField
        fields = '__all__'
    
    def get_career_paths_count(self, obj):
        return obj.career_paths.count()


class CareerPathSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source='field.name', read_only=True)
    field_color = serializers.CharField(source='field.color', read_only=True)
    
    class Meta:
        model = CareerPath
        fields = '__all__'


class CareerPathDetailSerializer(serializers.ModelSerializer):
    field = CareerFieldSerializer(read_only=True)
    
    class Meta:
        model = CareerPath
        fields = '__all__'


class SkillAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillAssessment
        fields = '__all__'


class UserSkillAssessmentSerializer(serializers.ModelSerializer):
    assessment_name = serializers.CharField(source='assessment.name', read_only=True)
    assessment_category = serializers.CharField(source='assessment.category', read_only=True)
    
    class Meta:
        model = UserSkillAssessment
        fields = '__all__'
        read_only_fields = ('user',)


class CareerRecommendationSerializer(serializers.ModelSerializer):
    recommended_paths = CareerPathSerializer(many=True, read_only=True)
    
    class Meta:
        model = CareerRecommendation
        fields = '__all__'
        read_only_fields = ('user',)


class CareerGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerGoal
        fields = '__all__'
        read_only_fields = ('user',)


class MentorshipRequestSerializer(serializers.ModelSerializer):
    career_field_name = serializers.CharField(source='career_field.name', read_only=True)
    mentee_name = serializers.CharField(source='mentee.get_full_name', read_only=True)
    
    class Meta:
        model = MentorshipRequest
        fields = '__all__'
        read_only_fields = ('mentee',)


class CareerResourceSerializer(serializers.ModelSerializer):
    career_fields = CareerFieldSerializer(many=True, read_only=True)
    career_paths = CareerPathSerializer(many=True, read_only=True)
    
    class Meta:
        model = CareerResource
        fields = '__all__'


# Simplified serializers for dropdowns/lists
class CareerFieldSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerField
        fields = ['id', 'name', 'icon', 'color']


class CareerPathSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPath
        fields = ['id', 'title', 'experience_level', 'demand_level']