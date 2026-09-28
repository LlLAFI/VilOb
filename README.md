# Village Observer V0.32E10

**패치명:** Hunger Homeostasis + Maintenance Performance  
**기준 버전:** V0.32E9  
**날짜:** 2026-09-28

V0.32E10은 14×14 장기 자연주행에서 아렌이 1명까지 감소한 뒤, 정착지에 수백 일분의 식량을 보유하고 식량을 해외에 판매하면서도 유일한 주민의 Hunger가 60~80대에 장기간 머문 사례를 계기로 만든 생존·성능 안정화 패치다.

이번 패치의 우선순위는 다음 세 가지다.

1. 충분히 먹는 Person의 Hunger가 정상 범위로 되돌아오지 않던 장기 생존 로직 수정
2. 분기 유지보수 finalization의 반복 donor/route 계산 최적화
3. E9 seasonal `unattributed` 시간을 유지보수 finalize / 새 plan 작성 / 나머지 legacy 처리로 추가 분해

E9에서 수정한 Merchant Guild endpoint 상속, Guild handling saving, Grand Market regional specialization, Proposal blocker 세분화, Garrison/Field roster invariant는 그대로 유지한다.

---

## 1. Hunger Homeostasis

### 문제

V0.27 이후 실제 로컬 식사 경로에서는 Person이 행동할 때 Hunger가 먼저 약 `+5~8` 증가하고, 식사에 성공하면 다시 약 `-5~8` 감소한다.

기댓값만 보면 다음과 같다.

```text
행동 Hunger 증가 평균  +6.5
식사 Hunger 감소 평균  -6.5
--------------------------------
평균 순변화             약 0
```

따라서 식량을 계속 정상적으로 먹어도 이미 높아진 Hunger를 낮은 정상 범위로 되돌리는 장기적인 복원력이 없었다.

초기 로직에는 식사 후 Hunger를 약 22 방향으로 조금씩 되돌리는 homeostasis 항이 존재했지만, 로컬 재고 기반 식사로 전환되는 과정에서 빠졌다.

### E10 수정

기존 행동/식사 변동은 그대로 유지하고, **식사 성공 후에만** 다음 항을 추가한다.

```js
hunger += (20 - hunger) * 0.05;
```

즉:

- 목표 Hunger: `20`
- 식사 1회당 목표값 방향 회복률: `5%`
- 기존 `+5~8` 행동 증가 유지
- 기존 `-5~8` 식사 감소 유지
- 결식 및 부분결식 패널티 유지
- Hunger 100의 12 calendar-day starvation grace 유지

높은 Hunger에서는 빠르게 회복하고, 20에 가까워질수록 변화량이 자연스럽게 줄어든다.

예시:

```text
식사 직후 Hunger 80 -> 추가 -3.0
식사 직후 Hunger 60 -> 추가 -2.0
식사 직후 Hunger 40 -> 추가 -1.0
식사 직후 Hunger 25 -> 추가 -0.25
식사 직후 Hunger 10 -> 추가 +0.5
```

따라서 식량이 충분한 주민은 장기적으로 20 부근을 중심으로 흔들리고, 실제 결식이 이어지는 경우에만 높은 Hunger가 유지·상승한다.

---

## 2. 식사 telemetry

E10은 Person hot loop에 `performance.now()`를 추가하지 않는다. 기존 식사 코드가 이미 얻는 `got` 값을 재사용하여 정수/누적값만 기록한다.

세계 및 국가별로 다음 값이 추가된다.

- `hungerMealAttempts32E10`
- `hungerMealSuccesses32E10`
- `hungerMealFailures32E10`
- `hungerFoodConsumed32E10`
- `hungerRecoveryApplied32E10`

`hungerFoodConsumed32E10`은 기본 식사량과 V0.29에서 추가된 식량 요구량을 합산한다.

이를 통해 이후에는 `Hunger가 높다`는 결과만 보지 않고 실제로 그 주민들이 **먹었는지 / 못 먹었는지**를 직접 확인할 수 있다.

---

## 3. FOOD_ACCESS_PARADOX invariant

Hunger 공식 자체를 고쳐도 이후 다른 물류·재고 회귀가 생길 수 있으므로 별도 생존 invariant를 추가한다.

분기 평가 시 각 유인 정착지에 대해 다음 조건을 검사한다.

```text
현지 식량 비축 >= 30일
AND
해당 정착지 주민의 max Hunger >= 70
```

이 상태가 분기 사이에서도 이어져 약 90 calendar-day 이상 지속되면 다음 이벤트를 기록한다.

```text
FOOD_ACCESS_PARADOX32E10
```

로그에는 다음 내용이 포함된다.

- 국가 / 정착지 타일
- 주민 수
- 현지 식량 재고
- 현지 비축일수
- 평균 Hunger
- 최대 Hunger
- 지속 calendar-day

국가별 snapshot/CSV에는 다음 값이 추가된다.

- `foodParadoxEvents32E10`
- `foodParadoxActiveTiles32E10`
- `foodParadoxMaxStreakDays32E10`

이 진단은 식량을 생성하거나 Hunger를 직접 수정하지 않는다.

---

## 4. 고 Hunger 정착지의 식량 수출 안전장치

아렌 사례에서는 주민이 높은 Hunger 상태인데 같은 단일 정착지의 식량이 해외로 계속 판매되는 역설도 관측됐다.

E10은 국제 식량 거래 실행 직전에 판매 endpoint를 마지막으로 검사한다.

다음 두 조건이 동시에 충족되면 해당 식량 수출만 거부한다.

```text
판매 정착지 현지 비축 >= 30일
AND
판매 정착지 max Hunger >= 85
```

이 기능은 정상적인 식량 무역을 대체하는 정책이 아니라 **생존 invariant의 마지막 안전장치**다.

- 다른 자원 수출에는 영향 없음
- 다른 정상 식량 정착지에는 영향 없음
- Gold나 식량을 생성하지 않음
- 차단된 후보 뒤에 다른 거래 후보가 있으면 기존 autonomous trade 탐색이 계속될 수 있음

관측값:

- `foodExportGuardBlocks32E10`
- 이벤트 `FOOD_EXPORT_GUARD32E10` — 동일 타일은 로그 스팸 방지를 위해 최소 30 calendar-day 간격

Hunger homeostasis가 정상적으로 작동한다면 이 안전장치는 자연주행에서 매우 드물게 발동하는 것이 정상이다.

---

## 5. 유지보수 finalization donor cache

### E9 데이터에서 확인된 병목

후기 대국의 분기 1일 처리에서 `finalizeMaintenancePlan25()`가 수 초를 차지하는 사례가 확인됐다.

기존 흐름은 건물별 유지보수 자재를 확정할 때마다 `routeWithdraw25()`가 다음 작업을 반복했다.

1. 국가 영토 전체 donor 후보 열거
2. 각 donor의 내부 물류 capacity/path cost 조회
3. 유효 donor 정렬
4. 실제 재고 및 route capacity 범위에서 인출

한 타일에 여러 건물이 있을 경우 같은 `target settlement × resource` 조합에 대해 1~3을 반복했다.

### E10 수정

한 번의 quarterly finalize 안에서 다음 key로 donor 결과를 캐시한다.

```text
targetTileId × resource
```

캐시에는 donor의 정렬된 route/capacity 정보만 보존한다.

실제 인출 때는 매번 다시 다음을 확인한다.

- 현재 donor stock
- 해당 route에서 이미 사용한 capacity
- 남은 필요량

따라서 자원 보존과 기존 우선순위는 유지한다.

캐시는 `finalizeMaintenancePlan25()`의 로컬 `routeUse` 객체 안에서만 존재하므로:

- 다음 분기로 넘어가지 않음
- 도로/행정/기술 변화 뒤에 오래된 경로가 남지 않음
- save/load 데이터에 캐시를 저장하지 않음

### 신규 telemetry

- `maintenanceDonorCacheBuilds32E10`
- `maintenanceDonorCacheHits32E10`
- `maintenanceRouteEvaluations32E10`
- `maintenanceRouteEvaluationsAvoided32E10`

---

## 6. Seasonal Profiler V2

E9에서 전체 seasonal 비용의 대부분이 여전히 `perfSeasonalUnattributed32E9`에 남았다.

E10은 유지보수 병목을 직접 분리한다.

- `perfSeasonalMaintenanceFinalize32E10`
  - 직전 분기 유지보수 노동/자재 실적 확정
  - 건물 Condition 변화
  - 원격 자재 인출
- `perfSeasonalMaintenancePlan32E10`
  - 다음 분기의 새 유지보수 order/mission plan 구성
- `perfSeasonalLegacyOther32E10`
  - `E9 unattributed - E10 maintenance finalize - E10 maintenance plan`

Performance UI에도 이 세 값이 추가된다.

이렇게 하면 다음 자연주행에서 유지보수 최적화 후에도 남은 seasonal 비용이 실제로 얼마나 되는지 즉시 확인할 수 있다.

---

## 7. 검증

### JavaScript 정적 검사

`index.html`의 inline `<script>` 67개를 각각 `node --check`로 검사했다.

```text
67 scripts
0 syntax errors
```

### Chromium smoke test

로컬 Chromium에서 전체 HTML을 실행해 다음을 확인했다.

- 제목 / 버전 배지: `V0.32E10`
- `VSim.V032E10` 존재
- serialize version: `0.32E10`
- 최신 인게임 패치노트: `V0.32E10`
- page error / console error: 0

### Hunger 결정론 테스트

조건:

```text
성인 1명
시작 Hunger 90
현지 식량 100
Math.random() = 0.5 고정
30회 metabolism
```

결과:

```text
Hunger: 90 -> 35.0247
식량: 100 -> 87.4
실제 소비: 12.6
식사: 30/30 성공
Hunger recovery: 30회 적용
```

이는 `20 + (90-20) × 0.95^30 ≈ 35.0`과 일치한다.

반대 테스트:

```text
시작 Hunger 20
현지 식량 0
5회 metabolism
```

결과:

```text
Hunger: 20 -> 55.5
식사 성공 0
식사 실패 5
```

따라서 E10은 기근 자체를 약화시키는 것이 아니라 **먹었는데도 Hunger가 회복되지 않던 경로만 수정**한다.

### 식량 수출 guard 테스트

```text
성인 1명
Hunger 90
현지 식량 100
```

조건에서 `foodExportGuard()`가 `true`를 반환하고 차단 telemetry가 1회 증가함을 확인했다.

### 유지보수 결과 보존 테스트

동일한 2타일 synthetic settlement에 여러 건물을 두고 E9와 E10을 비교했다.

두 버전의 결과가 동일했다.

```text
건물 Condition: 전부 100
donor wood: 498.66
 donor stone: 499.43
다음 분기 maintenance order의 type / laborNeed 동일
```

### 유지보수 synthetic 성능 테스트

14×14 환경에서 연결된 80타일에 총 240개 유지보수 대상 건물을 둔 synthetic test를 세 번씩 실행했다.

E9 finalize:

```text
약 452.1 ms
약 388.7 ms
약 344.9 ms
```

E10 finalize:

```text
약 172.1 ms
약 132.4 ms
약 123.5 ms
```

환경과 JIT warm-up의 영향을 받는 synthetic 값이므로 자연주행 성능을 그대로 의미하지는 않는다. 다만 동일 결과를 유지한 상태에서 반복 donor 계산 비용이 실제로 줄었음을 확인하는 회귀 테스트로 사용한다.

---

## 8. 다음 자연주행에서 볼 값

E10은 100년 이상을 강제로 돌릴 필요가 없다. 작은 지도와 모바일에서는 다음 조건만 확보해도 충분하다.

### Hunger

특히 기근 후 회복한 국가를 관찰한다.

정상 기대:

```text
식사 성공률 높음
+ 현지 food reserve 충분
=> 평균 Hunger가 수십 년간 60~80에 고착되지 않음
```

확인 필드:

- `hungerMealSuccesses32E10`
- `hungerMealFailures32E10`
- `hungerFoodConsumed32E10`
- `foodParadoxEvents32E10`
- `foodParadoxActiveTiles32E10`
- `foodExportGuardBlocks32E10`

### 유지보수 성능

특히 영토 50타일 이상 / 건물 100개 이상 국가가 생긴 뒤 분기 1일을 본다.

확인 필드:

- `maintenanceDonorCacheBuilds32E10`
- `maintenanceDonorCacheHits32E10`
- `maintenanceRouteEvaluationsAvoided32E10`
- `perfSeasonalMaintenanceFinalize32E10`
- `perfSeasonalMaintenancePlan32E10`
- `perfSeasonalLegacyOther32E10`
- 기존 `perfSeasonalUnattributed32E9`
- SIM / WALL

목표는 E9처럼 한 국가의 maintenance finalize 하나가 수 초를 독점하는 현상을 크게 줄이는 것이다.

---

## 9. 호환성

- E10은 E9 저장 형식을 상속한다.
- E10 SaveSystem key: `village-observer-v0-32e10`
- E9 이하 저장 키를 fallback으로 계속 탐색한다.
- E10 export/save/devlog 파일명은 `v032E10`을 사용한다.
- E10 save serialize version은 `0.32E10`이다.
- E10 전용 Hunger/성능 통계가 없는 E9 이하 세이브는 0에서 시작한다.
- 전쟁/전투는 여전히 비활성화 상태다.

---

## 10. E9에서 그대로 유지되는 핵심 수정

E10은 다음 E9 수정사항을 되돌리지 않는다.

- Merchant Guild가 Trading Post endpoint 자격을 상속
- Grand Market이 Market capability를 상속
- stale E8 trade route cache 초기화
- Garrison / Field Person roster 중복 제거
- `주둔 + 야전 = 현역`, duplicate = 0 invariant
- E8 regional Grand Market 후보의 READY specialization 연결
- Proposal `NO_DEPOSIT / NO_SITE / SATISFIED` 세분화
- Guild handling saving telemetry 복구
- E9 seasonal profiler V1

V0.32E10은 새로운 콘텐츠 버전이 아니라 **Person 생존 일관성과 후기 simulation cost를 안정화하는 버전**이다.
