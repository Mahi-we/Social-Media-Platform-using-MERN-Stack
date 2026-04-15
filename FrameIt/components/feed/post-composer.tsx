"use client"

import { useState } from "react"
import { ImageIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PostComposer() {
  const [content, setContent] = useState("")

  return (
    <div className="bg-card rounded-xl p-4 shadow-md">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full bg-input rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors">
            <ImageIcon className="w-4 h-4 text-foreground" />
            <span className="text-sm text-foreground">Choose File</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <span className="text-sm text-muted-foreground">No file chosen</span>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
          disabled={!content.trim()}
        >
          <Send className="w-4 h-4 mr-2" />
          Post
        </Button>
      </div>
    </div>
  )
}
