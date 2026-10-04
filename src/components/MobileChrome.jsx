import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import lessonsData from '../data/lessons.json'
import Icon from './Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useAssistant } from '../context/AssistantContext.jsx'

/* Bottom-nav slots (4 buttons + center FAB) */
const NAV_ITEMS = [
  { to: '/', icon: 'home', label: 'המפגשים', match: (p) => p === '/' || p.startsWith('/lessons') },
  { to: '/prompts', icon: 'command', label: 'פרומפטים', match: (p) => p.startsWith('/prompts') },
  { to: '/recordings', icon: 'video', label: 'הקלטות', match: (p) => p.startsWith('/recordings') },
]

/* "כל הסעיפים" bottom-sheet tiles */
const SHEET_ITEMS = [
  { to: '/setup', icon: 'download', label: 'התקנה והתחלה' },
  { to: '/system-requirements', icon: 'monitor', label: 'דרישות מערכת' },
  { to: '/tools/ai', icon: 'sparkle', label: 'כלי AI' },
  { to: '/tools/dev', icon: 'cog', label: 'כלי פיתוח' },
  { to: '/glossary', icon: 'list', label: 'מילון מונחים' },
  { to: '/projects', icon: 'folder', label: 'פרויקטים לדוגמה' },
  { to: '/library', icon: 'book', label: 'ספרייה' },
  { to: '/community', icon: 'users', label: 'הקהילה' },
]

export default function MobileChrome() {
  const { user, logout } = useAuth()
  const { setOpen: setAssistantOpen } = useAssistant()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const [profileOpen, setProfileOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const initial = (user?.name?.[0] || 'ס').toUpperCase()

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  useEffect(() => {
    setProfileOpen(false)
    setSheetOpen(false)
  }, [path])

  useEffect(() => {
    if (!profileOpen) return
    const close = (e) => {
      if (!e.target.closest('.m-profile-menu') && !e.target.closest('.m-topbar-avatar')) setProfileOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [profileOpen])

  const go = (to) => { setSheetOpen(false); navigate(to) }
  const sheetActive = SHEET_ITEMS.some((i) => i.to && path.startsWith(i.to))

  return (
    <>
      {/* Top bar */}
      <header className="m-topbar">
        <a href={lessonsData.zoomUrl} target="_blank" rel="noreferrer" className="m-topbar-zoom" aria-label="כניסה לכיתה">
          <Icon name="play" size={11} /> כיתה
        </a>
        <span className="m-topbar-logo">AI Lab<small>STARTER</small></span>
        <button className="m-topbar-avatar" onClick={() => setProfileOpen((v) => !v)} aria-label="תפריט פרופיל">
          {initial}
        </button>
        <div className={`m-profile-menu ${profileOpen ? 'open' : ''}`}>
          <div className="m-profile-greet">שלום, {user?.name || 'סטודנט'}</div>
          <button className="m-profile-item" onClick={logout}>
            <Icon name="logout" size={16} /> יציאה
          </button>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="m-nav">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavButton key={item.to} item={item} active={item.match(path)} onClick={() => go(item.to)} />
        ))}

        <button className="m-nav-fab" onClick={() => setAssistantOpen(true)} aria-label="עוזר AI Lab">
          <span>AI</span>
        </button>

        {NAV_ITEMS.slice(2).map((item) => (
          <NavButton key={item.to} item={item} active={item.match(path)} onClick={() => go(item.to)} />
        ))}

        <button
          className={`m-nav-btn ${sheetOpen || sheetActive ? 'active' : ''}`}
          onClick={() => setSheetOpen((v) => !v)}
          aria-label="עוד"
        >
          <span className="m-nav-icon"><Icon name="menu" size={20} /></span>
          <span>עוד</span>
        </button>
      </nav>

      {/* More-sheet */}
      <div className={`m-sheet-backdrop lg:hidden ${sheetOpen ? 'open' : ''}`} onClick={() => setSheetOpen(false)} />
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
              <span className="m-sheet-icon"><Icon name={item.icon} size={20} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function NavButton({ item, active, onClick }) {
  return (
    <button className={`m-nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="m-nav-icon"><Icon name={item.icon} size={20} /></span>
      <span>{item.label}</span>
    </button>
  )
}
