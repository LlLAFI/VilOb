# Village Observer V0.34F0 — Performance Architecture V1

**일자:** 2026-10-14  
**기준선:** V0.34E-rc5 시뮬레이션 (RC6 `ensureNation29()` 변경 미포함)  
**최종 성능 목표:** PC ×10 자연주행, 1~150년 전 구간, 인게임 평활 `SIM/BATCH < 1000ms`  
**현 판정:** F0 1차 모델 구현 및 짧은 자연주행 검증 완료, 150년 목표 **미검증**.

## 1. 신규 모델: Settlement Ration B

기존 개인별 `Person.metabolism()`은 기본 식량 .25/.36과 별도 추가 식량 .05/.06을 소비하고, 주민마다 `Village.withdrawAt()`을 호출했다. F0는 위 수요를 **정착지 단위**로 통합하고, 원래 다중 타일 경제권(`V034D3.members`)의 물리적 재고를 한 번 인출한 뒤 개인별 배급분을 결정한다.

- 아동 기본 수요 0.30, 성인 0.42. 경비·군사 관련 상태에 1.09배 수요 (신규 설계값).
- 식량이 충분하면 수요만큼 지급, 부족하면 연령·노약·건강·직무·군사 가중치를 반영한 결정적(weighted capped-waterfill) 차등 배급.
- `v.v034f0RationPolicy`를 `BALANCED` (기본), `CHILD_FIRST`, `WORK_FIRST` 중 하나로 정하면 정책 가중치 변경. 첫 버전에서는 AI 정책 선택·게임 UI는 아직 없음.
- 개인 `hunger`, `energy`, `health`, `happiness`, `happinessTarget`, `housingStrainDays`, 기아 기준 연속 추적은 계속 사용. 부족량의 정도에 따라 식사 효능과 건강 저하가 연속적으로 변한다.
- 과밀의 공동체 판단은 한 Settlement에서 주택 수용량을 한 번 산출하고, 주민별 주거 스트레스에 적용한다. 기존 복잡한 개인별 관계·이웃·위치 행복 목표 계산은 F0에서 축소했다.
- 생존·사회·국가 발전의 수치는 RC5와 달라질 수 있다. 새 신진대사 모델은 **게임 규칙 변경**이므로 동일 RNG·상태 지문을 성공 기준으로 사용하지 않는다.

### 식량 회계

`Village.withdrawAt()`을 통해 진짜 식량을 인출한다. D3A의 식량 흐름 관측에 새 배급을 `mealRequested`/`mealReceived`로 재분류한다. 실제 개인 공급은 F0 보고서의 `consumed`로 별도 기록하며, 드물게 배급 후 미소비가 발생하면 실제 재고에 반환하여 물리적 보존식을 유지한다. 이 경우 레거시 `mealReceived`는 당일 예약·인출량을 포함할 수 있으니 순수 섭취량은 F0의 `consumed`를 확인한다.

## 2. 150년 ×10 성능 기록

인게임 배치마다 `world._v26Perf.simMs`의 **평활 SIM/BATCH**를 관측한다. ×10 이외 배속은 공식 목표 통계에 섞지 않는다.

기록: 연도, 배치 수, 평활 SIM/BATCH 평균·최고, 1000ms 이상 배치 횟수, 인구, Settlement 수. `NS.V034F0.performanceReport(world)` 또는 인게임 `F0 · 150년 성능 목표`의 **×10 성능 기록 JSON** 버튼으로 조회·내보내기. 저장/불러오기를 거쳐 기록 유지.

`SIM/day`와 직접 동일시하지 않으며, 기존의 회차별 단발성 PC 벤치마크는 비교 참고용이다. **150년 전체 구간의 실제 PC ×10 자연주행은 아직 실행하지 않았으므로 합격으로 보고하지 않는다.**

## 3. 호환·보존 범위

- RC5 및 현재 F0 저장파일 복원. F0 저장파일의 성능 기록 및 정착지 배급 정책 복원.
- RC6의 `ensureNation29()` 변경은 가져오지 않는다. RC6의 실제 HTML 버전 인식 기능만 별도 `benchmark-local.html`에 반영했다.
- 기존 C1H 보호 레거시 169블록 SHA 보존, CSV V2 1,683열, Hosted 및 Standalone 제공.
- F0 모델은 기존과 수치가 동일하지 않으므로 RC5↔F0 브라우저 A/B의 RNG·최종 지문 불일치는 *예상된 모델 차이*다. 다만 시작 세이브 복원 일치 검사는 유지한다.

## 4. 실행·테스트

```bash
npm run build
npm run test:static
npm run test:f0
F0_DAYS=360 node tests/test-f0.cjs
```

브라우저 로컬 비교에는 `benchmark-local.html`, 이전 버전으로는 동봉된 `index-RC5-baseline.html`, 후보로는 `dist/standalone/index.html` 또는 별도 제공되는 `index.html`을 사용한다.

## 5. 남은 문제

1. 실제 61년차 대형 실물 세이브 성능 A/B, 그리고 PC ×10 150년 장기 자연주행 필요.
2. 360일 시험에서 식량 Food Flow 미설명 잔차 5건(총 -3.573467)이 남았다. 같은 시드에서 **기존 기준도 5건(-3.523240)**이므로 F0 신규 회계 이상이라고 단정하지 않는다.
3. 주민 간 복잡한 사회관계 기반 행복 목표가 감소한 영향을 중기 인구·행복·사망 데이터로 점검하고 F1에서 보정 여부 결정.
4. 신진대사 B안만으로 SIM/BATCH 목표에 도달할지는 아직 알 수 없다. Snapshot, 분기·군사·AI 연산 병목은 F2~F4에서 별도 조사.
