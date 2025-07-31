from django.db import models
from django.conf import settings
from notes.models import StudyTopic


class AIServiceLog(models.Model):
    """Model for logging AI service API calls and responses."""
    
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topic = models.ForeignKey(StudyTopic, on_delete=models.CASCADE, null=True, blank=True)
    prompt = models.TextField()
    response = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    model_used = models.CharField(max_length=50, default='gemini-pro')
    response_time_seconds = models.FloatField(default=0.0)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"AI Log - {self.user.email} - {self.status} - {self.created_at}"
    
    class Meta:
        ordering = ['-created_at']


class PromptTemplate(models.Model):
    """Model for storing different prompt templates for various use cases."""
    
    TEMPLATE_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('casual', 'Casual'),
        ('technical', 'Technical'),
        ('simple', 'Simple'),
        ('detailed', 'Detailed'),
    ]
    
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPE_CHOICES, default='academic')
    prompt_template = models.TextField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.template_type})"
    
    class Meta:
        ordering = ['template_type', 'name']
