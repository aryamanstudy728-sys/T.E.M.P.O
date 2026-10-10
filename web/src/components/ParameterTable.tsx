import type { Assumptions } from '../api/types'

const show = (v: Assumptions['items'][number]['value']) => (Array.isArray(v) ? v.join(' to ') : String(v))

export function ParameterTable({ data }: { data: Assumptions }) {
  return (
    <article className="panel">
      <div className="panel-head"><h2>Parameters</h2><span className="subtle-meta">Each marked sourced or guessed</span></div>
      <div className="panel-body">
        <div aria-label="Parameters table" className="table-wrap" role="region" tabIndex={0}>
          <table className="risk-table">
            <thead><tr><th scope="col">Name</th><th scope="col">Value</th><th scope="col">Status</th><th scope="col">Note</th></tr></thead>
            <tbody>
              {data.items.map((i) => (
                <tr key={i.name}><td>{i.name}</td><td>{show(i.value)}</td><td>{i.status}</td><td>{i.note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  )
}

export default ParameterTable
