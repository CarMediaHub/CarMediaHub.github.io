# Configuration Reference

Core accepts explicit deployment metadata from a JSON file or command-line arguments. The configuration is intentionally small and non-secret so the same contract can be used by Native, Docker and future installers.

## Fields

| Field | Rule |
| --- | --- |
| `dataDir` | Managed Core state directory. Relative paths resolve from the installed bundle root, not the process working directory. |
| `host` | Non-empty listen host without whitespace. |
| `port` | Integer from `1` to `65535`. |
| `publicUrl` | Credential-free HTTP/HTTPS origin without path, query or fragment. |
| `cookieSecure` | Explicit Secure-cookie policy; HTTPS enables it by default when omitted. |

Unknown fields, invalid values, duplicate `--config` options and missing explicitly named files stop startup. Command-line values override file values. Core does not discover deployment settings from `PATH`, `PG*` or other implicit environment variables.

## Examples

```json
{
  "dataDir": "./data",
  "host": "127.0.0.1",
  "port": 8787,
  "publicUrl": "https://hub.example.com",
  "cookieSecure": true
}
```

Validate with the checked-in `config/core.schema.json`. For a browser bridge, the deployment-owned data directory may also contain `browser-targets.json`; it accepts only logical IDs and HTTPS origins and never stores credentials or profile paths.

## Deployment modes

- **Native**: pass `--config <path>` or use `config/core.json`; relative paths are resolved from the installed bundle root, so service managers do not need to set a working directory. The release bundle carries runtime dependencies and schemas, while instance data stays outside the bundle.
- **Docker**: the image contains the Core runtime, checked-in catalogs, schemas and example files. Mount the data volume and provide instance configuration explicitly. The default Compose file binds the Core port to loopback and uses SQLite.
- **NAS/Linux**: use the same explicit file and data-directory contract; service registration, ACLs, upgrades and rollback remain deployment gates until the target is tested.

Never place passwords, TOTP secrets, cookies, tokens, database DSNs, browser profiles or plugin credentials in configuration. Use Core-managed credentials and data APIs. See [Native deployment](./operator-native.md), [API reference](./api.md) and [Backup and recovery](./operator-backup.md).
