# Village Observer V0.32F

**패치명:** Military Readiness & V0.32 Closure  
**기준 버전:** V0.32E14  
**날짜:** 2026-09-28

V0.32F는 V0.32 계열의 마지막 본편 패치다. V0.32A부터 구축해 온 **실제 Person 기반 군사 인구 → Garrison / Field Cohort → Formation → 군사시설 → 장비 → 보급 → 준비태세**를 하나의 전쟁 직전 시스템으로 연결하고, E14 장기주행에서 확인된 관측·계측 불일치를 함께 마감한다.

이번 버전에서도 **전쟁 선포, 실제 전투, 피해 판정, 전사·부상·포로, 후퇴, 점령, 영토 변경은 활성화하지 않는다.** 이 범위는 V0.33 전쟁 V1로 넘긴다.

E14에서 확정한 Hunger Curve V2, 국제교역/운송 Gold 보존 회계, Merchant Guild / Grand Market, Test Scenario V1.1, Person homeTile act-cache, CSV schema validator는 그대로 유지한다.

---

## 1. V0.32F 목표

F의 목적은 새 대형 시스템을 추가하는 것이 아니라 다음 불완전 연결을 닫는 것이다.

1. E14 장기주행에서 **Smithy와 Tools가 있어도 Armory 0 / Equipment 0**으로 남던 군사장비 파이프라인 교착 해소
2. 기존 추상적 Supply 값을 실제 **Formation 위치·자국 정착망·도로/경로·식량 접근성**과 연결
3. Training / Equipment / Supply / Morale을 전쟁 직전의 **Military Readiness**로 통합
4. Construction Proposal이 `READY`인데 실제 E4 intent는 `PAYMENT_REJECTED` 등으로 막히던 observer 불일치 수정
5. E14에서 실제 생산이 존재해도 0으로 관측되던 `perfPersonHarvestEst32E14` 계측 복구
6. 장기 Gold 집중을 수정하지 않고, 우선 Top-1 / Top-2 점유율을 관측 가능하게 함
7. V0.32 범위를 명시적으로 종료하고 V0.33 Combat으로 넘길 경계를 고정

---

# 2. Armory / Military Equipment Pipeline

## 2.1 E14에서 확인된 교착

기존 V0.32C/C1의 Armory 후보 조건은 다음을 요구한다.

- `IRONWORKING`
- 실제 현역 2명 이상
- 실제 Smithy 1개 이상
- 국가 식량 비축일 34일 이상
- Armory 미보유/미착공
- 국가 철 재고 5 이상

Armory 실제 건설비는 기존 물리 건설 경로를 그대로 사용한다.

```text
wood  26
stone 18
iron   4
gold  10
labor 600 adult-days
```

문제는 Armory가 없을 때도 Smithy 노동자가 들어오는 철을 계속 Tools로 소비하기 때문에, 장기주행에서 국가 철 재고가 Armory trigger인 5에 도달하기 전에 다시 소모될 수 있다는 점이었다. E14 85년 자연주행에서는 여러 국가에 Smithy와 Tools가 존재했지만 Armory와 군사장비가 끝까지 0으로 남았다.

## 2.2 F의 실제 철 비축

V0.32F는 Armory를 무료화하거나 철을 생성하지 않는다.

다음 조건이 모두 성립하고 아직 Armory가 없을 때만:

- `IRONWORKING`
- 현역 2명 이상
- Smithy 존재
- 식량 비축일 34일 이상
- Armory 미보유 / 미착공

Smithy가 소비할 수 있는 국가 철 재고에 **5.25의 임시 최소 비축선**을 둔다.

예:

```text
국가 철 5.10
Smithy 요청 0.46
→ 소비 0
→ 철 5.10 유지

국가 철 5.50
Smithy 요청 0.46
→ 소비 0.25
→ 철 5.25 유지
```

이 비축은 회계상의 가상 자원이 아니다. 기존 제련소가 실제로 생산한 철 재고 중 일부를 Smithy가 잠시 소비하지 않는 방식이다.

Armory가 착공되거나 이미 존재하면 비축 제한은 즉시 해제된다.

## 2.3 Smithy 출력 보존 수정

기존 V0.31 Smithy 경로는 요청한 철량을 바탕으로 Tools 산출량을 계산한다. F가 철 소비량만 줄일 경우 요청량과 실제 소비량 사이에 차이가 생길 수 있으므로, F는 같은 Person act 안에서 **실제로 withdraw된 철량 × 기존 수율**까지만 Tools deposit을 허용한다.

따라서 Armory 비축이 Gold/iron/tools를 새로 만들지 않는다.

## 2.4 Armory 착공

철이 5 이상 모이면 기존 V0.32C1 readiness / site / project-cap / finance 판정으로 돌아간다.

승인된 Armory는 기존 `startConstruction()` / `payBuild()` 경로를 그대로 사용한다.

검증 fixture에서는:

```text
Armory 직전 iron  5.25
Armory 착공 iron  -4.00
착공 후 iron       1.25
```

가 확인됐다.

신규 telemetry:

- `armoryIronConsumptionDeferred32F`
- `armoryIronReserveBlocks32F`
- `armoryStartAttempts32F`
- `armoryStarts32F`
- `armoryPipeline32F`
- `armoryIron32F`
- `armoryIronReserveTarget32F`

`armoryStarts32F`는 C1 PRE_SEASON, PROJECT_FREED, F post-season retry 등 어느 경로에서 실제 착공되더라도 `startConstruction()` 성공 시점에서 집계한다.

---

# 3. 실제 군사장비 생산 유지

Armory가 완성된 뒤에는 기존 V0.32C 실물 장비 생산식을 그대로 사용한다.

필요 조건:

- Armory 존재
- 실제 Smithy worker 존재
- 군사 장비 수요 존재
- 실제 iron / wood / tools 재고 존재

장비 생산은 다음 실물 입력을 소비한다.

```text
장비 1 unit당
iron  0.72
wood  0.18
tools 0.045
```

생산된 장비는 `v32cMilitary.equipmentStock`에 보존되며 실제 active military 수에 따라 Equipment coverage가 계산된다.

F 검증 fixture에서는:

```text
생산 장비       1.65
iron 소비       1.188
wood 소비       0.297
tools 소비      0.07425
Equipment       0% → 41.3%
```

이 확인됐다.

기존 C telemetry도 유지한다.

- `militaryEquipmentStock32C`
- `militaryEquipmentCoverage32C`
- `militaryEquipmentMade32C`
- `militaryEquipmentIronUsed32C`
- `militaryEquipmentWoodUsed32C`
- `militaryEquipmentToolsUsed32C`

---

# 4. Formation Supply V1

## 4.1 원칙

V0.32B/C의 Supply는 주로 국가 식량 비축과 시설 보너스에서 나온 추상값이었다. F에서는 Field/Garrison Cohort의 Supply를 현재 위치와 실제 자국 네트워크에 연결한다.

병사는 이미 실제 Person이며 기존 metabolism을 통해 식량을 소비하므로, F는 별도의 군용 식량을 추가 소비시키지 않는다. **이중 식량소비는 없다.**

Supply는 전쟁 전 단계에서 "현재 Formation 위치가 자국 보급망으로 얼마나 잘 지원되는가"를 나타내는 준비태세 지표다.

## 4.2 보급 거점 후보

자국 소유 Settlement 중 다음 조건을 만족하는 타일이 보급 후보가 된다.

- 수도는 항상 후보
- Armory
- Barracks
- Training Ground
- Granary
- Warehouse
- Administrative Office
- 또는 충분히 큰 실제 거주 인구

보급 거점 가중치:

```text
Capital              +14
Armory                +22
Barracks              +15
Training Ground        +5
Granary                 +7
Warehouse               +5
Administrative Office   +6
Population        min(8, pop × 0.55)
```

실제 후보 중 Formation까지의 자국 내부 경로를 계산하고, 단순 거리뿐 아니라 거점 기능을 함께 고려해 지원 source를 고른다.

## 4.3 route / food access

보급 목표의 기본형은 다음이다.

```text
raw supply = 98 - routeCost × 4.6 + supportBonus
```

여기에 국가/지역 Food reserve 접근계수를 적용한다.

```text
45일 이상  1.00
30~44일     0.94
18~29일     0.82
10~17일     0.67
10일 미만   0.48
```

도로 효과는 기존 internal path cost에 이미 포함되므로, 실제 도로망이 좋은 Formation은 같은 지도 거리에서도 더 좋은 Supply를 얻을 수 있다.

자국 연결 경로가 전혀 없으면 `connected=0`이며 Supply target은 18로 낮아진다.

## 4.4 급격한 출렁임 방지

Supply는 15 calendar-day 저빈도 cadence로 갱신하며 기존값에서 목표값으로 완만하게 이동한다.

```text
next supply = old × 0.55 + target × 0.45
```

첫 초기화만 target 값을 즉시 사용한다.

신규 Cohort 관측값:

- `supply32F`
- `supplyTarget32F`
- `supplyRouteCost32F`
- `supplySourceTileId32F`
- `supplySourceLabel32F`
- `supplyConnected32F`

국가 telemetry:

- `militarySupplyAvg32F`
- `militarySupplyMaxRoute32F`
- `militarySupplyDisconnected32F`
- `militarySupplyDisconnectedObs32F`

---

# 5. Military Readiness V1

각 Cohort의 전쟁 직전 준비태세를 다음 네 값으로 합성한다.

```text
Readiness =
  Training  × 0.30
+ Equipment × 0.25
+ Supply    × 0.30
+ Morale    × 0.15
```

이 값은 F에서는 **관측 전용**이다. 공격력, 피해량, 사망률에 아직 사용하지 않는다.

국가 군사 탭에 새 F 패널을 추가한다.

표시 항목:

- 전체 Readiness
- Garrison Readiness
- Field Readiness
- 평균 Supply
- 최장 보급 route
- 보급 단절 Cohort 수
- Equipment coverage
- Armory 수
- Armory pipeline 상태
- Cohort별 실제 Person 수
- Cohort별 Training / Equipment / Supply / Readiness
- 보급 source와 route cost

Armory pipeline 상태 예:

- `TECH`
- `NO_ACTIVE_FORCE`
- `NO_SMITHY`
- `FOOD_RESERVE`
- `RESERVING_IRON`
- `READY`
- `BUILDING`
- `ACTIVE`
- 실제 C1 blocker

신규 telemetry:

- `militaryReadinessAvg32F`
- `militaryFieldReadiness32F`
- `militaryGarrisonReadiness32F`
- `militaryEquipmentCoverage32F`
- `militaryReadyNations32F`
- `militaryReadinessUpdates32F`
- `perfMilitaryReadiness32F`

---

# 6. Person-backed 군사 원칙 유지

F에서도 군인은 새 숫자로 생성하지 않는다.

- 모든 active soldier는 기존 실제 Person
- Garrison member ID와 Field Cohort member ID는 실제 Person ID
- 민간 노동 제외 규칙 유지
- Field Formation은 Field Cohort를 참조
- E9 roster 중복 방지 유지
- synthetic manpower 생성 금지

즉 F가 추가하는 Supply / Readiness는 기존 실제 Person 군사체계 위에 붙는 관측·상태값이다.

---

# 7. Construction Proposal 실행기 정합성

E14 장기주행에서는 E8 Construction Proposal이 `TRADE_NETWORK:trading_post = READY`라고 표시하지만 실제 E4 intent는 직전 물리 착공 실패 후 다음 blocker를 유지하는 경우가 있었다.

대표:

- `PAYMENT_REJECTED`
- `STRATEGIC_GATE`
- `FINANCE`
- `TILE_BUSY`

F에서는 E4 진단 함수가 현재 물리 조건만 다시 계산해 `READY`를 반환하더라도, **동일 intent가 현재 `status=BLOCKED`이고 실제 blocker를 보유한다면 그 concrete blocker를 우선 반환**한다.

따라서 observer가 실제 실행 상태보다 낙관적으로 표시되는 false READY를 막는다.

신규 telemetry:

- `constructionProposalSyncCorrections32F`

검증 fixture:

```text
동일 타일 / 동일 자원 조건
PLANNED + NONE              → READY
BLOCKED + PAYMENT_REJECTED  → PAYMENT_REJECTED
```

---

# 8. E14 Harvest Profiler Fix

E14는 `Tile.harvest()`를 1/32 sampled Person act에서 계측하도록 만들었지만, 일반 work tile에는 E14 wrapper가 기대한 `_worldRef`가 설정되지 않아 자연주행에서 `perfPersonHarvestEst32E14 = 0`이 계속 관측됐다.

F에서는 Person act의 active world reference를 `Tile.harvest()` 호출 동안만 임시 전달한다.

- 저장하지 않음
- 타일에 영구 world reference를 남기지 않음
- 호출 후 이전 값을 복원
- simulation result를 변경하지 않음

900-step fresh-world smoke에서 자동 snapshot 중:

```text
perfPersonHarvestEst32E14 non-zero snapshots  28
max estimated harvest time                    12.8 ms
```

가 관측되어 계측 경로가 실제 수확 호출을 잡는 것을 확인했다.

---

# 9. Gold Concentration Observer

E14 85년 자연주행에서는 상위 2개 국가가 세계 Money Supply의 약 91.6%를 보유하는 장기 집중이 관측됐다.

F는 이를 즉시 재분배하지 않는다.

새 정책, 세금, Gold 생성/소멸 규칙은 추가하지 않고 snapshot 시 다음 두 값만 기록한다.

- `goldTop1Share32F`
- `goldTop2Share32F`

향후 중계무역 / Transit Trade와 장기 경제 밸런스를 평가할 관측 기준으로 사용한다.

에브처럼 지리적으로 좋은 허브가 생산 수출국보다 약하게 수익화되는 문제는 방향성으로 유지하지만, **실제 Transit Trade 경제는 F에 넣지 않는다.**

---

# 10. Performance 정책

F의 Supply / Readiness는 매 Person act마다 경로를 계산하지 않는다.

- Nation/Cohort 수준 저빈도 갱신
- 기본 cadence: 15 calendar days
- seasonal tick에서는 강제 갱신
- 기존 내부 path cost 사용
- 새 일일 국제교역 scan 없음
- 전투 scan 없음

성능 panel에는 F readiness observer 비용을 별도로 노출한다.

F의 목적은 0.33 전투 시스템을 얹기 전에 보급 계산 자체가 새로운 초선형 병목이 되지 않도록 하는 것이다.

---

# 11. Save / Compatibility

- SaveSystem key: `village-observer-v0-32f`
- serialize version: `0.32F`
- V0.32E14 이하 E/D key fallback 유지
- 일반 Save import 유지
- MapData import 유지
- Test Scenario import/export 유지
- Scenario export intended version: `0.32F`
- Combat: `false`
- `v32f.seriesClosed = true`

V0.32E14 save를 F에서 불러올 때 F 상태는 기본값으로 부착한다.

실제 E14 → F roundtrip 검증:

```text
E14 population  104
F load population 104
E14 Nation treasury sum 792.0956289319934
F load treasury sum      792.0956289319934
loaded serialize version 0.32F
seriesClosed             true
combat                    false
page errors               0
```

---

# 12. CSV / Telemetry

E14의 quote-aware schema validation을 그대로 유지한다.

F 추가 global 열:

- `armoryIronConsumptionDeferred32F`
- `armoryIronReserveBlocks32F`
- `armoryStartAttempts32F`
- `armoryStarts32F`
- `militaryReadinessUpdates32F`
- `militarySupplyDisconnectedObs32F`
- `constructionProposalSyncCorrections32F`
- `perfMilitaryReadiness32F`
- `militaryReadyNations32F`
- `goldTop1Share32F`
- `goldTop2Share32F`

F 추가 nation 열:

- `militaryReadinessAvg32F`
- `militaryFieldReadiness32F`
- `militaryGarrisonReadiness32F`
- `militarySupplyAvg32F`
- `militarySupplyMaxRoute32F`
- `militarySupplyDisconnected32F`
- `militaryEquipmentCoverage32F`
- `armories32F`
- `armoryPipeline32F`
- `armoryIron32F`
- `armoryIronReserveTarget32F`

900-step fresh-world smoke:

```text
CSV columns   675
CSV rows      372
mismatch      0
```

---

# 13. Release Validation

## 13.1 정적 검사

```text
inline scripts            71
JavaScript syntax errors   0
```

모든 inline script를 별도로 추출해 `node --check`를 통과했다.

## 13.2 Chromium startup

```text
Document title              Village Observer V0.32F
Version badge               Village Observer · V0.32F
fresh serialize version     0.32F
startup page errors         0
```

## 13.3 900-step natural smoke

```text
fresh-world advance         900 steps / game year 3
page errors                 0
serialize version           0.32F
CSV                         675 columns / 372 rows
CSV mismatch                0
harvest profiler            non-zero confirmed
```

초기 3년에는 `IRONWORKING`과 자연 군사 조건이 아직 갖춰지지 않으므로 Armory 자연 발생을 회귀 조건으로 강제하지 않는다. Armory 파이프라인은 별도 실제-resource fixture로 검증한다.

## 13.4 Armory deadlock fixture

```text
iron 5.10 + smithy consume request 0.46
→ consumed 0
→ iron 5.10

iron 5.50 + smithy consume request 0.46
→ consumed 0.25
→ iron 5.25

Armory pipeline
→ READY

Armory start
→ success
→ physical project cost includes iron 4
→ iron 5.25 → 1.25

armoryStartAttempts32F  1
armoryStarts32F        1
page errors             0
```

## 13.5 Equipment production fixture

```text
equipment made  1.65
iron used       1.188
wood used       0.297
tools used      0.07425
coverage        0% → 41.3%
page errors     0
```

## 13.6 Formation supply fixture

Field Formation을 수도권에서 원거리 자국 타일로 옮긴 테스트에서:

```text
Garrison supply        100
Field route cost       3.45
Field supply           71.4
Field readiness        44.6
connected              true
page errors            0
```

즉 위치/경로 변화가 Field Supply와 Readiness에 실제로 반영된다.

## 13.7 Construction Proposal fixture

```text
PLANNED / NONE               → READY
BLOCKED / PAYMENT_REJECTED   → PAYMENT_REJECTED
sync correction counter      +1
page errors                  0
```

---

# 14. V0.32 종료 범위

V0.32F로 다음 흐름을 완성한다.

```text
실제 Person
→ 예비군 / 현역
→ Garrison + Field Cohort
→ Formation
→ 지도상 이동/배치
→ Barracks / Training Ground / Armory
→ 실제 철·목재·도구 기반 Equipment
→ 위치·도로·식량 접근 기반 Supply
→ Training / Equipment / Supply / Morale 기반 Readiness
```

여기까지가 **군사사회 / 전쟁 준비 단계**다.

---

# 15. V0.33으로 넘기는 범위

다음은 F에 넣지 않는다.

- 전쟁 선포 / 외교적 전쟁 상태
- 적국 영토 진입 규칙
- Formation 대 Formation 접촉
- 실제 전투 판정
- 공격 / 방어 / 지형 / 요새 효과
- 전사 / 부상 / 포로
- 장비 손실
- 보급 고갈의 실제 전투 페널티
- 후퇴 / 추격
- 점령
- 영토 소유권 변경
- 전쟁 피로 / 강화 / 평화협정

이제 V0.33 전쟁 V1은 F의 Readiness와 Formation을 입력으로 받아 **"실제 두 Formation이 만났을 때 무슨 일이 일어나는가"**에서 시작할 수 있다.

---

# 16. 이후 경제 방향 메모

E14 장기 분석에서 에브처럼 지리적으로 유리한 국가가 높은 연결성을 갖더라도, 현재 seller→buyer 직거래 구조에서는 생산·수출력이 강한 세른이 더 큰 Gold 이익을 얻는 현상이 확인됐다.

향후 교역 고도화에서는 단순 생산 보너스보다 다음 방향을 우선 검토한다.

- Transit Trade / 중계무역
- 환적·보관·중개 서비스
- 상업 노선 허브
- Harbor / road junction service income
- 지리적 centrality의 경제적 수익화

이 기능들은 V0.32F의 범위가 아니며, F에서는 Gold concentration observer만 남긴다.
