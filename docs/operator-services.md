# Operator Services and Bindings

Status: v0 Draft

CarMediaHub treats media and network tools as operator-controlled services. A service may be installed beside Core or exposed by an operator-managed host, while plugins use a controlled service binding instead of opening their own public port.

## Service roles

- **AList** provides a file and WebDAV-oriented catalog for operator-managed storage.
- **rclone** can mount or normalize storage providers and expose a controlled WebDAV endpoint for compatible services.
- **FFmpeg** is a media processing dependency for capabilities such as probing, remuxing, and future playback pipelines.
- **Mihomo** and similar network tools are operator-managed network services. Core does not prescribe a routing policy.
- **Nginx or an equivalent gateway** may route internal component traffic. It is not a requirement for every deployment and does not create a public port per plugin.

These services are compatibility targets and managed dependencies. CarMediaHub does not modify their upstream source code. A compatibility plugin adapts a service through the Core binding API so the client can use it through the single CarMediaHub entry point.

The Core component catalog records bounded roles for selection and validation: storage service, WebDAV, media processing, archive, and network egress. A role is metadata only; it does not mean that a signed binary is included or installed. Version, platform, digest, signature, and health checks remain separate gates.

When an operator registers an already staged component, Core accepts only a semantic version, a managed relative executable identifier, and a SHA-256 digest (optionally prefixed with `sha256:`). Registration records metadata; it does not grant a plugin a role or replace signature and health verification.

To prepare a release, run Core's explicit `component:prepare-release` command with a data directory, artifact path, component ID, version, platform, artifact ID and the 16-character fingerprint of the trusted public signing key. The command copies a regular file into `data/staging`, computes its SHA-256 digest and writes an unsigned release record when requested. It never reads a private key, signs a release, overwrites an existing staging artifact or installs the component. An operator-owned signing process must sign the record before the management API accepts it.

The public `alist-web-bridge` reference adapter demonstrates this boundary. It uses an operator-approved AList binding, accepts bounded relative paths, and forwards only filtered headers. `GET`/`HEAD` can read relative resources; `POST` is limited to `/api/fs/list`, `/api/fs/get`, and `/api/fs/search` with a 64 KiB JSON body limit. It does not contain an AList address, credentials, cookies, or upstream source code. The example is a contract reference, not a claim that every AList WebDAV or management feature is supported.

The public `mihomo-web-bridge` reference adapter applies the same model to an operator-approved Mihomo control API and only exposes bounded paths such as `/configs`, `/proxies`, `/providers`, `/rules`, `/connections`, and `/version`. The first version does not forward authorization headers, provide a WebSocket traffic panel, or modify Mihomo; it is a control-API compatibility example, not a claim that the full Clash Web UI is supported.

## Remote media sources

AList and rclone WebDAV may eventually be used as read-only media sources, but this is separate from the AList Web management bridge. The planned design uses a Core-owned opaque source handle for scoped listing, probing, playback sessions, and Range reads. Plugins will not receive a WebDAV URL, endpoint, host path, or credential; Core resolves and injects WebDAV credentials at the final request boundary.

Core now has registration, persistence, revocation, health checks, and a read-only provider fixture for remote media sources. Health checks return only status and a classified diagnostic. WDR still uses Core-managed local media roots, while `alist-web-bridge` remains a bounded management/catalog adapter. The real AList/rclone deployment matrix and WDR production verification are still pending. WebDAV write, delete, upload, arbitrary proxying, and automatic discovery are outside the initial scope.

## Binding model

A binding is configured by an operator for a specific installed plugin instance. The binding contains a service identifier and a private upstream address, then applies health checks, request and response limits, concurrency limits, and redirect restrictions. The plugin receives a capability-scoped client; it does not receive a raw database connection, arbitrary command execution, host environment, or unrestricted network socket.

Bindings are not a discovery mechanism. Core does not scan the LAN, infer values from `PATH`, or silently read system environment variables. The operator explicitly supplies the service endpoint and credentials through the management surface or deployment configuration. Secrets are kept in the Core-controlled credential boundary.

## Typical media path

```text
browser or vehicle client
  -> one CarMediaHub entry point
  -> plugin route
  -> controlled service binding
  -> operator-managed AList/rclone/media service
```

Core can run bounded remux/transcode and VOD HLS jobs through a healthy managed FFmpeg component; the worker and native/Docker service runner remain separately gated distribution concerns. The current contract does not claim live HLS, or that every AList/rclone/Mihomo binary is already shipped for every platform.

## Operational boundaries

- Bindings are scoped to an installation and plugin instance.
- Health checks must use an explicit safe endpoint; redirects and response sizes are bounded.
- A failed binding is reported as a stable diagnostic; upstream paths and secrets are not exposed to clients.
- Operators remain responsible for licensing, credentials, network policy, storage access, and the security of the upstream service.
- Plugins must degrade clearly when a required binding is unavailable.

## Current status

The Core service-binding API, installation scoping, health checks, request/response/concurrency limits, and management representation are implemented and tested. Native and Docker distribution of real third-party binaries, platform-specific recovery, and production media pipelines remain planned work and are tracked in the governance roadmap.
