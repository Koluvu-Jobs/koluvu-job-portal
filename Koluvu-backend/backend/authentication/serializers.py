from rest_framework import serializers
from django.contrib.auth.models import User
from authentication.models import SocialAccount


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = ['provider', 'social_id', 'email', 'profile_picture_url', 'created_at']


class GoogleOAuthSerializer(serializers.Serializer):
    # Support both old access_token and new credential formats
    access_token = serializers.CharField(required=False)
    credential = serializers.CharField(required=False)
    user_type = serializers.ChoiceField(choices=['employee', 'employer', 'partner'], default='employee')
    
    def validate(self, data):
        if not data.get('access_token') and not data.get('credential'):
            raise serializers.ValidationError('Either access_token or credential is required')
        return data


class AuthResponseSerializer(serializers.Serializer):
    user = UserSerializer()
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    user_type = serializers.CharField()