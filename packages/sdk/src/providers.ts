import { isAbsolute } from 'node:path';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { NetworkConfig } from './config.js';

/** The consuming application owns the wallet and private storage. */
export function createNodeProviders<Circuit extends string, StateId extends string, State>(
  config: NetworkConfig,
  zkDirectory: string,
  supplied: Pick<MidnightProviders<Circuit, StateId, State>,
    'walletProvider' | 'midnightProvider' | 'privateStateProvider'>,
): MidnightProviders<Circuit, StateId, State> {
  if (!isAbsolute(zkDirectory)) {
    throw new TypeError('zkDirectory must be an absolute path');
  }
  // Midnight.js uses a global network ID: one network per process.
  setNetworkId(config.networkId);
  const zkConfigProvider = new NodeZkConfigProvider<Circuit>(zkDirectory);
  return {
    ...supplied,
    zkConfigProvider,
    publicDataProvider: indexerPublicDataProvider(config.indexerHttp, config.indexerWs),
    proofProvider: httpClientProofProvider(config.proofServer, zkConfigProvider),
  };
}
