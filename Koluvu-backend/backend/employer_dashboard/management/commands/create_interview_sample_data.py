from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employer_dashboard.models import EmployerProfile, Job, Candidate, Interviewer, Interview
from datetime import date, time, timedelta


class Command(BaseCommand):
    help = 'Create sample data for interview scheduler'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample interview scheduler data...'))

        # Get or create employer user
        employer_user, created = User.objects.get_or_create(
            username='employer_demo',
            defaults={
                'email': 'employer@demo.com',
                'first_name': 'Demo',
                'last_name': 'Employer'
            }
        )
        if created:
            employer_user.set_password('demo123')
            employer_user.save()

        # Get or create employer profile
        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=employer_user,
            defaults={
                'company_name': 'TechCorp Solutions',
                'industry_type': 'Technology',
                'company_size': '50-100',
                'website': 'https://techcorp.com',
                'phone': '+91-9876543210',
                'company_location': 'Bangalore, Karnataka, India',
                'contact_person': 'Rahul Mehta',
                'designation': 'HR Manager',
                'total_employees': 75,
                'is_verified': True
            }
        )

        # Create sample jobs if they don't exist
        job1, created = Job.objects.get_or_create(
            title='Senior Frontend Developer',
            employer=employer_profile,
            defaults={
                'job_type': 'Full-time',
                'designation': 'Senior Frontend Developer',
                'department': 'Engineering',
                'industry': 'Technology',
                'location': 'Bangalore',
                'employment_type': 'Hybrid',
                'experience_min': 3,
                'experience_max': 6,
                'education': 'Bachelor\'s in Computer Science',
                'salary_min': 800000,
                'salary_max': 1200000,
                'description': 'Looking for an experienced frontend developer...',
                'requirements': 'React, TypeScript, 3+ years experience',
                'status': 'active'
            }
        )

        job2, created = Job.objects.get_or_create(
            title='Backend Developer',
            employer=employer_profile,
            defaults={
                'job_type': 'Full-time',
                'designation': 'Backend Developer',
                'department': 'Engineering',
                'industry': 'Technology',
                'location': 'Bangalore',
                'employment_type': 'Remote',
                'experience_min': 2,
                'experience_max': 4,
                'education': 'Bachelor\'s in Computer Science',
                'salary_min': 700000,
                'salary_max': 1000000,
                'description': 'Backend developer with Python/Django experience...',
                'requirements': 'Python, Django, APIs, 2+ years experience',
                'status': 'active'
            }
        )

        # Create sample candidates
        candidates_data = [
            {
                'name': 'Amit Sharma',
                'email': 'amit.sharma@email.com',
                'phone': '+91-9876543211',
                'current_position': 'Frontend Developer',
                'experience_years': 4,
                'skills': 'React, JavaScript, TypeScript, CSS'
            },
            {
                'name': 'Priya Patel',
                'email': 'priya.patel@email.com',
                'phone': '+91-9876543212',
                'current_position': 'UX Designer',
                'experience_years': 3,
                'skills': 'UI/UX Design, Figma, Adobe XD'
            },
            {
                'name': 'Rajiv Verma',
                'email': 'rajiv.verma@email.com',
                'phone': '+91-9876543213',
                'current_position': 'DevOps Engineer',
                'experience_years': 5,
                'skills': 'AWS, Docker, Kubernetes, CI/CD'
            },
            {
                'name': 'Sneha Gupta',
                'email': 'sneha.gupta@email.com',
                'phone': '+91-9876543214',
                'current_position': 'Product Manager',
                'experience_years': 6,
                'skills': 'Product Strategy, Agile, Roadmapping'
            },
            {
                'name': 'Vikram Singh',
                'email': 'vikram.singh@email.com',
                'phone': '+91-9876543215',
                'current_position': 'Backend Developer',
                'experience_years': 3,
                'skills': 'Python, Django, PostgreSQL, APIs'
            }
        ]

        candidates = []
        for candidate_data in candidates_data:
            candidate, created = Candidate.objects.get_or_create(
                email=candidate_data['email'],
                employer=employer_profile,
                defaults=candidate_data
            )
            candidates.append(candidate)

        # Create sample interviewers
        interviewers_data = [
            {
                'name': 'Rahul Mehta',
                'email': 'rahul.mehta@techcorp.com',
                'designation': 'CTO',
                'department': 'Engineering',
                'phone': '+91-9876543220'
            },
            {
                'name': 'Anita Desai',
                'email': 'anita.desai@techcorp.com',
                'designation': 'HR Manager',
                'department': 'Human Resources',
                'phone': '+91-9876543221'
            },
            {
                'name': 'Suresh Kumar',
                'email': 'suresh.kumar@techcorp.com',
                'designation': 'Tech Lead',
                'department': 'Engineering',
                'phone': '+91-9876543222'
            },
            {
                'name': 'Neha Sharma',
                'email': 'neha.sharma@techcorp.com',
                'designation': 'Senior Developer',
                'department': 'Engineering',
                'phone': '+91-9876543223'
            },
            {
                'name': 'Vijay Reddy',
                'email': 'vijay.reddy@techcorp.com',
                'designation': 'Product Director',
                'department': 'Product',
                'phone': '+91-9876543224'
            }
        ]

        interviewers = []
        for interviewer_data in interviewers_data:
            interviewer, created = Interviewer.objects.get_or_create(
                email=interviewer_data['email'],
                employer=employer_profile,
                defaults=interviewer_data
            )
            interviewers.append(interviewer)

        # Create sample interviews
        today = date.today()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)

        interviews_data = [
            {
                'title': 'Technical Interview - Frontend Developer',
                'description': 'Technical round focusing on React and JavaScript concepts',
                'interview_type': 'video',
                'status': 'in_progress',
                'candidate': candidates[0],  # Amit Sharma
                'job_position': job1,
                'interview_date': today,
                'interview_time': time(11, 0),
                'duration': 60,
                'location': 'Online Meeting',
                'meeting_link': 'https://meet.koluvu.com/interview/abc123'
            },
            {
                'title': 'HR Interview - Backend Developer',
                'description': 'Initial HR screening and culture fit assessment',
                'interview_type': 'phone',
                'status': 'scheduled',
                'candidate': candidates[4],  # Vikram Singh
                'job_position': job2,
                'interview_date': tomorrow,
                'interview_time': time(14, 0),
                'duration': 45,
                'location': 'Phone Call'
            },
            {
                'title': 'Final Round - Product Manager',
                'description': 'Final interview with leadership team',
                'interview_type': 'inperson',
                'status': 'scheduled',
                'candidate': candidates[3],  # Sneha Gupta
                'job_position': job1,
                'interview_date': next_week,
                'interview_time': time(10, 30),
                'duration': 90,
                'location': 'TechCorp Office, Conference Room A'
            }
        ]

        for interview_data in interviews_data:
            interview, created = Interview.objects.get_or_create(
                title=interview_data['title'],
                candidate=interview_data['candidate'],
                job_position=interview_data['job_position'],
                employer=employer_profile,
                defaults={k: v for k, v in interview_data.items() if k not in ['title', 'candidate', 'job_position']}
            )
            
            if created:
                # Add interviewers to the interview
                if interview_data['interview_type'] == 'video':
                    interview.interviewers.add(interviewers[0], interviewers[2])  # CTO + Tech Lead
                elif interview_data['interview_type'] == 'phone':
                    interview.interviewers.add(interviewers[1])  # HR Manager
                else:  # in-person
                    interview.interviewers.add(interviewers[0], interviewers[1], interviewers[4])  # CTO + HR + Product Director

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write(f'Created:')
        self.stdout.write(f'- Employer: {employer_profile.company_name}')
        self.stdout.write(f'- Jobs: {Job.objects.filter(employer=employer_profile).count()}')
        self.stdout.write(f'- Candidates: {Candidate.objects.filter(employer=employer_profile).count()}')
        self.stdout.write(f'- Interviewers: {Interviewer.objects.filter(employer=employer_profile).count()}')
        self.stdout.write(f'- Interviews: {Interview.objects.filter(employer=employer_profile).count()}')
        self.stdout.write('')
        self.stdout.write('You can login with:')
        self.stdout.write('Username: employer_demo')
        self.stdout.write('Password: demo123')