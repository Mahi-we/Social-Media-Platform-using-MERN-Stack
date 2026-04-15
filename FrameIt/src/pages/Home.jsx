import { useState, useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PostComposer from '../components/feed/PostComposer'
import PostCard from '../components/feed/PostCard'
import { fetchPosts } from '../lib/api'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPosts = () => {
    setLoading(true)
    fetchPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <MainLayout showRightSidebar={false}>
      <div className="space-y-4 max-w-2xl mx-auto">
        <PostComposer onPostCreated={loadPosts} />

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-card rounded-xl p-4 text-center text-red-400">
            <p>⚠️ Could not load posts — make sure the backend is running.</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">
            No posts yet. Be the first to post!
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={loadPosts} />
        ))}
      </div>
    </MainLayout>
  )
}
