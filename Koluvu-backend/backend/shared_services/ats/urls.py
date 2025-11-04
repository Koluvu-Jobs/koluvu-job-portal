from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .views import ATSProfileViewSet, ATSAnalysisViewSet, ATSKeywordLibraryViewSet, ATSSettingsViewSet

@csrf_exempt
@require_http_methods(["POST"])
def analyze_resume(request):
    """Simple analyze endpoint"""
    from .services import ATSAnalyzerService
    import json
    
    try:
        print(f"Request method: {request.method}")
        print(f"Request content type: {request.content_type}")
        print(f"Request FILES: {list(request.FILES.keys())}")
        print(f"Request POST: {dict(request.POST)}")
        
        # Handle file upload - check both FILES and POST data
        resume_file = request.FILES.get('resume')
        
        # Try to get job_description from both POST and JSON body
        job_description = request.POST.get('job_description', '')
        
        # If no job description in POST, try JSON body
        if not job_description and request.content_type == 'application/json':
            try:
                json_data = json.loads(request.body.decode('utf-8'))
                job_description = json_data.get('job_description', '')
            except:
                pass
        
        print(f"Resume file: {resume_file}")
        print(f"Job description: {job_description}")
        
        if not resume_file:
            return JsonResponse({'error': 'Resume file is required'}, status=400)
        
        if not job_description.strip():
            return JsonResponse({'error': 'Job description is required'}, status=400)
        
        # Extract text from file (basic implementation)
        if resume_file.name.endswith('.txt'):
            try:
                document_text = resume_file.read().decode('utf-8')
            except:
                document_text = f"Resume file: {resume_file.name}"
        else:
            document_text = f"Resume file: {resume_file.name}"
            
        # Perform analysis
        analyzer = ATSAnalyzerService()
        combined_text = f"{document_text}\n\nTarget Job Description:\n{job_description}"
        
        results = analyzer.analyze_document(
            document_text=combined_text,
            analysis_type='RESUME',
            user_profile=None
        )
        
        return JsonResponse(results)
        
    except Exception as e:
        return JsonResponse({'error': f'Analysis failed: {str(e)}'}, status=500)

router = DefaultRouter()
router.register(r'profiles', ATSProfileViewSet, basename='ats-profile')
router.register(r'analyses', ATSAnalysisViewSet, basename='ats-analysis')
router.register(r'keywords', ATSKeywordLibraryViewSet, basename='ats-keywords')
router.register(r'settings', ATSSettingsViewSet, basename='ats-settings')

app_name = 'ats'

urlpatterns = [
    path('analyze/', analyze_resume, name='analyze-resume'),
    path('analyze', analyze_resume, name='analyze-resume-no-slash'),  # Handle both versions
    path('', include(router.urls)),
]