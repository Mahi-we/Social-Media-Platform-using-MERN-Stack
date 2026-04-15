"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus, X, Camera, ImageIcon } from "lucide-react"

const stories = [
  { id: 1, name: "Rohan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", hasStory: true },
  { id: 2, name: "Ananya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", hasStory: true },
  { id: 3, name: "Vikram", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", hasStory: true },
  { id: 4, name: "Priya", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", hasStory: true },
  { id: 5, name: "Arjun", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", hasStory: false },
]

export function Stories() {
  const [showAddStory, setShowAddStory] = useState(false)
  const [storyPreview, setStoryPreview] = useState<string | null>(null)
  const [storyText, setStoryText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setStoryPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePostStory = () => {
    // Here you would typically upload the story to your backend
    setShowAddStory(false)
    setStoryPreview(null)
    setStoryText("")
  }

  return (
    <>
      <div className="bg-card rounded-xl p-4 shadow-md">
        <h2 className="text-lg font-semibold text-foreground mb-4">Stories</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {/* Add Your Story Button */}
          <button
            onClick={() => setShowAddStory(true)}
            className="flex flex-col items-center gap-2 min-w-[70px] group"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-muted/50 border-2 border-dashed border-primary/50 flex items-center justify-center group-hover:border-primary group-hover:bg-muted transition-all">
                <Plus className="w-6 h-6 text-primary" />
              </div>
            </div>
            <span className="text-xs text-primary font-medium truncate max-w-[70px]">
              Add Story
            </span>
          </button>

          {/* Other Users Stories */}
          {stories.map((story) => (
            <button
              key={story.id}
              className="flex flex-col items-center gap-2 min-w-[70px] group"
            >
              <div className="relative">
                <div className={`w-16 h-16 rounded-full p-0.5 ${story.hasStory ? 'bg-gradient-to-tr from-primary to-cyan-400' : 'bg-muted'}`}>
                  <div className="w-full h-full rounded-full bg-card p-0.5">
                    <Image
                      src={story.avatar}
                      alt={story.name}
                      width={60}
                      height={60}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[70px]">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Story Modal */}
      {showAddStory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Create Story</h3>
              <button
                onClick={() => {
                  setShowAddStory(false)
                  setStoryPreview(null)
                  setStoryText("")
                }}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4">
              {!storyPreview ? (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-foreground font-medium mb-1">Add Photo or Video</p>
                    <p className="text-sm text-muted-foreground">Click to browse files</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                    >
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <span className="text-foreground font-medium">Gallery</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                      <Camera className="w-5 h-5 text-primary" />
                      <span className="text-foreground font-medium">Camera</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-[9/16] max-h-[400px] rounded-xl overflow-hidden bg-black">
                    <Image
                      src={storyPreview}
                      alt="Story preview"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Add a caption..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStoryPreview(null)
                        setStoryText("")
                      }}
                      className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl text-foreground font-medium transition-colors"
                    >
                      Change
                    </button>
                    <button
                      onClick={handlePostStory}
                      className="flex-1 py-3 bg-primary hover:bg-primary/90 rounded-xl text-primary-foreground font-medium transition-colors"
                    >
                      Share Story
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  )
}
