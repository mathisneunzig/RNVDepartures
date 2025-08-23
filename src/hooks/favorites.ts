export type FavKey = string // `${line}|${stationId}|${planned}|${realtime}`

const LS_KEY = 'rnv_favorites_v1'

export function loadFavorites(): FavKey[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as FavKey[]) : []
  } catch {
    return []
  }
}

export function saveFavorites(keys: FavKey[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(keys))
}

export function toggleFavorite(key: FavKey) {
  const set = new Set(loadFavorites())
  if (set.has(key)) set.delete(key)
  else set.add(key)
  saveFavorites([...set])
}

export function isFavorite(key: FavKey) {
  return new Set(loadFavorites()).has(key)
}

export function purgeExpired(nowIso: string) {
  const now = Date.parse(nowIso)
  const kept = loadFavorites().filter(k => {
    const parts = k.split('|')
    const rt = parts[3] || parts[2] || ''
    const t = Date.parse(rt)
    return Number.isFinite(t) && t >= now
  })
  saveFavorites(kept)
}
