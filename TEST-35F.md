# V0.35F 검증 보고 (2026-10-21)

| 항목 | 상태 | 비고 |
|---|---|---|
| 빌드 | PASS | `npm run build`, Standalone/Hosted 생성 |
| C1H 원본 해시/블록 | PASS | SHA baseline `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`, 169개 |
| 기술·CSV | PASS | 기술 43개, CSV 1683열 |
| 정적·기본 회귀 `npm test` | PASS | 빠른 테스트 14개, exit 0 |
| 35F 선택형 계측 | PASS | 12개 metric, 결과 반환, 중지 시 메서드 복구 |
| 35E ↔ 35F 91일 일반 상태/RNG | PASS | 주요 상태 13영역, 세계 RNG 일치 |
| 35E ↔ 35F 30일 일반/거래강화 | PASS | 계측 OFF와 35F ON 비교, 상태 13영역·RNG 동일 |
| 35E ↔ 35F 91일 거래강화 최종 | 미완료 | 최신 카운터 변경 후 도구 제한시간 초과. 변경 전 초기 구현에서는 PASS |
| Hosted/Standalone × PC/모바일 Chromium | PASS | 4/4, 최초 버전 배지, 기존 계측 및 35F 패널 |
| 장시간 `test-35c`, `test-35d` 포함 일괄 | 미완료 | `npm test`의 빠른 묶음에서 분리. 별도 실행 필요 |
| 사용자의 실제 90년 세이브 A/B | 미검증 | 35E/35F 동일 세이브 파일 부재 |
| 150년 10배속 SIM/BATCH | 미검증 | 목표 달성 주장 없음 |

## 안전성

- 35E 원본 개발 판단의 **계측 OFF 동작을 변경하지 않음**. 건설 후보, 호출 순서, 예약 정책, 이벤트, 실패 처리, RNG 소비를 보존.
- 35F 계측 활성 상태의 전용 구현은 같은 조건문·순서와 종료 경로로 평가하며 테스트에서 세계 상태/RNG 동등성 확인.
- `projectBusy`·`startConstruction`·`shouldReserve31H`·`shouldReserve32C1`의 측정값은 서로 중첩될 수 있어 누적시간 단순 합산 금지.
- 창고/교역소 거부 원인은 `startConstruction`의 반환값만으로 분류하지 않음. 결과의 false는 실패 또는 다른 상태 변화를 수반할 수 있음.

## 합성 성능 스냅샷

`tools/bench-35f.cjs --days 4 --warmup 1 --runs 3` (선택형 계측 OFF): 35E 중앙값 43.7969ms/일, 35F 중앙값 38.7941ms/일, 13영역 요약 해시와 RNG 호출 동일. 짧고 잡음이 큰 합성 측정이므로 개선 증거로 사용하지 않음.
