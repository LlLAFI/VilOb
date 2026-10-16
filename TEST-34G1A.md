# V0.34G1A 검증 결과 · 2026-10-16

## PASS

| 검증 항목 | 결과 |
| --- | --- |
| 보호 C1H 169개 블록 불변 해시 | PASS, `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` |
| Standalone/Hosted 빌드 및 190개 스크립트 구문 검사 | PASS |
| Snapshot CSV 열 1,683개 불변 | PASS |
| G1↔G1A 동종 난수 시드 30일 | PASS, RNG 37,762회 동일 |
| G1↔G1A 동종 난수 시드 90일 | PASS, RNG 67,326회 동일 |
| G1↔G1A 동종 난수 시드 180일 | PASS, RNG 115,306회 동일 |
| F2 신진대사 중복, D3 실물 회계 | PASS, 중복 0 / D3 감사 오류 0 |
| 3×3 다중 타일 정착지 공동 식량 90, 90명 합성 시험 | PASS, `hiddenShortageSettlements=1`, `falseDonorSettlements=1`, `duplicateDonorTiles=8` |
| 게임 실세계 `advanceOneDay`에 연결된 감사 | PASS, 6일 진행 후 `sampleDays >= 1` |
| 텔레메트리 경유 `NATIONAL_FOOD_RELAY32D5` 송수신·CSV 기록 | PASS, 입력 이벤트 1건 → 감사 Shipment 1건 |
| 국가 화면 `정착지` ↔ `타일` 하위 탭, PC Chromium | PASS, 1440×900, pageerror 0 |
| 국가 화면 `정착지` ↔ `타일` 하위 탭, 모바일 Chromium | PASS, 390×844, pageerror 0 |
| 실제 D2 정착지 레지스트리 기반 카드 정보 | PASS, 국가 UI 스모크 + 합성 다중 타일 화면 검사 |

회귀 비교 범위: 월드 날짜, 국가별 인구·식량비축·평균 Health·Happiness·실물 식량·영유 타일, RNG 호출 수. 월드 전체 직렬화 필드 단위 완전 일치는 주장하지 않는다.

## 제한 / 미검증

- 이전 사용자 35~36년차 G1 180일 로그에서 관측된 물류 감사 0행은 **G1 기록에 이미 발생한 문제이며**, G1A는 독립 샘플러와 E2 이벤트 관측을 도입했다. 기존 로그에 누락된 이벤트를 소급 복원하지는 않는다.
- 34~36년차 실제 사용자 세이브에서 G1A 감사 CSV가 몇 행 발생하는지는 **신규 사용자 자연주행 필요**. 이번 통제 입력·브라우저 스모크는 실게임 장기 주행의 대체가 아니다.
- 실제 식량 구호 경로 재설계, 같은 정착지로 향하는 보급 제거, 출발/도착 최적 도로·지형 경로 선택은 **G2**.
- 한 세션 최대 감사 상세 1600행, 예전 행은 오래된 순서로 폐기. 카운터 자체는 지속 집계. 저장·로드하면 감사 메모리는 재시작.

## 검증 재실행

```sh
npm run build
npm test
G1_DAYS=90 node tests/test-g1a.cjs
G1_DAYS=180 node tests/test-g1a.cjs
python tests/browser-g1a-smoke.py
```
