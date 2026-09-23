# Plugin Lifecycle

Core owns the plugin lifecycle. A plugin is a versioned package plus a scoped installation instance; a Worker never decides its own exposure, restart policy or data deletion.

## States and transitions

```text
staged -> installed -> enabled -> draining -> disabled
                         |          |
                         v          v
                    uninstalled <- disabled
```

- **staged**: package files are outside the active runtime and await signature, digest and Manifest validation.
- **installed**: the verified package and installation record exist, but its routes are not necessarily enabled.
- **enabled**: Core may start the declared runtime and expose only declared routes and granted capabilities.
- **draining**: new work is rejected while active gateway streams, jobs, browser sessions and media sessions receive cancellation.
- **disabled**: the Worker is stopped and routes are closed; installation data remains.
- **uninstalled**: the application entry and runtime are closed. Plugin data remains until an explicit, confirmed deletion.

Installation, enable, disable and uninstall are administrator actions. A plugin cannot enable itself or request a broader grant than its signed Manifest. Capability grants may be reduced per installation but never expanded beyond the Manifest without a new package review.

## Health and restart

Core starts only a registered runtime factory or verified component. Health is a bounded state (`starting`, `healthy`, `stopping`, `failed`, or `stopped`) with retry metadata; command lines, host paths, credentials and upstream error text are not exposed. Crashes use bounded backoff. A plugin that repeatedly fails is disabled for operator review rather than restarted without limit.

## Upgrade and rollback

Upgrade stages a new package beside the current one, validates its signature, digest, SDK range and Manifest, then drains the old installation before switching the logical entry. The old package and data are not deleted until the new instance passes health checks. If activation fails, Core keeps the old installation enabled and records a redacted audit event. Data migrations are versioned, scoped and idempotent; Core never gives a plugin SQL or a database connection.

## Uninstall and data

Uninstall first drains and revokes the installation's jobs, browser sessions, credentials, media sessions and service bindings. It closes the app entry but retains plugin data for recovery and export. Data deletion requires a separate explicit confirmation and is bounded by the SDK export/delete contract.

See the [Manifest](./manifest.md), [API reference](./api.md), [plugin contract](./plugin-contract.md) and [developer quickstart](./developer-quickstart.md) for package and capability details.
