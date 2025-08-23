import { Box, Typography } from '@mui/material'
import { contrastText } from '../utils/colors'

export default function LineBadge({
  label,
  bg,
  type,
}: {
  label: string
  bg?: string | null
  type?: string | null
}) {
  const fg = contrastText(bg)
  const isSquare = type === 'STRASSENBAHN'

  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: isSquare ? '6px' : '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: bg || 'grey.300',
        color: fg,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
      }}
    >
      <Typography
        variant="h6"
        component="span"
        sx={{ fontWeight: 800, lineHeight: 1, color: fg }}
      >
        {label || '–'}
      </Typography>
    </Box>
  )
}
