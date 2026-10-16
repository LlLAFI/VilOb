# V0.34G2 테스트 보고

## 자동 검사 (2026-10-17)

| 검사 | 결과 | 비고 |
|---|---|---|
| C1H 보호 소스(169개 블록) | PASS | 빌드 SHA 검사 |
| Snapshot CSV 1,683열 | PASS | 기존 V2 스키마 유지 |
| Standalone/Hosted 생성 | PASS | bootstrap G2와 변환된 V27/V28/E2 적용 |
| 3×3 한 정착지 수요 + (4,2) 외부 공급 | PASS | 24→23, 비용 0.62, 수량 약 54.02 |
| 3×3 내부 9타일 별도 수요 금지 | PASS | 1개 정착지 1개 수요 |
| 실제 비용 우회 경로 선택 | PASS | 최단 맨해튼 이외의 비용 최소 타일 선택 |
| null/차단 경로 처리 | PASS | 0 비용으로 잘못 변환하지 않음 |
| 동일 정착지 내부 배송 방지 | PASS | 다른 공급 정착지 없을 때 무배송 |
| 출고·입고 합산 식량 보존 | PASS | 잔차 0 |
| 동일 시점 중복 배송 방지 | PASS | 주기 게이트 |
| G1B 이전 세이브 import | PASS | synthetic serialized world bridge |
| G2 세이브 재저장 | PASS | World.from → serialize |
| 신규 세계 30일 자연주행 | PASS | 물리재고·F2 대사·오류 0 |
| 신규 세계 180일 자연주행 | PASS | 물리재고·F2 대사·오류 0, 구호 이벤트 0 |
| PC·모바일 Chromium | PASS | Standalone + hosted build assets 각각 1440·390px |
| 실제 35년차 세이브 실제 배송/성능 | 사용자 검증 대기 | 성숙한 다중 정착지 및 기아 위기 필요 |

## 사용자 권장 회귀

1. V0.34G1B의 35년차 세이브를 V0.34G2에서 가져온다.
2. ×10으로 90~180일 진행(중간 불러오기 없는 연속 주행).
3. `G2 정착지 배송 CSV` + `G1A 물류 감사 CSV` + Devlog JSON + Snapshot CSV를 보낸다.
4. G2 `conservationErrors` 0과 DEVLOG `NATIONAL_FOOD_RELAY32D5.model`/송수신 Settlement ID가 서로 다름을 확인한다.
5. 신규 구호가 너무 빈번해지거나 병목이 발생하면 3일 선제 대상과 24/40주기 공급 보존 기준을 별도 균형 조정한다.

유의: 원형 정착지 통합 반경·도로 등급은 본 패치 범위 아님.
