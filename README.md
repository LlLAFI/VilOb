# Village Observer V0.32A

## 군사사회 기반 · 지도/제련 보정

V0.32A는 V0.31 계열의 철경제를 닫고 V0.32 「군사사회 V1」로 진입하는 첫 기반 버전이다. 이 버전의 목적은 전투를 즉시 활성화하는 것이 아니라, 이후 동원·부대 이동·주둔·요새화·국지전이 실제 Person과 연결될 수 있도록 데이터 구조와 관측 기반을 먼저 고정하는 것이다.

동시에 V0.31I 첫 자연주행에서 확인된 두 잔여 문제를 수정한다.

1. 기본 지도에서 행정/상업 주요 아이콘이 구형 분석 레이어에 의해 한 번 더 렌더되어 겹쳐 보이는 문제
2. 철광석은 제련소까지 운송되지만 목재 연료가 제련소 정착지로 이동하지 않아 철 생산이 정지할 수 있는 문제

---

## 1. 지도 주요 아이콘 중복 제거

V0.31I에서는 일반 주거 아이콘을 제거하고 행정 중심지와 주요 상업시설만 기본 지도에 남겼다. 그러나 초기 지도 renderer와 V0.15 분석 레이어의 `redrawBoundariesAndIcons()`가 모두 같은 주요 아이콘을 그리는 경로가 남아 있었다.

특히 시장·교역소가 존재하는 타일에서 같은 위치에 아이콘이 두 번 그려져 집/상점 모양이 겹쳐 보일 수 있었다.

V0.32A에서는 icon ownership을 다음처럼 정리했다.

- 기본 지도: primary map renderer만 주요 아이콘을 그린다.
- 인구/자원/건물/물류 레이어: primary renderer는 주요 아이콘을 생략하고, 분석 overlay가 마지막에 한 번만 다시 그린다.
- 국경선과 선택 타일 흰색 outline은 기존처럼 유지한다.

따라서 어떤 지도 레이어에서도 같은 주요 거점 아이콘이 중복 렌더되지 않는다.

표적 Canvas 테스트에서 비행정 시장 타일을 강제로 만든 뒤 기본 지도를 다시 렌더했을 때 해당 타일의 주요 아이콘 `fillText()` 호출은 정확히 1회였다.

---

## 2. 제련소 목재 연료 물류

기존 V0.31 산업 물류는 다음 세 경로를 지원했다.

- `ORE_TO_SMELTER`: 철광석 → 제련소
- `IRON_TO_SMITHY`: 철 → 대장간
- `TOOLS_DISTRIBUTION`: 도구 → 각 정착지

하지만 제련에는 철광석뿐 아니라 목재 연료가 필요하다. 제련소가 있는 Settlement에 목재가 부족하면 철광석과 철공 인력이 모두 있어도 생산이 정지할 수 있었다.

V0.32A에서는 `industrialFlows31()`에 다음 경로를 추가했다.

- `WOOD_TO_SMELTER_FUEL`: 목재가 18 미만인 제련소 Settlement에, 목재 24 초과의 다른 실거주 Settlement에서 연료를 운송한다.

이 운송은 새로운 자원 생성이 아니다. 기존 `move31()`을 그대로 사용하므로 실제 Settlement stock을 출발지에서 빼고 목적지에 넣으며, 기존 내부 물류 capacity/거리 제약을 그대로 따른다.

표적 테스트에서는 제련소 목재 0 상태에서 `WOOD_TO_SMELTER_FUEL` 이벤트가 발생했고 실제로 16.2 목재가 이동했다. 이후 철공 Person을 제련소에 배치한 생산 테스트에서 철광석과 목재가 실제로 소비되고 철 0.616이 생산되었다.

---

## 3. Person-backed 군사 모델의 원칙

V0.32 이후 군사 시스템의 핵심 원칙은 다음과 같다.

> MilitaryCohort는 가상 병력을 생성하는 객체가 아니다. 실제 Person ID를 묶어서 성능 효율적으로 계산하는 집단 단위다.

따라서 V0.32A에서는 `manpower=100` 같은 독립적인 가상 병력 수를 생성하지 않는다. Cohort의 실제 구성원은 `memberIds`로만 관리한다.

향후 전투에서 사망자가 발생하면 해당 member Person이 실제로 사망하며 국가·세계 인구도 함께 감소하는 구조를 전제로 한다.

자동기계나 Person과 독립된 전력 규모는 훨씬 이후 시대의 별도 시스템으로 남긴다.

---

## 4. Person 군복무 상태 기반

모든 Person에 다음 필드를 준비한다.

- `militaryStatus32A`
  - `civilian`
  - `reserve`
  - `active`
  - `wounded`
  - `captured`
- `militaryCohortId32A`
- `militaryWoundedUntil32A`
- `militaryCapturedBy32A`
- `militaryServiceDays32A`

V0.32A에서는 자동으로 reserve나 active 상태로 바꾸지 않는다. 신규 세계와 V0.31I 이하 마이그레이션 세계는 모두 civilian에서 시작한다.

동원 가능 Person은 현재 관측용으로 다음 조건을 사용한다.

- 생존
- 18~50세
- 건강 45 이상
- 개척(PIONEER) 임무 중이 아님
- wounded/captured 상태가 아님

성별 제한은 두지 않는다.

이 조건은 V0.32B의 실제 동원 AI를 만들기 전에 장기 데이터를 관측하기 위한 첫 기준이며, 필요하면 B에서 조정할 수 있다.

---

## 5. MilitaryCohort 기반 구조

V0.32A에서 `MilitaryCohort` 클래스를 추가한다.

주요 필드:

- `id`
- `nationId`
- `name`
- `memberIds`
- `tileId`
- `homeTileId`
- `status`
- `training`
- `morale`
- `equipment`
- `supply`
- `fortification`
- `createdDay`

특히 `tileId`를 처음부터 포함한다. 아직 V0.32A에서는 부대를 실제로 만들거나 이동시키지 않지만, 이후 부대가 지도 위 어느 타일에 존재하는지 계속 관측하기 위한 구조를 미리 고정한다.

`fortification` 역시 후속 패치의 야전 요새화에 사용할 예약 필드다.

---

## 6. Garrison 기반 구조

`Garrison` 클래스도 추가한다.

주요 필드:

- `id`
- `nationId`
- `tileId`
- `cohortIds`
- `status`
- `fortification`
- `createdDay`

Garrison은 Settlement/요새/전략타일에 고정 또는 장기 주둔하는 군사 존재를 위한 기반이다.

V0.32A에서는 자동으로 생성하지 않는다.

---

## 7. 군사 UI V1 기반

국가 탭에 `군사` subtab을 추가한다.

현재 표시값:

- 동원 가능 Person
- 현역
- 예비
- Cohort 수
- 주둔지 수
- 부상/포로 수
- 현재 동원 단계

V0.32A에서는 현역/예비/Cohort/Garrison이 모두 0인 것이 정상이다.

군사 탭은 현재 시스템이 Person-backed 방식이며 아직 자동 동원·전투를 시작하지 않았다는 점을 명시한다.

---

## 8. Telemetry / Snapshot / CSV

국가 단위로 다음 필드를 추가한다.

- `militaryEligiblePopulation32A`
- `activeMilitary32A`
- `reserveMilitary32A`
- `woundedMilitary32A`
- `capturedMilitary32A`
- `militaryCohorts32A`
- `garrisons32A`
- `militaryCohortMembers32A`
- `militaryFrameworkReady32A`
- `mobilizationLevel32A`

세계 단위에는 합계 값을 기록한다.

Devlog `worldSummary`에는 다음 설계 의도를 명시한다.

- `militaryFramework32A`
- `militaryPopulationIntegrity32A`
- `smelterFuelLogistics32A`
- `mapIconDedup32A`

---

## 9. 저장/호환성

세이브 버전은 `0.32A`다.

저장 데이터에는 다음 메타가 들어간다.

```json
{
  "version": "0.32A",
  "v32a": {
    "revision": "military-foundation-map-smelter-fuel",
    "militaryFramework": true,
    "personBackedCohorts": true,
    "battlesEnabled": false
  }
}
```

V0.32A 세이브를 다시 불러올 때:

- Person의 군복무 상태
- Cohort member ID
- Cohort 위치
- Garrison 구성

을 복원한다.

V0.31I 이하 세이브는 기존 fallback chain으로 불러오고 모든 생존 Person을 civilian 상태로 초기화한다.

---

## 10. 이번 버전에서 의도적으로 하지 않는 것

V0.32A에는 다음 기능을 넣지 않았다.

- 자동 동원
- reserve/active 자동 배정
- 병영·훈련장·무기고
- 군사장비 생산
- 부대 지도 이동
- 군사 지도 레이어
- AI 방어선
- 야전 요새화
- 실제 전투
- 사망/부상/포로 처리

이들을 한꺼번에 활성화하지 않는 이유는 이후 데이터에서 군사 때문에 기존 경제·인구 시스템이 변화했는지 원인을 단계별로 추적하기 위해서다.

---

## 11. 검증 결과

### Static

- inline script: 48개
- Node `--check`: 오류 0

### Chromium 기본 실행

- Title: `Village Observer V0.32A`
- Badge: `Village Observer · V0.32A`
- 군사 subtab: 1개
- serialize version: `0.32A`
- page error: 0
- console error: 0

### 지도 아이콘 중복 표적 테스트

강제로 일반 소유 타일에 시장을 만들고 기본 지도를 재렌더했다.

- 해당 좌표의 주요 아이콘 호출: 1회
- 겹침 재현: 없음

### 제련소 연료 물류 표적 테스트

- 제련소 목재: 0
- 다른 실거주 Settlement: 목재 충분
- 결과: `WOOD_TO_SMELTER_FUEL` 발생
- 이동량: 16.2

추가 제련 생산 테스트:

- 철광석 감소
- 목재 감소
- 철 0.616 생산
- Person 행동: `제련소에서 철광석을 제련 중`

### Person-backed Cohort 저장 테스트

검증을 위해 실제 Person 1명을 임시 active로 변경하고 Cohort/Garrison을 만든 뒤 serialize → load했다.

- military status: active 유지
- `militaryCohortId32A`: 유지
- Cohort: 1
- Garrison: 1
- Cohort member: 실제 Person ID 1개 유지

### V0.31I → V0.32A 마이그레이션

- V0.32A attach 성공
- 기존 Person: civilian 초기화
- Cohort: 0

### 자연주행 회귀

새 19×19 세계를 21년 1분기 1일까지 자연주행했다.

- simulation advance: 7,200 step
- 활성 국가: 6
- 폐허: 0
- 인구: 191
- 군사 active: 0
- civilian 외 군사상태: 0
- Cohort: 0
- Garrison: 0
- 관측 동원가능 Person: 39
- Gold trade audit checks: 7
- mismatch: 0
- page error: 0
- console error: 0

즉 V0.32A 군사 기반 추가만으로 기존 사회가 자동 군사화되거나 경제 규칙이 변하지 않았다.

---

## 12. V0.32B 인계점

V0.32B의 주제는 **실제 Person 동원 + 최초 Cohort/Garrison 생성**으로 잡는다.

A에서 이미 다음 준비가 완료되어 있다.

- Person 군복무 상태
- 동원 가능 인구 계산
- Person ID 기반 Cohort
- 타일 위치 필드
- Garrison 구조
- 향후 fortification 필드
- 군사 UI/Telemetry 기본 슬롯

따라서 B에서는 이 구조 위에서 평시 군사정책과 실제 노동력 이탈을 처음 활성화하면 된다.
