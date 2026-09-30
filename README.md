# Village Observer V0.33E

## Intelligence & Reconnaissance V1

기준 버전: **V0.33D2A — War Finance + Preparation Stabilization**  
패치 일자: **2026-09-30**

V0.33E는 V0.33D 계열에서 완성한 다중전선·War Intent·실전 준비·War Chest 위에 **불완전 정보 체계**를 올리는 첫 버전이다. 핵심 목표는 AI가 전략 판단을 할 때 상대 국가의 현재 World Truth를 매번 직접 읽는 구조를 끝내고, 관측 당시 얻은 정보와 시간이 지난 뒤의 불확실성을 통해 전쟁을 판단하도록 만드는 것이다.

동시에 V0.33D2A 장기주행에서 확인된 두 가지 후속 문제도 정리한다.

- 전쟁 기록 패널이 실제 `sideAIds / sideBIds / winnerSide` 데이터를 가지고 있으면서도 D1B 형식으로 다시 렌더링되어 A/B 국가 구성이 명확히 보이지 않던 문제
- PREPARING 상태에서 실제 rally target이 존재하지만 일부 Formation lock이 누락될 가능성

---

## 1. 버전 범위

### 새로 구현된 범위

1. Observation → Intelligence Picture → Strategic Decision 구조
2. 정보원별 신뢰도와 갱신주기
3. 군사·위치·경제·물류 정보의 시간 노후화
4. 적 야전병력·동원 가능 인구·Readiness 추정오차
5. Formation last-seen 위치 정보
6. D1 War Intent의 불완전 정보 연결
7. D2 동원잠재력의 완전정보 우회 제거
8. 국가 군사 탭 Intelligence UI
9. V0.33E 단일 War History 최종 렌더러
10. D2A Formation preparation-lock 보수적 복구
11. CSV 기반 정보 정확도/노후화 검증 필드

### 이번 버전에서 변경하지 않는 범위

- 최대 동시전쟁 수: 2
- Engagement 전투 구조
- Person 기반 실제 사상자
- 전투력·사상자 기본 공식
- 점령·해방·War Exhaustion·평화 공식
- War Chest 보존 회계
- READY hysteresis
- 15~45 calendar-day Final Commitment
- D1C Recovery Escape
- 고대 주거 수용량 3 / 5 / 8
- 단일 도로 이동계수 ×0.62
- 유지보수 노동 분기 0.5%
- 40개 기술 총비용 6,315 Knowledge

---

## 2. Intelligence V1 구조

V0.33E의 전략 정보 흐름은 다음과 같다.

`World Truth → Observation → Intelligence Record → 시간 노후화 → Intelligence Picture → War Intent / D2 Preparation`

D1까지의 Intelligence API는 구조만 존재했고 모든 범주가 `confidence = 1.0`이었다. 따라서 API를 통과하더라도 실제로는 상대의 현재 병력·위치·경제를 매번 정확히 읽는 완전정보 모델이었다.

V0.33E부터는 국가 A가 국가 B를 볼 때 `A:B` 방향의 별도 정보 레코드를 가진다. B가 A를 보는 정보와는 독립적이다.

정보 레코드의 주요 범주는 다음과 같다.

- `military`: 야전병력, 주둔병, 총병력, 동원 가능 인구, Readiness, 추정 전력
- `position`: 관측한 Formation의 last-seen 위치
- `economy`: 인구, 식량 비축일, Gold
- `diplomacy`: 해당 국가가 가지고 있는 상대 관계값
- `logistics`: 영토 규모 등 전략 물류에 필요한 기초 정보

각 레코드는 다음 메타데이터를 가진다.

- 관측 시점 `observedCal`
- 정보원 `source`
- 범주별 최초 신뢰도 `baseConfidence`
- 정보원별 재관측 주기
- 현재 시점에서 계산한 노후화된 신뢰도

---

## 3. 정보원과 기본 신뢰도

정보원은 현재 상황에 따라 자동 결정된다.

### BATTLE_CONTACT

실제 적대 Formation이 같은 타일에서 접촉한 경우.

- 군사 약 98%
- 위치 약 99%
- 경제 약 55%
- 물류 약 72%
- 갱신 간격 약 12 calendar-day

가장 강한 직접 관측이다.

### WAR_CONTACT

동일 전쟁의 적대국이지만 현재 같은 타일에서 직접 교전 중은 아닌 경우.

- 군사 약 90%
- 위치 약 92%
- 경제 약 48%
- 물류 약 70%
- 갱신 간격 약 30 calendar-day

전쟁 중에도 매 순간 상대의 현재 World Truth를 읽지는 않는다.

### BORDER_PATROL

두 국가의 영토가 직접 접하는 경우.

- 군사 약 70%
- 위치 약 78%
- 경제 약 38%
- 물류 약 58%
- 갱신 간격 약 60 calendar-day

### TRADE_NETWORK

최근 교역 관계를 통해 상대 상황을 파악하는 경우.

- 군사 약 46%
- 위치 약 24%
- 경제 약 84%
- 물류 약 78%
- 갱신 간격 약 90 calendar-day

교역은 병력 위치보다 경제·물류 파악에 강하다.

### CONTACT_REPORT

Contact Network가 존재하지만 국경·전쟁·최근 교역 같은 직접 정보원이 없는 경우.

- 군사 약 34~40%
- 위치 약 16~20%
- 경제 약 42~50%
- 물류 약 40~48%
- 갱신 간격 약 150~210 calendar-day

### PUBLIC_ESTIMATE

위 정보원이 없는 최소 공개 추정 상태.

- 군사 약 24%
- 위치 약 8%
- 경제 약 32%
- 물류 약 30%
- 갱신 간격 약 360 calendar-day

일반적인 passive scan에서는 불필요한 모든 PUBLIC_ESTIMATE 쌍을 매번 생성하지 않는다. 실제 전략질의가 있거나 기존 정보가 있을 때만 사용한다.

---

## 4. 정보 노후화

관측값은 관측 순간의 추정치로 저장된다. 이후 대상국의 World Truth가 변해도 자동으로 따라가지 않는다.

현재 범주별 노후화 시간상수는 대략 다음과 같다.

- 위치: 270 calendar-day
- 군사: 720 calendar-day
- 경제: 900 calendar-day
- 물류: 1,080 calendar-day
- 외교: 1,440 calendar-day

위치는 가장 빨리 낡고, 경제·물류는 상대적으로 오래 유지된다.

현재 신뢰도는 기본 신뢰도에 시간 감쇠를 적용해 계산한다. 따라서 같은 관측 레코드라도 시간이 지나면 `HIGH → MEDIUM → LOW` 수준으로 자연스럽게 내려간다.

---

## 5. 추정오차

관측 시점의 실제 값을 그대로 저장하지 않는다.

군사·경제 수치는 정보원 신뢰도가 낮을수록 더 넓은 오차를 가진 추정값으로 변환된다. 같은 관측 레코드는 저장 후 안정적으로 유지되며, 매 UI 렌더나 매 AI 쿼리마다 랜덤하게 출렁이지 않는다.

예시:

- 실제 야전병력 8명
- 낮은 신뢰도의 Contact Report
- AI가 가진 정보: 약 6명, 추정범위 4~8명

다음 관측 때 새로운 상황과 정보원에 따라 추정치가 다시 갱신된다.

이 정보오차는 **직접적인 전투력 보너스/패널티가 아니다.** 전투 계산은 계속 실제 Person과 실제 장비·Readiness를 사용한다. 정보는 어디까지나 전략적 의사결정 입력에만 영향을 준다.

---

## 6. Formation 위치 정보

Formation 위치는 관측 당시의 실제 타일을 `last-seen` 형태로 저장한다.

낮은 위치 신뢰도에서는 상대의 모든 Formation을 관측하지 못할 수 있다. 이후 Formation이 이동해도 재관측 전까지 저장된 위치는 자동 갱신되지 않는다.

따라서 V0.33E부터는 다음 상황이 가능하다.

- 적군이 이미 이동했지만 구 위치를 향해 방어계획을 세움
- 일부 적 Formation을 보지 못함
- 국경접촉이나 전투 후 갑자기 위치정보가 크게 갱신됨

V1에서는 가짜 Formation이나 허위 위치를 생성하지 않는다. 잘못된 정보는 주로 **노후화와 미관측**에서 나온다.

---

## 7. War Intent 연결

D1의 War Intent 단계는 유지된다.

`ASSESSING → PREPARING → READY → DECLARED / CANCELLED`

하지만 다음 상대국 정보는 이제 V0.33E Intelligence Picture를 사용한다.

- 상대 야전병력
- 상대 총병력
- 상대 동원가능 인구 추정
- 상대 Readiness
- 추정 상대 전력

공격국 자신의 병력·식량·Readiness는 자국 정보이므로 실제값을 사용한다.

War Intent의 `estimatedAdvantage`는 이제

`자국 실제 전력 / 상대 추정 전력`

개념이 된다.

따라서 상대를 과소평가하거나 과대평가할 수 있다.

---

## 8. D2 Preparation 연결

V0.33D2에는 상대 동원잠재력을 계산할 때 `target.residents`에서 적격 Person을 직접 세는 완전정보 우회가 남아 있었다.

V0.33E에서는 `goals2()`가 Intelligence Picture의 `military.eligible` 추정치를 우선 사용하도록 수정했다.

따라서 다음 D2 목표가 불완전 정보의 영향을 받을 수 있다.

- `enemyPotential`
- `fieldGoal`
- `requiredActive`
- `activeGoal`
- `advantageGoal` 충족 여부

War Chest·식량·자국 Readiness 등의 물리적 준비 자체는 여전히 실제 자원을 사용한다.

---

## 9. 정보 UI

국가 → 군사 탭 상단에 **V0.33E 정보 상황** 패널을 추가했다.

각 상대국마다 다음을 확인할 수 있다.

- 상대국 이름
- 추정 야전병력
- 추정 병력 범위
- 현재 군사 신뢰도
- 마지막 관측 후 경과 calendar-day
- 정보원
- FRESH / STALE 상태

현재 War Intent 대상은 목록 상단에 우선 배치된다.

활성 War Intent가 있을 경우 다음도 같이 표시한다.

- 현재 phase
- 평가 score
- 추정 전력비
- 정보 신뢰도
- 정보 age
- 정보 source
- 작전 접근상태

관찰자인 플레이어의 세계지도 자체에는 Fog of War를 적용하지 않는다. **AI가 무엇을 알고 있는지**를 별도 UI로 보여주는 구조다.

---

## 10. War History 렌더링 안정화

D1B와 D1C에 전쟁 기록 렌더러가 누적되어 있었고, V0.33D2A 장기주행 화면에서는 실제로 D1B 형식이 최종 표시되는 회귀가 확인됐다.

V0.33E는 통계 전쟁 기록 패널의 최종 렌더를 다시 소유한다.

전쟁 제목:

`A측 · 티아 ↔ B측 · 벨른 + 델마`

결과:

`티아 승리 (A측)`

양측 수치:

- `전사 A 4 / B 2`
- `부상 A 6 / B 4`
- `누적 점령 A 12 / B 0`
- `최대 동시 점령 A n / B n`
- `참전국 A 1 / B 2`

즉 `/` 왼쪽과 오른쪽이 어느 Side인지 더 이상 암묵적으로 해석할 필요가 없다.

패널 DOM에는 `data-owner="V0.33E"`가 설정된다.

---

## 11. Formation preparation-lock 안정화

D2A 장기주행 CSV에서 PREPARING인데 `preparationLockedFormations33D2A = 0`인 일부 시점이 관측됐다.

모든 0이 오류는 아니다. 특히 두 번째 동시전쟁 준비는 D2 설계상 기존 전쟁 Formation을 다시 사전집결시키지 않기 때문에 rally goal이 0일 수 있다.

V0.33E의 복구 규칙은 다음 경우에만 작동한다.

1. Intent가 PREPARING 또는 READY
2. 첫 번째 전쟁 준비 상태
3. 해당 preparation에 실제 `rallyTargets`가 존재
4. 대상 Formation에 실제 manpower가 존재
5. D2A preparation lock이 빠졌거나 다른 intent를 가리킴

이 경우에만 lock을 재설정한다.

복구 이벤트:

`WAR_PREPARATION_LOCK_REPAIRED33E`

CSV 누적값:

`preparationLockRepairs33E`

---

## 12. Telemetry 정책

V0.33E에서는 JSON 크기 폭증을 피하기 위해 Intelligence query를 매번 이벤트화하지 않는다.

`INTEL_OBSERVATION33E`은 주로 다음 경우에만 기록된다.

- 최초 관측
- 정보원 변경
- 신뢰도 등급 변경
- 추정 야전병력이 크게 변함
- War Intent 관련 중요 관측

Routine query는 기록하지 않는다.

### World CSV 필드

- `intelPairs33E`
- `intelFreshPairs33E`
- `intelStalePairs33E`
- `intelUnknownPairs33E`
- `intelMeanMilitaryConfidence33E`
- `intelObservations33E`
- `intelLoggedObservations33E`
- `preparationLockRepairs33E`
- `warHistoryUIOwner33E`

### Nation CSV 필드

- `intelKnownTargets33E`
- `intelFreshTargets33E`
- `intelStaleTargets33E`
- `intelUnknownTargets33E`
- `intelMeanMilitaryConfidence33E`
- `warIntentIntelAgeDays33E`
- `warIntentIntelSource33E`
- `warIntentIntelConfidence33E`
- `warIntentEstimatedEnemyField33E`
- `warIntentActualEnemyField33E`
- `warIntentEnemyFieldError33E`

`warIntentActualEnemyField33E`은 **observer/debug telemetry 전용**이다. AI 전략 판단에는 사용하지 않는다. 장기주행 후 추정오차를 CSV만으로 검증하기 위한 필드다.

---

## 13. 저장 호환성

현재 save version:

`0.33E`

로컬 저장 key:

`village-observer-v0-33e`

Fallback:

- 0.33D2A
- 0.33D2
- 0.33D1C
- 0.33D1B
- 0.33D1A
- 0.33D1
- 0.33D

V0.33D2A save를 불러오면 기존 전쟁·War Intent·Preparation·War Chest를 유지하고 V0.33E Intelligence state를 새로 부착한다.

시나리오 export의 `intendedVersion`은 `0.33E`이다.

---

## 14. 검증 완료 항목

개발 단계에서 다음 smoke test를 수행했다.

- 전체 86개 inline script의 JavaScript syntax 검사 통과
- 새 세계 로딩 후 버전 badge/title `V0.33E` 확인
- `world.serialize().version === '0.33E'`
- `V033D1.perfectInformation === false`
- `V033D2.perfectInformation === false`
- Intelligence pair 생성 및 시간 경과 후 snapshot 정상
- V0.33E CSV schema validator 통과
- V0.33E save → load round-trip 정상
- V0.33D2A 형식 save → V0.33E migration 정상
- War History 최종 DOM owner `V0.33E` 확인
- 합성 합동전쟁 카드에서 `A측/B측`, 실제 승리국, 전사/부상/점령/참전국 A/B 명시 확인
- 브라우저 smoke test 중 uncaught JS error 없음

---

## 15. 다음 자연주행에서 우선 볼 지표

V0.33E는 최소 40~60년 이상의 자연주행에서 다음을 확인하는 것이 좋다.

### 정보 시스템

- 평균 군사 신뢰도가 계속 100%에 고정되지 않는가
- 국경국·전쟁국이 비접촉국보다 높은 신뢰도를 가지는가
- 전쟁이 끝난 뒤 정보가 자연스럽게 stale해지는가
- `warIntentEstimatedEnemyField33E`와 실제값 사이에 의미 있는 오차가 생기는가
- 오차가 너무 커서 모든 공격이 무작위화되거나, 너무 작아서 완전정보와 다를 바 없어지지 않는가

### 전쟁 빈도·준비

- D2A 대비 전쟁 빈도가 지나치게 급락하지 않는가
- 과소평가로 준비가 부족한 전쟁과 과대평가로 지연되는 전쟁이 둘 다 나타나는가
- War Chest 회계 보존이 계속 유지되는가
- READY/Final Commitment가 정보 갱신 때문에 매일 진동하지 않는가

### Formation

- 첫 전쟁 준비에서 rally target이 있는데 lock이 0인 상태가 재발하는가
- `preparationLockRepairs33E`가 비정상적으로 계속 증가하지 않는가
- 두 번째 동시전쟁의 의도적인 0-lock 상태를 잘못 복구하지 않는가

### War History UI

- 장기주행 후에도 패널 설명이 `V0.33E 단일 최종 렌더러`로 유지되는가
- 모든 카드 제목에 `A측 · ... ↔ B측 · ...`가 보이는가
- 합동전쟁 승리국 이름과 Side가 맞는가
- 전사/부상/점령/참전국 수가 A/B와 뒤집히지 않는가

---

## 16. 알려진 V1 한계

V0.33E는 Intelligence V1이며 다음은 아직 구현하지 않았다.

- 실제 Spy Person / 첩보원 직업
- 정보기관 건물
- 능동 첩보 임무
- 기만·허위정보
- 적 정보망 파괴
- 암호·통신
- 동맹국 간 공식 정보공유 체계
- 해상 정찰 별도 모델
- 지도 자체의 플레이어 Fog of War
- 관측된 적 Formation에 대한 완전한 tactical uncertainty

특히 전술 AI의 일부 기존 경로는 여전히 현재 전장 객체를 활용한다. V0.33E의 주된 경계는 **전쟁 의도와 전략 준비의 완전정보 제거**이며, 전술·전투 전체를 Fog of War로 전환하는 버전은 아니다.

---

## 17. 파일

- `index.html` — V0.33E 실행 파일
- `README.md` — 현재 문서

