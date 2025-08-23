export function fmt(iso?: string | null) {
    if (!iso) return '–'
    const d = new Date(iso)
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d)
  }
  
  export function minuteTs(iso?: string | null) {
    if (!iso) return null
    const t = Date.parse(iso)
    if (Number.isNaN(t)) return null
    return Math.floor(t / 60000)
  }
  
  export function minutesUntil(iso?: string | null) {
    const m = minuteTs(iso)
    if (m == null) return null
    const nowM = Math.floor(Date.now() / 60000)
    return m - nowM
  }
  
  export function delayMinutes(planned?: string | null, realtime?: string | null) {
    const p = minuteTs(planned)
    const r = minuteTs(realtime)
    if (p == null || r == null) return 0
    return r - p
  }
  