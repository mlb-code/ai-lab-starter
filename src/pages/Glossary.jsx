import { useState, useMemo } from 'react'
import data from '../data/glossary.json'

export default function Glossary() {
  const { category, terms } = data
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const cats = useMemo(() => {
    const set = new Set(terms.map((t) => t.category))
    return ['all', ...set]
  }, [terms])

  const filtered = terms.filter((t) => {
    if (filter !== 'all' && t.category !== filter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.term.toLowerCase().includes(q) ||
      t.translation.includes(search) ||
      t.definition.includes(search)
    )
  })

  return (
    <div className="space-y-10">
      <header className="pb-7 border-b border-line">
        <div className="kicker mb-5">{category.kicker}</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-ink-100">
          {category.title}
        </h1>
        <p className="mt-5 text-lg text-ink-300 leading-relaxed max-w-2xl">{category.subtitle}</p>
      </header>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חפש מונח..."
          className="input flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`btn-mono border ${
                filter === c
                  ? 'bg-brand/[0.08] border-brand text-brand'
                  : 'border-line text-ink-500 hover:border-brand/40 hover:text-ink-100'
              }`}
            >
              {c === 'all' ? 'הכל' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Terms list */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <article key={t.term} className="card-elev p-6 hover:border-brand/40 transition">
            <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
              <h3 className="font-display text-2xl font-extrabold text-ink-100" dir="ltr">
                {t.term}
              </h3>
              <span className="mono text-[0.65rem] text-brand bg-brand/[0.08] border border-brand/30 px-2 py-1 uppercase tracking-mono rounded-sm">
                {t.category}
              </span>
            </div>
            {t.fullName !== t.term && (
              <div className="mono text-xs text-ink-500 mb-3 tracking-mono" dir="ltr">{t.fullName}</div>
            )}
            <div className="text-base text-brand font-semibold mb-3">{t.translation}</div>
            <p className="text-base text-ink-300 leading-relaxed mb-4">{t.definition}</p>
            <div className="border-t border-line pt-4">
              <div className="kicker-plain mb-2">דוגמה</div>
              <p className="text-sm text-ink-300 leading-relaxed">{t.example}</p>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-elev p-10 text-center text-ink-500">
          לא נמצאו מונחים תואמים.
        </div>
      )}
    </div>
  )
}
