#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, Address, BytesN, Env, Symbol, Vec,
};

mod test;


#[contract]
pub struct Vault;

pub use types::{Config, DepositEvent, WithdrawEvent, YieldDistributedEvent};

#[contractimpl]
impl Vault {
    pub fn initialize(
        env: Env,
        admin: Address,
        governance: Address,
        token_wasm_hash: BytesN<32>,
    ) {
        admin.require_auth();
        let key = symbol_short!("config");
        let config = Config {
            admin: admin.clone(),
            governance: governance.clone(),
            total_deposits: 0_i128,
            total_shares: 0_i128,
            share_price: 1_000_000_i128,
            last_yield_time: env.ledger().timestamp(),
            yield_rate_bps: 500,
            token_wasm_hash,
        };
        env.storage().persistent().set(&key, &config);
    }

    pub fn deposit(env: Env, from: Address, amount: i128) -> i128 {
        from.require_auth();
        if amount <= 0 {
            panic!("amount must be positive");
        }
        let key = symbol_short!("config");
        let mut config: Config = env
            .storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized");

        config.total_deposits += amount;
        let shares = (amount * 1_000_000) / config.share_price;
        config.total_shares += shares;

        env.storage().persistent().set(&key, &config);

        let balance_key = (symbol_short!("balance"), from.clone());
        let mut shares_balance: i128 = env.storage().persistent().get(&balance_key).unwrap_or(0);
        shares_balance += shares;
        env.storage().persistent().set(&balance_key, &shares_balance);

        let event = DepositEvent {
            amount,
            shares,
            total_deposits: config.total_deposits,
            total_shares: config.total_shares,
        };
        env.events().publish((symbol_short!("deposit"), from.clone()), event);

        shares
    }

    pub fn withdraw(env: Env, from: Address, shares: i128) -> i128 {
        from.require_auth();
        if shares <= 0 {
            panic!("shares must be positive");
        }
        let key = symbol_short!("config");
        let mut config: Config = env
            .storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized");

        let balance_key = (symbol_short!("balance"), from.clone());
        let mut shares_balance: i128 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .expect("no balance");
        shares_balance -= shares;
        env.storage().persistent().set(&balance_key, &shares_balance);

        let amount = (shares * config.share_price) / 1_000_000;
        config.total_deposits -= amount;
        config.total_shares -= shares;

        env.storage().persistent().set(&key, &config);

        let event = WithdrawEvent {
            shares,
            amount,
            remaining_shares: shares_balance,
        };
        env.events().publish((symbol_short!("withdraw"), from.clone()), event);

        amount
    }

    pub fn accrue_yield(env: Env) {
        let key = symbol_short!("config");
        let mut config: Config = env
            .storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized");

        let now = env.ledger().timestamp();
        let elapsed: u64 = now - config.last_yield_time;
        if elapsed == 0 {
            return;
        }

        let rate = Self::get_approved_yield_rate(&env, &config.governance);
        let yield_bps = rate as i128;
        let elapsed_i128 = elapsed as i128;
        let annual_seconds = 31_536_000_i128;
        let factor = (yield_bps * elapsed_i128) / (annual_seconds * 10_000);
        let new_price = config.share_price * (1_000_000 + factor) / 1_000_000;
        config.share_price = new_price;
        config.last_yield_time = now;

        env.storage().persistent().set(&key, &config);

        let event = YieldDistributedEvent {
            rate: rate as i128,
            new_share_price: new_price,
            timestamp: now,
        };
        env.events().publish((symbol_short!("yield"), config.governance.clone()), event);
    }

    pub fn get_balance(env: Env, account: Address) -> i128 {
        let balance_key = (symbol_short!("balance"), account);
        env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0)
    }

    pub fn get_share_price(env: Env) -> i128 {
        let key = symbol_short!("config");
        let config: Config = env
            .storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized");
        config.share_price
    }

    pub fn get_total_deposits(env: Env) -> i128 {
        let key = symbol_short!("config");
        let config: Config = env
            .storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized");
        config.total_deposits
    }

    pub fn get_total_shares(env: Env) -> i128 {
        let key = symbol_short!("config");
        let config: Config = env
            .storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized");
        config.total_shares
    }

    pub fn get_config(env: Env) -> Config {
        let key = symbol_short!("config");
        env.storage()
            .persistent()
            .get(&key)
            .expect("contract not initialized")
    }

    pub fn get_approved_yield_rate(env: &Env, governance: &Address) -> u32 {
        let rate: u32 = env.invoke_contract::<u32>(
            governance,
            &Symbol::new(&env, "approved_rate"),
            Vec::from_array(env, []),
        );
        rate
    }
}

mod types {
    use soroban_sdk::{contracttype, Address, BytesN};

    #[contracttype]
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct Config {
        pub admin: Address,
        pub governance: Address,
        pub total_deposits: i128,
        pub total_shares: i128,
        pub share_price: i128,
        pub last_yield_time: u64,
        pub yield_rate_bps: i128,
        pub token_wasm_hash: BytesN<32>,
    }

    #[contracttype]
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct DepositEvent {
        pub amount: i128,
        pub shares: i128,
        pub total_deposits: i128,
        pub total_shares: i128,
    }

    #[contracttype]
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct WithdrawEvent {
        pub shares: i128,
        pub amount: i128,
        pub remaining_shares: i128,
    }

    #[contracttype]
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct YieldDistributedEvent {
        pub rate: i128,
        pub new_share_price: i128,
        pub timestamp: u64,
    }
}
