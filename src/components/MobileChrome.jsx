import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import lessonsData from '../data/lessons.json'
import { useAuth } from '../context/AuthContext.jsx'

/* Bottom-nav slots (4 buttons + center FAB) — icons match the sidebar */
const NAV_ITEMS = [
  { to: '/', icon: '⌂', label: 'שיעורים', match: (p) => p === '/' || p.startsWith('/lessons') },
  { to: '/tools/ai', icon: '✦', label: 'כלי AI', match: (p) => p.startsWith('/tools/ai') },
  { to: '/tools/dev', icon: '⚙', label: 'כלי פיתוח', match: (p) => p.startsWith('/tools/dev') },
]

/* "כל הסעיפים" bottom-sheet tiles — matches the sidebar's tool & helper groups */
const SHEET_ITEMS = [
  { to: '/system-requirements', icon: '⚡', label: 'דרישות מערכת' },
  { to: '/setup', icon: '↓', label: 'התקנה והתחלה' },
  { to: '/prompts', icon: '⌘', label: 'תבניות פרומפטים' },
  { to: '/glossary', icon: '☰', label: 'מילון מונחים' },
  { to: '/projects', icon: '◐', label: 'פרויקטים לדוגמה' },
  { to: '/library', icon: '♪', label: 'ספרייה' },
  { to: '/community', icon: '○', label: 'הקהילה' },
]

export default function MobileChrome() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const [profileOpen, setProfileOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [toast, setToast] = useState(false)

  const initial = (user?.name?.[0] || 'ס').toUpperCase()

  /* Lock body scroll while the sheet is open */
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  /* Close menus on route change */
  useEffect(() => {
    setProfileOpen(false)
    setSheetOpen(false)
  }, [path])

  /* Dismiss profile menu on outside tap */
  useEffect(() => {
    if (!profileOpen) return
    const close = (e) => {
      if (!e.target.closest('.m-profile-menu') && !e.target.closest('.m-topbar-avatar')) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [profileOpen])

  const go = (to) => { setSheetOpen(false); navigate(to) }

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2400)
  }

  const sheetActive = SHEET_ITEMS.some((i) => i.to && path.startsWith(i.to))

  return (
    <>
      {/* ===== Top bar ===== */}
      <header className="m-topbar">
        <a
          href={lessonsData.zoomUrl}
          target="_blank"
          rel="noreferrer"
          className="m-topbar-zoom"
          aria-label="כניסה לכיתה"
        >
          ▶ כיתה
        </a>
        <span className="m-topbar-logo">AI Lab</span>
        <button
          className="m-topbar-avatar"
          onClick={() => setProfileOpen((v) => !v)}
          aria-label="תפריט פרופיל"
        >
          {initial}
        </button>
        <div className={`m-profile-menu ${profileOpen ? 'open' : ''}`}>
          <div className="m-profile-greet">שלום, {user?.name || 'סטודנט'}</div>
          <button className="m-profile-item" onClick={logout}>
            <span>←</span> יציאה
          </button>
        </div>
      </header>

      {/* ===== Bottom nav ===== */}
      <nav className="m-nav">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavButton key={item.to} item={item} active={item.match(path)} onClick={() => go(item.to)} />
        ))}

        <button className="m-nav-fab" onClick={showToast} aria-label="עוזר AI Lab">
          <span>AI</span>
          <span>Lab</span>
        </button>

        {NAV_ITEMS.slice(2).map((item) => (
          <NavButton key={item.to} item={item} active={item.match(path)} onClick={() => go(item.to)} />
        ))}

        <button
          className={`m-nav-btn ${sheetOpen || sheetActive ? 'active' : ''}`}
          onClick={() => setSheetOpen((v) => !v)}
          aria-label="עוד"
        >
          <span className="m-nav-icon">☰</span>
          <span>עוד</span>
        </button>
      </nav>

      {/* ===== More-sheet ===== */}
      <div
        className={`m-sheet-backdrop lg:hidden ${sheetOpen ? 'open' : ''}`}
        onClick={() => setSheetOpen(false)}
      />
      <div className={`m-sheet lg:hidden ${sheetOpen ? 'open' : ''}`} role="dialog" aria-label="כל הסעיפים">
        <div className="m-sheet-handle" />
        <div className="m-sheet-title">כל הסעיפים</div>
        <div className="m-sheet-grid">
          {SHEET_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`m-sheet-item ${path.startsWith(item.to) ? 'active' : ''}`}
              onClick={() => go(item.to)}
            >
              <span className="m-sheet-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== FAB placeholder toast ===== */}
      {toast && (
        <div className="lg:hidden fixed left-1/2 -translate-x-1/2 bottom-24 z-[80] bg-bg-elev border border-brand text-ink-100 text-sm font-semibold px-4 py-2.5 rounded-sm shadow-brand">
          העוזר האישי — בקרוב ✦
        </div>
      )}
    </>
  )
}

function NavButton({ item, active, onClick }) {
  return (
    <button className={`m-nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="m-nav-icon">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  )
}
