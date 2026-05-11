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
        style={{
          top: 'env(safe-area-inset-top, 0px)',
          bottom: 'env(safe-area-inset-bottom, 0px)',
          paddingTop: 'env(safe-area-inset-top, 0px)'
        }}
        className={`fixed right-0 z-[50] flex w-72 flex-col bg-bg-side border-l border-line transition-transform overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-7 border-b border-line">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="mono text-[0.6rem] font-bold text-brand border border-brand px-1.5 py-0.5 rounded-sm tracking-kicker -translate-y-px">
              STARTER
            </span>
            <span className="font-display font-black text-lg text-ink-100">AI Lab</span>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 grid place-items-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-black font-black text-xl shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="mono text-[0.65rem] text-ink-500 uppercase tracking-kicker">שלום</div>
              <div className="font-bold text-ink-100 truncate">
                {user?.name || 'סטודנט'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex-1 flex flex-col gap-1">
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

        {/* Zoom CTA */}
        <a
          href={lessonsData.zoomUrl}
          target="_blank"
          rel="noreferrer"
          className="relative mx-3 my-3 px-5 py-4 bg-gradient-to-br from-brand to-brand-glow text-black font-bold flex items-center gap-3 rounded-sm shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 transition overflow-hidden"
        >
          <span className="relative grid place-items-center w-7 h-7 bg-black/10 rounded-full text-base">
            ▶
          </span>
          <div className="leading-tight">
            <div className="text-base font-extrabold">כניסה לשיעור</div>
            <div className="text-xs font-medium opacity-70">Zoom · בלייב</div>
          </div>
          <span className="absolute top-3 left-4 w-2 h-2 bg-black/40 rounded-full animate-pulse" />
        </a>

      </aside>
    </>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="mono px-3 pt-5 pb-2 text-[0.65rem] font-bold uppercase tracking-kicker text-ink-700 flex items-center justify-between">
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
        `flex items-center gap-3.5 px-4 py-2.5 rounded-sm text-base font-semibold transition border ${
          isActive
            ? 'bg-brand/[0.08] text-brand border-brand'
            : 'text-ink-300 hover:bg-white/5 hover:text-ink-100 border-transparent hover:border-line'
        }`
      }
    >
      <span className="text-base shrink-0 w-5 text-center">{icon}</span>
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
        `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition border ${
          isActive
            ? 'bg-brand/[0.08] text-brand border-brand'
            : locked
              ? 'text-ink-700 cursor-not-allowed border-transparent'
              : 'text-ink-300 hover:bg-white/5 hover:text-ink-100 border-transparent hover:border-line'
        }`
      }
    >
      <span
        className={`mono text-base font-bold shrink-0 w-7 text-center leading-none ${
          done ? 'text-brand' : locked ? 'text-ink-700' : 'text-ink-500'
        }`}
      >
        {done ? '✓' : lesson.number}
      </span>
      <span className="flex-1 truncate">
        <span className="block font-semibold leading-tight">{lesson.title}</span>
        <span className="block text-[11px] text-ink-700 leading-tight font-normal">{lesson.subtitle}</span>
      </span>
      {locked && <span className="text-[10px] mono text-ink-700 shrink-0">בקרוב</span>}
    </NavLink>
  )
}
