# Village Observer V0.32E11

**패치명:** Hunger Satiety + Test Scenario V1 + Maritime Regression  
**기준 버전:** V0.32E10  
**날짜:** 2026-09-28

V0.32E11은 E10에서 처음 추가한 Hunger 회복식을 실제 1인 특수 시나리오로 검증한 뒤, 그 결과를 바탕으로 포만 모델을 최종 정리하고 **재현 가능한 회귀 테스트 시나리오 체계**를 게임 실행기에 정식으로 추가하는 안정화 패치다.

E10의 첫 처방은 정상 식사 후 Hunger를 20 방향으로 5% 수렴시키는 방식이었다. 이 식은 “식량이 충분한데 Hunger가 60~80에서 고착되는” 아렌형 버그를 고치는 데는 성공했지만, 1명이 수백 회 연속 정상 식사를 해도 Hunger 20을 중심으로 남는다는 새로운 해석 문제가 있었다.

E11에서는 Hunger를 `현재 허기`로 더 직접적으로 해석한다.

- 정상 식사에 성공하면 Hunger를 **8~12 감소**
- Hunger는 **0까지 내려갈 수 있음**
- 인위적인 목표 Hunger / 바닥값 없음
- 결식·부분결식·Hunger 100 starvation grace는 그대로 유지

동시에 앞으로 이런 특수 상태를 매번 수작업으로 재현하지 않아도 되도록 **Test Scenario v1**을 추가했다. E11 배포물에는 Hunger, 기근, 식량 접근 invariant, 수출 guard, Merchant Guild endpoint, 해상 운송 회계를 재현하는 7개 fixture가 포함된다.

E10의 유지보수 donor cache, Seasonal Profiler V2, E9 상업/군사 수정은 그대로 유지한다.

---

## 1. Hunger Satiety 최종식

### E10에서 남은 문제

E10은 성공한 식사 뒤에 다음 항을 추가했다.

```js
hunger += (20 - hunger) * 0.05;
```

이 방식은 높은 Hunger에 복원력을 만들었지만, Hunger가 `현재 얼마나 배고픈가`를 뜻한다면 식량이 풍족하고 모든 식사에 성공하는 Person도 0에 가까워질 수 있어야 더 자연스럽다.

### E11 수정

기존 행동 Hunger 증가는 유지한다.

```text
일하는 Person     +5 ~ +8
비근로 Person      +4 ~ +6
```

기본 식사에 성공하면:

```text
Hunger -8 ~ -12
clamp 0 ~ 100
```

즉 정상적인 근로 성인의 기대값은 대략 다음과 같다.

```text
행동 Hunger 증가 평균  +6.5
정상 식사 감소 평균    -10.0
--------------------------------
평균 순변화             -3.5
```

따라서 충분히 먹는 Person은 높은 Hunger에서 점차 회복해 실제 `0`에 도달할 수 있다. 다음 행동에서 다시 Hunger가 오르므로 값이 음수가 되거나 영구 고정되지는 않는다.

이 패치는 실제 식량 소비량 자체를 줄이지 않는다.

- 성인 기본 식사: 0.36
- V0.29 추가 식량: 0.06
- 정상 성인 총 소비 요구량: 0.42 / cycle
- 아동 소비 규칙도 기존 값 유지

E10에서 추가한 meal success/failure/consumed-food telemetry도 계속 사용한다.

---

## 2. E11 Hunger relief telemetry

E10 telemetry는 실제 식사 성공 여부와 소비량을 계속 기록한다.

- `hungerMealAttempts32E10`
- `hungerMealSuccesses32E10`
- `hungerMealFailures32E10`
- `hungerFoodConsumed32E10`
- `hungerRecoveryApplied32E10`

E11은 실제로 Hunger가 얼마나 감소했는지를 별도로 추가한다.

세계:

- `hungerMealReliefApplied32E11`
- `hungerMealReliefTotal32E11`
- `hungerMealReliefAvg32E11`

국가:

- `hungerMealReliefAppliedNation32E11`
- `hungerMealReliefTotalNation32E11`
- `hungerMealReliefAvgNation32E11`

Hunger가 이미 낮아 clamp 0에 걸리면 실제 감소량만 누적하므로 평균 relief는 이론적 8~12보다 낮아질 수 있다.

---

## 3. E10 생존 invariant 유지

E11은 E10에서 추가한 두 안전장치를 제거하지 않는다.

### FOOD_ACCESS_PARADOX

```text
현지 식량 비축 >= 30일
AND
max Hunger >= 70
```

상태가 약 90 calendar-day 이상 지속되면:

```text
FOOD_ACCESS_PARADOX32E10
```

을 기록한다.

### Food Export Guard

```text
판매 endpoint 현지 식량 비축 >= 30일
AND
max Hunger >= 85
```

이면 해당 정착지의 국제 식량 수출을 일시적으로 막는다.

E11의 식사 회복이 정상이라면 이 guard는 높은 Hunger가 실제로 해소되면서 다시 풀려야 한다.

---

## 4. Test Scenario V1

### 목적

자연주행은 emergent behavior를 보는 데 중요하지만, 특정 버그가 수정됐는지 반복 검증하기에는 조건이 매번 달라진다.

E11은 일반 세이브와 별도로 다음 wrapper를 도입한다.

```json
{
  "format": "village-observer-test-scenario",
  "version": 1,
  "meta": {
    "id": "hunger_recovery_short",
    "title": "Hunger Recovery · Short",
    "purpose": "...",
    "expected": "...",
    "category": "hunger",
    "intendedVersion": "0.32E11",
    "tags": ["hunger", "short"]
  },
  "world": {
    "version": "0.32E11"
  }
}
```

### 전용 UI

세계의 저장/불러오기 패널에 **🧪 테스트 시나리오 V1** 영역을 추가했다.

- `시나리오 파일` — Test Scenario v1 JSON 불러오기
- `현재 상태를 시나리오로 저장` — 현재 World를 fixture로 내보내기

활성 시나리오가 있으면 상단에:

```text
TEST · <Scenario Title>
```

배지가 표시된다.

일반 세이브 import와 Test Scenario import는 구분한다.

### 시나리오 metadata 보존

save/load 및 scenario export 과정에서 다음 정보를 유지한다.

- id
- title
- purpose
- expected
- category
- intendedVersion
- createdAt
- tags

E11 snapshot에도 활성 시나리오를 기록한다.

- `testScenarioActive32E11`
- `testScenarioId32E11`
- `testScenarioTitle32E11`
- `scenarioImports32E11`
- `scenarioExports32E11`

---

## 5. E11 기본 회귀 fixture 7종

배포물의 `tests/scenarios/`에 다음 파일을 포함한다.

### 5.1 Hunger Recovery · Short

`hunger_recovery_short_v032E11.json`

```text
성인 1명
시작 Hunger 90
현지 Food 120
자연 식량 생산 없음
```

목표는 단기간의 Hunger 회복식만 격리해서 보는 것이다.

기대:

```text
약 30회 정상 식사 안에 Hunger 0~10
식량은 실제 소비량만큼 감소
아사 없음
```

### 5.2 Hunger Satiety · Long Run

`hunger_satiety_long_v032E11.json`

1인 주민에게 농업 생산 기반과 충분한 자연 식량을 주어 단순 pantry 고갈 때문에 테스트가 끝나지 않게 만든 장기 fixture다.

기대:

```text
Hunger 90에서 회복
0까지 도달 가능
장기 결식 없음
식량 생산이 소비를 지속적으로 감당
```

### 5.3 True Starvation

`true_starvation_v032E11.json`

```text
성인 1명
시작 Hunger 20
현지 Food 0
자연 Food 0
```

기대:

```text
Hunger 상승
Hunger 100 진입
12 calendar-day grace
그 이후 DEATH_STARVATION
```

포만 회복 강화가 실제 기근을 무력화하지 않는지 확인한다.

### 5.4 Food Access Paradox · Resolution

`food_access_paradox_resolution_v032E11.json`

아렌에서 발견한 조건을 의도적으로 만든다.

```text
주민 1명
Hunger 90
동일 정착지 Food 300
```

정상 기대는 paradox event가 발생하는 것이 아니라, 충분한 식사를 통해 **90-day invariant threshold 전에 Hunger가 해소되는 것**이다.

### 5.5 Food Export Guard

`food_export_guard_v032E11.json`

판매국의 endpoint에 충분한 식량이 있지만 주민 Hunger가 90인 상태를 만든다.

기대:

```text
초기 식량 수출 guard ON
정상 식사로 Hunger 회복
guard OFF
```

### 5.6 Merchant Guild Endpoint Inheritance

`merchant_guild_endpoint_v032E11.json`

두 개의 소유 타일을 사용한다.

```text
core tile       : base trading_post
별도 owned tile : merchant_guild only
```

기대:

```text
tradeEndpointBase32E9      = 1
tradeEndpointPromoted32E9  = 1
tradeEndpointTotal32E9     = 2
```

즉 `merchant_guild` 자체가 semantic Trading Post endpoint로 계산되는지를 별도 타일에서 검증한다.

### 5.7 Maritime Transport Accounting

`maritime_transport_accounting_v032E11.json`

두 국가 사이를 수역으로 분리하고 양쪽에 실제 Trading Post / Market / Harbor와 필요한 항해 기술을 둔 전용 fixture다.

목표는 E6 이후 자연주행에서 장기간 미검증으로 남았던 **실제 해상 운송비 회계**를 직접 검증하는 것이다.

기대:

```text
route mode = sea
실제 국제 food trade 발생
transportSeaGold32E6 증가
transportLandGold32E6 = 0
transportAuditMismatches32E6 = 0
```

---

## 6. 실제 Chromium 회귀 결과

### 6.1 HTML / 런타임 smoke

전체 E11 HTML을 Chromium에 로드해 다음을 확인했다.

```text
document ready       complete
title                Village Observer V0.32E11
version badge         V0.32E11
serialize version     0.32E11
Test Scenario panel   present
latest patch note     V0.32E11
runtime exceptions    0
```

### 6.2 JavaScript 정적 검사

전체 inline `<script>` 68개를 각각 `node --check`로 검사했다.

```text
68 scripts
0 syntax errors
```

### 6.3 Hunger Recovery · Short

100 simulation advance 후:

```text
alive                true
Hunger               90 -> 0
Food                 120 -> 106.14
meal attempts        33
meal successes       33
meal failures        0
E11 relief applied   33
평균 actual relief   9.078
```

따라서 E10의 Hunger 20 바닥은 제거됐고 정상적인 연속 식사는 실제 포만 `0`까지 도달한다.

### 6.4 Hunger Satiety · Long Run

1000 simulation advance 후:

```text
alive                true
최종 Hunger          0
관측 Hunger min/max  0 / 90
meal attempts        333
meal failures        0
최종 Food            453.827
```

지속가능한 생산 아래 장기 생존 중에도 Hunger가 인위적으로 20에 고정되지 않는다.

### 6.5 True Starvation

```text
STARVATION_CRITICAL_ENTER_B3  calendar 33
DEATH_STARVATION              calendar 45
criticalHungerCalendarDays    12
```

기존 12-calendar-day starvation grace도 그대로 작동한다.

### 6.6 Food Access Paradox

회귀 종료 상태:

```text
Hunger                       19.319
Food                         291.6
meal successes               20
FOOD_ACCESS_PARADOX32E10     0
```

대량의 동일 타일 식량이 있는 고 Hunger 주민은 실제 식사를 통해 invariant 발동 전에 회복했다.

### 6.7 Food Export Guard

```text
시작 guard       true
회복 후 guard    false
회복 시 Hunger   53.66
block telemetry  1
```

안전장치가 영구 수출 금지가 아니라 실제 생존 상태에 따라 해제됨을 확인했다.

### 6.8 Merchant Guild endpoint

실제 load 후 타일 구성:

```text
core 17 : town_hall / house / warehouse / trading_post
owned 18: merchant_guild only
```

endpoint 결과:

```text
base      1
promoted  1
total     2
```

### 6.9 Maritime transport accounting

전용 항구 시나리오의 route:

```text
mode       sea
cost       1.9
steps      1
reachable  true
```

실제 해상 food 거래:

```text
34.00 food / transport 1.023G
 3.44 food / transport 0.104G
```

회계 결과:

```text
transportSeaGold32E6        1.12679424
transportLandGold32E6       0
transportAuditChecks32E6    2
transportAuditMismatches32E6 0
```

따라서 E6 육상 운송 회계뿐 아니라 **해상 운송 회계도 deterministic regression fixture에서 통과**했다.

---

## 7. Test Scenario save/load 회귀

실제 Test Scenario v1 JSON을 `SaveSystem.importScenario()` 경로로 불러온 뒤 World serialize → JSON deep copy → `World.from()`을 수행했다.

결과:

```text
import serialize version  0.32E11
scenario id               hunger_recovery_short
roundtrip version         0.32E11
roundtrip scenario id     hunger_recovery_short
wrapper format            village-observer-test-scenario
wrapper version           1
```

따라서 테스트 metadata가 일반 World persistence를 통과해 유지된다.

---

## 8. E10 유지보수/성능 수정 유지

E11은 유지보수 알고리즘을 다시 변경하지 않는다.

그대로 유지되는 E10 항목:

- quarterly `targetTile × resource` donor ordering cache
- 실제 donor stock 재확인
- 실제 route-use 잔여 capacity 재확인
- `maintenanceDonorCacheBuilds32E10`
- `maintenanceDonorCacheHits32E10`
- `maintenanceRouteEvaluations32E10`
- `maintenanceRouteEvaluationsAvoided32E10`
- `perfSeasonalMaintenanceFinalize32E10`
- `perfSeasonalMaintenancePlan32E10`
- `perfSeasonalLegacyOther32E10`

E11은 회귀 인프라를 추가하는 패치이며 새로운 heavy per-Person performance timer를 추가하지 않는다.

---

## 9. E9 상업·군사 수정 유지

다음 E9 수정도 그대로 유지한다.

- Merchant Guild → Trading Post endpoint semantic inheritance
- Grand Market → Market capability inheritance
- stale trade-route cache 정리
- Garrison / Field Person 중복 제거
- `garrison + field = active`, duplicate = 0 invariant
- regional Grand Market READY candidate 연결
- Proposal `NO_DEPOSIT / NO_SITE / SATISFIED`
- Guild handling savings 복구
- Seasonal profiler V1

E11의 Merchant Guild fixture는 이 중 endpoint inheritance를 앞으로 매 버전 즉시 회귀할 수 있게 만든 첫 정식 fixture다.

---

## 10. 호환성

- E11 SaveSystem key: `village-observer-v0-32e11`
- E10 이하 저장 key를 fallback으로 계속 탐색
- 일반 save serialize version: `0.32E11`
- Test Scenario wrapper version: `1`
- E10 세이브를 정상 import 가능
- 일반 MapData import 경로 유지
- 일반 Save import 경로 유지
- Test Scenario import는 별도 전용 경로
- 전쟁 / 실제 전투는 여전히 비활성

시나리오 파일은 일반 게임 맵이나 밸런스 프리셋이 아니라 **버그 및 invariant를 재현하기 위한 regression fixture**다.

---

## 11. E계열 이후 남은 주요 안정화 축

E11에서 시나리오 기반 검증 체계를 만든 뒤 다음 E계열은 이 fixture를 재사용할 수 있다.

우선순위 후보:

1. 국제교역 observer / quote board / 무역수지 UI 정리
2. PersonAct · logistics · seasonal legacy 잔여 성능 2차 최적화
3. 도로·상업 인프라 효과 및 관측 정리
4. 표준 14×14 / 19×19 / 해안 / 후기 고밀도 회귀 세트
5. E계열 종료 전 장기 자연주행 + fixture 종합 검증

V0.32E11의 핵심은 새로운 콘텐츠를 추가하는 것이 아니라, **Hunger 의미를 더 자연스럽게 만들고 앞으로 발견되는 특수 버그를 재현 가능한 자산으로 축적할 수 있게 만든 것**이다.
