# Melodya integration boundary

Run `npm run example:melodya` from the repository root to exercise the built SDK.
This example prints public local-network configuration only.

The future backend flow is: authenticate the holder, freeze a generation request,
issue a challenge, verify voice and consent, submit authorization, wait for ledger
confirmation, and atomically reserve one generation job. The browser must never
supply a trusted `verified` boolean. Generation is unavailable in this scaffold.

Audio capture, wallets, a music provider, and persistence will be integrated after
the protocol feasibility milestone in [the roadmap](../../docs/roadmap.md).
