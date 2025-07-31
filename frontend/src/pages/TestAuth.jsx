import { useAuth } from '../hooks/useAuth.jsx'

const TestAuth = () => {
  const { user, isAuthenticated, loading, logout } = useAuth()

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  const forceClearAndRedirect = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Authentication Test
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Loading: {loading ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-600">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          </div>
          
          {user && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-900 mb-2">User Info:</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-900 mb-2">LocalStorage:</h3>
            <p className="text-sm text-gray-600">
              Token: {localStorage.getItem('token') ? 'Present' : 'Not found'}
            </p>
            <p className="text-sm text-gray-600">
              User: {localStorage.getItem('user') ? 'Present' : 'Not found'}
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={clearStorage}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Clear LocalStorage & Reload
            </button>
            <button
              onClick={forceClearAndRedirect}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
            >
              Force Clear & Go to Login
            </button>
            <button
              onClick={logout}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestAuth 