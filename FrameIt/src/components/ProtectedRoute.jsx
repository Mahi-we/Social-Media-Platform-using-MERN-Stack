import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-slate-500 text-sm">Loading FrameIt...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }

  return children
}
