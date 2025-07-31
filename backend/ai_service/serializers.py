from rest_framework import serializers
from .models import AIServiceLog, PromptTemplate


class AIServiceLogSerializer(serializers.ModelSerializer):
    """Serializer for AIServiceLog model."""
    
    topic_title = serializers.CharField(source='topic.title', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = AIServiceLog
        fields = ['id', 'user', 'user_email', 'topic', 'topic_title', 'prompt', 
                 'response', 'status', 'model_used', 'response_time_seconds', 
                 'error_message', 'created_at']
        read_only_fields = ['id', 'user', 'user_email', 'topic_title', 'created_at']


class PromptTemplateSerializer(serializers.ModelSerializer):
    """Serializer for PromptTemplate model."""
    
    class Meta:
        model = PromptTemplate
        fields = ['id', 'name', 'template_type', 'prompt_template', 
                 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at'] 