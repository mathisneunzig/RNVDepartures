import { IconButton } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { isFavorite, toggleFavorite } from '../../hooks/favorites'
import type { FavKey } from '../../hooks/favorites'

export default function FavoriteToggleButton({ favKey }: { favKey: FavKey }) {
  const fav = isFavorite(favKey)
  return (
    <IconButton onClick={() => { toggleFavorite(favKey) }} aria-label="merken">
      {fav ? <NotificationsActiveIcon color="warning" /> : <NotificationsNoneIcon />}
    </IconButton>
  )
}
