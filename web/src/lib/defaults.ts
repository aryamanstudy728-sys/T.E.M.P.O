import type { SimulateRequest } from '../api/types'

// Starting form values only (inputs, not results). ambient_c null lets the engine use
// each scenario's own temperature (heatwave is hotter); vehicles matches the engine default.
export const DEFAULT_REQUEST: SimulateRequest = {
  seed: 42,
  scenario: 'normal',
  ambient_c: null,
  vehicles: 5,
  villages: null,
}
