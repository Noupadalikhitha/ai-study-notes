from django.contrib import admin
from .models import Subject, StudyTopic, StudyNote, NoteAnalytics, UserPreference


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    """Admin configuration for Subject model."""
    
    list_display = ['name', 'description', 'color', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(StudyTopic)
class StudyTopicAdmin(admin.ModelAdmin):
    """Admin configuration for StudyTopic model."""
    
    list_display = ['title', 'user', 'subject', 'difficulty', 'status', 'created_at']
    list_filter = ['subject', 'difficulty', 'status', 'created_at']
    search_fields = ['title', 'description', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(StudyNote)
class StudyNoteAdmin(admin.ModelAdmin):
    """Admin configuration for StudyNote model."""
    
    list_display = ['topic', 'word_count', 'reading_time_minutes', 'ai_model_used', 'created_at']
    list_filter = ['ai_model_used', 'created_at']
    search_fields = ['topic__title', 'content', 'summary']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(NoteAnalytics)
class NoteAnalyticsAdmin(admin.ModelAdmin):
    """Admin configuration for NoteAnalytics model."""
    
    list_display = ['note', 'views_count', 'shares_count', 'rating', 'user_rating', 'last_viewed']
    list_filter = ['rating', 'user_rating', 'created_at']
    search_fields = ['note__topic__title']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    """Admin configuration for UserPreference model."""
    
    list_display = ['user', 'preferred_difficulty', 'preferred_style', 'max_word_count']
    list_filter = ['preferred_difficulty', 'preferred_style']
    search_fields = ['user__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
