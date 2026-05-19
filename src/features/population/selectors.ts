import type { RootState } from '../../app/store'

export const selectPopulationState = (state: RootState) => state.population

export const selectYears = (state: RootState) =>
  state.population.data.map((item) => item.year)

export const selectFilteredPopulationData = (state: RootState) => {
  const { data, startYear, endYear } = state.population

  if (startYear === null || endYear === null) {
    return data
  }

  return data.filter((item) => item.year >= startYear && item.year <= endYear)
}
