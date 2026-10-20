## V0.35A 계측 전용 패치

전체 설명: `README-35A.md`. 브라우저의 세계 탭 → 고급 도구에서 계측 시작/종료 후 JSON으로 분석할 수 있습니다. 동일 저장파일 로컬 A/B: `npm run bench:35a -- --save "<save.json>" --days 30 --runs 3 --output 35a-benchmark.json`.

## 현재 릴리스 V0.34H4B

`npm run build && npm test`를 실행합니다. H4B 엔진 로딩은 H4A bootstrap 다음의 `src/bootstrap/v034h4b.js`입니다. Standalone과 Hosted를 모두 업데이트하고, 루트 `index.html`과 `dist/hosted/assets`를 함께 배포하세요. 상세: `README-34H4B.md`, `TEST-34H4B.md`.

## 현재 릴리스 V0.34H4

- 빌드 `npm run build`, GitHub Pages 필수 CI `npm test` (H4 10일 동등성 검증 포함).
- H4 신규 `src/bootstrap/v034h4.js`, `tools/h4-transform.mjs`, D3 공동 용량 조회 최적화가 필요합니다.
- Standalone/Hosted 모두 지원하며 H3 이전 저장 데이터를 불러옵니다. `README-34H4.md` · `TEST-34H4.md` 참고.

## 현재 릴리스 V0.34H3

- 실행: `npm run build && npm test`. 최종 버전은 H3이며 최신 패치 문서는 `README-34H3.md`, 테스트는 `TEST-34H3.md`.
- Standalone/Hosted 신규 `src/bootstrap/v034h3.js`와 `tools/h3-transform.mjs`가 필요함.
- GitHub Actions 경로는 프로젝트 ZIP의 모든 변경 파일을 Commit/Push해야 하며 `npm test`를 생략하지 않음.

## 현재 빌드 V0.34G1B

Standalone/Hosted: `npm run build`. 테스트: `npm test`, `python tests/browser-g1b-smoke.py`. G1B 부트스트랩은 G1A 다음 순서이며 버전 메타데이터·세이브/로드를 업데이트한다. 보호 C1H 소스는 변경하지 않는다.

## V0.34G1 최신 빌드

`node tools/build.mjs`; 회귀는 `npm test` 또는 `G1_DAYS=30,90,180 node tests/test-g1.cjs`. G1 물류 감사 CSV 추가. `README-34G1.md` 참고.

## V0.34F2 추가사항

신규 `src/bootstrap/v034f2.js`, `tools/f2-transform.mjs`를 빌드에서 마지막에 적용한다. F1A1 기준선 파일과 별개로 기존 169개 C1H 보호 블록 해시는 유지한다.

> **최신 V0.34F1A1** — `src/bootstrap/v034f1a1.js`를 F1A 이후 로드. F1A Food Flow CSV 출력 조립만 수정하고 시뮬레이션은 유지. `npm run build`, `npm run test:static`, `F1A1_DAYS=180 node tests/test-f1a1.cjs`. 상세 `README-34F1A1.md`.

> **최신: V0.34F1A** — `tools/f1a-transform.mjs`가 보호 레거시 008의 실제 초과비축 차감을 관측하고 `src/bootstrap/v034f1a.js`를 F1 뒤에 로드합니다. `npm run build`, `npm run test:static`, `F1A_DAYS=180 node tests/test-f1a.cjs`. `README-34F1A.md` 참고.

> **최신: V0.34F1** — `src/bootstrap/v034f1.js`를 F0 다음에 로드. 모델 수식은 F0 그대로이며 원인 진단만 추가. `npm run build`, `npm run test:static`, `F1_DAYS=360 node tests/test-f1.cjs`. 자세한 내용은 `README-34F1.md` / `TEST-34F1.md`.

> **현재 실험 빌드 V0.34E-rc1 (E-01).** `src/bootstrap/v034e.js` / `tools/benchmark-save.cjs` / `tools/audit-surface.mjs`를 추가했습니다. 61년차 저장파일 A/B 비교는 저장파일 제공 후 수행합니다. 정식 V0.34E가 아닙니다.

> **현재 배포 V0.34D3B3B.** D3B3A 다음 `src/bootstrap/v034d3b3b.js`를 로드. 비보호 `src/bootstrap/v034d3.js`/`v034d3a.js`의 관측 통합을 통해 중복 물리 재고 계측을 줄입니다. `README-34D3B3B.md`·`TEST-34D3B3B.md` 참고.

> **현재 배포: V0.34D3B3.** src/bootstrap/v034d3b3.js가 마지막에 로드되고, src/bootstrap/v034d3.js / v034d3a.js의 비보호 코드에 최적화가 적용됩니다. `README-34D3B3.md`, `TEST-34D3B3.md` 참조.

> **현재 배포: V0.34D3B2.** `src/bootstrap/v034d3b2.js`는 D3B1 후에 로드되며 V24 물리 착공 식량 계측과 최초 버전 배지를 수정합니다. `npm run build`의 `VERSION` 상수가 UI/메타데이터에 적용됩니다. `README-34D3B2.md`, `TEST-34D3B2.md` 참조.

> **현재 배포 기준:** V0.34D3B1. `src/bootstrap/v034d3b1.js`를 D3B 후에 연결합니다. 도로 정착지 13타일 변환은 `tools/d2-transform.mjs`에서 이루어지며 레거시 원본 SHA는 그대로 유지합니다. 상세: `README-34D3B1.md`, `TEST-34D3B1.md`.

> **현재 배포 기준:** V0.34D3B. 빌드 `src/bootstrap/v034d3b.js`를 D3A2 다음에 연결합니다. 현재 결과물과 검증 상태는 `README-34D3B.md` / `TEST-34D3B.md`를 확인하세요.

> 최신 빌드 기준선: V0.34D2A. `src/bootstrap/v034d2a.js`는 V0.34D2 후에 로딩됩니다.

# V0.34D2 빌드 및 게시 안내

## 로컬 빌드

```bash
node --version  # 18 이상
npm run build
npm test
```

`npm run build`는 C1H 원본을 먼저 바이트 수준에서 재조립해 해시를 비교합니다. 어느 Legacy 코드가 변했거나 순서가 어긋나면 즉시 실패합니다. 빌드가 성공하면 다음 경로가 생성됩니다.

| 경로 | 설명 |
|---|---|
| `dist/standalone/index.html` | 외부 JS/CSS가 없는 단일 HTML (독립 실행용) |
| `dist/hosted/index.html` + `dist/hosted/assets/` | 정적 서버·GitHub Pages 배포용 |
| `index.html` | 저장소 루트의 Hosted 진입점 (`dist/hosted/assets/` 의존) |
| `index-standalone.html` | 독립 실행형 HTML의 루트 복사본 |
| `dist/build-manifest.json` | 배포 결과 해시·크기·코드 블록 개수 |

## GitHub Pages

1. 폴더 전체를 GitHub 저장소에 푸시합니다.
2. Settings → Pages에서 Build and deployment → Source를 **GitHub Actions**로 변경합니다.
3. `main` 브랜치 푸시 시 `.github/workflows/pages.yml`이 `npm run build`와 `npm test`를 실행한 뒤 `dist/hosted`를 게시합니다.
4. 브라우저에서 발급된 Pages 주소로 접속합니다. Pages 설정·배포는 GitHub 계정 소유자가 수행해야 하며, 이번 배포 파일은 실제 원격 저장소에 게시된 것은 아닙니다.

## 주의

- 프로젝트 루트 `index.html` 하나만 다른 폴더에 복사하면 외부 파일 경로가 끊깁니다. 단일 파일 배포에는 `dist/standalone/index.html`을 이용하세요.
- `src/legacy/`의 파일명 순서가 아니라 `src/manifest.json`의 배열 순서가 유일한 실행 순서입니다.
- 기존 패치의 `script` 경계가 변수 스코프에 영향을 줄 수 있으므로 파일들을 직접 이어붙이거나 무검증으로 `type="module"`로 바꾸지 마세요.
- `tests/legacy/`는 과거 C1H 참고 테스트로, 절대경로 의존성이 일부 존재합니다. `npm test`는 경로가 현재 프로젝트로 수정된 D0 공식 테스트만 사용합니다.


D1 집계 Bootstrap: `src/bootstrap/v034d1.js` — D0 다음 실행.
D1A 노동 분류 Bootstrap: `src/bootstrap/v034d1a.js` — D1 다음 실행.

## D2 정책 연결 방식

`src/bootstrap/v034d2.js`는 D1A 다음에 적용됩니다. 레거시 169개 파일의 원본 해시는 보존하되, `tools/d2-transform.mjs`에서 몇 가지 레거시 주거·인력·건설 경로에 명시적인 호출 게이트를 삽입한 결과물을 두 빌드에 동일하게 넣습니다. `--check-only`는 레거시 원본 무결성을 검사하고, 실제 `npm run build`에서 연결 지점의 존재·유일성을 검증합니다.

`npm test`는 D2 정책 변경 때문에 기존 `test-determinism.cjs`(C1H↔D0 전체 상태 동일성) 대신 `test-d2.cjs`(D2↔D2 반복 결정론)를 실행합니다. 이전 D1A 테스트는 개별 기준선의 기록으로만 남습니다.


## V0.34D3B3A 계측
- `src/bootstrap/v034d3b3a.js`를 Standalone/Hosted 마지막에 연결합니다.
- `npm run build` 및 `npm run check:source`; 테스트는 `node tests/test-d3b3a.cjs`.
- 전체 Food Flow 48열은 그대로, 잔차 경량 CSV는 별도 다운로드입니다.

## V0.34E-rc4 빌드

`node tools/build.mjs` / `npm run test:static`. `tools/e3-transform.mjs`은 해시가 고정된 `src/legacy/065.js`의 *빌드 산출물*에만 스냅샷 상태 단계 분리·개척 진단 경량화를 적용합니다. 정적 소스 원본을 수정하지 않으므로 C1H 원본 재현 검사는 유지됩니다. `tools/benchmark-local.html`은 실제 세이브 비교 기능을 제공합니다.


## V0.34E-rc4
- `tools/e4-transform.mjs`는 **릴리스** F5/F5A Snapshot 상위 중복 초기화 감소 변환을 담당한다. 원본 레거시 무결성은 유지.
- `tools/benchmark-local.html`은 B3B/RC3 기준과 RC4의 3일 주기/Snapshot 비용을 분리한다.


## V0.34E-rc4h 결정론 핫픽스

- `tools/e4-transform.mjs`가 F5/F5A Snapshot의 원본 `attach(w)` 호출을 의무 검사하며 **릴리스 변환을 하지 않습니다**. RC4의 최적화 생략 경로는 되돌렸습니다.
- `npm run build`, `npm run test:static`, `npm run test:e04h`를 사용합니다. 마지막 테스트는 브라우저 61년차 저장파일을 요구하지 않으나 150일 회귀로 시간이 걸립니다.
- 내부 버전: `V0.34E-rc4h`; GitHub Pages Hosted와 Standalone 둘 다 빌드됩니다.


## V0.34F0

`src/bootstrap/v034f0.js` 는 E05 부트스트랩 이후 로드됩니다. `npm run build` / `npm run test:static` / `F0_DAYS=360 node tests/test-f0.cjs` 로 검증합니다. 성능 합격 조건은 PC ×10 150년 동안 평활 SIM/BATCH 1000ms 미만이며 F0 단계에서는 검증 대기입니다.

## V0.34G1A 추가

`src/bootstrap/v034g1a.js`는 G1 부트스트랩 뒤 로드됩니다. G1A는 protected source 불변을 유지하고 `tools/g1-transform.mjs`로 관측 호출만 추가합니다. `npm run build`는 Standalone/Hosted를 동일하게 배포하며 테스트는 `tests/test-g1a.cjs`, `tests/browser-g1a-smoke.py`를 참조합니다.


## V0.34H4A 배포
`npm run build` 후 `npm test` 확인. GitHub Pages는 루트 `index.html`과 `dist/hosted/assets/bootstrap/v034h4a.js`를 포함한 전체 빌드 자산을 함께 업로드합니다. 로컬 `index-standalone.html`은 독립 실행용입니다. 상세 README-34H4A.md 참조.

## V0.34H4C 배포
`npm run build` 후 `npm test`. GitHub Pages에는 root `index.html`과 `dist/hosted/assets/bootstrap/v034h4c.js`를 포함한 완전한 `dist/hosted/assets` 배포가 필요합니다. 단독 실행용 `index-standalone.html`; [패치노트](README-34H4C.md)·[검증](TEST-34H4C.md).
