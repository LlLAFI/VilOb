# Village Observer V0.34F2 — Unified Person Lifecycle V1

기준선: V0.34F1A1. 모델의 **실행 순서를 변경**하는 패치. 데이터 진단 전용 F1A1과 달리 RNG/주행 결과의 동일성은 요구하지 않는다.

## 목적
- 3일 생활주기: **모든 Person의 작업·생산 → Settlement 공동 배급 → Person별 신진대사 1회**.
- 매 달력일 `dailyDemography24()` 도입부에서 기아 12일 유예를 통일 판정한다. 더 이상 직업·전상자별 `Person.act()` 실행 경로에 의존하지 않는다.
- F0의 Hunger, Energy, Health, Happiness 수치식과 기본 0.30/0.42 수요, 군인 1.09 배율, 기존 분배 가중치 유지. 건강 중복 페널티/행복도 단일 목표값 정리는 후속 **F3**로 이관한다.

## 변경된 기술 구조
1. `src/bootstrap/v034f2.js`가 `Village.dailyTick`의 외부에서 F2 생활주기 경계를 소유한다. 기존 농업·산업·건설·시장 작업은 그대로 실행되며 `Person.metabolism` 호출은 ‘worked 플래그’만 수집한다. 기존 작업이 모두 끝난 다음 F0 공동 배급과 기존 `survive`를 모두에게 정확히 한 번 적용한다.
2. 전상자에게 남아 있던 별도 0.28 식량 인출 및 Hunger 갱신을 제거한다. 전상자도 같은 배급·상태 갱신을 적용하고 별도 휴양 에너지 +2, 건강 +0.05는 유지한다.
3. `tools/f2-transform.mjs`은 **보호된 기존 소스 파일을 바꾸지 않은 채 빌드된 코드에서만** V0.25 기아 사망 함수와 B4 기아 타이머 중복 호출을 F2 사용 시 비활성화한다. `dailyDemography24` 시작 부분에 공통 `dailyStarvation`을 호출한다.
4. 기존 V0.30B3의 12 **달력일** 기아 유예, Hunger 95 미만 회복 시 타이머 초기화, 기존 기아 사망 통계와 장비 반환 흐름을 유지한다.
5. F0 Settlement 주거 스트레스는 `V034D2.capAt`을 통해 건물 상태 70 이하의 물리 수용량 감소를 반영한다.
6. 국가 비축일 및 최저 지역 비축일은 **물리적 타일 식량을 한 번씩만** 합산하고 실제 연령·군사 수요를 분모로 계산한다. 출산의 로컬 비축 판단도 `settlementReserveDays()`를 참조한다. 점령 타일은 국가가 사용할 수 없는 재고로 취급한다.
7. `v034f2` 진단 필드: `completedCycles`, `aliveProcessed`, `duplicateMetabolismRequests`, `fallbackMetabolism`, `woundedMetabolism`, `dailyStarvationChecks`, `graceStarts`, `graceDeaths`, `missingHomes`. 모두 관측값이며 생존 규칙을 변경하지 않는다.

## 주의 및 남은 과제
- **모델 변경**으로 F1A1과 세계·RNG 결과가 달라지는 것이 정상이다. F2 내부 동일 시드 재현성과 저장파일 복원 일관성을 확인해야 한다.
- 기존 Hunger와 Health의 중복 영양 페널티, Happiness 중복 회귀, Health 0의 생존 의미는 **아직 해결되지 않았다**. 차기 F3 설계 항목이다.
- F1A1에도 나타나는 일부 Food Flow 30일 기간 경계의 **동량 양·음 잔차**가 F2 테스트에서도 남아 있다. 이 현상을 F2가 해결했다고 주장하지 않는다.
- 기존 35년 사용자 F1 세이브 자체는 24MB 업로드 제약으로 이 환경에서 실행하지 못했다.
- **PC ×10 / 150년 SIM/BATCH <1000ms 목표 미검증**. 360일(게임 1년) 통제된 Node.js 주행은 자연주행 성능 최종 목표를 대체하지 못한다.
- F2와 F1A1은 저장·불러오기가 가능하나 과거 저장파일의 모든 예외 데이터를 대상으로 검증한 것은 아니다.

## 소스·실행
- 단독 실행: `dist/standalone/index.html` (또는 배포용 `index.html`)
- GitHub Pages: 루트 `index.html` + `dist/hosted/assets/` 그대로 업로드
- 빌드: `npm run build`
- 보호된 C1H 원본 해시·1,683열 CSV: `npm test`
- F2 통제주행: `F2_DAYS=360 node tests/test-f2.cjs` (Windows에서는 환경변수 설정에 맞게 실행)
- PC·모바일 브라우저 초기화: `python tests/browser-f2-smoke.py` (Chromium/Playwright 필요)

## 사용자 자연주행 권장
- **새 F2 세계 또는 F1A1 세이브를 F2에서 새 이름으로 복사해 재개**. F1A1 원본 세이브는 반드시 보존.
- 15~30년 단위로 Snapshot CSV·Food Flow CSV·Devlog JSON 및 저장파일을 생성.
- 검사: 모든 생존자 처리 횟수, 기아 사망, 식량 배급 미수령률, Health/Hunger, F1A 회계 잔차, ×10 SIM/BATCH.
