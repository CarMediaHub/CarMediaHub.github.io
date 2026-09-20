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

## 개인 데이터 API

`db`는 데이터베이스 연결이 아니라 제한된 논리 데이터 저장소를 부여합니다. Core는 각 읽기와 쓰기를 현재 조직, 사용자 및 플러그인 설치 인스턴스에 바인딩합니다. 플러그인은 다른 사용자를 선택하거나 schema를 지정하거나 DSN을 받거나 임의 SQL을 실행할 수 없습니다. Core가 SQLite, PostgreSQL 또는 운영자가 관리하는 호환 데이터베이스를 사용해도 SDK 의미는 동일합니다.

WDR Media는 이 API로 재생 기록을 저장합니다. 저장소 루트, 미디어 변환 및 서비스 바인딩은 Core capability가 관리하므로 플러그인은 호스트 경로, 상류 Cookie 또는 서비스 자격 증명을 받지 않습니다.

머신에서 검증 가능한 v0 매니페스트와 오류 목록은 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk)에 있습니다.
