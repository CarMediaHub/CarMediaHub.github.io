# 플러그인 계약

상태: v0 초안

플러그인 패키지는 ID, 게시자, SDK 호환 범위, 런타임 요구 사항, 경로, capability, 리소스와 데이터 수명 주기를 선언합니다. 매니페스트는 권한 요청이며 자동 승인이 아닙니다.

## 수명 주기

```text
discovered -> verified -> grant pending -> configured -> prepared
-> starting -> ready -> active -> draining -> stopped
                              \-> failed -> quarantined
```

중지, 제거와 플러그인 데이터 삭제는 서로 다른 작업입니다. 실패하거나 격리된 플러그인은 경로와 capability 호출을 받지 않습니다.

관리자가 플러그인을 비활성화하면 경로를 제거하고 Worker를 중지하며 관련 재생 세션을 취소합니다. 다시 활성화해도 경로와 지연 시작 조건만 복구되고 Worker가 자동 시작되거나 부여된 권한과 플러그인 데이터가 초기화되지 않습니다.

패키지의 실행 진입점은 패키지 내부의 상대 경로여야 합니다. 격리 Worker는 `worker`를 사용하고 공유 어댑터 및 향후 모듈 런타임은 `0.1` 프로토콜의 `runtimeEntry`를 사용합니다. Core는 절대 경로, 경로 탈출, 명령 및 호스트 환경 의존성을 거부합니다. 패키지에는 사용자 자격 증명, 브라우저 프로필 데이터, 호스트별 설정, 런타임 로그 또는 검증되지 않은 실행 파일 다운로드를 포함할 수 없습니다.

## Capability 모델

SDK는 설정, 개인 데이터, 저장소, 미디어, 작업, 기록, 카탈로그, 표시, 이벤트, 진단, 게이트웨이 경로, 네트워크, 브라우저 세션과 관리형 전송을 범위가 제한된 capability로 제공합니다. 민감한 capability는 명시적으로 선언하고 승인하기 전까지 비활성화됩니다.

플러그인 문구에는 SDK의 `normalizeLocale`, `localeFallbacks`, `localize`를 사용해야 합니다. 이 함수는 `zh`/`zh-CN`, `ko-KR`/`ko` 별칭을 정규화하고 요청 언어 -> 언어 계열 -> 영어 순서로 fallback합니다. 플러그인은 Core의 언어 설정을 상속하며 플랫폼 전체 언어 설정을 별도로 만들면 안 됩니다.

Worker는 핸드셰이크 후 기능 적응을 위해 읽기 전용 `grantedCapabilities` 목록을 받을 수 있습니다. 이는 현재 설치 인스턴스의 유효 권한을 나타내지만 권한의 출처는 아닙니다. Core는 모든 호출에서 최신 권한을 다시 확인하며 구버전 Broker는 이 필드를 생략할 수 있습니다.

`jobs` capability는 현재 사용자와 플러그인 설치 인스턴스의 범위 안에서만 작업을 실행합니다. 초기 한도는 범위마다 활성 작업 10개이며 JSON payload와 결과는 각각 64 KiB로 제한됩니다. 한도를 초과하면 안정적인 오류 코드 `CMH.JOBS.QUEUE_FULL`, `CMH.JOBS.PAYLOAD_TOO_LARGE` 또는 `CMH.JOBS.RESULT_TOO_LARGE`를 반환합니다. 호출자는 카탈로그의 message key를 사용하고 사용자 문구를 하드코딩하지 않아야 합니다.

`history` capability는 동일한 범위의 Worker 계약으로 `record`, `query`, `clear`를 제공합니다. Core는 주제, 경로, 제목, 카테고리, 장치와 시간의 최소 필드만 저장하며 플러그인은 다른 사용자나 설치 인스턴스를 선택할 수 없고 데이터베이스 연결도 받지 않습니다.

기록과 카탈로그 조회는 제한된 `limit` 및 `offset` 페이지 매김을 지원합니다. Core는 페이지를 나누기 전에 키워드와 카테고리 필터를 적용하며 관리 패널용 조회에는 전체 개수도 반환합니다. 잘못된 페이지 매김 값은 `CMH.PAGINATION.INVALID`로 거부됩니다.

`catalog` capability는 `register`, `query`, `remove`로 검색 가능한 플러그인 항목을 제공합니다. Core는 필터링 전에 범위와 권한을 확인하며 플러그인은 메타데이터와 경로만 제출하고 SQL 또는 제한 없는 색인 조회를 사용할 수 없습니다.

`display` capability는 읽기 전용 표시 기능과 `normal`/`fullscreen` `requestMode` 의도를 제공합니다. 장치가 지원하지 않으면 Core가 전체 화면을 거부할 수 있으며 플러그인은 브라우저 창을 제어할 수 없습니다.

현재 `browser` capability는 SDK v0 Wire 계약에 구현되어 있으며 불투명하고 범위가 제한된 세션과 제한된 Core-owned 작업 큐를 제공합니다: `browser.session.request`, `browser.session.list`, `browser.session.revoke`, `browser.task.enqueue`, `browser.task.list`, `browser.task.cancel`. Core는 조직, 사용자 및 플러그인 설치 인스턴스 범위에서 세션/작업을 저장하고, 조회하고, 취소하고, 철회합니다. 관리형 Browser Worker driver는 실제 음소거 Chrome smoke를 통과하여 허용된 Origin, 알 수 없는 Origin 차단 및 범위가 지정된 User Data 격리를 검증했습니다. 스크립트 실행, Cookie 가져오기, 미디어 추출, 서명된 브라우저 배포, 리디렉션/WebSocket/Worker 검증 및 플랫폼 호환성 매트릭스는 아직 완료되지 않았습니다. 이 계약은 브라우저 Profile, Cookie, CDP 주소, 호스트 경로, 프로세스 또는 임의 URL/스크립트를 노출하지 않습니다.

알림 API는 플랫폼 이벤트 capability를 통해 제공됩니다. 플러그인은 길이가 제한된 `info`, `success`, `warning`, `error` 알림을 게시하고 현재 사용자와 설치 인스턴스 범위의 알림만 조회하거나 한 건 또는 전체를 읽음 처리할 수 있습니다. `markAllRead`는 변경된 알림 수를 반환합니다. 저장과 사용자 표시 전달은 Core가 담당하며 플러그인은 다른 사용자나 설치 인스턴스에 알림을 보낼 수 없습니다.

`media` capability는 불투명한 미디어 ID에 대해 짧은 재생 세션을 만들 수 있습니다. 이후 미디어 읽기는 이 세션을 사용해야 합니다. Core는 세션을 사용자, 장치, 설치 인스턴스와 만료 시간에 바인딩하고 사용자 세션 또는 플러그인 설치가 취소되면 세션을 폐기합니다. 플러그인은 호스트 경로나 재사용 가능한 공개 미디어 URL을 받지 않습니다.

미디어 Gateway 경로의 `HEAD` 요청은 메타데이터만 반환하며 재생 세션을 만들거나 미디어 바이트를 읽지 않습니다. 실제 `GET` 재생 요청에서만 세션이 생성되고 제한된 콘텐츠를 읽습니다.

`media.probe`를 통한 미디어 탐색은 제한된 메타데이터, 탐색 가능 여부와 구조화된 재생 모드(`direct-range`, `remux`, `transcode`)를 반환합니다. 관리되는 FFmpeg가 정상 상태이면 Core가 제한된 `remux`와 `transcode`를 실행할 수 있습니다. 변환 작업이 완료되면 짧은 수명의 불투명한 `outputId`가 반환되며 플러그인은 `media.readOutput`으로 청크를 읽거나 Core 인증 재생 경로를 사용할 수 있습니다. VOD HLS는 아래의 범위 제한 세션 API로 제공되며 라이브 HLS는 현재 계약에 포함되지 않습니다. 플러그인은 FFmpeg, 호스트 경로 또는 임의 명령 실행 권한을 받지 않습니다.

`media.requestTransform`은 미디어 ID와 제한된 출력 프로필만 받습니다. Core가 미디어와 모드를 검증한 후 현재 범위에 묶인 취소 가능한 작업을 생성하며, 소스 경로, 실행 파일 인자, URL 또는 셸 조각은 받지 않습니다.

변환 결과는 조직, 사용자, 장치 및 설치 인스턴스 범위로 격리되고 자동 만료되며 취소할 수 있습니다. Core는 인증된 `GET`/`HEAD /api/media/outputs/:id`와 제한된 Range 읽기를 제공합니다. 만료, 취소, 부재 또는 범위 밖 결과는 호출자에게 동일하게 사용할 수 없는 것으로 처리됩니다.

`media.requestHls`는 짧은 수명의 범위 제한 VOD 세션을 만들고 Core가 생성한 playlist 및 segment token을 반환합니다. `media.readHlsAsset`은 이 token에 대한 제한된 Range 읽기만 허용하며 플러그인은 출력 디렉터리, 파일 템플릿, 프로토콜, 필터 또는 FFmpeg 인자를 선택할 수 없습니다. HLS 세션은 만료 또는 취소 시 정리되며 영구 미디어 URL이 아닙니다.

## 개인 데이터 API

`db`는 데이터베이스 연결이 아니라 제한된 논리 데이터 저장소를 부여합니다. Core는 각 읽기와 쓰기를 현재 조직, 사용자 및 플러그인 설치 인스턴스에 바인딩합니다. 플러그인은 다른 사용자를 선택하거나 schema를 지정하거나 DSN을 받거나 임의 SQL을 실행할 수 없습니다. Core가 SQLite, PostgreSQL 또는 운영자가 관리하는 호환 데이터베이스를 사용해도 SDK 의미는 동일합니다.

데이터 목록은 결정적입니다. 레코드는 key 순서로 반환되며 `prefix`는 SQL 패턴이 아니라 리터럴 key 접두사로 일치합니다. 따라서 데이터베이스 백엔드가 달라도 동작이 동일합니다.

WDR Media는 이 API로 재생 기록을 저장합니다. 저장소 루트, 미디어 변환 및 서비스 바인딩은 Core capability가 관리하므로 플러그인은 호스트 경로, 상류 Cookie 또는 서비스 자격 증명을 받지 않습니다.

운영자는 Core에서 현재 사용자의 특정 플러그인 설치 데이터만 내보내거나 삭제할 수 있습니다. 내보내기는 제한된 논리 레코드와 마이그레이션 메타데이터를 포함하며 최대 10,000개 레코드 또는 4MiB로 제한되고 `no-store` 캐시 정책을 사용합니다. 삭제는 명시적인 확인이 필요하며 Core의 하나의 트랜잭션에서 레코드와 마이그레이션 메타데이터를 함께 삭제합니다. 이 작업은 플러그인이 사용자, 조직, 설치 ID, 스키마 또는 SQL을 지정하도록 허용하지 않습니다.

중지, 제거 및 데이터 삭제는 서로 다른 수명 주기 작업입니다. 제거하려면 먼저 설치를 중지해야 하며, 제거는 활성 경로와 런타임 권한을 없애지만 명시적으로 삭제할 때까지 해당 설치 범위의 데이터를 보존합니다. 같은 패키지 버전을 다시 설치하면 새로운 설치 ID가 부여됩니다.

## 어댑터 배포

플러그인 카탈로그는 네이티브 미디어 애플리케이션, 로컬 서비스 브리지, 상류 어댑터, 브라우저 브리지 및 커뮤니티 패키지를 구분합니다. 카탈로그 항목은 코드 실행 승인이 아닙니다. 브라우저 ID, 외부 네트워크, 미디어 추출 또는 고위험 상류가 필요한 패키지는 격리 런타임, 명시적 capability 검토 및 공개 배포 전 전용 누출·롤백 테스트가 필요합니다.

공개된 `browser-session-contract-example`은 격리 Worker, Core Broker 및 Gateway 경로를 통해 불투명 세션과 제한된 작업 메타데이터를 검증했지만 실제 브라우저를 시작하거나 상위 웹사이트에 연결하지 않으며 브라우저 자동화나 로그인 상태 통합이 아닙니다.

머신에서 검증 가능한 v0 매니페스트와 오류 목록은 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk)에 있습니다.

공식 플러그인 모음은 `dist/packages/<plugin-id>` 아래에 설치 가능한 패키지를 생성합니다. 패키지에는 매니페스트, 컴파일된 `worker.js` 진입점, 선택적 UI, 다국어 README와 Worker를 독립적으로 로드하는 번들 `@carmediahub/sdk` 런타임이 포함됩니다. Worker를 로드하기 전에 실제 SDK 버전이 매니페스트에 선언된 범위를 만족하는지 패키지별로 검증하며 Plugins monorepo의 모듈 해석에 의존하지 않습니다. [`carmediahub-plugins`](https://github.com/CarMediaHub/carmediahub-plugins)에서 `pnpm build`와 `pnpm verify:packages`를 실행한 뒤 Core staging에 패키지를 배치합니다.

네트워크 플러그인은 service binding과 상대 경로를 사용하는 `network.request`만 호출할 수 있습니다. 설치 인스턴스 전용 binding이 우선하며, Core 전역 binding은 플러그인 Manifest의 `serviceBindings`에 이름을 명시한 경우에만 사용할 수 있습니다. 설치 인스턴스를 선택하지 않고 이름도 선언하지 않으면 binding은 Core 전용으로 플러그인 요청에 노출되지 않습니다. 임의 URL, 호스트명, 포트, 자격 증명, 소켓 또는 제한되지 않은 헤더를 제출할 수 없습니다. 상류 어댑터는 배포 전에 격리 런타임, 정보 유출 및 장애 테스트를 통과해야 합니다.

상류 로그인 상태가 필요한 플러그인은 `secrets` capability를 선언해야 합니다. 관리자는 Core 관리 화면에서 Cookie 또는 Authorization 값을 입력하며, 플러그인은 불투명한 `credentialRef`만 받습니다. Core가 바인딩된 요청의 마지막 단계에서 값을 주입하므로 평문은 Worker, SDK 반환값 또는 플러그인 데이터에 들어가지 않습니다. 참조는 조직, 사용자 및 설치 인스턴스에 바인딩되고 폐기 즉시 사용할 수 없으며, 플러그인이 Cookie 또는 Authorization 헤더를 덮어쓸 수 없습니다.

운영자는 관리 패널에서 개별 binding의 상태를 확인할 수 있습니다. Core는 제한된 `HEAD` 요청을 보내며 리디렉션을 따르거나 응답 본문을 반환하지 않습니다. 결과에는 연결 가능 여부, 가능한 경우 HTTP 상태 및 지연 시간만 포함됩니다. 상태 확인은 플러그인 네트워크 권한을 부여하지 않습니다.

리디렉션은 Core가 처리합니다. GET과 HEAD만 최대 3회까지 따를 수 있으며 모든 대상은 binding origin을 유지해야 합니다. 교차 출처 리디렉션과 다른 메서드의 리디렉션은 거부됩니다.

Core는 binding마다 활성 요청을 최대 10개로 제한하고 1 MiB를 초과하는 응답 본문을 거부합니다. 성공, 실패, 시간 초과 또는 취소 시 할당량은 해제됩니다.

저장소의 `service-binding-adapter-example`은 중립적인 참조 구현입니다. 특정 웹사이트를 대상으로 하지 않으며 공개 프록시를 제공하지 않습니다.
