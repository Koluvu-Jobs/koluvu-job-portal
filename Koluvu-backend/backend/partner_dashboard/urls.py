from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.PartnerProfileView.as_view(), name='partner_profile'),
    path('dashboard/', views.PartnerDashboardView.as_view(), name='partner_dashboard'),
    path('dashboard-stats/', views.PartnerDashboardStatsView.as_view(), name='partner_dashboard_stats'),
]