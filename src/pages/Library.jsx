import data from '../data/library.json'

export default function Library() {
  const { category, sections } = data

  return (
    <div className="space-y-12">
      <header className="pb-7 border-b border-line">
        <div className="kicker mb-5">{category.kicker}</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-ink-100">
          {category.title}
        </h1>
        <p className="mt-5 text-lg text-ink-300 leading-relaxed max-w-2xl">{category.subtitle}</p>
      </header>

      <div className="space-y-12">
        {sections.map((sec, si) => (
          <section key={si}>
            <div className="section-head">
              <h3 className="flex items-center gap-3">
                <span className="mono text-brand text-2xl">{sec.icon}</span>
                {sec.title}
              </h3>
              <span className="mono text-sm text-ink-500 tracking-mono">{sec.items.length} פריטים</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {sec.items.map((item, i) => (
                <a
                  key={i}
                  href={item.url || '#'}
                  target={item.url ? '_blank' : undefined}
                  rel={item.url ? 'noreferrer' : undefined}
                  className={`card-elev p-6 ${item.url ? 'card-hover' : 'opacity-70'} group flex flex-col`}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                    <h4 className="font-display text-xl font-extrabold text-ink-100 leading-tight">{item.name}</h4>
                    {item.frequency && (
                      <span className="mono text-[0.65rem] text-brand bg-brand/[0.08] border border-brand/30 px-2 py-0.5 uppercase tracking-mono rounded-sm">
                        {item.frequency}
                      </span>
                    )}
                  </div>
                  <div className="mono text-xs text-ink-500 mb-3 tracking-mono">מאת · {item.host}</div>
                  <p className="text-sm text-ink-300 leading-relaxed flex-1">{item.description}</p>
                  {item.url && (
                    <div className="mono text-xs text-brand mt-4 pt-3 border-t border-line uppercase tracking-mono font-bold opacity-0 group-hover:opacity-100 transition">
                      להאזנה / צפייה ↗
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
