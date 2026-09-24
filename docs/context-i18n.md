# Platform Context and Internationalization

Core creates one read-only context during the Broker handshake and sends updates when operator or user preferences change. Plugins must use this context instead of creating a second language, theme, device or fullscreen setting.

## Context fields

| Field | Meaning |
| --- | --- |
| `scope` | Deployment, organization, user, device, session and installation identities. Plugins use it for SDK calls; they do not forge or widen it. |
| `locale` | `en`, `zh-CN` or `ko`, resolved by Core with stable fallback. |
| `timeZone` | Validated IANA time zone for formatting and display. |
| `theme` | `light`, `dark` or `system`. |
| `density` | `comfortable` or `compact`. |
| `entry` | Whether the user entered through navigation or an opaque key. |
| `display` | Device class, input methods, viewport and fullscreen availability. |
| `grantedCapabilities` | Effective installation grants, when supplied by the Broker. Treat as read-only. |
| `policyVersion` | Monotonic policy/context version for cache invalidation. |

## Locale and messages

Manifest names and descriptions provide all three required locales. Runtime UI messages should use the SDK locale and a stable message-key catalog. Core resolves aliases such as `zh` to `zh-CN` and `ko-KR` to `ko`, then falls back to English. A plugin must not ask users to configure a separate locale for the same platform preference.

## Context changes

Register `onContextChanged` and update rendered UI, date/time formatting and display decisions when a new context arrives. The method supports multiple subscribers and returns a disposer; call it when a view or plugin-owned subscription is released. Subscriber exceptions are isolated from the Broker transport. Do not cache identity, grants or locale forever. A context change does not grant new capabilities; each operation is still authorized by Core. Core and the SDK accept an update only when its complete scope and installation metadata still match the authenticated Worker.

## Display and vehicle behavior

Use `display.capabilities()` to select a layout and `display.requestMode("fullscreen")` to express intent. The result may be `accepted`, `unsupported` or `user-action-required`. Vehicle support is a UI/package declaration, not permission to access a browser window, native screen or remote-control API.

See [Capabilities](./capabilities.md), [Manifest](./manifest.md) and the SDK types for the versioned contract.
