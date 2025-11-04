from django.urls import path
from .views import (
    CompaniesListView,
    EmployerRegisterView, 
    EmployerProfileView,
    SocialMediaSyncView,
    ProfileCompletionView,
    EmployerLoginView,
    # Username-based profile views
    UsernameBasedEmployerProfileView,
    UsernameBasedEmployerProfileUpdateView,
    UsernameBasedCompanyLogoUploadView, 
    UsernameBasedProfilePictureUploadView,
    JobListCreateView,
    JobDetailView,
    JobApplicationListView,
    JobApplicationDetailView,
    PublicJobListView,
    PublicJobDetailView,
    JobStatsView,
    RecentJobsView,
    JobBulkActionView,
    JobCloseView,
    JobActivateView,
    JobViewCountUpdateView,
    ActiveJobsView,
    ExpiredJobsView,
    JobReactivateView,
    ExpiredJobsBulkActionView,
    ClosedJobsView,
    ClosedJobsBulkActionView,
    BooleanCandidateSearchView,
    # Interview Scheduler Views
    CandidateListCreateView,
    CandidateDetailView,
    InterviewerListCreateView,
    InterviewerDetailView,
    InterviewListCreateView,
    InterviewDetailView,
    InterviewStatusUpdateView,
    InterviewRescheduleView,
    InterviewNotesView,
    InterviewTimeSlotView,
    InterviewDashboardView,
    # Proxy Detection Views
    ProxyScanListCreateView,
    ProxyScanDetailView,
    ProxyScanStatisticsView,
    ProxyDetectionRuleListCreateView,
    ProxyDetectionRuleDetailView,
    ProxyAlertListView,
    ProxyAlertResolveView,
    ProxyDashboardView,
    # Interview Feedback Views
    InterviewFeedbackListCreateView,
    InterviewFeedbackDetailView,
    FeedbackSummaryView,
    CandidateFeedbackView,
    FeedbackTemplateListCreateView,
    FeedbackTemplateDetailView,
    PendingFeedbackView,
    SubmitFeedbackView,
)

# Import settings views
from .settings_views import (
    EmployerSettingsView,
    EmployerSettingsSectionView,
    EmployerSettingsResetView,
    EmployerSettingsExportView,
    EmployerSettingsImportView,
)

# Import dashboard views
from .dashboard_views import (
    DashboardStatsView,
    CompanyProfileView,
)

# Import additional function-based views
from .additional_views import (
    update_employer_names,
    check_name_change_eligibility,
    toggle_activation_status,
)

urlpatterns = [
    # Public endpoints
    path('companies/', CompaniesListView.as_view(), name='companies_list'),
    path('jobs/public/', PublicJobListView.as_view(), name='public_job_list'),
    path('jobs/public/<int:pk>/', PublicJobDetailView.as_view(), name='public_job_detail'),
    path('jobs/recent/', RecentJobsView.as_view(), name='recent_jobs'),
    
    # Authentication
    path('register/', EmployerRegisterView.as_view(), name='employer_register'),
    path('login/', EmployerLoginView.as_view(), name='employer_login'),
    path('profile/', EmployerProfileView.as_view(), name='employer_profile'),
    path('profile/sync/', SocialMediaSyncView.as_view(), name='social_media_sync'),
    path('profile/completion/', ProfileCompletionView.as_view(), name='profile_completion'),
    
    # Username-based profile URLs (LinkedIn-style)
    path('<str:username>/profile/', UsernameBasedEmployerProfileView.as_view(), name='username_employer_profile'),
    path('<str:username>/profile/update/', UsernameBasedEmployerProfileUpdateView.as_view(), name='username_employer_profile_update'),
    path('<str:username>/profile/upload-logo/', UsernameBasedCompanyLogoUploadView.as_view(), name='username_company_logo_upload'),
    path('<str:username>/profile/upload-picture/', UsernameBasedProfilePictureUploadView.as_view(), name='username_profile_picture_upload'),
    
    # Jobs (Protected - Employer only)
    path('jobs/', JobListCreateView.as_view(), name='job_list_create'),
    path('jobs/active/', ActiveJobsView.as_view(), name='active_jobs'),
    path('jobs/expired/', ExpiredJobsView.as_view(), name='expired_jobs'),
    path('jobs/closed/', ClosedJobsView.as_view(), name='closed_jobs'),
    path('jobs/stats/', JobStatsView.as_view(), name='job_stats'),
    path('jobs/bulk-action/', JobBulkActionView.as_view(), name='job_bulk_action'),
    path('jobs/expired-bulk-action/', ExpiredJobsBulkActionView.as_view(), name='expired_jobs_bulk_action'),
    path('jobs/closed-bulk-action/', ClosedJobsBulkActionView.as_view(), name='closed_jobs_bulk_action'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job_detail'),
    path('jobs/<int:pk>/close/', JobCloseView.as_view(), name='job_close'),
    path('jobs/<int:pk>/activate/', JobActivateView.as_view(), name='job_activate'),
    path('jobs/<int:pk>/update-views/', JobViewCountUpdateView.as_view(), name='job_update_views'),
    path('jobs/<int:pk>/reactivate/', JobReactivateView.as_view(), name='job_reactivate'),
    
    # Applications (Protected - Employer only)
    path('applications/', JobApplicationListView.as_view(), name='application_list'),
    path('applications/<int:pk>/', JobApplicationDetailView.as_view(), name='application_detail'),
    
    # Boolean Search (Protected - Employer only)
    path('candidates/boolean-search/', BooleanCandidateSearchView.as_view(), name='boolean_candidate_search'),
    
    # Interview Scheduler (Protected - Employer only)
    path('candidates/', CandidateListCreateView.as_view(), name='candidate_list_create'),
    path('candidates/<int:pk>/', CandidateDetailView.as_view(), name='candidate_detail'),
    path('interviewers/', InterviewerListCreateView.as_view(), name='interviewer_list_create'),
    path('interviewers/<int:pk>/', InterviewerDetailView.as_view(), name='interviewer_detail'),
    path('interviews/', InterviewListCreateView.as_view(), name='interview_list_create'),
    path('interviews/<int:pk>/', InterviewDetailView.as_view(), name='interview_detail'),
    path('interviews/<int:pk>/status/', InterviewStatusUpdateView.as_view(), name='interview_status_update'),
    path('interviews/<int:pk>/reschedule/', InterviewRescheduleView.as_view(), name='interview_reschedule'),
    path('interviews/<int:interview_id>/notes/', InterviewNotesView.as_view(), name='interview_notes'),
    path('interview-slots/', InterviewTimeSlotView.as_view(), name='interview_time_slots'),
    path('interviews/dashboard/', InterviewDashboardView.as_view(), name='interview_dashboard'),
    
    # Proxy Detection (Protected - Employer only)
    path('proxy-scans/', ProxyScanListCreateView.as_view(), name='proxy_scan_list_create'),
    path('proxy-scans/<int:pk>/', ProxyScanDetailView.as_view(), name='proxy_scan_detail'),
    path('proxy-scans/statistics/', ProxyScanStatisticsView.as_view(), name='proxy_scan_statistics'),
    path('proxy-scans/dashboard/', ProxyDashboardView.as_view(), name='proxy_dashboard'),
    path('proxy-rules/', ProxyDetectionRuleListCreateView.as_view(), name='proxy_rule_list_create'),
    path('proxy-rules/<int:pk>/', ProxyDetectionRuleDetailView.as_view(), name='proxy_rule_detail'),
    path('proxy-alerts/', ProxyAlertListView.as_view(), name='proxy_alert_list'),
    path('proxy-alerts/<int:alert_id>/resolve/', ProxyAlertResolveView.as_view(), name='proxy_alert_resolve'),
    
    # Interview Feedback System (Protected - Employer only)
    path('feedback/', InterviewFeedbackListCreateView.as_view(), name='feedback_list_create'),
    path('feedback/<int:pk>/', InterviewFeedbackDetailView.as_view(), name='feedback_detail'),
    path('feedback/<int:feedback_id>/submit/', SubmitFeedbackView.as_view(), name='feedback_submit'),
    path('feedback/summary/', FeedbackSummaryView.as_view(), name='feedback_summary'),
    path('feedback/pending/', PendingFeedbackView.as_view(), name='pending_feedback'),
    path('feedback/candidate/<int:candidate_id>/', CandidateFeedbackView.as_view(), name='candidate_feedback'),
    path('feedback-templates/', FeedbackTemplateListCreateView.as_view(), name='feedback_template_list_create'),
    path('feedback-templates/<int:pk>/', FeedbackTemplateDetailView.as_view(), name='feedback_template_detail'),
    
    # Employer Settings (Protected - Employer only)
    path('settings/', EmployerSettingsView.as_view(), name='employer_settings'),
    path('settings/<str:section>/', EmployerSettingsSectionView.as_view(), name='employer_settings_section'),
    path('settings/reset/', EmployerSettingsResetView.as_view(), name='employer_settings_reset'),
    path('settings/export/', EmployerSettingsExportView.as_view(), name='employer_settings_export'),
    path('settings/import/', EmployerSettingsImportView.as_view(), name='employer_settings_import'),
    
    # Dashboard and Company Profile (Protected - Employer only)
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('company/profile/', CompanyProfileView.as_view(), name='company_profile'),
    
    # Additional Function-based Views (Protected - Employer only)
    path('update-names/', update_employer_names, name='update_employer_names'),
    path('check-name-eligibility/', check_name_change_eligibility, name='check_name_change_eligibility'),
    path('toggle-activation/', toggle_activation_status, name='toggle_activation_status'),
]
