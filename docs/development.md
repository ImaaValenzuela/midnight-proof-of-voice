# Development Environment Guide

Prepared on 2026-10-03 for Linux x86_64. The initial target is a Node.js SDK and private verification services.
The voice authorization design is in README.md and docs/architecture.md; this
local environment is not an implementation of that protocol.

## Versions and sources

| Component | Pinned version |
| --- | --- |
| Node.js | 22.22.1 (`.nvmrc`) |
| TypeScript | 5.9.3 |
| Compact CLI | 0.5.1 |
| Compact compiler / language | 0.31.1 / 0.23.0 |
| Compact runtime | 0.16.0, resolved through midnight-js-protocol |
| Compact.js / ledger | 2.5.1 / 8.1.0, resolved through midnight-js-protocol |
| Midnight.js | 4.1.1 |
| Proof server | 8.1.0 |
| **Local** node / indexer | 1.0.0 / 4.3.3 |

The [official matrix](https://docs.midnight.network/relnotes/support-matrix)
determines compiler and SDK versions. The local Compose configuration derives from
[example-hello-world](https://github.com/midnightntwrk/example-hello-world/blob/main/compose.yml).
Its local images differ from the versions running on public networks. Compose
syntax was validated, but the stack could not start in this session because the
Docker socket is inaccessible.

Do not upgrade components independently or use `latest` tags. Update the
Midnight.js family together, review the matrix, regenerate the lockfile,
recompile contracts, and rerun integration tests.

## Daily development

`npm run check` builds the workspaces, checks SDK/API behavior, tests the Python
verifier through ASGI, then compiles and simulates the counter with `--skip-zk`. It needs
no wallet, funds, or Docker. `npm run contract:build` generates the actual circuit
keys; it does not demonstrate that a transaction has been proved or accepted.

```bash
npm run dev:api
# In another terminal: npm run dev:verifier
npm run check
npm run contract:build
npm run pack:sdk
```

`scripts/compile.mjs` calls `compactc.bin` directly because the upstream 0.31.1
wrapper fails on paths containing spaces. It puts `zkir` on PATH and keeps the
ZK cache in `.tools/cache/`. It does not modify `.zshrc`, HOME, or global tools.
The installer checks GitHub-published SHA-256 digests before extracting files.
For macOS/ARM, use equivalent assets from the same
[releases](https://github.com/midnightntwrk/compact/releases) and adapt the
bootstrap paths; the current script recognizes Linux x86_64 only.

## Integration services

```bash
npm run env:up
docker compose ps
npm run env:logs
npm run env:down
```

All published ports bind to `127.0.0.1` only:

| Service | URL |
| --- | --- |
| Local RPC | ws://127.0.0.1:9944 |
| Indexer HTTP | http://127.0.0.1:8088/api/v4/graphql |
| Indexer WS | ws://127.0.0.1:8088/api/v4/graphql/ws |
| Proof server | http://127.0.0.1:6300 |

The `dev` preset, beneficiary, and internal indexer keys come from the official
example and are public synthetic data for this local network only. There are no
persistent volumes: `env:down` removes containers and the local state they hold.
For preview/preprod, run `npm run proof:up` and use `getNetworkConfig` endpoints;
you will need your own test wallet and DUST.

Before calling real circuits: start services, compile without `--skip-zk`, sync
and fund the wallet, construct providers, deploy the contract, and check its
state through the indexer. That on-chain flow is not yet implemented or validated
in this environment scaffold.

## Constructing SDK providers

`createNodeProviders(config, absoluteZkPath, supplied)` creates official indexer,
ZK file, and proof server providers. `supplied` must contain `walletProvider`,
`midnightProvider`, and `privateStateProvider` compatible with
`MidnightProviders<Circuit, StateId, State>` from Midnight.js 4.1.1.

The application owns the wallet lifecycle and secret storage. The
`midnight-js-level-private-state-provider` package is available for encrypted
storage and requires an explicit password and account. Check its installed
types: older examples include options that have changed.

Use one network per process: `setNetworkId` is global in Midnight.js. Do not mix
preview/preprod/local providers in the same active process. `.env.example` is a
reference for consuming applications; the SDK takes explicit configuration and
does not automatically load `.env`.

## Using Midnight-Skills

The snapshot of [Kali-Decoder/Midnight-Skills](https://github.com/Kali-Decoder/Midnight-Skills)
includes its original license and provenance in `vendor/midnight-skills/UPSTREAM.json`.
It contains 34 skills, references, and templates. `AGENTS.md` directs agents to the
router and relevant skills because the root `.agents/` directory is read-only here.

Applied skills cover environment setup, Midnight.js, Compact, testing, multiple
networks, security, and hello-world. Their guidance informed exact version pins,
public/private separation, wallet injection, fast simulation, separate ZK key
generation, and local Docker configuration.

Corrections to some snapshot snippets:

- Use Midnight.js 4.1.1 and its `midnight-js-protocol/*` exports; several examples
  still show 4.0.4 and mix compact-runtime/compact-js imports.
- Do not copy `any`, sample passwords, partial seed logs, or signing workarounds
  without checking that they apply to the installed version.
- Do not assume every circuit argument is public merely because it exists:
  check its flow into the ledger/transcript and disclosures against the
  [official specification](https://docs.midnight.network/compact).
- For future voice contracts, document public data before implementing
  commitments, witnesses, authorization, and replay protection.

## Observed session restrictions

- Docker CLI/Compose are installed, but the socket returns `permission denied`.
  Run `npm run env:up` from a terminal with Docker access. Do not make the socket
  world-writable. This session cannot modify users or services.
- VS Code is installed through Snap, but its CLI cannot start in this sandbox.
  `.tools/compact-0.2.13.vsix` has been downloaded from the link in the
  [official extension guide](https://docs.midnight.network/compact/compilation-and-tooling/vscode-plugin).
  In VS Code: Extensions → Install from VSIX → select that file.
  Project tasks and file associations are already configured.
- `.git` is read-only to this session. Changes are committed on `main` in the
  existing writable checkout `/tmp/midnight-proof-of-voice-publish`, based on the
  remote history. The user's original checkout has an unrelated initial commit;
  never force-push it over the remote history. A Git bundle can transfer the
  prepared `main` when this session cannot authenticate to GitHub.
- SSH publication is blocked here by system SSH configuration permissions and
  DNS resolution. The user's terminal has reached GitHub successfully; the
  permission and network restrictions described here are session-specific.
- npm could not access DNS directly. Packages were downloaded from the official
  registry, integrity-checked, and installed with npm ci offline. The lockfile
  uses normal registry URLs: with network access, run `npm ci --ignore-scripts`.
  The temporary cache is `/tmp/midnight-npm-cache`.
- The compiler also lacked network access for ZK parameters. Its public
  `bls_midnight_2p5` parameter was downloaded from the URL requested by zkir into
  `.tools/cache/midnight/zk-params/`; zkir checked it and generated the keys.
  Other circuits may need additional parameters, which it fetches automatically
  when network access is available.

The GitHub workflow checks builds, Python dependencies, tests, Compose syntax,
and SDK packaging. It neither deploys contracts nor publishes packages.

## Toolchain verification from initial setup

- `npm run check`: passed (types, SDK tests, and counter simulation from 0 to 1 to 2).
- `npm run contract:build`: passed; generated `increment.prover` and `increment.verifier`.
- `docker compose config --quiet`: passed.
- `npm pack`: passed; the package was installed and imported by an independent consumer.
- Native LevelDB backend: read/write verified without installation lifecycle scripts.
- `npm run doctor`: all tools available; only Docker daemon access fails.
- No on-chain deployment, transaction proof, or container startup was performed.

The reference Compose license is preserved at `vendor/example-hello-world-LICENSE`.

## Workspace setup

Run the quickstart in README.md. Npm workspaces build in protocol → SDK → API
order. All packages remain private. `npm run pack:sdk` previews the SDK package;
`npm pack --workspace @voiceproof/sdk` produces a tarball after `npm run build`.
The SDK is Node-only: its filesystem ZK provider is not a browser entry point.

Python must be 3.11. If `python3.11` is not on PATH, run:

```bash
PYTHON=/absolute/path/to/python3.11 npm run setup:python
```

The script creates `.tools/venv` and installs the complete hashed requirements
lock. FastAPI and Uvicorn are pinned, including transitive dependencies. Run
`.tools/venv/bin/python -m pip check` after dependency changes. The ASGI tests need
no pytest, HTTP client package, GPU, downloaded model, or biometric samples.
Normal setup requires access to PyPI; this session used hash-verified official
wheels downloaded separately because direct package-manager DNS is restricted.

`npm run setup:env` creates `.env` with mode 0600 and a random database password.
It never overwrites an existing file. If one already exists, supply the missing
`VOICEPROOF_DATABASE_PASSWORD` locally. No wallet/issuer/holder keys are generated.

`npm run data:up` starts local PostgreSQL on `127.0.0.1:5433`, using the
[official image](https://hub.docker.com/_/postgres). `npm run data:down` preserves
its named volume. Unlike the ephemeral Midnight stack, database contents survive
container removal; remove its volume only when deliberately resetting local data.
No application schema, biometric persistence, or S3 adapter is wired yet.

The API binds to `127.0.0.1:3000`; the verifier binds to `127.0.0.1:8000`.
`npm run dev:api` builds and starts the API. For TypeScript edits, restart it to
rebuild. The verifier runs directly from Python source; restart after changes.
These host processes are intentionally separate from infrastructure containers.

```bash
curl -i http://127.0.0.1:3000/health/live
curl -i http://127.0.0.1:8000/health/ready
```

Expect live=200, ready=503, and sensitive POST operations=501. The verifier does
not read uploads or emit scores. Production authentication, upload limits, model
isolation, key storage, TLS, and retention are prerequisites for enabling them.

API routes: `/v1/enrollments`, `/v1/challenges`, `/v1/authorizations`,
`/v1/generations`, `/v1/revocations`. Verifier routes: `/voice/enroll`,
`/voice/verify`. All are unavailable placeholders, not a supported public API.

## Scaffold validation limits

Workspace type checks, SDK/API unit tests, verifier ASGI tests, Python dependency
consistency, Compact simulation, package creation, and both Compose configurations
pass. The sandbox denies loopback listeners (`EPERM`) as well as Docker access;
actual HTTP and container startup cannot be verified here. `npm run test:http`
checks both real HTTP processes on a normal development machine and in CI. CI is
configured, but its hosted result is not yet available. No voice proof or on-chain
authorization is claimed by these checks.
