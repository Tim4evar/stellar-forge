import { useState } from 'react'
import { useRpcQuery } from '../hooks/useContract'
import { WalletState } from '../hooks/useWallet'

interface GovernancePanelProps {
  contractId: string
  wallet?: WalletState
}

export default function GovernancePanel({ contractId }: GovernancePanelProps) {
  const [proposalDescription, setProposalDescription] = useState('')
  const [proposalRate, setProposalRate] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { data: rateData } = useRpcQuery(contractId, 'approved_rate', [])

  const handleCreateProposal = async () => {
    setActionLoading('proposal')
    setError(null)
    setSuccess(null)
    try {
      // TODO: build and sign transaction using Stellar SDK
      console.log('Create proposal:', proposalDescription, proposalRate)
      setSuccess('Proposal created!')
      setProposalDescription('')
      setProposalRate('')
    } catch (e: any) {
      setError(e.message || 'Transaction failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleVote = async (inFavor: boolean) => {
    setActionLoading('vote')
    setError(null)
    setSuccess(null)
    try {
      // TODO: build and sign transaction using Stellar SDK
      console.log('Vote:', inFavor)
      setSuccess(`Vote ${inFavor ? 'For' : 'Against'} submitted!`)
    } catch (e: any) {
      setError(e.message || 'Vote failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Governance</h3>
        <p className="mt-1 text-sm text-gray-500">DAO voting and parameter management</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <dt className="text-sm font-medium text-gray-500">Current Yield Rate</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">
            {rateData ? `${Number(rateData).toLocaleString()} bps` : '--'}
          </dd>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Create Proposal</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              placeholder="Proposal description"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="number"
              value={proposalRate}
              onChange={(e) => setProposalRate(e.target.value)}
              placeholder="Yield rate (bps)"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              onClick={handleCreateProposal}
              disabled={actionLoading === 'proposal' || !proposalDescription}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {actionLoading === 'proposal' ? 'Creating...' : 'Create Proposal'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Vote</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleVote(true)}
              disabled={actionLoading === 'vote'}
              className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Vote For
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={actionLoading === 'vote'}
              className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Vote Against
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
