# Docker 部署

状态：v0 Draft

Docker 部署始终只公开 Core Gateway 一个入口。Core、内部运行时通道和可选基础服务必须位于内部网络；不要公开数据库、Worker、插件或调试端口。

## 当前契约

使用显式 JSON 配置和专用持久化数据目录，只挂载部署契约声明的目录。Core 不读取 `.env`、`PATH`、`PG*`、宿主浏览器 Profile 或任意宿主路径。凭据放在部署侧的秘密管理机制中，插件不会获得原始数据库连接。

仓库 CI 会构建加固镜像，并在 Linux 容器中检查 `/health/live` 和 `/health/ready`；备份恢复后还会从恢复目录启动第二个 Core 实例并再次检查 `/health/ready`。源码仓库不承诺每台主机都已安装 Docker。正式暴露前，应验证镜像来源、持久化目录权限、HTTPS 终止、备份/恢复和媒体任务所需的资源限制。

镜像使用专用的非 root 用户 `carmediahub` 运行 Core。默认 Compose 配置只允许受管数据卷写入，镜像文件系统保持只读。

## 网络与升级

反向代理只转发配置的 Gateway 端口。PostgreSQL、服务绑定、Worker IPC 和受管组件端口保持内部可见。创建离线 SQLite 快照前应停机或排空，并在恢复到空数据目录前校验快照。组件更新先暂存并健康检查，检查失败时不得替换当前活动版本。

## 当前尚未承诺

干净主机 Docker 安装、生产 Compose 默认值、真实 AList/rclone/FFmpeg/Mihomo 镜像、在线备份、跨主机恢复以及完整 Docker 升级/回滚演练仍是发布门禁。CI 证据不能替代运营者实机演练。
