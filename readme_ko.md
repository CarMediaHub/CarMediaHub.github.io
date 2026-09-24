# CarMediaHub 문서

CarMediaHub 사용자와 플러그인 개발자를 위한 공개 문서입니다.

언어: [English](readme.md) · [简体中文](readme_zh.md) · 한국어

상태: v0 초안

| 주제 | 설명 |
|---|---|
| [아키텍처](docs/architecture_ko.md) | Core, 게이트웨이, 런타임 그룹, ID, 데이터와 배포 경계 |
| [플러그인 계약](docs/plugin-contract_ko.md) | 패키지, 수명 주기, capability와 IPC 계약 |
| [보안 모델](docs/security_ko.md) | capability-first 기본 규칙과 운영자 책임 |
| [프로젝트 유래](docs/project-origin_ko.md) | 차량용 미디어, 기반 서비스와 호환성 플러그인을 결합하는 이유 |
| [프로젝트 목표](docs/project-goals_ko.md) | 사용자 결과, 플랫폼 목표와 비목표 |
| [문서 사이트 지도](docs/documentation-map_ko.md) | 사용자, 운영자, 개발자, 기여자와 참고 자료 경로 |

이 v0 초안에는 설치, 관리, 운영 또는 API 참고 자료가 포함되어 있지 않습니다.

## 로컬 검증

```powershell
pnpm install
pnpm verify
```

`pnpm verify`는 Astro 검사, 영어·중국어·한국어 문서 묶음 검증과 정적 빌드를 실행합니다.
