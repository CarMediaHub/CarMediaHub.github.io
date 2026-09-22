# Native 部署

状态：v0 草案

Native 部署直接运行在运营者控制的 Windows 或 Linux 主机上。请使用显式 JSON 配置契约，并保持 Core Gateway 作为唯一公开应用入口。

## 当前契约

使用 `config/core.example.json`，并通过 `config/core.schema.json` 校验。配置文件不在工作目录时，使用 `--config <路径>` 显式指定。Native bundle 必须包含 Core CLI、管理端资源、组件目录、Schema、示例配置和运行时元数据；实例配置和 `.env` 不得进入发布包。

在 Windows 上，服务注册契约会根据 Node、bundle、数据目录和配置文件的绝对路径生成显式 `sc.exe` 参数。它使用 Core 的回环监听默认值，不读取 PATH 或环境变量。当前仓库提供该契约和测试，不会静默安装或修改 Windows 服务。

## 尚未形成发布承诺

Native 安装器、服务账号与 ACL 配置、Linux 系统服务生成、干净机器安装、组件分发、升级、回滚和跨平台恢复仍属于发布门槛。在这些门槛完成前，不要向互联网公开数据库、Worker、插件或调试端口。
