# V0.35H0 — Late-Game Simulation Performance V1 (H0)

**기준:** V0.35G1B · **날짜:** 2026-10-23 · **범위:** 이주 육로 경로 탐색 중복 제거 + 분리 성능 계측. 최종 150년 성능 목표는 아직 미검증.

## 변경 내용

- `src/bootstrap/v035h0.js`는 G1B의 실행 역할을 승계하며, 기존 `src/bootstrap/v035g1b.js`는 **변경하지 않습니다**. 부트스트랩은 G1A 다음에 H0만 로드해 G1B 로직을 중복 실행하지 않습니다. H0는 `NS.V035H0`, 호환 이름 `NS.V035G1B`를 노출합니다.
- 기존 **4방향, 다중 출발 타일, 통행 허용 소유 국가, 점령·점령 확보 배제** BFS의 최단 타일 수를 그대로 유지합니다.
- 같은 월별 이주 심사에서 **출발 Settlement ID + 타일 목록 + 통행 허용 국가 집합**이 같으면 한 번 구한 도달 거리표를 재사용해 추가 목적지의 BFS 재수행을 생략합니다. 출발지는 다중 출발 큐이며 한 BFS로 모든 대상 타일 최단거리를 얻습니다.
- 캐시 범위는 G1B `month(w)` 30일 주거 심사 1회 또는 `normalMigration(v,w,all)` 1회입니다. 다음 심사에서 캐시는 폐기되므로 영토 변화·점령·병합의 이전 경로를 재사용하지 않습니다. 캐시는 다른 World 사이에서도 공유되지 않습니다.
- 평상시 H0 경로 카운터(`queries`, `searches`, `hits`, `tilesVisited`, `outOfScope`)만 수집하고 `performance.now()`는 **기본 OFF**입니다. 원하는 경우 세계 탭 `35H0 경로 시간 계측: ON/OFF` 버튼으로 토글해 `profiledSearchMs`를 수집할 수 있습니다. 정밀 계측 ON은 벤치마크에 영향을 줍니다.
- 경로 계측은 `NS.V035H0.routeReport(w)`, 세계 → 고급 도구 `35H0 경로·성능 진단 JSON`, Devlog `worldSummary.v35h0Routing` 및 세계 세이브 `v35h0Routing`에 기록합니다. 기존 G1B 주거·이주 리포트는 기능과 포맷 `vilob-v035g1b-housing-migration-v1`을 유지합니다.
- H0 저장 버전 `V0.35H0`, 전용 로컬 키 `village-observer-v035h0`; 이전 `village-observer-v035g1b`, `village-observer-v035g1a` 로드 폴백 및 G1B/G1A 파일 import를 지원합니다. 원본 G1B 로컬 저장 데이터는 삭제하지 않습니다.

## 반드시 보존할 규칙

G1B 국내 긴급·자발적 이주 조건, 이주 선택 우선순위, 825일 해외 주거 이주, 두 번 신청 후 거절·귀환, 행복도 -3, 360일 재시도 제한, 기존 식량난 국제 이주 확률과 입국 조건, Person/장비/Gold 보존식 유지. G1A **기본 건설력 0.80/일, 건축가 ×3**, 43개 기술, 방어·무역·국가 AI·물류 공식도 변경하지 않습니다. 0.34C1H **보호 레거시 169블록**, Snapshot **1,683열**을 유지합니다.

## 검증 결과 및 한계

- G1B/H0 시드 고정 **180일 결정론 상태·RNG 일치 PASS**. 처음 90일 매 30일 값 확인, 180일까지 반복 확인. 기본 지도 생성 Date.now 고정 하에서 두 VM에 동일 난수를 공급합니다.
- 19×19 다국적 소유 그래프의 **200개 경로 비교**: 기존 BFS 결과와 H0 결과 일치, 200회 질의 중 캐시 구축 2회·재사용 198회.
- G1B 2단계 해외 입국·행복도·거절·귀환 회귀 및 H0/G1B/G1A 저장 이관 PASS. H0 **360일 자연주행** D2/D2A 감사 PASS.
- 인위적인 19×19 지도, 12개 출발점 × 70개 목적지, 7회 반복: 기존 BFS 중앙값 **21.499ms**, H0 캐시 경로 중앙값 **4.482ms**, 경로 함수 구간 **4.80×**. 실제 세계 62년 SIM/BATCH 개선율이 아닙니다.
- Chromium PC(1440×900)·모바일(390×844) 초기 UI, G1A 계수, 최신 버전 배지, 세계 탭 신규 진단 버튼, JS 오류 0 검증 PASS. 실제 브라우저 사용자가 파일 다운로드·저장 버튼을 동작시키는 검증은 별도.
- 전체 `npm test` 단일 실행은 현 실행환경에서 미완료. 여러 핵심 테스트는 개별 PASS이고 일부 테스트의 **최신 릴리스 상수**는 H0로 조정했으나, 최종 전체 회귀 통과를 주장하지 않습니다.
- 실제 **62년 G1B 세이브 파일**이 없어 동일 698명 세계 A/B는 아직 수행하지 못했고, PC ×10 1~150년 SIM/BATCH <1000ms 목표도 미검증입니다.

## 빌드 및 테스트

```bash
npm run build
npm run check:source
npm run test:35h0
H0_PARITY_DAYS=180 node tests/test-35h0.cjs
V35G1B_DAYS=360 node tests/test-35g1b.cjs
node tools/bench-35h0.cjs
python tests/browser-35h0-smoke.py
```

`index-standalone.html`은 오프라인 브라우저용, `index.html`은 GitHub Pages 루트용 (`dist/hosted/assets/`와 함께 업로드), `dist/hosted/index.html`은 별도 정적 서버용입니다. H1은 H0의 계측값과 실제 55~62년 프로파일 자료를 기반으로 유지보수·AI/Person 병목 중 실제 상위 비용을 우선합니다.
