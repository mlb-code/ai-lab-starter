import { NavLink } from 'react-router-dom'
import lessonsData from '../data/lessons.json'
import Icon from './Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import { useCourse } from '../context/CourseContext.jsx'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { isCompleted } = useProgress()
  const { course, setCourse, courses, lessons } = useCourse()
  const total = lessons.length
  const done = lessons.filter((l) => isCompleted(l.id)).length
  const initial = (user?.name?.[0] || 'ס').toUpperCase()

  return (
    <aside className="hidden lg:flex fixed inset-y-0 right-0 z-[50] w-72 flex-col bg-bg-side border-l border-line overflow-y-auto">
      {/* Brand + user */}
      <div className="px-6 pt-7 pb-5 border-b border-line">
        <div className="flex items-baseline gap-2.5" dir="ltr">
          <span className="font-display font-bold text-xl text-ink-100 leading-none">AI Lab</span>
          <span className="mono text-[0.58rem] font-bold text-brand tracking-[0.22em] leading-none">STARTER</span>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="w-9 h-9 grid place-items-center rounded-full bg-brand text-[#050605] font-semibold text-sm shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-ink-100 truncate text-sm leading-tight">{user?.name || 'סטודנט'}</div>
            <div className="text-[0.72rem] text-ink-500 leading-tight mt-0.5">האזור האישי</div>
          </div>
        </div>
      </div>

      {/* Zoom */}
      <a
        href={lessonsData.zoomUrl}
        target="_blank"
        rel="noreferrer"
        className="mx-4 mt-4 px-4 py-3 bg-brand text-[#050605] flex items-center gap-3 active:scale-[0.98] transition hover:bg-[#2BF2A6]"
      >
        <span className="grid place-items-center w-7 h-7 rounded-full bg-[#050605]/15 shrink-0"><Icon name="play" size={12} /></span>
        <div className="flex-1 leading-tight">
          <div className="text-sm font-semibold">כניסה לכיתה</div>
          <div className="text-[0.68rem] opacity-75">זום · בשידור חי</div>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-[#050605]/60 animate-pulse shrink-0" />
      </a>

      {/* Course switcher */}
      {courses.length > 1 && (
        <div className="mx-4 mt-5">
          <div className="kicker-plain mb-2">הקורס שלי</div>
          <div className="flex gap-5 border-b border-line">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourse(c.id)}
                className={`pb-2.5 -mb-px text-sm font-semibold border-b-2 transition ${
                  course === c.id ? 'text-ink-100 border-brand' : 'text-ink-500 border-transparent hover:text-ink-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="px-4 py-3 flex-1 flex flex-col">
        <SectionLabel>ראשי</SectionLabel>
        <NavItem to="/" end icon="home">לוח בקרה</NavItem>
        <NavItem to="/recordings" icon="video">הקלטות</NavItem>

        <SectionLabel>
          <span>המפגשים</span>
          <span className="mono text-ink-700 text-[0.62rem]">{done}/{total}</span>
        </SectionLabel>
        <div>
          {lessons.map((l) => (
            <LessonNavItem key={l.id} lesson={l} done={isCompleted(l.id)} />
          ))}
        </div>

        <SectionLabel>ארגז כלים</SectionLabel>
        <NavItem to="/setup" icon="download">התקנה והתחלה</NavItem>
        <NavItem to="/system-requirements" icon="monitor">דרישות מערכת</NavItem>
        <NavItem to="/prompts" icon="command">ספריית פרומפטים</NavItem>
        <NavItem to="/tools/ai" icon="sparkle">כלי AI</NavItem>
        <NavItem to="/tools/dev" icon="cog">כלי פיתוח</NavItem>

        <SectionLabel>עזרים</SectionLabel>
        <NavItem to="/glossary" icon="list">מילון מונחים</NavItem>
        <NavItem to="/projects" icon="folder">פרויקטים לדוגמה</NavItem>
        <NavItem to="/library" icon="book">ספרייה</NavItem>
        <NavItem to="/community" icon="users">הקהילה</NavItem>
      </nav>

      <div className="px-4 py-4 border-t border-line mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-ink-500 hover:text-ink-100 transition"
        >
          <Icon name="logout" size={16} />
          <span>יציאה</span>
        </button>
      </div>
    </aside>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="kicker-plain px-2 pt-5 pb-2 flex items-center justify-between w-full">
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
        `flex items-center gap-3 px-2 py-2 text-[0.92rem] transition border-r-2 ${
          isActive
            ? 'text-brand border-brand font-semibold'
            : 'text-ink-300 border-transparent hover:text-ink-100'
        }`
      }
    >
      <span className="shrink-0 w-5 grid place-items-center opacity-80"><Icon name={icon} size={16} /></span>
      <span>{children}</span>
    </NavLink>
  )
}

function LessonNavItem({ lesson, done, onNavigate }) {
  const locked = lesson.status === 'coming-soon'
  return (
    <NavLink
      to={`/lessons/${lesson.id}`}
      onClick={(e) => { if (locked) e.preventDefault(); else onNavigate?.() }}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-2 text-[0.92rem] transition border-r-2 ${
          isActive
            ? 'text-brand border-brand font-semibold'
            : locked
              ? 'text-ink-700 cursor-not-allowed border-transparent'
              : 'text-ink-300 border-transparent hover:text-ink-100'
        }`
      }
    >
      <span className={`mono text-[0.7rem] font-bold shrink-0 w-5 text-center leading-none ${done ? 'text-brand' : locked ? 'text-ink-700' : 'text-ink-500'}`}>
        {done ? <Icon name="check" size={13} className="inline" /> : lesson.number}
      </span>
      <span className="flex-1 truncate leading-tight">{lesson.title}</span>
      {locked && <span className="text-[0.62rem] text-ink-700 shrink-0">בקרוב</span>}
    </NavLink>
  )
}
