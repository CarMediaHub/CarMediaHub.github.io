# Native 部署

状态：v0 草案

Native 部署直接运行在运营者控制的 Windows 或 Linux 主机上。请使用显式 JSON 配置契约，并保持 Core Gateway 作为唯一公开应用入口。

## 当前契约

使用 `config/core.example.json`，并通过 `config/core.schema.json` 校验。默认 `config/core.json` 和相对 `dataDir` 路径均按安装包根目录解析，不依赖服务管理器的工作目录；需要使用其他位置的配置文件时，通过 `--config <路径>` 显式指定。Native bundle 必须包含 Core CLI、管理端资源、组件目录、Schema、示例配置、Core 运行时依赖、版本化的 `@carmediahub/sdk` 运行时和运行时元数据；实例配置和 `.env` 不得进入发布包。严格发布包必须包含真实文件而不是依赖符号链接；仓库检查源码工作树时才允许包管理器链接。

在 Windows 上，服务注册契约会根据 Node、bundle、数据目录和配置文件的绝对路径生成显式 `sc.exe` 参数。它使用 Core 的回环监听默认值，不读取 PATH 或环境变量。当前仓库提供该契约和测试，不会静默安装或修改 Windows 服务。

完成 Core 构建后，可运行 `pnpm create:native-bundle -- <绝对输出目录>` 在源码树之外生成自包含发布目录。该命令只复制发布工件并解除包管理器链接；分发前应对生成目录运行 `pnpm check:native-bundle`。

## 尚未形成发布承诺

Native 安装器、服务账号与 ACL 配置、系统服务安装、干净机器安装、组件分发、升级、回滚和跨平台恢复仍属于发布门槛。仓库已经提供 Windows `sc.exe` 和 Linux systemd 的生成契约，但尚未将它们应用到主机。在这些门槛完成前，不要向互联网公开数据库、Worker、插件或调试端口。

dry-run 计划包含序列化动作列表。未来的特权安装器消费计划前，Core 会再次校验平台命令白名单、参数字节、幂等策略和 stdin 边界。这保护了执行边界，但不代表 Native 服务注册或 ACL 写入已经在主机上完成。

校验器还要求完整的平台动作顺序：Windows 必须先完成 bundle、配置和数据目录 ACL，再创建服务、设置描述并启动；Linux 必须先创建账号和目录，再写入 systemd 单元、应用所有权、重载 systemd 并启用服务。缺失、重复或乱序的阶段都会被拒绝。

Native bundle 包含 `config/native-install-plan.schema.json`，外部安装器可以在执行特权操作前独立校验计划结构。

公开副本位于 [`/schemas/native-install-plan.schema.json`](/schemas/native-install-plan.schema.json)。
