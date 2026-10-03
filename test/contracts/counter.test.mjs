import assert from 'node:assert/strict';
import test from 'node:test';
import { createCircuitContext, createConstructorContext } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { Contract, ledger } from '../../contracts/managed/counter/contract/index.js';

test('the compiled contract increments its ledger from 0 to 2', () => {
  const contract = new Contract({});
  // Synthetic data: local simulation without a wallet or transactions.
  const publicKey = '00'.repeat(32);
  const address = '00'.repeat(32);
  const initial = contract.initialState(createConstructorContext({}, publicKey));
  assert.equal(ledger(initial.currentContractState.data).counter, 0n);
  let context = createCircuitContext(address, publicKey, initial.currentContractState, initial.currentPrivateState);
  context = contract.impureCircuits.increment(context).context;
  assert.equal(ledger(context.currentQueryContext.state).counter, 1n);
  context = contract.impureCircuits.increment(context).context;
  assert.equal(ledger(context.currentQueryContext.state).counter, 2n);
});
