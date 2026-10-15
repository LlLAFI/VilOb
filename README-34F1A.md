# Village Observer V0.34F1A — Food Accounting Reconciliation V1

기준: V0.34F1 · 배포일: 2026-10-15

## 의도

60년 F1 자연주행에서 발견된 Food Flow 30일 재고 차이 105건에 대한 관측 정합성 수정.

- 에브 `st-0000007` 약 81건: 구 버전 `Village.dailyTick()` 초과비축 차감이 국가 `food` setter를 통해 타일 식량을 실제 감소시키나 D3A Food Flow에는 빠짐.
- 키오의 점령기 약 24건: 적 점령 타일의 D3 `members()`가 정상적으로 공유 재고 접근을 거부하는 동안, D3A 관측만 별도 `tile-N` ID에 기록하여 원래 물리적 Settlement ID의 순출납과 불일치.

두 문제는 **자원 손실 정책 자체와 회계 장부 귀속을 구분**해야 한다. 관측을 고치는 F1A에서는 식량·경제·군사·기아·건강·출산·AI 정책을 변경하지 않는다.

## F1A-01 레거시 초과비축 실지출 계측

- `tools/f1a-transform.mjs`: 보호 원본 `src/legacy/008.js`을 수정하지 않고 빌드 산출물의 기존 두 식량 setter 연산을 관측한다.
- setter 실행 전후 국가 영토 내 **물리적 타일 식량 감소량**만 추적하며 D3A `otherWithdrawn`에 한 번 기록한다.
- 같은 값의 출처 설명용 `legacyOverflowFoodSpent`은 `otherWithdrawn`의 부분집합이며 `observedFoodDelta`에서 **다시 빼지 않는다**.
- 정책식 `.08`, 최소 `.2`, 상한 `caps.food*1.10`을 비롯하여 RNG와 연산 시점은 유지.
- 초과비축이 없는 일반 날짜에는 타일 재고 스캔을 실행하지 않는다.

## F1A-02 임시 점령 장부 귀속

- `src/bootstrap/v034d3a.js`의 **관측 행 키만** 실제 소유 타일의 ACTIVE 물리 Settlement ID와 전체 타일 구성으로 정규화.
- D3의 실제 `withdrawAt`, `depositAt`, `members`와 점령 통제·AI·전쟁 정책은 그대로.
- 점령으로 공유 접근이 배제된 타일에서도 같은 원래 Settlement의 재고 변화를 `st-N` 장부에 귀속한다.
- 신규 `occupationLedgerAttributions`는 관측이 정규화된 호출 빈도이며 이동·생산량을 뜻하지 않음.
- 정상 출납에서는 이미 주어진 D3 멤버십을 재사용하여 별도 Settlement 검색을 피한다.

## CSV / 이상 분류 / 구버전 세이브

- 내보내기 `Food Flow 30일 CSV`: 기존 48열 + `legacyOverflowFoodSpent`, `occupationLedgerAttributions`, `accountingEra`, `residualClass` = **52열**.
- `BALANCED`, `LEGACY_OVERFLOW_ACCOUNTED`, `OCCUPATION_LEDGER_RECONCILED`, `TOPOLOGY_CHANGE`, `TRUE_UNATTRIBUTED`, `NOT_COMPARABLE`을 구분. 균형 상태를 자동으로 회계 오류로 오인하지 않음.
- 식량 이상 CSV는 완전히 F1A 시대의 종료된 구간에서 진짜 미설명 잔차만 출력한다.
- F1/F0 저장파일 읽기 지원. 이전 기록은 `F1_LEGACY`, 패치 적용 중인 부분 구간은 `MIXED`로 식별하고, 이미 존재했던 과거 이상 기록을 고친 것처럼 표시하지 않음.
- F0의 ×10 성능 기록 및 F1 생존 위험·60일 SIM 추적 기능은 유지.
- CSV V2 1,683열과 보호 레거시 원본 SHA는 변경하지 않음.

## 검증 완료

- 동일 시드 F1 ↔ F1A **90일·180일** 주요 세계 상태·난수 호출 횟수 일치: PASS.
- 강제 초과비축 처리: 동일 세계 결과를 유지하면서 실제 유출량 관측(90일 fixture에서 153.2605, 180일 fixture에서 272.39517): PASS.
- 임시 점령 타일 D3 재고 접근 차단과 D3A canonical Settlement 귀속 동시에 확인: PASS.
- F1A 저장 복원, F1 저장 가져오기: PASS.
- D3 물리 재고 감사 및 CSV V2 1,683열: PASS.
- PC 1440×900 및 모바일 390×844 Chromium HTML 초기화: PASS, JS 오류 0.
- 360일 두 버전 대조는 실행시간 제한으로 완료하지 않음. 35~60년 실제 사용자 저장 데이터의 재현, 150년 ×10 성능 목표는 미검증.

## 다음 사용자 검증

F1에서 저장한 35년 세계를 F1A에 불러와 60년까지 재생하고 `Food Flow 30일 CSV`, `식량 이상 구간 CSV`, `Snapshots CSV`, `Devlog JSON`을 확보한다. 전쟁·점령이 발생하는 동일한 조건에서 신규 **완료된 F1A** 관측 구간만 비교해야 한다. 과거 저장세계의 RNG 재현성은 현재 저장 상태의 PRNG 복원 여부에 달려 있으며 지도 시드가 같다는 사실만으로 보장되지 않는다.

식량 손실 규칙 통합과 Hunger 100 / Health 0 생존 판정의 수정은 **F1A 범위 밖**으로 남겼다.
