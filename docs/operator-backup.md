# Backup and Recovery

Status: v0 Draft

Core provides an offline snapshot flow for operator-managed state. Stop Core before creating a snapshot so SQLite and its WAL sidecars are stable.

## Create a snapshot

Run the command from the Core repository or deployment image:

```powershell
pnpm backup backup --data-dir .\data --output .\snapshots\cmh-01
```

The snapshot contains only explicit Core state: the SQLite database and sidecars, the deployment secret key, verified plugin packages, and managed component files. A manifest records each file size and SHA-256 digest.

The destination must be outside the data directory and must not already exist. Core writes a temporary directory and renames it only after all files and the manifest are complete.

## Schema compatibility before an upgrade

Stop Core and create a verified snapshot before changing the Core version or deployment bundle. SQLite records a schema version after compatible startup migrations finish. Core refuses to start when the database declares a version newer than the Core build understands, so an older build cannot silently open newer data. The current gate does not replace a complete migration ledger, rollback procedure, or cross-version upgrade rehearsal.

## Verify and restore

Restore is intentionally limited to a new directory:

```powershell
pnpm backup restore --snapshot .\snapshots\cmh-01 --data-dir .\restored-data
```

Before copying, Core verifies the manifest, the managed-path allowlist, every parent directory, file type, size, and digest. It rejects symlinks, path traversal, snapshot-internal targets, and any existing target directory. Start the restored deployment only after checking its configuration and credentials.

## Responsibilities and limits

- Store snapshots separately from the source data directory and protect them as sensitive credentials.
- A snapshot includes secrets needed to decrypt protected local state; it is not a public export.
- The current flow is offline and local. It does not upload data, create scheduled backups, or provide online hot backup.
- A snapshot is the required recovery point before a schema-changing upgrade; do not treat the schema version gate as an automatic rollback mechanism.
- Docker image builds, Native installers, cross-platform restore drills, retention policies, and upgrade rollback remain separate release gates.
