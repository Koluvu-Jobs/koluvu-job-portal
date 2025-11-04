from django.urls import path
from .views import (
    RegisterEmployeeView, 
    EmployeeProfileView, 
    EmployeeLoginView,
    # Username-based profile views
    UsernameBasedEmployeeProfileView,
    UsernameBasedEmployeeProfileUpdateView,
    UsernameBasedEmployeeProfilePictureUploadView,
    EducationListCreateView,
    EducationDetailView,
    ExperienceListCreateView,
    ExperienceDetailView,
    SkillListCreateView,
    SkillDetailView,
    ResumeListCreateView,
    ResumeDetailView,
    dashboard_data,
    complete_profile_data,
    update_basic_info,
    upload_profile_picture,
    delete_profile_picture,
    upload_background_image,
    delete_background_image,
    bulk_add_skills,
    bulk_delete_skills,
    profile_summary,
    api_endpoints_info,
    # Resume Builder Views
    resume_builder_dashboard,
    ResumeBuilderListCreateView,
    ResumeBuilderDetailView,
    create_resume_from_profile,
    duplicate_resume,
    update_resume_section,
    update_resume_styling,
    resume_templates_list,
    generate_resume_pdf,
    create_resume_sharing_link
)
from .settings_views import (
    EmployeeSettingsView,
    EmployeeSettingsSectionView,
    reset_employee_settings,
    export_employee_settings,
    import_employee_settings
)

urlpatterns = [
    # Authentication
    path('register/', RegisterEmployeeView.as_view(), name='employee_register'),
    path('login/', EmployeeLoginView.as_view(), name='employee_login'),
    path('profile/', EmployeeProfileView.as_view(), name='employee_profile'),
    
    # Username-based profile URLs (LinkedIn-style)
    path('<str:username>/profile/', UsernameBasedEmployeeProfileView.as_view(), name='username_employee_profile'),
    path('<str:username>/profile/update/', UsernameBasedEmployeeProfileUpdateView.as_view(), name='username_employee_profile_update'),
    path('<str:username>/profile/upload-picture/', UsernameBasedEmployeeProfilePictureUploadView.as_view(), name='username_employee_profile_picture_upload'),
    
    # Dashboard
    path('dashboard/', dashboard_data, name='employee_dashboard'),
    path('dashboard-stats/', dashboard_data, name='employee_dashboard_stats'),
    
    # Education
    path('education/', EducationListCreateView.as_view(), name='education_list_create'),
    path('education/<int:pk>/', EducationDetailView.as_view(), name='education_detail'),
    
    # Experience
    path('experience/', ExperienceListCreateView.as_view(), name='experience_list_create'),
    path('experience/<int:pk>/', ExperienceDetailView.as_view(), name='experience_detail'),
    
    # Skills
    path('skills/', SkillListCreateView.as_view(), name='skill_list_create'),
    path('skills/<int:pk>/', SkillDetailView.as_view(), name='skill_detail'),
    
    # Resumes
    path('resumes/', ResumeListCreateView.as_view(), name='resume_list_create'),
    path('resumes/<int:pk>/', ResumeDetailView.as_view(), name='resume_detail'),
    
    # Enhanced Profile Management
    path('profile/complete/', complete_profile_data, name='complete_profile_data'),
    path('profile/update-basic/', update_basic_info, name='update_basic_info'),
    path('profile/picture/upload/', upload_profile_picture, name='upload_profile_picture'),
    path('profile/picture/delete/', delete_profile_picture, name='delete_profile_picture'),
    path('profile/background/upload/', upload_background_image, name='upload_background_image'),
    path('profile/background/delete/', delete_background_image, name='delete_background_image'),
    
    # Bulk Operations
    path('skills/bulk-add/', bulk_add_skills, name='bulk_add_skills'),
    path('skills/bulk-delete/', bulk_delete_skills, name='bulk_delete_skills'),
    
    # Additional Profile Views
    path('profile/summary/', profile_summary, name='profile_summary'),
    path('api-info/', api_endpoints_info, name='api_endpoints_info'),
    
    # Resume Builder URLs
    path('resume-builder/', resume_builder_dashboard, name='resume_builder_dashboard'),
    path('resume-builder/resumes/', ResumeBuilderListCreateView.as_view(), name='resume_builder_list_create'),
    path('resume-builder/resumes/<int:pk>/', ResumeBuilderDetailView.as_view(), name='resume_builder_detail'),
    path('resume-builder/create-from-profile/', create_resume_from_profile, name='create_resume_from_profile'),
    path('resume-builder/resumes/<int:resume_id>/duplicate/', duplicate_resume, name='duplicate_resume'),
    path('resume-builder/resumes/<int:resume_id>/update-section/', update_resume_section, name='update_resume_section'),
    path('resume-builder/resumes/<int:resume_id>/update-styling/', update_resume_styling, name='update_resume_styling'),
    path('resume-builder/templates/', resume_templates_list, name='resume_templates_list'),
    path('resume-builder/resumes/<int:resume_id>/generate-pdf/', generate_resume_pdf, name='generate_resume_pdf'),
    path('resume-builder/resumes/<int:resume_id>/create-sharing-link/', create_resume_sharing_link, name='create_resume_sharing_link'),
    
    # Employee Settings URLs
    path('settings/', EmployeeSettingsView.as_view(), name='employee_settings'),
    path('settings/<str:section>/', EmployeeSettingsSectionView.as_view(), name='employee_settings_section'),
    path('settings/reset/', reset_employee_settings, name='reset_employee_settings'),
    path('settings/export/', export_employee_settings, name='export_employee_settings'),
    path('settings/import/', import_employee_settings, name='import_employee_settings'),
]
