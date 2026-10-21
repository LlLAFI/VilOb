# V0.35D 최초 화면 버전 배지 수정 (UI only)

- 문제: 첫 로드 완료 직후 좌상단 `Village Observer · V0.35B` 및 페이지 제목이 35B로 표시됨. `VSim.RELEASE_VERSION` 및 `World.serialize().version`은 이미 35D였음.
- 원인: 35B 스크립트는 부트스트랩 즉시 배지를 35B로 갱신하지만, 35C/D는 헤더 재렌더가 일어날 때에만 최신 배지를 출력함.
- 조치: 35D 부트스트랩이 끝날 때 즉시 최신 버전 뱃지·제목을 갱신. 35D Hosted 자산 URL 캐시 식별자 변경.
- 호환성: 35D 버전/세이브 키 변경 없음. 기존 시뮬레이션·RNG·경제 동작 변경 없음.
- 브라우저 테스트: Standalone/Hosted × PC/모바일 초기 로드 및 하루 진행 후 4/4 PASS.
- 배포: 전체 소스 ZIP을 GitHub Desktop에 반영하거나 새 Standalone index-standalone.html을 사용.
