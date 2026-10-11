# V0.34D3A1 — 검증 기록

## 확인된 PASS

- `npm run build`: 기존 C1H 원본 169개(165 JS + 4 CSS) 보호, Standalone + Hosted, 원본 SHA-256 바이트 재구축, Snapshot V2 1,683열.
- `node tests/test-build.mjs`, `node tests/test-csv.mjs`: 174개 최종 JS 블록, Legacy 원본 해시 및 1,683열 고유 Snapshot 정합성.
- `node tests/test-d3a1.cjs`: 구간 경계 `[1,30]`, `[31,60]`, 고유 46열, 실제 부패 2/개척 물리 식량 3 계측, D3A1 저장·복원, 과거 D3A 세이브의 *옛 90일 관측 창 초기화* 후 월별 새 기록 시작.
- `node tests/test-d3a1-natural.cjs`: 동일 시드 실제 `calendarOrdinalDay=1→109` **108달력일 ×2회**, 완료 월 3개 `[1,30]/[31,60]/[61,90]`, 타일/Person 물리 상태·RNG 호출 수 완전 일치, D3 재고 및 D2A 주거 감사 정상.
- `node tests/test-d2b-focus.cjs`: Settlement 공동 주거와 내부 이동 제외, 건설 슬롯 진단 정상.
- `python tests/browser-d3a-smoke.py`: Chromium PC·모바일, D3A1 제목/버전/패치노트, D3 경제 CSV 24열·Food Flow 46열, 세이브 라운드트립, 타일 경제 UI, JS 오류 0.

- `npm test`: 레거시 원본 감사 → 빌드/CSV 정적 검사 → D2B/D2B-focus/D3/D3A/D3A1/D3A1-natural 전체 묶음을 한 번에 실행해 **PASS**.

## 검증 범위

**아직 60~75년 자연주행과 실제 전쟁·점령 중 식량 회계는 확인하지 못했습니다.** 과거 Food Flow 90일 데이터는 이 버전에서 자동 30일 복원되지 않습니다. D3A1에서 식량 수지의 미설명 항목이 완전히 0이 된다고 보장하지 않습니다. 과거 D2B에서 관측된 특정 시드의 장기 진행 중단은 이번 수정으로 해결했다고 판정하지 않습니다.
