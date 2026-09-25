# 配置参考

Core 通过 JSON 文件或命令行参数接受显式部署元数据。配置刻意保持小而无秘密，使 Native、Docker 和未来安装器可以复用同一契约。

## 字段

| 字段 | 规则 |
| --- | --- |
| `dataDir` | Core 管理的数据目录，相对路径按安装包根目录解析，不依赖进程工作目录。 |
| `host` | 非空且不含空白的监听地址。 |
| `port` | `1` 到 `65535` 的整数。 |
| `publicUrl` | 不带凭据、路径、query 或 fragment 的 HTTP/HTTPS Origin。 |
| `cookieSecure` | Secure Cookie 策略；省略时 HTTPS 自动启用。 |

未知字段、非法值、重复 `--config` 或显式指定但不存在的文件都会阻止启动。命令行值覆盖文件值。Core 不从 `PATH`、`PG*` 或其他隐式环境变量发现部署设置。

## 示例

```json
{
  "dataDir": "./data",
  "host": "127.0.0.1",
  "port": 8787,
  "publicUrl": "https://hub.example.com",
  "cookieSecure": true
}
```

使用仓库内的 `config/core.schema.json` 校验。浏览器桥接需要时，部署数据目录还可以放置 `browser-targets.json`；它只接受逻辑 ID 和 HTTPS Origin，不保存凭据或 Profile 路径。

## 部署模式

- **Native**：使用 `--config <path>` 或 `config/core.json`；相对路径按安装包根目录解析，服务管理器无需设置工作目录。发布包携带运行时依赖和 Schema，实例数据放在包外。
- **Docker**：镜像包含 Core 运行时、登记目录、Schema 和示例文件。挂载数据卷并显式提供实例配置；默认 Compose 只绑定回环地址并使用 SQLite。
- **NAS/Linux**：复用同一配置文件和数据目录契约；服务注册、ACL、升级和回滚仍需目标环境验证。

不要在配置中放置密码、TOTP 秘密、Cookie、Token、数据库 DSN、浏览器 Profile 或插件凭据。请使用 Core 管理的凭据和数据 API。另见 [Native 部署](./operator-native_zh.md)、[API 参考](./api_zh.md)和[备份与恢复](./operator-backup_zh.md)。
