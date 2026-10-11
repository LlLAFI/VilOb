# Village Observer V0.34D3A

최신: **V0.34D3A — Food Supply & Storage Stabilization**. 일반 식량·목재·석재 채취의 창고 미입고분을 자연 원료로 복구하고, Settlement별 30일 Food Flow CSV(45열) 및 실제 원격 인출·일부 물류 반환 진단을 제공합니다. 기본 생산·소비·재생 수치는 변경하지 않습니다. 상세 내용: [README-34D3A.md](README-34D3A.md), 검증: [TEST-34D3A.md](TEST-34D3A.md).

---

# Village Observer V0.34D3 — Settlement Economy Integration V1

**최신 개발 기준선: V0.34D3 (2026-10-11).** 동일 활성 Settlement 안의 여러 타일은 민간 식량·목재·석재·철광석·철·도구 재고, 실제 저장 공간 및 Market Gold 접근을 공동 생활권으로 처리합니다. 재고·건물·군사 이동의 물리 위치는 보존하고, 서로 다른 Settlement 및 국가 간에는 기존 실제 물류·거래를 사용합니다.

- **독립 실행:** `dist/standalone/index.html` (또는 `index-standalone.html`).
- **GitHub Pages용:** 프로젝트 루트 `index.html` + `dist/hosted/assets/` 또는 `dist/hosted/index.html` + 동일 위치의 `assets/`.
- **시장:** 같은 Settlement의 부족률과 가격 신호를 공유하고, 같은 공동경제권 내부에서 자기 자신과 거래하지 않습니다. 기존 Market Gold를 보존적으로 타일 간 이전할 수 있습니다.
- **식량:** 자연회복·농업 채집·주민 소비량은 변경하지 않고, 실제 채집·보관·먹이 공급·입고 거절을 관측합니다. 자연 식량 회복 수치는 **3일 작업주기당**입니다.
- **CSV:** Snapshot V2 1,683열 / Settlement 48열 / Housing 11열 유지, 신규 **Settlement Economy 24열**.
- **저장:** V0.34D3 전용(`village-observer-v034d3`). 이전 D2B 세이브 자동 로딩은 지원하지 않습니다.
- **검증:** `npm run build`, `npm test`, `npm run test:year`, `python tests/browser-d3-smoke.py`; 기본 회귀 및 370일 2회 결정론 PASS, 60~75년 장기 미검증. 과거 고정 시드 정지 이슈는 계속 OPEN.
- **상세:** `README-34D3.md`, `TEST-34D3.md`, `RELEASE-MANIFEST-34D3.json`.

---

# Village Observer V0.34D2B — Civilian Settlement Consistency & Housing Diagnostics

**개발 기준선: V0.34D2B (2026-10-11).** V0.34D2A의 공동 주거 핫픽스에 이어, V0.27 실제 Person 일일 주거 스트레스·행복도, V0.28 통계와 내부 민간 이주 후보를 Settlement 생활권에 연결했습니다.

- **다운로드·실행:** `dist/standalone/index.html` 하나로 독립 실행. GitHub Pages에는 `dist/hosted/index.html`과 `dist/hosted/assets/`를 함께 배포합니다.
- **D2B 핵심:** 같은 Settlement 안의 타일 사이에서는 V0.28 민간 내부 이주를 수행하지 않음. 물리적인 Person 거주 타일·군사 이동·건설 입지는 유지합니다.
- **일일 생활:** V0.27 실제 Person 대사 경로의 주거 스트레스·행복도 주거 비율을 Settlement 공동 주거로 계산합니다.
- **통계:** `housingStrainedResidents28`은 현재 공동 주거 **활성** 수용량 부족 상태를 집계합니다. `housingStrainDays>20`은 별도 D2B Devlog 진단으로 유지하여 과거 누적 스트레스와 구별합니다.
- **착공 진단:** 주택 신축·주거 개축·토지정비 시도별 `byType`, `byBlocker`, 최근 36개 시도를 Devlog `v034d2bHousingDiagnostics`에 제공합니다. 출처가 확인되지 않는 거절은 `UNRESOLVED_*`로 표기합니다.
- **유지:** 건설 슬롯 기본 3~최대 11, 자재·Gold·노동·기술·경제·전쟁 규칙, 기존 1,683열 Snapshot V2·48열 Settlement·11열 Housing CSV 모두 유지.
- **저장:** D2B 버전만 현재 로드 가능. 키 `village-observer-v034d2b`; 이전 세이브 자동 변환은 지원하지 않습니다.
- **기본 시험:** `npm run build`, `npm test`, `python tests/browser-smoke.py`.
- **검증 한계:** 120일 반복 결정론과 기능별 합성 시나리오, PC·모바일 Chromium은 통과. 특정 고정 시드의 1년 이상 자연주행에서 진행 중단이 재현되어 **D2 계열 CLOSED 보류**. 이 현상은 D2A 비교 시험에서도 발견되었으나 원인 및 D2B 고유 영향 여부는 확정하지 못했습니다.
- **범위 제한:** 동일 Settlement 간 물리 이주는 제거하지만, **서로 다른 Settlement 간 기존 타일 기반 식량·서비스·직장 매력도**는 아직 유지됩니다. 완전한 경제 생활권 통합은 D3 예정입니다.

상세: `README-34D2B.md` · 시험: `TEST-34D2B.md` · 릴리스: `RELEASE-MANIFEST-34D2B.json`.

---

# Village Observer V0.34D2A — 주거 계산·생활권 정합성 핫픽스

**현재 기준선: V0.34D2A (2026-10-11).** 회관/전초기지 주거 수용량 누락 및 같은 종류 건물 상태 효율 과대 계산을 수정하고, 실제 V0.24 일일 출생·질병과 Person 주거 스트레스의 Settlement 생활권 기준을 통일했습니다.

- **단독 실행:** `dist/standalone/index.html` 또는 `index-standalone.html`
- **GitHub Pages:** 전체 프로젝트를 GitHub에 업로드하여 `dist/hosted/` 빌드 배포
- **건설 슬롯:** 기본 3, 인구·기술에 따라 최대 11개로 확대된 D2 공식 유지
- **저장:** `V0.34D2A`만 지원, 로컬 키 `village-observer-v034d2a` (이전 D2 세이브 직접 불러오기 미지원)
- **CSV:** Snapshot V2 1,683열 / D1A Settlement 48열 / D2 Housing 11열 유지
- **구현 상세:** `README-34D2A.md` · **시험:** `TEST-34D2A.md`
- **개발:** `npm run build`, `npm test`, 선택적으로 `node tests/test-d2a-year.cjs`, `python tests/browser-smoke.py`
- **검증:** 코드/120일·370일 결정론/PC·모바일 PASS; 사용자 자연주행 60–75년 미검증

---

# Village Observer V0.34D2 — Settlement 생활권 통합 · 건설 슬롯 확대

**현재 기준선: V0.34D2** (2026-10-11). D1A 노동 관측 패치에서 **실제 주거·건설 판단을 변경**합니다.

- **Settlement 생활권:** 같은 Settlement에 속한 타일은 공동 주거 용량과 민간 근무 접근성을 이용합니다. 건물의 지형/입지와 군사 유닛의 타일 이동은 보존합니다. 재고·시장 통합은 D3 예정.
- **건설 슬롯:** 기본 3개, 인구 25/60 각 +1, `ADMINISTRATION`/`ENGINEERING`/`URBANIZATION` 각 +2, 최대 **11개**. 신축·개축·토지 개발·특화 작업을 공통 집계합니다.
- **상세 변경:** `README-34D2.md` · **시험:** `TEST-34D2.md`.
- **실행:** `dist/standalone/index.html` (단일 파일), 또는 전체 프로젝트를 GitHub Pages GitHub Actions로 게시.
- **개발:** `npm run build` / `npm test`; 선택적으로 `python tests/browser-smoke.py`.
- **데이터:** D2 Housing CSV 11열 신규 · D1A Settlement CSV 48열 유지 · Snapshot CSV V2 1,683열 유지.
- **저장:** D2 자체 저장 전용(`village-observer-v034d2`). 이전 버전 세이브 불러오기 미지원.
- **현재 판정:** 구현·기본 회귀시험 PASS, 60~75년 장기 자연주행 미검증.

---

# Village Observer V0.34D1A — Labor Metrics Clarification

**현재 개발·배포 기준선은 V0.34D1A입니다.** 75년 V0.34D1 자연주행에서 발견된 노동 집계 의미 오류를 관측 전용으로 보정했습니다. 경제·고용·Person/AI 의사결정은 변경하지 않았습니다.

- **독립형 게임:** `dist/standalone/index.html` 또는 `index-standalone.html` (단일 HTML).
- **GitHub Pages:** 프로젝트 전체를 GitHub에 게시; `.github/workflows/pages.yml`이 `dist/hosted`를 빌드·배포.
- **원본 개발 소스:** `src/bootstrap/v034d0.js` → `v034d1.js` → **`v034d1a.js`**, 165개 Legacy JS와 4개 CSS는 보호 유지.
- **빌드/검사:** `npm run build` / `npm test`; 선택사항 `python tests/browser-smoke.py`.
- **D1A Settlement CSV:** 기존 32열 + 16개 노동 지표 = **48열**. `assignedJobs`와 `workersAtTile`은 원본 필드 집계로 남아 있으며 실제 고용률을 의미하지 않습니다.
- **기존 Snapshot CSV V2:** 1,683열 유지.
- **저장:** `V0.34D1A` 전용 `village-observer-v034d1a` 키; D1과 구버전 세이브 불러오기 미지원.
- 상세: `README-34D1A.md`, `TEST-34D1A.md`, `SETTLEMENT-AGGREGATE-D1A-SCHEMA.md`.

---

# Village Observer V0.34D1

**새 개발 기준선은 V0.34D1 Settlement Aggregate V1입니다.** 다중 파일 소스/이중 배포는 D0를 유지하고, 최신 정착지 읽기 전용 집계·독립 검산·세부 UI·32열 Settlement CSV를 추가했습니다.

- 독립형 게임: `dist/standalone/index.html` (또는 `index-standalone.html`)
- GitHub Pages: `dist/hosted/index.html` + 동일 폴더의 `assets/`
- 전체 프로젝트: 루트에서 `npm run build`, `npm test`; `.github/workflows/pages.yml`은 `dist/hosted` 배포
- D1 문서: `README-34D1.md`, `TEST-34D1.md`, `SETTLEMENT-AGGREGATE-D1-SCHEMA.md`
- 이전 버전의 세이브 파일 하위 호환은 필수 지원 대상이 아니며, D1의 저장키는 `village-observer-v034d1`입니다.

---

# Village Observer V0.34D0

**Multi-file Foundation & Regression Baseline** · 2026-10-11

V0.34C1H의 게임·AI·군사·경제·Settlement 규칙을 그대로 유지하는 구조 전환 패치입니다. 기존 인라인 JavaScript **165개**, CSS **4개**를 순서가 있는 소스 파일로 보관하고, Node.js의 빌드 스크립트로 두 가지 배포본을 만듭니다.

## 실행

- **다운로드한 단일 HTML 실행:** `dist/standalone/index.html` (또는 `index-standalone.html`) 하나만 사용합니다. 인터넷 연결이나 빌드 작업이 필요하지 않습니다.
- **GitHub Pages:** 저장소의 `.github/workflows/pages.yml`을 사용하려면 GitHub Pages의 배포 소스를 **GitHub Actions**로 설정해야 합니다. Actions는 `dist/hosted/`를 게시합니다. 직접 업로드하려면 `dist/hosted/index.html`과 같은 디렉터리의 `assets/` 폴더를 함께 올립니다.
- 프로젝트 루트의 `index.html`은 **다중 파일 Hosted** 진입점입니다. 반드시 `dist/hosted/assets/`과 같이 배포해야 합니다. 단일 파일 다운로드에는 루트 `index.html` 대신 `dist/standalone/index.html`을 사용하세요.

## 개발

Node.js 18 이상이 필요합니다. 외부 npm 의존성 없이 다음 명령을 실행할 수 있습니다.

```bash
npm run build
npm test
```

소스는 `src/template.html`, `src/manifest.json`, `src/legacy/`, `src/styles/`, `src/bootstrap/`에 있습니다. 패치 코드 **`src/bootstrap/v034d0.js`** 이외에는 원래 C1H 코드 블록을 수정하지 않았습니다. 빌드 도구가 169개 원본 블록을 바이트 단위로 재조립해 SHA-256 해시로 검증합니다.

## CSV V2

게임 Devlog 패널에서 **스냅샷 CSV (Legacy)** 와 **스냅샷 CSV V2**를 따로 선택할 수 있습니다. V2는 기존 1,683개 열, 모든 값, 행 및 열 순서를 유지하면서 서로 중복되던 72개 헤더 이름을 `global.` / `nation.` 접두사로 구분합니다. 전체 위치별 이름 대응은 `src/csv/schema-v2.json`에 있습니다.

## 세이브 정책

D0의 신규 세이브 키는 `village-observer-v034d0`이며, D0 저장·불러오기 및 JSON 내보내기를 지원합니다. **C1H 및 이전 버전 세이브의 하위호환은 릴리스 조건이 아닙니다.** 이전 버전의 플레이를 보존하려면 그 버전의 `index.html`을 보관하세요.

## 검증 상태

- 원본 169개 코드·스타일 블록의 재조립 해시 일치.
- JS 문법 검사 166개 스크립트 통과, CSV 스키마 1,683열 고유화.
- C1H 대비 8일 정밀 계측 ON/OFF 일별 물리 상태·이벤트·RNG 일치.
- 유지보수 정산 직접 3회 × 계측 ON/OFF 상태·RNG 일치.
- Chromium 메모리 로딩에서 PC·모바일 뷰포트 초기화, 121개 패치노트 등록, 세이브 왕복 및 CSV 검증 통과.
- **제한:** 자동화 환경에서 96일 연속 비교는 실행시간 초과로 완료하지 못했고, Hosted 외부 파일의 실제 네트워크 로딩은 브라우저 정책으로 직접 확인하지 못했습니다. 실 GitHub Pages 접속 테스트 및 장기 자연주행은 남은 검증 항목입니다.

상세 정보: `README-34D0.md`, `TEST-34D0.md`, `BUILD-GUIDE.md`, `CSV-SCHEMA-V2.md`.
