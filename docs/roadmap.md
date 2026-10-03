# Implementation milestones

## 0. Development foundation (this change)

Npm workspaces, pinned Midnight providers, compiler smoke circuit, Python verifier
boundary, Node API boundary, local Midnight services and PostgreSQL configuration,
unit checks, CI, and SDK consumer example. All authorization paths fail closed.

## 1. Protocol feasibility

Resolve `protocol.md` decisions. Build the smallest real Compact signature/holder
circuit, test invalid signatures and replay, generate keys, measure proving cost,
and submit a confirmed authorization on Preview using synthetic fixtures.
Exit: verifiable ledger evidence and negative tests, not just simulation.

## 2. Private verification

Add authenticated enrollment, encrypted templates, deletion policies, dynamic
challenge/phrase validation, speaker models, and anti-spoof evaluation. Choose
thresholds from a documented consented dataset. Add service-authenticated signed
attestations only after the signature format is fixed.

## 3. SDK and Melodya integration

Add enrollment/authorization/revocation APIs, holder-controlled signing/proving,
sponsorship, confirmation checks, and atomic request consumption. Integrate a music
provider with idempotency/reconciliation. Exit: holder succeeds, impostor fails,
request substitution fails, and concurrent replay creates at most one job.

## 4. Pilot and release gates

Run the consented pilot and report error rates, attacks, latency, cost, and dropout.
Test key compromise/recovery, model changes, revocation, and outages. Move through
Preprod before Mainnet. DID/VC compatibility and native SDKs follow demonstrated
core authorization. No fixed production deadline or security guarantee is implied.
