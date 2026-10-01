# Village Observer V0.33E3
## Formation Concentration + Military UI Consolidation

기준 버전: **V0.33E2F — Intel Renderer Ownership Hotfix**  
릴리스 성격: **작전 집중 V1 + 군사 UI 구조 통합**  
작성일: 2026-10-01

---

## 0. E3 패치 요약

V0.33E2F 자연주행에서 복수 야전 Formation이 같은 전쟁·같은 방향으로 움직이면서도 서로의 도착 시점을 고려하지 않아, **4명 선행대가 먼저 패퇴하고 약 11일 뒤 3명 후속대가 같은 적에게 다시 단독 투입되는 축차투입**이 확인되었다. 이후 두 Formation이 실제로 같은 타일에 도달했을 때 Engagement 전력은 정상적으로 합산되었으므로, 문제는 전투 집계가 아니라 **전투 이전의 작전적 집중 판단 부재**였다.

V0.33E3은 이를 다음처럼 해결한다.

- 같은 전선의 OFFENSIVE Formation 2개가 가까이 있고, 각자 싸우면 위험하지만 합산 추정전력은 충분할 때 `CONCENTRATE / RENDEZVOUS`를 시작한다.
- 선행 Formation은 집결지에서 기다리고 후속 Formation은 해당 타일로 이동한다.
- 두 Formation이 같은 타일에 모이면 다음 이동 가능 시각을 동기화하고 `JOINT_ADVANCE`로 동일 목표를 향해 진입한다.
- Formation 객체는 영구 합병하지 않는다. Person·Commander·사기·전투 이력·Formation ID는 그대로 유지한다.
- 수도 점령/수도 근접 위협 같은 긴급 상황에서는 집결 대기를 취소하고 기존 방어·차단 판단을 우선한다.
- 군사 탭을 **D2 전략 전쟁 준비 → E2 정보·정찰 → D 다중전선 지휘/Formation Command → V0.33 전쟁 상태** 순서로 고정한다.
- 기존 주둔대/야전대 목록과 별도 Formation Command를 `D 다중전선 지휘`에 통합한다.
- C3 작전 판단의 별도 카드만 숨기고 C3의 수도 공격 판단, 우회, 후퇴, Deep Recovery, 전략도로, devlog 로직은 그대로 유지한다.
- 실제 Commander가 있는 야전대 이름 옆에 작은 `★`를 표시한다. 현재는 존재 여부를 뜻하는 1개 별만 사용하지만 UI 구조는 최대 5개까지 확장 가능하다.

이번 패치는 **Intelligence E2 수치, War Intent 개전 문턱, Coalition exhaustion, War Goal/종전 규칙, 기술 32개, Knowledge ×1.00**을 변경하지 않는다.

---

## 1. Formation Concentration V1

### 1.1 적용 대상

집결은 다음 조건을 모두 만족하는 실제 Person-backed 야전 Formation 두 개에 대해서만 검토한다.

- 같은 국가
- 같은 활성 전쟁에 배정됨
- `OFFENSIVE` 임무
- 두 Formation 사이 거리 **2타일 이내**
- 실제 field cohort가 존재하고 병력이 1명 이상
- `RETREATING / REGROUPING / POST_BATTLE_RECOVERY / POSTWAR_WITHDRAWAL / DORMANT`가 아님
- 현재 Engagement 중이 아님
- Deep Recovery 중이 아님
- 이미 다른 E3 concentration group에 속하지 않음

### 1.2 집중 판정

각 Formation의 현재 Person 수, 훈련, 장비, 보급, 사기, Commander 전투 보정을 이용해 자기 전력을 계산하고, 적 전력은 기존 E2 Intelligence 경계를 통과한 D1/D2 proxy를 사용한다.

집결은 다음 의미의 조건을 만족할 때 시작한다.

1. 가장 강한 단일 Formation도 적 추정전력 대비 충분히 우세하지 않다.
2. 두 Formation의 합산전력은 적 추정전력 대비 충분히 우세하다.
3. 합산으로 얻는 전력 이득이 단순한 미세 증가가 아니라 실질적인 집중 효과가 있다.

현재 V1 수치는 다음과 같다.

- 단독 최강 전력 `< 적 × 1.12`
- 합산 전력 `>= 적 × 1.12`
- 합산 전력 `>= 단독 최강 × 1.30`
- Formation 간 거리 `<= 2`

E2F 회귀 기준값 `4.66 + 4.47 vs 5.96, 거리 1`은 **집결 대상**, `7 + 3 vs 5`처럼 이미 한 Formation이 단독으로 충분히 우세한 경우는 **집결 비대상**이다.

### 1.3 GATHER 단계

집결이 시작되면 더 강한 Formation을 선행대 `LEAD`, 다른 Formation을 후속대 `JOIN`으로 둔다.

- LEAD: `CONCENTRATE`
- JOIN: `RENDEZVOUS`
- rendezvous tile: LEAD의 현재 실제 타일
- joint target: 집결 직전 D의 기존 작전 목표 선택 결과를 보존하여 설정
- group timeout: 최대 180 calendar-day

LEAD와 JOIN은 별개의 Formation 객체로 계속 존재한다.

### 1.4 ADVANCE 단계

두 Formation이 같은 타일에 도달하면:

- `FORMATION_RENDEZVOUS_REACHED33E3` 기록
- 양 Formation의 다음 이동 가능 시각을 더 늦은 쪽으로 동기화
- 양측 모두 `JOINT_ADVANCE`
- 동일한 joint target을 향해 이동

같은 적 타일에서 기존 D Engagement가 생성되면 전투 시스템은 원래부터 구현되어 있던 방식대로 두 Formation의 실전 전력을 한 Side에 합산한다. E3은 새로운 가상 병력이나 별도 전투 합산 공식을 만들지 않는다.

### 1.5 긴급 우회

다음 경우 concentration waiting을 취소하고 기존 D/C3 작전판단에 제어를 돌려준다.

- 자국 core가 적에게 점령됨
- Intelligence가 파악한 적 야전 Formation이 수도 2타일 이내에 있음

이때 `concentrationEmergencyBypasses33E3`를 증가시키고 concentration group을 해제한다.

---

## 2. Permanent Merge를 하지 않는 이유

V0.33E3은 `Formation A + Formation B = Formation C` 식의 조직적 영구 합병을 구현하지 않는다.

영구 합병을 하면 Commander 우선권, Formation 역사, 전투사기, 부상/사망, multi-front 재분할, 전후 복귀를 동시에 재정의해야 한다. 현재 단계에서는 **조직은 둘, 작전은 하나**가 적절하다.

따라서 E3의 집중은 일시적 작전 coordination이며, Person 실체 유지 원칙도 그대로 보존한다.

---

## 3. Commander 별 UI

실제 Commander가 유효한 야전 Formation에는 이름 옆에 작은 별을 표시한다.

예시:

```text
★ 에브 제1야전대 · 4명
지휘관 칼 로안 · Command 76
```

현재 `★`는 **Commander 존재 여부**만 뜻하며 Command Score를 별 개수로 환산하지 않는다.

DOM은 다음 확장을 염두에 둔다.

```text
data-stars="1"
data-max-stars="5"
```

후속 Commander 능력/계급 시스템이 생기면 1~5개 별을 같은 UI에서 표현할 수 있다.

---

## 4. 군사 탭 Renderer Consolidation

V0.33E2F까지 군사 탭은 여러 버전 wrapper가 각자 panel을 append/prepend하면서 순서가 렌더 경로에 따라 바뀌는 문제가 남아 있었다.

E3에서는 최신 renderer가 패널 **내용뿐 아니라 배치 순서까지** 최종 소유한다.

고정 순서:

1. `D2 전략 전쟁 준비`
2. `E2 정보·정찰 V2`
3. `D 다중전선 지휘` + Formation Command 통합
4. `V0.33 전쟁 상태`
5. 이후 기존 군사시설/기타 UI

전체 `render()`와 `renderVillageContent()` 어느 쪽으로 갱신되더라도 같은 순서를 다시 보장한다.

### 제거되는 중복 시각 패널

- 구형 V0.32D standalone Formation 목록
- V0.33E1 standalone Formation Command
- 구형 D standalone multi-front panel
- C3 standalone 작전 판단 카드
- 구형 V0.32B cohort/garrison 중복 목록

C3와 이전 군사 시스템의 **simulation / decision / devlog 코드는 제거하지 않는다.** UI 중복만 제거한다.

---

## 5. 통합 D 다중전선 지휘 패널

한 패널에서 다음을 함께 본다.

- 주둔대(Garrison)
- 모든 활성 Field Formation
- 실제 Person 병력
- Commander 이름/Command Score
- Commander `★`
- 현재 좌표/타일 ID
- 목표 좌표/타일 ID
- 배정된 전쟁/전선
- mission
- 보급·사기·훈련·장비 기반 상태
- E3 concentration group
- `CONCENTRATE / RENDEZVOUS / JOINT_ADVANCE`

따라서 사용자는 별도 Formation Command 카드로 내려갈 필요 없이 다중전선 패널 하나에서 현재 군사 배치를 읽을 수 있다.

---

## 6. Intelligence 경계

E3 concentration은 E2의 Fog-of-War를 우회하지 않는다.

적 Formation을 평가할 때 가능한 경우 E2 `v33e2IntelProxy / v33e2EstimatedPower`를 사용한다. 즉 실제 World Truth 병력을 concentration trigger가 몰래 직접 읽어 작전 결정을 내리는 구조를 추가하지 않는다.

Intelligence E2 tuning 자체는 이번 패치에서 변경하지 않는다.

---

## 7. Telemetry / Devlog

신규 이벤트:

- `FORMATION_CONCENTRATION_STARTED33E3`
- `FORMATION_RENDEZVOUS_REACHED33E3`
- `FORMATION_JOINT_ADVANCE33E3`
- `FORMATION_JOINT_ENGAGEMENT33E3`
- `FORMATION_CONCENTRATION_CANCELLED33E3`

Global Snapshot/CSV:

- `activeConcentrationGroups33E3`
- `concentrationStarts33E3`
- `rendezvousReached33E3`
- `jointAdvances33E3`
- `jointEngagements33E3`
- `concentrationCancels33E3`
- `piecemealPrevented33E3`
- `concentrationEmergencyBypasses33E3`
- `militaryUIRenderer33E3`

Nation Snapshot/CSV:

- `activeConcentrationGroups33E3`
- `concentratingFormations33E3`

다음 자연주행에서는 `concentrationStarts → rendezvousReached → jointEngagements` 전환율과 취소 이유를 우선 분석한다.

---

## 8. Save / Migration

- save version: `0.33E3`
- localStorage key: `village-observer-v0-33e3`
- E2F / E2 / E1 / EF / E save fallback 유지
- E2F save에 `v33e3`가 없어도 로드 후 E3 기본 state를 생성
- Formation에 불완전 concentration state가 들어 있으면 attach 시 정리

기술 32개, 기존 E1 Knowledge 생산 배율 `×1.00`, E2 Intelligence state는 그대로 유지한다.

---

## 9. 검증

배포 전 다음 검증을 수행했다.

- inline script **90/90 Node syntax check 통과**
- headless Chromium runtime error **0**
- 반복 `renderVillageContent()` / 전체 `render()` 이후에도 군사 패널 순서 고정 확인
- 최종 DOM 순서:
  - `v33d2-panel`
  - `v33e2-intel-panel`
  - `v33e3-command-panel`
  - `v33-war`
- standalone C3 / old Formation / old Commander panel **0개** 확인
- E2F 회귀 판정 `4.66 + 4.47 vs 5.96, distance=1` → concentration **true**
- 이미 단독 우세한 `7 + 3 vs 5` → concentration **false**
- GATHER target override → `RENDEZVOUS` 확인
- Snapshot CSV **899 columns / schema mismatch 0**
- E2F payload → E3 load/serialize migration 확인
- fresh-world 장기 smoke test에서 simulation 진행 및 E3 state 유지 확인

자연주행에서 실제 concentration 빈도와 작전 효과는 다음 데이터 검증 대상으로 남긴다.

---

## 10. 자연주행 검증 포인트

1. **축차투입 감소**: 10~20일 이내 합류 가능한 Formation들이 따로 공격하는 사례가 줄었는가.
2. **집결 성공률**: `STARTED → RENDEZVOUS_REACHED → JOINT_ENGAGEMENT`가 실제로 연결되는가.
3. **대기 교착**: 서로 기다리기만 하거나 180일 timeout이 반복되지 않는가.
4. **긴급방어 우회**: 수도 위험 상황에서 concentration이 방어를 방해하지 않는가.
5. **Fog-of-War 보존**: concentration 판단이 실제 적 병력을 직접 읽지 않는가.
6. **Commander UI**: Commander가 있는 Formation에만 별이 정확히 나타나는가.
7. **군사 UI 순서**: pause/resume, 전체 render, 부분 render 후에도 D2 → E2 → D → War 순서를 유지하는가.

---

## 11. 의도적으로 미룬 범위

E3에서는 다음을 구현하지 않는다.

- Formation 영구 합병/분할 재편성
- 군단/사단/상급 지휘부
- Commander 2~5성 실제 능력 체계
- Intelligence E2 재밸런싱
- Coalition exhaustion 재설계
- War Goal / 영토 할양 / 배상 / 종전협상

이 항목들은 E3 자연주행 결과를 본 뒤 별도 버전에서 다룬다.

---

# 이전 버전 기술 기록

아래에는 E3의 기반이 된 V0.33E2F/E2 기술 기록을 그대로 보존한다.

## Village Observer V0.33E2F
### Intel Renderer Ownership Hotfix

기준 버전: **V0.33E2 — Intelligence Uncertainty & Reconnaissance V2**  
릴리스 성격: **렌더러 소유권 회귀 핫픽스**  
작성일: 2026-10-01

---

## 0. E2F 핫픽스 요약

V0.33E2 자연주행 중 군사 탭에서 `V0.33E2 정보·정찰 V2 / INTEL V2` 패널이 정상 표시된 뒤, 다음 렌더 주기에 구형 `V0.33E 정보 상황 / INTEL V1` 패널로 다시 덮어써지는 UI 회귀가 확인되었다.

원인은 V0.33E에서 남아 있던 `renderIntelE()`가 E2 이후에도 `renderVillageContent()`와 전체 `render()` 후처리에서 실행되던 것이다. E2 renderer가 먼저 V2 패널을 작성해도 구형 E writer가 같은 DOM 영역을 다시 쓰면서 V1이 최종 화면을 소유할 수 있었다.

E2F에서는 다음과 같이 구조적으로 정리한다.

- `NS.V033E2`가 활성화된 이후 구형 `renderIntelE()`는 즉시 no-op 처리
- 구형 E `renderVillageContent()` 후처리에서 E2 활성 시 V1 writer 호출 금지
- 구형 E 전체 `render()` 후처리에서도 E2 활성 시 V1 writer 호출 금지
- 군사 탭 Intelligence panel의 최종 writer를 E2 `renderIntel()` 하나로 단일화
- D2 STANDBY runtime 문구를 원본부터 `Intelligence E2 추정범위 사용`으로 수정
- D2 active runtime 문구도 `World Truth → Intelligence E2 추정범위 → War Intent → 실제 준비`로 고정

**Intelligence 추정범위, RECON, War Intent/D2 planning, Commander, 기술, 경제, 전투, 점령, War Exhaustion 규칙은 V0.33E2에서 변경하지 않는다.**

---

## 1. 패치 목적

V0.33E는 `World Truth → Intelligence Picture → Strategic Decision` 경계를 도입해 AI가 매 전략 질의마다 상대의 현재 상태를 직접 읽지 않도록 만들었다. 그러나 V0.33E1 자연주행 검증에서 War Intent의 적 야전병력 추정치는 실제값과 거의 항상 같았다. 정보 신뢰도와 정보 나이는 다양했지만, 소규모 Formation의 정수 병력값이 추정과정에서 실제값으로 수렴하여 전략적으로는 사실상 완전정보에 가까운 상태가 남아 있었다.

V0.33E2의 목적은 이 문제를 다음 단계로 해결하는 것이다.

1. 군사정보를 하나의 숫자가 아니라 **중심 추정치 + 하한/상한 범위**로 표현한다.
2. 관측 이후 시간이 지나면 confidence뿐 아니라 **추정 범위 자체가 넓어진다.**
3. 국가 AI의 성향에 따라 같은 정보 범위를 서로 다르게 해석한다.
4. 활성 War Intent가 정보 부족을 감지하면 **능동 RECON**을 시도한다.
5. 개전 순간 공격국이 실제로 알고 있던 정보와 실제 상태를 함께 저장해 전쟁 오판을 사후 분석할 수 있게 한다.
6. UI/telemetry 조회가 정보 갱신을 유발하던 observer effect를 제거한다.
7. 전술 Formation 조회에서도 live enemy cohort membership을 직접 읽는 우회를 차단한다.

E2는 정보의 전략적 효과를 다루며 **정보 신뢰도 자체가 전투 보너스/패널티를 직접 생성하지 않는다.**

---

## 2. E1 기준선 유지

다음 V0.33E1 기준은 그대로 유지된다.

- 기술 트리: **32개**
- 기술 총비용: **4,815 Knowledge**
- Knowledge 생산 배율: **×1.00**
- V0.33E1 Formation Commander V1 유지
- 실제 Person 기반 병력 유지
- 소규모 Formation casualty smoothing/anti-streak 유지
- War History single writer 유지
- `warHistoryLegacyWriterCalls33E1 = 0` 구조 유지
- War Chest 보존회계 유지
- READY hysteresis 유지
- 15~45일 Final Commitment 유지
- 최대 동시전쟁 2개 유지
- Persistent Engagement, retreat, recovery, occupation, War Exhaustion 규칙 유지
- Coalition exhaustion 계산 방식은 이번 버전에서 변경하지 않음
- War Goal / 영토 할양 / 배상은 이번 버전에서 도입하지 않음

---

## 3. Intelligence Picture V2 — 중심값 + 범위

### 3.1 기존 V1

V1은 각 관측마다 대략 다음과 같은 값을 저장했다.

- estimated field manpower
- estimated total military manpower
- estimated eligible population
- estimated readiness
- confidence
- observation source
- observation age

그러나 소규모 병력에서는 중심 추정치가 실제값과 지나치게 자주 일치했다.

### 3.2 V2

E2는 관측 당시의 정보를 다음 구조로 승격한다.

- `fieldCenter`
- `minField`
- `maxField`
- `totalCenter`
- `minTotal`
- `maxTotal`
- `eligibleCenter`
- `minEligible`
- `maxEligible`
- `readinessCenter`
- `minReadiness`
- `maxReadiness`

예시:

```text
적 야전병력 중심 2명
추정 범위 0~4명
군사정보 신뢰도 43%
관측 210일 전
```

AI는 더 이상 단순히 `2명` 하나만 전략 계산에 사용하지 않는다.

---

## 4. 소규모 군사정보 오차

E1에서 가장 큰 문제는 실제 야전군이 0~4명일 때 정수 반올림으로 추정값이 실제값에 수렴했다는 점이었다.

E2는 작은 값에서도 source와 confidence에 따라 ±1 이상의 오판 가능성을 유지한다.

- 낮은 신뢰도의 0명은 1명으로 잘못 추정할 수 있다.
- 실제 2명을 1명 또는 3명 이상으로 추정할 수 있다.
- 높은 신뢰도의 전투접촉은 여전히 비교적 정확하다.
- 낮은 신뢰도의 교역/접촉정보는 더 넓은 범위를 가진다.

추정오차는 deterministic hash 기반으로 생성된다. 따라서 같은 관측 하나를 UI에서 여러 번 읽는다고 값이 계속 다시 굴러가지 않는다.

---

## 5. 정보 노후화

관측 뒤 시간이 지나도 중심값은 자동으로 현재 World Truth로 따라가지 않는다.

대신 다음이 발생한다.

1. 군사 confidence 감소
2. 위치 confidence 감소
3. 경제/물류 confidence 감소
4. 야전병력 범위 확대
5. 총병력 범위 확대
6. 동원가능 인구 범위 확대
7. Readiness 범위 확대

따라서 같은 관측값이라도 시간이 지나면:

```text
관측 직후: 2~3명
180일 후: 1~4명
360일 후: 0~5명
```

처럼 전략적 불확실성이 커질 수 있다.

정확한 확대폭은 source/confidence/기존 추정치와 정보 나이에 따라 달라진다.

---

## 6. 관측원별 정밀도

기존 E source 체계를 유지하면서 E2 추정오차 모델을 추가한다.

### BATTLE_CONTACT

- 가장 정확한 군사/위치 정보
- 현재 교전한 Formation에 강함
- 국가 전체 경제정보에는 제한적

### WAR_CONTACT

- 전쟁 중 비교적 높은 군사/위치 신뢰도
- 실제 전선 정보에는 강하지만 완전정보는 아님

### BORDER_PATROL

- 국경 인접 군사·Formation 위치에 중상 수준
- 경제정보에는 약함

### TRADE_NETWORK

- 경제/물류에는 강함
- 야전군 숫자와 위치에는 약함

### CONTACT_REPORT / PUBLIC_ESTIMATE

- 전략적 존재와 대략적인 규모는 알 수 있으나 군사 숫자의 오차와 범위가 큼

---

## 7. 성향별 Risk-Weighted Planning

같은 Intelligence Picture를 모든 AI가 같은 방법으로 해석하지 않는다.

E2는 추정 범위에서 `planning value`를 만든다.

기본 위험가중치는 다음과 같다.

- survival: 상단 방향 **85%**
- diplomatic: **75%**
- balanced: **60%**
- resource_seeker: **48%**
- expansionist: **35%**

예를 들어 적 야전병력이 `1~5명`, 중심값이 2명이라면:

- 생존안정형은 5명에 가까운 값을 준비 기준으로 사용한다.
- 균형형은 중상단 값을 사용한다.
- 영토확장형은 중심값에 더 가까운 값을 사용한다.

이는 전투 보너스가 아니다.

같은 불확실성을 두고 **얼마나 보수적으로 준비할 것인가**만 다르다.

---

## 8. D1 War Intent 연결

V0.33D1 War Intent의 전력비 계산은 E2의 `powerPlanning`을 사용한다.

따라서 공격국은 다음을 현재 실제값으로 직접 읽지 않는다.

- 현재 적 field manpower
- 현재 적 total military manpower
- 현재 적 eligible population
- 현재 적 readiness

대신 E2 추정범위에서 성향별 risk-weighted planning 값을 계산해 공격 점수와 estimatedAdvantage에 사용한다.

정보 범위가 지나치게 넓거나 confidence가 극단적으로 낮은 경우에는 uncertainty penalty도 전략평가에 반영된다.

---

## 9. D2 전쟁준비 연결

D2의 다음 목표가 E2 planning 값을 사용하도록 변경했다.

### enemyEligible

기존 E1:

```text
estimated eligible 중심값
```

E2:

```text
eligiblePlanning
```

### enemyPotential

E2의 `totalPlanning` 및 `eligiblePlanning` 기반.

### fieldGoal

E2의 `fieldPlanning` 기반.

따라서 정보가 불확실한 국가가 무조건 실제 적 병력에 딱 맞는 동원량을 계산하지 않는다.

보수적인 국가는 과잉 준비할 수 있고, 공격적인 국가는 실제보다 적게 준비할 수 있다.

---

## 10. Active Reconnaissance V1

### 10.1 발동 조건

활성 War Intent가 있을 때 다음 중 하나면 능동 정찰을 검토한다.

- 군사 confidence < 55%
- 마지막 정보가 150일 이상 경과
- 야전병력 추정 범위 폭이 3명 이상

검토 cadence는 기본 **90 calendar days**이다.

### 10.2 정찰 경로

#### BORDER_RECON

상대와 직접 국경을 접하는 경우.

- military confidence 약 82%
- position confidence 약 90%

#### WATCHTOWER_RECON

직접국경이 아니더라도 WATCHTOWERS 기술과 기존 접촉망이 있을 경우.

- military confidence 약 72%
- position confidence 약 78%

#### NETWORK_RECON

고급 접촉망 또는 실질적인 교역관계가 있을 경우.

- military confidence 약 58%
- 경제정보는 다른 정찰보다 상대적으로 강함

### 10.3 접근 실패

유효한 정찰 경로가 없으면:

```text
RECON_MISSION33E2
result = FAILED
reason = NO_RECON_ACCESS
```

만 남기고 정보를 자동 생성하지 않는다.

### 10.4 Person 정책

E2 RECON은 아직 별도 Spy/Scout Person을 만들지 않는다.

기존 국경망·파수망·교역/접촉 네트워크를 이용하는 저빈도 국가 행동이다.

이는 후속 정보전 버전에서 실제 정찰 Person/조직을 도입할 수 있는 기반이다.

---

## 11. 너무 불확실한 War Intent

정보가 극단적으로 불확실한 경우:

- 군사 confidence < 30%
- 또는 야전병력 범위 폭 >= 6

그리고 War Intent 생성 후 360일 이내라면 초기 ASSESSING 단계에서 바로 전쟁 준비로 넘어가지 않고 `RECON_REQUIRED` 상태를 유지할 수 있다.

정찰 접근 자체가 없는 국가가 영원히 멈추는 것을 방지하기 위해 360일 이후에는 불확실한 정보 자체를 위험으로 받아들이고 기존 전략판단을 계속할 수 있다.

---

## 12. Declaration Intelligence Snapshot

AI가 실제 선전포고에 성공하면 그 순간 공격국이 보유한 Intelligence Picture를 전쟁 객체에 저장한다.

저장 필드 예시:

- source
- intel age
- military confidence
- risk weight
- field center
- field min/max
- field planning
- actual field — debug only
- eligible center/min/max
- eligible planning
- actual eligible — debug only
- field error
- planning field error
- range contains actual 여부

이 정보는 다음 이벤트에도 남는다.

```text
DECLARATION_INTEL_SNAPSHOT33E2
```

목적은 전쟁이 끝난 뒤 다음 질문에 답하기 위한 것이다.

```text
이 국가는 실제보다 적을 얼마나 과소/과대평가했는가?
그 오판을 포함한 상태에서 왜 전쟁을 시작했는가?
그 전쟁은 결과적으로 성공했는가?
```

`actual` 값은 사후 분석용 telemetry이며 AI 전략판단에는 입력되지 않는다.

---

## 13. Observer Effect 제거

V0.33E 코드에는 다음 두 경로가 정보 query를 하면서 관측주기가 도래한 경우 observation refresh를 발생시킬 가능성이 있었다.

- 군사정보 UI 렌더링
- telemetry snapshot diagnostic

E2에서는 이 경로를 read-only로 변경했다.

따라서:

- 군사 탭 열기
- 통계 탭 열기
- UI render
- CSV snapshot
- devlog snapshot

자체가 세계의 Intelligence 상태를 변경하지 않는다.

정보 갱신은 실제 simulation observation cadence 또는 RECON을 통해서만 발생한다.

---

## 14. Tactical Intelligence Boundary 강화

E1까지는 Formation 위치는 last-seen을 사용했지만, 일부 전술 전력 계산에서 proxy Formation의 cohort id를 통해 현재 살아 있는 적 Person 수를 다시 읽을 수 있는 우회가 남아 있었다.

E2는 적 Formation 조회를 `v33e2IntelProxy`로 변환한다.

전술 AI는 이 proxy에서:

- last-seen tile
- estimated manpower
- risk-weighted manpower
- estimated combat power

를 사용한다.

`fieldPowerD()`는 E2 proxy에 대해서는 current enemy cohort roster를 다시 계산하지 않는다.

따라서 전략정보 경계가 전술 assignment/INTERCEPT/SCREEN 판단에도 한 단계 더 일관되게 적용된다.

---

## 15. UI

군사 탭 Intelligence panel은 다음 형식으로 표시한다.

```text
적 야전 중심 2
범위 0~4
전략 판단값 3
군사 신뢰 52%
180일 전
BORDER_PATROL
RECON SUCCESS / FAILED / 대기
```

UI 조회 자체는 정보갱신을 일으키지 않는다.

D2 패널의 기존 `Intel 100%` 표현도 제거하고 E2 추정범위 모델로 교체했다.

---

## 16. CSV Telemetry 추가

### World/global

- `intelMeanFieldRangeWidth33E2`
- `reconAttempts33E2`
- `reconSuccesses33E2`
- `reconFailures33E2`
- `declarationIntelSnapshots33E2`
- `declarationRangeMisses33E2`
- `declarationMeanAbsFieldError33E2`
- `materialFieldMisreads33E2`
- `observerEffectQueriesBlocked33E2`

`materialFieldMisreads33E2`는 개전 중심 추정치가 실제 야전병력과 2명 이상 차이난 개전의 누적 건수이다.

### Nation/current War Intent

- `warIntentFieldCenter33E2`
- `warIntentFieldMin33E2`
- `warIntentFieldMax33E2`
- `warIntentFieldPlanning33E2`
- `warIntentActualField33E2`
- `warIntentFieldError33E2`
- `warIntentFieldRangeContainsActual33E2`
- `warIntentRiskWeight33E2`
- `warIntentIntelAgeDays33E2`
- `warIntentIntelSource33E2`
- `warIntentIntelConfidence33E2`

actual 계열은 debug/observer telemetry일 뿐 AI 입력이 아니다.

---

## 17. Save / Migration

세이브 버전:

```text
0.33E2F
```

localStorage key:

```text
village-observer-v0-33e2f
```

fallback:

- 0.33E2
- 0.33E1
- 0.33EF
- 0.33E
- 0.33D2A

E1 세이브를 불러오면:

1. E1의 32-tech/Commander 상태를 그대로 복원
2. 기존 E Intelligence record 유지
3. 기존 observation-time truth/debug 데이터를 기준으로 E2 estimate cache 생성
4. 현재 정보를 즉시 최신 truth로 덮어쓰지 않음
5. 이후 passive observation 또는 RECON 시 E2 observation으로 갱신

---

## 18. 이번 버전에서 의도적으로 하지 않은 것

E2는 다음을 포함하지 않는다.

- Spy Person
- 정찰 전담 직업
- 첩보기관
- 정보 조작 / 허위정보
- 기만작전
- player-facing map Fog of War
- 알려지지 않은 영토/국경 자체의 은폐
- 직접적인 정보 우위 전투력 버프
- Coalition exhaustion 재설계
- 전쟁목표 / 영토 할양 / 배상
- 전쟁 gate 35년 변경

---

## 19. 구현 검증

### 정적 검사

- inline `<script>`: **89개**
- `node --check`: **89/89 통과**
- syntax failure: **0**

### E2F renderer ownership regression 검사

정적/구조 검사에서 다음을 확인했다.

```text
legacy renderIntelE: E2 활성 시 즉시 return
legacy E renderVillageContent: E2 활성 시 renderIntelE 호출 안 함
legacy E render: E2 활성 시 renderIntelE 호출 안 함
D2 STANDBY runtime text: Intelligence E2 추정범위 사용
D2 active runtime text: Intelligence E2 추정범위 기반
version badge/title: V0.33E2F
```

E2의 시뮬레이션 로직은 변경하지 않았으므로 기존 E2 range/recon/D2 integration 검증 기준을 그대로 유지한다.

### Intelligence range

테스트 observation 예시:

```text
center 1
range 0~4
planning 4
confidence 40%
source CONTACT_REPORT
```

이는 smoke seed의 예시이며 고정 밸런스값이 아니다.

### Observer-effect regression

동일 관측에 대해:

```text
observedCal before UI render/snapshot = 1
observedCal after UI render/snapshot  = 1
```

즉 UI/telemetry read가 observation을 갱신하지 않음을 확인했다.

### Active RECON

synthetic test contact 환경에서:

```text
attempted = true
success = true
source = NETWORK_RECON
```

### D2 integration

테스트에서:

```text
E2 eligiblePlanning = 16
D2 goals.enemyEligible = 16
```

으로 동일함을 확인했다.

### Declaration snapshot

테스트 war object에 개전 Intelligence snapshot 저장 및 rangeContainsActual 계산을 확인했다.

### CSV

- schema validator: **OK**
- 테스트 기준 총 column: **888**
- E2 global/nation columns 존재 확인

### Save / Load

```text
save version = 0.33E2F
load version = 0.33E2F
v33e2 restored = true
```

### E1 migration

0.33E1 형태의 save payload에서:

```text
loaded version = 0.33E2F
v33e1 retained = true
v33e2 created = true
tech count = 32
Knowledge multiplier = 1.00
```

확인 완료.

### E2 migration

0.33E2 save payload는 E2F에서 직접 로드되며 `v33e2` 추정치·RECON 상태·개전 정보 snapshot을 그대로 유지한다. E2F는 UI ownership hotfix이므로 Intelligence state migration이나 재계산을 수행하지 않는다.

---

## 20. 자연주행 검증 포인트

E2 자연주행에서는 전쟁 수 자체보다 아래 항목이 중요하다.

### A. 정보가 실제로 틀리는가

- `warIntentFieldError33E2`
- `declarationMeanAbsFieldError33E2`
- `materialFieldMisreads33E2`

E1처럼 거의 모든 추정이 정확하면 E2 tuning이 부족한 것이다.

### B. 범위가 의미 있게 존재하는가

- `intelMeanFieldRangeWidth33E2`
- `warIntentFieldMin33E2`
- `warIntentFieldMax33E2`

### C. 실제값이 범위 안에 얼마나 들어오는가

- `warIntentFieldRangeContainsActual33E2`
- `declarationRangeMisses33E2`

범위가 무조건 actual을 포함하면 너무 안전한 정보시스템이고, 지나치게 자주 벗어나면 신뢰할 수 없는 정보시스템이다.

### D. RECON이 의미 있는가

- attempts
- successes
- failures
- source
- RECON 전후 confidence/range 변화

### E. 오판이 전쟁을 바꾸는가

각 `DECLARATION_INTEL_SNAPSHOT33E2`와 해당 `WAR_ENDED33`를 연결해 다음을 본다.

- 과소평가 후 패전
- 과대평가 때문에 지나친 준비
- 공격적인 AI의 위험감수
- 보수적인 AI의 과잉동원

이 단계가 확인되면 E2의 목적은 달성된 것이다.

---

## 21. 다음 단계 후보

E2 자연주행이 안정적이면 다음 후보는 별도로 결정한다.

### V0.33E2A 후보

- Coalition exhaustion 재설계
- 늦은 참전국의 낮은 피로도가 coalition 평균을 과도하게 희석하는 문제 보정

### V0.33F 후보

- War Goal V2
- 제한전쟁 / 영토전쟁
- 종전 협상
- 일부 영토 이전
- 배상 또는 완충지대

E2에서는 이 두 영역을 의도적으로 변경하지 않아 정보시스템 변화의 효과를 독립적으로 검증한다.
