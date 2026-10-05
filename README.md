# Village Observer V0.33G1A

## Formation Write Gate + Recovery Plateau Exit

- 기준선: **V0.33G1**
- 패치 날짜: **2026-10-05**
- 이번 패치의 성격: G1 자연주행 회귀 안정화
- 다음 예정 큰 단계: **AI Profile Editor V1 (G2)**

---

## 1. 패치 배경

V0.33G1은 다음 두 축을 도입했다.

1. Formation control owner 개념
   - WAR_OPERATION
   - POSTWAR_WITHDRAWAL
   - RECOVERY_EMERGENCY
   - WAR_PREPARATION
   - PEACETIME
2. AIProfile JSON v1
   - Custom profile import/export
   - 국가별 profile 적용
   - Custom registry save/load 복원

G1 자연주행 결과, `WAR_PREPARATION_RALLY`와 Recovery의 직접 충돌은 크게 줄었지만 Formation ownership이 아직 **실제 write 권한**이 아니라 **사후 판정 + reconcile**에 가까운 문제가 남았다.

특히 Recovery 중인 국가의 평시 `planFormations32D()`가 `BORDER / RESOURCE / ADMIN / FRONTIER` target을 다시 쓴 뒤, G1 reconcile이 이를 home으로 되돌리는 현상이 확인되었다. 이 구조에서는 `FORMATION_CONTROL_CONFLICT33G1`가 실제 침범을 항상 정확히 포착하지 못하고, `recovery re-home`이 반복될 수 있었다.

또한 장기 Recovery 고착 사례에서 다음 상태가 관찰되었다.

- inactive building share: 사실상 0
- wood: 충분
- 국가 경제/건축/산업 활동 지속
- food reserve days: 대략 35~36일대에서 장기 정체

기존 Recovery의 정상 종료는 `food > 42`를 포함한 strict stable 조건을 3회 연속 만족해야 하므로, 붕괴 상태가 이미 끝난 국가가 식량 42일선을 구조적으로 넘지 못하면 수십 년 동안 Recovery에 남을 수 있었다.

G1A는 이 두 문제만 안정화하며 AIProfile JSON 규격이나 전쟁/경제 공식은 건드리지 않는다.

---

## 2. Formation Write Gate

### 2.1 핵심 변경

G1의 `controlOwner()`를 단순 telemetry 개념이 아니라 실제 Formation target 쓰기 권한으로 승격했다.

각 활성 Formation의 다음 필드를 accessor gate로 보호한다.

- `targetTileId`
- `targetReason`

내부 world/village 참조와 backing value는 non-enumerable property로 보존하여 기존 `serialize()`의 `{...formation}` 결과에 불필요한 참조가 섞이지 않도록 했다.

### 2.2 Owner별 허용 규칙

#### RECOVERY_EMERGENCY

허용:

- `targetTileId == homeTileId` 또는 core fallback
- `targetReason == RECOVERY_EMERGENCY`

차단:

- BORDER
- RESOURCE
- ADMIN
- FRONTIER
- WAR_PREPARATION staging
- 기타 Recovery owner와 충돌하는 평시/준비 writer

따라서 평시 planner가 Recovery 중 BORDER target을 계산하더라도 Formation의 실제 target 값은 바뀌지 않는다.

#### WAR_PREPARATION

허용 target은 해당 Formation에 이미 등록된 준비 목표만 인정한다.

- `v33d2aStagingTileId`
- `v33d2RallyTargetTileId`
- 현재 active preparation의 `rallyTargets[formationId]`

허용 reason:

- `WAR_PREPARATION` 계열

평시 planner가 active preparation 중 BORDER/RESOURCE target을 쓰는 것은 차단된다.

#### WAR_OPERATION / POSTWAR_WITHDRAWAL

기존 전쟁 및 철군 writer를 그대로 허용한다.

이번 패치는 전쟁 작전 target routing을 재설계하지 않는다.

#### PEACETIME

기존 평시 planner 동작을 유지한다.

### 2.3 Terminal preparation cleanup

Preparation의 상태가 이미 다음 중 하나라면 stale intent phase 때문에 Formation이 불필요하게 `WAR_PREPARATION` owner로 잠기는 것을 피하기 위해 G1A gate에서는 실질적으로 PEACETIME으로 취급한다.

- DECLARED
- CANCELLED
- ENDED

이를 통해 `clearRally2()`의 home cleanup이 정상적으로 가능하다.

### 2.4 새 Formation 보호

새 야전 Formation이 `FORMATION_CREATED32D` 이벤트를 발생시키면 이벤트 호출이 반환되기 전에 gate를 설치한다.

따라서 새 Formation이 생성된 바로 그 seasonal tick에서 이어지는 legacy plan/move에도 가능한 한 즉시 write protection이 적용된다.

---

## 3. Recovery Plateau Exit

### 3.1 기존 빠른 종료조건 유지

기존 Recovery 로직은 수정하지 않는다.

기존 stable 조건:

- inactive building share < 20%
- food reserve > 42일
- wood > `max(16, population × 0.4)`
- capacity >= population × 0.85
- 3 stable seasons

이 조건을 만족하면 기존 코드가 그대로 빠르게 Recovery를 종료한다.

### 3.2 장기 고착 전용 보조 종료경로

G1A는 기존 종료를 대체하지 않고, **오래 지속된 Recovery가 명백히 비붕괴 상태로 안정된 경우**에만 별도 plateau exit를 허용한다.

최소 Recovery age:

- **720 calendar days** 이상

plateau eligibility:

- true survival 비활성
- inactive building share < **10%**
- food reserve >= **30일**
- wood >= `max(12, population × 0.25)`
- housing capacity >= population × **0.80**
- average health >= **48**

이 기준은 Recovery 진입 임계값보다 충분히 안전한 방향에 있다. 즉 단순히 시간이 오래 지났다는 이유만으로 Recovery를 해제하지 않는다.

### 3.3 필요한 안정 유지기간

일반 장기 Recovery:

- 360 calendar days 연속 안정

이미 오래 고착된 episode:

- Recovery age >= 1,800일: 180일 연속 안정
- Recovery age >= 3,600일: 90일 연속 안정

오래된 Recovery일수록 **안전 기준은 그대로 유지**하고, 이미 충분히 오래 관찰된 상태라는 점을 반영하여 필요한 연속 안정기간만 줄인다.

### 3.4 Plateau 실패 시

어느 하나라도 기준을 벗어나면 plateau stable counter는 0으로 reset된다.

따라서 식량/주거/건강 등이 다시 악화된 상태에서는 자동 종료되지 않는다.

---

## 4. 새 Telemetry

### Event

`FORMATION_TARGET_WRITE_BLOCKED33G1A`

주요 필드:

- village / villageId
- formationId
- owner
- field (`targetTileId` 또는 `targetReason`)
- requested
- kept
- 현재 targetTileId / targetReason
- recoveryActive
- intentId

`RECOVERY_PLATEAU_EXIT33G1A`

주요 필드:

- recoveryAgeCalendarDays
- stableCalendarDays
- foodReserveDays
- inactiveShare
- wood / woodFloor
- capacity / population
- health

### Snapshot / CSV global columns

- `formationWriteGateSchema33G1A`
- `formationTargetWriteBlocks33G1A`
- `recoveryTargetWriteBlocks33G1A`
- `preparationTargetWriteBlocks33G1A`
- `formationTargetGateInstalls33G1A`
- `recoveryPlateauEvaluations33G1A`
- `recoveryPlateauExits33G1A`
- `recoveryPlateauResets33G1A`

### Snapshot / CSV nation columns

- `formationTargetWriteBlocksNation33G1A`
- `recoveryTargetWriteBlocksNation33G1A`
- `preparationTargetWriteBlocksNation33G1A`
- `recoveryPlateauStableDays33G1A`
- `recoveryAgeDays33G1A`
- `recoveryPlateauEligible33G1A`
- `recoveryPlateauBlockers33G1A`
- `recoveryPlateauExitsNation33G1A`

---

## 5. 저장 호환성

새 버전 문자열:

- `0.33G1A`

새 localStorage key:

- `village-observer-v0-33g1a`

fallback load:

1. `village-observer-v0-33g1`
2. `village-observer-v0-33g`
3. `village-observer-v0-33f5a8`

G1의 `v33g1.customProfiles`는 그대로 유지되며 G1A의 별도 상태는 `v33g1a`에 저장한다.

Formation gate의 world/village 참조와 backing storage는 non-enumerable이므로 Formation save payload에는 기존 public fields만 저장된다.

---

## 6. AIProfile JSON v1 — 변경 없음

G1 규격을 그대로 유지한다.

### Envelope

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "profile": {
    "id": "custom_id",
    "label": "Custom AI",
    "nationName": "Custom",
    "basePreset": "balanced",
    "traits": {},
    "capabilities": {},
    "research": {},
    "construction": {},
    "mods": {}
  }
}
```

### Trait keys

- survival
- expansion
- trade
- urbanization
- resourceAcquisition
- technology
- production
- military
- risk
- fiscalConservatism

범위: 0.25 ~ 2.5

### Semantic capability keys

- survivalPriority
- tradeDiplomacy
- territorialExpansion
- urbanConcentration
- resourceSeeking

범위: 0 ~ 1

### Research keys

- food
- production
- industry
- commerce
- administration
- military
- knowledge

범위: 0.25 ~ 2.5

### Construction keys

- farm
- sawmill
- quarry
- iron
- roads
- commerce
- military
- housing

범위: 0.25 ~ 2.5

### Base action mod keys

- MAINTAIN
- FOOD
- HOUSING
- TRADE
- SECURITY
- EXPAND

범위: -50 ~ 50

기본 preset 7종의 ID는 custom import로 덮어쓸 수 없다.

- survival
- diplomatic
- expansionist
- balanced
- urbanist
- resource_seeker
- technologist

---

## 7. 이번 패치에서 변경하지 않은 것

- AIProfile JSON v1 schema
- 기본 7개 AI profile 밸런스
- AI Editor
- Monetary Anchor
- Gold 집중/회계 구조
- 전투력 공식
- 사상률
- 점령 시간
- 전쟁 목표
- 평화협정
- Gold 배상
- 생산 공식
- Formation 전쟁 작전 routing

---

## 8. 정적/단위 검증

패치 제작 시 다음 검증을 수행했다.

1. 전체 inline JavaScript 구문 검사
   - 117 script block 결합 후 `node --check`
   - syntax error 없음
2. Recovery write gate mock
   - Recovery owner 상태에서 BORDER target write 차단 확인
   - 실제 target은 home 유지
3. Preparation write gate mock
   - 임의 BORDER target 차단
   - 등록된 rally target 허용
   - terminal preparation 이후 home cleanup 허용
4. Recovery plateau mock
   - eligibility를 충분히 오래 유지한 stale Recovery가 정상 종료됨을 확인
5. Formation JSON serialization mock
   - non-enumerable world/village/backing 참조가 JSON에 섞이지 않음

---

## 9. 자연주행 검증 포인트

G1A PC 자연주행에서 우선 확인할 항목은 다음과 같다.

### Formation

정상 기대값:

- `recoveryFormationRehomesNation33G1`가 G1보다 크게 감소
- `FORMATION_TARGET_WRITE_BLOCKED33G1A`는 Recovery/Preparation 중 legacy writer가 시도할 때 발생 가능
- 차단 이벤트 뒤 실제 Formation이 BORDER 쪽으로 이동해서는 안 됨
- Recovery 중 target은 home + `RECOVERY_EMERGENCY` 유지

특히 G1에서 티아처럼 장기 Recovery였던 국가가 있으면 Formation target history를 확인한다.

### Recovery

정상 기대값:

- 정상적으로 식량 42일 이상을 확보하는 국가는 기존 fast exit 사용
- 식량 30~42일대에 장기적으로 안정된 국가는 plateau counter가 누적
- 조건 악화 시 plateau counter reset
- 장기적으로 건강한 국가가 수십 년 Recovery에 고착되는 현상 감소
- 실제 생존위기/시설붕괴 상태에서는 plateau exit가 발생하지 않음

### 핵심 데이터

분석 시 아래 열을 우선 확인한다.

- `recoveryAgeDays33G1A`
- `recoveryPlateauStableDays33G1A`
- `recoveryPlateauEligible33G1A`
- `recoveryPlateauBlockers33G1A`
- `recoveryPlateauExitsNation33G1A`
- `recoveryTargetWriteBlocksNation33G1A`
- `preparationTargetWriteBlocksNation33G1A`
- 기존 `recoveryFormationRehomesNation33G1`
- 기존 `formationControlConflictsNation33G1`

---

## 10. 다음 단계

G1A 자연주행에서 다음 두 조건이 확인되면 Formation/Recovery 안정화는 닫는다.

1. Recovery/Preparation owner를 침범하는 target이 실제 이동으로 이어지지 않음
2. 장기 Recovery가 실제 붕괴가 해소된 뒤 합리적인 시점에 종료됨

그 다음 패치는 예정대로 **V0.33G2 — AI Profile Editor V1**로 진행한다.

G2에서는 본편 AI 코드를 직접 수정하는 에디터가 아니라 `AIProfile JSON v1`을 생성/수정/검증하는 독립형 `ai-editor.html`을 제작한다.
