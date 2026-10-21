# Village Observer V0.35F — Development & Construction Hotpath (2026-10-21)

## 목적과 근거

기준선 V0.35E. 실제 401일/5분기 계측에서 `demandDevelopment()` 25회 10,378.9ms, `buildHouseTop()` / `buildHouseV17()` / `tryHousingResolveD3()`의 **계측된 호출 0회**. 주택 재시도 가설은 이 세이브에서 지지되지 않으며, 창고·교역소 착공, 프로젝트 검사, 예약 정책의 비용은 기존 계측으로 구분되지 않습니다.

**35F는 진단 우선 패치**입니다. 90년대 원본 게임 세이브가 제공되지 않은 환경에서 성능 병목의 근거가 부족하므로, 위험한 건설 호출 생략·전역 캐시·정책 순서 변경은 수행하지 않았습니다. 35F 데이터를 받은 뒤 실제 상위 비용 구간에 국한해 후속 최적화를 진행합니다.

## 구현 내용

- 기존 35E의 `demandDevelopment` 구현을 **계측 OFF 경로에서는 문자 그대로 유지**. 빌드 전용 `tools/35f-transform.mjs`에서 원본 함수를 이름 변경하고, 계측 ON일 때만 결과 동등성을 검증한 측정용 분기 구현을 사용합니다.
- `development` 전체 및 `tradeIndex` 거래 집계, `rowsBuild` 영토별 압력, `rowsSort` 개발 후보 정렬, `projectBusy` 공사 중 검사, `housingAttempt` 주거 시도, `storageRequirements` 창고 조건·`storageConstruction` 창고 착공, `commerceRequirements` 교역소 조건·`commerceConstruction` 교역소 착공, `industryReserve31H` 산업 예약, `militaryReserve32C1` 군사 예약: **총 12개 구간**의 호출 수·누적/평균/P95/최대시간·예외 기록.
- 개발 후보 방문·공사 중 제외·주거/창고/교역소 점수 기준 도달·착공 시도·성공·실패 횟수 기록. 조건이 성립하지 않으면 해당 건설을 시도하지 않은 사실도 드러납니다.
- 원본 `src/legacy/025.js`, `051.js`, `059.js` 및 기타 보호 원본 블록은 수정하지 않습니다. 전체 **169개 보호 블록 SHA 고정**. 변환은 Hosted/Standalone 빌드 결과에서만 적용됩니다.
- 35E 주거, 35D 사회·경제, 35C 분기·행정 및 35A/35B 진단 기능 유지. 기존 주거·경제·행정·군사·AI 행동과 RNG 순서를 바꾸지 않습니다.
- 최초 화면 좌상단 `V0.35F` 표시와 브라우저 페이지 제목 동기화. 세이브 내보내기/불러오기 버전 `V0.35F` 및 35E 이전 세이브 로드 경로 유지.

## 배포 파일

- `index.html`: GitHub Pages용 Hosted 루트 진입점 (`dist/hosted/assets/`를 참조).
- `dist/hosted/`: 로컬 또는 GitHub Pages 서브 경로용 상대 경로 Hosted 배포.
- `index-standalone.html` 또는 `dist/standalone/index.html`: 오프라인 단독 실행.
- `tests/baselines/index-35E.html`: V0.35E 회귀 기준선.
- `README-35F.md`, `TEST-35F.md`: 패치 설명/검증.

## 실제 90년 세이브 검증 방법

1. V0.35F 열기 → 기존 90년 세이브 불러오기.
2. **세계 → 고급 도구 → 35F · 개발·건설 병목 상세 계측**에서 `35F 계측 시작`.
3. 가능하면 180~360일 (분기 3~5회 이상) 자연주행. 35A~35E 계측을 동시에 켜지 않습니다.
4. `35F 계측 종료` → `35F JSON 저장`; `vilob-v035F-development-<연도>y.json` 전달.
5. 분석 시 `development`의 시간과 그 하위 metric은 중첩되므로 **서로 합산하지 않습니다**. 건설 호출 실패 원인은 새 데이터의 시도 성공·실패 수와 기존 건설 게이트/텔레메트리와 함께 분석해야 하며, 실패 건너뛰기 또는 캐시 확장의 근거가 아직 아닙니다.
6. 전체 성능은 반드시 **계측 OFF**, 동일 세계/동일 RNG에서 A/B 비교. 예: `node tools/bench-35f.cjs --save "<original-save.json>" --days 30 --warmup 3 --runs 3 --output ab.json`. Node VM 일일 시간은 브라우저 10배속 SIM/BATCH 수치와 다릅니다.

## 검증과 한계

- 상세: `TEST-35F.md`.
- `npm test`: 빠른 정적/회귀 14개 PASS (장시간 35C/35D 검사는 별도 분리).
- 35E↔35F **91일 일반 세계**, **30일 일반·거래강화 세계**, 계측 ON/OFF에서 주요 상태 13영역과 RNG 일치 PASS. 최신 계측 카운터 변경 이후 **91일 거래강화 조건 전체 완료 여부는 재검증 미완료**.
- 브라우저 Hosted/Standalone × PC/모바일 4/4 PASS, 43개 기술, CSV 1,683열, 169 보호 블록 유지.
- 합성 초기 세계에서 4일 × 3 반복 비교(계측 OFF)는 35E 43.80ms/일, 35F 38.79ms/일의 한 세트 결과였으나 장기 재현성 및 실제 90년 성능 검증이 없어 **성능 향상 주장에 사용하지 않습니다**.
- 150년 10배속 SIM/BATCH ≤1,000ms 목표는 **미검증**.
