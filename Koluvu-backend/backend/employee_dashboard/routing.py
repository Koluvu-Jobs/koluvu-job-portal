from django.urls import re_path
from .consumers import ResumeSyncConsumer

websocket_urlpatterns = [
    re_path(r'^ws/resume/(?P<resume_id>[^/]+)/$', ResumeSyncConsumer.as_asgi()),
]
