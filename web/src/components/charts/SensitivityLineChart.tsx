import { useElementWidth, niceTicks, fmt, dodge } from './chartUtils'
import type { SensitivityResponse } from '../../api/types'

interface SensitivityLineChartProps {
  data: SensitivityResponse
}

const H = 260
const MARGIN = { top: 12, right: 96, bottom: 30, left: 44 }

const METHOD_CONFIG = {
  fixed: { label: 'Fixed', color: 'var(--muted)', dash: '6,4', marker: 'square' },
  nearest: { label: 'Nearest', color: 'var(--muted)', dash: '2,4', marker: 'triangle' },
  distance_only: { label: 'Distance only', color: 'var(--muted)', dash: '4,2', marker: 'diamond' },
  risk_based: { label: 'Risk-based', color: 'var(--mint)', dash: 'none', marker: 'circle' },
} as const

type MethodKey = keyof typeof METHOD_CONFIG

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
  if (width === 0) return <div ref={ref} style={{ height: H }} />

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
  const { ticks: yTicks, min: yMin, max: yMax } = niceTicks(0, maxValue, 5)
  // Add 6px padding at top so risk-based line at 0 doesn't sit on axis
  const paddedMax = yMax + (yMax - yMin) * 0.06

  const xValues = vehicleRows.map(r => r.value)
  const xScale = (val: number) => {
    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    if (xMax === xMin) return MARGIN.left + INNER_W / 2
    return MARGIN.left + ((val - xMin) / (xMax - xMin)) * INNER_W
  }

  const yScale = (val: number) => {
    if (paddedMax === yMin) return MARGIN.top + INNER_H / 2
    const t = (val - yMin) / (paddedMax - yMin)
    return MARGIN.top + INNER_H - t * INNER_H
  }

  // End labels with dodge
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
      return { label: cfg.label, x: last.x, y: last.y, color: cfg.color }
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)

  const dodgedEndY = dodge(endLabelData.map(d => d.y), 14, MARGIN.top + 10, MARGIN.top + INNER_H - 10)

  return (
    <div ref={ref} style={{ width: '100%', height: H }}>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label={`Sensitivity line chart for vehicles parameter. ${vehicleRows.map(r => `vehicles=${r.value}: ${methods.map(m => `${METHOD_CONFIG[m].label} ${r[m]}`).join(', ')}`).join('; ')}`}>
        <defs>
          <style>{`
            .grid-line { stroke: var(--line); stroke-width: 0.5; }
            .axis-line { stroke: var(--line-strong); stroke-width: 1; }
            .tick-label { font: 11px inherit; fill: var(--muted); text-anchor: end; dominant-baseline: middle; }
            .tick-label-x { font: 11px inherit; fill: var(--muted); text-anchor: middle; dominant-baseline: hanging; }
            .axis-title { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
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
            .axis-title-x { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
          `}</style>
        </defs>

        {/* Y gridlines */}
        <g className="grid">
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={MARGIN.left}
              x2={plotRight}
              y1={yScale(tick)}
              y2={yScale(tick)}
              className="grid-line"
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
              {fmt(tick)}
            </text>
          ))}
        </g>
        <text
          x={18}
          y={MARGIN.top + INNER_H / 2}
          className="axis-title"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90, 18, ${MARGIN.top + INNER_H / 2})`}
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

        {/* End labels with dodge */}
        {endLabelData.map((d, i) => (
          <text
            key={d.label}
            x={plotRight + 8}
            y={dodgedEndY[i]}
            className="end-label"
            style={{ fill: d.color }}
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default SensitivityLineChart