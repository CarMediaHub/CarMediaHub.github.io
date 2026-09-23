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

For localized plugin text, use the SDK helpers `normalizeLocale`, `localeFallbacks`, and `localize`. They normalize `zh`/`zh-CN` and `ko-KR`/`ko`, then resolve requested locale, language family, and English in that order. Plugins inherit the Core locale and must not introduce a second platform-wide language preference.

The `jobs` capability keeps work inside the current user and plugin-installation scope. The initial quota is 10 active jobs per scope, with 64 KiB limits for both JSON payload and result. Exceeding these limits returns the stable errors `CMH.JOBS.QUEUE_FULL`, `CMH.JOBS.PAYLOAD_TOO_LARGE`, or `CMH.JOBS.RESULT_TOO_LARGE`; callers must use the catalog message keys instead of hard-coding user-facing text.

The `history` capability exposes `record`, `query`, and `clear` through the same scoped Worker contract. Core persists the minimal subject, route, title, category, device, and timestamp fields; plugins cannot select another user or installation and do not receive a database connection.

History and catalog queries accept bounded `limit` and `offset` values for pagination. Core applies keyword and category filters before pagination and returns a total count for management-facing queries; invalid values are rejected with `CMH.PAGINATION.INVALID`.

The `catalog` capability exposes `register`, `query`, and `remove` for searchable plugin entries. Core applies scope and authorization before filtering; a plugin contributes metadata and a route, never SQL or an unrestricted index query.

The `display` capability exposes read-only display capabilities and a `requestMode` intent for `normal` or `fullscreen`. Core can reject fullscreen when the device does not support it; plugins never receive browser-window control.

The `browser` capability is implemented in the SDK v0 Wire contract as opaque, scoped sessions and a bounded Core-owned task queue: `browser.session.request`, `browser.session.list`, `browser.session.revoke`, `browser.task.enqueue`, `browser.task.list`, and `browser.task.cancel`. Core persists, lists, revokes, and cancels sessions and tasks within organization, user, and plugin-installation scope. Real Browser Worker navigation, script execution, cookie import, media extraction, and the cross-platform compatibility matrix remain unfinished. The contract never exposes browser profiles, cookies, CDP endpoints, host paths, processes, or arbitrary URLs/scripts.

The `notifications` API is provided through the platform event capability. A plugin can publish a bounded `info`, `success`, `warning`, or `error` notification and list, mark one read, or mark all read only within its current user and installation scope. `markAllRead` returns the number of notifications changed. Core owns persistence and user-facing delivery; plugins cannot address another user or installation.

The `media` capability can create a short-lived playback session for an opaque media ID. Subsequent media reads must use that session; Core binds it to the user, device, installation and expiry, and revokes it when the user session or plugin installation is revoked. Plugins never receive a host path or a reusable public media URL.

For media gateway routes, `HEAD` returns metadata only and does not create a playback session or read media bytes. A session is created only for an actual `GET` playback request.

Media probing through `media.probe` returns controlled metadata, seekability, and structured playback modes: `direct-range`, `remux`, and `transcode`. When a managed FFmpeg is healthy, Core can execute the controlled `remux` and `transcode` modes. A completed transform returns a short-lived opaque `outputId`; the plugin reads bounded chunks through `media.readOutput`, or uses Core's authenticated playback route. VOD HLS is provided through the scoped session API below; live HLS is not part of the current contract. Plugins never receive FFmpeg, host paths, or arbitrary command execution.

`media.requestTransform` accepts only a media ID and a bounded output profile. Core validates the media and mode, then creates a scoped, cancellable Job; it does not accept source paths, executable arguments, URLs, or shell fragments.

Transform outputs are isolated to the organization, user, device and installation scope, expire automatically, and can be revoked. Core exposes authenticated `GET`/`HEAD /api/media/outputs/:id` with bounded Range reads; expired, revoked, missing, or out-of-scope results are indistinguishable to callers.

`media.requestHls` creates a short-lived, scoped VOD session with a Core-generated playlist and segment tokens. `media.readHlsAsset` reads bounded ranges from those tokens; plugins cannot select an output directory, file template, protocol, filter, or FFmpeg argument. HLS sessions are cleaned up on expiry or revocation and are not permanent media URLs.

Workers communicate with the Core through a versioned local IPC contract. The public contract defines lifecycle, context, capabilities, events, health, diagnostics, cancellation, and error identifiers. Large media and files use controlled stream handles rather than message payloads.

## Private data API

`db` grants a constrained logical data store, not a database connection. Each read and write is bound by Core to the active organization, user, and plugin installation. A plugin cannot select another user, name a schema, receive a DSN, or issue arbitrary SQL. The same contract applies whether Core uses SQLite, PostgreSQL, or an operator-managed compatible database.

Data listing is deterministic: records are returned in key order, and `prefix` is matched as a literal key prefix rather than a SQL pattern. This keeps the same behavior across database backends.

WDR Media uses this API for playback history. Storage roots, media conversion, and service bindings remain Core-managed capabilities, so the plugin never receives host paths, upstream cookies, or service credentials.

Operators can export or delete the current user's data for one plugin installation from Core. Export includes bounded logical records and migration metadata, is limited to 10,000 records or 4 MiB, and is marked `no-store`; deletion requires explicit confirmation and removes both records and migration metadata in one Core transaction. These operations never accept a plugin-supplied user, organization, installation, schema, or SQL statement.

Stopping, uninstalling, and deleting data remain separate lifecycle actions. Uninstalling requires the installation to be stopped, removes its active route and runtime authorization, and preserves its scoped data until an explicit deletion. A later installation of the same package version receives a new installation identity.

## Adapter publication

The plugin catalog separates native media applications, local-service bridges, upstream adapters, browser bridges, and community packages. A catalog entry is not an approval to run code. Packages that need browser identity, external network access, media extraction, or a high-risk upstream require an isolated runtime, explicit capability review, and dedicated leakage and rollback tests before public distribution.

The public `browser-session-contract-example` is a fixture for this boundary. It has been verified through an isolated Worker, the Core Broker, and the Gateway for opaque session and bounded task metadata, without starting a real browser or connecting to an upstream website; it is not a browser automation or login-state integration.

## Package requirements

A package includes its manifest, a package-relative execution entry, optional UI assets, migrations, localization resources, SBOM, checksums, and signature. Isolated workers declare `worker`; shared adapters and future module runtimes declare `runtimeEntry` with protocol `0.1`. Core rejects absolute paths, traversal, commands, and host environment dependencies. It must not contain user credentials, browser profile data, host-specific configuration, runtime logs, or unverified executable downloads.

The machine-readable v0 manifest and error catalog are maintained in the [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) repository.

The official plugin collection builds installable artifacts under `dist/packages/<plugin-id>`. A package contains its manifest, compiled `worker.js` entry, optional UI, localized READMEs, and the versioned `@carmediahub/sdk` runtime needed to load the Worker independently. Run `pnpm build` followed by `pnpm verify:packages` in [`carmediahub-plugins`](https://github.com/CarMediaHub/carmediahub-plugins) before staging a package for Core.

Network-enabled plugins use `network.request` with a service binding and a relative path. An installation-specific binding takes precedence. A Core-global binding is available only when the plugin Manifest explicitly lists its name in `serviceBindings`; leaving the binding scope empty without that declaration keeps it Core-only. Plugins cannot submit arbitrary URLs, hostnames, ports, credentials, sockets, or unrestricted headers. Upstream adapters still require isolated-runtime and leakage tests before distribution.

A plugin that needs an operator-approved upstream login state must declare the `secrets` capability. The administrator enters a cookie or authorization value in the Core management surface; the plugin receives only an opaque `credentialRef`, which Core injects at the final bound request hop. Plaintext never enters the Worker, SDK return values, or plugin data. References are scoped to the organization, user, and installation, are immediately invalid after revocation, and cannot be combined with plugin-supplied Cookie or Authorization headers.

Operators can run an explicit binding health check from the management panel. Core sends a bounded `HEAD` request without following redirects or returning the response body; the result contains only reachability, HTTP status when available, and latency. A health check does not grant a plugin network capability.

Redirects are handled by Core: only GET and HEAD may follow up to three redirects, and every target must remain on the binding origin. Cross-origin redirects and redirects for other methods are rejected.

Core limits each binding to ten active requests and rejects response bodies larger than 1 MiB. The quota is released on success, failure, timeout, and cancellation.

The repository includes `service-binding-adapter-example` as a neutral reference implementation. It demonstrates the contract without targeting a specific website or exposing a public proxy.
