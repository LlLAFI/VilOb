# V0.34D0 패치노트 — Multi-file Foundation & Regression Baseline

## 변경사항

1. V0.34C1H의 **JavaScript 165개, CSS 4개**를 원본 내용과 상대 순서를 변경하지 않은 채 `src/legacy/`, `src/styles/`로 분리합니다.
2. `manifest.json`으로 파일 순서, HTML 태그 및 SHA-256을 관리합니다. 원본 C1H 단일 HTML의 바이트 동일성을 빌드 단계에서 먼저 검증합니다.
3. `tools/build.mjs`가 두 배포물을 생성합니다: `dist/hosted/`(외부 파일), `dist/standalone/index.html`(독립 실행형). 프로젝트 루트의 `index.html`은 GitHub 저장소 구조를 유지하는 Hosted 진입점입니다.
4. 새 D0 부트스트랩이 버전 표시·패치노트·저장 키를 V0.34D0로 지정합니다.
5. Devlog 패널에 **스냅샷 CSV V2**를 추가합니다. 기존 Legacy CSV도 그대로 제공하며, V2는 1,683열의 중복 헤더 72개에 대해 구별되는 이름을 부여합니다. 데이터 행의 내용과 순서는 변경하지 않습니다.
6. 노드 기반 재조립·해시·문법·CSV·결정론 검증을 `npm test`로 실행하고, GitHub Actions에 빌드·검사·Pages 배포 파이프라인을 추가합니다.

## 변경하지 않는 부분

생산/경제 공식, AIProfile 점수, World/Person/Settlement 실체, 지도·전쟁·장비·Gold 물리, 난수 소비, 분기 작업 순서, C1 계열 성능 캐시·프로파일러 등 모든 기존 시뮬레이션 규칙.

## 세이브 정책

D0 세이브만 정식 지원합니다. 이전 세이브를 위해 구형 코드 구조나 별도 동작을 유지할 의무를 두지 않습니다. C1H 내부 코드 래퍼는 실행동등성 검증을 위해 초기 D0 추출 단계에 보존했으며, 차기 D1 이후 필요 없는 호환 계층은 제거할 수 있습니다.

## 알려진 제한

- Hosted 빌드는 실행 경계 유지를 위해 아직 165개 외부 JavaScript를 순차 요청합니다. 초기 로딩 최적화는 안전한 결합 검증 이후의 과제입니다.
- CSV V2의 `global.` / `nation.` 명칭은 C1H 원본의 두 집계 집합 위치에 기반합니다. 위치별 전체 매핑은 JSON을 신뢰 가능한 기준으로 사용합니다.
- 96일 연속 시뮬레이션 비교와 실제 GitHub Pages 배포의 네트워크 검증은 이번 환경에서 완료하지 못했습니다.
