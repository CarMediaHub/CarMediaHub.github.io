# Docker Deployment

Status: v0 Draft

Docker deployment keeps Core Gateway as the only public entry. Core, its private runtime channels, and optional managed services must stay on an internal network; do not publish database, Worker, plugin, or debugging ports.

## Current contract

Use an explicit JSON configuration file and a dedicated persistent data directory. Mount only the directories declared by the deployment contract. The Core image does not discover `.env`, `PATH`, `PG*`, host browser profiles, or arbitrary host paths. Credentials belong in the deployment secret mechanism and are never passed to plugins as raw database connections.

The repository CI builds the hardened image and checks `/health/live` and `/health/ready` in a Linux container. The local source tree does not promise that every host has Docker installed. Before a deployment is exposed, verify image provenance, persistent storage permissions, HTTPS termination, backup/restore, and the resource limits appropriate for media work.

## Network and upgrades

Publish only the configured Gateway port through the reverse proxy. Keep PostgreSQL, service bindings, Worker IPC, and managed component ports private. Stop or drain the deployment before an offline SQLite snapshot; validate the snapshot before restoring to an empty data directory. Component updates are staged, health-checked, and activatable; failed health checks must leave the active version unchanged.

## Not a release promise yet

Clean-machine Docker installation, production Compose defaults, real AList/rclone/FFmpeg/Mihomo images, online backup, cross-host recovery, and a full Docker upgrade/rollback exercise remain release gates. CI evidence is not a substitute for those operator rehearsals.
