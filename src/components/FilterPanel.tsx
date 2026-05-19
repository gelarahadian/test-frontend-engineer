import { Grid, Slider, Stack, Typography } from '@mui/material'

type FilterPanelProps = {
  minYear: number
  maxYear: number
  startYear: number | null
  endYear: number | null
  onRangeChange: (range: [number, number]) => void
}

export default function FilterPanel({
  minYear,
  maxYear,
  startYear,
  endYear,
  onRangeChange,
}: FilterPanelProps) {
  const fallbackRange: [number, number] = [minYear, maxYear]
  const value: [number, number] =
    startYear !== null && endYear !== null ? [startYear, endYear] : fallbackRange

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      onRangeChange([newValue[0], newValue[1]])
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Range: {value[0]} - {value[1]}
          </Typography>
          <Slider
            value={value}
            onChange={handleChange}
            min={minYear}
            max={maxYear}
            step={1}
            marks
            valueLabelDisplay="auto"
            disableSwap
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
