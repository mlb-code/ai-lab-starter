import { NavLink } from 'react-router-dom'
import lessonsData from '../data/lessons.json'
import { useAuth } from '../context/AuthContext.jsx'
import { useProgress } from '../context/ProgressContext.jsx'

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth()
  const { completed, isCompleted } = useProgress()
  const total = lessonsData.lessons.length
  const done = completed.length

  const initial = (user?.name?.[0] || 'ס').toUpperCase()

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-[50] flex w-72 flex-col bg-bg-side border-l border-line transition-transform overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-line">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 grid place-items-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-black font-black text-xl shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-ink-100 truncate text-base leading-tight">
                {user?.name || 'סטודנט'}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-sm text-ink-100 leading-none">AI Lab</span>
                <span className="mono text-[0.6rem] font-bold text-brand border border-brand px-1.5 py-0.5 rounded-sm tracking-kicker leading-none">
                  STARTER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom CTA — top */}
        <a
          href={lessonsData.zoomUrl}
          target="_blank"
          rel="noreferrer"
          className="mx-3 mt-3 px-3 py-2.5 bg-gradient-to-br from-brand to-brand-glow text-black font-bold flex items-center gap-2.5 rounded-sm shadow-brand hover:shadow-brand-lg active:scale-[0.98] transition"
        >
          <span className="grid place-items-center w-7 h-7 bg-black/15 rounded-full text-sm shrink-0">▶</span>
          <div className="flex-1 leading-tight">
            <div className="text-sm font-extrabold">כניסה לכיתה</div>
            <div className="text-[10px] font-medium opacity-70">Zoom · בלייב</div>
          </div>
          <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-pulse shrink-0" />
        </a>

        {/* Nav */}
        <nav className="px-3 py-2 flex-1 flex flex-col gap-0.5">
          <SectionLabel>ראשי</SectionLabel>
          <NavItem to="/" end icon="⌂">לוח בקרה</NavItem>

          <SectionLabel>
            <span>השיעורים</span>
            <span className="text-ink-700 font-normal normal-case">{done}/{total}</span>
          </SectionLabel>
          <div className="space-y-1">
            {lessonsData.lessons.map((l) => (
              <LessonNavItem key={l.id} lesson={l} done={isCompleted(l.id)} onNavigate={onClose} />
            ))}
          </div>

          <SectionLabel>ארגז כלים</SectionLabel>
          <NavItem to="/system-requirements" icon="⚡">דרישות מערכת</NavItem>
          <NavItem to="/tools/ai" icon="✦">כלי AI</NavItem>
          <NavItem to="/tools/dev" icon="⚙">כלי פיתוח</NavItem>
          <NavItem to="/setup" icon="↓">התקנה והתחלה</NavItem>
          <NavItem to="/prompts" icon="⌘">תבניות פרומפטים</NavItem>

          <SectionLabel>עזרים</SectionLabel>
          <NavItem to="/glossary" icon="☰">מילון מונחים</NavItem>
          <NavItem to="/projects" icon="◐">פרויקטים לדוגמה</NavItem>
          <NavItem to="/library" icon="♪">ספרייה</NavItem>
          <NavItem to="/community" icon="○">הקהילה</NavItem>
        </nav>
      </aside>
    </>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="mono px-3 pt-3 pb-1 text-[0.6rem] font-bold uppercase tracking-kicker text-ink-700 flex items-center justify-between">
      {children}
    </div>
  )
}

function NavItem({ to, icon, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-1.5 rounded-sm text-sm font-semibold transition border ${
          isActive
            ? 'bg-brand/[0.08] text-brand border-brand'
            : 'text-ink-300 hover:bg-white/5 hover:text-ink-100 border-transparent hover:border-line'
        }`
      }
    >
      <span className="text-sm shrink-0 w-4 text-center">{icon}</span>
      <span>{children}</span>
    </NavLink>
  )
}

function LessonNavItem({ lesson, done, onNavigate }) {
  const locked = lesson.status === 'coming-soon'
  return (
    <NavLink
      to={`/lessons/${lesson.id}`}
      onClick={(e) => {
        if (locked) e.preventDefault()
        else onNavigate?.()
      }}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-sm transition border ${
          isActive
            ? 'bg-brand/[0.08] text-brand border-brand'
            : locked
              ? 'text-ink-700 cursor-not-allowed border-transparent'
              : 'text-ink-300 hover:bg-white/5 hover:text-ink-100 border-transparent hover:border-line'
        }`
      }
    >
      <span
        className={`mono text-sm font-bold shrink-0 w-6 text-center leading-none ${
          done ? 'text-brand' : locked ? 'text-ink-700' : 'text-ink-500'
        }`}
      >
        {done ? '✓' : lesson.number}
      </span>
      <span className="flex-1 truncate font-semibold leading-tight">{lesson.title}</span>
      {locked && <span className="text-[10px] mono text-ink-700 shrink-0">בקרוב</span>}
    </NavLink>
  )
}
