import assert from 'node:assert/strict';
import test from 'node:test';
import { getNetworkConfig } from '../dist/index.js';

test('local uses the undeployed ID and development endpoints', () => {
  const config = getNetworkConfig();
  assert.equal(config.networkId, 'undeployed');
  assert.equal(config.indexerHttp, 'http://127.0.0.1:8088/api/v4/graphql');
  assert.equal(config.nodeWs, 'ws://127.0.0.1:9944');
  config.proofServer = 'http://localhost:9999';
  assert.equal(getNetworkConfig().proofServer, 'http://127.0.0.1:6300');
});

test('preview and preprod preserve explicit network and proof server settings', () => {
  for (const network of ['preview', 'preprod']) {
    const config = getNetworkConfig(network, 'http://127.0.0.1:6301');
    assert.equal(config.networkId, network);
    assert.equal(config.indexerWs, `wss://indexer.${network}.midnight.network/api/v4/graphql/ws`);
    assert.equal(config.proofServer, 'http://127.0.0.1:6301');
  }
});

test('rejects unknown networks and invalid protocols', () => {
  assert.throws(() => getNetworkConfig('typo'), /Unsupported/);
  assert.throws(() => getNetworkConfig('local', 'file:///tmp/proof'), /HTTP/);
  assert.throws(() => getNetworkConfig('local', 'invalid'), TypeError);
});
