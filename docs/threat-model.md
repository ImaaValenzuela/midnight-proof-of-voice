# Threat model

Status: initial design; controls below are requirements, not completed mitigations.

| Threat | Required control and acceptance evidence |
| --- | --- |
| Recorded playback or synthesized voice | Unpredictable phrase, phrase check, anti-spoof evaluation; measure attack success |
| Stolen credential | Circuit proves holder-secret knowledge; stolen public credential alone fails |
| Attestation tampering | Circuit signature verification and binding; mutate every signed field in tests |
| Replay across requests/apps/networks | Bound context and deterministic nullifier; reject altered context and duplicates |
| Concurrent generation | Database uniqueness plus provider idempotency; concurrent integration test |
| Revoked credential or expired challenge | Contract state/time constraints plus documented consumption policy |
| Compromised verifier/issuer | Key isolation, rotation, suspension, audit trail; acknowledge false attestations remain possible |
| Model/threshold change | Versioned policy, approval and recalibration; no silent verifier drift |
| Remote prover compromise | Explicit witness access and user trust choice; never give the sponsor holder secrets |
| Biometric exfiltration | Encrypted private storage, access controls, retention/deletion, redacted logs |
| Malicious upload or denial of service | Auth, rate/body/duration limits, isolated decoder, reject before expensive inference |

Trust boundaries are the user's holder-secret store, the API, private verifier,
prover, Midnight node/indexer, database, and generation provider. Compromising a
biometric verifier can create false biometric assertions even if ZK is correct.

Current services bind to loopback, do not read request bodies, expose liveness
separately from readiness, and reject all enrollment/authorization/generation
operations. These measures prevent placeholder successes; they are not production
service authentication or a deployed security protocol.
