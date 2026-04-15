import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchMe, setCurrentUserId, setToken, removeToken, getToken } from '../lib/api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Try to restore session from stored token
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    fetchMe()
      .then((user) => {
        setCurrentUser(user)
        setCurrentUserId(user._id)
      })
      .catch(() => {
        // Token invalid or expired — clear it
        removeToken()
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback((token, user) => {
    setToken(token)
    setCurrentUserId(user._id)
    setCurrentUser(user)
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setCurrentUser(null)
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
