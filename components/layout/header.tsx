"use client"

import Link from "next/link"
import { Search, Home, Hash, Bell, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">FrameIt</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-full pl-10 bg-card border-border/50 rounded-full focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Nav Icons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link 
            href="/" 
            className="p-2 rounded-lg hover:bg-card transition-colors text-foreground"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link 
            href="/explore" 
            className="p-2 rounded-lg hover:bg-card transition-colors text-foreground"
          >
            <Hash className="w-5 h-5" />
          </Link>
          <button className="p-2 rounded-lg hover:bg-card transition-colors text-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <Link 
            href="/settings" 
            className="p-2 rounded-lg hover:bg-card transition-colors text-foreground"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <Link 
            href="/profile" 
            className="p-2 rounded-lg hover:bg-card transition-colors text-foreground"
          >
            <User className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
