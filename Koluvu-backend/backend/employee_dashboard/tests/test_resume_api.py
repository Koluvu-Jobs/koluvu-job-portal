from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from ..models import Resume, EmployeeProfile, CandidateSearchProfile

User = get_user_model()


class ResumeAPITestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass1234')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_and_update_resume(self):
        # create
        payload = {
            'title': 'My Draft',
            'template': None,
            'status': 'draft',
            'personal_info': {'first_name': 'Test', 'last_name': 'User'},
            'education_data': [],
            'experience_data': [],
            'skills_data': [],
        }
        res = self.client.post('/api/employee/resume-builder/resumes/', payload, format='json')
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIn('id', data)

        resume_id = data['id']

        # update
        payload['title'] = 'Updated Title'
        res2 = self.client.put(f'/api/employee/resume-builder/resumes/{resume_id}/', payload, format='json')
        self.assertIn(res2.status_code, (200, 201))
        updated = res2.json()
        self.assertEqual(updated['title'], 'Updated Title')


class CandidateStrengthsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='struser', password='pass1234')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_update_strengths(self):
        res = self.client.put('/api/employee/candidate/strengths/', {'strengths': ['A','B']}, format='json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        # ensure profile exists and has strengths
        profile = CandidateSearchProfile.objects.get(employee__user=self.user)
        self.assertEqual(profile.strengths, ['A', 'B'])
