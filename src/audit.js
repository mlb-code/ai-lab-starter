// Layout audit ("סוכן נראות"). Runs only with ?audit=1 in the query string and writes a
// hidden <pre id="auditOut"> that the headless QA harness reads. Same checks as the site.
function runAudit() {
  const W = innerWidth, H = document.documentElement.scrollHeight, issues = []
  const vis = (el) => {
    if (el.closest('details:not([open])') && !el.closest('summary')) return false
    if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) return false
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }
  const path = (el) => {
    let s = el.tagName.toLowerCase()
    if (el.id) s += '#' + el.id
    else if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
    const sec = el.closest('section,aside,header,footer,main,nav,article')
    return (sec && sec !== el ? (sec.id ? '#' + sec.id : sec.tagName.toLowerCase() + (typeof sec.className === 'string' && sec.className ? '.' + sec.className.trim().split(/\s+/)[0] : '')) + ' > ' : '') + s
  }
  const txt = (el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
  const skip = (el) => el.id === 'auditOut' || !!el.closest('.m-sheet,.m-sheet-backdrop,.m-profile-menu,script,style,svg')
  const all = Array.from(document.body.querySelectorAll('*')).filter((el) => !skip(el) && vis(el))
  if (document.documentElement.scrollWidth > W + 1) issues.push({ type: 'page-overflow-x', detail: document.documentElement.scrollWidth + ' > ' + W })
  for (const el of all) {
    const r = el.getBoundingClientRect()
    const scroller = el.closest('.overflow-x-auto,.scrollbar-none')
    if ((r.right > W + 1 || r.left < -1) && !(scroller && scroller !== el)) issues.push({ type: 'outside-viewport-x', el: path(el), left: Math.round(r.left), right: Math.round(r.right), text: txt(el) })
  }
  for (const el of all) {
    const cs = getComputedStyle(el)
    if (!/hidden|clip/.test(cs.overflowX + cs.overflowY)) continue
    const cr = el.getBoundingClientRect()
    for (const d of el.querySelectorAll('*')) {
      if (skip(d) || !vis(d)) continue
      if (!d.textContent.trim() && d.tagName !== 'IMG') continue
      const r = d.getBoundingClientRect()
      const m = Math.max(cr.left - r.left, r.right - cr.right, cr.top - r.top, r.bottom - cr.bottom)
      if (m > 2 && !el.classList.contains('truncate') && !d.classList.contains('truncate')) issues.push({ type: 'clipped', container: path(el), el: path(d), overflowPx: Math.round(m), text: txt(d) })
    }
  }
  for (const el of all) {
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())
    if (!hasText) continue
    const cs = getComputedStyle(el)
    if (/auto|scroll/.test(cs.overflowX) || cs.textOverflow === 'ellipsis') continue
    if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2) issues.push({ type: 'text-overflow', el: path(el), scrollW: el.scrollWidth, clientW: el.clientWidth, text: txt(el) })
  }
  const textEls = all.filter((el) => /^(H1|H2|H3|H4|P|LI|SPAN|B|SMALL|A|BUTTON|LABEL|SUMMARY|DIV|OL|UL|STRONG|EM)$/.test(el.tagName) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()))
  const floating = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true } return false }
  const rects = textEls.filter((el) => !floating(el)).map((el) => ({ el, r: el.getBoundingClientRect(), o: parseFloat(getComputedStyle(el).opacity) }))
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const A = rects[i], B = rects[j]
    if (A.o < 0.3 || B.o < 0.3 || A.el.contains(B.el) || B.el.contains(A.el)) continue
    const ox = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left), oy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top)
    if (ox > 4 && oy > 4) issues.push({ type: 'overlap', a: path(A.el), b: path(B.el), ox: Math.round(ox), oy: Math.round(oy), ta: txt(A.el), tb: txt(B.el) })
  }
  for (const el of all) {
    const cs = getComputedStyle(el)
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'
    const side = (st, w) => hasBg || (st !== 'none' && parseFloat(w) > 0)
    const boxed = side(cs.borderLeftStyle, cs.borderLeftWidth) || side(cs.borderRightStyle, cs.borderRightWidth) || hasBg
    if (!boxed) continue
    const cr = el.getBoundingClientRect()
    for (const d of el.querySelectorAll('h1,h2,h3,b,strong,.mono,.font-display')) {
      if (!vis(d)) continue
      const fs = parseFloat(getComputedStyle(d).fontSize)
      if (fs < 24) continue
      let sc = d.parentElement, scrollInside = false
      while (sc && sc !== el) { if (/auto|scroll/.test(getComputedStyle(sc).overflowX)) { scrollInside = true; break } sc = sc.parentElement }
      if (scrollInside) continue
      const r = d.getBoundingClientRect()
      const gaps = []
      if (side(cs.borderLeftStyle, cs.borderLeftWidth)) gaps.push(r.left - cr.left)
      if (side(cs.borderRightStyle, cs.borderRightWidth)) gaps.push(cr.right - r.right)
      if (side(cs.borderTopStyle, cs.borderTopWidth)) gaps.push(r.top - cr.top)
      if (side(cs.borderBottomStyle, cs.borderBottomWidth)) gaps.push(cr.bottom - r.bottom)
      const gap = gaps.length ? Math.min(...gaps) : 99
      if (gap < 8) issues.push({ type: 'tight-edge', box: path(el), el: path(d), gapPx: Math.round(gap), text: txt(d) })
    }
  }
  if (W <= 760) for (const el of all) {
    if (!/^(A|BUTTON|SUMMARY)$/.test(el.tagName)) continue
    const r = el.getBoundingClientRect()
    if (r.height < 36 && !el.closest('footer,.m-profile-menu')) issues.push({ type: 'small-tap', el: path(el), h: Math.round(r.height), text: txt(el) })
  }
  for (const el of all) {
    const fs = parseFloat(getComputedStyle(el).fontSize)
    if (fs < 10.5 && el.textContent.trim() && !el.closest('.mono,.m-topbar-logo')) issues.push({ type: 'tiny-font', el: path(el), fs, text: txt(el) })
  }
  const pre = document.createElement('pre')
  pre.id = 'auditOut'
  pre.style.cssText = 'position:absolute;left:0;top:0;opacity:0;pointer-events:none'
  pre.textContent = '@@AUDIT ' + W + 'x' + H + ' ' + JSON.stringify(issues) + ' AUDIT@@'
  document.body.appendChild(pre)
}

if (/audit/.test(location.search)) {
  addEventListener('load', () => setTimeout(runAudit, 1800))
}
