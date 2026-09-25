# Plugin Manifest

The manifest is a signed plugin package's declared contract. Core validates it before installation and uses it to build the capability, route, runtime and resource boundary. A manifest does not grant shell access, arbitrary URLs, database connections, host paths, browser profiles or environment variables.

## Minimal isolated-worker example

```json
{
  "id": "example-plugin",
  "version": "0.1.0",
  "sdk": "^0.1.0",
  "name": { "en": "Example", "zh-CN": "示例", "ko": "예제" },
  "description": { "en": "A bounded example.", "zh-CN": "一个受限示例。", "ko": "제한된 예제입니다." },
  "category": "official",
  "runtime": "isolated-worker",
  "capabilities": ["config", "events"],
  "routes": [{ "path": "/", "methods": ["GET"] }],
  "worker": { "entry": "./worker.js", "protocol": "0.1" }
}
```

## Required fields

| Field | Rule |
| --- | --- |
| `id` | Lowercase package identifier, 3-64 characters. |
| `version` | Semver. Publishing a changed package requires a new version. |
| `sdk` | SDK version range supported by the package. |
| `name`, `description` | Non-empty `en`, `zh-CN` and `ko` strings. The host locale is authoritative. |
| `runtime` | `isolated-worker`, `shared-adapter-host` or `wasm-module`. |
| `capabilities` | Explicit SDK capabilities only. Unknown values are rejected. |
| `routes` | Relative logical routes and their allowed HTTP methods. |

The v0 route method allowlist is `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` and `PROPFIND`. `PROPFIND` is intended for bounded read-only WebDAV directory inspection; adapters must keep paths relative and must not use it for recursive or write behavior. Core only follows same-origin redirects for `GET` and `HEAD`.

An `isolated-worker` declares `worker.entry` and protocol `0.1`. A `shared-adapter-host` declares `runtimeEntry`, must use category `core-companion`, and is restricted to low-risk capabilities (`config`, `display`, `diagnostics`, `events`, `gateway`). A WASM package uses a runtime entry and remains subject to the same scope and resource controls.

## Capabilities and bindings

Capabilities are requests, not direct handles:

- `db`, `history`, `catalog`, `storage`, `media`, `media-source` and `jobs` are bound to the organization, user and plugin installation.
- `display` exposes device and fullscreen intent, not a window or browser handle.
- `browser` uses opaque, Core-owned sessions and tasks; it does not expose Cookie, Profile or CDP data.
- `secrets` accepts only a Core-issued credential reference. Core injects plaintext at the controlled final hop and never returns it to the plugin.
- `network` is required by `serviceBindings` and is still restricted by the operator's binding policy.

`serviceBindings` contains named bindings such as `alist-web` or `mihomo-web`. It never contains a URL, credential, socket path or database DSN. Operators authorize a binding separately, and Core applies the binding to the installation scope.

## Validation and release

Validate the manifest with the SDK before packaging. Add contract tests for missing translations, denied capabilities, user isolation, cancellation, restart and route methods. Publish the manifest together with the worker/UI files, versioned SDK range, license, package digest and signature. Keep sensitive configuration in Core's credential and configuration APIs; never place it in the manifest or package.

The [developer quickstart](./developer-quickstart.md), [plugin contract](./plugin-contract.md) and Plugins catalog provide runnable examples.
