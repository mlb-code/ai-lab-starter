import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const LOGIN_URL = '/login.html'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  useEffect(() => {
    if (!loading && !user) window.location.replace(LOGIN_URL)
  }, [loading, user])
  if (loading || !user) return null
  return children
}
