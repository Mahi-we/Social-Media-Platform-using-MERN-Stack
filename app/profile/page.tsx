"use client"

import { useState } from "react"
import Image from "next/image"
import { MainLayout } from "@/components/layout/main-layout"
import { BadgeCheck, Camera, Code, Lightbulb, Music } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = ["Posts", "Media", "Likes"]

const mediaItems = [
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
]

const posts = [
  {
    id: 1,
    content: "Just launched my new portfolio website! Check it out.",
    likes: 45,
    comments: 12,
    timestamp: "1 day ago",
  },
  {
    id: 2,
    content: "Learning new technologies every day. The journey never stops!",
    likes: 89,
    comments: 23,
    timestamp: "3 days ago",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Media")

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-card rounded-xl overflow-hidden shadow-md">
          {/* Cover Image */}
          <div className="relative h-40 sm:h-48">
            <Image
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=300&fit=crop"
              alt="Cover"
              fill
              className="object-cover"
            />
            <button className="absolute bottom-3 right-3 p-2 bg-background/80 rounded-lg hover:bg-background transition-colors">
              <Camera className="w-4 h-4 text-foreground" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="relative px-4 pb-4">
            {/* Avatar */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-card overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Name and Badge */}
            <div className="pt-14 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Your Profile</h1>
                <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="text-center">
                  <span className="font-bold text-foreground">120</span>
                  <span className="text-muted-foreground ml-1 text-sm">Followers</span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-foreground">180</span>
                  <span className="text-muted-foreground ml-1 text-sm">Following</span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-foreground">35</span>
                  <span className="text-muted-foreground ml-1 text-sm">Posts</span>
                </div>
              </div>

              {/* Bio Tags */}
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Code className="w-4 h-4 text-primary" />
                  Frontend Dev
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Tech Explorer
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Music className="w-4 h-4 text-pink-500" />
                  Music Lover
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-border/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "Media" && (
          <div className="bg-card rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your Media</h2>
            <div className="grid grid-cols-3 gap-2">
              {mediaItems.map((src, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={src}
                    alt={`Media ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Posts" && (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-card rounded-xl p-4 shadow-md">
                <p className="text-foreground mb-3">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Likes" && (
          <div className="bg-card rounded-xl p-8 shadow-md text-center">
            <p className="text-muted-foreground">Posts you have liked will appear here.</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
