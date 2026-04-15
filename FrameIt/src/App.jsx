import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Explore from './pages/Explore'
import Bookmarks from './pages/Bookmarks'
import { Loader2 } from 'lucide-react'

function App() {
  const { currentUser, loading } = useUser()

  // Show full-page spinner while restoring session from token
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
          <p className="text-slate-500 text-sm">Loading FrameIt...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public auth route — redirect to home if already logged in */}
      <Route
        path="/auth"
        element={currentUser ? <Navigate to="/" replace /> : <Auth />}
      />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
