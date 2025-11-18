from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class UploadTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='upl', password='pass1234')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_profile_picture_validation(self):
        # Oversized file
        big = SimpleUploadedFile('big.png', b'a' * (6 * 1024 * 1024), content_type='image/png')
        res = self.client.post('/api/employee/profile/picture/upload/', {'profile_picture': big})
        self.assertEqual(res.status_code, 400)

        # Wrong type
        txt = SimpleUploadedFile('file.txt', b'hello', content_type='text/plain')
        res2 = self.client.post('/api/employee/profile/picture/upload/', {'profile_picture': txt})
        self.assertEqual(res2.status_code, 400)

        # Valid small image
        small = SimpleUploadedFile('img.png', b'PNGDATA', content_type='image/png')
        res3 = self.client.post('/api/employee/profile/picture/upload/', {'profile_picture': small})
        self.assertEqual(res3.status_code, 200)
