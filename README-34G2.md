# Village Observer V0.34G2 — Settlement Logistics V2

기준: **V0.34G1B (CLOSED)**. 2026-10-17. **실제 식량 물류 정책 변경 버전**. 기존 세이브 읽기 지원.

## 규칙 — 정착지 하나가 식량 수요/공급 주체 하나

- Tile은 **타일**, Settlement는 **정착지**, 마을/도시는 정착지 발전 상태다.
- 동일 국가의 점령되지 않은 정착지 구성 타일의 **실제 물리 식량 합계**를 정착지별로 한 번만 읽는다. F0/F2의 실제 연령별 3일 작업주기 수요 `NS.V034F0.needFor(person)`를 구성 주민에 대해 한 번만 합산한다.
- 집계 기준: 각 Person의 `homeTileId`, 생존 여부, 구성 타일의 소유권/점령 상태. 타일별 공동 재고 중복 참조 금지.
- 수요: 정착지 비축량 `stock / ageWeightedCycleDemand`, 주민 4명 이상이면 18주기 미만, 그보다 작으면 10주기 미만, 또는 심한 Hunger/평균 Hunger 위기. 자금/전략 정책 변경 없음.
- 공급: 동일 **정착지 제외**, 실제 정착지 공동 식량을 분모에 맞게 계산한 24주기(위기) / 40주기(예방) 보존 후 잉여량만. 한 국가 내 최대 긴급 대상 정착지 4개·후보 정착지 최대 5개/대상이라는 기존 고비용 탐색 제한은 유지.
- 도착·출발: 후보 정착지 두 곳의 실제 통행 가능한 타일 쌍 전체의 `Village.internalPathCost` 및 기존 `tradePathCost` fallback을 평가해 비용 최소인 쌍 선택. 도로·지형·통행 제약의 실제 기존 비용 함수 사용, 맨해튼 거리만으로 최종 선택하지 않음. `null`/무한 경로는 배송할 수 없음.
- 수송 물리 재고: `Village.withdrawAt`/`depositAt`의 **D3 공동 재고 보존** 로직을 재사용. 발신 정착지 잉여 한도 / 선택된 경로 용량 / 수신 정착지 총 저장 여유 한도를 지키고 수용하지 못한 식량은 출발 정착지로 반환. 물자가 며칠 동안 이동하는 in-transit 객체는 아직 없음.
- 기본 경로 용량 + 구형 V32E2 비상 보조 용량 공식을 유지하되, 인구가 많은 정착지라고 운송 용량이 과대해지지 않도록 **선정된 출발/도착 타일 주민 노동력**을 용량 계산에 사용.
- V27 선제 구호, V28 도시 구호, V32E2 국가 긴급 구호의 **실제 실행 경로를 G2의 단일 정착지 구호로 통합**. 정기 처리는 기본 작업주기 직전 **3일마다** 수행. 비활성 구형 함수/소스는 회귀 및 이전 버전 맥락 보존을 위해 남겨두되 G2 세계에서는 실행하지 않음.
- 기존 국내 상업 거래/국제 교역/시장 물가/군사 이동/전쟁/정착지 병합/AI 전략/F3 Person metabolism은 직접 수정하지 않음.

## 관측과 저장

- `worldSummary.v034g2` 신규: `pulses`, `settlementReads`, `receivers`, `donorCandidates`, `routePairsChecked`, `shipments`, `quantity`, `returned`, `failedReturns`, `physicalMismatch`, `conservationErrors`, `blocked`.
- `NATIONAL_FOOD_RELAY32D5` 이벤트의 `model`이 `V0.34G2_SETTLEMENT_ROUTE`이며 from/to `SettlementId` 및 실제 경로 타일 ID를 기록한다.
- Header의 **G2 정착지 배송 CSV** 버튼은 최근 300건의 실제 정착지 간 배송 경로를 내보낸다. G1A 물류 감사 CSV는 관측용으로 계속 제공한다. 감사 카운터·기록은 일반 세이브/불러오기에서 재시작한다.
- `village-observer-v034g2` 로컬 세이브 키. V0.34G1B/G1A/G1/F3 세이브 불러오기 fallback. 기존 세이브에서 새 버전으로 저장 후 별도 파일 export 가능.
- `index-standalone.html` / `dist/standalone/index.html`: 단일 파일 실행. `index.html`+`dist/hosted/assets`는 GitHub Pages 배포용.

## 한계·검증

- 3×3 공동 정착지 A와 (4,2) 별도 정착지 B: 식량 A 90, B 250, 인구 A 90, B 5, 완전 평지·도로 x0.62 조건에서 **(4,2)→(3,2)** 실제 배송 PASS, 식량 합계 보존 PASS.
- 가짜 최단 기하가 아닌 **실제 경로비가 더 싼 우회 진입점** 선택 PASS, 경로 null/차단 시 미배송 PASS, 같은 정착지 배송 방지 PASS.
- 신규 30일/180일 자연주행, D3 물리 재고 감사, F2 대사 중복 0, G2 식량 보존 오류 0 PASS. 해당 자연주행에는 실제 G2 보급 이벤트가 없었음.
- Standalone/Hosted 생성 빌드의 PC 1440px·모바일 390px Chromium 기본 실행 PASS. 브라우저 테스트는 hosted assets를 파일에서 읽어 인라인 렌더한 스모크 방식(실제 GitHub Pages 서버 연결 검증은 아님).
- **성숙한 35~36년차 원본 세이브에서 장기간 실제 G2 송수신·물류량·성능/균형 검증 미완료**. G1B 대비 인구/RNG 완전 일치는 의도적으로 요구하지 않음(정책 변경이므로).
- 기존 G1B 정착지 상세/타일 간결 UI를 유지. 원형 유클리드 반경 AND 경로 비용 기반 정착지 편입은 **G3**에서 검토.

## 빌드·테스트

```bash
npm run build
npm test
G2_DAYS=180 node tests/test-g2.cjs
python tests/browser-g2-smoke.py
```
