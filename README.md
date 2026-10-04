# Village Observer V0.33F5A5
## Production Activation + UI State Stabilization

기준 버전: **V0.33F5A4**  
패치 성격: A4 생산시설 자연 AI 활성화 + 백과/전쟁기록/국가카드 렌더러 안정화

---

## 1. 패치 목표

V0.33F5A4는 고대 농장, 고대 제재소, 전 지형 고대 채석장을 실제 건설/생산 체계에 추가했지만 자연주행에서는 새 생산시설이 거의 등장하지 않았다.

A4 PC 자연주행의 64년 시점에는 다음과 같은 상태가 확인됐다.

- 고대 농장 개축 시작: 0
- 고대 농장 완공: 0
- 고대 제재소 착공: 0
- 고대 제재소 완공: 0
- A4 전 지형 채석장 착공: 1

원인은 신규 생산시설 AI가 기존 `seasonalTick()`의 모든 건설 판단이 끝난 뒤 남는 프로젝트 슬롯만 사용하는 후순위 구조였기 때문이다. 즉 기술과 자원이 충분해도 주거, 도로, 저장, 상업, 군사, 철산업 등 기존 시스템이 프로젝트 슬롯을 먼저 사용하면 농장/제재소가 수십 년 동안 단 한 번도 착공되지 않을 수 있었다.

동시에 A4 백과와 통계 전쟁 기록은 매 UI render마다 내부 DOM을 재생성하면서 스크롤 위치가 초기화됐고, 국가 카드에는 구형 renderer와 V0.26 이후 stable updater가 동시에 남아 기술 수가 잠깐 표시됐다가 사라지는 현상이 있었다.

V0.33F5A5의 목표는 다음과 같다.

- A4 생산시설을 **실제 계절 건설 경쟁에 참여하는 Production Proposal**로 승격한다.
- 생존/군사/철산업/주거 등 기존 핵심 체계를 무리하게 밀어내지 않도록 **soft priority**를 사용한다.
- 생산시설이 0개일 때 원인을 바로 확인할 수 있도록 구체적인 blocker telemetry를 추가한다.
- 백과 건물목록의 DOM을 매 tick 다시 만들지 않아 스크롤과 선택을 유지한다.
- 통계 전쟁기록의 스크롤 컨테이너를 유지하고 전쟁 구조가 바뀔 때만 전체 rebuild한다.
- 국가 카드 renderer를 하나로 통합하고 `⚗️ 기술 수`를 항상 표시한다.

이번 버전에서는 A4의 생산 수치 자체, 군사 밸런스, 인구/출산 공식, Frontier 비용, F5 통화가격 공식은 변경하지 않는다.

---

## 2. Production Proposal V1

### 2.1 기존 A4 문제

A4의 생산시설 판단은 다음 순서였다.

1. 기존 모든 seasonal 건설 시스템 실행
2. 남은 프로젝트 슬롯 확인
3. 남는 슬롯이 있을 때만 농장/제재소/채석장 검토

따라서 새 생산시설은 사실상 최하위 fallback이었다.

### 2.2 A5 soft-priority 구조

A5는 각 국가의 계절 tick 시작 시 생산 후보를 먼저 평가한다.

대상은 다음 세 종류다.

- 고대 경작지 → 고대 농장 개축
- 고대 제재소 신축
- 국가 최초 고대 채석장 신축

단, A5 생산 Proposal은 **프로젝트 슬롯이 최소 2칸 이상 비어 있을 때만 한 칸을 먼저 사용할 수 있다.**

즉 프로젝트 한도가 3이고 현재 프로젝트가 1개라면:

- 생산시설 1개 착공 가능
- 최소 1개 슬롯은 기존 seasonal 건설 체계에 남음

프로젝트 슬롯이 마지막 1칸뿐이라면 A5는 `PRIORITY` blocker를 기록하고 선점하지 않는다. 이 마지막 슬롯은 기존 생존, 주거, 군사, 철산업, 전략 교역망 등 오래된 우선순위 체계에 먼저 맡긴다.

A4의 기존 후순위 생산 planner는 그대로 남아 있으므로, 기존 체계가 마지막 슬롯을 사용하지 않았다면 생산시설이 그 뒤에 착공될 가능성도 유지한다.

---

## 3. 생산 후보 점수

A5는 고정 순서만 사용하는 대신 생산시설마다 필요도를 계산해 후보 점수를 만든다.

### 고대 농장

주요 가중치:

- 첫 고대 농장인지
- 국가 식량 비축일
- 평균 Hunger
- 인구 규모 대비 현재 고대 농장 수
- 해당 경작지의 정착 인구와 식량 상태

기존 A4 기준인 `인구 / 약 45명당 고대 농장 1개` 목표는 유지한다.

### 고대 제재소

주요 가중치:

- 첫 제재소인지
- 현재 목재량 대비 목표 목재량
- 후보 타일의 목재 자원량
- 숲 여부
- 인구 규모 대비 현재 제재소 수

기존 A4의 `인구 / 약 90명당 제재소 1개` 목표는 유지한다.

숲은 매우 높은 입지 점수를 받지만 통행 가능한 다른 육지에도 제재소를 지을 수 있다.

### 고대 채석장

A5 Production Proposal에서는 **국가 최초 채석장**을 중심으로 평가한다.

주요 가중치:

- 현재 석재량 대비 목표 석재량
- 자원추구형 AI 여부
- 후보 타일의 실제 석재량
- 지형

암지와 산은 평야/초지/숲보다 큰 입지 가중치를 받는다.

채석장 생산 배율은 A4와 동일하다.

| 지형 | 고대 채석장 효율 |
|---|---:|
| 평야 | ×1.08 |
| 초지 | ×1.08 |
| 숲 | ×1.06 |
| 암지 | ×1.40 |
| 산 | ×1.55 |

---

## 4. Production Proposal blocker

생산시설이 등장하지 않을 때 원인을 추적할 수 있도록 다음 blocker를 기록한다.

- `PROJECT_CAP` — 프로젝트 슬롯이 모두 사용 중
- `PRIORITY` — 마지막 1개 슬롯을 기존 전략/생존 건설에 남김
- `SURVIVAL` — 국가가 Survival/Recovery 상태
- `NO_SITE` — 실제 건설/개축 가능한 타일 없음
- `SPACE` — 필요한 개발공간 부족
- `WOOD` — 목재 부족
- `STONE` — 석재 부족
- `GOLD` — 직접 공공 Gold 부족
- `START_REJECTED` — 사전 검사는 통과했지만 실제 `startConstruction/payBuild` 계층에서 거부
- `NONE` — 현재 A5 기준으로 실행 가능

Devlog에는 `PRODUCTION_PROPOSAL33F5A5`, `PRODUCTION_PROPOSAL_STARTED33F5A5`, `PRODUCTION_PROPOSAL_REJECTED33F5A5`가 기록될 수 있다.

Snapshot/CSV의 국가별 주요 필드는 다음과 같다.

- `productionProposalType33F5A5`
- `productionProposalScore33F5A5`
- `productionProposalBlocker33F5A5`
- `productionFacilityStartsNation33F5A5`
- `ancientFarmStartsNation33F5A5`
- `sawmillStartsNation33F5A5`
- `quarryStartsNation33F5A5`

세계 누적 blocker와 Proposal 실행 횟수도 별도 필드로 저장한다.

---

## 5. A4 생산 수치는 변경하지 않음

A5는 **activation 패치**다. 시설 자체의 숫자는 그대로 유지한다.

### 고대 농장

- 개축비: 목재 18 / 석재 8 / Gold 4
- 노동: 260 성인 노동일
- 농부 슬롯: 10
- 식량 자연회복: ×1.60
- 식량 채취: 최대 ×1.25

### 고대 제재소

- 건설비: 목재 22 / 석재 8 / Gold 5
- 노동: 280 성인 노동일
- 목수 슬롯: 4
- 해당 제재소 근무 목수의 목재 채취: 최대 ×1.45
- 임업의 숲 자연회복 +30% 유지

관개·윤작에서 제거한 과거 평야/초지 식량 보너스 및 경작지 노동자 +1/+2는 다시 추가하지 않는다.

---

## 6. 백과 스크롤/선택 안정화

### A4 문제

A4의 canonical Codex는 `renderCodex()`가 호출될 때마다 전체 `codexContent.innerHTML`을 다시 작성했다.

그 결과:

- 건물 목록 스크롤이 매 tick 0으로 돌아감
- 건물 목록 DOM이 매번 새 객체가 됨
- 선택 상태가 불안정해질 수 있음
- 정적인 백과인데도 불필요한 DOM 작업이 반복됨

### A5 변경

A5는 `.a4-codex-tabs` 구조가 이미 존재하면 tick render에서 백과 구조를 재생성하지 않는다.

따라서:

- 건물 목록 DOM 객체 유지
- 건물목록 `scrollTop` 유지
- 선택한 건물 유지
- 건물 상세 카드 유지
- 탭 클릭 등 실제 사용자 입력 시에만 필요한 페이지 갱신

새 구조가 정말 필요할 때만 `codexStructureRebuilds33F5A5`가 증가한다.

---

## 7. 통계 탭 War History 안정화

### 기존 문제

V0.33E War History renderer는 매 render마다:

```text
panel.innerHTML = ...
```

로 전쟁기록 패널 전체를 교체했다.

`.v33a-history`는 자체 스크롤 영역이므로 DOM이 교체될 때마다 스크롤이 최상단으로 초기화됐다.

### A5 변경

A5 War History는 전쟁 목록의 구조 signature를 사용한다.

전체 목록 rebuild는 다음처럼 구조가 실제로 바뀔 때만 발생한다.

- 새 전쟁 추가
- 전쟁 종료로 ACTIVE/ENDED 상태 변경
- 합동전쟁 참여국 구성이 변함

일반 tick에서는:

- `.v33a-history` 스크롤 컨테이너 자체를 유지
- 현재 점령/누적 점령/해방 수치만 기존 DOM에서 갱신
- 진행 중 전쟁 카드만 기존 카드 객체 안에서 갱신
- 종료된 전쟁 카드는 그대로 유지

따라서 전쟁 기록을 아래로 스크롤한 상태에서 시간이 흘러도 목록이 위로 튀지 않는다.

구조 rebuild 횟수는 `warHistoryStructureRebuilds33F5A5`로 관측한다.

---

## 8. 국가 카드 단일 renderer

기존에는 두 UI 소유자가 충돌했다.

구형 renderer:

```text
👥 인구 · 🏘️ 영토 · 🪙 Gold · 🧠 기술 수
```

V0.26 stable updater:

```text
👥 인구 · 🗺️ 영토 · 🪙 Gold
```

그래서 카드가 처음 생성될 때만 기술 수가 보이고 다음 render에서 사라질 수 있었다.

A5는 국가 카드 renderer를 하나로 통합한다.

항상 다음 형태를 유지한다.

> **👥 인구 · 🗺️ 영토 · 🪙 Gold · ⚗️ 기술 수**

카드 구조는 국가 ID/이름/AI 성향 구조가 실제로 바뀌지 않는 한 다시 만들지 않고 각 `<span>`의 값만 갱신한다.

따라서:

- 기술 수가 더 이상 깜빡이거나 사라지지 않음
- 🧠 대신 요청한 플라스크 계열 `⚗️` 아이콘 사용
- 국가 카드 DOM이 매 tick 교체되지 않음
- 카드 가로 스크롤도 안정적으로 유지 가능

구조 rebuild 횟수는 `nationCardStructureRebuilds33F5A5`로 기록한다.

---

## 9. 성능 관측 범위

A4 데이터에서는 60년대 인구가 A3보다 약 1/3 적었지만 `perfMsPerDay`는 거의 비슷했다.

이는 Person.act 자체는 감소했지만 다음 비용들이 인구에 비례하지 않았기 때문이다.

- Settlement/영토 기반 국내경제
- 교역 planner
- 계절 건설 판단
- 유지보수/물류
- UI 전체 DOM 재생성

A5는 대규모 simulation 알고리즘 최적화 버전은 아니다. 다만 백과/War History/국가 카드의 불필요한 구조 rebuild를 제거하고 해당 rebuild 횟수를 telemetry로 노출한다.

다음 자연주행에서는 A4와 비슷한 인구/영토 시점에서 `Render`, `perfMsPerDay`, seasonal profiler를 다시 비교한다.

---

## 10. 호환성

- 기준 세이브: V0.33F5A4
- A4 세이브를 A5에서 직접 불러올 수 있다.
- A4의 `v33f5a4` 생산시설/군사 상태를 그대로 유지한다.
- A5는 별도 `v33f5a5` observer/Proposal/UI 상태를 추가한다.
- Snapshot CSV는 기존 필드를 삭제하지 않고 A5 필드를 뒤에 추가한다.
- Compact Devlog V3 정책은 그대로 유지한다.

저장 버전 문자열은 `0.33F5A5`다.

---

## 11. 검증

릴리스 전 다음을 확인했다.

### 정적 검사

- HTML 내 inline JavaScript: **110개**
- `node --check`: **전부 통과**

### Chromium 런타임

CDP `Page.setDocumentContent` 방식으로 실제 Chromium에서 전체 HTML을 실행했다.

- 문서 제목: `Village Observer V0.33F5A5`
- VSim 초기화: 정상
- UI 초기화: 정상
- Runtime exception: **0**
- `console.error`: **0**

### UI 안정성

- `renderVillageCards()` 연속 호출 후 첫 국가 카드 DOM identity 유지 확인
- 국가 카드에 `⚗️ 기술 수` 상시 표시 확인
- `renderCodex()` 연속 호출 후 `.a4-building-list` DOM identity 유지 확인
- 건물 첫 선택 상태 정상 확인
- `renderStats()` 연속 호출 후 `.v33a-history` DOM identity 유지 확인

### Production Proposal

인위적으로 기술/자원/공간을 충족시킨 테스트에서:

- 고대 경작지 → 고대 농장 A5 Proposal 실행 성공
- 실제 `buildingUpgradeProjects`에 `ancient_farm` / 260 노동일 프로젝트 생성 확인
- 고대 제재소 A5 Proposal 실행 성공
- 실제 `constructionProjects`에 `sawmill` / 280 노동일 프로젝트 생성 확인
- 실제 건설비와 기존 F4 Gold recirculation 경로 사용 확인

### 저장/CSV

- A5 serialize → A5 load round trip 정상
- A4 형식 세이브 → A5 migration 정상
- Snapshot CSV validation 정상
- 테스트 기준 CSV 열 수: **1255열**
- 잘못된 열 수 행: **0**

---

## 12. 다음 자연주행에서 확인할 항목

A5에서 가장 중요한 검증 대상은 다음과 같다.

1. 관개·윤작 연구 후 고대 농장이 실제 자연주행에서 등장하는가
2. 임업 연구 후 제재소가 적절한 시기에 등장하는가
3. 생산시설 때문에 생존/철산업/군사 건설이 과도하게 밀리지 않는가
4. `productionProposalBlocker33F5A5`가 0건 원인을 충분히 설명하는가
5. A4에서 낮아졌던 출생/인구 곡선이 생산 인프라 활성화 뒤 어떻게 변하는가
6. 백과 건물목록 스크롤이 실제 플레이 중 유지되는가
7. 통계 전쟁기록 스크롤이 실제 전쟁 중에도 유지되는가
8. 국가 카드의 `⚗️ 기술 수`가 항상 표시되는가
9. UI 구조 rebuild 감소가 Render 비용에 실제 영향을 주는가

