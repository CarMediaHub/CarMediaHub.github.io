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

Workers communicate with the Core through a versioned local IPC contract. The public contract defines lifecycle, context, capabilities, events, health, diagnostics, cancellation, and error identifiers. Large media and files use controlled stream handles rather than message payloads.

## Private data API

`db` grants a constrained logical data store, not a database connection. Each read and write is bound by Core to the active organization, user, and plugin installation. A plugin cannot select another user, name a schema, receive a DSN, or issue arbitrary SQL. The same contract applies whether Core uses SQLite, PostgreSQL, or an operator-managed compatible database.

WDR Media uses this API for playback history. Storage roots, media conversion, and service bindings remain Core-managed capabilities, so the plugin never receives host paths, upstream cookies, or service credentials.

## Package requirements

A package includes its manifest, execution entry, optional UI assets, migrations, localization resources, SBOM, checksums, and signature. It must not contain user credentials, browser profile data, host-specific configuration, runtime logs, or unverified executable downloads.

The machine-readable v0 manifest and error catalog are maintained in the [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) repository.
