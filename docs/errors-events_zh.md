# 错误与事件

SDK 错误和领域事件是版本化数据契约。客户端应根据稳定的 `code` 分支，不要解析异常文本、URL 或宿主细节。所有 SDK 能力调用收到 Core 错误时都会保留这个 envelope，并转换为 `CmhError`；数据、任务、媒体、浏览器、历史、目录、通知和网络调用均遵循同一规则。

## 错误 envelope

```json
{
  "code": "CMH.JOBS.QUEUE_FULL",
  "messageKey": "errors.jobs.queueFull",
  "retryable": true,
  "diagnosticId": "diag_jobs_queue_full",
  "details": { "limit": 10 }
}
```

- `code` 是稳定的机器标识。
- `messageKey` 是文案 key，应按当前平台语言解析。
- `retryable` 是 Core 的策略提示，不代表可以无限重试。
- `diagnosticId` 可以安全放入运营者报告。
- `details` 只包含有界且非敏感值，也可能不存在。

只有 `retryable` 为 `true` 时才重试，并使用有界退避；用户取消、截止时间到期或安装实例撤销时必须停止。不要记录原始请求正文、凭据、Cookie、Profile、路径或上游响应体。

v0 目录覆盖作用域、能力、分页、协议、任务、媒体、网络、存储、浏览器和目录错误，例如 `CMH.DB.SCOPE_DENIED`、`CMH.CAPABILITY.DENIED`、`CMH.PROTOCOL.DEADLINE_EXCEEDED`、`CMH.JOBS.INTERRUPTED`、`CMH.MEDIA.QUOTA_EXCEEDED` 和 `CMH.BROWSER.GRANT_REQUIRED`。未知 code 应显示通用本地化错误，并带上 `diagnosticId`。

网络错误使用以下稳定语义：

| Code | 重试策略 | 含义 |
| --- | --- | --- |
| `CMH.NETWORK.TARGET_DENIED` | 不重试 | 请求路径超出服务绑定策略，或绑定当前不可用。 |
| `CMH.NETWORK.QUOTA_EXCEEDED` | 有界退避后重试 | 组织/用户/安装实例/绑定作用域的并发配额当前已满。 |
| `CMH.NETWORK.RESPONSE_TOO_LARGE` | 不重试 | 上游响应超过 Core 的有界响应限制。 |

插件不得把这些错误转换为上游 URL、请求头、Cookie 或响应体写入日志。

## 事件 envelope

```json
{
  "eventId": "opaque-id",
  "occurredAt": "2026-09-24T00:00:00.000Z",
  "scope": { "deploymentId": "...", "organizationId": "...", "userId": "...", "installationId": "..." },
  "producer": "wdr-media",
  "schemaVersion": 1,
  "type": "media.ready",
  "payload": { "subject": "opaque-reference" }
}
```

事件限制在当前组织、用户和安装实例作用域。载荷必须有界，不能包含凭据、宿主路径、任意上游 URL 或原始媒体内容。事件只用于通知；持久状态应通过有作用域的数据 API 幂等保存，并容忍重复或延迟通知。上下文或能力撤销后，之前看到的引用可能立即不可用。

请结合 [API 参考](./api_zh.md)、[能力目录](./capabilities_zh.md)和 SDK `errors.json` 阅读版本化目录。
