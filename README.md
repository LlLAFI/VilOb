# Village Observer V0.32E14

**패치명:** E13+E14 통합 · Person Performance 2 + Commercial/Infrastructure Finish  
**기준 버전:** V0.32E12  
**날짜:** 2026-09-28

V0.32E14는 별도 V0.32E13 릴리스를 만들지 않고, 예정되어 있던 **E13 성능·telemetry 안정화**와 **E14 상업·인프라 관측 마감**을 한 번에 적용한 통합 패치다. E12에서 확정한 Hunger Curve V2, Test Scenario V1.1, 유지보수 donor cache, 기존 국제교역 판단식은 그대로 유지한다.

이 패치의 원칙은 기능을 더 늘리는 것이 아니라 **같은 시뮬레이션 결과를 더 적은 중복 연산으로 만들고, 이미 존재하는 경제·교역·인프라 효과를 UI와 telemetry에서 해석 가능하게 만드는 것**이다.

---

## 1. E13 범위 통합: Person Performance Pass 2

### 1.1 Person.act 단일 호출 homeTile cache

기존 Person 행동은 한 work cycle 안에서 동일한 `homeTile()`을 작업 단계와 metabolism 단계에서 다시 조회하는 경우가 많았다. `homeTile()`은 단순 참조만 하는 것이 아니라 tile ownership 확인과 `syncResources()`까지 호출하므로, 인구가 커지면 중복 호출이 누적된다.

E14는 **한 번의 `Person.act()` 수명 안에서만** home tile을 재사용한다.

- 첫 조회: 기존 `homeTile()`을 그대로 실행
- 같은 act 안의 후속 조회: 동일 `homeTileId`, 동일 Nation owner이면 cached tile 반환
- `homeTileId`가 바뀌거나 owner가 달라지면 즉시 legacy 경로 재실행
- act가 끝나면 cache 폐기
- save에 cache를 기록하지 않음

따라서 여러 날에 걸친 stale cache가 생기지 않고, migration/ownership 변화도 다음 호출에서 기존 경로가 처리한다.

신규 telemetry:

- `homeTileCacheHits32E14`
- `homeTileCacheMisses32E14`
- `homeTileCacheHitShare32E14`

### 1.2 Person leaf profiler V3

E12는 PersonAct를 `metabolism / knowledge / job review / work-other`로 나눴다. 첫 500명 장기주행에서 `work/other`가 가장 큰 잔여 덩어리였으므로 E14는 1/32 sampled act에서 다음 leaf를 추가로 관측한다.

- `homeTile lookup`
- `Tile.harvest`
- `Village.depositAt`
- E12 `work/other`에서 위 leaf를 제외한 residual

필드:

- `perfPersonLeafSamples32E14`
- `perfPersonHomeTileLookupEst32E14`
- `perfPersonHarvestEst32E14`
- `perfPersonDepositEst32E14`
- `perfPersonResidualWorkEst32E14`

모든 Person에 `performance.now()`를 거는 방식은 사용하지 않는다. 1/32 sampling과 기존 저빈도 profiler 원칙을 유지한다.

### 1.3 변경하지 않은 성능 경로

- V0.32C2 stable-citizen job review fast path
- V0.32E10 maintenance donor ordering cache
- V0.32E2 food relay shortlist/pair cache
- V0.32E3 Knowledge fast path / resident index

E14는 위 검증된 경로를 다시 설계하지 않는다.

---

## 2. CSV / Telemetry Stabilization

E12에서 신규 Hunger/Profiler 열이 CSV 마지막에 몰려 붙는 exporter regression이 실주행으로 확인됐다. 원인은 E12 wrapper가 실제 newline 대신 literal `\n` 문자열로 split/join한 것이었다.

E14 배포본은 inherited E12 exporter를 다음처럼 수정한다.

```text
literal "\\n" split/join
→ actual newline split/join
```

추가로 CSV 다운로드 직전에 모든 행을 quote-aware 방식으로 검사한다.

```text
header column count = N
row 1 column count = N
row 2 column count = N
...
```

하나라도 다르면 파일을 조용히 내보내지 않고 `CSV schema mismatch` 오류를 발생시킨다.

신규 진단:

- `csvSchemaChecks32E14`
- `csvSchemaFailures32E14`

---

## 3. E14 범위: Commercial / Infrastructure Finish

D5부터 이미 국제시장 호가판과 실제 AI quote 함수가 존재한다. 따라서 E14는 새로운 시장 시스템을 하나 더 만들지 않고, 기존 기능을 **실제 체결과 인프라 관점에서 읽기 쉽게 마감**한다.

### 3.1 선택 국가쌍 무역·인프라 관측 패널

Trade 탭에서 D5 호가판 아래에 E14 observer가 추가된다.

표시 항목:

- 선택 상대국
- 현재 route mode (`LAND` / `SEA`)
- 현재 route cost
- 최근 1년 해당 국가쌍 실제 체결 횟수/수량
- 최근 1년 transport service Gold
- 선택 국가의 최근 1년 수입 순유출
- 수출 순유입
- 순 무역수지
- E6 누적 운송서비스 수입
- owned road / harbor / Merchant Guild 수
- 최근 체결의 SEA/LAND 구성
- 현재 transport factor
- 해상 경로일 경우 harbor efficiency
- E8 Merchant Guild regional handled trades / handling savings
- 마지막 실제 체결의 자원, 수량, route cost, transport Gold

이 패널은 observer 전용이다. **새로운 일일 route scan이나 trade decision loop를 추가하지 않는다.**

### 3.2 기존 D5 호가판 유지

기존 표시도 유지한다.

- 최대 매수가
- 판매 호가
- 도착가
- 반복수요 premium
- 전략 premium
- 관계 조정
- 현금압박 discount
- 운송 구성
- 최근 Trade Funnel

즉 E14는 `현재 quote`와 `실제로 체결된 결과`를 같은 Trade 탭에서 비교하게 만든다.

---

## 4. Test Scenario populationPolicy

E14부터 scenario metadata는 선택적으로 다음을 포함할 수 있다.

```json
{
  "populationPolicy": {
    "births": "disabled",
    "naturalDeaths": "enabled",
    "note": "..."
  }
}
```

이 필드는 **엔진 전역 출생 OFF 옵션이 아니다.** fixture가 어떤 방식으로 모집단을 통제했는지 기록하기 위한 metadata다.

격리형 회귀 테스트의 권장 규칙은:

- births disabled
- natural deaths enabled

이다. 따라서 질병·노화·아사 같은 실제 결과는 남고, 출생에 의한 모집단 보충만 제거할 수 있다. E12의 500명 Hunger Matrix / Food Deficit / Famine Recovery fixture에 이 정책을 명시했다.

---

## 5. E12에서 확정된 Hunger 상태

Hunger Curve V2는 E14에서 변경하지 않는다.

```js
x = HungerBeforeMeal / 100
curve = 1 - (1 - x) ** 2
relief = rand(5,6) + rand(3,4) * curve
```

첫 500명 Matrix 장기주행에서는 풍족 상태가 약 Hunger 9 전후의 안정 분포를 만들었고, E11의 전원 0 고착은 재발하지 않았다. Food Deficit stress run에서는 대량 아사 후 생존자 평균이 정상화되는 과정과 local food access 파동까지 관측했다. E14는 이 모델을 그대로 둔다.

---

## 6. 수동 회귀 결과 반영

### 6.1 Merchant Guild Endpoint

전용 fixture에서 약 70일 동안:

```text
tradeEndpointBase32E9      1
tradeEndpointPromoted32E9  1
tradeEndpointTotal32E9     2
```

이 유지되어 `merchant_guild`가 `trading_post` endpoint capability를 계승하는 회귀가 PASS됐다.

### 6.2 Maritime Transport Accounting

전용 Harbor Pair fixture를 2년 2분기까지 돌린 실사용 데이터에서는:

```text
실제 국제거래       27회
SEA                 27 / 27
LAND transport Gold 0
transport audit mismatch 0
```

이 확인됐다. 따라서 E6의 transport service Gold 보존 회계와 해상 route 판정은 E14 기준 회귀 자산으로 유지한다.

---

## 7. Save / Compatibility

- SaveSystem key: `village-observer-v0-32e14`
- serialize version: `0.32E14`
- V0.32E12 이하 E계열 key fallback 유지
- 일반 Save import 유지
- MapData import 유지
- Test Scenario wrapper version 1 유지
- Scenario runtime validation V1.1 유지
- 전쟁/실제 combat은 여전히 비활성

별도의 `V0.32E13` 배포물은 없다. **E13 계획 범위가 E14 통합 릴리스에 포함되었기 때문**이다.

---

## 8. E-series 남은 단계

E14 이후 계획상 남은 것은 **E15 Final Regression / E-series Close**다.

E15에서 확인할 항목:

1. 19×19 장기 자연주행
2. 500~2000 Person 후기 성능
3. Person profiler V3 병목 확인
4. 10개 Test Scenario 일괄 import/invariant 회귀
5. CSV schema consistency
6. Gold/transport accounting mismatch 0 확인
7. Hunger 분포 / starvation / food access sanity
8. 유지보수 donor cache와 seasonal legacy 비용
9. 군사 Person roster invariant
10. 장기주행에서 새 구조적 regression이 없으면 E-series 종료

E15에서 구조적 문제가 발견되지 않으면 다음 본류는 전쟁 V1 / 군사 상호작용 활성화 단계로 넘어간다.

---

## 9. Release validation

V0.32E14 배포본은 다음 회귀를 통과했다.

```text
inline scripts                 70
JavaScript syntax errors       0
Chromium startup page errors   0
fresh-world serialize version  0.32E14
Test Scenario import           10 / 10 PASS
CSV schema smoke               653 columns / 24 rows / mismatch 0
```

### E12 → E14 결정론적 동작 보존 비교

동일한 `Hunger Population Matrix 500` 상태에서 같은 deterministic RNG를 사용해 30 step을 실행한 결과, E12와 E14의 다음 값이 완전히 일치했다.

- population
- 5개 코호트 food stock
- 5개 코호트 average Hunger
- Nation Gold
- telemetry event count

즉 E14 homeTile act-cache는 해당 회귀에서 시뮬레이션 결과를 바꾸지 않았다.

### Merchant Guild endpoint

70-day runtime smoke:

```text
base      1
promoted  1
total     2
```

### Maritime accounting

180-day runtime smoke:

```text
transport trades      12
SEA transport Gold    2.517
LAND transport Gold   0
transport audits      12
mismatches            0
max abs delta         0
population            4
active nations        2
```

E15 장기 자연주행에서는 이 기능 회귀보다 **실제 후기 인구에서의 Person residual work 비용과 전체 SIM throughput**을 중점적으로 확인한다.
