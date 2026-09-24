# 플랫폼 컨텍스트와 국제화

Core는 Broker handshake에서 읽기 전용 컨텍스트를 만들고 운영자나 사용자의 설정이 바뀌면 갱신을 보냅니다. 플러그인은 별도의 언어, 테마, 장치 또는 전체 화면 설정을 만들지 말고 이 컨텍스트를 사용해야 합니다.

## 컨텍스트 필드

| 필드 | 의미 |
| --- | --- |
| `scope` | 배포, 조직, 사용자, 장치, 세션과 설치 인스턴스 ID. SDK 호출에 사용하며 위조하거나 확대할 수 없습니다. |
| `locale` | Core가 안정적으로 처리한 `en`, `zh-CN`, `ko`. |
| `timeZone` | 표시와 형식 지정을 위한 검증된 IANA 시간대. |
| `theme` | `light`, `dark`, `system`. |
| `density` | `comfortable`, `compact`. |
| `entry` | 탐색 또는 불투명 key를 통한 진입 방식. |
| `display` | 장치 유형, 입력 방식, viewport와 전체 화면 가능 여부. |
| `grantedCapabilities` | Broker가 제공할 때의 설치 유효 권한이며 읽기 전용. |
| `policyVersion` | 캐시 무효화에 사용하는 증가하는 정책/컨텍스트 버전. |

## 언어와 메시지

Manifest의 이름과 설명은 세 locale을 모두 제공해야 합니다. 런타임 UI는 SDK locale과 안정적인 message-key 카탈로그를 사용합니다. Core는 `zh`를 `zh-CN`, `ko-KR`을 `ko`로 정규화한 뒤 영어로 fallback합니다. 같은 플랫폼 설정에 대해 플러그인이 별도 언어 설정을 요구해서는 안 됩니다.

## 컨텍스트 변경

`onContextChanged`를 등록하고 새 컨텍스트가 오면 UI, 날짜/시간 형식과 표시 결정을 갱신합니다. 여러 구독을 지원하며 disposer 함수를 반환하므로 뷰나 플러그인 소유 구독을 해제할 때 호출해야 합니다. 한 구독자의 예외는 Broker 전송에 영향을 주지 않습니다. ID, 권한 또는 locale을 영구적으로 캐시하지 마십시오. 컨텍스트 변경은 권한을 추가하지 않으며 모든 작업은 Core가 다시 허가합니다. Core와 SDK는 인증된 Worker의 전체 scope와 설치 메타데이터가 일치하는 업데이트만 적용합니다.

## 표시와 차량 동작

`display.capabilities()`로 레이아웃을 선택하고 `display.requestMode("fullscreen")`로 의도를 요청합니다. 결과는 `accepted`, `unsupported`, `user-action-required` 중 하나일 수 있습니다. 차량 지원은 UI/패키지 선언일 뿐 창, 네이티브 화면 또는 원격 제어 API 권한이 아닙니다.

[Capability 카탈로그](./capabilities_ko.md), [Manifest](./manifest_ko.md)와 SDK 타입에서 버전 계약을 확인하십시오.
