# V0.35B 검증 기록 · 2026-10-20

## 통과한 검사

| 검증 | 관측된 결과 |
|---|---|
| `npm run build` | 성공. Hosted 및 Standalone 생성. |
| `node tools/build.mjs --check-only` | 보호 레거시 169개 원본 해시 유지, CSV 1,683열 PASS. |
| `tests/test-35b.cjs` | 동일 호출 H35A 모델 평가 2회 vs H35B 1회, 물류 결과·행정 상태 동일, 계측 함수 정체성 복구 PASS. |
| `V35B_PARITY_DAYS=30 tests/test-35b-parity.cjs` | 30일·13개 주요 저장 상태·RNG·35A profiler ON/OFF 동등성 PASS. |
| `H4B_DAYS=1 tests/test-h4b-parity.cjs` | H4A↔35B 1일 저장 상태 동등성 13/13 PASS. |
| `tests/test-h4c.cjs` | 실제 석재 이동, 저장 상한/반송 보존, 국가-중립지 경계 PASS. |
| `tests/test-g2a-reserve.cjs`, `test-g3b.cjs`, `test-g4a1.cjs`, `test-h2a.cjs`, `test-h4b.cjs`, `test-h4b-storage.cjs`, `test-h4b-border.cjs`, `test-35a.cjs`, `test-build.mjs`, `test-csv.mjs` | 각각 개별 PASS. |
| Chromium Standalone × PC/모바일 | 2/2 PASS. |
| Chromium Hosted × PC/모바일 | 2/2 PASS (Hosted 모바일은 독립 재시도). |

**통합 `npm test`**: 여러 번 실행했으나 현재 작업 환경의 장시간 실행 제한(200~300초)에 도달해 프로세스가 종료되었습니다. 따라서 **통합 명령 종료 코드 0을 확보하지 못했고 PASS라고 주장하지 않습니다.** 위 개별 테스트는 각각 정상 종료되었습니다. CI에서는 전체 묶음 소요시간을 확인해 주세요.

## 성능 실험 (각기 다른 범위, 혼용 금지)

1. Node VM 동일 상태 합성 확장 행정권의 물류 함수 96회 반복×3: 중앙값 H35A 29.230ms, H35B 22.881ms, 상대 단축 21.72%. 출력 체크섬 일치.
2. Node VM 신규 합성 세계의 3일×3회 전체 SIM: H35A 102.8896ms/일, H35B 120.8227ms/일, 전체 변화 **-17.43%**(느림). 시작/종료 상태와 RNG 일치. 표본·환경 변동에 민감하여 후기 세계에 대한 추정 금지.
3. 실사용 90년 Save A/B: 미실행(원본 Save 미제공). 공식 F0 150년·10배속 평균 1,000ms 미만: **미달성·미검증**.

## 의도적으로 변경하지 않은 부분

Person 연산, 자원 창출·삭제/보존식, 식량·석재 물류 한도, 전쟁·AI 결정, 행정 효율과 이벤트 기준, 43개 기술 및 1,683열 CSV, H4B/C 지도 경계, GitHub Pages + Standalone 호환성. 관리형 보호 레거시 블록 변경 없음.
