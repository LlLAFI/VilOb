# Village Observer V0.35G1 — Construction Abstraction + Architect Dispatch V1

기준선: V0.35G (2026-10-22). 현행 기술 43개, 기본 19×19 / 7개국, Snapshot CSV V2 1,683열. 기존 V0.35G 소스와 보호 레거시 169블록을 변경하지 않고 `tools/35g1-transform.mjs` + `src/bootstrap/v035g1.js`를 추가하여 빌드 시 적용합니다.

## 규칙 변경

- 일반 신축, 주거 개축, 시설 고도화: 기존 필요한 공사 노동량(`totalLabor25`)을 유지하며 실제 Person 건설 노동이 없어도 **0.25 공사 진척량/달력일** 상당을 적용합니다. 3일 작업주기마다 기본 0.75입니다.
- 지역 보정: 같은 Settlement의 실제 성인(16세 이상, 개척자·현역 군인 제외) 1명당 +5%, 최대 +25%. 이 보정은 관측되지 않는 지역 건설 역량을 뜻하며 별도의 Person 근무나 실제 노동일로 간주하지 않습니다. 성인 수는 30일 단위로 집계합니다.
- 토지정비: 기존 V0.17 `duration`/`progress` 단위를 유지하며 기존 호출 주기당 기본 +0.55 진척(동일 지역 보정). 토지정비 완공 효과 및 자원 회계 유지.
- 건축가 파견: 실제 `job==='건축가'` Person을 약 30일마다 중요 공사에 배정. 같은 Settlement 내부는 즉시 배정, 다른 Settlement는 실제 경로비용에 상응하는 이동 시간을 먼저 소비합니다. 도착 후 현장에 머무는 동안 해당 공사는 **×2.5** 가속합니다. 한 건축가/공사 하나에만 배정하고, 업무 종료 후 귀환합니다.
- 유지보수 중인 건축가, 개척자, 군인은 신규 파견 제외. 파견된 건축가를 유지보수 인력 계획에서 제외합니다. 파견 중에는 건축가가 본업 생산과 중복 근무하지 않습니다. 일반 주민은 더 이상 건설을 위해 본업을 중단하지 않습니다.
- 기존 일반 노동자 선발·정렬·작업 배정을 매 3일 재실행하는 G 경로를 대체합니다. 건축가 후보는 30일 단위로 결정하며 공사별 건축가 조회는 작업주기별 캐시 인덱스를 사용합니다.

## 변경하지 않은 규칙

물리 자원/Gold 착공 비용, 건설 슬롯 및 건물별 총 필요 노동량, `PUBLIC_WORKS`/`ARCHITECTURE` 기술 효과, 적군 점령·확보 중 공사 중단, 기존 실제 Person 유지보수 노동, 군사·전쟁·AIProfile·금전 보존은 종전대로 유지합니다. 무인력 건설의 기본 진척을 V0.25의 *실제 Person 노동일* 통계에 더하지 않고 G1 진단 카운터에 기록합니다.

## 저장·계측

- `V0.35G` 세이브 가져오기를 지원하며 G1의 별도 로컬 저장 키는 `village-observer-v035g1`입니다. G1에서 저장한 세이브는 버전 `V0.35G1`을 사용합니다.
- 기존 `35G 공사별 CSV`, `35G 공사 정체 JSON`은 G 호환 진단으로 남고, 세계 > 고급 도구에서 `35G1 추상 건설·건축가 JSON`도 내려받을 수 있습니다.
- G1 JSON에는 `baselineCycles`, `baselineEffective`, `architectEffectiveExtra`, `architectWorkCycles`, `architectTravelDays`, `architectDispatches`, `architectReturns`, `blockedControlCycles`, 현재 파견 건축가 상태 등이 포함됩니다.
- `V0.35G1` Devlog JSON의 `worldSummary.v35g1Construction`에도 G1 보고를 포함합니다.

## 실행

- 오프라인 단일 파일: `index-standalone.html` 혹은 `dist/standalone/index.html`.
- GitHub Pages: 프로젝트 루트의 `index.html`과 `dist/hosted/assets/`를 함께 업로드하거나, `dist/hosted/` 전체를 사이트 루트로 배포합니다.
- 소스에서 재빌드: `npm run build`, 검증: `npm test`, 단독 G1 회귀: `npm run test:35g1`.

## 알려진 검증 범위

90일·360일 자동 자연주행, G→G1 세이브 이관, G1 세이브 왕복 및 D1/D2 Settlement 감사 통과. 브라우저 자동 PC·모바일 시연은 실행 환경의 네트워크/파일 탐색 정책에 의해 차단되어 별도 확인이 필요합니다. **38년 실제 G 자연주행과 동일 세계의 G1 전후 비교는 38년 세이브가 없으므로 수행하지 않았습니다.** 장기 건설 완료율 및 최적화 측정치는 실제 새 자연주행 후 판단해야 합니다.
