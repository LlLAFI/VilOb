# V0.34G3B 검증 기록

- C1H 보호 레거시 169블록 재구성 SHA256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`: PASS (원본 불변)
- Source/Hosted 196 JS tags, CSS 4, Snapshot CSV 1683컬럼: PASS.
- G2A 보호 배송·대체 공급원·재고 보존: PASS.
- G3 원형 반경 및 G3A 역사적 기준선 회귀: PASS (별도의 이전 빌드로 검증).
- G3B 직결 1타일 .62 허용, 비포장 1.00 허용, 도로 2타일 1.24 거절, 편도만 되는 경로 거절, 손상도로 비포장 처리: PASS.
- 기존 G3 split: R2 1.40 / R4 4.69 유지: PASS. 구버전 G3A 세이브 정상 불러오기: PASS (소형 검증).
- G3B 정착지·식량·중복 신진대사·스냅샷/DEVLOG 관측 순수성: PASS.
- 신규 자연주행 360일, 90일 간격 점검, 정착지·물리 재고 오류 0, 보존 오류 0: PASS. 단 360일간 정착지 병합 0회여서 장기 병합 성공은 **통제 실험**에서만 검증되었다.
- Chromium Standalone/Hosted × PC 1440×900 / 모바일 390×844, 화면 최초 G3B 버전 표시 및 8개 무결성 체크: PASS.
- 로컬 검증기 Chrome 30일, G3A 세이브 import/진단 JSON·CSV 다운로드: PASS (소형 저장파일).
- **사용자의 원본 159MB 세이브로 재주행:** 미검증 (원본은 사용자 PC에 있음).
- 실제 GitHub Pages URL 원격 배포 상태: 사용자 배포 후 검증 대기.
