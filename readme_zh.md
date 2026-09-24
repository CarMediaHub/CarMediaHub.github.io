# CarMediaHub 文档

面向 CarMediaHub 用户和插件开发者的公开文档。

语言： [English](readme.md) · 简体中文 · [한국어](readme_ko.md)

状态：v0 草案

| 主题 | 说明 |
|---|---|
| [架构](docs/architecture_zh.md) | Core、网关、运行时组、身份、数据和部署边界 |
| [插件契约](docs/plugin-contract_zh.md) | 插件包、生命周期、能力和 IPC 契约边界 |
| [安全模型](docs/security_zh.md) | capability-first 默认规则和运营者责任 |
| [项目由来](docs/project-origin_zh.md) | 车机媒体、基础服务与兼容插件为何组成同一平台 |
| [项目目标](docs/project-goals_zh.md) | 用户结果、平台目标和非目标 |
| [文档站地图](docs/documentation-map_zh.md) | 普通用户、运营者、开发者、贡献者和参考资料入口 |

## 本地开发

```powershell
pnpm install
pnpm verify
pnpm build
pnpm dev
```

`pnpm verify` 会执行 Astro 检查、中英韩三语文档组校验和静态构建。

本站是纯静态构建，构建时读取公开 Markdown，不依赖 Core、中心账号、运行时数据库或媒体中继。
