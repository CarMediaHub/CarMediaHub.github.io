# 플러그인 게시

상태: v0 초안

게시는 재현 가능한 패키지 작업이며 자동 승인이 아닙니다. 패키지는 깨끗한 checkout, 버전이 지정된 SDK, 패키지 내부 상대 entrypoint, 현지화 리소스, 라이선스, checksum, SBOM 및 서명된 release record로 빌드해야 합니다.

Manifest가 `ui.entry`를 선언하면 배포 패키지는 해당 경로를 패키지 내부의 일반 파일로 포함해야 합니다. 게시 전 패키지 검증은 누락된 UI 진입점, 심볼릭 링크, 절대 경로와 패키지 외부로 벗어나는 경로를 거부합니다.

## 패키지 gate

- SDK 버전에 맞춰 manifest와 선언된 capability를 검증합니다.
- 호스트 경로나 검증되지 않은 실행 파일 다운로드 없이 Worker 또는 신뢰된 shared adapter를 빌드합니다.
- 타입, 계약, 격리, 누출, rollback 및 catalog 테스트를 실행합니다.
- 신뢰된 release key로 패키지 digest, SBOM, provenance metadata와 서명을 생성합니다.
- 패키지와 공개 문서만 게시하며 credential, Profile, 로그와 사설 배포 데이터를 포함하지 않습니다.

저장소 카탈로그에는 패키지 경로, 통합 종류, target class, runtime, SDK 범위, 라이선스와 상류 분류를 기록합니다. 또한 논리적 `sourceKey`, 마이그레이션 상태, 구현 방식과 위험 등급을 기록하며, 패키지 gate는 이 값들이 기계 검증 마이그레이션 매트릭스와 일치하는지 확인하고 불일치 시 빌드를 거부합니다. 서명된 release record는 패키지 digest와 provenance를 신뢰된 키에 별도로 연결합니다. 카탈로그 항목은 상위 사이트 작동의 증거가 아닙니다. 브라우저, 외부 네트워크, 미디어 추출과 proxy adapter는 공개 배포 전에 추가 심사를 통과해야 합니다.
