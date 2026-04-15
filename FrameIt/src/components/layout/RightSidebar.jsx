import { useState, useEffect } from 'react'
import { BadgeCheck, TrendingUp, Users } from 'lucide-react'
import { fetchSuggestedUsers, followUser } from '../../lib/api'
import { useUser } from '../../context/UserContext'

const trendingTopics = [
  { tag: '#ReactJS', posts: '6.1K posts' },
  { tag: '#AI', posts: '15.8K posts' },
  { tag: '#WebDev', posts: '8.2K posts' },
  { tag: '#TechNews', posts: '12.5K posts' },
  { tag: '#Startup', posts: '4.3K posts' },
]

export default function RightSidebar() {
  const { currentUser } = useUser()
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [following, setFollowing] = useState(new Set())

  useEffect(() => {
    fetchSuggestedUsers()
      .then((users) => {
        // Filter out the current user from suggestions
        setSuggestedUsers(users.filter((u) => u._id !== currentUser?._id).slice(0, 4))
      })
      .catch(() => {})
  }, [currentUser?._id])

  // Init following state from current user's following list
  useEffect(() => {
    if (!currentUser?.following) return
    const ids = new Set(currentUser.following.map((f) => (typeof f === 'string' ? f : f._id?.toString())))
    setFollowing(ids)
  }, [currentUser?.following])

  const handleFollow = async (userId) => {
    if (!currentUser?._id) return
    try {
      await followUser(userId, currentUser._id)
      setFollowing((prev) => {
        const next = new Set(prev)
        next.has(userId) ? next.delete(userId) : next.add(userId)
        return next
      })
    } catch (err) {
      console.error('Follow error:', err)
    }
  }

  // Format member since date
  const memberSince = currentUser?.memberSince || currentUser?.createdAt
    ? new Date(currentUser.memberSince || currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown'

  return (
    <aside className="hidden xl:flex flex-col w-72 p-4 space-y-4">
      {/* Current User Card */}
      {currentUser && (
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white truncate">{currentUser.name}</span>
                {currentUser.verified && <BadgeCheck className="w-4 h-4 text-primary fill-primary flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">@{currentUser.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-secondary rounded-lg p-2">
              <p className="font-bold text-white text-sm">{currentUser.following?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div className="bg-secondary rounded-lg p-2">
              <p className="font-bold text-white text-sm">{currentUser.followers?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="bg-secondary rounded-lg p-2">
              <p className="font-bold text-white text-sm">{currentUser.bookmarks?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">Member since {memberSince}</p>
        </div>
      )}

      {/* Trending Topics */}
      <div className="bg-card rounded-xl p-4">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          Trending
        </h3>
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic.tag}
              className="w-full flex items-center justify-between text-left hover:bg-secondary rounded-lg px-2 py-1.5 transition-colors"
            >
              <span className="text-sm font-medium text-primary">{topic.tag}</span>
              <span className="text-xs text-muted-foreground">{topic.posts}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      {suggestedUsers.length > 0 && (
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            Who to Follow
          </h3>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-2">
                {user.avatar && (
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-white truncate">{user.name}</span>
                    {user.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
                <button
                  onClick={() => handleFollow(user._id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
                    following.has(user._id?.toString())
                      ? 'bg-secondary border border-primary/50 text-primary'
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
    </aside>
  )
}
