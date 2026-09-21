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

## Capability 모델

SDK는 설정, 개인 데이터, 저장소, 미디어, 작업, 기록, 카탈로그, 표시, 이벤트, 진단, 게이트웨이 경로, 네트워크, 브라우저 세션과 관리형 전송을 범위가 제한된 capability로 제공합니다. 민감한 capability는 명시적으로 선언하고 승인하기 전까지 비활성화됩니다.

`jobs` capability는 현재 사용자와 플러그인 설치 인스턴스의 범위 안에서만 작업을 실행합니다. 초기 한도는 범위마다 활성 작업 10개이며 JSON payload와 결과는 각각 64 KiB로 제한됩니다. 한도를 초과하면 안정적인 오류 코드 `CMH.JOBS.QUEUE_FULL`, `CMH.JOBS.PAYLOAD_TOO_LARGE` 또는 `CMH.JOBS.RESULT_TOO_LARGE`를 반환합니다. 호출자는 카탈로그의 message key를 사용하고 사용자 문구를 하드코딩하지 않아야 합니다.

`history` capability는 동일한 범위의 Worker 계약으로 `record`, `query`, `clear`를 제공합니다. Core는 주제, 경로, 제목, 카테고리, 장치와 시간의 최소 필드만 저장하며 플러그인은 다른 사용자나 설치 인스턴스를 선택할 수 없고 데이터베이스 연결도 받지 않습니다.

`catalog` capability는 `register`, `query`, `remove`로 검색 가능한 플러그인 항목을 제공합니다. Core는 필터링 전에 범위와 권한을 확인하며 플러그인은 메타데이터와 경로만 제출하고 SQL 또는 제한 없는 색인 조회를 사용할 수 없습니다.

`display` capability는 읽기 전용 표시 기능과 `normal`/`fullscreen` `requestMode` 의도를 제공합니다. 장치가 지원하지 않으면 Core가 전체 화면을 거부할 수 있으며 플러그인은 브라우저 창을 제어할 수 없습니다.

알림 API는 플랫폼 이벤트 capability를 통해 제공됩니다. 플러그인은 길이가 제한된 `info`, `success`, `warning`, `error` 알림을 게시하고 현재 사용자와 설치 인스턴스 범위의 알림만 조회하거나 읽음 처리할 수 있습니다. 저장과 사용자 표시 전달은 Core가 담당하며 플러그인은 다른 사용자나 설치 인스턴스에 알림을 보낼 수 없습니다.

`media` capability는 불투명한 미디어 ID에 대해 짧은 재생 세션을 만들 수 있습니다. 이후 미디어 읽기는 이 세션을 사용해야 합니다. Core는 세션을 사용자, 장치, 설치 인스턴스와 만료 시간에 바인딩하고 사용자 세션 또는 플러그인 설치가 취소되면 세션을 폐기합니다. 플러그인은 호스트 경로나 재사용 가능한 공개 미디어 URL을 받지 않습니다.

`media.probe`를 통한 미디어 탐색은 제한된 메타데이터, 탐색 가능 여부와 구조화된 재생 모드(`direct-range`, `remux`, `transcode`)를 반환합니다. 현재 Core는 `direct-range`만 제공합니다. 나머지 모드는 향후 Core가 관리하는 작업 실행기가 구현하며, 플러그인에 FFmpeg, 호스트 경로 또는 임의 명령 실행 권한을 부여하지 않습니다.

`media.requestTransform`은 미디어 ID와 제한된 출력 프로필만 받습니다. Core가 미디어와 모드를 검증한 후 현재 범위에 묶인 취소 가능한 작업을 생성하며, 소스 경로, 실행 파일 인자, URL 또는 셸 조각은 받지 않습니다.

## 개인 데이터 API

`db`는 데이터베이스 연결이 아니라 제한된 논리 데이터 저장소를 부여합니다. Core는 각 읽기와 쓰기를 현재 조직, 사용자 및 플러그인 설치 인스턴스에 바인딩합니다. 플러그인은 다른 사용자를 선택하거나 schema를 지정하거나 DSN을 받거나 임의 SQL을 실행할 수 없습니다. Core가 SQLite, PostgreSQL 또는 운영자가 관리하는 호환 데이터베이스를 사용해도 SDK 의미는 동일합니다.

WDR Media는 이 API로 재생 기록을 저장합니다. 저장소 루트, 미디어 변환 및 서비스 바인딩은 Core capability가 관리하므로 플러그인은 호스트 경로, 상류 Cookie 또는 서비스 자격 증명을 받지 않습니다.

## 어댑터 배포

플러그인 카탈로그는 네이티브 미디어 애플리케이션, 로컬 서비스 브리지, 상류 어댑터, 브라우저 브리지 및 커뮤니티 패키지를 구분합니다. 카탈로그 항목은 코드 실행 승인이 아닙니다. 브라우저 ID, 외부 네트워크, 미디어 추출 또는 고위험 상류가 필요한 패키지는 격리 런타임, 명시적 capability 검토 및 공개 배포 전 전용 누출·롤백 테스트가 필요합니다.

머신에서 검증 가능한 v0 매니페스트와 오류 목록은 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk)에 있습니다.
