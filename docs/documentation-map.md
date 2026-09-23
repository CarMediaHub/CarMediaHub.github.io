# Documentation Map

Status: v0 Draft

`CarMediaHub.github.io` is the public window for the whole project. It serves different readers from one documentation system while keeping product promises, deployment boundaries, SDK contracts, and security rules consistent.

## Reader Paths

| Reader | Start here | Main questions |
|---|---|---|
| User | [Project Origin](project-origin.md) and [Project Goals](project-goals.md) | What is CarMediaHub, what can it do, and what do I need to operate it? |
| Operator | [Services and Bindings](operator-services.md), [Backup and Recovery](operator-backup.md), and deployment guides | How do I install, secure, connect, back up, update, and diagnose my deployment? |
| Plugin author | [Plugin Contract](plugin-contract.md), [Manifest](manifest.md), and [API](api.md) | How do I build, isolate, test, publish, and maintain a plugin? |
| Contributor | Governance and engineering references | How are changes reviewed, released, documented, and supported? |

## Planned Sections

The page-level inventory, owners, language status, and release gates are maintained in the governance repository; the public site grows from the Users, Operators, Developers, Reference, and Community sections below.

```text
Users
  Overview -> Project Origin -> Goals and Boundaries -> Installation -> First Run
  -> Everyday Use -> Media Playback -> Troubleshooting -> Privacy and Responsibility

Operators
  Requirements -> Docker -> [Native](operator-native.md) -> Network Entry -> [Services and Bindings](operator-services.md)
  -> [Configuration](operator-config.md) -> [Backup and Recovery](operator-backup.md) -> Upgrade -> Diagnostics
  -> Authentication -> Backup and Recovery -> Upgrade -> Diagnostics

Developers
  SDK Quickstart -> [Manifest](manifest.md) -> [Lifecycle](lifecycle.md) -> [Context and i18n](context-i18n.md) -> [Capabilities](capabilities.md)
  -> Data and Jobs -> UI -> Proxy Adapters -> Native Plugins
  -> Testing -> Packaging, Signing and Security Reports

Reference
  [API](api.md) -> [Errors and events](errors-events.md) -> [Configuration](configuration.md) -> [Compatibility Matrix](compatibility.md)
  -> Known Limitations -> Versioning and Migration
```

The public site explains supported behavior and user responsibilities. Private implementation notes, deployment secrets, internal paths, and unfinished product experiments remain outside this site.
