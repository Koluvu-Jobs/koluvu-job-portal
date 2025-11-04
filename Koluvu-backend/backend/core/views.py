from django.shortcuts import render, redirect
from django.conf import settings


def home(request):
    """Serve a simple homepage in development, redirect to the frontend in production.

    - If DEBUG is True: render `home.html` (HTTP 200).
    - If DEBUG is False: redirect to settings.FRONTEND_URL (or '/' fallback).
    """
    # If not in debug mode, redirect to the frontend URL (production behaviour)
    if not getattr(settings, 'DEBUG', False):
        frontend = getattr(settings, 'FRONTEND_URL', '/') or '/'
        return redirect(frontend)

    # Development: render a lightweight homepage
    context = {
        'project_name': 'Koluvu Backend',
        'FRONTEND_URL': getattr(settings, 'FRONTEND_URL', ''),
    }
    return render(request, 'home.html', context)
