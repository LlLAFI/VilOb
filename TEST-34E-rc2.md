# V0.34E-rc2 검증 기록

- `node tools/build.mjs` — PASS (Standalone/Hosted 빌드, 원본 C1H 재조립 SHA 일치)
- `node tests/test-build.mjs` — PASS
- `node tests/test-csv.mjs` — PASS (기존 1683열)
- `node tests/test-e02.cjs` — PASS. 61년 설정 합성 세계 180일, 상태·난수 일치, 자동 Snapshot 횟수 B3B=RC2, 수동/시나리오 캡처 정상, 수동 이벤트 보존, 저장 왕복 및 물리 재고 감사.
- `node tests/benchmark-e02-event.cjs` — PASS. 오래된 `MANUAL_NOTE` 1건과 최근 이벤트 1만 건, 이벤트 350건 추가, 보존 건수 동일, 기록 경로 109.13 → 38.39ms (단일 스트레스 측정).
- `node tools/benchmark-save.cjs --synthetic-year 61 --synthetic-extra-people 450 --days 30 --runs 2` — PASS. 약 561명, 초기·최종 주요 월드 상태 및 RNG 일치, 119.531 → 112.946ms/일; 실물 세이브 검증 아님.
- `python tests/browser-e02-local.py` — PASS. Chromium 브라우저, 1.15MB 새 월드 세이브 파일 선택, B3B/E-rc2 HTML 교차 로드, 30일씩 실행, 동등성 true, JS 오류 0.
- 61년차 **실제** 135MB 세이브는 도구 환경에 제출되지 않았으므로 미검증.
- 전체 `npm test` 장시간 연속 회귀와 모바일의 135MB 실제 세이브 처리 미검증. 개별 핵심 검증만 PASS 표기.

**중요한 회귀 발견과 조치:** RC2 초기 실험에서 자동 Snapshot 빈도 감소 후 세계/RNG 회귀가 발견되어 해당 변경을 최종 코드에서 제거했습니다. 최종 RC2는 B3B Snapshot 빈도를 유지합니다.
