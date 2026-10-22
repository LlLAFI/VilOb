# V0.35G — 검증 기록 (2026-10-22)

## 빌드 / 회귀

- `npm run build`: PASS. 보호 C1H 169블록(165 script / 4 style) SHA-256 불변, CSV V2 1683열, Generated Hosted/Standalone 정상.
- `npm test`: PASS 16/16 (추가 G 노동 검증 포함). 기존 F1 주택 제한, 식량·물자, H4C 물류, AI 기본 프로필 및 원형 데이터 테스트를 유지.
- `node tests/test-35g-labor.cjs`: PASS 6가지 통제 시나리오 — (1) 현장 주민 0+동일 Settlement 주민1 공사 배정, (2) 다른 Settlement 주민 차단, (3) 동일 Person의 다중공사 방지, (4) 유지보수/현역 군인/개척자 보호, (5) 노동이 실제 투입된 프로젝트 완공, (6) 노동 없는 공사 진척 0.
- `V35G_DAYS=91 node tests/test-35g-natural.cjs`: PASS. 35F1 세이브를 G로 이관, 91일 자연주행, 정착지/주거 감사 PASS, G JSON save/load/7일 후속 주행 PASS. 자연주행은 합성 초기 19x19 세계 기준.
- `python tools/browser-35g-smoke.py`: Hosted/Standalone × PC1440/모바일390 4/4 PASS. 최초 배지 V0.35G, 기술 43, 세계·지도·통계·성능·35G 출력 버튼 확인, 페이지 예외 0건.

## 제한 사항

- 52년 실제 세계의 원본 세이브가 제공되지 않아 장기 정체 공사의 수치적 회복률은 아직 미검증.
- 90~150년 스트레스 성능(10배속 Wall), 계측 OFF 동일 세이브 A/B 절감률은 미검증. G의 AI/세계 상태 및 RNG는 35F1과 달라질 수 있다.
- 토지정비는 설계상 타일 노동 진행을 그대로 보존한다. 이번에는 부재 원인만 기록하며, 통합 공유 인력 배정은 G1 후보.
- 진단용 프로젝트별 CSV는 정규 Snapshots CSV 1683열에 추가된 열이 아니라 별도 파일이다.
