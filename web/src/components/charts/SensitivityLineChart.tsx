import { useElementWidth, fmt, dodge, stepFor, ticksWithStep } from './chartUtils'
import type { SensitivityResponse } from '../../api/types'

interface SensitivityLineChartProps {
  data: SensitivityResponse
}

const H = 380
const MARGIN = { top: 16, right: 120, bottom: 56, left: 48 }

const METHOD_CONFIG = {
  fixed: { label: 'Fixed', color: 'var(--muted)', dash: '6,4', marker: 'square' },
  nearest: { label: 'Nearest', color: 'var(--muted)', dash: '2,4', marker: 'triangle' },
  distance_only: { label: 'Distance only', color: 'var(--muted)', dash: '4,2', marker: 'diamond' },
  risk_based: { label: 'Risk-based', color: 'var(--mint)', dash: 'none', marker: 'circle' },
} as const

type MethodKey = keyof typeof METHOD_CONFIG

interface RightLabel {
  y: number
  originalY: number
  color: string
  text: string
  x: number
  moved: boolean
}

function markerPath(x: number, y: number, shape: string, size = 4.5) {
  switch (shape) {
    case 'square':
      return `M${x - size} ${y - size} h${size * 2} v${size * 2} h-${size * 2} Z`
    case 'triangle':
      return `M${x} ${y - size} L${x + size} ${y + size} L${x - size} ${y + size} Z`
    case 'diamond':
      return `M${x} ${y - size} L${x + size} ${y} L${x} ${y + size} L${x - size} ${y} Z`
    case 'circle':
      return `M${x} ${y} m-${size} 0 a${size},${size} 0 1,0 ${size * 2},0 a${size},${size} 0 1,0 -${size * 2},0`
  }
}

export function SensitivityLineChart({ data }: SensitivityLineChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  if (width === 0) return <div ref={ref} style={{ minHeight: H }} />

  const INNER_W = width - MARGIN.left - MARGIN.right
  const INNER_H = H - MARGIN.top - MARGIN.bottom
  const plotRight = MARGIN.left + INNER_W

  // Filter rows for 'vehicles' parameter
  const vehicleRows = data.rows.filter(r => r.parameter === 'vehicles')
  if (vehicleRows.length === 0) return null

  // Sort by value
  vehicleRows.sort((a, b) => a.value - b.value)

  const methods: MethodKey[] = ['fixed', 'nearest', 'distance_only', 'risk_based']

  // Collect all values for scale - y axis starts at 0
  const allValues = vehicleRows.flatMap(r => methods.map(m => r[m]))
  const maxValue = Math.max(...allValues.filter(v => !Number.isNaN(v)), 0)

  // Y ticks with custom step
  const step = stepFor(maxValue)
  const { ticks: yTicks, min: tickMin, max: tickMax } = ticksWithStep(0, maxValue, step)

  const xValues = vehicleRows.map(r => r.value)
  const xScale = (val: number) => {
    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    if (xMax === xMin) return MARGIN.left + INNER_W / 2
    return MARGIN.left + ((val - xMin) / (xMax - xMin)) * INNER_W
  }

  const yScale = (val: number) => {
    if (tickMax === tickMin) return MARGIN.top + INNER_H / 2
    const t = (val - tickMin) / (tickMax - tickMin)
    return MARGIN.top + INNER_H - t * INNER_H
  }

  // End labels for dodge
  const endLabelData = methods
    .map(m => {
      const points = vehicleRows.map(r => ({
        x: xScale(r.value),
        y: yScale(r[m]),
        val: r[m],
        xVal: r.value,
      }))
      const valid = points.filter(p => !Number.isNaN(p.val))
      if (valid.length === 0) return null
      const cfg = METHOD_CONFIG[m]
      const last = valid[valid.length - 1]
      return { y: last.y, originalY: last.y, color: String(cfg.color), text: cfg.label, x: last.x, moved: false } as RightLabel
    })
    .filter((d): d is RightLabel => d !== null)

  // Dodge all right-edge labels once
  const originalYs = endLabelData.map(l => l.originalY)
  const dodgedYs = dodge(originalYs, 15, MARGIN.top + 10, MARGIN.top + INNER_H - 10)

  const labeledRight: RightLabel[] = endLabelData.map((l, i) => ({ ...l, y: dodgedYs[i], moved: Math.abs(dodgedYs[i] - originalYs[i]) > 4 }))

  return (
    <div ref={ref} style={{ width: '100%', minHeight: H }}>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label={`Sensitivity line chart for vehicles parameter. ${vehicleRows.map(r => `vehicles=${r.value}: ${methods.map(m => `${METHOD_CONFIG[m].label} ${r[m]}`).join(', ')}`).join('; ')}`}>
        <defs>
          <style>{`
            .grid-line { stroke: var(--line); stroke-width: 0.5; }
            .grid-line.zero { stroke: var(--line-strong); stroke-width: 1; }
            .axis-line { stroke: var(--line-strong); stroke-width: 1; }
            .tick-label { font: 11px inherit; fill: var(--muted); text-anchor: end; dominant-baseline: middle; }
            .tick-label-x { font: 11px inherit; fill: var(--muted); text-anchor: middle; dominant-baseline: hanging; }
            .axis-title { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
            .axis-title-x { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
            .polyline { fill: none; stroke-width: 2; }
            .polyline.fixed { stroke: var(--muted); stroke-dasharray: 6,4; }
            .polyline.nearest { stroke: var(--muted); stroke-dasharray: 2,4; }
            .polyline.distance_only { stroke: var(--muted); stroke-dasharray: 4,2; }
            .polyline.risk_based { stroke: var(--mint); }
            .marker { stroke-width: 1.5; }
            .marker.fixed { fill: var(--surface); stroke: var(--muted); }
            .marker.nearest { fill: var(--surface); stroke: var(--muted); }
            .marker.distance_only { fill: var(--surface); stroke: var(--muted); }
            .marker.risk_based { fill: var(--surface); stroke: var(--mint); }
            .point-label { font: 11px inherit; fill: var(--ink); text-anchor: middle; dominant-baseline: bottom; }
            .end-label { font: 600 11px inherit; text-anchor: start; dominant-baseline: middle; }
            .leader-line { stroke: var(--muted); stroke-width: 0.5; stroke-dasharray: 2,2; }
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

        {/* X gridlines */}
        <g className="grid">
          {xValues.map((val) => (
            <line
              key={val}
              x1={xScale(val)}
              x2={xScale(val)}
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
          {xValues.map((val) => (
            <text
              key={val}
              x={xScale(val)}
              y={MARGIN.top + INNER_H + 16}
              className="tick-label-x"
            >
              {val}
            </text>
          ))}
        </g>
        <text
          x={MARGIN.left + INNER_W / 2}
          y={MARGIN.top + INNER_H + 36}
          className="axis-title-x"
        >
          Vehicles
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
          Mean breaches
        </text>

        {/* Polylines and markers */}
        {methods.map((m) => {
          const points = vehicleRows.map((r) => ({
            x: xScale(r.value),
            y: yScale(r[m]),
            val: r[m],
            xVal: r.value,
          }))
          const validPoints = points.filter((p) => !Number.isNaN(p.val))
          if (validPoints.length === 0) return null

          // Split into continuous segments (null breaks the line)
          const segments: typeof validPoints[] = []
          let current: typeof validPoints = []
          for (let i = 0; i < points.length; i++) {
            if (!Number.isNaN(points[i].val)) {
              current.push(points[i])
            } else if (current.length > 0) {
              segments.push(current)
              current = []
            }
          }
          if (current.length > 0) segments.push(current)

          const cfg = METHOD_CONFIG[m]

          return (
            <g key={m} className="series">
              {segments.map((seg, segIdx) => {
                if (seg.length < 2) return null
                const pathD = seg
                  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                  .join(' ')
                return (
                  <path
                    key={segIdx}
                    d={pathD}
                    className={`polyline ${m}`}
                    aria-hidden="true"
                  />
                )
              })}
              {validPoints.map((p) => (
                <g key={p.xVal}>
                  <title>vehicles={p.xVal}, {cfg.label}, breaches={fmt(p.val, 1)}</title>
                  <path
                    d={markerPath(p.x, p.y, cfg.marker)}
                    className={`marker ${m}`}
                  />
                  {m === 'risk_based' && (
                    <text
                      x={p.x}
                      y={p.y - 8}
                      className="point-label"
                      style={{ fill: cfg.color }}
                    >
                      {fmt(p.val, 1)}
                    </text>
                  )}
                </g>
              ))}
            </g>
          )
        })}

        {/* Right-edge labels with unified dodge and leader lines */}
        {labeledRight.map((l) => {
          const labelX = plotRight + 8
          const lineEndX = l.x
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
                  className="leader-line"
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
    </div>
  )
}

export default SensitivityLineChart