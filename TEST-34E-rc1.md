# V0.34E-rc1 검증 내역

## 실행 완료

- `npm run build` PASS: 독립 실행 / Hosted 파일 출력, C1H 169 레거시 원본 블록 원본 SHA 일치
- `node tests/test-e01.cjs` PASS: 동일 시드 15일 자원/인구/금고/영토 요약·RNG 28,845회 일치, 계측 5일 종료 후 기존 프로토타입 함수 복원, 수동 중지, B3B↔E 저장 호환, 공동 재고 감사 PASS, Food Flow 48열
- `node tests/test-build.mjs` PASS: 182 스크립트 / 4 CSS, 1683열 CSV 스키마
- `node tests/test-csv.mjs` PASS: 1683열·중복 72열 명칭 정상
- `node tests/test-d3.cjs` PASS: 공동 재고/공동 물리 자원 기본 회귀
- `node tests/test-d3a.cjs` PASS: 수확·Food Flow 회계 기본 회귀
- `node tools/benchmark-save.cjs --days 15 --runs 3` PASS: B3B↔E 새 월드에서 의미상 상태·난수 호출 지문 일치; 성능 측정용 기준 장치/시드 아님
- Chromium `page.set_content(standalone)` PC(1280×850), 모바일(393×852)에서 E-rc1 버전·세계 성능 패널 확인, 3일 선택형 계측 자동 중단 및 함수 복구, JS 오류 0

## 완료했다고 주장하지 않는 시험

- **실제 61년차 B3B 세이브 A/B:** 저장파일 미첨부로 미수행
- **브라우저에서 실제 file:// 및 http:// URL 탐색:** 브라우저 자동화 환경의 `ERR_BLOCKED_BY_ADMINISTRATOR`로 미수행. 페이지 콘텐츠를 직접 적재한 Standalone 기능 시험은 PASS, Hosted는 정적 빌드·구문 검사만 PASS
- **전체 장시간 npm test:** 미완료. 기존 테스트 다수가 현재 버전 문자열을 고정하고 있던 부분은 업데이트했으나, 일부는 긴 자연주행으로 시간제한 초과
- **실제 60년차 SIM 20~30% 성능 개선:** 이 RC에는 알고리즘 최적화가 없어 미확인

## 다음 작업

실제 세이브가 들어오면 `node tools/benchmark-save.cjs --save ... --days 30 --runs 5`로 기준선 확보 → `--profile`로 상위 독점 시간 확인 → E-02 고비용 레거시 함수 제거/통합 후보 선정.
