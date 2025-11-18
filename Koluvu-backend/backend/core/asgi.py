"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from authentication.ws_jwt_middleware import QueryTokenAuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import employee_dashboard.routing as employee_routing

application = ProtocolTypeRouter({
	'http': get_asgi_application(),
	'websocket': QueryTokenAuthMiddlewareStack(
		AuthMiddlewareStack(
			URLRouter(
				employee_routing.websocket_urlpatterns
			)
		)
	),
})
