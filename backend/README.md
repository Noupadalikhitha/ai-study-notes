# AI Study Notes Generator - Backend

A Django REST API backend for generating AI-powered study notes using Google's Gemini API.

## 🚀 Features

- **User Authentication**: Token-based authentication with custom User model
- **Study Topics Management**: CRUD operations for study topics
- **AI Note Generation**: Integration with Google Gemini API for dynamic note generation
- **Subject Categorization**: Organize topics by subjects
- **User Preferences**: Customizable note generation settings
- **Analytics**: Track usage and performance metrics
- **Search & Filter**: Advanced search and filtering capabilities

## 🛠 Tech Stack

- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database
- **Google Generative AI**: AI content generation
- **Django CORS Headers**: Cross-origin request handling
- **Django Filter**: Advanced filtering

## 📁 Project Structure

```
backend/
├── core/                 # Django project settings
│   ├── settings.py      # Main configuration
│   ├── urls.py          # Main URL routing
│   └── wsgi.py          # WSGI configuration
├── users/               # User management app
│   ├── models.py        # Custom User model
│   ├── serializers.py   # User serializers
│   ├── views.py         # Authentication views
│   └── urls.py          # User endpoints
├── notes/               # Study notes app
│   ├── models.py        # Topic, Note, Analytics models
│   ├── serializers.py   # Note serializers
│   ├── views.py         # Note management views
│   └── urls.py          # Note endpoints
├── ai_service/          # AI integration app
│   ├── models.py        # AI logs and templates
│   ├── services.py      # Gemini API integration
│   ├── views.py         # AI service views
│   └── urls.py          # AI endpoints
├── requirements.txt     # Python dependencies
├── env.example          # Environment template
└── manage.py           # Django management
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_NAME=ai_studynotes_db
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432

# Gemini API Settings
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-pro
```

### 3. Database Setup

#### PostgreSQL Installation (Windows)

1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Set a password for the `postgres` user
4. Create database:

```sql
CREATE DATABASE ai_studynotes_db;
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register/` | User registration |
| POST | `/api/users/login/` | User login |
| POST | `/api/users/logout/` | User logout |
| GET | `/api/users/profile/` | Get user profile |
| PUT | `/api/users/profile/update/` | Update profile |
| POST | `/api/users/change-password/` | Change password |

### Study Topics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/topics/` | List user's topics |
| POST | `/api/notes/topics/` | Create new topic |
| GET | `/api/notes/topics/{id}/` | Get topic details |
| PUT | `/api/notes/topics/{id}/` | Update topic |
| DELETE | `/api/notes/topics/{id}/` | Delete topic |
| POST | `/api/notes/topics/{id}/generate/` | Generate notes |
| POST | `/api/notes/topics/{id}/regenerate/` | Regenerate notes |
| GET | `/api/notes/topics/analytics/` | Get analytics |

### Study Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/notes/` | List study notes |
| GET | `/api/notes/notes/{id}/` | Get note details |
| POST | `/api/notes/notes/{id}/rate/` | Rate a note |

### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/subjects/` | List all subjects |

### User Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/preferences/` | Get user preferences |
| PUT | `/api/notes/preferences/` | Update preferences |

### AI Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/status/` | Check AI service status |
| GET | `/api/ai/stats/` | Get AI service stats |
| GET | `/api/ai/logs/` | Get AI service logs |
| GET | `/api/ai/templates/` | Get prompt templates |

## 🔐 Authentication

All API endpoints (except registration and login) require authentication using token-based authentication.

Include the token in the Authorization header:

```
Authorization: Token your-token-here
```

## 📊 Database Models

### User
- Custom User model with email as username
- Additional fields: bio, date_of_birth, profile_picture

### StudyTopic
- User-defined study topics
- Fields: title, description, subject, difficulty, status, tags

### StudyNote
- AI-generated study notes
- Fields: content, summary, key_points, references, metrics

### NoteAnalytics
- Usage tracking for notes
- Fields: views_count, shares_count, rating, user_rating

### UserPreference
- User customization settings
- Fields: preferred_difficulty, preferred_style, max_word_count

### AIServiceLog
- API call logging
- Fields: prompt, response, status, response_time

## 🤖 AI Integration

The backend integrates with Google's Gemini API to generate study notes:

1. **Prompt Templates**: Configurable templates for different styles
2. **User Preferences**: Personalized note generation
3. **Response Parsing**: Structured content extraction
4. **Error Handling**: Robust error management
5. **Logging**: Complete API call tracking

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users
python manage.py test notes
python manage.py test ai_service
```

## 🚀 Deployment

### Production Settings

1. Set `DEBUG=False`
2. Configure production database
3. Set secure `SECRET_KEY`
4. Configure `ALLOWED_HOSTS`
5. Set up static file serving
6. Configure logging

### Environment Variables

```env
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com
DB_NAME=production_db
DB_USER=production_user
DB_PASSWORD=secure_password
GEMINI_API_KEY=your-gemini-api-key
```

## 📝 License

This project is open source and available under the MIT License. 