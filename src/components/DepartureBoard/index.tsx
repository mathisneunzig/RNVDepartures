import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import DeparturesTable from "../DepartureTable"
import { useDepartures } from "./useDepartures"
import DepartureHeader from "./DepartureBoardHeader"
import ErrorPanel from "./ErrorPanel"

export default function DepartureBoard({ defaultStationId = "2417", first = 12 }: { defaultStationId?: string; first?: number }) {
  const [stationId, setStationId] = useState(defaultStationId)
  const [count] = useState(first)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshSec] = useState(60)

  const { data, loading, error, rows, refetchNow } = useDepartures({ stationId, count, autoRefresh, refreshSec })

  useEffect(() => { if (error && autoRefresh) setAutoRefresh(false) }, [error, autoRefresh])

  return (
    <Box sx={{ p: 2 }}>
      <DepartureHeader
        stationName={data?.station?.longName}
        stationId={stationId}
        setStationId={setStationId}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onRefresh={refetchNow}
      />
      {error && <ErrorPanel error={error} />}
      <DeparturesTable loading={loading} rows={rows} />
    </Box>
  )
}
