import { LineChart } from '@mui/x-charts/LineChart'
import type { PopulationPoint } from '../features/population/populationSlice'

type PopulationLineChartProps = {
  data: PopulationPoint[]
}

export default function PopulationLineChart({ data }: PopulationLineChartProps) {
  const years = data.map((item) => item.year)
  const populations = data.map((item) => item.population)

  return (
    <LineChart
      height={360}
      xAxis={[{ scaleType: 'point', data: years, label: 'Tahun' }]}
      yAxis={[
        {
          label: 'Populasi',
          valueFormatter: (value: number) => value.toLocaleString('en-US'),
        },
      ]}
      series={[
        {
          id: 'population-series',
          data: populations,
          label: 'Populasi US',
          showMark: true,
          valueFormatter: (value) => `${value?.toLocaleString('en-US') ?? 0} orang`,
        },
      ]}
      margin={{ left: 30, right: 30, top: 40, bottom: 50 }}
    />
  )
}
