# Village Observer V0.33E2
## Intelligence Uncertainty & Reconnaissance V2

기준 버전: **V0.33E1 — Era Pace + Formation Command V1**  
릴리스 성격: **전략정보/정찰 계층 확장 패치**  
작성일: 2026-10-01

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
0.33E2
```

localStorage key:

```text
village-observer-v0-33e2
```

fallback:

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

### Browser smoke

초기화 확인:

```text
Title: Village Observer V0.33E2
serialize().version: 0.33E2
TECH_ORDER: 32
techCostTotal: 4815
Knowledge multiplier: 1.00
D1 perfectInformation: false
D2 perfectInformation: false
```

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
save version = 0.33E2
load version = 0.33E2
v33e2 restored = true
```

### E1 migration

0.33E1 형태의 save payload에서:

```text
loaded version = 0.33E2
v33e1 retained = true
v33e2 created = true
tech count = 32
Knowledge multiplier = 1.00
```

확인 완료.

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
