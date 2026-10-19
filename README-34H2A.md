# Village Observer V0.34H2A — Settlement Core Abandonment Hotfix

기준선: `V0.34H2` 배포 오류 수정본. 날짜: 2026-10-19.

## 실제 로그에서 발견한 원인

2026-10-18 H2 85년 자연주행에서 델마의 `st-0000241`에 속했던 핵심 타일 `#104`가 83년 4분기 1일 정착지 병합 이후 83년 4분기 36일 `OUTPOST_ABANDONED`로 소유권을 잃었다. V0.34C `changeOwner`는 실제 타일 연결을 제거했지만 `disconnect`는 잔여 구성 타일이 연결되어 있는 경우 `coreTileId`를 갱신하지 않았다. 이로 인해 접근성 검사에서 옛 중심 타일을 참조한 뒤 분할 경로 `replaceGroup([r.coreTileId])`가 **중립 상태의 옛 중심 타일에 Settlement 링크를 다시 달 수 있었다.**

데이터상 마지막 오류: `TILE_LINK_MISMATCH` / `UNOWNED_WITH_LINK` 타일 `#104`, D1 `WRONG_TILE:104` / `TILES:1` / `RESOURCE:1:stone`.

## 실제 수정

- **핵심 인과관계 수정:** `tools/h2a-transform.mjs`가 기존 169개 보호 레거시 블록의 해시를 변경하지 않고 빌드 시 `src/legacy/154.js`의 `disconnect()`에 잔여 소유 타일로 중심을 재설정하는 가드를 추가한다. 기존 물리적 컴포넌트 분할 기능은 유지한다.
- **기존 H2의 고아 연결 저장 상태 호환:** `src/bootstrap/v034h2a.js`의 `NS.World.from` 외곽 전처리가 `map.tiles[].ownerId == null`이면서 ACTIVE Settlement `tileIds`/타일의 `settlementId`가 서로 같은 특정 형태의 고아 연결만 해제한다. 잔여 구성이 있으면 중심 재지정, 없으면 오래된 ACTIVE 항목을 `ABANDONED`로 퇴역시킨다. 기존 입력 객체를 직접 수정하지 않으며, 변경 내역은 `v034h2a.savedLegacyGhostRepairs`에 기록한다. **타일 ownerId·실물 재고·Gold·Person은 수정하지 않는다.** 무관한 손상이나 임의의 연결 오류는 자동으로 은폐/복구하지 않는다.
- 배포 버전, 패치노트, 헤더·SaveSystem 키는 `V0.34H2A` (`village-observer-v034h2a`)로 갱신한다. H2/H1/H0/G5의 정상 저장 파일 로드는 H2 체인을 통해 유지한다.
- 국가 H2 7탭과 지도 H1 경계, 43개 기술, 1,683열 CSV 규격, AI·전쟁·Person·RNG·재정·식량·건설 밸런스는 변경하지 않는다.

## 배포·테스트

- `npm run build` → `dist/hosted/` (GitHub Pages)와 `dist/standalone/index.html` 생성. ZIP의 최상위 `index.html`은 GitHub Pages용.
- `npm test` → 고정 시간 CI 스모크: source SHA, CSV, 물류·정착지 관련 기존 스모크, 새 `tests/test-h2a.cjs` (특정 오류 재현과 세이브 복구). 전체 종료 코드 0 확인.
- 별도 `node tests/test-h2a-parity.cjs` → **H2 ↔ H2A 같은 H2 세이브, 난수 상태에서 30일 13개 실제 상태 비교 PASS**.
- 별도 `G5_DAYS=30 node tests/test-g5.cjs` → 기술 43개 및 주요 감사 PASS.
- `python tools/browser-h2a-smoke.py` → Standalone/Hosted 자산 × PC/모바일 Chromium 4/4 PASS. 실제 GitHub Pages 네트워크 배포는 별도로 확인해야 한다.
- 기존 180일 G5 및 H1↔H2 장기 비교는 `npm run test:extended`로 분리했다. 이 실행환경에서는 전체 확장 검사의 최종 종료 코드 미확정.

## 이번 핫픽스 제외

- `STORAGE_OVERFLOW:st-0000356:stone`: 위 연결 오류와 다른 정착지에서 관측된 **용량 초과 경고**. 재고를 버리는 자동 보정은 실물 자원 보존을 훼손할 수 있어 변경하지 않음.
- 이미 저장된 85년 실제 사용자의 **원본 Save JSON 미제공**. 위 로그로 확인된 사례와 같은 구조를 인위적으로 재현해 통과했고, 실제 85년 원본 Save의 복원 검증은 별도 필요.
- 시드 전체 85년 재실행, 150년 자연주행, 사용자 실환경 GitHub Pages 수동 점검 미실시.

## GitHub Desktop 적용

프로젝트 ZIP을 풀어 저장소 최상위 파일들을 반영하고 GitHub Desktop에서 Commit → Push. `tests`와 `tools`, `src/bootstrap`을 함께 반영해야 GitHub Actions가 새 버전으로 빌드·검증한다. GitHub Actions `Build, verify, deploy Village Observer`에서 `build`/`deploy` 모두 성공 확인 후 사이트의 H2A 배지 확인.
