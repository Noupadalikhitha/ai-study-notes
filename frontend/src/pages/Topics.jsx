import { useState, useEffect } from 'react'
import { topicsAPI, subjectsAPI } from '../services/api'
import { Plus, Search, Filter, X, BookOpen, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Topics = () => {
  const [topics, setTopics] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'beginner'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, subjectsRes] = await Promise.all([
          topicsAPI.getAll(),
          subjectsAPI.getAll()
        ])
        setTopics(topicsRes.data.results || topicsRes.data)
        setSubjects(subjectsRes.data.results || subjectsRes.data)
      } catch (error) {
        console.error('Error fetching topics:', error)
        toast.error('Failed to load topics')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateTopic = async (e) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      const response = await topicsAPI.create(formData)
      setTopics([response.data, ...topics])
      setShowCreateModal(false)
      setFormData({
        title: '',
        description: '',
        subject: '',
        difficulty: 'beginner'
      })
      toast.success('Topic created successfully!')
    } catch (error) {
      console.error('Error creating topic:', error)
      toast.error(error.response?.data?.error || 'Failed to create topic')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEditTopic = (topic) => {
    setEditingTopic(topic)
    setFormData({
      title: topic.title,
      description: topic.description,
      subject: topic.subject,
      difficulty: topic.difficulty
    })
    setShowEditModal(true)
  }

  const handleUpdateTopic = async (e) => {
    e.preventDefault()
    setEditLoading(true)

    try {
      const response = await topicsAPI.update(editingTopic.id, formData)
      setTopics(topics.map(topic => 
        topic.id === editingTopic.id ? response.data : topic
      ))
      setShowEditModal(false)
      setEditingTopic(null)
      setFormData({
        title: '',
        description: '',
        subject: '',
        difficulty: 'beginner'
      })
      toast.success('Topic updated successfully!')
    } catch (error) {
      console.error('Error updating topic:', error)
      toast.error(error.response?.data?.error || 'Failed to update topic')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(true)
    try {
      await topicsAPI.delete(topicId)
      setTopics(topics.filter(topic => topic.id !== topicId))
      toast.success('Topic deleted successfully!')
    } catch (error) {
      console.error('Error deleting topic:', error)
      toast.error(error.response?.data?.error || 'Failed to delete topic')
    } finally {
      setDeleteLoading(false)
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Study Topics</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Topic
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary inline-flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics yet</h3>
            <p className="text-gray-500 mb-4">Create your first study topic to get started with AI-generated notes.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Topic
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div key={topic.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTopic(topic)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit topic"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      disabled={deleteLoading}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete topic"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {topic.difficulty}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {topic.status}
                  </span>
                </div>
                <button
                  className="btn-primary w-full"
                  onClick={async () => {
                    try {
                      await topicsAPI.generateNotes(topic.id);
                      toast.success('Notes generated!');
                      // Optionally, refresh topics or notes here
                    } catch (err) {
                      toast.error('Failed to generate notes');
                    }
                  }}
                >
                  Generate Notes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Topic</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., JavaScript Promises"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of what you want to learn..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 btn-primary"
                  >
                    {createLoading ? 'Creating...' : 'Create Topic'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {showEditModal && editingTopic && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Topic</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingTopic(null)
                    setFormData({
                      title: '',
                      description: '',
                      subject: '',
                      difficulty: 'beginner'
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., JavaScript Promises"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of what you want to learn..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 btn-primary"
                  >
                    {editLoading ? 'Updating...' : 'Update Topic'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingTopic(null)
                      setFormData({
                        title: '',
                        description: '',
                        subject: '',
                        difficulty: 'beginner'
                      })
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Topics 