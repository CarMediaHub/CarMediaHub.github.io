# 배포 구성

상태: v0 초안

Core는 `config/core.json` 또는 `--config <경로>`에서 명시적 배포 메타데이터를 읽습니다. `config/core.example.json`을 복사하고 `config/core.schema.json`으로 검증할 수 있습니다.

## 지원 필드

| 필드 | 의미 |
|---|---|
| `dataDir` | Core가 관리하는 상태 디렉터리. 상대 경로는 설치 번들 루트를 기준으로 해석되며 프로세스 작업 디렉터리에 의존하지 않습니다. |
| `host` | Core 수신 호스트. |
| `port` | 1~65535 범위의 Core 수신 포트. |
| `publicUrl` | 표시할 공개 주소인 자격 증명 없는 HTTP 또는 HTTPS Origin. |
| `cookieSecure` | Secure Cookie를 명시적으로 요구하거나 비활성화합니다. 생략하면 HTTPS에서 기본 활성화됩니다. |

명령줄 옵션이 파일 값을 덮어씁니다. 알 수 없는 필드, 잘못된 값, 중복 `--config`, 명시했지만 없는 파일은 시작을 중단합니다. Core는 배포 설정을 위해 `PATH`, `PG*` 또는 기타 암시적 환경 변수를 읽지 않습니다.

## 브라우저 대상 구성

브라우저 자동화 대상은 운영자가 관리합니다. 플러그인이 제어된 브라우저 브리지를 사용할 때 Core 데이터 디렉터리에 `browser-targets.json`을 둡니다.

```json
{
  "schemaVersion": 1,
  "targets": [{ "id": "media-example", "origins": ["https://media.example"] }]
}
```

파일에는 논리 ID와 HTTPS Origin만 사용할 수 있습니다. 구성이 잘못되면 Core는 네트워크 정책을 약화하지 않고 시작을 거부합니다. 버전이 지정된 템플릿은 Core 저장소의 `config/browser-targets.example.json`을 참고하십시오.

## 비밀을 넣지 마십시오

비밀번호, 쿠키, 토큰, 데이터베이스 DSN, 브라우저 프로필 데이터 또는 플러그인 자격 증명을 이 파일에 넣지 마십시오. 해당 값은 Core가 관리하는 데이터 및 자격 증명 경계에 보관해야 합니다. Docker 이미지는 저장소의 관리 대상 카탈로그, 스키마와 예제 구성만 포함하며, 인스턴스 구성은 실행 인자나 관리되는 마운트로 제공해야 합니다.

이 구성 계약은 아직 설치 관리자 계약이 아닙니다. Native 설치 관리자, 실제 Docker 실행, NAS 검증, 업데이트와 롤백은 별도의 출시 기준입니다.
