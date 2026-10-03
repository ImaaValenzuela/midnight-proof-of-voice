import { getNetworkConfig } from '@voiceproof/sdk';
// Configuration example only: this does not enroll, prove, or generate music.
const network = getNetworkConfig('local');
console.log(JSON.stringify({ stage: 'scaffold', network, authorizationAvailable: false }, null, 2));
