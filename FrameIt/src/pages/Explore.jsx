import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { Search, TrendingUp, Users, BadgeCheck } from 'lucide-react'
import { fetchSuggestedUsers, fetchPosts, followUser } from '../lib/api'
import { useUser } from '../context/UserContext'

const trendingTopics = [
  { id: 1, tag: '#TechNews', posts: '12.5K posts' },
  { id: 2, tag: '#WebDev', posts: '8.2K posts' },
  { id: 3, tag: '#ReactJS', posts: '6.1K posts' },
  { id: 4, tag: '#AI', posts: '15.8K posts' },
  { id: 5, tag: '#Startup', posts: '4.3K posts' },
]

export default function Explore() {
  const { currentUser } = useUser()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [discoverImages, setDiscoverImages] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [following, setFollowing] = useState(new Set())

  // Load suggested users
  useEffect(() => {
    fetchSuggestedUsers()
      .then(setSuggestedUsers)
      .catch((err) => console.error('Could not load suggested users:', err))
  }, [])

  // Sync following state from currentUser
  useEffect(() => {
    if (!currentUser?.following) return
    const ids = new Set(currentUser.following.map((f) => (typeof f === 'string' ? f : f._id?.toString())))
    setFollowing(ids)
  }, [currentUser?.following])

  // Load discover images from posts
  useEffect(() => {
    fetchPosts()
      .then((posts) => {
        const images = posts
          .filter((p) => p.image)
          .map((p) => p.image)
          .slice(0, 9)
        setDiscoverImages(images)
      })
      .catch(() => {})
  }, [])

  // Search posts on backend
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setLoadingSearch(true)
    const timeout = setTimeout(() => {
      fetchPosts(searchQuery)
        .then(setSearchResults)
        .catch(() => setSearchResults([]))
        .finally(() => setLoadingSearch(false))
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleFollow = async (userId) => {
    if (!currentUser?._id) return
    try {
      await followUser(userId, currentUser._id)
      setFollowing((prev) => {
        const next = new Set(prev)
        const id = userId.toString()
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
    } catch (err) {
      console.error('Follow error:', err)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search */}
        <div className="bg-card rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users, posts, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="bg-card rounded-xl p-4">
            <h2 className="font-semibold text-white mb-3">
              {loadingSearch ? 'Searching...' : `Results for "${searchQuery}"`}
            </h2>
            {!loadingSearch && searchResults.length === 0 && (
              <p className="text-muted-foreground text-sm">No posts found.</p>
            )}
            <div className="space-y-3">
              {searchResults.map((post) => (
                <div key={post._id} className="p-3 bg-secondary rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    {post.author?.avatar && (
                      <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <span className="font-medium text-white text-sm">{post.author?.name}</span>
                    <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-white">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Topics */}
        {!searchQuery && (
          <div className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-white">Trending Topics</h2>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.id}
                  className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors text-left"
                >
                  <span className="font-medium text-primary">{topic.tag}</span>
                  <span className="text-sm text-muted-foreground">{topic.posts}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Users */}
        {!searchQuery && (
          <div className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-white">Suggested Users</h2>
            </div>
            <div className="space-y-3">
              {suggestedUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                  {user.avatar && (
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-white truncate">{user.name}</span>
                      {user.verified && (
                        <BadgeCheck className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
                  </div>
                  <button
                    onClick={() => handleFollow(user._id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                      following.has(user._id?.toString())
                        ? 'bg-secondary border border-primary text-primary'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {following.has(user._id?.toString()) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discover Grid */}
        {!searchQuery && discoverImages.length > 0 && (
          <div className="bg-card rounded-xl p-4">
            <h2 className="font-semibold text-white mb-4">Discover</h2>
            <div className="grid grid-cols-3 gap-2">
              {discoverImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={image} alt={`Discover ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
