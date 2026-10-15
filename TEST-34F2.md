# V0.34F2 검증 보고 — 2026-10-15

## PASS
- `npm run build`: PASS. 169개 C1H 보호 원본 해시 검증, 165개 원본 JS, CSS 4개. Standalone/Hosted 생성.
- `npm test`: PASS. 기존 Snapshot CSV V2 1,683개 고유 열과 줄·열 정렬 통과.
- 통제 신규 세계 Node VM **360달력일** 주행 PASS: `completedCycles=847`, `aliveProcessed=14,301`, `duplicateMetabolismRequests=0`, `fallbackMetabolism=0`, `dailyStarvationChecks=43,014`. 여러 국가의 신진대사·생존 통합.
- 전상자 fixture PASS: `woundedMetabolism` 증가 확인. 산업 노동자 및 전상자 모두 12일 기아 사망 판정 fixture PASS.
- 순수 일일 기아 판정 fixture: Day 0 유예 시작, Day 11 생존, Day 12 사망; Hunger 95 미만 회복 시 유예 초기화 PASS.
- `V034D3.audit(w)`: 30/60/90/180/360일 구간 물리 재고 검사 PASS.
- F2 저장→복원, F1A1 식별자로 된 데이터 복원 PASS.
- F1A1 52열 Food Flow 스키마와 1,683열 Snapshot CSV V2 스키마 유지.
- Chromium PC (1440×900), 모바일 (390×844) 화면 로드: 버전 V0.34F2, F2 활성, JS 오류 0.

## 보류·주의
- 360일 통제주행에서는 F1A의 완전 신규 관측창 84개 중 `newAnomalies=5`가 관측됐다. 별도 F1A1 통제주행에서도 같은 총 5건이 관측됨. F2에 의한 추가 발생인지 특정할 정보는 부족. 이 패치의 목표인 신진대사 구조 변경과 별개로 후속 회계 관측을 권장함.
- 동일 시드 F1A1·F2의 세계나 RNG 결과 일치는 의도적으로 요구하지 않는다.
- 실제 35년 F1 사용자 세이브의 장기간 복원·주행 시험은 세이브를 받지 못해 미실시.
- 실제 PC 게임 UI에서 ×10, 150년, SIM/BATCH 1000ms 미만 목표 검증은 **미실시**.
- Hunger·Health 수치식 개편, Happiness 일원화, Health 0의 의미 정의는 이번 범위가 아님.
