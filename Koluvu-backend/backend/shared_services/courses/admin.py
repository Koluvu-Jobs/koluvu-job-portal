from django.contrib import admin
from .models import (
    SkillCategory, Skill, Course, CourseModule, 
    CourseEnrollment, UserSkillProfile, CourseReview
)


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'difficulty_level', 'market_demand']
    list_filter = ['category', 'difficulty_level', 'market_demand']
    search_fields = ['name', 'description']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_type', 'difficulty_level', 'price', 'status', 'total_enrollments']
    list_filter = ['course_type', 'difficulty_level', 'status', 'is_featured']
    search_fields = ['title', 'description']
    filter_horizontal = ['skills']


@admin.register(CourseModule)
class CourseModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'estimated_hours']
    list_filter = ['course']
    ordering = ['course', 'order']


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'status', 'progress_percentage', 'enrolled_date']
    list_filter = ['status', 'enrolled_date', 'completion_date']
    search_fields = ['user__username', 'course__title']


@admin.register(UserSkillProfile)
class UserSkillProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'skill', 'current_level', 'target_level', 'certification_earned']
    list_filter = ['current_level', 'target_level', 'certification_earned']
    search_fields = ['user__username', 'skill__name']


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'rating', 'is_verified', 'created_at']
    list_filter = ['rating', 'is_verified', 'is_featured']
    search_fields = ['user__username', 'course__title', 'title']