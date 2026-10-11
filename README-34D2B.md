# V0.34D2B — Civilian Settlement Consistency & Housing Diagnostics

## 목표 및 상태

기준 버전 V0.34D2A. 구현 완료·기본 회귀시험 PASS, 60~75년 장기 검증은 미완료이며 D2 계열은 미마감입니다.

## 1. 민간 생활권과 V0.28 이주

기존 V0.28 `internalMigration()`은 같은 활성 Settlement 소속의 두 타일도 별개의 이주 후보로 평가할 수 있었습니다. D2B는 목적지가 출발지와 동일한 `settlementId`인 경우 후보를 건너뜁니다. 타국·타 Settlement 간 이주 및 식량·사회 조건은 전면 변경하지 않았습니다. 선택된 실질 이주 경로만 Person `homeTileId`를 갱신하고, 그 외에는 건물 위치·국토·군사 이동 규칙을 유지합니다.

## 2. Person 일일 주거 및 V0.28 통계

V0.27 `Person.metabolism()`의 활성 수용량, `targetHappiness27()`의 실효 수용량을 D2A 공동 주거 API에 연결했습니다. 일일 효과는 기존 스트레스 누적·회복 계수를 그대로 사용합니다. 역사적 누적 스트레스가 현재 과밀을 뜻하지 않으므로 V0.28 `housingStrainedResidents28`에는 현 시점의 활성 주거 부족 여부를 반영하고, 누적 `housingStrainDays>20`은 D2B 감사의 `housingStrainByNation`에 별도 노출합니다.

## 3. 착공 진단

기존 D2A의 `houseAttempts/houseRejected`는 누적 횟수만 제공하고 최근 시도를 덮어쓰는 방식이었습니다. D2B는 Settlement 목적의 HOUSE, LAND, UPGRADE 시도를 실제 함수 실행에 동반하여 `v034d2bHousingDiagnostics`에 누적 기록합니다. 코드가 확인한 정확한 하위 거절 게이트: `NO_TILE`, `FOREIGN_TILE`, `ALREADY_BUILT`, `SITE_PROJECT_PENDING`, `PROJECT_CAP`, `NO_BUILD_SPACE`, `STRATEGIC_RESERVE`, `PAYMENT_OR_MATERIAL`, `NO_COST_DEFINITION`. 상위 원인을 확정할 수 없으면 `UNRESOLVED_UPSTREAM_GATE` 등으로 남깁니다. `PAYMENT_OR_MATERIAL`은 Gold와 자원을 구별할 수 없는 실제 결제 함수 실패를 의미합니다.

코드는 추가적인 자원 소비, Gold 지급, 건설 시도 또는 RNG 소비를 하지 않고 실제 착공의 반환 결과를 관측합니다. 집계는 현재 런타임 세션의 World 객체 기준이며 저장·복원 후 과거 진단 횟수는 자동 연결되지 않습니다.

## 4. 호환성과 의도적인 유보

C1H 원본 JS 165블록, CSS 4블록의 해시는 보존됩니다. Hosted·Standalone 두 빌드에 동일한 D2B 연결 코드를 적용합니다. Settlement 주거 수용량 계산/경제·교역·군사/건설비/건설 슬롯 3~11 공식은 D2A와 동일합니다. Snapshot CSV V2 1,683열, D1A Settlement 48열, D2 Housing 11열 구조를 유지합니다. D2B 세이브만 지원합니다.

## 5. 검증 및 남은 문제

현재 시나리오 시험은 2타일 공동 주거 15명/40명분, 27일일 스트레스 해소, V0.28 주거 압박 0명, 동일 Settlement 이주 후보 12건 제외·실제 이주 0건, 슬롯 차단 `PROJECT_CAP` 기록을 확인했습니다. 120일 동일 초기 조건 반복 진행 상태·난수 일치 및 Chromium PC·모바일은 통과했습니다.

더 긴 고정 시드 실행에서는 진행 중단을 재현했으며 D2A 비교 실행에도 유사 중단이 있어 원인과 영향 범위는 아직 특정하지 못했습니다. 이 불확실성 때문에 D2 전체 CLOSED 판정을 유보합니다. 실제 사용자 자연주행 1~4년 데이터로 다음 검증을 권장합니다.
