export type DevelopmentNetwork = 'local' | 'preview' | 'preprod';

export interface NetworkConfig {
  readonly networkId: 'undeployed' | 'preview' | 'preprod';
  readonly indexerHttp: string;
  readonly indexerWs: string;
  readonly nodeWs: string;
  readonly proofServer: string;
}

/** Explicit configuration: does not read globals or connect a wallet. */
export function getNetworkConfig(
  network: DevelopmentNetwork = 'local',
  proofServer = 'http://127.0.0.1:6300',
): NetworkConfig {
  const proofUrl = new URL(proofServer);
  if (!['http:', 'https:'].includes(proofUrl.protocol)) {
    throw new TypeError('The proof server must use HTTP or HTTPS');
  }
  if (network === 'local') {
    return {
      networkId: 'undeployed',
      indexerHttp: 'http://127.0.0.1:8088/api/v4/graphql',
      indexerWs: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
      nodeWs: 'ws://127.0.0.1:9944',
      proofServer,
    };
  }
  if (network !== 'preview' && network !== 'preprod') {
    throw new TypeError(`Unsupported development network: ${network}`);
  }
  return {
    networkId: network,
    indexerHttp: `https://indexer.${network}.midnight.network/api/v4/graphql`,
    indexerWs: `wss://indexer.${network}.midnight.network/api/v4/graphql/ws`,
    nodeWs: `wss://rpc.${network}.midnight.network`,
    proofServer,
  };
}
