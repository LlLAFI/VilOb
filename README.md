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
