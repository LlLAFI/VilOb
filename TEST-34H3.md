# V0.34H3 검증 보고 — 2026-10-19

| 검사 | 결과 | 설명 |
|---|---|---|
| `npm run build` | PASS | C1H 169개 불변·CSV 1,683열·Hosted/Standalone 생성 |
| GitHub Actions 대응 `npm test` | PASS (exit 0) | build check + static 7개 스모크, 새 H3 저장/세이브/기술/전쟁 렌더 경계 |
| H2A 등록부 고아 연결 복구 | PASS | 과거 포기된 core 재연결 방지, 모의 H2 오류 저장의 제한 복구·재고 보존 |
| H2A ↔ H3 30일 parity | PASS | 같은 H2A 저장·난수에서 `year`,`quarter`,`day`,`map`,`villages`,`persons`,`people`,`v34b`,`v34c`,`v33e`,`v33f5`,`v33g`,`v29Nations` 등 13개 일치 |
| H2/H1/H0/G5 세이브/30일 검사 | PASS | `node tests/test-h2.cjs`, 기술43 및 CSV1683 |
| Chromium PC/mobile Standalone | PASS 2/2 | 1440×900, 390×844; JS pageerror 0 |
| Chromium PC/mobile Hosted assets | PASS 2/2 | 빌드 생성 자산을 로컬로 인라인한 동등 환경; JS pageerror 0 |
| 국가·세계 정보 | PASS | 국가 7개/기술43, 정렬/필터, F0/F1 기존 패널·클릭 리스너 보존 |
| 공식 전쟁→지도 | PASS | 실제 전쟁 모델로 생성한 1개 모의 전쟁·교전 타일 지도 점프; 옛 C 이중 통계 패널 없음 |
| 오류 경고·수동 감사 | PASS | 기존 Snapshot 경고 표시/해제, 버튼을 통한 C/D2/D3 감사 |
| 실제 사용자의 88년 H2A Save JSON | NOT TESTED | 제공되지 않음; Devlog/CSV는 게임 저장파일이 아님 |
| G5 180년/모든 확장 스크립트 | NOT RUN | 장기 `test:extended`는 CI-smoke와 구분 |
| 150년 실환경 성능 | NOT TESTED | 엔진 최적화 패치가 아닌 UI 패치 |
| GitHub Pages 실제 원격 배포 | NOT DEPLOYED | 사용자 Push + GitHub Actions 확인 필요 |

주요 파일: `docs/H3-BROWSER-RESULTS.json`, `src/bootstrap/v034h3.js`, `tools/h3-transform.mjs`, `tests/test-h3.cjs`, `tests/test-h3-parity.cjs`.

검증 범위 해석: 정적/브라우저 테스트는 실제 88년 세이브의 완전 복구나 저장 초과 경고의 해결을 의미하지 않음. 수동 감사는 원인을 확인하는 관측 UI이며 물리 재고를 바꾸지 않음.
