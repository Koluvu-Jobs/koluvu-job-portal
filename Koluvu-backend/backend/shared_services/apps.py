# shared_services/apps.py

from django.apps import AppConfig

class SharedServicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shared_services'
    verbose_name = 'Shared Services'

    def ready(self):
        # Import any signals or custom setup here
        pass