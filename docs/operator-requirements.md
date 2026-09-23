# Operator Requirements

CarMediaHub does not hide infrastructure requirements behind a central relay. An operator is responsible for the network path, storage, upstream services and data retention policy.

## Required

- A supported Core runtime and writable data directory.
- A stable HTTPS domain that reaches the Core gateway.
- Backups stored outside the active data directory.
- An administrator account with a recovery procedure.

## Recommended

- Put the gateway behind a firewall and expose only HTTPS.
- Use a separate service account for each managed component.
- Reserve bandwidth for media transforms and set resource limits for plugins.
- Monitor liveness, readiness, disk space and component health.
- Test restore on a clean directory before treating a backup as usable.

## Responsibility boundary

Core can enforce identity, scope, capability and network policies, but it cannot make an incorrectly configured reverse proxy, certificate, upstream account or storage provider reliable. Record the deployment target and component versions with every incident report.
