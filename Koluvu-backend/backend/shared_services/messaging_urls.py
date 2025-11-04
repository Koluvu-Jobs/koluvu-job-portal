# shared_services/messaging_urls.py

from django.urls import path
from . import messaging_views

urlpatterns = [
    path('inbox/', messaging_views.inbox_view, name='inbox'),
    path('send/', messaging_views.send_message, name='send_message'),
    path('<int:message_id>/read/', messaging_views.mark_message_read, name='mark_message_read'),
    path('conversation/<int:user_id>/', messaging_views.conversation_view, name='conversation'),
    path('stats/', messaging_views.message_stats, name='message_stats'),
]