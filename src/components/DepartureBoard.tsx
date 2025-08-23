import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Card, CardContent, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { useQuery, gql } from '@apollo/client'
import DeparturesDoc from '../graphql/queries/Departures.graphql?raw'
import DeparturesTable from './DeparturesTable'
import { delayMinutes, minutesUntil } from '../utils/time'
import StationSearch from './StationSearch'
import { purgeExpired } from '../hooks/favorites'
import { Row } from './DeparturesTypes'

const DEPARTURES = gql`${DeparturesDoc}`

type Station = { name?: string | null; hafasID?: string | null }
type Stop = { plannedDeparture?: { isoString?: string | null } | null; realtimeDeparture?: { isoString?: string | null } | null; destinationLabel?: string | null; station?: Station | null } | null
type JourneyEl = { line?: { lastJourneyTypes: string[] | null; lineGroup?: { id?: string | null } | null; style?: { primary?: { hex?: string | null } | null } | null } | null; currentStop?: Stop[] | null; allStops?: Stop[] | null } | null

export default function DepartureBoard({ defaultStationId = '2417', first = 12 }: { defaultStationId?: string; first?: number }) {
  const isoMinus1m = () => new Date(Date.now() - 60000).toISOString()

  const [stationId, setStationId] = useState(defaultStationId)
  const [count, setCount] = useState(first)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshSec, setRefreshSec] = useState(30)
  const [startTime, setStartTime] = useState(() => isoMinus1m())

  const timerRef = useRef<number | null>(null)
  const debounceRef = useRef<number | null>(null)
  const inflightRef = useRef(false)

  const { data, loading, error, refetch } = useQuery(DEPARTURES, {
    variables: { stationId, startTime, first: count },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: false,
  })

  useEffect(() => { purgeExpired(new Date().toISOString()) }, [data])
  useEffect(() => { if (error && autoRefresh) setAutoRefresh(false) }, [error, autoRefresh])

  useEffect(() => {
    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null }
    debounceRef.current = window.setTimeout(async () => {
      const t = isoMinus1m()
      setStartTime(t)
      try {
        inflightRef.current = true
        await refetch({ stationId, startTime: t, first: count })
      } finally { inflightRef.current = false }
    }, 300)
    return () => { if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null } }
  }, [stationId, count, refetch])

  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (!autoRefresh || error) return
    const intervalMs = Math.max(5000, refreshSec * 1000)
    timerRef.current = window.setInterval(async () => {
      if (loading || inflightRef.current) return
      try {
        inflightRef.current = true
        const t = isoMinus1m()
        setStartTime(t)
        await refetch({ stationId, startTime: t, first: count })
      } catch { setAutoRefresh(false) }
      finally { inflightRef.current = false }
    }, intervalMs)
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }
  }, [autoRefresh, refreshSec, stationId, count, error, loading, refetch])

  const rows: Row[] = useMemo(() => {
    const items = (data?.station?.journeys?.elements as JourneyEl[] | undefined) ?? []
    return items
      .map(j => {
        const stop = j?.currentStop?.[0] ?? null
        const planned = stop?.plannedDeparture?.isoString ?? undefined
        const realtime = stop?.realtimeDeparture?.isoString ?? undefined
        const minutes = minutesUntil(realtime || planned) ?? 0
        const delay = delayMinutes(planned, realtime)
        const type = j?.line?.lastJourneyTypes?.[0] ?? 'STRASSENBAHN'
        const destination = stop?.destinationLabel ?? ''
        const allStops = (j?.allStops || []).map(s => ({
          name: s?.station?.name ?? null,
          hafasID: s?.station?.hafasID ?? null,
          plannedDeparture: s?.plannedDeparture ?? null,
          realtimeDeparture: s?.realtimeDeparture ?? null,
        }))
        return {
          line: j?.line?.lineGroup?.id ?? '',
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
  }, [data, stationId])

  const networkErr = (error as any)?.networkError as any
  const status = networkErr?.statusCode ?? networkErr?.status ?? null
  const result = networkErr?.result ?? networkErr?.body ?? null

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }} mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Abfahrtsmonitor</Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.station?.longName ? `Station: ${data.station.longName}` : 'Station lädt…'}
          </Typography>
        </Box>
        <StationSearch value={stationId} onChange={setStationId} />
        <FormControlLabel control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />} label="Auto-Refresh" />
        <Button variant="contained" onClick={async () => {
          if (inflightRef.current) return
          try {
            inflightRef.current = true
            const t = isoMinus1m()
            setStartTime(t)
            await refetch({ stationId, startTime: t, first: count })
          } finally { inflightRef.current = false }
        }}>Aktualisieren</Button>
      </Stack>

      {error && (
        <Card sx={{ mb: 2 }} variant="outlined">
          <CardContent>
            <Typography color="error" gutterBottom>Fehler: {error.message}{status ? ` (HTTP ${status})` : ''}</Typography>
            {result && (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, marginTop: 8 }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      <DeparturesTable loading={loading} rows={rows} />
    </Box>
  )
}
