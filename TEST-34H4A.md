# V0.34H4A 회귀 검증 및 미검증 목록

## 필수
- 169개 protected C1H 블록 SHA, CSV V2 1,683열, JS 207개: `tests/test-build.mjs`, `tests/test-csv.mjs`
- H2A orphan settlement regression: `tests/test-h2a.cjs`
- H4 석재 storage capacity 회귀: `tests/test-h4.cjs`
- H4A 석재 진단 순수성/관측/8개 세이브 버전/국가 경계 색상: `tests/test-h4a.cjs`
- H4→H4A 동일 RNG 실세계 상태 13영역: `tests/test-h4a-parity.cjs` (CI 1일; 독립 10·30일 확장)
- 브라우저: standalone + hosted 각각 1440×900, 390×844: `tools/browser-h4a-smoke.py`, 저장된 결과는 `docs/H4A-BROWSER-RESULTS.json`

## 주의
- 전체 CI 실패 시 관련 `npm test` 로그/종료 코드를 별도 확인할 것. 단순 개별 PASS를 전체 PASS라고 주장하지 말 것.
- 실제 H4 90년 Save JSON의 석재 경고 5건의 인과 원인은 이번 릴리스에서 확정하지 않음. Devlog+Snapshot만으로 타일 내 장기 저장의 발생 이력을 재구성할 수 없음.
- 스토리지 진단은 기존 재고/건물 자료를 읽기만 한다. 실제 생산·물류·재고를 고치거나 가상의 용량을 주지 않음.
- 150년 10배속 F0 목표 성능은 이번 UI/관측 핫픽스 완료 조건이 아님.

## 2026-10-20 최종 실행 결과

| 검사 | 결과 |
|---|---|
| `npm run build` | PASS, H4A Standalone/Hosted 생성 |
| `npm test` (필수 CI) | **EXIT 0**. 169 protected blocks/CSV 1683/기능 스모크/H4A 1일 parity 포함 |
| `node tests/test-h4a.cjs` | PASS: 진단 조회 재고 불변, 저장 초과 증가 감지, 8개 Save 버전, 국가간 검정 경계 |
| H4↔H4A 동일 상태·난수 10일 | PASS, 핵심 13영역 일치 |
| H4↔H4A 동일 상태·난수 30일 | PASS, 핵심 13영역 일치 |
| Standalone×PC/모바일 및 Hosted×PC/모바일 | PASS 4/4; 지도/통계 국가 선택/수동 감사/전쟁 지도 이동 |
| ZIP testzip/CRC | PASS |
| 90일 H4A 전후 parity | **미실행** (30일까지 검증됨) |
| 실제 사용자 90년 Save JSON 로드 | **미실행** (세이브 미제공) |
| 150년 F0 성능 목표 | **미검증** |
