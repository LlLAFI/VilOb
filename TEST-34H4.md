# V0.34H4 검증 보고 — 2026-10-19

| 검사 | 결과 | 근거 및 제한 |
|---|---|---|
| 보호 C1H 169개 원본 / CSV 1,683열 | PASS | `node tools/build.mjs --check-only` |
| 빌드 | PASS | `npm run build`; Host/Standalone 출력 |
| 배포 필수 CI | PASS | `npm test` exit code 0 (8개 기능/정적 스모크 + 10일 parity) |
| H2A 정착지 중심 포기/복구 | PASS | `tests/test-h2a.cjs` |
| H4 석재 진단 / 자원 보존 | PASS | `tests/test-h4.cjs`: 시설 비활성화 후 재고 유지; 두 유형 분류, 감사 무수정 확인 |
| H3/H4 실제 시뮬레이션 비교 | PASS | `H4_DAYS=30` 및 `H4_DAYS=90` node tests/test-h4-parity.cjs` |
| 90일 주요 세계 상태 동등 | PASS | 13개 상태, 재고·Person·정착지·국가 등. `v34c`의 측정 실행시간 total/maxReviewMs만 제외 |
| 브라우저 UI | PASS | `python tools/browser-h4-smoke.py`: Standalone/Hosted × 1440px/390px, 4/4 |
| 공동 용량 연산 마이크로벤치마크 | PASS | 15타일, 15,000회: H3 2799.95 ms / H4 1222.29 ms; 반환값 일치 |
| Save JSON 가져오기 | 부분 검증 | H4/H3/H2A/H2/H1/H0/G5 합성/검사용 세이브 로드 PASS. 실제 88년 저장 파일은 미제공 |
| 실제 H4 88~150년 장기 주행 | 미검증 | 동일 88년 원본 세이브·PC 비교가 필요 |
| `npm run test:extended` 모든 하위 테스트 | 미검증 | 본 패치 완료를 그 전체 결과로 주장하지 않음 |

## 저장 초과의 해석 한계

합성 테스트는 **활성 창고가 비활성화된 뒤 용량 감소**가 가능한 시나리오를 검증합니다. 이는 기존 자연주행의 `STORAGE_OVERFLOW` 경고를 설명할 수 있는 구조적 경로이지만 **사용자 88년의 5개 정착지에서 실제 발생한 원인을 입증하지 않습니다.** H4 감사의 POSSIBLE/UNEXPLAINED 분류와 건물·재고 이력을 대조해야 합니다. 어떠한 보정이나 재고 삭제도 수행하지 않습니다.

## 향후 동등성·성능 측정 절차

동일 88년 Save JSON 원본을 각각 H3/H4 Standalone에서 불러온 뒤 난수·시점·배속·측정 표본을 맞춰 30~90일 상태 비교 및 10배속 F0 SIM/BATCH 비교. 태블릿과 PC 측정은 직접 비교하지 않습니다. 본 패치의 2.29배는 전 세계 시뮬레이션 개선율이 아닌 D3 저장용량 조회 전용 마이크로벤치마크입니다.
