export type Row = {
    line: string
    destination: string
    type: string
    bg?: string | null
    planned?: string
    realtime?: string
    minutes: number
    delay: number
    stationId: string
    allStops: { plannedDeparture?: { isoString?: string | null } | null; realtimeDeparture?: { isoString?: string | null } | null; name: string | null; hafasID: string | null }[]
}
  