# Core API 참고

이 문서는 운영자와 SDK 통합을 위한 v0 HTTP 공개 경계입니다. 모든 `/api/*` 경로는 Core Gateway가 제공합니다. 공개로 표시된 경로를 제외하면 인증 세션과 현재 조직·사용자 범위가 필요합니다. 플러그인 Worker는 이 HTTP 경로를 직접 호출하지 말고 SDK의 논리 capability를 사용해야 합니다.

## 공개 배포 프로브

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| `GET` | `/health/live` | 프로세스 생존 상태. |
| `GET` | `/health/ready` | 데이터베이스와 시작 상태; 초기화 전 `503`. |
| `GET` | `/health/diagnostic` | 비식별화된 구성 요소와 플러그인 집계 상태. |
| `GET` | `/api/bootstrap` | 최초 초기화 필요 여부. |

응답에는 호스트 경로, 자격 증명, 상위 URL 또는 사용자 콘텐츠가 포함되지 않습니다.

## 인증과 범위

Bootstrap은 일회성 관리자 작업입니다. 로그인과 로그아웃은 Core가 관리하는 세션 Cookie를 사용합니다. `GET /api/me`는 현재 사용자와 플랫폼 컨텍스트를 반환하고, `PATCH /api/me/preferences`는 검증된 언어·시간대·테마·밀도 설정을 변경합니다. 이 설정은 SDK 컨텍스트를 통해 플러그인에 전달됩니다.

모든 목록 및 변경 경로는 현재 조직, 사용자와 설치 인스턴스 범위를 강제합니다. HTTP 성공이 capability를 추가로 부여하지 않으며 Core가 모든 논리 작업에서 설치된 Manifest를 다시 확인합니다.

## 사용자 경로

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| `GET` | `/api/apps` | 사용자가 접근할 수 있는 앱 항목. |
| `GET` | `/api/history` | 키워드, 분류와 페이지 필터를 사용한 기록 조회. |
| `DELETE` | `/api/history` | 확인 후 범위 기록 삭제. |
| `GET` | `/api/catalog` | 범위가 지정된 카탈로그 조회. |
| `GET` | `/api/notifications` | 범위 알림 조회. |
| `POST` | `/api/notifications/:id/read` | 알림 하나를 읽음 처리. |
| `POST` | `/api/notifications/read-all` | 보이는 알림 모두 읽음 처리. |
| `GET` | `/api/diagnostics/speed/download` | 제한된 인증 다운로드 측정. |
| `POST` | `/api/diagnostics/speed/upload` | 제한된 인증 업로드 측정; 본문은 저장하지 않음. |

## 관리자 경로

관리자는 관리 화면을 사용합니다. API는 실행 전 크기, 메서드, capability와 리소스 경계를 검증합니다. 주요 그룹은 `/api/users`, `/api/components`, `/api/media-roots`, `/api/media-sources`, `/api/plugins`, `/api/plugins/:id/upgrade`, `/api/service-bindings`, `/api/credentials`, `/api/jobs`, `/api/browser/sessions` 및 `/api/browser/tasks`입니다. `POST /api/plugins/:id/health`는 플러그인이 선언한 고정 `/health` 경로를 설치 범위에서 검사하며 건강 상태와 HTTP 상태만 반환합니다. 응답 본문이나 임의 URL은 노출하지 않습니다.

자격 증명 생성 응답에는 평문이 다시 포함되지 않습니다. 브라우저 진단은 논리 target·세션·작업 메타데이터만 반환하며 Cookie, Profile, CDP, 비밀번호, Token, 임의 URL 또는 호스트 경로를 반환하지 않습니다.

Entry Key는 `POST /api/keys`로 생성되며 Core는 해시만 저장하고 현재 관리자에게 귀속합니다. `GET /api/keys`로 자신의 Key를 조회하고 `POST /api/keys/:id/revoke`로 철회합니다. `expiresAt`을 지정할 때는 미래의 정규 ISO-8601 UTC 시간이어야 합니다. 다른 사용자의 Key를 철회하거나 이미 철회된 Key를 다시 철회하면 `404`로 숨겨지며, Key는 소유자의 기존 권한을 확장하지 않습니다.

`POST /api/plugins/:id/upgrade`는 동일한 package ID와 runtime을 가진 서명된 플러그인 패키지를 받습니다. Core는 설치 ID와 범위 데이터를 유지하고 이전 권한과 새 Manifest 선언의 교집합만 부여하며, 서명·다이제스트·진입점·런타임 호환성 검사를 통과한 패키지만 활성화합니다. 업그레이드는 먼저 설치 범위 drain에 들어갑니다. 새 gateway 요청은 재시도 가능한 `503`을 받고 기존 요청은 최대 5초 동안 완료할 수 있습니다. 시간이 초과되면 업그레이드를 취소하고 트래픽을 다시 허용합니다. 새 Manifest가 `/health`를 선언하면 현재 관리자 범위에서 Worker를 시작하거나 재사용하고 Core 소유 Broker를 통해 고정 경로를 호출합니다. probe가 실패하면 이전 Manifest, 권한과 애플리케이션 메타데이터를 복원합니다. health 경로가 없는 패키지는 probe를 건너뛰며 자동 롤백을 보장하지 않습니다. 임의 URL 프록시가 아닙니다.

## 플러그인 Gateway 경로

설치된 플러그인의 UI와 Gateway 경로는 `/apps/<plugin-id>/...` 아래에 노출되며 운영자가 만든 `/k/<opaque-key>` 진입점도 사용할 수 있습니다. Core는 서명된 Manifest의 경로·메서드 계약, 사용자 범위, 설치 상태와 부여된 capability를 확인합니다. 선언되지 않은 경로는 `404`, 허용되지 않은 메서드는 정확한 `Allow` 헤더와 함께 `405`를 반환합니다.

## 오류와 호환성

클라이언트는 상태 코드와 SDK 오류 식별자를 계약으로 사용해야 하며 내부 예외 문구를 파싱하지 않아야 합니다. `401`은 인증 누락/만료, `403`은 권한 부족, `404`는 없음 또는 범위 밖 리소스, `409`는 상태 충돌, `413`은 크기 제한, `429`는 속도/리소스 제한입니다. 스트리밍 응답도 파일 시스템 경로가 아닌 Core 소유의 불투명 재생/세션 참조를 사용합니다.

플러그인 개발은 [Manifest 참고](./manifest_ko.md), [플러그인 계약](./plugin-contract_ko.md)과 버전이 지정된 SDK 계약에서 시작하십시오. 기록되지 않은 경로, 직접 데이터베이스 접근, 공용 릴레이 대역폭 또는 제3자 상위 호환성은 보장하지 않습니다.
