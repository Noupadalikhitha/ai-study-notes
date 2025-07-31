import { useState, useEffect } from 'react'
import { notesAPI, topicsAPI } from '../services/api'
import { Search, FileText, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [readingTimes, setReadingTimes] = useState({})

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
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{note.topic_title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{note.summary}</p>
                  </div>
                  <div className="flex items-center space-x-2">
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
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {note.analytics?.user_rating || 'Not rated'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notes 