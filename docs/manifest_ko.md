# 플러그인 Manifest

Manifest는 서명된 플러그인 패키지가 선언하는 계약입니다. Core는 설치 전에 이를 검증하고 capability, route, runtime과 리소스 경계를 구성합니다. Manifest는 Shell, 임의 URL, 데이터베이스 연결, 호스트 경로, 브라우저 Profile 또는 환경 변수 접근을 허용하지 않습니다.

## 최소 isolated-worker 예제

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

## 필수 필드

| 필드 | 규칙 |
| --- | --- |
| `id` | 소문자 패키지 식별자, 3-64자. |
| `version` | Semver. 패키지 내용이 바뀌면 새 버전을 발행합니다. |
| `sdk` | 패키지가 지원하는 SDK 버전 범위. |
| `name`, `description` | 비어 있지 않은 `en`, `zh-CN`, `ko` 문자열이 필요하며 호스트 언어가 기준입니다. |
| `runtime` | `isolated-worker`, `shared-adapter-host` 또는 `wasm-module`. |
| `capabilities` | SDK가 아는 capability만 선언하며 알 수 없는 값은 거부됩니다. |
| `routes` | 논리 상대 경로와 허용 HTTP 메서드. |

`isolated-worker`는 `worker.entry`와 protocol `0.1`을 선언합니다. `shared-adapter-host`는 `runtimeEntry`를 선언하고 `core-companion` 분류를 사용해야 하며 저위험 capability(`config`, `display`, `diagnostics`, `events`, `gateway`)만 사용할 수 있습니다. WASM 패키지는 runtime entry를 사용하고 같은 범위 및 리소스 제한을 받습니다.

## Capability와 서비스 바인딩

Capability는 요청이며 직접 핸들이 아닙니다.

- `db`, `history`, `catalog`, `storage`, `media`, `media-source`, `jobs`는 조직, 사용자와 플러그인 설치 범위에 묶입니다.
- `display`는 장치 정보와 전체 화면 의도만 제공하며 창이나 브라우저 핸들을 제공하지 않습니다.
- `browser`는 Core가 관리하는 불투명 세션과 작업을 사용하며 Cookie, Profile, CDP 데이터를 노출하지 않습니다.
- `secrets`는 Core가 발급한 자격 증명 참조만 받습니다. Core가 통제된 마지막 홉에서 평문을 주입하며 플러그인은 읽을 수 없습니다.
- `network`는 `serviceBindings`에 필요하지만 운영자의 바인딩 정책에 의해 계속 제한됩니다.

`serviceBindings`에는 `alist-web`, `mihomo-web` 같은 이름만 포함하며 URL, 자격 증명, Socket 경로 또는 데이터베이스 DSN은 포함하지 않습니다. 운영자가 바인딩을 별도로 승인하면 Core가 설치 범위에 적용합니다.

## 검증과 배포

패키징 전에 SDK로 Manifest를 검증하고 번역 누락, capability 거부, 사용자 격리, 취소, 재시작과 route 메서드에 대한 계약 테스트를 추가합니다. 배포 패키지에는 Worker/UI 파일, 버전이 지정된 SDK 범위, 라이선스, 패키지 다이제스트와 서명을 함께 포함합니다. 민감한 설정은 Core의 자격 증명 및 설정 API에 저장하고 Manifest나 패키지에 넣지 않습니다.

[개발자 빠른 시작](./developer-quickstart_ko.md), [플러그인 계약](./plugin-contract_ko.md)과 Plugins 카탈로그의 실행 가능한 예제를 함께 참고하십시오.
