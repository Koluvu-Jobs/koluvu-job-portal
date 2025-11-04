from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PartnerProfile

class PartnerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = PartnerProfile
        fields = [
            'id', 'user', 'user_id', 'email', 'first_name', 'last_name', 'date_joined',
            'organization_name', 'contact_person', 'phone_number', 'website', 'address',
            'profile_picture', 'is_verified', 'is_profile_complete', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']

class PartnerRegistrationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = PartnerProfile
        fields = [
            'organization_name', 'contact_person', 'phone_number', 
            'website', 'address', 'profile_picture'
        ]

class PartnerDashboardSerializer(serializers.ModelSerializer):
    """Serializer for partner dashboard data"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PartnerProfile
        fields = [
            'id', 'organization_name', 'contact_person', 'phone_number',
            'website', 'address', 'profile_picture', 'is_verified',
            'is_profile_complete', 'user_email', 'user_name'
        ]
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username