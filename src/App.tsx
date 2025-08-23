import { Link, Routes, Route } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import DepartureBoard from './components/DepartureBoard'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>RNV Abfahrten</Typography>
          <Button color="inherit" component={Link} to="/">Monitor</Button>
          <Button color="inherit" component={Link} to="/favorites">Favoriten</Button>
        </Toolbar>
      </AppBar>
      <Box component={Container} sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<DepartureBoard defaultStationId="2417" first={12} />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Box>
    </>
  )
}
