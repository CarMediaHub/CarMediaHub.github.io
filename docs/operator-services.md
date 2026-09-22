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

The public `alist-web-bridge` reference adapter demonstrates this boundary. It uses an operator-approved AList binding, accepts only bounded relative paths and `GET`/`HEAD`, and forwards only `Accept` and `Range` headers. It does not contain an AList address, credentials, cookies, or upstream source code. The example is a contract reference, not a claim that every AList WebDAV or management feature is supported.

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
