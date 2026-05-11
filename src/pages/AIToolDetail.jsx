import { useParams, Link, Navigate } from 'react-router-dom'
import data from '../data/tools-ai.json'

export default function AIToolDetail() {
  const { id } = useParams()
  const tool = data.tools.find((t) => t.id === id)
  if (!tool) return <Navigate to="/tools/ai" replace />

  return (
    <article className="space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mono text-xs uppercase tracking-mono text-ink-500">
        <Link to="/" className="hover:text-brand transition">דאשבורד</Link>
        <span className="text-ink-700">/</span>
        <Link to="/tools/ai" className="hover:text-brand transition">כלי AI</Link>
        <span className="text-ink-700">/</span>
        <span className="text-ink-300">{tool.name}</span>
      </div>

      {/* Header */}
      <header className="pb-7 border-b border-line flex items-start gap-6 flex-wrap">
        <div className="card-elev w-20 h-20 grid place-items-center shrink-0">
          {tool.logo ? (
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-12 h-12 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }}
            />
          ) : (
            <span className="mono text-brand text-3xl font-bold">{tool.name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="kicker mb-3">{tool.category}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight tracking-tight text-ink-100">
            {tool.name}
          </h1>
          <div className="mono text-sm text-ink-500 mt-2 tracking-mono">על ידי · {tool.company}</div>
          <p className="mt-4 text-xl text-ink-300 max-w-3xl leading-relaxed">{tool.tagline}</p>
        </div>
        <a href={tool.url} target="_blank" rel="noreferrer" className="btn-primary shrink-0">
          לאתר
          <span className="btn-arrow">↗</span>
        </a>
      </header>

      {/* Description */}
      <section className="card-elev p-8">
        <p className="text-lg text-ink-300 leading-relaxed">{tool.description}</p>
      </section>

      {/* Strengths + Weaknesses */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="card-elev p-7">
          <div className="kicker-plain text-brand mb-4 text-sm">חוזקות</div>
          <ul className="space-y-2.5">
            {tool.strengths.map((s, i) => (
              <li key={i} className="text-base text-ink-300 flex items-start gap-3">
                <span className="text-brand text-lg mt-0.5 leading-none font-bold">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-elev p-7">
          <div className="kicker-plain text-warn mb-4 text-sm">חולשות</div>
          <ul className="space-y-2.5">
            {tool.weaknesses.map((w, i) => (
              <li key={i} className="text-base text-ink-300 flex items-start gap-3">
                <span className="text-warn text-lg mt-0.5 leading-none font-bold">−</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use cases */}
      <section>
        <div className="section-head">
          <h3>מתי להשתמש בו</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {tool.useCases.map((uc, i) => (
            <div key={i} className="card-elev p-5 flex items-center gap-4">
              <span className="mono text-brand font-bold text-lg w-8 shrink-0">0{i + 1}</span>
              <span className="text-base text-ink-300">{uc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <div className="section-head">
          <h3>תמחור</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {tool.pricing.map((p, i) => (
            <div key={i} className="card-elev p-6">
              <div className="mono text-xs text-brand mb-2 uppercase tracking-mono">{p.tier}</div>
              <div className="font-display text-2xl font-extrabold text-ink-100 mb-1">{p.price}</div>
              <div className="text-xs text-ink-500">{p.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Course relevance */}
      {tool.courseRelevance && (
        <section className="card-elev p-7 border-r-2 border-brand">
          <div className="kicker mb-3">בקורס שלנו</div>
          <p className="text-lg text-ink-100 leading-relaxed">{tool.courseRelevance}</p>
        </section>
      )}
    </article>
  )
}
