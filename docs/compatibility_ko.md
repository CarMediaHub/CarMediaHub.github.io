# 호환성 매트릭스

이 표는 자동화 계약 증거와 실제 배포 증거를 구분합니다. `Verified`는 반복 가능한 저장소 테스트, `Fixture`는 로컬 대체물로 경계 검증, `Pending`은 아직 릴리스 약속이 없음을 뜻합니다.

| 영역 | 현재 상태 | 증거와 경계 |
| --- | --- | --- |
| Node.js Core 런타임 | 검증됨 | 지원 개발 호스트에서 TypeScript 빌드와 Core `188/188` 회귀. |
| SDK와 Wire Protocol v0.1 | 검증됨 | SDK `48/48`, Manifest/오류/Wire 계약, locale 계약 일치성, capability 컨텍스트 검증과 Memory Runtime 테스트. |
| 공식 플러그인 패키지 | 검증됨 | 8개 패키지 Manifest, 카탈로그 정렬과 패키지 검증 통과; 브라우저 보조 미디어 패키지는 아직 T2 계약 예제이며 실제 상류에 연결하지 않습니다. |
| Windows Native | Bundle 및 복구 smoke | Bundle, 서비스 계획, 리소스 검사와 복구 후 시작은 통과했지만 서비스 등록, ACL 쓰기와 자동 롤백은 아직 보류입니다. 설치 실패 시 적용된 작업 진단을 제공하며 운영자가 상태에 따라 복구해야 합니다. |
| Docker | CI 증거 | Linux CI에서 hardened 이미지, bootstrap/readiness/백업 복구를 실행하며 로컬 Docker와 업그레이드는 보류. |
| Linux/NAS | 계약만 있음 | 명시적 구성과 플랫폼 role은 있으나 대상 설치, 서비스 계정, 저장소와 복구는 보류. |
| SQLite | 검증됨 | Schema v1 gate, migration ledger, 범위 데이터와 백업/복구 테스트. |
| PostgreSQL | Adapter/CI fixture | 범위 adapter와 CI smoke는 있으나 기본 Compose와 NAS 운영 매트릭스는 보류. |
| MySQL | Core adapter/계약 fixture | 명시적 Core 관리 adapter와 범위 테스트가 있으며 실제 MySQL 서비스, 백업과 NAS 매트릭스는 보류. |
| Chromium/브라우저 브리지 | 계약/fixture | target allowlist, 무음 관리 드라이버, 작업/결과 경계와 Worker fixture 통과; Chromium 서명 배포, 실제 탐색과 크로스 플랫폼은 보류. |
| 미디어 재생 | Core/fixture | Range, remux, transcode, HLS와 WDR 계약 테스트 통과; 실제 차량, 모바일과 데스크톱 재생은 보류. |
| AList/rclone/Mihomo | 브리지 fixture | 제한된 service binding adapter가 로컬 HTTP fixture에서 통과; 공식 바이너리 배포와 운영 배치는 보류. |

릴리스 후보 전에는 클린 Windows Native, Docker, Linux/NAS 각각 한 대상과 데스크톱·모바일·차량 브라우저 재생 경로를 검증해야 합니다. 각 결과에 버전, 구성 요소 digest, 구성 방식, 날짜와 알려진 제한을 기록하십시오.

Fixture만으로 OS, 브라우저, 상위 사이트 또는 미디어 형식 지원을 추론하지 마십시오. `Pending`은 숨겨진 약속이 아니라 명시적인 제품 경계입니다.
