from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Avg, Count
from .models import (
    SkillCategory, Skill, Course, CourseModule, 
    CourseEnrollment, UserSkillProfile, CourseReview
)
from .serializers import (
    SkillCategorySerializer, SkillSerializer, CourseSerializer,
    CourseCreateSerializer, CourseModuleSerializer, CourseEnrollmentSerializer,
    EnrollCourseSerializer, UserSkillProfileSerializer, CourseReviewSerializer,
    CourseReviewCreateSerializer
)


class SkillCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for skill categories"""
    
    serializer_class = SkillCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SkillCategory.objects.all().prefetch_related('skills')


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for skills"""
    
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Skill.objects.all().select_related('category')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        
        # Filter by difficulty level
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
        
        # Filter by market demand
        min_demand = self.request.query_params.get('min_demand')
        if min_demand:
            queryset = queryset.filter(market_demand__gte=min_demand)
        
        return queryset


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for courses"""
    
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # For instructors, show their own courses (all statuses)
        if hasattr(user, 'courses_taught'):
            if self.action in ['list', 'retrieve']:
                return Course.objects.filter(instructor=user).select_related('instructor')
        
        # For regular users, show only published courses
        queryset = Course.objects.filter(status='PUBLISHED').select_related('instructor')
        
        # Apply filters
        skill = self.request.query_params.get('skill')
        if skill:
            queryset = queryset.filter(skills__name__icontains=skill)
        
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
        
        course_type = self.request.query_params.get('type')
        if course_type:
            queryset = queryset.filter(course_type=course_type)
        
        is_free = self.request.query_params.get('is_free')
        if is_free:
            queryset = queryset.filter(is_free=is_free.lower() == 'true')
        
        return queryset.prefetch_related('skills', 'modules')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CourseCreateSerializer
        return CourseSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured courses"""
        featured_courses = Course.objects.filter(
            status='PUBLISHED', 
            is_featured=True
        ).select_related('instructor')[:10]
        
        serializer = self.get_serializer(featured_courses, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular courses by enrollment count"""
        popular_courses = Course.objects.filter(
            status='PUBLISHED'
        ).order_by('-total_enrollments')[:10]
        
        serializer = self.get_serializer(popular_courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """Enroll user in a course"""
        course = self.get_object()
        user = request.user
        
        # Check if already enrolled
        if CourseEnrollment.objects.filter(user=user, course=course).exists():
            return Response(
                {'error': 'Already enrolled in this course'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check enrollment limits
        if course.max_enrollments:
            current_enrollments = course.total_enrollments
            if current_enrollments >= course.max_enrollments:
                return Response(
                    {'error': 'Course enrollment is full'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create enrollment
        enrollment = CourseEnrollment.objects.create(
            user=user,
            course=course,
            status='ENROLLED'
        )
        
        # Update course enrollment count
        course.total_enrollments += 1
        course.save()
        
        serializer = CourseEnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for a course"""
        course = self.get_object()
        reviews = CourseReview.objects.filter(course=course).select_related('user')
        
        serializer = CourseReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for course enrollments"""
    
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get enrollments for current user"""
        return CourseEnrollment.objects.filter(
            user=self.request.user
        ).select_related('course', 'course__instructor')
    
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update course progress"""
        enrollment = self.get_object()
        
        progress_data = request.data
        completed_modules = progress_data.get('completed_modules', [])
        current_module = progress_data.get('current_module', enrollment.current_module)
        study_time = progress_data.get('study_time', 0)
        
        # Update progress
        enrollment.completed_modules = completed_modules
        enrollment.current_module = current_module
        enrollment.total_study_time += study_time
        
        # Calculate progress percentage
        total_modules = enrollment.course.modules.count()
        if total_modules > 0:
            enrollment.progress_percentage = (len(completed_modules) / total_modules) * 100
        
        # Check if course is completed
        if enrollment.progress_percentage >= 100:
            enrollment.status = 'COMPLETED'
            from django.utils import timezone
            enrollment.completion_date = timezone.now()
        else:
            enrollment.status = 'IN_PROGRESS'
        
        enrollment.save()
        
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """Get user's course statistics"""
        user = request.user
        enrollments = CourseEnrollment.objects.filter(user=user)
        
        stats = {
            'total_enrollments': enrollments.count(),
            'completed_courses': enrollments.filter(status='COMPLETED').count(),
            'in_progress_courses': enrollments.filter(status='IN_PROGRESS').count(),
            'total_study_time': enrollments.aggregate(
                total=models.Sum('total_study_time')
            )['total'] or 0,
            'certificates_earned': enrollments.filter(certificate_issued=True).count(),
            'average_progress': enrollments.aggregate(
                avg=models.Avg('progress_percentage')
            )['avg'] or 0
        }
        
        return Response(stats)


class UserSkillProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user skill profiles"""
    
    serializer_class = UserSkillProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get skill profiles for current user"""
        return UserSkillProfile.objects.filter(
            user=self.request.user
        ).select_related('skill', 'skill__category')
    
    def perform_create(self, serializer):
        """Create skill profile for current user"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def learning_recommendations(self, request):
        """Get learning recommendations based on user's skill profile"""
        user = request.user
        skill_profiles = UserSkillProfile.objects.filter(user=user)
        
        recommendations = []
        
        for profile in skill_profiles:
            if profile.current_level != profile.target_level:
                # Find courses for this skill
                courses = Course.objects.filter(
                    skills=profile.skill,
                    status='PUBLISHED',
                    difficulty_level=self._get_next_difficulty_level(profile.current_level)
                )[:3]
                
                recommendations.extend([{
                    'skill': profile.skill.name,
                    'current_level': profile.current_level,
                    'target_level': profile.target_level,
                    'recommended_courses': CourseSerializer(courses, many=True).data
                }])
        
        return Response(recommendations)
    
    def _get_next_difficulty_level(self, current_level):
        """Get the next appropriate difficulty level"""
        level_progression = {
            'NONE': 'BEGINNER',
            'BASIC': 'INTERMEDIATE',
            'INTERMEDIATE': 'ADVANCED',
            'ADVANCED': 'EXPERT',
            'EXPERT': 'EXPERT'
        }
        return level_progression.get(current_level, 'BEGINNER')


class CourseReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for course reviews"""
    
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get reviews for current user or all reviews"""
        if self.action in ['list', 'retrieve']:
            # For list/retrieve, show all reviews
            return CourseReview.objects.all().select_related('user', 'course')
        else:
            # For other actions, show only user's reviews
            return CourseReview.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CourseReviewCreateSerializer
        return CourseReviewSerializer
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get current user's reviews"""
        reviews = CourseReview.objects.filter(
            user=request.user
        ).select_related('course')
        
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)