import { useWallet } from './hooks/useWallet'
import { useContractEvents } from './hooks/useContract'
import WalletButton from './components/WalletButton'
import VaultCard from './components/VaultCard'
import GovernancePanel from './components/GovernancePanel'

const VAULT_CONTRACT_ID = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITA4'
const GOV_CONTRACT_ID = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHK3M'

function App() {
  const { wallet } = useWallet()
  const { events: vaultEvents } = useContractEvents(VAULT_CONTRACT_ID)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Stellar Forge</h1>
              <span className="hidden sm:inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Stellar Testnet
              </span>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!wallet.isConnected ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 002 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stellar Forge Vault</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              A production-ready yield-bearing vault on Stellar with on-chain governance.
            </p>
            <WalletButton />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VaultCard contractId={VAULT_CONTRACT_ID} wallet={wallet} />
              <GovernancePanel contractId={GOV_CONTRACT_ID} wallet={wallet} />
            </div>

            {vaultEvents && vaultEvents.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {vaultEvents.map((event: any, i: number) => (
                    <div key={i} className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                      {JSON.stringify(event)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built with Stellar · Soroban Smart Contracts · React + TypeScript
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
