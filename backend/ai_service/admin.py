from django.contrib import admin
from .models import AIServiceLog, PromptTemplate


@admin.register(AIServiceLog)
class AIServiceLogAdmin(admin.ModelAdmin):
    """Admin configuration for AIServiceLog model."""
    
    list_display = ['user', 'topic', 'status', 'model_used', 'response_time_seconds', 'created_at']
    list_filter = ['status', 'model_used', 'created_at']
    search_fields = ['user__email', 'topic__title', 'error_message']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        return False  # Logs should only be created by the system


@admin.register(PromptTemplate)
class PromptTemplateAdmin(admin.ModelAdmin):
    """Admin configuration for PromptTemplate model."""
    
    list_display = ['name', 'template_type', 'is_active', 'created_at']
    list_filter = ['template_type', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['template_type', 'name']
    readonly_fields = ['created_at', 'updated_at']
