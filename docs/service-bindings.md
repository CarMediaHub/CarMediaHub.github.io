# Service Bindings

Status: v0 Draft

Service bindings let a plugin use an operator-managed local service through the single CarMediaHub entry point. The plugin receives a scoped client; it never receives a raw socket, database connection, host path, or public port.

## Contract

An operator creates a binding for an installed plugin instance. Core stores the private endpoint and credentials, checks the declared binding name, and applies origin, method, redirect, body-size, response-size, concurrency, timeout, and cancellation limits.

Plugins submit a relative path and bounded request data through `network.request`. They cannot submit an arbitrary URL, hostname, port, cookie, authorization header, shell command, or filesystem path. A binding health check is a bounded Core operation and does not grant network capability.

## Built-in service roles

| Role | Typical service | Boundary |
|---|---|---|
| `storage` / `webdav` | AList or rclone | Core-owned media source or bounded management bridge |
| `media-processing` | FFmpeg | Core-owned probe, remux, transcode, and VOD HLS jobs |
| `network-egress` | Mihomo | Operator policy and bounded control API access |
| `archive` | 7z-compatible component | Core-owned archive task, not plugin command execution |

These are compatibility roles, not a promise that a binary is bundled for every platform. Installation, signature, digest, health, and platform support are separate gates.

## Examples and limits

`alist-web-bridge` and `mihomo-web-bridge` are reference adapters. They forward only declared relative paths and filtered headers. They do not modify upstream source code, expose credentials, or claim full AList WebDAV or Clash Web UI compatibility.

Remote WebDAV media sources are separate from the AList management bridge. Core owns the source handle, credential injection, listing, probing, playback sessions, and Range reads. Write, delete, upload, arbitrary proxying, and automatic LAN discovery are outside the initial contract.

