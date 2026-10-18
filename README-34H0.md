# Village Observer V0.34H0 — Legacy Boundary & UI Refactor Foundation

기준: V0.34G5 / 날짜: 2026-10-18  
상태: **H0 구현 및 검증 완료 (H1~H3 UI 본 개편은 미적용)**

## 이번 패치에서 실제 변경한 사항

1. 공식 실행 버전을 `V0.34H0`으로 갱신. H0 저장키 `village-observer-v034h0`와 JSON/Devlog 파일명 도입. G5/G4A1/G4A/G4/G3B 키 및 저장 형식은 종전 G5 복원 체인을 통해 계속 지원한다. V0.33 이하 세이브는 호환성 보장 대상에서 제외한다.
2. `src/legacy/163.js`의 **고정 C1G 성공 문구 할당 한 줄**을 빌드 시에만 제거. C1G 진단 본체·인덱스·World/Telemetry/CSV·연간 기록은 그대로 남겼다.
3. 구형 `runtimeStatus` 성공 표시를 상단에서 숨긴다. G5 무결성 검사 성공 표시도 숨기되 **검사 실패 시에는 경고를 보여준다**. 구형 알림을 담는 DOM 자체는 F0 등 후속 계층 호환을 위해 유지한다.
4. `src/bootstrap/v034h0.js`를 신규 최종 계층으로 추가. H1~H3에서 재사용할 DOM 참조·접기/펼치기 헬퍼와 구성 검사 접근점을 제공한다(아직 기존 11개 탭 구성은 변경하지 않는다).
5. `tools/h0-transform.mjs`로 최소 변경을 보호 앵커 검증하에 적용. C1H의 원본 169개 SHA는 그대로 유지한다. G5 무결성의 하위 컴포넌트 버전 판정은 H0 환경에서도 정상 통과하도록 범위 확장.
6. `tools/h0-audit.mjs`로 정적 렌더/DOM 참조를 추출해 `docs/H0-UI-DEPENDENCIES.md` 및 `.json`을 생성한다. 이 결과는 후속 H1~H3 작업용 **소스 탐색 지도**이지 죽은 코드 증명이나 실측 CPU 프로파일러가 아니다.
7. H0 자체 회귀 `tests/test-h0.cjs`, Hosted/Standalone × PC/모바일 `tests/browser-h0-smoke.py` 및 로컬 세이브 검사기 `local-validator-h0.html` 추가.

## 안전성 원칙 및 유보한 사항

- H0에서는 경제·식량·Knowledge·자원 물리 재고·AI 정책·Person 신진대사·Formation 전투·기술 43개·RNG를 변경하지 않는다.
- V0.33 코드명이 있더라도 **현행 엔진**에서 실제 사용되는 함수·세이브 어댑터는 삭제하지 않았다.
- 구형 생활권 지도 레이어 및 V0.33C 지속 교전 UI는 각각 H1/H3에서 대체 UI 준비·연결 검사 후 제거한다.
- F0/F1 패널의 세계 탭 이동은 H3에서 한다. H0에서는 계측 호출·주기·수집·CSV 의미를 보존한다.
- 과거 H0 이전 저장파일을 가져와 현재 세이브로 저장하면 **새 저장 버전 표기(V0.34H0)**가 적용된다. 원본 JSON은 직접 변경하지 않는다.
- 실시간 상태창 변경은 기존의 성공 안내만 숨기는 1차 정리다. H3에서 UI 경고 시스템과 개발자 도구 전체를 통합할 예정이다.

## 파일/실행

- `index.html`: GitHub Pages 등 호스팅용 (같은 ZIP의 `dist/hosted/assets/`가 필요)
- `index-standalone.html`, `dist/standalone/index.html`: 오프라인 단일 HTML
- `local-validator-h0.html`: 큰 저장파일을 브라우저 내부에서 불러와 검사
- `src/`, `tools/`, `tests/`, `docs/`: 소스 및 검증 파일
- 빌드: `node tools/build.mjs` / SHA만 검사: `node tools/build.mjs --check-only`
- 정적 의존성 갱신: `node tools/h0-audit.mjs`
- 집중 회귀: `node tests/test-h0.cjs && node tests/test-g5.cjs && node tests/test-build.mjs && node tests/test-csv.mjs`
- 브라우저 스모크: `python tests/browser-h0-smoke.py` (Chromium + Playwright 필요)

※ 일부 과거 버전 전용 테스트(예: `test-f0.cjs`)는 현재 최신 버전이 아닌 과거 버전 문자열을 기대한다. 해당 단독 테스트는 기존부터 최신 G5에서도 그대로 실행하는 형태의 버전 비교에 부적합하며, 현재 최신 기능은 `test-h0.cjs`와 `test-g5.cjs`에서 검증한다.
