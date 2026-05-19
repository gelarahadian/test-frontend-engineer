import { useEffect } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchPopulationData, setYearRange } from './features/population/populationSlice'
import { selectFilteredPopulationData, selectPopulationState } from './features/population/selectors'
import FilterPanel from './components/FilterPanel'
import PopulationLineChart from './components/PopulationLineChart'
import PopulationPieChart from './components/PopulationPieChart'

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d6e6e',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: '#f4f8f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

function App() {
  const dispatch = useAppDispatch()
  const filteredData = useAppSelector(selectFilteredPopulationData)
  const { startYear, endYear, status, error } = useAppSelector(selectPopulationState)
  const minYear = 1976
  const maxYear = 2026

  useEffect(() => {
    if (startYear !== null && endYear !== null) {
      void dispatch(fetchPopulationData({ startYear, endYear }))
    }
  }, [dispatch, startYear, endYear])

  return (
    <ThemeProvider theme={appTheme}>
      <Box>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Populasi US
              </Typography>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid #d7e3e3' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Filter Date Range
                </Typography>
                <FilterPanel
                  minYear={minYear}
                  maxYear={maxYear}
                  startYear={startYear}
                  endYear={endYear}
                  onRangeChange={([nextStartYear, nextEndYear]) =>
                    dispatch(setYearRange({ startYear: nextStartYear, endYear: nextEndYear }))
                  }
                />
              </CardContent>
            </Card>

            {status === 'loading' && (
              <Card elevation={0} sx={{ border: '1px solid #d7e3e3' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                  </Box>
                </CardContent>
              </Card>
            )}

            {status === 'failed' && error && <Alert severity="error">{error}</Alert>}

            {status === 'succeeded' && filteredData.length === 0 && (
              <Alert severity="info">Tidak ada data pada range tahun yang dipilih.</Alert>
            )}

            {status === 'succeeded' && filteredData.length > 0 && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Card elevation={0} sx={{ border: '1px solid #d7e3e3', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Line Chart - Populasi Pertahun
                      </Typography>
                      <PopulationLineChart data={filteredData} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card elevation={0} sx={{ border: '1px solid #d7e3e3', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Pie Chart - Populasi Pertahun
                      </Typography>
                      <PopulationPieChart data={filteredData} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
