# 플러그인 수명 주기

Core가 플러그인 수명 주기를 소유합니다. 플러그인은 버전이 지정된 패키지와 범위가 지정된 설치 인스턴스로 구성되며 Worker는 자체 공개 여부, 재시작 정책 또는 데이터 삭제를 결정하지 않습니다.

## 상태와 전환

```text
staged -> installed -> enabled -> draining -> disabled
                         |          |
                         v          v
                    uninstalled <- disabled
```

- **staged**: 서명, 다이제스트와 Manifest 검증을 기다리는 패키지 상태입니다.
- **installed**: 검증된 패키지와 설치 기록이 있지만 route가 반드시 활성화된 것은 아닙니다.
- **enabled**: Core가 선언된 runtime만 시작하고 선언된 route와 허가된 capability만 노출합니다.
- **draining**: 새 작업을 거부하면서 활성 Gateway 스트림, 작업, 브라우저 세션과 미디어 세션을 취소합니다.
- **disabled**: Worker가 중지되고 route가 닫히며 설치 데이터는 보존됩니다.
- **uninstalled**: 앱 진입점과 runtime이 닫힙니다. 플러그인 데이터는 별도 확인 전까지 보존됩니다.

설치, 활성화, 비활성화와 제거는 관리자 작업입니다. 플러그인은 스스로 활성화할 수 없으며 서명된 Manifest보다 넓은 capability를 요청할 수 없습니다. 설치별 허가는 줄일 수 있지만 새 패키지 검토 없이 늘릴 수 없습니다.

## 상태와 재시작

Core는 등록된 runtime factory 또는 다이제스트가 검증된 구성 요소만 시작합니다. 상태는 제한된 값(`starting`, `healthy`, `stopping`, `failed`, `stopped`)과 재시도 메타데이터로 표현하며 명령줄, 호스트 경로, 자격 증명과 상위 오류 원문을 노출하지 않습니다. 충돌에는 제한된 backoff를 사용하고 반복 실패 플러그인은 무한 재시작 대신 운영자 검토를 위해 비활성화합니다.

## 업그레이드와 롤백

업그레이드는 새 패키지를 별도 staging에 넣고 서명, 다이제스트, SDK 범위와 Manifest를 검증한 뒤 이전 설치를 drain하고 논리 진입점을 전환합니다. 새 인스턴스가 health check를 통과하기 전에는 이전 패키지와 데이터를 삭제하지 않습니다. 활성화에 실패하면 이전 설치를 계속 활성화하고 비식별 감사 이벤트를 기록합니다. 데이터 마이그레이션은 버전과 범위를 가지며 멱등적이고 Core는 SQL이나 데이터베이스 연결을 플러그인에 제공하지 않습니다.

## 제거와 데이터

제거는 먼저 해당 설치의 작업, 브라우저 세션, 자격 증명, 미디어 세션과 서비스 바인딩을 drain하고 취소한 뒤 앱 진입점을 닫습니다. 복구와 내보내기를 위해 플러그인 데이터는 보존됩니다. 데이터 삭제는 별도의 명시적 확인이 필요하며 SDK export/delete 계약의 제한을 받습니다.

[Manifest](./manifest_ko.md), [API 참고](./api_ko.md), [플러그인 계약](./plugin-contract_ko.md)과 [개발자 빠른 시작](./developer-quickstart_ko.md)에서 패키지와 capability 세부 사항을 확인하십시오.
