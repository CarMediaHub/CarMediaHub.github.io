# Using Media

CarMediaHub is designed for a split workflow: configure sources and playback policies from a desktop, then use a simpler entry from a phone or vehicle browser.

## Browse and play

Open the installed media plugin from the main panel. Browse folders or search the catalog, select a supported item, and start playback. The platform keeps the media source and credentials behind Core; the client receives a scoped playback response.

For vehicle browsers, prefer a direct range stream when the source format is already supported. When a file needs compatibility processing, the plugin can request a Core-owned remux or transcode job. The result is temporary and opaque. A vehicle browser does not receive FFmpeg commands, local paths or upstream credentials.

## Vehicle controls

Vehicle layouts should keep navigation, search, play/pause and the fullscreen action visible without requiring desktop-only controls. Fullscreen availability is a display capability, not a promise that every browser implements the same API. If a browser cannot provide fullscreen or a stream mode, the plugin should show a recoverable status and offer the next supported mode.

## History and diagnostics

The shared history service can record bounded playback and navigation entries. History is scoped to the current user and plugin installation and can be searched or cleared from the management surface. Diagnostics should show a stable reason such as an unavailable source, expired playback session or missing media mode, not an upstream password, path or internal endpoint.

## Current limits

Mobile and vehicle playback support depends on the browser's media implementation. HLS, remux and transcode support is capability-based; it is not a guarantee that every file or device will play. Test a representative file on the target vehicle before relying on a source for a trip.
