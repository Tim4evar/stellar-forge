#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Address as _, Ledger},
    Address, BytesN, Env, Symbol,
};
use crate::{Governance, GovernanceClient};

#[test]
fn test_initialize_and_yield_rate() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let token_wasm_hash = BytesN::from_array(&env, &[0u8; 32]);

    let contract_id = env.register(Governance {}, ());
    let client = GovernanceClient::new(&env, &contract_id);

    client.initialize(&admin, &token_wasm_hash);
    let rate = client.approved_rate();
    assert_eq!(rate, 500);
}

#[test]
fn test_create_proposal_and_vote() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let proposer = Address::generate(&env);
    let token_wasm_hash = BytesN::from_array(&env, &[0u8; 32]);

    let contract_id = env.register(Governance {}, ());
    let client = GovernanceClient::new(&env, &contract_id);

    client.initialize(&admin, &token_wasm_hash);
    let description = Symbol::new(&env, "IncreaseYield");
    let proposal_id = client.create_proposal(&proposer, &description);

    let votes = client.get_proposal_votes(&proposal_id);
    assert_eq!(votes, (0, 0));
}

#[test]
fn test_yield_rate_update() {
    let env = Env::default();
    env.mock_all_auths();
    let admin = Address::generate(&env);
    let voter = Address::generate(&env);
    let token_wasm_hash = BytesN::from_array(&env, &[0u8; 32]);

    let contract_id = env.register(Governance {}, ());
    let client = GovernanceClient::new(&env, &contract_id);

    client.initialize(&admin, &token_wasm_hash);
    client.set_yield_rate(&1000, &voter);
    let rate = client.approved_rate();
    assert_eq!(rate, 1000);
}
