# Village Observer V0.33E4
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
