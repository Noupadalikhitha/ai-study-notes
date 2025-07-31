import time
import logging
from typing import Dict, List, Optional
import google.generativeai as genai
from django.conf import settings
from django.utils import timezone
from .models import AIServiceLog, PromptTemplate
from notes.models import StudyTopic, StudyNote, UserPreference

logger = logging.getLogger(__name__)


class AIService:
    """Service class for handling AI operations with Gemini API."""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not configured")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(self.model_name)
    
    def generate_study_notes(self, topic: StudyTopic, user_preferences: Optional[UserPreference] = None) -> Dict:
        """
        Generate study notes for a given topic using Gemini API.
        
        Args:
            topic: StudyTopic instance
            user_preferences: Optional UserPreference instance
            
        Returns:
            Dict containing generated content, summary, key points, and metadata
        """
        start_time = time.time()
        
        try:
            # Get or create prompt template
            template = self._get_prompt_template(user_preferences)
            
            # Build the prompt
            prompt = self._build_prompt(topic, template, user_preferences)
            
            # Generate response from Gemini
            response = self._call_gemini_api(prompt)
            
            # Parse the response
            parsed_response = self._parse_response(response)
            
            # Calculate metrics
            response_time = time.time() - start_time
            word_count = len(parsed_response['content'].split())
            reading_time = max(1, word_count // 200)  # Average reading speed: 200 words/minute
            
            # Log the API call
            self._log_api_call(topic, prompt, response, response_time, 'success')
            
            return {
                'content': parsed_response['content'],
                'summary': parsed_response['summary'],
                'key_points': parsed_response['key_points'],
                'references': parsed_response['references'],
                'word_count': word_count,
                'reading_time_minutes': reading_time,
                'generation_time_seconds': response_time,
                'ai_model_used': self.model_name,
            }
            
        except Exception as e:
            response_time = time.time() - start_time
            error_message = str(e)
            logger.error(f"Error generating study notes: {error_message}")
            
            # Log the failed API call
            self._log_api_call(topic, prompt, "", response_time, 'failed', error_message)
            
            raise
    
    def _get_prompt_template(self, user_preferences: Optional[UserPreference]) -> PromptTemplate:
        """Get the appropriate prompt template based on user preferences."""
        
        if user_preferences and user_preferences.preferred_style:
            template = PromptTemplate.objects.filter(
                template_type=user_preferences.preferred_style,
                is_active=True
            ).first()
            
            if template:
                return template
        
        # Default to academic template
        template = PromptTemplate.objects.filter(
            template_type='academic',
            is_active=True
        ).first()
        
        if not template:
            # Create a default template if none exists
            template = PromptTemplate.objects.create(
                name='Default Academic Template',
                template_type='academic',
                prompt_template=self._get_default_template(),
                description='Default academic study notes template'
            )
        
        return template
    
    def _get_default_template(self) -> str:
        """Get the default prompt template."""
        return """
        You are an expert educator and study guide creator. Create comprehensive study notes for the following topic:
        
        Topic: {topic_title}
        Description: {topic_description}
        Difficulty Level: {difficulty}
        Subject: {subject}
        
        Please provide:
        
        1. **Comprehensive Content**: Detailed explanation of the topic with clear sections and subsections
        2. **Summary**: A concise summary of the main points (2-3 paragraphs)
        3. **Key Points**: A list of 5-10 key points to remember
        4. **References**: A list of reliable sources and references
        
        Requirements:
        - Use clear, educational language appropriate for {difficulty} level
        - Include examples where helpful
        - Structure the content logically
        - Keep the total content around {max_words} words
        - Make it engaging and easy to understand
        
        Format your response as:
        
        **CONTENT:**
        [Your detailed content here]
        
        **SUMMARY:**
        [Your summary here]
        
        **KEY POINTS:**
        - [Key point 1]
        - [Key point 2]
        - [Key point 3]
        ...
        
        **REFERENCES:**
        - [Reference 1]
        - [Reference 2]
        ...
        """
    
    def _build_prompt(self, topic: StudyTopic, template: PromptTemplate, user_preferences: Optional[UserPreference]) -> str:
        """Build the prompt using the template and topic information."""
        
        max_words = 1000
        if user_preferences:
            max_words = user_preferences.max_word_count
        
        prompt_vars = {
            'topic_title': topic.title,
            'topic_description': topic.description,
            'difficulty': topic.difficulty,
            'subject': topic.subject.name if topic.subject else 'General',
            'max_words': max_words,
        }
        
        # Simple template variable substitution
        prompt = template.prompt_template
        for key, value in prompt_vars.items():
            prompt = prompt.replace(f'{{{key}}}', str(value))
        
        return prompt
    
    def _call_gemini_api(self, prompt: str) -> str:
        """Call the Gemini API with the given prompt."""
        
        try:
            response = self.model.generate_content(prompt)
            
            if response.text:
                return response.text
            else:
                raise Exception("Empty response from Gemini API")
                
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise Exception(f"Failed to generate content: {str(e)}")
    
    def _parse_response(self, response: str) -> Dict:
        """Parse the AI response into structured components."""
        
        try:
            # Simple parsing based on section headers
            sections = response.split('**')
            
            content = ""
            summary = ""
            key_points = []
            references = []
            
            current_section = None
            
            for section in sections:
                section = section.strip()
                if not section:
                    continue
                
                if 'CONTENT:' in section:
                    current_section = 'content'
                    content = section.replace('CONTENT:', '').strip()
                elif 'SUMMARY:' in section:
                    current_section = 'summary'
                    summary = section.replace('SUMMARY:', '').strip()
                elif 'KEY POINTS:' in section:
                    current_section = 'key_points'
                    points_text = section.replace('KEY POINTS:', '').strip()
                    key_points = [point.strip('- ').strip() for point in points_text.split('\n') if point.strip().startswith('-')]
                elif 'REFERENCES:' in section:
                    current_section = 'references'
                    refs_text = section.replace('REFERENCES:', '').strip()
                    references = [ref.strip('- ').strip() for ref in refs_text.split('\n') if ref.strip().startswith('-')]
                elif current_section == 'content':
                    content += " " + section
                elif current_section == 'summary':
                    summary += " " + section
                elif current_section == 'key_points':
                    if section.strip().startswith('-'):
                        key_points.append(section.strip('- ').strip())
                elif current_section == 'references':
                    if section.strip().startswith('-'):
                        references.append(section.strip('- ').strip())
            
            # Fallback if parsing fails
            if not content:
                content = response
            
            return {
                'content': content,
                'summary': summary,
                'key_points': key_points,
                'references': references,
            }
            
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}")
            # Return the raw response as content if parsing fails
            return {
                'content': response,
                'summary': '',
                'key_points': [],
                'references': [],
            }
    
    def _log_api_call(self, topic: StudyTopic, prompt: str, response: str, response_time: float, status: str, error_message: str = ""):
        """Log the API call for monitoring and debugging."""
        
        try:
            AIServiceLog.objects.create(
                user=topic.user,
                topic=topic,
                prompt=prompt,
                response=response,
                status=status,
                model_used=self.model_name,
                response_time_seconds=response_time,
                error_message=error_message,
            )
        except Exception as e:
            logger.error(f"Failed to log API call: {str(e)}")
    
    def get_service_status(self) -> Dict:
        """Check the status of the AI service."""
        
        try:
            # Test API connection
            test_response = self.model.generate_content("Hello")
            return {
                'status': 'operational',
                'model': self.model_name,
                'api_working': True,
            }
        except Exception as e:
            return {
                'status': 'error',
                'model': self.model_name,
                'api_working': False,
                'error': str(e),
            } 