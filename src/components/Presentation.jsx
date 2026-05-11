import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import lessonsData from '../data/lessons.json'
import { useProgress } from '../context/ProgressContext.jsx'

export default function Presentation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lessonId = Number(id)
  const lesson = lessonsData.lessons.find((l) => l.id === lessonId)
  const { isCompleted, toggleCompleted } = useProgress()
  const [index, setIndex] = useState(0)
  const [showThumbs, setShowThumbs] = useState(false)

  if (!lesson) {
    navigate('/', { replace: true })
    return null
  }

  if (lesson.status === 'coming-soon' || !lesson.slides?.length) {
    return <ComingSoonFullscreen lesson={lesson} onClose={() => navigate('/')} />
  }

  const slides = lesson.slides
  const total = slides.length
  const slide = slides[index]
  const done = isCompleted(lesson.id)

  const go = useCallback((newIdx) => {
    if (newIdx < 0 || newIdx >= total) return
    setIndex(newIdx)
  }, [total])

  const prev = useCallback(() => go(index - 1), [go, index])
  const next = useCallback(() => go(index + 1), [go, index])
  const close = useCallback(() => navigate('/'), [navigate])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') prev()
      else if (e.key === 'ArrowLeft') next()
      else if (e.key === 'Escape') close()
      else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, close])

  return (
    <div className="fixed inset-0 z-[100] bg-bg flex flex-col"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,229,147,0.06), transparent 60%)'
      }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-line bg-bg-side/60 backdrop-blur-sm shrink-0">
        <div className="flex items-baseline gap-3">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="mono text-[0.6rem] font-bold text-brand border border-brand px-1.5 py-0.5 rounded-sm tracking-kicker -translate-y-px">
              STARTER
            </span>
            <span className="font-display font-black text-base text-ink-100 group-hover:text-brand transition">AI Lab</span>
          </Link>
          <span className="text-ink-700 mono text-xs">/</span>
          <span className="mono text-xs uppercase tracking-mono text-ink-500">
            שיעור {lesson.number} · {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="mono text-sm text-ink-500 hidden sm:block">
            <strong className="text-brand font-bold">{String(index + 1).padStart(2, '0')}</strong>
            <span className="text-ink-700 mx-1">/</span>
            {String(total).padStart(2, '0')}
          </span>
          <button
            onClick={() => setShowThumbs(!showThumbs)}
            className="grid place-items-center w-10 h-10 border border-line text-ink-300 hover:text-brand hover:border-brand rounded-sm transition"
            title="תוכן השיעור"
          >
            ⊞
          </button>
          <button
            onClick={close}
            className="grid place-items-center w-10 h-10 border border-line text-ink-300 hover:text-warn hover:border-warn rounded-sm transition"
            title="יציאה (ESC)"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-bg-elev relative overflow-hidden shrink-0">
        <div
          className="absolute inset-y-0 right-0 bg-brand transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide stage */}
      <main className="flex-1 relative overflow-y-auto">
        <SlideRenderer slide={slide} />

        {/* Side nav arrows */}
        {index > 0 && (
          <button
            onClick={prev}
            className="hidden sm:grid place-items-center fixed right-6 top-1/2 -translate-y-1/2 w-14 h-14 border border-line bg-bg-side/80 backdrop-blur text-ink-300 hover:text-brand hover:border-brand rounded-sm transition z-10"
            aria-label="שקף קודם"
          >
            <span className="text-2xl">→</span>
          </button>
        )}
        {index < total - 1 && (
          <button
            onClick={next}
            className="hidden sm:grid place-items-center fixed left-6 top-1/2 -translate-y-1/2 w-14 h-14 border border-line bg-bg-side/80 backdrop-blur text-ink-300 hover:text-brand hover:border-brand rounded-sm transition z-10"
            aria-label="שקף הבא"
          >
            <span className="text-2xl">←</span>
          </button>
        )}
      </main>

      {/* Bottom bar */}
      <footer className="flex items-center justify-between px-6 sm:px-10 py-3 border-t border-line bg-bg-side/60 backdrop-blur-sm shrink-0 gap-3">
        <button
          onClick={prev}
          disabled={index === 0}
          className="btn-mono border border-line text-ink-300 hover:border-brand hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed sm:hidden"
        >
          → קודם
        </button>

        <div className="flex-1 mono text-xs text-ink-700 hidden sm:flex items-center gap-4">
          <span>← / → ניווט</span>
          <span>·</span>
          <span>F מסך מלא</span>
          <span>·</span>
          <span>ESC יציאה</span>
        </div>

        {index === total - 1 ? (
          <button
            onClick={() => { toggleCompleted(lesson.id); }}
            className={done ? 'btn-mono border border-brand text-brand bg-brand/[0.08]' : 'btn-mono bg-brand text-black'}
          >
            {done ? '✓ הושלם' : 'סמן כהושלם'}
          </button>
        ) : (
          <button
            onClick={next}
            className="btn-mono bg-brand text-black"
          >
            הבא ←
          </button>
        )}
      </footer>

      {/* Thumbnails overlay */}
      {showThumbs && (
        <ThumbnailsOverlay
          slides={slides}
          currentIndex={index}
          onSelect={(i) => { go(i); setShowThumbs(false); }}
          onClose={() => setShowThumbs(false)}
        />
      )}
    </div>
  )
}

function ThumbnailsOverlay({ slides, currentIndex, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm grid place-items-center p-6" onClick={onClose}>
      <div className="card-elev p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="kicker">תוכן השיעור</div>
          <button onClick={onClose} className="text-ink-500 hover:text-warn">✕</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`text-right p-4 border rounded-sm transition ${
                i === currentIndex
                  ? 'border-brand bg-brand/[0.08]'
                  : 'border-line hover:border-brand/50 hover:bg-bg-card'
              }`}
            >
              <div className="mono text-xs text-brand mb-1 tracking-mono">
                שקף {String(i + 1).padStart(2, '0')}
              </div>
              <div className="text-base font-bold text-ink-100 leading-tight">
                {s.title?.replace(/<[^>]+>/g, '') || s.kicker || '—'}
              </div>
              {s.subtitle && (
                <div className="text-sm text-ink-500 mt-1">{s.subtitle}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ComingSoonFullscreen({ lesson, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-bg grid place-items-center px-6">
      <button onClick={onClose} className="absolute top-6 left-6 grid place-items-center w-10 h-10 border border-line text-ink-300 hover:text-warn hover:border-warn rounded-sm">✕</button>
      <div className="text-center max-w-2xl">
        <div className="kicker justify-center mb-5">בקרוב</div>
        <h1 className="font-display text-5xl sm:text-7xl font-black text-ink-100 tracking-tight leading-none mb-4">
          {lesson.title}
        </h1>
        <p className="text-2xl sm:text-3xl text-ink-300 font-light mb-6">{lesson.subtitle}</p>
        <p className="text-base text-ink-500 leading-relaxed mb-10">{lesson.summary}</p>
        <button onClick={onClose} className="btn-ghost">
          <span className="btn-arrow">→</span>
          חזרה לדאשבורד
        </button>
      </div>
    </div>
  )
}

/* ============ SLIDE RENDERERS ============ */
function SlideRenderer({ slide }) {
  switch (slide.type) {
    case 'cover': return <CoverSlide slide={slide} />
    case 'kicker-title': return <KickerTitleSlide slide={slide} />
    case 'objectives': return <ObjectivesSlide slide={slide} />
    case 'player': return <PlayerSlide slide={slide} />
    case 'comparison': return <ComparisonSlide slide={slide} />
    case 'tools-list': return <ToolsListSlide slide={slide} />
    case 'quote': return <QuoteSlide slide={slide} />
    case 'homework': return <HomeworkSlide slide={slide} />
    case 'recap': return <RecapSlide slide={slide} />
    case 'next-lesson': return <NextLessonSlide slide={slide} />
    case 'code': return <CodeSlide slide={slide} />
    case 'flow': return <FlowSlide slide={slide} />
    default: return <KickerTitleSlide slide={slide} />
  }
}

function SlideStage({ children, image, className = '' }) {
  const isBackground = image?.position === 'background'
  return (
    <div className={`min-h-full px-6 sm:px-16 py-12 sm:py-16 relative ${className}`}>
      {isBackground && (
        <>
          <div className="absolute inset-0 z-0">
            <img src={image.src} alt={image.alt || ''} className="w-full h-full object-cover opacity-25" />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-l from-bg via-bg/80 to-bg/40" />
        </>
      )}
      <div className="relative z-10 max-w-6xl mx-auto h-full">
        {children}
      </div>
    </div>
  )
}

function CoverSlide({ slide }) {
  return (
    <SlideStage image={slide.image}>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-10">{slide.kicker}</div>
        <h1 className="font-display text-6xl sm:text-9xl font-black leading-[0.9] tracking-tight text-ink-100">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="mt-8 text-3xl sm:text-5xl text-ink-300 font-light leading-tight">
            {slide.subtitle}
          </p>
        )}
        {slide.meta?.length > 0 && (
          <div className="mt-16 flex flex-wrap gap-5 text-base mono text-ink-500 uppercase tracking-mono">
            {slide.meta.map((m, i) => (
              <span key={i}>
                {i > 0 && <span className="text-ink-700 ml-5">·</span>}
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </SlideStage>
  )
}

function KickerTitleSlide({ slide }) {
  const hasImage = slide.image?.src && slide.image.position === 'side'
  const hasLogos = slide.logos?.length > 0

  return (
    <SlideStage image={slide.image?.position === 'background' ? slide.image : null}>
      <div className={`grid ${hasImage ? 'lg:grid-cols-2 gap-12' : ''} items-center min-h-[calc(100vh-220px)] py-10`}>
        <div>
          <div className="kicker mb-7">{slide.kicker}</div>
          <h2
            className="font-display text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-ink-100 mb-7"
            dangerouslySetInnerHTML={{ __html: slide.title }}
          />
          {slide.body && (
            <div className="prose-slide max-w-3xl" dangerouslySetInnerHTML={{ __html: slide.body }} />
          )}
          {slide.pullquote && (
            <div className="mt-8 pr-5 border-r-2 border-brand max-w-2xl">
              <p className="text-2xl text-brand font-medium italic leading-snug">{slide.pullquote}</p>
            </div>
          )}
          {hasLogos && (
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-2xl">
              {slide.logos.map((logo, i) => (
                <div key={i} className="card-elev p-6 grid place-items-center hover:border-brand transition aspect-square">
                  <img src={logo.url} alt={logo.name} className="w-12 h-12 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
        {hasImage && (
          <div className="card-elev overflow-hidden aspect-[4/3]">
            <img src={slide.image.src} alt={slide.image.alt || ''} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </SlideStage>
  )
}

function ObjectivesSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        {slide.kicker && <div className="kicker mb-7">{slide.kicker}</div>}
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-ink-100 mb-12">
          {slide.title}
        </h2>
        <ul className="grid sm:grid-cols-2 gap-5">
          {slide.items.map((item, i) => (
            <li key={i} className="flex items-start gap-5 card-elev p-6 border border-line hover:border-brand/40 transition">
              <span className="mono text-brand text-3xl font-bold shrink-0 leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-xl text-ink-100 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideStage>
  )
}

function PlayerSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <div className="flex items-center gap-6 mb-4 flex-wrap">
          {slide.logo && (
            <div className="card-elev p-3 grid place-items-center w-16 h-16 shrink-0">
              <img src={slide.logo} alt={slide.title} className="w-10 h-10 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }} />
            </div>
          )}
          <div className="flex items-baseline gap-4 flex-wrap">
            <h2 className="font-display text-5xl sm:text-7xl font-black leading-none tracking-tight text-ink-100">
              {slide.title}
            </h2>
            {slide.model && (
              <span className="mono text-brand text-sm uppercase tracking-mono px-3 py-1.5 border border-brand/40 rounded-sm bg-brand/[0.08]">
                {slide.model}
              </span>
            )}
          </div>
        </div>
        <p className="text-2xl text-ink-300 mb-8 font-light">{slide.subtitle}</p>
        {slide.body && (
          <div className="prose-slide max-w-3xl mb-8" dangerouslySetInnerHTML={{ __html: slide.body }} />
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {slide.strengths?.length > 0 && (
            <div className="card-elev p-6">
              <div className="kicker-plain text-brand mb-4 text-sm">חוזקות</div>
              <ul className="space-y-2.5">
                {slide.strengths.map((s, i) => (
                  <li key={i} className="text-lg text-ink-300 flex items-start gap-3">
                    <span className="text-brand text-xl mt-0.5 leading-none font-bold">+</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {slide.weaknesses?.length > 0 && (
            <div className="card-elev p-6">
              <div className="kicker-plain text-warn mb-4 text-sm">חולשות</div>
              <ul className="space-y-2.5">
                {slide.weaknesses.map((w, i) => (
                  <li key={i} className="text-lg text-ink-300 flex items-start gap-3">
                    <span className="text-warn text-xl mt-0.5 leading-none font-bold">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {slide.highlight && (
          <div className="mt-6 card-elev p-5 border-r-2 border-brand">
            <p className="text-lg text-ink-100 font-medium">{slide.highlight}</p>
          </div>
        )}
      </div>
    </SlideStage>
  )
}

function ComparisonSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-ink-100 mb-5">
          {slide.title}
        </h2>
        {slide.intro && <p className="text-xl text-ink-300 mb-8 max-w-3xl">{slide.intro}</p>}
        <div className="card-elev overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-card">
                <th className="mono text-xs uppercase tracking-mono text-brand text-right px-6 py-4 border-b border-line">משימה</th>
                <th className="mono text-xs uppercase tracking-mono text-brand text-right px-6 py-4 border-b border-line">הכלי המומלץ</th>
                <th className="mono text-xs uppercase tracking-mono text-brand text-right px-6 py-4 border-b border-line hidden sm:table-cell">למה</th>
              </tr>
            </thead>
            <tbody>
              {slide.rows.map((r, i) => (
                <tr key={i} className="hover:bg-bg-card/50 transition">
                  <td className="px-6 py-4 text-lg text-ink-100 font-medium border-b border-line">{r.task}</td>
                  <td className="px-6 py-4 text-lg text-brand font-bold border-b border-line">{r.tool}</td>
                  <td className="px-6 py-4 text-base text-ink-300 border-b border-line hidden sm:table-cell">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SlideStage>
  )
}

function ToolsListSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-ink-100 mb-5">
          {slide.title}
        </h2>
        {slide.intro && <p className="text-xl text-ink-300 mb-10 max-w-3xl">{slide.intro}</p>}
        <div className="grid sm:grid-cols-2 gap-5">
          {slide.tools.map((tool, i) => (
            <div key={i} className="card-elev p-7 hover:border-brand transition flex items-start gap-5">
              {tool.logo && (
                <div className="card-elev w-14 h-14 grid place-items-center shrink-0">
                  <img src={tool.logo} alt={tool.name} className="w-8 h-8 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="mono text-xs text-brand mb-2 tracking-mono">{tool.num} / כלי</div>
                <h3 className="text-2xl font-extrabold text-ink-100 mb-2">{tool.name}</h3>
                <p className="text-base text-ink-300 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideStage>
  )
}

function QuoteSlide({ slide }) {
  return (
    <SlideStage image={slide.image}>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-ink-100 mb-12">
          {slide.title}
        </h2>
        <div className="relative max-w-4xl">
          <div className="absolute -right-4 -top-12 text-brand/20 font-display text-[12rem] leading-none select-none">"</div>
          <blockquote className="relative pr-8 border-r-4 border-brand">
            <p className="text-3xl sm:text-4xl text-ink-100 font-medium leading-snug italic">
              {slide.quote}
            </p>
          </blockquote>
        </div>
        {slide.body && (
          <div className="prose-slide max-w-3xl mt-10" dangerouslySetInnerHTML={{ __html: slide.body }} />
        )}
      </div>
    </SlideStage>
  )
}

function HomeworkSlide({ slide }) {
  const hasGroups = Array.isArray(slide.groups) && slide.groups.length > 0
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-ink-100 mb-5">
          {slide.title}
        </h2>
        {slide.intro && <p className="text-xl text-ink-300 mb-10 max-w-3xl">{slide.intro}</p>}

        {hasGroups ? (
          <div className="grid lg:grid-cols-2 gap-5">
            {slide.groups.map((group, gi) => (
              <div key={gi} className="card-elev p-6 sm:p-7 hover:border-brand/40 transition">
                <div className="flex items-center gap-4 pb-5 mb-5 border-b border-line">
                  {group.logo && (
                    <div className="card-elev w-12 h-12 grid place-items-center shrink-0 bg-bg-card">
                      <img
                        src={group.logo}
                        alt={group.tool}
                        className="w-7 h-7 object-contain"
                        style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }}
                      />
                    </div>
                  )}
                  <div>
                    <div className="kicker-plain mb-0.5 text-xs">{group.label}</div>
                    <div className="font-display text-2xl font-extrabold text-ink-100">{group.tool}</div>
                  </div>
                </div>
                <ol className="space-y-3">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="grid place-items-center w-8 h-8 shrink-0 bg-brand/[0.12] text-brand mono font-bold rounded-sm text-xs border border-brand/30">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="text-base font-bold text-ink-100 leading-tight">{item.label}</div>
                        {item.detail && <div className="text-sm text-ink-300 mt-1 leading-relaxed">{item.detail}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : (
          <ol className="space-y-3 max-w-4xl">
            {slide.items?.map((item, i) => (
              <li key={i} className="card-elev p-6 flex items-start gap-6 hover:border-brand/40 transition">
                <span className="grid place-items-center w-12 h-12 shrink-0 bg-brand text-black mono font-bold rounded-sm text-base">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="text-xl font-bold text-ink-100 leading-tight">{item.label}</div>
                  {item.detail && <div className="text-base text-ink-300 mt-1.5">{item.detail}</div>}
                </div>
              </li>
            ))}
          </ol>
        )}

        {slide.note && (
          <div className="mt-7 pr-5 border-r-2 border-brand max-w-3xl">
            <p className="text-base text-brand font-medium italic">{slide.note}</p>
          </div>
        )}
      </div>
    </SlideStage>
  )
}

function RecapSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-ink-100 mb-12">
          {slide.title}
        </h2>
        <ul className="space-y-5 max-w-4xl">
          {slide.points.map((p, i) => (
            <li key={i} className="flex items-start gap-6 pb-5 border-b border-line">
              <span className="mono text-brand text-3xl font-bold shrink-0 leading-none mt-1">
                0{i + 1}
              </span>
              <span className="text-2xl text-ink-100 leading-snug">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideStage>
  )
}

function CodeSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-ink-100 mb-5">
          {slide.title}
        </h2>
        {slide.intro && <p className="text-xl text-ink-300 mb-7 max-w-3xl">{slide.intro}</p>}

        <div className="card-elev bg-bg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-bg-side">
            <span className="mono text-[0.65rem] uppercase tracking-kicker text-ink-500">
              {slide.language || 'shell'}
            </span>
            {slide.filename && (
              <span className="mono text-[0.65rem] text-ink-500" dir="ltr">{slide.filename}</span>
            )}
          </div>
          <pre className="p-6 overflow-x-auto" dir="ltr">
            <code className="mono text-brand text-sm sm:text-base leading-relaxed whitespace-pre">
              {slide.code}
            </code>
          </pre>
        </div>

        {slide.explanation && (
          <div className="mt-6 pr-5 border-r-2 border-brand max-w-3xl">
            <p className="text-base text-ink-300 leading-relaxed">{slide.explanation}</p>
          </div>
        )}
      </div>
    </SlideStage>
  )
}

function FlowSlide({ slide }) {
  return (
    <SlideStage>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-ink-100 mb-5">
          {slide.title}
        </h2>
        {slide.intro && <p className="text-xl text-ink-300 mb-10 max-w-3xl">{slide.intro}</p>}

        <ol className="space-y-3 max-w-4xl">
          {slide.steps.map((step, i) => (
            <li key={i} className="relative">
              <div className="card-elev p-6 flex items-start gap-5 hover:border-brand/40 transition">
                <span className="grid place-items-center w-12 h-12 shrink-0 bg-brand text-black mono font-bold rounded-sm text-base">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="text-xl font-bold text-ink-100 leading-tight mb-1.5">{step.label}</div>
                  {step.detail && (
                    <div className="text-base text-ink-300 leading-relaxed">{step.detail}</div>
                  )}
                </div>
              </div>
              {i < slide.steps.length - 1 && (
                <div className="grid place-items-center py-1 -my-1">
                  <span className="text-brand text-3xl leading-none font-bold">↓</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </SlideStage>
  )
}

function NextLessonSlide({ slide }) {
  return (
    <SlideStage image={slide.image}>
      <div className="flex flex-col justify-center min-h-[calc(100vh-220px)] py-10">
        <div className="kicker mb-7">{slide.kicker}</div>
        <div className="card-elev accent-stripe p-10 sm:p-14 max-w-4xl">
          <div className="mono text-xs uppercase tracking-kicker text-ink-500 mb-4">
            שיעור {slide.lessonNumber}
          </div>
          <h2 className="font-display text-5xl sm:text-7xl font-black leading-none tracking-tight text-ink-100 mb-5">
            {slide.title}
          </h2>
          <p className="text-3xl text-brand font-light mb-8">{slide.subtitle}</p>
          <p className="text-xl text-ink-300 leading-relaxed max-w-3xl">{slide.preview}</p>
        </div>
      </div>
    </SlideStage>
  )
}
