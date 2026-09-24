# 平台上下文与国际化

Core 在 Broker 握手时创建只读上下文，并在运营者或用户偏好变化时发送更新。插件必须使用这套上下文，不应再建立第二套语言、主题、设备或全屏设置。

## 上下文字段

| 字段 | 含义 |
| --- | --- |
| `scope` | 部署、组织、用户、设备、会话和安装实例身份。插件通过 SDK 使用，不能伪造或扩大。 |
| `locale` | `en`、`zh-CN` 或 `ko`，由 Core 稳定回退。 |
| `timeZone` | 经过校验的 IANA 时区，用于格式化和显示。 |
| `theme` | `light`、`dark` 或 `system`。 |
| `density` | `comfortable` 或 `compact`。 |
| `entry` | 用户通过导航还是不透明 key 进入。 |
| `display` | 设备类型、输入方式、viewport 和全屏能力。 |
| `grantedCapabilities` | Broker 提供时的安装实例有效授权，只读。 |
| `policyVersion` | 单调递增的策略/上下文版本，用于缓存失效。 |

## 语言与文案

Manifest 的名称和描述必须提供三种语言。运行时 UI 文案应使用 SDK locale 和稳定的 message key。Core 将 `zh` 归一化为 `zh-CN`、将 `ko-KR` 归一化为 `ko`，最后回退到英文。插件不应要求用户为同一个平台偏好再次设置语言。

## 上下文变化

注册 `onContextChanged`，在新上下文到达时更新界面、日期/时间格式和显示决策。该接口支持多个订阅者并返回取消订阅函数；视图或插件拥有的订阅释放时应调用它。单个订阅者抛出的异常不会影响 Broker 传输。不要永久缓存身份、授权或语言。上下文变化不会新增能力；每个操作仍由 Core 单独授权。Core 和 SDK 只接受完整作用域及安装元数据与当前已认证 Worker 一致的更新。

## 显示与车机行为

使用 `display.capabilities()` 选择布局，使用 `display.requestMode("fullscreen")` 表达意图。结果可能是 `accepted`、`unsupported` 或 `user-action-required`。车机支持只是 UI/包声明，不授予窗口、原生屏幕或远程控制 API 访问权。

请结合[能力目录](./capabilities_zh.md)、[Manifest](./manifest_zh.md)和 SDK 类型阅读版本化契约。
