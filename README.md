# Village Observer V0.31H

## 릴리스 개요

V0.31H는 V0.31G 자연주행에서 확인된 두 번째 철산업 발화 병목을 수정하는 안정화 패치입니다.

V0.31G에서는 자연주행으로 `철광맥 확보 → 철광산 착공 → 광부 배치 → 철광석 생산`까지 실제로 작동했습니다. 하지만 장기 데이터에서 다른 국가가 충분한 철광 매장과 `IRON_MINING` 기술을 갖고도 철광산 착공을 반복해서 놓치는 사례가 남았습니다.

이번 패치가 직접 해결하는 문제는 두 가지입니다.

1. 철광산이 준비돼도 장기 일반 건설이 마지막 프로젝트 슬롯을 선점하는 문제
2. 철광산이 위치한 Settlement의 local market Gold가 0이면, 같은 국가의 다른 Settlement에 Gold가 충분해도 경제시설 공동재정을 사용할 수 없던 문제

버전: `0.31H`  
리비전: `iron-strategic-slot-national-market-finance`  
기준 코드: V0.31G

---

## 1. V0.31G 자연주행에서 확인된 병목

첫 장기 관측에서 키오는 V0.31G의 목표대로 자연적으로 철산업을 발화했습니다.

- 철광 매장 확보
- `IRON_MINING` 연구 완료
- 철광산 자연 착공
- 광부 4명 배치
- 철광석 생산
- 철광석 재고 150까지 증가

따라서 철광산 생산식, 광부 직업 연결, 건설 자체는 정상임을 다시 확인했습니다.

반면 에브는 철광 매장량 443을 확보했지만 철광산 착공이 장기간 지연됐습니다. 주요 차단 원인은 `PROJECT_CAPACITY`였고, 실제로 슬롯이 3/4로 비는 시점에는 다음 재정 조건이 관측됐습니다.

- 철광산 Gold 비용: 8G
- Nation Treasury: 약 3.27G
- 전략 reserve: 약 16.64G
- 철광맥 Settlement market support: 0G
- 동일 국가의 다른 Settlement에는 시장 Gold가 존재

기존 공동재정은 **건설 대상 Settlement의 market Gold + Treasury reserve 초과분**만 사용했기 때문에 이 철광산은 `TREASURY_RESERVE_BLOCK`으로 실패했습니다. 같은 분기에 일반 경작지가 비어 있던 마지막 슬롯을 사용하면서 다시 4/4가 됐습니다.

V0.31H는 이 두 사건을 직접 수정합니다.

---

## 2. 전략 산업 슬롯 예약

철광산·제련소·대장간 중 다음 시설이 이미 건설 가능한 상태라면, 일반 비긴급 건설이 국가의 마지막 빈 프로젝트 슬롯을 소비하지 못하도록 합니다.

예약 대상 산업시설:

- `iron_mine`
- `smelter`
- `smithy`

예약은 무조건 적용되지 않습니다. 다음과 같은 **긴급 건설은 철산업보다 우선할 수 있습니다.**

- 개척 거점(outpost)
- 식량 reserve 28일 미만 또는 평균 Hunger 48 초과 시 경작지/곡창
- 국가 주거 점유율 98% 초과 시 주거
- Threat 35 이상 시 방어시설

즉 철산업이 일반 성장시설을 영구적으로 굶기는 구조가 아니라, **이미 산업 조건을 충족한 국가가 무한히 마지막 슬롯을 놓치지 않도록 하는 최소 예약**입니다.

새 이벤트:

- `INDUSTRY_SLOT_RESERVED31H`

이 이벤트는 어떤 일반 건설이 차단됐는지, 목표 철산업 시설, 현재 실공사 수, 프로젝트 한도, 사용 가능한 Gold 자금을 기록합니다.

---

## 3. 전국 Settlement 시장 공동재정

V0.31F에서 도입한 경제시설 공동재정을 철산업에 한해 국가 내부 Settlement 단위로 확장했습니다.

기존:

`건설 대상 Settlement market + Treasury reserve 초과분`

V0.31H 철산업:

`건설 대상 Settlement market + 동일 국가 다른 Settlement의 잉여 market Gold + Treasury reserve 초과분`

### 보존 원칙

이 기능은 Gold를 생성하지 않습니다.

다른 Settlement의 시장 Gold를 실제로 대상 Settlement로 이전한 뒤 기존 `payBuild()`를 사용합니다. 건설 결제가 실패하면 이전분도 원래 Settlement로 rollback합니다.

또한 각 Settlement는 최소 시장 유동성 reserve를 남깁니다.

- 기본 reserve: 최소 2G
- 인구가 있을 경우 `max(2, local population × 0.10)`

대상 Settlement가 0G라면 건설비뿐 아니라 이 최소 유동성까지 확보하도록 이전합니다. 예를 들어 철광산 비용이 8G이고 대상 시장이 0G일 때 10G를 옮길 수 있습니다.

- 8G: 실제 건설비로 소모
- 2G: 대상 Settlement 시장 유동성으로 남음

따라서 "10G 이전"과 "8G 비용"이 동시에 기록되는 것은 Gold 생성이 아니라 위치 이동 + 실제 소비입니다.

새 이벤트:

- `INDUSTRY_MARKET_POOL31H`

기록 항목에는 이전 총액, 출발 Settlement, 경로비, 실제 Gold 비용, Treasury 가용분 등이 포함됩니다.

---

## 4. 프로젝트 완료 즉시 산업 재시도

V0.31G까지 철산업 우선 평가는 주로 계절 AI 평가에 의존했습니다. 이 때문에 일반 공사가 끝나 슬롯이 비어도 다음 계절까지 기다리는 동안 다른 자동 건설 경로가 슬롯을 다시 차지할 가능성이 있었습니다.

V0.31H에서는 실제 construction project가 완료되어 슬롯이 감소하면 즉시 철산업을 한 번 재평가합니다.

새 발화 source:

- `PROJECT_FREED`

따라서 철광산/제련소/대장간이 준비된 상태라면 빈 슬롯이 생긴 바로 그 건설 완료 경로에서 착공을 시도합니다.

---

## 5. V0.31H 진단 필드

V0.31G의 `ironStage31G`, `ironBlocker31G`는 그대로 유지하며 H 레이어에서 실제 공동재정과 슬롯 예약 상태를 추가로 관측합니다.

주요 필드:

- `ironBlocker31H`
- `industryRealProjects31H`
- `industryProjectMarkers31H`
- `industryReservedSlot31H`
- `industryFundingNeed31H`
- `industryFundingLocal31H`
- `industryFundingRemote31H`
- `industryFundingTreasury31H`
- `industryFundingTotal31H`
- `industryRemoteMarketInvested31H` *(내부 필드명 유지; 의미는 원격 시장 Gold 이전 누적량)*
- `industryRemoteMarketTransfers31H`
- `industryReservedBlocks31H`
- `industryImmediateStarts31H`

경제 UI의 산업 진단 패널에는 다음이 추가됩니다.

- H 기준 blocker
- 실공사 수 / 프로젝트 한도
- 임시 프로젝트 marker 수
- 마지막 슬롯 예약 ON/OFF
- 철산업 필요 Gold
- 현지 시장 / 타 Settlement / 국고 가용 Gold 분해
- 원격시장 이전 누적량

---

## 6. 기존 시스템과의 관계

V0.31H는 별도의 철산업 건설 시스템을 만들지 않습니다.

그대로 유지되는 경로:

- `startConstruction()`
- 기존 건설 노동량 / builder 배정
- 목재·석재 실제 조달
- 건설 공간 / footprint
- 건물 condition / 유지보수
- `payBuild()`의 Treasury strategic reserve
- 광부 직업 및 workplace scoring
- 철광석 → 철 → 도구 생산식
- 국내 물류 / 시장 가격 / Gold 보존 회계

H는 **전략적 발화 순서와 철산업 Gold의 국가 내부 조달 범위**만 보완합니다.

목재·석재가 실제로 부족하거나 해당 Settlement에 물리적으로 조달되지 않으면 여전히 착공하지 못합니다. 전국 Gold 공동재정이 자원 물류를 순간이동시키지는 않습니다.

---

## 7. 세이브 호환성

V0.31H 세이브:

- `version: "0.31H"`
- `v31h.revision: "iron-strategic-slot-national-market-finance"`

V0.31G 및 이전 세이브는 기존 fallback 체인을 통해 로드합니다.

H의 통계 객체 `v31hStats`는 로드 시 누락 필드를 안전한 기본값으로 보완합니다.

---

## 8. 검증 결과

### 정적 검사

- inline `<script>` 46개
- Node.js syntax check: **오류 0**

### Chromium 기본 런타임

- 페이지 제목: `Village Observer V0.31H`
- `World.serialize().version`: `0.31H`
- H revision 확인: 정상
- `pageerror`: **0**
- console error: **0**

### 원격 Settlement Gold 표적 테스트

조건:

- 철광맥 Settlement market: 0G
- 같은 국가 다른 Settlement market: 100G
- Treasury: 0G
- 철광산 비용: 8G
- 철광맥/기술/목재/석재/공간 조건 충족

결과:

- 철광산 착공 성공
- 원격 Settlement market: `100 → 90G`
- 대상 Settlement market: `0 → 2G`
- Treasury: `0 → 0G`
- 총 Gold: 8G 감소
- `INDUSTRY_MARKET_POOL31H.amount = 10G`

10G 중 8G는 건설비, 2G는 대상 Settlement의 최소 시장 유동성입니다.

### 마지막 슬롯 예약 테스트

조건:

- 프로젝트 한도 1
- 철광산 모든 조건 충족
- 일반 road 건설을 먼저 시도

결과:

- 일반 road: 차단
- `INDUSTRY_SLOT_RESERVED31H`: 기록
- 철광산: 정상 착공
- 중복 착공 없음

### 프로젝트 완료 즉시 재시도 테스트

조건:

- 일반 공사 1개가 프로젝트 슬롯을 점유
- 철광산 준비 완료
- 일반 공사가 완료되어 슬롯 해제

결과:

- 같은 완료 경로에서 철광산 즉시 착공
- source: `PROJECT_FREED`
- `immediateStarts = 1`

### 실제 V0.31G 에브 상황 재현 테스트

재현 조건:

- 인구 62 → 프로젝트 한도 4
- 일반 공사 3개 진행 중
- 철광 매장 443
- `IRON_MINING` 보유
- Treasury 3.27G
- 다른 Settlement market 50G
- 철광맥 Settlement market 0G
- 식량 reserve 53.5일

결과:

- H 평가 전: 실공사 3/4, 철광산 준비 완료
- 철광산이 4번째 프로젝트로 먼저 착공
- 이후 일반 자동 경작지 착공: 실패(슬롯 이미 사용)
- 총 Treasury + Settlement market Gold: `53.27 → 45.27G`
- 정확히 철광산 비용 8G만 감소
- Gold 생성 없음

### 짧은 자연주행 회귀 테스트

새 19×19 세계를 13년까지 헤드리스 자연주행했습니다.

- 활성 국가: 6
- 폐허 국가: 0
- `pageerror`: 0
- console error: 0
- 일반 건설/성장/경제 정상 진행
- 해당 seed에서는 13년까지 철기술 단계에 도달하지 않아 H 산업 재정은 아직 발화하지 않음

45년 전체 헤드리스 회귀는 단일 검증 실행 한도를 넘어 중단했습니다. 따라서 **장기 자연주행에서 철광산 → 제련소 → 대장간까지의 최종 확산은 다음 사용자 장기 데이터에서 계속 관측**합니다.

---

## 9. 다음 장기 데이터에서 볼 항목

V0.31H의 장기주행에서는 다음을 우선 확인합니다.

1. `INDUSTRY_SLOT_RESERVED31H`가 실제로 얼마나 자주 발생하는가
2. 예약 때문에 식량/주거 긴급 인프라가 굶지 않는가
3. `INDUSTRY_MARKET_POOL31H`가 철광산뿐 아니라 제련소/대장간에도 정상 사용되는가
4. `industryImmediateStarts31H`가 실제 자연주행에서 증가하는가
5. 철광석 재고를 가진 국가가 `SMELTING` 완료 후 제련소로 자연 전환하는가
6. 철 생산 후 `IRONWORKING` → 대장간 → 도구 생산까지 연결되는가
7. trade audit mismatch가 계속 0인지
8. Gold가 특정 Settlement에서 과도하게 빨려나가 지역 경제가 마르는 부작용이 없는지

---

## 파일 구성

- `index.html` — V0.31H 실행 파일
- `README.md` — 본 기술 문서
- `VALIDATION.json` — 자동/표적 검증 요약
- `source/index_v031G_base.html` — 패치 전 V0.31G 기준 소스
- `source/v31h_patch.js` — V0.31H 추가 패치 레이어
