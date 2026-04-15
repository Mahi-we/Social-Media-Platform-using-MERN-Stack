import { useState } from 'react'
import { Image, X } from 'lucide-react'
import { createPost } from '../../lib/api'
import { useUser } from '../../context/UserContext'

export default function PostComposer({ onPostCreated }) {
  const { currentUser } = useUser()
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePost = async () => {
    if ((!content.trim() && !selectedFile) || submitting) return
    if (!currentUser?._id) {
      alert('User not loaded yet. Please wait.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('authorId', currentUser._id)
      formData.append('content', content)
      if (selectedFile) formData.append('image', selectedFile)

      await createPost(formData)
      setContent('')
      setSelectedFile(null)
      setPreview(null)
      onPostCreated?.()
    } catch (err) {
      alert('Failed to create post: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
  }

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        {currentUser?.avatar && (
          <img src={currentUser.avatar} alt="You" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        )}
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-secondary border border-border rounded-xl py-3 px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[80px]"
        />
      </div>

      {preview && (
        <div className="relative mt-1 mb-3 inline-block">
          <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-cover" />
          <button
            onClick={removeFile}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
          <Image className="w-5 h-5" />
          <span className="text-sm">Photo/Video</span>
          <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
        </label>
        {selectedFile && (
          <span className="text-xs text-muted-foreground truncate max-w-xs">{selectedFile.name}</span>
        )}
        <button
          onClick={handlePost}
          disabled={(!content.trim() && !selectedFile) || submitting}
          className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
