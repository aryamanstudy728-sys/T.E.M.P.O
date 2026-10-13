import { describe, it, expect } from 'vitest'
import {
  bandOf,
  countAtRiskVillages,
  getWorstStop,
  thresholdsFrom,
  allEqual,
  bandCounts,
  bufferSeries,
  routeTimes,
} from './derive'
import type { Village, RoutePlan, MethodResult } from '../api/types'

const t = { greenH: 2.5, redH: 0.5 } // test values only
const v = (band: Village['band']): Village => ({
  id: 'V', name: 'V', lat: 0, lon: 0, volume_l: 1, milk_temp_c: 30, road_to_centre: 'pakka', buffer_h: 1, band,
})

describe('bandOf', () => {
  it('matches the engine rule (Thresholds object)', () => {
    expect(bandOf(2.6, t)).toBe('green')
    expect(bandOf(2.5, t)).toBe('yellow')
    expect(bandOf(0.5, t)).toBe('yellow')
    expect(bandOf(0.4, t)).toBe('red')
    expect(bandOf(-1, t)).toBe('red')
  })
  it('works with individual threshold params', () => {
    expect(bandOf(2.6, 2.5, 0.5)).toBe('green')
    expect(bandOf(2.5, 2.5, 0.5)).toBe('yellow')
    expect(bandOf(0.5, 2.5, 0.5)).toBe('yellow')
    expect(bandOf(0.4, 2.5, 0.5)).toBe('red')
    expect(bandOf(-1, 2.5, 0.5)).toBe('red')
  })
})
describe('thresholdsFrom', () => {
  it('reads the two band items', () => {
    const items = [
      { name: 'band_green_h', value: 2.5, status: 'guessed' as const, note: '' },
      { name: 'band_red_h', value: 0.5, status: 'guessed' as const, note: '' },
    ]
    expect(thresholdsFrom(items)).toEqual(t)
    expect(thresholdsFrom([])).toBeUndefined()
  })
})
describe('countAtRiskVillages', () => {
  it('counts yellow and red', () => {
    expect(countAtRiskVillages([v('green'), v('yellow'), v('red')])).toBe(2)
  })
})
describe('getWorstStop', () => {
  it('finds the lowest buffer', () => {
    const w = getWorstStop({ vehicle_id: 1, stops: ['A', 'B'], time_h: 1 }, { A: 1, B: -0.5 })
    expect(w).toEqual({ id: 'B', index: 1, buffer: -0.5 })
  })
  it('returns null for no stops', () => {
    expect(getWorstStop({ vehicle_id: 1, stops: [], time_h: 0 }, {})).toBeNull()
  })
})
describe('allEqual', () => {
  it('detects identical methods', () => {
    expect(allEqual({ fixed: 0, nearest: 0, distance_only: 0, risk_based: 0 })).toBe(true)
    expect(allEqual({ fixed: 1, nearest: 0, distance_only: 0, risk_based: 0 })).toBe(false)
  })
})

describe('bandCounts', () => {
  it('counts buffers by band', () => {
    const buffers = { A: 3.0, B: 1.0, C: 0.0, D: -1.0 }
    expect(bandCounts(buffers, 2.5, 0.5)).toEqual({ green: 1, yellow: 1, red: 2 })
  })
  it('empty buffers returns zero counts', () => {
    expect(bandCounts({}, 2.5, 0.5)).toEqual({ green: 0, yellow: 0, red: 0 })
  })
})

describe('bufferSeries', () => {
  it('returns series in stop order with 1-based seq', () => {
    const route: RoutePlan = { vehicle_id: 1, stops: ['A', 'B', 'C'], time_h: 2 }
    const buffers = { A: 1.5, B: -0.2, C: 3.0 }
    expect(bufferSeries(route, buffers)).toEqual([
      { seq: 1, id: 'A', buffer_h: 1.5 },
      { seq: 2, id: 'B', buffer_h: -0.2 },
      { seq: 3, id: 'C', buffer_h: 3.0 },
    ])
  })
  it('empty stops returns empty array', () => {
    const route: RoutePlan = { vehicle_id: 1, stops: [], time_h: 0 }
    expect(bufferSeries(route, {})).toEqual([])
  })
})

describe('routeTimes', () => {
  it('extracts vehicle_id and time_h per route', () => {
    const method: MethodResult = {
      routes: [
        { vehicle_id: 1, stops: ['A', 'B'], time_h: 2.5 },
        { vehicle_id: 2, stops: ['C'], time_h: 1.0 },
      ],
      buffers: {},
      breaching_ids: [],
      breaches: 0,
      time_h: 3.5,
      over_ceiling: [],
      volume_at_risk_l: 0,
    }
    expect(routeTimes(method)).toEqual([
      { vehicle_id: 1, time_h: 2.5 },
      { vehicle_id: 2, time_h: 1.0 },
    ])
  })
  it('empty routes returns empty array', () => {
    const method: MethodResult = {
      routes: [],
      buffers: {},
      breaching_ids: [],
      breaches: 0,
      time_h: 0,
      over_ceiling: [],
      volume_at_risk_l: 0,
    }
    expect(routeTimes(method)).toEqual([])
  })
})
