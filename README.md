# Village Observer V0.33D1

## War Intent + Intelligence Foundation

기준 버전: **V0.33D**  
패치 버전: **V0.33D1**  
패치 성격: **Adjustment / Foundation**  
작성 기준일: **2026-09-29**

---

## 1. 패치 목적

V0.33D 자연주행에서 Multi-front Warfare V1 자체는 실제로 작동했지만, 다음과 같은 구조적 문제가 확인되었다.

1. 실제 현역 인원이 0명이 된 Formation의 빨간 원형 표시가 지도에 남는 **유령 Formation 링** 현상.
2. Field manpower가 일시적으로 0명이 되면 기존 Formation 객체가 사라졌다가 동일 ID로 다시 생성되면서 `FORMATION_CREATED33D`가 반복 기록되는 **Formation lifecycle 불연속**.
3. 전략 AI가 상대 국가의 실제 군사력과 실제 Formation 위치를 직접 읽는 **완전정보 구조**.
4. 선전포고 AI가 90일 주기로 공격 후보를 평가한 뒤 곧바로 확률 판정을 수행하여, 공격 검토·준비·포기라는 중간 역사 없이 전쟁이 갑자기 시작되는 구조.

V0.33D1은 첩보 시스템 자체를 구현하는 패치가 아니다. 대신 향후 정찰·외교·무역·첩보·기만·정보 노후화를 추가할 수 있도록 **World Truth와 Strategic AI 사이에 Intelligence Layer를 삽입**하고, 전쟁 개시 전에 지속되는 **War Intent 상태**를 만든다.

D1의 핵심 원칙은 다음과 같다.

> **World Truth → Intelligence API → Strategic Decision**

현재 D1에서는 Intelligence API가 세계의 실제 값을 **100% 정확하게 반환**한다. 따라서 아직 실제 정보전·안개전쟁 효과는 없으며, 이번 패치는 미래 확장을 위한 인터페이스와 관측 구조를 먼저 구축한다.

---

## 2. V0.33D1 핵심 변경사항

### 2.1 Formation 렌더링 단일화

V0.33B/B1에서 도입된 전장 시각화에는 현재 참전 Formation을 빨간 원형 링으로 표시하는 코드가 남아 있었다. V0.33D는 별도로 Multi-front 전용 Formation 링을 다시 그리므로, 두 렌더러가 동시에 존재하는 상태였다.

B1 렌더러는 Formation의 실제 manpower를 확인하지 않고 `cohortIds` 존재만 확인했기 때문에, 실제 병사가 모두 부상하거나 Field cohort가 비활성화되어도 빨간 원이 남을 수 있었다.

V0.33D1에서는:

- V0.33B1의 **현재 Formation 빨간 링 렌더링을 D1 실행 중 억제**한다.
- 최근 전투 흔적(`⚔`, 최근 전투 링)은 그대로 유지한다.
- 현재 야전 Formation 위치 표시는 V0.33D의 `drawMultiFrontD()` 계열만 담당한다.
- D 렌더러는 실제 manpower가 1명 이상인 Formation만 표시하므로 0명 유령 링이 제거된다.

즉 지도 전장 표시의 역할은 다음처럼 분리된다.

- 최근 전투: B/B1 Observer cache
- 점령/해방 효과: B/B1 전장 시각화
- 현재 Field Formation 위치: D/D1 Multi-front 렌더러
- 건설 진행률: D 건설 Progress Bar

---

## 3. Formation Lifecycle V1

### 3.1 기존 문제

V0.33D의 `ensureFormationsD()`는 현재 활성 Field cohort와 연결되지 않은 Formation을 배열에서 제거했다.

특히 제1야전대는 `frm32d1-{nationId}-field1` 형식을 사용하기 때문에, manpower가 일시적으로 0명이 된 뒤 Field cohort가 다시 생성되면 동일 Formation ID가 새 객체로 다시 만들어질 수 있었다.

자연주행에서는 같은 Formation ID에 대해 `FORMATION_CREATED33D`가 반복 발생하는 현상으로 관측되었다.

### 3.2 D1 상태

D1부터 Person-backed Field Formation 객체는 다음 lifecycle을 갖는다.

- `ACTIVE`
  - 현재 Field cohort와 연결됨.
  - 실제 active manpower가 배치될 수 있음.

- `DORMANT`
  - 현재 활성 Field cohort가 없거나 Field 조직 대상에서 빠짐.
  - 객체 자체는 삭제하지 않음.
  - Formation ID, 과거 위치, 사기 및 기타 객체 상태를 보존함.
  - 현재 전쟁 배정, 전선 배정, Engagement 연결은 해제함.

### 3.3 상태 전환

`ACTIVE → DORMANT`

- 현재 Field cohort 연결이 사라질 때 발생.
- `FORMATION_DORMANT33D1` 기록.

`DORMANT → ACTIVE`

- 동일 Formation 슬롯에 Field cohort가 다시 배정될 때 발생.
- 기존 Formation 객체를 재사용.
- `FORMATION_REACTIVATED33D1` 기록.
- 동일 ID에 대한 불필요한 `FORMATION_CREATED33D` 반복 생성을 방지.

### 3.4 이번 버전에서 하지 않는 것

DORMANT는 아직 장기적인 부대 전통·지휘관·부대명·경험치 시스템을 의미하지 않는다.

다만 객체 수명이 보존되므로 향후 다음 항목을 Formation에 누적할 수 있다.

- 전투 경험
- 패전/승전 이력
- 장군 또는 지휘관
- 부대 숙련도
- 전선 기억
- 부대 별칭
- 장비 전통

---

## 4. Intelligence API V0

### 4.1 목적

V0.33D 이전의 군사 AI는 다음 정보를 직접 읽었다.

- 상대 국가의 실제 Field/Garrison manpower
- 실제 readiness
- 실제 Formation 위치
- 실제 경제·식량 상태
- 실제 외교 관계

이 구조에서는 나중에 정보 오차를 넣으려면 전쟁 AI 전체를 다시 수정해야 한다.

V0.33D1은 전략 판단에 사용되는 일부 핵심 조회를 Intelligence API로 우회시킨다.

### 4.2 정보 범주

D1의 Intel record는 다음 범주를 분리한다.

- `military`
  - Field manpower
  - Garrison manpower
  - Total manpower
  - readiness
  - estimated power
  - known Formation 목록

- `position`
  - Formation별 마지막 관측 위치

- `economy`
  - 인구
  - 식량 비축 일수
  - Gold

- `diplomacy`
  - 관측국이 대상국에 대해 가진 관계값

- `logistics`
  - 현재는 영토 규모를 기본 정보로 저장

### 4.3 신뢰도

V0.33D1의 모든 정보 신뢰도는:

- military: `1.0`
- position: `1.0`
- economy: `1.0`
- diplomacy: `1.0`
- logistics: `1.0`

즉 **100% 정확한 World Truth proxy**다.

아직 랜덤 오차나 정보 지연은 발생하지 않는다.

### 4.4 저장 구조

국가 A가 국가 B를 관측한 정보는 `observerId:targetId` pair 단위의 Intel Book에 기록된다.

예시 개념:

```text
벨른 → 티아
updatedCal: 28120
military confidence: 1.0
position confidence: 1.0
field manpower: 5
readiness: 61.3
known formations:
  - field1 tile 164 manpower 3
  - field2 tile 165 manpower 2
```

D1에서는 조회할 때마다 최신 실제 상태로 갱신되지만, 향후에는 이 `updatedCal`과 category confidence를 이용하여 정보가 낡도록 변경할 수 있다.

---

## 5. Intelligence API를 실제로 사용하는 군사 판단

### 5.1 선전포고 전력 평가

기존 V0.33의 `declarationScore33()`는 상대의 실제 `forcePotential33()` 값을 직접 사용했다.

D1부터는 D1 Intelligence hook이 활성화되어 있으면 선전포고 평가가 Intel API를 통해 상대 전력을 읽는다.

현재 정확도 100%이므로 수치적으로는 기존 완전정보 결과와 최대한 동일하게 유지된다.

기존 선전포고 점수의 핵심 요소는 유지된다.

- 전략적 경계/concern
- 관계 악화
- 국경 접촉
- 전력비
- AI 성향 보너스
- 최근 양국 교역에 따른 전쟁 억제 페널티

### 5.2 적 Formation 위치

V0.33D의 `nearestEnemyFormationD()`도 D1 Intelligence hook을 사용할 수 있게 변경했다.

현재는 Intel API가 실제 적 Formation 위치를 정확히 반환한다.

향후에는 같은 함수 호출을 유지하면서 다음과 같이 바꿀 수 있다.

```text
실제 위치: (12,8)
마지막 관측: (10,8), 27일 전
위치 신뢰도: 42%
```

그러면 D의 수도방어 `INTERCEPT / SCREEN / HOLD_CORE` 판단도 자연스럽게 정보 오차의 영향을 받을 수 있다.

---

## 6. War Intent V1

### 6.1 목적

기존 D의 독립전쟁 AI는 90일마다 후보를 평가하고, 조건을 통과하면 즉시 확률 판정으로 전쟁을 선언했다.

D1부터 독립 선전포고는 persistent War Intent를 거친다.

기본 흐름:

```text
공격 후보 발견
    ↓
ASSESSING
    ↓
┌───────────────┬──────────────┐
PREPARING      READY          CANCELLED
    ↓             ↓
재평가         확률적 개전
                  ↓
               DECLARED
```

### 6.2 ASSESSING

공격 욕구가 일정 수준 이상인 국가를 발견하면 즉시 선전포고하지 않고 공격 검토 기록을 만든다.

현재 Intent 생성 기준:

- 국경 접촉 가능
- 전쟁 참가 수 제한 내
- 최근 종전 cooldown 위반 아님
- Watchtowers 또는 Administration 기반 전략 판단 조건 충족
- 기존 공격평가 점수 약 `68+`

생성 시:

`WAR_INTENT_CREATED33D1`

이벤트가 기록된다.

### 6.3 PREPARING

공격 명분/욕구 점수는 충분하지만 현재 준비상태가 부족하면 PREPARING으로 이동한다.

D1의 준비 부족 판단 예시:

- Field manpower 부족
- readiness 부족
- 식량 비축 부족
- 추정 전력비가 지나치게 낮음

중요:

**D1은 아직 실제 준비 행동을 강제하지 않는다.**

즉 PREPARING 상태에서 국가가 의도적으로 병력을 더 뽑거나, 식량을 비축하거나, 전략도로를 건설하는 기능은 다음 단계인 D2 범위다.

D1에서는 “이 국가는 지금 공격 의도가 있지만 준비가 부족하다고 판단했다”는 상태를 보존하는 것이 목적이다.

### 6.4 READY

현재 평가가 개전 조건을 만족하면 READY가 된다.

READY에서는 기존 D의 확률적 전쟁 개시 성격을 유지한 확률 판정을 수행한다.

선전포고가 성공하면:

- War Intent → `DECLARED`
- `WAR_INTENT_DECLARED33D1`
- 기존 `WAR_DECLARED33` / `WAR_DECLARED33D`

가 이어진다.

### 6.5 CANCELLED

정보 재평가 결과 공격 가치가 충분하지 않으면 공격 계획을 포기한다.

예:

- 공격 평가 점수가 크게 하락
- 대상국이 더 이상 유효한 전쟁 대상이 아님
- 대상국 또는 자국의 동시전쟁 상태 변화
- 평가 후에도 공격 명분이 개전 기준에 도달하지 않음

기록:

- `WAR_INTENT_PHASE_CHANGED33D1`
- `WAR_INTENT_CANCELLED33D1`

이를 통해 장기적으로 다음 역사를 관찰할 수 있다.

> 벨른은 티아 공격을 검토했으나 정보 평가 후 포기했다.

---

## 7. 기존 Coalition / Intervention 유지

D1은 독립 선전포고를 War Intent 구조로 변경하지만, V0.33D의 공동교전국/제3국 참전 기능을 제거하지 않는다.

기존과 같이:

- 제3국이 기존 전쟁의 A/B 어느 한 편을 평가함.
- 관계 차이와 국경 조건을 검사함.
- 조건이 충족되면 `AI_INTERVENTION`으로 참전 가능.
- 최대 동시전쟁 수 제한을 유지함.

D1에서는 이 외교 관계 조회도 Intelligence API의 diplomacy 경로를 이용하므로, 향후 외교정보의 신뢰도가 낮아질 때 intervention 판단도 같은 확장 경로를 사용할 수 있다.

---

## 8. Devlog 이벤트 추가

### Formation lifecycle

- `FORMATION_DORMANT33D1`
- `FORMATION_REACTIVATED33D1`

### War Intent

- `WAR_INTENT_CREATED33D1`
- `WAR_INTENT_REVIEWED33D1`
- `WAR_INTENT_PHASE_CHANGED33D1`
- `WAR_INTENT_CANCELLED33D1`
- `WAR_INTENT_DECLARED33D1`

War Intent 이벤트에는 가능한 경우 다음 값이 포함된다.

- `intentId`
- `village / villageId`
- `target / targetId`
- `phase`
- `reason`
- `score`
- `estimatedAdvantage`
- `intelConfidence`
- readiness
- food
- field manpower

---

## 9. Snapshot / CSV 추가 계측

### Global

- `activeWarIntents33D1`
- `preparingWarIntents33D1`
- `readyWarIntents33D1`
- `intelAssessments33D1`
- `formationDormancies33D1`
- `formationReactivations33D1`
- `dormantFormations33D1`

### Nation

- `warIntentPhase33D1`
- `warIntentTarget33D1`
- `warIntentTargetId33D1`
- `warIntentScore33D1`
- `warIntentConfidence33D1`
- `warIntentAdvantage33D1`
- `dormantFormationCount33D1`

이 계측은 다음 자연주행에서 특히 중요하다.

다음 분석에서는 단순히 전쟁 횟수만 보는 것이 아니라:

- 공격 검토가 몇 번 발생했는가
- 몇 번 포기했는가
- PREPARING에서 얼마나 오래 머무르는가
- 어떤 점수와 전력비에서 READY가 되는가
- 반복 패전 국가가 계속 Intent를 만드는가
- 두 번째 전쟁 Intent가 어떤 조건에서 형성되는가

를 확인할 수 있다.

---

## 10. 저장 / 호환성

새 save version:

`0.33D1`

LocalStorage key:

`village-observer-v0-33d1`

fallback:

- `village-observer-v0-33d`
- `village-observer-v0-33c3f`
- `village-observer-v0-33c3`
- `village-observer-v0-33c2`
- `village-observer-v0-33c1`
- `village-observer-v0-33c`

D1 save에는 다음이 추가 저장된다.

- War Intent 목록
- Intent next ID
- D1 decision pulse 시각
- Intel Book
- D1 stats
- perfect-information foundation flag

기존 V0.33D save를 불러오면 D1 상태가 새로 붙는다.

---

## 11. 인게임 UI

### 버전

- 브라우저 title: `Village Observer V0.33D1`
- 버전 badge: `V0.33D1`

### Runtime status

현재 활성 War Intent 수와 PREPARING 수를 표시한다.

### 군사 탭

선택 국가에 D1 패널을 추가한다.

활성 Intent가 있으면:

- 대상 국가
- 현재 phase
- 공격 평가 점수
- 추정 전력비
- 정보 신뢰도
- 검토 횟수
- 현재 판단 이유

를 표시한다.

활성 Intent가 없으면 D1 Intelligence Foundation이 활성화되어 있고 현재 정보 신뢰도가 100% proxy임을 표시한다.

---

## 12. 이번 버전에서 의도적으로 제외한 기능

V0.33D1에서는 다음을 구현하지 않는다.

- 첩보원 Person 또는 Spy 직업
- 정찰대
- 국경 정찰 명령
- 정보 수집 비용
- 외교사절의 정보 수집
- 무역량에 따른 정보 정확도 변화
- 정보 노후화
- 잘못된 병력 추정
- Formation 위치 오차
- 병력 은폐
- 허위 병력 정보
- 기만 작전
- Counter-intelligence
- 매복
- 정찰 실패
- 정보 우위에 따른 직접 전투력 보너스

이 항목들은 모두 D1 Intelligence API 위에 후속 구현할 수 있다.

---

## 13. 향후 권장 흐름

### V0.33D2 — Strategic War Preparation

War Intent의 `PREPARING`을 실제 국가 행동과 연결하는 단계.

후보:

- 전시 동원 확대
- 병기·도구 확보
- 식량 비축 목표 상승
- Treasury reserve 확대
- 전선 접근 도로 건설
- Formation readiness 목표 상승
- 두 번째 전쟁 전 추가 준비 부담
- 과거 패전 기억
- 상대 동원 잠재력 추정

### V0.33E — Intelligence & Reconnaissance V1

D1의 100% 정확 Intel API를 실제 불완전정보 시스템으로 전환.

후보:

- category별 정보 정확도
- 마지막 관측 시각
- 정보 decay
- 국경 정찰
- 무역 정보
- 외교 정보
- 전투를 통한 적 전력 학습
- Formation 위치 sighting
- 정보 범위/오차

### 이후

- 첩보
- 기만
- 방첩
- 허위 Formation 정보
- 전략적 은폐
- 정보 우위 기반 우회/회피/기습

최종적으로는 **전력 열세 국가가 정보 우위와 기동 우위로 정면 교전을 회피하며 전략적 승리를 노릴 수 있는 구조**를 목표로 한다.

---

## 14. V0.33D1 Smoke Test

패치 후 다음 검증을 수행했다.

### JavaScript syntax

HTML 내 전체 `<script>` 블록을 분리해 Node.js syntax check 수행.

결과:

- syntax error: **0**

### Headless browser startup

Chromium 환경에서 전체 HTML을 로드하여 확인.

확인 결과:

- document title: `Village Observer V0.33D1`
- version badge: `Village Observer · V0.33D1`
- runtime status 정상 출력
- `VSim.V033D1` API 존재
- `revision = war-intent-intelligence-foundation`
- perfect-information flag 정상
- startup page error: **0**

### Save / load

새 세계를 serialize 후 즉시 `World.from()`으로 재로딩.

확인 결과:

- serialized version: `0.33D1`
- `v33d1` state 포함
- reload 후 D1 revision 복원
- load error: **0**

### Intel API 기본 호출

초기 세계에서 국가 pair를 대상으로 Intel Picture 호출.

확인 결과:

- military / position / economy / diplomacy / logistics confidence = 1.0
- Intel Book pair 생성
- runtime error: **0**

---

## 15. 자연주행에서 우선 확인할 항목

다음 장기주행에서는 특히 아래를 확인한다.

1. 0 manpower Formation의 빈 빨간 링이 더 이상 남지 않는가.
2. 동일 Formation ID에 `FORMATION_CREATED33D`가 반복 발생하지 않는가.
3. `FORMATION_DORMANT33D1 → FORMATION_REACTIVATED33D1` 전환이 정상적인가.
4. 전쟁 발생 전에 `WAR_INTENT_CREATED33D1`이 먼저 기록되는가.
5. ASSESSING 이후 실제로 CANCELLED 사례가 발생하는가.
6. PREPARING 상태가 지나치게 장기 고착되지 않는가.
7. READY에서 전쟁 개시 빈도가 지나치게 낮거나 높지 않은가.
8. 벨른 같은 공격적 AI가 패전 후에도 동일 상대를 반복적으로 검토하는 패턴이 어떻게 나타나는가.
9. 두 번째 동시전쟁 Intent가 형성되는 조건이 합리적인가.
10. Coalition Intervention이 D1에서도 계속 발생 가능한가.
11. `intelAssessments33D1` 증가가 성능에 유의미한 부담을 만들지 않는가.
12. 기존 Engagement / Retreat / Occupation / War Exhaustion에 회귀가 없는가.

---

## 16. 요약

V0.33D1은 정보전 자체를 구현한 버전이 아니라 **정보전이 들어갈 자리를 만든 버전**이다.

핵심 변화는 세 가지다.

1. 현재 Formation 표시와 Formation 객체 수명을 정리한다.
2. 전쟁 개시를 순간적인 확률 이벤트에서 persistent War Intent로 바꾼다.
3. 전략 AI와 World Truth 사이에 Intelligence API 경계를 만든다.

현재 Intel은 완전히 정확하지만, 이 구조를 유지하면 향후에는 AI가 “실제 세계”가 아니라 **자신이 알고 있다고 믿는 세계**를 기준으로 행동하게 만들 수 있다.
