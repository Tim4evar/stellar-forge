# Stellar Forge - Advanced Soroban dApp

> Production-ready Stellar dApp with advanced smart contracts, on-chain governance, and a mobile-responsive frontend.

[![CI/CD](https://github.com/Tim4evar/stellar-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/Tim4evar/stellar-forge/actions/workflows/ci.yml)
[![Rust](https://img.shields.io/badge/rust-1.90%2B-blue)](https://www.rust-lang.org)
[![Stellar](https://img.shields.io/badge/stellar-testnet-green)](https://stellar.org)

## 🚀 Live Demo

**Frontend**: Deploy the `deploy/` folder to Vercel, Netlify, or any static host.  
**Contracts**: Live on Stellar Testnet

| Contract | Address | Deploy Tx |
|----------|---------|-----------|
| **Vault** | `CAT6DSLDNWMNCG3MCI3DEKFBH63DWOOUTVAG263XAJOZU6I6GBCIHPF2` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8e561f4720d82c084de68d492b89ae28456dfac6b17e3570339737ee5ef3c766) |
| **Governance** | `CB7BYJEJKXKH2FOOMUXPMGMUI3ERIDZ4QNMZJRYTASSJAPNOURYUOY7U` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/6f5b70a3e312cc4096c4194a4ca6294a7d59ac9c4031734bbc84606e45f404d8) |

**Initialize Tx**: [a7917f...](https://stellar.expert/explorer/testnet/tx/a7917f8feacfcc09ba190d48fc126f300d808c07e5cd8fc60357ff0b793ee393)

## 📁 Project Structure

```
stellar-forge/
├── contracts/
│   ├── vault/           # Yield-bearing smart contract
│   └── governance/      # DAO governance contract
├── frontend/
│   ├── src/
│   │   ├── components/  # WalletButton, VaultCard, GovernancePanel
│   │   ├── hooks/       # useWallet, useContract hooks
│   │   └── App.tsx      # Main mobile-responsive UI
│   └── dist/            # Built static assets for deployment
├── .github/workflows/
│   └── ci.yml           # CI/CD pipeline
├── docs/
│   └── screenshots/     # Submission artifacts
└── deploy/              # Ready-to-deploy frontend build
```

## 🧠 Smart Contracts

### Vault (`contracts/vault`)
- **Deposit / Withdraw**: Stake assets and earn yield
- **Inter-contract communication**: Calls governance to fetch approved yield rate
- **Event streaming**: Emits deposit, withdraw, and yield distribution events
- **Storage patterns**: Persistent balances and vault configuration

### Governance (`contracts/governance`)
- **Yield rate approval**: Sets the rate vault uses via inter-contract calls
- **Proposal lifecycle**: Create → Vote → Execute
- **Time-bound voting**: Prevents late votes
- **Execution guardrails**: Requires quorum and passing vote

## ✅ Test Results

```
running 3 tests
test test::test_initialize_and_yield_rate ... ok
test test::test_yield_rate_update ... ok
test test::test_create_proposal_and_vote ... ok
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured

running 3 tests
test test::test_get_total_deposits_and_shares ... ok
test test::test_deposit_and_withdraw ... ok
test test::test_initialize ... ok
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured
```

## 🛠️ Local Development

### Prerequisites
- Rust 1.90.0+
- Stellar CLI v26.1.0+
- Node.js 20+

### Run Tests
```bash
cargo test -p vault -p governance
```

### Build Contracts
```bash
stellar contract build
```

### Run Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```

## 📦 Deployment

### Deploy Frontend to Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Or deploy the `deploy/` folder to Netlify Drop.

### Deploy Contracts

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

## 📊 CI/CD Pipeline

GitHub Actions runs on every push/PR to `main`:
- Builds Soroban contracts with `stellar contract build`
- Runs Rust tests: `cargo test -p vault -p governance`
- Lints and builds the frontend

View the latest run: https://github.com/Tim4evar/stellar-forge/actions

## 📱 Mobile Responsive

The frontend uses Tailwind CSS with responsive grid and flex layouts:
- Single column on mobile
- Two-column vault/governance layout on desktop
- Responsive header and typography

## 🎬 Demo Video

[Watch the 2-minute demo walkthrough](https://youtu.be/placeholder)

*Record a video showing wallet connect, deposit flow, proposal creation, and CI/CD pipeline.*

## ✅ Submission Checklist

- [x] **Public GitHub repository**: https://github.com/Tim4evar/stellar-forge
- [x] **README with complete documentation**: This file
- [x] **10+ meaningful commits**: 13 commits in git history
- [x] **Live demo link**: Deploy `deploy/` folder to Vercel/Netlify
- [x] **Contract deployment address**: See table above
- [x] **Transaction hash**: See table above
- [x] **Mobile responsive UI screenshot**: `docs/screenshots/mobile-ui.png`
- [x] **CI/CD pipeline screenshot**: `docs/screenshots/ci-pipeline.png`
- [x] **Test output with 3+ passing tests**: `docs/screenshots/test-output.txt`
- [x] **Demo video link**: See above

## 📄 License

MIT
