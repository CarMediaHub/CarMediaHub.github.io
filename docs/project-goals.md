# Project Goals

Status: v0 Draft

CarMediaHub aims to make operator-controlled media, internal services, and extensible adapters usable from browsers and in-vehicle displays without turning the project into a mandatory hosted relay.

## User outcomes

- Reach personal media from a constrained vehicle browser.
- Adapt storage and upstream services without exposing every internal port.
- Use one managed entry for authentication, history, tasks, and diagnostics.
- Install or build plugins that share platform context, locale, identity, and capability controls.
- Keep domains, servers, bandwidth, data, and upstream accounts under the operator's control.

## One Web Surface

CarMediaHub is one Web service rather than a collection of unrelated site pages. The panel can provide normal application navigation or an optional, revocable key entry for a selected application. The built-in management application appears alongside plugins in the panel, while advanced configuration remains an operator task.

The desktop browser is the primary place for installation, permissions, service connections, session imports, backups, and updates. Phones provide responsive browsing and lightweight settings. Vehicle displays prioritize simple navigation, search, playback, full-screen controls, and recovery-friendly status.

## Platform goals

The Core, Gateway, SDK, service bindings, and runtime isolation are the durable platform. WDR is an important native media plugin, while AList, rclone, FFmpeg, and similar components are managed base services or upstreams. Proxy adapters and native plugins may evolve independently behind the same SDK boundary.

## Non-goals

CarMediaHub is not a public unlimited-bandwidth proxy, a mandatory hosted account, a replacement for every upstream application, or a promise that any plugin is compatible with every website or device.
