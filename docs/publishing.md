# Publishing Plugins

Status: v0 Draft

Publishing is a reproducible package operation, not an automatic approval. A package must be built from a clean checkout with a versioned SDK, package-relative entrypoint, localization resources, license, checksum, SBOM, and a signed release record.

## Package gates

- Validate the manifest and declared capabilities against the SDK version.
- Build the Worker or trusted shared adapter without host-specific paths or downloaded executables.
- Run type, contract, isolation, leakage, rollback, and catalog tests.
- Generate the package digest, SBOM, provenance metadata, and signature with a trusted release key.
- Publish only the artifact and public documentation; keep credentials, profiles, logs, and private deployment data out of the package.

The catalog records publisher, license, SDK range, runtime, target class, risk, data lifecycle, support status, digest, and revocation state. A catalog entry is not proof that an upstream site works. High-risk browser, external-network, media-extraction, and proxy adapters require additional review before public distribution.
