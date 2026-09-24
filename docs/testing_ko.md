# 테스트 및 검증

상태: v0 초안

CarMediaHub는 테스트를 계약의 증거로 취급합니다. 일괄 테스트가 통과해도 해당 환경을 실제로 검증하지 않았다면 배포 방식, 브라우저, 상위 사이트 또는 차량 디스플레이의 지원을 의미하지 않습니다.

## 필수 계층

1. SDK 계약 테스트는 매니페스트 검증, locale 대체, 컨텍스트 전파, Wire 허용 목록, 범위 격리, 제한된 payload, 취소와 메모리 런타임을 다룹니다.
2. Core 테스트는 identity, 권한, 영속성, 플러그인 수명 주기, gateway 필터, service binding, 미디어 Range, 작업, 브라우저 작업 경계, 백업 무결성과 명시적 구성을 다룹니다.
3. Plugins는 패키지 계약 테스트, 타입 검사, 빌드, 카탈로그 검증과 격리 Worker 통합 테스트를 실행합니다. fixture는 실제 브라우저나 상위 사이트 테스트가 아닙니다.
4. 배포 gate는 제출된 Docker 및 Native 사양을 검증하지만 로컬 시스템 서비스 등록을 의미하지 않습니다.

## 릴리스 증거

커밋, 패키지 버전, 플랫폼, 구성 방식, 컴포넌트 digest, 명령, 결과 수와 알려진 제한을 기록합니다. 범위 거부, 철회, 취소, timeout, rollback, 누출과 복구의 실패 경로가 필요합니다. 브라우저 테스트는 음소거하고 호스트 Profile, 임의 URL, CDP 주소 또는 암시적 환경 변수를 사용하지 않습니다.

현재 저장소에는 SDK/Core/Plugins 계약 계층, 하나의 허용된 Origin을 대상으로 한 실제 음소거 Chrome Browser Worker smoke와 정적 배포 gate의 증거가 있습니다. 실제 Windows 서비스 등록, Docker/NAS 설치, 서명 컴포넌트 배포, 더 넓은 Browser Worker 리디렉션/WebSocket/Worker 검증과 데스크톱/모바일/차량 재생은 별도 릴리스 gate로 남아 있습니다.
