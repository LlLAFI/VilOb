# V0.34E-rc5 검증 기록

기준 파일: V0.34E-rc4h, V0.34D3B3B.

| 항목 | 결과 | 범위 |
|---|---|---|
| `node tools/build.mjs` | PASS | 169개 보호 원본·Hosted/Standalone·CSV 스키마 1683열 |
| `node tests/test-e05-parity.cjs` | PASS | RC4h↔RC5 150일, 10회 중간 상태·난수·개척, 수동 Snapshot 4회 |
| `node tests/test-e05.cjs` | PASS | B3B↔RC5 60일, 인구·자원·RNG, 저장 불러오기, 수동 Snapshot/이벤트 기록 |
| `node tests/test-e05-stage.cjs` | PASS | profiler 6일: Demography 6회, 레거시 Macro 2회 |
| `node tests/test-build.mjs` | PASS | 182 JS 블록, Hosted/Standalone, 원본 SHA |
| `node tests/test-csv.mjs` | PASS | 1683열, 72개 중복 열명 해결 |
| Chromium PC/모바일 독립판 smoke | PASS | 페이지 열림, 버전 표기, JS 오류 0 |
| Chromium 로컬 예열 A/B, 같은 RC5 양쪽 | PASS | 소형 세이브, 6일 예열/30일 측정, 세계/RNG/Snapshot 일치; 0.61% 오차 |
| 후기 합성 24일×3회 RC4h↔RC5 | PASS (정확성) | 전체 SIM -0.18%: **성능 개선 미확정** |
| 실제 135MB 61년차 60일×3회 | NOT RUN | 사용자 로컬 시험 대기 |
| 60~100년 장기 자연주행 | NOT RUN | 계산 시간 제약 |
| 전체 `npm test` 전수 검사 | NOT RUN | 일부 개별 중요 테스트만 수행 |

## 주의

`test-e05-parity.cjs`와 `test-e05.cjs`는 주요 상태 및 RNG 일치를 검증하지만, 완전한 장기 전쟁·식량·경제 회귀를 보장하지 않는다. 정식 0.34E 20~30% 성능 개선 달성으로 표기하지 않는다.
