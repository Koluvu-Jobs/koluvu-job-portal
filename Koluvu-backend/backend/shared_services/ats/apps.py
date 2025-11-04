from django.apps import AppConfig


class AtsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.shared_services.ats'
    verbose_name = 'ATS (Applicant Tracking System)'