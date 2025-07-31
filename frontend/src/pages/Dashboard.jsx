import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { topicsAPI, aiServiceAPI } from '../services/api'
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Brain
} from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [aiStats, setAiStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [topicsRes, analyticsRes, aiStatsRes] = await Promise.all([
          topicsAPI.getAll({ limit: 5 }),
          topicsAPI.getAnalytics(),
          aiServiceAPI.getStats()
        ])

        setTopics(topicsRes.data.results || topicsRes.data)
        setAnalytics(analyticsRes.data)
        setAiStats(aiStatsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.first_name || user?.email}!
        </h1>
        <p className="text-primary-100 mt-2">
          Ready to generate some AI-powered study notes?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Topics</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.total_topics || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.completed_topics || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.pending_topics || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">AI Requests</p>
              <p className="text-2xl font-semibold text-gray-900">
                {aiStats?.total_requests || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/topics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Create New Topic</h3>
              <p className="text-sm text-gray-500">Add a new study topic</p>
            </div>
          </Link>
          
          <Link
            to="/notes"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">View Notes</h3>
              <p className="text-sm text-gray-500">Browse your study notes</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Topics */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Topics</h2>
          <Link
            to="/topics"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        
        {topics.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No topics yet. Create your first topic to get started!</p>
            <Link
              to="/topics"
              className="btn-primary inline-flex items-center mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Topic
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(topic.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                  <Link
                    to="/notes"
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Service Status */}
      {aiStats && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {aiStats.successful_requests || 0}
              </p>
              <p className="text-sm text-gray-500">Successful Requests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {aiStats.failed_requests || 0}
              </p>
              <p className="text-sm text-gray-500">Failed Requests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {aiStats.average_response_time ? `${aiStats.average_response_time.toFixed(2)}s` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Avg Response Time</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 