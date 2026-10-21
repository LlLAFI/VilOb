# V0.35E 검증 보고 (2026-10-21)

| 항목 | 상태 | 근거 / 한계 |
|---|---|---|
| `npm run build` | PASS | V0.35E Hosted / standalone 정상 생성 |
| 보호 C1H 기초 소스 | PASS | SHA-256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`, 169개 원본 불변 |
| CSV / 기술 | PASS | 1,683열 / 43개 기술 유지 |
| 35D ↔ 35E 상태 및 RNG | PASS | 91일 일반 세계: 13개 직렬화 주요 영역 + RNG 일치. 30일 일반/거래 이력 강화 세계: 각각 계측 ON/OFF와 35D 기준 일치. 구형 v34c 내부 순수 시간 카운터만 정규화 |
| 35E 선택 계측 | PASS | 8개 측정 경로, 신규 failed housing side-effect hints, 시작·종료, 원형 복원, 계측 OFF 보장; 게임 저장에는 진단 데이터 미삽입 |
| 35D 이전 계측 회귀 | PASS | 35A/35B/35C/35D 개별 테스트 성공 |
| 기본 회귀 검사 | PASS (개별) | 보호소스, 저장, H4C 실물 석재·영토, G3B/G4A1/H2A, CSS·경계·국가색 등의 개별 15개 검사 종료코드 0 확인 |
| 통합 `npm test` | 미완료 | 검사 단품 15개는 통과했으나 묶음 실행이 이 환경에서 간헐적으로 제한시간에 걸림. 전체 명령을 PASS로 주장하지 않음 |
| Chromium 브라우저 | PASS 4/4 | Standalone 및 Hosted, 1440×900 / 390×844, 첫 화면 35E 배지 및 title 확인, 세계/패널/군사/경계/기술 유지 |
| 합성 4일×3 계측 OFF A/B | 혼재·개선 미확정 | 반복 1: 35D **40.8637** → 35E **35.0468** ms/일 (14.23% 단축); 반복 2: 35D **35.0094** → 35E **38.3600** ms/일 (9.57% 느림). 시작/종료 세계·RNG 동일. **전체 SIM 성능 개선 입증 실패**, 초기 합성 세계의 JIT/측정 변동 가능성 |
| 90년 실세이브 / 150년 ×10 F0 | 미검증 | 실제 원본 세이브는 제공되지 않음; 프로파일 JSON은 월드 상태를 포함하지 않음 |

## 검증 방법

```bash
npm run build
npm run check:source
node tests/test-35e.cjs
V35E_PARITY_DAYS=30 node tests/test-35e-parity.cjs
V35E_PARITY_DAYS=91 node tests/test-35e-parity.cjs
python tools/browser-35e-smoke.py
npm test
npm run bench:35e -- --days 4 --warmup 0 --runs 3 --output benchmark-35e.json
```

## 계측 해석 주의

E35 `metrics`의 포괄시간은 부모·자식이 중첩됩니다. `buildHouseTop`과 `buildHouseV17`의 숫자를 더하면 안 됩니다. `houseEffects`는 이벤트 개수 및 일부 주거 상태/프로젝트 카운터 변화 여부만 수집하므로 **기록된 변화 없음이 부수효과 없음의 증명은 아닙니다**. 실패 호출 자체는 35E에서 단 한 번도 생략하지 않았습니다.
