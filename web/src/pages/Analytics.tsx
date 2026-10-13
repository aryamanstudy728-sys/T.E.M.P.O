import { useAssumptions, useSensitivity, useLastResult, useThresholds } from '../api/hooks'
import SensitivityTable from '../components/SensitivityTable'
import ParameterTable from '../components/ParameterTable'
import BandDistribution from '../components/BandDistribution'
import SensitivityLineChart from '../components/charts/SensitivityLineChart'
import { EmptyState, ErrorMessage } from '../components/states'
import '../styles/kombai-analytics.css'
import '../styles/charts.css'

export function Analytics() {
  const sens = useSensitivity()
  const params = useAssumptions()
  const { data: last } = useLastResult()
  const thresholds = useThresholds()
  // derived from assumptions items[].status
  const items = params.data?.items ?? []
  const sourced = items.filter((i) => i.status === 'sourced').length
  const guessed = items.filter((i) => i.status === 'guessed').length

  return (
    <div className="tempo-ui page-analytics">
      <main style={{ padding: '24px 32px', display: 'grid', gap: 16 }}>
        <h1>Analytics</h1>

        {params.data && (
          <section aria-label="Parameter status" className="summary-strip">
            <div className="summary-item"><span className="summary-label">Sourced parameters</span><div className="summary-value tone-mint">{sourced}</div></div>
            <div className="summary-item"><span className="summary-label">Guessed parameters</span><div className="summary-value tone-amber">{guessed}</div></div>
          </section>
        )}

        {sens.isLoading && <EmptyState>Loading sensitivity results.</EmptyState>}
        {sens.isError && <ErrorMessage message={sens.error.message} onRetry={() => sens.refetch()} />}
        
        {sens.data && (
          <>
            <section className="sensitivity-line-panel" aria-labelledby="sensitivity-line-title">
              <div className="sensitivity-line-panel-head">
                <div>
                  <h2 id="sensitivity-line-title" className="sensitivity-line-panel-title">Sensitivity: vehicles vs mean breaches</h2>
                  <p className="sensitivity-line-panel-subtitle">Mean over seeds {sens.data.seeds.join(', ')}</p>
                </div>
                <p className="sensitivity-line-panel-caption">
                  Risk-based wins in {sens.data.rows.filter(r => r.parameter === 'vehicles' && r.risk_based_wins).length} of {sens.data.rows.filter(r => r.parameter === 'vehicles').length} settings
                </p>
              </div>
              <SensitivityLineChart data={sens.data} />
            </section>
            
            <SensitivityTable data={sens.data} />
          </>
        )}
        
        {last && <BandDistribution data={last} thresholds={thresholds} />}

        {params.isError && <ErrorMessage message={params.error.message} onRetry={() => params.refetch()} />}
        {params.data && <ParameterTable data={params.data} />}
      </main>
    </div>
  )
}

export default Analytics
