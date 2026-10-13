import type { Band, AssumptionItem, RoutePlan, Village, MethodResult } from '../api/types'

export interface Thresholds { greenH: number; redH: number }

// derived from /api/assumptions items band_green_h and band_red_h
export function thresholdsFrom(items: AssumptionItem[]): Thresholds | undefined {
  const g = items.find((i) => i.name === 'band_green_h')?.value
  const r = items.find((i) => i.name === 'band_red_h')?.value
  return typeof g === 'number' && typeof r === 'number' ? { greenH: g, redH: r } : undefined
}

// Same rule as the engine's risk.band(), using thresholds from /api/assumptions.
export function bandOf(buffer: number, t: Thresholds): Band
// New: bandOf with individual threshold params
export function bandOf(buffer_h: number, greenH: number, redH: number): Band
export function bandOf(buffer_h: number, tOrGreenH: Thresholds | number, redH?: number): Band {
  if (typeof tOrGreenH === 'number') {
    const g = tOrGreenH
    const r = redH ?? 0
    if (buffer_h > g) return 'green'
    if (buffer_h < r) return 'red'
    return 'yellow'
  }
  const t = tOrGreenH
  if (buffer_h > t.greenH) return 'green'
  if (buffer_h < t.redH) return 'red'
  return 'yellow'
}

export interface BandCounts { green: number; yellow: number; red: number }

// New: count buffers by band using individual thresholds
export function bandCounts(buffers: Record<string, number>, greenH: number, redH: number): BandCounts {
  const counts: BandCounts = { green: 0, yellow: 0, red: 0 }
  for (const b of Object.values(buffers)) {
    if (b > greenH) counts.green++
    else if (b < redH) counts.red++
    else counts.yellow++
  }
  return counts
}

export interface BufferSeriesPoint { seq: number; id: string; buffer_h: number }

// New: buffer series in stop order (1-based seq)
export function bufferSeries(route: RoutePlan, buffers: Record<string, number>): BufferSeriesPoint[] {
  return route.stops.map((id, idx) => ({
    seq: idx + 1,
    id,
    buffer_h: buffers[id] ?? NaN
  }))
}

// New: per-vehicle route times
export interface RouteTime { vehicle_id: number; time_h: number }

export function routeTimes(method: MethodResult): RouteTime[] {
  return method.routes.map((r) => ({ vehicle_id: r.vehicle_id, time_h: r.time_h }))
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
