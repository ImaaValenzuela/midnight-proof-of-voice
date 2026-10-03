# Privacy model

Raw enrollment/challenge audio is private transient input. Templates are private
biometric data, encrypted with managed keys separate from application records.
Scores, model signals, account identities, internal template IDs, detailed consent,
and music inputs/results remain off ledger. No biometric collection exists yet.

Before enabling uploads, define purpose, informed consent, data access, retention,
deletion (including backups and queued work), incident response, and applicable
legal requirements. Default to deleting raw samples after processing; evaluation
retention requires a separate explicit choice. Never commit datasets or log inputs.

The ledger receives only the minimum reviewed commitments, credential status,
nullifiers, and authorization references. Public state is durable; deletion of a
private template cannot erase public commitments. A stable credential revocation
identifier may link authorizations. Commitments do not guarantee anonymity.

A server-side verifier sees samples and templates. A remote prover may see private
witnesses. A sponsor pays transaction costs and must not receive holder secrets.
Document each provider's access before deployment. Telemetry must use aggregate
metrics and avoid identifiers that reconstruct biometric or listening histories.

S3-compatible object storage and envelope encryption are intentionally not wired
until upload authentication and retention are implemented. The local PostgreSQL
container is infrastructure only; no schema or application writes are enabled.
