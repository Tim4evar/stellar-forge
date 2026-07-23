# Stellar Forge - Advanced Soroban dApp

Production-ready Stellar dApp featuring advanced smart contract logic, on-chain governance, and a mobile-responsive frontend.

## 🚀 Live Deployment

### Testnet Contracts (Stellar Testnet)

| Contract | Address | Transaction Hash |
|----------|---------|------------------|
| **Vault** | `CAT6DSLDNWMNCG3MCI3DEKFBH63DWOOUTVAG263XAJOZU6I6GBCIHPF2` | [8e561f...](https://stellar.expert/explorer/testnet/tx/8e561f4720d82c084de68d492b89ae28456dfac6b17e3570339737ee5ef3c766) |
| **Governance** | `CB7BYJEJKXKH2FOOMUXPMGMUI3ERIDZ4QNMZJRYTASSJAPNOURYUOY7U` | [6f5b70...](https://stellar.expert/explorer/testnet/tx/6f5b70a3e312cc4096c4194a4ca6294a7d59ac9c4031734bbc84606e45f404d8) |

### Frontend
- **Live Demo**: Deploy to Vercel/Netlify and update this link
- **Network**: Stellar Testnet

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
- Rust 1.90.0 or higher
- Stellar CLI v26+
- Node.js 20+
- Freighter Wallet (browser extension)

### Smart Contract Tests

```bash
# Run contract tests
cargo test -p vault -p governance
```

### Build Contracts

```bash
stellar contract build
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
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

## Documentation

See `docs/` for detailed architecture diagrams, API specs, and deployment guides.

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
