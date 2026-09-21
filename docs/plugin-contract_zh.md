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

`media.requestTransform` 只接受媒体 ID 和受限的输出策略。Core 校验媒体与模式后创建受作用域约束、可取消的任务；不会接受源文件路径、可执行文件参数、URL 或 Shell 片段。

Worker 通过版本化本地 IPC 契约与 Core 通信。公开契约定义生命周期、上下文、能力、事件、健康、诊断、取消和错误标识。大媒体和文件使用受控流句柄，而不是消息 payload。

## 私有数据 API

`db` 授予的是受限的逻辑数据空间，不是数据库连接。每次读写都由 Core 绑定到当前组织、用户和插件安装实例。插件不能选择其他用户、指定 schema、获得 DSN，也不能执行任意 SQL。无论 Core 使用 SQLite、PostgreSQL 或运营者管理的兼容数据库，SDK 语义保持一致。

WDR Media 使用该 API 保存播放记录。存储根目录、媒体转换和服务绑定仍由 Core 能力管理，因此插件不获得宿主路径、上游 Cookie 或服务凭据。

## 适配器发布

插件目录区分原生媒体应用、本地服务桥接、上游适配器、浏览器桥接和社区包。目录条目不等于运行代码的批准。需要浏览器身份、外部网络、媒体提取或高风险上游的包，必须使用隔离运行时，经过明确的能力审查，并在公开分发前具备专门的泄露与回滚测试。

## 包要求

插件包包含清单、包内相对执行入口、可选 UI 资源、迁移、国际化资源、SBOM、校验和和签名。隔离 Worker 使用 `worker`，共享适配器及后续模块运行时使用带 `0.1` 协议的 `runtimeEntry`。Core 拒绝绝对路径、路径穿越、命令和宿主环境依赖。它不得包含用户凭据、浏览器 Profile 数据、宿主特定配置、运行日志或未经校验的可执行下载。

机器可验证的 v0 清单和错误目录维护在 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk) 仓库。

官方插件集合会在 `dist/packages/<plugin-id>` 生成可安装包。包包含 Manifest、编译后的 `worker.js` 入口、可选 UI 和三语 README。在 [`carmediahub-plugins`](https://github.com/CarMediaHub/carmediahub-plugins) 中先运行 `pnpm build`，再运行 `pnpm verify:packages`，然后才能将包放入 Core staging 目录。

需要网络的插件必须通过 `network.request` 引用管理员明确分配给该插件安装实例的 service binding 和相对路径。管理员在 Core 管理端为绑定选择目标插件安装实例；不选择安装实例时，绑定只属于 Core，不会暴露给插件请求。插件不能提交任意 URL、主机名、端口、凭据、Socket 或未声明请求头。代理兼容插件在发布前仍必须通过隔离运行时、泄露和故障测试。

管理员可以在管理端对单个绑定执行健康检查。Core 发送受限的 `HEAD` 请求，不跟随重定向，也不返回响应正文；结果只包含可达性、可用时的 HTTP 状态和耗时。健康检查不会授予插件网络能力。

重定向由 Core 处理：只有 GET 和 HEAD 最多跟随 3 次，并且每次都必须保持在 binding origin；跨源重定向以及其他方法的重定向都会被拒绝。

Core 为每个 binding 限制最多 10 个活动请求，并拒绝超过 1 MiB 的响应正文。请求成功、失败、超时或取消时都会释放配额。

仓库中的 `service-binding-adapter-example` 是中性的参考实现，只验证契约，不针对具体网站，也不提供公共代理。
