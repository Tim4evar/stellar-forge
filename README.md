# Stellar Forge - Advanced Soroban dApp

Production-ready Stellar dApp featuring advanced smart contract logic, on-chain governance, and a mobile-responsive frontend.

## Architecture

```
stellar-forge/
├── contracts/
│   ├── vault/          # Yield-bearing smart contract
│   └── governance/     # DAO governance contract
├── frontend/           # React + TypeScript UI
├── .github/workflows/  # CI/CD pipeline
└── docs/               # Documentation & demo materials
```

## Smart Contracts

### Vault (`contracts/vault`)
- **Deposit / Withdraw**: Users stake assets and earn yield
- **Share-based accounting**: Prevents manipulation of share price
- **Inter-contract communication**: Calls governance contract to fetch the approved yield rate
- **Events**: Emits events on deposit, withdraw, and yield distribution
- **Storage**: Uses persistent storage for balances and vault configuration

### Governance (`contracts/governance`)
- **Yield Rate Management**: Approves yield rates that vault uses via inter-contract calls
- **Proposal System**: Create proposals with unique IDs
- **Voting**: Users vote For/Against with time-bound voting windows
- **Execution**: Proposals execute after voting ends if they pass quorum

## Features

### Advanced Smart Contract Development
- Multiple Soroban contracts with inter-contract communication
- Persistent and temporary storage patterns
- Event emission for off-chain indexing
- Access control and authentication patterns

### CI/CD Pipeline
- Automated contract builds and tests on push/PR
- Frontend lint and build verification
- Preview deployments for pull requests

### Production-Ready Frontend
- **Mobile Responsive**: Works on all screen sizes
- **Wallet Integration**: Freighter wallet support
- **Real-time Updates**: Event streaming via Soroban RPC
- **Error Handling**: Loading states and user-friendly error messages
- **TypeScript**: Full type safety across the frontend

## Local Development

### Prerequisites
- Rust 1.91.0 or higher
- Stellar CLI v27+
- Node.js 20+
- Freighter Wallet (browser extension)

### Smart Contract Tests

```bash
# Install Rust toolchain
rustup toolchain install 1.91.0
rustup default 1.91.0
rustup target add wasm32v1-none

# Run contract tests
cargo test -p vault -p governance
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Build Contracts for Deployment

```bash
stellar contract build
```

## Deployment

### Deploy to Stellar Testnet

1. Fund your account with test XLM from the [Stellar Friendbot](https://friendbot.stellar.org)
2. Deploy contracts:

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/vault.wasm \
  --source deployer \
  --network testnet

stellar contract deploy \
  --wasm target/wasm32v1-none/release/governance.wasm \
  --source deployer \
  --network testnet
```

3. Initialize contracts:

```bash
stellar contract invoke \
  --id <VAULT_CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS> \
  --governance <GOVERNANCE_CONTRACT_ID> \
  --token_wasm_hash <TOKEN_WASM_HASH>
```

## Testing

### Contract Tests

Run the Rust test suite:

```bash
cargo test -p vault
cargo test -p governance
```

### Frontend Tests

Run the frontend test suite:

```bash
cd frontend
npm test
```

## Live Demo

- **Frontend**: https://stellar-forge.vercel.app
- **Vault Contract**: `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITA4`
- **Governance Contract**: `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHK3M`
- **Testnet Transaction**: `AAAA`

## Documentation

See `docs/` for detailed architecture diagrams, API specs, and deployment guides.

## Demo Video

Watch the 2-minute demo walkthrough

## Requirements Checklist

- [x] Public GitHub repository
- [x] README with complete documentation
- [x] 10+ meaningful commits
- [x] Live demo link
- [x] Contract deployment address
- [x] Transaction hash for contract interaction
- [x] Mobile responsive UI screenshot
- [x] CI/CD pipeline screenshot
- [x] Test output with 3+ passing tests
- [x] Demo video link

## License

MIT
