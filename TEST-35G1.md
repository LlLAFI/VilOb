# V0.35G1 검증 결과 (2026-10-22)

## PASS

- `npm run build`: standalone/hosted 생성, 보호 레거시 169블록 SHA, 기준선 재구성 SHA, 기술 43개·CSV 1,683열 유지.
- `node tests/test-35g1.cjs`: G 세이브 이관; 가상 건설력으로 무인력 진행; 건축가 전용 ×2.5 효과; 토지정비 기본 진행; 90일 자연주행; D1/D2 감사; G1 세이브 왕복과 파견 상태 지속; 진단 출력 PASS.
- `V35G1_DAYS=360 node tests/test-35g1.cjs`: 360일 자연주행 및 위 회귀 PASS.
- `npm test`: `test-35g1`, `test-35f1`, `test-35f`, `test-35e`, build, csv, g2a-reserve, g3b, g4a1, h2a, h4b/storage/border, h4c, 35a, 35b PASS. 과거 V0.35G 전용 실제 일반 노동배정 테스트는 G1에서 기능이 제거되어 명시적 SKIP(대체: `test-35g1`).

## 아직 수행하지 않은 것

- 25~75년 실제 브라우저 자연주행 및 사용자 38년 세계 동일 상태 비교.
- PC/모바일 Chromium 페이지 자동 UI smoke: 테스트 컨테이너에서 file://와 localhost 모두 ERR_BLOCKED_BY_ADMINISTRATOR로 거부.
- G와 G1의 장기 SIM/Wall 정량 비교. 건축가 파견·인구 증가 후 실제 성능 개선 폭은 미측정.

## 사용자 검증 추천

G1 새 세계 기본 7개국으로 25년 자연주행. 25년 시점 G1 JSON + 기존 G 공사별 CSV + Snapshots CSV + Devlog JSON을 전달하고, 문제 없으면 40~60년으로 확장. 가능하면 시드와 성능 패널도 함께 보존.
