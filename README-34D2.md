# Village Observer V0.34D2 — Settlement Living Space & Construction Capacity V2

**패치일:** 2026-10-11 · **기준:** V0.34D1A · **상태:** 구현/기본 회귀시험 PASS, 대규모 자연주행 검증 대기.

## 설계 결정과 기능

### A. 하루 생활권으로서의 다중 타일 Settlement

- 하나의 `Settlement`가 차지하는 타일은 **민간 주거·일자리 접근 면에서 하나의 생활권**입니다. 게임의 1일 단위 내에서 Settlement 내부의 별도 통근 거리 불이익을 받지 않습니다.
- 주민은 `homeTileId`를 계속 가집니다. 이는 원본 Person 참조와 타일/세이브 호환성을 위한 **물리적 참조 필드**입니다. 다만 주택 이용 가능 여부는 원래 집 타일의 주거 인원과 집 개수 대신 **해당 Settlement 전체의 인구 / 실제 주거 수용량**으로 판단합니다.
- 공동 수용량이 충분하다면 일부 타일이 혼자 과밀하게 보이더라도 **강제 타일 간 이주나 중복 주택 건설을 진행하지 않습니다**. 실제 부족이 있거나 95% 이상의 예비 주택 수요가 있다면, 그 Settlement에 속한 실제 타일에 주택 업그레이드·신축·토지 개발을 시도합니다. 동일 Settlement에 주택 프로젝트가 진행 중일 때 같은 수요의 추가 착공은 막습니다.
- D3/E1 주거 수요·차단 진단과 정책 호출은 새로운 Settlement별 수용량을 읽습니다. V28 이주 관측값의 주거 부족도 동일 기준에 연동합니다. V29 노동 경로 계산에서 같은 Settlement 안의 두 타일 간 이동 비용은 0으로 취급하고, 실제 시설 일자리 슬롯과 근무 타일 정보는 보존합니다. 출산 때 사용되는 주거 압력도 공동 기준을 반영합니다.
- **건축 공간, 건물·광맥·시설의 실제 타일 위치, 시설 슬롯, 군사 이동·전투·점령, 도로 및 지형은 기존의 물리 좌표로 계속 운영**합니다.
- 같은 Settlement에 존재하는 물리 재고의 실질적 풀링, 시장 통합, 생산 투입·소비 물류의 단순화는 **V0.34D3에서 구현**할 예정입니다. D2는 D3의 경제 규칙을 미리 변경하지 않습니다. 또한 오래된 코드에 남은 타일 단위 화면/기록은 전체가 사라지는 것이 아닙니다.

### B. 동시 건설 슬롯 확대

공식: `min(11, 3 + (인구≥25) + (인구≥60) + 2·ADMINISTRATION + 2·ENGINEERING + 2·URBANIZATION)`.

| 단계 | 누적 슬롯 |
|---|---:|
| 기본 | 3 |
| 인구 ≥ 25 | 4 |
| 인구 ≥ 60 | 5 |
| + ADMINISTRATION | 7 |
| + ENGINEERING | 9 |
| + URBANIZATION | **11** |

- `constructionProjects`(실제 공사만) + `landDevelopmentProjects` + `buildingUpgradeProjects` + `specializationProjects`를 공통 동시 활성 공사 수로 계산합니다. 과거 호환 표식인 `v17Marker`는 제외합니다.
- 실제 착공 관문에서는 신축·토지 개발·주택 개축에 공동 한도를 적용합니다. 직접 농장 개축 및 상업 전문화의 입구에도 슬롯 제한을 적용했습니다.
- 구버전 `maxProjects31G`와 분산되어 있던 `projectCap`, `projectLimit` 등 레거시 판단·진단 함수를 빌드 단계의 명시적 연결 지점에서 같은 D2 용량 정책으로 전환했습니다.
- 자원·Gold 원장, 공사 노동일, 지형·광맥·건축 공간의 실제 물리 비용은 그대로입니다. 건설 슬롯이 늘어났다고 생산력이 자동 생성되지는 않습니다.

### C. 관측·CSV·저장

- 타일 검사창, 국가 요약·정착지·경제 화면에 **Settlement 공동 주거 인구/용량/부족량**과 **국가 동시 공사 수/한도**를 표시합니다.
- `Settlement Housing CSV` 버튼: `settlementId,nationId,nationName,tileIds,population,housingCapacityShared,housingDeficitShared,housingVacancyShared,overcrowdingLegacyTileTotal,activeProjectCountNation,projectCapNation`의 **11열**.
- 기존 D1A `Settlement CSV` **48열**과 Snapshot CSV V2 **1,683열**은 별도로 유지합니다. D1A CSV의 과밀 타일 수·타일별 부족량은 과거 비교용 **타일 관측값**이며, D2에서 실제 주거 판단에 쓰는 부족량은 새로운 Housing CSV를 확인하세요.
- Devlog `worldSummary.v034d2Audit`와 `v034d2Counters`는 새 공동 주거/프로젝트 검사를 기록합니다.
- 세이브 키는 `village-observer-v034d2`, 버전은 `V0.34D2`. 구버전 세이브 호환은 의도적으로 지원하지 않습니다.

## 소스·빌드

레거시 V0.34C1H 169개 JS/CSS 원본 블록은 기존 보호 해시를 유지합니다. `tools/d2-transform.mjs`에서 해당 경로의 **정확히 한 번 나오는 문자열**에만 정책 후킹을 하고, `src/bootstrap/v034d2.js`가 새 API를 소유합니다. Standalone은 패치된 블록을 포함하여 출력하고, Hosted 빌드는 같은 변환을 거친 JS를 assets에 기록합니다. 변환 기준이 달라지면 빌드가 실패하게 설계했습니다.

```bash
npm run build
npm test
python tests/browser-smoke.py   # Chromium/Playwright 환경일 경우
```

GitHub Pages 배포는 전체 ZIP의 내용물을 저장소에 올린 뒤 **Settings → Pages → GitHub Actions**로 설정하여 `.github/workflows/pages.yml`을 실행하세요. ZIP의 `dist/standalone/index.html`은 독립 단일 파일 실행용입니다.

## 이번 버전에서 검증하지 않은 것

- 외부 GitHub Pages 서버의 HTTP 로딩·배포 성공은 작업 환경 제약으로 원격 실측하지 않았습니다.
- **60~75년 자연주행과 극단적 전쟁/대규모 영토 변화**는 아직 검증 대상입니다.
- 건설 한도가 크게 늘어난 만큼 장기 중복 착공, 실제 노동 가용성, 후기 SIM/Wall, 카이렌·델마처럼 작은 국가의 초기 투자 속도는 자연주행 데이터로 재검토해야 합니다.
