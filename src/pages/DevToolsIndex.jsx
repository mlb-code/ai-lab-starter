import { Link } from 'react-router-dom'
import data from '../data/tools-dev.json'

const CTA_LABELS = {
  'cursor': 'להורדה',
  'claude-code': 'להוראות',
  'github': 'להרשמה',
  'google-sheets': 'לפתיחה',
  'supabase': 'להרשמה'
}

export default function DevToolsIndex() {
  const { category, tools } = data

  return (
    <div className="space-y-12">
      <header className="pb-7 border-b border-line">
        <div className="kicker mb-5">{category.kicker}</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-ink-100">
          {category.title}
        </h1>
        <p className="mt-5 text-lg text-ink-300 leading-relaxed max-w-2xl">{category.subtitle}</p>
      </header>

      <div className="card-elev accent-stripe p-7 sm:p-8 flex items-center justify-between gap-5 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="kicker mb-3">חדש</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-100 mb-1">
            התקנה והתחלה — סביבת העבודה של יזם AI
          </h2>
          <p className="text-base text-ink-300">
            מדריך מסודר להקמת סביבת העבודה: Cursor, Claude Code, GitHub, Supabase — מה כל אחד עושה ולמה אתה צריך אותם ביחד.
          </p>
        </div>
        <Link to="/setup" className="btn-primary shrink-0">
          למדריך
          <span className="btn-arrow">←</span>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <div key={tool.id} className="card-elev p-7 hover:border-brand transition group flex flex-col">
            <Link to={`/tools/dev/${tool.id}`} className="flex items-start gap-5 flex-1">
              <div className="card-elev w-16 h-16 grid place-items-center shrink-0 bg-bg-card">
                {tool.logo ? (
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-9 h-9 object-contain"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }}
                  />
                ) : (
                  <span className="mono text-brand text-xl font-bold">{tool.name[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mono text-xs text-brand mb-1 tracking-mono uppercase">{tool.category}</div>
                <h3 className="font-display text-2xl font-extrabold text-ink-100 mb-1">{tool.name}</h3>
                <div className="mono text-xs text-ink-700 mb-3 tracking-mono">{tool.company}</div>
                <p className="text-sm text-ink-300 leading-relaxed">{tool.tagline}</p>
              </div>
            </Link>

            <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-3">
              <Link
                to={`/tools/dev/${tool.id}`}
                className="mono text-xs text-ink-500 hover:text-brand uppercase tracking-mono font-bold transition"
              >
                למידע נוסף ←
              </Link>
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="btn-mono bg-brand text-black hover:bg-brand-glow"
              >
                {CTA_LABELS[tool.id] || 'להרשמה'} ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
