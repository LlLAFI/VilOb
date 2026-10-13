# V0.34E-rc4h 검증 기록

## 확인된 RC4 실패 (사용자가 제공한 61년차 벤치마크)

| 항목 | B3B / RC3 | RC4 |
|---|---|---|
| 60일 뒤 인구 | 556 | 558 |
| RNG 호출 | 127,530 | 127,686 |
| 종료 지문 | `f960e07c2f54e1ca` | `050b6cad462780e7` |
| 자동 Snapshot 호출 | 4회 | 4회 |

두 실험 모두 RC4에서 동일한 상태 분기가 나타남. RC4의 10.75%/2.08% 개선율은 이 회귀 때문에 유효한 정상 비교로 확정할 수 없음.

## 이번 핫픽스 검증

| 검사 | 결과 | 범위 / 비고 |
|---|---|---|
| 원본 C1H 169블록 SHA256 | PASS | `npm run check:source` |
| 독립 HTML / Hosted 빌드 | PASS | 182 Script, CSS 4, CSV 1,683 |
| JS 정적 구문 및 CSV 호환 | PASS | `test-build.mjs`, `test-csv.mjs` |
| RC3와 런타임 로직 동일성 | PASS | **181개 실행 Script 바이트 동일**, 최종 UI/버전 Script 1개만 상이 (`test-e04h-semantic.cjs`) |
| RC3↔RC4h 직접 결정론 | PASS | **150일**, 10개 중간 검증, 주거·개척·RNG·Snapshot (`test-e04h-parity.cjs`) |
| B3B↔RC4h 60일 합성 회귀 | PASS | 인구·주요 자원·RNG, 저장/로드·CSV·수동/시나리오 Snapshot (`test-e04h.cjs`) |
| PC/모바일 Chromium Standalone | PASS | 시작·버전 표시·프로파일러 존재, JavaScript 오류 0 |
| 로컬 벤치마크 30일 × 1 | PASS | 작은 저장파일, RC3↔RC4h 상태/RNG/Snapshot 일치 (단일 회차 성능 수치는 근거로 사용 안 함) |
| Hosted GitHub Pages 실제 URL | 미검증 | 정적 빌드와 구문 검사만 수행 |
| 통합 장시간 `npm test` | 미완료 | 여러 시험 연속 실행 시간 제한. 개별 핵심 회귀는 위와 같이 확인 |
| 실제 사용자 135MB, 61년차 세이브 | 사용자 검증 대기 | 원본 세이브는 본 환경에 없음 |

## 안전성 판단

RC4h는 Snapshot 관련 119/122번 블록을 RC3와 정확하게 일치시키므로 RC4에서 새로 발생한 두 초기화 생략은 제거됐음. 단, 최종 어댑터의 버전/세이브 키 처리나 세이브 파일 자체의 차이는 합성 및 작은 저장파일 시험으로만 검증되었음. **사용자 실물 세이브 A/B 검증 전에 무조건적인 완전 복구 판정이나 성능 개선율을 선언하지 않음.**
