const SECTIONS = [
  {
    kicker: 'מינימום',
    title: 'דרישות חומרה',
    items: [
      { label: 'זיכרון RAM', value: '16GB מינימום', detail: 'Cursor + Claude Desktop יחד אוכלים בערך 4-6GB. עם הדפדפן והשאר — 16GB זה הסף שלא תרגיש איטיות.' },
      { label: 'מעבד', value: 'Mac M1 ומעלה / Windows i5 דור 10+', detail: 'מעבדי Apple Silicon (M1/M2/M3/M4) רצים מצוין. ב-Windows — i5 דור 10+ או Ryzen 5 שווה ערך.' },
      { label: 'מקום פנוי בדיסק', value: '20GB+', detail: 'Cursor + Claude Desktop + Node.js + פרויקטים = בערך 15GB. תשאיר רווח.' },
      { label: 'מערכת הפעלה', value: 'macOS 13+ / Windows 10+', detail: 'גרסאות ישנות יותר יכולות לעבוד, אבל לא נתמכות רשמית ע"י Cursor.' }
    ]
  },
  {
    kicker: 'חובה',
    title: 'חיבור אינטרנט',
    items: [
      { label: 'מהירות', value: '50Mbps+ הורדה', detail: 'Cursor ו-Claude Desktop שולחים בקשות בענן כל הזמן. חיבור איטי = חוויה איטית.' },
      { label: 'יציבות', value: 'יציב לאורך זמן', detail: 'אם החיבור נופל כל 10 דקות, האפליקציות נופלות איתו. WiFi חזק או חיבור קווי.' }
    ]
  },
  {
    kicker: 'הכרחי',
    title: 'חשבונות שצריך לפתוח',
    items: [
      { label: 'Claude Pro', value: '$20 / חודש', detail: 'תנאי הכרחי לקורס. בלעדיו אין גישה ל-Cowork, Code, ולמודלים החזקים. נרשמים ב-claude.ai/upgrade.' },
      { label: 'Cursor', value: 'חינמי בהתחלה', detail: 'הגרסה החינמית מספיקה לקורס. Pro ($20/חודש) נותן יותר מהירות וגישה לכל המודלים — לא חובה.' },
      { label: 'GitHub', value: 'חינמי לעולם', detail: 'נפתח בשיעור 03. שם המשתמש קבוע — בחר משהו מקצועי שיתאים גם לעסקים עתידיים.' },
      { label: 'Google', value: 'אם אין כבר', detail: 'נשתמש ב-Gmail + Google Sheets בהמשך הקורס (שיעורים 04-06). חשבון רגיל מספיק.' }
    ]
  },
  {
    kicker: 'אופציונלי',
    title: 'תוספות שעוזרות',
    items: [
      { label: 'מסך חיצוני', value: '24"+ מומלץ', detail: 'לעבודה ב-Cursor — Code בצד אחד, Claude Desktop בצד השני. לא חובה אבל משדרג חוויה משמעותית.' },
      { label: 'אוזניות', value: 'לזום + רעש רקע', detail: 'השיעורים בזום. אוזניות עם מיקרופון עוזרות לאיכות הצליל בשני הכיוונים.' },
      { label: 'Twilio Trial', value: 'חינמי ($15 קרדיט)', detail: 'נשתמש בשיעור 06 (אוטומציות) לבוט WhatsApp. נפתח כשנגיע לזה.' }
    ]
  }
]

const TROUBLESHOOTING = [
  {
    q: 'יש לי MacBook עם 8GB RAM. אפשר להשתתף?',
    a: 'טכנית — כן, אבל החוויה תהיה איטית. Cursor + Claude Desktop יחד יחנקו את המכונה. אם זה המחשב היחיד שלך, נסה לסגור את כל שאר האפליקציות בזמן עבודה. שדרוג ל-16GB מומלץ בחום.'
  },
  {
    q: 'אני על Windows 11 עם 16GB. בעיה?',
    a: 'אפס בעיה. Cursor רץ מצוין על Windows. הטרמינל מעט שונה (PowerShell במקום Terminal של Mac), אבל הפקודות זהות.'
  },
  {
    q: 'אין לי Claude Pro. אפשר עם החינמי?',
    a: 'בגרסה החינמית של Claude.ai יש מגבלת הודעות יומית, ואין גישה ל-Cowork ול-Code ב-Desktop. אי אפשר לעבור את הקורס בלי Pro.'
  },
  {
    q: 'אני באמת מחויב/חייב לפתוח GitHub?',
    a: 'כן. כל פרויקט בקורס נשמר ב-GitHub. בלי זה — אין גרסאות, אין גיבוי, אין פרסום של אתר. זה הכרחי.'
  }
]

export default function SystemRequirements() {
  return (
    <div className="space-y-10 sm:space-y-14">
      <header className="pb-5 sm:pb-7 border-b border-line">
        <div className="kicker mb-4 sm:mb-5">לפני שמתחילים</div>
        <h1 className="font-display text-[2.25rem] sm:text-5xl lg:text-6xl font-black leading-[1] tracking-tight text-ink-100">
          דרישות <em className="not-italic text-brand">מערכת</em>.
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-ink-300 leading-relaxed max-w-2xl">
          כדי שהכלים שלנו (Cursor, Claude Desktop, Terminal) ירוצו חלק — המחשב צריך לעמוד בכמה דרישות בסיסיות.
          זו רשימה שכדאי לעבור עליה <strong>לפני</strong> השיעור הראשון.
        </p>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.title}>
          <div className="section-head">
            <h3>{section.title}</h3>
            <span className="mono text-xs text-ink-700 tracking-mono uppercase">{section.kicker}</span>
          </div>
          <div className="space-y-3">
            {section.items.map((item) => (
              <article key={item.label} className="card-elev p-5 sm:p-6 grid sm:grid-cols-[200px,1fr] gap-3 sm:gap-6">
                <div>
                  <div className="font-display text-lg font-bold text-ink-100 leading-tight mb-1">{item.label}</div>
                  <div className="mono text-sm text-brand font-bold tracking-mono">{item.value}</div>
                </div>
                <p className="text-sm sm:text-base text-ink-300 leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section>
        <div className="section-head">
          <h3>שאלות נפוצות</h3>
          <span className="mono text-xs text-ink-700 tracking-mono uppercase">פתרון בעיות</span>
        </div>
        <div className="space-y-3">
          {TROUBLESHOOTING.map((t) => (
            <article key={t.q} className="card-elev p-5 sm:p-6">
              <div className="font-display text-base sm:text-lg font-bold text-ink-100 leading-tight mb-2">
                {t.q}
              </div>
              <p className="text-sm sm:text-base text-ink-300 leading-relaxed">{t.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card-elev accent-stripe p-6 sm:p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(16,229,147,0.08), rgba(16,229,147,0.02)), #101010' }}
      >
        <div className="kicker mb-3 sm:mb-4">הכל עומד בדרישות?</div>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-100 leading-tight mb-3">
          המשך לשיעור 02 — הכלים שיבנו בשבילך
        </h3>
        <p className="text-base text-ink-300 leading-relaxed mb-5 max-w-xl">
          אם המחשב שלך עומד בכל הדרישות והחשבונות פתוחים — אתה מוכן להמשיך. נכיר את Cursor, Claude Desktop, וטרמינל.
        </p>
        <a href="#/lessons/2" className="btn-primary w-full sm:w-auto justify-center sm:justify-start">
          המשך לשיעור 02
          <span className="btn-arrow">←</span>
        </a>
      </section>
    </div>
  )
}
