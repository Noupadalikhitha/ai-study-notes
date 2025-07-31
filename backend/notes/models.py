from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Subject(models.Model):
    """Model for categorizing study topics by subject."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff')  # Hex color code
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class StudyTopic(models.Model):
    """Model for study topics that users want to learn about."""
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_topics')
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='intermediate')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tags = models.JSONField(default=list, blank=True)  # Store as list of strings
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
    
    class Meta:
        ordering = ['-created_at']


class StudyNote(models.Model):
    """Model for AI-generated study notes."""
    
    topic = models.OneToOneField(StudyTopic, on_delete=models.CASCADE, related_name='study_note')
    content = models.TextField()
    summary = models.TextField(blank=True)
    key_points = models.JSONField(default=list)  # Store as list of strings
    references = models.JSONField(default=list)  # Store as list of dictionaries
    word_count = models.PositiveIntegerField(default=0)
    reading_time_minutes = models.PositiveIntegerField(default=0)
    ai_model_used = models.CharField(max_length=50, default='gemini-pro')
    generation_time_seconds = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Notes for: {self.topic.title}"
    
    class Meta:
        ordering = ['-created_at']


class NoteAnalytics(models.Model):
    """Model for tracking analytics on study notes."""
    
    note = models.OneToOneField(StudyNote, on_delete=models.CASCADE, related_name='analytics')
    views_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    rating = models.FloatField(
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        null=True, 
        blank=True
    )
    user_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    last_viewed = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytics for: {self.note.topic.title}"
    
    class Meta:
        verbose_name_plural = 'Note Analytics'


class UserPreference(models.Model):
    """Model for storing user preferences for note generation."""
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='preferences')
    preferred_difficulty = models.CharField(
        max_length=20, 
        choices=StudyTopic.DIFFICULTY_CHOICES, 
        default='intermediate'
    )
    preferred_style = models.CharField(max_length=50, default='academic')  # academic, casual, technical
    include_examples = models.BooleanField(default=True)
    include_summary = models.BooleanField(default=True)
    include_key_points = models.BooleanField(default=True)
    max_word_count = models.PositiveIntegerField(default=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Preferences for: {self.user.email}"
