from django.urls import path
from . import views

urlpatterns = [
    path('google/', views.GoogleOAuthView.as_view(), name='google_oauth'),
    path('github/initiate/', views.GitHubInitiateView.as_view(), name='github_initiate'),
    path('github/callback/', views.GitHubCallbackView.as_view(), name='github_callback'),
    path('linkedin/initiate/', views.LinkedInInitiateView.as_view(), name='linkedin_initiate'),
    path('linkedin/callback/', views.LinkedInCallbackView.as_view(), name='linkedin_callback'),
    path('verify-token/', views.VerifyTokenView.as_view(), name='verify_token'),
    path('token-from-cookie/', views.TokenFromCookieView.as_view(), name='token_from_cookie'),
    path('refresh-token/', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]