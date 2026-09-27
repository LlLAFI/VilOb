# Village Observer V0.32E8


**릴리스명:** Commercial Stabilization + Construction Proposal V1  
**버전:** `0.32E8`  
**기준 버전:** `V0.32E7`  
**세이브 키:** `village-observer-v0-32e8`

V0.32E8은 E7 자연주행에서 확인된 두 문제를 직접 수정한다. 첫째, `merchant_guild`가 과거 국제교역 hotspot의 정확한 타일에만 효과가 묶여 실제 endpoint가 옆 Settlement로 이동하면 `guildHandledTrades32E7=0`이 되던 endpoint drift를 해결한다. 둘째, `grand_market` 후보가 Market 건물 자체의 국내 endpoint 실적만 보아 Y76까지 한 번도 자연발생하지 않던 trigger 단위를 생활권/행정권 상업권으로 확장한다.

동시에 Construction Proposal V1을 도입한다. 이 계층은 기존의 검증된 물리 착공 시스템(`startConstruction`, `payBuild`, 실제 자재·Gold·노동)을 대체하지 않는다. 전략 교역소, 철산업, 군사시설, 고급 상업시설이 각각 별도 진단 언어를 사용하던 앞단을 `family / type / tile / priority / blocker` 공통 형식으로 관측하고 이후 건설 스케줄러 일반화의 브리지로 사용한다.

E6 육상 운송회계 완료 판정과 **자연발생 해상 운송회계 전용 해안/항구 회귀 테스트** 메모는 그대로 유지한다.

---

## E8 핵심 변경

### 1. Merchant Guild Regional Commercial Sphere

E7은 국제 거래의 `buyerTileId / sellerTileId`에 `merchant_guild`가 직접 존재할 때만 Guild 효과를 적용했다. E8은 각 endpoint가 이용 가능한 상단 회관을 다음 순서로 찾는다.

1. 동일 endpoint 타일의 상단 회관 — strength 1.00
2. 동일 생활권(life zone)의 상단 회관 — 최대 strength 0.85
3. 동일 행정권의 상단 회관 — 최대 strength 0.72
4. 지도거리 3 이하 인접 상업권 — 최대 strength 0.58
5. 지도거리 5 이하 지역권 — 최대 strength 0.38

이 strength는 E6 운송회계의 상업 handling factor와 운송서비스 소득 배분에만 사용한다. 물리 route cost, 도로, 항구, 거리 자체를 우회하지 않는다. 양쪽 상업권의 strength 합에 따라 handling factor를 계산하며 기존 하한 0.90을 유지한다. 상단 회관이 직접 거래 endpoint가 아니더라도 같은 상업권의 거래를 처리하면 `guildRegionalHandledTrades32E8`, `guildRegionalTransportGold32E8`, `guildRegionalHandlingSavings32E8`에 기록된다.

상단 회관이 있는 쪽의 운송서비스 대금은 가능하면 해당 Guild 타일의 실제 상인 Person에게 분배하고, 그 타일에 상인이 없으면 기존 국가 상인 fallback을 사용한다. Gold 총량 보존은 E6 transport audit가 계속 검사한다.

### 2. Grand Market Regional Trigger

`market → grand_market` 후보는 더 이상 Market 타일 하나의 국내 endpoint volume만 보지 않는다. Market이 속한 생활권을 우선 사용하고, 생활권이 없으면 행정권, 둘 다 없으면 반경 3타일의 동일 국가 정착권을 임시 상업권으로 사용한다.

상업권에서 집계하는 신호:

- 최근 1년 `DOMESTIC_TRADE29` endpoint 수량·횟수·Gold
- 상업권 전체 Settlement Market Gold
- 상업권 인구
- `v29Economy.consumption` 누적 소비 신호
- 해당 권역 최대 `hubScore`
- 도시집약형 AI 보정

충분한 국내 유통 실적 또는 Market Gold/인구 조합이 있고 적절한 시장·도시 기술이 있으면 실제 `specializationProjects`를 통해 대시장 고도화를 시작한다. 비용·Gold 공동투자·착공 실패 rollback은 E7의 보존형 원칙을 유지한다.

### 3. Construction Proposal V1

E8 Proposal은 다음 전략 건설 계열을 공통 형식으로 노출한다.

- `TRADE_NETWORK` — E4/E5 전략 교역소 intent
- `IRON` — V0.31H iron mine / smelter / smithy readiness
- `MILITARY` — V0.32C1 barracks / training ground / armory readiness
- `COMMERCE` — Merchant Guild / Grand Market 지역 전문화

공통 필드:

- family
- type
- target tile
- priority
- raw blocker
- normalized blocker
- score

공통 blocker:

- `PROJECT_CAP`
- `FINANCE`
- `MATERIAL`
- `SPACE`
- `TECH`
- `SURVIVAL`
- `PRIORITY`
- `OTHER`
- `READY`

V1에서는 기존 각 subsystem의 실제 실행 함수와 전략 슬롯 규칙을 바꾸지 않는다. seasonal tick에서 Proposal을 모아 우선순위와 blocker를 공통 telemetry/UI에 기록하고, 실제 전략시설이 기존 경로로 착공되면 `CONSTRUCTION_PROPOSAL_STARTED32E8`로 연결한다. E8 상업 전문화는 이 Proposal 구조를 실제 후보/착공 브리지로 사용한다.

### 4. E8 신규 관측값

Global snapshot / CSV:

- `constructionProposalReviews32E8`
- `constructionProposals32E8`
- `constructionProposalReady32E8`
- `constructionProposalStarts32E8`
- `constructionProposalChanges32E8`
- `constructionBlockProject32E8`
- `constructionBlockFinance32E8`
- `constructionBlockMaterial32E8`
- `constructionBlockSpace32E8`
- `constructionBlockTech32E8`
- `constructionBlockSurvival32E8`
- `constructionBlockPriority32E8`
- `constructionBlockOther32E8`
- `guildRegionalHandledTrades32E8`
- `guildRegionalTransportGold32E8`
- `guildRegionalHandlingSavings32E8`
- `grandMarketStarts32E8`
- `grandMarketCompleted32E8`
- `grandMarketRegionalCandidates32E8`
- `commercialMarketPoolGold32E8`
- `commercialMarketPoolTransfers32E8`

Nation row:

- `constructionProposalTop32E8`
- `constructionProposalBlocker32E8`
- `constructionProposalPriority32E8`
- `guildRegionalTradesNation32E8`
- `guildRegionalIncomeNation32E8`
- `guildRegionalSavingsNation32E8`
- `grandMarketStartsNation32E8`
- `grandMarketCompletedNation32E8`

### 5. 성능 정책

- 생활권/행정권 상업 컨텍스트는 nation/day 단위 캐시를 사용한다.
- V0.28 urban summary는 강제 재계산하지 않고 기존 캐시를 재사용한다.
- Proposal review는 seasonal tick에서만 실행한다.
- Guild lookup은 E6 국제 거래 quote/settlement 경로에서만 수행하며 per-Person daily loop에는 추가하지 않는다.
- 자연발생 해상 운송회계는 여전히 별도 전용맵 회귀 항목이다.

### 6. E8 검증 체크리스트

- 65개 inline script syntax 통과
- E8 API/fresh-world VM smoke 통과
- 강제 endpoint-drift 시나리오: Guild가 다른 타일의 endpoint를 동일 행정권에서 인식, handling factor < 1 확인
- 위 시나리오 E6 Gold audit delta = 0
- 강제 국내 상업권 시나리오: Market 타일 밖의 국내 endpoint 실적을 합산해 Grand Market 후보 생성
- 충분한 실제 자재/Gold 조건에서 Grand Market specialization project 착공 확인
- E8 serialize → reload → `0.32E8` 유지 확인


## E7 핵심 변경

### 1. Commercial Specialization V2 — 역할 분리

기존 V0.19 `tradeVolumeAt()` 혼합 지표를 E7 전문화 판단의 주 기준에서 제외하고 최근 1년 endpoint 실적을 두 종류로 나눈다.

- 국제 endpoint: `TRADE` / `recentTrades` 기반 수량, 거래횟수, 운송서비스 Gold
- 국내 endpoint: `DOMESTIC_TRADE29` 기반 수량, 거래횟수, 거래 Gold

한 simulation day 안에서는 한 번 만든 flow cache를 6개 국가가 공유한다. 후보 평가는 seasonal tick에서만 실행하며 daily Person loop에는 새 후보 탐색을 넣지 않는다.

### 2. 고대 상단 회관 — 국제교역·운송서비스 시설

`trading_post → merchant_guild` 전문화는 실제 국제 endpoint 실적이 쌓인 교역소에서만 발생한다. 기술 조건만 기다리는 방식이 아니라 `MARKET`/장거리교역 기술 또는 충분한 누적 교역경험과 최근 endpoint 실적을 함께 본다.

상단 회관의 역할:

- 기존 V0.19 상업 처리용량 및 상인 job slot 확대 유지
- E6 국제 운송단가의 **상업 handling 부분을 active endpoint당 최대 약 5% 절감**
- 구매/판매 양쪽 모두 상단 회관이면 효과 합산, 총 commercial handling factor 하한 0.90
- E6 운송서비스 대금 총액은 그대로 보존하되 상단 회관이 있는 국가 측 상인에게 서비스소득 비중을 더 배분
- 기존 E6 `transportAuditMismatches32E6` 감사 유지

상단 회관은 물리 route cost 자체를 순간이동식으로 줄이지 않는다. 도로·거리·항구가 결정한 route cost 위에서 계약·중개·조직화에 해당하는 상업 처리비만 줄인다.

### 3. 고대 대시장 — 국내 소비·Market Gold 순환 시설

`market → grand_market` 전문화는 국제교역량 대신 해당 Settlement의 국내 거래량, Market Gold, 인구 및 상업압력을 평가한다.

대시장이 활성화된 Settlement는 30 calendar-day 주기로:

- 기본 시장 유동성 reserve를 보존하고
- reserve를 넘는 Market Gold 중 작은 일부를
- 현지 성인 Person wallet으로 추가 환류한다.

이는 `Market → Person` 이동일 뿐 새로운 Gold를 만들지 않는다. 환류된 Gold는 기존 V0.29 소비 → Market → 세금 경로에 다시 투입될 수 있다. E7은 이 추가 환류가 일어난 경우에만 전체 money stock audit를 실행한다.

### 4. 보존형 상업 공동투자

전문화 대상 Settlement 하나의 Market Gold만으로 Gold 비용을 감당하지 못하더라도, 동일 국가의 접근 가능한 Settlement Market에 잉여 Gold가 있으면 전문 상업시설에 공동투자할 수 있다.

- donor Settlement별 최소 Market liquidity reserve 유지
- `internalPathCost`가 유효한 시장만 donor 후보
- 실제 donor Market Gold를 target Market으로 이동
- 기존 `payBuild()`와 Treasury-above-reserve 규칙을 그대로 통과해야 착공
- 최종 착공이 실패하면 이동 Gold를 원래 donor Market에 **전액 rollback**
- 실제 성공한 공동투자만 `commercialMarketPoolGold32E7`에 누적

철산업과 마찬가지로 회계 편의를 위해 Gold를 생성하지 않는다.

### 5. E7 신규 관측값

Global snapshot / CSV:

- `merchantGuildStarts32E7`
- `grandMarketStarts32E7`
- `merchantGuildCompleted32E7`
- `grandMarketCompleted32E7`
- `guildHandledTrades32E7`
- `guildTransportGoldCaptured32E7`
- `guildHandlingSavings32E7`
- `grandMarketRecycledGold32E7`
- `grandMarketCycles32E7`
- `commercialAuditChecks32E7`
- `commercialAuditMismatches32E7`
- `commercialFlowCacheBuilds32E7`
- `commercialFinanceBlocks32E7`
- `commercialSpaceBlocks32E7`
- `commercialMarketPoolGold32E7`
- `commercialMarketPoolTransfers32E7`

Nation row:

- `merchantGuilds32E7`
- `grandMarkets32E7`
- `maxIntlEndpointVolume1y32E7`
- `maxDomesticEndpointVolume1y32E7`
- `guildServiceIncomeNation32E7`
- `grandMarketRecycledNation32E7`

### 6. E6 해상 운송 회귀 메모

E6 육상 회계는 완료 처리한다. 검증 근거는 사용자 제공 PC/탭 자연주행 합산 962건 국제 운송회계에서 Gold audit mismatch 0이었다.

남은 항목:

- harbor가 실제 건설된 해안국
- `COASTAL_NAVIGATION` / `SEAFARING` 등 필요한 항해기술
- 실제 `transportMode=sea` 국제거래 최소 1건 이상
- 항구 condition/efficiency에 따른 운송단가 변화
- 육상/해상 혼재 상태에서 E6 Gold audit mismatch 0

이 검증은 E7 기능을 막는 release blocker로 두지 않고 E계열 공통 회귀목록에 유지한다.

### 7. 구현 검증

- 최종 `index.html` inline script 64개 JavaScript syntax 검사 통과
- Node VM fresh-world 7,200 calendar-day smoke 통과
- 21년차 이전 자연주행 smoke에서 고대 상단 회관 착공/완공 자연발생 확인
- E6 transport Gold audit mismatch 0 유지
- E7 Grand Market Market→Person 추가환류 Gold audit mismatch 0
- 강제 상단 회관 endpoint 테스트에서 commercial handling factor `0.95`, 상단 보유 구매국 측 운송서비스 소득 비중 증가 확인
- 강제 대시장 테스트에서 Market Gold 감소량 = Person Gold 증가량 확인
- 상업 공동투자 후 착공 실패 강제 테스트에서 donor/target Market Gold 완전 rollback 및 money stock 변화 0 확인
- E7 save/reload 및 E6→E7 로드 호환 통과
- snapshot CSV header/row 488열 일치

> 자연주행에서 대시장의 발생 시점과 후기 경제효과는 PC/탭 장기주행 데이터로 다시 평가한다.


---

## E6 핵심 변경

### 1. International Transport Accounting V1

국제거래 결제는 다음처럼 분리된다.

- 구매 Settlement Market: `상품대금 + 운송서비스 대금` 차감
- 판매 Settlement Market: **상품대금만** 수령
- 운송서비스 대금: 기존 양국의 `상인` Person Gold로 이전
- 한쪽에만 상인이 있으면 해당 측 상인이 전체 운송서비스 대금을 수령
- 양쪽 모두 상인이 없으면 판매자 endpoint Market이 서비스 대금을 수령

새로운 Gold를 생성하지 않으며 실제 거래마다 Treasury + Settlement Market + Person wallet 총합을 감사한다. `transportAuditMismatches32E6`가 0이어야 정상이다.

### 2. 실제 교역망이 실제 Gold 비용에 영향

운송단가는 기존 route cost를 기반으로 한다. 따라서 현재 pathfinder에서 도로가 route cost를 낮추면 E6의 실제 Gold 운송비도 함께 낮아진다. 해상 교역은 기존처럼 harbor endpoint가 필요하고, E6부터 양 항구의 실제 building efficiency/condition을 운송단가에 추가 반영한다.

E7의 Merchant Guild/Grand Market 현대화 전까지 별도의 운송회사, 마차대, 선단 entity는 추가하지 않는다.

### 3. 국제 무역수지 의미 수정

D5의 최근 무역수지는 landed gross Gold를 양국에 동일하게 잡았다. E6 거래부터는 구매국 내부 상인이 받은 운송소득은 해외유출에서 제외하고, 판매국 상인이 받은 운송소득은 해외유입에 포함한다. 즉 **실제 국경을 넘은 Gold 흐름**을 기준으로 계산한다.

### 4. 전략 교역소 blocker 상세화

기존 E4의 `PAYMENT_OR_STRATEGIC_GATE` / `OTHER`를 E6에서 다음 원인으로 추가 관측한다.

- `HOUSING_PRIORITY`
- `IRON_PRIORITY`
- `MILITARY_PRIORITY`
- `SURVIVAL_PRIORITY`
- `RESOURCE_RESERVE`
- `PAYMENT_REJECTED`
- `STRATEGIC_GATE`
- invalid/site/tech 계열

기존 E4 aggregate counter는 호환성을 위해 유지하고, E6 상세 counter를 별도로 추가한다.

### 5. E6 telemetry

세계 단위 주요 필드:

- `transportTrades32E6`
- `transportGoldPaid32E6`
- `transportMerchantIncome32E6`
- `transportMarketFallback32E6`
- `transportLandGold32E6`
- `transportSeaGold32E6`
- `transportAvgRouteCost32E6`
- `transportAuditChecks32E6`
- `transportAuditMismatches32E6`
- `transportAuditMaxAbsDelta32E6`
- `tradeBlockHousingPriority32E6`
- `tradeBlockIronPriority32E6`
- `tradeBlockMilitaryPriority32E6`
- `tradeBlockSurvivalPriority32E6`
- `tradeBlockResourceReserve32E6`
- `tradeBlockPayment32E6`
- `tradeBlockStrategicGate32E6`
- `tradeBlockOther32E6`

국가 단위에는 누적 운송비 지불, 국내 운송서비스 소득, 순 운송비 부담, 운송거래 수를 기록한다. 거래 row 자체에도 `goodsCost`, `transportCost`, `transportUnit`, `transportMode`, 양측 서비스 소득, 실제 국경 Gold 유출/유입을 보존한다.

### 6. 성능 정책

추가 전체 통화량 감사는 **실제 국제거래 체결 시에만** 실행한다. Person daily loop, settlement daily loop, planner 후보평가에는 새 timer나 고빈도 순회를 추가하지 않는다. 따라서 이번 패치는 성능 최적화가 아니라 회계 기능 패치이며 E5 PC/Tab 기준선 대비 회귀 여부만 검사한다.

### 7. E6 구현 검증

릴리스 전 개발용 Node VM harness에서 다음을 확인했다.

- inline script **63개 전부 syntax check 통과**
- fresh 19×19 world **2,400 simulation-day smoke 통과**
- 1,800-day 회계 검증 run에서 E6 운송거래가 자연 발생하고 `transportAuditMismatches32E6 = 0`, 최대 Gold audit 오차 0 확인
- 개별 거래에서 `gross = goodsCost + transportCost` 및 실제 국경 Gold 유출 = 상대국 유입 보존 확인
- E6 save → `World.from()` reload → 추가 진행 통과
- E5 형식 save를 E6가 불러와 자동 업그레이드한 뒤 `0.32E6`으로 재저장 확인
- `IRON_PRIORITY`, `MILITARY_PRIORITY` 상세 blocker 분류 강제 회귀 테스트 통과
- Snapshot CSV header/row **466 columns 일치**
- Dev JSON / save version `0.32E6` 확인

동일 개발 VM의 1,200-day 단일 sanity run은 E5 약 **9.19s**, E6 약 **9.07s**였다. 랜덤 진행과 harness 오차가 있으므로 최적화 성과로 해석하지 않으며, **새 회계 때문에 큰 성능 회귀가 생기지 않았는지**만 확인하는 참고값이다. 실제 성능 판정은 이전과 같이 PC/Tab 자연주행 telemetry를 우선한다.

---

> 아래 E5 및 이전 버전 섹션은 누적 기술 문서다.

## E5 누적 기술 기록

V0.32E5는 E4 자연주행에서 확인된 **전략 교역소 intent의 생명주기 오류와 PROJECT_CAP 장기 정체**를 정리하는 안정화 패치다. E4의 planner·물리 건설·route blocker 체계는 유지하면서, 실제 공사가 시작된 intent가 완공까지 끊기지 않도록 project와 결합하고 가치가 높은 장기 대기 intent에만 제한적인 construction-slot 우선권을 부여한다.

또한 E4의 `routeCostSavedEst`와 별도로 완공 직후의 실제 reachable partner 및 route cost 변화를 기록하고, 360 calendar days 뒤 실제 국제교역 누적량을 후속 관측한다. E5는 국제 운송비 산업 회계나 Merchant Guild/Grand Market 재설계까지 확장하지 않는다.

---

## E5 핵심 변경

### 0. Priority 0 — 공사 중 intent TTL 만료 수정

E4 자연주행에서 전략 교역소 공사가 720 calendar days보다 오래 걸리면 실제 공사는 계속되지만 infrastructure intent가 먼저 만료되는 문제가 확인되었다. E5는 **착공 전 intent에만 기존 720일 TTL을 적용**하고, 실제 `V32E4_STRATEGIC_TRADE_POST` construction project가 존재하면 TTL을 정지한다.

- 공사 중 intent는 project와 `projectId`로 연결된다.
- 완공되면 실제 Trading Post 존재를 확인한 뒤 intent를 완료한다.
- project가 사라졌는데 건물도 없다면 취소/유실로 종료한다.
- save/load 시 진행 중 전략 교역소 project와 intent를 재결합한다.
- E4 세이브에서 intent가 이미 유실된 상태라도 전략 교역소 project가 남아 있으면 `RECOVERED_BUILD` intent를 복구한다.

### 1. Soft Strategic Construction Priority

E4 장기주행에서 전략 교역망의 가장 큰 blocker는 자금·자재가 아니라 `PROJECT_CAP`이었다. E5는 모든 교역 intent에 강제 예약슬롯을 주지 않고 다음 조건에서만 마지막 일반 construction slot을 부드럽게 보호한다.

- 신규 교역 상대 예상이 있는 intent가 90일 이상 유지
- 예상 route-cost 절감이 4 이상이고 180일 이상 유지
- `PROJECT_CAP`에 360일 이상 막혔고 예상 route 절감이 2 이상

단, 아래 시스템은 항상 E5 교역 우선권보다 높은 우선순위를 가진다.

- 긴급 주거 건설
- 식량 reserve가 낮은 farmstead / granary
- iron mine / smelter / smithy 전략 산업 체인
- barracks / training ground / armory 등 군사 전략시설
- 높은 위협에서의 palisade

또한 실제 공사가 완료되어 project slot이 풀리면 다음 분기까지 기다리지 않고 기존 E4 intent를 즉시 재시도한다.

### 2. 실제 교역망 효과 관측

E4의 `routeCostSavedEst`는 건설 전 planner 추정값이다. E5는 완공 직후 실제 세계 상태를 다시 읽어 다음을 별도로 기록한다.

- 실제 reachable partner 증가 수
- 실제 nearest route cost 절감
- 실제 reachable partner 평균 route cost 절감
- 완공 당시 국제 교역 누적량
- 완공 360일 후 추가 국제 교역량 follow-up

마지막 교역량 값은 다른 경제·인구 변화의 영향도 포함하므로 **교역소의 순수 인과효과로 해석하지 않고 후속 관측값**으로만 사용한다.

### 3. 신규 E5 telemetry

세계 단위 주요 필드:

- `tradeIntentActive32E5`
- `tradeIntentBuilding32E5`
- `tradeIntentRecovered32E5`
- `tradeIntentCompleted32E5`
- `tradeIntentCancelled32E5`
- `tradeIntentAgedPriority32E5`
- `tradeSoftReserveBlocks32E5`
- `tradeSoftReserveEvents32E5`
- `tradeStrategicSlotWins32E5`
- `tradeActualPartnerGain32E5`
- `tradeActualRouteSaving32E5`
- `tradeActualAvgRouteSaving32E5`
- `tradePostFollowups32E5`
- `tradePostTradeVolume1y32E5`

국가별 snapshot에는 intent age, PROJECT_CAP 정체기간, priority/TTL pause, 연결된 project ID, 최근 실제 route 절감과 follow-up 교역량을 추가한다.

### 4. 성능 정책

E5는 E4 planner의 평가 주기와 최대 6개 후보 shortlist를 유지한다. 새 기능은 intent/project 상태 확인과 정수 counter 중심이며 후보별 `performance.now()` 계측을 추가하지 않는다.

### 5. E5 구현 검증

릴리스 전 개발용 Node VM harness에서 다음을 확인했다.

- inline script **62개 전부 syntax check 통과**
- fresh 19×19 world 1,200 step smoke 통과
- E5 save → `World.from()` reload → 추가 30 step 통과
- `BUILDING` intent의 기존 720일 expiry를 강제로 초과시켜도 TTL이 정지되어 유지됨
- E4 호환 save에서 intent를 제거하고 실제 전략 교역소 project만 남겨도 E5가 `RECOVERED_BUILD` intent로 재결합
- project 제거 + 실제 Trading Post 완공 상태에서 E5 completion/actual-effect telemetry 발화
- 가치 높은 aged intent가 마지막 일반 슬롯을 보호하면서 Housing 예외는 차단하지 않음
- `PROJECT_FREED` 즉시 재시도에서 전략 Trading Post가 실제 `startConstruction()` 경로로 착공되고 slot-win이 기록됨
- Snapshot CSV header/row **442 columns 일치**
- Dev JSON / save version `0.32E5` 확인

동일 seed 1,200-step 개발용 성능 sanity 비교는 E4 약 **9.18s**, E5 약 **9.24s**였다. 약 +0.7% 수준이며 두 버전의 랜덤 진행 상태가 소폭 달라졌으므로 정밀 benchmark가 아니라 **새로운 큰 회귀가 없는지 확인하는 참고값**으로만 사용한다. 실제 성능 판정은 PC/Tab 자연주행 telemetry를 우선한다.

---

> 아래 E4 및 이전 버전 섹션은 누적 기술 문서다. 각 섹션의 “다음 단계” 문구는 해당 릴리스 당시의 역사적 기록이며, 현재 로드맵은 문서 최상단 E5 섹션을 우선한다.

## E4 핵심 변경

### 0. Priority 0 — tile 0 교역 endpoint 버그 및 route blocker 정리

D5의 기존 코드에는 JavaScript falsy 판정 때문에 `sourceTileId === 0` 또는 `targetTileId === 0`인 정상 endpoint를 교역소가 없는 것으로 오인할 수 있는 경로가 있었다. 같은 조건 때문에 quote 생성도 생략될 수 있었다.

E4는 endpoint 존재 여부를 `null / undefined` 기준으로 판정한다. 따라서 **0번 타일은 정상적인 교역 endpoint**로 처리된다.

신규 route failure 분류는 다음으로 정리한다.

- `NO_ROUTE_MARKET`: 실제 endpoint가 없거나 market contact 단계가 부족함
- `NO_ROUTE_RANGE`: 유효한 물리 경로가 있지만 현재 trade range 초과
- `NO_ROUTE_PATH`: endpoint는 있으나 유효한 경로를 찾지 못함

기존 저장 데이터에 남아 있는 `NO_ROUTE` 표시는 호환을 위해 UI fallback으로 유지하지만, E4의 신규 D5 funnel 판정은 위 세 범주로 귀결되도록 수정했다.

### 1. Strategic Trade Network Planner V1

각 국가는 분기 단위로 교역망을 저빈도 평가한다. planner는 모든 타일을 무제한 pathfinding하지 않는다.

1. `BARTER` 기술이 있는 활성 국가만 평가
2. 실제 거주자 3명 이상이며 Trading Post가 없는 owned Settlement를 후보로 수집
3. 인구, 기존 국내 교역소와의 거리, 외국 교역소와의 거리, 건축공간을 이용해 cheap shortlist 작성
4. 상위 **최대 6개 후보**만 실제 route 평가
5. 후보별로 다음 효과를 계산
   - 신규 도달 가능 교역 상대 수
   - 기존 land-route cost 절감량
   - 현재 route blocker 때문에 막혀 있는 수입/수출 기회의 크기
   - 외곽 network 확장성
6. 충분한 이득이 있는 최상위 후보만 infrastructure intent 생성

후보 route 비교는 실제 지도 terrain/road 상태를 사용하는 `tradePathCost()` 기반의 **estimated land-route**다. 국제시장 실제 체결 가능 여부는 기존 D5의 contact/range/price/budget 규칙이 계속 최종 판정한다. 즉 planner의 예상값은 건설 의사결정용이며 실제 거래를 보장하는 값이 아니다.

### 2. AI 성향과 TRADE policy

교역외교형 AI와 현재 `TRADE` policy 기간인 국가는 planner score에 보너스를 받는다. 그러나 인프라가 명백히 유리하면 다른 AI 성향도 Trading Post를 전략적으로 건설할 수 있다.

따라서 성향은 **건설 가능/불가능의 hard gate가 아니라 우선순위**로 작동한다.

### 3. Persistent Trade Network Intent

한 번 선택된 목표는 다음 조건에서 즉시 버리지 않는다.

- 프로젝트 슬롯 포화
- 자재 부족
- Gold/시장 유동성 부족
- 같은 타일의 다른 프로젝트
- 현재 건축공간 부족

intent는 최대 **720 calendar days** 유지되며 분기마다 같은 목표를 재검사한다.

현재 developed space는 부족하지만 technology가 허용하는 accessible potential이 충분하면 `V32E4_TRADE_NETWORK_SPACE` 토지정비를 먼저 시도한다. 이후 같은 intent가 Trading Post 건설로 이어진다.

### 4. 실제 물리 건설

전략 교역소는 기존 `startConstruction()` / `payBuild()` 체인을 그대로 사용한다.

- 실제 `trading_post` 건설비 사용
- 실제 wood / stone 소비
- 기존 Settlement market co-finance / Treasury 규칙 사용
- 기존 project capacity 적용
- 실제 Person 건설노동 적용
- 완공 전에는 route endpoint가 생기지 않음

E4는 가상의 Trading Post, 즉시 완공, 무료 자원, 무료 Gold를 만들지 않는다.

### 5. 전략 우선순위

E4 planner는 기존 seasonal logic **직전**에 실행된다. 따라서 이미 유지 중인 strategic intent가 있고 프로젝트 슬롯이 비어 있다면 일반적인 Settlement 자동개발보다 먼저 해당 Trading Post를 시도한다.

기존 D5 Housing priority, V31 산업 slot, V32 군사 slot 등 더 강한 기존 보호 규칙을 우회하지 않는다. E4의 사전 진단은 route-aware 실제 건설자재 도달 가능량을 확인하며, 그 이후 `startConstruction()` 최종 gate가 거부하면 `PAYMENT_OR_STRATEGIC_GATE`로 기록하고 다음 분기로 넘어간다.

---

## E4 Observer / Telemetry

국가 경제 탭 하단에 **E4 전략 교역망 계획** 박스를 추가한다.

- 현재 상태: `PLANNED / BLOCKED / SPACE_PREP / BUILDING / NONE`
- 목표 Settlement tile
- 선택 근거
- 예상 신규 교역 상대 수
- estimated route cost 절감
- 현재 blocker
- 최근 planner가 관측한 `MARKET / RANGE / PATH` blocker 수

신규 global operation counter:

- `tradePlannerRuns32E4`
- `tradeCandidateEvaluations32E4`
- `tradePlannerRouteChecks32E4`
- `tradeNetworkIntents32E4`
- `tradePostStrategicStarts32E4`
- `tradeNetworkCompleted32E4`
- `tradePartnersUnlocked32E4`
- `tradeRouteCostSavedEst32E4`
- `tradeIntentBlockedProject32E4`
- `tradeIntentBlockedFinance32E4`
- `tradeIntentBlockedMaterials32E4`
- `tradeIntentBlockedSpace32E4`
- `tradeIntentBlockedOther32E4`

신규 per-nation snapshot fields:

- `tradeIntentStatus32E4`
- `tradeIntentBlocker32E4`
- `tradeIntentTargetTile32E4`
- `tradeIntentNewPartners32E4`
- `tradeIntentRouteSaving32E4`
- `tradeRouteMarketBlocks32E4`
- `tradeRouteRangeBlocks32E4`
- `tradeRoutePathBlocks32E4`

계측은 정수 counter와 기존 snapshot에만 추가한다. 후보마다 `performance.now()`를 호출하는 고빈도 timer는 넣지 않았다.

---

## E3 실기기 성능 기준선

E4 개발 직전 사용자 동시 테스트에서 E3는 서로 다른 랜덤 월드를 PC와 Galaxy Tab S7 계열 태블릿에서 동일한 현실시간 19분 13초 동안 주행했다. 월드가 다르므로 정밀 A/B가 아니라 환경별 rough baseline으로만 사용한다.

- PC: 약 61년 2분기까지 진행
- Tab: 약 60년 2분기까지 진행
- 초기~중기 근접 상태에서 일반 SIM의 Tab/PC rough coefficient는 약 `4.2×`
- Person-heavy 경로는 약 `5×`까지 차이
- E2→E3 근접 상태 비교에서 전체 SIM 약 10% 감소, Person/village 핵심 경로 약 20~27% 감소 방향이 PC/Tab 양쪽에서 확인됨

현재 10배속 pacing에서 Tab의 `Wall`이 약 550ms 이내이면 다음 batch 전까지 계산을 마칠 수 있으므로, SIM ms 차이가 곧바로 동일 비율의 현실시간 진행속도 차이를 뜻하지 않는다. E4는 이 기준선에 성능 회귀가 없는지를 확인한다.

---

## 저장 / 호환성

- E4 save version: `0.32E4`
- E4 save key: `village-observer-v0-32e4`
- 첫 fallback: E3
- E2 / E1 / D5 / D4 / D3 / D2 / D1 / D / C2 fallback 유지
- E4 intent와 global planner counter는 save에 유지
- 이전 save 로드 시 E4 state는 안전한 기본값으로 생성

---

## 릴리스 검증 결과

최종 빌드는 다음 회귀 검증을 통과했다.

- **61개 inline script** 전체 `node --check` 통과
- fresh 19×19 Node VM **2,400 simulation-day smoke** 통과: 6개 국가 유지, E4 planner 저빈도 실행, runtime crash 없음
- 최종 UI 갱신 이후 별도 180-day smoke 재통과
- E3 save 호환 경로 → E4 로드 및 E4 save → reload 통과
- **tile ID 0** endpoint에서 `NO_ROUTE_RANGE / NO_ROUTE_PATH` 분류 및 D5 quote 생성 회귀 통과
- 강제 교역망 시나리오에서 `RESTORE_NODE intent → READY → 실제 trading_post construction start` 통과
- 실제 착공 중 intent save/reload 유지 및 완공 감지 후 intent 정리 통과
- `PROJECT_CAP` blocker 상태가 save/reload 후에도 유지됨을 확인
- route-aware wood/stone 진단 전후 `adminLogisticsSavedCost32D2` 누적값이 변하지 않음을 확인
- 최종 CSV는 **421 columns**로 header와 모든 확인 row의 column 수 일치
- E3 operation counter가 E4 snapshot에 계속 유지됨을 확인

개발용 동일 seed Node VM 900-day 단일 비교에서는 E3 약 6.66s, E4 약 6.71s로 차이가 약 **+0.7%**였다. 이는 브라우저/PC/Tab 성능값을 대표하는 벤치마크가 아니며 JIT·실행 노이즈가 있는 1회 개발검증이다. 다만 E4 planner가 이 구간에서 60회 실행, 후보 1개·route check 40회에 그쳐 **고빈도 성능 회귀 징후는 관찰되지 않았다.** 실제 평가는 사용자 PC/Tab 장기주행 데이터로 다시 확인한다.

---

# Inherited V0.32E3 detailed specification

아래는 E4가 기반으로 유지하는 E3 상세 문서다.

## E3 핵심 변경

### 0. Priority 0 — Housing relocation 최종 gate

E2의 periodic Housing Resolver는 실제 shortage 기준으로 정리됐지만, D3의 `buildHouse()` / Settlement Demand 및 한 resolver pass 내부의 stale candidate 경로에서는 점유율 0.90~1.00인 정착지가 `HOUSING_RELOCATION32D3`으로 이동 대상이 될 수 있었다.

E3는 D3 코드 자체의 세 위치를 같은 기준으로 맞춘다.

- D3 housing pulse 후보: `occupancy >= 1.12` 또는 `housingShortage >= 1`
- D3 `buildHouse()`의 relocation 진입: 동일 기준
- `tryHousingResolveD3()` 내부 최종 재검사: 동일 기준

마지막 내부 gate가 있으므로 첫 relocation 뒤 오래된 후보 row가 남아 있어도, 실제 현재 source가 정상 상태로 내려오면 두 번째 강제이주를 실행하지 않는다.

정상 점유 상태에서 주거 정책이 선택되는 것 자체는 막지 않는다. relocation gate를 통과하지 못하면 기존 V17/D2의 실제 주택 건설·주거 업그레이드·토지 정비 경로로 그대로 내려간다.

개발 회귀 테스트에서는 동일 E2 save에서 600일 진행 시 새로 발생한 D3 relocation 중:

- E2: 12회, 그중 source occupancy `<= 1.00`이 11회
- E3: 2회, source occupancy `<= 1.00`은 0회

E3에서 남은 relocation은 실제 shortage/과밀 조건을 충족한 경우였다.

### 1. Knowledge leaf fast path

프로파일링에서 가장 큰 숨은 반복 비용이 발견됐다.

V0.8 계열의 기존 `Village.gainKnowledge()`는 기술이 아직 전부 완료되지 않은 동안 **Person이 Knowledge를 얻을 때마다** `ensureV08Nation()`을 호출했고, 그 안의 `syncStorageTech()`가 국가의 모든 영토 타일을 순회했다.

따라서 후기에는 대략 다음 형태의 비용이 생길 수 있었다.

`Person 수 × 매일 Knowledge gain × 국가 영토 타일 수`

E3는 현재 연구 대상이 이미 있고, 이번 Knowledge gain으로 연구 완료가 발생하지 않는 경우에 한해서:

- 기존과 동일한 Knowledge multiplier 적용
- `totalKnowledge` 동일 증가
- `knowledgeBySource` 동일 증가
- `researchProgress` 동일 증가
- 불필요한 전체 영토 `syncStorageTech()`만 생략

다음 경우에는 **반드시 기존 E2 gainKnowledge 경로에 위임**한다.

- 연구 대상이 없는 경우
- 연구 target이 비정상인 경우
- 이번 gain으로 기술 완료 경계를 넘는 경우
- 완전 기술 포화 상태 등 기존 V28 fast path가 처리해야 하는 경우

기술 완료 시에는 기존 `maybeFinishResearch()`가 그대로 실행되므로 Eureka, 완료 로그, 다음 연구 선택, URBANIZATION storage flag 동기화 규칙은 유지된다. 또한 E3 attach 시 현재 기술 상태로 `_v08UrbanStorage`를 국가당 1회 동기화해 이전 save의 호환성을 보장한다.

### 2. V0.29 Food Reserve resident-index fast path

기존 후기 식량 비축일은 단순 `population × 0.36` 공식이 아니라 V0.29의 연령별 소비량을 사용한다.

- 0~14세: `0.30 / cycle`
- 15세 이상: `0.42 / cycle`

기존 `foodReserveDays()`는 영토를 순회하면서 `tileResidents().filter()` → `settlementReserveDays()` → 다시 `tileResidents()` → `localFoodNeed29()` 순으로 같은 주민을 반복 확인했다.

E3는 V0.26의 invalidation-aware resident index에서 `byHome` 배열을 직접 읽어 같은 식을 한 번의 settlement pass로 계산한다.

- `settlementReserveDays()`도 같은 resident index 사용
- `foodReserveDays()`는 기존 population-weighted settlement reserve 평균을 그대로 유지
- `criticalFoodReserveDays()`도 같은 age-weighted denominator 유지
- 식량 stock이나 소비량 규칙은 변경하지 않음

동일 E2 save의 각 국가에 대해 E2/E3의 `population`, `foodReserveDays`, `criticalFoodReserveDays`가 정확히 동일한 값을 내는 것을 별도 회귀 테스트로 확인했다.

### 3. Population lookup fast path

V0.26 resident index는 `homeTileId`와 `alive` 변화 시 epoch를 올려 자동 무효화된다. E3는 일반적인 `Village.population()` 조회에서 `residents.filter(p => p.alive)`를 반복하지 않고 이 index의 alive 배열 길이를 사용한다.

단, V0.21의 `dailyTick` 안에서는 population을 하루 동안 구조적으로 고정하는 기존 `_v21DailyPerf` cache 의미가 있다. E3는 이 상태에서는 기존 population 메서드에 위임해 **기존 하루 내부 시뮬레이션 순서 의미를 유지한다.**

### 4. Person.act chain은 유지

E3의 중요한 비변경사항이다.

- Person 생산 규칙 변경 없음
- metabolism 변경 없음
- job scoring 변경 없음
- migration cadence 변경 없음
- 군사/건설/유지보수 특수 경로 변경 없음
- 철산업 Person 경로 변경 없음

즉 E3는 Person을 덜 시뮬레이션하는 패치가 아니라, **같은 Person 행동이 호출하는 반복 leaf 계산을 덜 수행하는 패치**다.

---

## E3 신규 Telemetry

CSV / JSON global snapshot에 다음 누적 operation counter를 추가한다.

- `knowledgeFastAdds32E3`
- `knowledgeLegacyAdds32E3`
- `knowledgeTerritoryTilesAvoided32E3`
- `foodReserveFastCalls32E3`
- `foodReserveTileScans32E3`
- `criticalFoodReserveFastCalls32E3`
- `populationIndexCalls32E3`

특히 `knowledgeTerritoryTilesAvoided32E3`는 E3가 기존 `syncStorageTech()`에서 피한 영토 타일 순회량의 근사 operation count다.

기존의 다음 시간 기반 성능 지표도 그대로 유지한다.

- `SIM / perfSimMs26`
- `Wall / perfWallMs27`
- `Render / perfRenderMs26`
- `perfMsPerDay26`
- `perfBreakdown26.villageDaily`
- `perfBreakdown27.personActEst`

따라서 이후 PC와 모바일에서 동일 save를 테스트할 때:

1. operation counter가 같은지 확인해 수행한 코드 작업량을 비교하고
2. 같은 작업량에서 ms가 얼마나 다른지 확인해 장치/브라우저 실행 배율을 볼 수 있다.

---

## 개발 프로파일 결과

아래 값은 **Node VM 개발 프로파일**이므로 실제 PC/모바일 브라우저의 절대 성능값으로 사용하지 않는다. 같은 E2 save 상태에서 상대적인 hot-path 감소를 확인하기 위한 검증값이다.

30일 계측 실행의 대표 샘플:

| 항목 | E2 | E3 |
|---|---:|---:|
| `gainKnowledge` 누적 | 42.79 ms | **3.75 ms** |
| `foodReserveDays` 누적 | 42.63 ms | **6.40 ms** |
| `Person.act` 누적 | 151.89 ms | **90.06 ms** |
| 계측 포함 전체 | 620.65 ms | **485.84 ms** |

별도의 60일 비계측 반복 실행에서도 중앙값 기준 대략 10% 수준의 전체 실행시간 감소가 관측됐다. Node의 JIT/GC 변동폭이 있으므로 이것을 E3의 모바일 개선률로 가정하지 않는다.

같은 60일 샘플에서 E3는 약 3,223회의 Knowledge fast-add로 약 11,629개의 영토 tile sync 방문을 피했다. 실제 Y60처럼 Person과 영토가 더 큰 세계에서는 이 카운터가 얼마나 증가하는지가 중요하다.

---

## 저장 / 호환성

- E3 save version: `0.32E3`
- E3 save key: `village-observer-v0-32e3`
- 첫 fallback: E2
- E1 / D5 / D4 / D3 / D2 / D1 / D / C2 fallback 유지
- E2 save → E3 로드 검증 완료
- E3 save → `World.from()` 재로드 → 추가 진행 검증 완료
- E3 operation counter는 save에 유지
- Knowledge multiplier cache 등 transient helper는 안전하게 재생성

---

## 릴리스 검증

최종 E3 빌드에서 수행한 검증:

- HTML 내 **60개 inline script** 전부 `node --check` 통과
- fresh 19×19 world 생성 성공
- 2,400일 runtime smoke 성공
- E2 save → E3 load → 진행 성공
- E3 save → reload → 추가 30일 진행 성공
- Knowledge non-completion gain: E2와 `totalKnowledge / researchProgress / target` 동일
- Knowledge completion gain: 완료 기술, 잔여 progress, 다음 target, source Knowledge, 완료 로그 동일
- E2/E3 동일 save의 population / food reserve / critical food reserve 값 동일
- Housing 600일 회귀: 정상 `sourceOccupancy <= 1.00` D3 relocation E3에서 0건
- CSV export 실행 성공, header/data column 수 일치
- Dev JSON version `0.32E3`, save version `0.32E3` 확인

---

## 다음 장기주행에서 볼 항목

E3는 다음 테스트에서 **가능하면 동일 save를 모바일과 PC 양쪽에서** 확인한다. 당장 PC가 불가능하면 모바일 장기주행을 먼저 진행해도 된다.

우선 확인할 항목:

- Y50~65의 `SIM / Wall / personActEst / villageDaily`
- E2 모바일 Y60 기준 `SIM 696.5ms`, `personActEst 279.19ms` 대비 개선폭
- `knowledgeFastAdds32E3`
- `knowledgeTerritoryTilesAvoided32E3`
- `foodReserveFastCalls32E3`
- Housing relocation 중 source occupancy 1.00 이하 이벤트가 다시 나타나는지
- 인구·식량·연구속도·이주·산업 결과가 E2에서 비정상적으로 벗어나지 않는지

PC/모바일 양쪽 데이터가 확보되면 **동일 operation count 대비 ms 비율**로 장치 성능 배율을 따로 추정한다.

---

# V0.32E2 기반 상세 사양

아래 내용은 E3가 그대로 상속하는 E2 상세 사양이다. E3에서 변경된 항목은 위 E3 delta가 우선한다.

## E2 핵심 변경

### 1. Food Relay: remembered donor fast path

Receiver별 최근 성공 donor를 그대로 기억한다. 다음 relay pulse에서 그 donor가 여전히 안전비축 조건을 만족하면 먼저 확인한다.

- route/capacity가 아직 유효하면 전국 donor 탐색 없이 즉시 재사용
- critical Hunger 또는 reserve 2일 미만이면 다소 먼 remembered donor도 우선 사용 가능
- remembered donor가 부적합할 때만 새 후보 탐색

강제 relay smoke에서 첫 위기는 실제 expensive donor-pair 계산 1~2회로 해결됐고, 같은 receiver의 두 번째 위기는 **shortlist 0회 / expensive check 0회 / pair-cache hit 1회**로 처리됐다.

### 2. Cheap donor shortlist

새 donor가 필요할 때 더 이상 모든 donor에 대해 `internalPathCost + internalLogisticsCapacity`를 계산하지 않는다.

먼저 값싼 근사 점수로 donor를 정렬한다.

- 지도상 거리 `map.distance`
- 안전비축일
- 실제 surplus stock
- recent donor 여부

그 뒤 **최대 5개 후보만** 실제 route/capacity 계산으로 넘긴다. 국가가 40~60 Settlement까지 커져도 expensive pair check가 donor 수에 정비례하지 않도록 한다.

### 3. Route + capacity pair cache

E1은 route cost만 짧게 cache했지만, 실제 병목에는 `internalLogisticsCapacity()`도 포함돼 있었다. E2는 donor→receiver 쌍에 대해 다음을 함께 저장한다.

- route cost
- current usable capacity

TTL은 약 18 calendar days로 제한한다. 오래된 도로·행정·인구 상태가 영구적으로 고정되지 않도록 transient cache로 유지한다.

### 4. Mild receiver 전국탐색 억제

E1은 Hunger 85+ Person 한 명만 있어도 국가 전체 donor 탐색을 시작할 수 있었다. E2의 national fallback은 다음처럼 더 보수적으로 시작한다.

- local reserve < 6일
- critical Hunger 95+ 존재
- severe Hunger 85+가 2명 이상
- severe Hunger가 1명이라도 local reserve < 12일

즉 현지 재고가 충분한 Settlement의 일시적인 single-person Hunger spike는 먼저 기존 local food system에 맡긴다.

### 5. Housing churn fix

E1의 cheap housing scan은 `occupancy >= 0.98`도 pressure로 보았다. 이 때문에 실제 shortage가 없는 점유율 1.00 정착지에서도 D3 resolver가 호출될 수 있었다.

E2에서는 기존 `bad row` 기준에 들어온 경우에만 resolver를 실행한다.

- occupancy >= 1.12
- 또는 실제 housing shortage >= 1

정상 98~100% 점유는 일반 migration/urban housing system에 맡긴다. 심각한 과밀에 대한 기존 D3 해결경로와 D5 reserved housing slot은 유지한다.

---

## E2 신규 Telemetry

Nation/CSV/JSON에 다음 누적값을 추가한다.

- `foodCandidateShortlists32E2`
- `foodPairCacheHits32E2`
- `foodExpensiveChecks32E2`
- `foodRememberedHits32E2`
- `foodMildSkipped32E2`
- `housingNormalSkipped32E2`

Global 성능값:

- `perfFoodPair32E2` — 실제 route+capacity pair 계산에 소비된 시간

기존 E1 필드도 그대로 유지하므로 E1↔E2 비교가 가능하다.

---

## 저장/호환성

- E2 save version: `0.32E2`
- E2 save key: `village-observer-v0-32e2`
- E1 save key를 첫 fallback으로 유지
- D5 이하 fallback도 유지
- E1 save를 E2로 불러오면 `v32e2` state를 안전하게 초기화
- 누적 E2 진단 카운터는 저장
- route/pair cache는 transient이므로 저장하지 않음

---

## 검증

릴리스 빌드에서 수행한 검증:

- HTML 내 **59개 inline script** 전부 `node --check` 통과
- fresh 19×19 World 생성 및 E2 attach 성공
- 반복 `advanceOneDay()` runtime smoke 성공
- E2 save → `World.from()` 재로드 성공
- E1 save version 호환 경로 유지
- 강제 food crisis smoke에서 실제 stock 보존 이동 확인
- 첫 relay에서 expensive donor-pair 계산이 shortlist 범위 안으로 제한되는 것 확인
- 동일 receiver 두 번째 relay에서 remembered donor + pair cache가 작동하며 신규 expensive check 0회 확인

---

## 다음 장기주행에서 볼 항목

E2는 모바일 환경에서 먼저 확인한다.

- 50~65년대 SIM / Wall 증가율
- `foodExpensiveChecks32E2`가 실제 relay 성공횟수 대비 얼마나 낮아졌는지
- `foodRememberedHits32E2` / `foodPairCacheHits32E2`가 누적되는지
- `perfFoodRelay32E1`과 `perfFoodPair32E2`
- housing resolver run/action 수가 E1보다 감소하는지
- starvation / severe Hunger가 E1보다 악화되지 않는지

E2에서도 700~1,000 Person 이전에 체감 렉이 계속 강하면, 다음 성능 패스는 `Person.act`, 국제 trade assessment, domestic logistics 순으로 직접 들어간다.

---

# V0.32E1 기반 상세 사양

아래 내용은 E2가 그대로 상속하는 E1 상세 사양이다. E2에서 변경된 항목은 위의 E2 delta가 우선한다.

## 1. 0순위 버그 — 국제 호가판 상태 보존

D5의 `renderVillageContent()`는 교역 탭을 갱신할 때 호가판 DOM까지 매번 새로 만들었다. 그 결과 다음 문제가 있었다.

- 상대국 dropdown을 열어도 다음 tick에 닫힘
- 사용 중인 선택 UI가 매 tick 교체됨
- 수입/수출 조건 `<details>`의 open/closed 상태가 초기화됨

E1에서는 기존 호가판 DOM 노드를 화면에 남긴 채 나머지 교역 탭을 off-DOM shadow에 새로 렌더링한다. 그 후 가격·Trade Funnel 등 변하는 내용만 기존 호가판에 복사한다.

따라서 다음 DOM은 tick 사이에 유지된다.

- 상대국 `<select>`
- 수입 조건 `<details>`
- 수출 조건 `<details>`

상대국 목록 자체가 바뀌는 특수 상황에는 option 목록을 갱신하지만, 사용자가 select를 조작 중이면 강제로 교체하지 않는다.

---

## 2. Unified Housing Resolver

### 2.1 기존 중복 pulse

D5까지는 서로 다른 세대의 주거 로직이 동시에 남아 있었다.

- V0.28 도시 주거 pulse
- V0.32D3 주거 pulse
- V0.32D5 후기 주거 priority pulse

D3의 일일 wrapper는 실제 해결 시점이 아니더라도 주거 상태를 반복 평가했고, D5는 심각한 과밀에서 D3 resolver를 추가 호출했다. D3의 `housingRows`와 life-zone 계산은 V0.28 `urbanSummary(..., true)`를 요구할 수 있어, 후기의 많은 Settlement와 Person이 존재하는 시기에 계산량이 커질 수 있었다.

### 2.2 E1 단일 cadence

E1 world에서는 기존 세 주거 pulse를 직접 실행하지 않는다.

- 평상시: 30 calendar-day 단위의 저비용 압력 검사
- 직전 검사에서 심각한 위기였던 국가: 15 calendar-day 검사
- 실제 주거 압력이 확인된 경우에만 D3의 실제 해결 경로 호출

실제 해결 우선순위는 기존 D3 철학을 유지한다.

1. 실제 빈 주거로 Person relocation
2. 기존 주거 밀도 업그레이드
3. 다른 Settlement의 실제 빈 공간에 주택 건설
4. 토지 정비

즉 E1은 주택을 생성하거나 capacity를 가상으로 보충하지 않는다.

### 2.3 Housing Context 공유

한 E1 resolver pass 안에서는 D3가 필요로 하는 강제 `urbanSummary` 결과를 한 번 만든 뒤 공유한다.

- `housingRows`
- life-zone lookup
- 같은 resolver 안의 연속 주거 판단

이들이 같은 국가/같은 pass에서 동일한 도시 요약을 반복 생성하지 않는다.

Person relocation 이후 pop/free/occupancy는 D3의 기존 실제 주민 자료에서 다시 계산되지만, 생활권의 큰 구조는 그 resolver pass 동안 공유한다. 다음 pass에서는 다시 현재 월드 상태를 읽는다.

### 2.4 가벼운 주거 압력 검사

E1의 cadence 판단은 전체 `urbanSummary`를 먼저 만들지 않는다.

- V0.26 zero-copy resident index
- 실제 건물 capacity / condition
- 현재 homeTile 분포

만으로 Settlement별 점유율과 shortage를 계산한다.

이 결과는 D5의 마지막 일반 construction slot 주거 예약 판단에도 공유된다.

---

## 3. National Food Relay 성능 개선

D5의 국가 단위 last-mile relay 규칙은 유지한다.

- 실제 donor stock만 사용
- donor 안전비축 유지
- 실제 route 필요
- 실제 capacity 적용
- `withdrawAt` / `depositAt` 보존 이동
- `DONOR_RESERVE / NO_ROUTE / CAPACITY / NO_STOCK / STORAGE` blocker 유지

E1은 계산 방법만 경량화한다.

### 3.1 Resident index 재사용

각 Settlement마다 `tileResidents()`와 `settlementReserveDays()`를 반복 호출하지 않는다.

V0.26 resident index를 한 번 읽어 다음 값을 동시에 집계한다.

- population
- adult carriers
- severe Hunger 85+
- critical Hunger 95+
- 평균 Hunger

현재 공식 Settlement reserve-day 식은 `stock / (population × 0.36)`이므로 같은 집계에서 정확히 동일한 비축일을 직접 계산한다.

### 3.2 Donor index

6 calendar-day relay pulse마다 실제 점유 Settlement의 state를 한 번 만들고 다음 donor pool을 미리 구분한다.

- 24일 안전비축 donor
- 30일 안전비축 donor

Receiver마다 국가 전체 목록을 처음부터 재구성하지 않는다.

### 3.3 최근 성공 donor

Receiver별 최근 성공 donor를 기억한다. 아직 안전한 donor이고 경로/capacity가 충분하면 우선 검토한다.

이것은 새로운 자원 이동 규칙이 아니라 후보 탐색 순서 최적화다.

### 3.4 Food route cache

`from Settlement → receiver Settlement` 경로비용을 짧은 기간 재사용한다.

- TTL: 최대 약 18 calendar days
- cache size에 상한을 둠
- route가 없다는 결과도 짧게 cache 가능

도로·행정 등 구조 변화가 장기간 무시되지 않도록 영구 cache로 만들지 않는다.

---

## 4. E1 성능 Telemetry

E1은 실제 90~100년 데이터에서 개선 효과를 다시 확인할 수 있도록 다음 관측값을 추가한다.

### Nation fields

- `housingBlocker32E1`
- `housingResolverRuns32E1`
- `housingResolverActions32E1`
- `housingContextBuilds32E1`
- `housingContextHits32E1`
- `foodDonorIndexBuilds32E1`
- `foodRouteCacheHits32E1`
- `foodRouteChecks32E1`

### Global fields

- `housingResolverRuns32E1`
- `housingResolverActions32E1`
- `housingContextBuilds32E1`
- `housingContextHits32E1`
- `foodDonorIndexBuilds32E1`
- `foodRouteCacheHits32E1`
- `foodRouteChecks32E1`
- `perfHousing32E1`
- `perfFoodRelay32E1`
- `perfFoodIndex32E1`

기존 D5의 `perfHousing32D5 / perfFoodRelay32D5`는 E1 world에서는 레거시 pulse가 차단되므로 정상적으로 0에 가까워야 한다. E1 비용은 새 E1 필드에서 관찰한다.

---

## 5. 호환성과 저장

E1은 D5를 기준으로 이어 붙인다.

- E1 신규 save version: `0.32E1`
- E1 save key: `village-observer-v0-32e1`
- D5 및 기존 fallback save key를 계속 탐색
- D5 save를 E1으로 불러올 때 E1 state/cache는 안전하게 초기화
- route cache와 Housing Context는 성능용 transient cache이므로 세이브에 강제로 저장하지 않음
- 누적 E1 관측 카운터와 최근 donor 정보는 village `v32e1` state로 저장

---

## 6. 이번 패치에서 의도적으로 하지 않은 것

E1의 목적은 원인 분리가 가능한 성능 패치다. 따라서 다음은 아직 넣지 않는다.

- 전략적 Trade Network Planner
- `TRADE` 정책과 교역소/항구 실제 건설 연결 V2
- 상단 회관/대시장 효과 재설계
- Construction Proposal 시스템
- 국제 운송비 회계 개편
- 목표 날짜 자동진행
- 조건형 Auto-run
- 군사사회 V0.32F 범위
- Combat

이 항목들을 한꺼번에 추가하면 E1 장기주행에서 성능 변화와 AI 행동 변화를 구분하기 어려워지기 때문이다.

---

## 7. 검증

릴리스 빌드에서 수행한 검증:

- HTML 내 **59개 inline script** 전부 `node --check` 통과
- fresh 19×19 World 생성 및 E1 attach 성공
- 반복 `advanceOneDay()` runtime smoke 성공
- D5 legacy Housing / Food Relay pulse가 E1 world에서 중복 계측되지 않음을 확인
- E1 snapshot/CSV/JSON telemetry 생성 성공
- E1 save → `World.from()` → E1 재저장 성공
- D5 save → E1 `World.from()` 호환 smoke 성공

실제 브라우저의 native `<select>` 팝업은 현재 검증 환경에서 브라우저 DOM 실행이 제한되어 자동 상호작용 테스트를 하지 못했다. 다만 E1 구현은 select/details 노드를 tick 사이에 DOM에서 제거하지 않는 구조로 변경했다. 실제 사용자 브라우저에서 첫 장기주행 시 이 UI 동작도 함께 확인한다.

---

## 8. 다음 E 패치 관찰 포인트

E1 장기주행에서는 특히 다음을 비교한다.

- 80년 전후 SIM / Housing / Food Relay
- 93~95년 D5 문제구간의 SIM과 `perfHousing32E1`
- Person 1,500~2,000 구간의 `perfFoodRelay32E1`
- Housing strain이 D5보다 악화되지 않는지
- starvation / food stress가 D5보다 악화되지 않는지
- 국제교역량·산업·인구 성장 패턴에 비의도적 회귀가 없는지

E1 검증 후 다음 핵심 범위는 Trade Route blocker 정리 → Trade Network Planner → TRADE 물리행동 연결 순서가 기본 후보가 된다.

---

# V0.32D5 기반 사양

아래는 E1이 그대로 상속하는 V0.32D5 상세 사양이다.

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


---

## V0.32E7 이후 현재 로드맵 메모

E7 장기주행에서 상단 회관/대시장 활성 빈도, 운송서비스 소득 편중, 대시장 환류 규모와 성능 회귀를 확인한 뒤 다음 E계열 작업으로 진행한다. E6 자연발생 해상 운송 검증은 전용 해안·항구 맵 회귀 항목으로 유지한다. 과거 README 하단의 D5 시점 다음 단계 문구는 역사적 기록이며 현재 로드맵은 E계열 경제·건설·자동주행 안정화 이후 F 군사사회 → V0.33 War V1 순서다.
