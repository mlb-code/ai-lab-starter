import data from '../data/setup.json'

export default function Setup() {
  const { category, intro, why, steps, checklist, tip } = data

  return (
    <div className="space-y-12">
      <header className="pb-7 border-b border-line">
        <div className="kicker mb-5">{category.kicker}</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-ink-100">
          {category.title}
        </h1>
        <p className="mt-5 text-lg text-ink-300 leading-relaxed max-w-2xl">{category.subtitle}</p>
      </header>

      {/* Intro */}
      <section className="card-elev accent-stripe p-7 sm:p-9">
        <div className="kicker mb-4">למה זה חשוב</div>
        <p className="text-lg text-ink-100 leading-relaxed">{intro}</p>
      </section>

      {/* Why each tool */}
      <section>
        <div className="section-head">
          <h3>הצוות — ולמה כל אחד צריך להיות שם</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {why.map((w, i) => (
            <div key={i} className="card-elev p-6">
              <div className="mono text-xs text-brand mb-2 tracking-mono uppercase">0{i + 1}</div>
              <h4 className="font-display text-xl font-extrabold text-ink-100 mb-3">{w.title}</h4>
              <p className="text-base text-ink-300 leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step by step */}
      <section>
        <div className="section-head">
          <h3>שלבי ההתקנה</h3>
          <span className="mono text-sm text-ink-500 tracking-mono">~{steps.reduce((acc, s) => acc + parseInt(s.duration?.match(/\d+/)?.[0] || 0), 0)} דקות בסה"כ</span>
        </div>
        <ol className="space-y-5">
          {steps.map((step, i) => (
            <li key={i} className="card-elev overflow-hidden">
              <div className="flex items-start gap-5 p-7 sm:p-8">
                <div className="card-elev w-16 h-16 grid place-items-center shrink-0 bg-bg-card">
                  {step.logo ? (
                    <img
                      src={step.logo}
                      alt={step.tool}
                      className="w-8 h-8 object-contain"
                      style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(63%) saturate(389%) hue-rotate(115deg) brightness(96%) contrast(91%)' }}
                    />
                  ) : (
                    <span className="mono text-brand text-xl font-bold">{step.tool[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="mono text-xs text-brand tracking-mono uppercase font-bold">שלב {step.num}</span>
                    {step.duration && (
                      <span className="mono text-xs text-ink-500 tracking-mono">· {step.duration}</span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-100 mb-1">{step.title}</h3>
                  <p className="text-base text-ink-500">{step.subtitle}</p>
                </div>
                <a
                  href={step.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-mono bg-brand text-black hover:bg-brand-glow shrink-0"
                >
                  {step.downloadLabel || 'לאתר'} ↗
                </a>
              </div>

              <div className="border-t border-line p-7 sm:p-8 bg-bg-card/50">
                {step.intro && (
                  <p className="text-base text-ink-300 mb-5">{step.intro}</p>
                )}
                <ol className="space-y-3">
                  {step.actions.map((action, ai) => (
                    <li key={ai} className="flex items-start gap-4">
                      <span className="grid place-items-center w-8 h-8 shrink-0 bg-brand/[0.12] text-brand mono font-bold rounded-sm text-xs border border-brand/30">
                        {String(ai + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="text-base font-bold text-ink-100 leading-tight">{action.label}</div>
                        {action.detail && <div className="text-sm text-ink-300 mt-1 leading-relaxed">{action.detail}</div>}
                      </div>
                    </li>
                  ))}
                </ol>

                {step.code && (
                  <div className="mt-5">
                    <div className="kicker-plain mb-2">פקודה להעתקה</div>
                    <pre className="bg-bg p-4 rounded-sm border border-line overflow-x-auto" dir="ltr">
                      <code className="mono text-brand text-sm">{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Checklist */}
      <section className="card-elev p-8">
        <div className="kicker mb-4">בסוף התהליך</div>
        <h3 className="font-display text-2xl font-extrabold text-ink-100 mb-5">צ'קליסט סיום</h3>
        <ul className="space-y-3">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-ink-300">
              <span className="grid place-items-center w-6 h-6 shrink-0 border border-brand text-brand rounded-sm text-xs font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tip */}
      {tip && (
        <div className="card-elev p-6 border-r-2 border-brand">
          <div className="kicker mb-3">טיפ קטן</div>
          <p className="text-base text-ink-100 leading-relaxed">{tip}</p>
        </div>
      )}
    </div>
  )
}
