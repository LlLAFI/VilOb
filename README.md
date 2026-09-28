# Village Observer V0.33A

**패치명:** Post-war Withdrawal + War Observer  
**기준 버전:** V0.33  
**날짜:** 2026-09-28

V0.33A는 첫 V0.33 자연전쟁에서 확인된 **종전 후 외국 영토 Formation 고립**을 수정하고, 전쟁을 사용자가 놓치지 않도록 지도·국가·통계 관측을 강화하는 안정화 패치다.

첫 자연전쟁에서는 티아의 Field Formation이 에브 영토 깊숙이 진입한 뒤 `FIELD_FORCE_COLLAPSE`로 종전했지만, 종전 직후 V0.33 전쟁 이동기가 비활성화되고 V0.32D 평시 이동기는 자국 영토만 통과할 수 있어 Formation이 외국 영토에 영구 고립되는 문제가 확인되었다.

V0.33A의 핵심 흐름은 다음과 같다.

```text
전쟁 종료
→ 외국 영토 Formation 탐지
→ POSTWAR_WITHDRAWAL
→ 직전 교전국 영토를 비전투 통과
→ 15 calendar-day / 1 tile 철군
→ 자국 영토 재진입
→ 평시 Formation planner 복귀
```

또한 현재 및 과거 전쟁을 사용자가 직접 복기할 수 있도록 다음 관측 경로를 추가한다.

```text
지도: 현재 전쟁 배너 + 전선 강조 + 전쟁 Formation 링
국가 > 군사: 현재 전쟁 + 최근 전쟁
통계: World 전체 War History
```

승전국 보상, 배상금, 영구 영토 할양, 전쟁 목표/평화 협상은 이번 안정화 패치에 추가하지 않는다.

---

# 0.33A 변경사항

## A.1 Post-war Withdrawal

종전 후 외국 영토에 남은 Field Formation은 `POSTWAR_WITHDRAWAL` 상태로 전환된다.

- 철군 중에는 **자국 + 직전 교전국 영토**만 통과할 수 있다.
- 이동 속도는 기존 Formation 기준과 동일한 **15 calendar-day / 1 tile**이다.
- 철군 이동은 점령을 만들지 않는다.
- 철군 Formation은 전투를 시작하지 않는다.
- 평시 `BORDER`, `RESOURCE`, `ADMIN`, `FRONTIER` 목표가 철군 명령을 덮어쓰지 못한다.
- 자국 영토에 들어오는 순간 철군 상태가 종료되고 기존 V0.32D 평시 Formation planner에 다시 연결된다.

### 평시 외국군 invariant

매 pulse에서 다음 상태를 검사한다.

```text
active war 없음
AND Formation tile.ownerId != Nation.id
```

위 조건이면 해당 부대는 자동으로 철군 상태로 복구된다. 기존 V0.33 저장을 불러왔을 때 이미 외국 영토에 고립된 Formation도 이 경로로 복구된다.

주요 이벤트:

- `FOREIGN_FORMATION_RECOVERY33A`
- `POSTWAR_WITHDRAWAL_STARTED33A`
- `POSTWAR_WITHDRAWAL_MOVE33A`
- `POSTWAR_WITHDRAWAL_COMPLETED33A`
- `POSTWAR_WITHDRAWAL_BLOCKED33A`

철군 중인 국가는 새 전쟁 선포 후보에서 제외된다.

## A.2 저장 / 불러오기

V0.32D `MilitaryFormation.from()`은 정의된 기본 필드만 복원하므로, V0.33A는 철군 상태를 별도로 `v33a.withdrawals[]`에 저장한다.

따라서 철군 도중 저장한 뒤 다시 불러와도 다음 정보가 유지된다.

- Formation ID
- 직전 상대 Nation ID
- 관련 War ID
- 철군 시작일
- 마지막 철군 이동일
- 철군 source

## A.3 지도 전쟁 가시성

활성 전쟁이 하나라도 있으면 지도 상단에 붉은 전쟁 배너를 표시한다.

표시 정보:

- 교전국
- 전쟁 경과일
- 현재 전투 횟수

지도 위에는 추가로:

- 교전국 사이 실제 국경: **붉은 점선 전선**
- 전쟁 참가 Field Formation: **붉은 링**
- 기존 점령 타일: V0.33 사선 점령 표시 유지

를 사용한다.

## A.4 War History

`World.v33War.wars[]`는 V0.33부터 종료된 전쟁도 삭제하지 않고 유지한다. V0.33A는 이 기록을 UI에서 직접 열람할 수 있게 한다.

### 통계 탭

`⚔ 전쟁 기록` 패널에서 모든 전쟁을 최신순으로 표시한다.

- 공격국 / 방어국
- 시작일 / 종료일 / 기간
- 승전국
- 종전 이유
- 전투 횟수
- 양측 전사 / 부상
- 양측 누적 점령 타일
- 수도 점령 여부

### 국가 > 군사

선택 국가가 참가한 최근 5개 전쟁을 요약해서 표시한다.

- 상대국
- 승전 / 패전 / 진행 중
- 기간
- 전투 수
- 수도 점령 / 피점령 여부

### 전쟁 이력 보존

V0.33A부터 War record의 `history33A`에 다음을 누적한다.

- 국가별 unique occupied tile IDs
- 현재 점령 tile IDs
- 최대 동시 점령 수
- 수도 점령 여부
- 수도 최초 점령 시점

기존 V0.33 저장은 남아 있는 `WAR_DECLARED33`, `TILE_OCCUPIED33`, `TILE_LIBERATED33`, `WAR_ENDED33` telemetry를 이용해 가능한 범위까지 자동 보강한다. telemetry가 이미 압축되어 해당 이벤트가 없다면 기본 War record 정보만 표시한다.

## A.5 Telemetry / CSV

V0.33A 추가 세계 지표:

- `withdrawingFormations33A`
- `peacetimeForeignFormations33A`
- `warHistoryCount33A`
- `capitalOccupations33A`

국가별 추가 지표:

- `withdrawingFormations33A`
- `peacetimeForeignFormations33A`

정상 평시 장기주행의 핵심 invariant는 다음이다.

```text
peacetimeForeignFormations33A = 0
```

## A.6 회귀 검증

최종 V0.33A 빌드에서 다음을 확인했다.

- inline script 73개 syntax pass
- Chromium startup/runtime error 0
- 평화 외국군 fixture: 자동 탐지 → 철군 → 자국 복귀 → foreign 0
- 3타일 철군: 15일 간격 다단계 이동 완료
- 철군 도중 save/load 후 상태·last move 보존
- 철군 완료 뒤 기존 평시 Formation 상태로 복귀
- 강제 전쟁에서 지도 전쟁 배너 표시
- 종료 전쟁이 통계 War History에 남음
- 수도 점령 history가 save/load 후 유지
- 3년 자연 smoke 정상
- snapshot CSV 704열 / schema mismatch 0

---

# V0.33 War V1 원본 설계

아래는 V0.33 본패치의 상세 기술 문서이며 V0.33A에서도 그대로 유지된다.


# 1. War State / 선전포고

## 1.1 전쟁 상태

World는 `v33War`를 보유한다.

주요 구조:

- `wars[]`: 현재 및 과거 전쟁
- `nextWarId`
- `recentPeaceByPair`
- 세계 누적 전쟁/전투/사상자/점령 통계

War record에는 다음이 저장된다.

- attacker / defender Nation ID
- 시작일 / 종료일
- 전투 횟수
- 국가별 전사·부상
- 국가별 전투 승/패
- War Exhaustion
- 점령 발생 수
- 종전 이유 / 승자(명확한 경우만)

V1에서는 **한 국가는 동시에 하나의 전쟁만 수행**한다.

## 1.2 AI 전쟁 검토

AI는 매일 전쟁을 판단하지 않는다. 약 **90 calendar-day 저빈도 cadence**로만 검토한다.

기본 진입 조건:

- 세계 연도 35년 이상
- 양국 모두 active
- 어느 쪽도 다른 active war 없음
- 양국 사이 실제 국경 접촉 존재
- 최근 같은 상대와 종전한 뒤 720일 이상
- 공격국에 `WATCHTOWERS` 또는 `ADMINISTRATION`
- Field Formation 실제 병력 2명 이상
- Field Readiness 52 이상
- 식량 비축일 28일 이상

전쟁 점수에는 다음이 들어간다.

- V0.32 전략적 우려
- 양국 관계의 적대도
- 국경 접촉 규모
- 실제 병력 + Readiness 기반 상대전력
- 국가 AI 성향
- 최근 양국 교역 의존도

점수가 76 미만이면 전쟁을 시작하지 않는다. 임계값을 넘은 경우에도 90일 검토마다 약 **3.5~18%** 범위의 제한된 확률을 사용해 전쟁 난발을 억제한다.

전쟁 시작 시 양국 관계는 강한 적대 상태로 내려가고 bilateral trade는 기존 관계 gate에 의해 자연스럽게 중단된다.

---

# 2. War Formation Movement

## 2.1 평시 이동과 전시 이동 분리

V0.32D Formation 경로는 의도적으로 **자국 영토만 통과**한다.

V0.33은 이 코드를 전역적으로 바꾸지 않는다.

- 평시: 기존 V0.32D 이동 그대로
- 전시: 해당 전쟁의 Field Formation만 V0.33 전용 이동 사용

전쟁 중에는 기존 D 이동기가 같은 Formation을 자국 전략지점으로 다시 끌어당기지 않도록 공간 상태를 보호하고, V0.33 이동 결과만 실제 위치에 남긴다.

## 2.2 이동 규칙

전시 Field Formation은 약 **15 calendar-day마다 1타일** 이동한다.

경로에 사용할 수 있는 타일:

- 자국 영토
- 현재 교전 중인 적국 영토

제3국 및 미소유 타일을 전쟁 경로의 지름길로 사용하지 않는다.

도로는 기존 물리 도로를 그대로 사용해 이동 경로비를 낮춘다.

우선 목표:

1. 적에게 점령당한 자국 타일 탈환
2. 접근 가능한 적국 영토
3. 수도·인구·시장·Armory·행정거점 등 전략가치가 높은 타일

---

# 3. Battle V1

## 3.1 실제 병력

전투 병력은 새 숫자로 생성하지 않는다.

Field Formation의 `cohortIds → memberIds → 실제 alive Person`을 추적한다.

적 수도에서는 기존 `CORE_GARRISON`도 실제 방어 병력으로 참가한다.

따라서 전투 전후의 인구와 Cohort roster가 동일한 Person 집합을 공유한다.

## 3.2 전투력

각 전투 단위의 기본 quality는 다음 요소를 사용한다.

```text
0.42
+ Training / 250
+ Equipment / 250
+ Supply / 280
+ Morale / 400
```

이를 실제 병력 수와 곱하고, 방어측이 자기 영토에서 싸울 경우 지형·시설 보정을 적용한다.

대표 방어 보정:

```text
Forest          ×1.08
Rock            ×1.11
Mountain        ×1.20
Watchtower      +0.07
Fortification   +0.12
Barracks        +0.04
Capital defense +0.06
```

최종 전투력에는 ±8% 수준의 제한된 전투 변동이 들어간다.

V0.33의 목적은 전술 시뮬레이션이 아니라 **V0.32에서 쌓아 온 Training / Equipment / Supply / Morale 차이를 실제 승패에 연결**하는 것이다.

## 3.3 사상자

패배측은 대략 9~30%, 승리측은 약 2.5~12% 범위에서 사상 위험을 가진다. 전력차가 클수록 패배측 피해가 증가한다.

사상자로 선택된 실제 Person은:

- 약 36%: 전사
- 나머지: 부상

으로 분기한다.

### 전사

- 실제 `Person.alive = false`
- 실제 Cohort member ID에서 제거
- 실제 인구 감소
- `WAR_DEATH33` 기록

### 부상

- `militaryStatus32A = wounded`
- active Cohort에서 제거
- 45~120 calendar-day 회복기간
- 회복 중 민간 직업 활동 중단
- 낮은 활동량의 식량 소비·건강 회복
- 회복 후 조건에 따라 reserve 또는 civilian 복귀

포로는 V1에서 사용하지 않는다.

---

# 4. Retreat V1

전투에서 패배한 Field Formation은 그 자리에서 삭제되지 않는다.

가능하면 인접한 자국 타일 중 본거지 방향으로 후퇴한다.

적 영토 깊숙이 들어가 인접 자국 타일이 없는 경우 V1은 장거리 전멸/포로 모델 대신 **본국 핵심지점으로 강제 철수하는 aggregate fallback**을 사용한다.

후퇴 Formation은 `RETREATING` 상태가 되고 다음 전시 이동부터 다시 전선을 형성한다.

Telemetry:

- `FORMATION_RETREAT33`

---

# 5. Temporary Occupation V1

## 5.1 소유권과 점령권 분리

점령으로 `ownerId`를 바꾸지 않는다.

Tile에는 별도로 다음이 기록된다.

- `v33OccupierId`
- `v33OccupationWarId`
- `v33OccupationSinceCal`

즉 다음과 같은 상태가 가능하다.

```text
법적/원래 소유자: Nation A
현재 군사 점령자: Nation B
```

이는 V1 전투 한 번으로 국경선이 영구 변경되는 현상을 방지한다.

## 5.2 점령 효과

점령 타일의 자연자원 채취량은 정상의 **65%**로 감소한다.

또한 V0.32F Supply가 선택한 지원거점이 적에게 점령된 경우 해당 Cohort Supply를 추가로 **72% 수준으로 감쇠**하고 Readiness를 다시 계산한다.

자국 Formation이 점령지에 재진입하면 즉시 해방된다.

종전 시 해당 전쟁의 모든 점령은 자동 해제되고 원래 `ownerId`가 그대로 유지된다.

이 버전에는 영구 합병이 없다.

---

# 6. War Exhaustion / Peace V1

War Exhaustion은 대략 다음 압력을 합성한다.

- 전쟁 지속기간
- 실제 Person 전사 비율
- 부상 비율
- 자국 피점령 타일
- 낮은 식량 비축
- 낮은 Treasury Gold
- 전투 패배 누적

일반적인 전쟁은 최소 약 **180 calendar-day** 이전에는 피로도만으로 자동 종전하지 않는다.

다만 전쟁 시작 후 90일 이상 지나 한쪽 야전 전력이 완전히 붕괴하면 `FIELD_FORCE_COLLAPSE`로 조기 종전할 수 있다.

전쟁 피로가 충분히 높으면 월 단위 종전 검토에서 휴전 가능성이 상승한다.

명확한 피로 격차가 있을 때만 winner를 기록한다. 그 외에는 승패를 강제로 선언하지 않는다.

V1 종전 처리:

- 전쟁 상태 종료
- 모든 temporary occupation 반환
- Formation 귀환 목표 설정
- 관계를 즉시 우호화하지는 않지만 극단적 전시 적대에서 휴전 수준으로 완화
- 영구 영토 변화 없음
- 배상금 없음

---

# 7. Observer / Telemetry

## 7.1 World fields

- `activeWars33`
- `warsDeclared33`
- `warsEnded33`
- `battles33`
- `battleDeaths33`
- `battleWounded33`
- `occupiedTiles33`
- `occupationStarts33`
- `liberations33`
- `retreats33`

## 7.2 Nation fields

- `atWar33`
- `warId33`
- `warOpponent33`
- `warOpponentId33`
- `warDays33`
- `warExhaustion33`
- `warBattles33`
- `warDeaths33`
- `warWounded33`
- `battlesWon33`
- `battlesLost33`
- `occupiedEnemyTiles33`
- `enemyOccupiedOwnTiles33`

## 7.3 Events

- `WAR_DECLARED33`
- `FORMATION_INVASION_MOVE33`
- `BATTLE33`
- `WAR_DEATH33`
- `WAR_WOUNDED33`
- `WAR_WOUNDED_RECOVERED33`
- `FORMATION_RETREAT33`
- `TILE_OCCUPIED33`
- `TILE_LIBERATED33`
- `WAR_ENDED33`

군사 탭은 현재 상대국, 전쟁 기간, War Exhaustion, 전투 수, 전사/부상, 점령/피점령 타일을 표시한다.

지도에서는 원래 국가 소유 색을 유지한 채 점령국 색의 내부 오버레이를 덧그려 **영토 소유와 군사 점령을 분리해 표현**한다.

---

# 8. 저장 호환

V0.33 localStorage key:

```text
village-observer-v0-33
```

V0.32F 이하 fallback load를 유지한다.

저장 시:

```text
version: 0.33
v33.war: World war state
Tile.v33OccupierId
Tile.v33OccupationWarId
Tile.v33OccupationSinceCal
Person.woundedUntilCal33
```

이 포함된다.

V0.33 active war 저장 → 다시 load해도 전쟁 ID·전투 횟수·점령 상태가 유지된다.

---

# 9. 회귀 검증

## 9.1 정적 검증

- inline script **72개** 추출
- `node --check` 전체 통과
- syntax error 0

## 9.2 Chromium startup

- document title: `Village Observer V0.33`
- version badge: `Village Observer · V0.33`
- `VSim.V033` 등록 확인
- startup runtime error 0

## 9.3 War fixture

전쟁 전용 회귀 fixture에서 확인:

- 강제 선전포고 성공
- 적 영토 Formation 이동 이벤트 발생
- temporary occupation 발생
- 실제 Person 부상 발생
- 패배 Formation retreat 발생
- 실제 Person 전사 발생
- 전사 1명 발생 시 두 국가 합산 population 실제 -1
- `WAR_DEATH33` event 1건 대응 확인

## 9.4 Occupation save/load

```text
점령 타일 수     1
save/load 후     1
종전 후          0
ownerId          변경 없음
```

## 9.5 War state save/load

active war 저장 후:

- war ID 유지
- ACTIVE 상태 유지
- 누적 battle count 유지

## 9.6 자동 종전

90일 이상 진행된 fixture에서 한쪽 Field Force를 0으로 만든 결과:

```text
status = ENDED
endReason = FIELD_FORCE_COLLAPSE
activeWars = 0
```

## 9.7 AI declaration path

직접 `declareWar(force=true)`를 호출하지 않고, 국경/Readiness/전략적 우려 조건을 만족시킨 fixture에서 저빈도 AI 판단을 실행했다.

결과:

```text
warsDeclared = 1
reason = AI_STRATEGIC
```

## 9.8 CSV

V0.33 신규 열 포함 회귀 fixture:

```text
columns = 698
schema mismatch = 0
```

---

# 10. 의도적으로 미룬 범위

다음은 War V1에 포함하지 않는다.

- 영구 영토 할양 / 합병
- 강화조약 협상 UI
- 전쟁 배상금
- 동맹 / 방위조약 / 참전 요청
- 포로 / 포로교환
- 해전 / 상륙전
- 항구 봉쇄
- 공성전 전용 규칙
- 성벽 상세 내구도
- 병종 세분화
- 장군 / 지휘관 / 전술
- 무기·군수품 국제무역
- Transit Trade

특히 V0.32F 115년 자연주행에서 나타난 **하젠처럼 병력과 Supply는 충분하지만 Equipment가 없는 국가**의 문제는 이번 버전에서 임의로 해결하지 않는다. 먼저 War V1 자연주행에서 그 차이가 실제 전투 결과에 어떻게 나타나는지 관찰한다.

---

# 11. 다음 검증 목표

V0.33 자연주행에서는 기능 존재 여부보다 다음 현상을 중점적으로 본다.

1. 전쟁 빈도가 지나치게 높거나 낮지 않은가
2. 전쟁이 영구적으로 끝나지 않는 사례가 있는가
3. Equipment / Supply / Readiness 차이가 승패와 사상자에 실제 영향을 주는가
4. 소국이 한 번의 전투로 무조건 삭제되지 않는가
5. 점령선이 지나치게 빠르게 확산되지 않는가
6. 전사·부상이 인구·노동·군사 roster를 깨뜨리지 않는가
7. 종전 뒤 점령지가 완전히 반환되는가
8. 전쟁 추가 연산이 후기 성능을 비선형적으로 악화시키지 않는가

이 자연주행 결과를 본 뒤에야 영구 영토 변경, 강화조건, 군수무역 등 다음 전쟁 확장을 결정한다.

---

# 12. V0.32F 계승

아래는 V0.33의 직접 기반인 V0.32F 상세 기술 문서다. 장비·Supply·Readiness·Proposal/Profiler 정합성 규칙은 별도 변경 언급이 없는 한 그대로 유지한다.

---

# Appendix — Village Observer V0.32F Technical Baseline

**패치명:** Military Readiness & V0.32 Closure  
**기준 버전:** V0.32E14  
**날짜:** 2026-09-28

V0.32F는 V0.32 계열의 마지막 본편 패치다. V0.32A부터 구축해 온 **실제 Person 기반 군사 인구 → Garrison / Field Cohort → Formation → 군사시설 → 장비 → 보급 → 준비태세**를 하나의 전쟁 직전 시스템으로 연결하고, E14 장기주행에서 확인된 관측·계측 불일치를 함께 마감한다.

이번 버전에서도 **전쟁 선포, 실제 전투, 피해 판정, 전사·부상·포로, 후퇴, 점령, 영토 변경은 활성화하지 않는다.** 이 범위는 V0.33 전쟁 V1로 넘긴다.

E14에서 확정한 Hunger Curve V2, 국제교역/운송 Gold 보존 회계, Merchant Guild / Grand Market, Test Scenario V1.1, Person homeTile act-cache, CSV schema validator는 그대로 유지한다.

---

## 1. V0.32F 목표

F의 목적은 새 대형 시스템을 추가하는 것이 아니라 다음 불완전 연결을 닫는 것이다.

1. E14 장기주행에서 **Smithy와 Tools가 있어도 Armory 0 / Equipment 0**으로 남던 군사장비 파이프라인 교착 해소
2. 기존 추상적 Supply 값을 실제 **Formation 위치·자국 정착망·도로/경로·식량 접근성**과 연결
3. Training / Equipment / Supply / Morale을 전쟁 직전의 **Military Readiness**로 통합
4. Construction Proposal이 `READY`인데 실제 E4 intent는 `PAYMENT_REJECTED` 등으로 막히던 observer 불일치 수정
5. E14에서 실제 생산이 존재해도 0으로 관측되던 `perfPersonHarvestEst32E14` 계측 복구
6. 장기 Gold 집중을 수정하지 않고, 우선 Top-1 / Top-2 점유율을 관측 가능하게 함
7. V0.32 범위를 명시적으로 종료하고 V0.33 Combat으로 넘길 경계를 고정

---

# 2. Armory / Military Equipment Pipeline

## 2.1 E14에서 확인된 교착

기존 V0.32C/C1의 Armory 후보 조건은 다음을 요구한다.

- `IRONWORKING`
- 실제 현역 2명 이상
- 실제 Smithy 1개 이상
- 국가 식량 비축일 34일 이상
- Armory 미보유/미착공
- 국가 철 재고 5 이상

Armory 실제 건설비는 기존 물리 건설 경로를 그대로 사용한다.

```text
wood  26
stone 18
iron   4
gold  10
labor 600 adult-days
```

문제는 Armory가 없을 때도 Smithy 노동자가 들어오는 철을 계속 Tools로 소비하기 때문에, 장기주행에서 국가 철 재고가 Armory trigger인 5에 도달하기 전에 다시 소모될 수 있다는 점이었다. E14 85년 자연주행에서는 여러 국가에 Smithy와 Tools가 존재했지만 Armory와 군사장비가 끝까지 0으로 남았다.

## 2.2 F의 실제 철 비축

V0.32F는 Armory를 무료화하거나 철을 생성하지 않는다.

다음 조건이 모두 성립하고 아직 Armory가 없을 때만:

- `IRONWORKING`
- 현역 2명 이상
- Smithy 존재
- 식량 비축일 34일 이상
- Armory 미보유 / 미착공

Smithy가 소비할 수 있는 국가 철 재고에 **5.25의 임시 최소 비축선**을 둔다.

예:

```text
국가 철 5.10
Smithy 요청 0.46
→ 소비 0
→ 철 5.10 유지

국가 철 5.50
Smithy 요청 0.46
→ 소비 0.25
→ 철 5.25 유지
```

이 비축은 회계상의 가상 자원이 아니다. 기존 제련소가 실제로 생산한 철 재고 중 일부를 Smithy가 잠시 소비하지 않는 방식이다.

Armory가 착공되거나 이미 존재하면 비축 제한은 즉시 해제된다.

## 2.3 Smithy 출력 보존 수정

기존 V0.31 Smithy 경로는 요청한 철량을 바탕으로 Tools 산출량을 계산한다. F가 철 소비량만 줄일 경우 요청량과 실제 소비량 사이에 차이가 생길 수 있으므로, F는 같은 Person act 안에서 **실제로 withdraw된 철량 × 기존 수율**까지만 Tools deposit을 허용한다.

따라서 Armory 비축이 Gold/iron/tools를 새로 만들지 않는다.

## 2.4 Armory 착공

철이 5 이상 모이면 기존 V0.32C1 readiness / site / project-cap / finance 판정으로 돌아간다.

승인된 Armory는 기존 `startConstruction()` / `payBuild()` 경로를 그대로 사용한다.

검증 fixture에서는:

```text
Armory 직전 iron  5.25
Armory 착공 iron  -4.00
착공 후 iron       1.25
```

가 확인됐다.

신규 telemetry:

- `armoryIronConsumptionDeferred32F`
- `armoryIronReserveBlocks32F`
- `armoryStartAttempts32F`
- `armoryStarts32F`
- `armoryPipeline32F`
- `armoryIron32F`
- `armoryIronReserveTarget32F`

`armoryStarts32F`는 C1 PRE_SEASON, PROJECT_FREED, F post-season retry 등 어느 경로에서 실제 착공되더라도 `startConstruction()` 성공 시점에서 집계한다.

---

# 3. 실제 군사장비 생산 유지

Armory가 완성된 뒤에는 기존 V0.32C 실물 장비 생산식을 그대로 사용한다.

필요 조건:

- Armory 존재
- 실제 Smithy worker 존재
- 군사 장비 수요 존재
- 실제 iron / wood / tools 재고 존재

장비 생산은 다음 실물 입력을 소비한다.

```text
장비 1 unit당
iron  0.72
wood  0.18
tools 0.045
```

생산된 장비는 `v32cMilitary.equipmentStock`에 보존되며 실제 active military 수에 따라 Equipment coverage가 계산된다.

F 검증 fixture에서는:

```text
생산 장비       1.65
iron 소비       1.188
wood 소비       0.297
tools 소비      0.07425
Equipment       0% → 41.3%
```

이 확인됐다.

기존 C telemetry도 유지한다.

- `militaryEquipmentStock32C`
- `militaryEquipmentCoverage32C`
- `militaryEquipmentMade32C`
- `militaryEquipmentIronUsed32C`
- `militaryEquipmentWoodUsed32C`
- `militaryEquipmentToolsUsed32C`

---

# 4. Formation Supply V1

## 4.1 원칙

V0.32B/C의 Supply는 주로 국가 식량 비축과 시설 보너스에서 나온 추상값이었다. F에서는 Field/Garrison Cohort의 Supply를 현재 위치와 실제 자국 네트워크에 연결한다.

병사는 이미 실제 Person이며 기존 metabolism을 통해 식량을 소비하므로, F는 별도의 군용 식량을 추가 소비시키지 않는다. **이중 식량소비는 없다.**

Supply는 전쟁 전 단계에서 "현재 Formation 위치가 자국 보급망으로 얼마나 잘 지원되는가"를 나타내는 준비태세 지표다.

## 4.2 보급 거점 후보

자국 소유 Settlement 중 다음 조건을 만족하는 타일이 보급 후보가 된다.

- 수도는 항상 후보
- Armory
- Barracks
- Training Ground
- Granary
- Warehouse
- Administrative Office
- 또는 충분히 큰 실제 거주 인구

보급 거점 가중치:

```text
Capital              +14
Armory                +22
Barracks              +15
Training Ground        +5
Granary                 +7
Warehouse               +5
Administrative Office   +6
Population        min(8, pop × 0.55)
```

실제 후보 중 Formation까지의 자국 내부 경로를 계산하고, 단순 거리뿐 아니라 거점 기능을 함께 고려해 지원 source를 고른다.

## 4.3 route / food access

보급 목표의 기본형은 다음이다.

```text
raw supply = 98 - routeCost × 4.6 + supportBonus
```

여기에 국가/지역 Food reserve 접근계수를 적용한다.

```text
45일 이상  1.00
30~44일     0.94
18~29일     0.82
10~17일     0.67
10일 미만   0.48
```

도로 효과는 기존 internal path cost에 이미 포함되므로, 실제 도로망이 좋은 Formation은 같은 지도 거리에서도 더 좋은 Supply를 얻을 수 있다.

자국 연결 경로가 전혀 없으면 `connected=0`이며 Supply target은 18로 낮아진다.

## 4.4 급격한 출렁임 방지

Supply는 15 calendar-day 저빈도 cadence로 갱신하며 기존값에서 목표값으로 완만하게 이동한다.

```text
next supply = old × 0.55 + target × 0.45
```

첫 초기화만 target 값을 즉시 사용한다.

신규 Cohort 관측값:

- `supply32F`
- `supplyTarget32F`
- `supplyRouteCost32F`
- `supplySourceTileId32F`
- `supplySourceLabel32F`
- `supplyConnected32F`

국가 telemetry:

- `militarySupplyAvg32F`
- `militarySupplyMaxRoute32F`
- `militarySupplyDisconnected32F`
- `militarySupplyDisconnectedObs32F`

---

# 5. Military Readiness V1

각 Cohort의 전쟁 직전 준비태세를 다음 네 값으로 합성한다.

```text
Readiness =
  Training  × 0.30
+ Equipment × 0.25
+ Supply    × 0.30
+ Morale    × 0.15
```

이 값은 F에서는 **관측 전용**이다. 공격력, 피해량, 사망률에 아직 사용하지 않는다.

국가 군사 탭에 새 F 패널을 추가한다.

표시 항목:

- 전체 Readiness
- Garrison Readiness
- Field Readiness
- 평균 Supply
- 최장 보급 route
- 보급 단절 Cohort 수
- Equipment coverage
- Armory 수
- Armory pipeline 상태
- Cohort별 실제 Person 수
- Cohort별 Training / Equipment / Supply / Readiness
- 보급 source와 route cost

Armory pipeline 상태 예:

- `TECH`
- `NO_ACTIVE_FORCE`
- `NO_SMITHY`
- `FOOD_RESERVE`
- `RESERVING_IRON`
- `READY`
- `BUILDING`
- `ACTIVE`
- 실제 C1 blocker

신규 telemetry:

- `militaryReadinessAvg32F`
- `militaryFieldReadiness32F`
- `militaryGarrisonReadiness32F`
- `militaryEquipmentCoverage32F`
- `militaryReadyNations32F`
- `militaryReadinessUpdates32F`
- `perfMilitaryReadiness32F`

---

# 6. Person-backed 군사 원칙 유지

F에서도 군인은 새 숫자로 생성하지 않는다.

- 모든 active soldier는 기존 실제 Person
- Garrison member ID와 Field Cohort member ID는 실제 Person ID
- 민간 노동 제외 규칙 유지
- Field Formation은 Field Cohort를 참조
- E9 roster 중복 방지 유지
- synthetic manpower 생성 금지

즉 F가 추가하는 Supply / Readiness는 기존 실제 Person 군사체계 위에 붙는 관측·상태값이다.

---

# 7. Construction Proposal 실행기 정합성

E14 장기주행에서는 E8 Construction Proposal이 `TRADE_NETWORK:trading_post = READY`라고 표시하지만 실제 E4 intent는 직전 물리 착공 실패 후 다음 blocker를 유지하는 경우가 있었다.

대표:

- `PAYMENT_REJECTED`
- `STRATEGIC_GATE`
- `FINANCE`
- `TILE_BUSY`

F에서는 E4 진단 함수가 현재 물리 조건만 다시 계산해 `READY`를 반환하더라도, **동일 intent가 현재 `status=BLOCKED`이고 실제 blocker를 보유한다면 그 concrete blocker를 우선 반환**한다.

따라서 observer가 실제 실행 상태보다 낙관적으로 표시되는 false READY를 막는다.

신규 telemetry:

- `constructionProposalSyncCorrections32F`

검증 fixture:

```text
동일 타일 / 동일 자원 조건
PLANNED + NONE              → READY
BLOCKED + PAYMENT_REJECTED  → PAYMENT_REJECTED
```

---

# 8. E14 Harvest Profiler Fix

E14는 `Tile.harvest()`를 1/32 sampled Person act에서 계측하도록 만들었지만, 일반 work tile에는 E14 wrapper가 기대한 `_worldRef`가 설정되지 않아 자연주행에서 `perfPersonHarvestEst32E14 = 0`이 계속 관측됐다.

F에서는 Person act의 active world reference를 `Tile.harvest()` 호출 동안만 임시 전달한다.

- 저장하지 않음
- 타일에 영구 world reference를 남기지 않음
- 호출 후 이전 값을 복원
- simulation result를 변경하지 않음

900-step fresh-world smoke에서 자동 snapshot 중:

```text
perfPersonHarvestEst32E14 non-zero snapshots  28
max estimated harvest time                    12.8 ms
```

가 관측되어 계측 경로가 실제 수확 호출을 잡는 것을 확인했다.

---

# 9. Gold Concentration Observer

E14 85년 자연주행에서는 상위 2개 국가가 세계 Money Supply의 약 91.6%를 보유하는 장기 집중이 관측됐다.

F는 이를 즉시 재분배하지 않는다.

새 정책, 세금, Gold 생성/소멸 규칙은 추가하지 않고 snapshot 시 다음 두 값만 기록한다.

- `goldTop1Share32F`
- `goldTop2Share32F`

향후 중계무역 / Transit Trade와 장기 경제 밸런스를 평가할 관측 기준으로 사용한다.

에브처럼 지리적으로 좋은 허브가 생산 수출국보다 약하게 수익화되는 문제는 방향성으로 유지하지만, **실제 Transit Trade 경제는 F에 넣지 않는다.**

---

# 10. Performance 정책

F의 Supply / Readiness는 매 Person act마다 경로를 계산하지 않는다.

- Nation/Cohort 수준 저빈도 갱신
- 기본 cadence: 15 calendar days
- seasonal tick에서는 강제 갱신
- 기존 내부 path cost 사용
- 새 일일 국제교역 scan 없음
- 전투 scan 없음

성능 panel에는 F readiness observer 비용을 별도로 노출한다.

F의 목적은 0.33 전투 시스템을 얹기 전에 보급 계산 자체가 새로운 초선형 병목이 되지 않도록 하는 것이다.

---

# 11. Save / Compatibility

- SaveSystem key: `village-observer-v0-32f`
- serialize version: `0.32F`
- V0.32E14 이하 E/D key fallback 유지
- 일반 Save import 유지
- MapData import 유지
- Test Scenario import/export 유지
- Scenario export intended version: `0.32F`
- Combat: `false`
- `v32f.seriesClosed = true`

V0.32E14 save를 F에서 불러올 때 F 상태는 기본값으로 부착한다.

실제 E14 → F roundtrip 검증:

```text
E14 population  104
F load population 104
E14 Nation treasury sum 792.0956289319934
F load treasury sum      792.0956289319934
loaded serialize version 0.32F
seriesClosed             true
combat                    false
page errors               0
```

---

# 12. CSV / Telemetry

E14의 quote-aware schema validation을 그대로 유지한다.

F 추가 global 열:

- `armoryIronConsumptionDeferred32F`
- `armoryIronReserveBlocks32F`
- `armoryStartAttempts32F`
- `armoryStarts32F`
- `militaryReadinessUpdates32F`
- `militarySupplyDisconnectedObs32F`
- `constructionProposalSyncCorrections32F`
- `perfMilitaryReadiness32F`
- `militaryReadyNations32F`
- `goldTop1Share32F`
- `goldTop2Share32F`

F 추가 nation 열:

- `militaryReadinessAvg32F`
- `militaryFieldReadiness32F`
- `militaryGarrisonReadiness32F`
- `militarySupplyAvg32F`
- `militarySupplyMaxRoute32F`
- `militarySupplyDisconnected32F`
- `militaryEquipmentCoverage32F`
- `armories32F`
- `armoryPipeline32F`
- `armoryIron32F`
- `armoryIronReserveTarget32F`

900-step fresh-world smoke:

```text
CSV columns   675
CSV rows      372
mismatch      0
```

---

# 13. Release Validation

## 13.1 정적 검사

```text
inline scripts            71
JavaScript syntax errors   0
```

모든 inline script를 별도로 추출해 `node --check`를 통과했다.

## 13.2 Chromium startup

```text
Document title              Village Observer V0.32F
Version badge               Village Observer · V0.32F
fresh serialize version     0.32F
startup page errors         0
```

## 13.3 900-step natural smoke

```text
fresh-world advance         900 steps / game year 3
page errors                 0
serialize version           0.32F
CSV                         675 columns / 372 rows
CSV mismatch                0
harvest profiler            non-zero confirmed
```

초기 3년에는 `IRONWORKING`과 자연 군사 조건이 아직 갖춰지지 않으므로 Armory 자연 발생을 회귀 조건으로 강제하지 않는다. Armory 파이프라인은 별도 실제-resource fixture로 검증한다.

## 13.4 Armory deadlock fixture

```text
iron 5.10 + smithy consume request 0.46
→ consumed 0
→ iron 5.10

iron 5.50 + smithy consume request 0.46
→ consumed 0.25
→ iron 5.25

Armory pipeline
→ READY

Armory start
→ success
→ physical project cost includes iron 4
→ iron 5.25 → 1.25

armoryStartAttempts32F  1
armoryStarts32F        1
page errors             0
```

## 13.5 Equipment production fixture

```text
equipment made  1.65
iron used       1.188
wood used       0.297
tools used      0.07425
coverage        0% → 41.3%
page errors     0
```

## 13.6 Formation supply fixture

Field Formation을 수도권에서 원거리 자국 타일로 옮긴 테스트에서:

```text
Garrison supply        100
Field route cost       3.45
Field supply           71.4
Field readiness        44.6
connected              true
page errors            0
```

즉 위치/경로 변화가 Field Supply와 Readiness에 실제로 반영된다.

## 13.7 Construction Proposal fixture

```text
PLANNED / NONE               → READY
BLOCKED / PAYMENT_REJECTED   → PAYMENT_REJECTED
sync correction counter      +1
page errors                  0
```

---

# 14. V0.32 종료 범위

V0.32F로 다음 흐름을 완성한다.

```text
실제 Person
→ 예비군 / 현역
→ Garrison + Field Cohort
→ Formation
→ 지도상 이동/배치
→ Barracks / Training Ground / Armory
→ 실제 철·목재·도구 기반 Equipment
→ 위치·도로·식량 접근 기반 Supply
→ Training / Equipment / Supply / Morale 기반 Readiness
```

여기까지가 **군사사회 / 전쟁 준비 단계**다.

---

# 15. V0.33으로 넘기는 범위

다음은 F에 넣지 않는다.

- 전쟁 선포 / 외교적 전쟁 상태
- 적국 영토 진입 규칙
- Formation 대 Formation 접촉
- 실제 전투 판정
- 공격 / 방어 / 지형 / 요새 효과
- 전사 / 부상 / 포로
- 장비 손실
- 보급 고갈의 실제 전투 페널티
- 후퇴 / 추격
- 점령
- 영토 소유권 변경
- 전쟁 피로 / 강화 / 평화협정

이제 V0.33 전쟁 V1은 F의 Readiness와 Formation을 입력으로 받아 **"실제 두 Formation이 만났을 때 무슨 일이 일어나는가"**에서 시작할 수 있다.

---

# 16. 이후 경제 방향 메모

E14 장기 분석에서 에브처럼 지리적으로 유리한 국가가 높은 연결성을 갖더라도, 현재 seller→buyer 직거래 구조에서는 생산·수출력이 강한 세른이 더 큰 Gold 이익을 얻는 현상이 확인됐다.

향후 교역 고도화에서는 단순 생산 보너스보다 다음 방향을 우선 검토한다.

- Transit Trade / 중계무역
- 환적·보관·중개 서비스
- 상업 노선 허브
- Harbor / road junction service income
- 지리적 centrality의 경제적 수익화

이 기능들은 V0.32F의 범위가 아니며, F에서는 Gold concentration observer만 남긴다.
