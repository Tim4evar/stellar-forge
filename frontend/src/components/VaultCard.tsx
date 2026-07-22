import { useState } from 'react'
import { useRpcQuery } from '../hooks/useContract'
import { WalletState } from '../hooks/useWallet'

interface VaultCardProps {
  contractId: string
  wallet: WalletState
}

export default function VaultCard({ contractId, wallet }: VaultCardProps) {
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawShares, setWithdrawShares] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  interface VaultConfig {
    total_deposits: number
    total_shares: number
    share_price: number
    last_yield_time: number
    yield_rate_bps: number
    admin: string
    governance: string
  }

  const { data: configData } = useRpcQuery<VaultConfig>(contractId, 'get_config', [])
  const { data: balanceData } = useRpcQuery<number>(contractId, 'get_balance', [wallet.address])

  const handleDeposit = async () => {
    setActionLoading('deposit')
    setError(null)
    setSuccess(null)
    try {
      // TODO: build and sign transaction using Stellar SDK
      console.log('Deposit:', depositAmount)
      setSuccess('Deposit transaction submitted!')
      setDepositAmount('')
    } catch (e: any) {
      setError(e.message || 'Deposit failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleWithdraw = async () => {
    setActionLoading('withdraw')
    setError(null)
    setSuccess(null)
    try {
      // TODO: build and sign transaction using Stellar SDK
      console.log('Withdraw:', withdrawShares)
      setSuccess('Withdraw transaction submitted!')
      setWithdrawShares('')
    } catch (e: any) {
      setError(e.message || 'Withdraw failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Vault</h3>
        <p className="mt-1 text-sm text-gray-500">Yield-bearing deposit vault</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500">Your Balance</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {balanceData ? `${Number(balanceData).toLocaleString()}` : '--'}
            </dd>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500">Total Deposits</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {configData ? `${Number(configData.total_deposits).toLocaleString()}` : '--'}
            </dd>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500">Share Price</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {configData ? `${Number(configData.share_price).toLocaleString()}` : '--'}
            </dd>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500">Total Shares</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {configData ? `${Number(configData.total_shares).toLocaleString()}` : '--'}
            </dd>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Deposit Assets</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              onClick={handleDeposit}
              disabled={actionLoading === 'deposit' || !depositAmount}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {actionLoading === 'deposit' ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Withdraw Shares</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              value={withdrawShares}
              onChange={(e) => setWithdrawShares(e.target.value)}
              placeholder="Shares"
              className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              onClick={handleWithdraw}
              disabled={actionLoading === 'withdraw' || !withdrawShares}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {actionLoading === 'withdraw' ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}
