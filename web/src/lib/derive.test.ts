import { describe, it, expect } from 'vitest'
import { bandOf, countAtRiskVillages, getWorstStop, thresholdsFrom, allEqual } from './derive'
import type { Village } from '../api/types'

const t = { greenH: 2.5, redH: 0.5 } // test values only
const v = (band: Village['band']): Village => ({
  id: 'V', name: 'V', lat: 0, lon: 0, volume_l: 1, milk_temp_c: 30, road_to_centre: 'pakka', buffer_h: 1, band,
})

describe('bandOf', () => {
  it('matches the engine rule', () => {
    expect(bandOf(2.6, t)).toBe('green')
    expect(bandOf(2.5, t)).toBe('yellow')
    expect(bandOf(0.5, t)).toBe('yellow')
    expect(bandOf(0.4, t)).toBe('red')
    expect(bandOf(-1, t)).toBe('red')
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
