"""
Employee Settings API Views
Comprehensive REST API endpoints for employee settings management with real-time updates.
"""

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import logging

from .models import EmployeeSettings, EmployeeProfile
from .settings_serializers import (
    EmployeeSettingsSerializer,
    EmployeeProfileSettingsSerializer,
    EmployeeJobPreferencesSerializer,
    EmployeeNotificationSettingsSerializer,
    EmployeePrivacySettingsSerializer,
    EmployeeApplicationSettingsSerializer,
    EmployeeResumeSettingsSerializer
)
from authentication.models import User

logger = logging.getLogger(__name__)

def broadcast_employee_settings_update(user, section=None, data=None):
    """
    Broadcast employee settings update to real-time notification system
    """
    try:
        # Import here to avoid circular imports
        from shared_services.realtime_notifications import send_user_notification
        
        topic = f"employee-settings-update-{user.id}"
        if section:
            topic = f"employee-settings-{section}-update-{user.id}"
        
        message_data = {
            'type': 'settings-update',
            'topic': topic,
            'section': section or 'all',
            'data': data,
            'timestamp': timezone.now().isoformat(),
            'user_id': user.id
        }
        
        # Send real-time notification
        send_user_notification(user.id, message_data)
        logger.info(f"Employee settings update broadcasted for user {user.id}, section: {section}")
        
    except Exception as e:
        logger.error(f"Failed to broadcast employee settings update: {str(e)}")
        # Don't fail the main operation if broadcasting fails


class EmployeeSettingsView(APIView):
    """Main employee settings API endpoint."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get employee settings."""
        try:
            # Get or create employee profile first
            employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
                user=request.user,
                defaults={
                    'current_designation': '',
                    'bio': '',
                    'location': '',
                    'is_job_seeker': True,
                }
            )
            
            # Get or create settings for the employee profile
            settings, created = EmployeeSettings.objects.get_or_create(
                employee=employee_profile,
                defaults={
                    'profile_visibility': 'public',
                    'email_notifications': True,
                    'job_recommendations': True,
                    'application_updates': True
                }
            )
            
            serializer = EmployeeSettingsSerializer(settings)
            return Response({
                'success': True,
                'data': serializer.data,
                'created': created
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting employee settings for user {request.user.id}: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        """Update employee settings (partial update)."""
        try:
            # Get or create employee profile first
            employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
                user=request.user
            )
            
            settings, created = EmployeeSettings.objects.get_or_create(
                employee=employee_profile
            )
            
            serializer = EmployeeSettingsSerializer(
                settings, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                # Broadcast settings update (for real-time sync)
                broadcast_employee_settings_update(request.user, data=serializer.data)
                
                return Response({
                    'success': True,
                    'message': 'Settings updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error updating employee settings for user {request.user.id}: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        """Update employee settings (full update)."""
        try:
            # Get or create employee profile first
            employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
                user=request.user
            )
            
            settings, created = EmployeeSettings.objects.get_or_create(
                employee=employee_profile
            )
            
            serializer = EmployeeSettingsSerializer(settings, data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                
                # Broadcast settings update (for real-time sync)
                broadcast_employee_settings_update(request.user, data=serializer.data)
                
                return Response({
                    'success': True,
                    'message': 'Settings updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error updating employee settings for user {request.user.id}: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeSettingsSectionView(APIView):
    """Section-specific employee settings API endpoint."""
    permission_classes = [permissions.IsAuthenticated]
    
    SECTION_SERIALIZERS = {
        'profile': EmployeeProfileSettingsSerializer,
        'job-preferences': EmployeeJobPreferencesSerializer,
        'notifications': EmployeeNotificationSettingsSerializer,
        'privacy': EmployeePrivacySettingsSerializer,
        'applications': EmployeeApplicationSettingsSerializer,
        'resume': EmployeeResumeSettingsSerializer
    }

    def get(self, request, section):
        """Get settings for a specific section."""
        try:
            if section not in self.SECTION_SERIALIZERS:
                return Response({
                    'success': False,
                    'error': 'Invalid section'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get or create employee profile first
            employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
                user=request.user
            )
            
            settings, created = EmployeeSettings.objects.get_or_create(
                employee=employee_profile
            )
            
            serializer_class = self.SECTION_SERIALIZERS[section]
            serializer = serializer_class(settings)
            
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error getting employee settings section {section} for user {request.user.id}: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, section):
        """Update settings for a specific section."""
        try:
            if section not in self.SECTION_SERIALIZERS:
                return Response({
                    'success': False,
                    'error': 'Invalid section'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get or create employee profile first
            employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
                user=request.user
            )
            
            settings, created = EmployeeSettings.objects.get_or_create(
                employee=employee_profile
            )
            
            serializer_class = self.SECTION_SERIALIZERS[section]
            serializer = serializer_class(
                settings, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                # Broadcast section update
                broadcast_employee_settings_update(request.user, section=section, data=serializer.data)
                
                return Response({
                    'success': True,
                    'message': f'{section.title()} settings updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error updating employee settings section {section} for user {request.user.id}: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reset_employee_settings(request):
    """Reset employee settings to default values."""
    try:
        # Get or create employee profile first
        employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
            user=request.user
        )
        
        settings, created = EmployeeSettings.objects.get_or_create(
            employee=employee_profile
        )
        
        if not created:
            # Reset to default values by deleting and recreating
            settings.delete()
            settings = EmployeeSettings.objects.create(employee=employee_profile)
        
        serializer = EmployeeSettingsSerializer(settings)
        
        return Response({
            'success': True,
            'message': 'Settings reset to default values',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error resetting employee settings for user {request.user.id}: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_employee_settings(request):
    """Export employee settings as JSON."""
    try:
        employee_profile = get_object_or_404(EmployeeProfile, user=request.user)
        settings = get_object_or_404(EmployeeSettings, employee=employee_profile)
        serializer = EmployeeSettingsSerializer(settings)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'export_timestamp': timezone.now().isoformat()
        }, status=status.HTTP_200_OK)
        
    except EmployeeSettings.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Settings not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error exporting employee settings for user {request.user.id}: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def import_employee_settings(request):
    """Import employee settings from JSON."""
    try:
        # Get or create employee profile first
        employee_profile, profile_created = EmployeeProfile.objects.get_or_create(
            user=request.user
        )
        
        settings, created = EmployeeSettings.objects.get_or_create(
            employee=employee_profile
        )
        
        serializer = EmployeeSettingsSerializer(
            settings, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            
            return Response({
                'success': True,
                'message': 'Settings imported successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Error importing employee settings for user {request.user.id}: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)