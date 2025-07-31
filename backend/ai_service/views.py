from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import AIServiceLog, PromptTemplate
from .serializers import AIServiceLogSerializer, PromptTemplateSerializer
from .services import AIService
from django.db import models


# Create your views here.


class AIServiceLogListView(generics.ListAPIView):
    """List AI service logs for the current user."""
    
    serializer_class = AIServiceLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AIServiceLog.objects.filter(user=self.request.user).order_by('-created_at')


class PromptTemplateListView(generics.ListAPIView):
    """List all active prompt templates."""
    
    queryset = PromptTemplate.objects.filter(is_active=True)
    serializer_class = PromptTemplateSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_service_status(request):
    """Check the status of the AI service."""
    
    try:
        ai_service = AIService()
        status_info = ai_service.get_service_status()
        return Response(status_info, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_service_stats(request):
    """Get AI service statistics for the current user."""
    
    logs = AIServiceLog.objects.filter(user=request.user)
    
    stats = {
        'total_requests': logs.count(),
        'successful_requests': logs.filter(status='success').count(),
        'failed_requests': logs.filter(status='failed').count(),
        'average_response_time': logs.filter(status='success').aggregate(
            avg_time=models.Avg('response_time_seconds')
        )['avg_time'] or 0,
        'total_tokens_used': logs.filter(status='success').count(),  # Simplified
        'model_usage': {
            'gemini-pro': logs.filter(model_used='gemini-pro').count(),
        }
    }
    
    return Response(stats, status=status.HTTP_200_OK)
