# V0.34H0 — 화면·렌더러 의존성 지도

> 정적 검색 결과다. 참조 횟수는 실제 호출 횟수/성능 병목/삭제 가능 여부를 입증하지 않는다. 동적으로 생성되는 DOM, 클로저 후킹, bootstrap이 추가한 영역은 별도 브라우저 검증이 필요하다.

- 보호된 레거시 블록 **169개** (원본 SHA 유지)
- 조사 JS 파일 **201개**
- 템플릿 정적 DOM id **56개**

## 11개 검토 화면과 공통 연결 지점

| 화면 | 공통 렌더 함수/DOM |
|---|---|
| 지도 | `renderMap`, `renderTile`, `worldCanvas`, `tileInspector`, `runtimeStatus` |
| 국가·개요 | `renderVillageContent`, `villageContent` |
| 국가·주민 | `renderVillageContent`, `villageContent` |
| 국가·경제 | `renderVillageContent`, `villageContent` |
| 국가·교역 | `renderVillageContent`, `villageContent` |
| 국가·사회 | `renderVillageContent`, `villageContent` |
| 국가·군사 | `renderVillageContent`, `villageContent` |
| 국가·기술 | `renderVillageContent`, `villageContent` |
| 통계·교전기록 | `renderStats`, `render`, `statsScope` |
| 세계 | `renderWorld`, `chronicle`, `devLogPreview` |
| 상단 상태 | `renderHeader`, `runtimeStatus`, `g3aRuntimeIntegrity` |

## 렌더 후킹 수 (정적 참조 포함)

| 함수 | 감지한 정적 패턴 수 | 관련 파일 수 |
|---|---:|---:|
| `render` | 45 | 37 |
| `renderHeader` | 169 | 164 |
| `renderMap` | 39 | 27 |
| `renderTile` | 40 | 37 |
| `renderVillageContent` | 108 | 88 |
| `renderWorld` | 25 | 22 |
| `renderStats` | 26 | 21 |
| `renderTech` | 5 | 3 |
| `renderCodex` | 24 | 23 |
| `setWorld` | 113 | 105 |

## 레거시 보존/제거 결정

| 대상 | 근거 파일 | 처리 |
|---|---|---|
| C1G 고정 성공 문구 | `src/legacy/163.js` | H0에서 안전 제거 |
| 구형 생활권 지도 레이어 | `src/legacy/040.js` | H1에서 UI 제거 |
| V0.33C 지속 교전 패널 | `src/legacy/091.js` | H3에서 교체 후 제거 |
| 0.33 이하 저장 전용 분기 | `복수 World.from / SaveSystem` | 호환성 의무 해제·물리 삭제 보류 |
| G5 무결성 정상 메시지 | `src/bootstrap/v034g5.js` | H0에서 정상표시만 숨김 |
| F0/F1 프로파일러 DOM | `src/bootstrap/v034f0.js / v034f1.js` | H3에서 위치 이동 |

## H1~H3 구현 경계

- H1: 맵 레이어·정착지 국가색 완전 경계·타일 상세. `renderMap`/`renderTile` 후킹 순서 보존.
- H2: 국가 7개 하위탭의 `renderVillageContent` 우선순위 재구성. 실제 Person·Settlement 데이터 참조 검증.
- H3: 세계/통계/상단 상태, C1G UI 제거, F0/F1 이동 시 헤더 계측 의존성 유지.
- 모든 단계에서 G5 저장/복원·1683열 CSV·장비/Gold/재고/기술 43개 회귀.

## 정적 ID의 실제 참조 (사용처 파악용)

| DOM ID | 템플릿 | 소스 파일 수 |
|---|---:|---:|
| `versionBadge` | Y | 145 |
| `timeLabel` | Y | 9 |
| `worldMood` | Y | 9 |
| `playBtn` | Y | 7 |
| `stepBtn` | Y | 1 |
| `runtimeStatus` | Y | 119 |
| `view-map` | Y | 9 |
| `globalStats` | Y | 2 |
| `newWorldBtn` | Y | 3 |
| `mapImportInput` | Y | 1 |
| `mapSourceStatus` | Y | 1 |
| `zoomOutBtn` | Y | 2 |
| `zoomLabel` | Y | 3 |
| `zoomInBtn` | Y | 2 |
| `centerVillageBtn` | Y | 3 |
| `worldCanvas` | Y | 26 |
| `tileInspector` | Y | 36 |
| `view-village` | Y | 0 |
| `villageCards` | Y | 6 |
| `villageSubtabs` | Y | 5 |
| `villageContent` | Y | 87 |
| `view-tech` | Y | 1 |
| `researchSummary` | Y | 2 |
| `techTree` | Y | 3 |
| `view-codex` | Y | 0 |
| `codexContent` | Y | 23 |
| `view-stats` | Y | 3 |
| `statsScope` | Y | 15 |
| `statsNation` | Y | 12 |
| `statsSettlement` | Y | 11 |
| `statsMetric` | Y | 12 |
| `statsPeriod` | Y | 12 |
| `statsNote` | Y | 11 |
| `statsCanvas` | Y | 10 |
| `view-world` | Y | 4 |
| `foodBtn` | Y | 1 |
| `woodBtn` | Y | 1 |
| `goldBtn` | Y | 1 |
| `moraleBtn` | Y | 1 |
| `stormBtn` | Y | 1 |
| `devLogCount` | Y | 1 |
| `devNote` | Y | 1 |
| `captureBtn` | Y | 1 |
| `exportLogJsonBtn` | Y | 1 |
| `exportLogCsvBtn` | Y | 3 |
| `clearLogBtn` | Y | 1 |
| `devLogPreview` | Y | 3 |
| `saveBtn` | Y | 3 |
| `loadBtn` | Y | 1 |
| `exportBtn` | Y | 2 |
| `importInput` | Y | 1 |
| `saveMessage` | Y | 4 |
| `chronicle` | Y | 3 |
| `techModal` | Y | 2 |
| `techModalClose` | Y | 1 |
| `techModalBody` | Y | 2 |
| `g3aRuntimeIntegrity` | — | 7 |
| `v034f0PerfPanel` | — | 2 |
| `v034f1FoodPanel` | — | 0 |
| `v30aPerfPanel` | — | 9 |

