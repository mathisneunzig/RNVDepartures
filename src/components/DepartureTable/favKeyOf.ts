import { Row } from "../DepartureRow/types"
import type { FavKey } from '../../hooks/favorites'

export function favKeyOf(r: Row): FavKey {
  return `${r.line}|${r.stationId}|${r.planned || ''}|${r.realtime || ''}|${r.destination || ''}`
}
