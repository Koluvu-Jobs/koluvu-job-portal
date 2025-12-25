from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import TrainingProviderProfile, TrainingProgram, TrainingEnrollment, Internship, Placement
from .serializers import (
    TrainingProviderProfileSerializer, TrainingProviderRegistrationSerializer,
    TrainingProgramSerializer, TrainingEnrollmentSerializer, InternshipSerializer, PlacementSerializer
)


class RegisterTrainingProviderView(generics.CreateAPIView):
    """Register a new training provider"""
    queryset = User.objects.all()
    serializer_class = TrainingProviderRegistrationSerializer
    permission_classes = []  # Allow unauthenticated access for registration


class TrainingProviderProfileView(generics.RetrieveUpdateAPIView):
    """Get and update training provider profile"""
    serializer_class = TrainingProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = TrainingProviderProfile.objects.get_or_create(user=self.request.user)
        return profile


class ProfileCompletenessCheckView(generics.GenericAPIView):
    """Check if training provider has completed their profile setup"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = TrainingProviderProfile.objects.get(user=request.user)
            
            # Define required fields for initial setup
            required_fields = [
                'organization_name',
                'contact_person',
                'phone',
                'address'
            ]
            
            # Check if all required fields are filled
            is_complete = all([
                getattr(profile, field, None) and str(getattr(profile, field, '')).strip()
                for field in required_fields
            ])
            
            # Get missing fields
            missing_fields = [
                field for field in required_fields
                if not getattr(profile, field, None) or not str(getattr(profile, field, '')).strip()
            ]
            
            return Response({
                'is_complete': is_complete,
                'missing_fields': missing_fields,
                'profile': TrainingProviderProfileSerializer(profile).data
            })
            
        except TrainingProviderProfile.DoesNotExist:
            return Response({
                'is_complete': False,
                'missing_fields': ['organization_name', 'contact_person', 'phone', 'address'],
                'profile': None
            })


class DashboardStatisticsView(generics.GenericAPIView):
    """Get dashboard statistics for the training provider"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            from django.db.models import Count, Q
            from datetime import datetime, timedelta
            
            profile = TrainingProviderProfile.objects.get(user=request.user)
            
            # Program statistics
            total_programs = TrainingProgram.objects.filter(provider=profile).count()
            active_programs = TrainingProgram.objects.filter(provider=profile, status='active').count()
            expired_programs = TrainingProgram.objects.filter(provider=profile, status='expired').count()
            draft_programs = TrainingProgram.objects.filter(provider=profile, status='draft').count()
            
            # Enrollment statistics
            total_enrollments = TrainingEnrollment.objects.filter(program__provider=profile).count()
            active_enrollments = TrainingEnrollment.objects.filter(
                program__provider=profile, 
                status__in=['enrolled', 'in_progress']
            ).count()
            completed_enrollments = TrainingEnrollment.objects.filter(
                program__provider=profile, 
                status='completed'
            ).count()
            
            # Monthly views (placeholder - implement actual view tracking)
            monthly_views = 0  # TODO: Implement view tracking
            
            # Enrollment trend for last 6 weeks
            enrollment_trend = []
            today = datetime.now()
            for i in range(6, 0, -1):
                week_start = today - timedelta(weeks=i)
                week_end = today - timedelta(weeks=i-1)
                week_enrollments = TrainingEnrollment.objects.filter(
                    program__provider=profile,
                    enrollment_date__gte=week_start,
                    enrollment_date__lt=week_end
                ).count()
                enrollment_trend.append({
                    'name': f'Week {7-i}',
                    'enrollments': week_enrollments
                })
            
            return Response({
                'programs': {
                    'total': total_programs,
                    'active': active_programs,
                    'expired': expired_programs,
                    'draft': draft_programs
                },
                'enrollments': {
                    'total': total_enrollments,
                    'active': active_enrollments,
                    'completed': completed_enrollments
                },
                'monthly_views': monthly_views,
                'enrollment_trend': enrollment_trend
            })
            
        except TrainingProviderProfile.DoesNotExist:
            return Response({
                'error': 'Profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class TrainingProviderLoginView(generics.GenericAPIView):
    """Training provider login view with JWT authentication"""
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                # Get or create profile
                profile, created = TrainingProviderProfile.objects.get_or_create(user=user)
                serializer = TrainingProviderProfileSerializer(profile)
                
                return Response({
                    'message': 'Login successful',
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'user': serializer.data
                })
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)


class TrainingProgramListCreateView(generics.ListCreateAPIView):
    """List training programs and create new program"""
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return TrainingProgram.objects.filter(provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return TrainingProgram.objects.none()

    def perform_create(self, serializer):
        # Get or create the training provider profile
        profile, created = TrainingProviderProfile.objects.get_or_create(user=self.request.user)
        serializer.save(provider=profile)


class TrainingProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific training program"""
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return TrainingProgram.objects.filter(provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return TrainingProgram.objects.none()


class TrainingEnrollmentListView(generics.ListAPIView):
    """List enrollments for provider's programs"""
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return TrainingEnrollment.objects.filter(program__provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return TrainingEnrollment.objects.none()


class TrainingEnrollmentDetailView(generics.RetrieveUpdateAPIView):
    """Get and update enrollment details"""
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return TrainingEnrollment.objects.filter(program__provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return TrainingEnrollment.objects.none()


class InternshipListCreateView(generics.ListCreateAPIView):
    """List internships and create new internship"""
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return Internship.objects.filter(provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return Internship.objects.none()

    def perform_create(self, serializer):
        # Get or create the training provider profile
        profile, created = TrainingProviderProfile.objects.get_or_create(user=self.request.user)
        serializer.save(provider=profile)


class InternshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific internship"""
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return Internship.objects.filter(provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return Internship.objects.none()


class PlacementListCreateView(generics.ListCreateAPIView):
    """List placements and create new placement"""
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return Placement.objects.filter(training_program__provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return Placement.objects.none()


class PlacementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific placement"""
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the training provider profile for the current user
        try:
            profile = TrainingProviderProfile.objects.get(user=self.request.user)
            return Placement.objects.filter(training_program__provider=profile)
        except TrainingProviderProfile.DoesNotExist:
            return Placement.objects.none()


# ============================================================================
# PUBLIC API VIEWS - Accessible to all users for cross-platform integration
# ============================================================================

class PublicTrainingProvidersView(generics.ListAPIView):
    """Public view for training providers - accessible to employees and employers"""
    serializer_class = TrainingProviderProfileSerializer
    permission_classes = []  # Public access
    
    def get_queryset(self):
        # Only show verified providers with complete profiles
        return TrainingProviderProfile.objects.filter(
            is_verified=True
        ).exclude(
            organization_name__exact=''
        ).order_by('-created_at')


class PublicTrainingProgramsView(generics.ListAPIView):
    """Public view for training programs - accessible to employees and employers"""
    serializer_class = TrainingProgramSerializer
    permission_classes = []  # Public access
    
    def get_queryset(self):
        # Only show active programs from verified providers
        return TrainingProgram.objects.filter(
            status='active',
            provider__is_verified=True
        ).select_related('provider').order_by('-created_at')


class PublicProviderDetailView(generics.RetrieveAPIView):
    """Public view for individual training provider details"""
    serializer_class = TrainingProviderProfileSerializer
    permission_classes = []  # Public access
    lookup_url_kwarg = 'provider_id'
    
    def get_queryset(self):
        return TrainingProviderProfile.objects.filter(is_verified=True)


class TrainingCategoriesView(generics.GenericAPIView):
    """View for available training categories"""
    permission_classes = []  # Public access
    
    def get(self, request):
        categories = [choice[0] for choice in TrainingProgram.CATEGORY_CHOICES]
        return Response(categories)


class SearchTrainingView(generics.ListAPIView):
    """View for searching training programs and providers"""
    serializer_class = TrainingProgramSerializer
    permission_classes = []  # Public access
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        category = self.request.query_params.get('category', '')
        
        queryset = TrainingProgram.objects.filter(
            status='active',
            provider__is_verified=True
        ).select_related('provider')
        
        if query:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(provider__organization_name__icontains=query) |
                Q(provider__specialization__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset.order_by('-created_at')


class TrainingStatisticsView(generics.GenericAPIView):
    """View for training platform statistics"""
    permission_classes = []  # Public access
    
    def get(self, request):
        stats = {
            'total_providers': TrainingProviderProfile.objects.filter(is_verified=True).count(),
            'total_programs': TrainingProgram.objects.filter(status='active', provider__is_verified=True).count(),
            'total_categories': len(TrainingProgram.CATEGORY_CHOICES),
            'total_enrollments': TrainingEnrollment.objects.count(),
            'categories_with_counts': {}
        }
        
        # Category breakdown
        from django.db.models import Count
        category_counts = TrainingProgram.objects.filter(
            status='active',
            provider__is_verified=True
        ).values('category').annotate(count=Count('category'))
        
        for item in category_counts:
            stats['categories_with_counts'][item['category']] = item['count']
        
        return Response(stats)


class RecommendedProvidersView(generics.ListAPIView):
    """View for recommended training providers"""
    serializer_class = TrainingProviderProfileSerializer
    permission_classes = []  # Public access
    
    def get_queryset(self):
        # Recommend providers with most programs and highest completion rates
        from django.db.models import Count
        return TrainingProviderProfile.objects.filter(
            is_verified=True
        ).annotate(
            program_count=Count('programs')
        ).filter(
            program_count__gt=0
        ).order_by('-program_count')[:6]  # Top 6 providers
