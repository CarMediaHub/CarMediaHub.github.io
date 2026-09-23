# Developer Quickstart

Plugins are workers behind an SDK contract. A plugin should request platform capabilities through the SDK and should not reach Core's database, browser context, host filesystem or component process directly.

## Build order

1. Read the versioned SDK types and the plugin contract.
2. Declare a stable plugin id, version, runtime, capabilities and service bindings.
3. Use the supplied context for locale, identity scope, display, history, media, jobs and data access.
4. Keep plugin state in the scoped data API and provide a versioned migration.
5. Add contract tests for denied capabilities, user isolation, cancellation and restart.
6. Package and sign the plugin before publishing it to a catalog.

## Non-negotiable boundaries

- Never accept a raw upstream URL when a logical target or service binding is available.
- Never return cookies, browser profiles, CDP endpoints or host paths.
- Do not assume a particular database engine or operating-system environment variable.
- Treat locale and display preferences from the SDK as authoritative platform context.

Use the [plugin contract](./plugin-contract.md) and [architecture](./architecture.md) as the starting references.
