# V0.34G1B 검증 보고 (2026-10-16)

| 시험 | 결과 |
|---|---|
| C1H 보호 소스 원본 169개 블록 해시 | PASS · 원본 SHA256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` |
| Standalone/Hosted 빌드와 JavaScript 구문 검사 | PASS · 총 191 스크립트 |
| Snapshot CSV V2 1,683열 | PASS · 스키마 불변 |
| G1A↔G1B 결정론 30일 | PASS · RNG 호출 37,762회 동일 |
| G1A↔G1B 결정론 90일 | PASS · RNG 호출 67,326회 동일 |
| G1A↔G1B 결정론 180일 | **미완료** · 실행 제한 초과, PASS 미판정 |
| G1A 기존 30일 회귀 + 공동 식량 감사 3×3 합성 | PASS |
| G1B 정착지 2타일 합성 집계 (공동 재고/용량·건물·인구) | PASS |
| G1A 세이브→G1B 불러오기, G1B 세이브 재불러오기 | PASS |
| PC Chromium 1440×900 정착지 상세 · 타일 간결 목록 | PASS · pageerror 0 |
| 모바일 Chromium 390×844 정착지 상세 · 타일 간결 목록 | PASS · pageerror 0 |
| 정착지 ↔ 타일 하위 탭, 선택 시 타일 물리재고 펼침, 구성 타일 이동 | PASS |
| 6일 주기 기존 물류 감사 연결 유지 | PASS · PC·모바일 양쪽 샘플 1회 이상 |
| 실제 35~36년차 사용자 세이브 장기 자연주행 | **미검증** · 사용자 주행 필요 |

`npm test` · `G1_DAYS=90 node tests/test-g1b.cjs` · `python tests/browser-g1b-smoke.py` 로 핵심 검증 재실행 가능.

**범위 제한:** G1B는 UI 전용이다. G1A에서 확인된 실제 정착지 내부 배송 3건(28.29 식량)과 잘못된 공급 후보 및 부족 판정은 G2의 행동 패치 대상이므로 남겨 두었다.
