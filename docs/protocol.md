# Protocol v0.1: decision record

Status: draft. TypeScript application types live in `packages/protocol`; they are
not a canonical serialization, signed payload, or stable public specification.

## Claim and trust

A holder controls a secret bound to an active credential, and an approved verifier
attested that a sample passed a versioned policy for a specific challenge. The
holder authorizes an immutable request under explicit consent. ZK establishes
cryptographic predicates; it does not prove the accuracy of the voice model.

## Required bindings

Credential: protocol version, issuer/key identifier, holder commitment, template
commitment, policy/model version, validity, and revocation identifier.

Challenge and attestation: unpredictable nonce, credential, network, contract,
audience, purpose, request commitment, consent commitment, policy version, issue
and expiry times, verifier key identifier, accepted decision, and signature.

Consent: one request ID, purpose, audience, commercial-use permission, and training
permission. No implicit future-use authorization. The holder must approve the
exact committed request; mutation creates a new challenge.

Receipt: confirmed ledger reference, context, nullifier, and commitments. A client
reference is untrusted until independently checked. The private database associates
the receipt with the generation result after completion.

## Open cryptographic decisions

1. Choose a signature scheme supported inside the pinned Compact toolchain. Prove
   verification and tamper rejection in the smallest circuit before expanding it.
2. Specify a single canonical byte/field encoding, length limits, domain tags, and
   cross-language test vectors. Plain JSON hashing is not this specification.
3. Choose commitment and nullifier primitives and exact holder-secret handling.
   A fresh client-selected nullifier must not enable repeated use of one challenge.
4. Establish ledger-supported time semantics; do not trust client clocks.
5. Specify revocation at authorization versus consumption, key rotation, and
   incident suspension. Account recovery must not silently transfer voice authority.

## State and consumption

Proposed public state: trusted issuers/verifiers, credential status, protocol
version, consumed nullifiers, and minimal authorization commitments. No recordings,
embeddings, similarity scores, or internal identity/template IDs may be disclosed.

The backend checks confirmed state and context before atomically reserving a job
under a unique `(network, contract, nullifier)` key. Request contents are immutable.
Provider retries use one stable idempotency key. An ambiguous provider timeout is
reconciled before another attempt; database uniqueness alone cannot guarantee that
an external provider never generates twice.

No operation in the current scaffold creates these records or returns success.
