"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { PostCard } from "@/components/feed/post-card"
import { Bookmark } from "lucide-react"

const bookmarkedPosts = [
  {
    id: 1,
    author: {
      name: "Priya",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content: "Beautiful sunset view from my balcony today. Nature never fails to amaze me.",
    image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=500&fit=crop",
    likes: 256,
    comments: 34,
    timestamp: "2 days ago",
  },
  {
    id: 2,
    author: {
      name: "Vikram",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    content: "Just discovered this amazing cafe downtown. The ambiance is perfect for remote work!",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
    likes: 142,
    comments: 18,
    timestamp: "4 days ago",
  },
  {
    id: 3,
    author: {
      name: "Ananya",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content: "Learning something new every day keeps life exciting. Currently exploring AI and machine learning!",
    likes: 89,
    comments: 12,
    timestamp: "1 week ago",
  },
]

export default function BookmarksPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Bookmarks</h1>
              <p className="text-sm text-muted-foreground">
                {bookmarkedPosts.length} saved posts
              </p>
            </div>
          </div>
        </div>

        {/* Bookmarked Posts */}
        <div className="space-y-4">
          {bookmarkedPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* Empty State (shown when no bookmarks) */}
        {bookmarkedPosts.length === 0 && (
          <div className="bg-card rounded-xl p-12 shadow-md text-center">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground">
              Posts you save will appear here. Start exploring and save posts you want to revisit!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
