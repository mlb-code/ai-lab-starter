import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login, demoPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const res = login(email.trim(), password)
      setLoading(false)
      if (!res.ok) setError(res.error)
      else navigate('/')
    }, 350)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-bg-side border-l border-line">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 30% 20%, rgba(16,229,147,0.15), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(16,229,147,0.06), transparent 60%)'
        }} />
        <div className="relative z-10 max-w-md px-12">
          <div className="flex items-baseline gap-2 mb-12">
            <span className="mono text-xs font-bold text-brand border border-brand px-2 py-0.5 rounded-sm tracking-kicker -translate-y-1">
              STARTER
            </span>
            <span className="font-display font-black text-2xl text-ink-100">AI Lab</span>
          </div>

          <div className="kicker mb-6">האזור האישי</div>
          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-ink-100">
            ברוכים הבאים<br />
            <em className="not-italic text-brand">לקורס שלך.</em>
          </h1>
          <p className="mt-6 text-lg text-ink-300 leading-relaxed">
            כל החומרים, השיעורים והכלים — במקום אחד. כשתהיה מוכן, נמשיך מאיפה שעצרנו.
          </p>

          <div className="mt-12 space-y-3">
            {[
              'מצגות מלאות לכל שיעור',
              'מעקב התקדמות אישי',
              'גישה לקהילה ולמרצה'
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-base text-ink-300">
                <span className="mono text-brand font-bold w-8">0{i + 1}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-baseline gap-2 mb-10">
            <span className="font-display font-black text-xl text-ink-100">AI Lab</span>
            <span className="mono text-xs font-bold text-brand border border-brand px-1.5 py-0.5 rounded-sm tracking-kicker -translate-y-px">
              PORTAL
            </span>
          </div>

          <div className="kicker mb-5">התחברות</div>
          <h2 className="font-display text-3xl font-black text-ink-100 mb-3 tracking-tight">
            התחבר/י לאזור האישי
          </h2>
          <p className="text-base text-ink-300 mb-8">
            הזן/י את פרטי הסטודנט/ית שקיבלת באימייל.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mono text-xs uppercase tracking-kicker text-ink-500 block mb-2">
                כתובת אימייל
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mono text-xs uppercase tracking-kicker text-ink-500 block mb-2">
                סיסמה
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn rounded-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'מתחבר…' : 'התחברות'}
              {!loading && <span className="btn-arrow">←</span>}
            </button>
          </form>

          <div className="mt-8 border border-dashed border-line-strong bg-bg-elev px-4 py-3 text-xs text-ink-500 rounded-sm">
            <span className="mono text-brand font-bold ml-1">מצב הדגמה ·</span>
            כל אימייל תקין + סיסמה <code className="mono text-ink-100">{demoPassword}</code>
          </div>

          <div className="mt-10 text-center mono text-xs text-ink-700 tracking-mono">
            © {new Date().getFullYear()} AI LAB · ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </div>
  )
}
