// Types written from the engine's real output (engine/tempo/scenarios.py, api.py)
// and the samples in contract/. Do not add fields the engine does not send.
export type Band = 'green' | 'yellow' | 'red'
export type Scenario = 'normal' | 'heatwave' | 'slow_roads' | 'cooler_failure'
export type MethodKey = 'fixed' | 'nearest' | 'risk_based'
export type ExplanationSource = 'claude' | 'template'

export interface VillageInput {
  id: string
  name: string
  lat: number
  lon: number
  volume_l: number
  milk_temp_c: number
}

export interface SimulateRequest {
  seed: number
  scenario: Scenario
  ambient_c: number | null // null = use the scenario's own temperature
  vehicles: number
  villages: VillageInput[] | null
}

export interface Centre { id: string; name: string; lat: number; lon: number }

export interface Village {
  id: string
  name: string
  lat: number
  lon: number
  volume_l: number
  milk_temp_c: number
  road_to_centre: string
  buffer_h: number // under the risk-based plan
  band: Band // under the risk-based plan
}

export interface RoutePlan {
  vehicle_id: number
  stops: string[]
  time_h: number
}

export interface MethodResult {
  routes: RoutePlan[]
  buffers: Record<string, number> // village id -> buffer hours under this method
  breaching_ids: string[]
  breaches: number
  time_h: number // total over all vehicles
  over_ceiling: number[] // vehicle ids whose route exceeds the ceiling
  volume_at_risk_l: number
}

export type Methods = Record<MethodKey, MethodResult>

export interface Alert {
  kind: string
  severity: string // 'critical' | 'warning' from the engine
  message: string
  village_id: string
}

export interface Explanation { text: string; source: ExplanationSource }

export interface SimulateMeta {
  seed: number
  scenario: Scenario
  ambient_c: number
  vehicles: number
  n_villages: number
}

export interface SimulateResponse {
  version: number
  meta: SimulateMeta
  centre: Centre
  villages: Village[]
  methods: Methods
  best_method: MethodKey
  alerts: Alert[]
  explanation: Explanation
}

export interface AssumptionItem {
  name: string
  value: number | string | Array<number | string>
  status: 'sourced' | 'guessed'
  note: string
}
export interface Assumptions { version: number; items: AssumptionItem[] }

export interface SensitivityRow {
  parameter: string
  value: number
  fixed: number
  nearest: number
  distance_only: number
  risk_based: number
  risk_based_wins: boolean
}
export interface SensitivityResponse { version: number; seeds: number[]; rows: SensitivityRow[] }
