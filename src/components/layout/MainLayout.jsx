import { NavLink } from 'react-router-dom'
import { Home, Hash, Bookmark, User, Settings } from 'lucide-react'
import Header from './Header'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

const mobileNavItems = [
  { icon: Home, path: '/' },
  { icon: Hash, path: '/explore' },
  { icon: Bookmark, path: '/bookmarks' },
  { icon: User, path: '/profile' },
  { icon: Settings, path: '/settings' },
]

export default function MainLayout({ children, showRightSidebar = true }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 min-h-[calc(100vh-73px)] pb-20 lg:pb-4">
          {children}
        </main>
        {showRightSidebar && <RightSidebar />}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around py-2 px-4">
        {mobileNavItems.map(({ icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `p-2 rounded-xl transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`
            }
          >
            <Icon className="w-6 h-6" />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
