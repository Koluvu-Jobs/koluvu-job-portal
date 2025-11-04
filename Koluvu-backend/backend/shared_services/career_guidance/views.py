from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from .models import (
    CareerField, CareerPath, SkillAssessment, UserSkillAssessment,
    CareerRecommendation, CareerGoal, MentorshipRequest, CareerResource
)
from .serializers import (
    CareerFieldSerializer, CareerPathSerializer, CareerPathDetailSerializer,
    SkillAssessmentSerializer, UserSkillAssessmentSerializer,
    CareerRecommendationSerializer, CareerGoalSerializer,
    MentorshipRequestSerializer, CareerResourceSerializer,
    CareerFieldSimpleSerializer, CareerPathSimpleSerializer
)


class CareerFieldListView(generics.ListAPIView):
    """List all career fields"""
    queryset = CareerField.objects.all()
    serializer_class = CareerFieldSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class CareerFieldDetailView(generics.RetrieveAPIView):
    """Get detailed career field information"""
    queryset = CareerField.objects.all()
    serializer_class = CareerFieldSerializer


class CareerPathListView(generics.ListAPIView):
    """List career paths with filtering"""
    queryset = CareerPath.objects.select_related('field')
    serializer_class = CareerPathSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['field', 'experience_level', 'demand_level', 'is_remote_friendly']
    search_fields = ['title', 'description', 'required_skills', 'preferred_skills']
    ordering_fields = ['title', 'experience_level', 'created_at']
    ordering = ['field', 'experience_level']


class CareerPathDetailView(generics.RetrieveAPIView):
    """Get detailed career path information"""
    queryset = CareerPath.objects.select_related('field')
    serializer_class = CareerPathDetailSerializer


class SkillAssessmentListView(generics.ListAPIView):
    """List available skill assessments"""
    queryset = SkillAssessment.objects.filter(is_active=True)
    serializer_class = SkillAssessmentSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['category', 'difficulty_level']
    search_fields = ['name', 'description']


class SkillAssessmentDetailView(generics.RetrieveAPIView):
    """Get detailed skill assessment"""
    queryset = SkillAssessment.objects.filter(is_active=True)
    serializer_class = SkillAssessmentSerializer


class UserSkillAssessmentListCreateView(generics.ListCreateAPIView):
    """List user's assessments and create new ones"""
    serializer_class = UserSkillAssessmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserSkillAssessment.objects.filter(user=self.request.user).select_related('assessment')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CareerRecommendationListView(generics.ListAPIView):
    """List user's career recommendations"""
    serializer_class = CareerRecommendationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['recommendation_type', 'priority', 'is_read']
    ordering_fields = ['created_at', 'priority', 'confidence_score']
    ordering = ['-priority', '-confidence_score', '-created_at']
    
    def get_queryset(self):
        return CareerRecommendation.objects.filter(user=self.request.user).prefetch_related('recommended_paths')


class CareerGoalListCreateView(generics.ListCreateAPIView):
    """List and create career goals"""
    serializer_class = CareerGoalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['goal_type', 'status']
    ordering_fields = ['target_date', 'created_at', 'progress_percentage']
    ordering = ['target_date']
    
    def get_queryset(self):
        return CareerGoal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CareerGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a career goal"""
    serializer_class = CareerGoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CareerGoal.objects.filter(user=self.request.user)


class MentorshipRequestListCreateView(generics.ListCreateAPIView):
    """List and create mentorship requests"""
    serializer_class = MentorshipRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'career_field']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return MentorshipRequest.objects.filter(mentee=self.request.user).select_related('career_field')
    
    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)


class CareerResourceListView(generics.ListAPIView):
    """List career resources with filtering"""
    queryset = CareerResource.objects.prefetch_related('career_fields', 'career_paths')
    serializer_class = CareerResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['resource_type', 'difficulty_level', 'is_free', 'is_featured']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['title', 'rating', 'view_count', 'created_at']
    ordering = ['-is_featured', '-rating', '-view_count']


@api_view(['GET'])
def career_dashboard_stats(request):
    """Get career dashboard statistics for authenticated user"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    
    # Get user's assessments
    assessments_taken = UserSkillAssessment.objects.filter(user=user).count()
    avg_assessment_score = UserSkillAssessment.objects.filter(user=user).aggregate(
        avg_score=Avg('score')
    )['avg_score'] or 0
    
    # Get user's goals
    total_goals = CareerGoal.objects.filter(user=user).count()
    completed_goals = CareerGoal.objects.filter(user=user, status='completed').count()
    in_progress_goals = CareerGoal.objects.filter(user=user, status='in_progress').count()
    
    # Get recommendations
    unread_recommendations = CareerRecommendation.objects.filter(
        user=user, is_read=False
    ).count()
    high_priority_recommendations = CareerRecommendation.objects.filter(
        user=user, priority='high', is_read=False
    ).count()
    
    # Get mentorship requests
    active_mentorship_requests = MentorshipRequest.objects.filter(
        mentee=user, status__in=['pending', 'accepted']
    ).count()
    
    stats = {
        'assessments': {
            'total_taken': assessments_taken,
            'average_score': round(avg_assessment_score, 1),
        },
        'goals': {
            'total': total_goals,
            'completed': completed_goals,
            'in_progress': in_progress_goals,
            'completion_rate': round((completed_goals / total_goals * 100) if total_goals > 0 else 0, 1),
        },
        'recommendations': {
            'unread': unread_recommendations,
            'high_priority': high_priority_recommendations,
        },
        'mentorship': {
            'active_requests': active_mentorship_requests,
        }
    }
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_career_recommendations(request):
    """Generate AI-powered career recommendations based on user profile"""
    user = request.user
    
    # Get user's profile data
    try:
        employee_profile = user.employee_profile
    except:
        return Response(
            {'error': 'Employee profile not found. Please complete your profile first.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get user's assessments
    assessments = UserSkillAssessment.objects.filter(user=user)
    
    # Simple recommendation logic (can be enhanced with AI/ML)
    recommendations = []
    
    # Skill development recommendations
    if assessments.exists():
        avg_score = assessments.aggregate(avg_score=Avg('score'))['avg_score']
        if avg_score < 70:
            recommendations.append({
                'type': 'skill_development',
                'title': 'Improve Core Skills',
                'description': 'Your assessment scores suggest focusing on skill development to enhance your career prospects.',
                'action_items': [
                    'Take additional skill assessments to identify specific areas',
                    'Enroll in relevant online courses',
                    'Practice with hands-on projects',
                    'Seek mentorship in weak areas'
                ],
                'priority': 'high',
                'confidence_score': 0.8
            })
    
    # Career path recommendations based on experience
    if employee_profile.experience_years:
        if employee_profile.experience_years < 2:
            recommendations.append({
                'type': 'career_change',
                'title': 'Entry-Level Career Paths',
                'description': 'Explore entry-level positions that match your skills and interests.',
                'action_items': [
                    'Research entry-level positions in your field',
                    'Build a strong portfolio',
                    'Network with professionals in your target industry',
                    'Consider internships or junior positions'
                ],
                'priority': 'medium',
                'confidence_score': 0.7
            })
        elif employee_profile.experience_years >= 5:
            recommendations.append({
                'type': 'career_change',
                'title': 'Senior Role Opportunities',
                'description': 'With your experience, consider advancing to senior or leadership roles.',
                'action_items': [
                    'Develop leadership and management skills',
                    'Seek mentorship opportunities',
                    'Consider advanced certifications',
                    'Build a professional network'
                ],
                'priority': 'medium',
                'confidence_score': 0.75
            })
    
    # Education recommendations
    if not assessments.filter(assessment__category='technical').exists():
        recommendations.append({
            'type': 'education',
            'title': 'Technical Skills Assessment',
            'description': 'Take technical assessments to identify your strengths and areas for improvement.',
            'action_items': [
                'Complete technical skill assessments',
                'Identify trending technologies in your field',
                'Enroll in relevant technical courses',
                'Join professional communities'
            ],
            'priority': 'medium',
            'confidence_score': 0.6
        })
    
    # Create recommendation objects
    for rec_data in recommendations:
        CareerRecommendation.objects.create(
            user=user,
            recommendation_type=rec_data['type'],
            title=rec_data['title'],
            description=rec_data['description'],
            action_items=rec_data['action_items'],
            priority=rec_data['priority'],
            confidence_score=rec_data['confidence_score']
        )
    
    return Response({
        'message': f'Generated {len(recommendations)} career recommendations',
        'recommendations_count': len(recommendations)
    })


@api_view(['GET'])
def trending_career_fields(request):
    """Get trending career fields"""
    trending_fields = CareerField.objects.filter(is_trending=True).annotate(
        paths_count=Count('career_paths')
    )
    serializer = CareerFieldSerializer(trending_fields, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def career_path_suggestions(request):
    """Get career path suggestions based on user's profile"""
    if not request.user.is_authenticated:
        # Return general popular paths for anonymous users
        popular_paths = CareerPath.objects.filter(demand_level='high')[:10]
        serializer = CareerPathSimpleSerializer(popular_paths, many=True)
        return Response(serializer.data)
    
    user = request.user
    
    # Get user's skills and experience
    try:
        employee_profile = user.employee_profile
        user_skills = employee_profile.skills.values_list('name', flat=True)
        experience_years = employee_profile.experience_years or 0
    except:
        # Return general suggestions if no profile
        popular_paths = CareerPath.objects.filter(demand_level='high')[:10]
        serializer = CareerPathSimpleSerializer(popular_paths, many=True)
        return Response(serializer.data)
    
    # Determine experience level
    if experience_years < 2:
        exp_level = 'entry'
    elif experience_years < 5:
        exp_level = 'mid'
    elif experience_years < 10:
        exp_level = 'senior'
    else:
        exp_level = 'lead'
    
    # Find matching career paths
    suggested_paths = CareerPath.objects.filter(
        experience_level=exp_level,
        demand_level__in=['high', 'very_high']
    )
    
    # If user has skills, try to match them
    if user_skills:
        # Simple skill matching (can be enhanced with better algorithms)
        skill_matched_paths = []
        for path in suggested_paths:
            required_skills = path.required_skills or []
            preferred_skills = path.preferred_skills or []
            all_path_skills = required_skills + preferred_skills
            
            # Check if user has any matching skills
            matching_skills = set(user_skills) & set(all_path_skills)
            if matching_skills:
                skill_matched_paths.append(path)
        
        if skill_matched_paths:
            suggested_paths = skill_matched_paths[:10]
        else:
            suggested_paths = suggested_paths[:10]
    else:
        suggested_paths = suggested_paths[:10]
    
    serializer = CareerPathSimpleSerializer(suggested_paths, many=True)
    return Response(serializer.data)