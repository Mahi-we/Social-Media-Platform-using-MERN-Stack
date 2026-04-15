"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { RightSidebar } from "./right-sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  showRightSidebar?: boolean
}

export function MainLayout({ children, showRightSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4">
          {children}
        </main>
        {showRightSidebar && <RightSidebar />}
      </div>
    </div>
  )
}
