import assert from 'node:assert/strict';
import test from 'node:test';
import { resolve } from 'node:path';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { createNodeProviders, getNetworkConfig } from '../dist/index.js';

test('wires official providers while preserving the supplied wallet and private state', () => {
  const supplied = { walletProvider: {}, midnightProvider: {}, privateStateProvider: {} };
  const providers = createNodeProviders(getNetworkConfig(), resolve('contracts/managed/counter'), supplied);
  assert.equal(getNetworkId(), 'undeployed');
  assert.equal(providers.walletProvider, supplied.walletProvider);
  assert.equal(providers.privateStateProvider, supplied.privateStateProvider);
  assert.equal(providers.midnightProvider, supplied.midnightProvider);
  assert.equal(typeof providers.publicDataProvider.queryContractState, 'function');
  assert.equal(typeof providers.proofProvider.proveTx, 'function');
  assert.throws(() => createNodeProviders(getNetworkConfig(), './relative', supplied), /absolute/);
});
