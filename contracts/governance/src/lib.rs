#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, Address, BytesN, Env, Symbol, Vec,
};

mod test;

#[contract]
pub struct Governance;

#[contractimpl]
impl Governance {
    pub fn initialize(env: Env, admin: Address, token_wasm_hash: BytesN<32>) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "token_wasm"), &token_wasm_hash);
    }

    pub fn set_yield_rate(env: Env, rate: u32, voter: Address) {
        voter.require_auth();
        if rate > 2000 {
            panic!("rate out of bounds");
        }
        env.storage().instance().set(&symbol_short!("approved"), &rate);
    }

    pub fn approved_rate(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("approved"))
            .unwrap_or(500)
    }

    pub fn create_proposal(env: Env, proposer: Address, description: Symbol) -> u64 {
        proposer.require_auth();
        let count: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("pcount"))
            .unwrap_or(0);
        let new_count = count + 1;
        env.storage()
            .instance()
            .set(&symbol_short!("pcount"), &new_count);

        let prefix = symbol_short!("prop");
        env.storage()
            .temporary()
            .set(&(prefix.clone(), new_count, symbol_short!("desc")), &description);
        env.storage()
            .temporary()
            .set(
                &(prefix.clone(), new_count, symbol_short!("proposer")),
                &proposer,
            );
        env.storage()
            .temporary()
            .set(&(prefix.clone(), new_count, symbol_short!("for")), &0u64);
        env.storage()
            .temporary()
            .set(
                &(prefix.clone(), new_count, symbol_short!("against")),
                &0u64,
            );
        env.storage()
            .temporary()
            .set(
                &(prefix.clone(), new_count, symbol_short!("start")),
                &env.ledger().timestamp(),
            );
        env.storage()
            .temporary()
            .set(
                &(prefix.clone(), new_count, symbol_short!("end")),
                &(env.ledger().timestamp() + 86400),
            );
        env.storage()
            .temporary()
            .set(&(prefix, new_count, symbol_short!("exec")), &false);

        env.events().publish(
            (symbol_short!("proposal"), proposer.clone()),
            new_count,
        );

        new_count
    }

    pub fn vote(env: Env, voter: Address, proposal_id: u64, in_favor: bool) {
        voter.require_auth();
        let prefix = symbol_short!("prop");
        let end_time: u64 = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("end")))
            .expect("proposal not found");
        if env.ledger().timestamp() > end_time {
            panic!("voting ended");
        }
        let executed: bool = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("exec")))
            .expect("proposal not found");
        if executed {
            panic!("proposal executed");
        }

        if in_favor {
            let for_key = (prefix.clone(), proposal_id, symbol_short!("for"));
            let votes_for: u64 = env
                .storage()
                .temporary()
                .get(&for_key)
                .expect("proposal not found");
            env.storage()
                .temporary()
                .set(&for_key, &(votes_for + 1));
        } else {
            let against_key = (prefix.clone(), proposal_id, symbol_short!("against"));
            let votes_against: u64 = env
                .storage()
                .temporary()
                .get(&against_key)
                .expect("proposal not found");
            env.storage()
                .temporary()
                .set(&against_key, &(votes_against + 1));
        }

        env.events().publish(
            (symbol_short!("vote"), voter.clone()),
            (proposal_id, in_favor),
        );
    }

    pub fn execute_proposal(env: Env, executor: Address, proposal_id: u64) {
        executor.require_auth();
        let prefix = symbol_short!("prop");
        let end_time: u64 = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("end")))
            .expect("proposal not found");
        if env.ledger().timestamp() <= end_time {
            panic!("voting has not ended");
        }
        let executed: bool = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("exec")))
            .expect("proposal not found");
        if executed {
            panic!("proposal already executed");
        }
        let votes_for: u64 = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("for")))
            .expect("proposal not found");
        let votes_against: u64 = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("against")))
            .expect("proposal not found");
        if votes_for <= votes_against {
            panic!("proposal failed");
        }

        env.storage()
            .temporary()
            .set(&(prefix, proposal_id, symbol_short!("exec")), &true);

        env.events().publish(
            (symbol_short!("executed"), executor.clone()),
            proposal_id,
        );
    }

    pub fn get_proposal_votes(env: Env, proposal_id: u64) -> (u64, u64) {
        let prefix = symbol_short!("prop");
        let votes_for: u64 = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("for")))
            .expect("proposal not found");
        let votes_against: u64 = env
            .storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("against")))
            .expect("proposal not found");
        (votes_for, votes_against)
    }

    pub fn get_proposal_executed(env: Env, proposal_id: u64) -> bool {
        let prefix = symbol_short!("prop");
        env.storage()
            .temporary()
            .get(&(prefix.clone(), proposal_id, symbol_short!("exec")))
            .expect("proposal not found")
    }
}
