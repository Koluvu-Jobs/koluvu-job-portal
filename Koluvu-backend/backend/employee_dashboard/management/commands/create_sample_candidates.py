from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employee_dashboard.models import EmployeeProfile, CandidateSearchProfile, CandidateProject, CandidateAchievement
from employer_dashboard.models import EmployerProfile

class Command(BaseCommand):
    help = 'Create sample candidate data for testing boolean search'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample candidate data...')

        # Sample candidates data
        candidates_data = [
            {
                'username': 'rahul_sharma',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'email': 'rahul.sharma@example.com',
                'phone': '9876543210',
                'employee_data': {
                    'current_designation': 'Senior Frontend Developer',
                    'current_position': 'Senior Developer',
                    'location': 'Hyderabad',
                    'experience_years': 4,
                },
                'candidate_data': {
                    'department': 'IT',
                    'industry': 'Healthcare Tech',
                    'key_skills': 'React, TypeScript, Redux, GraphQL, Jest',
                    'expected_ctc': 1500000,  # 15 LPA
                    'present_ctc': 1200000,   # 12 LPA
                    'notice_period': '30 Days',
                    'preferred_location': 'Bangalore, Hyderabad',
                    'actively_looking': True,
                    'is_searchable': True,
                },
                'projects': [
                    {
                        'title': 'Patient Management System',
                        'description': 'Led a team of 5 developers to build a comprehensive healthcare management system',
                        'technologies': 'React, Node.js, MongoDB'
                    },
                    {
                        'title': 'Telemedicine App',
                        'description': 'Developed the frontend architecture for a telemedicine platform serving 50k+ users',
                        'technologies': 'React Native, TypeScript'
                    }
                ],
                'achievements': [
                    {'title': 'Employee of the Year 2022', 'description': 'Recognized for outstanding performance'},
                    {'title': 'Best UI Implementation Award', 'description': 'Best frontend implementation'},
                    {'title': 'Hackathon Winner 2021', 'description': 'Won company hackathon'}
                ]
            },
            {
                'username': 'neha_verma',
                'first_name': 'Neha',
                'last_name': 'Verma',
                'email': 'neha.verma@example.com',
                'phone': '8765432109',
                'employee_data': {
                    'current_designation': 'HR Manager',
                    'current_position': 'Senior HR Manager',
                    'location': 'Bangalore',
                    'experience_years': 6,
                },
                'candidate_data': {
                    'department': 'HR',
                    'industry': 'Recruitment',
                    'key_skills': 'Talent Acquisition, Employee Relations, Performance Management',
                    'expected_ctc': 1200000,  # 12 LPA
                    'present_ctc': 900000,    # 9 LPA
                    'notice_period': '1 Month',
                    'preferred_location': 'Hyderabad, Bangalore',
                    'actively_looking': True,
                    'is_searchable': True,
                },
                'projects': [
                    {
                        'title': 'Talent Pipeline Development',
                        'description': 'Created a sustainable talent pipeline reducing hiring costs by 25%',
                        'technologies': 'ATS Systems, Analytics'
                    }
                ],
                'achievements': [
                    {'title': 'Reduced hiring time by 30%', 'description': 'Process improvement initiative'},
                    {'title': 'Employee retention program', 'description': 'Implemented successful retention strategy'}
                ]
            },
            {
                'username': 'amit_patel',
                'first_name': 'Amit',
                'last_name': 'Patel',
                'email': 'amit.patel@example.com',
                'phone': '7654321098',
                'employee_data': {
                    'current_designation': 'Financial Analyst',
                    'current_position': 'Senior Financial Analyst',
                    'location': 'Mumbai',
                    'experience_years': 5,
                },
                'candidate_data': {
                    'department': 'Finance',
                    'industry': 'Banking',
                    'key_skills': 'Financial Modeling, Excel, Accounting, Risk Analysis',
                    'expected_ctc': 1400000,  # 14 LPA
                    'present_ctc': 1100000,   # 11 LPA
                    'notice_period': '2 Months',
                    'preferred_location': 'Mumbai',
                    'actively_looking': False,
                    'is_searchable': True,
                },
                'projects': [
                    {
                        'title': 'Financial Process Automation',
                        'description': 'Led automation initiative saving 200+ man-hours monthly',
                        'technologies': 'Python, Excel VBA, Power BI'
                    }
                ],
                'achievements': [
                    {'title': 'Cost savings of ₹2.5Cr annually', 'description': 'Process optimization'},
                    {'title': 'Best Analyst Award 2021', 'description': 'Outstanding performance recognition'}
                ]
            },
            {
                'username': 'priya_singh',
                'first_name': 'Priya',
                'last_name': 'Singh',
                'email': 'priya.singh@example.com',
                'phone': '9123456789',
                'employee_data': {
                    'current_designation': 'Software Developer',
                    'current_position': 'Junior Software Developer',
                    'location': 'Hyderabad',
                    'experience_years': 1,
                },
                'candidate_data': {
                    'department': 'IT',
                    'industry': 'Software Development',
                    'key_skills': 'Python, Django, JavaScript, React',
                    'expected_ctc': 600000,   # 6 LPA
                    'present_ctc': 400000,    # 4 LPA
                    'notice_period': '15 Days',
                    'preferred_location': 'Hyderabad, Bangalore',
                    'actively_looking': True,
                    'is_searchable': True,
                },
                'projects': [
                    {
                        'title': 'E-commerce Backend API',
                        'description': 'Developed REST API for e-commerce platform',
                        'technologies': 'Django, PostgreSQL, Redis'
                    }
                ],
                'achievements': [
                    {'title': 'Fast Learner Award', 'description': 'Quick adaptation to new technologies'},
                ]
            },
            {
                'username': 'vikram_reddy',
                'first_name': 'Vikram',
                'last_name': 'Reddy',
                'email': 'vikram.reddy@example.com',
                'phone': '8901234567',
                'employee_data': {
                    'current_designation': 'DevOps Engineer',
                    'current_position': 'Senior DevOps Engineer',
                    'location': 'Hyderabad',
                    'experience_years': 7,
                },
                'candidate_data': {
                    'department': 'IT',
                    'industry': 'Cloud Infrastructure',
                    'key_skills': 'AWS, Docker, Kubernetes, Jenkins, Terraform',
                    'expected_ctc': 1800000,  # 18 LPA
                    'present_ctc': 1500000,   # 15 LPA
                    'notice_period': '1 Month',
                    'preferred_location': 'Hyderabad, Pune',
                    'actively_looking': False,
                    'is_searchable': True,
                },
                'projects': [
                    {
                        'title': 'Cloud Migration Project',
                        'description': 'Led migration of legacy systems to AWS cloud infrastructure',
                        'technologies': 'AWS, Docker, Kubernetes'
                    },
                    {
                        'title': 'CI/CD Pipeline Optimization',
                        'description': 'Reduced deployment time by 70% through pipeline improvements',
                        'technologies': 'Jenkins, GitLab CI, Docker'
                    }
                ],
                'achievements': [
                    {'title': 'AWS Certified Solutions Architect', 'description': 'Professional certification'},
                    {'title': 'Zero-downtime deployment implementation', 'description': 'Infrastructure reliability improvement'}
                ]
            }
        ]

        created_count = 0
        for candidate_info in candidates_data:
            try:
                # Check if user already exists
                user, user_created = User.objects.get_or_create(
                    username=candidate_info['username'],
                    defaults={
                        'first_name': candidate_info['first_name'],
                        'last_name': candidate_info['last_name'],
                        'email': candidate_info['email'],
                    }
                )

                if user_created:
                    user.set_password('testpassword123')
                    user.save()
                    self.stdout.write(f'Created user: {user.username}')

                # Create or get employee profile
                employee_profile, emp_created = EmployeeProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'phone': candidate_info['phone'],
                        **candidate_info['employee_data']
                    }
                )

                if emp_created:
                    self.stdout.write(f'Created employee profile: {user.username}')

                # Create or get candidate search profile
                candidate_profile, cand_created = CandidateSearchProfile.objects.get_or_create(
                    employee=employee_profile,
                    defaults=candidate_info['candidate_data']
                )

                if cand_created:
                    self.stdout.write(f'Created candidate profile: {user.username}')
                    created_count += 1

                    # Add projects
                    for project_data in candidate_info['projects']:
                        CandidateProject.objects.create(
                            candidate=candidate_profile,
                            name=project_data['title'],
                            description=project_data['description'],
                            technologies_used=project_data['technologies']
                        )

                    # Add achievements
                    for achievement_data in candidate_info['achievements']:
                        CandidateAchievement.objects.create(
                            candidate=candidate_profile,
                            **achievement_data
                        )

                    self.stdout.write(f'Added {len(candidate_info["projects"])} projects and {len(candidate_info["achievements"])} achievements')

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating candidate {candidate_info["username"]}: {str(e)}')
                )

        # Also create a test employer if it doesn't exist
        try:
            employer_user, emp_user_created = User.objects.get_or_create(
                username='test_employer',
                defaults={
                    'first_name': 'Test',
                    'last_name': 'Employer',
                    'email': 'employer@example.com',
                }
            )

            if emp_user_created:
                employer_user.set_password('testpassword123')
                employer_user.save()

            employer_profile, emp_prof_created = EmployerProfile.objects.get_or_create(
                user=employer_user,
                defaults={
                    'company_name': 'Test Company',
                    'phone': '9999999999',
                    'company_location': 'Hyderabad',
                    'industry_type': 'Technology',
                    'company_size': '51-100',
                    'contact_person': 'Test Employer',
                    'is_verified': True,
                }
            )

            if emp_prof_created:
                self.stdout.write('Created test employer account')

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating test employer: {str(e)}')
            )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} candidate profiles!')
        )
        self.stdout.write('Test login credentials:')
        self.stdout.write('Employer: username=test_employer, password=testpassword123')
        self.stdout.write('Candidates: username=rahul_sharma, neha_verma, amit_patel, priya_singh, vikram_reddy, password=testpassword123')