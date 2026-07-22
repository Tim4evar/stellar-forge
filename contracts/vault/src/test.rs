#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Address as _, Ledger},
    Address, BytesN, Env,
};
use crate::{Vault, VaultClient};

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let governance = Address::generate(&env);
    let token_wasm_hash = BytesN::from_array(&env, &[0u8; 32]);

    let contract_id = env.register(Vault {}, ());
    let client = VaultClient::new(&env, &contract_id);

    client.initialize(&admin, &governance, &token_wasm_hash);

    let config = client.get_config();
    assert_eq!(config.admin, admin);
    assert_eq!(config.governance, governance);
    assert_eq!(config.total_deposits, 0);
    assert_eq!(config.total_shares, 0);
    assert_eq!(config.share_price, 1_000_000);
}

#[test]
fn test_deposit_and_withdraw() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let governance = Address::generate(&env);
    let user = Address::generate(&env);
    let token_wasm_hash = BytesN::from_array(&env, &[0u8; 32]);

    let contract_id = env.register(Vault {}, ());
    let client = VaultClient::new(&env, &contract_id);

    client.initialize(&admin, &governance, &token_wasm_hash);

    let shares = client.deposit(&user, &1000);
    assert_eq!(shares, 1000);

    let balance = client.get_balance(&user);
    assert_eq!(balance, shares);

    let amount = client.withdraw(&user, &shares);
    assert_eq!(amount, 1000);
}

#[test]
fn test_get_total_deposits_and_shares() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let governance = Address::generate(&env);
    let user = Address::generate(&env);
    let token_wasm_hash = BytesN::from_array(&env, &[0u8; 32]);

    let contract_id = env.register(Vault {}, ());
    let client = VaultClient::new(&env, &contract_id);

    client.initialize(&admin, &governance, &token_wasm_hash);
    client.deposit(&user, &500);

    let total_deposits = client.get_total_deposits();
    let total_shares = client.get_total_shares();
    assert_eq!(total_deposits, 500);
    assert_eq!(total_shares, 500);
}
