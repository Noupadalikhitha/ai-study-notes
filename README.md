# AI Study Notes Generator

A full-stack web application that generates AI-powered study notes using Google's Gemini API. Built with Django REST Framework backend and React frontend.

## 🚀 Features

- **AI-Powered Note Generation**: Uses Google Gemini API to create comprehensive study notes
- **User Authentication**: Secure token-based authentication system
- **Topic Management**: Create and organize study topics by subject and difficulty
- **Customizable Preferences**: User preferences for note generation style and content
- **Analytics**: Track usage, performance, and user engagement
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Status**: Live updates on AI service status and generation progress

## 🛠 Tech Stack

### Backend
- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database
- **Google Generative AI**: AI content generation
- **Django CORS Headers**: Cross-origin request handling

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Hot Toast**: Notifications

## 📁 Project Structure

```
ai_studynote/
├── backend/                 # Django backend
│   ├── core/               # Django project settings
│   ├── users/              # User authentication
│   ├── notes/              # Study topics and notes
│   ├── ai_service/         # AI integration
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/               # React frontend
│   ├── src/               # React source code
│   ├── package.json       # Node.js dependencies
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **PostgreSQL**
- **Google Gemini API Key**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai_studynote
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Copy environment template
cp env.example .env

# Edit .env with your configuration
# - Set your PostgreSQL database credentials
# - Add your Google Gemini API key
# - Configure other settings as needed

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the `backend/` directory:

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

### PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create Database**:
   ```sql
   CREATE DATABASE ai_studynotes_db;
   CREATE USER ai_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_studynotes_db TO ai_user;
   ```

### Google Gemini API

1. **Get API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Add to Environment**: Set `GEMINI_API_KEY` in your `.env` file

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - Get user profile

### Study Topics

- `GET /api/notes/topics/` - List user's topics
- `POST /api/notes/topics/` - Create new topic
- `GET /api/notes/topics/{id}/` - Get topic details
- `POST /api/notes/topics/{id}/generate/` - Generate notes

### Study Notes

- `GET /api/notes/notes/` - List study notes
- `GET /api/notes/notes/{id}/` - Get note details
- `POST /api/notes/notes/{id}/rate/` - Rate a note

### AI Service

- `GET /api/ai/status/` - Check AI service status
- `GET /api/ai/stats/` - Get AI service statistics

## 🎯 Usage

### 1. Register/Login
- Create an account or sign in with existing credentials
- Complete your profile information

### 2. Create Study Topics
- Navigate to the Topics page
- Click "Create Topic"
- Fill in topic details (title, description, subject, difficulty)
- Save the topic

### 3. Generate Study Notes
- Select a topic from your list
- Click "Generate Notes"
- Wait for AI processing
- View and rate the generated notes

### 4. Manage Your Content
- View all your topics and notes
- Edit topic information
- Regenerate notes if needed
- Rate and provide feedback

## 🔐 Security Features

- **Token-based Authentication**: Secure API access
- **Password Validation**: Strong password requirements
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure configuration management
- **Input Validation**: Server-side validation for all inputs

## 📊 Analytics & Monitoring

- **User Activity**: Track user engagement and usage patterns
- **AI Performance**: Monitor API response times and success rates
- **Content Analytics**: Analyze note ratings and user feedback
- **Service Health**: Real-time AI service status monitoring

## 🚀 Deployment

### Backend Deployment

1. **Set Production Environment**:
   ```env
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   ALLOWED_HOSTS=your-domain.com
   ```

2. **Configure Production Database**
3. **Run Migrations**: `python manage.py migrate`
4. **Collect Static Files**: `python manage.py collectstatic`
5. **Deploy with WSGI Server** (Gunicorn, uWSGI)

### Frontend Deployment

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server
3. **Configure API Base URL** for production
4. **Set up HTTPS** for security

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

- **Documentation**: Check the README files in `backend/` and `frontend/` directories
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **API Documentation**: Available at `/api/` when the backend is running

## 🔄 Development Workflow

1. **Backend Development**: Make changes to Django apps
2. **Frontend Development**: Update React components
3. **API Integration**: Test API endpoints
4. **Testing**: Run tests for both backend and frontend
5. **Deployment**: Deploy to staging/production

---

**Happy Learning! 📚✨** 