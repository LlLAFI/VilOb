# Village Observer V0.33G

## AIProfile Hardcode Removal

V0.33G는 V0.33F5A8을 기준으로, 향후 **AIProfile JSON / AI Editor / 사용자 정의 AI**를 안전하게 도입하기 위한 구조 정리 패치다.

A6~A7에서 AIProfile 계층과 카이렌을 추가하고 주요 행동 경로를 trait 기반으로 연결했지만, 단일 HTML에 누적된 과거 버전 코드에는 여전히 `brain.type === 'expansionist'`처럼 **프로필 ID 문자열 자체를 행동 규칙으로 사용하는 분기**가 남아 있었다.

이 상태에서는 `custom_usa`, `my_ai_01`처럼 새로운 ID의 커스텀 프로필이 들어왔을 때 trait 값과 무관하게 일부 구형 경로에서 기본형으로 떨어질 수 있다.

G의 목표는 명확하다.

> **프로필 ID는 정체성(identity)으로만 사용하고, 실제 행동은 trait / semantic capability를 통해 결정한다.**

이번 버전은 AI Editor UI나 JSON 파일 형식을 아직 추가하지 않는다. 먼저 본편 시뮬레이션의 행동 라우팅을 ID 비의존 구조로 정리한다.

---

## 1. Semantic Capability Layer

기존 여섯 archetype이 코드 곳곳에서 사용하던 의미를 다음 다섯 capability로 분리했다.

| Capability | 의미 |
| --- | --- |
| `survivalPriority` | 생존·안정에 추가 우선권을 두는 정도 |
| `tradeDiplomacy` | 교역·외교형 특수 행동을 사용하는 정도 |
| `territorialExpansion` | 적극적 영토확장 행동을 사용하는 정도 |
| `urbanConcentration` | 도시집중·고밀도 유지 성향 |
| `resourceSeeking` | 전략자원·자원거점 추구 성향 |

Capability는 0~1 범위의 연속값이다.

기존 기본 AI는 과거 행동을 보존하기 위해 compatibility capability를 명시적으로 갖는다.

| 기본 AI | survival | trade | expansion | urban | resource |
| --- | ---: | ---: | ---: | ---: | ---: |
| 키오 / 생존안정형 | 1 | 0 | 0 | 0 | 0 |
| 델마 / 교역외교형 | 0 | 1 | 0 | 0 | 0 |
| 벨른 / 영토확장형 | 0 | 0 | 1 | 0 | 0 |
| 라엔 / 균형형 | 0 | 0 | 0 | 0 | 0 |
| 티아 / 도시집약형 | 0 | 0 | 0 | 1 | 0 |
| 에브 / 자원개척형 | 0 | 0 | 0 | 0 | 1 |
| 카이렌 / 기술개발형 | 0 | 0 | 0 | 0 | 0 |

카이렌은 A6 이전 legacy archetype에 존재하지 않았으므로 compatibility capability는 균형형처럼 0이다. 카이렌의 차이는 A6/A7의 `technology`, `production`, `expansion`, `risk` 등 **실제 trait delta**에서 계속 발생한다.

---

## 2. 사용자 정의 프로필의 Capability 파생

기본 preset이 아닌 임의의 AIProfile에는 capability를 직접 넣을 수도 있고, 없으면 trait에서 의미값을 파생한다.

현재 기본 파생 기준은 다음과 같다.

- `survival > 1` → `survivalPriority`
- `trade > 1` → `tradeDiplomacy`
- `expansion > 1` → `territorialExpansion`
- `urbanization > 1` → `urbanConcentration`
- `resourceAcquisition > 1` → `resourceSeeking`

예를 들어 ID가 `custom_probe_xyz`여도 `expansion: 1.55`라면 영토확장 capability를 사용할 수 있다. 코드가 더 이상 `custom_probe_xyz === 'expansionist'` 같은 이름 일치를 요구하지 않는다.

Capability는 legacy archetype의 특수 동작을 데이터화하기 위한 계층이고, A6/A7의 일반 trait 계수는 그대로 별도로 적용된다. 따라서 향후 AI Editor에서는 **연속적인 trait 조정 + 필요한 capability 조정**을 함께 표현할 수 있다.

---

## 3. G에서 제거한 행동용 Profile-ID 분기

A8 소스는 수년간 누적된 단일 HTML이므로 최신 경로뿐 아니라 구형 compatibility 경로에도 직접 분기가 남아 있었다. G는 현재 실행 여부와 무관하게 행동 결과에 관여할 수 있는 직접 타입 분기를 정리했다.

주요 변환 영역은 다음과 같다.

### 전략 행동

- 기본 AI 행동 점수
- 교역외교형의 장기 구조적 정체 탈출
- 자원개척형 Frontier 후보 보정
- Strategic Program 성향 보정

### Frontier Expansion

- V21 autonomous 개척 임계값
- V24 regional frontier 임계값
- A7 자율개척 확률
- 동시 Frontier capacity
- 밀도·잔류인구 gate
- 후보 점수 threshold

기존 preset의 주요 값은 그대로 유지한다.

- 키오: autonomous chance 0.270
- 델마: 0.340
- 벨른: 0.560
- 라엔: 0.380
- 티아: 0.240
- 에브: 0.440
- 카이렌: 약 0.287

### 유지보수

기존 archetype별 건물 유지보수 중요도와 remote maintenance 규칙을 capability 가중식으로 전환했다.

기존 preset은 capability가 0 또는 1이므로 과거 상수와 같은 값이 나온다. 혼합형 Custom AI는 여러 성향의 유지보수 우선도가 연속적으로 결합될 수 있다.

### 군사·전쟁

다음 직접 type 분기를 capability 기반으로 변환했다.

- 초기 전쟁 선포 평가 보정
- D 다중전선 AI 참전 확률
- D1 War Intent 평가
- E Intelligence 기반 평가
- E2 불확실성·위험 성향
- 동맹/공동전쟁 개입 성향
- F5P2 / A7 War disposition fallback
- A3 평시 상비군 목표

A7 기준 기존 War disposition은 그대로 유지한다.

- 키오 -5
- 델마 -3
- 벨른 +5
- 라엔 0
- 티아 0
- 에브 +3
- 카이렌 약 -2.2

### 도시·이주·경제

A7에서 이미 Profile trait로 이동한 도시 이주 관성, 전략 reserve, 생산시설 우선권 등의 경로와 G capability layer를 같은 Profile 조회 체계로 통합했다.

---

## 4. Nation Name과 Profile ID

국가 이름 preset도 더 이상 `NAME_PRESET[v.brain.type]`를 행동 코드처럼 직접 조회하지 않는다.

현재 AIProfile 자체의 `nationName`을 우선 사용한다.

따라서 향후 커스텀 프로필은 다음과 같은 구조를 자연스럽게 가질 수 있다.

```json
{
  "id": "custom_profile",
  "label": "사용자 AI",
  "nationName": "사용자국",
  "traits": { }
}
```

`brain.type` 필드는 당장 삭제하지 않는다. 기존 세이브와 하위버전 호환을 위해 다음 용도로만 남는다.

- save serialization의 legacy identity
- 이전 버전 save migration fallback
- 기존 객체가 `aiProfileId`를 아직 갖지 않은 경우 profile identity 복구

**행동 판단에서는 profile ID 문자열을 비교하지 않는다.**

---

## 5. 기존 7개 AI 회귀 보존 방식

G는 기본 AI를 새롭게 재밸런싱하는 패치가 아니다.

기존 preset은 과거 type 분기가 만들던 결과를 compatibility capability로 재현하고, 그 위에 A6/A7의 trait delta를 그대로 유지한다.

예를 들어 과거 코드가 영토확장형에 `+10` 전쟁 보정을 줬다면 G에서는 다음 의미가 된다.

```text
+10 × territorialExpansion
```

벨른은 capability 1이므로 기존과 같은 +10을 받는다. 균형형은 0이므로 받지 않는다. Custom AI가 0.4라면 +4가 된다.

이 방식은 기존 행동 보존과 커스텀 AI의 연속적인 성향 표현을 동시에 가능하게 한다.

---

## 6. 정적 감사 결과

G 최종 소스에서 다음 패턴을 별도로 검사했다.

- `brain.type === '...'`
- `brain.type !== '...'`
- 지역 변수 `brain / bt / b / t`에 profile ID를 담은 뒤 문자열 비교하는 형태
- legacy archetype 상수 map으로 행동값을 고르는 형태

**행동용 직접 profile-ID 비교: 0건**

`brain.type` 문자열 자체는 위에서 설명한 legacy identity/save/migration 용도에만 남긴다.

또한 HTML 내 JavaScript를 각각 분리해 문법 검사했다.

- inline JavaScript: **115개**
- syntax failure: **0**

---

## 7. 런타임 회귀 검증

브라우저 런타임에서 다음을 검증했다.

### 새 자연 세계

- 7개국 정상 생성
- 카이렌 technologist 유지
- 국가명 preset 정상
- G 버전 serialize 정상

### 기본 AI compatibility

대표 Profile 실효값 확인:

| 국가 | Frontier chance | War disposition |
| --- | ---: | ---: |
| 키오 | 0.270 | -5.0 |
| 델마 | 0.340 | -3.0 |
| 벨른 | 0.560 | +5.0 |
| 라엔 | 0.380 | 0.0 |
| 티아 | 0.240 | 0.0 |
| 에브 | 0.440 | +3.0 |
| 카이렌 | 0.287 | -2.2 |

A7 기준값과 동일하다.

### 임의 Custom ID

`custom_probe_xyz`라는 기존 코드에 전혀 존재하지 않는 ID를 런타임 등록해 다음을 확인했다.

- profile ID 그대로 보존
- trait에서 capability 정상 파생
- Frontier 실효값 계산
- War disposition 계산
- `NS.Brains.create()`가 임의 ID를 그대로 가진 Brain 생성

즉 커스텀 AI가 기존 7개 이름 중 하나를 사칭할 필요가 없다.

### Save migration

A8 형식으로 간주한 7국 save를 G로 다시 로드해 다음 profile 순서를 보존했다.

`survival / diplomatic / expansionist / balanced / urbanist / resource_seeker / technologist`

G state도 정상 부착됐다.

### Simulation smoke

- 180 calendar-day 자연 진행
- 7개국 유지
- runtime exception 0
- G save version 유지

### CSV

- Snapshot CSV: **1305 columns**
- schema validation: **PASS**
- bad rows: **0**

---

## 8. A8 Recovery Essential Investment 계승

G는 A8의 Recovery Essential Investment 밸런스를 변경하지 않는다.

A8 자연주행에서는 Recovery Essential 검토가 실제 발생했으나 자연 착공 성공이 0회였고, `START_REJECTED` 원인 세분화는 향후 안정화 항목으로 남아 있다.

G의 목적은 이 값을 재조정하는 것이 아니라 AI 구조의 ID 의존을 제거하는 것이다.

---

## 9. 아직 하지 않는 것

V0.33G에는 다음을 아직 구현하지 않는다.

- AIProfile JSON 파일 import/export
- AIProfile schema의 외부 파일 버전 고정
- 국가별 Custom AI 선택 UI
- 독립 `AI Editor.html`
- 역사 국가 preset 제작
- AI에게 직접 생산/연구/군사 보너스를 주는 국가 버프

특히 AIProfile은 **능력치 치트가 아니라 의사결정 성향**을 표현한다는 원칙을 유지한다.

---

## 10. 다음 단계

G 자연주행 회귀가 통과하면 다음 순서는 다음과 같다.

1. **AIProfile JSON v1 규격 고정**
2. 본편 Profile import / export
3. Custom Profile validation 및 오류 메시지
4. 국가 슬롯에 Custom AI 적용
5. 별도 **AI Editor v1** 제작
6. 기본/고급 parameter UI
7. 이후 필요 시 상황별 doctrine 계층 확장

이를 통해 장기적으로 `미국형`, `일본형`, `산업집약형`, `고립주의형` 등 특정 행동 양식을 가진 AI를 **동일한 시뮬레이션 규칙 안에서 Profile 데이터만으로 제작**할 수 있게 한다.

---

## 호환성

- 기준 버전: `V0.33F5A8`
- Save version: `0.33G`
- A8 / A7 / A6 save fallback 지원
- 기존 7개 AIProfile ID 유지
- MapData A~G spawn 규칙 유지
- Person 실체, 경제, 전쟁, 점령, 평화협정, 생산시설 수치 변경 없음

