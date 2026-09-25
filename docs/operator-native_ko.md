# Native 배포

상태: v0 초안

Native 배포는 운영자가 관리하는 Windows 또는 Linux 호스트에서 Core를 직접 실행합니다. 명시적 JSON 구성 계약을 사용하고 Core Gateway를 유일한 공개 애플리케이션 진입점으로 유지하십시오.

## 현재 계약

`config/core.example.json`을 사용하고 `config/core.schema.json`으로 검증하십시오. 기본 `config/core.json`과 상대 `dataDir` 경로는 설치 번들 루트를 기준으로 하며 서비스 관리자의 작업 디렉터리에 의존하지 않습니다. 다른 위치의 구성은 `--config <경로>`로 명시합니다. Native bundle에는 Core CLI, 관리 화면 리소스, 컴포넌트 카탈로그, 스키마, 예제 구성, Core 런타임 의존성, 버전이 고정된 `@carmediahub/sdk` 런타임과 런타임 메타데이터가 있어야 하며, 인스턴스 구성과 `.env`는 포함하지 않습니다. 엄격한 릴리스 번들은 의존성 심볼릭 링크가 아닌 실제 파일을 포함해야 하며, 저장소 검사는 소스 트리의 패키지 관리자 링크에 한해서만 허용합니다.

Windows에서는 서비스 등록 계약이 Node, bundle, 데이터 디렉터리와 구성 파일의 절대 경로로 명시적인 `sc.exe` 인자를 생성합니다. Core의 loopback 기본값을 사용하며 PATH나 환경 변수를 읽지 않습니다. 현재 저장소는 이 계약과 테스트만 제공하며 Windows 서비스를 자동으로 설치하거나 변경하지 않습니다.

Core를 빌드한 후 `pnpm create:native-bundle -- <절대 출력 디렉터리>`를 실행하면 소스 트리 밖에 독립적인 릴리스 디렉터리를 만들 수 있습니다. 이 명령은 릴리스 산출물만 복사하고 패키지 관리자 링크를 실제 파일로 변환합니다. 배포 전에 생성된 디렉터리에 `pnpm check:native-bundle`을 실행하십시오.

## 아직 출시 약속이 아님

Native 설치 관리자, 서비스 계정 및 ACL 설정, 시스템 서비스 설치, 깨끗한 시스템 설치, 컴포넌트 배포, 업데이트, 롤백과 플랫폼 간 복구는 별도의 출시 기준입니다. 저장소에는 Windows `sc.exe` 및 Linux systemd 생성 계약이 있지만 호스트에 적용하지는 않습니다. 이 기준이 완료되기 전에는 데이터베이스, Worker, 플러그인 또는 디버그 포트를 인터넷에 공개하지 마십시오.

dry-run 계획에는 직렬화된 작업 목록이 포함됩니다. 향후 권한 있는 설치 프로그램이 계획을 소비하기 전에 Core가 플랫폼 명령 허용 목록, 인자 바이트, 멱등성 모드와 stdin 경계를 다시 검증합니다. 이는 실행 경계를 보호하지만 Native 서비스 등록이나 ACL 적용이 호스트에서 완료되었다는 뜻은 아닙니다.

Native bundle에는 `config/native-install-plan.schema.json`이 포함되어 외부 설치 프로그램이 권한 있는 작업을 실행하기 전에 계획 구조를 독립적으로 검증할 수 있습니다.

공개 사본은 [`/schemas/native-install-plan.schema.json`](/schemas/native-install-plan.schema.json)에서 제공합니다.
