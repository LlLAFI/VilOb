# Village Observer V0.34H3 — World & Statistics UI Consolidation V1

- 기준선: V0.34H2A (정착지 중심 타일 소유권 해제 + H2 고아 링크 저장 복구)
- 구현: 2026-10-19
- 범위: **표시 및 수동 진단 UI만 개편**. AI/Person/전쟁/식량/Gold/실물자원/기술/저장 회계·난수 계산식 변경 없음.

## 1. 통계 — 공식 전쟁 기록과 지도 연결

- V0.33C의 오래된 **별도 지속 교전 기록 패널 호출만** 빌드 시 제거한다 (`tools/h3-transform.mjs`, `src/legacy/091.js`). 전투 상태, 교전 데이터, 타일 상세, Telemetry/CSV 코드 및 공식 V0.33E/F 전쟁 이력은 보존한다.
- 현재 공식 전쟁 기록(`v33aWarHistoryPanel`) 카드 하단에 **실제 데이터에서 확인된 교전 타일**, 정식 War Goal 타일, 평화협정 영토 양도 타일이 있으면 16개까지 지도 이동 버튼을 추가한다.
- 지도 이동은 선택 타일을 강조하고 화면 중심을 해당 좌표로 이동한다. 소유자가 있는 타일에서는 현재 소유 국가도 선택한다.
- 오래된 전쟁에서도 전쟁 목표·종전 이력은 남지만, **I3 라운드 상세는 교전 종료 후 360일 보존 정책을 따른다.** 구체적인 라운드가 삭제된 경우 데이터를 임의 생성하지 않는다.

## 2. 세계 — 읽기 전용 현황과 비교

- 세계 인구, 생존 국가, 실제 Settlement, 소유 영토, 전쟁 활성/누적 수를 상단에 통합.
- 국가 비교: 인구·영토·기술·국고 Gold·시장 Gold·주민 지갑 Gold·합계 Gold, 정렬과 멸망 국가 포함 토글, 생존 국가 개요 이동.
- 세계 연대기: 원래 보존된 세계 사건을 필터링해 최근 80건만 별도로 보여줌. 보존되지 않은 사건이나 생산량은 생성하지 않음. 원래 세계 연대기 DOM은 내부 상세 영역에 유지하여 기존 렌더러와의 호환을 보장함.

## 3. F0/F1 · 저장 · 고급 도구

- F0 `v034f0PerfPanel`, F1 `v034f1Panel` 실제 DOM을 세계 탭의 `성능·생존 관측` 접기 섹션으로 이동. **복제·재초기화하지 않으므로 기존 클릭 리스너와 표본 수집 방식 유지.** 기존 실험실/성능 패널도 상세 진단 영역으로 이동.
- 세이브, Devlog, Snapshot CSV, 메모, 관찰자 개입, AI 프로필, 각종 실험 도구는 원래 버튼과 렌더러를 그대로 유지하고 섹션별로 정리.
- 상단 오류 안내는 **이미 생성된 Snapshot 오류 지표**만 사용. 매 프레임/헤더 갱신 때 `inspect`/`audit` 실행하지 않음.
- 사용자가 `고급 도구 → 기존 상세 진단 → 현재 세계 감사 실행`을 직접 누르면 C/D2/D3 실물 검사를 **한 번만** 실행한다. `errors`와 `warnings`를 별도 구분하고, 석재 `STORAGE_OVERFLOW` 경고는 삭제·보정 없이 그대로 출력한다.

## 4. 버전·세이브·빌드

- 릴리스 `V0.34H3`, 로컬 저장키 `village-observer-v034h3`. 기존 H2A/H2/H1/H0/G5 저장 파일 로드는 래퍼 체인을 통해 유지한다.
- 최신 기술 수 **43개**, Snapshot CSV 스키마 **1,683열**, 보호된 C1H 원본 **169개 블록 SHA 불변**.
- 새 파일: `src/bootstrap/v034h3.js`, `tools/h3-transform.mjs`, `tests/test-h3.cjs`, `tests/test-h3-parity.cjs`, `tests/baselines/index-H2A.html`, `tools/browser-h3-smoke.py`.
- `npm run build` → `dist/standalone/index.html`, `dist/hosted/index.html`와 정적 `assets/`, 루트 `index.html` (GitHub Pages 경로), `index-standalone.html` 생성.
- `npm test`는 GitHub Actions의 빌드 직후 수행되는 CI 통과 조건; 더 오래 걸리는 버전 간 회귀는 `npm run test:extended`로 구분.

## 5. 검증/미해결

- `npm test` 종료 코드 0; H2A↔H3 **같은 H2A 세이브/난수로 30일 주요 상태 13개 일치**; `tests/test-h2.cjs` H2/H1/H0/G5 저장 호환성 및 30일 실행 PASS.
- Chromium Standalone·Hosted (로컬 생성 자산) × 1440px/390px **4/4 PASS**: 7국가·43기술·F0/F1 버튼 리스너·패널 위치·연대기 필터·전쟁 지도 이동·캐시된 상단 감사 오류·수동 감사.
- 실제 88년 H2A Save JSON은 받지 못했으며 Devlog/CSV만 제공됐음. 해당 세이브를 H3에서 불러와 30일/1년 확인하는 사용자 검증은 별도로 필요.
- `STORAGE_OVERFLOW` 석재 초과, 델마 생존/AI 밸런스, 150년 성능 최적화는 범위 제외. 150년 자연주행과 `npm run test:extended` 전체 종료는 이 릴리스에서 **미검증**.

## 6. GitHub Desktop 배포

1. ZIP 전체를 풀고 **저장소의 기존 프로젝트 구조에 파일을 반영**합니다. `src`, `tools`, `tests`, `dist/hosted`, 루트 `index.html`, `package.json`을 포함해야 합니다.
2. GitHub Desktop → Changes 확인 → `V0.34H3 World Statistics UI` Commit → Push origin.
3. GitHub Actions의 build(`npm run build` → `npm test`)와 deploy가 모두 성공한 뒤 Pages에서 `V0.34H3` 배지 확인.
4. 서버 배포 전 단독 확인은 `index-standalone.html`을 열어 실시.
