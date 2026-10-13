import { useElementWidth, niceTicks, fmt } from './chartUtils'
import type { RouteTime } from '../../lib/derive'

interface VehicleTimesProps {
  times: RouteTime[]
  ceiling: number | undefined
}

const H = 220
const MARGIN = { top: 12, right: 16, bottom: 30, left: 44 }

export function VehicleTimes({ times, ceiling }: VehicleTimesProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  if (width === 0) return <div ref={ref} style={{ height: H }} />

  const INNER_W = width - MARGIN.left - MARGIN.right
  const INNER_H = H - MARGIN.top - MARGIN.bottom
  const plotRight = MARGIN.left + INNER_W

  const nVehicles = times.length
  const slotWidth = INNER_W / Math.max(nVehicles, 1)
  const maxBarWidth = 44
  const barWidth = Math.min(maxBarWidth, slotWidth * 0.8)

  // Y scale: 0 to max(ceiling, maxTime) * 1.1
  const maxTime = Math.max(...times.map(t => t.time_h), ceiling ?? 0, 0)
  const ceilingMax = ceiling ?? 0
  const scaleMax = Math.max(maxTime, ceilingMax) * 1.1
  const { ticks: yTicks, min: yMin, max: yMax } = niceTicks(0, scaleMax, 5)

  const yScale = (val: number) => {
    if (yMax === yMin) return MARGIN.top + INNER_H / 2
    const t = (val - yMin) / (yMax - yMin)
    return MARGIN.top + INNER_H - t * INNER_H
  }

  const xCenter = (i: number) => {
    return MARGIN.left + (i + 0.5) * slotWidth
  }

  const yCeiling = ceiling !== undefined ? yScale(ceiling) : -1

  return (
    <div ref={ref} style={{ width: '100%', height: H }}>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label={`Route time per vehicle. ${times.map(t => `Vehicle ${t.vehicle_id}: ${fmt(t.time_h, 1)} h`).join(', ')}`}>
        <defs>
          <style>{`
            .grid-line { stroke: var(--line); stroke-width: 0.5; }
            .axis-line { stroke: var(--line-strong); stroke-width: 1; }
            .tick-label { font: 11px inherit; fill: var(--muted); text-anchor: end; dominant-baseline: middle; }
            .tick-label-x { font: 11px inherit; fill: var(--muted); text-anchor: middle; dominant-baseline: hanging; }
            .axis-title { font: 12px inherit; fill: var(--muted); text-anchor: middle; }
            .ceiling-line { stroke: var(--red); stroke-width: 1; stroke-dasharray: 4,4; }
            .ceiling-label { font: 11px inherit; fill: var(--red); font-weight: 600; text-anchor: end; dominant-baseline: bottom; }
            .bar { fill: var(--muted); rx: 2; }
            .bar.over-ceiling { fill: var(--red); }
            .bar-value { font: 600 11px inherit; fill: var(--ink); text-anchor: middle; dominant-baseline: bottom; }
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

        {/* X axis */}
        <line
          x1={MARGIN.left}
          x2={plotRight}
          y1={MARGIN.top + INNER_H}
          y2={MARGIN.top + INNER_H}
          className="axis-line"
        />

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
          Time (h)
        </text>

        {/* Ceiling line - label INSIDE plot at plotRight - 4 */}
        {ceiling !== undefined && ceiling <= yMax && (
          <g>
            <line
              x1={MARGIN.left}
              x2={plotRight}
              y1={yCeiling}
              y2={yCeiling}
              className="ceiling-line"
            />
            <text
              x={plotRight - 4}
              y={yCeiling - 5}
              className="ceiling-label"
            >
              {fmt(ceiling)} h ceiling
            </text>
          </g>
        )}

        {/* Bars */}
        {times.map((t, i) => {
          const cx = xCenter(i)
          const barY = yScale(t.time_h)
          const barH = MARGIN.top + INNER_H - barY
          const isOver = ceiling !== undefined && t.time_h > ceiling
          const barX = cx - barWidth / 2

          return (
            <g key={t.vehicle_id}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={Math.max(barH, 1)}
                className={`bar ${isOver ? 'over-ceiling' : ''}`}
              />
              <text
                x={cx}
                y={barY - 4}
                className="bar-value"
              >
                {fmt(t.time_h, 1)} h
              </text>
              <text
                x={cx}
                y={MARGIN.top + INNER_H + 16}
                className="tick-label-x"
              >
                V{t.vehicle_id}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default VehicleTimes