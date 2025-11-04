from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import models
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import ATSProfile, ATSAnalysis, ATSKeywordLibrary, ATSSettings
from .serializers import (
    ATSProfileSerializer, ATSAnalysisSerializer, ATSAnalysisCreateSerializer,
    ATSKeywordLibrarySerializer, ATSSettingsSerializer
)
from .services import ATSAnalyzerService


class ATSProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for ATS Profile management"""
    
    serializer_class = ATSProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get ATS profiles for the current user"""
        return ATSProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create ATS profile for current user"""
        serializer.save(user=self.request.user)


@method_decorator(csrf_exempt, name='dispatch')
class ATSAnalysisViewSet(viewsets.ModelViewSet):
    """ViewSet for ATS Analysis"""
    
    serializer_class = ATSAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Allow anonymous access for the analyze action"""
        if self.action == 'analyze':
            return []
        return super().get_permissions()
    
    def get_queryset(self):
        """Get analyses for current user's ATS profile"""
        try:
            ats_profile = ATSProfile.objects.get(user=self.request.user)
            return ATSAnalysis.objects.filter(ats_profile=ats_profile)
        except ATSProfile.DoesNotExist:
            return ATSAnalysis.objects.none()
    
    def get_serializer_class(self):
        """Use different serializers for create vs read operations"""
        if self.action == 'create':
            return ATSAnalysisCreateSerializer
        return ATSAnalysisSerializer
    
    def perform_create(self, serializer):
        """Create new ATS analysis"""
        # Get or create ATS profile for user
        ats_profile, created = ATSProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'usage_type': self.determine_usage_type()}
        )
        
        # Perform ATS analysis using service
        analysis_data = serializer.validated_data
        analyzer = ATSAnalyzerService()
        
        # Run the analysis
        results = analyzer.analyze_document(
            document_text=analysis_data.get('document_text', ''),
            analysis_type=analysis_data['analysis_type'],
            user_profile=ats_profile
        )
        
        # Save analysis with results
        serializer.save(
            ats_profile=ats_profile,
            score=results['score'],
            feedback=results['feedback'],
            keywords_found=results['keywords_found'],
            keywords_missing=results['keywords_missing'],
            suggestions=results['suggestions']
        )
        
        # Update profile stats
        ats_profile.scan_count += 1
        ats_profile.ats_score = results['score']
        ats_profile.save()
    
    def determine_usage_type(self):
        """Determine usage type based on user type"""
        user = self.request.user
        # Check user type from profile or groups
        if hasattr(user, 'employee_profile'):
            return 'RESUME_OPTIMIZATION'
        elif hasattr(user, 'employer_profile'):
            return 'JOB_DESCRIPTION'
        return 'RESUME_OPTIMIZATION'  # default
    
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """Analyze resume/document endpoint"""
        try:
            # Handle file upload
            resume_file = request.FILES.get('resume')
            job_description = request.data.get('job_description', '')
            
            if not resume_file:
                return Response(
                    {'error': 'Resume file is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not job_description.strip():
                return Response(
                    {'error': 'Job description is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Extract text from file (basic implementation)
            try:
                if resume_file.name.endswith('.txt'):
                    document_text = resume_file.read().decode('utf-8')
                else:
                    # For now, just use the filename as placeholder
                    # In production, you'd use libraries like PyPDF2, python-docx, etc.
                    document_text = f"Resume file: {resume_file.name}\n"
                    
            except Exception as e:
                return Response(
                    {'error': f'Error reading file: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create ATS profile for user
            if request.user.is_authenticated:
                ats_profile, created = ATSProfile.objects.get_or_create(
                    user=request.user,
                    defaults={'usage_type': 'RESUME_OPTIMIZATION'}
                )
            else:
                # For anonymous users, create a temporary analysis
                ats_profile = None
            
            # Perform ATS analysis using service
            analyzer = ATSAnalyzerService()
            
            # Combine resume text with job description for analysis
            combined_text = f"{document_text}\n\nTarget Job Description:\n{job_description}"
            
            # Run the analysis
            results = analyzer.analyze_document(
                document_text=combined_text,
                analysis_type='RESUME',
                user_profile=ats_profile
            )
            
            # If user is authenticated, save the analysis
            if ats_profile:
                analysis = ATSAnalysis.objects.create(
                    ats_profile=ats_profile,
                    analysis_type='RESUME',
                    document_text=document_text[:1000],  # Store truncated version
                    score=results['score'],
                    feedback=results['feedback'],
                    keywords_found=results['keywords_found'],
                    keywords_missing=results['keywords_missing'],
                    suggestions=results['suggestions']
                )
                
                # Update profile stats
                ats_profile.scan_count += 1
                ats_profile.ats_score = results['score']
                ats_profile.save()
            
            return Response(results, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Analysis failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """Get user's ATS statistics"""
        try:
            ats_profile = ATSProfile.objects.get(user=request.user)
            analyses = ATSAnalysis.objects.filter(ats_profile=ats_profile)
            
            stats = {
                'total_analyses': analyses.count(),
                'average_score': analyses.aggregate(
                    avg_score=models.Avg('score')
                )['avg_score'] or 0,
                'latest_score': ats_profile.ats_score,
                'scan_count': ats_profile.scan_count,
                'usage_type': ats_profile.usage_type
            }
            
            return Response(stats)
        except ATSProfile.DoesNotExist:
            return Response({'message': 'No ATS profile found'}, status=404)


class ATSKeywordLibraryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ATS Keyword Library (read-only for users)"""
    
    serializer_class = ATSKeywordLibrarySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ATSKeywordLibrary.objects.all()
    
    def get_queryset(self):
        """Filter keywords by industry and role"""
        queryset = super().get_queryset()
        
        industry = self.request.query_params.get('industry')
        role_category = self.request.query_params.get('role_category')
        
        if industry:
            queryset = queryset.filter(industry__icontains=industry)
        if role_category:
            queryset = queryset.filter(role_category__icontains=role_category)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def industries(self, request):
        """Get list of available industries"""
        industries = ATSKeywordLibrary.objects.values_list('industry', flat=True).distinct()
        return Response(list(industries))
    
    @action(detail=False, methods=['get'])
    def roles(self, request):
        """Get list of available role categories"""
        roles = ATSKeywordLibrary.objects.values_list('role_category', flat=True).distinct()
        return Response(list(roles))


class ATSSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ATS Settings (read-only for users)"""
    
    serializer_class = ATSSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ATSSettings.objects.all()
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current ATS settings"""
        try:
            settings = ATSSettings.objects.first()
            if settings:
                serializer = self.get_serializer(settings)
                return Response(serializer.data)
            else:
                return Response({'message': 'No ATS settings configured'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)