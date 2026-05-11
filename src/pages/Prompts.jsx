import { useState } from 'react'
import data from '../data/prompts.json'

export default function Prompts() {
  const { category, categories } = data
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [openPrompt, setOpenPrompt] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const current = categories.find((c) => c.id === activeCategory)

  const copy = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-10">
      <header className="pb-7 border-b border-line">
        <div className="kicker mb-5">{category.kicker}</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-ink-100">
          {category.title}
        </h1>
        <p className="mt-5 text-lg text-ink-300 leading-relaxed max-w-2xl">{category.subtitle}</p>
      </header>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => { setActiveCategory(c.id); setOpenPrompt(null) }}
            className={`flex items-center gap-2 px-4 py-3 rounded-sm border text-sm font-semibold transition whitespace-nowrap ${
              activeCategory === c.id
                ? 'bg-brand/[0.08] border-brand text-brand'
                : 'border-line text-ink-300 hover:border-brand/40 hover:text-ink-100'
            }`}
          >
            <span className="mono text-base">{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Active category description */}
      <div className="card-elev p-6 border-r-2 border-brand">
        <p className="text-base text-ink-300 leading-relaxed">{current.description}</p>
      </div>

      {/* Prompts */}
      <div className="space-y-3">
        {current.prompts.map((p) => {
          const isOpen = openPrompt === p.id
          return (
            <div key={p.id} className="card-elev overflow-hidden">
              <button
                onClick={() => setOpenPrompt(isOpen ? null : p.id)}
                className="w-full text-right p-6 flex items-start gap-5 hover:bg-bg-card transition"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-extrabold text-ink-100 mb-1">{p.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{p.description}</p>
                  {p.tags?.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {p.tags.map((t, i) => (
                        <span key={i} className="mono text-[0.65rem] text-brand bg-brand/[0.08] border border-brand/30 px-2 py-0.5 uppercase tracking-mono rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`mono text-brand text-xl shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-line bg-bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="kicker-plain">פרומפט מוכן</div>
                    <button
                      onClick={() => copy(p.prompt, p.id)}
                      className="btn-mono bg-brand text-black"
                    >
                      {copiedId === p.id ? '✓ הועתק' : 'העתקה'}
                    </button>
                  </div>
                  <pre className="bg-bg p-5 rounded-sm border border-line text-ink-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {p.prompt}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
