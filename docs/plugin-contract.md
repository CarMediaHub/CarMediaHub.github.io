# Plugin Contract

Status: v0 Draft

A plugin package declares its identity, publisher, SDK compatibility, runtime requirement, routes, capabilities, resources, and data lifecycle. The manifest is an authorization request, not an automatic grant.

## Lifecycle

```text
discovered -> verified -> grant pending -> configured -> prepared
-> starting -> ready -> active -> draining -> stopped
                              \-> failed -> quarantined
```

Stopping, uninstalling, and deleting plugin data are separate actions. A failed or quarantined plugin does not receive routes or capability calls.

## Capability model

The SDK exposes scoped capabilities for configuration, private data, storage, media, jobs, history, catalog, display, events, diagnostics, gateway routing, network, browser sessions, and managed transfers. Sensitive capabilities remain disabled until explicitly declared, approved, and granted.

The `jobs` capability keeps work inside the current user and plugin-installation scope. The initial quota is 10 active jobs per scope, with 64 KiB limits for both JSON payload and result. Exceeding these limits returns the stable errors `CMH.JOBS.QUEUE_FULL`, `CMH.JOBS.PAYLOAD_TOO_LARGE`, or `CMH.JOBS.RESULT_TOO_LARGE`; callers must use the catalog message keys instead of hard-coding user-facing text.

The `history` capability exposes `record`, `query`, and `clear` through the same scoped Worker contract. Core persists the minimal subject, route, title, category, device, and timestamp fields; plugins cannot select another user or installation and do not receive a database connection.

The `catalog` capability exposes `register`, `query`, and `remove` for searchable plugin entries. Core applies scope and authorization before filtering; a plugin contributes metadata and a route, never SQL or an unrestricted index query.

The `display` capability exposes read-only display capabilities and a `requestMode` intent for `normal` or `fullscreen`. Core can reject fullscreen when the device does not support it; plugins never receive browser-window control.

The `notifications` API is provided through the platform event capability. A plugin can publish a bounded `info`, `success`, `warning`, or `error` notification and list or mark read only notifications in its current user and installation scope. Core owns persistence and user-facing delivery; plugins cannot address another user or installation.

Workers communicate with the Core through a versioned local IPC contract. The public contract defines lifecycle, context, capabilities, events, health, diagnostics, cancellation, and error identifiers. Large media and files use controlled stream handles rather than message payloads.

## Private data API

`db` grants a constrained logical data store, not a database connection. Each read and write is bound by Core to the active organization, user, and plugin installation. A plugin cannot select another user, name a schema, receive a DSN, or issue arbitrary SQL. The same contract applies whether Core uses SQLite, PostgreSQL, or an operator-managed compatible database.

WDR Media uses this API for playback history. Storage roots, media conversion, and service bindings remain Core-managed capabilities, so the plugin never receives host paths, upstream cookies, or service credentials.

## Adapter publication

The plugin catalog separates native media applications, local-service bridges, upstream adapters, browser bridges, and community packages. A catalog entry is not an approval to run code. Packages that need browser identity, external network access, media extraction, or a high-risk upstream require an isolated runtime, explicit capability review, and dedicated leakage and rollback tests before public distribution.

## Package requirements

A package includes its manifest, execution entry, optional UI assets, migrations, localization resources, SBOM, checksums, and signature. It must not contain user credentials, browser profile data, host-specific configuration, runtime logs, or unverified executable downloads.

The machine-readable v0 manifest and error catalog are maintained in the [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) repository.
