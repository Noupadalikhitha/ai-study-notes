# AI Study Notes Generator - Frontend

A modern React frontend for the AI Study Notes Generator application, built with Vite, Tailwind CSS, and React Router.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Complete login/register system with token-based auth
- **Dashboard**: Overview of topics, notes, and AI service status
- **Topic Management**: Create, view, and manage study topics
- **Note Generation**: AI-powered study note generation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live status updates and notifications

## 🛠 Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Navigation and routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form handling
- **React Hot Toast**: Notifications
- **Lucide React**: Icon library

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx      # Main layout with navigation
│   │   └── PrivateRoute.jsx # Route protection
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Topics.jsx      # Topics management
│   │   ├── Notes.jsx       # Notes viewing
│   │   └── Profile.jsx     # User profile
│   ├── services/           # API services
│   │   └── api.js         # API client and endpoints
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js     # Authentication context
│   ├── utils/              # Utility functions
│   │   └── cn.js          # Class name utilities
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Colors

- **Primary**: Blue gradient (`primary-600` to `primary-700`)
- **Success**: Green (`green-500`, `green-600`)
- **Warning**: Yellow (`yellow-500`, `yellow-600`)
- **Error**: Red (`red-500`, `red-600`)
- **Neutral**: Gray scale (`gray-50` to `gray-900`)

### Components

- **Cards**: White background with subtle shadow and border
- **Buttons**: Primary (blue) and secondary (gray) variants
- **Inputs**: Consistent styling with focus states
- **Icons**: Lucide React icons throughout the app

## 📱 Pages

### Authentication Pages

- **Login**: Email/password authentication
- **Register**: User registration with validation

### Protected Pages

- **Dashboard**: Overview with stats and quick actions
- **Topics**: Topic management and creation
- **Notes**: View generated study notes
- **Profile**: User profile and settings

## 🔐 Authentication Flow

1. **Login/Register**: User authenticates via API
2. **Token Storage**: JWT token stored in localStorage
3. **Route Protection**: PrivateRoute component guards protected routes
4. **Auto-logout**: Token expiration handling
5. **Profile Management**: User can update profile information

## 🌐 API Integration

The frontend communicates with the Django backend via REST API:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Token-based with Authorization header
- **Error Handling**: Automatic 401 handling with redirect to login
- **Loading States**: Consistent loading indicators

## 📊 State Management

- **Context API**: Authentication state management
- **Local State**: Component-level state with useState
- **API State**: Server state management with useEffect
- **Form State**: Controlled components for form handling

## 🎯 Key Features

### Dashboard
- Welcome message with user info
- Statistics cards (topics, notes, AI requests)
- Quick action buttons
- Recent topics list
- AI service status

### Topic Management
- Create new study topics
- View topic list with filtering
- Topic status indicators
- Difficulty level badges

### Note Generation
- AI-powered note generation
- Progress indicators
- Error handling
- Note rating system

### User Profile
- Profile information display
- Edit profile functionality
- Password change
- Account statistics

## 🚀 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Environment Variables

The frontend connects to the backend API. Make sure the backend is running on `http://localhost:8000` or update the API base URL in `src/services/api.js`.

### Code Style

- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

## 🔧 Customization

### Styling

- **Tailwind CSS**: Utility classes for styling
- **Custom Components**: Reusable component classes in `index.css`
- **Theme**: Customizable in `tailwind.config.js`

### API Configuration

- **Base URL**: Update in `src/services/api.js`
- **Endpoints**: Add new endpoints in the API service
- **Authentication**: Modify auth flow in `src/hooks/useAuth.js`

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first**: Design starts with mobile layout
- **Breakpoints**: Tailwind's responsive breakpoints
- **Navigation**: Collapsible sidebar on mobile
- **Touch-friendly**: Appropriate touch targets

## 🧪 Testing

While no testing framework is currently configured, the project structure supports:

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end testing with Cypress or Playwright

## 🚀 Deployment

### Build Process

1. Run `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your server to serve the React app

### Environment Configuration

- **Production API**: Update API base URL for production
- **HTTPS**: Ensure HTTPS for production deployment
- **CORS**: Configure CORS on the backend for production domain

## 📝 License

This project is open source and available under the MIT License. 