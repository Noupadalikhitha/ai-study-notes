import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  console.log('PrivateRoute - Loading:', loading, 'Authenticated:', isAuthenticated)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('Redirecting to login - not authenticated')
    return <Navigate to="/login" replace />
  }

  console.log('Rendering protected content')
  return children
}

export default PrivateRoute 