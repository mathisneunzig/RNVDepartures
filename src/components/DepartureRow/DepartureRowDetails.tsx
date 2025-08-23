import { TableRow, TableCell, Collapse, Box, Stack, Typography } from "@mui/material"
import { fmt } from "../../utils/time"
import { DepartureRowProps } from "./types"

export default function DepartureRowDetails({ row, isOpen }: DepartureRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box sx={{ px: 6, py: 1.5, bgcolor: "action.hover" }}>
            <Stack spacing={0.5}>
              {row.allStops
                .slice(row.allStops.findIndex(s => s.hafasID === row.stationId) + 1)
                .map((s, idx) => (
                  <Stack key={idx} direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="body1">{s.name || "—"}</Typography>
                    <Typography variant="body1" sx={{ minWidth: 120, textAlign: "right" }}>
                      {fmt(s.realtimeDeparture?.isoString || s.plannedDeparture?.isoString)}
                    </Typography>
                  </Stack>
                ))
              }
            </Stack>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
}
