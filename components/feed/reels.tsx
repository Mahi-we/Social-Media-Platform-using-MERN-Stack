"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Play, Heart, MessageCircle, Share2, Music2, Volume2, VolumeX, Plus, X, Video, Upload, Scissors, Type, Sparkles } from "lucide-react"

const reels = [
  {
    id: 1,
    author: {
      name: "Ananya",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&h=500&fit=crop",
    likes: "12.5K",
    comments: "234",
    music: "Original Audio - Ananya",
    description: "Beautiful sunset vibes",
  },
  {
    id: 2,
    author: {
      name: "Rohan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail: "https://images.unsplash.com/photo-1682687221038-404670f01d03?w=300&h=500&fit=crop",
    likes: "8.2K",
    comments: "156",
    music: "Trending Sound",
    description: "Coding life",
  },
  {
    id: 3,
    author: {
      name: "Priya",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=300&h=500&fit=crop",
    likes: "24.1K",
    comments: "512",
    music: "Popular Music",
    description: "Travel diaries",
  },
  {
    id: 4,
    author: {
      name: "Vikram",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail: "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=300&h=500&fit=crop",
    likes: "5.6K",
    comments: "89",
    music: "Vikram Mix",
    description: "Tech review",
  },
]

const trendingSounds = [
  { id: 1, name: "Summer Vibes", artist: "DJ Cool", uses: "1.2M" },
  { id: 2, name: "Chill Beats", artist: "LoFi Studio", uses: "856K" },
  { id: 3, name: "Dance Pop", artist: "Pop Stars", uses: "2.1M" },
  { id: 4, name: "Acoustic Cover", artist: "Guitar Hero", uses: "432K" },
]

export function Reels() {
  const [activeReel, setActiveReel] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [step, setStep] = useState<"upload" | "edit" | "details">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSelectedVideo(url)
      setStep("edit")
    }
  }

  const handlePost = () => {
    // Here you would upload the reel
    setShowCreateModal(false)
    setSelectedVideo(null)
    setCaption("")
    setSelectedSound(null)
    setStep("upload")
  }

  const resetModal = () => {
    setShowCreateModal(false)
    setSelectedVideo(null)
    setCaption("")
    setSelectedSound(null)
    setStep("upload")
  }

  return (
    <>
      <div className="bg-card rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Reels</h2>
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            See All
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Create Reel Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="relative min-w-[140px] w-[140px] h-[220px] rounded-xl overflow-hidden cursor-pointer group bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-dashed border-primary/50 hover:border-primary transition-colors flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center px-2">
              <p className="text-sm font-semibold text-foreground">Create Reel</p>
              <p className="text-xs text-muted-foreground mt-1">Share a video</p>
            </div>
          </button>

          {reels.map((reel) => (
            <div
              key={reel.id}
              className="relative min-w-[140px] w-[140px] h-[220px] rounded-xl overflow-hidden cursor-pointer group"
              onMouseEnter={() => setActiveReel(reel.id)}
              onMouseLeave={() => setActiveReel(null)}
            >
              {/* Thumbnail */}
              <Image
                src={reel.thumbnail}
                alt={reel.description}
                fill
                className="object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Play Button Overlay */}
              {activeReel !== reel.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Active State - Simulated Video Playing */}
              {activeReel === reel.id && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMuted(!isMuted)
                    }}
                    className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              )}

              {/* Author Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={reel.author.avatar}
                    alt={reel.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-xs text-white font-medium truncate">
                    {reel.author.name}
                  </span>
                </div>

                <p className="text-xs text-white/80 truncate mb-2">
                  {reel.description}
                </p>

                {/* Music */}
                <div className="flex items-center gap-1 mb-2">
                  <Music2 className="w-3 h-3 text-white/70" />
                  <span className="text-[10px] text-white/70 truncate">
                    {reel.music}
                  </span>
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-white/70" />
                    <span className="text-[10px] text-white/70">{reel.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-white/70" />
                    <span className="text-[10px] text-white/70">{reel.comments}</span>
                  </div>
                </div>
              </div>

              {/* Side Actions (visible on hover) */}
              {activeReel === reel.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Reel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                {step !== "upload" && (
                  <button
                    onClick={() => setStep(step === "details" ? "edit" : "upload")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back
                  </button>
                )}
                <h3 className="text-lg font-semibold text-foreground">
                  {step === "upload" && "Create New Reel"}
                  {step === "edit" && "Edit Your Reel"}
                  {step === "details" && "Add Details"}
                </h3>
              </div>
              <button
                onClick={resetModal}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step 1: Upload */}
              {step === "upload" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Video className="w-12 h-12 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Upload a Video
                  </h4>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    Select a video from your device. Supported formats: MP4, MOV, WebM (max 60 seconds)
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      Select Video
                    </button>
                  </div>
                  <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <span>Trim video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Music2 className="w-4 h-4" />
                      </div>
                      <span>Add music</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Type className="w-4 h-4" />
                      </div>
                      <span>Add text</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Edit */}
              {step === "edit" && selectedVideo && (
                <div className="flex gap-6">
                  {/* Video Preview */}
                  <div className="flex-1">
                    <div className="relative aspect-[9/16] max-h-[400px] bg-black rounded-xl overflow-hidden mx-auto w-fit">
                      <video
                        src={selectedVideo}
                        className="h-full w-auto object-contain"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    </div>
                  </div>

                  {/* Edit Tools */}
                  <div className="w-64 space-y-4">
                    <h4 className="font-semibold text-foreground">Edit Tools</h4>
                    
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <Scissors className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Trim</p>
                        <p className="text-xs text-muted-foreground">Cut video length</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Filters</p>
                        <p className="text-xs text-muted-foreground">Apply visual effects</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <Type className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Text</p>
                        <p className="text-xs text-muted-foreground">Add captions</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <Music2 className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Music</p>
                        <p className="text-xs text-muted-foreground">Add background audio</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setStep("details")}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === "details" && selectedVideo && (
                <div className="flex gap-6">
                  {/* Video Preview */}
                  <div className="w-48">
                    <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden">
                      <video
                        src={selectedVideo}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    </div>
                  </div>

                  {/* Details Form */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Caption
                      </label>
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption for your reel..."
                        className="w-full h-24 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {caption.length}/2200
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Add Music
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {trendingSounds.map((sound) => (
                          <button
                            key={sound.id}
                            onClick={() => setSelectedSound(sound.name)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              selectedSound === sound.name
                                ? "bg-primary/20 border border-primary"
                                : "bg-muted/50 hover:bg-muted border border-transparent"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Music2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {sound.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sound.artist} - {sound.uses} uses
                              </p>
                            </div>
                            {selectedSound === sound.name && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="allowComments"
                          defaultChecked
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="allowComments" className="text-sm text-muted-foreground">
                          Allow comments
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {step === "details" && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
                <button
                  onClick={resetModal}
                  className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Share Reel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
