import { useWallet } from '../hooks/useWallet'

interface WalletButtonProps {
  onConnect?: () => void
}

export default function WalletButton({ onConnect }: WalletButtonProps) {
  const { wallet, connect, disconnect, loading, error } = useWallet()

  if (wallet.isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 hidden sm:block">
          {wallet.address?.slice(0, 4)}...{wallet.address?.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-2 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
      <button
        onClick={onConnect || connect}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  )
}
