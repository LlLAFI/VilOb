# Village Observer V0.33F5A6
## AIProfile Foundation + Kairen

기준 버전: **V0.33F5A5**  
패치 성격: 7번째 기본 AI 추가 + 향후 AI Editor를 위한 data-driven AIProfile 기반 구축 + A5 생산 Proposal 보완

---

## 1. 패치 목표

V0.33F5A6는 별도의 AI Editor를 바로 추가하는 버전이 아니다. 먼저 기존 AI 구조를 편집 가능한 데이터 구조로 옮기기 위한 **AIProfile v1 기반**을 만든다.

A5까지의 AI는 `brain.type === 'expansionist'`, `brain.type === 'urbanist'`와 같은 직접 분기가 코드 여러 계층에 누적되어 있다. A5 기준 소스 감사에서는 이러한 직접 성향 참조가 약 **81곳** 확인됐다.

이를 한 번에 전부 제거하면 0.18~0.33까지 축적된 개척·교역·도시·군사·연구 행동이 동시에 변해 회귀 위험이 크다. 따라서 A6는 다음 순서를 사용한다.

1. 7번째 기본 AI **카이렌 / 기술개발형** 추가
2. 공통 `AIProfile` 데이터 계층 추가
3. 기존 6개 성향을 compatibility preset으로 등록
4. 행동에 영향이 큰 핵심 경로부터 profile 값을 읽게 전환
5. 기존 6개 preset은 해당 핵심 경로에서 **delta=0**이 되도록 하여 기존 행동을 최대한 유지
6. 자연주행 검증 후 나머지 직접 `brain.type` 분기를 단계적으로 제거
7. 이후 Profile JSON import/export → 별도 AI Editor HTML 순서로 확장

---

## 2. 7번째 국가: 카이렌

새 자연 세계의 기본 국가는 다음 7개다.

| 국가 | 기본 AI |
|---|---|
| 키오 | 생존안정형 |
| 델마 | 교역외교형 |
| 벨른 | 영토확장형 |
| 라엔 | 균형형 |
| 티아 | 도시집약형 |
| 에브 | 자원개척형 |
| **카이렌** | **기술개발형** |

카이렌의 내부 profile id는 `technologist`다.

카이렌은 단순한 생산 보너스를 받지 않는다. 다른 국가와 동일한 물리 자원·Person 노동·Gold·건설비 규칙을 사용하면서 **무엇에 먼저 투자할지**가 다르다.

주요 성향은 다음과 같다.

- 기술 투자: 높음
- 생산시설 투자: 높음
- 철산업 투자: 높음
- 도로/행정 연결: 비교적 높음
- 도시집약: 약간 높음
- 교역: 평균보다 약간 높음
- 영토확장: 낮음
- 군사투자: 다소 낮음
- 위험감수: 다소 낮음

따라서 카이렌은 넓은 영토를 먼저 차지하기보다 기존 영토의 생산·연구·가공망을 키우는 국가를 목표로 한다.

---

## 3. AIProfile v1

A6는 AI 이름과 행동 파라미터를 분리한다.

개념 구조는 다음과 같다.

```text
AIProfile
 ├─ id / label / nationName
 ├─ legacyBase
 ├─ mods
 ├─ traits
 │   ├─ survival
 │   ├─ expansion
 │   ├─ trade
 │   ├─ urbanization
 │   ├─ resourceAcquisition
 │   ├─ technology
 │   ├─ production
 │   ├─ military
 │   ├─ risk
 │   └─ fiscalConservatism
 ├─ research weights
 └─ construction weights
```

현재 schema version은 **1**이다.

런타임 API는 `VSim.AIProfiles` 아래에 존재한다.

주요 API:

- `AIProfiles.ids()`
- `AIProfiles.get(id)`
- `AIProfiles.profileFor(village)`
- `AIProfiles.trait(village, key)`
- `AIProfiles.delta(village, key)`
- `AIProfiles.register(def)`
- `AIProfiles.assign(village, id)`
- `AIProfiles.validate(def)`

`register()`는 향후 AI Editor가 만든 custom profile을 런타임에 등록할 수 있게 하기 위한 기반 API다. **A6에서는 아직 파일 import/export UI를 제공하지 않는다.**

---

## 4. Compatibility preset 원칙

기존 6개 AI는 A6에서 갑자기 새로운 행동 공식으로 교체하지 않는다.

각 preset에는 기존 성향을 설명하는 trait가 들어가지만, A6의 핵심 profile-driven wrapper는 **해당 AI가 기존 코드에서 이미 받던 성향을 baseline으로 사용**한다.

따라서 기존 6개 AI의 A6 profile delta는 핵심 경로에서 0이다.

예:

```text
생존안정형 technology delta = 0
영토확장형 expansion delta = 0
도시집약형 urbanization delta = 0
자원개척형 resourceAcquisition delta = 0
```

카이렌은 `balanced`를 legacy baseline으로 사용하고, 그 위에서 기술·생산은 크게 높이고 개척·군사는 낮춘다.

이 방식은 다음 목적을 가진다.

- 기존 6개국 회귀 최소화
- custom AI가 나중에 기존 archetype을 기반으로 일부 값만 바꿀 수 있음
- 모든 직접 type 분기를 한 패치에서 강제로 제거하지 않아도 됨

---

## 5. A6에서 profile-driven으로 전환된 핵심 경로

### 5.1 기본 행동 점수

`FOOD / MAINTAIN / TRADE / EXPAND / HOUSING / SECURITY` 점수에 AIProfile trait delta가 반영된다.

카이렌은 특히:

- EXPAND 억제
- MAINTAIN/생산 투자 강화
- HOUSING/도시 기반 소폭 강화
- SECURITY/상비군 선호 소폭 감소

경향을 가진다.

### 5.2 연구 선택

기존 기술 prerequisite와 생존/철산업/전략프로그램 우선순위는 그대로 유지한다.

그 위에서 profile의 `research` 가중치가 다음 분야 선택에 영향을 준다.

- 식량
- 생산/공학
- 철산업
- 상업
- 행정
- 군사
- 지식/교육

카이렌은 생산·철산업·지식 계열을 더 선호한다.

### 5.3 Frontier 후보

A2의 실제 재정 feasibility와 지형별 Frontier 비용은 그대로 유지한다.

A6는 후보 점수에 profile의:

- `expansion`
- `resourceAcquisition`

delta를 추가한다.

따라서 카이렌은 일반적인 외곽 확장 점수가 낮지만 전략자원이 풍부한 후보는 상대적으로 덜 불리하다.

### 5.4 교역

기존 교역 거리, 시장 연결, 실제 Gold 결제 규칙은 바꾸지 않는다.

Profile의 trade delta는 일부 merchant capacity에 소폭 반영된다.

### 5.5 군사 기반

기존 A3 전시 manpower lifecycle, Formation, War Intent 밸런스는 유지한다.

A6는 구형 V0.32B 군사 목표 계층에서 profile의 military delta를 소폭 반영한다. 이후 군사 직접 분기들은 별도 단계에서 추가로 data-driven 전환한다.

---

## 6. 생산시설과 기술개발형

A5 자연주행에서 다음 문제가 확인됐다.

- Production Proposal 평가 약 1,400회 이상
- 실제 착공 시도는 수십 회
- `START_REJECTED`가 발생하면 같은 계절에 다음 READY 생산 후보까지 이어지지 않는 경우 존재
- 제재소가 자연주행에서 여전히 0개일 수 있음

A6는 AIProfile 기반을 만드는 동시에 이 문제를 보완한다.

### 일반 AI

A5가 `START_REJECTED`를 기록했고 실제 생산시설 착공이 없었다면 A6가 남은 생산 후보를 다시 검사한다.

즉:

```text
농장 READY → 실제 착공 거부
→ 제재소 READY 확인
→ 채석장 READY 확인
```

과 같은 fallback이 가능하다.

### 카이렌

카이렌은 `production` trait가 높기 때문에 A5가 해당 계절에 생산시설을 착공하지 못한 경우 안전 조건 안에서 생산 후보를 추가 검토한다.

카이렌의 건설 가중치는 특히 다음이 높다.

- 고대 농장
- 고대 제재소
- 철산업
- 도로

시설의 실제 생산량과 건설비는 A4/A5와 동일하다. AIProfile은 **결정 우선순위**만 바꾼다.

---

## 7. 7개국 Spawn / MapData 호환

### 자연 세계

새 19×19 자연 세계는 7개 국가를 배치한다.

A6 검증에서 12회 연속 새 세계 생성 시:

- 국가 수 7
- 서로 다른 수도 7개
- 카이렌 존재
- 카이렌 profile `technologist`

조건을 모두 만족했다.

### 기존 6국 세이브

A5 이하의 기존 세이브는 **자동으로 카이렌을 삽입하지 않는다.**

이유는 기존 세계의 영토, 외교, 문화, 전쟁, 경제 상태를 뒤늦게 변경하지 않기 위해서다.

따라서:

- 새 A6 세계: 7국
- 기존 6국 세이브 로드: 그대로 6국

이다.

### MapData

기존 MapData A~F 6 Spawn은 그대로 호환된다.

- Spawn G가 존재하면 → 해당 위치를 카이렌 수도로 사용
- A~F만 존재하면 → 기존 6개 Spawn을 그대로 유지하고 카이렌용 7번째 Spawn만 자동 생성

A6 런타임 테스트에서 explicit G와 6+auto 방식 모두 검증했다.

맵 에디터 자체의 기본 Spawn 개수/UI 확장은 별도 맵 에디터 세션에서 맞추면 된다. 현재 에디터의 동적 Spawn 구조를 유지하는 것이 전제다.

---

## 8. 문화와 국가의 분리

A6는 새 AI/국가를 추가하지만 **7번째 신규 문화까지 동시에 추가하지 않는다.**

국가와 문화는 서로 다른 시스템이므로 카이렌은 A6에서 기존 문화 풀을 사용해 E4 문화 schema와 이름 생성을 유지한다.

향후 문화 추가/융합은 AI Editor와 별개의 문제로 유지한다.

---

## 9. Telemetry

### World

- `aiProfileSchema33F5A6`
- `aiProfileCount33F5A6`
- `legacyDirectTypeAuditA533F5A6`
- `profileProductionStarts33F5A6`
- `kairenPresent33F5A6`

### Nation

- `aiProfileId33F5A6`
- `aiProfileLabel33F5A6`
- `aiTraitTechnology33F5A6`
- `aiTraitProduction33F5A6`
- `aiTraitExpansion33F5A6`
- `aiTraitTrade33F5A6`
- `aiTraitMilitary33F5A6`
- `aiTraitRisk33F5A6`

Devlog에는 필요 시:

- `AI_PROFILE_NATION_ADDED33F5A6`
- `AI_PROFILE_PRODUCTION_STARTED33F5A6`

이 기록된다.

---

## 10. AI Editor 로드맵

A6 이후 권장 순서는 다음과 같다.

### 단계 1 — A6 자연주행 검증

확인할 항목:

- 카이렌의 영토 규모가 실제로 상대적으로 작게 유지되는가
- 기술 완성 시점이 다른 국가보다 빠른가
- 농장/제재소/철산업을 실제로 더 적극적으로 짓는가
- 생산 투자 때문에 초기 생존이 지나치게 불안정하지 않은가
- 기존 6개 성향의 장기 행동이 A5와 크게 달라지지 않는가

### 단계 2 — 직접 `brain.type` 분기 추가 제거

A5 감사 기준 약 81개 직접 참조를 영역별로 옮긴다.

권장 순서:

1. Frontier/도시/생산
2. 교역/상업
3. 연구/전략 프로그램
4. 군사/War Intent
5. 기타 UI/진단용 분기

### 단계 3 — AIProfile JSON

예정 형식:

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "id": "custom-example",
  "name": "Custom Example",
  "legacyBase": "balanced",
  "traits": {},
  "research": {},
  "construction": {}
}
```

이 단계에서 custom profile이 Save에도 안전하게 포함되도록 schema를 확정한다.

### 단계 4 — AI Editor HTML

기본 화면:

- 생존 중시
- 개척성
- 교역성
- 도시화
- 자원 확보
- 기술 투자
- 생산 투자
- 군사성
- 위험 감수
- 재정 보수성

고급 화면:

- 분야별 연구 가중치
- 시설별 건설 가중치
- 개척/재정/군사 임계값
- 향후 상태별 doctrine

이 구조가 완성되면 `미국형`, `일본형`, `소련형` 같은 프로필도 별도의 국가 버프가 아니라 **의사결정 성향의 조합**으로 제작할 수 있다.

---

## 11. 검증

A6 구현 후 수행한 검증:

- inline script **111개** `node --check` 통과
- 브라우저 런타임 page/console error **0건**
- 최초 화면 국가 카드 **7개**
- 국가명: `키오 / 델마 / 벨른 / 라엔 / 티아 / 에브 / 카이렌`
- AI type: `survival / diplomatic / expansionist / balanced / urbanist / resource_seeker / technologist`
- 기존 6개 preset의 주요 profile delta = **0**
- 카이렌 profile delta:
  - technology `+0.58`
  - production `+0.55`
  - expansion `-0.34`
- A6 save → load 후 7개 profile 유지
- A5형 6국 세이브 migration → **6국 그대로 유지**
- MapData explicit Spawn G → 카이렌이 G 위치에 배치
- MapData A~F → 기존 6개 위치 유지 + 카이렌 자동 Spawn 보완
- 새 자연 세계 12회 연속 7개 서로 다른 수도 배치 성공
- 180 simulation-day smoke run 오류 0
- Snapshot CSV **1268열**, schema validation 통과
- Devlog version `0.33F5A6`

---

## 12. 이번 버전에서 바꾸지 않은 것

- Person 실체 모델
- 전쟁/Formation/점령/평화협정 공식
- Frontier 지형별 Gold 비용
- F5 통화가격 공식
- 농장/제재소/채석장 실제 생산 배율
- 건설비와 유지비
- 인구/출산/사망 공식
- 장비 생산/손실 모델
- 문화 융합

A6의 핵심은 **새 능력 보너스를 주는 것**이 아니라, 향후 모든 AI를 편집 가능한 데이터로 표현할 수 있도록 의사결정 구조를 분리하는 것이다.
