# Village Observer V0.33G2A

## AI / Nation Profile UX + Stabilization

- 기준선: **V0.33G2**
- 패치 날짜: **2026-10-06**
- 목적: G2의 AI Profile Editor를 **Custom 국가 제작/적용 도구 V1**로 확장하고, 자연주행에서 확인된 CSV 및 Formation owner 회귀를 닫는다.
- AIProfile 파일 포맷: **`village-observer-ai` / version 1 유지**
- 기존 Person 문화 강제 migration: **없음**
- 전쟁·경제 수치 밸런스 변경: **없음**

---

## 1. G2 자연주행에서 확인된 사항

G2 PC 자연주행과 개발자 로그에서 다음이 확인되었다.

### PASS

- arbitrary custom profile `Joseon_261005`가 Import → Registry → Nation assignment → 장기 실행까지 유지됨
- Custom Profile 값이 실제 frontier / war disposition / reserve / capability 계산에 도달함
- 카이렌의 founding culture가 `KAIREN`으로 분리되고 벨른 `KAREN`과 구별됨
- Custom Profile 적용 뒤 국가명도 시뮬레이션 진행 과정에서 정상 동기화됨

### G2A에서 수정하는 회귀

1. World 탭 Profile 교체 UI가 암묵적인 현재 선택 국가에 의존해 교체 대상을 이해하기 어려움
2. Profile을 적용하는 순간에는 `nationName`이 즉시 UI에 보이지 않을 수 있음
3. 지도에서 선택한 타일의 국가로 바로 이동할 observer bridge가 없음
4. AI Editor가 국가색/문화 정체성을 작성할 수 없음
5. G2 CSV wrapper가 실제 newline이 아니라 literal `\\n`을 사용해 Snapshot CSV schema validation이 실패함
6. 활성 War Preparation이 국가의 모든 Formation을 `WAR_PREPARATION` owner로 잡아, 실제 rally와 관계없는 Formation에서도 장기간 target write block이 발생할 수 있음

---

## 2. World 탭 AI / 국가 Profile 교체 UX

기존 G1/G2 Profile 패널은 Profile 선택과 JSON Import는 제공했지만, **어느 국가를 교체하는지 패널 자체에서 명시하지 않았다.**

G2A는 World 탭에 다음 흐름을 제공한다.

```text
교체 대상 국가 선택
        +
적용할 AI Profile 선택
        ↓
현재 국가 카드  →  적용 후 카드
        ↓
AI / 정체성 교체
```

Before / After 카드에는 다음이 표시된다.

- 국가명
- 국가색
- Profile label / id
- Built-in / Custom 여부
- founding culture
- 진행 중 월드에서 문화 변경 시 기존 주민 `cultureMix` 유지 안내

JSON Import는 Profile을 Registry에 등록할 뿐 즉시 국가를 교체하지 않는다. 사용자가 Before → After를 확인한 후 Apply 버튼을 눌러야 적용된다.

Profile 적용 시 `nationName`은 다음 simulation tick을 기다리지 않고 즉시 `Village.name`에 반영된다.

---

## 3. AI Editor → AI / Nation Editor V1

`ai-editor.html`은 기존 행동 파라미터 편집 기능을 유지하면서 optional **Nation Identity**를 작성할 수 있다.

기존 G1 JSON은 그대로 유효하다. `identity`가 없는 Profile은 본편에서 기존 국가 정체성을 보존한다.

확장 형식:

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "profile": {
    "id": "custom_id",
    "label": "Custom AI",
    "nationName": "국가명",
    "basePreset": "balanced",
    "traits": {},
    "research": {},
    "construction": {},
    "mods": {},
    "identity": {
      "nationColor": "#315f9b",
      "culture": {
        "mode": "custom",
        "id": "CUSTOM_CULTURE",
        "label": "문화 표시명",
        "color": "#7aa8c8",
        "familyCore": [],
        "familyShared": [],
        "givenCore": [],
        "givenShared": []
      }
    }
  }
}
```

`identity`는 행동 계산과 분리된 metadata/identity layer다. AI 행동은 기존 G/G1 generic profile path를 그대로 사용한다.

---

## 4. 국가색

Editor에서 Nation Color를 선택할 수 있다.

- 형식: `#RRGGBB`
- 문화색과 별도
- 적용 대상: 영토 tint/border, 국가 카드, Formation 등 `NS.NATION_COLORS`를 참조하는 국가 표시
- G2A는 초기 지도 렌더러가 캡처한 구형 local color palette 경로도 현재 `NS.NATION_COLORS`를 동적으로 읽도록 보정한다.

Profile에 `nationColor`가 없으면 현재 국가 색상을 유지한다.

---

## 5. 문화 설정

Editor에서 세 가지 모드를 선택한다.

### 5.1 현재 국가 문화 유지 — `preserve`

Profile을 적용해도 `FOUNDING_BY_NATION_ID`를 변경하지 않는다.

### 5.2 기존 기초문화 사용 — `existing`

현재 7개 founding culture 중 하나를 선택한다.

- `LUEN`
- `TER`
- `KAREN`
- `SERIA`
- `MAELA`
- `NOREA`
- `KAIREN`

### 5.3 신규 기초문화 생성 — `custom`

작성 항목:

- Culture ID
- 표시명
- 문화색
- Family Core
- Family Shared
- Given Core
- Given Shared

제약:

- Culture ID: 영문 대문자로 시작, 대문자/숫자/`_`, 2~24자
- 기본 7문화 ID를 Custom 정의로 덮어쓸 수 없음
- 표시명: 1~20자
- Core family/given pool: 각각 최소 2개
- 이름 항목: 최대 5자

Custom culture는 E4의 실제 `CULTURES`, `CULTURE_IDS`, 이름 pool, `NAME_REGISTRY`에 등록되므로 이후 E4 이름 생성 경로가 동일하게 사용한다.

---

## 6. 문화 적용 정책 — Person 연속성 보존

G2A는 Profile 교체와 주민 문화 변환을 동일시하지 않는다.

### 진행 중 월드

- 국가의 founding culture는 새 설정으로 변경 가능
- **기존 Person의 `cultureMix`는 강제 변환하지 않음**
- 정복/이주/혼합으로 형성된 실제 문화 이력을 보존

### 새 월드 첫날

정확히 Year 1 / 시작 season / Day 1에 국가 정체성을 교체하고 founding culture가 달라질 경우에만 시작 주민을 새 founding culture 100%로 초기화할 수 있다.

이 경우 시작 주민 이름도 새 문화의 Family/Given pool로 다시 생성한다.

이 규칙은 이전 세이브의 KAREN → KAIREN 같은 추론 migration과는 별개다. 그런 migration은 여전히 추가하지 않는다.

---

## 7. 지도 상단 선택 국가 Profile Card

지도 canvas 바로 위에 선택 타일의 소유 국가 요약을 표시한다.

표시 정보:

- 국가색 / 국가명
- Built-in 또는 Custom Profile
- Profile label
- 인구
- 영토 타일 수
- 기술 수
- Gold
- founding culture
- 다른 국가가 임시 점령 중이면 occupier 표시

`국가 정보 보기 →` 버튼은 해당 소유 국가를 선택하고 Nation 탭의 Overview로 이동한다.

무주지를 선택하면 국가 Profile 대신 무주지/지형 정보를 표시한다.

---

## 8. Snapshot CSV 다운로드 수정

G2 회귀 원인은 G2 telemetry wrapper의 newline 처리였다.

잘못된 형태:

```js
base.split('\\n')
lines.join('\\n')
```

이는 실제 행 구분자가 아니라 backslash + `n` 문자열을 찾는다.

G2A에서는 모든 G2 wrapper가 실제 newline을 사용한다.

```js
base.split('\n')
lines.join('\n')
```

따라서 각 snapshot row에 G2/G2A 컬럼이 정상 추가되고 기존 E14 CSV schema validator를 다시 통과할 수 있다.

다운로드 직전 validator는 유지한다. 스키마가 다시 깨지면 잘못된 CSV를 조용히 저장하는 대신 오류로 중단한다.

---

## 9. War Preparation Formation owner 범위 수정

### G2 문제

G1 owner 함수는 활성 Preparation이 하나라도 존재하면 해당 국가의 모든 field Formation에 `WAR_PREPARATION` owner를 부여했다.

그 결과 실제 rally에 참여하지 않는 Formation도 평시 HOME/BORDER target을 쓰지 못할 수 있었다.

G2 자연주행에서는 이 현상이 카이렌 한 Formation에서 장기간 반복되어 수백 회의 `FORMATION_TARGET_WRITE_BLOCKED33G1A`를 만들었다.

### G2A 규칙

`WAR_PREPARATION`은 다음 중 하나를 만족하는 Formation만 소유한다.

1. 현재 preparation의 `rallyTargets[formationId]`에 등록됨
2. `formation.v33d2IntentId`가 현재 intent와 일치
3. `formation.v33d2aPreparationIntentId`가 현재 intent와 일치

그 외 Formation은 활성 Preparation이 존재하더라도 `PEACETIME` owner를 유지한다.

우선순위 자체는 유지한다.

```text
WAR_OPERATION
> POSTWAR_WITHDRAWAL
> RECOVERY_EMERGENCY
> registered WAR_PREPARATION
> PEACETIME
```

전쟁 준비 목표, readiness, food, War Chest, Final Commitment 등의 밸런스 값은 변경하지 않는다.

---

## 10. 저장 / 로드

G2A save version:

- `0.33G2A`

저장되는 추가 identity 상태:

- 국가별 적용 Profile ID
- nationName
- nationColor
- foundingCultureId
- 적용 시점
- fresh founder reset 여부
- Custom Profile 안의 optional identity
- Custom culture 정의

Custom culture는 구버전 World.from 체인이 Person cultureMix를 normalize하기 전에 먼저 registry에 설치한다. 이후 Profile registry가 복원된 뒤 identity reference를 다시 연결한다.

---

## 11. 관측 항목

G2A Snapshot/CSV에는 다음 identity 관측값을 추가한다.

Global:

- `aiNationIdentitySchema33G2A`
- `customCultureCount33G2A`
- `profileIdentityImports33G2A`
- `profileIdentityAssignments33G2A`
- `freshFounderCultureApplications33G2A`
- `csvExports33G2A`

Nation:

- `nationColor33G2A`
- `profileIdentityCultureMode33G2A`
- `profileIdentityCultureId33G2A`

Formation owner 검증에는 기존 G1/G1A의 owner/write-block telemetry를 그대로 사용한다.

---

## 12. G2A에서 하지 않는 것

- 기존 Person 문화의 진행 중 일괄 변환
- 과거 세이브 문화 migration
- 자동 문화 융합 / 파생문화 생성
- 문화에 따른 전투/건강/출산 신규 효과
- AI Profile schema v2
- 런타임 slider로 AI를 매 tick 수정하는 기능
- 전쟁·경제 밸런스 재조정

G2A는 **Custom 국가의 정체성을 작성/적용하고 G2의 UX 및 안정화 회귀를 닫는 패치**다.

---

## 13. 다음 단계

G2A 자연주행에서 다음을 확인한 뒤 **V0.33G3 — AI Behaviour Anchor / Validation**으로 넘어간다.

핵심 검증:

1. Custom nation color가 지도/국가/군사 표시에서 일관됨
2. Custom culture 이름 생성과 founding mapping이 유지됨
3. 진행 중 Profile 교체가 기존 주민 cultureMix를 보존함
4. Snapshot CSV가 정상 다운로드되고 모든 행 column 수가 동일함
5. unrelated Formation의 Preparation write block이 사라짐
6. arbitrary Profile ID가 계속 generic AI path를 사용함

G3부터는 같은 map/seed/초기조건에서 Profile만 바꾸어 행동 차이를 측정한다.

---

# Historical Implementation Notes

아래는 G2 기준 구현 기록이며 G2A에서 삭제하지 않고 유지한다.

# V0.33G2 기준 구현 기록

## AI Profile Editor V1 + Culture / Formation Stabilization

- 기준선: **V0.33G1A**
- 패치 날짜: **2026-10-05**
- 주 작업: **Standalone AI Profile Editor V1**
- 동반 수정: **카이렌 독립 제7 문화**, **Postwar Withdrawal → War Preparation handoff 정리**
- AIProfile JSON 규격: **village-observer-ai / version 1 유지**
- 기존 세이브 문화 migration: **의도적으로 없음**

---

## 1. G1A 자연주행 검증 결과

G2는 G1A PC 자연주행 결과를 안정 기준선으로 삼는다.

G1A에서 확인된 핵심 결과:

- `formationControlConflicts = 0`
- `recoveryTargetsRehomed = 0`
- Recovery target write block = 0
- Preparation target write block만 제한적으로 관찰
- Recovery plateau exit가 실제 장기 고착 국가에서 작동
- 티아의 장기 Recovery가 `LONG_STABLE_PLATEAU`로 정상 종료

따라서 다음 두 항목은 G1A에서 CLOSED로 본다.

1. Recovery ↔ PEACETIME/BORDER target 왕복
2. 실제로 안정된 국가가 strict food threshold 때문에 Recovery에 수십 년 고착되는 문제

G2는 해당 밸런스를 재조정하지 않는다.

---

## 2. 카이렌 독립 제7 문화

### 2.1 문제

카이렌은 V0.33F5A6에서 7번째 국가/AI로 추가되었으나 당시 문화 시스템은 6개 founding culture 체계를 유지했다.

그 결과 국가 2 벨른과 국가 6 카이렌이 모두 `KAREN` 문화를 founding culture로 사용했다.

G1A 자연주행에서도 두 국가의 수도/국가 주류문화가 모두 `KAREN`으로 관찰되었다.

### 2.2 G2 변경

새 문화:

- 내부 ID: `KAIREN`
- 표시명: `카이렌계`
- 색상: `#59c7bd`

`CULTURE_IDS`는 6개에서 7개가 된다.

새 founding mapping:

```text
0 키오   -> LUEN
1 델마   -> TER
2 벨른   -> KAREN
3 라엔   -> SERIA
4 티아   -> MAELA
5 에브   -> NOREA
6 카이렌 -> KAIREN
```

### 2.3 이름 체계

KAIREN은 KAREN을 복사하지 않는다.

다음 전용 pool을 추가했다.

- Family Core
- Family Shared
- Given Core
- Given Shared

카이렌계 이름은 모음 결합이 많은 `이/에/오/아` 계열을 중심으로 구성해 벨른의 KAREN 이름과 육안으로도 구별되도록 했다.

국가명 `카이렌`은 기존 nation-name reservation 규칙에 따라 family name으로 생성되지 않는다.

### 2.4 Migration 정책

**기존 세이브의 Person `cultureMix`를 KAREN → KAIREN으로 변환하지 않는다.**

이 패치는 새 세계 기준이다.

이유:

- 현재 개발 단계에서는 이전 테스트 세이브를 이어갈 필요가 없음
- 과거 KAREN ID가 벨른/카이렌을 동시에 뜻했으므로 완전한 역사 복원은 불가능
- 불필요한 추론 migration을 엔진에 남기지 않음

구버전 세이브를 수동으로 불러올 경우 기존 Person 문화값은 그대로 유지된다.

---

## 3. Formation lifecycle 소정리

### 3.1 G1A에서 남은 경계 사례

G1A에서 전쟁 철군이 완료되는 순간 이미 다음 War Intent가 `PREPARING` 상태라면 다음 순서가 겹칠 수 있었다.

```text
POSTWAR_WITHDRAWAL 완료
-> HOME_RETURNED cleanup
-> 이미 활성인 WAR_PREPARATION owner
```

기존 G1A gate는 준비 중에는 `WAR_PREPARATION` target만 허용했기 때문에 철군의 마지막 `HOME_RETURNED` write가 block telemetry로 잡힐 수 있었다.

실제 ping-pong이나 잘못된 이동은 발생하지 않았지만 lifecycle 경계가 깨끗하지 않았다.

### 3.2 G2 규칙

War Preparation이 이미 존재하더라도 철군의 terminal cleanup은 예외적으로 허용한다.

허용되는 예외는 정확히 다음뿐이다.

- 현재 target reason이 `POSTWAR_WITHDRAWAL`
- 쓰려는 reason이 `HOME_RETURNED`
- 이어지는 target tile이 Formation의 home/core tile

이 cleanup 이후 owner가 `WAR_PREPARATION`으로 넘어가며 기존 D2 rally가 정상 target을 다시 설정한다.

따라서 전쟁 준비 자체를 약화시키거나 지연시키지 않는다.

새 관측 이벤트:

- `POSTWAR_PREPARATION_HANDOFF33G2`

Snapshot global:

- `postwarPreparationHandoffs33G2`
- `postwarHomeCleanupMarkers33G2`

---

## 4. Standalone AI Profile Editor V1

새 파일:

- `ai-editor.html`

본편 `index.html`과 독립적으로 브라우저에서 열 수 있다.

본편의 AI Profile JSON 패널에도 `AI Editor 열기` 링크를 추가했다.

Editor가 만드는 JSON은 G1에서 도입된 본편 validator와 같은 규격을 사용한다.

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "profile": { }
}
```

---

## 5. Editor Metadata

편집 가능:

- Profile ID
- Display Label
- Nation Name
- Legacy Base Preset

Profile ID 규칙:

- 영문/숫자/`_`/`-`
- 최대 48자
- 첫 글자는 영문 또는 숫자
- Built-in 7개 ID는 Import로 덮어쓸 수 없음

Built-in IDs:

```text
survival
diplomatic
expansionist
balanced
urbanist
resource_seeker
technologist
```

Built-in을 직접 수정하는 대신 `Duplicate`로 Custom ID를 만든다.

---

## 6. Traits — 10개

범위:

- `0.25 ~ 2.50`
- `1.00 = 중립`

항목:

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

Traits는 한 계절의 단일 선택이 아니라 여러 시스템에 걸쳐 적용되는 장기 행동 성향이다.

---

## 7. Research Weights — 7개

범위:

- `0.25 ~ 2.50`

항목:

- food
- production
- industry
- commerce
- administration
- military
- knowledge

연구 가중치는 Knowledge를 새로 생성하지 않는다.

기존 연구 후보 점수에 대한 선호도만 바꾼다.

---

## 8. Construction Weights — 8개

범위:

- `0.25 ~ 2.50`

항목:

- farm
- sawmill
- quarry
- iron
- roads
- commerce
- military
- housing

높은 값이 실제 건물을 무료로 생성하지 않는다.

모든 건설은 기존의 다음 물리 조건을 그대로 사용한다.

- 재료
- Gold / 공동재정
- 건설 공간
- 노동
- project slot
- 기술
- 생존/전쟁 등 상위 gate

---

## 9. Seasonal Action Mods — 6개

범위:

- `-50 ~ +50`

항목:

- MAINTAIN
- FOOD
- HOUSING
- TRADE
- SECURITY
- EXPAND

Traits와 달리 이 값은 계절 정책 action score에 직접 더해지는 보정값이다.

Editor UI에서 두 개념을 별도 탭으로 분리했다.

---

## 10. Semantic Capabilities — 5개

항목:

- survivalPriority
- tradeDiplomacy
- territorialExpansion
- urbanConcentration
- resourceSeeking

범위:

- `0.00 ~ 1.00`

기본적으로 Traits에서 자동 계산한다.

자동 계산식은 본편 G1/G의 `deriveCapabilities()`와 동일하다.

### Built-in 호환 예외

기본 technologist / 카이렌 Profile은:

- `urbanization = 1.18`
- 그러나 `urbanConcentration = 0`

으로 의도적으로 설정되어 있다.

따라서 technologist를 Editor에 불러온 뒤 단순히 자동계산하면 원본과 다른 AI가 된다.

G2 Editor는 불러온 Profile의 실제 capability와 자동계산값이 다를 경우 **Override를 자동 활성화**한다.

따라서 technologist를 Duplicate하면 기존 의미가 그대로 보존된다.

사용자가 원하면 Override를 해제해 trait 기반 semantic capability로 전환할 수 있다.

---

## 11. Editor 기능

### Built-in Load

7개 기본 Profile을 reference로 불러온다.

### Duplicate

Built-in을 Custom Profile의 출발점으로 복제한다.

### Import JSON

기존 `village-observer-ai` v1 파일을 편집기로 읽는다.

### Export JSON

본편에 바로 Import 가능한 JSON을 생성한다.

Built-in ID인 상태에서는 본편 Import가 거부되므로 Editor 역시 Custom ID로 Duplicate하도록 안내한다.

### JSON Preview

현재 값을 즉시 JSON으로 표시한다.

### Validation

본편과 동일한 범위를 즉시 검증한다.

### Profile Summary

주요 trait를 막대 형태로 보여주고 현재 Profile의 대략적인 전략 성향을 설명한다.

Summary는 Editor용 설명이며 게임 계산에는 사용되지 않는다.

---

## 12. AIProfile JSON v1 Range

| 영역 | 허용 범위 |
|---|---:|
| Traits | 0.25 ~ 2.50 |
| Research | 0.25 ~ 2.50 |
| Construction | 0.25 ~ 2.50 |
| Capabilities | 0.00 ~ 1.00 |
| Action Mods | -50 ~ +50 |

Profile label 최대 40자, Nation Name 최대 20자다.

---

## 13. 본편 Custom AI 사용 절차

1. `ai-editor.html` 열기
2. Built-in Profile 불러오기 또는 Import
3. 값 편집
4. Duplicate 후 Custom ID 지정
5. JSON Export
6. `index.html` 실행
7. 관찰자 개입 탭의 `AI Profile JSON v1`에서 JSON 가져오기
8. Profile 선택
9. 적용할 국가 선택
10. `선택 국가에 적용`

Custom Profile definition과 국가의 `aiProfileId`는 기존 G1 저장 구조를 통해 save/load에 보존된다.

---

## 14. G2 Profile Telemetry

국가별 Snapshot / CSV:

- `foundingCulture33G2`
- `aiProfileSource33G2`
  - `BUILTIN`
  - `CUSTOM`
- `aiProfileFingerprint33G2`

Profile fingerprint는 현재 profile data의 작은 관측용 hash다.

동일 ID라도 Profile 값을 바꾸면 fingerprint가 달라지므로 장기 테스트에서 실제로 같은 Profile을 사용했는지 확인하기 쉽다.

Global:

- `cultureCount33G2`
- `kairenCultureReady33G2`
- `postwarPreparationHandoffs33G2`
- `postwarHomeCleanupMarkers33G2`
- `aiEditorSchema33G2`

---

## 15. 포함된 Extreme Profile Fixtures

ZIP의 `ai-profiles/`에 세 개의 검증용 Custom Profile을 포함한다.

### `g2-expansion-test.json`

- expansion = 2.50
- territorialExpansion = 1.00
- EXPAND = +40

### `g2-technology-test.json`

- technology = 2.50
- production = 2.00
- research.industry = 2.50
- research.knowledge = 2.50

### `g2-defensive-test.json`

- survival = 2.50
- expansion = 0.25
- risk = 0.25
- fiscalConservatism = 2.00

이 Profile들은 밸런스 preset이 아니다.

G2의 arbitrary custom ID와 parameter routing 회귀를 확인하기 위한 테스트 fixture다.

---

## 16. 저장

새 버전 문자열:

- `0.33G2`

새 localStorage key:

- `village-observer-v0-33g2`

과거 코드의 fallback load 자체는 유지하지만, **문화 migration은 없다.**

G2 개발/검증은 새 세계 사용을 권장한다.

---

## 17. G2에서 변경하지 않는 것

다음은 이번 범위가 아니다.

- AIProfile schema v2
- AI threshold 체계 전면 추가
- 런타임 실시간 slider 적용
- AI 행동 이유 debugger
- Profile 자동 생성/혼합
- 역사 국가 preset
- 머신러닝
- 문화 융합
- 기존 세이브의 카이렌 문화 변환
- 전쟁 밸런스
- 경제 밸런스
- Knowledge 생산량
- 연구 비용
- Recovery 조건 재조정

---

## 18. 다음 단계 — V0.33G3

G2가 기능적으로 통과하면 다음은 **AI Behaviour Anchor / Profile Validation**이다.

같은 map / 같은 초기조건에서 Profile만 바꿔 장기 결과를 비교한다.

주요 관측 후보:

- Frontier starts
- Territory growth
- War Intent 수
- 실제 전쟁 선언 수
- Technology completion timing
- 생산시설 건설
- 국제/국내 교역량
- 군사 동원
- 도시 집중도
- Treasury reserve
- Survival / Recovery 빈도

G2의 목적은 **AI를 만들 수 있게 하는 것**이고, G3의 목적은 **그 AI가 실제로 다르게 행동한다는 것을 데이터로 검증하는 것**이다.
