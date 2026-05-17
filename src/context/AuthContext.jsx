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
    // Read user authenticated via starter.ai-lab.co.il login
    try {
      const raw = localStorage.getItem('ai_lab_user')
      if (raw) {
        const u = JSON.parse(raw)
        const isAdmin = !!u.isAdmin
        const level = String(u.level || '').toLowerCase()
        setUser({
          email: u.email,
          name: u.name || u.email.split('@')[0],
          role: isAdmin ? 'admin' : 'student',
          isAdmin,
          group: String(u.group || '').toLowerCase(),
          // Course access level: admin → advanced; empty → basic
          level: isAdmin ? 'advanced' : (level || 'basic'),
        })
        setLoading(false)
        return
      }
    } catch {}
    // Fallback: guest (direct access without login)
    setUser({ email: 'guest@ai-lab.co.il', name: 'אורח/ת', role: 'student', level: 'basic' })
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
    const level = String(known?.level || '').toLowerCase()
    const u = {
      email,
      name: known?.name || fallbackName || 'סטודנט',
      role: known?.role || 'student',
      isAdmin: known?.role === 'instructor' || known?.role === 'admin',
      level: level || 'basic'
    }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('ai_lab_user')
    } catch {}
    window.location.href = 'https://starter.ai-lab.co.il/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, demoPassword: DEMO_PASSWORD }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
