import { useState, useEffect } from 'react'
import { notesAPI, topicsAPI } from '../services/api'
import { Search, FileText, Clock, Star, Trash2, RefreshCw, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [readingTimes, setReadingTimes] = useState({})
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [regeneratingNotes, setRegeneratingNotes] = useState({}) // Track which notes are being regenerated
  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await notesAPI.getAll()
        setNotes(response.data.results || response.data)
      } catch (error) {
        console.error('Error fetching notes:', error)
        toast.error('Failed to load notes')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  // Track reading time for each note
  useEffect(() => {
    const timers = {}
    
    notes.forEach(note => {
      if (note.topic && note.reading_time_minutes) {
        const requiredSeconds = note.reading_time_minutes * 60
        const noteId = note.id
        
        timers[noteId] = setTimeout(async () => {
          try {
            // Mark topic as completed after reading time
            await topicsAPI.update(note.topic, { status: 'completed' })
            toast.success(`Marked "${note.topic_title}" as completed!`)
            
            // Update the note's topic status locally
            setNotes(prevNotes => 
              prevNotes.map(n => 
                n.id === noteId 
                  ? { ...n, topic_status: 'completed' }
                  : n
              )
            )
          } catch (error) {
            console.error('Error marking topic as completed:', error)
          }
        }, requiredSeconds * 1000) // Convert to milliseconds
      }
    })

    // Cleanup timers on unmount
    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer))
    }
  }, [notes])

  const handleRegenerateNote = async (note) => {
    if (!window.confirm('Are you sure you want to regenerate this note? This will replace the current content.')) {
      return
    }

    setRegeneratingNotes(prev => ({ ...prev, [note.id]: true }))
    try {
      await topicsAPI.regenerateNotes(note.topic)
      toast.success('Note regenerated successfully!')
      // Refresh notes
      const response = await notesAPI.getAll()
      setNotes(response.data.results || response.data)
    } catch (error) {
      console.error('Error regenerating note:', error)
      toast.error(error.response?.data?.error || 'Failed to regenerate note')
    } finally {
      setRegeneratingNotes(prev => ({ ...prev, [note.id]: false }))
    }
  }

  const handleViewNoteDetails = (note) => {
    setSelectedNote(note)
    setShowNoteDetails(true)
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(true)
    try {
      console.log('Attempting to delete note with ID:', noteId)
      const response = await notesAPI.delete(noteId)
      console.log('Delete response:', response)
      setNotes(notes.filter(note => note.id !== noteId))
      toast.success('Note deleted successfully!')
    } catch (error) {
      console.error('Error deleting note:', error)
      console.error('Error response:', error.response)
      console.error('Error data:', error.response?.data)
      toast.error(error.response?.data?.error || error.response?.data?.detail || 'Failed to delete note')
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
        <h1 className="text-2xl font-bold text-gray-900">Study Notes</h1>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-500 mb-4">Generate notes for your topics to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{note.topic_title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{note.summary}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleRegenerateNote(note)}
                      disabled={regeneratingNotes[note.id]}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Regenerate note"
                    >
                      <RefreshCw className={`h-4 w-4 ${regeneratingNotes[note.id] ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deleteLoading}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {note.topic_difficulty}
                    </span>
                    {note.topic_status === 'completed' && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {note.reading_time_minutes} min read
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {note.word_count} words
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewNoteDetails(note)}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {note.analytics?.user_rating || 'Not rated'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Details Modal */}
      {showNoteDetails && selectedNote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">Note Details: {selectedNote.topic_title}</h3>
                <button
                  onClick={() => {
                    setShowNoteDetails(false)
                    setSelectedNote(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedNote.summary}
                  </p>
                </div>

                {/* Key Points */}
                {selectedNote.key_points && selectedNote.key_points.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Key Points</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedNote.key_points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Content */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Full Content</h4>
                  <div className="text-gray-700 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap">{selectedNote.content}</div>
                  </div>
                </div>

                {/* References */}
                {selectedNote.references && selectedNote.references.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">References</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedNote.references.map((ref, index) => (
                        <li key={index}>
                          {typeof ref === 'string' ? ref : ref.title || ref.url || JSON.stringify(ref)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Note Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Reading Time</div>
                    <div className="font-medium">{selectedNote.reading_time_minutes} min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Word Count</div>
                    <div className="font-medium">{selectedNote.word_count}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">AI Model</div>
                    <div className="font-medium">{selectedNote.ai_model_used}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Generated</div>
                    <div className="font-medium">{new Date(selectedNote.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes 