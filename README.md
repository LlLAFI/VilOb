# Village Observer V0.30B3 — 기아·개척지·시장투자 후속 밸런스

Village Observer는 실제 주민(Person)의 생활·노동·이동·소비가 **Settlement → Nation → World** 변화로 이어지는 browser-based bottom-up 사회 시뮬레이션입니다.

V0.30은 V0.29에서 형성된 국내경제를 **도시·행정·재정 구조**와 연결하고, 식량·목재·석재의 현지가격을 실제 소비·예상수요·생산·물류 신호에 맞게 정교화하는 버전입니다. **V0.30A**는 UI·연간 통계·재정 유동성·성능 관측·상위시설 진단을 보완했고, **V0.30B2**는 53년 장기 데이터에서 확인된 극초기 국가 붕괴와 국가별 Treasury 편중, 전문시설 발생경로를 밸런싱했고, **V0.30B3**는 같은 세션을 63년까지 연장해 확인한 초기 집단아사, 개척지 재포기 churn, Treasury reserve에 의한 경제시설 투자 정지, Stoneworks 이중 gate를 후속 보완하는 버전입니다.

저장 데이터 버전은 `0.30B3`, localStorage 키는 `village-observer-v0-30b3`입니다. V0.30B2 및 그 이하 세이브는 fallback chain으로 읽은 뒤 V0.30B3 런타임 필드를 붙입니다. 내부 데이터 모델은 V0.30B2/V0.30A/V0.30을 계승하므로 기존 세이브의 Person·Settlement·Nation identity를 유지합니다.

---

## 문서 역할

`README.md`는 구현 의도·계산 규칙·호환성·관측 항목·검증 결과를 남기는 **상세 기술 문서**입니다.

인게임 패치노트는 이 README를 대체하지 않으며, 플레이 중 핵심 변경사항만 빠르게 확인하기 위한 요약 UI입니다.

---

# V0.30B3 후속 밸런스

V0.30B2 동일 세션을 약 63년까지 진행했을 때 6개 Nation은 모두 생존했고 장기 구간에서는 아사가 멈췄습니다. 따라서 V0.30B3의 목적은 생존보호를 더 강하게 만드는 것이 아니라, **9~16년에 집중된 급격한 Hunger 100 사망을 완만하게 만들고, 빈 개척지의 즉시 포기와 국가 Treasury reserve 때문에 경제시설이 멈추는 구조를 정리하는 것**입니다.

동시에 B2에서 Stoneworks 후보조건과 V0.20 실제 건설조건이 서로 달랐던 이중 gate를 제거해, AI trigger·실제 startConstruction·diagnostic이 같은 기준을 보도록 합니다.

## B3.1 Hunger 100 사망 유예와 severe Hunger 조기감지

기본 식량 요구량은 그대로 유지합니다.

- 0~14세: `0.30 / cycle`
- 15세 이상: `0.42 / cycle`
- 기존 기본 metabolism의 Hunger 상승량은 변경하지 않음

V0.29에서 추가 식량분 `.05 / .06`을 80% 미만 섭취했을 때 적용되던 추가 Hunger 패널티는 `+1.2 → +0.6`으로 완화합니다.

아사 판정은 다음과 같이 변경됩니다.

1. Hunger가 100에 처음 도달하면 `STARVATION_CRITICAL_ENTER_B3`를 기록합니다.
2. 즉시 사망하지 않고 12 calendar days의 극심기아 유예를 둡니다.
3. 이 기간 동안 Person은 여전히 행동·식사를 시도할 수 있습니다.
4. Hunger가 95 미만으로 회복되면 극심기아 카운터를 초기화합니다.
5. Hunger 100 상태가 충분히 지속되면 `DEATH_STARVATION`이 발생하며 `criticalHungerCalendarDays`를 로그에 남깁니다.

Early Survival Crisis에는 국가 평균 Hunger 외에 실제 Person의 꼬리위험을 추가합니다.

- Hunger ≥85 주민 존재: risk 증가
- Hunger ≥95 주민 1명 이상: 즉시 위기 후보
- Hunger ≥85 주민 2명 이상: 즉시 위기 후보

Emergency Food Convoy 재평가 cooldown은 기존 10 ordinal cycles에서 5 cycles로 줄입니다. 현재 360일제에서 약 30 calendar days → 약 15 calendar days입니다.

## B3.2 개척지 vacancy grace와 재집결 보정

V0.30B2까지 `maintainSettlements()`는 비핵심 Settlement 인구가 0명이 되었을 때 즉시 donor를 찾고, donor가 없으면 같은 tick에서 바로 영토를 포기했습니다. 이 구조는 `개척 → 일시적 공백 → 포기 → 재개척` churn을 키웠습니다.

V0.30B3에서는:

- 빈 비핵심 Settlement에 `unoccupiedDays`를 누적
- 약 90 calendar days에 해당하는 30 ordinal cycles 동안 소유권과 건물을 유지
- 유예기간 중 기존 migration/repopulation이 실제 주민을 보내면 즉시 정상화
- 유예기간이 끝날 때까지 주민이 돌아오지 못하면 `OUTPOST_ABANDONED`
- 최초 공백에는 `SETTLEMENT_VACANCY_GRACE_B3` 기록

또한 Early Survival의 강제 재집결은 가능하면 외곽 Settlement의 마지막 Person을 남깁니다. `pop=1`인 변경의 마지막 주민까지 이동시키는 것은 Nation 전체 인구가 10명 이하이거나 위험도 5 이상인 극단적 위기로 한정합니다.

## B3.3 Settlement market 선투자와 Treasury reserve 역할 분리

B2에서 전략 Treasury reserve는 국가가 선택적 지출로 국고를 0까지 사용하는 것을 막았지만, 자연런에서는 모든 Nation이 reserve 아래로 내려간 뒤 Trading Post 같은 경제시설까지 반복적으로 차단되는 사례가 확인되었습니다.

V0.30B3에서는 다음 경제시설을 **Settlement market 투자 대상**으로 취급합니다.

- Trading Post
- Market
- Quarry / Deep Quarry
- Stoneworks
- Merchant Guild
- Grand Market

Gold 비용이 있는 경제시설은:

1. 해당 Settlement의 `marketGold`에서 최소 지역 유동성 reserve를 제외한 surplus를 먼저 사용
2. 부족분만 Nation Treasury가 부담
3. 인구 30명 이상 Nation은 Treasury가 전략 reserve 아래로 더 내려가지 않는 범위에서만 보조
4. Nation Treasury가 이미 reserve 아래더라도 Settlement market이 Gold 비용을 전액 부담할 수 있으면 건설 허용

Gold는 Settlement market → Nation Treasury → construction payment로 보존 이동하므로 새로운 Gold를 생성하지 않습니다. 실제 공동부담은 기존 `SETTLEMENT_BUILD_COFINANCE`와 B3 `marketInvestments / marketGoldInvested` telemetry에 기록합니다.

## B3.4 Stoneworks canonical eligibility

V0.30B2에서는 `tryStoneworksB2()`의 후보조건과 V0.20 `startConstruction('stoneworks')`의 실제 허용조건이 달랐습니다. 따라서 diagnostic에서 준비 완료처럼 보여도 실제 건설경로에서 다시 거절될 수 있었습니다.

V0.30B3는 `stoneworksEligibility()` 하나를 canonical 조건으로 사용합니다.

공통 확인 항목:

- Nation active / Survival Mode 여부
- MASONRY 기술
- 같은 타일에 Stoneworks 존재 여부
- 진행 중 공사와의 충돌
- Nation별 Stoneworks 상한
- 최근 240일 stone import
- 최근 240일 construction activity
- 현지 stone price
- 실제 건축공간
- demand score

기본 수요 후보는 `stoneImports ≥18` 또는 `recentConstruction ≥2` 또는 `stonePrice ≥0.62`, 그리고 score 34 이상입니다.

이 함수는:

- B2 seasonal Stoneworks trigger
- V0.20의 실제 `startConstruction('stoneworks')` gate
- V0.30A specialization diagnostic

세 경로가 공동으로 사용합니다.

Merchant Guild / Grand Market / Deep Quarry의 기존 핵심 threshold는 V0.30B3에서 낮추지 않습니다.

## B3.5 석재 위기와 QUARRY 연구 우선도

63년 데이터에서는 Stone이 심하게 부족한 Nation이 QUARRY 기술을 아직 연구하지 않은 반면, QUARRY 보유 Nation은 상대적으로 석재 압력이 낮은 경우가 있었습니다.

V0.30B3는 기술 비용이나 prerequisite를 바꾸지 않고 연구 선택 AI에만 압력을 추가합니다.

석재 압력은 다음 신호를 조합합니다.

- 현재 stone / targetStone 비율
- Settlement stone 최고가격
- 최근 stone maintenance shortfall

압력이 충분히 높으면:

- MASONRY 미보유 + 연구 가능 → MASONRY 우선
- MASONRY 보유 + QUARRY 연구 가능 → QUARRY 우선

선택은 `B3_STONE_RESEARCH_PRIORITY`로 기록합니다.

## B3.6 UI 보완

- 상단 시간은 버전 버튼 아래 구조를 유지
- `연도 · 분기 · 일`은 `var(--accent)` 파란색, desktop 13px/700, mobile 12px
- 뒤의 `· 6개 국가` 표시는 기존 muted 계열 유지
- 지도 Settlement/상업/항구/폐허 주요 아이콘과 원형 배경을 기존의 약 60% 크기로 축소
- 행정권 `A`, 생활권 `L`, 도로 `R` 등 레이어 표식 크기는 변경하지 않음
- 국가 → 경제의 `생존·재정` 박스는 Survival Mode ON일 때만 녹색 강조, OFF일 때는 일반 V0.30 정보박스 색상 사용

## B3.7 추가 telemetry

Nation/snapshot에 다음 B3 관측값을 추가합니다.

- `severeHunger85B3`
- `severeHunger95B3`
- `starvationGraceEntriesB3`
- `starvationDeathsAfterGraceB3`
- `vacantGraceTilesB3`
- `vacantGraceAbandonsB3`
- `marketInvestmentsB3`
- `marketGoldInvestedB3`
- `stoneResearchPrioritiesB3`

World JSON에는 `v30B3Revision`, 새 demography model, frontier retention, economic investment, Stoneworks canonical gate, UI 변경사항을 기록합니다.

## B3.8 검증 기록

### 정적 검증

- standalone `index.html` inline JavaScript 40개 추출
- 전부 `node --check` 통과

### Chromium 실제 로드

확인 항목:

- document title: `Village Observer V0.30B3`
- 상단 badge: `Village Observer · V0.30B3`
- time label: 13px / 700 / accent blue
- world serialize version: `0.30B3`
- active nations: 6
- runtime exception: 0

### 기능 단위 회귀

- Hunger 100 최초 판정에서 Person 생존 유지
- 12 calendar days 경과 후 Hunger 100 지속 시 `DEATH_STARVATION`
- B3 starvation critical timestamp serialize/load 보존
- severe Hunger 95 한 명이 Survival profile에 직접 반영
- 빈 비핵심 Settlement: 29 ordinal cycles까지 소유권 유지, 30번째 cycle에서 포기
- Settlement market 30G / Nation Treasury 0G 조건에서 Trading Post 6G 비용을 market이 전액 보존 부담
- Stoneworks canonical eligibility 통과 후 기존 V0.20 hidden gate에 재차 막히지 않고 construction project 생성
- 석재압력 조건에서 QUARRY 연구 우선 선택 확인
- 생존·재정 박스: OFF 기본색 / ON 녹색 강조 확인
- map `drawIcon()`의 원형 및 emoji scale 60% 적용 확인

### Save migration

테스트용 V0.30B2 형식 save를 B3에서 load한 결과:

- Person 수: 88 → 88
- active nations: 6 → 6
- 재serialize version: `0.30B3`
- runtime exception: 0

### 확률적 smoke run

한 번의 약 13년 smoke run 결과 예시:

- active nations: 6 / 6
- population: 168
- claimed territory: 27 tiles
- starvation deaths: 8
- Early Survival crisis enter: 7
- Emergency Food Convoy: 69
- runtime exception: 0

이 smoke run은 생산 RNG를 고정하지 않은 짧은 회귀시험이며 장기 밸런스 결론으로 사용하지 않습니다. 특히 V0.30B3의 목적은 아사를 제거하는 것이 아니라 **초기 Hunger 100의 즉시 사망을 완화하고 AI가 severe Hunger를 더 일찍 인지하도록 하는 것**입니다. 최종 평가는 실제 60~100년 플레이 데이터로 다시 수행합니다.

---

# V0.30B2 최종 보완

V0.30A 실제 장기런에서는 7년 안에 한 국가가 소멸하고, 다른 한 국가는 수십 년 동안 한 자릿수 인구에 갇히는 사례가 확인되었습니다. 동시에 세계 전체 Treasury 비중은 회복됐지만 국가별 국고 편중이 커졌고, Merchant Guild / Grand Market / Deep Quarry / Stoneworks가 모두 0개인 상태가 이어졌습니다.

V0.30B2는 문명을 무적으로 만들지 않습니다. 목표는 **실제 식량·인구 기반이 남아 있는데도 지나친 Settlement 분산과 식량 접근 실패 때문에 초기 문명이 연쇄 붕괴하는 확률을 크게 낮추는 것**입니다.

## B2.1 Early Survival Crisis

각 Nation은 5 calendar-day 간격으로 다음 신호를 종합합니다.

- 인구 12명 이하: 위험도 +2
- 인구 13~18명: +1
- 평균 Hunger 32 이상: +1.5 / 27 이상: +1
- 식량 비축 18일 미만: +1.5 / 28일 미만: +1
- 평균 건강 68 미만: +1.5 / 74 미만: +0.75
- 최근 120일 아사 발생: +2
- 최근 90일 `V28_FOOD_ACCESS_BLOCKED` 4회 이상: +1
- 최근 약 120일 인구 20% 이상 감소: +1.5
- 3개 이상 유인 Settlement에서 1 Settlement당 평균 인구가 7명 미만: +1.5
- 인구 16명 이하에서 18~42세 남녀 한쪽이 0명: +0.5

위험도 2.5 이상이거나, 인구 10명 이하 / 최근 아사 2회 이상 / 인구 16명 이하+Hunger 32 이상이면 `EARLY_SURVIVAL_CRISIS_ENTER`가 발생합니다.

위기 중에는 Focus를 FOOD로 돌리고 신규 Frontier 프로젝트를 취소하며, 확장 가능 인력을 0으로 처리해 추가 분산을 중단합니다. 식량·Hunger·건강·최근 사망/접근차단이 안정된 상태가 약 120일 유지되면 `EARLY_SURVIVAL_CRISIS_EXIT`로 정상 AI에 복귀합니다.

## B2.2 저인구 확장 준비도

위기 상태가 아니어도 30명 미만 국가는 무제한으로 Settlement를 늘릴 수 없습니다.

- 인구 <14: 두 번째 Settlement까지만, 식량 45일·성인 6명 이상 필요
- 인구 <20: 세 번째 Settlement까지만, 식량 42일·성인 8명 이상 필요
- 인구 <25: 네 번째 Settlement까지만, 식량 40일·성인 9명 이상 필요
- 인구 <30: 다섯 번째 Settlement까지만, 식량 38일·성인 10명 이상 필요

최근 아사, 반복 식량접근 실패, 평균건강 70 미만이면 위 조건을 충족해도 확장을 보류합니다. 이 제한은 `availableSettlers()`를 통해 기존 확장 AI와 V0.20~V0.24 Frontier 시스템 양쪽에 동시에 적용됩니다.

## B2.3 재집결과 Emergency Food Convoy

위기 Nation이 실제로 지나치게 분산된 경우에만 주민 재집결을 수행합니다.

- 인구 12명 이하이거나
- 3개 이상 유인 Settlement + Settlement당 평균 인구 7명 미만

일 때, 90일에 최대 한 번 가장 작은 주변 Settlement의 실제 Person 1명을 더 안전한 중심 Settlement로 이동시킵니다. 따라서 평상시 migration을 대체하는 강제 집중 시스템은 아닙니다.

긴급 식량수송은 10일 간격으로 평가합니다. 식량 비축이 24일 미만인 Settlement가 있고 다른 Settlement가 42일 이상 비축하고 있으면 실제 donor stock을 차감해 운송합니다. 운송량은 수요·공급 잉여·route cost·실제 성인 운반 인력으로 제한됩니다. 식량을 생성하지 않습니다.

관련 telemetry:

- `EARLY_SURVIVAL_CRISIS_ENTER / EXIT`
- `EXPANSION_BLOCKED_SURVIVAL`
- `SURVIVAL_RELOCATION`
- `EMERGENCY_FOOD_CONVOY`
- `FRONTIER_EXPANSION_CANCELLED` with `EARLY_SURVIVAL`

## B2.4 멸망국 Treasury와 마지막 타일

Nation의 마지막 주민이 사망할 때 남은 Nation Treasury는 소멸하지 않습니다.

1. 마지막으로 실제 주민이 살았던 타일을 기록
2. Nation Treasury를 0으로 전환
3. 해당 타일의 `ruinGold30B2`로 같은 Gold를 이전
4. 다른 Nation이 그 타일을 점유하면 다음 daily cycle에 전액 회수

이동은 보존 이전이므로 Gold를 생성하지 않습니다.

새 관측값:

- `activeTreasuryGold30B2`
- `activeMarketGold30B2`
- `activePersonGold30B2`
- `activeMoneySupply30B2`
- `ruinGold30B2`
- `existingMoneySupply30B2`

따라서 멸망국의 잠긴 Treasury를 활동경제와 분리하면서도 세계에 존재하는 Gold 자체는 추적할 수 있습니다.

## B2.5 Treasury reserve와 Settlement 공동부담

V0.30A에서 세계 전체 Treasury 부족은 크게 개선됐지만 국가별 편중이 확인됐습니다. B2는 행정세율을 다시 올리지 않습니다.

대신 선택적 건설은 다음 전략 reserve를 고려합니다.

`reserve = clamp(8 + population × 0.055 + min(8, territory × 0.16), 8, 24)`

이 reserve는 30명 이상 Nation의 **비필수 건설**에만 적용됩니다. 주택·곡물창고·농경지·창고·채석장·도로·회관·개척거점 등 생존/기반시설은 reserve 때문에 차단하지 않습니다.

Merchant Guild / Grand Market / Deep Quarry / Stoneworks 같은 고티어 시설은 건설 타일 Settlement 시장의 운전자금을 남긴 뒤 Gold 비용의 최대 55%까지 시장이 공동부담할 수 있습니다. Settlement market Gold → Nation Treasury → 건설비 지출 순으로 이동하므로 Gold 보존을 유지합니다.

관련 telemetry:

- `TREASURY_RESERVE_BLOCK`
- `SETTLEMENT_BUILD_COFINANCE`

## B2.6 Quarry / Stoneworks 경로

상위시설 4종의 threshold를 일괄 인하하지 않습니다.

### Quarry → Deep Quarry

`QUARRY` 기술이 있고 Nation이 아직 Quarry/Deep Quarry를 하나도 보유하지 않았다면, 암지·산 타일에서 실제 석재 압력이 있을 때 기본 Quarry 건설을 다시 시도합니다. 석재 부족, 높은 현지가격 또는 자원탐색형 AI가 trigger가 됩니다.

이 조정은 `NO_BASE_BUILDING` 때문에 Deep Quarry가 영원히 막히는 문제를 해결하기 위한 것입니다. Deep Quarry 자체의 기존 전문화 문턱은 유지합니다.

### Stoneworks

Stoneworks만 실제 경제 규모에서 발동 가능하도록 trigger를 완만하게 조정합니다.

- 최근 240일 석재 유입 18 이상, 또는
- 최근 건설·개축·토지정비 2회 이상, 또는
- 현지 석재가격 0.62 이상

중 하나를 요구하고, 종합 score 34 이상이면 건설을 시도합니다.

Merchant Guild / Grand Market의 기술·throughput 핵심 문턱은 B2에서 낮추지 않습니다. 다음 장기런 diagnostic으로 재검증합니다.

## B2.7 UI

상단의 버전 버튼과 시뮬레이션 시간을 분리합니다.

```text
[ Village Observer · V0.30B2 ]
53년 1분기 71일
```

시간은 버튼 아래의 보조정보로 표시되고, 국가 수 표시는 기존 World mood 영역을 유지합니다.

## B2.8 저장 호환

- World save version: `0.30B2`
- localStorage: `village-observer-v0-30b2`
- fallback: V0.30A → V0.30 → V0.29 이하
- V0.30A의 maintenance/specialization/performance telemetry 유지
- `v30b2`에는 Nation별 생존상태·마지막 생존타일·재정 공동부담 누적을 저장
- Tile의 `ruinGold30B2`는 기존 Tile serialize 구조로 보존

## B2.9 구현 검증

정적 검증:

- inline JavaScript 39개
- 전부 `node --check` 통과

Chromium actual document 테스트(`page.set_content`, standalone inline script 실행):

- document title / badge: `Village Observer V0.30B2`
- 시간 DOM이 버전 버튼 아래 `v30b2VersionStack`으로 이동
- serialize version `0.30B2`
- Runtime exception 0
- 인구 10명·고 Hunger 강제 위기: `EARLY_SURVIVAL_CRISIS_ENTER` 1회, 확장 가능 Settler 0명
- 멸망 Treasury 75.04G → 마지막 생존 타일 `ruinGold30B2` 75.04G 확인
- 타국 점유 후 `RUIN_GOLD_RECOVERED`로 회수 확인
- B2 save/load 인구 보존 확인
- V0.30A 형식 load → B2 attach 및 재serialize `0.30B2` 확인
- Settlement market Gold 공동부담 실제 보존 이전 확인
- QUARRY 기술 + 암지 + 석재압력 조건에서 `B2_QUARRY_PATH` 건설 프로젝트 시작 확인

20년 smoke run(랜덤 세계 1회):

- 6 / 6 Nation 생존
- Runtime exception 0
- 생존위기 진입 10회 / 정상복귀 7회
- 긴급수송 13회
- 재집결 9회
- 20년 영토 26 tiles

첫 구현안은 20년에 영토 18 tiles, 재집결 120회로 과도하게 보수적이어서 폐기했습니다. 최종 B2에서는 두 번째 Settlement 자체를 막지 않고 **인구 대비 세 번째 이상 과잉 분산을 억제**하는 방향으로 완화했습니다.

장기 60~100년 밸런스 검증은 실제 플레이 데이터로 계속 수행해야 합니다.

---

# 1. V0.30 목표

V0.29 장기실험에서 다음 구조가 확인되었습니다.

- Person → 소비 → Settlement 시장으로 Gold가 안정적으로 순환
- 세계 Gold의 대부분이 Settlement 시장에 축적되고 Nation Treasury는 상대적으로 작아짐
- 일부 고밀도 국가에서 주택 부족이 장기화되며 실제 원인은 Wood/Stone 조달 병목으로 분화
- 국가 전체 식량은 충분해도 특정 Settlement에서 접근성 문제와 아사가 발생
- 저밀도 확장국의 job capacity 사용률과 고밀도 도시국의 사용률이 크게 분화
- 국내교역은 실제로 활발했지만 기존 상업 고도화 throughput에는 충분히 연결되지 않음
- 기존 가격식의 식량 소비량이 V0.29의 실제 연령별 소비량과 불일치
- 목재·석재 가격이 저장용량 대비 비축률에 지나치게 의존하여 창고 증설만으로 가격압력이 변할 수 있음

V0.30은 이 문제를 개별 수치 너프로 처리하지 않고 다음 연결을 강화합니다.

`Settlement 경제 → 지역가격 → 국내교역 → 도시 중심성 → 행정권 → 세수 → Nation 재정 → 지역 지원`

---

# 2. 지역가격 V2

기준가격은 기존 값을 유지합니다.

- 식량: `0.32 G`
- 목재: `0.27 G`
- 석재: `0.46 G`

각 Settlement는 여전히 독립적인 현지가격을 가지며 가격은 목표값으로 즉시 점프하지 않고 기존 smoothing을 통해 점진적으로 이동합니다.

## 2.1 식량 가격

V0.29 이전 식량가격 계산은 `인구 × 0.36`을 소비량으로 사용했습니다.

V0.30에서는 실제 V0.29 소비 구조와 일치시킵니다.

- 0~14세: `0.30`
- 15세 이상: `0.42`

Settlement의 식량가격은 다음 신호를 반영합니다.

1. 현재 재고가 실제 인구의 소비를 몇 일 버틸 수 있는지
2. 최근 30일·120일 실제 현지 식량 생산량
3. 타일에 남은 자연 식량자원
4. 최근 수입과 수출의 순방향
5. 최근 실제 거래량

핵심 기준은 약 45일 비축이며, 실제 비축일수가 낮아질수록 가격압력이 올라갑니다.

따라서 V0.30에서는 **게임 내부의 실제 Hunger/비축 판단과 가격 판단이 서로 다른 소비량을 사용하는 문제를 제거**합니다.

## 2.2 목재·석재 가격

V0.29까지는 저장용량 대비 재고비율이 주요 가격 신호였습니다.

이 방식에서는 예를 들어 같은 석재 100을 보유하고 있어도 창고가 커지는 순간 비축률이 낮아져 가격이 올라갈 수 있었습니다.

V0.30에서는 저장용량 비율의 비중을 사실상 제거하고 다음을 중심으로 계산합니다.

- 현재 실제 재고
- 진행 중 건설·토지개발·개축의 자재 요구량
- 주거 capacity 부족에서 파생되는 잠재 건설수요
- 기존 건물의 유지보수 예상수요
- Settlement 인구에 따른 기본 자재수요
- 최근 30/120일 실제 현지 생산량
- 현지 자연자원의 잔존비율
- 국내·국가간 수입/수출 순방향
- 최근 거래량

즉 가격의 질문을

`창고가 몇 % 차 있는가?`

에서

`현재 재고와 실제 공급능력으로 앞으로 예상되는 수요를 얼마나 감당할 수 있는가?`

로 변경했습니다.

## 2.3 실제 생산량 기록

V0.30은 각 Tile에서 실제 `harvest()`로 채취된 식량·목재·석재를 최근 약 130 legacy-day 범위로 기록합니다.

가격은 최근 30일과 120일 생산속도를 혼합해 사용합니다.

자연자원이 많이 남아 있어도 실제 노동·채취가 없으면 강한 공급 신호로 취급하지 않으며, 반대로 실제 생산이 지속되는 생산지는 가격압력이 낮아질 수 있습니다.

---

# 3. 국내교역과 가격 연결

V0.29의 `DOMESTIC_TRADE29`는 실제 stock과 Settlement market Gold를 이동시켰지만 기존 `marketState.tradeVolume`에는 직접 연결되지 않았습니다.

V0.30에서는 국내거래가 성사되면:

- 구매 Settlement의 실제 재고 증가
- 판매 Settlement의 실제 재고 감소
- 구매시장 → 판매시장 Gold 이동
- 양쪽 시장의 `tradeVolume` 증가
- 구매지 가격에 단기 하락압력
- 판매지 가격에 단기 상승압력
- V0.30 순유입/순유출 누적 신호 갱신

이 발생합니다.

국내거래 체결가는 기존 V0.29 구조를 유지하여 대체로

`(구매지 현지가격 + 판매지 현지가격) / 2 + 물류비`

로 계산합니다.

석재는 일반 자원보다 높은 단위 물류비를 유지합니다.

## 3.1 상위 상업시설 throughput 연결

기존 상업 고도화 판단은 주로 `TRADE` 이벤트를 throughput으로 계산했습니다.

V0.30부터 `DOMESTIC_TRADE29`도 다음 판단에 포함됩니다.

- Trading Post → Merchant Guild
- Market → Grand Market
- 상업 throughput utilization

따라서 국내경제가 성장했는데도 국제교역량이 적다는 이유로 상업시설이 영구적으로 고도화되지 못하는 현상을 완화합니다.

## 3.2 Stoneworks의 국내 석재 유입 인식

Stoneworks 수요판단의 최근 석재 수입에도 국내 Settlement 간 석재 거래를 포함합니다.

이 변경은 상위시설이 반드시 생성되도록 강제하지 않습니다. 실제 기술·수요·공간·가격·건설조건을 만족해야 합니다.

---

# 4. Settlement 행정등급

V0.30은 Settlement를 삭제하거나 별도의 aggregate city 엔티티로 치환하지 않습니다.

기존 실제 Settlement를 유지한 채 다음 관찰·행정 역할을 부여합니다.

- 일반 정착지
- 지역 중심지
- 도시
- 주요 도시

등급은 고정 지정을 하지 않고 다음 값에서 계산합니다.

- 실제 거주 인구
- V0.28 도시성(urbanity)
- V0.29 hub score
- 상업·행정 시설
- Nation core 여부

도시등급은 우선 **세계 상태를 설명하고 행정권 중심 후보를 정하는 기능**을 담당합니다. 직접적인 대규모 생산 보너스는 부여하지 않습니다.

---

# 5. 행정권

기존 생활권(Life Zone)은 그대로 유지합니다.

생활권은 통근·접근·기능관계를 나타내며 행정구역이 아닙니다.

V0.30은 그 위에 별도의 행정권을 추가합니다.

행정권 중심 선정은 다음을 사용합니다.

- Nation core
- Settlement 행정점수
- 도시등급
- 인구와 상업중심성
- 다른 행정 중심지와의 거리

인구가 성장하면 한 국가에 여러 행정 중심지가 생길 수 있습니다. V0.30A는 V0.30 장기런에서 모든 국가가 사실상 단일 행정중심으로 남았던 문제를 보완하여 국가 규모에 따라 최대 5개 중심지를 허용합니다. 두 번째 이후 중심지는 지역 중심지 이상 또는 충분한 행정점수를 가진 Settlement 중 기존 중심지와 경로비가 일정 이상 떨어진 곳에서 선택합니다.

각 Settlement는 경로비와 중심지의 행정점수를 함께 비교하여 한 행정권에 속합니다.

행정권 경계는 분기 단위의 저빈도 캐시로 계산하여 Person 단위 tick에 새로운 무거운 계산을 추가하지 않습니다.

---

# 6. 행정재정

V0.29에서는 소비세 10%가 Person 소비에서 Nation Treasury로 직접 환류했습니다.

V0.30은 이를 유지하면서 Settlement 시장에 쌓인 상업자금과 Nation 재정 사이에 작은 추가 연결을 만듭니다.

## 6.1 행정세

약 30 calendar-day 단위로 Settlement market Gold의 작은 비율이 Nation Treasury로 이동합니다.

V0.30A 기본 비율은 **30 calendar-day당 과세대상 시장 Gold의 `0.38%`**입니다. 단, 전체 market Gold에 일괄 적용하지 않습니다. 각 Settlement에 `max(1.5G, 인구×0.08 + 자원수요 합×0.35)` 수준의 지역 운전자금을 남기고, 그 **초과분에만** 행정세를 적용합니다.

행정등급별 징수 효율은 일반 Settlement `×1.00`, 지역 중심지 `×1.10`, 도시 `×1.20`, 주요 도시 `×1.30`입니다.

중요한 점은 이 과정에서 Gold를 새로 생성하지 않는다는 것입니다.

`Settlement market Gold → Nation Treasury`

의 보존 이전입니다.

## 6.2 지역 공공지출

Nation Treasury가 충분한 경우 다음 문제를 가진 Settlement를 탐색합니다.

- 주택 capacity 부족
- 낮은 식량 비축일수
- 높은 Wood/Stone 수요

가장 큰 병목을 가진 지역에 소액의 Gold를 다시 이전합니다.

`Nation Treasury → Settlement market Gold`

이 역시 Gold 생성이 아니라 보존 이전입니다.

V0.30에서 이 자금은 자체적으로 자원을 생성하지 않습니다. 다만 Settlement가 국내 자원을 구매할 수 있는 시장 유동성을 제공합니다.

## 6.3 긴급 건설재 조달

V0.29에서는 시장현금이 부족할 때 Nation 재정의 긴급 지원이 주로 식량에만 적용되었습니다.

V0.30에서는 Wood/Stone 수요압력이 충분히 높은 경우 제한적인 국고 bridge를 허용합니다.

따라서 고밀도 도시가 실제 Stone/Wood를 보유한 다른 Settlement와 연결되어 있다면, 국가재정이 국내조달을 일부 지원할 수 있습니다.

---

# 7. Gold 회계 V1

V0.29 장기실험에서 기존 `global.totalGold`가 실질적으로 Nation Treasury에 가까운 값이 되어 전체 통화량을 나타내지 못했습니다.

V0.30은 다음을 별도로 기록합니다.

- `treasuryGold30` — Nation Treasury
- `marketGold30` — Settlement market Gold
- `personGold30` — Person wallet Gold
- `moneySupply30` — 위 세 보유처의 합계

세계와 국가 스냅샷 모두 이 값을 기록합니다.

## 7.1 관측 source/sink audit

기존 V0.29 이전 시스템에는 건설·교역비·환류·관찰자 개입 등 여러 Gold source/sink가 이미 존재합니다.

V0.30은 이를 한 번에 복식부기로 재작성하지 않습니다.

대신 스냅샷 사이의 실제 전체 통화량 변화를 측정하여:

- `observedGoldSource30`
- `observedGoldSink30`
- `lastMoneyDelta30`

를 누적합니다.

이 값은 **원인을 이미 알고 있는 source/sink 분류가 아니라 잔여 통화량 변화 audit**입니다. 다음 장기데이터에서 어떤 구간에서 Gold가 생성·소멸하는지 찾기 위한 진단 장치입니다.

---

# 8. Settlement Gold 통계

V0.30부터 Settlement 연간 history에 다음을 추가합니다.

- `mg30` — Settlement market Gold
- `mgpc30` — 1인당 market Gold
- `ju30` — 시설 job slot 사용률
- `ar30` — 행정등급
- `ah30` — 소속 행정 중심 Tile

기존 통계 화면의 정착지 범위에서 다음 새 그래프를 선택할 수 있습니다.

- Settlement 시장 Gold
- 1인당 시장 Gold
- Job slot 사용률

세계·국가 통계에는:

- 국가 금고 Gold
- Settlement 시장 Gold
- Person Gold
- 전체 통화량
- 행정 중심지 수
- 누적 행정세
- 누적 지역 공공지출

을 추가합니다.

V0.30A에서는 세계/국가 Gold·행정 지표가 일반 snapshot에만 기록되고 `yearlySummaries`에는 늦게 추가되어 세계/국가 그래프가 비던 문제를 수정했습니다. snapshot 완료 뒤 V0.30/V0.30A 필드를 해당 연도의 world/nation summary로 다시 동기화합니다.

또한 식량/목재/석재 가격 metric을 각각 나열하는 방식은 제거하고 **`평균 가격` + `상품 선택`** 구조로 통합합니다. 현재 상품 선택기는 식량·목재·석재를 제공하며, V0.31 이후 자원 정의가 늘어날 때 같은 selector를 확장하는 것을 전제로 합니다.

---

# 9. UI

## 9.1 행정권 지도 레이어

지도 레이어에 `행정권`을 추가합니다.

- 동일 색: 같은 행정권
- 원형 `A`: 행정 중심지
- 생활권과는 별도 계산

생활권 레이어는 그대로 유지하므로 기능권과 행정권을 비교할 수 있습니다.

## 9.2 Settlement 상세

V0.30A는 보유 건물 `<details>`의 펼침 상태를 Settlement별·건물 종류별 UI 상태로 보존합니다. 게임 tick이 넘어가며 DOM이 다시 렌더되어도 사용자가 열어둔 건물 상세가 즉시 접히지 않습니다.

정착지 상세에 다음을 추가합니다.

- 행정등급
- 소속 행정권
- 행정 중심 Tile
- 최근 30일 실제 자원 생산속도
- 현재 Settlement market Gold

## 9.3 국가 경제

국가 경제 화면 상단에 다음을 표시합니다.

- 국가 금고
- Settlement 시장 Gold 합계
- Person Gold 합계
- 국가 내부 전체 통화량
- 행정 중심지 수
- 누적 행정세
- 행정권별 인구·Settlement 수·시장 Gold

---

## 9.4 고정 성능 관측

성능 수치를 인게임 패치 간단 요약과 분리합니다. `세계` 화면의 독립 **성능 관측** 패널에서 다음 값을 계속 표시합니다.

- simulation ms/day
- simulation batch ms
- render ms
- wall time
- 현재 speed
- chunk days / yield count
- 주요 HOT subsystem
- 현재 인구

또한 `performanceYearly30A`에 연도·인구·ms/day·SIM·render·wall·speed·chunk/yield를 저장합니다. CSV에는 V0.30A 유지보수 자재 진단과 observed Gold source/sink 열도 추가합니다. 따라서 이후 패치노트 DOM이 교체되어도 장기 성능·재정·유지보수 비교 데이터가 사라지지 않습니다.

# 10. 저장 호환

- World save version: `0.30A`
- localStorage: `village-observer-v0-30a`
- V0.30 → V0.29 이하 fallback load 유지
- 기존 Building ID 유지
- 기존 Person / Settlement / Nation 개체 유지
- V0.30A 미존재 필드는 load 시 기본값 생성
- V0.30A는 V0.30 데이터 모델을 호환 wrapper로 읽고 `v30a` 상태를 복구

V0.30A는 V0.30/V0.29 세이브를 읽을 때 기존 `v29Economy`, Person `gold29`, 국내거래·도시화·V0.30 행정/Gold 상태를 유지합니다. V0.30A 전용 유지보수 진단·상위시설 진단·성능 history는 없으면 안전한 기본값으로 시작합니다.

---

# 11. 성능 설계

V0.30은 Person 실체 유지 원칙을 변경하지 않습니다.

추가 계산은 가능한 한 Settlement/Tile 단위에서 수행합니다.

- 행정권 경계: 저빈도 캐시
- 행정재정: 월 단위 pulse
- 실제 생산 history: Tile별 최근 약 130일의 sparse ledger
- Gold 회계: telemetry snapshot 시 집계
- 성능 history: telemetry snapshot 뒤 연간 summary에 별도 보존
- 상위시설 진단: 연 1회/Nation 저빈도 검사
- 유지보수 자재 진단: 기존 분기 유지보수 호출을 감싸 실제 소모량만 측정
- 가격: 기존 시장 업데이트 cadence 재사용

V0.29의 주요 병목인 Person action / villageDaily를 직접 확장하지 않는 것을 목표로 합니다.

---

# 12. 검증 기록

## 12.1 정적 JavaScript 검증

standalone `index.html`의 inline script를 모두 분리해 `node --check`를 수행했습니다.

- V0.30 base inline JavaScript: **37개**
- syntax error: **0**

## 12.2 V0.30 base Chromium 실제 부팅

headless Chromium의 DevTools Protocol을 이용해 HTML 전체를 실제 document로 로드했습니다.

확인 항목:

- document title: `Village Observer V0.30`
- 상단 badge: `Village Observer · V0.30`
- `window.VSim.V030` 로드 성공
- 새 World serialize version: `0.30`
- active nations: 6
- patch notes 첫 항목: `V0.30`
- 행정권 map option 존재
- Settlement `시장 Gold` 통계 option 존재
- 초기 브라우저 Runtime exception: 0

## 12.3 V0.30 base 중기 smoke run

동일 브라우저 세션에서 약 3,600 legacy advance step을 진행한 임의 RNG smoke run에서:

- 표시 연도: 약 11년
- active simulation 유지
- save version `0.30`
- serialize → JSON clone → `World.from()` 복원 성공
- 복원 후 인구 동일
- 식량·목재·석재 가격이 국가별로 서로 다른 값 유지
- Nation / Person / Settlement Gold 집계 정상
- 행정 중심지 계산 정상
- Runtime exception: 0

이 테스트는 **60~100년 장기 밸런스 검증을 대체하지 않습니다.**

상위 Merchant Guild / Grand Market / Deep Quarry / Stoneworks는 이 짧은 테스트 구간에서는 아직 등장하지 않았습니다. V0.30은 국내 throughput과 Stone 국내유입을 고도화 판단에 연결했지만 실제 후기 등장 여부는 다음 장기 데이터에서 다시 확인해야 합니다.

---

## 12.4 V0.30A 정적·브라우저 회귀

V0.30A 패치 적용 뒤 standalone `index.html`의 inline script를 다시 전부 분리해 `node --check`를 수행했습니다.

- inline JavaScript: **38개**
- syntax error: **0**

시스템 Chromium을 이용해 HTML 전체를 실제 document로 주입하여 런타임 회귀도 수행했습니다.

확인 항목:

- document title / badge: `Village Observer V0.30A`
- serialize version: `0.30A`
- active nations: 6
- world `국가 금고 Gold` 연간 그래프: **기록 없음 메시지 없이 정상 렌더**
- `평균 가격` metric + 상품 `석재` selector: 정상 렌더
- 기존 `평균 식량/목재/석재 가격` 개별 option: 통계 dropdown에서 제거
- Settlement 건물 상세 `<details>`를 연 뒤 `renderVillageContent()` 재실행: **열림 상태 유지**
- 세계 화면 고정 성능 패널 생성: 정상
- 약 11년 smoke run: Runtime exception **0**
- `performanceYearly30A`: 11년 기록 생성
- 상위시설 진단: 6개 Nation 모두 진단 데이터 생성
- V0.30A serialize → JSON clone → `World.from()` 복원: 인구 동일

추가 migration 테스트에서는 V0.30 형식으로 버전을 낮추고 `yearlySummaries`에서 V0.30 Gold 필드를 의도적으로 제거한 뒤 load했습니다. 보존 snapshot을 이용한 backfill 후 world treasury / market Gold와 Nation treasury 연간 값이 다시 생성되는 것을 확인했습니다.

단일 임의 RNG 중기 smoke run은 장기 밸런스 검증을 대체하지 않습니다. 특히 행정세 V2의 후기 Treasury 비율, 다중 행정 중심지, 상위시설 실제 등장 여부는 실제 70~100년 플레이 데이터로 다시 판단합니다.

---
# 13. V0.30A 장기데이터 우선 관찰 항목

1. 세계/국가의 V0.30 Gold·행정 연간 그래프가 실제로 누락 없이 표시되는지
2. 건물 상세 펼침 상태가 tick 재렌더 뒤에도 유지되는지
3. `평균 가격` 상품 selector가 식량/목재/석재에서 정상 전환되는지
4. 행정세 V2 뒤 Treasury / Settlement Market / Person Gold 비중 변화
5. `observedGoldSource30` / `observedGoldSink30` 누적 속도와 후기 통화팽창 원인
6. 다중 행정 중심지가 실제 중대형 국가에서 형성되는지
7. 상위시설 진단 blocker 분포와 Merchant Guild / Grand Market / Deep Quarry / Stoneworks 실제 등장 여부
8. 유지보수 목재/석재 shortfall과 건물 비활성화의 상관
9. 독립 성능 패널과 `performanceYearly30A`가 장기런에서 계속 남는지
10. 고밀도 국가의 Stone/Wood 조달과 housing strain 변화
11. 식량 총량은 충분하지만 local food access가 막히는 사례의 변화
12. 가격 V2가 생산지와 소비지 사이의 가격차를 자연스럽게 만드는지
13. 저밀도 확장국의 job capacity 과잉이 계속되는지
14. 생활권과 행정권이 지나치게 동일하게 겹치지 않는지
15. 국가별 AI 성향 차이가 유지되는지
16. 1,500 / 3,000 / 5,000 Person에서 ms/day 및 Person action 병목

---


# 14. V0.30A 구현 상세

V0.30A는 **A = Adjustment** 규칙을 사용하는 첫 보완 버전입니다. 숫자 버전은 새로운 시스템 단계, 알파벳은 같은 단계 내부의 보완 성격을 뜻합니다.

## 14.1 건물 상세 UI 상태 보존

Settlement 상세 DOM은 tick마다 재렌더되므로 브라우저 `<details open>` 상태만으로는 펼침 상태를 유지할 수 없습니다. V0.30A는 현재 상세 Settlement ID와 열린 건물 그룹 label을 UI 상태에 보존한 뒤 렌더 후 같은 그룹을 다시 엽니다. Person/Building 데이터에는 UI 상태를 저장하지 않습니다.

## 14.2 연간 Gold/행정 통계 동기화

기존 annual compactor가 V0.30 snapshot wrapper보다 먼저 실행되면서 V0.30 필드가 `yearlySummaries`에 들어가지 않는 호출 순서 문제가 있었습니다. V0.30A는 최종 snapshot이 완성된 뒤 다음 필드를 해당 연도의 summary에 복사합니다.

- treasury / market / Person / total money supply
- observed Gold source / sink
- admin center / levy / regional grant
- 기존 performance telemetry
- Nation 유지보수 자재 진단

기존 V0.30 세이브의 보존 snapshot에도 이 값이 있으면 load 시 annual summary를 backfill합니다.

## 14.3 행정세 V2

목표는 Treasury 비율 자체를 강제로 맞추는 것이 아니라 **상위시설·대외조달·공공투자를 수행할 최소 국가 유동성을 확보**하면서 Settlement 시장의 거래자금을 보존하는 것입니다.

30일 pulse마다:

1. Settlement의 인구와 자원수요에서 지역 운전자금을 계산
2. market Gold가 준비금 이하이면 과세하지 않음
3. 준비금 초과분에 기본 0.38% 적용
4. 행정등급별 징수 효율 적용
5. Gold는 생성하지 않고 Settlement market → Nation Treasury로 이전

## 14.4 유지보수 자재 진단

기존 `maintenanceShortfallShare25`는 주로 노동 shortfall을 설명하므로 자재 부족 국가에서 건물이 비활성화돼도 0%로 보일 수 있었습니다. V0.30A는 분기 유지보수 함수 호출 전후의 실제 national tile stock 변화를 측정하여 목재·석재 각각의 필요량·실사용량·shortfall share를 별도로 기록합니다.

## 14.5 상위시설 진단

V0.30 장기런에서 네 상위시설이 모두 0이었지만 V0.30A에서는 아직 trigger threshold를 임의로 낮추지 않습니다. 대신 Nation별 연간 진단에서 다음 blocker를 기록합니다.

- `NO_BASE_BUILDING`
- `TECH`
- `TREASURY_GOLD`
- `WOOD` / `STONE`
- `THROUGHPUT`
- `TERRAIN`
- `STONE_PROCESSING_DEMAND`
- 그 외 `TRIGGER_SCORE_OR_SPACE`

다음 장기런에서 실제 blocker 분포를 보고 V0.30B 또는 V0.30A 후속 수정 여부를 결정합니다.

## 14.6 행정 중심지 완화

V0.30은 인구가 늘어도 대부분 국가가 중앙 행정권 하나에 머물렀습니다. V0.30A에서는 행정 중심지 목표 수가 더 이른 인구규모에서 증가하고, 기존 중심지와 충분히 떨어진 지역 중심지도 후보가 될 수 있도록 문턱을 완화합니다.

---

# 15. V0.31~V0.33 연결


V0.30A 안정화 이후 예정 흐름은 다음과 같습니다.

- **V0.31 — 자원 일반화 · 철기경제**: 철광석 → 제련 → 철제품 및 범용 자원/가공 사슬
- **V0.32 — 군사사회**: 실제 Person 군인, 장비, 부대, 군사 유지비와 보급
- **V0.33 — 전쟁 V1**: 실제 지도 이동·보급·전투·사상자·점령

V0.30/V0.30A에서 형성된 행정·재정·지역시장 구조는 이후 철 생산지, 가공도시, 군수경제와 전쟁 보급의 기반으로 사용합니다.

---

# 부록 A. V0.29 기반 시스템 상세

아래 내용은 V0.30이 그대로 계승하는 V0.29 시스템의 상세 기술 기록입니다.

Village Observer는 실제 주민(Person)의 생활·노동·이동·소비가 **Settlement → Nation → World** 변화로 이어지는 browser-based bottom-up 사회 시뮬레이션입니다.

V0.29의 핵심 목표는 V0.28에서 형성된 도시·생활권 위에 **정착지별 생산능력, 일자리, 수요, 가격, 물류, Person의 소득·소비와 Gold 흐름**을 연결하는 것입니다. 국가 경제를 하나의 숫자로 처리하지 않고 실제 Settlement와 Person 사이에서 자원과 Gold가 이동하도록 구성합니다.

저장 데이터 버전은 `0.29`, localStorage 키는 `village-observer-v0-29`입니다. 기존 V0.28 이하 저장은 fallback load 후 V0.29 런타임 필드를 안전한 기본값으로 붙이는 방식으로 호환합니다.

---

## 문서 역할

`README.md`는 **상세 기술 문서**입니다. 구현 의도, 계산 규칙, 호환성, 관측 항목, 검증 내용을 가능한 한 구체적으로 남깁니다.

게임 상단 버전 배지에서 여는 인게임 패치노트는 README를 대체하거나 축약한 파일이 아니라, **README의 핵심 변경점을 플레이 중 빠르게 확인하기 위한 요약 UI**입니다.

---

# 1. V0.29 핵심 경제 루프

V0.29에서 새로 강화하는 국내 순환은 다음과 같습니다.

`생산 → 노동/판매 수입 → Person 소비 → Settlement 상업자금 → 세금 → Nation 재정 → 공공지출 → Settlement/Person`

기존의 식량·목재·석재 실물 재고, 정착지별 가격, 국가간 교역, 도로·지형 물류, 외교·전략적 교역 억제는 유지합니다.

새 경제 시스템은 기존 경제를 교체하지 않고 그 위에 Person/Settlement 단위의 Gold 흐름을 추가합니다.

## 1.1 Person Gold

V0.29 Person에는 다음 런타임 값이 추가됩니다.

- `gold29`: 현재 개인이 보유한 Gold
- `income29`: 누적 수입
- `spending29`: 누적 소비
- `taxes29`: 누적 납세

성인 Person은 자신의 실제 직업과 생산성에 따라 임금을 받을 수 있습니다. 임금은 우선 근무 Settlement의 상업자금에서 나오며, 부족하면 국가재정이 제한적으로 보조합니다.

Person은 접근 가능한 상업 중심지를 선택해 일부 Gold를 소비합니다. 소비금액의 10%는 세금으로 Nation에 환류하고, 나머지는 해당 Settlement의 상업자금이 됩니다.

## 1.2 Settlement 상업자금

각 Settlement의 `v29Economy.marketGold`는 지역 시장이 실제로 사용할 수 있는 Gold입니다.

주요 흐름:

- 국가 공공지출 → Settlement 상업자금
- Person 소비 → Settlement 상업자금
- Settlement가 다른 Settlement의 자원을 구매 → 판매 Settlement로 상업자금 이동
- 임금 지급 → Person 지갑으로 이동

V0.29에서 추가한 내부 이전은 가능한 한 기존 Gold를 **다른 보유 주체로 이동**시키는 방식입니다. 단, V0.28 이하에서 이미 존재하는 국가간 교역 수수료·건설비·기타 기존 Gold source/sink까지 제거하는 버전은 아니므로 세계 전체 Gold 총량이 완전 보존되는 모델은 아닙니다.

## 1.3 정착지별 국내 자원거래

V0.29 국내거래는 국가 전체 재고를 순간이동시키지 않습니다.

각 Settlement의:

- 실제 food / wood / stone 재고
- 저장 한도 대비 재고비율
- Settlement별 시장가격
- 수요 압력
- 물류 경로비
- 도로 여부
- 상업자금

을 비교해 거래 후보를 찾습니다.

구매지와 판매지 사이에 실제 가격차·수요·수송비를 고려한 이익이 있어야 거래가 발생합니다. 거래가 성사되면 실제 stock이 출발 Settlement에서 빠지고 도착 Settlement에 적재되며, Gold도 구매지의 상업자금에서 판매지 상업자금으로 이동합니다.

식량이 심각하게 부족한 지역은 제한적인 국가 공공지출을 통해 지역 상업자금을 보조받을 수 있습니다.

## 1.4 정착지의 관찰용 경제 역할

각 Settlement에는 경제 상태를 관찰하기 위한 역할이 표시될 수 있습니다.

- 농업 생산지
- 목재 생산지
- 석재 생산지
- 상업 중심지
- 주거 중심지
- 혼합 정착지

이는 AI에게 고정 역할을 부여하는 시스템이 아닙니다. 실제 직업구조, 자원재고, 인구, 통근, 상업 중심성으로부터 매번 **관찰 결과로 계산되는 라벨**입니다.

---

# 2. 생산시설의 실제 근무 슬롯

V0.29에서는 특정 생산·상업·교육 직업이 시설 수와 무관하게 무한히 늘어나는 것을 막습니다.

Person 개체는 그대로 유지하며, 시설이 제공하는 실제 직업 슬롯에 배치됩니다.

## 2.1 시설별 기본 슬롯

현재 V0.29 초기값:

| 시설 | 직업 | 기본 최대 인원 | 기술 증가 |
|---|---|---:|---|
| 고대 경작지 | 농부 | 7 | 관개 +1, 윤작 +2 |
| 고대 채석장 | 광부 | 3 | 공학 +1 |
| 고대 전문 채석장 | 광부 | 6 | 공학 +1 |
| 고대 시장 | 상인 | 3 | 표준 도량형 +1 |
| 고대 대시장 | 상인 | 7 | 상법 +1 |
| 고대 교역소 | 상인 | 2 | 장거리 교역 +1 |
| 고대 상단 회관 | 상인 | 5 | 상법 +1 |
| 고대 항구 | 상인 | 2 | 항해술 +1 |
| 고대 학당 | 학자 | 2 | 교육 +2 |

건물 condition이 낮아지면 실제 사용 가능한 슬롯도 감소하며, condition 0의 시설은 슬롯을 제공하지 않습니다.

## 2.2 초기 생존용 비시설 노동

초기 문명이 시설 건설 전부터 즉시 붕괴하지 않도록, **유한한 비시설 생계 슬롯**은 남깁니다.

농업:

- 평지 5
- 초지 5
- 숲 3
- 암석지 2
- 산지 1

광업/채석:

- 암석지·산지 3
- 기타 통행 가능한 육지 2

핵심 정착지에 상업시설이 아직 없으면 소규모 교환 기능으로 상인 2 슬롯을 임시 제공할 수 있습니다.

중요한 점은 이 역시 무한 노동력이 아니라 **명시적인 상한**을 갖는다는 것입니다.

## 2.3 직업 재배치

시설 직업을 가진 Person에게 유효한 실제 슬롯이 없으면 유령 생산을 허용하지 않습니다.

- 유효 슬롯 탐색
- 다른 같은 직업 슬롯 탐색
- 없으면 `무직`으로 전환
- 빠른 직업 재검토 예약

안정적으로 취업 중인 Person은 매일 전체 직장을 다시 탐색하지 않습니다.

---

# 3. 식량 소비 증가

V0.28 P1 장기 데이터에서는 세계 총식량이 충분한데도 특정 도시의 접근성 문제가 나타나는 한편, 세계 총량 자체는 후기에도 넉넉한 경우가 많았습니다.

V0.29 합의값은 3일 경제 사이클 기준:

- **0~14세: 0.30 food** (`0.25 → 0.30`)
- **15세 이상: 0.42 food** (`0.36 → 0.42`)

360일 기준 단순 연환산:

- 아동: 약 36 food / year
- 15세 이상: 약 50.4 food / year

기존 V0.28 metabolism/Hunger 시스템은 유지하고, 기존 소비량과 합쳐 최종 요구량이 위 값이 되도록 추가 차감합니다.

Settlement/Nation의 V0.29 식량 비축일 계산도 연령별 실제 요구량을 사용합니다.

---

# 4. 후기 목재·석재 수요 조정

V0.28 후기 데이터에서 목재는 지속적으로 과잉축적되는 경향이 강했지만, 석재는 일부 국가에서 실제 건축 병목이 되었습니다.

따라서 동일 배율을 적용하지 않습니다.

## 4.1 최종 규칙

- 초기 / T1 건물 기본 건설비: **변경 없음**
- 고티어 건설·개축: **목재 ×2.0**
- 고티어 건설·개축: **석재 ×1.2**
- Gold 요구량: **기존값 유지**

현재 고티어 적용 대상:

- `row_house`
- `collective_house`
- `merchant_guild`
- `grand_market`
- `deep_quarry`
- `stoneworks`

예를 들어 기본 비용이 `wood 24 / stone 15 / Gold 7`인 고티어 공사는 V0.29 재료 배율 적용 뒤 `wood 48 / stone 18 / Gold 7`을 요구합니다. Architecture 등 기존 비용 감소가 먼저 적용되는 경로에서는 그 결과값에 V0.29 재료 배율이 적용됩니다.

UI에는 현재 진행 중 공사의 실제 비용을 표시하며, 아직 시작하지 않은 발전단계는 **후속 고도화 후보**로 표시합니다. 이는 모든 수요·AI 조건이 즉시 충족됐다는 뜻은 아닙니다.

---

# 5. Settlement 상세 화면 V2

기존 상세 화면의 큰 KPI 카드가 많은 공간을 차지하면서도 실제 건물 정보를 충분히 보여주지 못했던 문제를 보완합니다.

## 5.1 Compact KPI

상단 정보를 작은 그리드로 압축합니다.

- 등급 / 도시성
- 주민 / 주거수용력
- 평균 행복
- 시설 근무슬롯 사용량
- 통근 유입 / 유출
- V0.29 실제 식량소비 기준 비축일
- 관찰용 경제 역할
- 소속 생활권 규모
- 지역 상업자금
- 기존 요약 카드와 동일한 분기 유지관리 값

## 5.2 보유 건물 목록

정착지가 실제 보유한 건물을 유형별로 집계해서 보여줍니다.

예:

- 고대 주택 ×4
- 고대 경작지 ×2
- 고대 시장 ×1

각 항목을 펼치면 개별 Building 단위 정보를 확인할 수 있습니다.

- 건축 세대
- 티어
- condition
- 주거단위 / 수용량
- 실제 근무자 / 최대 근무슬롯
- 저장공간 기여
- 분기 유지관리 재료 / 노동
- 진행 중 개축·전문화
- 공사 진행률
- 실제 필요 비용
- 후속 고도화 후보와 V0.29 배율이 반영된 예상 재료비

내부 Building ID는 V0.28 P1과 동일하게 유지합니다.

---

# 6. 생활권 지도 시각화 V1

V0.29에서 **경제권 지도는 구현하지 않습니다.** 사용자가 원한 지도 시각화 대상은 V0.28 P1의 `생활권`입니다.

지도 레이어 선택기에 **생활권**을 추가했습니다.

## 6.1 의미

생활권은 V0.28 P1에서 수정한 **hub-anchored 기능권**을 그대로 사용합니다.

- 중심 Settlement(hub)가 존재
- 각 구성 Settlement는 hub와 직접적인 통근 또는 제한된 공간 관계를 가져야 함
- A-B-C-D 징검다리만으로 국가 전체가 하나로 합쳐지는 connected-component 방식으로 되돌리지 않음
- 생활권은 행정구역이 아님
- V0.30의 City / Administrative Area와 별도 개념

## 6.2 지도 표현

- 같은 생활권의 Settlement: 같은 색 계열
- 생활권 구성 Settlement: 진한 반투명색 + 경계
- hub: 원형 테두리 + 확대 시 `L` 표시
- 생활권 구성 Settlement 주변의 같은 국가 영토: 옅은 근접 영향권
- 생활권 미소속 Settlement: 기존 지도 표현 유지
- 기존 국가 경계는 기본 지도 렌더 뒤 오버레이되는 구조를 사용

타일 inspector에서 생활권에 속한 정착지를 선택하면:

- 국가
- 포함 Settlement 수
- 생활권 총인구
- hub 타일
- 비행정 기능권이라는 설명

을 표시합니다.

---

# 7. 성능 최적화

V0.28 P1 약 2,900명 장기 데이터에서는 `villageDaily`, `personAct`, `jobReviews`가 후기 비용의 핵심이었습니다.

V0.29는 경제 기능을 추가하면서도 Person을 숫자로 통합하지 않고, **변하지 않은 정보를 다시 계산하지 않는 방향**으로 최적화합니다.

## 7.1 Settlement 공통 캐시

약 15 calendar-day bucket과 resident epoch를 이용해 다음 공통값을 묶어 계산합니다.

- alive / adults
- tile별 resident 목록
- tile별 adult 목록
- tile별 worker 수
- tile별 직업 구성
- 가격 / 재고 / 저장비율
- 도시성 / 등급
- 통근 유입·유출
- 상업 hub score

Person마다 같은 Settlement 통계를 다시 필터링하지 않습니다.

## 7.2 노동 / vacancy index

약 30 calendar-day bucket, 주민 epoch, 건물·condition·기술 signature를 이용해 실제 근무슬롯을 인덱싱합니다.

- 직업별 슬롯
- tile별 슬롯
- 사용량 / 최대량
- 실제 근무 Building index

안정적으로 취업 중인 Person의 구조적 직업 재검토 간격은 대략 120~210일, 무직은 45~90일 범위를 사용합니다. 시설이 사라지거나 실제 슬롯이 무효가 된 경우는 즉시 재평가할 수 있습니다.

## 7.3 경로비 공용화

V0.29는 별도의 중복 pathfinder를 만들지 않고 V0.27 이후 존재하는 `internalPathCost` / topology-front cache를 공유합니다.

같은 경로비는:

- 직장 탐색
- 시장 접근
- 국내 자원거래

에서 재사용합니다.

## 7.4 경제 계산 주기 분리

Person의 생존/기존 일상 tick과 별도로 V0.29 국내경제 pulse는 **30 calendar-day** 단위로 실행합니다.

매일 모든 Person이 가격·시장·국내거래 전체를 다시 평가하는 구조를 피합니다.

## 7.5 이주 churn 추가 완화

V0.28 P1의 3년 역이주 억제를 그대로 유지하고, V0.29에서는 일반적인 정착 관성을 더 길게 적용합니다.

- 도시집약형 일반 가드: 약 720일
- 기타 성향 일반 가드: 약 900일
- 주거부족·심각한 식량위기 등 P1의 긴급이주는 예외 가능
- 실제 이주가 일어나면 거리에 따른 소액 Person Gold 이동비를 목적지 상업자금으로 이전

---

# 8. V0.29 Telemetry

기존 V0.28 telemetry를 유지하면서 다음 경제/노동 항목을 추가합니다.

Nation 및 global snapshot 주요 추가 필드:

- `personGold29`
- `settlementMarketGold29`
- `domesticTrades29`
- `domesticTradeVolume29`
- `domesticTradeGold29`
- `wages29`
- `consumption29`
- `taxes29`
- `publicSpending29`
- `unemployed29`
- `jobCapacity29`
- `jobUsed29`

Global JSON 성능 진단:

- `v29SettlementCacheMs`
- `v29LaborIndexMs`
- `v29JobSearchMs`
- `v29DomesticEconomyMs`
- `v29MigrationEvalMs`
- `v29RouteLookupMs`

국내 실물 거래는 `DOMESTIC_TRADE29` 이벤트로 기록합니다.

---

# 9. 인게임 경제 UI / 백과 / 패치노트

## Nation 경제 화면

기존 경제 화면 상단에 V0.29 요약을 추가합니다.

- Person 지갑 Gold
- Settlement 상업자금
- 누적 임금
- 누적 소비
- 세금 환류
- 국내거래 횟수 / 물량
- 현재 정착지 경제 역할 분포

## 백과

건설·생산·물류 관련 백과에 V0.29 규칙을 추가합니다.

- 고티어 목재 ×2.0 / 석재 ×1.2
- 연령별 식량소비
- 시설 근무슬롯
- 국내경제와 생활권 지도 설명

## 패치노트

상단 버전 배지는 `Village Observer · V0.29`를 표시합니다.

패치노트 순서:

1. V0.29 — 기본 펼침
2. V0.28 P1 — 접힘
3. V0.28 — 접힘

README는 계속 상세 문서로 유지합니다.

---

# 10. 저장 호환

- World save version: `0.29`
- localStorage: `village-observer-v0-29`
- V0.28 이하 fallback load 유지
- 기존 내부 Building ID 유지
- V0.29 미존재 Person/Settlement/Nation 필드는 load 시 기본값 생성
- V0.29 → V0.29 save/load roundtrip 지원

V0.29 serialize metadata에는 다음이 기록됩니다.

- 식량 요구량
- 고티어 wood/stone multiplier
- 국내 Gold 시스템
- finite job slots
- Settlement economy
- life-zone map
- optimization revision

---

# 11. V0.29에서 의도적으로 미룬 범위

다음 기능은 이번 버전의 역할이 아닙니다.

- **경제권 지도 레이어**: 보류. 현재 지도 시각화는 생활권만 대상
- **City / Administrative Area / 공식 행정통합**: V0.30
- **철광석 → 제련 → 철제품 경제**: V0.31
- **실제 군사 Person·장비·보급**: V0.32
- **전쟁 V1**: V0.33

생활권과 Settlement 경제 역할을 V0.30 행정구역으로 자동 변환하지 않습니다.

---

# 12. 검증 기록

이번 빌드는 V0.28 P1 `index.html`을 기반으로 V0.29 패치 레이어를 적용하고 다시 standalone HTML로 조립했습니다.

## 정적 검증

- inline JavaScript 36개 추출
- 전부 `node --check` 통과

## Chromium 실제 로드

확인 항목:

- document title: `Village Observer V0.29`
- 상단 badge: `Village Observer · V0.29`
- world serialize version: `0.29`
- 패치노트 순서: V0.29 / V0.28 P1 / V0.28
- V0.29만 기본 펼침
- 생활권 map option 존재
- 생활권 layer render 성공
- patch modal open 성공
- runtime exception 0

## 10년 deterministic 회귀 테스트

테스트 런타임에서 world 생성 직후 난수를 고정한 뒤 3,600 calendar-day를 진행했습니다. 생산 코드의 RNG 자체는 변경하지 않았습니다.

결과 예시:

- 시작 인구: 100
- 약 10년 후 인구: 157
- active nations: 6 / 6
- 영토: 28 tiles
- food: 약 2779.9
- wood: 약 141.1
- stone: 약 1437.2
- 국내 거래: 68회
- 시설 job capacity: 219
- 실제 사용 슬롯: 73
- 생활권: 10개
- runtime exception: 0

즉 초기 finite-slot 조정 때문에 문명이 초반에 붕괴하지 않는지, 국내거래가 실제로 발생하는지, 자원재고와 생활권이 유지되는지를 짧은 장기런으로 확인했습니다.

이는 60~100년 장기 밸런스 검증을 대체하지 않습니다. 특히 후기 목재·석재 재고, 식량압박, 3,000명 이상 성능, Settlement별 Gold 편중은 실제 플레이 장기 데이터로 추가 검증해야 합니다.

## Save migration / UI 회귀

- V0.29 serialize → V0.29 load: 인구 동일, version `0.29`
- V0.28 형식 경로를 통한 load 후 V0.29 attach: 성공
- Settlement 상세 compact KPI: 렌더 성공
- 보유 건물 / 실제 근무슬롯: 렌더 성공
- 390×844 모바일 viewport: 가로 overflow 없음
- 모바일 패치노트 modal: open 성공

---

# 13. 다음 장기 데이터에서 특히 확인할 항목

V0.29의 첫 실제 장기 플레이에서는 다음 항목을 우선 관찰합니다.

1. 30 / 50 / 70 / 90년의 world food·wood·stone 재고
2. 목재 과잉축적이 실제로 완화되는지
3. 석재 ×1.2가 노렌 같은 건설집약 국가를 과도하게 막지 않는지
4. 농경지/채석장 job slot 부족이 시설투자·통근·이주를 유도하는지
5. 무직 비율과 vacancy가 동시에 과도하게 커지지 않는지
6. Person Gold / Settlement market Gold / Nation Gold 분포
7. 국내거래량과 생산지·상업 중심지 역할 분화
8. 도시 식량 stress와 아사 발생 여부
9. P1 이후 남아 있던 장거리 migration churn 변화
10. 생활권 레이어가 실제 공간구조를 이해하는 데 유효한지
11. 3,000~5,000 Person에서 `jobSearch`, `jobReview`, `domesticEconomy`, `routeLookup` 비용
12. V0.28 P1 약 2,900명 / 137ms-day 수준 대비 V0.29 후기 성능

V0.29의 성능 목표는 경제 기능이 늘었더라도 **3,000명대에서 V0.28 P1 후기보다 현저히 느려지지 않는 것**입니다.