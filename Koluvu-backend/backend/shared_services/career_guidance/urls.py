from django.urls import path
from . import views

urlpatterns = [
    # Career Fields
    path('fields/', views.CareerFieldListView.as_view(), name='career-fields-list'),
    path('fields/<int:pk>/', views.CareerFieldDetailView.as_view(), name='career-field-detail'),
    path('fields/trending/', views.trending_career_fields, name='trending-career-fields'),
    
    # Career Paths
    path('paths/', views.CareerPathListView.as_view(), name='career-paths-list'),
    path('paths/<int:pk>/', views.CareerPathDetailView.as_view(), name='career-path-detail'),
    path('paths/suggestions/', views.career_path_suggestions, name='career-path-suggestions'),
    
    # Skill Assessments
    path('assessments/', views.SkillAssessmentListView.as_view(), name='skill-assessments-list'),
    path('assessments/<int:pk>/', views.SkillAssessmentDetailView.as_view(), name='skill-assessment-detail'),
    path('user-assessments/', views.UserSkillAssessmentListCreateView.as_view(), name='user-assessments'),
    
    # Career Recommendations
    path('recommendations/', views.CareerRecommendationListView.as_view(), name='career-recommendations'),
    path('recommendations/generate/', views.generate_career_recommendations, name='generate-recommendations'),
    
    # Career Goals
    path('goals/', views.CareerGoalListCreateView.as_view(), name='career-goals'),
    path('goals/<int:pk>/', views.CareerGoalDetailView.as_view(), name='career-goal-detail'),
    
    # Mentorship
    path('mentorship/', views.MentorshipRequestListCreateView.as_view(), name='mentorship-requests'),
    
    # Resources
    path('resources/', views.CareerResourceListView.as_view(), name='career-resources'),
    
    # Dashboard
    path('dashboard/stats/', views.career_dashboard_stats, name='career-dashboard-stats'),
]