# Koluvu Project - HR Solutions Platform

Welcome to the Koluvu Project! This is a comprehensive HR Solutions platform built with Django (Backend) and Next.js (Frontend). This guide will help you set up the entire project from scratch.

## 🚀 Project Overview

Koluvu is an HR management platform featuring:

- Employee Dashboard
- Employer Dashboard
- Training Management System
- Applicant Tracking System (ATS)
- Authentication & Authorization
- Course Management
- Document Management

## 🏗️ Architecture

```
koluvu-project/
├── backend/                 # Django REST API
│   ├── authentication/     # User authentication
│   ├── employee_dashboard/  # Employee features
│   ├── employer_dashboard/  # Employer features
│   ├── training_dashboard/  # Training management
│   ├── shared_services/     # Common services (ATS, Courses)
│   └── core/               # Django settings
├── koluvu-app/             # Next.js Frontend
└── media/                  # File uploads
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** (Recommended: 3.12)
- **Node.js 18+** and **npm**
- **PostgreSQL** (for database)
- **Git**

### Checking Prerequisites

```bash
# Check Python version
python --version

# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL installation
psql --version
```

## 🛠️ Installation Guide

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd koluvu-project
```

### Step 2: Backend Setup (Django)

#### 2.1 Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 2.2 Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### 2.3 Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Copy the example and edit
cp .env.example .env.local
```

Add the following to your `.env.local` file:

```env
# Django Configuration
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=True

# Database Configuration (PostgreSQL)
DB_NAME=koluvu
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# URLs
BACKEND_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:3000

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 2.4 Database Setup

```bash
# Create PostgreSQL database
createdb koluvu

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
```

#### 2.5 Collect Static Files

```bash
python manage.py collectstatic
```

### Step 3: Frontend Setup (Next.js)

#### 3.1 Navigate to Frontend Directory

```bash
cd koluvu-app
```

#### 3.2 Install Frontend Dependencies

```bash
npm install
```

#### 3.3 Environment Configuration

Create a `.env.local` file in the `koluvu-app` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your-linkedin-client-id
```

## 🚀 Running the Application

### Running Backend (Django)

```bash
# From the root directory, activate virtual environment
venv\Scripts\activate

# Start Django development server
python manage.py runserver
```

The backend API will be available at: `http://127.0.0.1:8000`

### Running Frontend (Next.js)

```bash
# From the koluvu-app directory
cd koluvu-app

# Start Next.js development server
npm run dev
```

The frontend application will be available at: `http://localhost:3000`

## 🔌 Connecting Backend and Frontend

### API Integration

The frontend communicates with the backend through REST API endpoints. Key connection points:

1. **Base API URL**: Configure in frontend `.env.local`

   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

2. **CORS Configuration**: Already configured in Django settings

   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```

3. **API Endpoints**: Available at:
   - Authentication: `http://127.0.0.1:8000/api/auth/`
   - Employee Dashboard: `http://127.0.0.1:8000/api/employee/`
   - Employer Dashboard: `http://127.0.0.1:8000/api/employer/`
   - Training: `http://127.0.0.1:8000/api/training/`

### Testing Connection

1. **Backend Health Check**:

   ```bash
   curl http://127.0.0.1:8000/api/
   ```

2. **Frontend API Call**:
   - Visit `http://localhost:3000`
   - Open browser console
   - Check for successful API calls in Network tab

## 📁 Project Structure Details

### Backend Structure

```
backend/
├── authentication/          # User auth, JWT tokens
├── core/                   # Django settings, URLs
├── employee_dashboard/     # Employee-specific features
├── employer_dashboard/     # Employer-specific features
├── training_dashboard/     # Training management
├── shared_services/        # Common services
│   ├── ats/               # Applicant Tracking System
│   └── courses/           # Course management
├── media/                 # File uploads
└── static/                # Static files
```

### Frontend Structure

```
koluvu-app/
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── styles/            # CSS/Tailwind styles
│   └── utils/             # Helper functions
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🔧 Common Development Tasks

### Adding New Dependencies

**Backend:**

```bash
pip install package-name
pip freeze > requirements.txt
```

**Frontend:**

```bash
cd koluvu-app
npm install package-name
```

### Database Operations

```bash
# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (careful!)
python manage.py flush
```

### Building for Production

**Backend:**

```bash
# Set DEBUG=False in settings
python manage.py collectstatic
# Deploy using gunicorn or similar
```

**Frontend:**

```bash
cd koluvu-app
npm run build
npm start
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:

   ```bash
   # Backend
   python manage.py runserver 8001

   # Frontend
   npm run dev -- --port 3001
   ```

2. **Database Connection Issues**:

   - Check PostgreSQL is running
   - Verify database credentials in `.env.local`
   - Ensure database exists

3. **CORS Errors**:

   - Verify CORS settings in Django
   - Check frontend API URL configuration

4. **Module Not Found**:

   ```bash
   # Backend
   pip install -r requirements.txt

   # Frontend
   cd koluvu-app && npm install
   ```

5. **Environment Variables Not Loading**:
   - Check `.env.local` file location
   - Restart development servers
   - Verify variable names

### Getting Help

1. Check Django admin: `http://127.0.0.1:8000/admin/`
2. Check API documentation: `http://127.0.0.1:8000/api/`
3. Review browser console for frontend errors
4. Check server logs for backend errors

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**

If you encounter any issues during setup, please check the troubleshooting section or reach out to the development team.
