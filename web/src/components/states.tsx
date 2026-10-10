import type { ReactNode } from 'react'
import Icon from './Icon'

const BOX = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', margin: '14px 0',
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8,
  color: 'var(--muted)', fontSize: 13,
} as const
const RETRY = {
  background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--line)',
  borderRadius: 6, padding: '4px 12px', fontWeight: 600, cursor: 'pointer',
} as const

// PRD section 6 States: dim but keep the previous result while fetching.
export function ResultFrame({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <div aria-busy={busy} style={{ opacity: busy ? 0.5 : 1, transition: 'opacity .15s' }}>
      {children}
    </div>
  )
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" style={{ ...BOX, color: 'var(--red)', borderColor: 'var(--red)' }}>
      <Icon name="alert-circle" />
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} style={RETRY}>
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div role="status" style={BOX}>
      <Icon name="info-circle" />
      <span>{children}</span>
    </div>
  )
}
