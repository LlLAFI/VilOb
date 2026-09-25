# Village Observer V0.32B

## 실제 Person 동원 · 평시 Cohort/Garrison V1

V0.32B는 V0.32A에서 준비한 `Person-backed MilitaryCohort / Garrison` 구조를 처음으로 실제 시뮬레이션에 연결하는 버전이다.

이 버전의 핵심 목표는 전투를 만드는 것이 아니라 다음 한 문장을 실제 규칙으로 만드는 것이다.

> 군대에 들어간 사람은 실제 Person이며, 군 복무 중에는 민간 경제의 노동자로 동시에 존재할 수 없다.

따라서 V0.32B에서는 실제 Person 일부가 예비군 또는 평시 현역으로 전환되고, 현역 Person은 실제 Cohort와 Garrison의 구성원이 된다. 아직 부대 이동, 무기·장비 생산, 군사시설, 요새화, 전투는 활성화하지 않는다.

---

## 1. 동원 조건

기존 V0.32A의 기본 적격 기준을 유지한다.

- 생존 상태
- 18~50세
- Health 45 이상
- 실제 개척 임무 수행 중이 아님
- 부상/포로 상태가 아님
- 성별 제한 없음

V0.32B에서는 기술 발전에 따라 실제 군사조직이 단계적으로 등장한다.

### ADMINISTRATION

`ADMINISTRATION` 연구 이후 국가는 동원 가능한 Person 일부를 `reserve`로 등록한다.

예비군은 군사적 인력 풀에 등록되지만 평시에는 기존 민간 직업과 경제활동을 그대로 수행한다.

### WATCHTOWERS

`WATCHTOWERS` 연구 이후 소수의 `active` 현역을 실제로 조직한다.

현역 목표 비율은 국가 AI 성향에 따라 기본값이 다르며 다음 요소가 추가로 영향을 준다.

- 전략적 경계(`maxStrategicConcern`)
- 기존 threat
- 식량 비축일
- Survival Mode
- 국가 AI 성향

확장형 국가는 평시 현역 비율이 조금 높고, 교역외교형은 조금 낮다. 생존 위기나 낮은 식량 비축은 현역 규모를 강하게 제한한다.

V0.32B에서는 `PEACE / WATCH` 두 단계만 실제로 사용한다. 더 큰 부분동원·총동원 체계는 후속 패치에서 확장한다.

---

## 2. 실제 Person 동원

현역으로 선발된 Person은 다음 상태가 된다.

- `militaryStatus32A = active`
- `militaryCohortId32A = 실제 Cohort ID`
- `militaryActiveSince32B = 동원 시점`

선발 우선순위는 다음 요소를 사용한다.

- Combat skill
- Health
- Loyalty
- 기존 `경비` 직업
- 연령대

식량이 불안정할 때 농업계 직업을 우선 보존하며, 철광산·제련소·대장간의 핵심 산업 노동자도 가능한 한 후순위로 둔다.

이는 절대적인 보호 규칙이 아니다. 충분한 인력이 없거나 군사적 필요가 높아지면 생산 노동자도 실제로 군대에 들어갈 수 있다.

---

## 3. 민간 노동 이탈

현역 Person은 기존 Person 객체 그대로 존재하지만 군 복무 동안 다음 민간 활동에서 제외된다.

- 농업 / 채집 / 사냥
- 목재 채취
- 채석 / 철광 채굴
- 제련 / 대장간 작업
- 상업 노동과 임금 수령
- 건설 노동
- 유지보수 노동
- 개척민 선발
- 국내/국외 민간 이주 후보

이를 기존 시스템 전체에 별도의 `if military` 조건으로 흩뿌리지 않고, 현역 Person을 기존 `PIONEER` 노동 제외 경로에 예약시키는 호환 방식으로 처리한다.

단, `Person.act()`의 최종 wrapper가 먼저 현역 여부를 확인하므로 실제 행동 문구는 개척이 아니라 `주둔군 복무 · 훈련과 경계 중`으로 표시된다.

전역 시 기존 assignment를 복구하고 직업 재검토를 즉시 허용한다.

### 군사 노동 손실 telemetry

- `militaryLaborRemoved32B`: 현재 민간 노동에서 빠진 현역 Person 수
- `militaryLaborRemovedDays32B`: 누적 민간 노동 이탈 person-day

현재 달력 구조에서 한 macro simulation day는 3 calendar-day이므로 현역 1명이 한 번의 macro work cycle을 지나면 3 person-day가 누적된다.

---

## 4. 예비군

예비군은 `militaryStatus32A = reserve` 상태이지만 평시에는 민간 경제에서 빠지지 않는다.

즉 V0.32B의 상태 구분은 다음과 같다.

- `civilian`: 일반 Person
- `reserve`: 동원 명부에는 있으나 평시 민간 노동 유지
- `active`: 실제 현역, 민간 노동 이탈
- `wounded`: 후속 전투 시스템용
- `captured`: 후속 전투 시스템용

전략적 경계나 AI 정책 변화에 따라 현역 목표가 감소하면 기존 현역은 우선 예비군으로 전환된다.

---

## 5. 첫 MilitaryCohort

현역 Person이 1명 이상 존재하면 국가별로 첫 Cohort를 만든다.

기본 명칭:

- `<국가명> 제1주둔대`

Cohort는 `memberIds` 배열만으로 병력을 표현한다.

독립적인 `manpower=100` 같은 가상 병력 숫자는 생성하지 않는다.

따라서 다음 불변조건을 유지한다.

> Cohort member 수 = 실제 active Person 수

V0.32B에서는 모든 첫 Cohort가 국가의 core Settlement에 배치된다. 부대가 타일 사이를 실제 이동하는 시스템은 V0.32D 범위다.

Cohort가 관측하는 값:

- 위치 tileId
- 실제 Person 구성원
- training
- morale
- supply
- equipment (현재 0, V0.32C에서 활성화 예정)
- fortification (현재 0, 후속 버전에서 활성화 예정)

훈련도는 구성원의 Combat skill과 누적 복무기간을 바탕으로 관측한다.

---

## 6. Garrison

현역 Cohort가 존재하면 국가 core Settlement에 실제 `Garrison`을 생성한다.

현재 Garrison은 다음만 담당한다.

- 어느 타일에 병력이 주둔 중인지 저장
- 해당 타일의 Cohort ID 연결
- 향후 요새화와 방어시설 시스템의 부착점 제공

V0.32B에서는 지도 위 군사 마커를 아직 그리지 않는다. 지도에서 병력 위치를 지속적으로 관측하는 군사 레이어는 V0.32D에서 도입할 예정이다.

현재는 국가 → 군사 탭의 Cohort 카드에서 `(x,y)` 위치를 확인할 수 있다.

---

## 7. 국가 군사 UI

국가 화면의 `군사` 탭을 V0.32B 규칙에 맞게 갱신했다.

표시 항목:

- 동원 가능 Person
- 현역 / 목표 현역
- 예비 / 목표 예비
- 민간 노동 이탈 인원
- Cohort / Garrison 수
- 전략적 경계
- 동원 단계
- 군사 doctrine
- 누적 민간 노동 이탈 person-day
- 누적 동원 / 전역 수
- Cohort 위치
- 실제 구성 Person 이름
- 훈련 / 사기 / 보급

---

## 8. 신규 telemetry

국가 Snapshot / CSV / Devlog에 다음 필드를 추가한다.

- `militaryEligiblePopulation32B`
- `activeMilitary32B`
- `reserveMilitary32B`
- `militaryTargetActive32B`
- `militaryTargetReserve32B`
- `militaryLaborRemoved32B`
- `militaryLaborRemovedDays32B`
- `militaryMobilizations32B`
- `militaryDemobilizations32B`
- `militaryReserveRegistrations32B`
- `militaryCohorts32B`
- `garrisons32B`
- `militaryCohortMembers32B`
- `militaryAvgTraining32B`
- `militaryAvgMorale32B`
- `militaryAvgSupply32B`
- `militaryConcern32B`
- `mobilizationLevel32B`
- `militaryDoctrine32B`

주요 이벤트:

- `MILITARY_COHORT_FORMED32B`
- `GARRISON_ESTABLISHED32B`
- `MILITARY_MOBILIZED32B`
- `MILITARY_DEMOBILIZED32B`
- `MILITARY_RESERVE_REVIEW32B`

---

## 9. 저장 호환

새 저장 버전:

- `0.32B`
- localStorage key: `village-observer-v0-32b`

fallback은 V0.32A 이하 기존 저장을 유지한다.

V0.32B 세이브는 다음을 보존한다.

- Person 군복무 상태
- 현역/예비 등록 시점
- 군 복무 중 노동 제외 marker
- Cohort 실제 memberIds
- Garrison
- 군사 누적 통계

V0.32A 세이브를 불러오면 군사 기반은 그대로 승계되며, 다음 seasonal military review부터 B의 실제 동원이 시작된다.

---

## 10. 검증

### 정적 검증

- inline script: 49개
- Node syntax error: 0

### Chromium runtime

- 문서 title: `Village Observer V0.32B`
- version badge: `V0.32B`
- page error: 0
- console error: 0

### 강제 동원 표적 테스트

`ADMINISTRATION + WATCHTOWERS`를 가진 국가에 충분한 적격 성인을 제공한 뒤 military review를 실행했다.

결과:

- 실제 active Person 생성
- 실제 reserve Person 생성
- 현역 Person `memberIds`와 Cohort 구성원 일치
- Cohort 위치 = 국가 core tile
- Garrison 위치 = 국가 core tile
- 현역의 civilian facility slot 해제
- 현역 유지보수 queue = 0
- 현역 construction task = 없음
- 현역 행동 = `주둔군 복무 · 훈련과 경계 중`

한 현역이 macro day 1회를 통과했을 때 `militaryLaborRemovedDays32B`는 정확히 3 증가했다.

### 저장/재로드

동원 이후 V0.32B serialize → JSON round-trip → `World.from()`을 수행했다.

재로드 후 다음이 모두 유지됐다.

- active Person
- reserve Person
- 현역의 군사 노동 예약 상태
- Cohort
- Cohort memberIds
- Garrison
- 누적 군사 노동 이탈량

### 전역 테스트

`WATCHTOWERS` 조건을 제거해 목표 현역을 0으로 낮춘 뒤 military review를 수행했다.

- active → reserve 전환
- 기존 civilian assignment 복구
- Cohort 제거
- Garrison 제거

### 3년 강제 군사 스트레스 테스트

6개 국가 모두에 `ADMINISTRATION + WATCHTOWERS`를 부여하고 3년간 실행했다.

- 6개국 모두 Cohort/Garrison 유지
- 국가별 현역 1명, 예비 1~2명 수준
- 모든 국가에서 Cohort member 수 = 실제 active Person 수
- 현역 1명 국가의 누적 민간 노동 이탈 = 1,080 person-day
- page/runtime error = 0

이는 `360일 × 3년 = 1,080 person-day`와 정확히 일치한다.

---

## 11. V0.32B에서 의도적으로 하지 않는 것

다음은 아직 구현하지 않는다.

- 무기/군사장비 생산
- 병영/훈련장/무기고
- 부대의 지도상 이동
- 지도 군사 레이어
- 야전 요새화
- AI 방어선
- 전투
- 전사/부상/포로 발생

다음 단계 V0.32C에서는 기존 철경제를 군사장비와 연결하고 병영·훈련장·무기고 및 장비 충족도를 도입하는 것이 기본 방향이다.
