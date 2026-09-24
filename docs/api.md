# Core API Reference

This is the public v0 HTTP surface for operators and SDK integrations. Every `/api/*` route is served by the Core gateway. Unless marked public, it requires an authenticated session and is evaluated in the current organization and user scope. Plugin workers should use SDK logical capabilities instead of calling these routes directly.

## Public deployment probes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health/live` | Process liveness. |
| `GET` | `/health/ready` | Database and startup readiness; returns `503` before initialization. |
| `GET` | `/health/diagnostic` | Redacted aggregate component and plugin status. |
| `GET` | `/api/bootstrap` | Reports whether first-run initialization is required. |

These responses do not contain host paths, credentials, upstream URLs or user content.

## Authentication and scope

Bootstrap is a one-time administrator action. Login and logout use Core-managed session cookies. `GET /api/me` returns the current user and platform context; `PATCH /api/me/preferences` updates validated locale, time zone, theme and density preferences that are propagated to plugins through the SDK context. Administrators can manage users, TOTP, credentials, plugin installations, service bindings, components and media sources.

Authenticated users can change their password with `POST /api/auth/password` by providing `currentPassword` and a new password of at least 12 characters. Core keeps the current session and revokes the user's other sessions.

All list and mutation routes enforce the current organization, user and installation scope. A successful HTTP status does not grant a plugin additional capability; Core rechecks the installed Manifest on every logical operation.

## User-facing routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/apps` | List the user's available app entries. |
| `GET` | `/api/history` | Query scoped history with keyword, category and pagination filters. |
| `DELETE` | `/api/history` | Clear scoped history after validated confirmation. |
| `GET` | `/api/catalog` | Query scoped searchable entries. |
| `GET` | `/api/notifications` | List scoped notifications. |
| `POST` | `/api/notifications/:id/read` | Mark one notification read. |
| `POST` | `/api/notifications/read-all` | Mark all visible notifications read. |
| `GET` | `/api/diagnostics/speed/download` | Bounded authenticated download measurement. |
| `POST` | `/api/diagnostics/speed/upload` | Bounded authenticated upload measurement; body is not persisted. |

## Administration routes

Administrators use the management UI for these operations. The API validates sizes, methods, capabilities and resource boundaries before acting:

- `/api/users`, `/api/users/:id/revoke`
- `/api/components`, `/api/components/catalog`, `/api/components/install`, `/api/components/:id/health`
- `/api/components/:id/versions`, `/api/components/:id/versions/:version/health`, `/api/components/:id/versions/:version/activate`
- `/api/media-roots`, `/api/media-sources` and their revoke/health routes
- `/api/plugins`, `/api/plugins/packages/install`, `/api/plugins/:id/upgrade`, plugin enable/disable/uninstall, scoped data export/delete
- `POST /api/plugins/:id/health` probes the installation-scoped fixed `/health` route declared by the plugin. It returns only health and HTTP status, never the response body; installations without that route return `409`.
- `/api/service-bindings` and binding health
- `/api/credentials` and credential revoke
- `/api/jobs` and `/api/browser/sessions`/`tasks` administration

Credential creation never returns plaintext again. Browser diagnostics return logical target/session/task metadata only; they never return Cookie, Profile, CDP, password, token, arbitrary URL or host path data.

Component version listing returns managed version metadata and an `active` marker. A version health check revalidates the managed executable digest without exposing its path. Activation is accepted only for an installed version whose latest health state is `healthy`; Core then switches the active version while preserving the previous version for rollback operations.

Entry keys use `POST /api/keys` to create a hashed, user-owned opaque entry URL, `GET /api/keys` to list the current administrator's keys, and `POST /api/keys/:id/revoke` to revoke one. `expiresAt`, when supplied, must be a future canonical ISO-8601 UTC timestamp. Cross-user and repeated revocation are hidden as `404`; a key does not expand the permissions of its owner.

`POST /api/plugins/:id/upgrade` accepts a signed plugin package for the same package ID and runtime. Core retains the installation ID and scoped data, intersects previous grants with the new manifest, and only activates a package whose signature, digest, entry and runtime compatibility checks pass. Upgrade first enters installation-level draining: new gateway requests receive a retryable `503`, while existing requests have up to five seconds to finish; a drain timeout cancels the upgrade and resumes traffic. When the new manifest declares `/health`, Core starts or reuses the Worker in the current administrator scope and invokes that fixed path through the Core-owned Broker; a failed probe restores the previous manifest, grants, and application metadata. Packages without a health route skip this probe and do not receive automatic rollback guarantees. This is not an arbitrary URL proxy.

## Plugin gateway routes

Installed plugin UI and gateway routes are exposed below `/apps/<plugin-id>/...` or through an operator-created `/k/<opaque-key>` entry. Core checks the signed Manifest route and method contract, user scope, installation status and granted capabilities before forwarding. Unknown methods return `405` with the declared `Allow` header; undeclared paths return `404`.

## Errors and compatibility

Clients must treat status codes and SDK error identifiers as the contract. Do not parse internal exception text. `401` means authentication is missing or expired, `403` means the current identity lacks authorization, `404` hides absent or out-of-scope resources, `409` indicates a state conflict, `413` indicates a size limit, and `429` indicates a rate or resource limit. Successful streaming responses still use Core-owned opaque playback/session references rather than filesystem paths.

For plugin code, start with the [Manifest reference](./manifest.md), [plugin contract](./plugin-contract.md) and SDK versioned contracts. This page does not promise undocumented routes, direct database access, public relay bandwidth or third-party upstream compatibility.
