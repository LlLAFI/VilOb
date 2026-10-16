# V0.34F3 검증 보고 — 2026-10-16

## PASS — 빌드·구조
- `node tools/build.mjs` 독립 실행 HTML(3.5MB) 및 Hosted asset 빌드 성공.
- `node tools/build.mjs --check-only`: C1H 기준선 불변 원본 169개 블록, JS 165개, CSS 4개, SHA256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` 유지.
- 생성된 Standalone/Hosted 스크립트 블록 188개, Snapshot CSV V2 1,683개 고유 열 유지.
- F3 health/happiness 패치는 F0 `survive`의 지정된 수식 및 V24 질병 배율 호출부를 빌드 후 재작성함. 보호된 원본 `src/legacy/*.js`는 변경 없음.

## PASS — F2 30일 회귀
- `F2_DAYS=30 node tests/test-f2.cjs`: PASS.
- 30일 통제주행 `completedCycles=77`, `aliveProcessed=1,276`, `fallbackMetabolism=0`, 전상자 신진대사 1회 이상 확인, `duplicateMetabolismRequests=0`, 기아 검사 3,944회.
- 기아 12달력일 유예, Hunger 95 미만 회복 시 초기화, 전상자·광부 공통 판정, F1A1 52열 관측 및 물리 식량 감사 PASS.
- 테스트 중 보고되는 기아 사망은 **의도적으로 Hunger=100으로 설정한 검증 fixture**를 포함함.

## PASS — F3 수식·호환성
- 새 Health 손실은 짧은 배급 미충족과 오래 누적된 Hunger 손실 중 최댓값 사용. Hunger 80 경계 불연속 없음.
- 행복도 갱신식 한 개, 축제·주거·부분 배급 목표값 반영, 목표값 범위 검증 PASS.
- Health=0에서도 즉시 죽지 않고 Health가 회복될 수 있음. 질병 위험 배율은 1.36이며 건강도 1의 배율보다 높음.
- F3 저장·불러오기 및 F2 형식 세이브의 F3 변환 PASS.
- `F3_DAYS=3 node tests/test-f3.cjs`: 동일 시드·환경 2회 실행의 인구/식량/Health/Happiness 요약 및 RNG 호출수 해시 동일함. F2 중복 신진대사 0건 유지.
- F3 3일 테스트 결정론 해시: `a060e3793a3acf4f690390839b4fb4e6d48b3d5c489c04737c1c168728fbd80e`.

## PASS — 브라우저
- Chromium 데스크톱 1440×900: `V0.34F3`, F2/F3 활성, 세계 생성, JS 오류 0건.
- Chromium 모바일 뷰포트 390×844: 동일 PASS.

## 미검증 및 주의
- 실제 사용자의 61년 F2 런에서 제기된 카이렌 붕괴를 F3의 동일 세이브로 재현하는 실험은 수행하지 않았다.
- F3의 장기 분포·출산·기아/질병 사망 영향은 15~60년 자연주행 이후 비교 권장. 3일 결정론·30일 F2 회귀는 장기 균형 검증이 아니다.
- F3 수식 변경이므로 F2와 RNG/상태 동일성을 요구하지 않는다.
- 별도의 PC 150년 10배속 SIM/BATCH 1,000ms 목표 검증은 미진행. 이전 태블릿 결과를 PC 회귀로 사용하지 않음.
