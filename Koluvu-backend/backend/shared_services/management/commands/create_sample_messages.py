# shared_services/management/commands/create_sample_messages.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shared_services.messaging import InboxMessage, InboxMessageThread
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Create sample messages for testing the real-time inbox'

    def handle(self, *args, **options):
        # Get or create some test users
        try:
            employer_user = User.objects.get(username='employer_test')
        except User.DoesNotExist:
            employer_user = User.objects.create_user(
                username='employer_test',
                email='employer@test.com',
                password='testpass123',
                first_name='John',
                last_name='Employer'
            )

        try:
            employee_user = User.objects.get(username='employee_test')
        except User.DoesNotExist:
            employee_user = User.objects.create_user(
                username='employee_test',
                email='employee@test.com',
                password='testpass123',
                first_name='Jane',
                last_name='Employee'
            )

        # Create sample messages
        sample_messages = [
            {
                'sender': employee_user,
                'recipient': employer_user,
                'subject': 'Application for Software Developer Position',
                'content': 'Hello, I am interested in the Software Developer position at your company. Could you please provide more details about the role and requirements?',
                'message_type': 'application'
            },
            {
                'sender': employer_user,
                'recipient': employee_user,
                'subject': 'Re: Application for Software Developer Position',
                'content': 'Thank you for your interest! We would like to schedule an interview with you. Are you available next week?',
                'message_type': 'interview'
            },
            {
                'sender': employee_user,
                'recipient': employer_user,
                'subject': 'Interview Availability',
                'content': 'Yes, I am available for the interview next week. Please let me know the preferred time and format.',
                'message_type': 'interview'
            },
            {
                'sender': employer_user,
                'recipient': employee_user,
                'subject': 'Interview Scheduled',
                'content': 'Great! Your interview is scheduled for Tuesday, 2:00 PM via video call. You will receive the meeting link shortly.',
                'message_type': 'interview'
            },
            {
                'sender': employee_user,
                'recipient': employer_user,
                'subject': 'Thank You',
                'content': 'Thank you for the opportunity. I look forward to our interview on Tuesday.',
                'message_type': 'general'
            }
        ]

        created_count = 0
        for msg_data in sample_messages:
            message = InboxMessage.objects.create(**msg_data)
            created_count += 1
            self.stdout.write(f"Created message: {message.subject}")

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} sample messages'
            )
        )

        # Mark some messages as read (randomly)
        all_messages = InboxMessage.objects.all()
        for message in random.sample(list(all_messages), k=min(2, len(all_messages))):
            message.mark_as_read()
            self.stdout.write(f"Marked as read: {message.subject}")

        self.stdout.write(
            self.style.SUCCESS(
                'Sample data creation completed!'
            )
        )