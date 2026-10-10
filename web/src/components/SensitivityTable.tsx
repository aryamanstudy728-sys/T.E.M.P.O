import type { SensitivityResponse } from '../api/types'
import { allEqual } from '../lib/derive'

// Rows exactly as the engine returned them. Values are villages breaching,
// averaged over the seeds listed by the engine.
export function SensitivityTable({ data }: { data: SensitivityResponse }) {
  return (
    <article className="panel">
      <div className="panel-head">
        <h2>Where risk-based ordering helps and where it stops</h2>
        <span className="subtle-meta">Villages breaching, mean over seeds {data.seeds.join(', ')}</span>
      </div>
      <div className="panel-body">
        <div aria-label="Sensitivity table" className="table-wrap" role="region" tabIndex={0}>
          <table className="risk-table">
            <thead>
              <tr>
                <th scope="col">Setting</th><th scope="col">Fixed</th><th scope="col">Nearest</th>
                <th scope="col">Distance only</th><th scope="col">Risk-based</th><th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={`${r.parameter}-${r.value}`}>
                  <td>{r.parameter} = {r.value}</td>
                  <td>{r.fixed}</td><td>{r.nearest}</td><td>{r.distance_only}</td><td>{r.risk_based}</td>
                  <td>{allEqual(r) ? 'All methods equal' : r.risk_based_wins ? 'Risk-based is lowest' : 'No better than baseline'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  )
}

export default SensitivityTable
