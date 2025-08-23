import { minutesUntil, delayMinutes } from "../../utils/time"
import { Row } from "../DepartureRow/types"
import { Journey } from "./types"

export function mapDepartures(data: any, stationId: string): Row[] {
  const items = (data?.station?.journeys?.elements as Journey[] | undefined) ?? []
  return items
    .map(j => {
      const stop = j?.currentStop?.[0] ?? null
      const planned = stop?.plannedDeparture?.isoString ?? undefined
      const realtime = stop?.realtimeDeparture?.isoString ?? undefined
      const minutes = minutesUntil(realtime || planned) ?? 0
      const delay = delayMinutes(planned, realtime)
      const type = j?.line?.lastJourneyTypes?.[0] ?? "STRASSENBAHN"
      const destination = stop?.destinationLabel ?? ""
      const allStops = (j?.allStops || []).map(s => ({
        name: s?.station?.name ?? null,
        hafasID: s?.station?.hafasID ?? null,
        plannedDeparture: s?.plannedDeparture ?? null,
        realtimeDeparture: s?.realtimeDeparture ?? null,
      }))
      return {
        line: j?.line?.lineGroup?.id ?? "",
        bg: j?.line?.style?.primary?.hex ?? null,
        planned,
        realtime,
        minutes,
        delay,
        type,
        destination,
        stationId,
        allStops,
      }
    })
    .filter(r => r.line && Number.isFinite(r.minutes))
    .sort((a, b) => a.minutes - b.minutes)
}
