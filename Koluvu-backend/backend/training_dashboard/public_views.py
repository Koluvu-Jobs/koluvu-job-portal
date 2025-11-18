"""
Public views for training dashboard data integration
Provides access to training provider data for employee and employer dashboards
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q, Count, Avg
from .models import TrainingProviderProfile, TrainingProgram, TrainingEnrollment
from .serializers import TrainingProviderProfileSerializer, TrainingProgramSerializer


class PublicTrainingProvidersListView(generics.ListAPIView):
    """
    Public list of verified training providers
    Accessible by employees and employers to see available training institutions
    """
    serializer_class = TrainingProviderProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only providers with complete profiles"""
        return TrainingProviderProfile.objects.filter(
            organization_name__isnull=False,
            contact_person__isnull=False
        ).exclude(
            organization_name='',
            contact_person=''
        ).select_related('user')


class PublicTrainingProgramsListView(generics.ListAPIView):
    """
    Public list of available training programs
    Accessible by employees and employers to see training opportunities
    """
    serializer_class = TrainingProgramSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return all active training programs with provider info"""
        queryset = TrainingProgram.objects.select_related(
            'provider', 'provider__user'
        ).prefetch_related('enrollments')
        
        # Filter by program category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        # Filter by provider if provided
        provider_id = self.request.query_params.get('provider')
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)
        
        # Search by title or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(provider__organization_name__icontains=search)
            )
        
        return queryset.order_by('-created_at')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def training_provider_detail(request, provider_id):
    """
    Get detailed information about a specific training provider
    Including their programs and statistics
    """
    try:
        provider = TrainingProviderProfile.objects.select_related('user').get(id=provider_id)
    except TrainingProviderProfile.DoesNotExist:
        return Response(
            {'error': 'Training provider not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get provider's programs with statistics
    programs = TrainingProgram.objects.filter(provider=provider).prefetch_related('enrollments')
    
    # Calculate statistics
    total_programs = programs.count()
    total_enrollments = sum(program.enrollments.count() for program in programs)
    
    # Serialize provider data
    provider_data = TrainingProviderProfileSerializer(provider).data
    
    # Add statistics and programs
    provider_data.update({
        'statistics': {
            'total_programs': total_programs,
            'total_enrollments': total_enrollments,
            'program_categories': list(
                programs.values_list('category', flat=True).distinct()
            )
        },
        'featured_programs': TrainingProgramSerializer(
            programs.order_by('-created_at')[:3], many=True
        ).data
    })
    
    return Response(provider_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def training_statistics_summary(request):
    """
    Get overall training statistics for dashboard displays
    """
    total_providers = TrainingProviderProfile.objects.filter(
        organization_name__isnull=False
    ).exclude(organization_name='').count()
    
    total_programs = TrainingProgram.objects.count()
    total_enrollments = TrainingEnrollment.objects.count()
    
    # Get top categories
    top_categories = (
        TrainingProgram.objects
        .values('category')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )
    
    # Get top providers by program count
    top_providers = (
        TrainingProviderProfile.objects
        .annotate(program_count=Count('trainingprogram'))
        .filter(program_count__gt=0)
        .order_by('-program_count')[:5]
        .values('organization_name', 'program_count')
    )
    
    statistics = {
        'total_providers': total_providers,
        'total_programs': total_programs,
        'total_enrollments': total_enrollments,
        'top_categories': list(top_categories),
        'top_providers': list(top_providers)
    }
    
    return Response(statistics)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_training_providers(request):
    """
    Get recommended training providers based on user preferences
    """
    # For now, return providers with highest program counts and ratings
    # This can be enhanced with ML-based recommendations
    
    providers = (
        TrainingProviderProfile.objects
        .annotate(
            program_count=Count('trainingprogram'),
            avg_enrollment=Avg('trainingprogram__enrollments')
        )
        .filter(
            program_count__gt=0,
            organization_name__isnull=False
        )
        .exclude(organization_name='')
        .order_by('-program_count', '-avg_enrollment')[:10]
    )
    
    serializer = TrainingProviderProfileSerializer(providers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_training_opportunities(request):
    """
    Search for training opportunities across all providers
    Enhanced search with filters for employee/employer needs
    """
    search_query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    location = request.GET.get('location', '')
    duration_max = request.GET.get('max_duration')
    
    # Start with all programs
    programs = TrainingProgram.objects.select_related(
        'provider', 'provider__user'
    ).prefetch_related('enrollments')
    
    # Apply search filters
    if search_query:
        programs = programs.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(provider__organization_name__icontains=search_query) |
            Q(category__icontains=search_query)
        )
    
    if category:
        programs = programs.filter(category__icontains=category)
    
    if location:
        programs = programs.filter(
            Q(provider__address__icontains=location) |
            Q(provider__city__icontains=location)
        )
    
    if duration_max:
        try:
            max_hours = int(duration_max)
            programs = programs.filter(duration_hours__lte=max_hours)
        except ValueError:
            pass
    
    # Limit results and serialize
    programs = programs.order_by('-created_at')[:20]
    serializer = TrainingProgramSerializer(programs, many=True)
    
    return Response({
        'results': serializer.data,
        'total_found': programs.count(),
        'search_params': {
            'query': search_query,
            'category': category,
            'location': location,
            'max_duration': duration_max
        }
    })