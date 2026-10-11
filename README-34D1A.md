# Village Observer V0.34D1A — Labor Metrics Clarification

**기준선:** V0.34D1 · **개발일:** 2026-10-11 · **범위:** 노동 **관측·집계** 및 세이브 식별자. 경제·고용·Person 행동은 수정하지 않았습니다.

## 배경

V0.34D1의 75년 자연주행에서 세계 인구 1,007명 모두가 `assignedJobs=1007`, `workersAtTile=1007`로 나타났습니다. 이는 실제 근로자 1,007명을 뜻하지 않습니다. `job='아이'`인 어린이도 직업 문자열을 가지고, `workTileId`는 일하지 않는 Person에게도 집 타일을 가리킬 수 있기 때문입니다.

기존 Settlement CSV의 32열과 `assignedJobs`/`workersAtTile` 값은 비교 용도로 남깁니다. 해당 값은 직업 문자열·근무 위치 **필드 현황**이지 고용률, 생산 실적, 통근 실적을 뜻하지 않습니다.

## 구현 내용

- `src/bootstrap/v034d1a.js`: `NS.V034D1A.prepare / aggregate / all / audit / csv / eligible / slotInfo`를 노출하는 읽기 전용 관측 계층.
- 15세 이상 민간 노동 후보(`civilianEligible15`)는 개척 임무(`assignment='PIONEER'`)와 현역 병사(`militaryStatus32A='active'` 또는 `militaryActive32B`)를 제외합니다. 어린이는 자동 제외합니다.
- 직업 문자열, 무직, `_v29SlotKey` 기록, 물리 시설 슬롯, 비시설/야외 임시 슬롯 및 근무 타일 배정을 **서로 별도 항목**으로 측정합니다.
- 물리 슬롯의 경우 슬롯 키와 Person의 건물 인덱스·타입, 현재 타일의 실재 건물·직업 일치·건물 상태를 순수 조회합니다. 임시 슬롯은 V0.29의 `-1` 농업, `-2` 수작업 채굴, `-3` 중심지 거래소 유형으로 분류합니다. 슬롯 **수용량과 노동 실제 수행량을 새로 계산한 것은 아닙니다**.
- 슬롯 키가 현 구조와 다르면 `slotStructuralWarnings`를 증가시켜 **경고**만 냅니다. 관측 도중 원본 Person/건물을 수정하거나 `NS.V029.laborIndex()`를 호출하지 않습니다.
- 다른 Settlement에 기록된 근무 타일(`outboundWorkAssigned15`)과 외부 거주자 중 해당 Settlement에 근무지가 배정된 인원(`inboundWorkAssigned15`)을 구분합니다. 이는 **실제 물리 통근 횟수와 무관**합니다.
- 기존 Settlement CSV 32열을 동일한 순서로 유지하고 16열을 덧붙여 **48열**로 내보냅니다. 기본 Snapshot CSV V2는 **1,683열** 그대로입니다.
- 타일 검사창과 국가 정착지 탭에 후보 인구·시설/임시 슬롯·근무지 배정 수를 추가했고, D1의 기존 ‘근무 위치’는 기록값이라는 점을 명시합니다.
- Devlog `worldSummary.v034d1aLaborAudit`에 새로운 독립 국가별 대조 감사 결과와 슬롯 경고를 표시합니다. Snapshot의 `global.d1a*` 메트릭은 기존 CSV V2의 고정 헤더에 추가하지 않습니다.
- **전용 세이브 버전:** `V0.34D1A`; **저장 키:** `village-observer-v034d1a`. D1 및 이전 세이브는 현 버전에서 의도적으로 불러오지 않습니다.

## 주의: 슬롯 경고의 의미

신규 세계를 생성한 직후에도 `SLOT_STRUCTURAL` 경고가 보일 수 있습니다. 예를 들어 Person에게 과거의 중심지 임시 거래소 슬롯 키(`-3`)가 남아 있으면서 같은 타일에 `trading_post`가 존재하는 경우, **현재 건물 목록과 일치하지 않는 슬롯 기록**으로 탐지합니다. 이를 게임 오작동이라고 단정하지 않고, 차기 고용 시스템 개편 시 진단할 수 있도록 경고로 남깁니다. `audit.ok` 여부와 별개로 확인하세요.

## 실행 및 배포

- GitHub Pages: **전체 프로젝트**를 저장소 최상위에 업로드한 후 Settings → Pages → GitHub Actions. `.github/workflows/pages.yml`이 빌드·Node 회귀시험을 거쳐 `dist/hosted`를 배포합니다.
- 독립 실행: `dist/standalone/index.html` 또는 `index-standalone.html` 단일 파일.
- 빌드 및 검사: `npm run build`, `npm test`, 선택적으로 `python tests/browser-smoke.py` (Chromium/Playwright 설치 환경).
- 원본 V0.34C1H 169개 블록 해시는 수정하지 않았으며 D0, D1, D1A Bootstrap 순서대로 적용됩니다.

## 검증 및 한계

- D1 원본 게임 상태 대비 8일 × C1B 프로파일 ON/OFF 결정론 동일성 검증과 정산 3회 직접 비교 PASS.
- 다중 Settlement·동일 일자 재고 변경·자원/Gold 검산·현재 버전 세이브 복원·어린이/개척/군사 인원 분류·시설/임시 슬롯 분류 PASS.
- Chromium 데스크톱·모바일 메모리 로딩 PASS, Settlement CSV Blob 다운로드 PASS.
- GitHub Pages의 실제 외부 HTTP, 60~75년 장기 자연주행, 모든 가능한 전쟁/외국 근무지 배정 조합은 이 릴리스 제작 과정에서 실측하지 않았습니다.

**다음:** V0.34D2 — Population & Housing Integration. D1A 노동 숫자를 실제 취업률과 혼동하지 말고 D2 시스템 설계 입력값으로 사용하세요.
