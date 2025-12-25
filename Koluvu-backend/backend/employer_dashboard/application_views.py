"""
Application views for job application submission and management
"""
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.shortcuts import get_object_or_404
import logging

from .models import Job, JobApplication, EmployerProfile
from employee_dashboard.models import EmployeeProfile
from .serializers import JobApplicationSerializer, ApplicantDetailSerializer
from shared_services.ats.services import ATSAnalyzerService

logger = logging.getLogger(__name__)


class JobApplyView(APIView):
    """
    Handle job application submission with resume upload and ATS scoring
    POST /api/jobs/<id>/apply/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, job_id):
        try:
            # Get the job
            job = get_object_or_404(Job, id=job_id, status='active')
            
            # Get employee profile
            try:
                employee_profile = EmployeeProfile.objects.get(user=request.user)
            except EmployeeProfile.DoesNotExist:
                return Response(
                    {"error": "Employee profile not found. Please complete your profile first."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if already applied
            existing_application = JobApplication.objects.filter(
                job=job,
                employee=employee_profile
            ).first()
            
            if existing_application:
                return Response(
                    {"error": "You have already applied to this job."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get form data
            resume_file = request.FILES.get('resume')
            cover_letter = request.data.get('cover_letter', '')
            screening_answers = request.data.get('screening_answers', [])
            
            # Validate resume
            if not resume_file:
                return Response(
                    {"error": "Resume file is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate file size (10MB max)
            max_file_size = 10 * 1024 * 1024  # 10MB in bytes
            if resume_file.size > max_file_size:
                return Response(
                    {"error": "Resume file size must be less than 10MB."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate file type
            allowed_extensions = ['.pdf', '.doc', '.docx']
            file_ext = resume_file.name.lower().split('.')[-1]
            if f'.{file_ext}' not in allowed_extensions:
                return Response(
                    {"error": "Only PDF, DOC, and DOCX files are allowed."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Extract text from resume and calculate ATS score
            ats_service = ATSAnalyzerService()
            resume_text = ""
            ats_score = 0
            matching_keywords = []
            missing_keywords = []
            
            try:
                # Extract text from PDF
                if file_ext == 'pdf':
                    resume_text = ats_service.extract_text_from_pdf(resume_file)
                    resume_file.seek(0)  # Reset file pointer for saving
                
                # Match resume to job requirements
                if resume_text:
                    match_result = ats_service.match_resume_to_job(resume_text, job)
                    ats_score = match_result.get('ats_score', 0)
                    matching_keywords = match_result.get('matching_keywords', [])
                    missing_keywords = match_result.get('missing_keywords', [])
                    
                    logger.info(f"ATS Analysis - Score: {ats_score}, Matched: {len(matching_keywords)}, Missing: {len(missing_keywords)}")
                else:
                    logger.warning(f"Could not extract text from resume: {resume_file.name}")
                    
            except Exception as e:
                logger.error(f"Error in ATS analysis: {str(e)}")
                # Continue with application even if ATS fails
            
            # Parse screening answers if string
            if isinstance(screening_answers, str):
                import json
                try:
                    screening_answers = json.loads(screening_answers)
                except:
                    screening_answers = []
            
            # Create application
            with transaction.atomic():
                application = JobApplication.objects.create(
                    job=job,
                    employee=employee_profile,
                    candidate_name=f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
                    candidate_email=request.user.email,
                    candidate_phone=employee_profile.phone_number or employee_profile.phone,
                    resume=resume_file,
                    resume_file_name=resume_file.name,
                    resume_file_size=resume_file.size,
                    cover_letter=cover_letter,
                    screening_answers=screening_answers,
                    ats_score=ats_score,
                    matching_keywords=matching_keywords,
                    missing_keywords=missing_keywords,
                    status='pending'
                )
                
                # Extract and save keywords to job if not already done
                if job.ats_keywords:
                    try:
                        job.extract_keywords_from_description()
                        job.save()
                    except Exception as e:
                        logger.error(f"Error extracting job keywords: {str(e)}")
            
            serializer = JobApplicationSerializer(application)
            return Response({
                "message": "Application submitted successfully!",
                "application": serializer.data,
                "ats_analysis": {
                    "score": ats_score,
                    "matched_keywords_count": len(matching_keywords),
                    "missing_keywords_count": len(missing_keywords)
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error in job application: {str(e)}")
            return Response(
                {"error": "An error occurred while submitting your application. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobApplicantsListView(generics.ListAPIView):
    """
    List all applicants for a specific job (employer only)
    GET /api/employer/jobs/<id>/applicants/
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            
            # Verify job belongs to employer
            job = get_object_or_404(Job, id=job_id, employer=employer_profile)
            
            # Get all applications for this job, ordered by ATS score
            queryset = JobApplication.objects.filter(job=job).select_related(
                'employee', 'employee__user'
            ).order_by('-ats_score', '-applied_at')
            
            return queryset
            
        except EmployerProfile.DoesNotExist:
            return JobApplication.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Calculate statistics
        total_count = queryset.count()
        pending_count = queryset.filter(status='pending').count()
        reviewed_count = queryset.filter(status='reviewed').count()
        shortlisted_count = queryset.filter(status='shortlisted').count()
        rejected_count = queryset.filter(status='rejected').count()
        
        avg_ats_score = 0
        if total_count > 0:
            total_score = sum([app.ats_score for app in queryset])
            avg_ats_score = round(total_score / total_count, 2)
        
        return Response({
            "count": total_count,
            "statistics": {
                "total": total_count,
                "pending": pending_count,
                "reviewed": reviewed_count,
                "shortlisted": shortlisted_count,
                "rejected": rejected_count,
                "average_ats_score": avg_ats_score
            },
            "results": serializer.data
        })


class ApplicantDetailView(generics.RetrieveUpdateAPIView):
    """
    Get full applicant details with employee profile (employer only)
    GET/PATCH /api/employer/applicants/<id>/
    """
    serializer_class = ApplicantDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employer_profile = EmployerProfile.objects.get(user=self.request.user)
            
            # Get applications for employer's jobs with full relations
            queryset = JobApplication.objects.filter(
                job__employer=employer_profile
            ).select_related(
                'employee', 'employee__user', 'job', 'job__employer'
            ).prefetch_related(
                'employee__education', 'employee__experience', 'employee__skills'
            )
            
            return queryset
            
        except EmployerProfile.DoesNotExist:
            return JobApplication.objects.none()
    
    def retrieve(self, request, *args, **kwargs):
        """Get applicant detail and mark as viewed"""
        instance = self.get_object()
        
        # Mark as viewed by employer
        if not instance.viewed_by_employer:
            instance.mark_as_viewed()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Update application status"""
        instance = self.get_object()
        
        # Only allow status updates
        allowed_fields = ['status']
        update_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        serializer = self.get_serializer(instance, data=update_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)


class MyApplicationsListView(generics.ListAPIView):
    """
    List all applications submitted by the authenticated employee
    GET /api/employee/my-applications/
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            employee_profile = EmployeeProfile.objects.get(user=self.request.user)
            
            queryset = JobApplication.objects.filter(
                employee=employee_profile
            ).select_related('job', 'job__employer').order_by('-applied_at')
            
            return queryset
            
        except EmployeeProfile.DoesNotExist:
            return JobApplication.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Calculate statistics
        total_count = queryset.count()
        pending_count = queryset.filter(status='pending').count()
        reviewed_count = queryset.filter(status='reviewed').count()
        shortlisted_count = queryset.filter(status='shortlisted').count()
        rejected_count = queryset.filter(status='rejected').count()
        
        return Response({
            "count": total_count,
            "statistics": {
                "total": total_count,
                "pending": pending_count,
                "reviewed": reviewed_count,
                "shortlisted": shortlisted_count,
                "rejected": rejected_count
            },
            "results": serializer.data
        })
