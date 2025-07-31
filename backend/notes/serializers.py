from rest_framework import serializers
from .models import Subject, StudyTopic, StudyNote, NoteAnalytics, UserPreference


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model."""
    
    class Meta:
        model = Subject
        fields = '__all__'


class StudyTopicSerializer(serializers.ModelSerializer):
    """Serializer for StudyTopic model."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = StudyTopic
        fields = ['id', 'title', 'description', 'subject', 'subject_name', 
                 'difficulty', 'status', 'tags', 'user', 'user_email', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at']


class StudyNoteSerializer(serializers.ModelSerializer):
    """Serializer for StudyNote model."""
    
    topic_title = serializers.CharField(source='topic.title', read_only=True)
    topic_difficulty = serializers.CharField(source='topic.difficulty', read_only=True)
    
    class Meta:
        model = StudyNote
        fields = ['id', 'topic', 'topic_title', 'topic_difficulty', 'content', 
                 'summary', 'key_points', 'references', 'word_count', 
                 'reading_time_minutes', 'ai_model_used', 'generation_time_seconds',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'word_count', 'reading_time_minutes', 
                           'ai_model_used', 'generation_time_seconds', 
                           'created_at', 'updated_at']


class NoteAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for NoteAnalytics model."""
    
    note_title = serializers.CharField(source='note.topic.title', read_only=True)
    
    class Meta:
        model = NoteAnalytics
        fields = ['id', 'note', 'note_title', 'views_count', 'shares_count', 
                 'rating', 'user_rating', 'last_viewed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'views_count', 'shares_count', 'last_viewed', 
                           'created_at', 'updated_at']


class UserPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for UserPreference model."""
    
    class Meta:
        model = UserPreference
        fields = ['id', 'preferred_difficulty', 'preferred_style', 
                 'include_examples', 'include_summary', 'include_key_points', 
                 'max_word_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudyTopicCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating study topics."""
    
    class Meta:
        model = StudyTopic
        fields = ['title', 'description', 'subject', 'difficulty', 'tags']


class StudyTopicSearchSerializer(serializers.Serializer):
    """Serializer for searching study topics."""
    
    search = serializers.CharField(required=False)
    subject = serializers.IntegerField(required=False)
    difficulty = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False) 