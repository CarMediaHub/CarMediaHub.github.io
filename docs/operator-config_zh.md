# 部署配置

状态：v0 草案

Core 支持从 `config/core.json` 或 `--config <路径>` 读取显式部署元数据。可以复制 `config/core.example.json`，并使用 `config/core.schema.json` 校验。

## 支持字段

| 字段 | 含义 |
|---|---|
| `dataDir` | Core 管理的数据目录。相对路径相对于工作目录解析。 |
| `host` | Core 监听地址。 |
| `port` | 1 到 65535 的 Core 监听端口。 |
| `publicUrl` | 用于显示公网地址的无凭据 HTTP 或 HTTPS Origin。 |
| `cookieSecure` | 显式要求或禁用 Secure Cookie；未设置时 HTTPS 默认启用。 |

命令行参数会覆盖文件值。未知字段、非法值、重复 `--config` 以及显式指定但不存在的文件都会阻止启动。Core 不读取 `PATH`、`PG*` 或其他隐式环境变量作为部署配置。

## 不要写入秘密

不要在此文件写入密码、Cookie、Token、数据库 DSN、浏览器 Profile 数据或插件凭据。它们应保存在 Core 管理的数据目录和凭据边界中。Docker 镜像只包含仓库内受控的目录、Schema 和示例配置；实例配置应通过运行时参数或受控挂载提供。

该配置契约还不是安装器契约。Native 安装器、真实 Docker 运行、NAS 验证、升级和回滚仍属于独立发布门槛。
