import { useEffect, useMemo, useRef, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import DeparturesDoc from "../../graphql/queries/Departures.graphql?raw"
import { purgeExpired } from "../../hooks/favorites"
import { isoMinus1m } from "../../utils/datetime"
import { mapDepartures } from "./mapDepartures"
import { Row } from "../DepartureRow/types"

const DEPARTURES = gql`${DeparturesDoc}`

export function useDepartures(params: { stationId: string; count: number; autoRefresh: boolean; refreshSec: number }) {
  const { stationId, count, autoRefresh, refreshSec } = params
  const [startTime, setStartTime] = useState(() => isoMinus1m())
  const timerRef = useRef<number | null>(null)
  const debounceRef = useRef<number | null>(null)
  const inflightRef = useRef(false)

  const { data, loading, error, refetch } = useQuery(DEPARTURES, {
    variables: { stationId, startTime, first: count },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: false,
  })

  useEffect(() => { purgeExpired(new Date().toISOString()) }, [data])

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
      } catch {} finally { inflightRef.current = false }
    }, intervalMs)
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }
  }, [autoRefresh, refreshSec, stationId, count, error, loading, refetch])

  const rows: Row[] = useMemo(() => mapDepartures(data, stationId), [data, stationId])

  const refetchNow = async () => {
    if (inflightRef.current) return
    try {
      inflightRef.current = true
      const t = isoMinus1m()
      setStartTime(t)
      await refetch({ stationId, startTime: t, first: count })
    } finally { inflightRef.current = false }
  }

  return { data, loading, error, rows, refetchNow }
}
