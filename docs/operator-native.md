# Native Deployment

Status: v0 Draft

Native deployment runs Core directly on an operator-controlled Windows or Linux host. Use the explicit JSON configuration contract and keep the Core Gateway as the only public application entry.

## Current contract

Use `config/core.example.json` and validate it with `config/core.schema.json`. The default `config/core.json` and relative `dataDir` paths resolve from the installed bundle root, not the service manager's working directory; pass `--config <path>` for an explicit file elsewhere. Native bundle validation requires the Core CLI, management assets, component catalog, schemas, example configuration, Core runtime dependencies, the versioned `@carmediahub/sdk` runtime, and runtime metadata. Instance configuration and `.env` files do not belong in a release bundle. A strict release bundle must contain real files rather than dependency symlinks; the repository check may allow package-manager links only while validating the source tree.

On Windows, the service registration contract generates explicit `sc.exe` arguments from absolute paths to Node, the bundle, the data directory and the configuration file. It uses the Core loopback defaults and does not read PATH or environment variables. The current repository provides this contract and tests; it does not silently install or modify a Windows service.

After building Core, `pnpm create:native-bundle -- <absolute-output-directory>` creates a self-contained release directory outside the source tree. The command copies only release artifacts and dereferences package-manager links; run `pnpm check:native-bundle` against the resulting directory before distribution.

## Not a release promise yet

Native installers, service-account and ACL setup, system-service installation, clean-machine installation, component distribution, upgrade, rollback and cross-platform recovery remain release gates. The repository has generation contracts for Windows `sc.exe` and Linux systemd, but does not apply them to the host yet. Do not expose database, Worker, plugin or debugging ports while those gates are incomplete.

The dry-run plan includes a serialized action list. Before a future privileged installer consumes it, Core revalidates the platform command allowlist, argument bytes, idempotency mode and stdin boundary. This protects the execution boundary but does not claim that Native service registration or ACL application has been performed.

Native bundles include `config/native-install-plan.schema.json`, allowing an external installer to validate the plan shape independently before executing privileged operations.

The public copy is available at [`/schemas/native-install-plan.schema.json`](/schemas/native-install-plan.schema.json).
