# Security Model

Status: v0 Draft

CarMediaHub uses a capability-first model. A plugin receives only the minimum, scoped handles approved for its installation. The Core verifies identity, policy, target, scope, resource limits, cancellation, and audit state at each protected boundary.

## Defaults

- No public plugin host ports.
- No raw database connection strings or administrator credentials.
- No unrestricted filesystem, shell, network, or browser profile access.
- No implicit sharing of configuration, data, caches, secrets, logs, tasks, or browser state between plugins.
- No requirement for a hosted account, relay, or central service to run an installed deployment.

## Web response security

The Core entry point sets response headers that disable content-type sniffing, restrict referrers and browser capabilities, and prevent framing. Core-owned pages and APIs also use a same-origin Content Security Policy. Plugin `/apps/*` content keeps its plugin-controlled resource policy rather than being forcibly rewritten by Core.

## Managed Components

Managed component binaries are staged inside the deployment rather than discovered from the host PATH. Installation requires a release record signed by an operator-trusted Ed25519 key; the record binds the component, version, platform, artifact identity, and SHA-256 digest. A staged file is rejected when any of those values or the signature do not match. Download sources, key rotation, health checks, and rollback remain deployment operations rather than plugin capabilities.

When Core starts a managed component, it rechecks the recorded SHA-256 digest and runs the verified absolute file with `shell:false`. Component arguments, execution time, cancellation, and combined stdout/stderr are bounded. Plugins cannot choose a command, executable path, environment variable, or arbitrary component arguments.

## Managed Media Roots

An administrator explicitly selects each media root. Core encrypts the selected path in its deployment data, checks the directory and file type at access time, ignores symbolic links, and exposes only root IDs and opaque media IDs through its APIs. Plugins do not receive a host path. Controlled recursive indexing, short-lived playback sessions, Range reads, Core-owned remux/transcode jobs, and short-lived scoped transform-output reads are available; expired outputs are cleaned at Core startup. Permanent result URLs, thumbnails, HLS, and cache recovery across restarts are not yet available.

## Plugin Releases

Installing an isolated Worker requires an operator-trusted Ed25519-signed package release record. The signature binds the manifest, signer identity, staged artifact identity, and canonical directory digest. Core installs only the matching staged directory, rejects links and unsafe entries, and stores only a relative verified package location for restart recovery. Package verification remains separate from capability grants and Worker startup; media Range and bounded Core-owned remux/transcode execution are available, while result publication, HLS, upgrades, and rollback are not yet provided.

## Operator responsibilities

Operators control access to the management interface, user accounts, devices, public entry, network path, storage, backups, and plugin grants. Any optional external service must state what leaves the operator-controlled infrastructure and why.

## Reporting

Security reports should contain a minimal reproduction, affected version, and impact description. Do not include passwords, recovery codes, private keys, session data, browser profiles, complete request logs, personal media, or confidential URLs.
