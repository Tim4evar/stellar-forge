import { useState, useEffect } from 'react'

export interface WalletState {
  isConnected: boolean
  address: string | null
  publicKey: string | null
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    publicKey: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      // @ts-ignore
      if (!window.freighter) {
        throw new Error('Freighter wallet not found. Please install Freighter.')
      }
      // @ts-ignore
      const api = await window.freighter.getApi()
      await api.connect()
      const address = await api.getAddress()
      setWallet({
        isConnected: true,
        address,
        publicKey: address,
      })
    } catch (e: any) {
      setError(e.message || 'Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      publicKey: null,
    })
  }

  useEffect(() => {
    const checkConnected = async () => {
      try {
        // @ts-ignore
        if (window.freighter) {
          // @ts-ignore
          const api = await window.freighter.getApi()
          const isConnected = await api.isConnected()
          if (isConnected) {
            const address = await api.getAddress()
            setWallet({
              isConnected: true,
              address,
              publicKey: address,
            })
          }
        }
      } catch {
        // ignore
      }
    }
    checkConnected()
  }, [])

  return { wallet, loading, error, connect, disconnect }
}
