import { useRef, type ChangeEvent } from 'react'
import type { VillageInput } from '../api/types'

interface UploadButtonProps {
  onUpload: (villages: VillageInput[]) => void
  onError: (err: string) => void
  disabled?: boolean
}

export function UploadButton({ onUpload, onError, disabled }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        onError('This file is not valid JSON.')
        return
      }

      const villagesList = Array.isArray(parsed)
        ? parsed
        : (parsed as { villages?: unknown })?.villages

      if (!Array.isArray(villagesList)) {
        onError('This file is not valid JSON.')
        return
      }

      onUpload(villagesList as VillageInput[])
    } catch {
      onError('This file is not valid JSON.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="village-upload-input"
        aria-label="Upload villages JSON file"
      />
      <button
        type="button"
        className="chip-btn"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: 'var(--surface-raised, #18201d)',
          color: 'var(--text, #e6ede8)',
          border: '1px solid var(--line, #222d28)',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        Upload villages JSON
      </button>
    </div>
  )
}

export default UploadButton

