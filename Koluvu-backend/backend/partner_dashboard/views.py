from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import PartnerProfile
from .serializers import PartnerProfileSerializer, PartnerDashboardSerializer
import logging

logger = logging.getLogger(__name__)

class PartnerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get partner profile information"""
        try:
            partner_profile = PartnerProfile.objects.get(user=request.user)
            serializer = PartnerProfileSerializer(partner_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PartnerProfile.DoesNotExist:
            return Response(
                {'error': 'Partner profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request):
        """Update partner profile"""
        try:
            partner_profile = PartnerProfile.objects.get(user=request.user)
            serializer = PartnerProfileSerializer(partner_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PartnerProfile.DoesNotExist:
            return Response(
                {'error': 'Partner profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class PartnerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get partner dashboard data"""
        try:
            partner_profile = PartnerProfile.objects.get(user=request.user)
            serializer = PartnerDashboardSerializer(partner_profile)
            
            # Add additional dashboard stats here if needed
            dashboard_data = serializer.data
            dashboard_data.update({
                'total_partnerships': 0,  # Placeholder - implement actual logic
                'active_projects': 0,     # Placeholder - implement actual logic
                'pending_approvals': 0,   # Placeholder - implement actual logic
            })
            
            return Response(dashboard_data, status=status.HTTP_200_OK)
        except PartnerProfile.DoesNotExist:
            return Response(
                {'error': 'Partner profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class PartnerDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get partner dashboard statistics"""
        try:
            partner_profile = PartnerProfile.objects.get(user=request.user)
            
            # Implement actual statistics logic here
            stats = {
                'total_partnerships': 0,
                'active_projects': 0,
                'pending_approvals': 0,
                'total_revenue': 0,
                'monthly_growth': 0,
            }
            
            return Response(stats, status=status.HTTP_200_OK)
        except PartnerProfile.DoesNotExist:
            return Response(
                {'error': 'Partner profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )