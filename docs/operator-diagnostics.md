# Diagnostics

Use the management surface to determine whether a failure belongs to Core, a plugin, a managed component, an upstream binding or the client browser. Start with the least invasive check and keep the deployment version with every report.

## Health checks

- **Liveness** means the Core process can answer.
- **Readiness** means the database and required startup state are available.
- **Component health** reports whether a registered managed component passed its checksum and health check.
- **Plugin status** reports a bounded state and retry count; it does not expose worker command lines or host paths.

A healthy Core does not imply that an upstream storage service, network binding or vehicle browser can play every file.

## Browser bridge checks

Administrators can review registered logical browser targets and normalized HTTPS origins. A browser task should be checked in this order: session active, plugin capability granted, target registered, healthy browser component available, then task result or cancellation state. Expired sessions and results are not reusable.

## Media checks

Check the media source, playback session and available mode before retrying a stream. `direct-range`, remux and transcode are separate capabilities. A missing mode is a compatibility result, not permission to bypass Core with a local command or arbitrary URL.

## Reports and privacy

Include Core/plugin/component versions, the stable diagnostic code, deployment target and a timestamp. Remove cookies, tokens, credentials, browser profile data, absolute paths, upstream URLs and media filenames that identify private content. Do not attach a browser profile or an unrestricted debug archive.
