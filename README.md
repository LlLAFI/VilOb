# Village Observer V0.33D2

## Strategic War Preparation V1

기준 버전: **V0.33D1C**  
패치 버전: **V0.33D2**  
작성 기준일: **2026-09-30**

---

## 1. 패치 목적

V0.33D1까지의 War Intent는 `ASSESSING → PREPARING → READY → DECLARED/CANCELLED` 상태를 만들었지만, `PREPARING`은 실제 행동을 거의 하지 않는 대기 단계였다. D1A~D1C는 작전 접근성, Coalition access, Formation lifecycle, 전쟁 관측, Recovery deadlock 등을 안정화했다.

V0.33D2는 **PREPARING을 실제 전략준비 단계로 승격**한다. 공격을 검토하는 국가는 단순히 수치가 자연스럽게 좋아지기를 기다리지 않고, 기존 경제·군사·건설 시스템을 사용해 실제로 조건을 개선한다.

핵심 원칙은 다음과 같다.

- 합성 병력 생성 금지: 추가 동원은 실제 Person만 사용한다.
- 합성 비축 생성 금지: 식량/Gold는 기존 실제 국가 재고를 사용한다.
- 전투력 직접 보너스 금지: D2는 준비 행동만 추가하고 기존 Readiness/Equipment/Supply/Combat 계산을 유지한다.
- 선전포고 전 적 영토 진입 금지: Formation 사전 집결은 자국 영토에서만 수행한다.
- Intelligence 정확도는 아직 100% proxy를 유지한다.
- D1의 90 calendar-day 전략 검토 주기와 기존 개전 확률을 유지한다.

---

## 2. Strategic War Preparation 상태

D2는 D1의 활성 Intent 중 `PREPARING` 또는 `READY` 상태에 대응해 `v33d2.preparations[]`를 생성한다.

각 Preparation은 다음을 보존한다.

- intentId / nationId / targetId
- 시작/종료 calendar day
- 추가 동원한 실제 Person ID
- Formation별 사전 집결 목표
- 전쟁 준비용 도로 착공 수
- 군사시설 착공 수
- 최근 준비도와 주요 blocker
- READY 도달 시각
- 최종 DECLARED / CANCELLED / ENDED 상태

준비가 취소되고 다른 전쟁이 없다면 D2가 추가 동원했던 Person은 예비역으로 단계 해산한다. 이미 실제 전쟁 중이라면 기존 전쟁 군사시스템의 인력 운용을 침범하지 않는다.

---

## 3. 준비 목표 계산

D2 준비목표는 고정된 하나의 숫자가 아니라 국가 상황에 따라 계산한다.

### 3.1 상대 동원 잠재력

D2는 완전정보 Intel V0를 사용해 상대의 현재 병력뿐 아니라 실제 동원 적격 Person 수를 계산한다.

- 적격 기준: 생존, 18~50세, 건강 45 이상, 부상/포로 제외, 비군사 개척자 제외
- 상대 잠재 동원 규모의 기초값: 적격 인구의 약 20%
- 현재 실제 현역 규모가 더 크면 현재 규모를 우선

이 수치는 합성 병력을 생성하지 않고 **준비 목표 산정에만 사용**한다.

### 3.2 추가 동원 상한

첫 전쟁 준비는 적격 인구의 약 **30%**까지를 준비상한으로 사용한다.

- 이미 다른 전쟁 수행 중: +4%p
- 최근 같은 상대에게 패배: +2%p
- 최대 약 38%

실제 목표는 평시 목표, 최소 야전병력, 상대 동원 잠재력에 따른 필요량 중 높은 값을 취하되 위 상한을 넘지 않는다.

### 3.3 기본 준비 목표

첫 전쟁 기준:

| 항목 | 기본 목표 |
|---|---:|
| 식량 비축 | **45일** |
| Field Readiness | **62** |
| 전력비 | **0.90** |
| Gold | **8** |
| 야전 병력 | 최소 **2명**, 상대 야전병력/동원잠재력에 따라 상향 |
| Formation 집결 | 준비 대상 야전대 전부 |
| 작전 접근 | `DIRECT_ACCESS` 또는 `ALLY_ACCESS` |

이미 한 전쟁을 수행하면서 두 번째 전쟁을 준비하면:

- 식량 +10일
- Readiness +6
- 전력비 목표 +0.08
- Gold +4
- 현역 동원 상한 +4%p

최근 1440 calendar-day 이내 같은 상대에게 패배했다면:

- 식량 +5일
- Readiness +4
- 전력비 목표 +0.07
- Gold +2
- 현역 동원 상한 +2%p
- 야전병력 목표 추가 상향 가능

---

## 4. 실제 Person 추가 동원

D2는 준비 중 필요한 현역이 부족하면 30 calendar-day 준비 pulse마다 최대 2명의 실제 Person을 추가 동원한다.

동원 시 기존 V0.32B 군사 Person 규칙을 따른다.

- 기존 직업/assignment를 보존
- 현역 복무 상태로 전환
- 민간 직장 슬롯 해제
- Cohort/Formation은 기존 D 군사계층이 실제 Person을 재배치
- DORMANT Formation도 기존 D1 lifecycle 규칙에 따라 동일 객체/ID로 재활성화 가능

전쟁 준비가 취소되고 다른 전쟁이 없다면 D2 추가 동원자는 예비역으로 해산되고 기존 평시 군사계획이 다시 적용된다.

---

## 5. 식량·Gold 전쟁 비축

D2는 별도의 가상 `warFood` 또는 `warGold` 자원을 만들지 않는다.

기존 실제 국가 자원의 목표를 높인다.

### 5.1 식량

- AI `FOOD` 점수에 준비 부족분에 따른 추가 우선순위 부여
- `updateStrategicPlan()`의 Food reserve 목표를 `population × 0.36 × 목표 비축일` 이상으로 강화
- 기존 농업 생산, 국내 물류, 국제교역, 소비 시스템을 그대로 사용

따라서 비축이 늘려면 실제 생산 또는 교역이 필요하다.

### 5.2 Gold

- 기존 Gold를 그대로 사용
- 목표 이하이면 `TRADE` 우선순위를 소폭 강화
- 전략계획의 Gold reserve를 D2 목표 이상으로 유지

Gold가 지나치게 낮으면 READY를 충족하지 못해 개전이 지연된다.

---

## 6. Readiness·장비·군사시설 준비

D2는 기존 V0.32F `militaryFieldReadiness32F`를 그대로 사용한다.

Readiness가 목표보다 낮으면:

- AI `SECURITY` 우선순위 강화
- `MAINTAIN` 우선순위 소폭 강화
- 180 calendar-day 이하 빈도로 부족한 핵심 군사시설을 실제 착공 시도

시설 우선순위:

1. 병영 `barracks`
2. 훈련장 `training_ground`
3. 철공 기술이 있을 경우 무기고 `armory`

실제 착공 가능 여부, 재료, Gold, 공간, 동시공사 한도, 기술 Gate는 기존 `startConstruction()` 규칙을 그대로 사용한다.

D2 자체는 Equipment/Readiness 숫자를 직접 증가시키지 않는다.

---

## 7. Formation 사전 집결

첫 전쟁 준비에서는 실제 야전 Formation을 예상 전선 방향의 **자국 소유 타일**로 이동시킨다.

집결 후보는 다음 순서로 평가한다.

- 목표국과 직접 접한 자국 국경
- `WAITING_ACCESS`라면 예상 통과국과 접한 자국 국경
- 적절한 접경지가 없으면 목표 수도와 가까운 자국 타일

후보 평가에는 다음 요소가 반영된다.

- 도로
- 병영/훈련장/무기고/감시탑/축성 등 군사시설
- 행정청
- 지역 인구
- 수도에서의 거리

Formation은 기존 평시 이동시간, 지형, 도로, Supply 규칙으로 한 칸씩 이동한다. 적국 영토에는 선전포고 전 진입하지 않는다.

이미 다른 전쟁 중인 국가가 두 번째 전쟁을 준비하는 경우 기존 전쟁 Formation assignment를 강제로 빼앗지 않는다. 이 경우 D2는 더 높은 병력·식량·Readiness·전력비·Gold 목표로 추가 부담을 표현한다.

---

## 8. 전쟁 준비용 도로

ROADS 기술이 있고 첫 집결지까지의 자국 경로에 도로가 빠져 있으면 D2는 90 calendar-day 이하 빈도로 한 타일씩 실제 도로 착공을 시도한다.

- reason: `D2_WAR_PREPARATION_ROAD`
- 수도 → 집결지 자국 경로만 대상
- 적국/제3국 영토에는 건설하지 않음
- 기존 프로젝트 한도·재료·공간 Gate 유지
- 도로 성능은 D1B 기준 단일 **factor 0.62** 유지

---

## 9. READY와 선전포고 Gate

D1의 전략검토 주기는 그대로 90 calendar-day다.

하지만 D1이 기존 기준만으로 `READY`를 판정하더라도 D2 물리 준비가 부족하면 즉시 다시 `PREPARING`으로 정규화된다.

D2 개전 필수조건:

- 실제 야전병력 목표 충족
- 실제 Food reserve-day 목표 충족
- 실제 Field Readiness 목표 충족
- 전력비 목표 충족
- 실제 Gold 목표 충족
- 첫 전쟁이면 Formation 집결 완료
- 작전 접근성 확보
- Survival/Recovery 상태가 아님

D1이 `AI_STRATEGIC_INTENT` 선전포고를 시도할 때 D2 Gate가 동기적으로 다시 검사한다. 하나라도 부족하면 `WAR_PREPARATION_DECLARATION_BLOCKED33D2`를 기록하고 선전포고를 취소한다.

모든 목표를 만족한 뒤에는 기존 D1의 개전 확률과 90일 검토주기를 그대로 사용한다. D2가 별도 개전 주사위를 추가하지 않는다.

---

## 10. 주요 Devlog 이벤트

- `WAR_PREPARATION_STARTED33D2`
- `WAR_PREPARATION_MOBILIZATION33D2`
- `WAR_PREPARATION_STOCKPILE33D2`
- `WAR_PREPARATION_RALLY33D2`
- `WAR_PREPARATION_RALLY_READY33D2`
- `WAR_PREPARATION_ROAD33D2`
- `WAR_PREPARATION_FACILITY33D2`
- `WAR_PREPARATION_READY33D2`
- `WAR_PREPARATION_DECLARATION_BLOCKED33D2`
- `WAR_PREPARATION_DECLARED33D2`
- `WAR_PREPARATION_DEMOBILIZATION33D2`
- `WAR_PREPARATION_ENDED33D2`

---

## 11. Snapshot / CSV 추가 필드

World:

- `activeWarPreparations33D2`
- `readyWarPreparations33D2`
- `warPreparationStarts33D2`
- `warPreparationMobilized33D2`
- `warPreparationRoads33D2`
- `warPreparationFacilities33D2`
- `warPreparationDeclarationBlocks33D2`
- `warPreparationDeclarations33D2`

Nation:

- `warPreparationStatus33D2`
- `warPreparationTarget33D2`
- `warPreparationPct33D2`
- `warPreparationBlocker33D2`
- `warPreparationField33D2`
- `warPreparationFieldGoal33D2`
- `warPreparationFoodGoal33D2`
- `warPreparationReadinessGoal33D2`
- `warPreparationRally33D2`

---

## 12. 저장 호환성

새 저장 버전:

- `0.33D2`

localStorage key:

- `village-observer-v0-33d2`

fallback:

- D1C
- D1B
- D1A
- D1
- D
- C3F
- C3

D2는 `v33d2`에 Preparation 상태와 통계를 저장한다. D1C의 `v33d1cRecovery`, War History, 점령 보강 상태는 그대로 계승한다.

---

## 13. D2에서 변경하지 않는 기준

- 주거 수용량: **3 / 5 / 8**
- 도로: 단일 Lv.1, **factor 0.62**
- 유지보수 노동: **분기 0.5%**
- 기술 40개 총비용: **6,315 Knowledge**
- D1B Construction Labor / Maintenance Baseline 분리
- D1C Recovery Expansion Escape
- D1C 단독전쟁/합동전쟁 UI와 누적점령 보강
- Persistent Engagement
- Person-backed casualties
- 임시 점령
- War Exhaustion
- Coalition military access
- Formation ACTIVE/DORMANT lifecycle

---

## 14. 구현 Smoke Test

- 총 **84개** `<script>` 블록 `node --check`: syntax error **0**
- Chromium headless `page.set_content()` 부팅: page error **0**, console error **0**
- 문서 제목: `Village Observer V0.33D2`
- 버전 배지: `V0.33D2`
- `VSim.V033D2.revision = strategic-war-preparation-v1`
- serialize version: `0.33D2`
- save → `World.from()` → 재serialize: `0.33D2` 유지
- 기술 총비용: **6315** 유지
- 단일 도로 factor: **0.62** 유지
- 주거 cap: **3 / 5 / 8** 유지
- 합성 PREPARING Intent에서 D2 Preparation 생성 및 실제 Person 추가 동원 확인
- Formation rally target 지정 및 집결 완료 telemetry 확인
- D2 Snapshot/CSV 신규 필드 생성 확인
- CSV schema validation: **OK**, 818 columns, mismatch 0

---

## 15. 다음 자연주행 검증 체크리스트

사용자 요청에 따라 D1C 로그 검증도 이번 D2 자연주행과 함께 수행한다.

### D1C carry-over

1. 전쟁 결과 A/B Side와 실제 국가명이 계속 정확히 보이는가?
2. 현재 점령 0이어도 누적 점령 이력이 남는가?
3. 단독전쟁/합동전쟁 분류가 정상인가?
4. Recovery 장기고착 국가가 Escape를 통해 빠져나오는가?

### D2

5. PREPARING 진입 후 실제 Person 추가 동원이 일어나는가?
6. 추가 동원이 민간 노동을 지나치게 붕괴시키지 않는가?
7. Food reserve 목표 때문에 FOOD 행동/비축이 실제로 증가하는가?
8. 낮은 Readiness 국가가 SECURITY·군사시설 준비를 수행하는가?
9. Formation이 선전포고 전 실제 자국 국경으로 집결하는가?
10. 집결 중 적 영토에 진입하지 않는가?
11. 준비용 도로가 실제 예상 경로에만 생기는가?
12. D2 준비 미완료 상태에서 D1 선전포고가 차단되는가?
13. READY 이후 기존 D1 개전 cadence가 유지되는가?
14. 두 번째 전쟁은 첫 전쟁보다 실제 준비 부담이 높은가?
15. 최근 패전 상대에 대한 재도전 준비가 더 무거워지는가?
16. 취소된 Intent의 D2 추가 동원자가 평시로 정상 복귀하는가?
17. 기존 Engagement/점령/War Exhaustion에 회귀가 없는가?
18. 성능 증가가 허용 가능한 수준인가?

---

## 16. 다음 단계

D2 자연주행에서 실제 준비 행동이 안정적으로 작동하면 다음 큰 단계는 **V0.33E — Intelligence & Reconnaissance V1**이다.

예정 범위:

- military / position / economy / diplomacy / logistics별 정보 신뢰도
- 관측 시각과 정보 노후화
- 국경 정찰
- 교역·외교 기반 정보 획득
- 전투를 통한 정보 갱신
- Formation sighting
- 전력 추정 범위/오차

첩보·방첩·기만·가짜 Formation 정보는 그 이후 단계로 확장한다.

---

# Appendix A. V0.33D1C 기준 문서

아래는 D2가 직접 계승한 D1C 상세 기술 문서다.

# Village Observer V0.33D1C

## War Observer + Recovery Escape Stabilization

기준 버전: **V0.33D1B**  
패치 버전: **V0.33D1C**  
작성 기준일: **2026-09-30**

---

## 1. 패치 목적

V0.33D1B PC 자연주행은 건설 노동량 단축, 주거 수용량 3/5/8, 단일 도로 ×0.62, 유지보수 분기 0.5%, 기술비 6,315 Knowledge를 안정적으로 유지했다. 실제 건설 완료시간은 D1A보다 크게 줄었고, 프로젝트 슬롯은 여전히 제약으로 남으면서도 과도한 장기 고착은 완화되었다.

이번 자연주행에서는 다음 네 가지 후속 문제가 확인되었다.

1. 전쟁 결과가 `A측 승리 / B측 승리`로만 표시되어 어느 국가들이 A/B Side인지 같은 카드에서 즉시 확인하기 어려웠다.
2. 전쟁 중 실제 임시 점령은 다수 발생했지만 전쟁 기록의 `누적 점령`이 0으로 표시되는 경우가 있었다.
3. 델마처럼 Recovery Mode가 수십 년 유지되면서, Recovery를 끝내기 위해 필요한 자원·주거 공간을 확보하려면 확장이 필요한데 Recovery 자체가 확장을 막는 순환 고착이 발생할 수 있었다.
4. UI의 `독립전쟁`이라는 명칭이 1대1 전쟁을 뜻하기 위해 사용되었지만, 종속국·식민지의 독립전쟁으로 오해될 여지가 컸다.

D1C는 전쟁 전투식이나 D1B 도시경제 밸런스를 다시 바꾸는 패치가 아니다. **전쟁 관측 UI의 의미를 데이터 구조와 일치시키고, Recovery가 자기 자신을 탈출하지 못하는 deadlock만 제한적으로 해소하는 안정화 패치**다.

---

## 2. 전쟁 Side 표시와 결과 가독성

### 2.1 기존 문제

D 계열 전쟁은 이미 다음 구조를 사용한다.

- `sideAIds[]`
- `sideBIds[]`
- `winnerSide = A | B | null`

따라서 A/B Side는 전투 내부 식별자로는 유효하지만, 관찰자 UI에서 `A측 승리`만 표시하면 A측이 누구인지 별도로 추적해야 했다.

### 2.2 D1C 표시 규칙

전쟁 기록 카드는 항상 실제 Side 구성원을 함께 표시한다.

예시:

- `A측 · 에브 ↔ B측 · 라엔`
- `결과: 에브 승리 (A측)`

합동전쟁 예시:

- `A측 · 벨른 + 델마 ↔ B측 · 에브`
- `결과: 벨른 + 델마 승리 (A측)`

A/B 문자는 제거하지 않는다. 저장·전투·Engagement·winnerSide 판정은 계속 A/B를 사용한다. 다만 **사용자에게는 실제 국가명을 우선 표시**한다.

### 2.3 국가별 최근 전쟁

국가 군사 탭에서는 해당 국가의 관점을 우선한다.

예:

- `합동전쟁 · 에브 · 승리`
- `소속 A측 · 벨른 + 델마`

따라서 같은 전쟁이라도 상대 Side 국가에서는 `패배`로 표시된다.

---

## 3. 전쟁 명칭 정리

D1C부터 사용자 UI의 전쟁 유형 명칭은 다음과 같다.

| 구성 | 표시 명칭 |
|---|---|
| A측 1개국 / B측 1개국 | **단독전쟁** |
| 어느 한 Side라도 2개국 이상 | **합동전쟁** |

`독립전쟁`이라는 UI 명칭은 폐기한다.

향후 속국·식민지·분리독립과 같은 정치체제가 추가되면 `독립전쟁`은 실제 독립 목적의 전쟁 유형으로 사용할 수 있다.

기존 `independentConcurrentDeclarations33D` 같은 내부 Telemetry 키는 저장/CSV 호환성을 위해 변경하지 않는다. 내부 변수명 변경 때문에 과거 로그 분석이 깨지는 것을 피한다.

---

## 4. 누적 점령 0 표시 수정

### 4.1 원인

V0.33A의 War History writer는 실제 이력을 `war.history33A`에 저장한다.

그러나 D1A/D1B Coalition-aware 카드 일부는 `war.v33aHistory`를 읽고 있었다. 두 이름이 일치하지 않아 실제 `TILE_OCCUPIED33` 이벤트가 존재해도 카드에서는 빈 history를 읽어 `누적 점령 0`으로 표시할 수 있었다.

### 4.2 D1C 수정

D1C는 다음을 수행한다.

- `history33A`를 정식 War History 객체로 사용한다.
- `v33aHistory`는 같은 객체를 가리키는 호환 alias로 연결한다.
- 현재 세션 Telemetry의 `TILE_OCCUPIED33`, `TILE_LIBERATED33`, `WAR_ENDED33`를 읽어 가능한 범위에서 과거 전쟁 history를 보강한다.
- 고유 점령 타일, 최대 동시 점령, 수도 점령 여부를 재구성한다.

### 4.3 현재 점령과 누적 점령 분리

통계 전쟁 패널 상단에 다음 값을 별도로 표시한다.

- **현재 점령**: 현재 `v33OccupierId`가 존재하는 타일 수
- **누적 점령 발생**: `v33War.stats.occupationStarts`와 남아 있는 `TILE_OCCUPIED33` 로그 중 더 완전한 값을 사용
- **누적 해방**: 누적 liberation 수

종전 시 임시 점령지가 모두 반환되어 현재 점령이 0이 되는 것은 정상이다. 이 값과 누적 점령 이력을 더 이상 혼동하지 않는다.

전쟁 카드 자체에서는 Side별로 다음을 표시한다.

- 누적 점령 A/B: 고유하게 한 번 이상 점령한 타일 수
- 최대 동시 점령 A/B
- 수도 점령 Side

---

## 5. Recovery Expansion Escape V1

### 5.1 문제 정의

기존 Recovery Mode는 기반시설 붕괴를 막기 위한 강한 안전모드다. Recovery 중에는 일반 확장이 차단된다.

그런데 다음과 같은 순환 고착이 가능했다.

`목재/주거 부족 → Recovery 진입 → 확장 차단 → 좁은 기존 영토에서 자원 고갈 → Recovery 조건 충족 실패 → 확장 계속 차단`

D1B 자연주행의 델마는 이 현상의 대표 사례였다. Recovery가 종료되기 직전까지 장기간 영토 확장이 사실상 멈췄고, Recovery 종료 뒤 곧바로 개척이 재개되었다.

### 5.2 원칙

D1C는 **Recovery를 일반 확장 가능 상태로 바꾸지 않는다.**

대신 Recovery를 끝내기 위해 외부 자원·공간이 반드시 필요한 경우에만 `Recovery Expansion Escape`를 허용한다.

Recovery Mode 자체는 계속 유지된다. 복구용 개척을 시작했다고 즉시 정상 발전 상태로 전환하지 않는다. 기존 Recovery 안정 조건을 실제로 충족해야 종료된다.

### 5.3 기본 허용 조건

복구용 개척은 다음 조건을 모두 통과해야 한다.

- Recovery Mode 활성
- 월드 9년 이상
- Recovery 지속 **720 calendar-day 이상**
- 실제 `V0.30B2/B4 Survival` 상태가 아님
- 국가 식량 비축 **30일 이상**
- 평균 건강 **55 이상**
- 현재 진행 중인 Frontier Project가 없음
- Recovery episode에서 복구용 확장을 이미 2회 이상 시작하지 않음
- 실제로 내부 해결이 고착되었다는 증거가 존재

실제 생존위기에서는 계속 확장을 막는다.

### 5.4 목재 고착 판정

기존 Recovery 수동채집은 자국 영토 안에서만 자원을 채취한다.

D1C는 Recovery의 누적 `manualWood`를 분기 단위로 샘플링한다.

- 목재가 기존 Recovery 안정 목표 `max(16, population × 0.4)`보다 부족하고
- 최근 여러 분기 동안 수동 목재 채집 증가량이 매우 낮으면
- `LOCAL_RESOURCE_EXHAUSTED` 상태로 판정한다.

이 상태가 2회 연속 관측되면 `localWoodExhausted33D1C = 1`이 된다.

### 5.5 주거 고착 판정

다음 조건을 함께 본다.

- 국가 수용력 < 인구 × 0.85
- 현재 주택/연립/집합 신축·개축 또는 Housing용 토지정비가 진행 중이지 않음
- 영토 규모가 인구에 비해 지나치게 협소함
- Recovery가 720일 이상 지속됨

내부에서 주택을 실제로 짓고 있는 경우에는 복구용 확장을 즉시 시작하지 않는다.

### 5.6 후보 타일 우선순위

기존 V0.24 Regional Frontier 후보를 그대로 기반으로 사용하되 Recovery 원인에 따라 추가 점수를 준다.

**목재 고착**

- 목재 resource capacity가 높은 인접 타일 우선
- 숲 지형 추가 우선

**주거 고착**

- 현재 기술 기준 접근 가능한 건축 잠재공간이 큰 타일 우선
- 평지/초지 추가 우선

따라서 Recovery Escape는 무작위 영토확장이 아니라 **현재 고착 원인을 해결할 가능성이 높은 인접지**를 선택한다.

### 5.7 복구용 개척 비용과 제한

일반 국가 확장과 구분하기 위해 Recovery Escape는 소규모 2인 개척대를 사용한다.

기본 최소 비용:

- 목재 8
- 석재 2
- 식량 10
- Gold 4

추가 규칙:

- 한 번에 복구용 Frontier Project 1개만 허용
- 한 Recovery episode당 최대 2회
- 기간은 지형 기본 개척시간의 약 55%에서 시작하며 `FRONTIER_LOGISTICS`, `ENGINEERING`, Ruin 보정을 기존 방식과 호환 적용
- 실제 Person 2명을 `PIONEER`로 배정
- 가상 인구·가상 자원을 생성하지 않음

---

## 6. Recovery Escape Telemetry

새 이벤트:

- `RECOVERY_LOCAL_RESOURCE_EXHAUSTED33D1C`
- `RECOVERY_EXPANSION_STARTED33D1C`
- `RECOVERY_EXPANSION_BLOCKED33D1C`
- `RECOVERY_ESCAPE_RESOLVED33D1C`

Snapshot / CSV 국가 필드:

- `recoveryEscapeStatus33D1C`
- `recoveryEscapeAgeDays33D1C`
- `recoveryEscapeStarts33D1C`
- `recoveryLowWoodGatherSeasons33D1C`
- `localWoodExhausted33D1C`

세계 필드:

- `warHistoryUIOwner33D1C`
- `currentOccupiedTiles33D1C`
- `cumulativeOccupationStarts33D1C`
- `recoveryEscapeNations33D1C`
- `recoveryExpansionStarts33D1C`

---

## 7. D1B 도시·경제 기준 유지

D1C에서는 다음 수치를 변경하지 않는다.

### 7.1 주거

| 주거 | 수용량 |
|---|---:|
| 고대 주택 | **3** |
| 고대 연립주거 | **5** |
| 고대 집합주거 | **8** |

### 7.2 도로

- 도로 없음: factor 1.00
- 단일 도로 Lv.1: **factor 0.62**
- ENGINEERING / URBANIZATION 연구로 도로 이동성능이 자동 승급하지 않음

### 7.3 유지보수

- 유지보수 노동: 기존 Maintenance Baseline의 **분기 0.5%**
- 목재/석재 유지비: 기존 **연 2%**

### 7.4 기술

- 40개 기술 총 비용: **6,315 Knowledge**
- D1A fixed-cost baseline 유지
- 누적 scaler 재도입 없음

### 7.5 건설 노동

D1B에서 분리한 Construction Labor / Maintenance Baseline 구조를 그대로 유지한다.

대표값:

| 시설 | 건설 노동 | 유지보수 기준 노동 |
|---|---:|---:|
| 도로 | 130 | 260 |
| 경작지 | 175 | 350 |
| 주택 | 220 | 430 |
| 연립주거 | 300 | 780 |
| 집합주거 | 450 | 1,210 |
| 창고 | 320 | 635 |
| 시장 | 430 | 865 |
| 철광산/제련소/대장간 | 300 | 600 |
| 병영/훈련장/무기고 | 300 | 600 |
| 행정청 | 450 | 900 |

`PUBLIC_WORKS`와 `FORTIFICATION`의 기존 건설 노동 modifier도 유지한다.

---

## 8. D1/D1A/D1B 군사 기반 유지

다음 전쟁 기반은 변경하지 않는다.

- War Intent: ASSESSING / PREPARING / READY / CANCELLED / DECLARED
- Intelligence API V0, confidence 100%
- Operational Reachability
- 전쟁 중 같은 Side Coalition military access
- ACTIVE / DORMANT Formation lifecycle
- DORMANT Formation 물리적 지도 비표시
- 국가색 Formation ring
- 동일 Side 다국적 Formation의 1/n arc 표시
- Persistent Engagement
- 단계적 후퇴 / Regroup / Deep Recovery
- Battle Morale
- 지형·도로·Supply 기반 이동시간
- Multi-front / Multi-formation
- Person-backed casualties / manpower
- 임시 점령과 종전 후 원소유국 반환

D1C는 전투력, 사상자율, War Exhaustion 종전식 자체를 변경하지 않는다.

---

## 9. 저장 호환성

새 저장 버전:

- `0.33D1C`

localStorage key:

- `village-observer-v0-33d1c`

fallback 순서:

- D1B
- D1A
- D1
- D
- C3F
- C3

D1C 전용 Recovery Escape 상태는 각 Nation에 `v33d1cRecovery`로 저장한다.

World에는 다음 D1C 상태를 저장한다.

- revision
- Recovery Expansion 누적 시작 수
- War History UI ownership
- Recovery Escape 활성 여부

D1B 저장을 불러오면 기존 Recovery 상태를 그대로 이어받고 D1C 관측 상태를 새로 붙인다. War History는 저장된 `history33A`와 남아 있는 Telemetry를 병합해 보강한다.

---

## 10. 구현 후 Smoke Test

D1C 구현 후 다음을 확인했다.

- 총 83개 `<script>` 블록 `node --check`: **syntax error 0**
- Chromium headless `page.set_content()` 부팅: **page error 0 / console error 0**
- 문서 제목: `Village Observer V0.33D1C`
- 버전 배지: `V0.33D1C`
- `VSim.V033D1C.revision = war-observer-recovery-escape-stabilization`
- 저장 버전: `0.33D1C`
- 저장 → `World.from()` → 재저장 후 버전 `0.33D1C` 유지
- 기술 총비용: **6315** 유지
- 단일 도로 factor: **0.62** 유지
- 전쟁 유형 합성검증:
  - 1국 ↔ 1국 → `단독전쟁`
  - 2국 ↔ 1국 → `합동전쟁`
- 합성 점령 이벤트 검증:
  - 고유 누적 점령 2
  - 최대 동시 점령 2
  - 수도 점령 true
- 전쟁기록 panel owner: `V0.33D1C`
- Snapshot/CSV schema validation: **OK**
- D1C CSV 신규 필드 존재 확인
- 합성 Recovery deadlock 검증: `WOOD_AND_HOUSING` gate 통과 후 `v33d1cRecoveryEscape=true` Frontier Project 1개 정상 시작
- Nation `v33d1cRecovery` 상태 save/load 보존 확인

---

## 11. 다음 자연주행 검증 체크리스트

1. 전쟁 카드에서 A측/B측의 실제 국가가 항상 함께 보이는가?
2. 결과가 `A측 승리`가 아니라 실제 국가명 + `(A측/B측)`으로 보이는가?
3. 단독전쟁/합동전쟁 분류가 참가국 변화에 따라 맞게 보이는가?
4. 종전 후 현재 점령이 0이어도 누적 점령 이력이 남는가?
5. Side별 누적 점령과 최대 동시 점령이 실제 Devlog와 일치하는가?
6. 수도 점령 이력이 정상적으로 남는가?
7. Recovery 장기 고착 국가가 2~3년 안에 내부 해결 또는 Escape 후보 평가를 시작하는가?
8. 목재 수동채집 고갈 시 `RECOVERY_LOCAL_RESOURCE_EXHAUSTED33D1C`가 발생하는가?
9. Recovery Escape가 식량 부족·실제 Survival 상태에서는 차단되는가?
10. Recovery Escape가 한 episode에서 2회를 초과하지 않는가?
11. 복구용 개척이 자원/공간 병목과 관련된 타일을 우선하는가?
12. 복구용 개척 이후에도 Recovery가 즉시 해제되지 않고 실제 안정조건을 기다리는가?
13. D1B의 주거 3/5/8, 도로 0.62, 유지 0.5%, 건설속도에 회귀가 없는가?
14. Coalition Formation arc, Persistent Engagement, Operational Reachability에 회귀가 없는가?

---

## 12. 다음 단계

D1C 자연주행에서 위 안정화 항목이 정상이라면 다음 주요 버전은 **V0.33D2 — Strategic War Preparation**으로 진행한다.

D2의 예정 범위는 다음과 같다.

- PREPARING War Intent가 실제 추가 동원으로 연결
- 식량·군수 비축
- 장비 확보
- Formation 집결
- 작전 경로/전쟁용 도로 준비
- 두 번째 동시전쟁의 추가 준비 부담
- 과거 패전 기억을 준비 목표에 반영
- 적 동원 잠재력 추정

실제 불완전 정보, 정보 노후화, 정찰, 첩보, 은폐, 기만은 그 이후 Intelligence 확장 단계로 유지한다.
