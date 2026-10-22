# V0.35G1A 검증 (2026-10-23)

## PASS

- `npm run build`: V0.35G1A standalone + hosted + GitHub Pages 루트 생성; 보호 C1H 169 블록 SHA `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` 보존; 기술 43개, CSV 1,683열.
- `node tests/test-35g1a.cjs`: 단 두 계수 변경, 지역 상한 고정, 기본 3일 주기 2.4/3.0, 건축가 포함 9.0, 토지정비 기본 0.55, 토지정비 건축가 ×3.0, 기존 G1 세이브 → G1A 이관, 기존 로컬 키 폴백, 신규 세이브 키, Devlog 계수 확인.
- `node tests/test-35g1.cjs`: 무인력 신축/개축, 건축가 ×3.0, 일반 공사 물리 진척, 토지정비, 90일 자연주행, D1/D2 Settlement 감사, 세이브 왕복, 텔레메트리 PASS.
- `V35G1_DAYS=360 node tests/test-35g1.cjs`: 360일 자연주행 PASS.
- 기존 개별 회귀: `test-35f1`, `test-35f`, `test-35e`, `test-build`, `test-csv`, `test-g2a-reserve`, `test-g3b`, `test-g4a1`, `test-h2a`, `test-h4b`, `test-h4b-storage`, `test-h4b-border`, `test-h4c`, `test-35a`, `test-35b` PASS.
- 구형 `test-35g-labor`는 G1에서 제거한 Person 직접 건설 노동을 검사하므로 SKIP(기존 명시적 스킵 규칙 유지).

## 제한 / 미검증

- `npm test` 일괄 실행은 환경의 장시간 실행 제한으로 완주하지 못했으나, 위 명시한 하위 테스트는 각각 PASS를 확인했습니다. 일괄 PASS로 보고하지 않습니다.
- 실제 PC/모바일 Chromium 브라우저 UI 실행, 사용자 29년 G1 원본 세이브의 동시점 전후 비교, 25년 이상 G1A 자연주행 및 SIM/Wall 개선은 미검증.
