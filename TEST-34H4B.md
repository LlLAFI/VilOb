# V0.34H4B 검증 기록 — 2026-10-20

| 검사 | 결과 |
|---|---|
| `npm run build` | PASS, H4B 208개 standalone script, Hosted 208개 script tag |
| GitHub Actions 동등 `npm test` | **EXIT 0**, 경량 필수 스모크 + H4B 1일 세계 상태 parity |
| C1H 보호 소스 SHA | PASS, 기존 169 blocks 유지 |
| CSV V2 | PASS, 1,683열 및 기존 수치 필드 |
| `tests/test-h4b.cjs` | PASS, 경계 두께 70%, 세계 국가색 마크업, 빌드 정합성 |
| `tests/test-h4b-border.cjs` | PASS, 실제 국경 renderer가 2.30px → 1.61px로 줄었고 선택 강조 모드는 그대로임 |
| `tests/test-h4b-storage.cjs` | PASS, 실제 `pruneDisconnectedTerritory()` 호출로 소유권 제거·건물 제거·석재 341.51 보존, 제어 시나리오 재점유 후 석재 상한 65 확인 |
| `tests/test-h2a.cjs` | PASS, 중립 타일 고아 연결 방지 및 레거시 복구 |
| H4A↔H4B 동일 시작 세이브 1일 | PASS, 주요 세계 상태 13개 및 RNG 결과 일치 |
| H4A↔H4B 동일 시작 세이브 30일 | PASS, 주요 세계 상태 13개 및 RNG 결과 일치 |
| Chromium Standalone/Hosted × 1440/390px | **4/4 PASS**; 세계 표 색상 막대 7개, 정렬 후 유지, 국가 선택, 지도, F0/F1, 전쟁 기록→지도, 수동 감사 |
| `npm run test:extended` 전부 | 미실행, 시간 비용 큰 과거 버전 검사는 별도 유지 |
| H4A↔H4B 90일 | 미실행 |
| 사용자 실제 90년 Save JSON 및 150년 성능 | 미검증 |

## `npm test` 구성

전체 검사가 기한 내 끝나도록 `test-h3.cjs`, `test-h4.cjs`, `test-h4a.cjs` 과거 버전 중복 테스트는 `test:extended`로 옮겼다. 변경 패치의 필수 기능/엔진 검증은 `test-h4b.cjs`, `test-h4b-storage.cjs`, H2A 정착지 복구, G2A/G3B/G4A1, 빌드·CSV, H4B 1일 동등성을 기본 CI에서 실행한다. **기존 모든 버전의 장기 테스트를 통과했다고 주장하지 않는다.**

석재 재현은 가능한 오류 발생 경로를 증명하나 실제 모든 과거 초과의 인과관계를 증명하지 않는다. 초과분 강제 보정 없음.
