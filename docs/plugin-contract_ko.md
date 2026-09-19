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

머신에서 검증 가능한 v0 매니페스트와 오류 목록은 [`carmediahub-sdk`](https://github.com/CarMediaHub/carmediahub-sdk)에 있습니다.
