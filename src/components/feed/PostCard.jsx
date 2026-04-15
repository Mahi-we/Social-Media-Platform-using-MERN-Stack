import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BadgeCheck, Send, Trash2 } from 'lucide-react'
import { likePost, bookmarkPost, addComment, deletePost } from '../../lib/api'
import { useUser } from '../../context/UserContext'

export default function PostCard({ post, onUpdate }) {
  const { currentUser } = useUser()
  const userId = currentUser?._id

  // Use string comparison for ObjectId arrays returned from MongoDB
  const isLikedInitial = (uid) =>
    post.likes?.some((id) => id?.toString() === uid?.toString()) ?? false
  const isBookmarkedInitial = (user) =>
    user?.bookmarks?.some((b) => {
      const bId = typeof b === 'string' ? b : b?._id?.toString()
      return bId === post._id?.toString()
    }) ?? false

  const [liked, setLiked] = useState(() => isLikedInitial(userId))
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [bookmarked, setBookmarked] = useState(() => isBookmarkedInitial(currentUser))
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])
  const [submitting, setSubmitting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Re-sync liked/bookmarked state when currentUser loads (it starts as null)
  useEffect(() => {
    if (!userId) return
    setLiked(isLikedInitial(userId))
    setBookmarked(isBookmarkedInitial(currentUser))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const author = post.author || {}
  const authorName = author.name || 'Unknown'
  const authorAvatar = author.avatar || ''
  const authorVerified = author.verified || false
  const timeAgo = post.timeAgo || post.time || ''
  const isOwner = userId && author._id?.toString() === userId.toString()

  const handleLike = async () => {
    if (!userId) return
    const prev = liked
    setLiked(!prev)
    setLikesCount((c) => (prev ? c - 1 : c + 1))
    try {
      await likePost(post._id, userId)
    } catch {
      setLiked(prev)
      setLikesCount((c) => (prev ? c + 1 : c - 1))
    }
  }

  const handleBookmark = async () => {
    if (!userId) return
    const prev = bookmarked
    setBookmarked(!prev)
    try {
      await bookmarkPost(post._id, userId)
      onUpdate?.()
    } catch {
      setBookmarked(prev)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !userId || submitting) return
    setSubmitting(true)
    try {
      const updated = await addComment(post._id, userId, commentText.trim())
      setComments(updated)
      setCommentText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    setDeleting(true)
    try {
      await deletePost(post._id)
      onUpdate?.()
    } catch (err) {
      alert('Failed to delete post: ' + err.message)
    } finally {
      setDeleting(false)
      setShowMenu(false)
    }
  }

  return (
    <div className="bg-card rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {authorAvatar && (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-white">{authorName}</span>
              {authorVerified && <BadgeCheck className="w-4 h-4 text-primary fill-primary" />}
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>

        {/* Options menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                )}
                <button
                  onClick={() => { setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Report Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content && <p className="text-white mb-3">{post.content}</p>}

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3">
          <img src={post.image} alt="Post" className="w-full object-cover max-h-96" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-sm">{likesCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments.length}</span>
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={handleBookmark}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-primary text-primary' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  {c.user?.avatar && (
                    <img src={c.user.avatar} alt={c.user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                  )}
                  <div className="bg-secondary rounded-lg px-3 py-1.5 flex-1">
                    <span className="text-xs font-medium text-primary">{c.user?.name || 'User'} </span>
                    <span className="text-sm text-white">{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-secondary border border-border rounded-xl py-2 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
