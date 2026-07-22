# Architecture

## Smart Contracts

### Vault

```
struct Vault
  - storage: persistent balances
  - events: deposit, withdraw, yield
```

### Governance

```
struct Governance
  - storage: proposals
  - events: proposal created, voted
```
