from django.urls import path
from .views import (
    RegisterTrainingProviderView, 
    TrainingProviderProfileView, 
    TrainingProviderLoginView,
    TrainingProgramListCreateView,
    TrainingProgramDetailView,
    TrainingEnrollmentListView,
    TrainingEnrollmentDetailView,
    InternshipListCreateView,
    InternshipDetailView,
    PlacementListCreateView,
    PlacementDetailView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterTrainingProviderView.as_view(), name='training_provider_register'),
    path('login/', TrainingProviderLoginView.as_view(), name='training_provider_login'),
    path('profile/', TrainingProviderProfileView.as_view(), name='training_provider_profile'),
    
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
]
