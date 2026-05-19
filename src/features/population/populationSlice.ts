import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type PopulationPoint = {
  year: number
  population: number
}

type PopulationState = {
  data: PopulationPoint[]
  startYear: number | null
  endYear: number | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

type YearRangePayload = {
  startYear: number
  endYear: number
}

type WorldBankPopulationItem = {
  date: string
  value: number | null
}

type WorldBankResponse = [unknown, WorldBankPopulationItem[]]

const initialState: PopulationState = {
  data: [],
  startYear: 2016,
  endYear: 2026,
  status: 'idle',
  error: null,
}

export const fetchPopulationData = createAsyncThunk(
  'population/fetchPopulationData',
  async ({ startYear, endYear }: { startYear: number; endYear: number }) => {
    const response = await fetch(
      `https://api.worldbank.org/v2/country/US/indicator/SP.POP.TOTL?date=${startYear}:${endYear}&format=json`,
    )

    if (!response.ok) {
      throw new Error('Gagal mengambil data dari World Bank API.')
    }

    const payload = (await response.json()) as WorldBankResponse
    const rows = payload?.[1] ?? []

    return rows
      .filter((item) => item.value !== null)
      .map((item) => ({
        year: Number(item.date),
        population: Number(item.value),
      }))
      .sort((a, b) => a.year - b.year)
  },
)

const populationSlice = createSlice({
  name: 'population',
  initialState,
  reducers: {
    setStartYear: (state, action: PayloadAction<number>) => {
      state.startYear = action.payload
      if (state.endYear !== null && action.payload > state.endYear) {
        state.endYear = action.payload
      }
    },
    setEndYear: (state, action: PayloadAction<number>) => {
      state.endYear = action.payload
      if (state.startYear !== null && action.payload < state.startYear) {
        state.startYear = action.payload
      }
    },
    setYearRange: (state, action: PayloadAction<YearRangePayload>) => {
      state.startYear = action.payload.startYear
      state.endYear = action.payload.endYear
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopulationData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPopulationData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchPopulationData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Terjadi kesalahan saat mengambil data.'
      })
  },
})

export const { setStartYear, setEndYear, setYearRange } = populationSlice.actions

export default populationSlice.reducer
