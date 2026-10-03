# Voice authorization contract boundary

No voice authorization circuit is implemented yet. `../counter.compact` tests the
installed compiler/runtime and is not evidence of voice authorization.

Before adding a circuit, settle canonical encoding and domain separation, the
Compact-verifiable signature scheme, issuer/verifier key rotation, holder binding,
ledger-supported time checks, revocation semantics, and deterministic nullifiers.
The circuit must bind consent and attestation to the same credential, audience,
network, contract, challenge, and immutable generation request.

Acceptance requires real key generation and negative tests for altered signatures,
wrong holders, mismatched context, expiry, revocation, and repeated use. A witness
returning `true` or a host-side signature check is not a circuit constraint.
See [protocol decisions](../../docs/protocol.md).
