from rest_framework import serializers
from .models import ATSProfile, ATSAnalysis, ATSKeywordLibrary, ATSSettings


class ATSProfileSerializer(serializers.ModelSerializer):
    """Serializer for ATS Profile"""
    
    class Meta:
        model = ATSProfile
        fields = [
            'id', 'user', 'ats_score', 'keywords_optimized', 
            'last_scan_date', 'scan_count', 'usage_type',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_scan_date']


class ATSAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for ATS Analysis"""
    
    class Meta:
        model = ATSAnalysis
        fields = [
            'id', 'ats_profile', 'analysis_type', 'document_text',
            'document_file', 'score', 'feedback', 'keywords_found',
            'keywords_missing', 'suggestions', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'score', 'feedback', 'keywords_found', 'keywords_missing', 'suggestions']


class ATSAnalysisCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating ATS Analysis"""
    
    class Meta:
        model = ATSAnalysis
        fields = ['analysis_type', 'document_text', 'document_file']


class ATSKeywordLibrarySerializer(serializers.ModelSerializer):
    """Serializer for ATS Keyword Library"""
    
    class Meta:
        model = ATSKeywordLibrary
        fields = [
            'id', 'industry', 'role_category', 'keywords',
            'importance_score', 'created_at', 'updated_at'
        ]


class ATSSettingsSerializer(serializers.ModelSerializer):
    """Serializer for ATS Settings"""
    
    class Meta:
        model = ATSSettings
        fields = [
            'id', 'minimum_score_threshold', 'max_analyses_per_day',
            'premium_max_analyses', 'model_version', 'model_accuracy',
            'created_at', 'updated_at'
        ]