# V0.35H0 검증 내역

## PASS

- H0 이주 BFS 거리 완전 일치: 19×19 자연 지도 200개 질의, 다중 국가 허용 조건 두 종류 → BFS 2회 + 캐시 198회.
- G1B/H0 독립 엔진 동일 RNG 90일/180일 세계 상태·RNG parity PASS.
- G1B 2단계 국제 이주 수용·거절·귀환, 행복도, 인구 및 G1B 세이브 이관 PASS.
- 360일 단일 H0 세계 자연주행 & D2/D2A 구조·주거 감사 PASS.
- G1A 기본 건설력·건축가 수치, 토지정비 기존 수치, 기술 43 PASS.
- 보호 169블록 baseline 재구성 SHA256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` PASS.
- CSV 1683열, hosted/standalone script tag 219, GitHub Pages index 빌드 PASS.
- PC/모바일 Chromium 렌더/버전/진단 버튼/JS 오류 0 PASS.
- 개별 회귀: G1B, G1A, G1, 35F1, 35F, 35E, G2A reserve, H2A, H4B, H4C, 35A, 35B, build, CSV PASS (전부 동일한 최신 버전 문구를 쓰도록 조정).

## 별도 재검증 필요

- 단일 일괄 `npm test`는 현 실행환경 타임아웃으로 완료하지 못했음. CI에서 재실행 권장.
- G1B/H0 동시 360일 상태 전체 비교는 실행시간 제한으로 미완료(180일 PASS, H0 단독 360일 PASS).
- H0 62년 실제 세이브 A/B 및 PC 1~150년 배치 목표 아직 평가 불가.
- 경로 전용 4.8× 향상은 19×19 **합성 그래프 미시 벤치마크** 결과로, 전체 시뮬레이션 속도 향상 주장에 사용할 수 없음.
- 브라우저 실제 파일 저장/진단 JSON 다운로드 클릭과 30~60년 사용자 실주행은 별도 확인.
