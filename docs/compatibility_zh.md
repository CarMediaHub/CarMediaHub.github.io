# 兼容性矩阵

本矩阵区分自动化契约证据和真实部署证据。`Verified` 表示仓库有可重复测试；`Fixture` 表示使用本地替身验证边界；`Pending` 表示暂不作发布承诺。

| 范围 | 当前状态 | 证据与边界 |
| --- | --- | --- |
| Node.js Core 运行时 | 已验证 | 支持开发主机上的 TypeScript 构建和 Core `223/223` 回归。 |
| SDK 与 Wire Protocol v0.1 | 已验证 | SDK `49/49`，Manifest/错误/Wire 契约、locale 契约一致性、capability 上下文校验和 Memory Runtime 测试。 |
| 官方插件包 | 已验证 | 10 个包的 Manifest、目录一致性和分发包校验通过；其中浏览器辅助媒体提取包仍是 T2 契约示例，不连接真实上游。 |
| Windows Native | Bundle 与恢复 smoke | Bundle、服务计划、资源检查和恢复后启动已通过；服务注册、ACL 写入和自动回滚仍待验证。安装失败会提供已执行动作诊断，并提供显式平台补偿回调契约；当前仍需运营者按状态恢复。 |
| Docker | CI 证据 | Linux CI 构建加固镜像并执行初始化、readiness 和备份恢复；本地 Docker 与升级演练待验证。 |
| Linux/NAS | 仅契约 | 已有显式配置和平台角色；目标安装、服务身份、存储和恢复待验证。 |
| SQLite | 已验证 | Schema v1 门禁、迁移台账、作用域数据和备份恢复测试。 |
| PostgreSQL | 适配器/CI 夹具 | 有作用域适配器和 CI PostgreSQL smoke；默认 Compose 与 NAS 生产矩阵待完成。 |
| MySQL | Core 适配器/契约夹具 | 已有 Core 管理的显式适配器和作用域测试；真实 MySQL 服务、备份和 NAS 矩阵待完成。 |
| Chromium/浏览器桥接 | 受限 smoke/契约 | 真实静音 Chrome 已验证允许 Origin 导航、未知 Origin 阻断和作用域 User Data 隔离；Chromium 签名分发、重定向/WebSocket/Worker 覆盖和跨平台矩阵待完成。 |
| 媒体播放 | Core/夹具 | Range、转封装、转码、HLS 和 WDR 契约测试通过；真实车机、手机和桌面播放矩阵待完成。 |
| AList/rclone/Mihomo | 桥接夹具 | 受限 service binding 适配器通过本地 HTTP 夹具；正式二进制分发和运营者实装待完成。 |

发布候选前至少要验证一套干净 Windows Native、一套 Docker 和一套 Linux/NAS，并覆盖桌面、手机和车机浏览器播放路径。每项记录版本、组件摘要、配置模式、测试日期和已知限制。

不要从夹具推断某个操作系统、浏览器、上游网站或媒体格式已获支持。`Pending` 是明确的产品边界，不是隐藏的兼容性承诺。
