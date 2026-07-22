import { useState, useEffect, useCallback } from 'react'

export function useRpcQuery<T>(
  contractId: string,
  method: string,
  args: any[],
  options?: { interval?: number }
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Stub: replace with actual Soroban RPC call when deployed
      console.log('RPC query:', contractId, method, args)
      setData(null)
    } catch (e: any) {
      setError(e.message || 'RPC query failed')
    } finally {
      setLoading(false)
    }
  }, [contractId, method, JSON.stringify(args)])

  useEffect(() => {
    if (!contractId) return
    fetch()
    if (options?.interval && options.interval > 0) {
      const timer = setInterval(fetch, options.interval)
      return () => clearInterval(timer)
    }
  }, [contractId, fetch, options?.interval])

  return { data, error, loading, refetch: fetch }
}

export function useContractEvents(contractId: string) {
  const [events, _setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!contractId) return
    setLoading(true)
    // Stub: replace with actual event streaming (e.g. SSE or WebSocket)
    console.log('Subscribe to events for:', contractId)
    setLoading(false)
    return () => {
      // cleanup
    }
  }, [contractId])

  return { events, loading }
}
