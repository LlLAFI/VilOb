# V0.34G3A 검증 계획·결과

## 자동 회귀
- C1H 원본 블록 SHA 보존, 스크립트 195개, CSS 4개, Snapshot V2 1,683열.
- G2A 공급원 재고 보호·대체 공급원·경로 차단·식량 보존.
- G3 원형 반경 R3=29, R4=49, 경로 기반 병합·분할 및 기아 임박 구호 통제.
- G3A Devlog 연속 조회 후 G3 정책 카운터 무변화; G3A 로컬 audit 읽기 전용; G3A/G3 동일 저장 상태 및 RNG 동등 주행.
- Standalone/Hosted PC·모바일 UI, 초기 버전·무결성 검사 표시.
- 오프라인 로컬 검증기: 실제 스키마 G3A 저장 상태를 업로드 UI에 선택, 30일 자동주행, JSON/CSV 다운로드.

## 남은 사용자 검증
- 실제 150MB JSON 파일을 이용한 Chrome/Edge 메모리·파싱·30일 주행.
- 61년 성숙한 세계의 실제 G3 공간 병합 및 심각 기아 상황, 성능·개발 로그 비교.
- GitHub Pages 운영환경의 G3A 새 배포 후 root/hosted 자산 로딩 및 CDN 캐시 확인.

## 보류 조건
- G3 공간 pathSweeps가 성장/병합 조건이 발생한 장기 실제 주행에서도 지속적으로 0이거나 무결성 경고가 발생하면 CLOSED 금지.
- 새로운 월드에서 특별 구호 0회는 실패가 아님; 통제 시나리오로만 즉시 검증 가능.

## 이번 빌드 실측
- `G3A_PARITY_DAYS=180 node tests/test-g3a.cjs`: PASS. 동일 G3 저장 상태에서 G3/G3A 세계 상태 및 총 RNG 호출 91,707회 일치.
- `G3_DAYS=720 node tests/test-g3.cjs`: PASS. 720일, 10개 활성 정착지, 배송 3건, 보호 비축·물리 보존 오류 0.
- `G3_DAYS=900 node tests/test-g3.cjs`: 약 873일 이후 지정 실행 시간 내 완료되지 않아 **미통과/원인 추가 검토**. 무결성 FAIL 이벤트가 보고된 것은 아니며 900일 PASS로 기재하지 않음.
- `tests/browser-g3-smoke.py`: Standalone/Hosted × PC/모바일 네 조합 PASS.
- `tests/browser-g3a-local.py`: G3 형식 JSON 불러오기 + 30일 실행 + 경량 JSON/CSV 내보내기 PASS (소형 1년 세계). 150MB 실물 세이브 검증 대기.
