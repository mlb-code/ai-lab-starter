import { Link } from 'react-router-dom'
import recordingsData from '../data/recordings.json'
import tipsData from '../data/tips.json'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import { useCourse } from '../context/CourseContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const { isCompleted } = useProgress()
  const { lessons, courses, course, setCourse } = useCourse()
  const latestRecording = [...recordingsData.items]
    .sort((a, b) => Number(b.lessonNumber) - Number(a.lessonNumber))[0] || null

  const total = lessons.length
  const done = lessons.filter((l) => isCompleted(l.id)).length
  const nextLesson = lessons.find((l) => !isCompleted(l.id) && l.status === 'available') || lessons[0]

  const todayIdx = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % tipsData.tips.length
  const todaysTip = tipsData.tips[todayIdx]

  const completedLessonsWithHomework = lessons
    .filter((l) => isCompleted(l.id))
    .map((l) => ({ lesson: l, homework: l.slides?.find((s) => s.type === 'homework') }))
    .filter((x) => x.homework)

  const firstName = (user?.name || 'סטודנט').split(' ')[0]

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* Page head */}
      <div>
        <div className="kicker mb-4 sm:mb-5">האזור האישי</div>
        <h1 className="serif-tight text-[2.4rem] sm:text-6xl lg:text-7xl leading-[1.02]">
          שלום, <em className="not-italic text-brand">{firstName}.</em>
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-ink-300 leading-relaxed max-w-xl font-light">
          כל המפגשים, ההקלטות והפרומפטים שלך במקום אחד. ממשיכים מאיפה שעצרנו.
        </p>

        {courses.length > 1 && (
          <div className="mt-8 sm:mt-10 border-t border-line">
            {courses.map((c) => {
              const active = course === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCourse(c.id)}
                  className={`w-full text-right grid grid-cols-[auto,1fr,auto] items-baseline gap-4 sm:gap-6 py-4 sm:py-5 border-b border-line transition ${
                    active ? '' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className={`mono text-[0.68rem] font-bold tracking-[0.16em] ${active ? 'text-brand' : 'text-ink-500'}`}>
                    {active ? 'פעיל' : 'מעבר'}
                  </span>
                  <span className="min-w-0">
                    <span className="font-display text-xl sm:text-2xl font-bold text-ink-100 leading-tight block">{c.title}</span>
                    <span className="text-sm text-ink-500 leading-snug block mt-1">{c.subtitle}</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-brand' : 'bg-line-strong'}`} />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Current lesson */}
      <section className="card-elev accent-stripe relative overflow-hidden p-6 sm:p-10 lg:p-12">
        <div className="kicker mb-4 sm:mb-5">המפגש שלך עכשיו</div>
        <h2 className="serif-tight text-3xl sm:text-5xl lg:text-6xl leading-[1.05] mb-3">
          <span className="mono text-brand text-base sm:text-xl align-middle ml-3">{nextLesson.number}</span>
          {nextLesson.title}
        </h2>
        <p className="text-lg sm:text-xl text-ink-300 font-light leading-snug max-w-2xl mb-6 sm:mb-8">{nextLesson.subtitle}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500 mb-7 sm:mb-9">
          <span>מפגש {nextLesson.number}</span>
          <span className="text-ink-700">·</span>
          <span>כ-{nextLesson.duration}</span>
          <span className="text-ink-700">·</span>
          <span>{nextLesson.slides?.length || 0} שקפים</span>
        </div>
        <Link to={`/lessons/${nextLesson.id}`} className="btn-primary w-full sm:w-auto">
          להמשיך למפגש
          <span className="btn-arrow">←</span>
        </Link>
      </section>

      {/* Recording + tip */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <RecordingCard recording={latestRecording} />
        <DailyTipCard tip={todaysTip} index={todayIdx} total={tipsData.tips.length} />
      </section>

      {/* Lessons */}
      <section>
        <div className="section-head">
          <h3>כל המפגשים</h3>
          <div className="text-sm text-ink-500">
            <strong className="text-brand font-semibold mono">{done}</strong> / <span className="mono">{total}</span> הושלמו
          </div>
        </div>
        <div className="border-t border-line">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} done={isCompleted(lesson.id)} current={lesson.id === nextLesson.id} />
          ))}
        </div>
      </section>

      <PersonalHomeworkSection items={completedLessonsWithHomework} />
    </div>
  )
}

/* ============ RECORDING CARD ============ */
function RecordingCard({ recording }) {
  const hasRecording = recording?.fileId

  if (!hasRecording) {
    return (
      <div className="card-elev p-7 sm:p-8 flex flex-col">
        <div className="kicker mb-5">ההקלטה האחרונה</div>
        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="grid place-items-center w-12 h-12 border border-line rounded-full text-ink-500 mb-4">
            <Icon name="play" size={14} />
          </div>
          <div className="font-display text-xl font-bold text-ink-100 mb-1.5">עדיין אין הקלטה</div>
          <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
            ההקלטה של כל מפגש עולה לכאן תוך 24 שעות מסיום השידור החי.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Link to="/recordings" className="card-elev card-hover p-7 sm:p-8 group flex flex-col">
      <div className="kicker mb-5">ההקלטה האחרונה</div>
      <div className="aspect-video bg-bg-card border border-line grid place-items-center relative overflow-hidden mb-5">
        <div className="grid place-items-center w-14 h-14 rounded-full bg-brand text-[#050605] transition-transform group-hover:scale-105">
          <Icon name="play" size={16} />
        </div>
      </div>
      <div className="text-xs text-ink-500 mb-1">מפגש <span className="mono">{recording.lessonNumber}</span> · {recording.date}</div>
      <h4 className="font-display text-xl font-bold text-ink-100 leading-tight">{recording.lessonTitle}</h4>
      <div className="text-sm text-brand mt-4 pt-3 border-t border-line font-semibold">לצפייה ←</div>
    </Link>
  )
}

/* ============ DAILY TIP ============ */
function DailyTipCard({ tip, index, total }) {
  return (
    <div className="card-elev p-7 sm:p-8 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="kicker">טיפ היום</div>
        <span className="mono text-xs text-ink-700" dir="ltr">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-brand mb-4"><Icon name="idea" size={26} /></div>
        <h4 className="font-display text-xl sm:text-2xl font-bold text-ink-100 leading-tight mb-3">{tip.title}</h4>
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
          <span className="text-sm text-ink-500"><span className="mono">0</span> מפגשים שהושלמו</span>
        </div>
        <div className="border border-dashed border-line p-10 text-center">
          <p className="text-base text-ink-300 leading-relaxed max-w-md mx-auto">
            סמן מפגש כהושלם, וכאן יופיעו שיעורי הבית שלך לפי הסדר.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="section-head">
        <h3>שיעורי הבית שלך</h3>
        <span className="text-sm text-ink-500">
          <strong className="text-brand font-semibold mono">{items.length}</strong> מפגשים שהושלמו
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
        <div className="serif-tight text-4xl text-brand leading-none shrink-0" dir="ltr">{lesson.number}</div>
        <div className="flex-1 min-w-0">
          <div className="kicker mb-2">{homework.kicker || 'משימה'}</div>
          <h4 className="font-display text-2xl font-bold text-ink-100 leading-tight">{homework.title}</h4>
          {homework.intro && <p className="text-base text-ink-300 mt-2 leading-relaxed">{homework.intro}</p>}
        </div>
        <Link to={`/lessons/${lesson.id}`} className="btn-mono border-line text-ink-500 hover:border-line-strong hover:text-ink-100 shrink-0" title="חזרה למצגת">
          למצגת ←
        </Link>
      </div>

      {hasGroups ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {homework.groups.map((group, gi) => (
            <div key={gi} className="card-card p-5">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-line">
                {group.logo && (
                  <div className="border border-line w-9 h-9 grid place-items-center shrink-0">
                    <img src={group.logo} alt={group.tool} className="w-5 h-5 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }} />
                  </div>
                )}
                <div>
                  <div className="kicker-plain text-[0.68rem]">{group.label}</div>
                  <div className="font-semibold text-ink-100 leading-tight">{group.tool}</div>
                </div>
              </div>
              <ol className="space-y-2.5">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mono text-brand text-[0.68rem] font-bold shrink-0 w-5 pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-ink-100 leading-tight">{item.label}</div>
                      {item.detail && <div className="text-xs text-ink-500 mt-0.5 leading-relaxed">{item.detail}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : (
        <ol className="space-y-3">
          {homework.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-sm">
              <span className="mono text-brand text-xs font-bold shrink-0 w-6 pt-1">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1">
                <div className="font-semibold text-ink-100 leading-tight">{item.label}</div>
                {item.detail && <div className="text-xs text-ink-500 mt-0.5 leading-relaxed">{item.detail}</div>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {homework.note && (
        <div className="mt-5 pr-5 border-r-2 border-brand">
          <p className="text-sm text-brand font-medium">{homework.note}</p>
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

  let status = { label: 'לא התחלת', cls: 'text-ink-700' }
  if (done) status = { label: 'הושלם', cls: 'text-brand' }
  else if (current && !locked) status = { label: 'המפגש הבא', cls: 'text-brand' }
  else if (locked) status = { label: 'בקרוב', cls: 'text-ink-700' }

  return (
    <Wrapper
      {...wrapperProps}
      className={`group grid grid-cols-[52px,1fr] sm:grid-cols-[88px,1fr,auto] gap-x-4 sm:gap-x-7 gap-y-1 items-center py-5 sm:py-7 border-b border-line transition ${
        locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className={`serif-tight text-4xl sm:text-6xl leading-none ${done || current ? 'text-brand' : 'text-ink-700'}`} dir="ltr">
        {lesson.number}
      </div>
      <div className="min-w-0">
        <div className={`font-display text-xl sm:text-2xl font-bold leading-tight mb-1 transition ${locked ? 'text-ink-300' : 'text-ink-100 group-hover:text-brand'}`}>
          {lesson.title}
        </div>
        <div className="text-sm sm:text-base text-ink-500 leading-snug">{lesson.subtitle}</div>
      </div>
      <div className={`col-start-2 sm:col-start-auto text-xs sm:text-sm font-semibold whitespace-nowrap ${status.cls}`}>
        {done && <Icon name="check" size={13} className="inline -mt-0.5 ml-1" />}
        {status.label}
      </div>
    </Wrapper>
  )
}
