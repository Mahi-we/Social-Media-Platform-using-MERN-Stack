"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostCardProps {
  author: {
    name: string
    avatar: string
    verified?: boolean
  }
  content: string
  image?: string
  likes: number
  comments: number
  timestamp: string
}

export function PostCard({ author, content, image, likes, comments, timestamp }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <article className="bg-card rounded-xl p-4 shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={author.avatar}
            alt={author.name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{author.name}</span>
              {author.verified && (
                <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <p className="text-foreground mb-3 leading-relaxed">{content}</p>

      {/* Image */}
      {image && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            <span>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={cn(
            "p-1 transition-colors",
            isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
        </button>
      </div>
    </article>
  )
}
