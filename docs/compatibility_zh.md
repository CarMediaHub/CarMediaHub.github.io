# 兼容性矩阵

本矩阵区分自动化契约证据和真实部署证据。`Verified` 表示仓库有可重复测试；`Fixture` 表示使用本地替身验证边界；`Pending` 表示暂不作发布承诺。

| 范围 | 当前状态 | 证据与边界 |
| --- | --- | --- |
| Node.js Core 运行时 | 已验证 | 支持开发主机上的 TypeScript 构建和 Core `171/171` 回归。 |
| SDK 与 Wire Protocol v0.1 | 已验证 | SDK `42/42`，Manifest/错误/Wire 契约和 Memory Runtime 测试。 |
| 官方插件包 | 已验证 | 7 个包的 Manifest、目录一致性和分发包校验通过。 |
| Windows Native | 仅契约 | 已有 Bundle、服务计划和资源检查；干净机器安装、ACL 和回滚待验证。 |
| Docker | CI 证据 | Linux CI 构建加固镜像并执行初始化、readiness 和备份恢复；本地 Docker 与升级演练待验证。 |
| Linux/NAS | 仅契约 | 已有显式配置和平台角色；目标安装、服务身份、存储和恢复待验证。 |
| SQLite | 已验证 | Schema v1 门禁、迁移台账、作用域数据和备份恢复测试。 |
| PostgreSQL | 适配器/CI 夹具 | 有作用域适配器和 CI PostgreSQL smoke；默认 Compose 与 NAS 生产矩阵待完成。 |
| Chromium/浏览器桥接 | 受限 smoke/契约 | 真实静音 Chrome 已验证允许 Origin 导航、未知 Origin 阻断和作用域 User Data 隔离；Chromium 签名分发、重定向/WebSocket/Worker 覆盖和跨平台矩阵待完成。 |
| 媒体播放 | Core/夹具 | Range、转封装、转码、HLS 和 WDR 契约测试通过；真实车机、手机和桌面播放矩阵待完成。 |
| AList/rclone/Mihomo | 桥接夹具 | 受限 service binding 适配器通过本地 HTTP 夹具；正式二进制分发和运营者实装待完成。 |

发布候选前至少要验证一套干净 Windows Native、一套 Docker 和一套 Linux/NAS，并覆盖桌面、手机和车机浏览器播放路径。每项记录版本、组件摘要、配置模式、测试日期和已知限制。

不要从夹具推断某个操作系统、浏览器、上游网站或媒体格式已获支持。`Pending` 是明确的产品边界，不是隐藏的兼容性承诺。
