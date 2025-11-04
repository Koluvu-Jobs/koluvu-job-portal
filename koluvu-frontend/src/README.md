# 🚀 Koluvu System Setup Guide

## 📋 Table of Contents
- [Phase 1: Install Prerequisites](#phase-1-install-prerequisites)
- [Phase 2: Configure PostgreSQL](#phase-2-configure-postgresql)
- [Phase 3: Set Up Django Backend](#phase-3-set-up-django-backend)
- [Phase 4: Integrate Supabase Email Verification](#phase-4-integrate-supabase-email-verification)
- [Phase 5: Run the System](#phase-5-run-the-system)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Phase 1: Install Prerequisites

### 🐘 Install PostgreSQL
- Download from [postgresql.org/download/windows](https://postgresql.org/download/windows)
- During installation:
  - ⚠️ Set password for postgres superuser (remember this!)
  - 🔌 Port: 5432 (default)
  - 🖥️ Install pgAdmin (GUI tool)

### 🐍 Install Python
- Download from [python.org/downloads](https://python.org/downloads)
- ✅ Check "Add Python to PATH" during installation

### 📦 Install Node.js (for Supabase client)
- Download LTS version from [nodejs.org](https://nodejs.org)

## Phase 2: Configure PostgreSQL

### 1. 👤 Create Dedicated User & Database
- Open pgAdmin → Connect to server (password: what you set during install)

#### Create a new user:
- Right-click Login/Group Roles → Create → Login/Group Role
- **General tab:**
  - Name: `koluvu_user`
- **Definition tab:**
  - Password: `koluvu` (remember this!)
- **Privileges tab:**
  - Enable: Can login? = Yes, Create databases? = Yes

#### Create the database:
- Right-click Databases → Create → Database
  - Name: `koluvu`
  - Owner: `koluvu_user`

### 2. 📊 Create Tables
Run this SQL in Query Tool (connected to koluvu database):

```sql
CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_location TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    -- Add other fields from your form
    total_employees INTEGER,
    industry_type VARCHAR(100),
    designation VARCHAR(100)
);
```

## Phase 3: Set Up Django Backend

### 1. 🔧 Create Project & App
```bash
pip install django djangorestframework psycopg2-binary
django-admin startproject koluvu_backend
cd koluvu_backend
python manage.py startapp employers
```

### 2. ⚙️ Configure settings.py
```python
# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'koluvu',
        'USER': 'koluvu_user',
        'PASSWORD': 'your_secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'employers',
]

# Custom user model
AUTH_USER_MODEL = 'employers.Employer'
```

### 3. 🧩 Create Custom User Model
In `employers/models.py`:

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class Employer(AbstractUser):
    username = None  # Disable username field
    email = models.EmailField(unique=True)
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    company_location = models.TextField()
    is_verified = models.BooleanField(default=False)
    # Add other fields as needed

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['company_name', 'contact_person', 'phone']

    def __str__(self):
        return self.company_name
```

### 4. 🔌 Create API Endpoints

#### Serializers (`employers/serializers.py`):
```python
from rest_framework import serializers
from .models import Employer
from django.contrib.auth.hashers import make_password

class EmployerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Employer
        fields = ['email', 'password', 'company_name', 'contact_person', 'phone', 'company_location']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Employer.objects.create(**validated_data)
```

#### Views (`employers/views.py`):
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployerSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = EmployerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### URLs (`koluvu_backend/urls.py`):
```python
from django.urls import path
from employers.views import RegisterView

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
]
```

### 5. 🔄 Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## Phase 4: Integrate Supabase Email Verification

### 1. 🌐 Set Up Supabase Project
- Go to Supabase Dashboard → New Project
- Note:
  - Project URL (e.g., `https://xyz.supabase.co`)
  - API Key (under Settings → API → anon public key)

### 2. ⚛️ Configure React Frontend

#### Install Supabase client:
```bash
npm install @supabase/supabase-js
```

#### Create `lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### Update `form.js`:
```javascript
import { supabase } from '@/lib/supabase';

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    // 1. Save to Django
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // 2. Trigger Supabase email verification
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.companyName,
            user_type: 'employer'
          }
        }
      });

      if (error) throw error;
      router.push('/auth/login?registered=true');
    }
  } catch (error) {
    console.error('Registration failed:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3. 📧 Configure Supabase Auth
In Supabase Dashboard:
- Authentication → Providers → Enable Email
- Email Templates → Customize confirmation email

## Phase 5: Run the System

### 🚀 Start Django Backend:
```bash
python manage.py runserver
```

### 🧪 Test Registration:
Send POST request to `http://localhost:8000/api/register/` with:

```json
{
  "email": "test@example.com",
  "password": "secure123",
  "company_name": "Test Inc",
  "contact_person": "Jane Doe",
  "phone": "9876543210",
  "company_location": "New York"
}
```

### ✅ Verify:
- Data appears in PostgreSQL (use pgAdmin)
- Email arrives from Supabase

## Security Notes 🔒

### ❗ Never commit passwords to Git. Use `.env` files:

```env
# Django .env
DB_PASSWORD=your_secure_password
SECRET_KEY=your_django_secret_key

# React .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=anon_public_key
```

### 🛡️ For production:
- Use HTTPS
- Set `DEBUG=False` in Django
- Restrict Supabase API keys

## Troubleshooting 🔍

### 🐘 PostgreSQL Connection Issues:
- Verify `koluvu_user` has login privileges
- Check `pg_hba.conf` (located in PostgreSQL data directory) for authentication rules

### 📧 Supabase Email Not Sent:
- Check Authentication → Logs in Supabase Dashboard
- Whitelist localhost in Supabase URL Configuration
--- 

## ✅ How to Create a User in PostgreSQL (`koluvu_user`)

### 1. Connect to PostgreSQL
Use the terminal or `psql` to log in:
```bash
psql -U postgres
```

---

### 2. Create the User
Inside the `psql` prompt, run:
```sql
CREATE ROLE koluvu_user WITH LOGIN PASSWORD 'koluvu';
```

- `WITH LOGIN`: allows the role to log in (makes it a user).
---

### 3. (Optional) Grant Privileges

#### Grant access to a database:
```sql
GRANT CONNECT ON DATABASE koluvu TO koluvu_user;
```

#### Grant usage on a schema:
```sql
GRANT USAGE ON SCHEMA public TO koluvu_user;
```

#### Grant `SELECT` permission on a table:
```sql
GRANT SELECT ON table_name TO koluvu_user;
```

You can tailor these permissions to the needs of the user.

---

### 🔍 Verify the User Exists
Run:
```sql
SELECT rolname FROM pg_roles WHERE rolname = 'koluvu_user';
```

Expected result:
```
   rolname
-------------
 koluvu_user
(1 row)
```

---