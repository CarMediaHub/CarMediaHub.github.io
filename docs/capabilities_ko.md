# Capability 카탈로그

Capability는 서명된 Manifest의 명시적 요청입니다. Core는 조직, 사용자와 플러그인 설치 인스턴스별로 권한을 부여합니다. `WorkerClient`는 논리 API만 제공하며 데이터베이스 연결, 호스트 파일 시스템, 프로세스 핸들, 브라우저 Profile 또는 임의 명령 채널을 노출하지 않습니다.

| Capability | SDK 표면 | 경계 |
| --- | --- | --- |
| `config` | 플랫폼 설정 API | 검증된 플러그인 설정만 제공하며 비밀이나 환경 변수는 제공하지 않습니다. |
| `secrets` | 자격 증명 참조 | Core가 평문을 저장하고 통제된 마지막 홉에서만 주입하며 플러그인은 읽을 수 없습니다. |
| `db` | `database()` | 범위가 지정된 논리 컬렉션·레코드·마이그레이션이며 DSN, Schema, SQL은 없습니다. |
| `storage` | 미디어/저장소 계약 | 운영자가 승인한 불투명 핸들만 사용하며 호스트 경로는 허용하지 않습니다. |
| `media` | probe, playback, transform, HLS | Core 소유 세션, 제한된 Range 읽기와 관리형 FFmpeg 작업. |
| `media-source` | 목록, stat, probe, playback, read | 읽기 전용 불투명 source/item 핸들, 자격 증명은 Core에 보관. |
| `history` | 기록, 조회, 삭제 | 현재 사용자와 설치 범위의 기록만 허용. |
| `catalog` | 등록, 조회, 제거 | 범위가 지정된 검색 항목, 인덱스와 삭제는 Core가 담당. |
| `display` | capability와 모드 의도 | 장치 컨텍스트와 전체 화면 의도만 제공. |
| `jobs` | 등록, 목록, 취소 | Core가 관리하는 제한된 비동기 작업이며 실행기나 Shell은 없음. |
| `events` | 발행과 컨텍스트 갱신 | 범위가 지정되고 크기가 제한된 도메인 이벤트. |
| `diagnostics` | 제한된 진단 작업 | 안정적인 코드와 비식별 메타데이터만 제공. |
| `gateway` | 플러그인 route 처리 | 단일 Core 진입점의 선언된 논리 route와 메서드. |
| `network` | 바인딩된 원본 요청 | 운영자가 승인한 서비스 바인딩과 필터된 헤더/메서드이며 일반 프록시가 아님. |
| `browser` | 불투명 세션과 작업 | 등록된 HTTPS target, Core Worker와 제한 결과, Cookie/Profile/CDP 없음. |
| `transfer` | 관리형 전송 계약 | Core 제어 전송 리소스와 quota이며 임의 Socket 리스너 없음. |

플러그인은 사용자 기능에 필요한 최소 capability만 요청해야 합니다. `serviceBindings`에는 `network`가 추가로 필요하며 바인딩 이름은 URL, 자격 증명 또는 Socket 경로가 아닙니다. 공유 어댑터 호스트는 SDK 검증기가 허용한 저위험 capability만 사용할 수 있습니다.

Capability를 취소하면 종속 작업, 세션, 자격 증명과 바인딩이 취소되거나 닫힙니다. 설치 권한을 줄이는 것은 패키지 변경 없이 적용되지만 권한을 늘리려면 검토된 Manifest와 관리자 작업이 필요합니다.

[Manifest](./manifest_ko.md), [수명 주기](./lifecycle_ko.md)와 [API 참고](./api_ko.md)를 함께 확인하십시오.
