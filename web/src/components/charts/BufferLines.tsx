import { useElementWidth, fmt, dodge, stepFor, ticksWithStep } from './chartUtils'
import type { BufferSeriesPoint } from '../../lib/derive'

interface BufferLinesProps {
  series: Array<{
    method: 'fixed' | 'nearest' | 'risk_based'
    label: string
    points: BufferSeriesPoint[]
  }>
  greenH: number
  redH: number
}

const H = 380
const MARGIN = { top: 16, right: 120, bottom: 56, left: 48 }

const METHOD_CONFIG = {
  fixed: { label: 'Fixed', color: 'var(--muted)', dash: '6,4', marker: 'square' },
  nearest: { label: 'Nearest', color: 'var(--muted)', dash: '2,4', marker: 'triangle' },
  risk_based: { label: 'Risk-based', color: 'var(--mint)', dash: 'none', marker: 'circle' },
} as const

type MethodKey = keyof typeof METHOD_CONFIG

interface RightLabel {
  y: number
  originalY: number
  color: string
  text: string
  isRef: boolean
  x?: number
  moved: boolean
}

function markerPath(x: number, y: number, shape: string, size = 4.5) {
  switch (shape) {
    case 'square':
      return `M${x - size} ${y - size} h${size * 2} v${size * 2} h-${size * 2} Z`
    case 'triangle':
      return `M${x} ${y - size} L${x + size} ${y + size} L${x - size} ${y + size} Z`
    case 'circle':
      return `M${x} ${y} m-${size} 0 a${size},${size} 0 1,0 ${size * 2},0 a${size},${size} 0 1,0 -${size * 2},0`
  }
}

export function BufferLines({ series, greenH, redH }: BufferLinesProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  if (width === 0) return <div ref={ref} style={{ minHeight: H }} />

  const INNER_W = width - MARGIN.left - MARGIN.right
  const INNER_H = H - MARGIN.top - MARGIN.bottom
  const plotRight = MARGIN.left + INNER_W

  // Find global min/max across all series
  let minBuf = 0
  let maxBuf = 0
  let maxSeq = 0
  for (const s of series) {
    for (const p of s.points) {
      if (!Number.isNaN(p.buffer_h)) {
        minBuf = Math.min(minBuf, p.buffer_h)
        maxBuf = Math.max(maxBuf, p.buffer_h)
        maxSeq = Math.max(maxSeq, p.seq)
      }
    }
  }
  // Ensure 0, redH, greenH are always visible
  const yMin = Math.min(0, minBuf, redH)
  const yMax = Math.max(greenH, maxBuf)
  const span = yMax - yMin

  // Y ticks with custom step
  const step = stepFor(span)
  const { ticks: yTicks, min: tickMin, max: tickMax } = ticksWithStep(yMin, yMax, step)

  const yScale = (val: number) => {
    if (tickMax === tickMin) return MARGIN.top + INNER_H / 2
    const t = (val - tickMin) / (tickMax - tickMin)
    return MARGIN.top + INNER_H - t * INNER_H
  }

  // X scale
  const xScale = (seq: number) => {
    if (maxSeq <= 1) return MARGIN.left + INNER_W / 2
    return MARGIN.left + ((seq - 1) / (maxSeq - 1)) * INNER_W
  }

  // Reference line y positions
  const yZero = yScale(0)
  const yRed = yScale(redH)
  const yGreen = yScale(greenH)

  // X axis ticks: every stop up to maxSeq
  const xTickSeqs = maxSeq <= 12
    ? Array.from({ length: maxSeq }, (_, i) => i + 1)
    : Array.from({ length: Math.ceil(maxSeq / 2) }, (_, i) => (i + 1) * 2 - (maxSeq % 2 === 0 ? 1 : 0)).filter(s => s <= maxSeq)

  // End labels: collect y positions for dodge
  const endLabelData = series
    .map(s => {
      const valid = s.points.filter(p => !Number.isNaN(p.buffer_h))
      if (valid.length === 0) return null
      const last = valid[valid.length - 1]
      const cfg = METHOD_CONFIG[s.method as MethodKey]
      return { y: yScale(last.buffer_h), originalY: yScale(last.buffer_h), color: String(cfg.color), text: cfg.label, isRef: false, x: xScale(last.seq), moved: false } as RightLabel
    })
    .filter((d): d is RightLabel => d !== null)

  // Reference line labels
  const refLabels: RightLabel[] = [
    { y: yZero, originalY: yZero, color: 'var(--red)', text: '0 h · breach', isRef: true, moved: false },
    { y: yRed, originalY: yRed, color: 'var(--red)', text: `${fmt(redH, 2)} h`, isRef: true, moved: false },
    { y: yGreen, originalY: yGreen, color: 'var(--mint)', text: `${fmt(greenH, 2)} h`, isRef: true, moved: false },
  ]

  // Combine ALL right-edge labels and dodge once
  const allRightLabels = [...refLabels, ...endLabelData]
  const originalYs = allRightLabels.map(l => l.originalY)
  const dodgedYs = dodge(originalYs, 15, MARGIN.top + 10, MARGIN.top + INNER_H - 10)

  // Assign dodged positions
  const labeledRight: RightLabel[] = allRightLabels.map((l, i) => ({ ...l, y: dodgedYs[i], moved: Math.abs(dodgedYs[i] - originalYs[i]) > 4 }))

  return (
    <div ref={ref} style={{ width: '100%', minHeight: H }}>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label={`Buffer along the route chart. ${series.map(s => `${s.label}: ${s.points.filter(p => !Number.isNaN(p.buffer_h)).length} stops`).join(', ')}`}>
        <defs>
          <style>{`
            .grid-line { stroke: var(--line); stroke-width: 0.5; }
            .grid-line.zero { stroke: var(--line-strong); stroke-width: 1; }
            .axis-line { stroke: var(--line-strong); stroke-width: 1; }
            .tick-label { font: 11px inherit; fill: var(--muted); text-anchor: end; dominant-baseline: middle; }
            .tick-label-x { font: 11px inherit; fill: var(--muted); text-anchor: middle; dominant-baseline: hanging; }
            .axis-title { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
            .axis-title-x { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
            .ref-line { stroke: var(--line); stroke-width: 1; stroke-dasharray: 4,4; }
            .ref-line.zero { stroke: var(--red); stroke-width: 1; stroke-dasharray: 4,4; }
            .ref-label { font: 11px inherit; fill: var(--muted); text-anchor: start; dominant-baseline: middle; font-weight: 600; }
            .polyline { fill: none; stroke-width: 2; }
            .polyline.fixed { stroke: var(--muted); stroke-dasharray: 6,4; }
            .polyline.nearest { stroke: var(--muted); stroke-dasharray: 2,4; }
            .polyline.risk_based { stroke: var(--mint); }
            .marker { stroke-width: 1.5; }
            .marker.fixed { fill: var(--surface); stroke: var(--muted); }
            .marker.nearest { fill: var(--surface); stroke: var(--muted); }
            .marker.risk_based { fill: var(--surface); stroke: var(--mint); }
            .marker.critical-ring { fill: none; stroke: var(--red); stroke-width: 2; }
            .end-label { font: 600 11px inherit; text-anchor: start; dominant-baseline: middle; }
            .leader-line { stroke: var(--muted); stroke-width: 0.5; stroke-dasharray: 2,2; }
            .leader-line.ref { stroke: var(--red); }
          `}</style>
        </defs>

        {/* Y gridlines - lighter at every tick, stronger at 0 */}
        <g className="grid">
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={MARGIN.left}
              x2={plotRight}
              y1={yScale(tick)}
              y2={yScale(tick)}
              className={tick === 0 ? 'grid-line zero' : 'grid-line'}
            />
          ))}
        </g>

        {/* X gridlines (vertical) */}
        <g className="grid">
          {xTickSeqs.map((seq) => (
            <line
              key={seq}
              x1={xScale(seq)}
              x2={xScale(seq)}
              y1={MARGIN.top}
              y2={MARGIN.top + INNER_H}
              className="grid-line"
            />
          ))}
        </g>

        {/* X axis */}
        <line
          x1={MARGIN.left}
          x2={plotRight}
          y1={MARGIN.top + INNER_H}
          y2={MARGIN.top + INNER_H}
          className="axis-line"
        />
        <g>
          {xTickSeqs.map((seq) => (
            <text
              key={seq}
              x={xScale(seq)}
              y={MARGIN.top + INNER_H + 16}
              className="tick-label-x"
            >
              {seq}
            </text>
          ))}
        </g>
        <text
          x={MARGIN.left + INNER_W / 2}
          y={MARGIN.top + INNER_H + 36}
          className="axis-title-x"
        >
          Stop number on this vehicle's route
        </text>

        {/* Y axis */}
        <line
          x1={MARGIN.left}
          x2={MARGIN.left}
          y1={MARGIN.top}
          y2={MARGIN.top + INNER_H}
          className="axis-line"
        />
        <g>
          {yTicks.map((tick) => (
            <text
              key={tick}
              x={MARGIN.left - 8}
              y={yScale(tick)}
              className="tick-label"
            >
              {fmt(tick, 2)}
            </text>
          ))}
        </g>
        <text
          x={20}
          y={MARGIN.top + INNER_H / 2}
          className="axis-title"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90, 20, ${MARGIN.top + INNER_H / 2})`}
        >
          Buffer (h)
        </text>

        {/* Reference lines */}
        <g className="ref-lines">
          <line
            x1={MARGIN.left}
            x2={plotRight}
            y1={yZero}
            y2={yZero}
            className="ref-line zero"
          />
          <line
            x1={MARGIN.left}
            x2={plotRight}
            y1={yRed}
            y2={yRed}
            className="ref-line"
          />
          <line
            x1={MARGIN.left}
            x2={plotRight}
            y1={yGreen}
            y2={yGreen}
            className="ref-line"
          />
        </g>

        {/* Polylines and markers */}
        {series.map((s) => {
          const validPoints = s.points.filter((p) => !Number.isNaN(p.buffer_h))
          if (validPoints.length < 2) return null

          const pathD = validPoints
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.seq)} ${yScale(p.buffer_h)}`)
            .join(' ')

          const cfg = METHOD_CONFIG[s.method as MethodKey]

          return (
            <g key={s.method} className="series">
              <path
                d={pathD}
                className={`polyline ${s.method}`}
                aria-hidden="true"
              />
              {validPoints.map((p) => {
                const cx = xScale(p.seq)
                const cy = yScale(p.buffer_h)
                const isCritical = p.buffer_h < 0
                return (
                  <g key={p.seq}>
                    <title>{p.id}, stop {p.seq}, buffer {fmt(p.buffer_h, 2)} h</title>
                    {isCritical && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        className="marker critical-ring"
                      />
                    )}
                    <path
                      d={markerPath(cx, cy, cfg.marker)}
                      className={`marker ${s.method}`}
                    />
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* Right-edge labels (reference + method end labels) with unified dodge and leader lines */}
        {labeledRight.map((l) => {
          const labelX = plotRight + 8
          const lineEndX = l.isRef ? plotRight : (l.x ?? plotRight)
          const lineEndY = l.originalY
          const needsLeader = l.moved
          return (
            <g key={l.text}>
              {needsLeader && (
                <line
                  x1={lineEndX}
                  x2={labelX - 2}
                  y1={lineEndY}
                  y2={l.y}
                  className={`leader-line ${l.isRef ? 'ref' : ''}`}
                />
              )}
              <text
                x={labelX}
                y={l.y}
                className="end-label"
                style={{ fill: l.color }}
              >
                {l.text}
              </text>
            </g>
          )
        })}
      </svg>

      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
        Each line is this vehicle's route under that method. The vehicle visits different villages in each method.
      </p>
    </div>
  )
}

export default BufferLines