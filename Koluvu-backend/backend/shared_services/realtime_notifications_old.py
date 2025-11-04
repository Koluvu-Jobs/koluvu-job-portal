import json
import asyncio
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

# Global dictionary to store active connections
# Format: {user_id: {connection_id: response_generator}}
active_connections = {}
connection_lock = threading.Lock()

class NotificationManager:
    """Manages real-time notifications across the application"""
    
    @staticmethod
    def add_connection(user_id, connection_id, response_generator):
        """Add a new SSE connection for a user"""
        with connection_lock:
            if user_id not in active_connections:
                active_connections[user_id] = {}
            active_connections[user_id][connection_id] = response_generator
            logger.info(f"Added connection {connection_id} for user {user_id}")
    
    @staticmethod
    def remove_connection(user_id, connection_id):
        """Remove an SSE connection for a user"""
        with connection_lock:
            if user_id in active_connections:
                active_connections[user_id].pop(connection_id, None)
                if not active_connections[user_id]:
                    del active_connections[user_id]
            logger.info(f"Removed connection {connection_id} for user {user_id}")
    
    @staticmethod
    def send_notification_to_user(user_id, notification_data):
        """Send notification to specific user across all their active connections"""
        with connection_lock:
            if user_id in active_connections:
                connections_to_remove = []
                for connection_id, response_gen in active_connections[user_id].items():
                    try:
                        # Send the notification
                        response_gen.send(notification_data)
                        logger.info(f"Sent notification to user {user_id}, connection {connection_id}")
                    except Exception as e:
                        logger.error(f"Failed to send notification to {connection_id}: {e}")
                        connections_to_remove.append(connection_id)
                
                # Clean up dead connections
                for conn_id in connections_to_remove:
                    active_connections[user_id].pop(conn_id, None)
    
    @staticmethod
    def broadcast_to_user_type(user_type, notification_data):
        """Broadcast notification to all users of a specific type (employee/employer)"""
        from employee_dashboard.models import EmployeeProfile
        from employer_dashboard.models import EmployerProfile
        
        try:
            if user_type == 'employee':
                user_ids = EmployeeProfile.objects.values_list('user_id', flat=True)
            elif user_type == 'employer':
                user_ids = EmployerProfile.objects.values_list('user_id', flat=True)
            else:
                logger.error(f"Invalid user type: {user_type}")
                return
            
            for user_id in user_ids:
                NotificationManager.send_notification_to_user(user_id, notification_data)
                
            logger.info(f"Broadcasted notification to all {user_type}s ({len(user_ids)} users)")
        except Exception as e:
            logger.error(f"Error broadcasting to {user_type}: {e}")

def generate_sse_response(user_id):
    """Generator function for Server-Sent Events"""
    import uuid
    connection_id = str(uuid.uuid4())
    
    def event_generator():
        try:
            # Send initial connection confirmation
            yield f"data: {json.dumps({'type': 'connection', 'message': 'Connected to notifications', 'timestamp': datetime.now().isoformat()})}\n\n"
            
            # Keep connection alive with heartbeat
            while True:
                try:
                    # Wait for notifications or send heartbeat every 30 seconds
                    time.sleep(30)
                    yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': datetime.now().isoformat()})}\n\n"
                except GeneratorExit:
                    break
                except Exception as e:
                    logger.error(f"Error in event generator: {e}")
                    break
        finally:
            NotificationManager.remove_connection(user_id, connection_id)
    
    # Store the generator
    generator = event_generator()
    NotificationManager.add_connection(user_id, connection_id, generator)
    
    return generator

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
        target_user_type = data.get('target_user_type')
        
        notification_data = {
            'id': f"notif_{int(time.time())}",
            'type': notification_type,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'from_user': {
                'id': request.user.id,
                'email': request.user.email,
                'name': f"{request.user.first_name} {request.user.last_name}".strip()
            }
        }
        
        if target_user_id:
            # Send to specific user
            NotificationManager.send_notification_to_user(int(target_user_id), notification_data)
            return Response({'message': f'Notification sent to user {target_user_id}'})
        elif target_user_type:
            # Broadcast to user type
            NotificationManager.broadcast_to_user_type(target_user_type, notification_data)
            return Response({'message': f'Notification broadcasted to all {target_user_type}s'})
        else:
            return Response({'error': 'target_user_id or target_user_type required'}, status=400)
            
    except Exception as e:
        logger.error(f"Error sending notification: {e}")
        return Response({'error': str(e)}, status=500)

# Job posting notification handler
def notify_job_posted(job_instance):
    """Send notification to all employees when a new job is posted"""
    try:
        notification_data = {
            'id': f"job_{job_instance.id}_{int(time.time())}",
            'type': 'new_job',
            'message': f"New job posted: {job_instance.title}",
            'job_data': {
                'id': job_instance.id,
                'title': job_instance.title,
                'company': job_instance.company.company_name if hasattr(job_instance, 'company') else 'Unknown Company',
                'location': getattr(job_instance, 'location', 'Not specified'),
                'job_type': getattr(job_instance, 'job_type', 'Not specified'),
            },
            'timestamp': datetime.now().isoformat(),
        }
        
        # Broadcast to all employees
        NotificationManager.broadcast_to_user_type('employee', notification_data)
        logger.info(f"Job notification sent for job: {job_instance.title}")
        
    except Exception as e:
        logger.error(f"Error sending job notification: {e}")

# Application notification handler  
def notify_job_application(application_instance):
    """Send notification to employer when someone applies to their job"""
    try:
        notification_data = {
            'id': f"app_{application_instance.id}_{int(time.time())}",
            'type': 'new_application',
            'message': f"New application received for {application_instance.job.title}",
            'application_data': {
                'id': application_instance.id,
                'job_title': application_instance.job.title,
                'applicant_name': f"{application_instance.employee.user.first_name} {application_instance.employee.user.last_name}".strip(),
                'applicant_email': application_instance.employee.user.email,
            },
            'timestamp': datetime.now().isoformat(),
        }
        
        # Send to job poster (employer)
        employer_user_id = application_instance.job.posted_by.user.id
        NotificationManager.send_notification_to_user(employer_user_id, notification_data)
        logger.info(f"Application notification sent to employer {employer_user_id}")
        
    except Exception as e:
        logger.error(f"Error sending application notification: {e}")