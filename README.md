# Village Observer V0.33F2
## War Preparation Pipeline Stabilization

기준 버전: **V0.33F1 — Peace Settlement & Operational Coordination Fix**  
릴리스 성격: **소규모 안정화 패치 / 전쟁준비 상태기계·통계 정합성 수정**  
작성일: 2026-10-02

---

## 0.33F2 패치 목적

V0.33F1 PC 자연주행은 F 계열의 핵심 목표였던 **자연종전 → Peace Settlement → 영구 영토 이전 + Gold 배상 + 실제 Person/culture 보존**을 처음으로 정상 검증했다. 반면 같은 데이터에서 다음 활성 경로 문제가 확인되었다.

- 라엔이 벨른전을 준비하면서 D2 목표 현역을 올려도 V0.32B lexical 평시 planner가 분기마다 다시 전역시켰다.
- 약한 평가로 취소된 동일 상대 War Intent의 180일 cooldown 값은 저장됐지만 최신 E2 lexical scanner가 이를 읽지 않았다.
- Final Commitment가 latch된 뒤 D2A가 매일 soft readiness 하락을 이유로 commitment를 취소하고 F1이 뒤에서 복원하는 `cancel → restore` churn이 발생했다.
- 세계 단위 Peace Settlement는 정상인데 `v33f.nationStats`의 오래된 값이 attach 때 각 Nation의 최신 누적치를 0으로 덮을 수 있었다.

F2는 새 밸런스나 전쟁 규칙을 추가하지 않고 이 네 문제를 **실제 활성 경로에서 직접 수정**한다.

```text
D2 PREPARING/READY active goal
          ↓
32B targetActive 계산 단계에서 하한 적용
          ↓
애초에 전역 대상에서 제외

weak Intent cancel
          ↓
180일 pair cooldown 저장
          ↓
E2 실제 candidate scanner가 직접 검사
          ↓
동일 상대 즉시 재생성 차단

Final Commitment latch
          ↓
E2 일반 review skip
          ↓
D2A soft readiness drift는 관측만
          ↓
hard abort가 아니면 countdown 유지
          ↓
선전포고

peaceSettlements33F
          ↓
국가별 누적치 canonical 재구성
          ↓
v33fStats / v33f.nationStats 동기화
```

---

# 1. PREPARING / READY 현역 하한

## 1.1 실제 lexical V0.32B 경로 수정

기존 F는 `NS.V032B.planMilitary` wrapper 뒤에서 이미 전역된 Person을 다시 active로 복구하는 방식을 사용했다. 자연주행에서는 seasonal tick이 closure 내부의 `planMilitary32B()`를 직접 호출해 wrapper가 우회될 수 있었다.

F2는 `planMilitary32B()`의 실제 `target32B()` 직후에 D2 preparation 목표를 읽는다.

```text
peacetime targetActive = 6
D2 preparation active goal = 10
→ 실제 32B targetActive = 10
```

따라서 Person은 **전역된 뒤 재동원되는 것이 아니라 처음부터 전역 대상이 되지 않는다.**

준비가 취소·종료되면 D2 하한이 사라지고 기존 평시 targetActive가 다시 적용된다.

신규 Devlog:

```text
PEACETIME_DEMOBILIZATION_BLOCKED33F2
```

Telemetry:

- `preparationFloorApplications33F2`
- `preparationDemobilizationBlockedPersons33F2`
- Nation `preparationActiveFloor33F2`
- Nation `preparationActiveCount33F2`

정상 invariant:

```text
PREPARING / READY 중 activeCount < activeGoal 때문에
평시 전역이 새로 발생하는 경우 = 0
```

---

# 2. War Intent 동일 상대 재시도 Cooldown

## 2.1 실제 E2 scanner 연결

F1은 `ASSESSMENT_TOO_WEAK` 또는 `INSUFFICIENT_CASE_AFTER_ASSESSMENT` 취소 때 180 calendar-day cooldown을 저장했지만, 최신 E2 War Intent 의사결정은 lexical `rawAssessment()`를 직접 호출해 Namespace wrapper를 우회했다.

F2는 실제 candidate loop에서 다음 순서를 사용한다.

```text
candidateAllowed
→ F2 pair cooldown 검사
→ 허용된 상대만 WAR_INTENT_SCAN assessment
```

따라서 동일 상대에 대해:

```text
Intent 생성 → 약한 평가로 취소 → 다음 분기 즉시 재생성
```

패턴이 더 이상 반복되지 않는다.

신규 Devlog:

```text
WAR_INTENT_RETRY_COOLDOWN_APPLIED33F2
```

Telemetry:

- `intentRetryCooldownApplied33F2`
- `activeIntentRetryCooldowns33F2`
- Nation `intentRetryCooldownRemaining33F2`

전쟁 발생률 자체를 낮추는 새 점수 보정은 추가하지 않는다. Cooldown이 끝난 뒤에는 기존 War Intent 평가를 그대로 다시 수행한다.

---

# 3. Final Commitment 상태기계 안정화

## 3.1 사후 restore 방식 제거

F1 자연주행에서는 한 Final Commitment에서 기존 D2A `WAR_FINAL_COMMITMENT_CANCELLED33D2A`가 195회 발생하고 F1이 196회 복원하는 사례가 확인되었다.

F2에서는 latch된 commitment가 **일반 E2 War Intent review 대상에서 직접 제외**된다.

또한 D2A에서 readiness / field / 기타 preparation 수치가 일시적으로 100% 아래로 흔들려도:

- `READY → PREPARING`으로 강등하지 않는다.
- `cancelCommitmentA()`를 호출하지 않는다.
- commitment due date를 유지한다.
- soft drift는 진단값으로만 남긴다.

Telemetry:

- `finalCommitmentReviewSkips33F2`
- `finalCommitmentSoftDriftObserved33F2`
- `finalCommitmentSoftCancelEvents33F2`

정상 목표:

```text
latched Final Commitment의 실제 soft cancel event = 0
```

## 3.2 Hard Abort는 유지

Commitment를 무조건 강제하는 것은 아니다. declaration 직전에도 F2 hard-abort gate를 통과해야 한다.

허용되는 중단 사유:

- `TARGET_INVALID`
- `SURVIVAL`
- `RECOVERY`
- `WAR_LIMIT`
- `NO_OPERATIONAL_ROUTE`
- `MANPOWER_COLLAPSE` — preparation active goal의 절반 미만

신규 Devlog:

```text
WAR_FINAL_COMMITMENT_HARD_ABORT33F2
```

F1의 기존 hard-abort 안전망도 유지한다.

---

# 4. PREPARING 장기 교착 진단

F2는 준비 상태를 임의로 시간초과 취소하지 않는다. 대신 실제 안정화가 효과가 있는지 확인하기 위해 장기 체류를 명시적으로 관측한다.

Telemetry:

- `preparingAgeDaysMax33F2`
- `preparingStuckOver3Years33F2`
- Nation `preparingAgeDays33F2`

V0.33F1 자연주행의 라엔처럼 5,000 calendar-day 이상 같은 전쟁준비에 묶이는 상태가 F2에서 재발하는지 바로 확인할 수 있다.

---

# 5. Peace Settlement 국가별 누적 통계 Fix

## 5.1 Canonical source

세계의 **`v33f.settlements[]`를 국가별 평화협정 통계의 canonical source**로 사용한다.

각 attach / save / migration 시 다음 값을 settlement history로부터 재구성한다.

- `settlementsWon`
- `settlementsLost`
- `tilesGained`
- `tilesLost`
- `personsIntegrated`
- `goldReceived`
- `goldPaid`

이후 동일 값을:

```text
Village.v33fStats
w.v33f.nationStats
```

양쪽에 동기화한다.

F의 attach도 수정해 **이미 존재하는 live `v33fStats`를 오래된 cache로 덮지 않도록** 했다.

따라서 V0.33F1 세이브에서 세계 Settlement는 존재하지만 국가별 값만 0인 경우도 F2 로드 시 복구된다.

신규 Devlog:

```text
PEACE_NATION_STATS_REBUILT33F2
```

Telemetry:

- `nationSettlementStatRepairs33F2`
- `nationSettlementStatCurrentMismatch33F2`
- Nation `peaceSettlementStatConsistent33F2`

정상 invariant:

```text
world peaceSettlements33F와 Nation별 누적 결과 불일치 = 0
```

---

# 6. F1 기능 유지

다음은 이번 패치에서 변경하지 않는다.

- 방어측이 역공에 성공했을 때 공격국 점령지를 영구 할양받는 규칙
- `WHITE_PEACE / GOLD_ONLY / TERRITORY_ONLY / TERRITORY_GOLD`
- Peace Leverage 공식
- Gold 배상 상한 및 보존 회계
- 수도 제한전쟁 영구 양도 금지
- Person ID / 이름 / 가족관계 / cultureMix / 개인 Gold 보존
- 정복지 행정마찰
- War Goal 규모
- Formation 목표 reservation / deconfliction
- 철광석 전용 자원지도
- 전투력 / 사상률 / 점령시간

철광석 지도는 F1 PC 확인에서 정상 작동으로 검증 완료된 상태다.

---

# 7. Validation

## 7.1 JavaScript 정적 검사

현재 `index.html`의 inline script:

```text
99 / 99 node --check PASS
syntax failure: 0
```

## 7.2 활성 경로 정적 회귀

최종 파일에서 다음 실제 경로 삽입을 확인했다.

```text
32B lexical targetActive → D2 active-goal floor
E2 lexical reviewIntent → latched commitment skip
E2 lexical candidate scan → F2 cooldown
D2A lexical READY downgrade → latch 제외
D2A declaration due → F2 hard-abort gate
F attach → live Nation stats 보존
F1 restoreLatch → 이미 DECLARED인 commitment 재복원 금지
```

## 7.3 독립 F2 mock runtime

Node mock world에서 확인:

```text
Peace Settlement canonical Nation stats rebuild PASS
방어측 승리 / 역영토 할양 통계 PASS
Person integrated count PASS
Gold paid / received count PASS
retry cooldown block + expiry PASS
Final Commitment latch detection PASS
MANPOWER_COLLAPSE hard-abort 판정 PASS
```

## 7.4 CSV schema

실제 제공된 V0.33F1 자연주행 CSV:

```text
1041 columns
846 rows
column mismatch: 0
```

F2 신규 진단 필드:

```text
Global 12 + Nation 5 = 17 columns
```

따라서 예상 V0.33F2 CSV schema:

```text
1058 columns
```

## 7.5 브라우저 자동화 제한

현재 실행환경의 Chromium은 `file://` 및 localhost 페이지 접근을 `ERR_BLOCKED_BY_ADMINISTRATOR`로 차단했다. 따라서 실제 Canvas/DOM browser smoke test는 자동화하지 못했다.

다음 PC 자연주행에서 우선 확인할 핵심 값:

```text
preparationDemobilizationBlockedPersons33F2 > 0일 수 있음
PREPARING 중 목표 이하 평시 전역 = 0
finalCommitmentSoftCancelEvents33F2 = 0
intentRetryCooldownApplied33F2 > 0이면 동일 상대 즉시 재생성 차단 성공
nationSettlementStatCurrentMismatch33F2 = 0
preparingStuckOver3Years33F2가 F1보다 크게 감소
```

---

# Historical Documentation — V0.33F1 and Earlier

# Village Observer V0.33F1
## Peace Settlement & Operational Coordination Fix

기준 버전: **V0.33F — War Goal & Peace Settlement V2**  
릴리스 성격: **Fix / 자연주행 종전 경로·War Goal 작전연결·다중 Formation 조정·관찰 UI 보강**  
작성일: 2026-10-01

---

## 0.33F1 패치 목적

V0.33F 첫 PC 자연주행에서 War Goal 생성과 실제 전쟁·점령은 정상적으로 발생했지만, 실제 D 전쟁 일일처리는 lexical `warPulseD()` / `endWarD()` 경로를 사용하기 때문에 F가 `NS.V033D.warPulse` / `NS.V033D.endWar`에 덧씌운 Peace Settlement wrapper를 우회하는 문제가 확인되었다.

그 결과 자연전쟁은 종전했어도 `peaceSettlement33F`가 생성되지 않아 영구 영토 양도와 Gold 합의가 0으로 남았다. 같은 실행에서 War Goal과 실제 작전목표가 분리되어 있었고, 적 야전군이 소멸한 뒤에도 복수 Formation이 같은 무방비 타일을 연속으로 추적하는 현상, Final Commitment가 시작된 뒤 일반 전략 재평가로 다시 취소될 수 있는 현상도 확인되었다.

F1은 밸런스 재조정이 아니라 **F에서 의도했던 시스템 연결을 실제 자연주행 경로에 맞게 복구**하는 패치다.

```text
D lexical warPulse/endWar
        ↓
F1 final-day observer
        ↓
종전 직전 occupation evidence 보존
        ↓
기존 F Peace Leverage / Settlement를 정확히 1회 실행
        ↓
영구 ownerId / Gold 합의 / 전쟁기록

적 야전군 존재·불확실
        ↓
기존 C3/E3 전술·집중 판단 유지

정보상 적 야전군 무력화
        ↓
남은 War Goal 우선
        ↓
복수 Formation 목표 reservation
        ↓
무방비 목표 분산 점령
```

---

# 1. Natural Peace Settlement Hook Fix

## 1.1 실제 종전 경로 복구

F1은 최종 `World.advanceOneDay()` 바깥에서 그날 시작 시점의 활성전쟁을 기록한다.

- 전쟁 시작 시 실제 `v33OccupierId` / `v33OccupationWarId`를 snapshot으로 보존한다.
- 전쟁 중 `TILE_OCCUPIED33` / `TILE_LIBERATED33`로 갱신되던 기존 `war.v33fLastControl`도 계속 사용한다.
- 상속된 하루 처리가 끝난 뒤, 시작 당시 ACTIVE였지만 현재 ENDED가 된 전쟁을 확인한다.
- `peaceSettlement33F`가 아직 없으면 기존 **V0.33F `applySettlement()`**를 최종 통제 증거와 함께 실행한다.
- 이미 합의가 존재하면 다시 실행하지 않는다.

신규 Devlog:

```text
PEACE_SETTLEMENT_APPLIED33F1
```

핵심 invariant:

```text
F War Goal이 존재하는 자연 종전 전쟁
→ peaceSettlement33F 정확히 1개
→ endedWarsMissingSettlement33F1 = 0
```

## 1.2 V0.33F 세이브 복구

F에서 이미 끝났지만 settlement hook을 우회했던 전쟁도 다음 조건을 모두 만족하면 F1 로드 시 복구한다.

- `war.status === ENDED`
- `war.warGoal33F` 존재
- `war.v33fLastControl` 존재
- `war.peaceSettlement33F` 없음

보존된 마지막 occupation evidence로 기존 F Peace Settlement를 적용한다. 전쟁목표나 점령 증거가 없는 더 오래된 전쟁을 임의로 재구성하지 않는다.

---

# 2. War Goal → 실제 작전목표 연결

V0.33F의 War Goal은 평화협상 계산에만 사용되고 실제 Formation target selection에는 연결되지 않았다. F1은 E3의 최종 `targetOverride()` 경계에 얹어서 이를 연결한다.

## 2.1 기존 전술판단 우선

다음 경우에는 기존 E3/C3 작전 판단을 그대로 유지한다.

- `RENDEZVOUS`
- `CONCENTRATE`
- `JOINT_ADVANCE`
- Intelligence상 적 야전군이 남아 있음
- 적 병력 정보의 신뢰도가 낮거나 너무 오래되어 소멸을 확신할 수 없음

즉 War Goal 때문에 살아 있는 적 야전군을 무시하고 땅만 먹으러 가지 않는다.

## 2.2 적 야전군이 무력화된 뒤

Intelligence가 충분히 신뢰 가능하고 알려진 적 야전 Formation이 0이면 공격측의 OFFENSIVE Formation은:

1. 아직 확보하지 않은 War Goal
2. 다른 Formation이 예약하지 않은 War Goal
3. War Goal을 모두 확보/예약했다면 별도의 무방비 적 영토 압박 목표

순서로 실제 작전목표를 선택한다.

신규 target kind:

```text
WAR_GOAL
SPLIT_PRESSURE
CAPITAL_PRESSURE
```

Devlog:

```text
FORMATION_OPERATIONAL_TARGET33F1
```

---

# 3. Multi-Formation Target Reservation / Deconfliction

같은 국가·같은 전쟁의 여러 OFFENSIVE Formation이 동일한 무방비 타일을 독립적으로 최고점으로 선택하는 현상을 막는다.

작전목표 reservation 키:

```text
warId + nationId + tileId
```

예약은 짧은 수명(60 calendar days)을 가지며 다음 경우 자동 제거된다.

- 목표가 이미 같은 편에 의해 점령됨
- Formation이 사라짐 / DORMANT
- Formation 실제 병력이 0
- 전쟁 종료
- reservation TTL 종료

한 Formation이 목표를 예약하면 다른 Formation은 다른 War Goal 또는 다른 무방비 압박 목표를 선택한다.

단, **E3의 의도적 집중은 reservation보다 우선**한다. 실제 적군이 존재하거나 E3가 RENDEZVOUS/CONCENTRATE/JOINT_ADVANCE를 결정한 경우 동일 목표 이동이 허용된다.

따라서 F 자연주행에서 관찰된 “상대 야전군 DORMANT 이후 2개 Formation이 11개 타일을 거의 같은 순서로 따라감”은 분산 대상으로 취급하지만, 적 주력이 남아 있을 때의 의도적 합동전투는 유지한다.

---

# 4. Final Commitment Latch

D2A Final Commitment가 시작된 Intent는 일반적인 전략점수·준비도 일시 변동으로 취소되지 않는다.

Latch 시작 조건은 실제 D2A commitment가 시작되어 다음 중 하나가 존재하는 READY intent다.

```text
readySinceCal33D2A
commitmentDueCal33D2A
```

F1은 D1 quarterly decision pulse에서 해당 국가의 ordinary review를 잠시 건너뛰게 하고, 같은 날 D2A가 일시적인 readiness 변동으로 READY를 PREPARING으로 되돌리더라도 commitment 상태를 복구한다.

Final Commitment 이후에도 다음 **hard abort**는 허용한다.

- 생존위기
- Recovery emergency
- 목표 국가 무효/소멸
- 작전경로 완전 상실
- 동시전쟁 한도 도달
- 준비 당시 목표 active manpower의 절반 미만으로 급붕괴

commitment due date가 도달했고 hard abort가 없다면 일반 선언 경로를 먼저 시도하고, 단순 전략점수 변동 때문에 선언 gate가 거부된 경우에는 commitment latch가 선언을 완결한다.

신규 Devlog:

```text
WAR_FINAL_COMMITMENT_LATCHED33F1
WAR_FINAL_COMMITMENT_SOFT_CANCEL_PREVENTED33F1
WAR_FINAL_COMMITMENT_HARD_ABORT33F1
WAR_INTENT_DECLARED33F1
```

또한 `ASSESSMENT_TOO_WEAK` / `INSUFFICIENT_CASE_AFTER_ASSESSMENT`로 취소된 동일 국가→동일 상대의 새 scan에는 **180일 재시도 cooldown**을 둔다. 다른 상대 평가까지 막지는 않는다.

---

# 5. War History / Recent Wars에 평화협정 통합

기존 별도 F 평화협정 박스뿐 아니라 실제 전쟁 기록 카드에도 최종 합의를 표시한다.

## 통계 탭 → 전쟁 기록

각 종료 전쟁 카드 하단에 다음을 추가한다.

- 합의 유형: 백지평화 / Gold 배상 / 영토 양도 / 영토+Gold
- War Goal 확보 수 / 전체 수
- 영구 양도 타일 좌표
- Gold 지급국 → 수취국 / 실제 지급량
- 반환된 임시점령 타일 수

## 국가 군사 탭 → 최근 전쟁

동일 canonical `war.peaceSettlement33F`를 사용해 각 최근 전쟁 바로 아래에 같은 핵심 합의 결과를 표시한다.

백지평화도 단순히 공백으로 두지 않고:

```text
합의: 백지평화 · 영토/Gold 변화 없음
```

으로 명시한다.

---

# 6. 철광석 전용 자원지도

`iron_ore`는 식량·목재·석재처럼 모든 육지에 연속적으로 존재하는 자원이 아니므로 generic resource renderer에서 분리한다.

철광석 자원지도에서는:

- 철광 매장이 있는/있던 타일만 **흰색 테두리**
- 철광이 없는 육지는 별도 회색 resource overlay 없음
- 현재 잔존량이 많을수록 내부 흰색 opacity 증가
- 고갈된 광맥은 내부 fill 0, 흰색 테두리만 유지
- 국가 경계는 ore fill 위에 다시 그려 식별 가능하게 유지
- 선택 타일은 cyan outline으로 마지막에 다시 표시

채움 강도는 단순 잔존율이 아니라 **현재 절대 잔존량을 세계 초기 최대 광맥과 비교**해 제곱근 스케일로 표시한다. 따라서 작은 광맥 100%와 거대 광맥 100%가 같은 밝기로 보이지 않는다.

이 변경은 자원 표시 전용이며 철광 생성량·채굴속도·산업식은 변경하지 않는다.

---

# 7. Telemetry / CSV

신규 World 지표:

```text
endedWarsObserved33F1
naturalPeaceSettlements33F1
migrationSettlementRepairs33F1
endedWarsMissingSettlement33F1
warGoalOperationalTargets33F1
targetReservations33F1
targetDeconflicts33F1
deliberateConcentrations33F1
duplicateOffensiveTargets33F1
finalCommitmentLatches33F1
finalCommitmentSoftCancelPrevented33F1
finalCommitmentHardAborts33F1
intentRetryCooldownSkips33F1
activeTargetReservations33F1
```

신규 Nation 지표:

```text
warGoalOperationalTargets33F1
targetDeconflicts33F1
deliberateConcentrations33F1
finalCommitmentLatched33F1
intentRetryCooldownRemaining33F1
```

V0.33F 자연주행 CSV 실측은 **1022 columns**였으며 F1은 19개 열을 추가한다.

예상 F1 CSV schema:

```text
1041 columns
```

---

# 8. Save / Migration

현재 save version:

```text
0.33F1
```

localStorage key:

```text
village-observer-v0-33f1
```

주요 fallback:

```text
village-observer-v0-33f
village-observer-v0-33e5f2
village-observer-v0-33e5f1
village-observer-v0-33e5f
```

F1 전용으로 저장하는 값은 cumulative diagnostics, target reservation, retry cooldown, nation diagnostics다. 기존 F의 `v33f` settlement / conquest / nation stats는 그대로 직렬화된다.

---

# 9. 구현 회귀 검증

## 정적 검사

- inline script: **98개**
- `node --check`: **98 / 98 PASS**
- syntax failure: **0**

## 독립 mock runtime

브라우저 외부에서도 최종 F1 wrapper의 연결 경로를 독립적으로 검증했다.

```text
lexical-style natural war end
→ NATURAL_END_PATH settlement 생성 PASS

2개 OFFENSIVE Formation + 적 야전군 0 + War Goal 2개
→ Formation A: War Goal #1
→ Formation B: War Goal #2
→ duplicate target 없음 PASS

Final Commitment 중 D1 review
→ READY 유지 PASS

Final Commitment 중 일시 READY→PREPARING demotion
→ READY / commitment due 복구 PASS

commitment due 도달
→ DECLARED 전환 PASS

종료된 0.33F war + v33fLastControl + settlement 없음
→ F1 attach migration repair PASS

World.serialize()
→ version 0.33F1 PASS

CSV wrapper mock
→ header / row column count 일치 PASS
```

실제 V0.33F 자연주행 CSV는 1022열 전 행 일치(846 rows)였고, F1 추가열 19개를 적용하면 1041열이 된다.

## 브라우저 smoke test 제약

현재 실행 환경에서는 `file://` 및 localhost 페이지 이동이 `ERR_BLOCKED_BY_ADMINISTRATOR`로 차단되어 실제 Chromium Canvas 렌더 smoke test는 자동 수행할 수 없었다.

따라서 다음 PC 자연주행에서 특히 확인할 항목은 다음이다.

1. 종료된 F1 전쟁마다 합의가 1회 생성되는지
2. `endedWarsMissingSettlement33F1 = 0` 유지
3. 실제 국경/Gold 변화가 전쟁기록과 일치하는지
4. 적 야전군 소멸 뒤 복수 Formation이 War Goal/무방비 목표로 분산되는지
5. 필요할 때 E3 집중은 그대로 유지되는지
6. 100% Final Commitment가 일반 평가 흔들림으로 다시 취소되지 않는지
7. 철광석 자원지도에서 비광맥 타일이 강조되지 않고, 광맥 흰 테두리/잔량 opacity가 정상인지

---

# 10. 밸런스 유지 범위

F1에서는 다음 수치를 의도적으로 변경하지 않았다.

- Formation 전투력 공식
- Person 사상률
- Engagement round 규칙
- Occupation Operation 시간/방어화력
- War Goal 1~3타일 규모
- Peace Leverage 공식
- Gold 배상 1회 상한
- 정복 문화/행정마찰 수치

이번 버전은 **F의 시스템 연결과 관찰성 수정**이다. 이 값들의 실제 밸런스는 F1 자연주행 이후 조정한다.

---

# Historical Documentation — V0.33F and Earlier

# Village Observer V0.33F
## War Goal & Peace Settlement V2

기준 버전: **V0.33E5F2 — Military Observer Polish**  
릴리스 성격: **Major Warfare / 영구 국경 변화·평화협정·전쟁배상 도입**  
작성일: 2026-10-01

---

## 0.33F 패치 목적

V0.33~E5F2까지의 전쟁은 선전포고, Formation 이동, 실제 Person 전투·사상, 지속 Engagement, 후퇴·재편, 임시점령과 Occupation Operations까지 물리적으로 수행했지만, 종전 시 모든 `v33OccupierId`가 제거되어 국경은 전쟁 전 상태로 되돌아갔다.

V0.33F는 이 마지막 단계를 확장한다.

```text
War Intent / Preparation
        ↓
   전쟁목표 생성
        ↓
전투 · 점령 · 수도 압박
        ↓
  Peace Leverage 산정
        ↓
     평화협정
 ┌────────┬───────────┬──────────────┬────────────────┐
 │ 백지평화 │ Gold-only │ Territory-only │ Territory + Gold │
 └────────┴───────────┴──────────────┴────────────────┘
        ↓
영구 ownerId 변경 / Gold 보존 이전 / 정복지 사회 연속성
```

핵심 원칙은 **점령과 영토소유를 끝까지 분리**하는 것이다.

- 전쟁 중 `v33OccupierId` = 임시 군사통제
- 평화협정의 영구 할양 = `ownerId` 변경
- SECURING 단계에서는 영구 국경이 바뀌지 않는다.
- 전쟁 중 깊게 점령한 모든 타일을 자동으로 합병하지 않는다.
- 수도 점령은 강한 협상력을 주지만 Limited War V1에서는 수도 자체를 영구 양도하지 않는다.

---

# 1. War Goal V1

## 1.1 생성 시점

새 독립전쟁이 `NS.V033D.declareWar()`를 통해 생성되면 즉시 `war.warGoal33F`를 붙인다.

기존 세이브에서 이미 진행 중인 전쟁을 F로 불러온 경우에도 `attachWorld()`가 목표가 없는 활성전쟁을 감지하여 한 번만 생성한다.

Telemetry:

```text
WAR_GOAL_CREATED33F
```

## 1.2 제한 영토전쟁 목표

기본 목표는 공격국 영토와 직접 맞닿은 방어국의 **비수도 국경 타일**이다.

후보 타일은 다음 안전 조건을 만족해야 한다.

1. 방어국 소유 타일일 것
2. 방어국 수도가 아닐 것
3. 공격국의 현재 영토와 4방향으로 인접할 것
4. 해당 타일을 제거해도 방어국의 기존 영토 연결 구성요소 수가 늘어나지 않을 것

4번은 섬·기존 월경지처럼 원래부터 분리된 영토를 강제로 하나의 덩어리로 만들지는 않는다. 대신 **이번 할양 때문에 새 단절이 추가되는 것**만 막는다.

후보의 전략가치는 현재 다음 요소를 사용한다.

```text
기본값                    5
+ 거주인구 × 1.15
+ 주요 건물별 전략가치
+ 개발공간 × 0.12
+ 도로 존재 시 +2
```

시장·행정·항구·병영·훈련장·무기고·철산업 시설 등은 일반 건물보다 높은 가치를 갖는다.

공격국 인구에 따라 목표 규모는 1~3타일이다.

```text
기본                  1타일
공격국 인구 ≥ 90      +1
공격국 인구 ≥ 220     +1
최대                  3타일
```

첫 목표를 잡은 뒤에는 그 목표와 인접한 후보만 연속적으로 추가하여 **연결된 목표 군집**을 만든다.

안전한 영토 목표가 전혀 없다면 전쟁은 다음으로 생성된다.

```text
LIMITED_PRESSURE
```

이 경우 영토 강탈을 억지로 만들지 않고 Gold 또는 협상 우위를 중심으로 종전할 수 있다.

---

# 2. Peace Leverage

Peace Leverage는 **전투력 공식이 아니다.**

Formation의 전투력, 사상률, Engagement 승패 계산은 E5F2와 동일하다. F는 전쟁이 끝난 시점에 “이 전쟁에서 어느 쪽이 무엇을 요구할 수 있는가”를 판단할 때만 별도의 협상력을 사용한다.

각 진영의 기본 Leverage는 다음 요소를 합산한다.

```text
적 영토 임시점령             +4 / 타일
적 수도 임시점령             +18 / 수도
전투 승수 - 패수              × 3.5
잔존 현역 비율 우세          log 비율 × 7, -10~+10 제한
상대 평균 전쟁피로 - 자국 피로 × 0.22
자국 전사자                  -0.45 / 명
자국 부상자                  -0.12 / 명
```

War Goal의 claimant 진영에는 별도 목적 달성 보너스가 붙는다.

```text
목표 타일 확보               +14 / 타일
모든 목표 확보               추가 +8
미확보 목표                  방어측 +2 / 타일
```

최종적으로:

```text
margin = |Leverage A - Leverage B|
```

을 사용한다.

## 2.1 승자 판정과 기존 전쟁 결과의 관계

기존 D 전쟁 시스템이 이미 `winnerSide`를 확정한 경우 그 결과를 **F가 뒤집지 않는다.**

기존 종전이 교착으로 `winnerSide = null`인 경우에만 F가 Peace Leverage를 보조 판정으로 사용한다.

```text
margin < 8      → 승자 없음 / 백지평화 가능
margin ≥ 8      → Leverage 우세 진영을 협상 승자로 인정
```

F가 새로 협상 승자를 확정한 경우 기존 `v33WarStats.warsWon / warsLost`에도 동일하게 반영하여 전쟁사와 F 통계가 갈라지지 않게 한다.

---

# 3. Peace Settlement V2

종전 직전의 점령상태는 `war.v33fLastControl`에 보존한다.

이는 기존 `endWarD()`가 `WAR_ENDED33` 로그를 남기기 전에 임시점령을 먼저 해제하기 때문이다. F는 마지막 물리적 점령 스냅샷을 이용해 평화조건을 계산한 뒤, legacy peace가 반환한 타일 중 실제 할양 대상만 다시 영구 소유권으로 전환한다.

평화협정 객체:

```text
war.peaceSettlement33F
```

지원 결과는 네 종류다.

```text
WHITE_PEACE
GOLD_ONLY
TERRITORY_ONLY
TERRITORY_GOLD
```

Telemetry:

```text
PEACE_SETTLEMENT33F
```

## 3.1 협상 강도 구간

기본 구간은 다음과 같다.

```text
승자 없음               WHITE_PEACE
margin < 20             GOLD_ONLY tier
20 ≤ margin < 38        LIMITED tier
margin ≥ 38             DECISIVE tier
```

LIMITED는 최대 1타일, DECISIVE는 최대 3타일을 검토한다.

실제 결과는 패전국의 영토 연결성과 승전국 국경 연결성, 협상 예산, 실제 Gold 지급 가능액에 따라 더 작아질 수 있다.

예를 들어 Gold-only tier라도 패전국이 실제 지급 가능한 공공 Gold가 전혀 없다면 최종 outcome은 `WHITE_PEACE`가 될 수 있다.

---

# 4. 영구 영토 할양

## 4.1 할양 후보

공격측이 승리한 경우 우선순위는 **실제로 점령한 War Goal 타일**이다.

방어측 승리처럼 공격국 영토를 역점령한 경우에는 실제 역점령지 중 안전한 국경 타일을 검토한다.

할양은 다음 조건을 모두 통과해야 한다.

1. 현재 원 소유국의 실제 `ownerId`와 일치
2. 원 소유국 수도가 아님
3. 제거 후 패전국 영토의 연결 구성요소 수가 증가하지 않음
4. 승전국 기존 영토 또는 같은 협정에서 앞서 선택된 할양 타일과 4방향 인접
5. 남은 Peace Leverage 예산으로 요구 가능

따라서 한 번의 제한전쟁으로 지도 반대편에 고립된 월경지를 생성하지 않는다.

## 4.2 영토 요구 비용

각 후보는 고정 1타일 가격을 쓰지 않는다.

```text
영토 Leverage 비용 = 12 + 타일 전략가치 × 0.55
```

인구가 많거나 시장·행정·산업·군사시설이 있는 타일은 변방보다 더 비싸다.

---

# 5. 정복지 물리적 연속성

영토가 넘어가도 Settlement를 삭제하고 새로 만들지 않는다.

보존 대상:

- 건물과 건물 상태
- 도로
- 자연자원 및 문명 비축
- Settlement Market Gold
- 산업시설
- 건설 진행도
- 토지정비 진행도
- 주거 개축 진행도
- 고급시설 전문화 진행도
- 실제 Person
- Person ID와 이름
- 가족/관계 참조
- `cultureMix`
- 개인 Gold 지갑

즉 **국경과 국가 귀속이 바뀌는 것이지, 그 지역의 사회를 재생성하지 않는다.**

## 5.1 실제 Person 편입

할양 타일을 `homeTileId`로 가진 생존 Person은 동일 객체 그대로 새 국가 `residents`로 이동한다.

```text
old Person object
→ 같은 id / 이름 / 문화 / 지갑 유지
→ villageId만 새 국가로 변경
```

정복 직후 해당 주민의 기존 군사배속은 해제한다.

- active soldier를 자동으로 승전국 병사로 만들지 않음
- cohort member 참조 제거
- 군사 상태 → civilian
- 새 국가의 일반 노동시장 재검토 대상으로 돌림

이는 “점령지 주민이 종전 다음 날 자동으로 정복군이 되는” 현상을 막는다.

## 5.2 통근과 개척 프로젝트 정리

패전국 주민 중 **거주는 다른 곳이지만 할양 타일에서 근무하던 Person**은 외국 직장 참조를 유지하지 않는다.

- `workTileId`를 본인 `homeTileId`로 되돌림
- 기존 job-slot 참조 제거
- 즉시 재취업 검토 가능 상태로 전환

반면 해당 Settlement 자체의 건설 프로젝트는 새 국가로 승계한다.

할양 타일을 **출발지로 삼던 패전국 Frontier Project**는 국가 영토 기반이 사라졌으므로 취소한다. 관련 `PIONEER` assignment도 해제한다.

Telemetry:

```text
FRONTIER_PROJECT_CANCELLED33F_CESSION
TERRITORY_CEDED33F
```

---

# 6. Gold 평화협정

V0.33F부터 전쟁에서 이겼다고 반드시 영토를 받는 것은 아니다.

근소한 우세에서는 다음과 같은 결과가 가능하다.

```text
영토 양도 0
패전국 → 승전국 Gold 8.4
결과: GOLD_ONLY
```

더 강한 승리에서는:

```text
목표 영토 1~3타일
+ 남는 협상력을 Gold로 전환
결과: TERRITORY_GOLD
```

## 6.1 Gold 요구량

Gold-only tier:

```text
requested = 3 + (margin - 8) × 0.55
```

영토가 포함된 경우:

```text
leftover = margin - territoryLeverageSpent
requested = leftover × 0.45
DECISIVE이면 추가 +2
```

이는 “Leverage 1 = Gold 1” 같은 고정환율이 아니라 **영토 요구에 쓰고 남은 협상 우위를 금전조건으로 전환하는 규칙**이다.

## 6.2 실제 지급 능력

요청액 전체를 생성해서 지급하지 않는다.

패전국의 실제 공공 가용자금만 사용한다.

1. Nation Treasury의 전략 reserve 초과분
2. Settlement Market의 지역 유동성 reserve 초과분

시장별 유동성 reserve:

```text
max(2 Gold, 지역 인구 × 0.10)
```

Treasury reserve는 기존 B2 전략재정 reserve를 그대로 읽고 최소 2 Gold를 보존한다.

최종 1회 지급 상한:

```text
min(
  requested,
  패전국 공공 가용 Gold × 30%,
  30 Gold
)
```

Person 개인지갑은 직접 징수하지 않는다.

승전국 수령액은 Nation Treasury로 들어간다.

## 6.3 통화량 보존

지급 전후 `NS.V032E6.moneyStock()`이 존재하면 세계 통화량을 감사한다.

Telemetry:

```text
PEACE_GOLD_TRANSFER33F
requested
payableCap
paid
treasuryPaid
marketPaid
marketMoves
moneySupplyDelta
```

Gold는 이동만 하며 생성·삭제하지 않는다.

장기 할부 배상금은 V0.33F 범위가 아니다.

---

# 7. Culture & Conquest

E4의 문화시스템을 정복지에 그대로 연결한다.

할양 시 정복지 주민의 `cultureMix`는 변경하지 않는다.

예:

```text
정치적 소유: 에브
지역 주민문화: LUEN 92%
에브 수도문화: MAELA 중심
```

이 상태를 그대로 유지한다.

## 7.1 기존 E4 문화마찰

기존 E4의 수도문화 불일치 생산 마찰은 계속 적용된다.

최대 약 8%의 문화 output friction은 F가 대체하지 않는다.

## 7.2 정복 행정 마찰

F는 별도로 초기 행정혼란을 추가한다.

```text
adminFrictionStart = 4% × (1 - 지역문화/새 수도문화 overlap)
```

최대 4%다.

그리고 8년 동안 선형으로 감소한다.

```text
8년 = 2880 calendar days
현재 마찰 = 초기 마찰 × max(0, 1 - 정복 후 경과일 / 2880)
```

기존 문화마찰은 남을 수 있지만 **정복 행정 마찰만 시간이 지나며 사라진다.**

반란, 독립운동, 강제동화, 강제이주는 아직 없다.

---

# 8. 수도 처리

Limited War V1에서 수도는 영구 할양 금지다.

수도 점령은 다음 효과만 갖는다.

- 임시 군사통제
- Peace Leverage 큰 보너스
- 기존 전쟁피로 및 군사·행정 압박

평화협정 후 수도는 원 소유국에 반환된다.

국가 완전합병·수도 이전·멸망전쟁은 후속 시스템으로 분리한다.

---

# 9. D2 전쟁준비 ↔ 평시 전역 충돌 Fix

E5F2 자연주행에서 다음 churn이 관측됐다.

```text
D2 PREPARING: 현역 6명 필요
        ↓
V0.32B 평시 planner: 현역 목표 3명 → 3명 전역
        ↓
다음 준비 pulse: 다시 동원
        ↓
다음 분기: 다시 전역
```

F에서는 D2 Preparation의 `goals.active`를 평시 전역의 실질적 하한으로 사용한다.

구현은 오래된 32B planner의 전체 밸런스를 재작성하지 않고, planner 실행 후 **방금 전역된 기존 현역 Person만 필요한 수만큼 즉시 복구**한다.

따라서:

```text
peacetimeTarget = 3
preparationActiveGoal = 6
실제 하한 = 6
```

Preparation이 끝나면 다시 평시 목표까지 자연스럽게 전역할 수 있다.

Telemetry:

```text
PEACETIME_DEMOBILIZATION_GUARD33F
```

---

# 10. UI / Observer

국가 → 군사 탭 상단에 **전쟁목표·평화협정 V2** 패널을 추가한다.

활성전쟁:

- War Goal label
- 목표 타일 수
- 현재 확보 목표 수
- 수도 영구양도 금지 안내

최근 종료전쟁:

- `WHITE_PEACE / GOLD_ONLY / TERRITORY_ONLY / TERRITORY_GOLD`
- 승자 진영
- 영구 할양 타일 수
- 실제 지급 Gold
- 최종 Peace Leverage margin

할양된 타일 Inspector에는 다음 역사정보를 표시한다.

- 전 소유국 → 현 소유국
- 문화마찰
- 현재 남은 정복 행정 마찰

타일 자체에는 `v33fConquest` 기록을 남겨 이후 역사 UI 확장을 가능하게 한다.

---

# 11. Snapshot / CSV Telemetry

E5F2 실측 CSV는 **999 columns**였다.

F는 World 14개 + Nation 9개, 총 23개 관찰 필드를 추가하여 정상 schema 기준 **1022 columns**를 사용한다.

## World fields

```text
activeWarGoals33F
peaceSettlements33F
whitePeace33F
goldOnlyPeace33F
territoryOnlyPeace33F
territoryGoldPeace33F
permanentTilesCeded33F
conqueredPersonsTransferred33F
peaceGoldRequested33F
peaceGoldPaid33F
peaceGoldAuditMismatches33F
demobilizationGuards33F
demobilizationGuardedPersons33F
activeConquestAdminTiles33F
```

## Nation fields

```text
activeWarGoals33F
warGoalTargetTiles33F
peaceSettlementsWon33F
peaceSettlementsLost33F
permanentTilesGained33F
permanentTilesLost33F
conqueredPersonsIntegrated33F
peaceGoldReceived33F
peaceGoldPaid33F
```

Devlog JSON의 `worldSummary`에는 F 규칙 설명과 평화협정 유형 누적치를 포함한다.

---

# 12. 저장 / 마이그레이션

현재 저장 version:

```text
0.33F
```

Save key:

```text
village-observer-v0-33f
```

Fallback 우선순위:

```text
0.33E5F2
0.33E5F1
0.33E5F
0.33E5
0.33E4A
```

F 저장에는 다음을 추가한다.

```text
v33f.revision
v33f.settlements[]
v33f.stats
v33f.nationStats
```

`Tile.serialize()`가 확장 속성을 보존하므로 `v33fConquest`도 세이브에 유지된다. 국가별 F 누적치도 `v33f.nationStats`로 별도 보존하여 불러오기 뒤 `peaceSettlementsWon/Lost`, 영토 획득/상실, 정복주민 편입, Gold 수취/지급 누적치가 0으로 리셋되지 않는다.

진행 중 E5F2 전쟁을 F로 마이그레이션하면 목표가 없는 활성전쟁에 War Goal을 한 번 생성한다.

---

# 13. 구현 이벤트

주요 신규 이벤트:

```text
WAR_GOAL_CREATED33F
PEACE_SETTLEMENT33F
PEACE_GOLD_TRANSFER33F
TERRITORY_CEDED33F
FRONTIER_PROJECT_CANCELLED33F_CESSION
PEACETIME_DEMOBILIZATION_GUARD33F
```

기존 `WAR_ENDED33 / WAR_ENDED33D`, `TILE_OCCUPIED33`, Engagement·사상자 이벤트는 그대로 유지한다.

---

# 14. 회귀 검증

최종 코드 기준 수행한 정적/Node mock 회귀:

### JavaScript

- inline script: **97개**
- syntax check: **97 / 97 통과**

### Decisive settlement

검증:

- War Goal 생성
- 강한 승리 → `TERRITORY_GOLD`
- 목표 타일 `ownerId` 영구 변경
- 정복 주민 동일 Person 객체 유지
- `cultureMix` 유지
- 기존 공사 진행도 승계
- Settlement Market Gold 그대로 유지
- 세계 총 Gold 변화 0

### Gold-only settlement

- 제한적 우세
- 영토 변경 0
- 실제 Gold만 이전
- 세계 통화량 보존
- legacy `warsWon / warsLost`와 F 협상 승자 동기화

### White Peace

- 실질적 교착
- winnerSide 없음
- 영토 0
- Gold 0

### Capital protection

- 수도를 직접 cession 함수에 넣어도 거부
- `ownerId` 유지

### Conquest continuity

- 패전국 외부 거주자의 할양지 직장 참조 해제
- 할양지를 출발지로 한 Frontier Project 취소
- 관련 Pioneer assignment 해제
- Settlement 건설 프로젝트는 새 국가로 승계

### Demobilization guard

- D2 준비 목표 4명
- legacy 평시 planner가 1명까지 낮추려는 mock
- F guard 후 실제 현역 4명 유지
- guard telemetry 증가

### CSV

- 검증된 E5F2 999-column 형태에 F 23필드 추가
- header/모든 mock rows **1022 columns 일치**

### Save migration

- E5F2 → F attach 통과
- F save/reload `v33f.settlements` 보존 통과

실행 환경의 관리 정책이 `file://` 및 localhost 페이지의 headless Chromium 로딩을 차단하여 실제 Canvas 브라우저 smoke test는 자동화하지 못했다. 실제 PC 자연주행에서는 전쟁목표 패널, 종전 후 국경 변경, Gold 배상, 타일 정복 이력 표시를 추가 확인한다.

---

# 15. F에서 의도적으로 제외한 범위

이번 버전에는 다음을 넣지 않는다.

- 동맹조약
- 속국
- 포로
- 완전합병
- 국가멸망 목적 전쟁
- 수도 영구양도
- 반란 / 독립운동
- 문화동화
- 강제이주
- 장기 할부 배상
- 배상 불이행 외교
- 개인 Combat 스킬의 전투 라운드 직접 가중 확대
- 장비 전투손실 / 노획 / 회수
- 전략 경계와 Intelligence의 통합

마지막 세 군사 항목은 별도 후속 군사 개편 후보로 유지한다.

---

# 16. 다음 자연주행에서 우선 확인할 것

1. `WHITE_PEACE / GOLD_ONLY / TERRITORY_ONLY / TERRITORY_GOLD`가 실제 자연전쟁에서 어느 비율로 발생하는가
2. 공격국이 목표보다 지나치게 많은 영토를 얻지 않는가
3. 국경 할양이 월경지·영토 단절을 만들지 않는가
4. 패전국이 Gold 배상 한 번으로 경제 붕괴하지 않는가
5. Gold 배상이 기존 통화 집중을 과도하게 가속하지 않는가
6. 정복지 Person·건물·시장·문화가 장기적으로 정상 작동하는가
7. 8년 정복 행정마찰이 의도대로 감소하는가
8. D2 준비 중 전역↔재동원 churn이 사라졌는가
9. 영토가 거의 포화된 19×19 세계에서 전쟁이 실제 국경 재편의 주된 동력으로 전환되는가

---

# Previous detailed release notes

아래에는 기준선인 V0.33E5F2 이하의 상세 기술 문서를 그대로 보존한다.

# Village Observer V0.33E5F2
## Military Observer Polish

기준 버전: **V0.33E5F1 — Occupied Tile Control Fix**  
릴리스 성격: **Polish / 관찰성·지도 가독성·진단 강화 (밸런스 변경 없음)**  
작성일: 2026-10-01

---

## F2 패치 목적

V0.33E5F1 PC 자연주행은 점령 통제 Fix가 실제 자연전쟁에서도 정상 작동함을 확인했다. 동시에 다음 관찰 문제가 남았다.

1. 실제 Person 지휘관이 Formation에 존재하고 군사 탭에서는 `★`로 표시되지만, 지도에서는 지휘관 보유 여부를 즉시 알 수 없다.
2. E5 Occupation Operations의 `defensiveFirepower`는 자연주행에서 누적 관측되지만 실제 점령 중 사상으로 이어지는 빈도가 매우 낮아, 밸런스 변경 전에 더 직접적인 결과 진단이 필요하다.
3. 군사 장비는 국가별로 `0% ↔ 100%`처럼 크게 갈리는 사례가 관측되어 Armory/장비 풀 채택 분포를 장기주행에서 바로 비교할 필요가 있다.
4. C3 전략도로 fallback의 후보 거절이 대량 발생할 때 `START_REJECTED / sourceReason=null`로 남는 경우가 많아 실제 병목 판독이 어렵다.

F2는 위 네 항목을 **Observer/diagnostic 계층에서만 보완**한다. 전투력, 사상률, 장비 생산량, Occupation defensive firepower, 도로 우선순위와 fallback 행동은 변경하지 않는다.

---

## 1. Formation Commander 지도 ★

### 표시 조건

군사 지도(`military32D`)에서 다음 조건을 모두 만족하는 Formation에 금색 `★`를 표시한다.

```text
Formation lifecycle != DORMANT
v33d1HasPhysicalPresence != false
실제 active Person manpower > 0
유효한 commanderPersonId가 현재 Formation 내부 Person을 가리킴
```

따라서 평시 국경 경계, 전쟁 준비, 실제 전시, 후퇴/재편 이후 다시 물리적으로 존재하는 Formation 모두 동일한 지휘관 표시 규칙을 사용한다.

DORMANT Formation은 실제 지도상 병력이 아니므로 별을 표시하지 않는다. 현재 `CORE_GARRISON`은 Formation Commander 체계가 아니므로 이번 ★ 표시에 포함하지 않는다.

### 위치와 겹침 처리

- ★는 기존 Formation 병력 라벨을 가리지 않도록 타일 중심의 **우상단 외곽**에 그린다.
- 별 자체는 타일 경계를 조금 넘어갈 수 있다.
- 금색 별에 어두운 stroke를 적용하여 국가색·전장표식·지형 위에서도 읽히게 한다.
- 작은 국가색 점을 함께 붙여 같은 타일의 복수 국가/Formation을 구분하기 쉽게 한다.
- 같은 타일에 지휘관 보유 Formation이 복수 존재하면 별을 수평으로 펼쳐 그린다.
- 최종 F2 renderer가 마지막에 ★를 그리므로 전장/점령/Formation 라벨 뒤에 묻히지 않는다.

이는 **시각화 전용 변경**이며 Commander의 전투 보너스나 임명 규칙은 바꾸지 않는다.

---

## 2. Tile Inspector 지휘관 상세

E1부터 타일 Inspector에 지휘관 이름과 Command Score가 표시되지만, F2에서는 지도 ★와 직접 연결되는 상세 박스를 추가한다.

지휘관 보유 Formation이 선택 타일에 있으면 다음을 함께 표시한다.

- Nation / Formation 이름
- 지휘관 실제 Person 이름
- Command Score
- 현재 Commander 전투력 보너스
- 패전 Battle Morale 손실 감소율
- Regroup 기간 감소율

현재 Command V1 공식은 변경하지 않는다.

```text
Command Score = combat 45%
              + service 20%
              + social 15%
              + health 10%
              + happiness 10%
```

Command Score 45 미만 후보는 기존과 동일하게 지휘관이 될 수 없다.

---

## 3. Occupation Defensive Fire 관찰 진단

이번 자연주행에서 `defensiveFirepowerEncountered33E5`는 증가했지만 완료된 점령작전의 방어화력 사상자가 0으로 끝나는 패턴이 관측되었다. F2는 이를 바로 판독할 수 있도록 **F2 이후 완료되는 작전**을 다음처럼 분리 집계한다.

- `occupationFireCompletions33E5F2`
  - `defensiveFirepower > 0` 상태로 완료된 점령작전 수
- `occupationFireNoCasualtyCompletions33E5F2`
  - 위 작전 중 `wounded + deaths == 0`
- `occupationFireCasualtyCompletions33E5F2`
  - 위 작전 중 실제 Person casualty가 1명 이상 발생
- `occupationFireCasualties33E5F2`
  - 해당 완료 작전의 누적 wound + death 수

중요: **방어화력 공식, 3일 cadence, accumulator threshold, 사망/부상 확률을 전혀 변경하지 않는다.** 이 데이터는 다음 자연주행에서 밸런스 조정 여부를 판단하기 위한 관찰값이다.

---

## 4. 군사 장비 분포 관찰

기존 V0.32C/F 장비 시스템은 그대로 유지한다. F2는 Snapshot/CSV에 다음 분포만 추가한다.

### World

- `armoryNations33E5F2`
- `equipmentNationsWithStock33E5F2`
- `equipmentNationsFullCoverage33E5F2`
- `equipmentCoverageMax33E5F2`
- `equipmentCoverageMedian33E5F2`
- `equipmentStockConcentrationTop133E5F2`

`equipmentStockConcentrationTop133E5F2`는 세계 군사장비 풀 중 가장 많은 장비를 가진 한 국가의 비중이다.

### Nation

- `armoriesObserved33E5F2`
- `equipmentCoverageObserved33E5F2`
- `equipmentStockObserved33E5F2`

장비 생산·소비 공식, Armory 건설 판단, Formation combat의 equipment 가중치는 변경하지 않는다.

---

## 5. Commander 관찰 Telemetry

Snapshot/CSV에 현재 물리적 야전 Formation과 지휘관 보유 비율을 추가한다.

### World

- `activeFieldFormations33E5F2`
- `commanderFormations33E5F2`
- `commanderCoveragePct33E5F2`

### Nation

- `activeFieldFormations33E5F2`
- `commanderFormations33E5F2`
- `commanderCoveragePct33E5F2`

여기서 active field Formation은 `DORMANT`가 아니고 실제 active Person manpower가 있는 물리 Formation만 센다.

---

## 6. Strategic Road START_REJECTED 진단

C3F는 전략도로 첫 후보가 거절되면 같은 경로의 뒤 후보를 순차 시도하는 fallback 자체는 정상 작동한다. 그러나 일부 상위 `startConstruction()` gate는 거절 이벤트를 별도로 남기지 않아 C3F가 최종적으로 다음처럼 기록하는 경우가 많았다.

```text
blocker: START_REJECTED
sourceEvent: null
sourceReason: null
```

F2는 `ROAD_NETWORK_CANDIDATE_REJECTED33C3F` 기록 직전에 현재 tile/Nation 상태를 다시 읽어 **보수적인 inferred blocker**를 추가한다.

가능한 분류:

- `OCCUPATION_CONTROL`
- `NOT_OWNED`
- `ALREADY_ROAD`
- `TILE_BUSY`
- `PROJECT_CAP`
- `SPACE`
- `WOOD`
- `STONE`
- `STRATEGIC_OR_PAYMENT_GATE`
- `INVALID_SITE`

원래 C3F의 `START_REJECTED`는 `legacyBlocker33C3F`로 보존한다. 확정적으로 구분하기 어려운 전략 슬롯 reserve / Gold·market payment / 기타 상위 gate는 잘못 단정하지 않고 `STRATEGIC_OR_PAYMENT_GATE`로 묶는다.

따라서 이 패치는 **diagnosis만 개선**하며 다음은 모두 그대로다.

- road proposal score
- competing infrastructure urgency
- preempt 기준
- 최대 6개 fallback 후보
- 실제 `startConstruction()` 성공/실패 결과

Devlog summary에는 inferred reason별 누적 횟수도 `roadRejectReasonCounts33E5F2`로 저장한다.

---

## 7. Save / migration

- save version: `0.33E5F2`
- localStorage key: `village-observer-v0-33e5f2`
- fallback:
  1. `village-observer-v0-33e5f1`
  2. `village-observer-v0-33e5f`
  3. `village-observer-v0-33e5`
  4. `village-observer-v0-33e4a`
- export prefix: `village-observer-v033E5F2-*`

F2 통계는 `v33e5f2.stats`에 저장한다. E5F1 이전 저장을 불러오면 F2 관찰 카운터는 0에서 시작하며 기존 E5/E5F/F1 누적 데이터는 그대로 유지한다.

---

## 8. 범위 밖 / 후속 후보

이번 패치에서 의도적으로 변경하지 않은 항목:

- 개인 `combat/health`를 전투 라운드 전투력에 더 직접 반영
- 장비의 전투 중 파손·후퇴 유실·전사자 장비 회수
- 전략 경계와 E2 Intelligence / 실제 군사위협의 통합
- Occupation defensive firepower의 피해 확률/압력 상향
- Armory 건설 기준 또는 장비 생산량 완화
- Gold concentration 조정
- War Goal / 영구 영토 이전 / Peace Settlement V2

위 앞 세 항목은 현재 군사 시스템의 후속 구조 개편 후보로 유지한다. E5F2 자연주행에서 새 회귀가 없다면 E5 계열을 마감하고 **V0.33F — War Goal & Peace Settlement V2**로 넘어갈 수 있다.

---

## 9. 정적 검증

F2 작성 직후 수행한 검증:

- inline script: **96 / 96 `node --check` 통과**
- F2 final namespace: `NS.V033E5F2`
- F2 save/export/version chain 추가
- 기존 E5F1 occupation-control 코드를 수정하지 않고 최종 additive layer로 추가
- Snapshot/CSV 신규 observer 필드는 기존 CSV wrapper 뒤에 추가
- F1 실측 CSV 979 columns 기준 F2 observer 20개 추가 → **예상 999 columns**
- 독립 mock runtime에서 snapshot → CSV wrapper row/header column count 일치 확인

현재 실행 환경의 headless Chromium은 로컬 `file://` 및 localhost 페이지를 조직 정책으로 차단하여 브라우저 자동 smoke test를 직접 수행할 수 없었다. 따라서 이번 빌드는 정적 script 검증과 코드 경로 검토를 완료한 상태이며, 실제 PC 첫 실행에서 지도 ★와 CSV export를 우선 확인한다.

---

# V0.33E5F1
## Occupied Tile Control Fix

기준 버전: **V0.33E5F — Occupation Progress Fix**  
릴리스 성격: **Fix / 완료 점령지 통제 상태 안정화**  
작성일: 2026-10-01

---

## F1 수정 요약

V0.33E5F 회귀 실행에서 Occupation Operations 자체는 정상 완료되었지만, `v33OccupationOperation`이 끝나고 `v33OccupierId`가 설정된 **완료 점령지**를 민간 건설과 CORE_GARRISON 재편성 로직이 다시 정상 소유지처럼 취급하는 문제가 확인되었다.

실제 회귀 로그에서는 비수도 타일 점령 완료 다음 날 기존 주택 공사가 재개되고, 이후 원 소유국이 완전 점령된 수도에서 신규 `LOCAL_HOUSING` 공사를 시작할 수 있었다. 또한 D Formation reconciliation과 legacy V0.32B 군사 review 경로는 수도의 `ownerId`만 보고 CORE_GARRISON을 다시 채울 수 있었다.

F1은 **SECURING과 완료 temporary occupation을 서로 다른 군사 상태로 유지하면서도, 민간 통제 제약은 둘 다에 연속 적용**한다.

핵심 수정은 다음과 같다.

- `v33OccupationOperation` 활성 타일뿐 아니라 `v33OccupierId != null`인 완료 점령지도 일반 개발 금지 상태로 취급한다.
- 완료 점령지에서는 신규 일반 건설, 토지 정비, 주거 개축, 상업/산업 고도화를 시작할 수 없다.
- 이미 진행 중인 일반 건설·토지 정비·주거 개축·전문화 프로젝트는 SECURING부터 완료 점령 상태까지 계속 정지한다.
- 해방되어 `v33OccupierId`가 해제된 뒤에만 기존 프로젝트가 다시 진행 가능 상태로 돌아온다.
- 수도가 적대 세력에게 완료 점령된 경우 원 소유국의 `CORE_GARRISON` Cohort와 Garrison 물리 객체를 제거한다.
- D Formation 재조정에서 야전 Formation 배치를 먼저 확정한 뒤, 수도 주둔으로 남으려던 실제 Person은 예비 상태로 되돌린다.
- **SECURING 중 패주 주둔군의 회복 → Engagement 재개**는 E5F 규칙 그대로 유지한다. 즉 주둔군 차단은 `v33OccupierId`가 설정된 **점령 완료 이후**에만 적용한다.

---

## 1. 완료 점령지 개발 통제

E5F의 건설 차단 predicate는 다음 상태만 보았다.

```text
v33OccupationOperation != null
```

따라서 작전 완료 시 `v33OccupationOperation`이 제거되고 `v33OccupierId`가 설정되면 기존 공사를 다시 재개했다. F1의 통제 predicate는 다음 두 상태를 모두 포함한다.

```text
SECURING:  v33OccupationOperation != null
OCCUPIED:  v33OccupierId != null

blocked = SECURING || OCCUPIED
```

이 predicate는 다음 경로에 적용한다.

- `startConstruction()`
- `startLandDevelopment()`
- `startHousingUpgrade()`
- `payBuild()` 기반 직접 건설/전문화 시작
- 기존 `constructionProjects` 진행
- 기존 `landDevelopmentProjects` 진행
- 기존 `buildingUpgradeProjects` 진행
- 기존 `specializationProjects` 진행

`payBuild()`에도 동일한 tile-control gate를 둔 이유는 Merchant Guild / Grand Market 등 일부 전문화 경로가 일반 `startConstruction()`을 거치지 않고 직접 프로젝트를 생성하기 때문이다.

### 프로젝트 재개 규칙

```text
정상 소유지
  → SECURING 시작: pause
  → 점령 완료: 계속 pause
  → temporary occupation 유지: 계속 pause
  → 해방 / v33OccupierId 해제: resume 가능
```

점령 완료 자체는 더 이상 `BUILDING_RESUMED` 조건이 아니다.

---

## 2. 점령 수도 CORE_GARRISON 차단

기존 D `ensureFormations()`는 현역 Person을 야전 Formation에 배치한 뒤 남은 인원을 `CORE_GARRISON`에 넣는다. legacy V0.32B `syncFormation()` 역시 현역 Person이 있으면 수도 Cohort/Garrison을 생성 또는 활성화한다.

F1에서는 다음 조건을 완료 점령 수도로 정의한다.

```text
coreTile.v33OccupierId != null
&& coreTile.v33OccupierId != nation.id
```

이 상태에서는:

1. D Formation reconciliation을 먼저 실행해 실제 야전 Formation 인원을 확정한다.
2. 남은 `CORE_GARRISON` Cohort 구성원을 예비 상태로 되돌린다.
3. 해당 CORE_GARRISON Cohort를 군사 상태에서 제거한다.
4. 수도 타일의 Garrison 객체를 제거한다.
5. 이후 군사 review가 다시 호출되어도 같은 reconciliation 후 suppression이 반복 적용된다.

따라서 점령 수도에서 **주둔군이 자연 재생성되어 공격군과 다시 싸우는 경로**가 사라진다.

중요하게도 SECURING 중에는 이 suppression을 적용하지 않는다. E5F에서 의도한 것처럼 ROUTED 주둔군은 `v33cRoutedUntilCal` 종료 후 회복하여 기존 점령 진척을 유지한 채 다시 Engagement를 열 수 있다.

---

## 3. 신규 Telemetry

### World scope

- `occupiedControlledTiles33E5F1`
- `occupiedCoreGarrisons33E5F1`
- `occupiedTileBuildProjects33E5F1`

### Nation scope

- `coreOccupied33E5F1`
- `coreGarrisonSuppressed33E5F1`
- `coreGarrisonSuppressions33E5F1`
- `constructionControlBlocks33E5F1`

`occupiedCoreGarrisons33E5F1`은 정상 실행에서 **0 유지**가 회귀 기준이다. `occupiedTileBuildProjects33E5F1`은 기존 프로젝트가 삭제되었다는 뜻이 아니라, 점령지에 남아 pause 상태인 프로젝트 수도 포함할 수 있다.

신규 주요 이벤트:

- `CORE_GARRISON_SUPPRESSED_OCCUPATION33E5F1`
- `BUILDING_PAUSED_CONTROL33E5F1`
- `BUILDING_RESUMED_AFTER_CONTROL33E5F1`

---

## 4. Save / migration

저장 버전:

```text
0.33E5F1
```

localStorage key:

```text
village-observer-v0-33e5f1
```

fallback:

```text
E5F → E5 → E4A
```

- E5F save/scenario는 F1 load 시 기존 Occupation state를 유지한 채 F1 state를 attach한다.
- F1 round-trip serialize/load에서 Person 수와 Occupation state를 보존한다.
- 기존 E5F 회귀 시나리오 import compatibility는 그대로 유지한다.

---

## 5. 구현 회귀 검증 결과

최종 배포본 기준 확인 결과:

- inline `<script>`: **95 / 95 Node syntax PASS**
- Headless Chromium runtime page error: **0**
- Version badge / document title: **V0.33E5F1**
- Save serialize version: **0.33E5F1**
- F1 round-trip load: **PASS**
- E5F-like payload → F1 migration: **PASS**
- E5 Occupation fixture 재실행: **점령 완료 PASS**
- 점령 완료 직후 defender 수도 `CORE_GARRISON` Cohort: **0**
- 점령 완료 직후 defender 수도 Garrison 객체: **0**
- 완료 점령지 `startConstruction()`: **false**
- 완료 점령지 `payBuild()`: **false**
- 회귀용 기존 주택 project progress: **7.0 → 7.0 유지**
- 점령 완료 후 추가 6일 진행에서도 project progress 변화: **0**
- CSV validation: **979 columns / mismatch 0**

별도 해방 predicate 검사에서는 점령 control flag가 해제된 뒤 pause marker가 정상적으로 해제되고 `BUILDING_RESUMED_AFTER_CONTROL33E5F1` 경로가 열리는 것도 확인했다.

---

## 6. 범위 유지

F1은 다음을 변경하지 않는다.

- E5 점령 필요량 공식
- 점령 수행력 공식
- 방어 화력과 attrition 공식
- ROUTED 주둔군의 SECURING 중 회복/재교전
- Formation Concentration
- Emergency Defense
- 중립 육상 통행 ×1.15
- 전쟁 선포/War Intent/D2/D2A/E2 판단식
- E4 문화 생산 마찰
- temporary occupation의 65% 기존 생산/지원 모델
- 영구 영토 이전

따라서 F1은 **점령 완료 후 통제 상태의 누락만 닫는 Fix**다. 다음 큰 기능 단계 후보는 여전히 **V0.33F — War Goal & Peace Settlement V2**다.

---

# Historical Documentation — V0.33E5F and Earlier

# Village Observer V0.33E5F
## Occupation Progress Fix

기준 버전: **V0.33E5 — Occupation Operations + Military Movement Stabilization**  
릴리스 성격: **Fix / E5 점령 작전 회귀 안정화**  
작성일: 2026-10-01

---

## E5F 수정 요약

E5 마지막 `Occupation Operations` 회귀에서 **패주한 수도 주둔군이 전투에서는 제외되면서도 점령 defender 판정에는 계속 남아 점령 진척을 영구적으로 0%에 묶는 문제**가 확인되었다. E5F는 이 불일치를 제거하고 회귀 fixture가 일반 생존·평시 군사 리뷰에 의해 붕괴하지 않도록 안정화한다.

핵심 수정은 다음과 같다.

- `CORE_GARRISON`은 기존 전투 로직과 동일하게 `v33cRoutedUntilCal`이 끝나기 전까지 점령 defender에서 제외한다.
- 패주 중에는 `SECURING` 진척과 방어 화력 노출이 정상 진행되고, 주둔군이 회복하면 현재 진척을 유지한 채 Engagement가 우선된다.
- 활성 점령작전 타일은 신규 일반 건설·토지 정비·주거 개축을 시작하지 못한다.
- 이미 진행 중인 일반 건설·토지 정비·주거 개축은 점령작전 동안 일시정지하고 작전 종료 후 재개한다.
- `e5-*` 회귀 시나리오에서는 legacy V0.32B 분기 평시 군사 리뷰를 건너뛰어 강제로 배치한 Person-backed Formation이 테스트 중 해산되지 않는다.
- Occupation fixture에는 **테스트 전용** 식량 안정과 감시탑 1개를 추가한다. 자연주행 밸런스 값은 바꾸지 않으며, 방어 화력에 의한 실제 Person 소모와 25/50/75% milestone을 재현 가능하게 관찰하기 위한 조치다.

### E5F 회귀 검증 결과

Headless Chromium 기준 Occupation fixture에서 다음 흐름을 확인했다.

```text
주둔군/수비 병력과 선행 Engagement
→ OCCUPATION_OPERATION_STARTED
→ 25%
→ 50%
→ 방어 화력에 의한 실제 Person 부상
→ 75%
→ OCCUPATION_OPERATION_COMPLETED
```

대표 검증 주행에서는 requirement 약 37.9, resistance 19.5, defensive firepower 0.367 상태에서 약 46 calendar-day 후 점령이 완료되었고, 점령 중 신규 목표 타일 건설과 분기 강제해산은 발생하지 않았다. CSV schema는 기존 **972 columns / mismatch 0**을 유지한다.

---

## 0. E5 패치 목적

V0.33E5는 V0.33E3~E4A 회귀 테스트에서 발견된 Formation 실행 단계의 잔여 결함을 정리하면서, V0.33F의 전쟁 목표·강화협상·영구 영토 이전에 앞서 **"적 타일 진입"과 "실제 점령"을 분리**한다.

핵심 흐름은 다음과 같다.

```text
군사 이동
  → 적 접촉
  → 실제 Person 전투
  → 방어군 제거/철수
  → 점령 작전(SECURING)
  → 점령 완료
  → 기존 temporary occupation(v33OccupierId)
```

E5에서는 전쟁 선포 기준, D2/D2A 준비 문턱, E2 정보 오차, 전쟁피로·평화 확률, 문화 -8% 마찰을 변경하지 않는다. 즉 이번 버전의 목적은 **전쟁이 일어난 뒤의 작전 실행을 더 일관되고 관찰 가능하게 만드는 것**이다.

---

## 1. Formation Concentration 마감 수정

### 1.1 첫 라운드 축차투입 제거

E4A `Formation Concentration Rendezvous` 회귀에서 두 Formation이 같은 날 같은 적 타일로 이동했음에도 첫 Formation의 이동 처리 중 Engagement가 즉시 생성되어 Round 1을 혼자 치르는 문제가 확인되었다.

E5에서는 `v33e3Concentration.phase === ADVANCE`인 Formation이 적군과 접촉할 경우 이동 함수 안에서 즉시 Engagement를 열지 않는다. 같은 날 예정된 동행 Formation 이동을 모두 처리한 뒤 D의 post-movement contact sweep이 Engagement를 생성한다.

따라서 정상적인 joint advance는:

```text
Formation A 이동 commit
Formation B 이동 commit
→ 양쪽 위치 확정
→ Contact Sweep
→ Engagement 생성
→ Round 1에 A+B 모두 참가
```

순서가 된다.

### 1.2 Concentration 성공/실패 구분

E4A에서는 실제 Joint Engagement에 성공한 뒤에도 Formation 상태가 바뀌면서 `FORMATION_STATE` cancellation으로 집계될 수 있었다.

E5에서는 성공한 그룹을 `FORMATION_CONCENTRATION_COMPLETED33E5`로 종료한다.

- `starts`: 집결 작전 시작
- `completed`: 실제 합동 교전 달성
- `cancelled`: timeout / emergency / formation loss 등 진짜 실패
- `emergencyBypasses`: 수도 긴급방어 때문에 집결을 포기한 경우

### 1.3 piecemeal telemetry 의미 수정

`piecemealPrevented`는 집결을 시작했다는 이유로 증가하지 않는다. **첫 Engagement Round에 같은 Concentration 그룹의 Formation 2개 이상이 실제로 동시에 존재할 때만** 증가한다.

반대로 첫 Round에 하나만 들어오면 E5의 `piecemealFirstRounds33E5`가 증가한다.

---

## 2. Emergency Defense 실행 보강

E4A Emergency Defense 회귀에서는 `EMERGENCY_DEFENSE` 감지와 Concentration 취소 자체는 정상 작동했지만, `HOLD_CORE` Formation이 중간의 미점유 타일을 경로로 사용하지 못해 수도 방향으로 실제 이동하지 못했다.

E5에서는 긴급방어 임무의 target이 현재 위치와 다른데도 경로가 없을 경우 `EMERGENCY_DEFENSE_UNREACHABLE33E5`를 기록한다. 동일 Formation에 대해 15일 이내 중복 경고는 억제한다.

정상 경로가 존재하면 `HOLD_CORE / INTERCEPT / SCREEN` Formation은 실제 이동 로직을 그대로 사용해 방어 방향으로 이동한다.

---

## 3. 미점유 중립 육상 군사통행

### 3.1 통행 규칙

군사 육상 경로는 다음과 같이 정리한다.

| 타일 상태 | 통행 | 비고 |
|---|---|---|
| 자국 | 허용 | 정상 군사 이동 |
| 같은 전쟁 동일 진영 | 허용 | 기존 coalition access |
| 적국 | 허용 | 침공 대상 |
| **미점유 passable 육상** | **허용** | 소유권·정착지 변화 없음 |
| 비참전 제3국 | 차단 | 군사통행권 없는 상태 유지 |
| 물 | 기존 규칙 | E5에서 해상 작전 규칙을 확장하지 않음 |

이 규칙은 D 전쟁 경로뿐 아니라 D1A operational reachability, C1 retreat/deep-recovery fallback, 전후 return corridor에도 반영한다.

### 3.2 중립지 작전비용

미점유 육상으로 진입하는 이동에는:

```text
neutralFactor = 1.15
```

를 적용한다.

기존 이동식의 지형·도로·보급·상태 배율과 곱해지며, pathfinder도 같은 이동일수 비용을 사용한다. 따라서 중립지는 통과할 수 있지만 자국/우군의 정상적인 관리·도로·보급권역보다 약간 불리하다.

중립 타일을 통과해도 `ownerId=null`은 유지되며 다음 동작은 발생하지 않는다.

- 영토 획득
- Settlement 생성
- temporary occupation 생성

### 3.3 전후 귀환

전쟁 종료 시 Formation이 적국뿐 아니라 **미점유 중립지에 있어도** `POSTWAR_WITHDRAWAL_D` return state를 생성한다. 귀환 경로는 자국·전쟁 참가국의 기존 허용 영토와 미점유 육지를 사용할 수 있다.

---

## 4. Occupation Operations V1

### 4.1 즉시 점령 폐지

E4A까지 적 타일에 유효한 적군이 없으면 Formation 이동 당일 `occupyD()`가 호출되어 `v33OccupierId`가 즉시 설정되었다.

E5에서는 적 타일 진입과 temporary occupation 사이에 `v33OccupationOperation`을 둔다.

점령 작전 중에는:

```text
ownerId            = 원 소유국 유지
v33OccupierId       = null
v33OccupationOperation.status = SECURING / CONTESTED
```

이며, 요구량을 모두 확보한 날에만 기존 temporary occupation으로 전환한다.

### 4.2 방어군이 항상 먼저

적 타일의 유효한 야전 Formation 또는 수도 주둔군이 존재하면 기존 Engagement가 우선한다.

- 적군 존재 → Engagement
- 공격측 승리/적군 이탈 → 점령 작전 시작 또는 재개
- 구원군 도착 → `CONTESTED`, 진척 정지
- 공격군이 사라짐 → `ATTACKER_LEFT`로 작전 취소, V1에서는 진척 초기화

즉 가상의 수비 병력을 만들지 않고 모든 군사전투는 기존 실제 Person 전투 체계를 사용한다.

---

## 5. 타일 방어 능력 3축 분리

E5부터 방어 개념을 다음 세 축으로 명시적으로 분리한다.

### 5.1 전투 방어력 (Combat Defense)

기존 `defenseFactor33()`을 유지한다. 실제 주둔군/야전군이 해당 타일에서 싸울 때 지형·군사시설·수도 여부에 따라 전투력이 보정된다.

### 5.2 점령 저항도 (Occupation Resistance)

적군을 직접 죽이지 않고 **지역을 완전히 제압하는 데 필요한 시간**을 늘린다.

현재 E5 V1 값:

- 숲: +1.5
- 암석: +2.5
- 산악: +4.0
- 방책(palisade): +4.0 / 개
- `FORTIFICATION` 기술 보유 시 방책 저항 ×1.25
- 수도: +3.0 저항

현재 실제 방어시설의 주 적용 대상은 방책이며, `watchtower / fortification` building id가 존재하는 시나리오·향후 확장을 위한 hook도 유지한다.

### 5.3 방어 화력 (Defensive Firepower)

점령 작전 중 공격군을 소모시키는 별도 값이다. 사용자가 제안한 임시 명칭 "타일 공격력"을 E5에서는 **방어 화력**으로 정식 구분한다.

현재 V1:

- 방책: 0.06 / 개
- `FORTIFICATION` 기술 시 방책 화력 ×1.15
- watchtower hook: 0.16
- fortification building hook: 0.12

방어 화력은 가상의 군사 Person을 만들지 않으며, 피해가 발생하면 점령 중인 실제 Formation Person에게 적용된다.

---

## 6. 점령 필요량과 수행력

### 6.1 기본 점령 필요량

현재 식:

```text
baseRequirement
  = 3
  + residentPopulation × 0.35
  + buildingCount × 0.80
  + max(0, developedBuildSpace - 8) × 0.15
  + capitalBonus(8)

occupationRequirement
  = baseRequirement + occupationResistance
```

따라서 같은 방어시설이라도 인구·건물·도시 규모가 큰 타일일수록 제압 시간이 길어진다.

### 6.2 점령 수행력 (Occupation Capacity)

공격측의 값을 "공격력"이라고 부르지 않고 **점령 수행력**으로 정의한다.

```text
rawCapacity = 0.61 + 0.24 × sqrt(manpower)
capacity    = rawCapacity × supplyModifier
```

보급 modifier:

- Supply ≥ 70: ×1.00
- 50~69: ×0.92
- 30~49: ×0.82
- 30 미만: ×0.70

병력이 많을수록 빠르지만 `sqrt(manpower)`를 사용해 병력 2배가 점령시간을 정확히 절반으로 만들지 않는다.

같은 진영의 Person-backed field formations가 같은 타일에 있으면 실제 manpower를 합산한다.

---

## 7. 점령 중 방어 화력 소모

방어 화력은 매일 즉사 판정을 하지 않는다. **3 calendar-day cadence**로 노출을 누적한다.

현재 pressure는 방어 화력, 점령 저항, 공격측 manpower를 이용하며 소수 Formation 보호를 위해 병력수의 제곱근으로 완화한다.

점령 진척에 따라 유효 방어 화력은 선형적으로 약해져:

```text
0% progress   → 100%
100% progress → 35%
```

가 된다. 이는 사격 위치·방책·교차로 등을 공격군이 점차 제압하는 것을 추상화한다.

실제 피해가 발생할 때는:

- 약 76%: 부상
- 약 24%: 사망

으로 시작하며, 대상은 반드시 실제 군사 Person이다. synthetic casualty는 없다.

이 값은 V1 밸런스이며 자연전쟁 데이터에 따라 후속 Balance에서 조정할 수 있다.

---

## 8. 점령 중 경제

`v33OccupationOperation`이 활성화된 타일의 Person 기반 산출은:

```text
× 0.50
```

으로 감소한다.

현재 E4 문화 output multiplier와 함께 기존 harvest/deposit 경로에서 곱해진다. 점령이 완료되면 이 securing penalty는 사라지고 기존 temporary occupation의 65% 점령지원/생산 모델로 넘어간다.

---

## 9. 지도 시각화

점령 완료 전에는 **타일의 원 소유국 색을 유지**한다. 점령 진척도가 정치적 소유권처럼 보이지 않도록 타일 전체를 공격국 색으로 채우지 않는다.

대신 활성 점령작전 타일에는 공격국 색의 **내부 perimeter progress**를 그린다.

- 25%: 사각형 둘레 1/4
- 50%: 둘레 절반
- 75%: 둘레 3/4
- 100%: 완료 후 기존 점령 해칭으로 전환

cell size가 충분히 큰 경우 타일 내부에 `%` 숫자를 함께 표시한다.

### 9.1 Tile Inspector

선택 타일에는 다음 정보를 표시한다.

- 공격국 → 원 소유국
- 현재 progress %
- 예상 잔여일
- 점령 필요량 / 확보량
- 현재 점령 수행력
- 실제 점령 manpower
- 점령 저항도
- 방어 화력
- 점령작전 누적 부상 / 전사
- `SECURING` 또는 `CONTESTED`

구원군과 Engagement가 발생하면 progress border는 그대로 남고 진척만 정지한다. 공격군이 패배·철수하면 V1 규칙에 따라 작전이 취소되고 progress border가 사라진다.

---

## 10. Occupation telemetry

### World scope

- `activeOccupationOperations33E5`
- `occupationOperationsStarted33E5`
- `occupationOperationsCompleted33E5`
- `occupationOperationsCancelled33E5`
- `occupationOperationDaysAvg33E5`
- `occupationOperationDaysMax33E5`
- `occupationAttritionWounded33E5`
- `occupationAttritionDeaths33E5`
- `occupationResistanceEncountered33E5`
- `defensiveFirepowerEncountered33E5`
- `neutralMilitaryMoves33E5`
- `neutralMilitaryMoveDays33E5`
- `concentrationCompleted33E5`
- `piecemealFirstRounds33E5`
- `emergencyDefenseUnreachable33E5`

### Nation scope

- `occupationOperationsOffensive33E5`
- `occupationOperationsDefensive33E5`
- `occupationProgressMax33E5`

점령 진행 로그는 매일 남기지 않고 `STARTED`, 25/50/75% milestone, `COMPLETED/CANCELLED`, 실제 attrition 사건만 기록한다.

동일 war/tile/occupier의 `TILE_OCCUPIED33`가 상태 변화 없이 반복되는 경우 E5 telemetry guard가 중복 기록을 억제한다.

---

## 11. Regression Scenario 3종

### 11.1 E5 · Formation Concentration

파일:

```text
village-observer-v033E5-scenario-e5-concentration.json
```

검증 목표:

- concentration start ≥ 1
- rendezvous ≥ 1
- joint advance ≥ 1
- joint engagement ≥ 1
- E5 concentration completed ≥ 1
- 첫 Battle Round에 두 Formation 동시 존재
- `piecemealFirstRounds33E5 = 0`

### 11.2 E5 · Emergency Defense + Neutral Corridor

파일:

```text
village-observer-v033E5-scenario-e5-neutral-emergency.json
```

검증 목표:

- `EMERGENCY_DEFENSE` cancellation
- `emergencyBypasses ≥ 1`
- HOLD_CORE Formation이 실제 수도 방향 이동
- 미점유 육상 진입
- neutral tile `ownerId=null` 유지
- `neutralFactor = 1.15`
- 비참전 제3국 무단통행 없음

### 11.3 E5 · Occupation Operations

파일:

```text
village-observer-v033E5-scenario-e5-occupation-operations.json
```

고의로 방책이 있는 델마 수도와 실제 core garrison을 배치한다.

검증 목표:

```text
주둔군 Engagement
→ 공격측 승리
→ OCCUPATION_OPERATION_STARTED33E5
→ 25 / 50 / 75 milestone
→ OCCUPATION_OPERATION_COMPLETED33E5
→ v33OccupierId 설정
```

방책의 점령 저항과 방어 화력이 모두 non-zero인지도 함께 확인한다. 방어 화력의 실제 인명피해 발생 시점은 누적 pressure와 전투 후 남은 manpower에 따라 달라질 수 있으므로 "매 실행마다 반드시 1명 피해"를 시나리오 합격 조건으로 강제하지 않는다.

---

## 12. Persistence / Migration

저장 버전:

```text
0.33E5
```

localStorage key:

```text
village-observer-v0-33e5
```

fallback은 E4A → E4 → E3 → E2F 순으로 유지한다.

- E4A save/scenario는 로드 시 E5 state를 자동 attach한다.
- 진행 중 `v33OccupationOperation`은 Tile serialization에 포함되어 저장/복원된다.
- 기존 E4 문화, 이름, 전쟁 파이프라인 telemetry는 보존한다.

---

## 13. 구현 회귀검증 결과

최종 자동 검증 기준:

- inline script Node syntax: **93 / 93 PASS**
- 브라우저 runtime page error: **0**
- Formation scenario: start 1 / rendezvous 1 / joint advance 3 / joint engagement 1 / completed 1 / piecemeal first round 0
- 첫 공격 접촉일에 두 Formation이 같은 calendar day에 목적 타일에 진입한 뒤 Round 1 생성 확인
- Emergency scenario: bypass 1, 실제 HOLD_CORE 이동 확인, 중립 군사이동 telemetry 확인
- 중립 corridor의 `ownerId=null` 유지 확인
- 임의 제3국 타일을 경로에 삽입했을 때 D path가 해당 타일을 통과하지 않음 확인
- D1A prewar reachability가 `자국 → 중립 → 중립 → 적국` 경로를 `DIRECT_ACCESS`로 판정하는 별도 검사 PASS
- Occupation scenario: 주둔군 전투가 점령 시작보다 먼저 발생, 25/50/75% milestone 후 점령 완료 확인
- 점령 중 지도/Inspector progress UI 렌더링 error 0
- 동일 점령 상태의 duplicate `TILE_OCCUPIED33` 0
- CSV: **972 columns / schema mismatch 0**
- serialize / reload: E5 유지
- E4A → E5 migration PASS
- fresh 300-day smoke: runtime error 0
- neutral tile에서 전쟁이 종료된 Formation에 post-war return state가 생성되고 귀환 이동이 수행됨 확인

---

## 14. 의도적으로 남긴 범위

E5에서 다음은 구현하지 않는다.

- 영구 영토 할양
- 전쟁 목표에 따른 강화조건
- 배상금 / 속국 / 동맹 / 포로
- 문화 반란 / 저항운동
- 점령 진척의 장기 잔존(V1은 공격군 이탈 시 초기화)
- 공성무기 전용 시스템
- 방어시설 실제 파괴/내구도 감소
- 해상 상륙
- 비참전국 외교적 군사통행권

이 항목들은 E5의 `전투 → 점령작전 → temporary occupation` 기반 위에서 후속 버전으로 확장한다.

다음 큰 기능 단계는 계획대로 **V0.33F — War Goal & Peace Settlement V2**를 후보로 둔다.

---

# Historical Documentation — V0.33E4A and Earlier

아래는 E5의 기준선이 된 V0.33E4A 문서를 보존한 것이다.

# Village Observer V0.33E4A
## War Pipeline Observation + Culture Stabilization

기준 버전: **V0.33E4 — Culture & Identity Foundation V1**  
릴리스 성격: **Adjustment / 관찰 강화 / E3 회귀 시나리오**  
작성일: 2026-10-01

---

## 0. E4A 패치 목적

V0.33E4A는 전쟁 밸런스를 다시 조정하는 버전이 아니다. V0.33E3와 E4의 장기 자연주행에서 **War Intent와 전쟁 준비가 발생했지만 실제 선전포고가 나오지 않아 E3 Formation Concentration을 자연적으로 검증하지 못한 문제**를 관찰 가능성의 문제로 먼저 다룬다.

E4A의 목표는 다음 두 가지다.

1. devlog가 없어도 Snapshot/CSV 하나만으로 `후보 탐색 → War Intent → Preparation → Final Commitment → Declaration` 중 어디에서 전쟁이 멈췄는지 복원한다.
2. 자연전쟁을 기다리지 않고 E3 Formation Concentration의 핵심 경로와 긴급방어 예외를 재현할 수 있는 **Test Scenario 2개**를 제공한다.

이번 버전은 **전쟁 점수 68 기준, D2 준비 목표, D2A Final Commitment 기간, 선언 확률, E2 정보 오차, E3 집결 판단식, E4 문화 생산 마찰**을 변경하지 않는다.

---

## 1. War Pipeline Observer V1

### 1.1 관찰 단계

각 Nation의 현재 전쟁 파이프라인을 다음 단계로 요약한다.

```text
SCAN
  ↓
INTENT
  ↓
PREPARING
  ↓
READY
  ↓
FINAL_COMMITMENT
  ↓
WAR_ACTIVE
```

이 값은 별도의 AI 결정을 다시 계산하지 않는다. 기존 D1/D2/D2A가 이미 생성한 intent/preparation/war 상태를 읽어 Snapshot과 UI에 표시한다.

### 1.2 이벤트 기반 누적 카운터

`Telemetry.record()`에 저비용 observer를 연결해 기존 이벤트가 발생할 때만 카운터를 증가시킨다. 새로운 daily map scan이나 Person scan은 추가하지 않는다.

관찰 대상 이벤트:

- `WAR_INTENT_CREATED33D1`
- `WAR_INTENT_CANCELLED33D1`
- `WAR_PREPARATION_STARTED33D2`
- `WAR_PREPARATION_READY33D2`
- `WAR_PREPARATION_ENDED33D2`
- `WAR_PREPARATION_MOBILIZATION33D2`
- `WAR_PREPARATION_STOCKPILE33D2`
- `WAR_CHEST_FUNDED33D2A`
- `WAR_FINAL_COMMITMENT_STARTED33D2A`
- `WAR_FINAL_COMMITMENT_CANCELLED33D2A`
- `WAR_PREPARATION_DECLARATION_BLOCKED33D2A`
- `WAR_DECLARED33D`

E4 세이브를 E4A로 처음 불러오는 경우 현재 세션에 남아 있는 기존 telemetry entries를 한 번 backfill하고, 이후에는 실시간 이벤트만 집계한다. E4A 세이브에서는 `backfilled` 상태를 저장해 재로드 시 이중 집계를 방지한다.

### 1.3 취소 사유 분류

원문 `reason`은 그대로 보존하고 장기 CSV 집계를 위해 아래 범주로 추가 정규화한다.

```text
SCORE
INTEL
ROUTE
FIELD_POWER
READINESS
FOOD
FINANCE
FORMATION
DIPLOMACY
TIMEOUT
TARGET_INVALID
OTHER
```

예를 들어 `ASSESSMENT_TOO_WEAK`은 `SCORE`, `READINESS_LOST`는 `READINESS`로 누적된다. 마지막 실패는 `stage / raw reason / normalized class`를 모두 저장한다.

---

## 2. 신규 Snapshot / CSV telemetry

### 2.1 World scope

- `warPipelineIntentCreated33E4A`
- `warPipelineIntentCancelled33E4A`
- `warPipelinePreparationStarted33E4A`
- `warPipelinePreparationCancelled33E4A`
- `warPipelineFinalStarted33E4A`
- `warPipelineFinalCancelled33E4A`
- `warPipelineDeclarationBlocks33E4A`
- `warPipelineDeclarations33E4A`
- `warPipelineObserver33E4A`

### 2.2 Nation scope — 현재 상태

- `warPipelineStage33E4A`
- `warPipelineTarget33E4A`
- `warPipelineIntentId33E4A`
- `warPipelineIntentAgeDays33E4A`
- `warPipelinePreparednessPct33E4A`
- `warPipelineBlocker33E4A`
- `warPipelineWarChest33E4A`
- `warPipelineWarChestGoal33E4A`
- `warPipelineReadyStableDays33E4A`
- `warPipelineCommitmentRemainingDays33E4A`

### 2.3 Nation scope — 누적 흐름

- `warPipelineIntentCreated33E4A`
- `warPipelineIntentCancelled33E4A`
- `warPipelinePreparationStarted33E4A`
- `warPipelinePreparationCancelled33E4A`
- `warPipelineFinalStarted33E4A`
- `warPipelineFinalCancelled33E4A`
- `warPipelineDeclarationBlocks33E4A`
- `warPipelineDeclarations33E4A`
- `warPipelineLastFailureStage33E4A`
- `warPipelineLastFailureReason33E4A`
- `warPipelineLastFailureClass33E4A`
- `warPipelineIntentCancelReasons33E4A`
- `warPipelineFinalCancelReasons33E4A`

사유별 누적은 예를 들어 `SCORE:3|ROUTE:1`처럼 compact string으로 저장한다. 따라서 devlog를 보관하지 못한 100년급 자연주행에서도 전쟁 파이프라인 병목을 역추적할 수 있다.

---

## 3. Culture Stabilization Observation

E4 문화 규칙은 수정하지 않는다.

- 6개 기초문화 유지
- Person `cultureMix` 최대 3성분 유지
- 부모 평균 문화 상속 유지
- 수도 문화 프로필 기준 최대 -8% 생산 마찰 유지
- 문화별 1~5글자 이름풀 유지
- 자동 융합문화 생성 OFF 유지

대신 혼합문화가 얼마나 강하게 섞여 있는지를 Snapshot에서 읽기 위해 Nation telemetry를 추가한다.

- `meanSecondaryCultureShare33E4A`: 혼합 Person에게서 주류문화 이외 성분이 차지하는 평균 비율
- `maxForeignCultureShare33E4A`: 수도 주류문화가 아닌 단일 문화 성분의 관측 최대치
- `capitalVsNationCultureDistance33E4A`: 수도 문화 프로필과 전국 문화 프로필 사이의 total-variation distance

예를 들어 `mixedCultureShare`가 높아도 `meanSecondaryCultureShare`가 낮다면, 많은 Person이 소량의 타문화 흔적만 보존하고 있다는 뜻으로 해석할 수 있다.

---

## 4. Military UI

기존 E3 통합 군사 UI의 소유권과 순서는 그대로 유지한다.

```text
E4A 전쟁 파이프라인 관찰
D2 전략 전쟁 준비
E2 정보·정찰 V2
D 다중전선 지휘 · Formation Command
V0.33 전쟁 상태
```

E4A 카드는 선택 Nation의 현재 pipeline stage, target, Intent/Preparation/Final 누적 시작·취소 수, 실제 선언 수, 마지막 실패 단계와 원문 사유를 표시한다.

C3 standalone operation card와 legacy Formation/Commander card는 다시 활성화하지 않는다.

---

## 5. Regression Scenario 1 — Formation Concentration Rendezvous

파일:

```text
village-observer-v033E4A-scenario-e4a-concentration-rendezvous.json
```

목적은 E3의 실제 Person-backed Formation 집결 경로를 자연전쟁 없이 재현하는 것이다.

fixture는 두 공격 야전 Formation을 인접 타일에 배치하고, 각각 단독 공격은 불리하지만 합산하면 E3 concentration 판단을 통과하도록 전력 조건을 만든다. 방어 Formation은 실제 Person을 사용한다. synthetic soldier는 생성하지 않는다.

기대 흐름:

```text
FORMATION_CONCENTRATION_STARTED33E3
→ FORMATION_RENDEZVOUS_REACHED33E3
→ FORMATION_JOINT_ADVANCE33E3
→ FORMATION_JOINT_ENGAGEMENT33E3
```

성공 기준:

- `concentrationStarts33E3 >= 1`
- `rendezvousReached33E3 >= 1`
- `jointAdvances33E3 >= 1`
- `jointEngagements33E3 >= 1`
- 두 공격 Formation의 `v33dEngagementId`가 동일

회귀 fixture는 일반 시뮬레이션의 정착지 포기 로직 때문에 테스트용 전선 corridor가 사라지지 않도록 **해당 Test Scenario가 활성화된 동안에만** corridor 소유권과 방어 Formation의 대기 위치를 유지한다. 이 보조 장치는 E3 전술 판단식이나 일반 자연주행에는 적용되지 않는다.

내부 회귀 테스트에서는 `start 1 → rendezvous 1 → joint advance 3 → joint engagement 1`을 확인했다.

---

## 6. Regression Scenario 2 — Emergency Defense Bypass

파일:

```text
village-observer-v033E4A-scenario-e4a-concentration-emergency.json
```

먼저 정상적인 concentration group을 생성한 뒤 적 Formation을 공격국 수도 인근에 배치한다. E3의 emergency rule은 수도/core 위협 시 집결 대기를 중단하고 기존 긴급방어 지휘로 복귀해야 한다.

기대 이벤트:

```text
FORMATION_CONCENTRATION_STARTED33E3
→ FORMATION_CONCENTRATION_CANCELLED33E3
   reason = EMERGENCY_DEFENSE
```

성공 기준:

- `concentrationEmergencyBypasses33E3 >= 1`
- `concentrationCancels33E3 >= 1`
- 취소 reason = `EMERGENCY_DEFENSE`

내부 회귀 테스트에서는 `emergencyBypasses 1 / cancellations 1`을 확인했다.

---

## 7. 시나리오 사용법

게임의 기존 **테스트 시나리오 V1** 패널에서 JSON 파일을 불러온다. 두 시나리오는 import 직후 E4A fixture가 자동 적용된다.

1. 원하는 시나리오 JSON을 `시나리오 파일`로 불러온다.
2. 상단 TEST 배지와 시나리오 제목을 확인한다.
3. 일시정지 상태에서 `1일 진행`을 반복하거나 낮은 배속으로 실행한다.
4. 군사 탭의 Formation 상태와 Snapshot/Devlog의 E3 카운터를 확인한다.

시나리오용 fixture는 Test Scenario ID가 `e4a-...`인 경우에만 활성화된다. 일반 새 세계, 일반 세이브, 자연주행에는 적용되지 않는다.

---

## 8. Save / migration / compatibility

- E4A Save version: `0.33E4A`
- localStorage key: `village-observer-v0-33e4a`
- E4/E3/E2F/E2/E1 fallback load 유지
- E4 세이브는 E4A로 migration 시 Culture data를 그대로 보존하고 `v33e4a` observer state만 추가한다.
- E4A `v33e4a`에는 world counter, Nation counter, backfill flag, 활성 fixture metadata가 저장된다.
- E3 `v33e3` Concentration state와 E4 `cultureMix`는 그대로 serialize된다.

전쟁 및 문화 밸런스 로직을 변경하지 않았기 때문에 E4A는 **관찰/검증 Adjustment**로 취급한다.

---

## 9. 구현 회귀 검증

최종 배포본 기준 자동 검증:

- inline `<script>`: **92개 / 92개 Node syntax pass**
- Chromium `page.set_content` fresh-world smoke: page error **0**
- Fresh world 12 simulation-step 진행: 정상
- Save serialize version: **0.33E4A**
- E4-like payload → E4A migration: 성공
- 문화 초기 migration: `LUEN / TER / KAREN / SERIA / MAELA / NOREA` 유지
- Culture registry: **6개**
- Name registry: **가문 103 / 개인명 241**
- Snapshot synthetic pipeline regression: `SCORE:1`, `READINESS:1` reason counter 정상
- CSV validation: **954 columns / schema mismatch 0**
- 군사 UI: E4A observer + D2 + E2 + E3 통합 D + War 순서 확인
- legacy C3 standalone card: 0
- legacy Formation card: 0
- Rendezvous scenario import/runtime: page error 0, joint Engagement 성공
- Emergency scenario import/runtime: page error 0, `EMERGENCY_DEFENSE` bypass 성공

---

## 10. E4A 이후 판단 기준

다음 자연주행에서 실제 선언이 발생하면 E2 정보 오차, D2/D2A 준비, E3 concentration까지 통합 검증한다.

전쟁이 다시 0이어도 이번에는 아래 수치로 원인을 구분할 수 있다.

- 후보 score 자체가 68 아래였는가
- Intent가 생성되었으나 취소되었는가
- Preparation이 시작되었으나 종료되었는가
- Final Commitment가 시작되었으나 readiness/food/finance/formation 등의 이유로 취소되었는가
- Final Commitment는 유지됐지만 Declaration gate에서 반복 차단되었는가

Final Commitment에 구조적인 과잉 병목이 확인될 때만 **V0.33E4B Balance**를 검토한다. 그렇지 않다면 다음 기능 버전은 **V0.33F — War Goal & Peace Settlement V2**로 진행한다.

---

# Appendix A — V0.33E4 Baseline
## Culture & Identity Foundation V1

기준 버전: **V0.33E3 — Formation Concentration + Military UI Consolidation**  
릴리스 성격: **문화·정체성 기반 V1 + 문화 이름풀 개편 + 문화 지도/Telemetry**  
작성일: 2026-10-01

---

## 0. E4 패치 요약

V0.33E4는 향후 **영토 할양·정복 이후 사회·이민·동화·융합문화**를 구현하기 전에 문화의 실체를 먼저 Person 계층에 추가하는 기반 패치다.

핵심 원칙은 다음과 같다.

- **Culture ≠ Nation**: 문화는 국가와 별도 registry entity이며 국가가 사라져도 문화는 존속할 수 있다.
- **Culture는 Person에 귀속**: Settlement/Nation 문화는 별도 가상값이 아니라 실제 거주 Person의 문화를 집계한다.
- **Person은 문화 비율을 가진다**: 한 Person은 최대 3개 문화 성분을 sparse `cultureMix`로 보유할 수 있다.
- **수도 문화가 국가 기준**: 수도 거주민의 실제 문화 프로필을 국가의 기준 문화로 사용한다.
- **문화 차이의 V1 효과는 완만한 경제 마찰**: 수도 문화와의 불일치는 Person 생산 산출에 최대 -8%만 적용한다.
- **문화별 이름 체계**: 가문명/개인명은 문화별 이름풀에서 생성되며 일부 이름은 여러 문화가 공유한다.
- **1~5글자 이름 지원**: 기존 2글자 편중을 완화하기 위해 3~5글자 이름을 대폭 추가했다.
- **융합문화는 schema만 준비**: 자동 생성은 하지 않지만 `derived`, `parentCultureIds`, `originCal`, `nameSourceCultureWeights`를 처음부터 지원한다.
- **E3 Formation Concentration은 그대로 유지**: 이전 평화 자연주행에서 미검증된 집결전술을 E4 자연주행에서 함께 검증한다.

이번 패치는 **War Goal, 영구 영토 이전, 문화 반란, 종교, 언어, 강제동화 정책, 문화별 고유 능력 보너스**를 구현하지 않는다.

---

## 1. 기초문화 6개

E4의 기본 Culture registry는 다음 6개 기초문화를 가진다.

| ID | 문화명 | 신규 월드 초기 Nation ID | 기본 프리셋 국가 | 이름 경향 |
|---|---|---:|---|---|
| `TER` | 테르 | 1 | 델마 | 짧고 단단한 자음형, 2~3글자 중심 |
| `LUEN` | 루엔 | 0 | 키오 | 유음·모음이 많은 부드러운 형태 |
| `SERIA` | 세리아 | 3 | 라엔 | 세/시/엘 계열, 3~5글자 비중 높음 |
| `KAREN` | 카르엔 | 2 | 벨른 | 카/키/브/르 계열, 단단한 형태 |
| `NOREA` | 노레아 | 5 | 에브 | 노/네/메/하 계열, 완만한 형태 |
| `MAELA` | 마엘라 | 4 | 티아 | 아/에/마/엘 계열, 긴 이름 비중 높음 |

이 매핑은 **신규 월드의 초기 프리셋**일 뿐이다.

Culture는 Nation ID나 Nation 이름의 하위 속성이 아니다. 예를 들어 델마가 멸망해도 `TER` 문화는 삭제되지 않으며, 향후 한 Nation 안에 여러 Culture가 존재하거나 같은 Culture를 여러 Nation이 공유할 수 있다.

---

## 2. Culture registry schema

각 Culture entity는 최소 다음 구조를 지원한다.

```text
id
name
color
derived
parentCultureIds[]
originCal
nameSourceCultureWeights
```

E4 기초문화는 모두:

```text
derived = false
parentCultureIds = []
originCal = 0
```

이다.

향후 융합문화가 생성될 경우 예를 들어:

```text
id = "TER_LUEN_01"
derived = true
parentCultureIds = ["TER", "LUEN"]
originCal = <발생 시점>
nameSourceCultureWeights = { TER: 0.55, LUEN: 0.45 }
```

같은 형태를 받을 수 있다.

**E4에서는 이 구조만 준비하고 자동 융합문화 발생 판정은 실행하지 않는다.**

---

## 3. Person `cultureMix`

모든 Person은 `cultureMix`를 가진다.

예:

```text
[{ id: "TER", share: 0.70 },
 { id: "LUEN", share: 0.30 }]
```

### 3.1 저장 원칙

- 0이 아닌 문화 성분만 저장하는 sparse 구조
- Person 1명당 최대 3개 문화 성분
- 합계는 항상 1.0으로 정규화
- 0.5% 미만의 극소 성분은 정리 가능
- UI용 대표문화는 cultureMix 중 가장 높은 share로 계산

`primaryCulture`는 별도 진실값으로 저장하지 않는다. 실제 계산은 항상 `cultureMix`를 사용한다.

Person 약 2,000명 기준에서도 문화 데이터는 수천 개의 작은 `(id, share)` 값만 추가되므로 일일 hot loop에 전체 문화 계산을 넣지 않는 한 부담은 작다.

---

## 4. 출생과 문화 상속

부모의 문화 구성을 평균하여 신생아의 초기 `cultureMix`를 만든다.

예:

```text
아버지 TER 100
어머니 LUEN 100
→ 자녀 TER 50 / LUEN 50
```

```text
아버지 TER 100
어머니 TER 50 / LUEN 50
→ 자녀 TER 75 / LUEN 25
```

부모 중 한 명만 확인 가능한 경우 그 부모의 문화 구성을 그대로 사용한다.

부모 문화 정보가 전혀 없으면 해당 Nation ID의 founding culture 100%를 사용한다.

### 4.1 장기 동화

E4에서는 본격적인 assimilation pulse를 추가하지 않는다.

따라서 문화 변화의 주된 자연 발생 경로는 현재 단계에서:

- 국가간 실제 Person 이주
- 서로 다른 문화 Person 사이의 출생
- 향후 점령/영토 이전 시스템

이다.

장기 거주·교육·행정 중심·혼인·세대교체에 따른 추가 동화는 이후 패치에서 별도로 조정한다.

---

## 5. 국가간 이주와 문화 보존

기존 `World.socialAndMigration()`의 실제 Person 국가간 이주는 그대로 유지한다.

Person이 다른 Nation으로 이동해도:

```text
cultureMix
familyName
givenName
```

은 변경하지 않는다.

즉 예를 들어 테르 100% Person이 식량난을 피해 루엔 중심 국가로 이주하면 그 Person은 **루엔 국가에 거주하는 테르 문화 Person**이 된다.

이 구조가 이후 혼합 Settlement와 혼합 자녀의 기반이 된다.

---

## 6. 수도 문화 프로필

Nation에 고정된 `nationalCultureId`를 두지 않는다.

대신 수도(`coreTileId`)에 실제 거주하는 살아있는 Person들의 cultureMix를 평균하여 **Capital Culture Profile**을 계산한다.

예:

```text
TER   0.68
LUEN  0.24
SERIA 0.08
```

UI에서는:

```text
수도 주류문화: 테르 68%
```

처럼 요약하지만 실제 산출 패널티 계산은 전체 profile을 사용한다.

수도에 일시적으로 주민이 0명이라면 Nation 전체 실제 주민 문화 프로필을 fallback으로 사용한다.

Capital profile은 일일/주민 epoch 기준으로 cache하여 Person 생산 hot path에서 수도 주민 전체를 반복 스캔하지 않는다.

---

## 7. Nation / Settlement 문화 집계

### Nation 문화

Nation의 문화 구성은 해당 Nation에 현재 거주하는 실제 살아있는 Person들의 cultureMix를 평균한다.

### Settlement 문화

Settlement 문화는 해당 `homeTileId`에 거주하는 실제 Person들의 cultureMix를 평균한다.

예:

```text
Settlement #145
LUEN 52%
TER 31%
SERIA 17%
```

Settlement나 Nation에 별도의 고정 문화값을 저장하지 않는다.

따라서 Person이 이동하거나 출생/사망하면 문화 지도와 통계가 실제 인구구성에 따라 자연스럽게 달라진다.

---

## 8. 수도 문화 정렬도

Person 문화와 수도 문화의 정렬은 각 문화별 겹치는 비율의 합으로 계산한다.

개념식:

```text
alignment = Σ min(person[culture], capital[culture])
```

범위는 0~1이다.

예를 들어 수도가 TER 100%라면:

| Person cultureMix | Alignment |
|---|---:|
| TER 100 | 1.00 |
| TER 70 / LUEN 30 | 0.70 |
| TER 30 / LUEN 70 | 0.30 |
| LUEN 100 | 0.00 |

수도가 TER 70 / LUEN 30이고 Person도 TER 70 / LUEN 30이라면 정렬도는 1.00이다.

---

## 9. 문화 산출 패널티 V1

V1 최대 문화 마찰은 **8%**다.

개념식:

```text
outputMultiplier = 1 - 0.08 × (1 - alignment)
```

따라서 수도가 TER 100%일 때:

| Person | 배율 | 패널티 |
|---|---:|---:|
| TER 100 | 1.000 | 0% |
| TER 70 / LUEN 30 | 0.976 | -2.4% |
| TER 30 / LUEN 70 | 0.944 | -5.6% |
| LUEN 100 | 0.920 | -8.0% |

### 9.1 E4에서 적용되는 생산

실제 Person 행동에서 다음 산출에 적용한다.

- 식량 채취/생산
- 목재 채취
- 석재 채취
- Gold 자연 채취
- 철광석 채굴
- 제련소 철 생산
- 대장간 도구 생산

### 9.2 E4에서 적용하지 않는 항목

- 전투력
- Commander 능력
- 건강
- Hunger
- 출산율
- 사망률
- Happiness
- 문화별 기술 보너스
- 일반 건설 노동량
- 시장 가격 자체

즉 이 수치는 문화의 우열을 뜻하지 않고 **수도 중심 언어·행정·제도와의 사회적 마찰**을 표현하는 작은 경제 조정치다.

향후 행정제도·자치·교육 등이 이 마찰을 완화할 수 있도록 확장할 수 있다.

---

## 10. 이름 시스템 V2 — 문화별 이름풀

기존 단일 공용 이름풀을 E4 문화 기반 이름 registry로 교체한다.

현재 registry 규모:

- **가문명 103개**
- **개인명 241개**
- 최대 길이: 가문명 5글자 / 개인명 5글자

문화별로 core 이름군과 shared 이름군을 가지며, 개인명에는 범문화권 common 이름군도 존재한다.

### 10.1 개인명 생성 비율

초기 목표:

```text
문화 core 이름 약 70%
문화간 shared 이름 약 20%
범문화 common 이름 약 10%
```

혼합 Person의 경우 먼저 cultureMix 비율로 이름의 source culture를 선택한 뒤 해당 문화 이름풀에서 개인명을 선택한다.

예:

```text
TER 70 / LUEN 30 Person
→ source culture 선택 확률 TER 70%, LUEN 30%
→ 선택된 source culture의 이름풀 사용
```

### 10.2 가문명 생성

가문명은 개인명보다 문화 지속성이 강하다.

신규 founder/초기 Person처럼 새 가문이 필요한 경우:

```text
문화 core 가문 약 85%
문화간 shared 가문 약 15%
```

을 사용한다.

출생자는 기존 규칙대로 부모의 가문명을 상속하며 cultureMix가 변해도 가문명을 자동 변경하지 않는다.

---

## 11. 이름 길이 다양화

기존 이름 시스템은 대부분 2글자여서 Person 이름의 시각적 패턴이 지나치게 비슷했다.

E4는 가문명·개인명 모두 **1~5글자**를 허용한다.

실제 이름 registry에는 특히 3~5글자 이름을 대폭 추가했다.

예시 유형:

```text
테르: 테린 / 카르온 / 테르하리온
루엔: 루에나 / 라오렌 / 루미에리안
세리아: 시엘라 / 세라니엘 / 아르세리안
카르엔: 카엘라 / 카르베온 / 브렌카리안
노레아: 네리안 / 노레아나 / 네르하리온
마엘라: 에리아나 / 아마리엘 / 마엘라리온
```

가문명도 1~5글자로 다양화되어 기존의 고정적인 `2글자 가문 + 2글자 이름` 패턴이 완화된다.

테스트용 2,400명 이름 생성에서 실제로 1~5글자 모든 길이가 출현했으며, 4~5글자 이름도 충분히 등장했다.

---

## 12. 국가명 가문 예약어

신규 familyName 생성에서 다음 문자열은 사용할 수 없다.

```text
키오
델마
벨른
라엔
티아
에브
```

따라서 신규 E4 세계에서는 `에브 ○○`, `라엔 ○○`, `벨른 ○○` 같은 국가명-가문 혼동이 신규로 발생하지 않는다.

단, E3 이전 세이브에 이미 존재하던 국가명 가문은 소급 변경하지 않는다.

기존 Person 이름과 가문 역사는 보존하며 해당 가문의 자손도 기존 가문명을 정상 상속한다.

---

## 13. Culture Map Layer

지도 레이어에 **문화 지도**를 추가한다.

표현 원칙:

- 거주 Person이 있는 Settlement만 실제 문화색 overlay
- 색상은 해당 Settlement의 dominant culture
- dominant share가 높을수록 문화색이 강함
- 혼합도가 높을수록 색이 흐려짐
- 기존 국가 국경과 기본 지형은 base map에서 유지

기초문화 색은 Culture registry에 저장된다.

문화 지도는 이후 영토 할양이 도입되면 **정치 국경과 문화 경계가 서로 다른 모습**을 직접 관찰하는 용도로 사용한다.

---

## 14. UI

### Nation 사회 / 주민 화면

문화 패널에서 다음을 표시한다.

- 수도 문화 구성
- 전국 문화 구성
- 평균 수도문화 정렬도
- 평균 문화 산출 패널티
- 혼합문화 Person 수/비율

### Person 주민 목록

각 Person에:

```text
문화 TER 70% · LUEN 30%
수도 정렬 70%
```

형식의 정보를 추가한다.

### Settlement 카드

거주민이 있는 Settlement에는 dominant culture와 상위 문화 구성을 표시한다.

### Tile Inspector

선택 타일에 실제 주민이 있으면 타일 문화 프로필을 표시한다.

---

## 15. E3 → E4 migration

E3 저장 데이터에는 cultureMix가 없으므로 E4 load 시 현재 Nation ID의 founding culture 100%를 부여한다.

```text
Nation 0 / 키오 프리셋 → LUEN 100
Nation 1 / 델마 프리셋 → TER 100
Nation 2 / 벨른 프리셋 → KAREN 100
Nation 3 / 라엔 프리셋 → SERIA 100
Nation 4 / 티아 프리셋 → MAELA 100
Nation 5 / 에브 프리셋 → NOREA 100
```

주의:

- 기존 Person 이름은 변경하지 않는다.
- 기존 국가명 가문도 변경하지 않는다.
- 기존 Person/군사/경제/전쟁 상태를 유지한다.
- migration 이후 새로 태어나는 Person부터 E4 문화 상속과 문화 이름 규칙이 적용된다.

신규 E4 save version은 `0.33E4`다.

localStorage key:

```text
village-observer-v0-33e4
```

fallback load 순서에는 E3/E2F/E2/E1/EF/E 저장 키를 유지한다.

---

## 16. Snapshot / CSV Telemetry

### World

추가 필드:

```text
cultureCount33E4
derivedCultureCount33E4
mixedCulturePersons33E4
mixedCultureShare33E4
meanCultureAlignment33E4
cultureOutputPenaltyAvg33E4
cultureMapLayer33E4
cultureNameRegistryFamilies33E4
cultureNameRegistryGiven33E4
```

### Nation

추가 필드:

```text
capitalPrimaryCulture33E4
capitalPrimaryCultureShare33E4
nationPrimaryCulture33E4
nationPrimaryCultureShare33E4
mixedCulturePersons33E4
mixedCultureShare33E4
meanCapitalCultureAlignment33E4
cultureOutputPenaltyAvg33E4
```

문화 전체 분포는 save/UI에서 보존하고 CSV에는 분석에 필요한 요약지표 위주로 기록해 열 폭증을 제한한다.

---

## 17. 평화 세계 진단용 War Intent observer

이전 E3 자연주행은 77년까지 전쟁이 한 번도 발생하지 않았으며 War Intent도 생성되지 않아, 사후 데이터만으로는 각 국가의 최고 공격 후보가 threshold 바로 아래였는지 다른 gate에 막혔는지를 정확히 보기 어려웠다.

E4는 snapshot 시점에만 **observer-only top candidate scan**을 추가한다.

Nation CSV 필드:

```text
warScanTopTarget33E4
warScanTopScore33E4
warScanReason33E4
```

가능한 대표 reason:

```text
YEAR_GATE
TOP_SCORE_BELOW_68
INTENT_ACTIVE
AT_WAR
NO_INTENT_GATE_OR_REVIEW_TIMING
NO_ASSESSMENT
```

이 관측은 E2 `rawAssessment`를 사용한 뒤:

- E2 estimate cache 복원
- `rangeAssessments` counter 복원
- D1 `intelAssessments` counter 복원

을 수행하므로 AI War Intent 결정 상태를 변경하지 않는 snapshot-only 진단이다.

---

## 18. E3 Formation Concentration 유지

E4는 E3의 다음 로직을 변경하지 않는다.

- `CONCENTRATE`
- `RENDEZVOUS`
- `JOINT_ADVANCE`
- 수도 긴급상황 집결 bypass
- Formation 객체 별도 유지
- Commander 별 UI
- 군사 탭 renderer ownership

또한 다음 E3 telemetry를 그대로 유지한다.

```text
activeConcentrationGroups33E3
concentrationStarts33E3
rendezvousReached33E3
jointAdvances33E3
jointEngagements33E3
concentrationCancels33E3
piecemealPrevented33E3
concentrationEmergencyBypasses33E3
```

E3 자연주행이 평화로워 이 값들이 모두 0이었으므로 E4 자연주행에서 전쟁이 발생하면 문화와 함께 재검증한다.

---

## 19. 성능 정책

E4 문화 시스템은 Person daily hot loop에 전체 문화 population scan을 넣지 않는다.

주요 정책:

- Person은 최대 3개 culture component만 보유
- 수도 문화 프로필은 calendar day / resident epoch 기준 cache
- Settlement/Nation 전체 집계는 UI 또는 snapshot 중심
- Culture map은 해당 레이어가 실제 선택됐을 때만 전체 Person을 한 번 집계
- 생산 시 alignment는 cache된 수도 profile과 1~3개 Person component만 비교
- 자동 융합문화 탐색은 없음
- 일일 assimilation scan 없음

따라서 Person 2,000명 목표에서도 문화 비율 자체의 추가 연산비는 제한적이다.

---

## 20. 구현 검증

### 정적 검증

- inline script 수: **91**
- `node --check`: **91 / 91 통과**

### 브라우저 smoke

Headless Chromium에서 확인:

```text
Version badge = V0.33E4
document.title = Village Observer V0.33E4
Culture registry = 6
모든 초기 Person cultureMix 존재 = PASS
신규 국가명 familyName 생성 = 0
Culture map option = PASS
E3 Formation Concentration namespace 유지 = PASS
12일 simulation advance = page error 0
```

### 이름 registry

```text
Family names = 103
Given names = 241
Max family length = 5
Max given length = 5
```

2,400명 임시 생성 smoke에서 1~5글자 이름이 모두 발생했고 예약 국가명 가문은 0건이었다.

### 문화 상속 회귀

```text
TER 100 parent + LUEN 100 parent
→ baby TER 50 / LUEN 50
```

PASS.

### 산출 패널티 회귀

수도 TER 100 기준:

```text
LUEN 100 → multiplier 0.920
TER 70 / LUEN 30 → multiplier 0.976
```

PASS.

### Save / migration

- E4 serialize → `0.33E4`
- E4 round-trip load → cultureMix 유지
- E3 payload에서 cultureMix 제거 후 load → Nation founding culture 100% migration
- CSV schema validation → **919 columns / mismatch 0**

PASS.

---

## 21. E4 자연주행 검증 포인트

다음 자연주행에서는 아래를 중점적으로 본다.

### Culture

- 국가간 실제 Person 이주가 발생하는가
- 이주자의 cultureMix가 그대로 유지되는가
- 혼합문화 Person이 자연적으로 발생하는가
- 부모 평균 상속이 장기간 정상 작동하는가
- 수도 문화와 전국 문화가 실제로 분화되는 국가가 생기는가
- 문화 output penalty 평균이 과도하게 커지지 않는가
- Culture map이 실제 Person 구성과 일치하는가

### Name

- 2글자 편중이 체감상 해소됐는가
- 3~5글자 이름이 자연스럽게 섞이는가
- 문화별 이름 분위기가 구분되면서도 지나치게 기계적이지 않은가
- 공유 이름이 문화간 연속성을 만들어주는가
- 국가명 가문 신규 생성이 0으로 유지되는가

### E3 military

- 전쟁이 발생하면 Concentration 시작 사례가 있는가
- `RENDEZVOUS → JOINT_ADVANCE`가 실제로 이어지는가
- 축차투입을 줄이는가
- 수도 긴급방어를 부당하게 지연시키지 않는가

### Peace-world diagnostics

- 전쟁이 또 없더라도 `warScanTopScore33E4`로 각 Nation의 최고 후보 점수를 확인
- `TOP_SCORE_BELOW_68`과 실제 gate 문제를 구분
- E2 불완전 정보가 War Intent score에 미치는 경향 관찰

---

## 22. E4에서 의도적으로 미구현

다음은 E4 범위 밖이다.

- 자동 융합문화 생성
- 문화 분열/소멸
- 강제동화 정책
- 문화별 군사/경제 고유 보너스
- 문화 반란
- 민족국가 개념
- 종교
- 언어
- 점령지역 자치
- 영구 영토 할양
- War Goal / Peace Settlement V2

이들은 E4 문화 기반을 자연주행으로 검증한 뒤 순차적으로 연결한다.

---

## 23. 이후 로드맵

E4 자연주행이 안정적이면 기본 흐름은 다음과 같다.

### V0.33E4A/B — 필요 시

문화 output penalty, 이름 분포, 문화 UI/지도, 문화 상속에 대한 Adjustment/Balance.

E3 Concentration에서 문제가 재현되면 같은 자연주행 데이터를 근거로 E3 계열 조정도 함께 검토한다.

### V0.33F — War Goal & Peace Settlement V2

- 제한전쟁 / 영토전쟁 목적
- 영구 영토 이전
- 종전 합의
- 일부 점령지 귀속
- 정복된 Settlement의 기존 Person과 cultureMix 보존
- 새 수도 문화와 피정복 지역 문화의 alignment에 따른 실제 사회·경제 마찰

E4 이후에는 영토가 넘어갈 때 단순히 `ownerId`만 바뀌는 것이 아니라, **실제 주민·가문·문화가 존재하는 지역이 다른 정치체제에 편입되는 구조**를 만들 수 있다.

### Scenario import compatibility fix
E5/E5F regression scenario packages use the canonical Test Scenario V1 numeric `version: 1`. The E5 importer normalizes the accidentally emitted legacy string `village-observer-scenario-v1`, and E5F delegates scenario import to that compatibility layer. 따라서 수정된 파일과 이전 E5 시나리오 파일을 모두 불러올 수 있다.
