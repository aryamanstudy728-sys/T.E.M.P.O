import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { simulate, getAssumptions, getSensitivity } from './client'
import { thresholdsFrom } from '../lib/derive'
import type { SimulateRequest, SimulateResponse } from './types'

export function useSimulate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: SimulateRequest) => simulate(req),
    onSuccess: (data: SimulateResponse, variables: SimulateRequest) => {
      queryClient.setQueryData(['simulate', 'last'], data)
      queryClient.setQueryData(['simulate', 'lastRequest'], variables)
    },
  })
}

// Reads the last result from the cache so other pages see it after a page change.
export function useLastResult() {
  return useQuery<SimulateResponse>({ queryKey: ['simulate', 'last'], enabled: false, staleTime: Infinity })
}

export function useAssumptions() {
  return useQuery({ queryKey: ['assumptions'], queryFn: getAssumptions, staleTime: Infinity, retry: false })
}

// Band thresholds come from /api/assumptions (band_green_h, band_red_h).
export function useThresholds() {
  const { data } = useAssumptions()
  return data ? thresholdsFrom(data.items) : undefined
}

// Route ceiling from /api/assumptions (route_ceiling_h).
export function useRouteCeiling() {
  const { data } = useAssumptions()
  const item = data?.items.find((i) => i.name === 'route_ceiling_h')
  return typeof item?.value === 'number' ? item.value : undefined
}

export function useSensitivity() {
  return useQuery({ queryKey: ['sensitivity'], queryFn: getSensitivity, staleTime: Infinity, retry: false })
}
