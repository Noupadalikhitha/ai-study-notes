import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import TestAuth from './pages/TestAuth'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test-auth" element={<TestAuth />} />
          
          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="topics" element={<Topics />} />
            <Route path="notes" element={<Notes />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App 