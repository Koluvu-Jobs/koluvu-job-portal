import json
import queue
from datetime import datetime
from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging
import threading
import time

logger = logging.getLogger(__name__)

# Global dictionary to store notification queues for each user
# Format: {user_id: queue.Queue()}
user_notification_queues = {}
queue_lock = threading.Lock()

class NotificationManager:
    """Manages real-time notifications using queues"""
    
    @staticmethod
    def get_or_create_queue(user_id):
        """Get or create notification queue for user"""
        with queue_lock:
            if user_id not in user_notification_queues:
                user_notification_queues[user_id] = queue.Queue(maxsize=100)
            return user_notification_queues[user_id]
    
    @staticmethod
    def send_notification_to_user(user_id, notification_data):
        """Send notification to specific user by adding to their queue"""
        try:
            notification_queue = NotificationManager.get_or_create_queue(user_id)
            notification_queue.put(notification_data, block=False)
            logger.info(f"Sent notification to user {user_id}: {notification_data.get('message', 'No message')}")
        except queue.Full:
            logger.warning(f"Notification queue full for user {user_id}")
        except Exception as e:
            logger.error(f"Error sending notification to user {user_id}: {e}")
    
    @staticmethod
    def broadcast_to_user_type(user_type, notification_data):
        """Broadcast notification to all users of a specific type"""
        try:
            from employee_dashboard.models import EmployeeProfile
            from employer_dashboard.models import EmployerProfile
            
            if user_type == 'employee':
                user_ids = EmployeeProfile.objects.values_list('user_id', flat=True)
            elif user_type == 'employer':
                user_ids = EmployerProfile.objects.values_list('user_id', flat=True)
            else:
                logger.error(f"Invalid user type: {user_type}")
                return
            
            logger.info(f"Broadcasting to {len(user_ids)} {user_type}s: {notification_data.get('message', 'No message')}")
            
            for user_id in user_ids:
                NotificationManager.send_notification_to_user(user_id, notification_data)
                
        except Exception as e:
            logger.error(f"Error broadcasting to {user_type}: {e}")

    @staticmethod
    def notify_job_posted(job_instance):
        """Send job posting notification to all employees"""
        try:
            # Get company name from employer profile
            company_name = "Unknown Company"
            if hasattr(job_instance, 'employer') and job_instance.employer:
                company_name = getattr(job_instance.employer, 'company_name', 'Unknown Company')
            
            notification_data = {
                'id': f"job_{job_instance.id}_{int(time.time())}",
                'type': 'new_job',
                'message': f"🎯 New job opportunity: {job_instance.title} at {company_name}",
                'job_data': {
                    'id': job_instance.id,
                    'title': job_instance.title,
                    'company': company_name,
                    'location': getattr(job_instance, 'location', 'Not specified'),
                    'job_type': getattr(job_instance, 'job_type', 'Not specified'),
                    'employment_type': getattr(job_instance, 'employment_type', 'Not specified'),
                },
                'timestamp': datetime.now().isoformat(),
                'action_url': f'/jobs/{job_instance.id}'
            }
            
            # Broadcast to all employees
            NotificationManager.broadcast_to_user_type('employee', notification_data)
            logger.info(f"Job notification broadcasted for: {job_instance.title}")
            
        except Exception as e:
            logger.error(f"Error in notify_job_posted: {e}")

    @staticmethod
    def broadcast_settings_update(user_id, settings_data):
        """Broadcast settings update to specific user"""
        try:
            notification_data = {
                'id': f"settings_{user_id}_{int(time.time())}",
                'type': 'settings_update',
                'message': 'Your settings have been updated',
                'settings_data': settings_data,
                'timestamp': datetime.now().isoformat(),
            }
            
            NotificationManager.send_notification_to_user(user_id, notification_data)
            logger.info(f"Settings update notification sent to user {user_id}")
            
        except Exception as e:
            logger.error(f"Error in broadcast_settings_update: {e}")

def generate_sse_response(user_id):
    """Generate Server-Sent Events stream for a user"""
    def event_stream():
        notification_queue = NotificationManager.get_or_create_queue(user_id)
        
        # Send initial connection confirmation
        yield f"data: {json.dumps({'type': 'connection', 'message': 'Connected to notifications', 'timestamp': datetime.now().isoformat()})}\n\n"
        
        while True:
            try:
                # Try to get notification from queue (with timeout for heartbeat)
                try:
                    notification = notification_queue.get(timeout=30)  # 30 second timeout
                    yield f"data: {json.dumps(notification)}\n\n"
                except queue.Empty:
                    # Send heartbeat to keep connection alive
                    yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': datetime.now().isoformat()})}\n\n"
                    
            except Exception as e:
                logger.error(f"Error in SSE stream for user {user_id}: {e}")
                break
    
    return event_stream()


# Compatibility wrapper for older callers that expect `broadcast_to_user`
def broadcast_to_user(user_id, notification_data):
    """Backwards-compatible function name used by signal handlers.

    Historically other modules imported `broadcast_to_user` from this
    module. Internally we use NotificationManager; expose a thin wrapper
    to avoid ImportError when older code imports the name.
    """
    try:
        NotificationManager.send_notification_to_user(user_id, notification_data)
    except Exception as e:
        logger.error(f"Error in broadcast_to_user wrapper for user {user_id}: {e}")

@method_decorator(csrf_exempt, name='dispatch')
class NotificationStreamView(View):
    """Server-Sent Events endpoint for real-time notifications"""
    
    def get(self, request):
        # Extract user from JWT token (either from header or query parameter)
        user = None
        token = None
        
        # Try to get token from query parameter (for SSE connections)
        token = request.GET.get('token')
        if not token:
            # Try to get from Authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        if token:
            try:
                from rest_framework_simplejwt.tokens import AccessToken
                from django.contrib.auth import get_user_model
                
                # Validate and decode the token
                access_token = AccessToken(token)
                User = get_user_model()
                user = User.objects.get(id=access_token['user_id'])
                logger.info(f"SSE connection authenticated for user: {user.email}")
            except Exception as e:
                logger.error(f"Token validation failed: {e}")
                return StreamingHttpResponse(
                    "data: {\"error\": \"Invalid token\"}\n\n",
                    content_type="text/plain",
                    status=401
                )
        else:
            # Fallback to request.user if available
            user = request.user
        
        if not user or not user.is_authenticated:
            return StreamingHttpResponse(
                "data: {\"error\": \"Authentication required\"}\n\n",
                content_type="text/plain",
                status=401
            )
        
        response = StreamingHttpResponse(
            generate_sse_response(user.id),
            content_type="text/event-stream"
        )
        response['Cache-Control'] = 'no-cache'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Headers'] = 'Cache-Control'
        
        return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request):
    """API endpoint to send notifications"""
    try:
        data = request.data
        notification_type = data.get('type')
        message = data.get('message')
        target_user_id = data.get('target_user_id')
        
        if not message:
            return Response({'error': 'Message is required'}, status=400)
        
        notification_data = {
            'id': f"manual_{int(time.time())}",
            'type': notification_type or 'info',
            'message': message,
            'timestamp': datetime.now().isoformat(),
        }
        
        if target_user_id:
            NotificationManager.send_notification_to_user(target_user_id, notification_data)
        else:
            # Broadcast to all employees by default
            NotificationManager.broadcast_to_user_type('employee', notification_data)
        
        return Response({'message': 'Notification sent successfully'})
        
    except Exception as e:
        logger.error(f"Error sending notification: {e}")
        return Response({'error': str(e)}, status=500)