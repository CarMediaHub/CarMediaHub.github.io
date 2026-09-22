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

管理员停用插件会移除入口、停止 Worker 并撤销相关播放会话；重新启用只恢复入口和按需启动条件，不会自动启动 Worker，也不会重置已授予的能力或插件数据。

## 能力模型

SDK 提供受作用域限制的配置、私有数据、存储、媒体、任务、历史、分类、显示、事件、诊断、网关路由、网络、浏览器会话和受管控传输能力。敏感能力在明确声明、批准和授予前保持禁用。

插件文案应使用 SDK 的 `normalizeLocale`、`localeFallbacks` 和 `localize`。这些函数统一处理 `zh`/`zh-CN`、`ko-KR`/`ko` 别名，并按“请求语言 -> 语言族 -> 英文”顺序回退。插件继承 Core 的语言设置，不得另建平台级语言偏好。

Worker 握手后的只读上下文可以包含 `grantedCapabilities`，用于界面和功能自适应。它表示当前安装实例的有效授权，但不是授权来源；Core 仍会在每次调用时重新检查最新授权。旧版本 Broker 可以省略该字段。

`jobs` 能力始终限制在当前用户和插件安装实例作用域内。初始配额为每个作用域最多 10 个活跃任务，JSON payload 和结果各限制 64 KiB。超出限制时返回稳定错误码 `CMH.JOBS.QUEUE_FULL`、`CMH.JOBS.PAYLOAD_TOO_LARGE` 或 `CMH.JOBS.RESULT_TOO_LARGE`；调用方应使用错误目录中的 message key，不应硬编码面向用户的文案。

`history` 能力通过同一作用域 Worker 契约提供 `record`、`query` 和 `clear`。Core 只持久化必要的主题、路由、标题、分类、设备和时间字段；插件不能选择其他用户或安装实例，也不会获得数据库连接。

历史和目录查询支持受限的 `limit`、`offset` 分页。Core 会先执行关键词和分类筛选，再进行分页；面向管理端的查询同时返回总数。非法分页参数返回 `CMH.PAGINATION.INVALID`。

`catalog` 能力通过 `register`、`query` 和 `remove` 提供可搜索的插件目录项。Core 在筛选前执行作用域和授权检查；插件只能提交元数据和路由，不能执行 SQL 或获取不受限的索引查询。

`display` 能力提供只读显示能力和 `normal`/`fullscreen` 的 `requestMode` 意图。设备不支持时 Core 可以拒绝全屏；插件不会获得浏览器窗口控制权。

当前 `browser` 能力提供不透明、受作用域限制的会话和有界 Core-owned 任务队列：`browser.session.request`、`browser.session.list`、`browser.session.revoke`、`browser.task.enqueue`、`browser.task.list` 和 `browser.task.cancel`。任务只能使用已注册的逻辑 kind 和有限输入，并绑定到有效会话、组织、用户和插件安装实例。Core 当前只保存和取消任务，不执行导航、脚本、Cookie 导入或媒体提取。该契约不会暴露浏览器 Profile、Cookie、CDP 地址、宿主路径、进程或任意 URL。真实 Browser Worker 和兼容矩阵仍属于后续工作。

通知能力通过平台事件能力提供。插件可以发布受长度限制的 `info`、`success`、`warning` 或 `error` 通知，也可以在当前用户和安装实例作用域内查询、标记单条已读或批量标记已读。`markAllRead` 返回本次修改的通知数量。Core 负责持久化和面向用户的展示；插件不能向其他用户或安装实例发送或读取通知。

`media` 能力可以为不透明媒体 ID 创建短期播放会话。后续媒体读取必须携带该会话；Core 将会话绑定到用户、设备、安装实例和过期时间，并在用户会话或插件安装实例撤销时失效。插件不会获得宿主路径或可长期复用的公网媒体 URL。

媒体网关路由的 `HEAD` 只返回元数据，不创建播放会话，也不读取媒体字节。只有实际的 `GET` 播放请求才会创建会话并读取受控内容。

媒体探测通过 `media.probe` 返回受控元数据、是否可寻址以及结构化播放模式：`direct-range`、`remux`、`transcode`。受管 FFmpeg 健康可用时，Core 可以执行受控的 `remux` 和 `transcode`。转换任务完成后返回短期不透明的 `outputId`；插件通过 `media.readOutput` 分段读取，也可以使用 Core 的认证播放路由。点播 HLS 通过下方的受作用域会话 API 提供，直播 HLS 尚未纳入当前契约。插件不会获得 FFmpeg、宿主路径或任意命令执行权限。

`media.requestTransform` 只接受媒体 ID 和受限的输出策略。Core 校验媒体与模式后创建受作用域约束、可取消的任务；不会接受源文件路径、可执行文件参数、URL 或 Shell 片段。

转换结果隔离于组织、用户、设备和安装实例作用域，自动过期并可撤销。Core 提供带认证的 `GET`/`HEAD /api/media/outputs/:id`，支持受限的 Range 读取；过期、撤销、不存在或越权的结果对调用方统一表现为不可用。

`media.requestHls` 创建短期、受作用域约束的点播会话，并返回由 Core 生成的清单和分片 token。`media.readHlsAsset` 只允许读取这些 token 的受限 Range；插件不能选择输出目录、文件模板、协议、滤镜或 FFmpeg 参数。HLS 会话在过期或撤销时清理，不是永久媒体 URL。

Worker 通过版本化本地 IPC 契约与 Core 通信。公开契约定义生命周期、上下文、能力、事件、健康、诊断、取消和错误标识。大媒体和文件使用受控流句柄，而不是消息 payload。

## 私有数据 API

`db` 授予的是受限的逻辑数据空间，不是数据库连接。每次读写都由 Core 绑定到当前组织、用户和插件安装实例。插件不能选择其他用户、指定 schema、获得 DSN，也不能执行任意 SQL。无论 Core 使用 SQLite、PostgreSQL 或运营者管理的兼容数据库，SDK 语义保持一致。

WDR Media 使用该 API 保存播放记录。存储根目录、媒体转换和服务绑定仍由 Core 能力管理，因此插件不获得宿主路径、上游 Cookie 或服务凭据。

管理员可以在 Core 中导出或删除当前用户某个插件安装实例的数据。导出包含受限的逻辑记录和迁移元数据，最多 10,000 条记录或 4 MiB，并带有 `no-store` 缓存控制；删除必须显式确认，并在 Core 的同一事务中同时删除记录和迁移元数据。这些操作不会接受插件提供的用户、组织、安装实例、schema 或 SQL 参数。

## 适配器发布

插件目录区分原生媒体应用、本地服务桥接、上游适配器、浏览器桥接和社区包。目录条目不等于运行代码的批准。需要浏览器身份、外部网络、媒体提取或高风险上游的包，必须使用隔离运行时，经过明确的能力审查，并在公开分发前具备专门的泄露与回滚测试。

公开的 `browser-session-contract-example` 用于验证这一边界。它已经通过真实隔离 Worker、Core Broker 和 Gateway 链路测试不透明会话与受限任务元数据，但不会启动真实浏览器或连接上游网站；它不是浏览器自动化或登录态集成。

## 包要求

插件包包含清单、包内相对执行入口、可选 UI 资源、迁移、国际化资源、SBOM、校验和和签名。隔离 Worker 使用 `worker`，共享适配器及后续模块运行时使用带 `0.1` 协议的 `runtimeEntry`。Core 拒绝绝对路径、路径穿越、命令和宿主环境依赖。它不得包含用户凭据、浏览器 Profile 数据、宿主特定配置、运行日志或未经校验的可执行下载。

机器可验证的 v0 清单和错误目录维护在 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) 仓库。

官方插件集合会在 `dist/packages/<plugin-id>` 生成可安装包。包包含 Manifest、编译后的 `worker.js` 入口、可选 UI、三语 README，以及用于独立加载 Worker 的版本化 `@carmediahub/sdk` 运行时，不依赖 Plugins monorepo 的模块解析。在 [`carmediahub-plugins`](https://github.com/CarMediaHub/carmediahub-plugins) 中先运行 `pnpm build`，再运行 `pnpm verify:packages`，然后才能将包放入 Core staging 目录。

需要网络的插件必须通过 `network.request` 引用管理员明确分配给该插件安装实例的 service binding 和相对路径。管理员在 Core 管理端为绑定选择目标插件安装实例；不选择安装实例时，绑定只属于 Core，不会暴露给插件请求。插件不能提交任意 URL、主机名、端口、凭据、Socket 或未声明请求头。代理兼容插件在发布前仍必须通过隔离运行时、泄露和故障测试。

管理员可以在管理端对单个绑定执行健康检查。Core 发送受限的 `HEAD` 请求，不跟随重定向，也不返回响应正文；结果只包含可达性、可用时的 HTTP 状态和耗时。健康检查不会授予插件网络能力。

重定向由 Core 处理：只有 GET 和 HEAD 最多跟随 3 次，并且每次都必须保持在 binding origin；跨源重定向以及其他方法的重定向都会被拒绝。

Core 为每个 binding 限制最多 10 个活动请求，并拒绝超过 1 MiB 的响应正文。请求成功、失败、超时或取消时都会释放配额。

仓库中的 `service-binding-adapter-example` 是中性的参考实现，只验证契约，不针对具体网站，也不提供公共代理。
