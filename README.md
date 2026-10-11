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
