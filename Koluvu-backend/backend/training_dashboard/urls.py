from django.urls import path
from .views import (
    RegisterTrainingProviderView, 
    TrainingProviderProfileView,
    ProfileCompletenessCheckView,
    DashboardStatisticsView,
    TrainingProviderLoginView,
    TrainingProgramListCreateView,
    TrainingProgramDetailView,
    TrainingEnrollmentListView,
    TrainingEnrollmentDetailView,
    InternshipListCreateView,
    InternshipDetailView,
    PlacementListCreateView,
    PlacementDetailView,
    # Public API views
    PublicTrainingProvidersView,
    PublicTrainingProgramsView,
    PublicProviderDetailView,
    TrainingCategoriesView,
    SearchTrainingView,
    TrainingStatisticsView,
    RecommendedProvidersView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterTrainingProviderView.as_view(), name='training_provider_register'),
    path('login/', TrainingProviderLoginView.as_view(), name='training_provider_login'),
    path('profile/', TrainingProviderProfileView.as_view(), name='training_provider_profile'),
    path('profile/check-completeness/', ProfileCompletenessCheckView.as_view(), name='profile_completeness_check'),
    path('dashboard/statistics/', DashboardStatisticsView.as_view(), name='dashboard_statistics'),
    
    # Training Programs
    path('programs/', TrainingProgramListCreateView.as_view(), name='training_program_list_create'),
    path('programs/<int:pk>/', TrainingProgramDetailView.as_view(), name='training_program_detail'),
    
    # Enrollments
    path('enrollments/', TrainingEnrollmentListView.as_view(), name='enrollment_list'),
    path('enrollments/<int:pk>/', TrainingEnrollmentDetailView.as_view(), name='enrollment_detail'),
    
    # Internships
    path('internships/', InternshipListCreateView.as_view(), name='internship_list_create'),
    path('internships/<int:pk>/', InternshipDetailView.as_view(), name='internship_detail'),
    
    # Placements
    path('placements/', PlacementListCreateView.as_view(), name='placement_list_create'),
    path('placements/<int:pk>/', PlacementDetailView.as_view(), name='placement_detail'),
    
    # Public APIs for Employee/Employer Dashboard Integration
    path('public/providers/', PublicTrainingProvidersView.as_view(), name='public_training_providers'),
    path('public/programs/', PublicTrainingProgramsView.as_view(), name='public_training_programs'),
    path('public/providers/<int:provider_id>/', PublicProviderDetailView.as_view(), name='public_provider_detail'),
    path('public/categories/', TrainingCategoriesView.as_view(), name='training_categories'),
    path('public/search/', SearchTrainingView.as_view(), name='search_training'),
    path('public/statistics/', TrainingStatisticsView.as_view(), name='training_statistics'),
    path('public/recommended/', RecommendedProvidersView.as_view(), name='recommended_providers'),
]
