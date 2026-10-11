# V0.34D3 검증 보고

2026-10-11 · 기준선 V0.34D2B

| 시험 | 결과 | 증거/범위 |
|---|---|---|
| 169개 보호 원본 SHA 및 CSV V2 구조 | PASS | `npm run build`, `npm test` |
| 다중 타일 공동 식량 소비 | PASS | 코어 식량 0, 같은 Settlement의 다른 타일 식량 16 → Person 식사 성공 |
| 주거·자원 통합 및 건설 슬롯 기존 회귀 | PASS | `test-d2b.cjs`, `test-d2b-focus.cjs` |
| 식량/철광/도구·저장한도 공동 접근 | PASS | `test-d3.cjs` |
| 같은 국가의 다른 Settlement 격리 | PASS | 합성 다른 Settlement 저장 식량 21은 접근 금지 |
| 타국 식량 격리 | PASS | 타국 물리 저장 식량 31 변화 없음 |
| 시장 Gold 무생성 이전 | PASS | 두 타일 Market Gold 1+8, 이체 5 후 6+3 |
| 동일 Settlement 공통 부족률/가격 | PASS | `harmonizeMarketRows` 2타일 |
| 같은 경제권의 가상 내부 운송 | PASS | 용량 0 반환, 실제 재고는 묶여 보임 |
| 원본 1,683 / 48 / 11열 CSV | PASS | 기존 테스트+200일 실측 |
| 신규 Economy CSV | PASS | 24열, 값 7개 Settlement로 내보내기 검증 |
| 물리 상태 및 난수 결정론 | PASS | 120일 2회, 370일 2회 |
| 장기 시작 구간 보존 감사 | PASS | 370일 13개 시점에서 0건 |
| Standalone / Hosted 빌드 | PASS | Node.js 빌드 |
| PC·모바일 Chromium 초기화·버전·24열 CSV·저장/복원·JS 오류 | PASS | `tests/browser-d3-smoke.py` 및 모바일 단독 재검증 |
| 75년/극단적 전쟁/실제 GitHub Pages HTTP | 미검증 | 사용자 자연주행 필요 |
| 과거 고정 시드 849일 정지 원인 | 미해결 | D2A/D2B 비교에서도 유사 현상, 원인 미확정 |

370일 자체 반복실험은 2회 총 약 31초(테스트 환경 계측) 동안 실행, 13개 시점에 D3 감사 오류 0건. 테스트 종료 시 식량 채집 관측 약 9,472.64, Person의 음식 출고 요청 약 5,726.76, 실제 음식 지급 약 5,726.34, 보관 거절 누적 약 2,162.83. 이 마지막 수치는 **일부 이체 후 반품도 포함할 수 있는 입고 거절**이며 자연식량의 영구 유실량으로 취급해서는 안 됩니다.

**정식 D3 CLOSED 전 확인:** 사용자 자연주행에서 다중 타일 Settlement가 등장한 5~10년 이상 데이터, World Devlog (`v034d3Audit`, `v034d3FoodFlow`), D3 Economy CSV, 주거·Settlement CSV, Snapshot CSV V2, 기아/수송/창고 관련 이벤트를 교차 확인. 신규 제도는 Settlement 내부의 물리 거리를 무료 공유하지만 국경·별개 정착지 사이의 물류를 우회해서는 안 됩니다.
