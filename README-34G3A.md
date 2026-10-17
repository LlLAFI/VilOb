# Village Observer V0.34G3A — Runtime Integrity & Local Validation

**기준선:** V0.34G3. **범위:** 배포/초기 버전 표기·G3 공간/물류 연결 검사·관측 순수성·대용량 저장파일 로컬 검증. **식량/공간/AI/전쟁/생존 밸런스는 변경하지 않음.**

## 사용자 파일

- `index-standalone.html` — 완전 오프라인 단일 실행파일.
- `dist/standalone/index.html` — 위 파일과 동일한 내용.
- `index.html` — GitHub Pages 저장소 루트용 호스팅 엔트리. `dist/hosted/assets`를 참조.
- `dist/hosted/index.html` — `dist/hosted`를 그대로 게시할 때의 엔트리.
- `local-validator-g3a.html` — 세이브를 업로드하지 않는 자체 포함 브라우저 로컬 검증기. 독립 G3A 엔진 내장.
- `dist/hosted/local-validator-g3a.html` — 동일 검증기를 Pages에 호스팅할 수 있는 복사본.

## 수정 내용

1. **초기 표시**: G3A 부트스트랩에서 UI 생성 순서와 무관하게 문서 제목/버전 버튼을 즉시 동기화. 이후 `renderHeader`에서도 최신 표시를 유지.
2. **Runtime integrity**: G3 공간 병합/경로 함수, 구호 함수, 20열 배송 CSV, G3 read-only API, 선언 버전을 검사. 실패하면 화면에 경고를 표시. `VSim.V034G3A.verify(villageObserver.world)`에서 전체 상태 조회 가능.
3. **호스팅 자산 캐시 식별**: hosted JS/CSS URL에 `?vilob=V0.34G3A`를 부착. root과 dist-hosted 빌드는 각자의 자산 경로를 사용. GitHub Pages Source는 GitHub Actions 하나로 운영 권장.
4. **DEVLOG 계측**: G3 공간 정책/경로 판정 카운터는 읽기 전용 `observe` 경계에서 증가하지 않음. G3 개발 상세 지표는 유지. DEVLOG 파일 `worldSummary.v034g3a`에 연결 검사 결과 포함.
5. **로컬 검증기**: JSON 저장파일을 사용자의 브라우저 메모리에서 읽고 G3A `World.from`으로 복원하여 0/30/90/180일 진행 후 요약 JSON/CSV만 다운로드. 원본은 수정하거나 서버에 전송하지 않음. 검사 중 본편의 다른 세계와 별도 iframe 런타임 사용.

## 61년차 150MB 세이브 검증

1. 원본 세이브 JSON을 백업하고 `local-validator-g3a.html`을 Chrome/Edge에서 열기.
2. 150MB JSON 파일 선택 후 우선 `0일` 검사부터 실행. 메모리 사용과 무결성 상태 확인.
3. 정상이면 새로 `30일`을 선택해 다시 실행(매 실행은 원본 세이브 기준), 90·180일 확대 가능.
4. 결과 `진단 JSON`, `30일 체크포인트 CSV`만 전송하면 됨. 원본 저장파일 전송 불필요.

**중요:** 로컬 검증기는 브라우저에서 JSON 전체를 파싱하므로 150MB JSON은 일시적으로 훨씬 큰 메모리를 필요로 한다. 실제 150MB 실사용 파일 테스트는 아직 불가능하여 검증 완료를 보장하지 않는다. 로컬 도구의 자동 브라우저 회귀는 소형 실제 스키마 G3A 세이브를 이용했다.

## 소스 구조/호환

원본 C1H 169블록 SHA256 무변경. `src/bootstrap/v034g3.js`에서 읽기 전용 정책 경계를 추가하고, 신규 `src/bootstrap/v034g3a.js`에 초기화/진단/세이브 변환을 정의. 그 외 경제·전쟁·RNG 경로 불변. G3A 세이브는 G3·G2A에서 승격하며 구버전 호환은 기존 체인 범위에서 유지.

## 검증

`npm run build && npm test && python tests/browser-g3-smoke.py && python tests/browser-g3a-local.py`

추가 동일 시드/동일 저장상태 비교: `G3A_PARITY_DAYS=180 node tests/test-g3a.cjs`. 장기 신세계: `G3_DAYS=900 node tests/test-g3.cjs`. 결과는 `TEST-34G3A.md` 참조.
