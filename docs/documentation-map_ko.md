# 문서 사이트 지도

상태: v0 초안

`CarMediaHub.github.io`는 프로젝트 전체를 보여 주는 공개 창구입니다. 하나의 문서 체계에서 여러 독자를 지원하면서 제품 약속, 배포 경계, SDK 계약과 보안 규칙을 일관되게 유지합니다.

## 독자별 시작점

| 독자 | 시작 문서 | 주요 질문 |
|---|---|---|
| 일반 사용자 | [프로젝트 유래](project-origin_ko.md), [프로젝트 목표](project-goals_ko.md)와 사용자 안내 | CarMediaHub는 무엇이며 무엇을 준비해야 하나요? |
| 운영자 | [운영 서비스와 바인딩](operator-services_ko.md), [백업과 복구](operator-backup_ko.md) 및 배포 안내 | 설치, 보안 강화, 서비스 연결, 백업, 업데이트와 진단은 어떻게 하나요? |
| 플러그인 개발자 | [플러그인 계약](plugin-contract_ko.md), [Manifest](manifest_ko.md)와 [API](api_ko.md) 참고 | 플러그인을 개발, 격리, 테스트, 배포하고 유지하려면 어떻게 하나요? |
| 기여자 | 거버넌스와 엔지니어링 참고 | 변경 사항은 어떻게 검토, 배포, 기록하고 지원하나요? |

## 예정 섹션

페이지별 목록, 담당자, 언어 상태와 출시 게이트는 거버넌스 저장소에서 관리합니다. 공개 사이트는 아래의 사용자, 운영자, 개발자, 참고 자료와 커뮤니티 섹션부터 단계적으로 확장합니다.

```text
사용자
  개요 -> 프로젝트 유래 -> 목표와 경계 -> 설치 -> 초기 설정
  -> 일상 사용 -> 미디어 재생 -> 문제 해결 -> 개인정보와 책임

운영자
  요구 사항 -> [Docker](operator-docker_ko.md) -> [Native](operator-native_ko.md) -> 네트워크 진입점 -> [서비스와 바인딩](operator-services_ko.md)
  -> [구성](operator-config_ko.md) -> [백업과 복구](operator-backup_ko.md) -> 업데이트 -> 진단
  -> 인증 -> 백업과 복구 -> 업데이트 -> 진단

개발자
  SDK 시작하기 -> [Manifest](manifest_ko.md) -> [수명 주기](lifecycle_ko.md) -> [컨텍스트와 국제화](context-i18n_ko.md) -> [Capability](capabilities_ko.md)
  -> 데이터와 작업 -> UI -> 프록시 어댑터 -> 네이티브 플러그인
  -> 테스트 -> 패키징, 서명과 보안 보고서

참고
  [API](api_ko.md) -> [오류와 이벤트](errors-events_ko.md) -> [구성](configuration_ko.md) -> [호환성 매트릭스](compatibility_ko.md)
  -> 알려진 제한 -> 버전과 마이그레이션
```

공개 사이트는 지원되는 동작과 사용자의 책임을 설명합니다. 비공개 구현 메모, 배포 비밀, 내부 경로와 미완성 제품 실험은 이 사이트에 포함하지 않습니다.
