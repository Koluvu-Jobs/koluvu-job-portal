import os
import logging.handlers
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env.local
env_path = BASE_DIR.parent / '.env.local'  # This will look in koluvu-backend/.env.local
load_dotenv(env_path)

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'replace-this-with-a-secure-key')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = ['*']

# OAuth settings
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
LINKEDIN_CLIENT_ID = os.getenv('LINKEDIN_CLIENT_ID')
LINKEDIN_CLIENT_SECRET = os.getenv('LINKEDIN_CLIENT_SECRET')

# Backend and Frontend URLs
BACKEND_URL = os.getenv('BACKEND_URL', 'http://127.0.0.1:8000')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# Supabase settings from environment variables
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    # OTP System
    'django_otp',
    'django_otp.plugins.otp_totp',
    'django_otp.plugins.otp_hotp',
    'django_otp.plugins.otp_static',
    # Authentication
    'authentication',
    # User Dashboard Apps
    'employer_dashboard',
    'employee_dashboard', 
    'training_dashboard',
    'backend.partner_dashboard',
    # Shared Services
    'shared_services',
    'backend.shared_services.ats',
    'backend.shared_services.courses',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Security middleware
    'authentication.middleware.SecurityHeadersMiddleware',
    'authentication.middleware.RateLimitMiddleware',
    # Encryption middleware
    'authentication.encryption_middleware.DataEncryptionMiddleware',
    'authentication.encryption_middleware.SecureHeadersMiddleware',
]

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Get production frontend URL from environment
PRODUCTION_FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://koluvu-ai-job-portal.netlify.app",  # Production frontend
    PRODUCTION_FRONTEND_URL,  # Dynamic from env
]

# Remove duplicates
CORS_ALLOWED_ORIGINS = list(set(CORS_ALLOWED_ORIGINS))

# Enable automatic slash appending for proper URL matching
APPEND_SLASH = True

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database - Auto-detect environment
# Check if running on Render (server) or localhost
DATABASE_URL = os.getenv('DATABASE_URL')
IS_PRODUCTION = bool(DATABASE_URL) or 'render.com' in os.getenv('BACKEND_URL', '')

if IS_PRODUCTION or not DEBUG:
    # Production database (Neon)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_PROD_NAME', 'koluvu'),
            'USER': os.getenv('DB_PROD_USER', 'neondb_owner'),
            'PASSWORD': os.getenv('DB_PROD_PASSWORD', ''),
            'HOST': os.getenv('DB_PROD_HOST', ''),
            'PORT': os.getenv('DB_PROD_PORT', '5432'),
            'OPTIONS': {'sslmode': 'require'},
        }
    }
    # Use DATABASE_URL if available (Render deployment)
    if DATABASE_URL:
        import dj_database_url
        DATABASES['default'] = dj_database_url.parse(DATABASE_URL)
else:
    # Local development database (PostgreSQL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_LOCAL_NAME', 'koluvu'),
            'USER': os.getenv('DB_LOCAL_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_LOCAL_PASSWORD', 'mysql'),
            'HOST': os.getenv('DB_LOCAL_HOST', 'localhost'),
            'PORT': os.getenv('DB_LOCAL_PORT', '5432'),
        }
    }

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

# JWT Settings
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),  # Increased from 60 minutes to 24 hours
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),  # Increased from 7 days to 30 days  
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.getenv('JWT_SECRET', SECRET_KEY),  # Use JWT_SECRET if available, fallback to SECRET_KEY
}

# Email Configuration - Mixed Mode (Real SMTP for emails, Console for mobile)
EMAIL_MODE = os.getenv('EMAIL_MODE', 'console')  # console, smtp, sendgrid

if EMAIL_MODE == 'console':
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
elif EMAIL_MODE == 'smtp':
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.zoho.com')
    EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
    EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
    # Try Zoho first, fallback to Gmail
    EMAIL_HOST_USER = os.getenv('ZOHO_USER') or os.getenv('GMAIL_USER')
    EMAIL_HOST_PASSWORD = os.getenv('ZOHO_PASSWORD') or os.getenv('GMAIL_APP_PASSWORD')
    
DEFAULT_FROM_EMAIL = os.getenv('FROM_EMAIL', 'koluvujobs@zohomail.in')

# CAPTCHA Configuration
RECAPTCHA_PUBLIC_KEY = os.getenv('RECAPTCHA_PUBLIC_KEY', 'your-recaptcha-public-key')
RECAPTCHA_PRIVATE_KEY = os.getenv('RECAPTCHA_PRIVATE_KEY', 'your-recaptcha-private-key')
RECAPTCHA_REQUIRED_SCORE = 0.85  # Score threshold for reCAPTCHA v3

# Development mode CAPTCHA (for testing)
if DEBUG:
    RECAPTCHA_PUBLIC_KEY = 'test-public-key'
    RECAPTCHA_PRIVATE_KEY = 'test-private-key'
    # Disable CAPTCHA in development for easier testing
    SILENCED_SYSTEM_CHECKS = ['captcha.recaptcha_test_key_error']

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0  # 1 year in production
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Session Security
SESSION_COOKIE_SECURE = not DEBUG  # HTTPS only in production
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_AGE = 86400  # 24 hours

# CSRF Security
CSRF_COOKIE_SECURE = not DEBUG  # HTTPS only in production
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'

# Rate Limiting - Disabled for localhost development
RATELIMIT_ENABLE = os.getenv('RATELIMIT_ENABLE', 'False').lower() == 'true'
RATELIMIT_USE_CACHE = 'default'

# Cache Configuration for Rate Limiting
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Password Security
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'authentication.validators.CustomPasswordValidator',
    },
]

# Data Encryption Settings
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', 'your-32-character-encryption-key!!!')
FIELD_ENCRYPTION_KEY = ENCRYPTION_KEY.encode()[:32]  # Ensure 32 bytes for Fernet

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
            'maxBytes': 5 * 1024 * 1024,  # 5MB per file
            'backupCount': 3,  # Keep 3 backup files (total max: 20MB)
            'encoding': 'utf-8',
        },
        'security_file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'security.log',
            'formatter': 'verbose',
            'maxBytes': 2 * 1024 * 1024,  # 2MB per file
            'backupCount': 2,  # Keep 2 backup files (total max: 6MB)
            'encoding': 'utf-8',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'] if DEBUG else ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'authentication': {
            'handlers': ['console'] if DEBUG else ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'security': {
            'handlers': ['console'] if DEBUG else ['security_file', 'console'],
            'level': 'WARNING',
            'propagate': True,
        },
    },
}

# Ensure logs directory exists (only in production)
if not DEBUG:
    import os
    logs_dir = BASE_DIR / 'logs'
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
