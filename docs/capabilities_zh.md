# 能力目录

能力是签名 Manifest 中的明确请求。Core 按组织、用户和插件安装实例授权。`WorkerClient` 只提供逻辑 API，不暴露数据库连接、宿主文件系统、进程句柄、浏览器 Profile 或任意命令通道。

| 能力 | SDK 入口 | 边界 |
| --- | --- | --- |
| `config` | 平台配置 API | 只提供校验后的插件配置，不提供秘密或环境变量。 |
| `secrets` | 凭据引用 | Core 加密保存凭据，只在受控最后一跳注入，插件不能读取明文。 |
| `db` | `database()` | 有作用域的逻辑集合、记录和迁移，不提供 DSN、Schema 或 SQL。 |
| `storage` | 媒体/存储契约 | 只接受运营者授权的不透明句柄，不接受宿主路径。 |
| `media` | 探测、播放、转换和 HLS | Core 管理会话、有界 Range 读取和 FFmpeg 任务。 |
| `media-source` | 列表、stat、探测、播放和读取 | 只读不透明源/项目句柄，凭据留在 Core。 |
| `history` | 记录、查询和清除 | 仅限当前用户和安装实例历史。 |
| `catalog` | 注册、查询和删除 | 作用域搜索条目，索引和删除由 Core 管理。 |
| `display` | 能力查询和模式意图 | 设备上下文与全屏意图，不提供窗口或浏览器句柄。 |
| `jobs` | 入队、列表和取消 | Core 管理的有界异步任务，不提供执行器或 Shell。 |
| `events` | 发布和上下文更新 | 有作用域且载荷有界的领域事件。 |
| `diagnostics` | 有界诊断操作 | 只返回稳定诊断码和脱敏元数据。 |
| `gateway` | 插件路由处理 | 通过唯一 Core 入口提供已声明的逻辑路由和方法。 |
| `network` | 绑定来源请求 | 运营者批准的服务绑定和过滤后的请求，不是通用代理。 |
| `browser` | 不透明会话和任务 | 已登记 HTTPS 目标、Core 管理 Worker 和有界结果，不提供 Cookie/Profile/CDP。 |
| `transfer` | 受管传输契约 | Core 控制的传输资源和配额，不提供任意 Socket 监听。 |

插件应只请求用户功能真正需要的最小能力。`serviceBindings` 还要求 `network`；绑定名称不是 URL、凭据或 Socket 路径。共享适配器宿主只能使用 SDK 校验器允许的低风险能力。

撤销能力会取消或关闭依赖它的任务、会话、凭据和绑定。减少安装实例授权无需更换包即可生效；扩大授权必须重新审核 Manifest 并由管理员操作。

请结合 [Manifest](./manifest_zh.md)、[生命周期](./lifecycle_zh.md)和 [API 参考](./api_zh.md)阅读。
