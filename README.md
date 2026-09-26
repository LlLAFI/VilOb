# Village Observer V0.32D3

**릴리스명:** 주거-확장 교착 해소 · Expansion blocker 관측 · Formation/행정 경계 마감 · 창고 산업자원 저장  
**버전:** `0.32D3`  
**기준 버전:** `V0.32D2`  
**세이브 키:** `village-observer-v0-32d3`

V0.32D3는 D 계열의 안정화/마감 패치다. D2 장기주행에서 확인된 **과밀 Settlement가 자기 타일의 공간 부족 때문에 HOUSING을 반복 실패하고, 토지정비가 개척에 필요한 Gold·석재·목재까지 소모해 영토 확장도 함께 막는 교착**을 해소한다.

또한 `eligible frontier`와 실제 확장 가능 상태를 분리하여 최종 blocker를 관측하고, Formation의 예정 경로/과거 흔적 표현을 재설계하며, 행정권 경계를 도로와 구분되는 시각 계층으로 정리한다. 기존 고대 창고에는 철광석 저장 한도를 통합한다.

이번 버전에서도 **전투·사상자·포로·점령·야전요새는 추가하지 않는다.** D3는 V0.32E로 넘어가기 전 공간·행정·이동·산업 시스템을 닫는 버전이다.

## 1. 주거-확장 교착 해소

### 1.1 주거 해결 범위를 현재 Settlement 밖으로 확장

주거 압박이 발생하면 D3는 현재 타일에서 바로 실패하지 않고 다음 순서로 실제 해결 공간을 찾는다.

1. 같은 생활권의 다른 Settlement/타일
2. 같은 행정권의 다른 Settlement/타일
3. 가까운 자국 타일
4. 그 밖의 자국 Settlement

후보는 단순 소유 여부가 아니라 **실제 여유 주거 수용력, 남은 건축공간, 토지정비 잠재공간, 진행 중 프로젝트 충돌**을 확인한다.

### 1.2 실제 빈 주거가 있으면 Person을 내부 이주

다른 Settlement에 실제 빈 수용력이 있으면 신규 건설보다 먼저 Person의 `homeTileId`를 옮겨 압박을 분산한다.

- 개척 중 Person과 현역 군사 Person은 긴급 주거 이주 대상에서 제외한다.
- 한 번의 주거 해소 행동에서 필요한 인원과 목적지 실제 여유 수용력 범위 안에서만 이동한다.
- 신규 Person이나 가상 주거는 생성하지 않는다.
- 누적 이주 인원은 `housingRelocations32D3`로 관측한다.
- Devlog 이벤트: `HOUSING_RELOCATION32D3`

### 1.3 다른 Settlement의 건축공간 사용

빈 주거만으로 해결할 수 없으면 우선순위 범위 안에서 다음을 시도한다.

1. 기존 `house → row_house` 업그레이드
2. 기존 `row_house → collective_house` 업그레이드
3. 실제 남은 건축공간에 새 `house` 프로젝트
4. 마지막으로 주택을 지을 잠재공간이 남은 타일의 토지정비

성공한 원격 해결은 `HOUSING_REMOTE_ACTION32D3`로 기록한다.

### 1.4 장기 과밀 시 개척/주거 안전재고 예약

한 Settlement가 다음 중 하나를 만족한 상태로 약 **180 calendar days** 지속되면 안전재고 예약이 활성화된다.

- 주거점유율 `120% 이상`
- 주거 부족 `2명 이상`

예약량:

- Wood **20**
- Stone **8**
- Gold **8**
- Food **12**

이 값은 자원을 새로 만들거나 별도 보관소로 이동시키는 것이 아니다. 기존 AI reserve에 최소 안전선으로 반영하고, 일반 토지정비가 Wood/Stone/Gold를 예약선 아래로 떨어뜨리려 하면 해당 착수를 보류한다.

이미 진행 중인 주거용 토지정비를 무한 중복시키지도 않는다. 자원 예약에 의해 토지정비가 막힌 횟수는 `housingReserveBlocks32D3`에 누적된다.

## 2. 확장 실패 원인 blocker

D3는 `frontier가 존재한다`와 `지금 실제로 개척 프로젝트를 시작할 수 있다`를 분리한다.

주요 최종 blocker:

- `INACTIVE`: 비활성 국가
- `SURVIVAL`: Recovery/Survival 상태
- `NO_CANDIDATE`: 중립 frontier 또는 실제 개척 후보 없음
- `PROJECT_CAP`: 동시 개척 프로젝트 상한 도달
- `PIONEER`: 지역 개척자 pool 부족
- `FOOD`: 지역/국가 식량 안전조건 부족
- `WOOD`: 목재 부족
- `STONE`: 석재 부족
- `GOLD`: Gold 부족
- `DENSITY`: 확장 밀도 조건 미달
- `SCORE`: 사전 조건상 가능했지만 기존 D2 개척 AI의 최종 선택/점수 단계에서 시작하지 못함
- `NONE`: 현재 관측 가능한 blocker 없음 또는 확장 시작 성공

D3는 raw frontier 수, 적격 개척 source 수, 실제 후보 타일 수, 현재/최대 프로젝트 수, pioneer pool과 함께 blocker를 저장한다.

- blocker 변경: `EXPANSION_BLOCKER_CHANGED32D3`
- 개척 시도: `EXPANSION_ATTEMPT32D3`
- raw frontier가 남아 있는 동일 blocker가 360일 이상 지속: `EXPANSION_STALL32D3`

## 3. Formation 경로 표현 재설계

### 3.1 D2 장거리 점선 예정경로 제거

군사 레이어를 그릴 때 D2의 전체 planned route 점선과 D2 trail을 임시로 숨긴 뒤, D3 전용 표현을 마지막에 그린다.

- 현재 Formation 표식 `▲N`은 유지
- 목표 `◎` 유지
- 현재 위치 앞 **최대 5타일**만 chevron으로 표시
- 각 chevron은 segment 방향을 `atan2`로 계산해 회전
- 도로의 연속 선형 표현과 명확히 분리

### 3.2 최근 실제 이동 흔적

D3 Formation 관측 상태는 최근 흔적을 다음 형태로 저장한다.

```text
{ tileId, movedCal }
```

- 실제 `tileId`가 바뀐 경우에만 흔적 추가
- 최근 **2타일**만 유지
- 이동 후 **30 calendar days**만 유지
- 주둔 중에는 새 흔적이 추가되지 않음

### 3.3 이동 판정 시각과 실제 이동 시각 분리

D2의 `lastMoveCal`은 cooldown과 호환성을 위해 그대로 사용한다. D3는 별도 관측 상태에 다음 두 값을 유지한다.

- `lastMoveDecisionCal32D3`: D2 이동 판정/cooldown 기준 시각
- `lastActualMoveCal32D3`: Formation `tileId`가 실제로 마지막 변경된 시각

따라서 목표 도착/이동 실패처럼 판정만 갱신된 상태와 실제 이동을 구별할 수 있다.

## 4. 행정권 경계 가독성

행정 레이어는 기존 행정권 색상과 중심 표시는 유지하면서, 내부 권역 경계를 추가로 강조한다.

- 기본 지도와 도로를 먼저 렌더링
- 같은 국가 내부에서 **서로 다른 행정권이 맞닿는 edge만** 탐색
- 해당 edge에 어두운 외곽선 + 밝은 내부선의 **2중 실선** 적용
- 같은 행정권 내부 타일 사이에는 경계선을 추가하지 않음
- 다른 국가와 맞닿는 edge는 행정권 경계가 아니라 국가 국경이 담당
- 국가 국경을 마지막에 다시 그려 가장 강하게 유지

시각 계층:

**국가 국경 > 행정권 경계 > 도로 > 일반 타일선**

## 5. 고대 창고 산업자원 저장

별도 야적장 건물은 추가하지 않는다. 기존 `warehouse`와 legacy `storehouse`의 `storage`에 다음 확장을 적용한다.

```text
iron_ore: +120
```

현재 철광석 저장 구조:

- Settlement 기본 철광석 cap: **30**
- 고대 창고 1개 추가 시: **150**
- 증가량: **+120**

철광산·제련소 등 생산시설 자체 buffer는 유지되므로 창고가 철산업의 강제 선행조건이 되지 않는다. 확장 정의는 `INDUSTRIAL_STORAGE_EXTENSION32D3` registry로 분리해 향후 철·도구 등 비식량 자원을 같은 방식으로 연결할 수 있다.

## 6. Snapshot / CSV / Devlog 관측값

국가별 D3 Snapshot/CSV 필드:

- `housingPressureMax32D3`
- `housingReserveActive32D3`
- `housingReserveDays32D3`
- `housingRelocations32D3`
- `housingActions32D3`
- `housingReserveBlocks32D3`
- `expansionBlocker32D3`
- `expansionBlockerDays32D3`
- `eligibleFrontierTiles32D3`
- `eligibleFrontierSources32D3`
- `frontierCandidateTiles32D3`
- `frontierProjects32D3`
- `frontierProjectCap32D3`
- `formationTrailVisible32D3`
- `formationLastActualMoveCal32D3`
- `warehouseIronOreBonus32D3`

Global Snapshot에는 활성 housing reserve 국가 수, 누적 주거 이주/해결 행동, 현재 보이는 Formation trail 수, 창고당 철광석 bonus를 추가한다.

Devlog JSON `worldSummary`에는 D3 주거 해결 방식, expansion blocker, Formation 관측, 행정권 경계, 창고 산업자원 저장 구조를 명시한다.

## 7. 세이브 호환성

- 신규 세이브 버전: `0.32D3`
- 신규 localStorage key: `village-observer-v0-32d3`
- localStorage fallback: D2 → D1 → D → C2 → 기존 호환 순서 유지
- D3 save는 Village별 `v32d3Housing`, `v32d3Expansion`, `v32d3Formation` 상태를 저장
- D3 `World.from()`은 D3 save를 D2 migration chain에 통과시킨 뒤 D3 상태를 재부착
- 실제 D2 형식 save → D3 load → D3 재직렬화 회귀 테스트 통과

## 8. 마감 검증 결과

### 8.1 과밀 Settlement → 다른 Settlement 빈 주거

강제 시나리오에서 원점 Settlement의 점유율을 **165%**로 만들고, 같은 국가의 다른 Settlement에 실제 빈 주거를 제공했다.

- D3 housing pulse: 작동
- 목적지 실제 거주자: `0 → 3명`
- Wood / Stone / Gold / Food: 변화 없음

즉 현재 Settlement가 포화되어도 국가 내부의 실제 빈 주거를 사용해 교착에서 빠져나온다.

### 8.2 다른 Settlement 건축공간 사용

목적지의 빈 주거를 없애고 건축공간만 제공한 시나리오에서 D3는 **다른 Settlement에 실제 house construction project**를 생성했다.

### 8.3 확장 blocker

실제 frontier와 적격 source가 있는 상태에서 각각 하나의 자원만 0으로 만든 결정적 테스트 결과:

- Wood 부족 → `WOOD`
- Stone 부족 → `STONE`
- Gold 부족 → `GOLD`

Gold 부족 시나리오에서는 raw frontier 4, 적격 source 1, 실제 후보 4인 상태에서도 최종 blocker가 `GOLD`로 기록됐다.

### 8.4 안전재고 보존

180일 이상 장기 과밀을 강제한 뒤 Wood 25 / Stone 10 / Gold 10에서 일반 토지정비를 시도했다.

- reserve 활성: `true`
- reserve: Wood 20 / Stone 8 / Gold 8 / Food 12
- 토지정비 시작 결과: `false`
- Wood / Stone / Gold: 변화 없음
- 토지정비 project 수: 변화 없음
- `housingReserveBlocks32D3`: `+1`

### 8.5 고대 창고 철광석 cap 및 저장 보존

- 창고 없음: iron ore cap 30
- 창고 1개: iron ore cap 150
- 증가량: +120
- 기존 iron ore stock 17을 둔 상태에서 창고 cap을 변경해도 stock 17 유지

### 8.6 Formation 이동 흔적

Formation을 실제 인접 타일로 이동시킨 결정적 테스트에서:

- 이전 타일이 `{tileId, movedCal}`로 recent trail에 기록됨
- `lastActualMoveCal32D3`와 `lastMoveDecisionCal32D3` 모두 별도 값으로 유지됨

또한 오래된 흔적을 섞은 테스트에서 30일 초과 항목은 제거되고 최근 2개만 남았다.

### 8.7 Canvas 시각 검증

도로가 촘촘한 강제 A/B/C 행정권 구역에서 실제 Canvas를 렌더링해 확인했다.

- 도로 위에 행정권 2중 실선이 유지됨
- 같은 행정권 내부 타일에는 불필요한 경계선 없음
- 국가 국경이 최상위 시각 계층 유지
- 군사 레이어에서 D2 전체 점선 경로가 사라짐
- Formation 앞쪽 chevron과 `◎` 목표가 도로와 별도 시각 언어로 표시됨

### 8.8 회귀/런타임

최종 작업본 기준:

- 56개 inline script 전부 `node --check` 통과
- 브라우저 smoke: page error 0 / console error 0
- D2 save → D3 load 성공
- D3 roundtrip version `0.32D3`
- 신규 세계 720 sim-day 자동 진행 성공
- 720일 후 6개 국가 활성 상태 유지
- Snapshot CSV D3 필드 확인

## 9. D3 범위 제한

이번 버전에서 의도적으로 추가하지 않는 것:

- 전투 판정
- Formation 간 교전
- 사상자·포로·점령
- 방어시설/야전요새
- 신규 산업 생산체인
- 자원 생성/무료 건설
- D2 행정권 코드 체계 재번호화

이 항목들은 V0.32E 이후 군사 기능 확장과 분리한다.
