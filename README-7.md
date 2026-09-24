# Village Observer V0.29 — 국내경제권 · Gold 순환 V2

Village Observer는 실제 주민(Person)의 생활·노동·이동·소비가 **Settlement → Nation → World** 변화로 이어지는 browser-based bottom-up 사회 시뮬레이션입니다.

V0.29의 핵심 목표는 V0.28에서 형성된 도시·생활권 위에 **정착지별 생산능력, 일자리, 수요, 가격, 물류, Person의 소득·소비와 Gold 흐름**을 연결하는 것입니다. 국가 경제를 하나의 숫자로 처리하지 않고 실제 Settlement와 Person 사이에서 자원과 Gold가 이동하도록 구성합니다.

저장 데이터 버전은 `0.29`, localStorage 키는 `village-observer-v0-29`입니다. 기존 V0.28 이하 저장은 fallback load 후 V0.29 런타임 필드를 안전한 기본값으로 붙이는 방식으로 호환합니다.

---

## 문서 역할

`README.md`는 **상세 기술 문서**입니다. 구현 의도, 계산 규칙, 호환성, 관측 항목, 검증 내용을 가능한 한 구체적으로 남깁니다.

게임 상단 버전 배지에서 여는 인게임 패치노트는 README를 대체하거나 축약한 파일이 아니라, **README의 핵심 변경점을 플레이 중 빠르게 확인하기 위한 요약 UI**입니다.

---

# 1. V0.29 핵심 경제 루프

V0.29에서 새로 강화하는 국내 순환은 다음과 같습니다.

`생산 → 노동/판매 수입 → Person 소비 → Settlement 상업자금 → 세금 → Nation 재정 → 공공지출 → Settlement/Person`

기존의 식량·목재·석재 실물 재고, 정착지별 가격, 국가간 교역, 도로·지형 물류, 외교·전략적 교역 억제는 유지합니다.

새 경제 시스템은 기존 경제를 교체하지 않고 그 위에 Person/Settlement 단위의 Gold 흐름을 추가합니다.

## 1.1 Person Gold

V0.29 Person에는 다음 런타임 값이 추가됩니다.

- `gold29`: 현재 개인이 보유한 Gold
- `income29`: 누적 수입
- `spending29`: 누적 소비
- `taxes29`: 누적 납세

성인 Person은 자신의 실제 직업과 생산성에 따라 임금을 받을 수 있습니다. 임금은 우선 근무 Settlement의 상업자금에서 나오며, 부족하면 국가재정이 제한적으로 보조합니다.

Person은 접근 가능한 상업 중심지를 선택해 일부 Gold를 소비합니다. 소비금액의 10%는 세금으로 Nation에 환류하고, 나머지는 해당 Settlement의 상업자금이 됩니다.

## 1.2 Settlement 상업자금

각 Settlement의 `v29Economy.marketGold`는 지역 시장이 실제로 사용할 수 있는 Gold입니다.

주요 흐름:

- 국가 공공지출 → Settlement 상업자금
- Person 소비 → Settlement 상업자금
- Settlement가 다른 Settlement의 자원을 구매 → 판매 Settlement로 상업자금 이동
- 임금 지급 → Person 지갑으로 이동

V0.29에서 추가한 내부 이전은 가능한 한 기존 Gold를 **다른 보유 주체로 이동**시키는 방식입니다. 단, V0.28 이하에서 이미 존재하는 국가간 교역 수수료·건설비·기타 기존 Gold source/sink까지 제거하는 버전은 아니므로 세계 전체 Gold 총량이 완전 보존되는 모델은 아닙니다.

## 1.3 정착지별 국내 자원거래

V0.29 국내거래는 국가 전체 재고를 순간이동시키지 않습니다.

각 Settlement의:

- 실제 food / wood / stone 재고
- 저장 한도 대비 재고비율
- Settlement별 시장가격
- 수요 압력
- 물류 경로비
- 도로 여부
- 상업자금

을 비교해 거래 후보를 찾습니다.

구매지와 판매지 사이에 실제 가격차·수요·수송비를 고려한 이익이 있어야 거래가 발생합니다. 거래가 성사되면 실제 stock이 출발 Settlement에서 빠지고 도착 Settlement에 적재되며, Gold도 구매지의 상업자금에서 판매지 상업자금으로 이동합니다.

식량이 심각하게 부족한 지역은 제한적인 국가 공공지출을 통해 지역 상업자금을 보조받을 수 있습니다.

## 1.4 정착지의 관찰용 경제 역할

각 Settlement에는 경제 상태를 관찰하기 위한 역할이 표시될 수 있습니다.

- 농업 생산지
- 목재 생산지
- 석재 생산지
- 상업 중심지
- 주거 중심지
- 혼합 정착지

이는 AI에게 고정 역할을 부여하는 시스템이 아닙니다. 실제 직업구조, 자원재고, 인구, 통근, 상업 중심성으로부터 매번 **관찰 결과로 계산되는 라벨**입니다.

---

# 2. 생산시설의 실제 근무 슬롯

V0.29에서는 특정 생산·상업·교육 직업이 시설 수와 무관하게 무한히 늘어나는 것을 막습니다.

Person 개체는 그대로 유지하며, 시설이 제공하는 실제 직업 슬롯에 배치됩니다.

## 2.1 시설별 기본 슬롯

현재 V0.29 초기값:

| 시설 | 직업 | 기본 최대 인원 | 기술 증가 |
|---|---|---:|---|
| 고대 경작지 | 농부 | 7 | 관개 +1, 윤작 +2 |
| 고대 채석장 | 광부 | 3 | 공학 +1 |
| 고대 전문 채석장 | 광부 | 6 | 공학 +1 |
| 고대 시장 | 상인 | 3 | 표준 도량형 +1 |
| 고대 대시장 | 상인 | 7 | 상법 +1 |
| 고대 교역소 | 상인 | 2 | 장거리 교역 +1 |
| 고대 상단 회관 | 상인 | 5 | 상법 +1 |
| 고대 항구 | 상인 | 2 | 항해술 +1 |
| 고대 학당 | 학자 | 2 | 교육 +2 |

건물 condition이 낮아지면 실제 사용 가능한 슬롯도 감소하며, condition 0의 시설은 슬롯을 제공하지 않습니다.

## 2.2 초기 생존용 비시설 노동

초기 문명이 시설 건설 전부터 즉시 붕괴하지 않도록, **유한한 비시설 생계 슬롯**은 남깁니다.

농업:

- 평지 5
- 초지 5
- 숲 3
- 암석지 2
- 산지 1

광업/채석:

- 암석지·산지 3
- 기타 통행 가능한 육지 2

핵심 정착지에 상업시설이 아직 없으면 소규모 교환 기능으로 상인 2 슬롯을 임시 제공할 수 있습니다.

중요한 점은 이 역시 무한 노동력이 아니라 **명시적인 상한**을 갖는다는 것입니다.

## 2.3 직업 재배치

시설 직업을 가진 Person에게 유효한 실제 슬롯이 없으면 유령 생산을 허용하지 않습니다.

- 유효 슬롯 탐색
- 다른 같은 직업 슬롯 탐색
- 없으면 `무직`으로 전환
- 빠른 직업 재검토 예약

안정적으로 취업 중인 Person은 매일 전체 직장을 다시 탐색하지 않습니다.

---

# 3. 식량 소비 증가

V0.28 P1 장기 데이터에서는 세계 총식량이 충분한데도 특정 도시의 접근성 문제가 나타나는 한편, 세계 총량 자체는 후기에도 넉넉한 경우가 많았습니다.

V0.29 합의값은 3일 경제 사이클 기준:

- **0~14세: 0.30 food** (`0.25 → 0.30`)
- **15세 이상: 0.42 food** (`0.36 → 0.42`)

360일 기준 단순 연환산:

- 아동: 약 36 food / year
- 15세 이상: 약 50.4 food / year

기존 V0.28 metabolism/Hunger 시스템은 유지하고, 기존 소비량과 합쳐 최종 요구량이 위 값이 되도록 추가 차감합니다.

Settlement/Nation의 V0.29 식량 비축일 계산도 연령별 실제 요구량을 사용합니다.

---

# 4. 후기 목재·석재 수요 조정

V0.28 후기 데이터에서 목재는 지속적으로 과잉축적되는 경향이 강했지만, 석재는 일부 국가에서 실제 건축 병목이 되었습니다.

따라서 동일 배율을 적용하지 않습니다.

## 4.1 최종 규칙

- 초기 / T1 건물 기본 건설비: **변경 없음**
- 고티어 건설·개축: **목재 ×2.0**
- 고티어 건설·개축: **석재 ×1.2**
- Gold 요구량: **기존값 유지**

현재 고티어 적용 대상:

- `row_house`
- `collective_house`
- `merchant_guild`
- `grand_market`
- `deep_quarry`
- `stoneworks`

예를 들어 기본 비용이 `wood 24 / stone 15 / Gold 7`인 고티어 공사는 V0.29 재료 배율 적용 뒤 `wood 48 / stone 18 / Gold 7`을 요구합니다. Architecture 등 기존 비용 감소가 먼저 적용되는 경로에서는 그 결과값에 V0.29 재료 배율이 적용됩니다.

UI에는 현재 진행 중 공사의 실제 비용을 표시하며, 아직 시작하지 않은 발전단계는 **후속 고도화 후보**로 표시합니다. 이는 모든 수요·AI 조건이 즉시 충족됐다는 뜻은 아닙니다.

---

# 5. Settlement 상세 화면 V2

기존 상세 화면의 큰 KPI 카드가 많은 공간을 차지하면서도 실제 건물 정보를 충분히 보여주지 못했던 문제를 보완합니다.

## 5.1 Compact KPI

상단 정보를 작은 그리드로 압축합니다.

- 등급 / 도시성
- 주민 / 주거수용력
- 평균 행복
- 시설 근무슬롯 사용량
- 통근 유입 / 유출
- V0.29 실제 식량소비 기준 비축일
- 관찰용 경제 역할
- 소속 생활권 규모
- 지역 상업자금
- 기존 요약 카드와 동일한 분기 유지관리 값

## 5.2 보유 건물 목록

정착지가 실제 보유한 건물을 유형별로 집계해서 보여줍니다.

예:

- 고대 주택 ×4
- 고대 경작지 ×2
- 고대 시장 ×1

각 항목을 펼치면 개별 Building 단위 정보를 확인할 수 있습니다.

- 건축 세대
- 티어
- condition
- 주거단위 / 수용량
- 실제 근무자 / 최대 근무슬롯
- 저장공간 기여
- 분기 유지관리 재료 / 노동
- 진행 중 개축·전문화
- 공사 진행률
- 실제 필요 비용
- 후속 고도화 후보와 V0.29 배율이 반영된 예상 재료비

내부 Building ID는 V0.28 P1과 동일하게 유지합니다.

---

# 6. 생활권 지도 시각화 V1

V0.29에서 **경제권 지도는 구현하지 않습니다.** 사용자가 원한 지도 시각화 대상은 V0.28 P1의 `생활권`입니다.

지도 레이어 선택기에 **생활권**을 추가했습니다.

## 6.1 의미

생활권은 V0.28 P1에서 수정한 **hub-anchored 기능권**을 그대로 사용합니다.

- 중심 Settlement(hub)가 존재
- 각 구성 Settlement는 hub와 직접적인 통근 또는 제한된 공간 관계를 가져야 함
- A-B-C-D 징검다리만으로 국가 전체가 하나로 합쳐지는 connected-component 방식으로 되돌리지 않음
- 생활권은 행정구역이 아님
- V0.30의 City / Administrative Area와 별도 개념

## 6.2 지도 표현

- 같은 생활권의 Settlement: 같은 색 계열
- 생활권 구성 Settlement: 진한 반투명색 + 경계
- hub: 원형 테두리 + 확대 시 `L` 표시
- 생활권 구성 Settlement 주변의 같은 국가 영토: 옅은 근접 영향권
- 생활권 미소속 Settlement: 기존 지도 표현 유지
- 기존 국가 경계는 기본 지도 렌더 뒤 오버레이되는 구조를 사용

타일 inspector에서 생활권에 속한 정착지를 선택하면:

- 국가
- 포함 Settlement 수
- 생활권 총인구
- hub 타일
- 비행정 기능권이라는 설명

을 표시합니다.

---

# 7. 성능 최적화

V0.28 P1 약 2,900명 장기 데이터에서는 `villageDaily`, `personAct`, `jobReviews`가 후기 비용의 핵심이었습니다.

V0.29는 경제 기능을 추가하면서도 Person을 숫자로 통합하지 않고, **변하지 않은 정보를 다시 계산하지 않는 방향**으로 최적화합니다.

## 7.1 Settlement 공통 캐시

약 15 calendar-day bucket과 resident epoch를 이용해 다음 공통값을 묶어 계산합니다.

- alive / adults
- tile별 resident 목록
- tile별 adult 목록
- tile별 worker 수
- tile별 직업 구성
- 가격 / 재고 / 저장비율
- 도시성 / 등급
- 통근 유입·유출
- 상업 hub score

Person마다 같은 Settlement 통계를 다시 필터링하지 않습니다.

## 7.2 노동 / vacancy index

약 30 calendar-day bucket, 주민 epoch, 건물·condition·기술 signature를 이용해 실제 근무슬롯을 인덱싱합니다.

- 직업별 슬롯
- tile별 슬롯
- 사용량 / 최대량
- 실제 근무 Building index

안정적으로 취업 중인 Person의 구조적 직업 재검토 간격은 대략 120~210일, 무직은 45~90일 범위를 사용합니다. 시설이 사라지거나 실제 슬롯이 무효가 된 경우는 즉시 재평가할 수 있습니다.

## 7.3 경로비 공용화

V0.29는 별도의 중복 pathfinder를 만들지 않고 V0.27 이후 존재하는 `internalPathCost` / topology-front cache를 공유합니다.

같은 경로비는:

- 직장 탐색
- 시장 접근
- 국내 자원거래

에서 재사용합니다.

## 7.4 경제 계산 주기 분리

Person의 생존/기존 일상 tick과 별도로 V0.29 국내경제 pulse는 **30 calendar-day** 단위로 실행합니다.

매일 모든 Person이 가격·시장·국내거래 전체를 다시 평가하는 구조를 피합니다.

## 7.5 이주 churn 추가 완화

V0.28 P1의 3년 역이주 억제를 그대로 유지하고, V0.29에서는 일반적인 정착 관성을 더 길게 적용합니다.

- 도시집약형 일반 가드: 약 720일
- 기타 성향 일반 가드: 약 900일
- 주거부족·심각한 식량위기 등 P1의 긴급이주는 예외 가능
- 실제 이주가 일어나면 거리에 따른 소액 Person Gold 이동비를 목적지 상업자금으로 이전

---

# 8. V0.29 Telemetry

기존 V0.28 telemetry를 유지하면서 다음 경제/노동 항목을 추가합니다.

Nation 및 global snapshot 주요 추가 필드:

- `personGold29`
- `settlementMarketGold29`
- `domesticTrades29`
- `domesticTradeVolume29`
- `domesticTradeGold29`
- `wages29`
- `consumption29`
- `taxes29`
- `publicSpending29`
- `unemployed29`
- `jobCapacity29`
- `jobUsed29`

Global JSON 성능 진단:

- `v29SettlementCacheMs`
- `v29LaborIndexMs`
- `v29JobSearchMs`
- `v29DomesticEconomyMs`
- `v29MigrationEvalMs`
- `v29RouteLookupMs`

국내 실물 거래는 `DOMESTIC_TRADE29` 이벤트로 기록합니다.

---

# 9. 인게임 경제 UI / 백과 / 패치노트

## Nation 경제 화면

기존 경제 화면 상단에 V0.29 요약을 추가합니다.

- Person 지갑 Gold
- Settlement 상업자금
- 누적 임금
- 누적 소비
- 세금 환류
- 국내거래 횟수 / 물량
- 현재 정착지 경제 역할 분포

## 백과

건설·생산·물류 관련 백과에 V0.29 규칙을 추가합니다.

- 고티어 목재 ×2.0 / 석재 ×1.2
- 연령별 식량소비
- 시설 근무슬롯
- 국내경제와 생활권 지도 설명

## 패치노트

상단 버전 배지는 `Village Observer · V0.29`를 표시합니다.

패치노트 순서:

1. V0.29 — 기본 펼침
2. V0.28 P1 — 접힘
3. V0.28 — 접힘

README는 계속 상세 문서로 유지합니다.

---

# 10. 저장 호환

- World save version: `0.29`
- localStorage: `village-observer-v0-29`
- V0.28 이하 fallback load 유지
- 기존 내부 Building ID 유지
- V0.29 미존재 Person/Settlement/Nation 필드는 load 시 기본값 생성
- V0.29 → V0.29 save/load roundtrip 지원

V0.29 serialize metadata에는 다음이 기록됩니다.

- 식량 요구량
- 고티어 wood/stone multiplier
- 국내 Gold 시스템
- finite job slots
- Settlement economy
- life-zone map
- optimization revision

---

# 11. V0.29에서 의도적으로 미룬 범위

다음 기능은 이번 버전의 역할이 아닙니다.

- **경제권 지도 레이어**: 보류. 현재 지도 시각화는 생활권만 대상
- **City / Administrative Area / 공식 행정통합**: V0.30
- **철광석 → 제련 → 철제품 경제**: V0.31
- **실제 군사 Person·장비·보급**: V0.32
- **전쟁 V1**: V0.33

생활권과 Settlement 경제 역할을 V0.30 행정구역으로 자동 변환하지 않습니다.

---

# 12. 검증 기록

이번 빌드는 V0.28 P1 `index.html`을 기반으로 V0.29 패치 레이어를 적용하고 다시 standalone HTML로 조립했습니다.

## 정적 검증

- inline JavaScript 36개 추출
- 전부 `node --check` 통과

## Chromium 실제 로드

확인 항목:

- document title: `Village Observer V0.29`
- 상단 badge: `Village Observer · V0.29`
- world serialize version: `0.29`
- 패치노트 순서: V0.29 / V0.28 P1 / V0.28
- V0.29만 기본 펼침
- 생활권 map option 존재
- 생활권 layer render 성공
- patch modal open 성공
- runtime exception 0

## 10년 deterministic 회귀 테스트

테스트 런타임에서 world 생성 직후 난수를 고정한 뒤 3,600 calendar-day를 진행했습니다. 생산 코드의 RNG 자체는 변경하지 않았습니다.

결과 예시:

- 시작 인구: 100
- 약 10년 후 인구: 157
- active nations: 6 / 6
- 영토: 28 tiles
- food: 약 2779.9
- wood: 약 141.1
- stone: 약 1437.2
- 국내 거래: 68회
- 시설 job capacity: 219
- 실제 사용 슬롯: 73
- 생활권: 10개
- runtime exception: 0

즉 초기 finite-slot 조정 때문에 문명이 초반에 붕괴하지 않는지, 국내거래가 실제로 발생하는지, 자원재고와 생활권이 유지되는지를 짧은 장기런으로 확인했습니다.

이는 60~100년 장기 밸런스 검증을 대체하지 않습니다. 특히 후기 목재·석재 재고, 식량압박, 3,000명 이상 성능, Settlement별 Gold 편중은 실제 플레이 장기 데이터로 추가 검증해야 합니다.

## Save migration / UI 회귀

- V0.29 serialize → V0.29 load: 인구 동일, version `0.29`
- V0.28 형식 경로를 통한 load 후 V0.29 attach: 성공
- Settlement 상세 compact KPI: 렌더 성공
- 보유 건물 / 실제 근무슬롯: 렌더 성공
- 390×844 모바일 viewport: 가로 overflow 없음
- 모바일 패치노트 modal: open 성공

---

# 13. 다음 장기 데이터에서 특히 확인할 항목

V0.29의 첫 실제 장기 플레이에서는 다음 항목을 우선 관찰합니다.

1. 30 / 50 / 70 / 90년의 world food·wood·stone 재고
2. 목재 과잉축적이 실제로 완화되는지
3. 석재 ×1.2가 노렌 같은 건설집약 국가를 과도하게 막지 않는지
4. 농경지/채석장 job slot 부족이 시설투자·통근·이주를 유도하는지
5. 무직 비율과 vacancy가 동시에 과도하게 커지지 않는지
6. Person Gold / Settlement market Gold / Nation Gold 분포
7. 국내거래량과 생산지·상업 중심지 역할 분화
8. 도시 식량 stress와 아사 발생 여부
9. P1 이후 남아 있던 장거리 migration churn 변화
10. 생활권 레이어가 실제 공간구조를 이해하는 데 유효한지
11. 3,000~5,000 Person에서 `jobSearch`, `jobReview`, `domesticEconomy`, `routeLookup` 비용
12. V0.28 P1 약 2,900명 / 137ms-day 수준 대비 V0.29 후기 성능

V0.29의 성능 목표는 경제 기능이 늘었더라도 **3,000명대에서 V0.28 P1 후기보다 현저히 느려지지 않는 것**입니다.
