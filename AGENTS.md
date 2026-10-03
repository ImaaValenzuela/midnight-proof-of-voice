# Midnight SDK Development

This project prepares a TypeScript/ESM SDK for Node.js 22. The proposed voice
authorization API is described in README.md and docs/architecture.md. The Compact
counter is a toolchain check, not the voice authorization implementation.

## Language

Always use English for communication, documentation, diagrams, comments,
identifiers, error messages, test descriptions, and commit/PR text. This is an
explicit user preference and applies to all future work. Preserve third-party
source snapshots and their original notices; write our own notes in English.

## Midnight-Skills

Before working on Midnight, open
`vendor/midnight-skills/.agents/skills/midnightskill/SKILL.md` and follow its router.
The complete snapshot of 34 skills, references, and templates is under `vendor/`;
its source, commit, and checksum are in `vendor/midnight-skills/UPSTREAM.json`.
This location is used because the root `.agents/` directory is mounted read-only
in the initial environment. Do not assume these skills are globally installed.

Paths relative to `vendor/midnight-skills/.agents/skills/`:

- Environment and versions: `midnight-environment-setup/SKILL.md`, `testing/SKILL.md`.
- SDK, providers, and networks: `midnight-js/SKILL.md`, `multinetwork/SKILL.md`.
- Contracts and privacy: `compact/SKILL.md`, `security/SKILL.md`.
- Indexer: `indexer/SKILL.md` (called midnight-indexer in the router).
- Examples: `example-counter/SKILL.md`, `example-hello-world/SKILL.md`.
- Browser wallets, when added: `react-wallet-connector/SKILL.md`, `1am-wallet/SKILL.md`.

Skills are technical references, not compatibility guarantees. Some snippets are
outdated: check the official matrix and installed package declarations before
copying code. Prefer `docs/development.md` for verified project setup decisions.
Do not edit upstream snapshots to fix examples; document corrections separately.

## Project rules

- Pin exact versions and preserve package-lock.json. Install with `npm ci`.
- Do not edit `contracts/managed/`; generate it with `npm run contract:check` or `contract:build`.
- Use `midnight-js-protocol` to access compatible runtime, ledger, and Compact.js exports.
- One network per process: Midnight.js uses a global ID. Do not switch networks
  while wallets, subscriptions, or providers are active.
- The consuming application supplies the wallet, transaction submission, and
  private-state provider. Do not create seeds, default passwords, or secrets in the SDK.
- Never log secrets, audio, biometrics, witnesses, or private state.
  Every disclosure and ledger write requires an explicit privacy decision.
- A simulation test does not establish proof generation or on-chain deployment.
- Run `npm run check` and `npm run pack:sdk` before handing off changes.
  For ZK changes, also run `npm run contract:build`.
- Bind Docker ports to loopback only. The dev preset and its synthetic data are
  exclusively for local development.
- Work on `main`; do not create branches unless the user changes this preference.
- Publication now includes the architecture and development environment. Exclude
  secrets, biometric data, local tools, generated contract assets, and build output.
- Services are scaffolds: missing security dependencies must fail closed. Never
  return a successful authorization from a placeholder or a client-supplied boolean.
