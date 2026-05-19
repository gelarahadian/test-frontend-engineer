import { PieChart } from '@mui/x-charts/PieChart'
import type { PopulationPoint } from '../features/population/populationSlice'

type PopulationPieChartProps = {
  data: PopulationPoint[]
}

export default function PopulationPieChart({ data }: PopulationPieChartProps) {
  const seriesData = data.map((item) => ({
    id: item.year,
    value: item.population,
    label: item.year.toString(),
  }))

  return (
    <PieChart
      height={360}
      series={[
        {
          data: seriesData,
          arcLabel: (item) => item.label ?? '',
          valueFormatter: (value) => `${value.value.toLocaleString('en-US')} people`,
        },
      ]}
      margin={{ top: 30, right: 20, bottom: 20, left: 20 }}
    />
  )
}
