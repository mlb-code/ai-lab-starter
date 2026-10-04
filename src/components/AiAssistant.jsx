import { useState, useRef, useEffect } from 'react'
import { useAssistant } from '../context/AssistantContext.jsx'

/* Same backend as the main ai-lab portal — shared course assistant worker */
const AI_WORKER_URL = 'https://ai-lab-assistant.laviemb.workers.dev'

const GREETING = 'שלום! 👋 אני AI Lab — המורה הדיגיטלי שלך.\n\nבמה אני יכול לעזור?'

/* Mirror of the main portal's aiStripMarkdown — responses come back as plain text */
function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, '').trim())
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function AiAssistant() {
  const { open, setOpen } = useAssistant()
  /* msgs: {role:'user'|'assistant', content, error?} — greeting is rendered separately */
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  /* Focus input + scroll to bottom when opening or on new message */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, loading, open])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const next = [...msgs, { role: 'user', content: text }]
    setMsgs(next)
    setInput('')
    setLoading(true)

    /* Only real exchanges go to the worker — drop any prior error bubbles */
    const apiMessages = next
      .filter((m) => !m.error)
      .map(({ role, content }) => ({ role, content }))

    try {
      const res = await fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, course: 'basic', session: null }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMsgs((m) => [...m, { role: 'assistant', content: err.error || 'שגיאה. נסו שוב בעוד רגע.', error: true }])
      } else {
        const data = await res.json()
        setMsgs((m) => [...m, { role: 'assistant', content: stripMarkdown(data.reply) }])
      }
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'לא הצלחתי להתחבר. בדקו חיבור לאינטרנט ונסו שוב.', error: true }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Desktop floating trigger — bottom-left (mobile uses the bottom-nav FAB) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="פתח עוזר הקורס"
        className="hidden lg:flex fixed bottom-6 left-6 z-[9998] w-16 h-16 rounded-full items-center justify-center text-black font-display font-bold text-lg bg-brand hover:bg-[#2BF2A6] active:scale-95 transition"
      >
        <span dir="ltr">AI</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="עוזר הקורס"
          className="fixed z-[9999] flex flex-col overflow-hidden rounded-xl border border-brand/30 bg-bg-elev shadow-2xl
                     bottom-24 left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] max-w-[400px]
                     lg:bottom-24 lg:left-6 lg:translate-x-0 lg:w-[380px]
                     h-[min(560px,70vh)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-brand">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-10 h-10 rounded-full bg-black/15 text-black font-display font-bold text-[0.65rem] leading-[1.05] text-center">
                <span>AI Lab</span>
              </div>
              <h4 className="text-black font-bold text-base">עוזר הקורס</h4>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="סגור"
              className="text-black/70 hover:text-black text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            <Bubble role="assistant">{GREETING}</Bubble>
            {msgs.map((m, i) => (
              <Bubble key={i} role={m.role}>{m.content}</Bubble>
            ))}
            {loading && <Typing />}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-brand/20 bg-bg">
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="כתוב שאלה..."
              dir="rtl"
              className="flex-1 rounded-full bg-bg-card border border-brand/30 px-4 py-2.5 text-sm text-ink-100 outline-none focus:border-brand placeholder:text-ink-700"
            />
            <button
              onClick={send}
              disabled={loading}
              aria-label="שלח"
              className="grid place-items-center w-[42px] h-[42px] shrink-0 rounded-full bg-brand text-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &#10148;
            </button>
          </div>

          <div className="text-center text-[0.65rem] text-ink-700 py-2 bg-bg border-t border-line">
            מופעל על ידי Claude · AI Lab
          </div>
        </div>
      )}
    </>
  )
}

function Bubble({ role, children }) {
  const isUser = role === 'user'
  return (
    <div
      className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words rounded-2xl ${
        isUser
          ? 'self-start rounded-bl-sm bg-brand text-black'
          : 'self-end rounded-br-sm bg-bg-card text-ink-300 border border-brand/20'
      }`}
    >
      {children}
    </div>
  )
}

function Typing() {
  return (
    <div className="self-end flex gap-1 px-4 py-3 rounded-2xl bg-bg-card border border-brand/20 w-fit">
      {[0, 0.2, 0.4].map((d) => (
        <span
          key={d}
          className="w-2 h-2 rounded-full bg-brand animate-bounce"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </div>
  )
}
