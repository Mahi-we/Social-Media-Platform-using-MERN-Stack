import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Home, Hash, Bell, Bookmark, User, Settings, LogOut, BadgeCheck } from 'lucide-react'
import { useUser } from '../../context/UserContext'

export default function Header() {
  const { currentUser, logout } = useUser()
  const [query, setQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-primary hidden sm:block">FrameIt</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full bg-card border border-border rounded-full py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </form>

        {/* Right side nav */}
        <nav className="flex items-center gap-1">
          <Link to="/" className="p-2 rounded-lg hover:bg-card transition-colors text-primary hidden sm:block">
            <Home className="w-5 h-5" />
          </Link>
          <Link to="/explore" className="p-2 rounded-lg hover:bg-card transition-colors text-white hidden sm:block">
            <Hash className="w-5 h-5" />
          </Link>
          <button className="p-2 rounded-lg hover:bg-card transition-colors text-white relative hidden sm:block">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
          </button>
          <Link to="/bookmarks" className="p-2 rounded-lg hover:bg-card transition-colors text-white hidden sm:block">
            <Bookmark className="w-5 h-5" />
          </Link>

          {/* User avatar + dropdown */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-card transition-colors"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-12 z-20 bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 w-56 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
                          {currentUser?.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">@{currentUser?.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-sm text-white"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-sm text-white"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Settings
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 transition-colors text-sm text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
