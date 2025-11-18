from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_list(request):
    """
    List all notifications for the authenticated user
    Query parameters:
    - unread_only: boolean (default: false)
    - notification_type: string (filter by type)
    - page: int (pagination)
    - page_size: int (items per page, max 100)
    """
    try:
        user = request.user
        
        # Base queryset
        queryset = Notification.objects.filter(recipient=user)
        
        # Filter by unread only
        unread_only = request.GET.get('unread_only', '').lower() == 'true'
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        # Filter by notification type
        notification_type = request.GET.get('notification_type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # Apply pagination
        paginator = NotificationPagination()
        page = paginator.paginate_queryset(queryset, request)
        
        if page is not None:
            serializer = NotificationSerializer(page, many=True)
            return paginator.get_paginated_response({
                'notifications': serializer.data,
                'unread_count': Notification.objects.filter(recipient=user, is_read=False).count()
            })
        
        # If no pagination requested
        serializer = NotificationSerializer(queryset, many=True)
        return Response({
            'notifications': serializer.data,
            'unread_count': Notification.objects.filter(recipient=user, is_read=False).count(),
            'total_count': queryset.count()
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch notifications: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark a specific notification as read"""
    try:
        notification = Notification.objects.get(
            id=notification_id, 
            recipient=request.user
        )
        notification.mark_as_read()
        
        return Response({
            'message': 'Notification marked as read',
            'notification_id': notification_id
        })
        
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to mark notification as read: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for the authenticated user"""
    try:
        updated_count = Notification.objects.filter(
            recipient=request.user, 
            is_read=False
        ).update(is_read=True, updated_at=timezone.now())
        
        return Response({
            'message': f'{updated_count} notifications marked as read',
            'updated_count': updated_count
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to mark all notifications as read: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    """Delete a specific notification"""
    try:
        notification = Notification.objects.get(
            id=notification_id, 
            recipient=request.user
        )
        notification.delete()
        
        return Response({
            'message': 'Notification deleted successfully',
            'notification_id': notification_id
        })
        
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to delete notification: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_all_notifications(request):
    """Clear all notifications for the authenticated user"""
    try:
        deleted_count, _ = Notification.objects.filter(
            recipient=request.user
        ).delete()
        
        return Response({
            'message': f'{deleted_count} notifications cleared',
            'deleted_count': deleted_count
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to clear notifications: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_stats(request):
    """Get notification statistics for the authenticated user"""
    try:
        user = request.user
        
        total_count = Notification.objects.filter(recipient=user).count()
        unread_count = Notification.objects.filter(recipient=user, is_read=False).count()
        
        # Count by type
        type_counts = {}
        for choice_value, choice_label in Notification.NOTIFICATION_TYPES:
            count = Notification.objects.filter(
                recipient=user, 
                notification_type=choice_value
            ).count()
            if count > 0:
                type_counts[choice_value] = count
        
        # Count by priority
        priority_counts = {}
        for choice_value, choice_label in Notification.PRIORITY_CHOICES:
            count = Notification.objects.filter(
                recipient=user, 
                priority=choice_value
            ).count()
            if count > 0:
                priority_counts[choice_value] = count
        
        return Response({
            'total_count': total_count,
            'unread_count': unread_count,
            'read_count': total_count - unread_count,
            'type_counts': type_counts,
            'priority_counts': priority_counts
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch notification stats: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_test_notification(request):
    """Create a test notification (for development/testing only)"""
    try:
        message = request.data.get('message', 'This is a test notification')
        notification_type = request.data.get('type', 'system')
        priority = request.data.get('priority', 'medium')
        
        notification = Notification.create_notification(
            recipient=request.user,
            message=message,
            notification_type=notification_type,
            priority=priority,
            sender_name='Test System',
            avatar='🧪'
        )
        
        serializer = NotificationSerializer(notification)
        return Response({
            'message': 'Test notification created',
            'notification': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to create test notification: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )