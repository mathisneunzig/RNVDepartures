import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'
import { loadFavorites, purgeExpired } from '../hooks/favorites'
import { fmt } from '../utils/time'

export default function Favorites() {
  purgeExpired(new Date().toISOString())
  const favs = loadFavorites()

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>Gemerkte Abfahrten</Typography>
      {favs.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Keine gemerkten Abfahrten.</Typography>
      ) : (
        <List>
          {favs.map((k) => {
            const [line, stationId, planned, realtime, dest] = k.split('|')
            return (
              <ListItem key={k} divider>
                <ListItemText
                  primary={`${line} → ${dest || ''}`}
                  secondary={`Station ${stationId} • geplant: ${fmt(planned)} • echt: ${fmt(realtime)}`}
                />
              </ListItem>
            )
          })}
        </List>
      )}
    </Box>
  )
}
