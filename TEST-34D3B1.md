# V0.34D3B1 시험 기록 — 2026-10-12

## 직접 실행한 검사

- `node tools/build.mjs --check-only` — 원본 169블록 SHA, Snapshot V2 1,683열 확인: PASS.
- `node tools/build.mjs` — Hosted/Standalone 177개 script 및 빌드: PASS.
- `node tests/test-build.mjs` — JS 구문 및 스크립트 수, CSS 4개, 원본 SHA: PASS.
- `node tests/test-d3b1.cjs` — 완전 도로 마름모 **13타일 실제 병합**, 접근비 1.24, 13타일 상한, 중심 맨해튼 거리 2 상한, 도로 상태 25 미만에서 경로 거부, 분할 180일 유예/실제 분리, 개척 후보 조건부 보너스, D3B 저장 이식 및 D3B1 저장 왕복: PASS.
- `node tests/test-d3b.cjs` — 초반 경제 계수, 실제 최초 목재, 평시/전후 Recovery 정책, 120일 물리 재고·주거 감사: PASS.
- `node tests/test-d3a2.cjs` — 개척 유지/사고 실물 식량 48열 회계, 0 잔차 및 이전 저장 이식: PASS.
- `node tests/test-d3a1.cjs`, `node tests/test-d3a.cjs`, `node tests/test-csv.mjs`, `node tests/test-d2b-focus.cjs` — 핵심 역호환/공동 주거·물자 및 CSV: PASS.
- `python tests/browser-d3b1-smoke.py` — Chromium PC 1365×850 / 모바일 390×844, 페이지 오류 0, Economy 패널/24열, Food Flow 48열, Snapshot 1,683열, 버전·패치노트, 저장 왕복, D3 물리 재고 감사 모두 PASS.

## 미완료·관찰 항목

- 전체 `npm test` 및 레거시의 모든 장시간 자연주행 회귀를 단일 명령으로 끝까지 돌린 기록은 없음. 일부 오래 걸리는 회귀는 중단됐으며, 성공으로 표기하지 않음.
- D3B1의 실제 무작위 도로망에서 25~75년 자연주행 비교는 미검증. `ROADS` 기술과 실제 도로 건설은 AI의 선택에 의존하며, 이상적인 완전 13타일 패턴이 자동으로 흔히 나타나는지는 확인되지 않음.
- D3B 59년 자연주행에서 관찰된 V24 개척 식량 계측 누락 및 평시 소정착지의 식량 접근 문제는 계속 OPEN. 본 패치의 테스트는 기존 D3A2 V20 유지·사고 경로에 관한 회계 정상 여부만 확인함.
