import { NavLink } from 'react-router-dom'
import { Home, Hash, Bookmark, User, Settings } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Hash, label: 'Explore', path: '/explore' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-card hover:bg-secondary text-white'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </aside>
  )
}
