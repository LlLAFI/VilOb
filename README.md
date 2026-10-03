# Village Observer V0.33F5A2

## Terrain Frontier Finance + Formation Lifecycle Fix

- 기준 버전: **V0.33F5A1**
- 릴리스 날짜: **2026-10-04**
- 성격: **개척 재정 밸런스 개편 + 전쟁/종전 Formation 수명주기 안정화**

V0.33F5A2는 F5A1 자연주행에서 확인된 두 축을 함께 다룹니다.

1. 모든 일반 개척이 사실상 6G/7G를 요구하면서 중소국의 확장이 오래 정체되고, 지형 난이도와 개척 재정이 연결되지 않았던 문제.
2. 전쟁 중 또는 종전 귀환 중인 실제 Person-backed 야전 Formation이 구형 V0.32B 평시 동원해제에 의해 갑자기 DORMANT가 되거나, V0.33A와 V0.33D의 두 귀환 로직이 동시에 움직여 반대 방향 이동을 반복하던 문제.

이번 버전은 F5A의 Gold 보존 회계 자체를 유지하면서 **지형에 따라 명목 개척비만 차등화**하고, 군사 쪽에서는 구형 planner가 현재 전쟁 상태를 침범하지 못하도록 수명주기 경계를 명확히 합니다.

---

## 1. 지형별 개척 Gold 비용 V1

일반 Frontier의 Gold 비용을 목표 타일의 지형과 실제 개척대 인원에 따라 결정합니다.

| 목표 지형 | 2인 개척대 | 3인 개척대 |
|---|---:|---:|
| 초지 `grass` | 2.0G | 2.4G |
| 평야 `plain` | 2.0G | 2.4G |
| 숲 `forest` | 3.5G | 4.2G |
| 암지 `rock` | 5.0G | 6.0G |
| 산 `mountain` | 8.0G | 9.6G |

3인 개척대 비용은 각 2인 비용의 **1.2배**입니다.

### 목적

이 규칙은 별도의 “평야 우선 AI 보너스”를 강제로 넣지 않고도 재정 능력에 따라 자연스러운 개척 순서를 만들기 위한 것입니다.

- 국고가 빠듯한 초기·중소 국가는 초지와 평야부터 확장하기 쉽습니다.
- 숲은 약간 더 많은 공공지출을 요구합니다.
- 암지는 기존 6G/7G 체계와 비슷한 중후기 난이도를 유지합니다.
- 산악은 충분한 재정 여력이 생긴 뒤에야 일반적으로 개척할 수 있습니다.

지형의 기존 건설 기간, 자원량, 이동비, 개척 위험 등은 이번 패치에서 변경하지 않습니다.

---

## 2. “가장 높은 점수의 감당 가능한 후보” 선택

단순히 최상위 후보의 비용만 검사하면 다음 문제가 생길 수 있습니다.

예를 들어 후보 점수가:

- 산 100점, 8G
- 평야 90점, 2G

이고 해당 국가가 산악 비용은 감당하지 못하지만 평야 비용은 감당할 수 있다면, 산 하나 때문에 국가 전체 개척이 멈추는 것은 이번 설계 의도와 맞지 않습니다.

따라서 A2는 V0.20 / V0.21 / V0.24 일반 Frontier에서 후보를 점수순으로 순회하며 **실제 F5A 재정 quote를 통과하는 첫 후보**를 선택합니다.

즉:

1. 기존 후보 점수 순서는 유지합니다.
2. 각 후보의 실제 지형과 2/3인 개척대 규모로 Gold 비용을 계산합니다.
3. F5A reserve/War Chest/운영바닥 조건을 통과하는지 검사합니다.
4. 감당할 수 없는 후보는 건너뜁니다.
5. 그중 가장 높은 점수의 감당 가능한 후보가 실제 개척 대상이 됩니다.

이 방식으로 “싼 평지부터, 험지는 나중에”라는 패턴이 **재정 제약을 통해 자연스럽게** 나타날 수 있습니다.

---

## 3. F5A 회계 규칙 유지

지형별 비용은 F5A의 보존 회계를 그대로 사용합니다.

성공한 일반 개척 지출의 배분은:

- **50% → 참여 Pioneer Person 지갑**
- **25% → 출발 Settlement 시장 Gold**
- **25% → 실제 통화량 sink**

입니다.

### 예시: 평야 2인 개척 2G

- Nation 가용 Treasury: -2G
- Pioneer 임금: +1G 합계
- 출발 시장: +0.5G
- 실제 sink: 0.5G

### 예시: 산악 3인 개척 9.6G

- Nation 가용 Treasury: -9.6G
- Pioneer 임금: +4.8G 합계
- 출발 시장: +2.4G
- 실제 sink: 2.4G

Gold는 새로 생성하지 않습니다.

### 그대로 유지하는 재정 규칙

- 일반 Frontier의 AI Gold reserve 보호율: 기존 F5A와 동일
- 현재 자연주행에서 실질적으로 관측된 일반 보호선: 약 8G 조건 유지
- War Chest: 사용 불가
- 전쟁 준비 운영바닥: 보호
- F5 Monetary Price Index: 개척 명목비에 직접 곱하지 않음
- 개척 실패/취소 후 이미 지급한 임금·시장지출 환불 없음

---

## 4. Recovery Expansion Escape는 4G 고정 유지

V0.33D1C의 Recovery Expansion Escape는 일반 영토 확장이 아니라 장기 Recovery 정체에서 벗어나기 위한 비상 경로입니다.

따라서 이번 지형별 비용표를 적용하지 않습니다.

- Recovery Escape Gold 비용: **4G 고정**
- Recovery reserve 보호율: 기존 **15%** 유지
- War Chest 및 전쟁 운영바닥 보호 유지
- F5A 50/25/25 회계 유지

즉 산악 타일이라도 Recovery Escape 자체는 8G/9.6G로 상승하지 않습니다.

---

## 5. 전쟁 중 평시 동원해제 차단

F5A1 자연주행의 첫 라엔-키오 전쟁에서 키오 야전 Formation은 실제로 적 방향으로 이동 중이었지만, 분기 군사 review에서 구형 V0.32B 평시 planner가 현역 Person을 전역시켰습니다.

이후 Formation은:

`MILITARY_DEMOBILIZED32B → FORMATION_DORMANT33D1`

순서로 물리적 지도 존재를 잃었습니다.

이는 보급으로 Person이 사망한 것이 아니라 **전쟁 소유권이 없는 구형 평시 demobilization이 전쟁 중 field force를 건드린 상태 충돌**이었습니다.

A2에서는 V0.32B planner가 목표 현역 수를 줄이기 전에 최종 lifecycle floor를 확인합니다.

다음 중 하나라도 해당하면 현재 현역 수를 demobilization 하한으로 사용합니다.

- 해당 국가가 활성 전쟁에 참가 중
- Formation이 `v33aWithdrawal` 상태
- Formation이 `v33dReturnState` 상태
- Formation status가 `POSTWAR_WITHDRAWAL`
- Formation status가 `POSTWAR_WITHDRAWAL_D`

따라서 구형 평시 planner는 해당 병력을 전역시키지 못합니다.

### 변경하지 않는 부분

전투로 인한 실제 사망·부상·포로·복구는 기존 규칙을 그대로 사용합니다. 이번 lock은 **평시 planner의 행정적 전역**만 막습니다.

새 로그:

`MILITARY_DEMOBILIZATION_LOCK33F5A2`

---

## 6. 종전 귀환 로직 단일화

F5A1 자연주행에서는 라엔 Formation이 종전 후 키오 영토에서 귀환하면서:

- V0.33D return logic: 100 → 99
- V0.33A return corridor: 99 → 100

처럼 서로 반대 방향의 이동을 반복하는 사례가 확인됐습니다.

A2에서는 **V0.33A의 former-opponent return corridor를 종전 귀환의 최종 소유자**로 사용합니다.

V0.33A가 외국 영토 Formation을 감지해 `v33aWithdrawal`을 시작하면:

1. 남아 있는 `v33dReturnState`를 확인합니다.
2. V0.33D return state의 소유권을 V0.33A 귀환 경로로 넘겼다는 telemetry를 남깁니다.
3. `v33dReturnState`를 제거합니다.
4. 이후 Formation은 V0.33A corridor만 따라 귀환합니다.

따라서 D와 A가 같은 Formation을 번갈아 이동시키는 ping-pong을 제거합니다.

새 로그:

`POSTWAR_WITHDRAWAL_OWNER_TRANSFER33F5A2`

---

## 7. 실제 작전 목표와 관측 로그 동기화

V0.33D는 다중전선 mission을 결정한 뒤에도 구형 V0.33C3 전략 목표 함수를 내부 후보 계산용으로 호출합니다.

F5A1 자연주행에서는 이 내부 probe가 `DEFEND_CORE` 목표를 기록한 직후 실제 D movement는 다른 `CAPITAL` 목표로 움직이는 사례가 있었습니다.

행동 자체는 D가 선택한 target을 사용하고 있었지만, observer 로그가 구형 probe의 중간 결과를 노출해 **“선택 목표와 실제 이동 목표가 다르다”**고 보이게 했습니다.

A2에서는:

- D가 C3 전략 함수를 내부 probe하는 동안 `FORMATION_TARGET_SELECTED33C3` 기록을 억제합니다.
- 실제 D movement에 사용되는 최종 mission/target만 별도 이벤트로 기록합니다.

새 로그:

`FORMATION_OPERATIONAL_TARGET33F5A2`

필드:

- warId
- village / villageId
- formationId
- mission33D
- targetTileId
- targetKind
- actualMovementOwner = `V0.33D`

기존 `FORMATION_INVASION_MOVE33`의 targetTileId/targetKind와 대조할 수 있습니다.

---

## 8. 추가 Telemetry / CSV

A2에서 추가한 World/global 계측:

- `lifecycleDemobilizationLocks33F5A2`
- `withdrawalOwnershipTransfers33F5A2`
- `operationalTargetSelections33F5A2`
- `frontierTerrainPayments33F5A2`
- `frontierTerrainGold33F5A2`

국가 행 추가 계측:

- `frontierAffordableTerrain33F5A2`
- `frontierAffordableGoldCost33F5A2`
- `frontierAffordablePioneers33F5A2`

A2는 F5A1 대비 **8개 CSV 열**을 추가합니다.

현재 smoke test에서 snapshot CSV는:

- **1206 columns**
- 모든 행 동일 column count
- `validateCSV().ok === true`

를 확인했습니다.

`v33f5a2.stats` 내부에는 지형별 실제 지급 횟수와 Gold 합계도 누적합니다.

- `frontierPaymentsByTerrain`
- `frontierGoldByTerrain`

이는 Devlog JSON 분석용이며 CSV 열을 지형별로 과도하게 늘리지 않습니다.

---

## 9. 저장/불러오기 호환성

- save version: `0.33F5A2`
- LocalStorage key: `village-observer-v0-33f5a2`
- 1차 fallback: `village-observer-v0-33f5a1`
- 이후 F5A / F5P2 / F5P1 / F5 순으로 fallback
- Devlog export: `village-observer-v033F5A2-devlog-...json`
- Snapshot export: `village-observer-v033F5A2-snapshots-...csv`
- Scenario export intendedVersion: `0.33F5A2`

A2 상태는 `v33f5a2`에 저장합니다.

기존의:

- `v33f5a`
- `v33f5a1`
- F5/P2 monetary state
- War Intent / War Chest
- 전쟁/평화협정
- Person cultureMix 및 개인 Gold

상태를 그대로 보존합니다.

---

## 10. 이번 패치에서 변경하지 않는 것

A2는 다음을 변경하지 않습니다.

- Frontier wood / stone / food 비용
- Pioneer 2/3인 결정 규칙
- Frontier duration
- Frontier 사고·부상·실패 확률
- 병렬 개척 project cap
- 지형별 자원량과 자연회복
- F5A 50/25/25 회계
- Recovery Escape 4G
- Monetary Anchor / Price Index 공식
- War Intent 63 / 67 / 71 bands
- D2/D2A War Chest / Final Commitment
- 전투력 공식
- Engagement 라운드
- 사상자 공식
- 점령 시간/저항
- Peace Settlement
- 문화 유전/혼합 기준

---

## 11. 구현 검증

릴리스 전 다음 검사를 수행했습니다.

### JavaScript 문법

- inline `<script>`: **107개**
- 문법 오류: **0개**

### 실제 브라우저 부팅

Headless Chromium에서 HTML 전체를 실행했습니다.

- document title: `Village Observer V0.33F5A2`
- version badge: `V0.33F5A2`
- `NS.V033F5A2` 로드 확인
- 초기 World: 6개 국가 정상 생성
- browser console/page error: **0건**

### 지형 비용 함수

실행값:

- plain: 2 / 2.4
- grass: 2 / 2.4
- forest: 3.5 / 4.2
- rock: 5 / 6
- mountain: 8 / 9.6

### 감당 가능한 후보 선택 테스트

테스트 조건:

- Treasury: 10G
- fiscal reserve floor: 8G
- 산 후보 score 100 / 비용 8G
- 평야 후보 score 90 / 비용 2G

결과:

- 산: `FISCAL_RESERVE`, 차단
- 평야: 허용, 지출 후 Treasury 8G
- 최종 선택: **평야**

즉 높은 점수의 험지가 재정적으로 불가능할 때 낮은 점수의 평탄 후보로 정상 fallback합니다.

### Demobilization lifecycle floor 테스트

- 활성 전쟁: base target 1, active 5 → 보호 target 5
- 종전 귀환: base target 1, active 4 → 보호 target 4
- 평시/귀환 없음: base target 1, active 4 → target 1

### 저장 왕복

- serialize: `0.33F5A2`
- `World.from()` round-trip 후 serialize: `0.33F5A2`
- `v33f5a2` 상태 보존 확인

---

## 12. 다음 자연주행에서 볼 항목

### 개척

1. 초지/평야 실제 개척 비중이 초기~중기에 상승하는가.
2. 숲 → 암지 → 산 순으로 평균 개척 시점이 뒤로 밀리는가.
3. F5A1보다 `FISCAL_RESERVE` 장기 정체가 감소하는가.
4. 산악이 영구적으로 방치되지 않고 부유한 국가가 후기에는 진입하는가.
5. `frontierAuditMismatches33F5A`가 계속 0인가.

### 군사

1. 활성 전쟁 도중 `MILITARY_DEMOBILIZED32B → FORMATION_DORMANT33D1`이 다시 발생하는가.
2. 종전 귀환 중 Formation이 DORMANT로 사라지는가.
3. 같은 Formation에서 `POSTWAR_WITHDRAWAL_MOVE33D`와 `POSTWAR_WITHDRAWAL_MOVE33A`가 교대로 나타나는가.
4. `POSTWAR_WITHDRAWAL_OWNER_TRANSFER33F5A2` 이후에는 A 경로만 이어지는가.
5. `FORMATION_OPERATIONAL_TARGET33F5A2`와 실제 `FORMATION_INVASION_MOVE33` target이 일치하는가.

---

# 버전 계보

`V0.33F5P2 → V0.33F5A → V0.33F5A1 → V0.33F5A2`

- **F5P2:** Monetary Anchor 재보정 + War Intent Observation V2
- **F5A:** Frontier Expansion Finance V1
- **F5A1:** Statistics dropdown + Frontier finance gate sync
- **F5A2:** Terrain-based Frontier Gold + Formation lifecycle/withdrawal stabilization
