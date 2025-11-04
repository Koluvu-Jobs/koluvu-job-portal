from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from .models import EmployerProfile


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_employer_names(request):
    """Update employer name and/or company name with 30-day restriction"""
    try:
        # Get or create employer profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': 'Your Company',
                'employer_name': 'Pavansai',
                'is_active': True,
                'last_name_change': timezone.now() - timedelta(days=31)  # Allow immediate change for new profiles
            }
        )
        
        # Check if user can change names
        if not employer_profile.can_change_names():
            days_remaining = employer_profile.days_until_next_change()
            return Response({
                'error': f'You can only change names once every 30 days. Please wait {days_remaining} more days.',
                'can_change': False,
                'days_remaining': days_remaining
            }, status=400)
        
        # Get the new names from request
        data = request.data
        employer_name = data.get('employer_name', '').strip()
        company_name = data.get('company_name', '').strip()
        
        # Validate input
        if not employer_name and not company_name:
            return Response({
                'error': 'At least one name (employer_name or company_name) must be provided',
                'can_change': True
            }, status=400)
        
        # Update the names
        if employer_name:
            employer_profile.employer_name = employer_name
        if company_name:
            employer_profile.company_name = company_name
        
        employer_profile.last_name_change = timezone.now()
        employer_profile.save()
        
        return Response({
            'message': 'Names updated successfully',
            'employer_name': employer_profile.employer_name,
            'company_name': employer_profile.company_name,
            'next_change_date': (timezone.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            'can_change': False
        })
        
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_name_change_eligibility(request):
    """Check if employer can change names and when they can change next"""
    try:
        employer_profile = EmployerProfile.objects.get(user=request.user)
        
        can_change = employer_profile.can_change_names()
        days_remaining = employer_profile.days_until_next_change()
        
        return Response({
            'can_change': can_change,
            'days_remaining': days_remaining,
            'next_change_date': (employer_profile.last_name_change + timedelta(days=30)).strftime('%Y-%m-%d') if employer_profile.last_name_change else None,
            'current_employer_name': employer_profile.employer_name,
            'current_company_name': employer_profile.company_name
        })
        
    except EmployerProfile.DoesNotExist:
        return Response({
            'can_change': True,
            'days_remaining': 0,
            'message': 'No employer profile found. You can create one.'
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_activation_status(request):
    """Toggle company activation status - Employer only"""
    try:
        # Check if user is an employer
        employer_profile = EmployerProfile.objects.get(user=request.user)
        
        # Toggle activation status
        employer_profile.is_active = not employer_profile.is_active
        employer_profile.save()
        
        return Response({
            'message': f'Company {"activated" if employer_profile.is_active else "deactivated"} successfully',
            'is_active': employer_profile.is_active
        })
        
    except EmployerProfile.DoesNotExist:
        return Response({
            'error': 'Permission denied. Only employers can change activation status.'
        }, status=status.HTTP_403_FORBIDDEN)