from django.contrib import admin
from .models import ATSProfile, ATSAnalysis, ATSKeywordLibrary, ATSSettings


@admin.register(ATSProfile)
class ATSProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'ats_score', 'usage_type', 'scan_count', 'last_scan_date']
    list_filter = ['usage_type', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'last_scan_date']


@admin.register(ATSAnalysis)
class ATSAnalysisAdmin(admin.ModelAdmin):
    list_display = ['ats_profile', 'analysis_type', 'score', 'created_at']
    list_filter = ['analysis_type', 'created_at']
    search_fields = ['ats_profile__user__username']
    readonly_fields = ['created_at']


@admin.register(ATSKeywordLibrary)
class ATSKeywordLibraryAdmin(admin.ModelAdmin):
    list_display = ['industry', 'role_category', 'importance_score']
    list_filter = ['industry', 'importance_score']
    search_fields = ['industry', 'role_category']


@admin.register(ATSSettings)
class ATSSettingsAdmin(admin.ModelAdmin):
    list_display = ['minimum_score_threshold', 'max_analyses_per_day', 'model_version']
    readonly_fields = ['created_at', 'updated_at']