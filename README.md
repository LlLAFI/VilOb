# Village Observer V0.32E9

**패치명:** Endpoint / Formation Consistency + E8 Stabilization  
**기준 버전:** V0.32E8  
**날짜:** 2026-09-28

V0.32E9는 V0.32E8 PC 장기주행에서 확인된 기능적 회귀를 닫고, 104년 전후에 나타난 계절 처리 성능 급등을 다음 자연주행에서 직접 분해할 수 있도록 관측 지표를 확장하는 안정화 패치다.

이번 버전은 새로운 시대·콘텐츠를 추가하는 패치가 아니다. 핵심은 다음 다섯 가지다.

1. 승격된 상업시설이 기존 교역 endpoint 기능을 잃는 문제 수정
2. 군사 상세 UI가 야전군을 주둔군에도 중복 표시하는 문제 수정
3. E8 Grand Market 지역권 후보가 실제 착공으로 이어지지 않는 경로 보강
4. Construction Proposal의 `OTHER` 과다 분류 해체
5. `seasonal` 성능을 하위 시스템별로 분해하는 profiler 추가

---

## 1. 교역 endpoint 상속 수정

### 문제

E8 자연주행에서 아렌은 과거 국제교역을 수행했음에도 후기에는 모든 국가에 대해 `교역소/시장 연결 없음`으로 표시되었다. 로그상 경로 거리나 도로 탐색 실패가 아니라 `NO_ROUTE_MARKET`이 주요 원인이었고, 아렌에는 Merchant Guild가 존재했지만 기본 `trading_post` 수가 0이었다.

원인은 상업시설 승격 체계와 교역 endpoint 열거 방식 사이의 불일치였다.

- `trading_post -> merchant_guild`
- `market -> grand_market`

타일의 semantic `hasBuilding()` 판정은 승격시설이 하위 기능을 유지한다고 처리하고 있었지만, 국가의 `tradingPosts()`는 실제 배열에서 `trading_post` 타입만 직접 찾고 있었다. 따라서 마지막 교역소가 Merchant Guild로 승격되면 더 강한 상업시설을 보유하고도 국제교역 endpoint가 0이 될 수 있었다.

### 수정

E9부터 교역 endpoint는 **semantic capability**를 기준으로 열거한다.

- `merchant_guild`는 `trading_post` endpoint 기능을 유지한다.
- `grand_market`은 `market` 기능을 유지한다.
- `Village.tradingPosts()`는 `Tile.hasBuilding('trading_post')` 기반으로 판정한다.
- E9 attach 시 `tradeRouteCache`를 초기화하여 E8에서 이미 캐시된 잘못된 `NO_ROUTE` 결과가 세이브 로드 후 남지 않게 한다.

### 신규 관측값

국가별 snapshot/CSV에 다음 필드가 추가된다.

- `tradeEndpointBase32E9`
- `tradeEndpointPromoted32E9`
- `tradeEndpointTotal32E9`
- `marketEndpointBase32E9`
- `marketEndpointPromoted32E9`
- `marketEndpointTotal32E9`
- `reachableTradeNations32E9`

따라서 이후에는 `승격 교역시설은 있는데 endpointTotal=0` 같은 회귀를 바로 확인할 수 있다.

---

## 2. 군사 Formation / Garrison roster 일치 수정

### 문제

리오의 실제 후기 병력은 다음과 같았다.

- 현역 10명
- 주둔군 5명
- 야전군 5명

지도와 Formation V1 데이터는 위 배치를 정상적으로 표시했지만, 국가 군사 상세 화면의 `리오 제1주둔대`에는 현역 전체 10명이 표시되었다. 아래 야전대 5명도 별도로 표시되므로 UI상 15명이 존재하는 것처럼 보였다.

원인은 V0.32B의 summary 함수가 UI/telemetry 조회 시에도 `syncFormation32B()`를 호출하여 모든 현역을 다시 `CORE_GARRISON`에 집어넣는 **읽기 부작용**이었다. 이후 Formation V1이 실제 배치를 다시 나누더라도 이미 생성된 UI summary에는 중복 roster가 남을 수 있었다.

### 수정

Formation V1이 존재하는 버전에서는 V0.32B summary가 더 이상 구형 garrison sync를 수행하지 않는다.

- `V032D.ensureFormations()`를 우선 사용
- Formation V1이 없는 구형 환경에서만 기존 `syncFormation32B()` fallback 사용
- 주둔 Cohort와 FIELD Cohort를 실제 Person ID 기준으로 검사

### 신규 invariant

국가별 snapshot/CSV에 다음 값이 추가된다.

- `militaryGarrisonManpower32E9`
- `militaryFieldManpower32E9`
- `militaryRosterDuplicates32E9`
- `militaryRosterInvariant32E9`

정상 조건은 다음과 같다.

```text
주둔군 + 야전군 = 현역
중복 Person = 0
militaryRosterInvariant32E9 = 1
```

군사 상세 탭 하단에도 E9 검증 박스를 표시한다.

---

## 3. Grand Market regional trigger -> 실제 specialization 연결

### E8에서 확인된 현상

E8 장기주행에서는 Grand Market 지역권 후보가 반복적으로 잡혔지만 `grandMarketStarts32E8`이 0으로 유지되었다. 일부 Grand Market은 존재했지만 이는 E7 구형 specialization 경로에서 시작된 것이었다.

두 경로가 동시에 존재하면서 다음 문제가 있었다.

1. E7의 구형 tile-local specialization이 E8 지역권 로직보다 먼저 실행될 수 있음
2. E8 `tryCommercial()`이 정렬된 첫 번째 후보만 실질적으로 다루면, 첫 후보가 막힌 경우 뒤의 READY 후보가 굶을 수 있음

### 수정

E9에서는 E8 이상 환경에서 **E8 지역권 상업 specialization이 단일 소유자**가 된다.

- E7 구형 specialization trigger는 `NS.V032E8`이 존재하면 실행하지 않는다.
- E8 `tryCommercial()`은 후보 전체를 순회한다.
- 첫 후보가 FINANCE / PRIORITY 등에 막혀도 뒤의 READY 후보를 검사한다.
- SPACE 준비가 필요한 후보는 기존 공간 준비 경로를 유지한다.
- Grand Market regional candidate 카운터는 UI/telemetry 조회에서 증가하지 않고 실제 계절 specialization 평가에서만 증가한다.

즉 관측 함수 호출 자체가 `grandMarketRegionalCandidates32E8`을 부풀리는 부작용도 제거했다.

---

## 4. Construction Proposal blocker 세분화

### 문제

E8에서 Proposal V1 자체는 실제 착공으로 연결되었지만 blocker의 약 절반이 `OTHER`로 집계되었다. 대표적으로 철광 매장이 없는 국가의 `iron_mine` 제안도 기존 산업 진단에서는 `NO_DEPOSIT`으로 명확했는데 Proposal schema에서는 `OTHER`로 축약되었다.

### 수정

E9에서는 다음 원인을 별도로 보존한다.

- `NO_DEPOSIT`
- `NO_SITE`
- `SATISFIED`

기존 blocker 역시 유지한다.

- `READY`
- `PROJECT_CAP`
- `FINANCE`
- `MATERIAL`
- `SPACE`
- `TECH`
- `SURVIVAL`
- `PRIORITY`

국가 UI의 상업/경제 영역에는 동시에 두 상태를 표시한다.

- 현재 가장 높은 **실행 가능 Proposal**
- 현재 가장 높은 **차단 Proposal + raw blocker**

이를 통해 `IRON:iron_mine / OTHER`처럼 진단 정보가 사라지는 현상을 줄였다.

### 신규 세계 통계

- `constructionBlockNoDeposit32E9`
- `constructionBlockNoSite32E9`
- `constructionBlockSatisfied32E9`

---

## 5. Merchant Guild handling saving telemetry 복구

### 문제

E8에서는 Merchant Guild가 실제 국제거래를 처리하고 운송서비스 수입도 발생했지만 `guildRegionalHandlingSavings32E8`이 계속 0이었다.

원인은 D5 quote bridge가 최종 `transportFactor`는 전달했으나 E8이 절감액 계산에 필요로 하는 `guildHandlingFactor`를 전달하지 않았기 때문이다. 따라서 실제 운송비 계산에는 Guild 할인이 반영돼도 telemetry에서는 factor 기본값 1을 사용했다.

### 수정

E9는 최종 quote에 명시적 `guildHandlingFactor`가 없을 때 다음 요소에서 Guild 전용 할인 factor를 복원한다.

- 최종 `transportFactor`
- 해상 거래라면 harbor efficiency factor
- 육상 거래라면 harbor factor = 1

복원된 Guild factor로 절감액을 계산해 E8/E7 telemetry에 반영한다.

**중요:** 이 보정은 실제 Gold 이동을 한 번 더 할인하거나 새 Gold를 생성하지 않는다. 이미 적용된 운송비 할인 효과와 telemetry 수치가 일치하도록 **관측값만 복구**한다.

추가 관측값:

- `guildHandlingSavingsRecovered32E9`
- `guildHandlingSavingsRecoveries32E9`

---

## 6. Seasonal Profiler V1

### 배경

E8 PC 장기주행에서 104 -> 105년 구간은 현실시간 약 168초/게임 1년까지 악화되었다. 당시 coarse profiler에서는 `PersonAct`와 `villageDaily`보다 `seasonal` 비용의 급등이 특히 두드러졌다.

E9는 이 현상을 곧바로 최적화하지 않는다. 먼저 다음 자연주행에서 정확한 하위 원인을 잡기 위해 seasonal 비용을 나눈다.

### 분리 항목

- `perfSeasonalIron32E9` — 철산업
- `perfSeasonalMilitary32E9` — 군사시설
- `perfSeasonalAdmin32E9` — 행정
- `perfSeasonalFormation32E9` — Formation
- `perfSeasonalHousing32E9` — 주거/확장
- `perfSeasonalTradePlanner32E9` — 전략 교역망 planner
- `perfSeasonalTradeLifecycle32E9` — trade intent lifecycle
- `perfSeasonalCommerceProposal32E9` — 상업 specialization / Construction Proposal
- `perfSeasonalUnattributed32E9` — 위 항목 이외의 seasonal 시간
- `perfSeasonalTotal32E9` — 전체 seasonal 처리

Profiler timer는 **계절 tick에서만** 동작한다. Person act / daily hot loop에는 새 timer를 넣지 않았다.

이번 패치의 성능 목표는 `SIM을 줄였다`가 아니라 **다음 100년 전후 장기주행에서 병목을 분해할 수 있게 만드는 것**이다.

---

## 7. UI 변경

### 국가 -> 교역 / 경제

E9 검증 박스 추가:

- 교역 endpoint: 기본 + 승격 + 총합
- 시장 endpoint: 기본 + 승격 + 총합
- 실제 연결국 수
- 현재 READY Proposal
- 상위 blocked Proposal
- raw blocker

### 국가 -> 군사

E9 병력 배치 검증 박스 추가:

- 현역
- 주둔군
- 야전군
- 중복 Person
- 합계 invariant

### 세계 -> 성능

기존 성능 패널에 최신 seasonal 세부 시간을 한 줄로 추가한다.

---

## 8. Save / Export

- 내부 버전: `0.32E9`
- LocalStorage key: `village-observer-v0-32e9`
- E8 이하 저장 키는 fallback load 대상으로 유지한다.
- E9 세이브는 `World.from()`을 통해 E9 attach를 거친다.
- E9 attach 시 교역 route cache를 초기화한다.
- Devlog JSON version은 `0.32E9`이다.
- CSV에 E9 endpoint / military / blocker / performance 필드가 추가된다.

이전 버전에서 E9로 로드하는 것은 지원하지만, E9에서 저장한 데이터를 구버전으로 되돌려 읽는 backward compatibility는 보장하지 않는다.

---

## 9. 구현 후 회귀 테스트

패키징 전에 다음 검사를 수행했다.

### JavaScript syntax

- HTML 내 inline script 66개 각각 `node --check`
- syntax error: **0건**

### 브라우저 smoke test

Headless Chromium에서 문서 내용을 직접 로드해 검사했다.

- 문서 제목: `Village Observer V0.32E9`
- 버전 badge: `V0.32E9`
- runtime status: E9 정상
- `VSim.V032E9` 존재
- 신규 world serialize version: `0.32E9`
- console/page JavaScript error: **0건**

### 승격 endpoint 회귀 테스트

테스트 중 실제 `trading_post` 하나를 `merchant_guild`로 승격시킨 뒤 확인:

- base endpoint: 0
- promoted endpoint: 1
- semantic endpoint total: 1
- `tradingPosts()`에 해당 타일 유지
- 타국 routeInfo에서 source endpoint로 사용 가능

즉 아렌에서 확인된 `마지막 교역소 승격 -> reachable nations 0` 회귀를 직접 재현한 조건에서 수정이 작동했다.

### 군사 roster 회귀 테스트

현역 10명의 synthetic 상태를 만든 뒤 Formation V1 분할 후 V0.32B summary를 다시 호출했다.

호출 전:

- 현역 10
- 주둔군 5
- 야전군 5
- 중복 0
- invariant 정상

V0.32B summary 호출 후:

- 현역 10
- 주둔군 5
- 야전군 5
- 중복 0
- invariant 정상

즉 UI/summary 조회가 FIELD Person을 CORE_GARRISON으로 다시 복사하지 않는다.

### Guild saving bridge 테스트

Guild factor 0.95, 운송서비스 Gold 10의 synthetic quote에서:

- E8 원래 telemetry 절감값: 0
- E9 복원 절감값: 약 `0.5263158`
- recovery count: 1

실제 Gold 흐름을 변경하지 않고 telemetry만 복원되는 것을 확인했다.

### Seasonal profiler 테스트

첫 seasonal tick 이후 다음 값이 모두 생성되는 것을 확인했다.

- total
- iron
- military
- admin
- formation
- housing
- trade planner
- trade lifecycle
- commerce/proposal
- unattributed

### CSV / JSON 테스트

- CSV header에 E9 endpoint/performance 필드 존재
- Devlog JSON version `0.32E9`
- snapshot global / nation에 E9 필드 기록

### Save / Load round-trip

`serialize -> JSON -> World.from -> serialize` 테스트 결과:

- 저장 version: `0.32E9`
- 로드 version: `0.32E9`
- E9 state 유지
- 오류 없음

---

## 10. 다음 자연주행에서 우선 볼 값

E9의 목적상 다음 테스트는 150년까지 무리해서 갈 필요가 없다. **100~110년 부근**에서 이미 E8의 핵심 병목 구간을 다시 확인할 수 있다.

특히 다음을 확인한다.

### 교역

- `tradeEndpointPromoted32E9 > 0`인데 `tradeEndpointTotal32E9 = 0`이 되는 국가가 없어야 한다.
- 승격 이후 국제교역이 수십 년간 완전히 정지하는 국가가 없어야 한다.
- `NO_ROUTE_MARKET`이 급증하면 endpoint 수와 함께 비교한다.

### Grand Market

- `grandMarketRegionalCandidates32E8` 증가 후 `grandMarketStarts32E8`가 실제로 증가하는지 확인한다.
- 후보가 많은데 starts=0으로 장기간 고정되면 해당 시점 Proposal blocker를 본다.

### Proposal

- `OTHER` 비율이 E8보다 크게 낮아지는지 확인한다.
- 철광 없는 국가는 `NO_DEPOSIT`으로 나타나는지 확인한다.

### 군사

- 모든 국가에서 `militaryRosterInvariant32E9 = 1`
- `militaryRosterDuplicates32E9 = 0`

### Merchant Guild

- 거래가 처리되는 경우 `guildRegionalHandlingSavings32E8` / `guildHandlingSavingsRecovered32E9`가 0에 고정되지 않는지 확인한다.

### 성능

100년 전후에 SIM/Wall이 다시 급증하면 같은 시점의 다음 필드를 함께 비교한다.

- `perfSeasonalTotal32E9`
- 각 하위 seasonal field
- `perfSeasonalUnattributed32E9`

이 결과를 바탕으로 다음 성능 패치에서는 관측이 아니라 실제 hot path 제거/캐시/저빈도화 작업으로 넘어간다.

---

## 11. 아직 남아 있는 항목

V0.32E9에서 의도적으로 완료하지 않은 항목:

- 자연 발생 해상교역을 통한 maritime transport accounting 장기 회귀 테스트
- 100년 이후 SIM 자체의 근본 최적화
- 전쟁/전투 활성화
- 이후 시대 콘텐츠 확장

E9는 E8의 기능 회귀와 진단 불투명성을 먼저 닫는 안정화 버전이다.
