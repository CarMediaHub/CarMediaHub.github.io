# Core API 参考

这是面向运营者和 SDK 集成的 v0 HTTP 公共边界。所有 `/api/*` 路由都由 Core 网关提供。除明确标记为公开的路由外，其余都需要认证会话，并在当前组织和用户作用域内执行。插件 Worker 应使用 SDK 的逻辑能力，不应直接调用这些 HTTP 路由。

## 公开部署探针

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/health/live` | 进程存活。 |
| `GET` | `/health/ready` | 数据库和启动状态；初始化前返回 `503`。 |
| `GET` | `/health/diagnostic` | 脱敏的组件和插件聚合状态。 |
| `GET` | `/api/bootstrap` | 报告是否需要首次初始化。 |

这些响应不包含宿主路径、凭据、上游 URL 或用户内容。

## 认证与作用域

Bootstrap 是一次性的管理员操作。登录和退出使用 Core 管理的会话 Cookie。`GET /api/me` 返回当前用户和平台上下文；`PATCH /api/me/preferences` 更新经过校验的语言、时区、主题和密度偏好，偏好会通过 SDK 上下文传递给插件。管理员可以管理用户、TOTP、凭据、插件安装、服务绑定、组件和媒体源。

所有列表和变更路由都强制当前组织、用户和插件安装实例作用域。HTTP 成功状态不会授予插件额外能力；Core 会在每次逻辑操作时重新校验已安装 Manifest。

## 用户路由

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/api/apps` | 列出当前用户可用的应用入口。 |
| `GET` | `/api/history` | 按关键词、分类和分页查询作用域历史。 |
| `DELETE` | `/api/history` | 经过确认后清理作用域历史。 |
| `GET` | `/api/catalog` | 查询作用域目录条目。 |
| `GET` | `/api/notifications` | 列出作用域通知。 |
| `POST` | `/api/notifications/:id/read` | 标记单条通知已读。 |
| `POST` | `/api/notifications/read-all` | 标记所有可见通知已读。 |
| `GET` | `/api/diagnostics/speed/download` | 有界的认证下载测速。 |
| `POST` | `/api/diagnostics/speed/upload` | 有界的认证上传测速，不持久化正文。 |

## 管理路由

管理员通过管理端使用这些操作。API 在执行前校验大小、方法、能力和资源边界：

- `/api/users`、`/api/users/:id/revoke`
- `/api/components`、`/api/components/catalog`、`/api/components/install`、`/api/components/:id/health`
- `/api/media-roots`、`/api/media-sources` 及撤销/健康检查路由
- `/api/plugins`、`/api/plugins/packages/install`、`/api/plugins/:id/upgrade`，以及插件启用、停用、卸载、作用域数据导出/删除
- `POST /api/plugins/:id/health`：按安装实例作用域探测插件声明的固定 `/health` 路由，只返回健康状态和 HTTP 状态，不返回响应正文；未声明该路由时返回 `409`。
- `/api/service-bindings` 及绑定健康检查
- `/api/credentials` 及凭据撤销
- `/api/jobs` 和 `/api/browser/sessions`/`tasks` 管理接口

凭据创建后不再返回明文。浏览器诊断只返回逻辑 target、会话和任务元数据，绝不返回 Cookie、Profile、CDP、密码、Token、任意 URL 或宿主路径。

`POST /api/plugins/:id/upgrade` 接受相同 package ID 和 runtime 的签名插件包。Core 保留安装 ID 和作用域数据，新授权取旧授权与新 Manifest 声明的交集，并且只有通过签名、摘要、入口和运行时兼容校验的包才可激活。升级先进入安装实例级排空：新网关请求会收到可重试的 `503`，已有请求最多等待 5 秒；排空超时则取消升级并恢复接收流量。新版声明 `/health` 时，Core 会在当前管理员作用域启动/复用 Worker 并通过 Core-owned Broker 调用固定路径；探测失败会恢复旧 Manifest、授权和应用元数据。没有健康路由的插件不执行该探测，也不提供自动回滚保证；该机制不是任意 URL 代理。

## 插件网关路由

已安装插件的 UI 和网关路由位于 `/apps/<plugin-id>/...` 下，也可以通过运营者创建的 `/k/<opaque-key>` 入口访问。Core 转发前校验签名 Manifest 的路由和方法契约、用户作用域、安装状态和已授予能力。未声明路径返回 `404`；已声明但方法不允许时返回 `405` 和准确的 `Allow` 头。

## 错误与兼容性

客户端应把状态码和 SDK 错误标识作为契约，不要解析内部异常文本：`401` 表示缺少或过期认证，`403` 表示当前身份无权，`404` 隐藏不存在或越权资源，`409` 表示状态冲突，`413` 表示大小超限，`429` 表示速率或资源限制。成功的流式响应仍使用 Core 管理的不透明播放/会话引用，不返回文件系统路径。

插件开发请从 [Manifest 参考](./manifest_zh.md)、[插件契约](./plugin-contract_zh.md)和 SDK 版本化契约开始。本文不承诺未记录的路由、直接数据库访问、公共中继带宽或第三方上游兼容性。
