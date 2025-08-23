import { Box, Button, FormControlLabel, Stack, Switch, Typography } from "@mui/material"
import StationSearch from "./StationSearch"

type Props = {
  stationName?: string | null
  stationId: string
  setStationId: (id: string) => void
  autoRefresh: boolean
  setAutoRefresh: (b: boolean) => void
  onRefresh: () => void
}

export default function DepartureBoardHeader({ stationName, stationId, setStationId, autoRefresh, setAutoRefresh, onRefresh }: Props) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }} mb={2}>
      <Box>
        <Typography variant="h5" fontWeight={600}>Abfahrtsmonitor</Typography>
        <Typography variant="body2" color="text.secondary">
          {stationName ? `Station: ${stationName}` : "Station lädt…"}
        </Typography>
      </Box>
      <StationSearch value={stationId} onChange={setStationId} />
      <FormControlLabel control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />} label="Auto-Refresh" />
      <Button variant="contained" onClick={onRefresh}>Aktualisieren</Button>
    </Stack>
  )
}
