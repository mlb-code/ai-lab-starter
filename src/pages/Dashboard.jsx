import { Link } from 'react-router-dom'
import lessonsData from '../data/lessons.json'
import tipsData from '../data/tips.json'
import { useAuth } from '../context/AuthContext.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import { useCourse } from '../context/CourseContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const { isCompleted } = useProgress()
  const { lessons, courses, course, setCourse } = useCourse()
  const { latestRecording } = lessonsData

  const total = lessons.length
  const done = lessons.filter((l) => isCompleted(l.id)).length
  const nextLesson = lessons.find((l) => !isCompleted(l.id) && l.status === 'available') || lessons[0]

  // Pick today's tip deterministically
  const todayIdx = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % tipsData.tips.length
  const todaysTip = tipsData.tips[todayIdx]

  // Personal homework — only from completed lessons
  const completedLessonsWithHomework = lessons
    .filter((l) => isCompleted(l.id))
    .map((l) => ({ lesson: l, homework: l.slides?.find((s) => s.type === 'homework') }))
    .filter((x) => x.homework)

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Page head */}
      <div className="pb-5 sm:pb-7 border-b border-line">
        <div className="kicker mb-4 sm:mb-5">האזור האישי שלי</div>
        <h1 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl font-black leading-[1] tracking-tight text-ink-100">
          שלום, <em className="not-italic text-brand">{user?.name || 'סטודנט'}.</em>
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-ink-300 leading-relaxed max-w-2xl">
          כל החומרים, השיעורים והמצגות שלך — במקום אחד.
          כשתהיה/י מוכן/ה, נמשיך מאיפה שעצרנו.
        </p>

        {/* Course switcher — only when the user has access to more than one course */}
        {courses.length > 1 && (
        <div className="mt-6 sm:mt-7">
          <div className="kicker mb-3">הקורס שלי</div>
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
            {courses.map((c) => {
              const active = course === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCourse(c.id)}
                  className={`flex-1 text-right p-4 sm:p-5 border rounded-sm transition ${
                    active
                      ? 'border-brand bg-brand/[0.08]'
                      : 'border-line hover:border-brand/50 hover:bg-bg-card'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className={`mono text-[0.7rem] font-bold uppercase tracking-kicker px-2 py-0.5 border rounded-sm ${
                      active ? 'border-brand text-brand' : 'border-line text-ink-500'
                    }`}>
                      {c.label}
                    </span>
                    <span className={`font-display text-lg font-extrabold leading-none ${
                      active ? 'text-ink-100' : 'text-ink-300'
                    }`}>
                      {c.title}
                    </span>
                  </div>
                  <p className="text-sm text-ink-500 leading-snug">{c.subtitle}</p>
                </button>
              )
            })}
          </div>
        </div>
        )}
      </div>

      {/* Hero card — current lesson */}
      <section className="card-elev accent-stripe relative overflow-hidden p-6 sm:p-10 lg:p-12"
        style={{ background: 'linear-gradient(135deg, rgba(16,229,147,0.08), rgba(16,229,147,0.02)), #101010' }}
      >
        <div className="kicker mb-3 sm:mb-4">השיעור שלך עכשיו</div>
        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink-100 mb-3">
          {nextLesson.title} <span className="text-ink-500 font-normal block sm:inline">— {nextLesson.subtitle}</span>
        </h2>
        <div className="mono text-xs sm:text-sm text-ink-500 uppercase tracking-mono mb-6 sm:mb-8 flex flex-wrap gap-3 sm:gap-5">
          <span>שיעור {nextLesson.number}</span>
          <span className="text-ink-700">·</span>
          <span>~{nextLesson.duration}</span>
          <span className="text-ink-700">·</span>
          <span>{nextLesson.slides?.length || 0} שקפים</span>
        </div>
        <Link to={`/lessons/${nextLesson.id}`} className="btn-primary w-full sm:w-auto justify-center sm:justify-start">
          להמשיך לשיעור
          <span className="btn-arrow">←</span>
        </Link>
      </section>

      {/* Recording + Tip side by side */}
      <section className="grid lg:grid-cols-2 gap-4">
        <RecordingCard recording={latestRecording} />
        <DailyTipCard tip={todaysTip} index={todayIdx} total={tipsData.tips.length} />
      </section>

      {/* Lessons list */}
      <section>
        <div className="section-head">
          <h3>כל השיעורים</h3>
          <div className="mono text-sm text-ink-500 tracking-mono">
            <strong className="text-brand font-bold">{done}</strong> / {total} הושלמו
          </div>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} done={isCompleted(lesson.id)} current={lesson.id === nextLesson.id} />
          ))}
        </div>
      </section>

      {/* Personal homework log */}
      <PersonalHomeworkSection items={completedLessonsWithHomework} />
    </div>
  )
}

/* ============ RECORDING CARD ============ */
function RecordingCard({ recording }) {
  const hasRecording = recording?.lessonId && recording?.url

  if (!hasRecording) {
    return (
      <div className="card-elev p-7 flex flex-col">
        <div className="kicker mb-4">ההקלטה האחרונה</div>
        <div className="flex-1 grid place-items-center text-center py-8">
          <div>
            <div className="grid place-items-center w-14 h-14 mx-auto bg-bg-card border border-line rounded-full text-ink-500 mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </div>
            <div className="font-display text-lg font-bold text-ink-100 mb-1.5">
              עדיין אין הקלטה זמינה
            </div>
            <p className="text-sm text-ink-500 leading-relaxed max-w-xs mx-auto">
              ההקלטה של השיעור הראשון תועלה לכאן תוך 24 שעות מסיום השיעור בלייב.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <a
      href={recording.url}
      target="_blank"
      rel="noreferrer"
      className="card-elev p-7 card-hover group flex flex-col"
    >
      <div className="kicker mb-4">ההקלטה האחרונה</div>
      <div className="aspect-video bg-bg-card rounded-sm border border-line grid place-items-center relative overflow-hidden mb-4">
        <div className="grid place-items-center w-14 h-14 rounded-full bg-brand text-black shadow-brand group-hover:shadow-brand-lg transition-all group-hover:scale-105">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        </div>
      </div>
      <div className="mono text-xs text-ink-500 tracking-mono mb-1">
        שיעור {recording.lessonNumber} · {recording.date}
      </div>
      <h4 className="font-display text-xl font-extrabold text-ink-100 leading-tight">
        {recording.lessonTitle}
      </h4>
      <div className="mono text-xs text-brand mt-4 pt-3 border-t border-line uppercase tracking-mono font-bold">
        לצפייה ↗
      </div>
    </a>
  )
}

/* ============ DAILY TIP CARD ============ */
function DailyTipCard({ tip, index, total }) {
  return (
    <div className="card-elev p-7 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="kicker">טיפ יומי</div>
        <span className="mono text-xs text-ink-700 tracking-mono">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-4xl text-brand mb-3 leading-none">💡</div>
        <h4 className="font-display text-xl sm:text-2xl font-extrabold text-ink-100 leading-tight mb-3">
          {tip.title}
        </h4>
        <p className="text-base text-ink-300 leading-relaxed">{tip.body}</p>
      </div>
    </div>
  )
}

/* ============ PERSONAL HOMEWORK ============ */
function PersonalHomeworkSection({ items }) {
  if (items.length === 0) {
    return (
      <section>
        <div className="section-head">
          <h3>שיעורי הבית שלך</h3>
          <span className="mono text-sm text-ink-500 tracking-mono">0 שיעורים שהושלמו</span>
        </div>
        <div className="card-elev p-10 text-center border-dashed">
          <div className="kicker justify-center mb-3">ריק</div>
          <p className="text-base text-ink-300 leading-relaxed max-w-md mx-auto">
            סמן/י שיעור כהושלם — וכאן יופיעו שיעורי הבית שלך לפי הסדר.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="section-head">
        <h3>שיעורי הבית שלך</h3>
        <span className="mono text-sm text-ink-500 tracking-mono">
          <strong className="text-brand font-bold">{items.length}</strong> שיעורים שהושלמו
        </span>
      </div>
      <div className="space-y-4">
        {items.map(({ lesson, homework }) => (
          <HomeworkCard key={lesson.id} lesson={lesson} homework={homework} />
        ))}
      </div>
    </section>
  )
}

function HomeworkCard({ lesson, homework }) {
  const hasGroups = Array.isArray(homework.groups) && homework.groups.length > 0

  return (
    <article className="card-elev p-7 sm:p-8">
      <div className="flex items-start gap-5 pb-5 mb-6 border-b border-line">
        <div className="mono text-3xl font-bold text-brand leading-none shrink-0">
          {lesson.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="kicker mb-2">{homework.kicker || 'משימה'}</div>
          <h4 className="font-display text-2xl font-extrabold text-ink-100 leading-tight">{homework.title}</h4>
          {homework.intro && (
            <p className="text-base text-ink-300 mt-2 leading-relaxed">{homework.intro}</p>
          )}
        </div>
        <Link
          to={`/lessons/${lesson.id}`}
          className="btn-mono border border-line text-ink-500 hover:border-brand hover:text-brand shrink-0"
          title="חזרה למצגת"
        >
          למצגת ←
        </Link>
      </div>

      {hasGroups ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {homework.groups.map((group, gi) => (
            <div key={gi} className="card-elev p-5 bg-bg-card">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-line">
                {group.logo && (
                  <div className="card-elev w-9 h-9 grid place-items-center shrink-0">
                    <img
                      src={group.logo}
                      alt={group.tool}
                      className="w-5 h-5 object-contain"
                      style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }}
                    />
                  </div>
                )}
                <div>
                  <div className="kicker-plain text-[0.65rem]">{group.label}</div>
                  <div className="font-display text-base font-bold text-ink-100 leading-tight">{group.tool}</div>
                </div>
              </div>
              <ol className="space-y-2.5">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="grid place-items-center w-5 h-5 shrink-0 bg-brand/[0.12] text-brand mono font-bold rounded-sm text-[0.6rem] border border-brand/30 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-ink-100 leading-tight">{item.label}</div>
                      {item.detail && <div className="text-xs text-ink-500 mt-0.5 leading-relaxed">{item.detail}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : (
        <ol className="space-y-2.5">
          {homework.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-sm">
              <span className="grid place-items-center w-7 h-7 shrink-0 bg-brand/[0.12] text-brand mono font-bold rounded-sm text-xs border border-brand/30 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="font-bold text-ink-100 leading-tight">{item.label}</div>
                {item.detail && <div className="text-xs text-ink-500 mt-0.5 leading-relaxed">{item.detail}</div>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {homework.note && (
        <div className="mt-5 pr-5 border-r-2 border-brand">
          <p className="text-sm text-brand font-medium italic">{homework.note}</p>
        </div>
      )}
    </article>
  )
}

/* ============ LESSON ROW ============ */
function LessonRow({ lesson, done, current }) {
  const locked = lesson.status === 'coming-soon'
  const Wrapper = locked ? 'div' : Link
  const wrapperProps = locked ? {} : { to: `/lessons/${lesson.id}` }

  let statusLabel = 'לא התחלת'
  let statusClass = 'border-line text-ink-700'
  if (done) {
    statusLabel = 'הושלם'
    statusClass = 'border-brand text-brand'
  } else if (current && !locked) {
    statusLabel = 'הנוכחי'
    statusClass = 'border-brand text-brand bg-brand/[0.08]'
  } else if (locked) {
    statusLabel = 'בקרוב'
    statusClass = 'border-line text-ink-700'
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={`card-elev grid grid-cols-[44px,1fr,auto] sm:grid-cols-[56px,1fr,auto] gap-3 sm:gap-5 items-center px-4 py-4 sm:px-7 sm:py-5 transition-all ${
        locked
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:border-brand hover:bg-bg-card hover:-translate-x-1 active:bg-bg-card cursor-pointer'
      }`}
    >
      <div className="text-center">
        <div className={`mono text-3xl font-bold leading-none tracking-tight ${
          done || current ? 'text-brand' : 'text-ink-700'
        }`}>
          {lesson.number}
        </div>
        {done && <div className="text-brand text-base mt-1">✓</div>}
      </div>
      <div className="min-w-0">
        <div className="text-lg sm:text-xl font-bold text-ink-100 leading-tight tracking-tight mb-1">
          {lesson.title}
        </div>
        <div className="text-sm sm:text-base text-ink-500 leading-snug">
          {lesson.subtitle}
        </div>
      </div>
      <div className={`mono text-[0.7rem] font-bold uppercase tracking-kicker px-3.5 py-2 border rounded-sm whitespace-nowrap ${statusClass}`}>
        {statusLabel}
      </div>
    </Wrapper>
  )
}
