# Errors and Events

SDK errors and domain events are versioned data contracts. Clients should branch on the stable `code`, not on exception text, URLs or host details. Every SDK capability call that receives a Core error preserves this envelope as `CmhError`; this applies to data, jobs, media, browser, history, catalog, notifications and network calls alike.

## Error envelope

```json
{
  "code": "CMH.JOBS.QUEUE_FULL",
  "messageKey": "errors.jobs.queueFull",
  "retryable": true,
  "diagnosticId": "diag_jobs_queue_full",
  "details": { "limit": 10 }
}
```

- `code` is the stable machine identifier.
- `messageKey` is a localization key; resolve it with the current platform locale.
- `retryable` is Core's policy hint, not permission to retry without a bound.
- `diagnosticId` is safe to include in an operator report.
- `details` contains only bounded, non-secret values and may be absent.

Retry only errors marked retryable, use bounded backoff and stop when the user cancels, the deadline expires or the installation is revoked. Do not log raw request payloads, credentials, cookies, Profile data, paths or upstream response bodies.

The v0 catalog includes scope, capability, pagination, protocol, job, media, network, storage, browser and catalog errors. Examples: `CMH.DB.SCOPE_DENIED`, `CMH.CAPABILITY.DENIED`, `CMH.PROTOCOL.DEADLINE_EXCEEDED`, `CMH.JOBS.INTERRUPTED`, `CMH.MEDIA.QUOTA_EXCEEDED` and `CMH.BROWSER.GRANT_REQUIRED`. Unknown codes must be rendered as a generic localized failure and reported with `diagnosticId`.

Network failures use these stable semantics:

| Code | Retry policy | Meaning |
| --- | --- | --- |
| `CMH.NETWORK.TARGET_DENIED` | Do not retry | The requested path is outside the service binding policy or the binding is unavailable. |
| `CMH.NETWORK.QUOTA_EXCEEDED` | Retry with bounded backoff | The scoped organization/user/installation/binding concurrency quota is currently full. |
| `CMH.NETWORK.RESPONSE_TOO_LARGE` | Do not retry | The upstream response exceeds Core's bounded response limit. |

Plugins must not turn these errors into upstream URLs, headers, cookies or response bodies in logs.

## Event envelope

```json
{
  "eventId": "opaque-id",
  "occurredAt": "2026-09-24T00:00:00.000Z",
  "scope": { "deploymentId": "...", "organizationId": "...", "userId": "...", "installationId": "..." },
  "producer": "wdr-media",
  "schemaVersion": 1,
  "type": "media.ready",
  "payload": { "subject": "opaque-reference" }
}
```

Events are scoped to the current organization, user and installation. Payloads must be bounded and must not contain credentials, host paths, arbitrary upstream URLs or raw media content. Treat event delivery as informational: persist idempotent state through the scoped data API and tolerate duplicate or late notifications. A context or capability revocation can make a previously observed reference unusable.

See the [API reference](./api.md), [Capability Catalog](./capabilities.md) and SDK `errors.json` for the versioned catalog.
