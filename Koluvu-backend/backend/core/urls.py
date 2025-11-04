from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from employer_dashboard.views import CompaniesListView
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    # Authentication
    path('api/auth/', include('authentication.urls')),
    # Legacy company endpoint
    path('api/companies/', CompaniesListView.as_view(), name='companies_list'),
    # User-specific dashboard APIs
    path('api/employer/', include('employer_dashboard.urls')),
    path('api/employee/', include('employee_dashboard.urls')),
    path('api/training/', include('training_dashboard.urls')),
    path('api/partner/', include('backend.partner_dashboard.urls')),
    # Shared Services APIs
    path('api/shared/ats/', include('backend.shared_services.ats.urls')),
    path('api/shared/courses/', include('backend.shared_services.courses.urls')),
    # Real-time notifications
    path('api/notifications/', include('backend.shared_services.notification_urls')),
    # Messaging system
    path('api/messages/', include('shared_services.messaging_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
