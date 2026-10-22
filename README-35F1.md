# Village Observer V0.35F1 — Housing Retry Simplification

기준선: V0.35F. 배포일: 2026-10-22. GitHub Pages 및 독립 실행 HTML 지원.

## 핵심 변경

35F 계측에서 181일 / 분기 3개 / 국가별 개발 판단 15회 동안 `housingAttempt` 464회(성공 1회, 실패 463회), 총 6,839.6ms가 관측됐다. 그중 반복된 국가 전체 주거 해결 호출을 줄이기 위해 **`demandDevelopment(v,w)` 한 번당 `v.buildHouse(w)`를 최대 1회 호출**하도록 변경했다.

- 여러 정착지가 동일 국가의 주거 부족 점수(82 이상)를 보고하더라도 가장 먼저 조건을 충족한 후보에서 **한 번만** 국가 전체 주거 해결 작업을 호출한다.
- 결과가 성공이면 기존대로 `SETTLEMENT_DEMAND_ACTION` 이벤트를 남기고 개발 판단을 종료한다.
- 결과가 실패해도 같은 후보와 이후 후보에 대한 창고 및 교역소 건설 검사는 기존 순서를 유지해 계속 실행한다.
- 국가별 다른 개발 판단 실행이나 AI의 별도 주택 건설 경로는 차단하지 않는다. 그러므로 이는 **국가·분기 전체 주택 건설 상한**이 아니라 `demandDevelopment()` **한 번당** 상한이다.
- 주택 신축·개축·이주·토지정비의 기존 함수, 실제 자원 투입, Gold, 공사 슬롯, 비용 및 프로젝트 검사는 수정하지 않는다.
- 주택 AI의 행동과 RNG 소비·세계 경로는 35F와 달라질 수 있다(사용자 승인된 단순화). 기존의 '35F↔F1 전체 상태 완전 일치'는 이번 릴리스의 검증 조건이 아니다.

## 구현

`tools/35f1-transform.mjs`가 보호 소스를 변경하지 않고 빌드된 `src/legacy/025.js`의 **실행 프로파일러 OFF 함수**(`demandDevelopment35FOriginal`)와 **ON 함수**(`demandDevelopment35FProfiled`)에 같은 상한을 넣는다. 진단 중에는 `housingEligible`(주택 점수 조건을 만족한 타일), `housingAttemptStarted35F1`(실제 주택 시도), `housingSkippedRepeat35F1`(동일 개발 판단에서 두 번째 이후 건설 시도 생략), `housingFailed`, `housingStarted` 등이 구분된다.

새 부트스트랩 `src/bootstrap/v035f1.js`가 `NS.RELEASE_VERSION`/초기 좌상단 배지/세이브/개발로그/패치노트를 35F1로 업데이트하며, 기존 35F 계측 패널을 35F1 텍스트와 내보내기로 연결한다. 이전 35F 세이브 읽기는 지원하고 35F1 브라우저 로컬 저장소 키는 별도이므로 기존 35F 저장을 덮어쓰지 않는다.

## 빌드·실행

- GitHub Desktop 배포용 웹 진입점: 저장소 최상위 `index.html`. `.github/workflows/pages.yml` 유지.
- 서버 없이 실행: `index-standalone.html` 또는 `dist/standalone/index.html`.
- 정식 호스팅 진입점: `dist/hosted/index.html`.
- Node.js 18 이상에서 `npm run build`, `npm test`, `npm run test:35f1`, `npm run test:35f1:long`.

## 실사용 검증 요청

이전과 같은 **90년 세이브**를 불러온 후 `세계 → 고급 도구 → 35F1 개발·건설 병목 상세 계측`을 시작해 **180~360일** 진행한다. 계측을 종료하고 `35F1 JSON 저장`을 누르면 `vilob-v035F1-development-<연도>y.json`가 내려받아진다. 중점 확인은 `housingEligible`, `housingAttemptStarted35F1`, `housingSkippedRepeat35F1` 및 `housingAttempt`의 누적시간이다. 성능 자체는 계측 OFF 상태에서 35F↔35F1 같은 세이브·구간·장치로 비교해야 한다.

**주의:** 90년 사용자 세이브의 무계측 A/B와 150년 10배속 SIM/BATCH ≤1,000ms 목표는 이 배포에서 검증되지 않았다. 짧은 새 세계 벤치 결과를 90년 장기 세계에 확대 해석하지 않는다.
