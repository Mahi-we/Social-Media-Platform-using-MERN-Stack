"use client"

import { useState } from "react"
import Image from "next/image"
import { MainLayout } from "@/components/layout/main-layout"
import { Search, TrendingUp, Hash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const trendingTopics = [
  { tag: "technology", posts: "12.5K" },
  { tag: "photography", posts: "8.2K" },
  { tag: "music", posts: "6.8K" },
  { tag: "travel", posts: "5.4K" },
  { tag: "food", posts: "4.9K" },
]

const categories = ["All", "Photos", "Videos", "People", "Tags"]

const exploreImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
]

const suggestedUsers = [
  {
    name: "Sarah Chen",
    username: "@sarahchen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    followers: "45.2K",
  },
  {
    name: "Alex Kumar",
    username: "@alexk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    followers: "32.1K",
  },
  {
    name: "Maya Patel",
    username: "@mayap",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    followers: "28.9K",
  },
]

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for people, posts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 bg-input border-border/50 rounded-xl py-6"
            />
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Trending Topics</h2>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <button
                key={topic.tag}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium">{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{topic.tag}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-4">Suggested For You</h2>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{user.followers} followers</p>
                  <button className="text-sm text-primary font-medium hover:underline">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Grid */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-4">Discover</h2>
          <div className="grid grid-cols-3 gap-2">
            {exploreImages.map((src, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Explore ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
