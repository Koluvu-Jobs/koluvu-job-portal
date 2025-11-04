from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from employer_dashboard.models import (
    EmployerProfile, Candidate, Interviewer, Interview, 
    InterviewFeedback, FeedbackTemplate, Job
)
import random


class Command(BaseCommand):
    help = 'Create sample data for interview feedback system'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample feedback data...')
        
        try:
            # Get or create employer
            employer_user, created = User.objects.get_or_create(
                username='feedback_employer',
                defaults={
                    'email': 'feedback@koluvu.com',
                    'first_name': 'Feedback',
                    'last_name': 'Manager'
                }
            )
            
            employer_profile, created = EmployerProfile.objects.get_or_create(
                user=employer_user,
                defaults={
                    'company_name': 'TechCorp Solutions',
                    'phone': '+91-9876543210',
                    'company_location': 'Bangalore, Karnataka',
                    'contact_person': 'Feedback Manager',
                    'designation': 'HR Director',
                    'total_employees': 250,
                    'industry_type': 'Technology',
                    'is_verified': True
                }
            )
            
            # Create sample job if not exists
            job, created = Job.objects.get_or_create(
                title='Senior Python Developer',
                employer=employer_profile,
                defaults={
                    'job_type': 'Full-time',
                    'designation': 'Senior Developer',
                    'department': 'Engineering',
                    'location': 'Bangalore',
                    'employment_type': 'permanent',
                    'experience_min': 3,
                    'experience_max': 7,
                    'salary_min': 800000,
                    'salary_max': 1500000,
                    'description': 'Senior Python Developer with Django experience',
                    'status': 'active'
                }
            )
            
            # Create sample candidates
            candidates = []
            candidate_data = [
                ('Rajesh Kumar', 'rajesh.kumar@email.com', '+91-9123456789'),
                ('Priya Sharma', 'priya.sharma@email.com', '+91-9234567890'),
                ('Arjun Patel', 'arjun.patel@email.com', '+91-9345678901'),
                ('Sneha Reddy', 'sneha.reddy@email.com', '+91-9456789012'),
                ('Vikram Singh', 'vikram.singh@email.com', '+91-9567890123'),
            ]
            
            for name, email, phone in candidate_data:
                candidate, created = Candidate.objects.get_or_create(
                    email=email,
                    employer=employer_profile,
                    defaults={
                        'name': name,
                        'phone': phone,
                        'current_position': 'Software Developer',
                        'experience_years': random.randint(2, 8),
                        'skills': 'Python, Django, REST API, PostgreSQL, Git'
                    }
                )
                candidates.append(candidate)
            
            # Create sample interviewers
            interviewers = []
            interviewer_data = [
                ('Dr. Amit Gupta', 'amit.gupta@techcorp.com', 'Tech Lead', 'Engineering'),
                ('Sarah Johnson', 'sarah.johnson@techcorp.com', 'Senior Manager', 'HR'),
                ('Ravi Krishnan', 'ravi.krishnan@techcorp.com', 'Principal Engineer', 'Engineering'),
                ('Lisa Chen', 'lisa.chen@techcorp.com', 'VP Engineering', 'Engineering'),
            ]
            
            for name, email, designation, department in interviewer_data:
                interviewer, created = Interviewer.objects.get_or_create(
                    email=email,
                    employer=employer_profile,
                    defaults={
                        'name': name,
                        'designation': designation,
                        'department': department,
                        'phone': f'+91-9{random.randint(100000000, 999999999)}',
                        'is_active': True
                    }
                )
                interviewers.append(interviewer)
            
            # Create sample interviews
            interviews = []
            for i, candidate in enumerate(candidates):
                interview_date = timezone.now().date() - timedelta(days=random.randint(1, 30))
                interview_time = timezone.now().time().replace(
                    hour=random.randint(9, 17),
                    minute=random.choice([0, 30]),
                    second=0,
                    microsecond=0
                )
                
                interview, created = Interview.objects.get_or_create(
                    title=f'Interview - {candidate.name}',
                    candidate=candidate,
                    employer=employer_profile,
                    defaults={
                        'description': f'Technical interview for {job.title} position',
                        'interview_type': random.choice(['technical', 'hr', 'managerial']),
                        'status': random.choice(['completed', 'scheduled', 'cancelled']),
                        'job_position': job,
                        'interview_date': interview_date,
                        'interview_time': interview_time,
                        'duration': 60,  # in minutes
                        'location': 'Conference Room A',
                        'timezone': 'Asia/Kolkata'
                    }
                )
                
                # Add interviewers to interview
                interview.interviewers.add(random.choice(interviewers))
                if random.choice([True, False]):
                    interview.interviewers.add(random.choice(interviewers))
                
                interviews.append(interview)
            
            # Create sample feedback
            feedback_status_choices = ['selected', 'rejected', 'hold', 'shortlisted', 'next_round']
            
            for interview in interviews:
                for interviewer in interview.interviewers.all():
                    # Skip some feedback to simulate pending ones
                    if random.choice([True, True, True, False]):  # 75% chance of having feedback
                        status = random.choice(feedback_status_choices)
                        is_submitted = random.choice([True, True, False])  # 67% submitted
                        
                        feedback, created = InterviewFeedback.objects.get_or_create(
                            interview=interview,
                            interviewer=interviewer,
                            employer=employer_profile,
                            defaults={
                                'candidate': interview.candidate,
                                'candidate_name': interview.candidate.name,
                                'position_applied': interview.job_position.title,
                                'department': interview.job_position.department,
                                'interview_date': interview.interview_date,
                                'interview_duration': timedelta(minutes=interview.duration),
                                'interview_status': status,
                                'skills_assessment': self.generate_skills_feedback(status),
                                'behavior_assessment': self.generate_behavior_feedback(status),
                                'technical_skills': self.generate_technical_feedback(status),
                                'overall_rating': random.randint(2, 5) if status != 'rejected' else random.randint(1, 3),
                                'skills_rating': random.randint(2, 5),
                                'communication_rating': random.randint(2, 5),
                                'technical_rating': random.randint(2, 5),
                                'culture_fit_rating': random.randint(2, 5),
                                'strengths': self.generate_strengths(status),
                                'weaknesses': self.generate_weaknesses(),
                                'decision_rationale': self.generate_decision_rationale(status),
                                'is_submitted': is_submitted,
                                'submitted_at': timezone.now() - timedelta(days=random.randint(0, 10)) if is_submitted else None,
                                'offered_salary': random.randint(900000, 1600000) if status == 'selected' else None,
                                'joining_date': (timezone.now().date() + timedelta(days=random.randint(15, 45))) if status == 'selected' else None
                            }
                        )
            
            # Create sample feedback templates
            templates = [
                {
                    'name': 'Technical Interview Template',
                    'description': 'Standard template for technical interviews',
                    'template_data': {
                        'sections': [
                            {'name': 'Technical Skills', 'weight': 40},
                            {'name': 'Problem Solving', 'weight': 30},
                            {'name': 'Communication', 'weight': 20},
                            {'name': 'Cultural Fit', 'weight': 10}
                        ],
                        'rating_scale': 5,
                        'required_fields': ['technical_skills', 'skills_assessment', 'interview_status']
                    },
                    'is_default': True
                },
                {
                    'name': 'HR Interview Template',
                    'description': 'Template for HR and behavioral interviews',
                    'template_data': {
                        'sections': [
                            {'name': 'Communication Skills', 'weight': 35},
                            {'name': 'Cultural Fit', 'weight': 30},
                            {'name': 'Motivation', 'weight': 20},
                            {'name': 'Experience Relevance', 'weight': 15}
                        ],
                        'rating_scale': 5,
                        'required_fields': ['behavior_assessment', 'interview_status']
                    },
                    'is_default': False
                }
            ]
            
            for template_data in templates:
                template, created = FeedbackTemplate.objects.get_or_create(
                    name=template_data['name'],
                    employer=employer_profile,
                    defaults=template_data
                )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created sample feedback data:\n'
                    f'- {len(candidates)} candidates\n'
                    f'- {len(interviewers)} interviewers\n'
                    f'- {len(interviews)} interviews\n'
                    f'- {InterviewFeedback.objects.filter(employer=employer_profile).count()} feedback entries\n'
                    f'- {len(templates)} feedback templates'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating sample data: {str(e)}')
            )

    def generate_skills_feedback(self, status):
        positive_feedback = [
            "Excellent technical skills with strong programming fundamentals. Demonstrated good understanding of Python and Django framework.",
            "Strong analytical thinking and problem-solving abilities. Shows good coding practices and clean code structure.",
            "Good technical knowledge with practical experience. Able to explain complex concepts clearly.",
            "Solid foundation in software development. Shows enthusiasm for learning new technologies."
        ]
        
        negative_feedback = [
            "Basic technical skills but needs improvement in advanced concepts. Limited experience with frameworks.",
            "Adequate programming knowledge but struggles with complex problem-solving scenarios.",
            "Has fundamental knowledge but lacks depth in practical application."
        ]
        
        if status in ['selected', 'shortlisted', 'next_round']:
            return random.choice(positive_feedback)
        elif status == 'rejected':
            return random.choice(negative_feedback)
        else:  # hold
            return "Good technical background with some areas for improvement. Mixed performance in technical assessment."

    def generate_behavior_feedback(self, status):
        positive_feedback = [
            "Excellent communication skills and professional demeanor. Shows good teamwork attitude and cultural alignment.",
            "Strong interpersonal skills with good emotional intelligence. Demonstrates leadership potential.",
            "Good communication abilities and positive attitude. Shows enthusiasm and motivation for the role.",
            "Professional approach with good listening skills. Demonstrates flexibility and adaptability."
        ]
        
        negative_feedback = [
            "Communication skills need improvement. Limited clarity in expressing ideas and concepts.",
            "Adequate interpersonal skills but lacks confidence in presentation. Needs improvement in articulation.",
            "Basic communication abilities but struggles with complex discussions."
        ]
        
        if status in ['selected', 'shortlisted', 'next_round']:
            return random.choice(positive_feedback)
        elif status == 'rejected':
            return random.choice(negative_feedback)
        else:  # hold
            return "Good communication skills overall with some areas for development. Shows potential with proper guidance."

    def generate_technical_feedback(self, status):
        positive_feedback = [
            "Strong technical expertise in Python, Django, and web development. Good understanding of REST APIs and database design.",
            "Excellent coding skills with good knowledge of software engineering principles. Familiar with modern development practices.",
            "Good technical proficiency with hands-on experience in relevant technologies. Shows good debugging and problem-solving skills.",
            "Solid technical foundation with practical project experience. Demonstrates good understanding of system architecture."
        ]
        
        negative_feedback = [
            "Limited technical depth in required technologies. Needs significant training and development.",
            "Basic technical knowledge but lacks practical experience with our technology stack.",
            "Adequate technical skills but not sufficient for the current role requirements."
        ]
        
        if status in ['selected', 'shortlisted', 'next_round']:
            return random.choice(positive_feedback)
        elif status == 'rejected':
            return random.choice(negative_feedback)
        else:  # hold
            return "Good technical foundation with some gaps in advanced concepts. Has potential with additional training."

    def generate_strengths(self, status):
        strengths_list = [
            "Strong analytical thinking, good communication skills, team player",
            "Technical expertise, problem-solving abilities, learning agility", 
            "Leadership potential, technical depth, professional attitude",
            "Innovation mindset, collaboration skills, technical proficiency",
            "Strong foundation, adaptability, good work ethic"
        ]
        return random.choice(strengths_list)

    def generate_weaknesses(self):
        weaknesses_list = [
            "Could improve presentation skills and confidence in technical discussions",
            "Needs more experience with advanced frameworks and architectural patterns",
            "Could work on time management and project estimation skills",
            "Needs improvement in documentation and code review practices",
            "Could enhance leadership and mentoring capabilities"
        ]
        return random.choice(weaknesses_list)

    def generate_decision_rationale(self, status):
        rationales = {
            'selected': [
                "Strong technical skills combined with good cultural fit. Recommended for hire.",
                "Excellent candidate with all required skills and positive attitude. Strong hire recommendation.",
                "Good technical competency and team fit. Will be valuable addition to the team."
            ],
            'rejected': [
                "Technical skills do not meet current role requirements. Needs more experience.",
                "Limited technical depth and communication issues. Not suitable for this position.",
                "Inadequate technical knowledge for senior level position."
            ],
            'hold': [
                "Good potential but needs some skill development. Consider for future opportunities.",
                "Mixed performance with both strengths and areas for improvement."
            ],
            'shortlisted': [
                "Good candidate for next round of interviews. Shows strong potential.",
                "Technical skills are adequate, proceed with final round interview."
            ],
            'next_round': [
                "Passed technical round, recommended for managerial interview.",
                "Good technical fit, proceed with cultural fit assessment."
            ]
        }
        return random.choice(rationales.get(status, ["Standard feedback for interview."]))