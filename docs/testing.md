# Testing and Verification

Status: v0 Draft

CarMediaHub treats tests as contract evidence. A green unit test does not prove a deployment, browser, upstream site, or vehicle is supported unless the matching environment is exercised.

## Required layers

1. SDK contract tests cover manifest validation, locale fallback, context propagation, wire method allowlists, scope isolation, bounded payloads, cancellation, and the mock runtime.
2. Core tests cover identity, permissions, persistence, plugin lifecycle, gateway filtering, service bindings, media ranges, jobs, browser task boundaries, backup integrity, and explicit configuration.
3. Plugins run package contract tests, type checks, builds, catalog validation, and isolated Worker integration tests. A fixture is not a real browser or upstream-site test.
4. Deployment gates validate the checked-in Docker and Native specifications without claiming that a local machine performed service registration.

## Release evidence

Record the commit, package versions, platform, configuration mode, component digests, test commands, result counts, and known limitations. Failure-path tests are required for scope denial, revocation, cancellation, timeout, rollback, leakage, and recovery. Browser tests must run muted and must not use a host profile, arbitrary URL, CDP endpoint, or implicit environment variable.

The current repository evidence covers SDK/Core/Plugins contract layers, a real muted Chrome Browser Worker smoke for one allowlisted Origin, and static deployment gates. Real Windows service registration, Docker/NAS installation, signed component distribution, broader Browser Worker redirect/WebSocket/Worker coverage, and desktop/mobile/vehicle playback remain separate release gates.
