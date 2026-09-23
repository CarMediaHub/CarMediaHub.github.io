# Native Media Plugins

Status: v0 Draft

Native plugins implement a product workflow inside the CarMediaHub contract instead of mirroring an upstream website. WDR is the reference shape: it presents operator-controlled media to constrained vehicle browsers while Core owns storage, conversion, credentials, and playback security.

## Responsibilities

The plugin owns user-facing catalog metadata, navigation intent, playback requests, localized text, and scoped history. Core owns media roots, probing, Range/HLS sessions, FFmpeg jobs, output expiry, device context, authorization, and diagnostics.

The Worker receives opaque media identifiers and bounded capability responses. It never receives a host path, WebDAV URL, FFmpeg command, database connection, browser profile, or reusable public media URL.

## Vehicle-oriented behavior

A native media plugin should negotiate display and input capabilities, keep navigation and fullscreen actions available, and degrade clearly when a browser cannot play a format. Desktop configuration may remain richer than the vehicle view; the same Core user and locale context must flow into both.

## Package and data rules

Declare only the capabilities and routes used by the plugin. Persist history and plugin data through the scoped SDK data API. Use the inherited locale and platform context rather than creating a second global preference. Package-relative Workers, localized READMEs, migrations, SBOM, digest, and signature are required for staging.

The current WDR package is an SDK reference example, not a claim that every AList/rclone format, mobile browser, or vehicle model is production-compatible.

