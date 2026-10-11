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
