from django.urls import path
from . import views

urlpatterns = [
    # Subjects
    path('subjects/', views.SubjectListView.as_view(), name='subjects'),
    
    # Study Topics
    path('topics/', views.StudyTopicListView.as_view(), name='topics'),
    path('topics/<int:pk>/', views.StudyTopicDetailView.as_view(), name='topic_detail'),
    path('topics/<int:topic_id>/generate/', views.generate_notes, name='generate_notes'),
    path('topics/<int:topic_id>/regenerate/', views.regenerate_notes, name='regenerate_notes'),
    path('topics/analytics/', views.topic_analytics, name='topic_analytics'),
    
    # Study Notes
    path('notes/', views.StudyNoteListView.as_view(), name='notes'),
    path('notes/<int:pk>/', views.StudyNoteDetailView.as_view(), name='note_detail'),
    path('notes/<int:note_id>/rate/', views.rate_note, name='rate_note'),
    
    # User Preferences
    path('preferences/', views.UserPreferenceView.as_view(), name='preferences'),
] 