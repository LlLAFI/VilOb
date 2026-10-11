# V0.34D3A — 시험 보고서

## 수행된 시험

1. C1H 169개 레거시 원본 내용/해시 불변, 총 JS 165/CSS 4 블록. 원본 Byte SHA-256 보존 검증, D3A 타깃 빌드 변환 성공.
2. Node 정적 테스트: 기존 V2 Snapshot 1,683열, Settlement 48열, Housing 11열, Economy 24열 유지.
3. `tests/test-d3a.cjs`: **단일 타일 식량·목재·석재 창고 만재 시 자연 원료 복원**, 동일 Settlement 두 번째 타일 저장 여유 사용, 외부 Settlement 재고 격리, 1.5배/2배 생산 보정과 부분 반환, 원 출발지로 재고 반환·보존, 실제 원격 식량 인출 계측, 45열 Food Flow CSV, 30일 회계·저장/복원 기록 유지 **PASS**.
4. `tests/test-d3a.cjs`: 동일 시드 **실제 80달력일 × 2회**(각 `advanceOneDay` 240회) 물리 상태 및 RNG 호출 수 비교 PASS. 음식 자연 수확(원료 차감) 약 5,900.64, 테스트 난수 호출 약 112,271. V0.24 subday=3 구조를 고려해 호출 횟수와 달력 일수를 구분.
5. 기존 `tests/test-d2b.cjs`, `test-d2b-focus.cjs`, `test-d3.cjs`, 정적 빌드/CSV 테스트 PASS. D3A 저장판이라 구버전 테스트에서 세이브 기대 버전만 최신으로 갱신.
6. `tests/browser-d3a-smoke.py`: Chromium desktop 1365×850, mobile 390×844에서 페이지 초기화, 버전/패치노트, D3A Food Flow CSV 버튼, D3 Economy CSV 24열, 저장/복원, D3 감사, 타일 경제 UI, V2 1,683열, JS 오류 0 **PASS**.

## 제한 사항

- 전체 `npm test`를 단일 명령으로 연속 실행한 시도는 제한 시간에 걸려 최종 정상 종료를 확인하지 못했습니다. 다만 출력이 남은 D2B/D2B-focus/D3 및 빌드/CSV 단계는 PASS였으며, D3A 단독 실행(`node tests/test-d3a.cjs`)도 별도로 PASS했습니다. **전체 단일 명령 PASS라고 주장하지 않습니다.**
- 실제 달력 370일×2 반복 자연주행은 완료되지 않았으며 80달력일×2만 통과. 월별 보고 동작은 30일 기준으로 실증되었지만 60–75년 장기 자연주행·특정 고정 시드 849일 정지·전쟁/점령 회귀는 검증되지 않음.
- Food Flow의 `otherDeposited/otherWithdrawn`은 여러 기존 경로가 섞인 값, `foodRegenObserved`는 회복 루틴이 실제 호출된 곳의 관측값. 총량 보존 독립 감사와 30일 식량 수지의 분해도를 혼동하지 않음.
- D3A가 지원하는 자동 세이브/불러오기는 **D3A끼리만** 호환. 이전 D3 세계로 새 버전의 패치 효과를 직접 재실행했다고 주장하지 않음.
