# Village Observer V0.31G

## 릴리스 개요

V0.31G는 V0.31F의 철기경제를 유지하면서, 자연주행에서 철광맥과 `IRON_MINING` 기술을 확보한 국가가 일반 건설 프로젝트에 밀려 철광산을 시작하지 못할 수 있던 **산업 발화 병목**을 다루는 안정화 패치입니다.

이번 버전의 핵심은 신규 생산식이 아니라 **기존 건설 AI의 평가 순서와 관측성(observability)** 입니다. 철광산·제련소·대장간은 별도의 건설 시스템을 만들지 않고 기존 `startConstruction()` / `payBuild()` / 건설 노동 / 유지보수 경로를 그대로 사용합니다.

버전: `0.31G`  
리비전: `iron-industry-activation-diagnostics-svg`  
기준 코드: V0.31F

---

## 1. 철산업 건설 우선 발화

V0.31F까지는 `startIndustry31()`가 일반 계절 건설 로직 뒤에서 평가되었습니다. 건설 프로젝트 슬롯이 제한된 국가에서는 주거·인프라 등 일반 프로젝트가 슬롯을 먼저 차지해, 철광맥과 기술 조건을 만족해도 철광산이 장기간 또는 사실상 영구적으로 시작되지 않을 수 있었습니다.

V0.31G에서는 계절 건설 평가 순서를 다음처럼 바꿉니다.

1. 철산업 전략 시설 평가 (`iron_mine` → `smelter` → `smithy`)
2. 기존 일반 계절 건설 평가
3. 기존 산업 물류/생산 처리

따라서 계절 평가 시 새로 빈 건설 슬롯이 있으면 철산업 조건을 충족한 국가가 먼저 그 슬롯을 사용할 기회를 얻습니다.

이 변경은 건설 슬롯 수 자체를 늘리지 않습니다. 또한 다음 기존 조건은 그대로 유지됩니다.

- 식량 reserve 안전선
- 목재·석재 전략 reserve
- Settlement market + Treasury 공동재정
- 건설 공간/footprint
- 실제 건설 노동량과 완료 과정
- 기술 선행조건
- 철광산의 적격 철광맥 조건

---

## 2. 건설 중 산업시설 중복 방지

산업시설 목표 수를 계산할 때 완공 건물만 세던 경로를 보완했습니다.

이제 다음 시설은 **완공 수 + 현재 건설 중 수**를 함께 셉니다.

- 철광산 (`iron_mine`)
- 제련소 (`smelter`)
- 대장간 (`smithy`)

따라서 첫 철광산이 아직 공사 중인 동안 다음 계절 평가에서 동일한 철광산을 다시 착공하는 현상을 방지합니다.

---

## 3. 산업 발화 단계 및 차단 원인 진단

국가별로 철산업 진행 단계를 직접 관측할 수 있는 `ironStage31G`와 `ironBlocker31G`를 추가했습니다.

대표 단계:

- `PRE_IRON`
- `DEPOSIT_WAITING_TECH`
- `ORE_AVAILABLE_WAITING_MINE`
- `IRON_MINE_CONSTRUCTION`
- `IRON_MINE_WAITING_WORKERS`
- `ORE_PRODUCTION`
- `ORE_WAITING_SMELTING_TECH`
- `ORE_WAITING_SMELTER`
- `SMELTER_CONSTRUCTION`
- `IRON_PRODUCTION`
- `IRON_WAITING_IRONWORKING_TECH`
- `IRON_WAITING_SMITHY`
- `SMITHY_CONSTRUCTION`
- `TOOLS_PRODUCTION`
- `TOOLS_ONLINE`

대표 차단 원인:

- `NONE`
- `INACTIVE`
- `FOOD_RESERVE`
- `TECH`
- `NO_DEPOSIT`
- `NO_ELIGIBLE_DEPOSIT`
- `PROJECT_CAPACITY`
- `MATERIALS`
- `GOLD`
- `SPACE`
- `ALREADY_EXISTS`

단계·차단 원인·목표 시설·건설 프로젝트 수가 바뀌면 `INDUSTRY_GATE31G` 이벤트가 Devlog에 기록됩니다.

추가 Snapshot/CSV 필드:

- `ironStage31G`
- `ironBlocker31G`
- `industryProjects31G`
- `industryProjectCap31G`
- `pendingIronMines31G`
- `pendingSmelters31G`
- `pendingSmithies31G`
- `eligibleIronDeposits31G`
- `bestIronDeposit31G`

세계 요약 필드:

- `industryOnlineNations31G`
- `industryProjectCapacityBlocked31G`

---

## 4. 경제 UI 산업 진단 패널

국가 > 경제 화면에 **산업 발화 진단** 패널을 추가했습니다.

패널에서 바로 확인할 수 있는 항목:

- 현재 철산업 단계
- 현재 차단 원인
- 사용 중 건설 슬롯 / 최대 슬롯
- 영토 내 철광 매장량
- 적격 철광맥 수
- 건설 중 철광산 / 제련소 / 대장간 수

V0.31F처럼 철광산이 0으로 머무는 상황이 다시 발생하면 Devlog 전체를 역추적하기 전에 UI에서 1차 원인을 확인할 수 있습니다.

---

## 5. SVG 아이콘 V1

기존 emoji 전용 표현에서 단계적으로 벗어나기 위한 첫 아이콘 레지스트리를 추가했습니다.

### 자원 SVG

- 식량
- 목재
- 석재
- 철광석
- 철
- 도구

### 철산업 건물 SVG

- 철광산
- 제련소
- 대장간

아이콘은 외부 파일 요청이 없는 inline SVG라 단일 HTML 실행 구조를 유지합니다. SVG가 정의되지 않은 항목은 기존 emoji를 fallback으로 계속 사용합니다.

이번 V1은 철기경제 카드와 신규 산업 진단 UI부터 적용하며, 기존 전체 UI의 emoji를 한 번에 치환하지 않습니다. 이후 버전에서 같은 레지스트리를 확장하는 방식으로 교체할 수 있습니다.

---

## 6. 세이브 호환성

V0.31G는 다음 순서로 기존 세이브를 fallback 로드합니다.

- V0.31F
- V0.31A
- V0.31
- V0.30B4
- V0.30B3
- V0.30B2
- V0.30A
- V0.30

V0.31G 세이브는 `version: "0.31G"`와 `v31g` 메타데이터를 저장합니다.

V0.31G의 신규 진단 상태는 원본 경제·인구 엔티티를 대체하지 않으며 로드 후 현재 World 상태에서 다시 계산됩니다.

---

## 7. 검증 결과

### 정적 검증

- inline `<script>` 45개 Node.js syntax check: **오류 0**

### Chromium 런타임

- 초기 페이지 로드: 정상
- `pageerror`: **0**
- console error: **0**
- 표시 버전: `Village Observer V0.31G`
- `World.serialize().version`: `0.31G`

### 산업 착공 우선순위 표적 테스트

조건:

- `IRON_MINING` 보유
- 적격 철광맥 400
- 충분한 식량·목재·석재·Gold·공간
- 건설 프로젝트 0 / 1

결과:

- 평가 전: `ORE_AVAILABLE_WAITING_MINE / blocker NONE`
- 첫 계절 평가: `iron_mine` 착공
- 착공 사유: `V31_IRON_DEPOSIT`
- 평가 후: `IRON_MINE_CONSTRUCTION`
- 다음 계절 평가 후에도 건설 중 철광산 수: **1** (중복 착공 없음)

### V0.31F 공동재정 회귀 테스트

조건:

- Treasury: `0G`
- 적격 Settlement market: `100G`
- 철광산 Gold 비용: `8G`

결과:

- 철광산 착공 성공
- Market Gold: `100 → 92`
- Treasury: `0 → 0`

즉 V0.31F의 공동재정 수정이 V0.31G에서 유지됩니다.

### 건설 슬롯 진단 테스트

철광맥·기술·재료·Gold 조건을 만족하지만 유일한 프로젝트 슬롯을 다른 건설이 점유한 상태에서:

- `ironStage31G = ORE_AVAILABLE_WAITING_MINE`
- `ironBlocker31G = PROJECT_CAPACITY`

으로 정상 분류되었습니다.

### 세이브/마이그레이션

- V0.31G serialize → reload: 정상
- V0.31F 형식 입력 → V0.31G migration: 정상
- Devlog JSON version: `0.31G`
- Snapshot 신규 진단 필드 생성: 정상

### 자연주행 sanity check

새 19×19 월드를 UI 렌더 없이 약 25년간 자연주행했습니다.

- runtime exception: **0**
- 철광 매장지를 확보한 국가가 나타남
- 아직 `IRON_MINING`을 완료하지 않은 상태에서는 `DEPOSIT_WAITING_TECH / TECH`로 정확히 진단됨

이 sanity run에서는 연구 진행 속도 때문에 25년 시점까지 자연 철산업 전체 체인이 개통되지는 않았습니다. 따라서 실제 장기 세션에서는 `IRON_MINING` 완료 이후 `ORE_AVAILABLE_WAITING_MINE → IRON_MINE_CONSTRUCTION` 전환을 Devlog/경제 진단 패널로 확인하는 것을 권장합니다.

---

## 8. V0.32로 넘어가기 전 확인할 지표

장기 자연주행에서 최소 한 국가가 다음 흐름을 통과하는지 확인합니다.

`철광맥 → IRON_MINING → 철광산 → 광부 → 철광석 → SMELTING → 제련소 → 철 → IRONWORKING → 대장간 → 도구`

특히 다음 값을 같이 확인하면 병목을 즉시 구분할 수 있습니다.

- `ironStage31G`
- `ironBlocker31G`
- `pendingIronMines31G`
- `pendingSmelters31G`
- `pendingSmithies31G`
- `ironMineWorkers31A`
- `smelterWorkers31A`
- `smithyWorkers31A`
- `oreMined31`
- `ironSmelted31`
- `toolsMade31`

자연주행에서 `TOOLS_ONLINE`이 확인되면 V0.31 철기경제 계열을 마감하고 다음 시스템 버전으로 넘어가기 좋은 기준점입니다.
