# Deployment Configuration

Status: v0 Draft

Core accepts explicit deployment metadata from `config/core.json` or `--config <path>`. Copy `config/core.example.json` and validate it with `config/core.schema.json`.

## Supported fields

| Field | Meaning |
|---|---|
| `dataDir` | Managed Core state directory. Relative paths are resolved from the working directory. |
| `host` | Core listen host. |
| `port` | Core listen port from 1 to 65535. |
| `publicUrl` | Credential-free HTTP or HTTPS origin used for the displayed public address. |
| `cookieSecure` | Explicitly require or disable Secure cookies. HTTPS enables it by default when omitted. |

Command-line options override file values. Unknown fields, invalid values, duplicate `--config`, and a missing explicitly named file stop startup. Core does not read `PATH`, `PG*`, or other implicit environment variables for deployment configuration.

## Keep secrets out

Do not put passwords, cookies, tokens, database DSNs, browser profile data, or plugin credentials in this file. Keep them in the Core-managed data and credential boundaries. A Docker image contains only the checked-in catalog, schemas, and example configuration; provide instance configuration explicitly at runtime or through a controlled mount.

The configuration contract is not yet an installer contract. Native installers, real Docker execution, NAS validation, upgrades, and rollback remain separate release gates.
