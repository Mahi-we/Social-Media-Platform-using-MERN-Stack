import { useState, useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PostCard from '../components/feed/PostCard'
import { Bookmark, Trash2, Loader2 } from 'lucide-react'
import { fetchBookmarks, clearBookmarks } from '../lib/api'
import { useUser } from '../context/UserContext'

export default function Bookmarks() {
  const { currentUser } = useUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBookmarks = () => {
    if (!currentUser?._id) return
    setLoading(true)
    fetchBookmarks(currentUser._id)
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookmarks()
  }, [currentUser?._id])

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all bookmarks?')) return
    try {
      await clearBookmarks(currentUser._id)
      setPosts([])
    } catch (err) {
      alert('Failed to clear bookmarks: ' + err.message)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Bookmarks</h1>
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${posts.length} saved posts`}
                </p>
              </div>
            </div>
            {posts.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-card rounded-xl p-6 text-center text-red-400">
            <p>⚠️ {error}</p>
            <p className="text-sm text-muted-foreground mt-1">Make sure the backend is running.</p>
          </div>
        )}

        {/* Bookmarked Posts */}
        {!loading && !error && posts.length > 0 &&
          posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={loadBookmarks} />
          ))
        }

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-card rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground">
              Save posts you want to revisit later by tapping the bookmark icon.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
