# 오류와 이벤트

SDK 오류와 도메인 이벤트는 버전이 지정된 데이터 계약입니다. 클라이언트는 예외 문구, URL 또는 호스트 세부 정보가 아니라 안정적인 `code`를 기준으로 처리해야 합니다. 모든 SDK capability 호출이 Core 오류를 받으면 이 envelope를 `CmhError`로 보존합니다. data, job, media, browser, history, catalog, notification, network 호출이 모두 같은 규칙을 사용합니다.

## 오류 envelope

```json
{
  "code": "CMH.JOBS.QUEUE_FULL",
  "messageKey": "errors.jobs.queueFull",
  "retryable": true,
  "diagnosticId": "diag_jobs_queue_full",
  "details": { "limit": 10 }
}
```

- `code`는 안정적인 머신 식별자입니다.
- `messageKey`는 현재 플랫폼 locale로 해석하는 번역 키입니다.
- `retryable`은 Core의 정책 힌트이며 무제한 재시도를 허용하지 않습니다.
- `diagnosticId`는 운영자 보고서에 포함해도 안전합니다.
- `details`는 제한된 비밀 없는 값만 포함하며 없을 수도 있습니다.

`retryable`이 true인 오류만 제한된 backoff로 재시도합니다. 사용자가 취소하거나 deadline이 만료되거나 설치가 revoke되면 중지합니다. 원본 요청, 자격 증명, Cookie, Profile 데이터, 경로 또는 상위 응답 본문을 로그에 남기지 마십시오.

v0 카탈로그는 범위, capability, 페이지, protocol, 작업, 미디어, 네트워크, 저장소, 브라우저와 카탈로그 오류를 포함합니다. 예시는 `CMH.DB.SCOPE_DENIED`, `CMH.CAPABILITY.DENIED`, `CMH.PROTOCOL.DEADLINE_EXCEEDED`, `CMH.JOBS.INTERRUPTED`, `CMH.MEDIA.QUOTA_EXCEEDED`, `CMH.BROWSER.GRANT_REQUIRED`입니다. 알 수 없는 code는 일반화된 현지화 오류로 표시하고 `diagnosticId`를 함께 보고합니다.

네트워크 오류는 다음의 안정적인 의미를 사용합니다.

| Code | 재시도 정책 | 의미 |
| --- | --- | --- |
| `CMH.NETWORK.TARGET_DENIED` | 재시도하지 않음 | 요청 경로가 service binding 정책 밖에 있거나 binding을 사용할 수 없습니다. |
| `CMH.NETWORK.QUOTA_EXCEEDED` | 제한된 backoff 후 재시도 | 조직/사용자/설치 인스턴스/binding 범위의 동시성 quota가 가득 찼습니다. |
| `CMH.NETWORK.RESPONSE_TOO_LARGE` | 재시도하지 않음 | upstream 응답이 Core의 제한된 응답 크기를 초과했습니다. |

플러그인은 이 오류를 upstream URL, header, Cookie 또는 응답 본문으로 변환하여 로그에 남기면 안 됩니다.

## 이벤트 envelope

```json
{
  "eventId": "opaque-id",
  "occurredAt": "2026-09-24T00:00:00.000Z",
  "scope": { "deploymentId": "...", "organizationId": "...", "userId": "...", "installationId": "..." },
  "producer": "wdr-media",
  "schemaVersion": 1,
  "type": "media.ready",
  "payload": { "subject": "opaque-reference" }
}
```

이벤트는 현재 조직, 사용자와 설치 범위로 제한됩니다. payload는 크기가 제한되어야 하며 자격 증명, 호스트 경로, 임의 상위 URL 또는 원본 미디어를 포함하지 않아야 합니다. 이벤트는 알림으로 취급하고 범위가 지정된 data API에 멱등 상태를 저장하며 중복/지연 전달을 허용하십시오. 컨텍스트나 capability가 revoke되면 이전 참조를 사용할 수 없게 될 수 있습니다.

[API 참고](./api_ko.md), [Capability 카탈로그](./capabilities_ko.md)와 SDK `errors.json`에서 버전 카탈로그를 확인하십시오.
