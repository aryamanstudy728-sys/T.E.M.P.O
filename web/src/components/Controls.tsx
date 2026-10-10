import { useState } from 'react'
import type { Scenario, SimulateRequest, VillageInput } from '../api/types'
import { getSample } from '../api/client'
import UploadButton from './UploadButton'

interface ControlsProps {
  request: SimulateRequest
  onChange: (next: SimulateRequest) => void
  onRun: () => void
  loading?: boolean
  errorMessage?: string | null
}

export function Controls({ request, onChange, onRun, loading, errorMessage }: ControlsProps) {
  const [sampleJson, setSampleJson] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleShowSample = async () => {
    if (!sampleJson) {
      try {
        const sample = await getSample()
        setSampleJson(JSON.stringify(sample, null, 2))
      } catch {
        setSampleJson('Failed to load sample format.')
      }
    }
  }

  const handleUpload = (villages: VillageInput[]) => {
    setUploadError(null)
    onChange({ ...request, villages })
  }

  const err = uploadError || errorMessage

  return (
    <div className="controls-bar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
      <form
        onSubmit={(e) => { e.preventDefault(); onRun() }}
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}
      >
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          Scenario:
          <select
            value={request.scenario}
            onChange={(e) => onChange({ ...request, scenario: e.target.value as Scenario })}
            style={{ background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--line)', padding: '5px 8px', borderRadius: '5px' }}
          >
            <option value="normal">Normal</option>
            <option value="heatwave">Heatwave</option>
            <option value="slow_roads">Slow Roads</option>
            <option value="cooler_failure">Cooler Failure</option>
          </select>
        </label>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          <input
            type="checkbox"
            checked={request.ambient_c !== null}
            onChange={(e) => onChange({ ...request, ambient_c: e.target.checked ? 38 : null })}
          />
          Override temperature
          {request.ambient_c !== null && (
            <>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{request.ambient_c}°C</span>
              <input
                type="range"
                aria-label="Ambient temperature in degrees Celsius"
                min={20}
                max={50}
                value={request.ambient_c}
                onChange={(e) => onChange({ ...request, ambient_c: Number(e.target.value) })}
                style={{ accentColor: 'var(--mint)', verticalAlign: 'middle', width: '90px' }}
              />
            </>
          )}
        </label>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          Vehicles:
          <select
            value={request.vehicles}
            onChange={(e) => onChange({ ...request, vehicles: Number(e.target.value) })}
            style={{ background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--line)', padding: '5px 8px', borderRadius: '5px' }}
          >
            {[3, 4, 5, 6, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          Seed:
          <input
            type="number"
            value={request.seed}
            onChange={(e) => onChange({ ...request, seed: Number(e.target.value) })}
            style={{ width: '55px', background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--line)', padding: '4px 6px', borderRadius: '5px' }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ background: 'var(--mint)', color: '#07110e', border: 'none', borderRadius: '6px', padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}
        >
          {loading ? 'Running...' : 'Run'}
        </button>

        <UploadButton onUpload={handleUpload} onError={setUploadError} disabled={loading} />

        {request.villages && (
          <span style={{ fontSize: '11px', color: 'var(--mint)' }}>
            ({request.villages.length} custom villages loaded)
          </span>
        )}

        <details onToggle={(e) => (e.currentTarget.open && handleShowSample())} style={{ fontSize: '12px', color: 'var(--muted)' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--mint)', textDecoration: 'underline' }}>Show sample format</summary>
          {sampleJson && (
            <pre style={{ maxHeight: '180px', overflow: 'auto', background: 'var(--surface-raised)', padding: '8px', borderRadius: '6px', marginTop: '6px', fontSize: '11px', color: 'var(--text)' }}>
              {sampleJson}
            </pre>
          )}
        </details>
      </form>

      {err && (
        <div role="alert" style={{ color: 'var(--red)', fontSize: '12px', padding: '4px 8px', background: 'var(--red-dim)', borderRadius: '4px' }}>
          {err}
        </div>
      )}
    </div>
  )
}

export default Controls

