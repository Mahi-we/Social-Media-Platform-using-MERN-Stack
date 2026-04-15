import { useState, useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PostCard from '../components/feed/PostCard'
import { Camera, BadgeCheck, Rocket, Lightbulb, Music, Loader2, Edit3, Check, X } from 'lucide-react'
import { fetchUserPosts, fetchLikedPosts, updateUser } from '../lib/api'
import { useUser } from '../context/UserContext'

export default function Profile() {
  const { currentUser, setCurrentUser } = useUser()
  const [activeTab, setActiveTab] = useState('posts')
  const [userPosts, setUserPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingLiked, setLoadingLiked] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState('')
  const [savingBio, setSavingBio] = useState(false)

  useEffect(() => {
    if (!currentUser?._id) return
    setLoadingPosts(true)
    fetchUserPosts(currentUser._id)
      .then(setUserPosts)
      .catch((err) => console.error('Failed to load posts:', err))
      .finally(() => setLoadingPosts(false))
  }, [currentUser?._id])

  useEffect(() => {
    if (activeTab !== 'likes' || !currentUser?._id) return
    setLoadingLiked(true)
    fetchLikedPosts(currentUser._id)
      .then(setLikedPosts)
      .catch((err) => console.error('Failed to load liked posts:', err))
      .finally(() => setLoadingLiked(false))
  }, [activeTab, currentUser?._id])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !currentUser?._id) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const updated = await updateUser(currentUser._id, formData)
      setCurrentUser(updated)
    } catch (err) {
      alert('Failed to update avatar: ' + err.message)
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !currentUser?._id) return
    const formData = new FormData()
    formData.append('coverImage', file)
    try {
      const updated = await updateUser(currentUser._id, formData)
      setCurrentUser(updated)
    } catch (err) {
      alert('Failed to update cover: ' + err.message)
    }
  }

  const handleBioEdit = () => {
    setBioValue(currentUser?.bio || '')
    setEditingBio(true)
  }

  const handleBioSave = async () => {
    if (!currentUser?._id) return
    setSavingBio(true)
    try {
      const formData = new FormData()
      formData.append('bio', bioValue)
      const updated = await updateUser(currentUser._id, formData)
      setCurrentUser(updated)
      setEditingBio(false)
    } catch (err) {
      alert('Failed to update bio: ' + err.message)
    } finally {
      setSavingBio(false)
    }
  }

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </MainLayout>
    )
  }

  const userMedia = userPosts.filter((p) => p.image).map((p) => p.image)

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Cover Image */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src={
              currentUser.coverImage ||
              'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=300&fit=crop'
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <label className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors cursor-pointer">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>

        {/* Profile Info */}
        <div className="bg-card rounded-xl p-6 -mt-16 relative">
          {/* Avatar */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-card object-cover"
              />
              <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer">
                <Camera className="w-3 h-3 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Name and Stats */}
          <div className="pt-14 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
              {currentUser.verified && (
                <BadgeCheck className="w-5 h-5 text-primary fill-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">@{currentUser.username}</p>

            {/* Bio */}
            {editingBio ? (
              <div className="flex items-center gap-2 justify-center mb-4">
                <textarea
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  maxLength={160}
                  rows={2}
                  className="bg-secondary border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none w-full max-w-sm"
                />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleBioSave}
                    disabled={savingBio}
                    className="p-1.5 bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setEditingBio(false)}
                    className="p-1.5 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  {currentUser.bio || 'No bio yet.'}
                </p>
                <button onClick={handleBioEdit} className="p-1 hover:bg-secondary rounded-full transition-colors">
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground hover:text-white" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-6 my-4">
              <div className="text-center">
                <p className="font-bold text-white">{currentUser.followers?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">{currentUser.following?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">{userPosts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </div>

            {/* Bio tags from interests */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Rocket className="w-4 h-4 text-primary" />
                Frontend Dev
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Tech Explorer
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Music className="w-4 h-4 text-pink-500" />
                Music Lover
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl p-2 flex gap-2">
          {['posts', 'media', 'likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'hover:bg-secondary text-muted-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <>
              {loadingPosts && (
                <div className="bg-card rounded-xl p-8 flex justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              {!loadingPosts && userPosts.length === 0 && (
                <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">
                  No posts yet.
                </div>
              )}
              {!loadingPosts && userPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdate={() => fetchUserPosts(currentUser._id).then(setUserPosts).catch(() => {})}
                />
              ))}
            </>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold text-white mb-4">Your Media</h3>
              {userMedia.length === 0 ? (
                <p className="text-muted-foreground text-sm">No media posts yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {userMedia.map((media, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img src={media} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Likes Tab */}
          {activeTab === 'likes' && (
            <>
              {loadingLiked && (
                <div className="bg-card rounded-xl p-8 flex justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              {!loadingLiked && likedPosts.length === 0 && (
                <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">
                  No liked posts yet.
                </div>
              )}
              {!loadingLiked && likedPosts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={() => fetchLikedPosts(currentUser._id).then(setLikedPosts).catch(() => {})} />
              ))}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
