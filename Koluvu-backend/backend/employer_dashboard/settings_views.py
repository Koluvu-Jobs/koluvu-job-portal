from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from django.conf import settings
import json
import logging
from .models import EmployerProfile, EmployerSettings
from .serializers import EmployerSettingsSerializer, EmployerSettingsUpdateSerializer

logger = logging.getLogger(__name__)

def broadcast_settings_update(user, section=None, data=None):
    """
    Broadcast settings update to real-time notification system
    """
    try:
        # Import here to avoid circular imports
        from shared_services.realtime_notifications import send_user_notification
        
        topic = f"employer-settings-update-{user.id}"
        if section:
            topic = f"employer-settings-{section}-update-{user.id}"
        
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
        logger.info(f"Settings update broadcasted for user {user.id}, section: {section}")
        
    except Exception as e:
        logger.error(f"Failed to broadcast settings update: {str(e)}")
        # Don't fail the main operation if broadcasting fails


class EmployerSettingsView(APIView):
    """
    Get or create employer settings
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get employer settings"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            serializer = EmployerSettingsSerializer(settings)
            return Response(serializer.data)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """Update employer settings (full update)"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            serializer = EmployerSettingsSerializer(settings, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Settings updated successfully',
                    'settings': serializer.data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request):
        """Update employer settings (partial update)"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            serializer = EmployerSettingsUpdateSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                
                # Return full settings after update
                full_serializer = EmployerSettingsSerializer(settings)
                settings_data = full_serializer.data
                
                # Broadcast real-time update
                broadcast_settings_update(request.user, data=settings_data)
                
                return Response({
                    'message': 'Settings updated successfully',
                    'settings': settings_data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmployerSettingsSectionView(APIView):
    """
    Get or update specific settings sections
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, section):
        """Get specific settings section"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            if section == 'notifications':
                data = settings.get_notification_preferences()
            elif section == 'security':
                data = settings.get_security_settings()
            elif section == 'dashboard':
                data = settings.get_dashboard_preferences()
            elif section == 'summary':
                data = settings.get_settings_summary()
            else:
                return Response(
                    {'error': f'Invalid settings section: {section}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(data)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request, section):
        """Update specific settings section"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            if section == 'notifications':
                settings.update_notification_preferences(request.data)
                section_data = settings.get_notification_preferences()
                
                # Broadcast section-specific update
                broadcast_settings_update(request.user, section=section, data=section_data)
                
                return Response({
                    'message': 'Notification preferences updated successfully',
                    'data': section_data
                })
            else:
                # For other sections, use the regular serializer
                serializer = EmployerSettingsUpdateSerializer(settings, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    section_data = serializer.data
                    
                    # Broadcast section-specific update
                    broadcast_settings_update(request.user, section=section, data=section_data)
                    
                    return Response({
                        'message': f'{section.title()} settings updated successfully',
                        'data': section_data
                    })
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmployerSettingsResetView(APIView):
    """
    Reset employer settings to defaults
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Reset all settings to defaults"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            # Reset to defaults
            settings.reset_to_defaults()
            
            # Return updated settings
            serializer = EmployerSettingsSerializer(settings)
            return Response({
                'message': 'Settings reset to defaults successfully',
                'settings': serializer.data
            })
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmployerSettingsExportView(APIView):
    """
    Export employer settings as JSON
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Export settings as JSON"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            serializer = EmployerSettingsSerializer(settings)
            
            # Add metadata
            export_data = {
                'export_date': timezone.now().isoformat(),
                'employer': employer_profile.company_name,
                'settings': serializer.data
            }
            
            response = Response(export_data)
            response['Content-Disposition'] = f'attachment; filename="employer_settings_{employer_profile.id}.json"'
            return response
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmployerSettingsImportView(APIView):
    """
    Import employer settings from JSON
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Import settings from JSON"""
        try:
            employer_profile = EmployerProfile.objects.get(user=request.user)
            settings = EmployerSettings.get_or_create_for_employer(employer_profile)
            
            # Validate import data
            if 'settings' not in request.data:
                return Response(
                    {'error': 'Invalid import data. Missing settings.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            settings_data = request.data['settings']
            
            # Remove read-only fields
            read_only_fields = ['id', 'employer', 'created_at', 'updated_at', 'last_sync_at']
            for field in read_only_fields:
                settings_data.pop(field, None)
            
            # Update settings
            serializer = EmployerSettingsUpdateSerializer(settings, data=settings_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                
                # Return updated settings
                full_serializer = EmployerSettingsSerializer(settings)
                return Response({
                    'message': 'Settings imported successfully',
                    'settings': full_serializer.data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except EmployerProfile.DoesNotExist:
            return Response(
                {'error': 'Employer profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )