# V0.34D3B2 검증 기록 — 2026-10-12

## 통과한 핵심 검증

- **빌드 원본:** `node tools/build.mjs --check-only`, SHA-256 C1H 베이스라인 일치, 보호 원본 169개(165 JS + 4 CSS) 무변경, Snapshot V2 스키마 1,683열 — PASS.
- **배포:** `npm run build`, Hosted / Standalone 178 JS 블록, CSS 4개, 출력 HTML 구문 PASS, 빌드 manifest 버전 B2.
- **전 범위 Node 회귀:** `npm test` 실행 순서의 `test-build`, `test-csv`, `test-d2b`, `test-d2b-focus`, `test-d3`, `test-d3a`, `test-d3a1`, `test-d3a1-natural`, `test-d3a2`, `test-d3b`, `test-d3b1`, `test-d3b2` 항목 모두 PASS 로그 확인. 기존 D2/D3 계측과 주거·물자·도로 통합 동작도 PASS.
- **V24 2인 개척:** 레거시 `NS.V024.startRegionalFrontier(...)` 실제 실행 → 물리 식량 10 차감, B2 지출 10, `frontierFoodSpent` 10, 30일 종료 구간의 미설명 잔차 0 — PASS.
- **V24 3인 개척:** 같은 실제 경로 → 13 차감/13 관측/잔차 0 — PASS.
- **저장/관측:** B2 재저장, B1 저장 가져오기, B 이전 legacy 세이브 위임, Devlog B2 필드, Food Flow 48 고유열, Snapshot 1,683열 — PASS.
- **PC/모바일 Chromium:** Standalone 및 Hosted 빌드에 포함된 JS/CSS를 동일한 순서로 실행, 1365×850 및 390×844, 페이지 오류 0, 초기·재렌더 좌상단 버전 `V0.34D3B2`, document.title, 저장·Devlog·패치노트 버전 모두 B2 — PASS.

## 검증 방법의 제한

- 실행 샌드박스 정책에 의해 Chromium `file://`/`http://localhost` 직접 탐색은 차단되었습니다. 따라서 브라우저 검증은 Standalone HTML의 실제 `set_content` 실행 및 Hosted 파일의 JS·CSS 바이트를 같은 순서로 인라인한 실행 검증입니다. Hosted 링크의 실제 네트워크 전송·원격 GitHub Pages 게시 여부는 검증하지 않았습니다.
- `npm test`는 25~75년 자연주행 대체 검증이 아닙니다. 이전 68년 자연주행과 다른 지도·난수 환경의 정규 회귀입니다.
- **모든 오래된 Food Flow 잔차가 0이라는 주장은 하지 않습니다.** B2 계측은 V24 식량 착공비 누락을 대상으로 합니다. 과거 이미 관측된 잔차를 소급 보정하지 않으며 나머지 원인도 조사해야 합니다.
- 초기 버전 문자열 오류는 UI 렌더링 및 최초 HTML 바이트 두 레벨에서 확인했습니다.
