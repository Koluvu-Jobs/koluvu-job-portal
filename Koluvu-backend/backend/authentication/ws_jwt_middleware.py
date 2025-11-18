from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class QueryTokenAuthMiddleware:
    """ASGI middleware that checks for a `token` query param and authenticates user.

    Usage: wrap your URLRouter with `QueryTokenAuthMiddlewareStack` which returns
    a callable that sets `scope['user']` when a valid JWT access token is supplied
    as `?token=<access_token>`.
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token_list = params.get('token') or params.get('access_token')
        user = None

        if token_list:
            token = token_list[0]
            try:
                access = AccessToken(token)
                user_id = access.get('user_id')
                if user_id:
                    try:
                        user = User.objects.get(id=user_id)
                    except User.DoesNotExist:
                        user = None
            except Exception:
                user = None

        if user:
            scope['user'] = user

        return self.inner(scope)


def QueryTokenAuthMiddlewareStack(inner):
    return QueryTokenAuthMiddleware(inner)
