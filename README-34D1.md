# Village Observer V0.34D1 — Settlement Aggregate V1

- 개발 기준선: V0.34D0 (V0.34C1H 원본의 165개 스크립트/4개 스타일 블록 유지)
- 구현일: 2026-10-11
- 패치 범위: **관측과 집계**. 생산·이주·AI·전투·자재/Gold 이전 규칙은 변경하지 않음.

## 핵심 변경

1. `src/bootstrap/v034d1.js`에 읽기 전용 `NS.V034D1` API 도입.
   - `prepare(world)` : 국가별 Person 거주/근무 인덱스를 **해당 요청에서만** 구성. 기존 `ensureLaborIndex29()` 등 작업 재배정 루틴을 호출하지 않음.
   - `aggregate(world, settlementId, prepared?)` : 활성 Settlement의 정확한 소속 타일 목록 기준으로 재고·건물·주거·인구·근무·개인/시장 자금 집계.
   - `all(world)` : 전체 활성 Settlement 읽기 전용 집계.
   - `audit(world, rows?)` : 독립적인 국가별 실제 타일·Person 순회와 합계를 대조.
   - `csv(world)` : Settlement당 한 행, 32개 고유 헤더의 독립 CSV.
2. 여섯 자원(`food`, `wood`, `stone`, `iron_ore`, `iron`, `tools`)과 타일별 실제 재고 위치를 보존하며, 새 물리적 Settlement 자원 창고를 만들지 않음.
3. 한 날에 건설/인출/세금 변동이 있어도 캐시된 옛 재고 대신 현재 `tile.stocks`와 `tile.v29Economy.marketGold`를 읽음.
4. 주민은 소유 국가 Person의 `homeTileId` 기준, 근무자는 `workTileId` 기준으로 따로 집계. 외부 통근 유출입 구분.
5. 주택 수용량은 실제 건물별 `capacity`와 현재 건물 효율을 기준으로 집계하며, 전체 수용량과 과밀 **개별 타일 수**를 동시에 노출.
6. 타일 정보창의 이전 Settlement 요약을 D1 상세표로 교체하고, 국가의 정착지 화면 상단에 D1 요약 추가.
7. Devlog는 세계 전체 D1 독립 검산·Settlements 수를 표시. Snapshot에 `d1SettlementCount`, `d1AggregateErrors`, `d1OvercrowdedTileCount`, `d1InactiveBuildings` 기록. **기존 Legacy 및 CSV V2 1,683열 구조에는 새 열을 추가하지 않음.**
8. `스냅샷 CSV V2` 옆에 `Settlement CSV` 다운로드 버튼 추가 (32열, 현재 시점 정착지당 한 행).

## 저장·복원

- D1 전용 저장 키: `village-observer-v034d1`, 저장 식별자: `V0.34D1`.
- D0와 이전 버전 저장의 불러오기는 필수 기능이 아니며 D1에서는 거부. 이는 과거 호환 때문에 구조 개선을 희생하지 않기로 한 개발 원칙을 반영함.
- 이전 레거시 로더의 초기 건물/정찰 재적용을 완화하기 위해 **D1 자체 저장본**에 한해 실제 저장된 타일의 건물·상태·재고·시장 자금과 Person 데이터를 다시 적용하고 저장된 Telemetry 기록을 유지함.
- 기본값이 없는 구형 필드는 기존 로더가 기본값을 채울 수 있으므로 완전한 직렬화 바이트 동일성까지 주장하지 않음. 저장된 물리 타일과 Settlement 통합값 보존은 검증함.

## 미포함 범위

- 주거·직장·이주·채용 AI의 의사결정 개편: **D2**.
- 정착지 지역 경제 통합/내부 물류 규칙 개편: **D3**.
- 군사·AI·생산 밸런스 변경, 기존 세이브 이전 변환기: 미포함.

## 실행·빌드

- 프로젝트 전체 ZIP을 GitHub 저장소 최상위에 해제한 뒤 `npm run build`, `npm test`.
- `dist/hosted/index.html`: GitHub Pages (동봉 `assets/` 경로 필요).
- `dist/standalone/index.html` 및 `index-standalone.html`: 파일 한 개로 실행.
- 이중 배포에 사용되는 D1 소스는 `src/bootstrap/v034d1.js`; D0 원본 소스 169개 블록은 Manifest 해시 보호를 계속 받음.

## 검증과 한계

- `npm test`: C1H → D1 신규 세계 일별 물리/이벤트/난수 8일 × 정밀계측 ON/OFF, 유지보수 직접 처리 3회 × ON/OFF, D1 집계·같은 날 재고/Gold 변동·다중 타일 가상 fixture·저장복원·CSV.
- 실제 Chromium 메모리 HTML 로딩으로 버전·패치노트·버튼·월드·타일 Inspector·독립 감사 PASS.
- 로컬 HTTP는 테스트 환경에서 차단됨. 실제 GitHub Pages 배포 URL의 HTTP 로딩 및 실제 70년 장기 자연주행/저장본 회귀는 미검증.
- 기술 및 성능 변화율을 D1의 개선 성과로 주장하지 않음. 관측 비용은 Snapshot과 UI에 추가될 수 있으므로 다음 자연주행에서 측정할 것.
