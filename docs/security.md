# Security Model

Status: v0 Draft

CarMediaHub uses a capability-first model. A plugin receives only the minimum, scoped handles approved for its installation. The Core verifies identity, policy, target, scope, resource limits, cancellation, and audit state at each protected boundary.

## Defaults

- No public plugin host ports.
- No raw database connection strings or administrator credentials.
- No unrestricted filesystem, shell, network, or browser profile access.
- No implicit sharing of configuration, data, caches, secrets, logs, tasks, or browser state between plugins.
- No requirement for a hosted account, relay, or central service to run an installed deployment.

## Operator responsibilities

Operators control access to the management interface, user accounts, devices, public entry, network path, storage, backups, and plugin grants. Any optional external service must state what leaves the operator-controlled infrastructure and why.

## Reporting

Security reports should contain a minimal reproduction, affected version, and impact description. Do not include passwords, recovery codes, private keys, session data, browser profiles, complete request logs, personal media, or confidential URLs.
