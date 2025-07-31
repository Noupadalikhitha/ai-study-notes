from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Subject, StudyTopic, StudyNote, NoteAnalytics, UserPreference
from .serializers import (
    SubjectSerializer, StudyTopicSerializer, StudyNoteSerializer,
    NoteAnalyticsSerializer, UserPreferenceSerializer, StudyTopicCreateSerializer,
    StudyTopicSearchSerializer
)
from ai_service.services import AIService


class SubjectListView(generics.ListCreateAPIView):
    """List and create subjects."""
    
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save()


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a subject."""
    
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]


class StudyTopicListView(generics.ListCreateAPIView):
    """List and create study topics for the current user."""
    
    serializer_class = StudyTopicSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'difficulty', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return StudyTopic.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudyTopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a study topic."""
    
    serializer_class = StudyTopicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudyTopic.objects.filter(user=self.request.user)


class StudyNoteListView(generics.ListAPIView):
    """List study notes for the current user."""
    
    serializer_class = StudyNoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ai_model_used']
    search_fields = ['topic__title', 'content', 'summary']
    ordering_fields = ['created_at', 'updated_at', 'word_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return StudyNote.objects.filter(topic__user=self.request.user)


class StudyNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a study note."""
    
    serializer_class = StudyNoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudyNote.objects.filter(topic__user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Update analytics
        analytics, created = NoteAnalytics.objects.get_or_create(note=instance)
        analytics.views_count += 1
        analytics.last_viewed = timezone.now()
        analytics.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Study note updated successfully',
            'note': serializer.data
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Get the topic before deleting the note
            topic = instance.topic
            
            # Delete associated analytics first
            if hasattr(instance, 'analytics'):
                instance.analytics.delete()
            
            # Delete the note
            instance.delete()
            
            # Update topic status back to pending since notes are deleted
            topic.status = 'pending'
            topic.save()
            
            return Response({
                'message': 'Study note deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'error': f'Failed to delete study note: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserPreferenceView(generics.RetrieveUpdateAPIView):
    """Get and update user preferences."""
    
    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj, created = UserPreference.objects.get_or_create(user=self.request.user)
        return obj


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_notes(request, topic_id):
    """Generate study notes for a topic using AI."""
    
    try:
        topic = StudyTopic.objects.get(id=topic_id, user=request.user)
    except StudyTopic.DoesNotExist:
        return Response({'error': 'Topic not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if notes already exist
    if hasattr(topic, 'study_note'):
        return Response({'error': 'Notes already exist for this topic'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get user preferences
        user_preferences = None
        try:
            user_preferences = UserPreference.objects.get(user=request.user)
        except UserPreference.DoesNotExist:
            pass
        
        # Update topic status
        topic.status = 'processing'
        topic.save()
        
        # Generate notes using AI service
        ai_service = AIService()
        result = ai_service.generate_study_notes(topic, user_preferences)
        
        # Create study note
        study_note = StudyNote.objects.create(
            topic=topic,
            content=result['content'],
            summary=result['summary'],
            key_points=result['key_points'],
            references=result['references'],
            word_count=result['word_count'],
            reading_time_minutes=result['reading_time_minutes'],
            ai_model_used=result['ai_model_used'],
            generation_time_seconds=result['generation_time_seconds']
        )
        
        # Create analytics
        NoteAnalytics.objects.create(note=study_note)
        
        # Update topic status
        topic.status = 'completed'
        topic.save()
        
        return Response({
            'message': 'Study notes generated successfully',
            'note': StudyNoteSerializer(study_note).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # Update topic status to failed
        topic.status = 'failed'
        topic.save()
        
        return Response({
            'error': f'Failed to generate notes: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_notes(request, topic_id):
    """Regenerate study notes for a topic."""
    
    try:
        topic = StudyTopic.objects.get(id=topic_id, user=request.user)
    except StudyTopic.DoesNotExist:
        return Response({'error': 'Topic not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Delete existing notes if they exist
        if hasattr(topic, 'study_note'):
            topic.study_note.delete()
        
        # Update topic status
        topic.status = 'processing'
        topic.save()
        
        # Get user preferences
        user_preferences = None
        try:
            user_preferences = UserPreference.objects.get(user=request.user)
        except UserPreference.DoesNotExist:
            pass
        
        # Generate new notes
        ai_service = AIService()
        result = ai_service.generate_study_notes(topic, user_preferences)
        
        # Create new study note
        study_note = StudyNote.objects.create(
            topic=topic,
            content=result['content'],
            summary=result['summary'],
            key_points=result['key_points'],
            references=result['references'],
            word_count=result['word_count'],
            reading_time_minutes=result['reading_time_minutes'],
            ai_model_used=result['ai_model_used'],
            generation_time_seconds=result['generation_time_seconds']
        )
        
        # Create analytics
        NoteAnalytics.objects.create(note=study_note)
        
        # Update topic status
        topic.status = 'completed'
        topic.save()
        
        return Response({
            'message': 'Study notes regenerated successfully',
            'note': StudyNoteSerializer(study_note).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # Update topic status to failed
        topic.status = 'failed'
        topic.save()
        
        return Response({
            'error': f'Failed to regenerate notes: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_note(request, note_id):
    """Rate a study note."""
    
    try:
        note = StudyNote.objects.get(id=note_id, topic__user=request.user)
    except StudyNote.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    
    rating = request.data.get('rating')
    if not rating or not (1 <= rating <= 5):
        return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
    
    analytics, created = NoteAnalytics.objects.get_or_create(note=note)
    analytics.user_rating = rating
    analytics.save()
    
    return Response({'message': 'Rating saved successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def topic_analytics(request):
    """Get analytics for user's topics."""
    
    topics = StudyTopic.objects.filter(user=request.user)
    
    analytics = {
        'total_topics': topics.count(),
        'completed_topics': topics.filter(status='completed').count(),
        'pending_topics': topics.filter(status='pending').count(),
        'processing_topics': topics.filter(status='processing').count(),
        'failed_topics': topics.filter(status='failed').count(),
        'difficulty_distribution': {
            'beginner': topics.filter(difficulty='beginner').count(),
            'intermediate': topics.filter(difficulty='intermediate').count(),
            'advanced': topics.filter(difficulty='advanced').count(),
        }
    }
    
    return Response(analytics, status=status.HTTP_200_OK)
