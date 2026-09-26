# Publishing Plugins

Status: v0 Draft

Publishing is a reproducible package operation, not an automatic approval. A package must be built from a clean checkout with a versioned SDK, package-relative entrypoint, localization resources, license, checksum, SBOM, and a signed release record.

When a Manifest declares `ui.entry`, the distributable package must contain that path as a regular package-relative file. The package verifier rejects missing UI entries, symbolic links, absolute paths, and traversal outside the package before publication.

## Package gates

- Validate the manifest and declared capabilities against the SDK version.
- Build the Worker or trusted shared adapter without host-specific paths or downloaded executables.
- Run type, contract, isolation, leakage, rollback, and catalog tests.
- Generate the package digest, SBOM, provenance metadata, and signature with a trusted release key.
- Publish only the artifact and public documentation; keep credentials, profiles, logs, and private deployment data out of the package.

The repository catalog records the package path, integration kind, target class, runtime, SDK range, license and upstream classification. It also records the logical `sourceKey`, migration status, implementation type, and risk class; the package build rejects any drift between these fields and the machine-checked migration matrix. Signed release records separately bind the package digest and provenance to a trusted key. A catalog entry is not proof that an upstream site works. High-risk browser, external-network, media-extraction, and proxy adapters require additional review before public distribution.
