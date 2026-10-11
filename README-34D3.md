# Village Observer V0.34D3 — Settlement Economy Integration V1

릴리스 날짜: 2026-10-11 · 기준선: V0.34D2B · 상태: 기능 구현 및 자동 회귀 통과, 사용자 장기 자연주행 검증 대기.

## 1. 설계 원칙

동일 국가·동일 **활성 Settlement**의 타일들은 민간인의 3일 작업주기 식량 소비와 시장/자재 접근에서는 하나의 경제권입니다. 개별 `Tile.stocks`, 건축 가능한 타일 및 개별 건물 위치를 보존하며, 군사 유닛 이동/점령은 물리 타일 단위입니다. **서로 다른 Settlement 및 서로 다른 국가** 사이에서는 재고가 합쳐지지 않으며 기존 운송·교역 경로를 사용합니다. 상대의 점령이 완료된 타일은 공동 재고 접근 대상에서 제외합니다.

## 2. 실제 게임 규칙 변경

- `Village.stockAt(tileId, resource)`: 동일 Settlement에서 접근 가능한 물리 타일 재고의 합계를 보여 줍니다. 기존 레거시의 물리 재고 자체는 그대로입니다.
- `withdrawAt`: 요청 타일 재고부터 소비한 뒤 동일 Settlement의 다른 타일에 보유한 식량·목재·석재·철광석·철·도구를 실제로 차감합니다. 다른 Settlement를 무료로 차감하지 않습니다.
- `depositAt`: 요청 타일에 적재하고 남으면 동일 Settlement의 다른 타일의 **실제** 빈 저장공간을 차례로 사용합니다. 충분한 저장공간이 없는 경우 기존과 같이 일부만 받습니다.
- `settlementCaps`와 `settlementReserveDays`: 공동 저장 수용량 및 Settlement 전체의 주민 연령별 실제 필요량(0~14세 0.30, 15세 이상 0.42 / 3일 주기)을 사용합니다.
- `internalLogisticsCapacity`: 같은 Settlement의 서로 다른 타일 사이에서 경제용 유상 배송을 만들지 않으며, 물자를 무료로 생성하지도 않습니다. 별개 Settlement 간 실제 물류는 그대로입니다.
- 기존 V0.29 민간 경제 캐시: 같은 Settlement의 타일별 재고 충족률과 가격 비교 신호를 하나로 묶습니다. 같은 Settlement의 두 타일 간 자기 국내거래는 건너뜁니다.
- 임금 지급 및 실제 국내·국제 시장 결제: 해당 Settlement의 다른 타일에 쌓인 기존 Market Gold를 실제 장부 간 이전할 수 있습니다. 국고 또는 Person 지갑에서 새 금액을 만들지 않습니다. 국가 간/Settlement 간 시장 경로의 물리 요건은 유지합니다.

## 3. 식량 생산·자연회복은 변경하지 않음

자연 식량은 타일 `resources.food`에 있으며 식량 창고 `stocks.food`와 별개입니다. 농부/채집꾼/사냥꾼 등의 실제 `Tile.harvest`를 거쳐 생산한 자원이 `depositAt`으로 입고되고, Person의 `metabolism`이 실제 비축 식량을 출고합니다. D3는 이 경로의 **접근·적재·소비**를 개선했지만 농부·채집꾼 생산 계수, 시설 슬롯, 토지별 자연회복, 식량 소비량, 굶주림 벌칙은 변경하지 않았습니다.

자연 식량의 지형별 회복 수치는 기존의 **달력 하루**가 아니라 **3일 작업주기당** 값이므로 백과 표기의 단위를 정리합니다. 1년 360일은 120작업주기입니다. 농업 시설의 효과를 뺀 평야 기본 6.2/3일 = 약 2.07/달력 하루, 초지 5.5/3일 = 약 1.83/달력 하루입니다. 이들은 자연 회복으로서 **창고에 자동 입고되는 생산량이 아닙니다**.

### 새 식량 진단

`Devlog.worldSummary.v034d3FoodFlow`는 실제로 관측된 `foodHarvestRequested`, `foodHarvested`, `foodNaturalRegenerated`, `foodMealRequested`, `foodMealReceived`, `foodDepositOverflow` 및 공동 재고·시장 재분배 계수를 보고합니다. `foodDepositOverflow`는 **입고 요청 중 저장되지 않은 양의 누적합**이며, 모든 양이 영구 유실되었다는 뜻은 아닙니다(일부 거래는 즉시 원위치로 환불). 자연회복·채집 관측은 실행 경로에서 세계 참조를 확인할 수 있는 구간에 대한 계측치로, 전 세계 자연회복 총량의 완전한 보존 감사와는 구분됩니다. Devlog 관측 카운터는 저장/복원 시 과거 런타임 값이 연결되지 않으며 게임의 물리 재고는 보존됩니다.

## 4. 데이터 파일

기존 Snapshot CSV V2 **1,683열**, Settlement CSV **48열**, Housing CSV **11열** 유지. 신규 **Settlement Economy CSV 24열**에는 Settlement별 인구·자원별 실제 총 재고·식량/자재 저장한도·연령별 3일 소비 필요량·비축 주기·자연 식량 잔량·시설 미반영 기본 자연회복량·관측된 식량 입출고와 현물 상업 Gold가 있습니다. 지도 타일 정보창과 국가 개요·경제 화면에도 공동 식량, 자재, 자연 잠재량을 표시합니다.

## 5. 실제 검증과 한계

- C1H 원본 JS 165개 + CSS 4개 **169개 보호 블록** SHA 보존.
- `npm run build`, `npm test`: 기초, D2 주거/이주, D3 2타일 공동 식량·자재·저장·금고 보존·시장 가격, 다른 Settlement/국가 분리, 200일 자연주행·저장/복원 및 CSV: PASS.
- `npm run test:year`: 고정 조건 **370일 × 2회**, 물리 세계 상태와 시뮬레이션 RNG 완전 일치, 30일 간격 및 종료 시 총 13회 D3 물리 보존 감사 0건. 사용한 시나리오의 다중 타일 Settlement 수는 0이었으므로 실제 다중 타일 검증은 별도의 합성 시나리오에 근거합니다.
- PC/모바일 Chromium 별도 스모크: D3 버전, 24열 경제 CSV, 현재 버전 세이브·로드, UI 및 JS 오류 0건 PASS. 통합 장시간 브라우저 자동 스크립트는 환경에서 간헐적으로 시간 초과되어, 온전한 장기 브라우저 시험 통과로 주장하지 않습니다.
- GitHub Pages 원격 HTTP 서비스 직접 검사, 60~75년 장기 자연주행, 전쟁 중 Settlement 병합·분할, 후기 문화/노후화 시뮬레이션은 **미검증**. D2B까지 제보된 특정 고정 시드의 진행 중단은 원인 미규명으로 계속 OPEN입니다.
- 초기 단일 타일 Settlement는 여전히 지역적 식량·창고 부족을 겪을 수 있습니다. 이전 티아의 기아 문제는 D3 자체로 자동 해결되지 않습니다. 이 경로의 원인은 D3 Food Flow와 Economy CSV를 함께 검사해야 합니다.

## 6. 배포

- 전체 프로젝트 ZIP: `village-observer-v034D3.zip`
- 단독 실행: `dist/standalone/index.html` 또는 `index-standalone.html`
- GitHub Pages: 프로젝트 루트 `index.html`을 게시하고 `dist/hosted/assets/`와 함께 배포. 또는 `dist/hosted/index.html`을 사이트 루트로 게시하면서 상대경로 `assets/`를 그대로 보관.
- `README.md`, `TEST-34D3.md`, `RELEASE-MANIFEST-34D3.json` 별도 확인.
- **현재 버전 V0.34D3 저장 데이터만 로드**. 기존 버전 D2B 세이브의 자동 업그레이드는 지원하지 않습니다. 이미 올바른 D2B 세이브에서 읽을 데이터가 있다면 해당 버전에서 별도 분석하고, D3 자연주행은 새 세계 기준으로 비교합니다.
