from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.ai_service_status, name='ai_service_status'),
    path('stats/', views.ai_service_stats, name='ai_service_stats'),
    path('logs/', views.AIServiceLogListView.as_view(), name='ai_service_logs'),
    path('templates/', views.PromptTemplateListView.as_view(), name='prompt_templates'),
] 