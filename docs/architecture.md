# Architecture

Status: v0 Draft

CarMediaHub is a self-hosted platform for publishing authorized local capabilities to browsers and in-vehicle displays through infrastructure controlled by the operator.

```text
Browser or in-vehicle display
  -> operator-controlled entry
  -> CarMediaHub Gateway
  -> Core, Broker and Supervisor
  -> isolated plugin runtime groups
  -> authorized local resources or approved network targets
```

The Core is the single public application entry. Plugins register logical routes and use SDK capabilities; plugins do not publish public host ports or receive raw database credentials, unrestricted host paths, browser profile data, or network access.

The Gateway applies process-local stream protection: each authenticated session has a concurrent stream limit and each stream has a bounded byte budget. When a stream exceeds its budget, Core cancels the Worker request and releases the lease. This protects one Core instance; it is not a replacement for operator bandwidth limits or upstream rate controls.

The management speed test measures both directions. Upload measurement accepts only authenticated `application/octet-stream` requests between 64 KiB and 2 MiB; Core does not persist the body and returns only the received byte count.

## Runtime groups

| Group | Intended use |
|---|---|
| Shared adapter host | Low-risk, lightweight adapters with compatible request patterns |
| Isolated worker | Browser, file, network, media, third-party, long-running, or high-resource work |
| WASM module | Pure computation without arbitrary system access or long-lived connections |

Installing a plugin does not imply a permanent process. The Supervisor starts, drains, stops, updates, and recovers runtime groups according to lifecycle and resource policy.

The management panel distinguishes package installation from Worker health. An installed package may still be stopped, starting, backing off, disabled, or failed; the panel shows the Supervisor state and retry count without exposing host paths or secrets.

The same view lists the capabilities declared by each validated Manifest and the current grant set for operator review. Installation grants the declared set by default, while an operator may reduce it to a subset; Core checks every capability call against the current grant, installation, and user boundaries, and audits changes.

## Data and identity

Every operation is scoped to a deployment, organization, user, device/session, and plugin installation where applicable. The platform provides logical private data access; storage backends do not change the public SDK behavior.

## Deployment boundary

Operators choose their domain, entry, network path, storage, and bandwidth. Community operation does not require a CarMediaHub hosted account or relay. Self-hosting does not remove the operator's responsibility for access control, network visibility, content rights, or applicable policy.
