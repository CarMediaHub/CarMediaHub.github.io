# 插件 Manifest

Manifest 是签名插件包声明的契约。Core 在安装前校验它，并据此建立能力、路由、运行时和资源边界。Manifest 不授予 Shell、任意 URL、数据库连接、宿主路径、浏览器 Profile 或环境变量访问权。

## 最小 isolated-worker 示例

```json
{
  "id": "example-plugin",
  "version": "0.1.0",
  "sdk": "^0.1.0",
  "name": { "en": "Example", "zh-CN": "示例", "ko": "예제" },
  "description": { "en": "A bounded example.", "zh-CN": "一个受限示例。", "ko": "제한된 예제입니다." },
  "category": "official",
  "runtime": "isolated-worker",
  "capabilities": ["config", "events"],
  "routes": [{ "path": "/", "methods": ["GET"] }],
  "worker": { "entry": "./worker.js", "protocol": "0.1" }
}
```

## 必填字段

| 字段 | 规则 |
| --- | --- |
| `id` | 小写包标识符，长度 3-64。 |
| `version` | Semver。包内容变化必须发布新版本。 |
| `sdk` | 包支持的 SDK 版本范围。 |
| `name`、`description` | 必须提供非空的 `en`、`zh-CN` 和 `ko` 文案，宿主语言设置具有权威性。 |
| `runtime` | `isolated-worker`、`shared-adapter-host` 或 `wasm-module`。 |
| `capabilities` | 只能声明 SDK 已知能力，未知值会被拒绝。 |
| `routes` | 逻辑相对路由及允许的 HTTP 方法。 |

v0 路由方法白名单为 `GET`、`HEAD`、`POST`、`PUT`、`PATCH`、`DELETE` 和 `PROPFIND`。`PROPFIND` 用于有界的只读 WebDAV 目录探测；适配器必须保持路径为相对路径，不能借此实现递归或写入行为。Core 只为 `GET` 和 `HEAD` 跟随同源重定向。

`isolated-worker` 必须声明 `worker.entry` 和协议 `0.1`。`shared-adapter-host` 必须声明 `runtimeEntry`、使用 `core-companion` 分类，并且只能使用低风险能力（`config`、`display`、`diagnostics`、`events`、`gateway`）。WASM 包使用运行时入口，并继续受到相同的作用域和资源限制。

## 能力与服务绑定

能力是请求，不是直接句柄：

- `db`、`history`、`catalog`、`storage`、`media`、`media-source` 和 `jobs` 都绑定到组织、用户和插件安装实例。
- `display` 只提供设备信息和全屏意图，不提供窗口或浏览器句柄。
- `browser` 使用 Core 管理的不透明会话和任务，不暴露 Cookie、Profile 或 CDP 数据。
- `secrets` 只接受 Core 签发的凭据引用；Core 在受控的最后一跳注入明文，插件永远无法读取。
- `network` 是使用 `serviceBindings` 的必要能力，但仍受运营者绑定策略限制。

`serviceBindings` 只包含 `alist-web`、`mihomo-web` 等命名绑定，不包含 URL、凭据、Socket 路径或数据库 DSN。运营者单独授权绑定，Core 再将其应用到安装实例作用域。

## 校验与发布

打包前使用 SDK 校验 Manifest，并为缺失翻译、能力拒绝、用户隔离、取消、重启和路由方法添加契约测试。发布时同时提供 Worker/UI 文件、版本化 SDK 范围、许可证、包摘要和签名。敏感配置必须通过 Core 的凭据和配置 API 保存，不能写入 Manifest 或包文件。

请结合[开发者快速开始](./developer-quickstart_zh.md)、[插件契约](./plugin-contract_zh.md)和 Plugins 目录中的可运行示例阅读。
