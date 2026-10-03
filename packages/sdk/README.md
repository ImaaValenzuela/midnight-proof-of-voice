# @voiceproof/sdk

Private Node.js development package. This currently exports `getNetworkConfig`
and `createNodeProviders` for Midnight.js 4.1.1. Voice authorization is not yet
implemented. See the repository README and docs/development.md for setup.

The consumer supplies wallet, transaction-submission, and private-state providers.
Use an absolute generated-ZK directory and only one active network per process.
The SDK never creates holder secrets or supplies a default wallet.

Build from the monorepo root with `npm run build`; package with
`npm pack --workspace @voiceproof/sdk`. Native mobile and browser builds are not
supported by this Node filesystem provider entry point.
