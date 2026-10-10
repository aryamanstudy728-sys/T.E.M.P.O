import type { Band, AssumptionItem, RoutePlan, Village } from '../api/types'

export interface Thresholds { greenH: number; redH: number }

// derived from /api/assumptions items band_green_h and band_red_h
export function thresholdsFrom(items: AssumptionItem[]): Thresholds | undefined {
  const g = items.find((i) => i.name === 'band_green_h')?.value
  const r = items.find((i) => i.name === 'band_red_h')?.value
  return typeof g === 'number' && typeof r === 'number' ? { greenH: g, redH: r } : undefined
}

// Same rule as the engine's risk.band(), using thresholds from /api/assumptions.
export function bandOf(buffer: number, t: Thresholds): Band {
  if (buffer > t.greenH) return 'green'
  if (buffer < t.redH) return 'red'
  return 'yellow'
}

// derived from villages[].band
export function countAtRiskVillages(villages: Village[]): number {
  return villages.filter((v) => v.band === 'red' || v.band === 'yellow').length
}

// derived from methods.<m>.buffers for the stops of one route
export function getWorstStop(route: RoutePlan, buffers: Record<string, number>): { id: string; index: number; buffer: number } | null {
  let worst: { id: string; index: number; buffer: number } | null = null
  route.stops.forEach((id, index) => {
    const b = buffers[id]
    if (b !== undefined && (worst === null || b < worst.buffer)) worst = { id, index, buffer: b }
  })
  return worst
}

// derived from time_h of a method (total) or of one route
export function getTimeDifference(selected: { time_h: number }, fixed: { time_h: number }): number {
  return selected.time_h - fixed.time_h
}

// derived from sensitivity row values: nothing differs between methods
export function allEqual(row: { fixed: number; nearest: number; distance_only: number; risk_based: number }): boolean {
  return row.fixed === row.nearest && row.nearest === row.distance_only && row.distance_only === row.risk_based
}
