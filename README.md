# Village Observer V0.32D4

**릴리스명:** 후기 도시·시장·성능 안정화 — 건축공간 V2 · 국제가격 V2 · Market Gold 결제 · 수역/로그 최적화  
**버전:** `0.32D4`  
**기준 버전:** `V0.32D3`  
**세이브 키:** `village-observer-v0-32d4`

V0.32D4는 D3 100년 장기주행에서 확인된 네 가지 문제를 한 번에 정리하는 안정화 패치다.

1. 티아·키오처럼 인구가 증가한 국가에서 특정 Settlement의 주거 과밀이 장기간 해소되지 않는 문제
2. 세른처럼 자원이 남는 국가가 있는데도 티아 같은 부족국으로 자원이 거의 이동하지 않는 국제교역 정체
3. 수역의 `waterType`이 없을 때 UI가 무조건 `연안`으로 표시해 모든 물이 연안처럼 보이는 문제
4. 후기 인구 증가 시 주거·생활권·행정권·경로 계산과 상세 Devlog가 반복되어 SIM 비용이 크게 증가하는 문제

이번 버전의 핵심 원칙은 **자원·Gold를 새로 만들지 않고, 실제 남는 공간·실제 시장 유동성·실제 외국 잉여자원을 사용해 교착을 푼다**는 것이다.

전투·사상자·포로·점령 등 V0.32E 군사 확장 범위는 이번에도 추가하지 않는다.

---

## 1. 건축공간 V2

### 1.1 지형별 초기/기본 최대 건축공간 소폭 상향

D3까지의 건축공간은 후기 도시화에서 너무 빨리 지형 hard cap에 닿았다. D4에서는 초기 공간과 도시 정비 이전 최대치를 약 5~10% 범위로 상향한다.

| 지형 | D3 초기 / max | D4 초기 / 기본 max |
|---|---:|---:|
| 평야 | 13 / 22 | **14 / 24** |
| 초지 | 12 / 21 | **13 / 23** |
| 숲 | 10 / 20 | **11 / 22** |
| 암지 | 9 / 17 | **9.5 / 18** |
| 산지 | 6.5 / 14 | **7 / 15** |

기존 세이브에서 이미 개발된 `developedBuildSpace`는 줄이지 않는다.

### 1.2 후기 기술 「도시 정비」 추가

신규 기술:

```text
URBAN_REDEVELOPMENT / 도시 정비
요구: URBANIZATION + PUBLIC_WORKS
Knowledge: 920
```

효과:

- 평야 최종한계: **28**
- 초지 최종한계: **27**
- 숲 최종한계: **25**
- 암지 최종한계: **20**
- 산지 최종한계: **16.5**
- 토지정비 기간 **-14%**

즉 D4의 신규 기술은 단순히 UI상의 잠재치를 올리는 것이 아니라 V0.17의 실제 `accessiblePotential()`과 토지정비 완료 cap에 직접 반영된다.

### 1.3 기술 AI / Eureka

다음 조건이면 AI가 「도시 정비」 연구를 강하게 고려한다.

- 대략 55년 이후
- 국가 인구 220명 이상
- 또는 Settlement 주거점유가 112% 이상

Eureka는 인구 220명 이상 또는 120% 이상의 주거압력 발생 시 부여될 수 있다.

---

## 2. 건축공간·주거 UI 재정리

기존 표기:

```text
건축공간 18.4 / 22.0 (잠재 22.0)
```

은 `잠재`의 의미가 모호했다.

D4 정착지/타일 상세 진단은 다음을 분리한다.

- **사용**: 현재 건물 footprint 합
- **개발됨**: 지금 즉시 건설에 사용할 수 있는 토지
- **현재 기술상한**: 현재 보유 기술로 토지정비해 도달 가능한 한도
- **지형 최종한계**: 현재 기술트리에서 해당 지형이 최종적으로 도달 가능한 한도
- **즉시 남은 공간**: `개발됨 - 사용`
- **추가 정비 가능**: `현재 기술상한 - 개발됨`

주거 진단에는 함께 표시한다.

- 실제 주민 수
- 현재 유효 주거 수용력
- 빈 주거 수용력
- 점유율
- 국가 주거 해결 blocker
- 「도시 정비」 적용 여부

---

## 3. 티아형 주거 교착 / 구조적 자원 수요

D3의 주거 해결 순서는 유지한다.

1. 같은 생활권/행정권/자국의 실제 빈 주거로 Person 이주
2. 기존 주거 고밀도 개축
3. 다른 Settlement의 실제 빈 건축공간에 새 주택 건설
4. 토지정비
5. 기존 expansion 시스템을 통한 영토 확대

D4에서는 여기에 **최종 주거 blocker**를 추가한다.

주요 값:

- `NONE`
- `RELOCATION`
- `WOOD`
- `STONE`
- `GOLD`
- `PROJECT_OR_LABOR`
- `LAND_DEVELOPMENT`
- `SPACE_CAP`

### 3.1 STRUCTURAL IMPORT DEMAND

주거 또는 영토확장이 실제 자원 부족 때문에 막히면 D4는 단순 재고량이 아니라 **구조적 조달 압력**을 계산한다.

현재 대상:

- Wood
- Stone

가중 요소:

- 주거 blocker
- Expansion blocker
- 목표 재고 대비 실제 재고
- 극심한 주거 과밀

국가 전체에 해당 자원이 충분하면 국내 물류·국내경제가 우선한다. 국가 전체가 부족하면 국제 가격 시스템의 구매 긴급도에 반영된다.

---

## 4. 국제교역 V2 — 국내가격과 국제 제시가격 분리

D4는 자국 내 재고만으로 국제 거래가격을 결정하지 않는다.

### 4.1 Local Price

Settlement의 기존 국내가격은 계속 다음 요인을 반영한다.

- 현지 재고
- 저장공간
- 생산량
- 건설 수요
- 최근 거래량
- 국내 공급/수요

### 4.2 Trade Quote

국제 판매자가 실제로 제시하는 단가는 Local Price에 다음을 추가로 반영한다.

**가격 상승 요인**

- 해당 구매국이 같은 자원을 반복 구매
- 구매국에 대한 전략적 경계
- 나쁜 외교 관계

**가격 하락 요인**

- 판매국 Settlement 시장의 Gold 부족
- 판매국 Treasury까지 포함한 유동성 압박

따라서 동일한 Stone이라도 판매 상대에 따라 서로 다른 가격이 가능하다.

---

## 5. 반복 구매 / 전략 프리미엄 / 긴급도

### 5.1 반복 구매 프리미엄

`buyer → seller → resource` 조합마다 거래 메모리를 유지한다.

기억 값:

- 누적 거래량
- 거래 횟수
- 마지막 거래일
- 최근 연속 거래 횟수
- 마지막 체결 단가

같은 구매국이 계속 같은 자원을 구매하면 판매자는 가격을 조금씩 시험적으로 높인다.

D4 현재 상한은 대략 **+30%**이며, 거래가 장기간 끊기면 프리미엄 효과가 감쇠한다.

### 5.2 전략적 경계는 물량 삭제보다 가격으로 표현

D3 이전의 전략적 수출 억제는 판매국이 구매국을 위험하게 볼수록 거래량을 직접 깎았다.

D4 일반 국제교역에서는 이를 기본적으로 **Strategic Premium**으로 바꾼다.

민수 기본자원:

- Food: 전략가격 영향 낮음
- Wood / Stone: 중간

산업자원:

- Iron ore
- Iron
- Tools

은 더 높은 전략 프리미엄을 허용한다.

기존의 관계도 `< -35` 단순 거래 금지 또한 D4 자율 국제교역에서는 제거했다. 전쟁·금수 같은 명시적인 외교정책이 생기기 전까지는 관계 악화를 **더 비싼 가격/불리한 조건**으로 표현한다.

### 5.3 구매자의 긴급 지불의사

구매국은 구조적 부족이 심할수록 평소보다 높은 가격을 감수한다.

예:

- 일반 재고 부족: 작은 프리미엄 허용
- Expansion이 Stone 때문에 막힘: 지불의사 증가
- Housing까지 Stone 때문에 장기간 막힘: 더 높은 지불의사
- 극심한 과밀과 구조적 부족이 겹침: 가장 높은 지불의사

거래는 다음 조건에서 성립한다.

```text
판매자의 제시가격 + 운송비 <= 구매자의 최대 지불가격
```

---

## 6. 국제교역 결제 — Market Gold로 통일

D3까지 일반 Food/Wood/Stone 국제교역은 국가 Treasury를 직접 사용했고, 철산업 국제교역은 Settlement Market Gold를 사용했다.

D4에서는 **일반자원과 산업자원을 Market Gold 방식으로 통일**한다.

정상 결제 흐름:

```text
구매 Settlement Market Gold
        ↓
판매 Settlement Market Gold
```

### 6.1 구매 시장에 Gold가 부족할 때

1. 같은 국가의 다른 Settlement Market에서 잉여 유동성을 이동
2. 그래도 부족하고 구조적 긴급도가 높으면 Treasury가 구매 시장에 보조
3. 해당 Market에서 외국 판매 Settlement Market으로 결제

즉 국가금고가 외국에 바로 송금되지 않는다.

```text
Treasury → 국내 Market → 외국 Market
```

Treasury 보조는 평범한 거래가 아니라 **주거·확장·생존과 연결된 긴급 조달**에 집중한다.

### 6.2 판매대금

판매대금은 판매 국가 Treasury가 아니라 **판매 Settlement Market**으로 들어간다.

이후 기존 세금·행정·국내 Gold 순환을 통해 국가재정으로 이동할 수 있다.

---

## 7. Trade Funnel 관측

D4는 국제교역이 실패했을 때 단순 `null`로 끝내지 않고 국가별 누적 blocker를 집계한다.

현재 주요 값:

- `NO_ROUTE`
- `NO_DEMAND`
- `NO_SURPLUS`
- `PRICE`
- `STRATEGIC_PREMIUM`
- `BUDGET`
- `MIN_QTY`
- `STORAGE`

국가 UI에는 다음을 표시한다.

- D4 국제 거래 횟수 / 거래량
- Treasury 긴급지원 누계
- 국내 Market 간 유동성 이전 누계
- Wood / Stone 구조수요
- 주거 blocker
- 최다 거래탈락 사유
- 최근 체결 제시가격 / 운송 포함 가격 / 구매자 지불의사

### Snapshot / CSV 필드

- `housingBlocker32D4`
- `structuralWoodDemand32D4`
- `structuralStoneDemand32D4`
- `tradeExecuted32D4`
- `tradeVolume32D4`
- `tradeTopBlocker32D4`
- `tradeNoRoute32D4`
- `tradeNoDemand32D4`
- `tradeNoSurplus32D4`
- `tradePriceBlock32D4`
- `tradeStrategicPriceBlock32D4`
- `tradeBudgetBlock32D4`
- `treasuryTradeSupport32D4`
- `marketNetworkTransfers32D4`

Global Snapshot에는 위 국제교역 합계와 수역 타입별 타일 수가 추가된다.

---

## 8. D3 Housing Reserve 로그 압축

D3 장기주행에서 `HOUSING_RESOURCE_RESERVE_BLOCK32D3`가 9천 건 이상 발생해 전체 상세 Devlog의 큰 비중을 차지했다.

D4에서는:

- D3 누적 `housingReserveBlocks32D3` counter는 그대로 증가
- 개별 타일 차단 이벤트는 상세 로그에 저장하지 않음
- 국가별 차단 횟수와 reason을 약 30 calendar-day 단위로 묶어 기록

새 집계 이벤트:

```text
HOUSING_RESERVE_BLOCK_SUMMARY32D4
```

따라서 정확한 차단 횟수는 유지하면서 Devlog 직렬화·검색·저장 비용을 줄인다.

---

## 9. 수역 분류 수정

### 9.1 `undefined → 연안` fallback 제거

D3 이전 UI는 `lake/ocean/sea`가 아니면 모두 연안으로 표시했다.

D4는 명시적으로 구분한다.

- `lake` → 호수
- `coast` → 연안
- `sea` → 해양
- `ocean` → 대양
- 기타 → 미분류 수역

### 9.2 19×19 깊이 기준 재조정

외해와 연결된 수역에서 육지로부터의 4방향 수심거리 기준을 다음처럼 조정한다.

- 거리 1: 연안
- 거리 2: 해양
- 거리 3 이상: 대양

D4 attach 시 수역을 다시 분류하므로 신규 생성·D3 세이브 로드·MapData import 후에도 `waterType`을 검증한다.

Snapshot global:

- `waterLake32D4`
- `waterCoast32D4`
- `waterSea32D4`
- `waterOcean32D4`
- `waterUnclassified32D4`

---

## 10. 성능 최적화 Pass #3

이번 패치에서 확인된 D3 후기 비용 중 반복성이 높은 부분부터 줄였다.

### 10.1 Housing row cache

`housingRowsD3()` 결과를 다음 조건으로 재사용한다.

- 같은 calendar day
- 같은 resident epoch
- 같은 territory size

실제 Person 이동 시 cache를 즉시 무효화한다.

### 10.2 생활권 / 행정권 lookup cache

D3 원격 주거 후보를 정렬할 때 타일마다 `urbanSummary()`와 `adminModel()`을 반복 호출하던 경로를 날짜 단위 map lookup으로 바꿨다.

### 10.3 V0.29 내부 경로비 cache

`routeCost29()`의 `internalPathCost()`는 Person job 탐색·국내경제·통근 계산에서 매우 자주 호출된다.

D4는 짧은 15 calendar-day bucket 안에서 동일 국가·동일 타일쌍 경로비를 재사용한다.

cache signature에는 현재 territory size와 technology count가 포함된다. 짧은 bucket을 사용해 도로/영토 변화에 장기간 오래된 경로가 남지 않게 한다.

### 10.4 구조수요 계산 cache

같은 날짜의 한 국가에 대해 Housing blocker / Expansion blocker / 구조수요를 국제 거래후보마다 다시 계산하지 않고 재사용한다.

이 패치는 후기 모든 비용을 해결하는 최종 최적화는 아니다. 특히 Person daily 행동과 분기 시작 maintenance/seasonal workload는 향후 장기 데이터에서 계속 관찰한다.

---

## 11. 세이브 호환성

- 신규 save version: `0.32D4`
- 신규 localStorage key: `village-observer-v0-32d4`
- fallback: D3 → D2 → D1 → D → C2 → C1 → B/A → 31 계열
- D4는 Village별 `v32d4` 상태 저장
- World에는 bilateral trade memory와 water audit 저장
- D3 save를 D3 migration chain으로 불러온 뒤 D4 상태를 부착

실제 D3 신규세계 save를 D4 `World.from()`으로 로드해 다음을 확인했다.

- load 성공
- D4 재직렬화 version `0.32D4`
- 6개 국가 D4 state 생성
- 수역 재분류 완료
- 신규 기술 tree 유지

---

## 12. 구현 검증

### 12.1 JavaScript / 브라우저 smoke

- 전체 inline script 추출 후 `node --check` 통과
- Chromium headless 초기화 성공
- page error 0
- console error 0
- runtime badge `V0.32D4`
- D4 save version 확인

### 12.2 건축공간 최종 cap

관련 선행기술 + 「도시 정비」를 모두 보유한 강제 테스트:

- 평야: 28
- 초지: 27
- 숲: 25
- 암지: 20
- 산지: 16.5

실제 `V017.accessiblePotential()`과 D4 UI 진단값이 일치했다.

### 12.3 Market Gold 국제거래 / 보존성

강제 Stone 부족국과 잉여국을 연결한 테스트:

- 구매 Market: `120.00G → 111.04G`
- 판매 Market: `5.00G → 13.96G`
- 구매 Treasury: 변화 없음
- 판매 Treasury: 변화 없음
- 세계 관측 통화량 delta: `0`
- Stone: 판매국 `-16`, 구매국 `+16`

즉 일반 국제교역이 실제 Market→Market 결제로 전환되고 Gold·자원이 보존된다.

### 12.4 Treasury 긴급지원

구매국 Market Gold를 0으로 두고 Stone 구조수요를 높인 테스트:

- Treasury가 약 5.08G를 구매 Market에 보조
- Market이 같은 금액을 판매 Market에 결제
- 거래 후 구매 Market은 0G
- 구매 Treasury가 정확히 보조액만큼 감소

즉 긴급 수입에서도 Treasury가 외국으로 직접 결제하지 않고 Market을 경유한다.

### 12.5 반복 구매 프리미엄

동일 buyer가 동일 seller에게 Stone을 연속 구매하도록 한 결정적 테스트의 제시 단가:

```text
0.499 → 0.565 → 0.588 → 0.607 G
```

반복수요 프리미엄:

```text
0.000 → 0.135 → 0.183 → 0.222
```

즉 상대국의 지속 구매를 판매국이 가격에 반영한다.

### 12.6 3,600 sim-day smoke

무개입 신규세계에서 3,600 sim-day를 자동 진행했다.

- page error 0
- 6개 국가 시스템 유지
- 국제교역 V2가 실제로 발생
- 한 random run에서 11년 시점 D4 거래 63회 / 누적 약 440 resource units 관측
- Housing blocker / Trade Funnel / Market Gold telemetry 정상 생성

이는 장기 100년 밸런스의 최종 합격판정이 아니라 **런타임/시스템 작동 smoke**다. D4의 실제 후기 밸런스와 1,500~2,000 Person 성능은 다음 장기주행 데이터로 재평가한다.

---

## 13. D4에서 의도적으로 하지 않은 것

- 실제 전투
- Formation 간 교전
- 사상자 / 포로 / 점령
- 금수조치 정책 UI
- 무기 전용 전략물자 체계
- 새로운 군사시설
- Person 가중치/추상인구 시스템
- 여러 타일 = 하나의 Settlement 구조 전환

이 항목들은 D4 안정화 결과를 확인한 뒤 V0.32E 또는 이후 구조개편에서 다룬다.
