# Proxy Adapters

Status: v0 Draft

A proxy adapter is a compatibility boundary for an operator-authorized upstream site or protocol. It is not permission to publish a general-purpose proxy. The upstream page, scripts, redirects, cookies, media hosts, and telemetry are treated as untrusted input.

## Required boundaries

- Use an isolated Worker and a declared, minimal host or service binding.
- Accept only relative paths and declared methods; Core owns redirect and response limits.
- Keep cookies and authorization in Core credential references. Never return plaintext credentials to a Worker or client.
- Rewrite or remove external navigation, runtime resource URLs, telemetry, hotlink checks, and media hosts that would bypass the CarMediaHub route.
- Add site-specific leakage and rollback tests before any public distribution.

The adapter must not expose proxy tokens, panel domains, local addresses, browser profiles, CDP endpoints, or arbitrary upstream URLs. A page that works while the browser makes direct external requests has failed the contract.

## Publication policy

The public catalog currently contains neutral adapter examples and local-service bridges. `proxy-compat-contract-example` is the reference for relative-path validation, request/response header filtering, redirect suppression, and response-size limits; it does not name or connect to a real website. Reference integration keys such as BBC, YouTube, Jable, and Pornhub remain non-public review metadata until authorization, leakage, compatibility, and maintenance review is complete. Entries that do not pass those reviews are not copied into the public collection.

## Safer alternatives

Prefer a Core service binding for operator-managed AList, rclone, or Mihomo services. Prefer a self-authored media plugin when the goal is controlled playback. Use the browser-session contract only for opaque, bounded sessions; it does not expose cookies, profiles, arbitrary navigation, or script execution.
