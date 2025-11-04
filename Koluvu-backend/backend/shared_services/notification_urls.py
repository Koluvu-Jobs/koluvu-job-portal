from django.urls import path
from backend.shared_services.realtime_notifications import NotificationStreamView, send_notification

urlpatterns = [
    path('stream/', NotificationStreamView.as_view(), name='notification_stream'),
    path('send/', send_notification, name='send_notification'),
]