import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// The real login lives at starter.ai-lab.co.il/login.html: it checks the email against the
// "Adult Course" Google Sheet (Apps Script) and stores the user in localStorage 'ai_lab_user'.
// The portal only trusts that record, re-checks it against the same Apps Script once in a while,
// and never falls back to a guest.
const AUTH_URL = 'https://script.google.com/macros/s/AKfycbz-J5Zz-zLKSe2Ez_SCAkH-jxvKdH8X1Ry2yQLMe5I_la-Vwc7iHX90NDUWZ9bPgLRo/exec'
const LOGIN_URL = '/login.html'
const USER_KEY = 'ai_lab_user'
const CHECKED_KEY = 'ai_lab_user_checked'
const RECHECK_MS = 12 * 60 * 60 * 1000

function normalize(u) {
  const isAdmin = !!u.isAdmin
  const level = String(u.level || '').toLowerCase()
  return {
    email: u.email,
    name: u.name || String(u.email).split('@')[0],
    role: isAdmin ? 'admin' : 'student',
    isAdmin,
    group: String(u.group || '').toLowerCase(),
    // Course access level: admin → advanced; empty → basic
    level: isAdmin ? 'advanced' : (level || 'basic'),
    expires: u.expires || null,
  }
}

function clearStored() {
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(CHECKED_KEY)
    localStorage.removeItem('ai-lab-portal-auth')
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let stored = null
    try {
      const raw = localStorage.getItem(USER_KEY)
      if (raw) stored = JSON.parse(raw)
    } catch {}
    if (!stored || !stored.email) {
      clearStored()
      setLoading(false)
      return
    }
    if (stored.expires && !isNaN(Date.parse(stored.expires)) && new Date(stored.expires) < new Date()) {
      clearStored()
      setLoading(false)
      return
    }
    setUser(normalize(stored))
    setLoading(false)

    // Re-check against the sheet at most once every 12 hours (fail-open on network errors).
    let lastChecked = 0
    try { lastChecked = Number(localStorage.getItem(CHECKED_KEY) || 0) } catch {}
    if (Date.now() - lastChecked < RECHECK_MS) return
    const body = new URLSearchParams()
    body.append('email', stored.email)
    fetch(AUTH_URL, { method: 'POST', body })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.ok && res.user) {
          try {
            localStorage.setItem(USER_KEY, JSON.stringify(res.user))
            localStorage.setItem(CHECKED_KEY, String(Date.now()))
          } catch {}
          setUser(normalize(res.user))
        } else if (res && res.requirePassword) {
          // Admin account: exists, password was checked at login.html.
          try { localStorage.setItem(CHECKED_KEY, String(Date.now())) } catch {}
        } else if (res && res.ok === false) {
          clearStored()
          setUser(null)
          window.location.replace(LOGIN_URL)
        }
      })
      .catch(() => {})
  }, [])

  const logout = () => {
    setUser(null)
    clearStored()
    window.location.href = 'https://starter.ai-lab.co.il/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
