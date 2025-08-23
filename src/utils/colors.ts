export function contrastText(hex?: string | null) {
    if (!hex) return '#000'
    const h = hex.replace('#', '')
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 140 ? '#000' : '#fff'
}
  
export function delayColor(delay: number | null | undefined) {
    if (delay == null) return undefined
    if (delay <= 0) return 'success.main'
    if (delay >= 10) return 'error.main'
    return 'warning.main'
}
  