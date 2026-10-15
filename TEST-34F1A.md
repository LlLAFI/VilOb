# V0.34F1A 검증 보고서

## 실행/환경
- Node.js v22.16.0, Chromium `/usr/bin/chromium` (Playwright `set_content` 방식).
- `node tools/build.mjs --check-only`: 보호 C1H 원본 SHA256 검증.
- `node tools/build.mjs`: Hosted / Standalone 동시 빌드.
- `node tests/test-build.mjs`: JS 185개, CSS 4개, CSV V2 1,683열.
- `node tests/test-csv.mjs`: 1,683열 구조·헤더 및 값 일치 확인.
- `F1A_DAYS=90 node tests/test-f1a.cjs`: PASS.
- `F1A_DAYS=180 node tests/test-f1a.cjs`: PASS.
- `F1A_DAYS=360 node tests/test-f1a.cjs`: 실행 제한 시간 초과로 **판정 보류** (PASS 아님).

## 결정론 회귀
각 버전은 별도 VM과 동일 결정론적 난수 상태에서 19×19 세계를 생성. F1 / F1A의 주민·국가·타일·전쟁·정착지 중요 직렬화 상태와 난수 호출 횟수 비교. 30일 간격으로 비교, 마지막 지점에서도 일치 확인 (90일/180일).

## 관측 분리 검증
- 국가 전체 저장상한을 강제로 낮춘 동일 F1/F1A 실험에서 게임 상태가 일치한 채 신규 `legacyOverflowFoodSpent`가 증가.
- 이 진단값은 기존 D3A `otherWithdrawn`에 포함되어 별도 중복 비용으로 차감되지 않음.
- 다른 국가가 임시 점령한 타일에서는 `NS.V034D3.members(v,tileId)`가 null을 반환하여 물류 접근 차단 유지.
- 그 타일 출납의 관측 장부만 원래 `st-N`로 일치; `tile-N`에 중복 계상하지 않음.
- 강제 점령 테스트는 **일상 물류 재현 회귀**이며 실제 55~56년 키오↔티아 전쟁 전체 재현은 아니다.

## 저장 및 브라우저
F1A 자체 저장/복원, F1 저장파일 가져오기·물리 재고 감사 PASS.
PC Chromium 1440×900 및 모바일 Chromium 390×844: `V0.34F1A` runtime, F0 성능 패널, F1 생존 진단 패널 표시, pageerror 0건.

## 남은 검증
- 사용자가 보유한 35년 F1 세이브의 60년 실물 재연 및 회계 이상 유형 제거.
- 높은 인구·장기 운영에서 추가 관측 비용과 PC ×10 SIM/BATCH 1000ms 목표 여부.
- 생존 판정(Hunger 100·Health 0), 식량 손실 정책 중복은 변경하지 않았음.
