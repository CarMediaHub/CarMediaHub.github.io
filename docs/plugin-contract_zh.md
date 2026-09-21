# 插件契约

状态：v0 草案

插件包声明身份、发布者、SDK 兼容范围、运行时要求、路由、能力、资源和数据生命周期。清单是授权请求，不是自动获得权限。

## 生命周期

```text
discovered -> verified -> grant pending -> configured -> prepared
-> starting -> ready -> active -> draining -> stopped
                              \-> failed -> quarantined
```

停止、卸载和删除插件数据是独立动作。失败或隔离的插件不获得路由和 capability 调用。

## 能力模型

SDK 提供受作用域限制的配置、私有数据、存储、媒体、任务、历史、分类、显示、事件、诊断、网关路由、网络、浏览器会话和受管控传输能力。敏感能力在明确声明、批准和授予前保持禁用。

`jobs` 能力始终限制在当前用户和插件安装实例作用域内。初始配额为每个作用域最多 10 个活跃任务，JSON payload 和结果各限制 64 KiB。超出限制时返回稳定错误码 `CMH.JOBS.QUEUE_FULL`、`CMH.JOBS.PAYLOAD_TOO_LARGE` 或 `CMH.JOBS.RESULT_TOO_LARGE`；调用方应使用错误目录中的 message key，不应硬编码面向用户的文案。

`history` 能力通过同一作用域 Worker 契约提供 `record`、`query` 和 `clear`。Core 只持久化必要的主题、路由、标题、分类、设备和时间字段；插件不能选择其他用户或安装实例，也不会获得数据库连接。

`catalog` 能力通过 `register`、`query` 和 `remove` 提供可搜索的插件目录项。Core 在筛选前执行作用域和授权检查；插件只能提交元数据和路由，不能执行 SQL 或获取不受限的索引查询。

`display` 能力提供只读显示能力和 `normal`/`fullscreen` 的 `requestMode` 意图。设备不支持时 Core 可以拒绝全屏；插件不会获得浏览器窗口控制权。

通知能力通过平台事件能力提供。插件可以发布受长度限制的 `info`、`success`、`warning` 或 `error` 通知，也可以在当前用户和安装实例作用域内查询或标记已读。Core 负责持久化和面向用户的展示；插件不能向其他用户或安装实例发送或读取通知。

`media` 能力可以为不透明媒体 ID 创建短期播放会话。后续媒体读取必须携带该会话；Core 将会话绑定到用户、设备、安装实例和过期时间，并在用户会话或插件安装实例撤销时失效。插件不会获得宿主路径或可长期复用的公网媒体 URL。

媒体探测通过 `media.probe` 返回受控元数据、是否可寻址以及结构化播放模式：`direct-range`、`remux`、`transcode`。当前 Core 仅提供 `direct-range`；后两种模式需要未来由 Core 管理的任务执行器实现，不授予插件调用 FFmpeg、访问宿主路径或执行任意命令的权限。

Worker 通过版本化本地 IPC 契约与 Core 通信。公开契约定义生命周期、上下文、能力、事件、健康、诊断、取消和错误标识。大媒体和文件使用受控流句柄，而不是消息 payload。

## 私有数据 API

`db` 授予的是受限的逻辑数据空间，不是数据库连接。每次读写都由 Core 绑定到当前组织、用户和插件安装实例。插件不能选择其他用户、指定 schema、获得 DSN，也不能执行任意 SQL。无论 Core 使用 SQLite、PostgreSQL 或运营者管理的兼容数据库，SDK 语义保持一致。

WDR Media 使用该 API 保存播放记录。存储根目录、媒体转换和服务绑定仍由 Core 能力管理，因此插件不获得宿主路径、上游 Cookie 或服务凭据。

## 适配器发布

插件目录区分原生媒体应用、本地服务桥接、上游适配器、浏览器桥接和社区包。目录条目不等于运行代码的批准。需要浏览器身份、外部网络、媒体提取或高风险上游的包，必须使用隔离运行时，经过明确的能力审查，并在公开分发前具备专门的泄露与回滚测试。

## 包要求

插件包包含清单、执行入口、可选 UI 资源、迁移、国际化资源、SBOM、校验和和签名。它不得包含用户凭据、浏览器 Profile 数据、宿主特定配置、运行日志或未经校验的可执行下载。

机器可验证的 v0 清单和错误目录维护在 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) 仓库。
