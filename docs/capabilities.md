# Capability Catalog

Capabilities are explicit requests in the signed Manifest. Core grants them per organization, user and plugin installation. `WorkerClient` exposes logical APIs; it never exposes a database connection, host filesystem, process handle, browser profile or arbitrary command channel.

| Capability | SDK surface | Boundary |
| --- | --- | --- |
| `config` | platform configuration APIs | Validated plugin configuration only; no secrets or environment variables. |
| `secrets` | credential references | Core stores encrypted values and injects them only at a controlled final hop; the plugin cannot read them. |
| `db` | `database()` | Logical collections and records with scoped migrations; no DSN, schema or SQL. |
| `storage` | media/storage contracts | Opaque, operator-authorized handles; no arbitrary host paths. |
| `media` | probe, playback, transform and HLS | Core-owned sessions, bounded Range reads and managed FFmpeg jobs. |
| `media-source` | list, stat, probe, playback and read | Read-only opaque source/item handles; credentials remain in Core. |
| `history` | record, query and clear | Current user and installation history only. |
| `catalog` | register, query and remove | Scoped searchable entries; Core owns indexing and deletion. |
| `display` | capabilities and mode intent | Device context and fullscreen intent; no window or browser handle. |
| `jobs` | enqueue, list and cancel | Core-owned bounded asynchronous work; no executor or shell access. |
| `events` | publish and context updates | Scoped domain events with bounded payloads. |
| `diagnostics` | bounded diagnostic operations | Stable codes and redacted metadata only. |
| `gateway` | plugin route handling | Declared logical routes and methods through the single Core entry. |
| `network` | bound-origin request | Operator-approved service binding and filtered headers/methods; not a general proxy. |
| `browser` | opaque sessions and tasks | Registered HTTPS targets, Core-owned Worker and bounded results; no Cookie/Profile/CDP. |
| `transfer` | managed transfer contracts | Core-controlled transfer resources and quotas; no arbitrary socket listener. |

Plugins should request the smallest set of capabilities needed for their user-visible behavior. `serviceBindings` additionally requires `network`; a binding name is not a URL, credential or socket path. Shared adapter hosts may use only the low-risk set enforced by the SDK validator.

Capability revocation cancels or closes dependent jobs, sessions, credentials and bindings. A reduced installation grant takes effect without changing the package; expanding a grant requires a reviewed Manifest and administrator action.

See [Manifest](./manifest.md), [Lifecycle](./lifecycle.md) and the [API reference](./api.md).
