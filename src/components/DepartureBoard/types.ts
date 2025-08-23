export type Station = {
    name?: string | null
    hafasID?: string | null
}

export type Stop = {
    plannedDeparture?: {
        isoString?: string | null
    } | null
    realtimeDeparture?: {
        isoString?: string | null
    } | null
    destinationLabel?: string | null
    station?: Station | null
} | null

export type Journey = {
    line?: {
        lastJourneyTypes: string[] | null
        lineGroup?: {
            id?: string | null
        } | null
        style?: {
            primary?: {
                hex?: string | null
            } | null
        } | null
    } | null
    currentStop?: Stop[] | null
    allStops?: Stop[] | null
} | null  