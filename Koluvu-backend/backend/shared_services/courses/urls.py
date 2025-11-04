from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SkillCategoryViewSet, SkillViewSet, CourseViewSet,
    CourseEnrollmentViewSet, UserSkillProfileViewSet, CourseReviewViewSet
)

router = DefaultRouter()
router.register(r'categories', SkillCategoryViewSet, basename='skill-category')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', CourseEnrollmentViewSet, basename='course-enrollment')
router.register(r'skill-profiles', UserSkillProfileViewSet, basename='user-skill-profile')
router.register(r'reviews', CourseReviewViewSet, basename='course-review')

app_name = 'courses'

urlpatterns = [
    path('', include(router.urls)),
]