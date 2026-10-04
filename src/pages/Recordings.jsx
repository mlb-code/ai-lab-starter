import recordingsData from '../data/recordings.json'

export default function Recordings() {
  const { intro, items } = recordingsData
  const list = [...items].sort((a, b) => Number(b.lessonNumber) - Number(a.lessonNumber))

  return (
    <div className="max-w-3xl">
      <div className="kicker mb-2">ארכיון</div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-100 mb-3">הקלטות המפגשים</h1>
      <p className="text-ink-500 leading-relaxed mb-8 max-w-xl">{intro}</p>

      {list.length === 0 ? (
        <div className="card-elev p-10 text-center">
          <div className="grid place-items-center w-14 h-14 mx-auto bg-bg-card border border-line rounded-full text-ink-500 mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </div>
          <div className="font-display text-lg font-bold text-ink-100 mb-1.5">עדיין אין הקלטות זמינות</div>
          <p className="text-sm text-ink-500 leading-relaxed max-w-xs mx-auto">
            ההקלטה של המפגש הראשון תתווסף כאן תוך 24 שעות מסיום המפגש בלייב.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {list.map((rec) => (
            <RecordingItem key={rec.fileId} rec={rec} />
          ))}
        </div>
      )}
    </div>
  )
}

function RecordingItem({ rec }) {
  return (
    <div className="card-elev p-5 sm:p-6">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-display text-2xl font-bold text-brand leading-none">{rec.lessonNumber}</span>
        <h3 className="font-display text-xl font-extrabold text-ink-100 leading-tight">{rec.lessonTitle}</h3>
      </div>
      {rec.date && <div className="mono text-xs text-ink-500 tracking-mono mb-4">{rec.date}</div>}
      <div className="aspect-video w-full rounded-sm overflow-hidden border border-line bg-bg-card">
        <iframe
          src={`https://drive.google.com/file/d/${rec.fileId}/preview`}
          title={`הקלטה — מפגש ${rec.lessonNumber}`}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
