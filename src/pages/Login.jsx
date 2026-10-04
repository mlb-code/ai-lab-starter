import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// The real login page is the static /login.html at the site root.
export default function Login() {
  const { user, loading } = useAuth()
  useEffect(() => {
    if (!loading && !user) window.location.replace('/login.html')
  }, [loading, user])
  if (!loading && user) return <Navigate to="/" replace />
  return null
}
