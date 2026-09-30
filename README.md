# Village Observer V0.33E1

## Era Pace + Formation Command V1

기준 버전: **V0.33EF — War History Renderer Ownership Hotfix**  
패치 일자: **2026-10-01**

V0.33E1은 V0.33E의 Intelligence & Reconnaissance V1과 V0.33D2A의 전쟁 준비·War Chest 구조를 유지하면서, 다음 세 가지를 정식으로 정리하는 패치다.

1. EF에서 임시로 막아 두었던 구형 War History renderer 충돌을 **redirect가 아니라 소스 호출 구조 자체를 제거**하는 방식으로 마감한다.
2. 기술 트리를 40개에서 32개로 통폐합해 20~60년대에 주요 시스템이 더 빨리 등장하게 한다. **Knowledge 생산량은 변경하지 않는다.**
3. Person-backed Formation에 실제 Person 지휘관을 도입하고, 1~4인 소규모 Formation에서 한 명의 부상·사망이 연속 라운드에 과도하게 증폭되는 현상을 완화한다.

---

## 1. 이번 버전에서 변경되는 범위

### 구현

- War History legacy writer/runtime redirect 완전 정리
- 선택 타일 좌표 + 고유 `tileId` 표시
- 기술 40개 → 32개 통폐합
- 기존 40-tech 총 연구비 6,315 → 32-tech 총 연구비 4,815 Knowledge
- 기존 Knowledge 생산 공식 **×1.00 유지**
- 실제 Person 기반 Formation Commander V1
- Commander 전투·사기·regroup 효과
- Commander 부상·사망·공석·후임 처리
- 1~4인 Formation casualty smoothing
- E1 전용 telemetry / CSV 검증 필드
- V0.33EF 세이브 → V0.33E1 기술 migration

### 이번 버전에서 변경하지 않는 범위

- Knowledge 기본 생산량 및 `knowledgeMultiplier()`
- RECORD_KEEPING / SCHOLARSHIP / EDUCATION 기존 Knowledge 배율
- Eureka 기본 규칙
- 남아 있는 32개 기술의 개별 D1A 고정 비용
- 전쟁 가능 연도 gate(35년)
- War Intent 공격성 및 선전포고 점수
- Intelligence V1 confidence/observation 구조
- 최대 동시전쟁 수 2
- War Chest 보존 회계
- READY hysteresis / Final Commitment
- Engagement 연속패배·최대라운드 규칙
- 점령 / 해방 / War Exhaustion / 평화 공식
- Person 1명 = 실제 Person 1명의 원칙
- synthetic soldier / weighted Person 도입 없음

---

## 2. War History 구조 정리

### 2.1 EF에서 확인된 상태

V0.33EF 자연주행에서는 최종 DOM takeover는 0회였지만, 구형 renderer 호출을 EF renderer로 돌려보내는 `legacyRedirects`가 2만 회 이상 누적됐다.

EF는 기능상 문제를 해결했지만 다음 구조가 남아 있었다.

`구형 renderer 호출 → EF redirect → 최신 renderer/owner 확인`

V0.33E1에서는 이 구조를 폐기한다.

### 2.2 제거한 구형 writer

다음 War History writer는 더 이상 함수로 존재하지 않는다.

- V0.33A `updateHistoryPanelA()`
- V0.33D1A `renderCoalitionHistoryA()`
- V0.33D1B `renderCoalitionHistoryB()`
- V0.33D1C `renderWarHistoryC()`

또한 D1B/D1C 공개 namespace에서도 다음 API를 제거했다.

- `NS.V033D1B.renderCoalitionHistory`
- `NS.V033D1C.renderWarHistory`

V0.33A/D1A/D1B/D1C의 `renderStats()` / `render()` 체인 역시 더 이상 War History DOM을 쓰지 않는다.

### 2.3 EF hotfix runtime 제거

다음 EF runtime 메커니즘은 삭제됐다.

- legacy public API redirect
- `renderHeader()` 최종 owner reassert
- `renderStats()` owner reassert
- 전체 `render()` owner reassert
- legacy takeover 자동 복구
- redirect/owner-claim 누적 runtime

`NS.V033EF` namespace는 과거 버전 진단을 위한 deprecated marker만 남는다.

### 2.4 단일 writer

현재 War History를 실제로 쓰는 renderer는 V0.33E에서 만든 A/B renderer 하나뿐이며 V0.33E1 owner로 동작한다.

정상 DOM:

```text
data-owner="V0.33E1"
```

정상 카드 예:

```text
A측 · 에브 ↔ B측 · 델마 + 라엔
에브 승리 (A측)
전사 A 0 / B 1
부상 A 0 / B 4
누적 점령 A ... / B ...
참전국 A 1 / B 2
```

E1 telemetry의 `warHistoryLegacyWriterCalls33E1`은 구조 회귀 감시용 필드이며 정상값은 **항상 0**이다.

---

## 3. 선택 타일 식별 UI

기존에는 inspector 상단에 좌표만 표시됐다.

V0.33E1:

```text
✓ 선택한 타일    (4,9) · ID 175
평야 · 국가 라엔
```

- `선택한 타일`과 좌표 사이에 별도 gap을 둔다.
- `ID`는 devlog의 `tileId`와 동일한 정수다.
- 국가 소유 타일, 중립 타일, 수역 모두 같은 식별 형식을 사용한다.
- 이후 devlog 분석에서 `tile 292` 같은 값을 게임 화면에서 직접 대조할 수 있다.

---

## 4. 32-tech 시대 진행 압축

### 4.1 원칙

E1은 **Knowledge 생산량을 올리지 않는다.**

시대 진행 가속은 오직 기술 노드 통폐합에서 발생한다.

```text
Knowledge 생산 multiplier = ×1.00
```

남아 있는 기술의 D1A 고정 cost도 변경하지 않는다.

기존 총비용:

```text
40 tech = 6,315 Knowledge
```

통폐합 후:

```text
32 tech = 4,815 Knowledge
```

삭제되는 8개 기술의 기존 고정비 합계는 정확히 1,500 Knowledge다.

---

## 5. 기술 통폐합표

| 제거되는 기술 | 흡수되는 기술 | E1 표시명 |
|---|---|---|
| `CROP_ROTATION` 윤작 | `IRRIGATION` 관개 | 관개·윤작 |
| `FOOD_PRESERVATION` 식량 보존 | `GRANARY` 곡물 저장 | 곡물 저장·보존 |
| `STANDARD_WEIGHTS` 도량형 | `CURRENCY` 화폐 | 화폐·도량형 |
| `ENVOYS` 사절단 | `COMMERCIAL_LAW` 상법 | 상법·사절 |
| `SEAFARING` 항해술 | `COASTAL_NAVIGATION` 연안 항해 | 항해술 |
| `ARCHITECTURE` 건축술 | `ENGINEERING` 공학 | 건축·토목공학 |
| `PUBLIC_WORKS` 공공사업 | `ENGINEERING` 공학 | 건축·토목공학 |
| `URBAN_REDEVELOPMENT` 도시 정비 | `URBANIZATION` 도시화 | 도시화·재개발 |

기존 시스템에서 `hasTech()`로 제거 기술을 조회하면 자동으로 통합 대상 기술을 조회한다. 따라서 과거 시스템의 효과를 삭제하는 것이 아니라 대표 기술에 흡수한다.

예:

```text
hasTech('CROP_ROTATION') → IRRIGATION 보유 여부
hasTech('PUBLIC_WORKS') → ENGINEERING 보유 여부
hasTech('URBAN_REDEVELOPMENT') → URBANIZATION 보유 여부
```

---

## 6. 최종 32개 기술

### 생산 / 산업 10

1. AGRICULTURE
2. CARPENTRY
3. MASONRY
4. IRRIGATION — 관개·윤작
5. GRANARY — 곡물 저장·보존
6. QUARRY
7. FORESTRY
8. IRON_MINING
9. SMELTING
10. IRONWORKING

### 교역 / 항해 9

11. BARTER
12. CART
13. MARKET
14. CURRENCY — 화폐·도량형
15. COASTAL_NAVIGATION — 항해술
16. ROADS
17. LONG_DISTANCE_TRADE
18. COMMERCIAL_LAW — 상법·사절
19. OCEAN_NAVIGATION

### 지식 4

20. RECORD_KEEPING
21. SCHOLARSHIP
22. ACADEMY
23. EDUCATION

### 개척 / 행정 4

24. SURVEYING
25. FRONTIER_LOGISTICS
26. ADMINISTRATION
27. WATCHTOWERS

### 도시 / 군사시설 5

28. URBAN_PLANNING
29. FORTIFICATION
30. SANITATION
31. ENGINEERING — 건축·토목공학
32. URBANIZATION — 도시화·재개발

---

## 7. 주요 prerequisite 재연결

제거 기술을 prerequisite로 사용하던 기술은 canonical tech로 재연결한다.

특히 다음 후기 기술은 E1에서 명시적으로 재정의한다.

### 상법·사절

```text
CURRENCY + RECORD_KEEPING
```

### 원양 항해

```text
COASTAL_NAVIGATION + LONG_DISTANCE_TRADE + SCHOLARSHIP
```

### 건축·토목공학

```text
CARPENTRY + MASONRY + ROADS + ADMINISTRATION
```

### 도시화·재개발

```text
URBAN_PLANNING + ENGINEERING + SANITATION
```

기타 prerequisite도 제거 기술 ID를 canonical ID로 자동 변환하고 자기 자신을 prerequisite로 만들게 되는 항목은 제거한다.

---

## 8. 기존 세이브 기술 migration

V0.33EF 세이브를 불러오면 각 Nation의 기술 Set을 E1 기준으로 변환한다.

예:

```text
보유: IRRIGATION + CROP_ROTATION
→ 보유: IRRIGATION
```

```text
보유: ARCHITECTURE + PUBLIC_WORKS
→ 보유: ENGINEERING
```

현재 연구 중인 기술이 제거 대상이라면 연구 대상도 canonical 기술로 변경한다.

예:

```text
researchTarget = SEAFARING
→ COASTAL_NAVIGATION
```

연구 진행도는 대상 기술이 아직 미완료라면 그대로 유지한다. 이미 통합 대상 기술을 보유한 경우 제거 기술의 별도 진행도는 폐기하고 다음 연구를 선택한다.

Eureka bank와 기술 확산 누적값도 canonical ID로 합친다.

---

## 9. Formation Commander V1

### 9.1 기본 원칙

지휘관은 별도 synthetic character가 아니다.

**Formation 내부의 실제 Person 1명**이다.

Formation은 다음 두 상태를 모두 허용한다.

```text
지휘관 있음
지휘관 없음
```

후보가 부족하면 억지로 지휘관을 생성하지 않는다.

### 9.2 Formation 필드

지휘관이 임명되면 Formation 객체에 다음 값이 저장된다.

- `commanderPersonId`
- `commanderSinceCal`
- `commanderScoreAtAppointment`
- `commanderAppointmentReason`
- `v33e1CommanderVacantUntilCal`

Formation serializer가 기존처럼 object property를 보존하므로 지휘관도 세이브에 함께 저장된다.

---

## 10. Command Score

후보 조건:

- alive
- `militaryStatus32A === 'active'`
- 해당 Formation Cohort에 실제로 소속
- 18세 이상
- wounded 상태 아님

점수:

```text
Command Score =
  combat skill      × 45%
+ military service × 20%
+ social skill      × 15%
+ health            × 10%
+ happiness         × 10%
```

복무 경험은 720 calendar-day를 100점 기준으로 정규화한다.

최소 임명 기준:

```text
Command Score >= 45
```

Formation 내부 후보 중 가장 높은 점수의 Person을 임명한다.

---

## 11. 지휘관 효과

지휘관 품질은 Command Score 45~100을 0~1 구간으로 정규화한다.

### 전투력

```text
최소 +3%
최대 +8%
```

기존 training/equipment/supply/morale 기반 `unitPowerD()` 계산 뒤에 곱한다.

지휘관은 병력을 생성하지 않으며 manpower는 그대로다.

### 패전 사기 손실 완화

패전으로 발생하는 Formation battle morale 감소량을 다음 범위에서 완화한다.

```text
5% ~ 15%
```

승리 사기 보너스는 변경하지 않는다.

### Regroup 단축

패퇴 후 기존 regroup 기간을 다음 범위에서 감소시킨다.

```text
3% ~ 10%
```

보급, 도로, terrain, 병력 수를 생성하거나 수정하지 않는다.

---

## 12. 지휘관 부상·사망·공석

지휘관도 일반 전투 casualty 대상에 포함된다.

지휘관이:

- 사망하거나
- wounded 상태가 되거나
- Formation에서 이탈하거나
- 현역 military 상태가 아니게 되면

즉시 전투 보너스를 잃는다.

부상/사망 확인 후 Formation은 30 calendar-day 동안 지휘관 공석 상태를 유지하고 이후 후임을 검토한다.

Commander 검토는 모든 Person을 매일 전역 검색하지 않는다. World 수준에서 10 calendar-day 간격으로 활성 Formation만 확인하고, 실제 공석일 때 해당 Formation 병력만 후보 평가한다.

---

## 13. Commander UI

국가 `군사` 탭에 `Formation Command V1` 패널을 추가한다.

표시 항목:

- Formation 이름
- 실제 Person 지휘관 이름
- manpower
- Command Score
- 현재 전투력 보너스
- 패전 사기손실 완화율

지휘관이 없으면:

```text
지휘관 없음
Command Score 45 이상 후보 없음/공석
```

타일 inspector에서도 해당 타일에 Formation이 있으면 지휘관 이름과 Command Score를 함께 표시한다.

---

## 14. 소규모 Formation casualty smoothing

### 14.1 문제

현재 Person 1명은 실제 병력 1명이다.

따라서:

- 4명 Formation의 1 casualty = 전력 25%
- 3명 Formation의 1 casualty = 전력 33%
- 2명 Formation의 1 casualty = 전력 50%

V0.33EF의 에브–라엔 전쟁에서는 라엔이 초기 라운드를 이기고도 승리한 라운드에서 부상이 연속 발생해 4→3→2인 수준으로 급격히 약화했고, 이후 3연패가 발생했다.

Person 실체 원칙은 유지하되 이 연속 변동만 약하게 완화한다.

### 14.2 기본 casualty rate multiplier

side에 존재하는 실제 active Person 수가 1~4명일 때만 적용한다.

| 전투 가능한 Person | rate multiplier |
|---:|---:|
| 1 | ×0.85 |
| 2 | ×0.88 |
| 3 | ×0.91 |
| 4 | ×0.95 |
| 5+ | ×1.00 |

기존 승자/패자의 casualty rate 공식 자체는 유지하고 위 multiplier만 마지막에 적용한다.

### 14.3 anti-streak guard

같은 전쟁의 같은 Side가 **6 calendar-day 이내** 직전 라운드에서 이미 casualty를 냈다면 다음 casualty rate를 추가로:

```text
×0.75
```

한다.

즉 소규모 부대에서 한 명이 다친 직후 다음 3~5일 라운드에서 또 한 명이 즉시 빠지는 연쇄 현상을 줄인다.

이 규칙은 casualty를 무효화하지 않는다.

- 사망자는 실제 Person death
- 부상자는 실제 wounded Person
- cohort/Formation manpower 감소
- War Exhaustion casualty 반영

은 모두 기존과 동일하다.

---

## 15. Telemetry

### World / global CSV

추가 필드:

- `techCount33E1`
- `techCostTotal33E1`
- `knowledgeProductionMultiplier33E1`
- `activeFormations33E1`
- `commandedFormations33E1`
- `avgCommanderScore33E1`
- `commanderAppointments33E1`
- `commanderLosses33E1`
- `smallUnitRounds33E1`
- `smallUnitGuardedRounds33E1`
- `smallUnitCasualties33E1`
- `warHistoryUIOwner33E1`
- `warHistoryLegacyWriterCalls33E1`

### Nation CSV

- `commandedFormations33E1`
- `avgCommanderScore33E1`

### 주요 devlog event

- `TECH_RESEARCH_MIGRATED33E1`
- `FORMATION_COMMANDER_APPOINTED33E1`
- `FORMATION_COMMANDER_LOST33E1`
- `SMALL_UNIT_CASUALTY_GUARD33E1`

Routine commander validity check는 devlog event로 남기지 않는다.

---

## 16. E1 정상 판정 기준

### War History

- 장기주행에서 `warHistoryUIOwner33E1 = 1`
- `warHistoryLegacyWriterCalls33E1 = 0`
- `NS.V033D1B.renderCoalitionHistory`가 존재하지 않음
- `NS.V033D1C.renderWarHistory`가 존재하지 않음
- A/B 카드가 장기주행 중 구형 형식으로 돌아가지 않음

### Tech

- `techCount33E1 = 32`
- `techCostTotal33E1 = 4815`
- `knowledgeProductionMultiplier33E1 = 1`
- 제거 기술이 `technologies` Set에 다시 나타나지 않음
- 기존 EF save migration 후 연구가 중단되지 않음
- 20~30년의 철·도로·행정·군사시설 등장시점이 얼마나 앞당겨지는지 확인
- 약 60년 시점에 대부분의 관찰 가능한 시스템이 등장하는지 확인

### Commander

- 모든 Formation에 강제로 지휘관이 생기지 않음
- 후보가 있을 때 실제 Formation Person이 지휘관으로 선택됨
- Command Score <45인 후보는 임명되지 않음
- 지휘관 사망/부상 뒤 bonus가 즉시 사라짐
- 후임이 실제 Person으로 재임명됨
- 전투 +8%를 초과하지 않음

### Small-unit battle

- 1~4인 전투 casualty가 완전히 사라지지 않음
- 연속 라운드 casualty guard가 실제로 발화함
- 5명 이상에서는 기존 casualty rate가 그대로 유지됨
- casualty Person / wounded / War Exhaustion 회계가 기존과 일치함

---

## 17. Save compatibility

새 저장 key:

```text
village-observer-v0-33e1
```

fallback 순서에는 다음을 포함한다.

- V0.33EF
- V0.33E
- V0.33D2A 이하 D 계열

V0.33EF save를 읽을 때 내부적으로 V0.33E 저장 구조를 복원한 뒤 E1 기술 migration과 Commander attach를 적용한다.

Export 이름:

- `village-observer-v033E1-save-...json`
- `village-observer-v033E1-devlog-...json`
- `village-observer-v033E1-snapshots-...csv`
- `village-observer-v033E1-scenario-...json`

---

## 18. 구현 검증

패치 작성 후 수행한 기본 회귀 검사:

- inline JavaScript **88개 전부 `node --check` 통과**
- Chromium `set_content` 초기 실행 uncaught error 0
- document title / version badge `V0.33E1` 확인
- `TECH_ORDER.length = 32` 확인
- 32-tech 비용 합계 `4815` 확인
- `knowledgeProductionMultiplier = 1` 확인
- War History `data-owner = V0.33E1` 확인
- D1B/D1C legacy public War History API `undefined` 확인
- 90 calendar-day UI/simulation smoke run error 0
- 3년 자연 smoke run error 0
- CSV schema validator 통과
- E1 serialize version `0.33E1` 확인
- 인위적 EF save migration에서 제거 기술 canonicalization 확인
- `SEAFARING` 연구중 EF save → `COASTAL_NAVIGATION` migration 확인
- 인위적 active Formation에서 실제 Person commander 임명과 bonus 범위 확인
- 2인 Formation casualty rate `0.20 → 0.176`, 직전 casualty guard 시 `0.132`로 완화되는 것 확인

이 검사는 장기 밸런스 검증을 대신하지 않는다. 자연주행 데이터에서 시대 진행과 전투 결과 분포를 다시 확인해야 한다.

---

## 19. V0.33E에서 그대로 상속되는 핵심 구조

### Intelligence V1

`World Truth → Observation → Intelligence Picture → Strategic Decision`

- Battle Contact
- War Contact
- Border Patrol
- Trade Network
- Contact Report

관측원마다 군사/위치/경제 confidence가 다르고 시간이 지나면서 노후화된다.

War Intent와 D2 Preparation은 상대의 현재 World Truth 대신 Intelligence Picture를 사용한다.

E1에서는 이 confidence/error 모델을 재조정하지 않는다.

### D2 / D2A

- ASSESSING / PREPARING / READY
- 실제 Person 동원
- 식량 준비목표
- War Chest
- Formation rally lock
- READY hysteresis
- Final Commitment 15~45일

모두 유지한다.

### War / Engagement

- same-tile hostile contact → persistent Engagement
- 3~5 calendar-day 라운드
- 일반 전장 3연속 패배 붕괴
- 수도/core 방어 4연속 패배
- 최대 6/7라운드
- real Person casualty
- retreat / deep recovery / regroup
- occupation / liberation
- War Exhaustion peace

E1에서 바뀌는 전투 요소는 **Commander bonus와 1~4인 casualty smoothing뿐**이다.

---

## 20. 알려진 E1 한계

- 상위 지휘체계(대대/연대/군단/전구사령부) 없음
- Commander personality 기반 전술성향 없음
- 지휘관 포로/해임/정치적 영향 없음
- 지휘관 경험치 전용 시스템 없음; 현재는 Person combat skill + military service를 사용
- Intelligence V2 능동정찰/기만은 아직 없음
- 전쟁 목표/영토 할양/배상/동맹 평화조건 없음
- 35년 이전 전쟁 gate는 유지
- 32-tech 압축 후 국가별 완료시점 편차는 자연주행으로 재검증 필요
- 1~4인 Formation 자체가 장기적으로 적절한 군사 스케일인지 별도 검토 필요

다음 후보 패치는 **V0.33E2 — Intelligence Uncertainty & Reconnaissance V2**이며, E1 자연주행 결과에 따라 시대 진행 Balance/Fix를 먼저 둘 수 있다.

---

## 21. 파일

- `index.html` — Village Observer V0.33E1 실행 파일
- `README.md` — V0.33E1 상세 기술 문서
