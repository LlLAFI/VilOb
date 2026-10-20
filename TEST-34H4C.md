# V0.34H4C 검증 보고 — 2026-10-20

| 검사 | 결과 |
|---|---|
| `npm run build` | PASS; standalone 209개 script, Hosted 209개 script; baseline SHA 변경 없음 |
| `npm test` | PASS, EXIT 0 |
| CSV·기술 | 1,683열, 기술 43개 보존 |
| `tests/test-h4c.cjs` | PASS: 기존 초과 재고의 신규 석재 입고 거절; 실제 route capacity 이내 물리 운송; 배송 전후 총량 보존; 수동 반환 정확성; 다중 타일 Settlement 전체 상한; 중립 경계/선택 모드; 세이브 라운드트립 |
| `tests/test-h2a.cjs` | PASS: 고아 정착지 링크 수리·등록부 감사, Save JSON 호환 |
| `tests/test-h4b-storage.cjs` | PASS: 포기→중립화→재개척에서 실물 석재 보존 |
| `tests/test-h4b-border.cjs` | PASS: 기존 국가-국가 1.61px 경계 유지 |
| G2A/G3B/G4A1 필수 회귀 | PASS |
| H4A↔H4C 같은 시작 세계 1일 | PASS, 13개 주요 상태 동일 |
| H4A↔H4C 같은 시작 세계 30일 | PASS, 13개 주요 상태 동일 (해당 구간 신규 overflow logistics 미발생) |
| Chromium Standalone/Hosted × PC/모바일 | **4/4 PASS**: 지도/통계/세계/War/F0/F1/감사/저장 진단 버튼 |
| 90년 실제 사용자 Save JSON | 미수행: 사용자 전체 Save JSON 없음 |
| 150년 성능 및 모든 `test:extended` | 미수행; 실환경 필요 |

## 테스트 해석

H4C는 **석재 입고·배송 규칙을 실제로 변경**한다. 초과분이 없고 새로운 물류 동작도 없는 짧은 구간만 이전 버전과 동일성 검증에 적합하다. 배송이 발생하는 별도 제어 시나리오에서는 H4A/H4B와 국가의 자원 배치가 달라지는 것이 정상이다. 이때 검증 핵심은 원자적 거래량 보존과 실물 경로·저장 상한 준수다.

정착지의 과거 비축량 초과를 '오류 0'으로 위장하지 않으며 H4A/H4의 감사 경고를 유지한다. 새 `worldSummary.v034h4c`가 0 잔차 및 실제 배송량의 관측 수단이다.
