import data from '../data/projects.json'

export default function Projects() {
  const { category, projects } = data

  return (
    <div className="space-y-12">
      <header className="pb-7 border-b border-line">
        <div className="kicker mb-5">{category.kicker}</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-ink-100">
          {category.title}
        </h1>
        <p className="mt-5 text-lg text-ink-300 leading-relaxed max-w-2xl">{category.subtitle}</p>
      </header>

      <div className="space-y-6">
        {projects.map((p) => (
          <article key={p.id} className="card-elev overflow-hidden">
            {p.logo ? (
              <div className="grid place-items-center bg-bg-card border-b border-line py-12 px-6">
                <img src={p.logo} alt={p.name} className="max-h-32 w-auto object-contain" />
              </div>
            ) : p.images?.[0] && (
              <div className="aspect-[3/1] bg-bg-card overflow-hidden border-b border-line">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-60" />
              </div>
            )}
            <div className="p-7 sm:p-10">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="kicker mb-3">{p.category}</div>
                  <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-100 tracking-tight">{p.name}</h2>
                  <p className="text-xl text-brand font-light mt-2">{p.tagline}</p>
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer" className="btn-ghost shrink-0">
                    לאתר ↗
                  </a>
                )}
              </div>

              <p className="text-base text-ink-300 leading-relaxed mt-5 max-w-3xl">{p.description}</p>

              {p.tech?.length > 0 && (
                <div className="mt-6">
                  <div className="kicker-plain mb-2">Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t, i) => (
                      <span key={i} className="mono text-xs text-ink-300 bg-bg-card border border-line px-2.5 py-1 rounded-sm tracking-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mt-7">
                {p.features?.length > 0 && (
                  <div className="card-elev p-5 bg-bg-card">
                    <div className="kicker-plain text-brand mb-3 text-sm">פיצ'רים מרכזיים</div>
                    <ul className="space-y-2">
                      {p.features.map((f, i) => (
                        <li key={i} className="text-sm text-ink-300 flex items-start gap-2">
                          <span className="text-brand">▸</span> <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.challenges?.length > 0 && (
                  <div className="card-elev p-5 bg-bg-card">
                    <div className="kicker-plain text-warn mb-3 text-sm">אתגרים</div>
                    <ul className="space-y-2">
                      {p.challenges.map((c, i) => (
                        <li key={i} className="text-sm text-ink-300 flex items-start gap-2">
                          <span className="text-warn">▸</span> <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {p.outcome && (
                <div className="mt-6 border-r-2 border-brand pr-5">
                  <div className="kicker-plain mb-2">תוצאה</div>
                  <p className="text-base text-ink-100">{p.outcome}</p>
                </div>
              )}

              {p.lessonsRelevant?.length > 0 && (
                <div className="mt-6 pt-5 border-t border-line">
                  <div className="text-xs text-ink-500 mono uppercase tracking-mono">
                    רלוונטי לשיעורים: {p.lessonsRelevant.map((n) => `0${n}`).join(' · ')}
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
