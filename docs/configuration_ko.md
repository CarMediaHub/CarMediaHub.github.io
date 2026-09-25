# 구성 참고

Core는 JSON 파일 또는 명령줄 인자로 명시적인 배포 메타데이터를 받습니다. 구성은 작고 비밀이 없도록 설계되어 Native, Docker와 향후 설치기가 같은 계약을 사용할 수 있습니다.

## 필드

| 필드 | 규칙 |
| --- | --- |
| `dataDir` | Core가 관리하는 데이터 디렉터리. 상대 경로는 설치 번들 루트를 기준으로 하며 프로세스 작업 디렉터리에 의존하지 않습니다. |
| `host` | 공백이 없는 비어 있지 않은 listen host. |
| `port` | `1`에서 `65535` 사이의 정수. |
| `publicUrl` | 자격 증명, 경로, query, fragment가 없는 HTTP/HTTPS Origin. |
| `cookieSecure` | Secure Cookie 정책. 생략하면 HTTPS에서 자동 활성화됩니다. |

알 수 없는 필드, 잘못된 값, 중복 `--config` 또는 명시했지만 없는 파일은 시작을 중지합니다. 명령줄 값이 파일 값을 덮어씁니다. Core는 `PATH`, `PG*` 또는 다른 암묵적 환경 변수에서 설정을 찾지 않습니다.

## 예제

```json
{
  "dataDir": "./data",
  "host": "127.0.0.1",
  "port": 8787,
  "publicUrl": "https://hub.example.com",
  "cookieSecure": true
}
```

저장소의 `config/core.schema.json`으로 검증하십시오. 브라우저 브리지가 필요하면 배포 데이터 디렉터리에 `browser-targets.json`을 둘 수 있으며 논리 ID와 HTTPS Origin만 허용하고 자격 증명이나 Profile 경로는 저장하지 않습니다.

## 배포 모드

- **Native**: `--config <path>` 또는 `config/core.json`을 사용합니다. 상대 경로는 설치 번들 루트를 기준으로 하므로 서비스 관리자가 작업 디렉터리를 설정할 필요가 없습니다. 릴리스 번들은 런타임과 Schema를 포함하고 인스턴스 데이터는 번들 밖에 둡니다.
- **Docker**: 이미지에는 Core 런타임, 카탈로그, Schema와 예제가 포함됩니다. 데이터 볼륨과 인스턴스 구성을 명시적으로 제공합니다. 기본 Compose는 loopback과 SQLite를 사용합니다.
- **NAS/Linux**: 같은 구성 파일과 데이터 디렉터리 계약을 사용하며 서비스 등록, ACL, 업그레이드와 롤백은 대상 검증이 필요합니다.

비밀번호, TOTP 비밀, Cookie, Token, 데이터베이스 DSN, 브라우저 Profile 또는 플러그인 자격 증명을 구성에 넣지 마십시오. Core가 관리하는 자격 증명과 데이터 API를 사용하십시오. [Native 배포](./operator-native_ko.md), [API 참고](./api_ko.md), [백업과 복구](./operator-backup_ko.md)도 참고하십시오.
