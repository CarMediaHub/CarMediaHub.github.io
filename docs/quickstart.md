# User Quickstart

CarMediaHub is self-hosted. You provide the domain, server, storage and upstream accounts; Core provides one authenticated web surface for media and installed services.

## Before you begin

- Choose a supported deployment target and a dedicated data directory.
- Prepare a domain and HTTPS certificate. Browser features only accept registered HTTPS origins.
- Decide which users, media roots and plugins should be enabled.

## First run

1. Install Core using the release instructions for your target.
2. Complete the initialization flow and create the first administrator.
3. Sign in to the management application and confirm locale, time zone, security and backup settings.
4. Install only the plugins and managed components that you need.
5. Add a media root or a remote source, then verify a small file before testing a large stream.
6. Open the same entry from a desktop browser and the vehicle browser. Vehicle playback uses the media capability and may select HLS or a remuxed stream.

## Safety boundary

Do not paste cookies, browser profiles, private keys or upstream passwords into plugin configuration unless the plugin documentation explicitly describes a protected credential flow. Keep Core, plugins and component packages updated, and create a verified backup before upgrades.

See [project goals](./project-goals.md), [operator configuration](./operator-config.md) and [security](./security.md) for the operating model.
