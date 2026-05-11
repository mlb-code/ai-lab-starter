import { createContext, useContext, useState, useEffect } from 'react'
import usersData from '../data/users.json'

const AuthContext = createContext(null)

const DEMO_PASSWORD = 'ailab2026'
const STORAGE_KEY = 'ai-lab-portal-auth'

function lookupUser(email) {
  const lower = email.toLowerCase().trim()
  return usersData.users.find((u) => u.email.toLowerCase() === lower)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    if (!email.includes('@')) {
      return { ok: false, error: 'נא להזין כתובת מייל תקינה.' }
    }
    if (password !== DEMO_PASSWORD) {
      return { ok: false, error: 'סיסמה שגויה. נסו שוב.' }
    }
    const known = lookupUser(email)
    const fallbackName = email.split('@')[0].replace(/[._-]/g, ' ')
    const u = {
      email,
      name: known?.name || fallbackName || 'סטודנט',
      role: known?.role || 'student'
    }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, demoPassword: DEMO_PASSWORD }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
