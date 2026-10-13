import { useEffect, useRef, useState } from 'react'

export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(Math.floor(el.clientWidth))
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width }
}

export function niceTicks(min: number, max: number, target = 5) {
  const span = max - min || 1
  const raw = span / target
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const f = raw / pow
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow
  const start = Math.floor(min / step) * step
  const end = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6)
  return { ticks, min: start, max: end }
}

export const fmt = (n: number, d = 1) => Number(n.toFixed(d)).toString()

// Spread label y-positions so none are closer than minGap px (keeps order).
export function dodge(ys: number[], minGap = 14, top = 0, bottom = Infinity) {
  const idx = ys.map((_, i) => i).sort((a, b) => ys[a] - ys[b])
  const out = [...ys]
  let prev = top - minGap
  for (const i of idx) { out[i] = Math.max(ys[i], prev + minGap); prev = out[i] }
  const over = out[idx[idx.length - 1]] - bottom
  if (over > 0) for (const i of idx) out[i] -= over
  return out
}

export function stepFor(span: number) {
  return span <= 3 ? 0.25 : span <= 6 ? 0.5 : span <= 12 ? 1 : span <= 30 ? 2 : 5
}

export function ticksWithStep(min: number, max: number, step: number) {
  const start = Math.floor(min / step) * step
  const end = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6)
  return { ticks, min: start, max: end, step }
}