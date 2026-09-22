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

Disabling a plugin removes its route, stops its Worker, and revokes related playback sessions. Re-enabling restores only the route and lazy-start eligibility; it does not start a Worker automatically or reset granted capabilities and plugin data.

## Capability model

The SDK exposes scoped capabilities for configuration, private data, storage, media, jobs, history, catalog, display, events, diagnostics, gateway routing, network, browser sessions, and managed transfers. Sensitive capabilities remain disabled until explicitly declared, approved, and granted. A Worker may receive a read-only `grantedCapabilities` list after handshake for feature adaptation; Core remains authoritative and rechecks the current grant on every call, while older Brokers may omit this field.

The `jobs` capability keeps work inside the current user and plugin-installation scope. The initial quota is 10 active jobs per scope, with 64 KiB limits for both JSON payload and result. Exceeding these limits returns the stable errors `CMH.JOBS.QUEUE_FULL`, `CMH.JOBS.PAYLOAD_TOO_LARGE`, or `CMH.JOBS.RESULT_TOO_LARGE`; callers must use the catalog message keys instead of hard-coding user-facing text.

The `history` capability exposes `record`, `query`, and `clear` through the same scoped Worker contract. Core persists the minimal subject, route, title, category, device, and timestamp fields; plugins cannot select another user or installation and do not receive a database connection.

The `catalog` capability exposes `register`, `query`, and `remove` for searchable plugin entries. Core applies scope and authorization before filtering; a plugin contributes metadata and a route, never SQL or an unrestricted index query.

The `display` capability exposes read-only display capabilities and a `requestMode` intent for `normal` or `fullscreen`. Core can reject fullscreen when the device does not support it; plugins never receive browser-window control.

The `notifications` API is provided through the platform event capability. A plugin can publish a bounded `info`, `success`, `warning`, or `error` notification and list, mark one read, or mark all read only within its current user and installation scope. `markAllRead` returns the number of notifications changed. Core owns persistence and user-facing delivery; plugins cannot address another user or installation.

The `media` capability can create a short-lived playback session for an opaque media ID. Subsequent media reads must use that session; Core binds it to the user, device, installation and expiry, and revokes it when the user session or plugin installation is revoked. Plugins never receive a host path or a reusable public media URL.

For media gateway routes, `HEAD` returns metadata only and does not create a playback session or read media bytes. A session is created only for an actual `GET` playback request.

Media probing through `media.probe` returns controlled metadata, seekability, and structured playback modes: `direct-range`, `remux`, and `transcode`. Core currently exposes only `direct-range`; the latter modes require a future Core-owned job executor and never grant plugins FFmpeg, host paths, or arbitrary command execution.

`media.requestTransform` accepts only a media ID and a bounded output profile. Core validates the media and mode, then creates a scoped, cancellable Job; it does not accept source paths, executable arguments, URLs, or shell fragments.

Workers communicate with the Core through a versioned local IPC contract. The public contract defines lifecycle, context, capabilities, events, health, diagnostics, cancellation, and error identifiers. Large media and files use controlled stream handles rather than message payloads.

## Private data API

`db` grants a constrained logical data store, not a database connection. Each read and write is bound by Core to the active organization, user, and plugin installation. A plugin cannot select another user, name a schema, receive a DSN, or issue arbitrary SQL. The same contract applies whether Core uses SQLite, PostgreSQL, or an operator-managed compatible database.

WDR Media uses this API for playback history. Storage roots, media conversion, and service bindings remain Core-managed capabilities, so the plugin never receives host paths, upstream cookies, or service credentials.

## Adapter publication

The plugin catalog separates native media applications, local-service bridges, upstream adapters, browser bridges, and community packages. A catalog entry is not an approval to run code. Packages that need browser identity, external network access, media extraction, or a high-risk upstream require an isolated runtime, explicit capability review, and dedicated leakage and rollback tests before public distribution.

## Package requirements

A package includes its manifest, a package-relative execution entry, optional UI assets, migrations, localization resources, SBOM, checksums, and signature. Isolated workers declare `worker`; shared adapters and future module runtimes declare `runtimeEntry` with protocol `0.1`. Core rejects absolute paths, traversal, commands, and host environment dependencies. It must not contain user credentials, browser profile data, host-specific configuration, runtime logs, or unverified executable downloads.

The machine-readable v0 manifest and error catalog are maintained in the [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) repository.

The official plugin collection builds installable artifacts under `dist/packages/<plugin-id>`. A package contains its manifest, compiled `worker.js` entry, optional UI, and localized READMEs. Run `pnpm build` followed by `pnpm verify:packages` in [`carmediahub-plugins`](https://github.com/CarMediaHub/carmediahub-plugins) before staging a package for Core.

Network-enabled plugins use `network.request` with a service binding explicitly assigned to their plugin installation and a relative path. Operators assign that installation scope from the Core management panel; leaving the scope empty creates a Core-only binding that is not available to plugin requests. Plugins cannot submit arbitrary URLs, hostnames, ports, credentials, sockets, or unrestricted headers. Upstream adapters still require isolated-runtime and leakage tests before distribution.

Operators can run an explicit binding health check from the management panel. Core sends a bounded `HEAD` request without following redirects or returning the response body; the result contains only reachability, HTTP status when available, and latency. A health check does not grant a plugin network capability.

Redirects are handled by Core: only GET and HEAD may follow up to three redirects, and every target must remain on the binding origin. Cross-origin redirects and redirects for other methods are rejected.

Core limits each binding to ten active requests and rejects response bodies larger than 1 MiB. The quota is released on success, failure, timeout, and cancellation.

The repository includes `service-binding-adapter-example` as a neutral reference implementation. It demonstrates the contract without targeting a specific website or exposing a public proxy.
