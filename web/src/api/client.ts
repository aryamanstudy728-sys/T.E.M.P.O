import type {
  SimulateRequest, SimulateResponse, VillageInput, Assumptions, SensitivityResponse,
} from './types'
import simulateSample from '@contract/simulate.sample.json'
import sampleSample from '@contract/sample.sample.json'
import healthSample from '@contract/health.sample.json'
import assumptionsSample from '@contract/assumptions.sample.json'
import sensitivitySample from '@contract/sensitivity.sample.json'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// The engine answers errors as {"detail": "<one plain message>"}; show it verbatim.
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = res.statusText || `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body && typeof body.detail === 'string') message = body.detail
      else if (body && body.detail) message = JSON.stringify(body.detail)
    } catch {
      // not JSON: keep the status text
    }
    throw new ApiError(res.status, message)
  }
  return res.json()
}

const isMock = import.meta.env.VITE_USE_MOCK === '1'
const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

// In mock mode every call returns the committed contract file whatever the request.
export async function simulate(req: SimulateRequest): Promise<SimulateResponse> {
  if (isMock) return simulateSample as unknown as SimulateResponse
  return handleResponse<SimulateResponse>(await post('/api/simulate', req))
}

export async function getSample(): Promise<{ villages: VillageInput[] }> {
  if (isMock) return sampleSample as { villages: VillageInput[] }
  return handleResponse(await fetch('/api/sample'))
}

export async function getHealth(): Promise<{ status: string; version: number }> {
  if (isMock) return healthSample
  return handleResponse(await fetch('/api/health'))
}

export async function getAssumptions(): Promise<Assumptions> {
  if (isMock) return assumptionsSample as unknown as Assumptions
  return handleResponse(await fetch('/api/assumptions'))
}

export async function getSensitivity(): Promise<SensitivityResponse> {
  if (isMock) return sensitivitySample as SensitivityResponse
  return handleResponse(await fetch('/api/sensitivity'))
}
