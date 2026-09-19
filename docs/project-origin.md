# Project Origin and Problem Context

Status: v0 Draft

CarMediaHub grew from a practical self-hosted media problem: personal files may live on a NAS, local disk, or a cloud drive, while an in-vehicle browser often has limited codec support, memory, CPU, networking, and playback APIs. A file-management page can expose the files, but direct playback is not always reliable on a constrained vehicle display.

The project therefore treats the vehicle as one important client, not as the platform itself. The platform provides a controlled entry point, service bindings, media processing, and plugins that can adapt a source to the capabilities of a browser or vehicle display.

## The Typical Media Path

```text
Cloud drive / NAS / local disk
        -> rclone WebDAV (when an upstream connector needs normalization)
        -> AList WebDAV or file service
        -> WDR or another media plugin
        -> slicing / remuxing / transcoding
        -> browser or in-vehicle display
```

rclone, AList, FFmpeg, 7z, databases, and an optional Mihomo/Clash service are platform-managed or operator-managed base services. They can run in Docker, on the host operating system, in WSL, or on another operator-controlled machine. They are not required to be modified. CarMediaHub connects to them through declared service bindings and exposes them through the gateway when the operator authorizes that route.

WDR is a self-implemented media presentation plugin. It may consume AList WebDAV, but it is not an AList extension and does not define the platform architecture. Its role is to scan and present media, choose a compatible delivery strategy, and use slicing or transcoding when direct playback is unsuitable.

## Two Plugin Families

### Native plugins

Native plugins implement a CarMediaHub-specific workflow. WDR is an example: it uses platform capabilities and bindings to turn operator-controlled media into a playback experience suited to constrained clients.

### Proxy and compatibility plugins

Proxy plugins connect an existing web service or website to the gateway without requiring source-code changes to that upstream project. They may need site-specific maintenance for authentication, redirects, cookies, WebSocket/SSE, resource paths, streaming, or anti-automation behavior.

Examples include compatibility layers for AList Web, Clash Web, or other operator-controlled internal services. A proxy plugin is not the upstream application itself; it is the maintained adapter that makes the upstream service usable through a logical CarMediaHub route.

Some adapters use an operator-authorized browser session or an explicitly configured network egress. The platform does not provide a universal proxy service, and users remain responsible for authorization, content rights, upstream terms, and local law.

## Why a Platform

The original implementation path explored remote browsers and remote desktops, but those approaches add interaction latency and consume resources in ways that are poorly suited to vehicle displays. A gateway and plugin model keeps the user interface close to the client while moving authentication, compatibility work, media processing, and resource control to the operator's own infrastructure.

CarMediaHub is intentionally broader than one media workflow. The long-term platform goal is to let users build or install their own adapters while sharing Core capabilities such as identity, locale and formatting, service bindings, secrets, storage, media jobs, history, routing, diagnostics, and runtime isolation.

## Responsibility Boundary

CarMediaHub supplies the framework, SDK contracts, gateway, and capability controls. Operators choose the services, domains, network paths, storage, and upstream accounts they connect. Plugin maintainers remain responsible for compatibility with their target service and for declaring the capabilities and data flows they require.
