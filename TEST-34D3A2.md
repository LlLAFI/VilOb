# V0.34D3A2 — 검증 기록 (2026-10-11)

## 완료되어 PASS로 확인한 항목

- `npm run build`: Protected C1H 원본 SHA `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`, 169개 블록 (165 JS, 4 CSS), Standalone/Hosted 생성.
- `node tests/test-build.mjs`: 양쪽 빌드 스크립트 총 175개, 레거시 해시 원본 불변 PASS.
- `node tests/test-csv.mjs`: Snapshot CSV V2 고유 1,683열 PASS.
- `node tests/test-d2b.cjs`, `test-d2b-focus.cjs`: Person 정합성, 주택/이주/슬롯 PASS.
- `node tests/test-d3.cjs`: 공동 자원 격리/이동/경제관측 및 자연 200일 감사 PASS (개별 실행).
- `node tests/test-d3a.cjs`: 일반 생산 원료 보존, 같은 Settlement 창고 공유, 타 Settlement 격리, 보존적 반환, 저장/복원, 개별 70일×2 결정론 PASS. **원래 240일 중복 검사는 독립 108일 시험과 중복되어 70일로 축소**.
- `node tests/test-d3a1.cjs`, `test-d3a1-natural.cjs`: 실제 30달력일 집계, 부패/착공 식량비, 저장 이식, 108일×2 결정론 PASS.
- `node tests/test-d3a2.cjs`: 실제 Village.food setter 차감 전후 물리량 검산, 유지비 0.064, 사고비 4.0, 30일 수지 잔차 0, 48열, 저장/복원, D3A1 저장 이식 PASS.
- `test-d3a2.cjs`에서 실제 V20 `dailyTick()`의 유지비·보급 사고 분기를 실행하여 실제 타일 재고 감소 0.064와 4.0 집계 PASS.
- 동등 시드 V0.34D3A1 vs V0.34D3A2 실제 70달력일 교차 주행: 물리 타일·Person 상태 일치, RNG 32,041회 일치 PASS.
- `python tests/browser-d3a-smoke.py`: Chromium PC 1365×850, 모바일 390×844; 초기화, 저장/복원, UI, Food Flow 48열, Snapshot 1,683열, JS pageerror 0건 PASS.

## 구분해서 보고할 한계

- 연속 전체 `npm test`는 해당 환경의 시간 제한으로 **완주 확인하지 못함**. 시험을 독립적으로 실행하여 앞서 열거한 항목을 확인함. 전체 명령을 한 번에 PASS라고 주장하지 않음.
- 기존 D3A 자연주행 테스트의 240일×2 구간은 실행시간이 길고 D3A1의 별도 108일×2 결정론과 중복돼, D3A2에서 70일×2로 축소함.
- 과거 D3A1 5년 주행 잔차 164.61은 이전 자료이며, D3A2 실제 5년 세계에서 0이 된 것으로 확인한 것은 아님.
- 60~75년 후기 자연주행·실제 전쟁 및 점령·과거 특정 시드 정지 문제는 검증되지 않음.
