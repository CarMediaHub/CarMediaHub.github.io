# CarMediaHub Documentation

Public documentation for CarMediaHub users and plugin authors.

Language: English · [简体中文](readme_zh.md) · [한국어](readme_ko.md)

Status: v0 Draft

| Topic | Description |
|---|---|
| [Architecture](docs/architecture.md) | Core, gateway, runtime groups, identity, data, and deployment boundaries |
| [Plugin Contract](docs/plugin-contract.md) | Package, lifecycle, capability, and IPC contract boundaries |
| [Security Model](docs/security.md) | Capability-first defaults and operator responsibilities |
| [Project Origin](docs/project-origin.md) | Why the platform combines vehicle media, base services, and maintained adapters |
| [Project Goals](docs/project-goals.md) | User outcomes, platform goals, and non-goals |
| [Documentation Map](docs/documentation-map.md) | User, operator, developer, contributor, and reference paths |

## Development

```powershell
pnpm install
pnpm verify
pnpm build
pnpm dev
```

`pnpm verify` runs the Astro check, the English/Chinese/Korean locale triplet check, and the static build.

The site is a static build. It reads the public Markdown pages at build time and does not require Core, a central account, a runtime database or a media relay.
