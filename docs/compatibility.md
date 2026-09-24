# Compatibility Matrix

This matrix separates automated contract evidence from real deployment evidence. `Verified` means the repository has a repeatable test; `Fixture` means a local substitute validates a boundary; `Pending` means no release promise is made yet.

| Area | Current status | Evidence and boundary |
| --- | --- | --- |
| Node.js Core runtime | Verified | TypeScript build and Core `188/188` regression on the supported development host. |
| SDK and Wire Protocol v0.1 | Verified | SDK `46/46`, strict Manifest/error/Wire contracts, locale-contract alignment, capability-context validation and Memory Runtime tests. |
| Official plugin packages | Verified | Seven package manifests, catalog alignment and package verification pass. |
| Windows Native bundle | Contract only | Bundle, service-plan and resource checks exist; clean-machine install, ACL and rollback remain pending. |
| Docker | CI evidence | Linux CI builds the hardened image and exercises bootstrap/readiness/backup restore; local Docker and upgrade drills remain pending. |
| Linux/NAS | Contract only | Explicit config and platform roles exist; target-specific install, service identity, storage and recovery remain pending. |
| SQLite | Verified | Schema v1 gate, migration ledger, scoped data and backup/restore tests. |
| PostgreSQL | Adapter/CI fixture | Scoped adapter and CI PostgreSQL smoke exist; default Compose and NAS production matrix are pending. |
| Chromium/browser bridge | Contract/fixture | Target allowlist, silent managed driver, task/result boundaries and worker fixtures pass; signed Chromium distribution, real navigation and cross-platform matrix are pending. |
| Media playback | Core/fixture | Range, remux, transcode, HLS and WDR contract tests pass; real car head-unit, mobile and desktop device matrix is pending. |
| AList/rclone/Mihomo | Bridge fixtures | Bounded service-binding adapters pass local HTTP fixtures; official binary distribution and real operator deployments are pending. |

Before a release candidate, test at least one clean Windows Native target, one Docker target and one Linux/NAS target, plus a desktop, mobile and vehicle browser playback path. Record versions, component digests, configuration mode, test date and known limitations for each result.

Do not infer support for an OS, browser, upstream site or media format from a fixture. A pending row is an explicit product boundary, not a hidden compatibility promise.
