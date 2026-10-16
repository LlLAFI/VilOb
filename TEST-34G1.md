# V0.34G1 — 검증 결과 (2026-10-16)

## PASS — 빌드·소스·CSV
- `node tools/build.mjs --check-only`: PASS. C1H 보호 레거시 169블록 SHA256 불변.
- `node tools/build.mjs`: PASS, Standalone/Hosted 각각 189 스크립트 블록.
- `node tests/test-build.mjs`: PASS, 189개 스크립트 파싱 및 4개 CSS.
- `node tests/test-csv.mjs`: PASS, 기존 Snapshot V2 1683 고유 열.

## PASS — E2 관측 로직 통제 입력
`tests/test-g1.cjs`의 3×3 정착지 A(타일마다 인구 10명, 공동 식량 90) / 타일 한 개 정착지 B(식량 250) 합성 입력:
- E2 기존 타일별 비축일: 25.00일 / A 정착지 인구 90명 기준: 2.7778일.
- 기존 타일 수요로는 포착하지 못하는 긴급 정착지 수요(`hiddenShortageTiles=9`) 검출.
- 정착지 전체 기준 부적격 공급원으로 판정되어야 할 타일(`falseDonorTiles=9`) 검출.
- 같은 정착지의 중복 공급 후보(`duplicateDonorCandidates=8`) 검출.
- D3 `D3_SHARED_POOL_NO_SHIPMENT` 용량 0과 E2 fallback 용량 양수의 동시 조건에서 `sameSettlementFallbackPairs=1` 계측 검증.
- 실제 배송 관측은 `sameSettlementShipments`로 분류, 독립 CSV 출력 정상.
- 공급 (4,2) → 기존 도착 (1,1)의 맨해튼 거리 4, 적절한 A 접경점 (3,2) 거리 1인 후보가 추출되는지 확인. **실제 길찾기 알고리즘을 변경하거나 비교한 결과가 아니다.**

위 입력은 계측 함수에 대한 **합성 단위 시험**이지 수동으로 9개 타일을 소유한 실제 게임 시나리오를 주행한 증거가 아니다.

## PASS — F3 ↔ G1 주행 상태/RNG 회귀
`G1_DAYS=30`, `90`, `180`의 독립 주행(매 구간 F3/G1 같은 난수 시드 사용):

| 기간 | F3↔G1 종합 상태 해시 동일 | RNG 호출 동일 | 물리 재고 감사 | 신진대사 중복 |
| --- | --- | --- | --- | --- |
| 30일 | PASS `786a2e65236c...` | 37,762 | PASS | 0 |
| 90일 | PASS `94297932a799...` | 67,326 | PASS | 0 |
| 180일 | PASS `af07f77d9846...` | 115,306 | PASS | 0 |

비교 항목: 달력 날짜, 7개 국가 인구/식량 비축/Health/Happiness/물리적 식량·영유 타일 수, RNG 호출 수. 전체 World 내부 직렬화 바이트 완전 동일성이나 동일한 브라우저·기기 성능을 검증한 것은 아니다. 테스트 환경 180일까지는 다중 타일 Settlement가 충분히 형성되지 않아 G1 관측 CSV 상세행 수가 0인 것이 정상이다.

## PASS — 불러오기 및 브라우저
- G1 자체 저장·불러오기 및 F3 일반 세이브의 G1 복원 PASS.
- F3 Test Scenario v1.1 `F3-STRESS-06` JSON을 실제 브라우저 `NS.SaveSystem.importScenario` 경로로 가져오기 PASS, 세계 인구 106·D3 물리재고 감사 PASS.
- Chromium PC 1440×900, 모바일 390×844: G1 버전·감사 CSV 버튼·세계 생성/5일 실행 확인, JavaScript pageerror 0건.

## 미검증·후속
- 사용자의 34년 F3 본편 세이브에서 실제 9타일 정착지의 E2 배송 동작 및 물류 수치 계측은 아직 미진행.
- G1의 감사 대상은 E2 국가 내 긴급 물류로 제한됨; V27/V28 전체 이벤트 감사까지 완성된 것은 아님.
- 모든 역사 이벤트 문구, 원시 CSV 스키마 키의 정착지/타일 구분을 완전 교체하지 않음.
- 실제 운송 거리 최적화와 정착지 단위 물류 실행은 G2 대상. G1은 모델 변경 없음.
- PC 150년 장기 성능 및 20~60년 다중 타일 Settlement 실주행 검증은 별도 사용자 런 필요.
