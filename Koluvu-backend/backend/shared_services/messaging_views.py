# shared_services/messaging_views.py

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q, Count, Max
from django.utils import timezone
from .messaging import InboxMessage, InboxMessageThread
import json

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def inbox_view(request):
    """Get inbox data for the authenticated user"""
    try:
        user = request.user
        
        # Get all messages for the user (both sent and received)
        received_messages = InboxMessage.objects.filter(recipient=user).order_by('-timestamp')
        
        # Count unread messages
        unread_count = received_messages.filter(read=False).count()
        
        # Get recent messages with sender info
        recent_messages = []
        for message in received_messages[:10]:  # Get latest 10 messages
            recent_messages.append({
                'id': message.id,
                'sender_name': f"{message.sender.first_name} {message.sender.last_name}".strip() or message.sender.username,
                'sender_email': message.sender.email,
                'subject': message.subject,
                'preview': message.preview,
                'timestamp': message.timestamp.isoformat(),
                'read': message.read,
                'message_type': message.message_type,
                'job_id': message.job_id,
                'application_id': message.application_id,
            })
        
        return Response({
            'unread_count': unread_count,
            'total_messages': received_messages.count(),
            'messages': recent_messages,
            'status': 'success'
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def send_message(request):
    """Send a new message"""
    try:
        data = request.data
        sender = request.user
        
        # Get recipient
        recipient_id = data.get('recipient_id')
        recipient_username = data.get('recipient_username')
        recipient_email = data.get('recipient_email')
        
        recipient = None
        if recipient_id:
            recipient = User.objects.get(id=recipient_id)
        elif recipient_username:
            recipient = User.objects.get(username=recipient_username)
        elif recipient_email:
            recipient = User.objects.get(email=recipient_email)
        else:
            return Response({
                'error': 'Recipient not specified',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create message
        message = InboxMessage.objects.create(
            sender=sender,
            recipient=recipient,
            subject=data.get('subject', ''),
            content=data.get('content', ''),
            message_type=data.get('message_type', 'general'),
            job_id=data.get('job_id'),
            application_id=data.get('application_id')
        )
        
        return Response({
            'message_id': message.id,
            'status': 'success',
            'message': 'Message sent successfully'
        })
        
    except User.DoesNotExist:
        return Response({
            'error': 'Recipient not found',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def mark_message_read(request, message_id):
    """Mark a message as read"""
    try:
        message = InboxMessage.objects.get(id=message_id, recipient=request.user)
        message.mark_as_read()
        
        return Response({
            'status': 'success',
            'message': 'Message marked as read'
        })
        
    except InboxMessage.DoesNotExist:
        return Response({
            'error': 'Message not found',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def conversation_view(request, user_id):
    """Get conversation between current user and another user"""
    try:
        current_user = request.user
        other_user = User.objects.get(id=user_id)
        
        # Get messages between the two users
        messages = InboxMessage.objects.filter(
            Q(sender=current_user, recipient=other_user) |
            Q(sender=other_user, recipient=current_user)
        ).order_by('timestamp')
        
        conversation = []
        for message in messages:
            conversation.append({
                'id': message.id,
                'sender_id': message.sender.id,
                'sender_name': f"{message.sender.first_name} {message.sender.last_name}".strip() or message.sender.username,
                'content': message.content,
                'timestamp': message.timestamp.isoformat(),
                'read': message.read,
                'is_own_message': message.sender == current_user
            })
        
        # Mark messages from other user as read
        InboxMessage.objects.filter(
            sender=other_user, 
            recipient=current_user, 
            read=False
        ).update(read=True, read_at=timezone.now())
        
        return Response({
            'conversation': conversation,
            'other_user': {
                'id': other_user.id,
                'name': f"{other_user.first_name} {other_user.last_name}".strip() or other_user.username,
                'email': other_user.email
            },
            'status': 'success'
        })
        
    except User.DoesNotExist:
        return Response({
            'error': 'User not found',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def message_stats(request):
    """Get messaging statistics for the user"""
    try:
        user = request.user
        
        # Get various stats
        total_sent = InboxMessage.objects.filter(sender=user).count()
        total_received = InboxMessage.objects.filter(recipient=user).count()
        unread_count = InboxMessage.objects.filter(recipient=user, read=False).count()
        
        # Get unique conversation partners
        sent_to = InboxMessage.objects.filter(sender=user).values_list('recipient', flat=True).distinct()
        received_from = InboxMessage.objects.filter(recipient=user).values_list('sender', flat=True).distinct()
        all_partners = set(list(sent_to) + list(received_from))
        
        return Response({
            'total_sent': total_sent,
            'total_received': total_received,
            'unread_count': unread_count,
            'conversation_partners': len(all_partners),
            'status': 'success'
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)