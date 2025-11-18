from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async

from .models import Resume
from .serializers import ResumeBuilderSerializer


class ResumeSyncConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer to sync resume edits across clients in the same resume room.

    Protocol:
    - Client connects to: ws(s)://<host>/ws/resume/<resume_id>/?token=<jwt>
    - On connect server sends a `init` message with current resume data.
    - Client sends `update` messages with {"type": "update", "data": {...resume fields...} }
    - Server applies update (saves resume) and broadcasts `update` to group.
    """

    async def connect(self):
        self.resume_id = self.scope['url_route']['kwargs'].get('resume_id')
        self.room_group_name = f'resume_{self.resume_id}'

        # Accept the connection
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send current resume data
        resume = await sync_to_async(self._get_resume)()
        if resume:
            serializer = ResumeBuilderSerializer(resume, context={'request': None})
            await self.send_json({'type': 'init', 'data': serializer.data})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        try:
            payload = json.loads(text_data)
        except Exception:
            return

        msg_type = payload.get('type')
        data = payload.get('data')

        if msg_type == 'update' and isinstance(data, dict):
            # Save resume on server and broadcast to others
            resume = await sync_to_async(self._update_resume)(data)
            if resume:
                serializer = ResumeBuilderSerializer(resume, context={'request': None})
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'broadcast_update',
                        'data': serializer.data,
                    }
                )

    async def broadcast_update(self, event):
        # Forward update to WebSocket client
        await self.send_json({'type': 'update', 'data': event.get('data')})

    def _get_resume(self):
        try:
            return Resume.objects.get(id=self.resume_id)
        except Resume.DoesNotExist:
            return None

    def _update_resume(self, data):
        try:
            resume = Resume.objects.get(id=self.resume_id)
            # Only update allowed builder fields
            allowed = [
                'title', 'template', 'status', 'personal_info', 'education_data',
                'experience_data', 'skills_data', 'projects_data', 'certifications_data',
                'languages_data', 'custom_sections', 'color_scheme', 'font_family',
                'font_size', 'page_margins'
            ]
            for k in allowed:
                if k in data:
                    setattr(resume, k, data[k])
            resume.save()
            return resume
        except Resume.DoesNotExist:
            return None
