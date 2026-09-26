# Village Observer V0.32D5

**릴리스명:** 후기 도시·물류·국제경제 안정화 — Housing Priority · National Food Relay · International Quote Board · Performance Pass #4  
**버전:** `0.32D5`  
**기준 버전:** `V0.32D4`  
**세이브 키:** `village-observer-v0-32d5`

V0.32D5는 D4의 96년 장기주행에서 새로 드러난 후기 병목을 정리하는 D계열 후속 안정화 패치다. D4에서 국제교역은 실제 주요 경제활동으로 살아났고, 티아·키오의 기존 주거 교착도 크게 완화됐다. 그 대신 벨른·노렌의 `PROJECT_OR_LABOR`형 주거 교착, 키오의 국가 전체 식량과 부가 충분한데도 일부 Settlement가 굶는 last-mile 문제, 0.2 단위 산업 microtrade, 반복수요 프리미엄 과포화, 수출국 Market Gold 집중이 관측됐다.

D5의 원칙은 다음과 같다.

- 자원과 Gold는 가능한 한 **실제 보유 주체 사이에서 보존 이동**한다.
- D4의 `Settlement Market Gold → Settlement Market Gold` 국제결제 구조를 유지한다.
- 주거·식량 문제는 숫자를 생성해 덮지 않고 **프로젝트 우선순위와 실제 국내 물류**로 해결한다.
- 국제가격은 실제 AI가 사용하는 계산과 관찰 UI가 동일한 함수를 사용한다.
- 전투·점령·사상자 등 V0.32E 범위는 추가하지 않는다.

---

## 1. 후기 주거 교착 V2

### 1.1 `PROJECT_OR_LABOR` 세분화

D4에서는 주거가 부족한데 건축공간은 충분한 국가가 최종적으로 `PROJECT_OR_LABOR` 하나로만 표시됐다. D5에서는 주거 해결 경로를 다시 진단해 다음과 같이 세분화한다.

- `PROJECT_CAP`: 실제 건설 프로젝트 슬롯이 가득 참
- `NO_BUILDERS`: 주거 프로젝트를 진행할 성인 노동력을 찾기 어려움
- `LABOR_SHORTAGE`: 진행 중 주거공사가 장기간 노동 부족으로 정체
- `HOUSING_PROJECT_QUEUE`: 이미 주거 프로젝트가 진행/대기 중
- `MATERIAL_PAYMENT`: 공간은 있지만 실제 건축재·재정 경로에서 막힘
- `RELOCATION`: 다른 실제 빈 주거로 이동 가능
- `READY_FOR_HOUSING`: 실제 빈 건축공간에 주택을 시작할 수 있음
- `LAND_DEVELOPMENT`: 토지정비가 필요한 상태
- `SPACE_CAP`: 현재 기술/지형 상한까지 포화

이 값은 `housingBlocker32D5`로 snapshot/CSV에 기록된다.

### 1.2 심각한 과밀 시 주거 우선 슬롯

주거 위기가 심한 국가에서 일반 건설 프로젝트가 마지막 슬롯까지 선점해 주택이 계속 밀리는 현상을 줄인다.

- 심각한 과밀 + 진행 중 주거 프로젝트 없음 상태에서는 마지막 일반 건설 슬롯을 주거용으로 사실상 예약한다.
- 생존 식량시설·방어 등 명확한 긴급 예외는 기존 경로를 유지한다.
- 기존 프로젝트를 강제로 취소하지 않는다.
- 주거가 정상화되면 예약 효과도 사라진다.

### 1.3 주거 해결 pulse

D3의 실제 주거 해결 경로를 유지하되 D5에서 약 15 calendar-day 간격으로 심각한 과밀국을 추가 점검한다.

우선순위는 기존 철학을 유지한다.

1. 실제 빈 주거로 Person 이동
2. 기존 주거 업그레이드
3. 실제 빈 건축공간에 주택 건설
4. 토지정비
5. 이후 확장 경로

원격 주택 후보가 여러 곳이면 완전히 무인인 타일보다는 성인 노동력이 존재하는 Settlement를 우선한다.

---

## 2. 국내 식량 Last-mile V2

D4 후기 키오에서는 국가 전체 식량과 Market Gold가 충분한데도 일부 Settlement가 `donors: 0` 상태를 반복하며 Hunger 100 및 아사까지 이어졌다. D5는 기존 V0.27/V0.28 국내 식량 물류를 1차 경로로 그대로 두고, 그 경로가 심각하게 실패할 때만 국가 단위 emergency relay를 사용한다.

### 2.1 National Food Relay

대상 조건 예시:

- 해당 Settlement 식량 비축이 약 6일 미만
- 또는 severe hunger가 실제로 존재

Donor 탐색은 국가 전체 실제 점유 Settlement로 확대된다.

- donor는 실제 잉여 식량을 보유해야 한다.
- donor 자체의 안전 비축을 침해하지 않는다.
- 이동량은 실제 `withdrawAt` / `depositAt` 경로를 사용한다.
- 식량을 생성하지 않는다.
- 기존 내부 물류 capacity가 있으면 우선 사용한다.
- 심각한 비상에서는 더 넓은 통행 가능 경로를 fallback으로 검토하되 거리비용에 따라 capacity가 감소한다.

### 2.2 Last-mile blocker

실패 사유는 D5 내부 통계에서 다음과 같이 분리된다.

- `NO_STOCK`
- `DONOR_RESERVE`
- `NO_ROUTE`
- `CAPACITY`
- `STORAGE`

실제 성공 이벤트는 `NATIONAL_FOOD_RELAY32D5`로 기록된다.

---

## 3. 국제 산업 Microtrade 억제

D4에서 철광석/철/도구가 0.2~0.3 단위로 매우 자주 이동해 거래 횟수·가격 기억·로그·계산량을 과도하게 늘리는 현상이 나타났다.

D5는 자원별 최소 경제적 거래량을 둔다.

| 자원 | 기본 최소 lot |
|---|---:|
| 식량/목재/석재 | 1.2 |
| 철광석 | 1.5 |
| 철 | 0.75 |
| 도구 | 0.5 |

구조적/산업적 긴급도가 충분히 높으면 최소 lot을 절반 수준까지 완화할 수 있으나 최소 0.25 미만으로는 내려가지 않는다.

따라서 D4에서 관측된 `iron_ore 0.22` 같은 정상 microtrade는 D5에서 대부분 `MIN_QTY`로 보류된다. 작은 수요는 이후 누적되어 경제적 lot이 되면 거래될 수 있다.

`microTradeSuppressed32D5`가 누적 차단 횟수를 기록한다.

---

## 4. 반복구매 프리미엄 V2

D4의 반복구매 프리미엄은 거래 횟수 영향이 커서 작은 microtrade가 반복되어도 +30% 상한에 빠르게 도달할 수 있었다.

D5에서는 최근 약 3년의 국가쌍×자원별 거래 기억을 사용한다.

반영 요소:

- 누적 거래량
- 누적 거래액
- 거래 횟수
- 해당 판매국에 대한 구매 의존도
- 최근 거래 이후 경과시간

거래가 멈추면 프리미엄은 자연스럽게 약해진다.

또한 전략적 경계 프리미엄과 반복수요 프리미엄의 합산에 약 38% 상한을 두어 두 요소가 동시에 극단적으로 누적되는 것을 막는다.

---

## 5. Market Gold 과잉의 내생적 환류

D4에서 수출 강국의 특정 Market에 Gold가 크게 집중될 수 있음이 확인됐다. D5는 이를 강제 재분배하지 않는다.

대신 30 calendar-day 단위로 Settlement의 Market Gold가 현지 유동성 안전선보다 충분히 높을 경우 극히 일부가 실제 성인 Person wallet으로 배당된다.

`Settlement Market → Person wallet`

- Gold 생성 없음
- 국가 간 강제 이전 없음
- 수출로 축적된 상업자본이 임금/소비 경제로 다시 일부 흘러갈 통로를 제공

이 값은 `MARKET_SURPLUS_DIVIDEND32D5`, `marketDividend32D5`에 기록된다.

---

## 6. Treasury 국제구매 지원 V2

국가 Treasury가 모든 수입 부족을 무한히 보조하지 않도록 지원 목적을 제한한다.

지원 가능한 대표 사유:

- `SURVIVAL_FOOD`
- `STRUCTURAL_WOOD`
- `STRUCTURAL_STONE`
- `STRATEGIC_INDUSTRY`

정상 결제 순서는 계속 다음과 같다.

1. 구매 Settlement Market Gold
2. 같은 국가 다른 Settlement의 안전선 초과 Market Gold
3. 명확한 긴급 조달일 때만 Treasury 지원

Treasury 지원에는 인구 기반 연간 budget이 적용된다. 생존 식량은 일반 구조수입보다 높은 허용치를 갖는다.

지원액은 사유별로 `tradeSupportByReason`에 누적되고 snapshot/CSV에는 식량 지원과 구조자원 지원이 별도 필드로 노출된다.

---

## 7. 교역 UI·자원 표시 일반화

D4 최근교역 UI 일부가 과거의 `food / wood / stone` 고정 이름표를 사용해 `iron_ore / iron / tools` 거래가 `undefined`로 보이는 문제가 있었다.

D5에서는 교역 표시를 `RESOURCE_DEFS` 기반으로 일반화한다.

현재 지원 자원:

- 식량
- 목재
- 석재
- 철광석
- 철
- 도구

추후 `RESOURCE_DEFS`에 자원을 추가하면 동일 UI가 자원명·아이콘을 자동으로 가져오도록 설계한다.

또한 D4의 「국제가격·시장결제」 박스가 아래 UI와 겹치던 문제를 제거하고 D5 교역 UI를 normal document flow로 재구성한다.

---

## 8. Trade Funnel V2

D4의 누적 Trade Funnel을 유지하면서 D5는 최근 1년 중심 관측을 추가한다.

30 calendar-day bucket 12개를 보관하며 최근 상황을 확인할 수 있다.

주요 blocker:

- `NO_DEMAND`
- `NO_SURPLUS`
- `MIN_QTY`
- `PRICE`
- `STRATEGIC_PREMIUM`
- `BUDGET`
- `STORAGE`

경로 실패는 더 세분화한다.

- `NO_ROUTE_MARKET`: 유효한 시장 endpoint 부족
- `NO_ROUTE_PATH`: 물리적 경로 없음
- `NO_ROUTE_RANGE`: 경로는 있지만 현재 교역거리 범위를 초과

이를 통해 “길이 없어서 거래가 안 되는가 / 가격이 안 맞는가 / 실제 잉여가 없는가”를 구분할 수 있다.

---

## 9. Performance Pass #4

D5는 D4에서 활성화된 국제시장과 후기 비상 시스템이 다시 SIM 비용을 폭증시키지 않도록 다음 원칙을 적용한다.

- 국가쌍×자원별 국제 거래 assessment를 같은 simulation day 안에서는 cache
- 하루가 끝나면 quote cache를 폐기해 UI가 현재 시장상태를 다시 읽도록 함
- microtrade를 사전에 억제해 실제 trade execution과 로그 횟수 감소
- 주거 비상 해결은 매일 전수 실행하지 않고 저빈도 pulse
- 국가 food relay도 기존 지역 물류가 실패한 심각한 경우만 저빈도로 실행
- 최근 Trade Funnel도 rolling bucket으로 집계

추가 성능 필드:

- `perfTrade32D5`
- `perfFoodRelay32D5`
- `perfHousing32D5`

D5의 장기 목표는 19×19 / Person 1,800~2,000 구간의 후기 SIM 비용을 계속 낮추는 것이다. 실제 80~100년 자연주행 결과는 이후 장기 데이터로 재평가한다.

---

## 10. D4에서 유지하는 핵심 구조

D5는 D4의 성공한 시스템을 되돌리지 않는다.

유지 항목:

- Settlement Market Gold → Settlement Market Gold 국제결제
- 국내 다른 Market 유동성 bridge
- 필요한 경우에만 Treasury 지원
- 실제 자원 보존 이동
- 국제가격의 전략 프리미엄
- 구조적 부족에 따른 buyer willingness 상승
- Build Space V2 / 도시 정비 기술
- D3/D4 실제 Person 주거 재배치
- 수역 `lake / coast / sea / ocean` 분류
- D4 주거 reserve 로그 집계
- Formation / 행정 시스템

전투는 여전히 비활성이다.

---

## 11. 국가쌍 국제시장 호가·매수의향 관측 UI

D5 교역 탭에 선택 국가와 상대 국가 사이의 **현재 국제시장 조건을 직접 보는 호가판**을 추가한다.

### 11.1 표시하는 두 방향

예를 들어 티아를 선택하고 상대국으로 키오를 선택하면:

- `키오 → 티아`: 티아가 키오에서 수입하는 조건
- `티아 → 키오`: 티아가 키오에 수출하는 조건

두 방향을 모두 보여준다.

### 11.2 자원별 표시값

`RESOURCE_DEFS`의 모든 거래 가능 자원에 대해 다음을 표시한다.

- 구매자의 최대 매수가 (`buyer willingness`)
- 판매자의 최소 판매호가 (`seller ask`)
- 운송비 포함 도착가격 (`landed price`)
- 예상 거래 가능 수량
- 현재 상태 / blocker

상태 예:

- 거래 가능
- 수요 없음
- 판매여력 없음
- 최소 lot 미달
- 가격 불일치
- 전략 프리미엄으로 불일치
- 자금 부족
- 저장공간 부족
- 시장 endpoint 없음
- 거리 초과
- 경로 없음

### 11.3 가격 상세

자원 행을 펼치면 실제 D5 quote 계산에 사용되는 요소를 보여준다.

- 판매국 국내 기준가격
- 구매국 국내 기준가격
- 반복수요 프리미엄
- 전략적 경계 프리미엄
- 관계 조정
- 판매국 현금압박 할인
- 운송비
- 최종 판매호가
- 최종 도착가격
- 구매국 최대 지불의사
- 최근 실제 체결가격

별도의 UI 전용 가격을 계산하지 않는다. **실제 AI 거래 assessment/quote 함수를 호가판도 그대로 사용한다.**

### 11.4 국가 국제시장 요약

호가판 상단에는 선택 국가의 최근 약 1년 기준:

- 국제 무역수지
- Settlement Market Gold
- 수입의존/자립 압력
- 당해 Treasury 국제구매 지원액

을 간단히 보여준다.

Trade Funnel 최근 1년 blocker도 함께 표시한다.

---

## 12. 자립 압력

최근 국제무역수지가 큰 폭의 적자이고 구조적 목재/석재 부족까지 이어지면 `selfReliancePressure32D5`가 상승한다.

이 값은 AI가 계속 무역만 반복하는 대신 일부 조건에서:

- EXPAND 선호를 소폭 높이고
- TRADE 선호를 소폭 낮추는

보정으로 사용된다.

이는 수입을 금지하는 정책이 아니며, 적자국이 실제 국내 생산·영토·자원확보 행동도 함께 고민하게 하는 약한 피드백이다.

---

## 13. 주요 D5 telemetry

국가 snapshot/CSV에 추가되는 대표 필드:

- `housingBlocker32D5`
- `housingPriorityBlocks32D5`
- `housingPriorityActions32D5`
- `foodRelayMoves32D5`
- `foodRelayQty32D5`
- `foodRelayTopBlocker32D5`
- `microTradeSuppressed32D5`
- `marketDividend32D5`
- `tradeBalance1y32D5`
- `selfReliancePressure32D5`
- `tradeFunnelRecentTop32D5`
- `tradeFunnelRecentCount32D5`
- `treasurySupportFood32D5`
- `treasurySupportStructural32D5`

Global snapshot 대표 필드:

- `foodRelayMoves32D5`
- `foodRelayQty32D5`
- `microTradeSuppressed32D5`
- `marketDividend32D5`
- `housingPriorityActions32D5`
- `perfTrade32D5`
- `perfFoodRelay32D5`
- `perfHousing32D5`

---

## 14. 세이브 호환성

D5 저장 버전은 `0.32D5`다.

로드 시 우선순위:

1. V0.32D5
2. V0.32D4
3. V0.32D3
4. V0.32D2 / D1 / D
5. 기존 C2 이하 호환 fallback

D4 이하 세이브에는 D5 상태가 없으므로 로드시 기본 상태를 생성하고 현재 세계 상태에서 주거 blocker 등 파생값을 다시 계산한다.

D5 저장 시 Nation별 `v32d5` 상태가 직렬화된다.

---

## 15. 구현 검증

릴리스 패키징 전 다음 검증을 수행했다.

### 정적 검증

- 최종 `index.html`의 inline script 58개를 각각 JavaScript 문법 검사
- 전체 통과

### 런타임 smoke

UI 인스턴스화를 제외한 실제 simulation script를 Node VM 환경에서 로드하여:

- fresh world 생성
- D5 attach
- 500일 연속 simulation advance
- D5 저장
- D5 재로드

을 통과했다.

### D4 → D5 호환

D4 형태의 save version을 D5 `World.from()` 경로에 투입해:

- `0.32D5`로 재직렬화
- 6개 active nation 보존
- Nation별 D5 상태 생성

을 확인했다.

### 국제교역 보존성 강제 테스트

두 국가만 활성화하고 실제 Market Gold를 사용한 목재 국제거래를 강제로 성립시켰다.

검증 결과:

- 구매국 목재 증가량 = 판매국 목재 감소량
- 세계 목재 총량 변화 = 0
- Treasury + Settlement Market + Person wallet 합산 Gold 변화 = 0

### Microtrade 테스트

도구 수요를 0.2 수준으로 강제해 assessment한 결과 정상 긴급도가 아닌 경우 `MIN_QTY`로 차단되는 것을 확인했다.

### Quote cache

현재 quote를 읽은 뒤 simulation day를 진행하면 D5 quote cache가 폐기되어 다음 렌더에서 현재 시장조건을 다시 계산하는 것을 확인했다.

> 이 검증은 시뮬레이션 로직·직렬화·보존성 중심이다. 실제 80~100년 자연주행의 장기 밸런스와 브라우저 화면 배치는 사용자 장기주행 데이터로 다시 검증해야 한다.

---

## 16. D5 장기주행에서 우선 확인할 항목

다음 피드백에서는 특히 아래를 확인한다.

1. 벨른·노렌형 주거 strain 90%+가 수십 년 고정되는지
2. `housingBlocker32D5`가 실제 원인을 유용하게 분리하는지
3. 키오형 `국가 식량 충분 + local donor 실패 + 아사`가 감소하는지
4. `NATIONAL_FOOD_RELAY32D5`가 과도하게 남발되지는 않는지
5. 철광석/철/도구 0.2대 microtrade가 실제로 감소하는지
6. 반복수요 프리미엄이 +상한에 과도하게 고정되지 않는지
7. 키오형 수출강국 Market Gold가 Person 소비·세금 경로로 일부 환류하는지
8. Treasury 국제구매 지원이 생존/구조적 부족 중심으로 제한되는지
9. 국제교역량 자체는 D4 수준의 활력을 유지하는지
10. 국가쌍 호가판의 값과 실제 직후 거래가격이 일관되는지
11. 90~100년 / Person 1,500~2,000 구간의 SIM / HOT 성능

---

## 17. 다음 단계

D5가 장기주행에서 위 항목을 안정적으로 통과하면 D계열 안정화 작업을 마감하고 **V0.32E 군사 확장**으로 넘어가는 것을 기본 로드맵으로 한다.

V0.32E 후보에는 실제 전투 규칙, 군사 목표, 방어/공격 의사결정, Formation 충돌 등이 포함될 수 있으나 D5에는 구현하지 않는다.
