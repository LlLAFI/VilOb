# V0.34D3B 시험 기록 — 2026-10-12

## 확인됨

- `npm run build`: PASS (169개 보호 레거시 블록, JavaScript 165 + CSS 4, 원본 재구성 SHA 통과)
- `node tests/test-build.mjs`: PASS (Hosted/Standalone 176개 script, 4개 CSS, Snapshot V2 1683열)
- `node tests/test-csv.mjs`: PASS (1,683열, 72개 중복 컬럼 수정 유지)
- `node tests/test-d3b.cjs`: PASS. 평시 위기 → Recovery false; 실제 기아 → Survival true; 대규모 전쟁 실사상·경제 피해 → Recovery true; 전쟁 참여만으로 Recovery false. 건국 물리 목재 12 및 중복 지급 없음, 저장 왕복/D3A2 이식 PASS. 120일 실제 주행 D3 물리 재고/주거 감사 PASS.
- `node tests/test-d3a2.cjs`: PASS. 개척 식량 유지 0.064, 보급 사고 4, 회계 잔차 0, Food Flow CSV 48열, D3A2 실물 감사/저장 호환.
- `node tests/test-d3a1.cjs`: PASS. 30일 기간 및 기존 식량 비용 감시.
- `node tests/test-d3a1-natural.cjs`: PASS. 108일 × 2회 결정론/자원/주거 감사.
- `node tests/test-d2b.cjs`, `node tests/test-d2b-focus.cjs`, `node tests/test-d3.cjs`: PASS (공동 생활권·주거·물리 자원 회귀).
- `python tests/browser-d3b-smoke.py`: Chromium **PC 1365×850 / 모바일 390×844 모두 PASS**; JS 오류 0, 정책 버전 표시, 패치노트, 저장왕복, Economy 24열, Food Flow 48열, Snapshot V2 1,683열.

## 자연주행 관측

초기 후보(무직자만 목재 재배치 대상) 5년 자연주행에서는 Recovery와 생존모드는 없었지만 여러 나라의 목재가 0으로 떨어졌으며 재배치 건수는 0이었음. **이 결과를 최종 밸런스 검증으로 사용하지 않음.**

이를 보완해 여유 비식량 인력 재배치와 첫 개척 목재 비축을 도입한 **최종 코드**에 대해 동일 테스트 시드로 720일(2년) 자연주행을 재실행함.

| 지표 | 360일 | 720일 |
|---|---:|---:|
| 세계 인구 | 124 | 134 |
| 확보 영토 | 7 | 10 |
| Recovery 국가 | 0 | 0 |
| Survival 국가 | 0 | 0 |
| 목재 인력 재배치(누적) | 5 | 5 |
| 자원 보존감사 | PASS | PASS |

720일 시점에 델마 목재 6.29, 벨른 5.43으로 **모든 목재 부족이 해소된 것은 아님**. 전쟁 없는 평시 Recovery 미발생은 장기 정상 발전의 충분조건이 아니므로 10·25·50·75년 자연주행 검증이 필요함.

## 알려진 미완료 범위

- 최종 코드의 5년·25년·60~75년 연속 주행 검증은 미완료.
- 실제 전쟁을 자동 전개해 전투 사상·점령·전후 복구 진입과 해제 전 과정까지 확인한 통합 시나리오는 미완료(직접 정책 시나리오만 PASS).
- 모든 기존 이전 버전 시나리오의 `npm test` 전체를 단일 연속 실행하여 끝까지 PASS시키는 검증은 완료하지 못함(개별 핵심 회귀 PASS).
