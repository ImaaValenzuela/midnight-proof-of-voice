/** Draft application types. These are not a canonical signed encoding. */
export interface VoiceConsent {
  readonly requestId: string;
  readonly credentialId: string;
  readonly audience: string;
  readonly purpose: 'music-generation';
  readonly generationRequestCommitment: string;
  readonly permissions: { readonly commercialUse: boolean; readonly training: boolean };
}

/** A reference must be independently checked against confirmed ledger state. */
export interface AuthorizationReference {
  readonly network: 'local' | 'preview' | 'preprod';
  readonly contractAddress: string;
  readonly transactionId: string;
  readonly nullifier: string;
}

export interface ServiceStatus {
  readonly service: 'voiceproof-api' | 'voiceproof-verifier';
  readonly stage: 'scaffold';
  readonly ready: false;
  readonly missing: readonly string[];
}
