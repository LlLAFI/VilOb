# Village Observer V0.33G2

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
