# Village Observer V0.33I1 — Person Equipment + Military Inventory Foundation

> **기준선:** V0.33H2. H 계열의 Formation Combat Power/지도 렌더링/전쟁 규칙을 유지하면서, V0.32C 이후의 추상 `equipmentStock`을 실제 Person 장비와 지역별 군수 재고로 전환하는 I 계열 첫 단계다.
>
> **I1 범위:** 장비 Registry, Person `weapon/armor` 슬롯, 정수 재고, 실제 자원+Person 노동 기반 제작, 지역 배급/회수, H2 save migration, telemetry. **무기/갑옷의 질적 전투효과와 OPENING/CONTACT/MELEE는 I2에서 활성화한다.**

## 1. I1 핵심 구조

I1의 군수 흐름은 다음으로 바뀐다.

`실제 자원 → Equipment Work Order → 실제 Person 노동 → 지역별 정수 장비 재고 → 실제 Person 지급 → Formation 집계`

기존의 국가 단일 `v32cMilitary.equipmentStock` 신규 생산 경로는 I1 활성 상태에서 중지한다. 과거 C/F/H 계열의 Cohort `equipment` 필드는 호환 목적으로 남지만, 값의 출처는 더 이상 추상 stock이 아니다.

### Person 장비 슬롯

현역 Person은 다음 두 슬롯을 가진다.

```js
militaryEquipment33I1: {
  weaponId: "iron_spear",
  armorId: "padded_armor"
}
```

무기 슬롯이 `null`이면 생산/재고 아이템을 만들지 않고 전투상 **`improvised_club`(임시 곤봉)** fallback을 사용한다. 곤봉은 정식 무기 보급률에 포함되지 않는다. 갑옷 슬롯이 `null`이면 무갑 상태다.

장비 schema는 `slot` 기반 Registry이므로 향후 `shield / mount / ammo / support / siege` 같은 슬롯을 추가할 수 있다.

## 2. I1 장비 Registry

| 장비 | 슬롯 | 생산 계열 | 해금 | Wood | Iron | Tools | 노동일 |
|---|---|---|---|---:|---:|---:|---:|
| 임시 곤봉 | weapon | fallback | 자동 | - | - | - | - |
| 기초 창 | weapon | 수공/목공 | 기본 | 0.60 | - | 0.02 | 10 |
| 투창 | weapon | 수공/목공 | 기본 | 0.40 | - | 0.02 | 8 |
| 활 | weapon | 목공 | CARPENTRY | 0.70 | - | 0.05 | 18 |
| 철제 창 | weapon | Smithy | IRONWORKING | 0.50 | 0.30 | 0.05 | 20 |
| 철제 검 | weapon | Smithy | IRONWORKING | 0.10 | 0.55 | 0.08 | 28 |
| 철제 도끼 | weapon | Smithy | IRONWORKING | 0.25 | 0.50 | 0.07 | 24 |
| 직물 방어구 | armor | 수공 | 기본 | - | - | 0.03 | 16 |
| 보강 경갑 | armor | Smithy | IRONWORKING | 0.15 | 0.20 | 0.05 | 24 |
| 철제 찰갑·비늘갑 | armor | Smithy | IRONWORKING | - | 0.60 | 0.10 | 38 |
| 초기 사슬갑옷 | armor | Smithy | ADVANCED_FORGING | - | 1.00 | 0.16 | 60 |

`melee / ranged / penetration / reach / rangedSustain / protection / mobility` 값도 Registry에 이미 기록되어 있지만 **I1 전투 계산에서는 사용하지 않는다.** 이 값들은 I2의 타일 내부 전투 입력으로 예약되어 있다.

## 3. 지역별 군수 재고

장비는 국가 전체에서 순간적으로 공유되지 않고 supply-node별 정수 재고로 저장된다. 현재 I1의 supply node는 자국의 인구가 있는 정착 타일, 수도, 병영/무기고가 있는 타일이다.

저장 용량은 다음과 같다.

- 일반 정착 supply node: 기본 **6 item**
- 고대 병영: **+12 item**
- 고대 무기고: **+72 item**

기존 `Armory 36 abstract kits`를 무기+갑옷 두 physical item으로 해석해 `+72`로 전환했다.

무기고가 있는 경우, 30 calendar-day 저빈도 군수 pulse에서 다른 정착지 재고를 **source당 최대 4 item**까지 실제 재고 이동으로 집중할 수 있다. 경로가 없는 장비는 이동하지 않는다. 이 이동은 장비의 소유권만 보존적으로 바꾸며 새 장비를 생성하지 않는다.

## 4. 실제 Person 노동 기반 제작

I1은 V0.32C의 별도 generic equipment 생산 함수를 중지한다. 과거에는 Smithy 노동자가 평소 도구를 만들면서 별도 군수 provision도 동시에 제공할 수 있었지만, I1에서는 장비 자체가 Work Order를 가진다.

- 기초 창/투창/직물 방어구: 해당 정착지의 목수 또는 건축가가 제작 가능
- 활: 목수 제작
- 철제 무기/갑옷: Smithy에 실제 근무하는 철공이 제작
- 작업 1회는 기존 calendar 모델과 맞춰 **3 adult-days**의 노동을 누적
- 장비 제작에 참여한 Person은 그 cycle 동안 기존 목재 채취/도구 생산을 하지 않는다
- 필요한 실제 Wood/Iron/Tools는 주문 시작 시 network에서 보존적으로 확보
- 주문이 완성되면 장비 **정수 1개**가 해당 생산지 재고에 생성
- 작업자가 720 calendar-day 동안 전혀 없어 주문이 고착되면 예약 자원을 반환하고 주문을 취소

따라서 Smithy가 철제 창을 만드는 동안 해당 철공의 도구 생산량이 실제로 줄어든다.

## 5. 공통 AI 군수정책

I1에서는 아직 AIProfile별 무기 doctrine을 만들지 않는다. 모든 국가는 공통 기본 목표를 사용한다.

- 정식 무기 목표: 예상 현역 목표의 약 **115%**
- 갑옷 목표: 예상 현역 목표의 약 **75%**
- 대략적인 무기 구성 목표: 근접 65~70% / 원거리 약 22% / Hybrid 약 12%
- 철기 이전: 기초 창 + 활 + 투창
- 철기 이후: 철제 창 중심, 일부 철제 검/철제 도끼
- 갑옷은 직물 → 보강 경갑 → 철제 찰갑/비늘갑 → 제한적 초기 사슬갑옷 순으로 실제 자원 여건에 따라 생산

목표를 충족한 뒤에도 legacy/기초 장비가 많이 남고 저장 여유가 있으면 제한적으로 상위 장비 교체 생산을 진행한다. Profile별 장비 선호는 I3 범위다.

## 6. 배급·재장비·회수

현역 Person은 **현재 물리적으로 위치한 자국 supply node**의 재고만 지급받을 수 있다. 적지 깊숙한 Formation은 본국에서 장비가 완성됐다고 즉시 장비가 바뀌지 않는다.

- 정식 무기가 없는 현역은 재고가 없으면 임시 곤봉 fallback
- local inventory에 장비가 있으면 무기/갑옷 지급
- 상위 장비로 교체하면 기존 장비는 같은 지역 재고로 회수
- 원거리/Hybrid 무기는 가능하면 역할을 유지한 채 교체
- 전사/부상/동원해제 Person의 장비는 I1에서는 유실시키지 않고 회수 가능한 자국 재고로 반환

전장 유실, 노획, 파손/내구도는 이번 범위가 아니다.

## 7. H2 Combat Power 호환 bridge

I1에서는 H2 전투 공식을 아직 제거하지 않는다.

기존 H2:

`manpower × (0.42 + training/250 + equipment/250 + supply/280 + morale/400) × commander multiplier`

여기서 Cohort `equipment` 값만 **해당 Cohort 실제 memberIds의 Person 장착률**에서 다시 계산한다. 국가 요약 UI는 동일 공식을 전체 현역에 적용한 값을 사용한다.

`Compatibility Equipment Coverage = 0.65 × Formal Weapon Coverage + 0.35 × Armor Coverage`

예:

- 정식 무기 100%, 갑옷 0% → Equipment 65
- 정식 무기 100%, 갑옷 100% → Equipment 100
- 무기 없음(곤봉 fallback)은 Formal Weapon Coverage 0

따라서 **I1은 실물 장비 경제를 먼저 검증하는 단계**다. 철제 검과 기초 창의 질적 전투력 차이는 아직 없으며 I2에서 `equipment/250` bridge를 제거한다.

## 8. H2 Save migration

H2 이하 save의 `v32cMilitary.equipmentStock`은 I1 최초 attach에서 한 번만 migration한다.

- generic stock을 가장 가까운 정수 kit로 결정적 반올림
- 1 kit = `legacy_weapon` 1 + `legacy_armor` 1
- 기존 현역에게 kit 단위로 우선 지급
- 남는 kit는 수도/무기고 supply inventory에 저장
- migration 후 옛 `equipmentStock`은 0으로 정리
- 반올림 차이는 `migrationRoundingDelta33I1`에 기록하며 nation당 최대 ±0.5 kit
- 새 게임은 legacy item을 절대 생산하지 않는다

legacy weapon/armor는 실제 신형 장비가 생산되면 자연스럽게 회수·교체된다.

## 9. 관측 UI / Telemetry

군사 탭 최상단에 **`🗡 I1 실제 군사 장비`** 블록을 추가한다.

- 정식 무기 보급률
- 갑옷 보급률
- H2 호환 Equipment Coverage
- 곤봉 fallback 현역 수
- 재고 item / 총 저장용량
- 진행 중 Work Order
- 현역 무기/갑옷 구성
- 종류별 재고
- 누적 제작/지급/회수/재장비/legacy migration
- 보존 오류 수

H2 타일 Formation 카드에도 실제 무기/갑옷 구성을 한 줄 추가한다.

주요 telemetry:

- `formalWeaponCoverage33I1`
- `armorCoverage33I1`
- `compatEquipmentCoverage33I1`
- `clubFallback33I1`
- `equipmentProduced33I1`
- `equipmentIssued33I1`
- `equipmentReturned33I1`
- `equipmentReequipped33I1`
- `equipmentInventory33I1`
- `equipmentInventoryItems33I1`
- `equipmentWorkOrders33I1`
- `equipmentLogisticsMoves33I1`
- `legacyKitsMigrated33I1`
- `migrationRoundingDelta33I1`
- `equipmentConservationErrors33I1`

I1에서는 전장 손실이 없으므로 아이템별로 다음 invariant를 검사한다.

`누적 실제 생산 + legacy migration = 현재 Person 장착 + 현재 inventory`

## 10. I1에서 의도적으로 하지 않는 것

- OPENING / CONTACT / MELEE
- 활의 선제사격 및 지속 지원사격
- Reach / Screen
- Penetration / Protection
- 무기 종류별 실제 공격력 차이
- 갑옷 종류별 실제 사상률 차이
- Composite Combat Power
- shield / mount / ammo / support / siege 슬롯의 실제 활성화
- 장비 내구도 / 전장 유실 / 노획
- AIProfile별 무기 선호
- 중세 장비

이 항목들은 I1 군수경제가 보존적으로 작동하는지 확인한 뒤 I2/I3에서 단계적으로 활성화한다.

## Save / compatibility

- 현재 save key: `village-observer-v0-33i1`
- fallback: `0.33H2` → `0.33H1` → `0.33H` → `0.33G3A`
- `ai-editor.html`과 AIProfile JSON v1은 변경하지 않는다.

## I1 검증 포인트

- H2 save generic equipment가 legacy kit로 변환된 뒤 기존 장비 coverage가 대략 보존되는가.
- 정식 무기 미보급 현역이 곤봉 fallback으로 표시되는가.
- Smithy/목공 노동자가 장비 제작 중 기존 생산을 동시에 하지 않는가.
- 생산비가 실제 Wood/Iron/Tools에서 차감되고 장비는 정수 1개 단위로 생성되는가.
- 원거리 Formation이 자국 supply node에 도착하기 전에는 신형 장비가 순간 지급되지 않는가.
- 재장비 시 구형 장비가 삭제되지 않고 local inventory로 회수되는가.
- 부상/전사/동원해제 장비가 I1 규칙대로 회수되는가.
- 장기 run에서 `equipmentConservationErrors33I1 = 0`을 유지하는가.
- H2의 Formation Combat Power/전쟁/Engagement 자체 공식은 그대로 유지되는가.

---

## Historical baseline — V0.33H2

> **기준선:** V0.33H1. H/H1의 canonical Formation Combat Power와 전투 공식은 그대로 유지하고, H1 PC 자연주행에서 확인된 평시 reference manpower 오판정·지도 라벨 미세배치·타일 Inspector 누적 UI를 정리하는 후속 패치다.
>
> **밸런스 원칙:** `BATTLE33` 전투력, 지형/요새/순간 난수, 사상률, Engagement, War Intent, AIProfile, 경제·연구 공식은 변경하지 않는다.

## H1 자연주행 피드백 근거

H1 PC 자연주행은 약 79년까지 진행되었고, 해당 런에서는 실제 선전포고/전투가 발생하지 않았다. 따라서 H1의 전투 중 `±Δ` 효과는 이번 런에서 추가 자연검증되지는 않았지만, 평시 Formation 상태와 지도/Inspector 표현을 장기간 관찰할 수 있었다.

- H에서 사실상 전 Formation이 빨간 `!`이던 문제는 H1에서 해소되었고, 장기 snapshot 관측의 다수는 정상(초록) 상태로 분리되었다.
- 다만 일부 국가의 Formation은 전투가 전혀 없었는데도 과거의 더 큰 `referenceManpower`가 남아 평시 동원해제/군축을 전투 손실처럼 해석했다.
- 지도에서 병력 수와 Combat Power의 분리는 읽기 좋아졌지만, 병력 수가 단순 텍스트라 규모 정보의 시각적 우선순위가 약했고 상태 원이 Combat Power 숫자와 다소 가까웠다.
- 타일 Inspector에는 0.32D~0.33H 동안 추가된 `행정권`, `행정 상태`, `이동 관측`, `D3 공간·확장 진단`, `Formation D3`, `야전대`, `지휘 체계`, `지휘관 상세`, `Formation Combat Power`가 누적되어 같은 정보를 여러 블록에서 반복 표시하고 있었다.

## H2 변경

### 1. Formation 지도 라벨 미세조정

- 병력 수는 다시 **작은 직사각형 badge** 안에 표시한다.
- 병력 숫자는 해당 국가의 **territory fill color**, badge 테두리는 해당 국가의 **border color**를 사용한다.
- Combat Power 숫자도 기존과 같이 국가 fill color를 유지한다.
- 병력 badge와 Combat Power 묶음을 H1보다 약간 위로 이동한다.
- 정상/저하 상태의 초록·주황 원은 H1 대비 약 20% 축소하고 Combat Power 숫자와의 간격을 늘린다.
- 빨간 `!`은 심각 상태 식별성을 위해 원보다 약간 크게 유지한다.
- 지휘관 ★, 전선, 도로, Formation 본체의 국가색은 상태 경고와 독립적으로 유지된다.

### 2. Reference Manpower lifecycle 수정

H1의 Formation gap은 `현재 병력 / referenceManpower`로 계산했지만, 평시 동원해제 후 reference가 과거 최대치에 남을 수 있었다.

H2 규칙:

- **평시 + 비전쟁:** `referenceManpower = 현재 정식 Formation 병력`으로 재동기화한다.
- **활성 전쟁 중:** 이전 기준편제를 유지한다. 단, 실제 증원으로 현재 병력이 기준을 넘으면 기준을 상향한다.
- **Engagement 시작:** 교전 시작 병력을 기준편제로 다시 고정한다.
- **DORMANT / INACTIVE:** 현재 값으로 정리한다.

따라서 정상적인 평시 4→1명 군축은 빨간 편제손실로 남지 않지만, 실제 전쟁/교전에서 4→2명으로 손실되면 기존 H1 상태 경고가 계속 작동한다.

추가 telemetry: `peacetimeReferenceSyncs33H2`.

### 3. 타일 Inspector 통합

타일을 선택했을 때 다음 구형 관측 블록은 **표시만 제거**한다. 내부 시뮬레이션, Devlog, telemetry 로직은 유지한다.

- `이동 관측`
- `D3 공간·확장 진단`
- `Formation D3`

행정 정보는 다음처럼 통합한다.

- 기존 `행정권` + `행정 상태` → 하나의 행정 블록
- 행정권 코드/중심지/지속기간과 제도화 상태/행정 효율/행정청 상태를 한 곳에서 표시

군사 정보는 기존 중복 블록을 하나로 합친다.

- `이 타일의 Formation`
- 야전대 상태/사기
- 지휘 체계
- Formation 지휘관 상세
- Formation Combat Power

새 **`⚔ Formation`** 블록은 타일 Inspector 최상단에 배치하며 Formation별로 다음을 한 카드에 표시한다.

- 국가 / Formation 이름 / 정상·저하·심각 상태
- 실제 Person 병력 수 / Combat Power
- 훈련 / 장비 coverage / 보급 / 사기 / Battle Morale
- 현재 Formation status / mission / target
- reference manpower 및 실제 저하 원인
- 지휘관 이름 / Command Score / 전투·사기손실·재편 modifier

### 4. H/H1 기능 유지

다음은 변경하지 않는다.

- intrinsic Combat Power 공식
- 지도 Combat Power = 지형·요새·순간 난수 적용 전 전투력이라는 정의
- H1의 초록 `●` / 주황 `●` / 빨간 `!` 의미
- display-value 기반 `±Δ` FX 및 1.25초 표시
- 장비 부족 자체는 상태 경고가 아니라 Combat Power에만 반영
- `BATTLE33`, 사상률, Retreat/Regroup, 전쟁/점령/평화 공식

## Save / compatibility

- 현재 save key: `village-observer-v0-33h2`
- fallback: `0.33H1` → `0.33H` → `0.33G3A`
- AI Editor와 G3 Anchor profile JSON은 변경하지 않는다.

## H2 검증 포인트

- 평시 동원해제 후 현재 병력이 줄어도 Formation gap 경고가 남지 않는가.
- 실제 전쟁/교전 손실에서는 reference manpower가 고정되어 주황/빨간 경고가 유지되는가.
- 병력 수 badge의 숫자는 nation fill color, 테두리는 nation border color로 보이는가.
- 병력 badge/Combat Power가 H1보다 약간 위에 있고 지휘관 ★와 충돌하지 않는가.
- 초록/주황 원이 H1보다 작고 Combat Power와 적당히 떨어져 있는가.
- 타일 Inspector에서 Formation 통합 블록이 최상단에 위치하는가.
- 이동 관측 / D3 공간·확장 진단 / Formation D3가 더 이상 표시되지 않는가.
- 행정권과 행정 상태가 하나의 블록으로 표시되는가.
- 기존 전쟁·AI·경제·연구 결과가 H1과 동일한 규칙을 유지하는가.

---

## Historical baseline — V0.33H1


> **기준선:** V0.33H. H의 canonical Combat Power/실제 전투 연결은 유지하고, 첫 자연주행에서 확인된 표시 겹침·상태 경고 과민·작은 증가 FX 가독성 문제만 수정하는 **렌더링/관측 Hotfix 성격의 후속 패치**다.
>
> **밸런스 원칙:** `BATTLE33` 전투 공식, 지형/요새/난수, 사상률, AIProfile, 전쟁 의사결정, 경제/연구 공식은 변경하지 않는다.

## H1 피드백 근거

V0.33H PC 자연주행에서 다음을 확인했다.

- H의 `aIntrinsicPower33H / bIntrinsicPower33H`는 실제 `BATTLE33` 모든 관측 라운드에 정상 기록되어 canonical Combat Power 연결 자체는 유지 가능하다.
- 기존 H 지도 라벨이 이전 Formation 병력 라벨과 같은 중심 위치를 점유해 국가색 Formation 마커/지휘관 ★와 겹쳤다.
- 현역 Formation의 Equipment가 0%인 시대/경제 상태가 흔했는데 H가 `<35%`를 무조건 severe로 분류하여 사실상 모든 Formation이 빨간 `!` 상태가 되는 문제가 있었다.
- 전투력 상승은 raw 값으로는 여러 번 발생했지만 표시가 소수점 1자리라 `+0.02~0.04` 같은 변화가 보이지 않고 누적 뒤 3.9→4.1처럼 건너뛰어 보일 수 있었다.

## H1 변경

### 1. Formation 라벨 2줄 구조

- H1은 B1의 기존 중앙 `▲ Person` 라벨을 중복 렌더하지 않는다.
- 각 Formation 아래에 **위: 현재 병력 수 / 아래: `⚔ Combat Power + 상태기호`** 순서로 표시한다.
- 하나의 타일에 여러 Formation이 있으면 최대 3개를 가로 mini-column으로 나란히 표시한다. 추가 Formation은 `+N`으로 요약한다.
- 큰 검은 pill 배경을 제거하고 숫자 자체에 검은 outline을 사용하여 Formation 마커, 지휘관 ★, 전선/도로와의 시각 충돌을 줄인다.
- 적대 Formation이 같은 타일에 있으면 중앙에 작은 `⚔` 표식을 유지한다.

### 2. 국가색과 상태색 분리

병력 수와 Combat Power는 상태와 무관하게 항상 **해당 국가 고유색**을 사용한다.

상태는 별도 기호로만 표시한다.

- 초록 `●`: 정상
- 주황 `●`: 저하
- 빨간 `!`: 심각

따라서 손상된 티아 Formation도 티아 국가색 자체는 유지한다.

### 3. 상태 경고 재정의

H1의 상태 기호는 **현재 부대가 평소보다 실제로 손상/교란된 상태인지**를 보여준다. 기본 장비 수준은 더 이상 경고색의 기준이 아니다.

- Formation gap: 교전 기준편제의 80% 미만 → 주황, 60% 미만 → 빨강.
- Battle Morale: -8 이하 → 주황, -18 이하 → 빨강.
- 실제 Supply 단절 수준(<=5%)만 상태 경고. <=1%는 빨강.
- `POST_BATTLE_RECOVERY / WITHDRAWING / POSTWAR_WITHDRAWAL` → 주황.
- `RETREATING / REGROUPING / DEEP_RECOVERY` → 빨강.
- Equipment와 통상적인 낮은 Supply는 **Combat Power 계산에는 계속 그대로 반영**되지만 그것만으로 `!`를 발생시키지는 않는다.

기존 전투력 식은 그대로다.

`manpower × (0.42 + training/250 + equipment/250 + supply/280 + morale/400) × commander multiplier`

### 4. 표시값 기반 Battle Delta FX

- H의 raw power delta 대신 **지도에서 실제 보이는 소수점 1자리 Combat Power 값**을 기준으로 FX를 생성한다.
- 예: 3.9→4.0은 `+0.1`, 4.0→4.1은 다시 `+0.1`로 표시된다.
- `BATTLE33` 라운드 전후뿐 아니라 교전 중 렌더 사이에 보이는 표시값이 바뀌는 경우도 보완 감지한다.
- 같은 Formation의 변화는 350ms 안에서 합산한다.
- FX 표시 수명은 850ms → **1250ms**로 늘렸다.
- 렌더링은 여전히 simulation RNG를 사용하지 않는다.

### 5. Inspector / telemetry

- 타일/국가 군사 패널도 병력 수와 Combat Power를 함께 표시한다.
- 상태 설명은 정상/저하/심각과 실제 원인을 분리한다.
- 기존 H 필드는 호환을 위해 유지한다.
- 추가 관측값:
  - global: `normalFormations33H1`, `warningFormations33H1`, `criticalFormations33H1`, `displayPowerDeltaEvents33H1`
  - nation: `normalFormations33H1`, `warningFormations33H1`, `criticalFormations33H1`

### 6. Save / compatibility

- 새 save key: `village-observer-v0-33h1`
- `0.33H` 및 `0.33G3A` save를 fallback load한다.
- AI Editor와 G3 Anchor profile 파일은 변경하지 않는다.

## H1 검증 포인트

- 평시의 장비 0% Formation도 편제/사기/상태가 정상이라면 초록 `●`로 보이는가.
- 사상자로 4명→3명이 되면 주황 상태, 4명→2명이 되면 빨간 상태가 되는가.
- Formation 국가색은 정상/저하/심각 어느 상태에서도 변하지 않는가.
- 지도에서 병력 수가 위, Combat Power가 아래에 보이고 기존 중앙 라벨과 겹치지 않는가.
- 지휘관 ★가 H1 라벨에 가려지지 않는가.
- 교전 중 3.9→4.0→4.1 변화에서 각각의 `+0.1`이 가시적으로 나타나는가.
- H와 동일한 입력에서 intrinsic/BATTLE33 전투력 값이 달라지지 않는가.

---

## Historical baseline — V0.33H

> **기준선:** V0.33G3A Hotfix 1. 0.33G AIProfile 행동 검증은 CLOSED 상태이며, H는 AI/경제/전쟁 밸런스를 재조정하지 않는 **군사 렌더링·전투 가독성 패치**다.
>
> **핵심 원칙:** 지도에 표시하는 Combat Power는 새 점수 체계가 아니라 실제 `BATTLE33` 교전의 `unitPowerD()`가 사용하는 **지형/요새/RNG 적용 전 Formation 자체 전투력**과 동일하다.

## H 핵심 변경

### 1. Canonical Formation Combat Power

실제 전투의 Formation 자체 전투력을 다음 식으로 명시한다.

`manpower × (0.42 + training/250 + equipment/250 + supply/280 + morale/400) × commander multiplier`

- 포함: 실제 active Person 병력, Training, Equipment, Supply, Morale, Commander combat multiplier.
- 제외: Forest/Rock/Mountain, Watchtower/Fortification/Barracks, 수도 방어, 전투 라운드의 `0.92..1.08` 순간 난수.
- 실제 전투력 관계는 `Actual Battle Power = displayed intrinsic power × battlefield defense factor × 0.92..1.08`이다.
- 기존 D 전투 `unitPowerD()`가 H helper를 직접 호출하도록 연결하여 지도 표시와 실제 교전의 기본 전투력 공식을 한 곳에서 공유한다. 가중치 자체는 변경하지 않는다.

### 2. Military map Formation stack

- 기존 군사 레이어의 `▲ Person 수` 합산 라벨을 **Formation별 Combat Power** 표시로 교체한다.
- 동일 타일은 Formation별 작은 세로 stack으로 표시하며 최대 3개를 직접 노출한다. 4개 이상은 `+N`으로 요약한다.
- 각 Formation은 국가색 outline을 유지하며 저하 상태에서는 노랑/빨강 `!` 경고를 우선 표시한다.
- D3 이동 흔적/앞 5칸 chevron/목표 `◎`, D 다중전선, E5 지휘관 ★ 표시는 유지한다.

### 3. Degraded state

H는 전투력과 별도로 **부대 상태 경고**를 계산한다. 이 경고는 전투 공식을 추가 변경하지 않는다.

- `referenceManpower`: 교전 시작 시 편제를 기준값으로 고정한다. 전사·부상으로 실제 active Person이 빠지면 `현재/기준편제` 비율이 하락한다.
- Formation gap: 80% 미만 경고, 60% 미만 심각 경고.
- Battle Morale: -8 이하 경고, -18 이하 심각 경고.
- Equipment: 60% 미만 경고, 35% 미만 심각 경고.
- Supply: 55% 미만 경고, 30% 미만 심각 경고.
- `RETREATING / REGROUPING / POST_BATTLE_RECOVERY / WITHDRAWING / DEEP_RECOVERY` 등도 상태 경고에 포함한다.
- 기준편제는 전투 후 병력이 회복될 때까지 유지하며, 회복/재편으로 현재 병력이 기준에 도달하면 새 정상 상태로 갱신된다.

### 4. Battle Delta FX

- `BATTLE33` 라운드 시작 전 Formation별 intrinsic power를 캡처하고, 사상자 처리 + Battle Morale 갱신 뒤 다시 계산한다.
- 변화가 있으면 지도에서 `-2.4`, `+0.8` 형태의 짧은 floating delta와 label pulse를 표시한다.
- 같은 Formation의 변화가 약 260ms 안에 연속 발생하면 하나의 delta로 합산하여 고배속 시 시각적 스팸을 줄인다.
- FX queue는 런타임 렌더 상태이며 Save에 저장하지 않는다. 렌더러는 `Math.random()`을 호출하지 않으므로 시뮬레이션 RNG 흐름을 바꾸지 않는다.
- `prefers-reduced-motion` 환경에서는 이동폭을 줄인다.

### 5. Inspector / military panel

선택 타일과 국가 군사 패널에서 Formation별 다음 정보를 확인할 수 있다.

- Combat Power
- Person manpower / reference manpower
- Training / Equipment / Supply / Morale
- Battle Morale
- Commander multiplier
- 현재 degraded reason

지도 숫자에는 지형·요새·순간 전투 난수가 포함되지 않는다는 설명을 함께 표시한다.

### 6. Telemetry

`BATTLE33` payload에 다음을 추가한다.

- `aIntrinsicPower33H`
- `bIntrinsicPower33H`

Snapshot/CSV에는 다음을 추가한다.

- global: `formationPowerCount33H`, `formationPowerAverage33H`, `formationPowerMax33H`, `degradedFormations33H`, `severeFormations33H`, `battlePowerDeltaEvents33H`
- nation: `formationCombatPower33H`, `formationCombatPowerAvg33H`, `degradedFormations33H`, `severeFormations33H`

### 7. Save / compatibility

- 새 save key: `village-observer-v0-33h`
- 직전 `village-observer-v0-33g3a` save를 fallback load한다.
- Formation별 `referenceManpower` 관측 상태만 `v33h.formationState`에 저장한다. FX는 저장하지 않는다.
- AI Editor와 G3 Anchor JSON은 변경하지 않는다.

## H 완료 검증 포인트

1. 표시 Power와 `BATTLE33.aIntrinsicPower33H / bIntrinsicPower33H`의 기반 공식이 동일할 것.
2. 지형/요새만 달라져도 지도 Power는 변하지 않을 것.
3. manpower/훈련/장비/보급/사기/지휘관이 달라지면 Power가 변할 것.
4. 사상자·Battle Morale 변화가 발생한 라운드에서 delta FX가 발생할 것.
5. Formation gap 및 저사기/저장비/저보급 상태가 노랑/빨강 경고로 구분될 것.
6. 렌더링이 전투 RNG·AI 의사결정·사상률을 바꾸지 않을 것.
7. 기존 D3 경로/흔적, D 다중전선, E5 지휘관, G3A 동작이 회귀하지 않을 것.

---

## Historical baseline — V0.33G3A Hotfix 1

> **기준선:** V0.33G3A. Gamma Expansion 자연주행에서 실제 `declarations=2`, `readyIntentsG3A=2`가 발생했지만 `declaredIntentsG3A=0`으로 남는 관측 누락을 확인했다. 이 Hotfix는 **G3A telemetry/summary observer만 수정**하며 AI 판단, 전쟁 준비, 안전 게이트, 전투·경제·연구 밸런스는 변경하지 않는다.
>
> **검증 결론:** G3A의 Expansion→군사 공격성 연결은 Alpha/Gamma에서 기대 방향으로 재현되어 **2/3 PASS**. 따라서 **V0.33G 계열은 CLOSED**로 본다. Hotfix 자체 때문에 기존 Alpha/Beta/Gamma를 다시 돌릴 필요는 없다.

## G3A Hotfix 1 변경

- `declaredIntentsG3A`가 기존 `WAR_PREPARATION_DECLARED33D2`만 보던 문제를 수정한다.
- 다음 선언 경로를 모두 intent-level declaration으로 인식한다: `WAR_PREPARATION_DECLARED33D2`, `WAR_PREPARATION_DECLARED33D2A`, `WAR_INTENT_DECLARED33D1`, `WAR_INTENT_DECLARED33F1`, `WAR_INTENT_PHASE_CHANGED33D1(phase=DECLARED)`.
- 동일 선언이 여러 계층에서 연속 기록되어도 `intentId` 기준으로 dedupe하여 **한 intent당 1회**만 `declaredIntentsG3A`를 증가시킨다.
- `WAR_PREPARATION_DECLARATION_BLOCKED33D2A`도 `lastDeclarationBlockerG3A`에 반영한다.
- Summary JSON에 `g3aHotfix: 1`, `g3a.observerHotfix: 1`을 기록한다.
- UI 표기는 `V0.33G3A H1`로 갱신한다. 직렬화/save 호환을 위해 world version key는 `0.33G3A`를 유지한다.

## 재검증 필요 여부

**없음.** Gamma에서 일반 G3 counter의 `declarations=2`가 실제 전쟁 선언을 이미 기록했고, G3A의 READY 전환도 2건 잡혔다. Hotfix는 그 동일한 선언을 G3A 전용 intent counter가 놓친 부분만 보완한다.

---

## Historical baseline — V0.33G3A War Aggression Connection Calibration

> **기준선:** V0.33G3 Hotfix 1. G3 검증에서 Expansion→개척/영토, Technology→연구/후기기술, Merchant→교역/상업, Defensive→저확장/비공격은 종료 기준을 충족했다. G3A는 유일한 미통과 축인 **Expansion → 실제 전쟁 공격성**만 보정한다.
>
> **비범위:** Frontier, 연구, 생산, 상업, Defensive, 전투력, 사상, 점령, 평화협정, 경제·가격·Gold 공식은 재조정하지 않는다.

## G3A 핵심 변경

- `warDispositionModifier` 표현 범위를 `-8..+8` → **`-12..+12`**로 넓힌다. G3 Expansion Anchor의 raw 약 +20 신호가 +8에서 잘리던 손실을 줄인다.
- War Intent band 자체는 유지한다: `<63 CANCEL / 63~67 WEAK / 67~71 STRONG / >=71 PREPARE`.
- 양수 전쟁성향만 `warCommitment`(0~1)로 D2 준비목표에 연결한다. 최대 commitment에서 첫 전쟁 기준은 **식량 45→41일 / Readiness 62→58 / 전력비 0.90→0.84 / War Chest 8→7G**가 된다. Balanced 및 음수 성향은 완화되지 않는다.
- true Survival / Recovery / 작전경로 / 최소 야전병력 / 최종 Food 28일·Readiness 52 hard floor는 그대로 둔다.
- G3A Summary/CSV에는 raw·effective disposition, commitment, PREPARE-band intent, PREPARING/READY/Declaration, 현재/최근 D2 목표와 blocker를 추가한다.
- `requestedProfileId`는 실제 적용 Profile ID와 동기화한다.
- World 탭에 **G3A 전쟁 연결 Fixture** 버튼을 추가한다. 동일한 비Profile base score에서 Balanced와 Expansion의 band 및 첫 전쟁 D2 목표가 예상대로 분리되는지 JSON으로 회귀검사한다.

## G3A 권장 검증

1차는 **Alpha Balanced + Expansion, Beta Balanced + Expansion = 4런**만 실시한다. 두 seed 모두 전쟁 파이프라인 분리가 재현되면 G3A PASS다. 한 seed만 분리되면 Gamma Balanced + Expansion 2런을 추가해 2/3을 판정한다.

PASS는 단순 선전포고 총횟수만으로 판정하지 않는다. `PREPARE band → PREPARING → READY → Declaration`의 진행률이 Balanced보다 Expansion에서 명확히 높아야 하며, Survival/Recovery/route/manpower 안전 게이트를 우회한 개전이 없어야 한다.

---

## Historical baseline — V0.33G3 AI Behaviour Anchor Validation

> **Hotfix 1 (2026-10-06): G3 Validation Harness 관측 수정**
>
> Alpha 5-run 분석에서 확인된 세 가지 **검증용 telemetry/summary 문제만** 수정한다. AIProfile 가중치, 개척, 경제, 연구, 전쟁, Recovery 등 실제 시뮬레이션 행동 공식은 변경하지 않는다. 따라서 기존 alpha 결과는 유효하며 재실험하지 않는다.
>
> - Summary의 `experiment.profileId / profileLabel / expected`를 시험국에 실제 적용된 Profile에서 재동기화한다.
> - `TRADE` 이벤트의 `buyerId / sellerId` 양쪽에 `internationalTrades / internationalTradeVolume`을 누적한다. 기존 `tradeCount / tradeVolume` 계산은 변경하지 않는다.
> - 70년 최초 도달 시 `G3_FINAL_70`을 자동 캡처한다. 70년 이후에 Summary를 내려받아도 `final`은 이 exact-70 checkpoint를 사용한다.
> - Summary JSON에는 `hotfix: 1`, `finalCapture: "EXACT_70" | "CURRENT"`를 기록한다.

> **버전 성격:** V0.33G3는 AI 밸런스 조정판이 아니라 **AIProfile 검증판**이다. 기준선은 V0.33G2B + AI Editor Hotfix 1이며, G3는 전쟁·경제·연구·개척 공식의 수치를 바꾸지 않는다.
>
> **0.33G 종료 목표:** 임의의 Custom AIProfile이 하드코딩 없이 저장·적용되고, 동일한 시작 조건의 통제실험에서 설정값에 따른 행동 차이가 반복적으로 관측되면 0.33G를 종료한다.

---

## 1. 이번 버전의 목적

G2B 자연주행까지 다음 기반은 통과했다.

- 직접 `brain.type` 결정 분기 제거 계열
- AIProfile JSON v1 import/export/save/load
- 임의 Profile ID의 실제 행동 경로 연결
- Custom 국가명 / fillColor / borderColor / 문화 / 성별 이름풀
- Recovery Formation churn 안정화
- 36개 기술 트리 및 신규 기술의 실제 효과 연결

G3에서는 더 이상 기능을 넓히지 않고 **Profile 차이가 실제 행동 차이를 만드는지** 검증한다.

---

## 2. 표준 Anchor Profile 5종

패키지의 `ai-profiles/`에 독립 JSON으로도 포함되어 있다.

### `g3_balanced_control`

중립 대조군. 기존 balanced preset과 같은 중립값을 사용한다.

### `g3_expansion_anchor`

핵심값:

- expansion 2.50
- risk 1.70
- territorialExpansion 1.00
- EXPAND +40
- technology 0.70
- fiscalConservatism 0.60

기대 방향: 더 많은 Frontier start/claim, 더 넓은 영토, 상대적으로 공격적인 War Intent.

### `g3_technology_anchor`

핵심값:

- technology 2.50
- production 2.00
- research.industry 2.50
- research.knowledge 2.50
- expansion 0.55

기대 방향: 높은 Knowledge/인구, 빠른 후기기술, 연구·생산 투자 증가.

### `g3_merchant_anchor`

핵심값:

- trade 2.50
- tradeDiplomacy 1.00
- research.commerce 2.50
- construction.commerce 2.50
- TRADE +40

기대 방향: 국제교역 횟수/물량, 상업시설 투자, 연결성 증가.

### `g3_defensive_anchor`

핵심값:

- survival 2.50
- expansion 0.25
- risk 0.25
- fiscalConservatism 2.00
- survivalPriority 1.00
- EXPAND -40
- MAINTAIN / FOOD +40

기대 방향: 낮은 확장·전쟁빈도, 더 큰 식량/재정 안전마진, 안정 지향.

---

## 3. G3 Behaviour Anchor Lab

World 탭에 `G3 AI Behaviour Anchor Lab` 패널을 추가한다.

표준 실험은 항상 **국가 #0 하나만** Anchor Profile로 교체한다. 나머지 6개 국가는 기존 built-in Profile을 그대로 유지한다.

표준 seed:

- `g3-alpha-19x19`
- `g3-beta-19x19`
- `g3-gamma-19x19`

`검증 세계 시작`을 누르면 현재 세계를 종료하고 19×19 새 검증 세계를 만든다.

### 재현성

G3 검증 세계는 다음 둘을 저장한다.

- deterministic natural-map seed
- simulation RNG state

따라서 **같은 Profile + 같은 seed** 런은 재실행/저장-불러오기 후에도 동일한 난수 흐름을 이어갈 수 있다.

단, Profile이 달라지면 행동 분기가 달라져 난수 호출 횟수 자체가 달라질 수 있다. 따라서 서로 다른 Profile을 한 seed에서 1:1 완전 동일 random shock으로 비교한다고 가정하지 않는다. 최종 판단은 3개 표준 seed에서 방향이 반복되는지로 한다.

---

## 4. 자동 Checkpoint

검증 모드에서는 다음 연도에 전용 snapshot을 자동 저장한다.

- 20년
- 40년
- 60년

권장 최종 관측시점은 **70년**이며, Hotfix 1부터 70년 최초 도달 시 exact Final checkpoint를 자동 저장한다.

Checkpoint에는 시험국의 다음 지표를 요약한다.

- 인구 / 영토 / 정착지 수
- 기술 수 / 총 Knowledge / Knowledge per capita
- 교역 횟수 / 수출입 물량 / Trade volume per capita
- Gold / Gold per capita / 식량 비축일
- 도시화 비율 / 정착지 인구 Gini / 통근 비율
- 실제 Frontier start / claim 누적
- War Intent / PREPARING / READY / 선전포고 누적
- Recovery / Survival 진입 및 누적 calendar days
- 국제교역 실행 횟수·물량
- 생산 / 상업 / 연구 / 군사시설 착공 관측
- AI focus 선택 누적

기존 Snapshot CSV에도 `...33G3` 컬럼이 추가된다.

---

## 5. G3 전용 Summary Export

World 탭 G3 패널에서 별도 파일을 받을 수 있다.

- `G3 Summary JSON`
- `G3 Summary CSV`

Summary는 20/40/60년 checkpoint와 Final 상태를 한 파일에 모은다. Hotfix 1 이후 70년에 도달한 런은 export 시점이 72년·76년이어도 자동 저장된 **70년 exact Final**을 사용한다. 여러 런을 비교할 때 거대한 전체 devlog를 먼저 펼치지 않아도 핵심 Profile 차이를 볼 수 있다.

전체 Snapshot CSV와 Devlog JSON도 기존처럼 그대로 제공된다.

---

## 6. PASS / FAIL 기준

G3의 기준은 “특정 AI가 항상 1등”이 아니다.

### 1차 Signal

한 seed에서 주 성향 핵심 지표가 Balanced보다 약 **20~30% 이상** 갈리면 강한 signal로 본다. 이것은 밸런스 목표나 절대 통과선은 아니다.

### 최종 방향성

각 Anchor에서 관련 핵심 지표 최소 2개가 기대 방향으로 움직이고, 그 방향이 **3개 seed 중 최소 2개**에서 반복되는지를 본다.

예:

- Expansion → Frontier start + territory 증가
- Technology → Knowledge/capita + 후기기술 속도 증가
- Merchant → international trade + commerce investment 증가
- Defensive → declaration/expansion 감소 + safety margin 증가

### 종료

- G3가 명확히 PASS → **V0.33G CLOSED**
- 특정 연결만 약함 → **V0.33G3A Behaviour Connection Calibration**에서 해당 연결만 보정 후 동일 실험 재실행

G3 자체에서는 행동 가중치 공식을 수정하지 않는다.

---

## 7. 패키지 파일

```text
index.html
ai-editor.html
README.md
example-joseon-nation.json
g3-validation-manifest.json
ai-profiles/
  g3-balanced-control.json
  g3-expansion-anchor.json
  g3-technology-anchor.json
  g3-merchant-anchor.json
  g3-defensive-anchor.json
```

`g3-validation-manifest.json`에는 표준 seed, checkpoint, 권장 종료연도와 판정 원칙을 별도로 기록한다.

---

# 이전 V0.33G2B 기술 문서

아래는 G3 기준선인 G2B + Editor Hotfix 1의 상세 구현 문서다.

# Village Observer V0.33G2B — AI Editor Hotfix 1

> **Hotfix 범위:** 본편 시뮬레이션 `index.html`은 V0.33G2B 그대로이며, `ai-editor.html`의 초기화 런타임 오류만 수정합니다. 기존 G2B 세이브/자연주행은 그대로 이어서 사용할 수 있습니다.
>
> 원인: G2B Editor 확장 과정에서 동적 Behavior control helper인 `createControl`, `buildControls`, `setPath`, `getPath`가 누락되어 `init()`이 `buildControls()` 호출에서 중단되었습니다. 그 결과 Behavior Parameters, Profile Summary, JSON Preview가 비어 있고 Import/색상 이벤트도 등록되지 않았습니다.
>
> 수정: 네 helper 복구 + 초기화 실패 시 Validation 영역에 오류를 표시하는 fail-visible 처리. 런타임 모의 테스트에서 기본 초기화, 36개 Behavior controls, G2B 조선 JSON Import, trait 값 반영, fill/border 색상 동기화와 JSON Preview 반영을 확인했습니다.

---

## Identity/Gender + Recovery Stabilization + Technology Expansion

- 기준선: **V0.33G2A**
- 패치 날짜: **2026-10-06**
- AIProfile 파일 포맷: **`village-observer-ai` / version 1 유지**
- 기술 수: **32 → 36**
- 새 기술 추가 비용: **+1,810 Knowledge**
- 기존 Person 문화 강제 migration: **없음**
- 계급별 이름 체계: **이번 범위에서 보류**

이번 패치는 G2A 자연주행에서 확인된 세 가지를 직접 닫는다. 첫째, 국가 영토의 채우기색과 국경선색을 하나의 `nationColor`로 취급하던 구조를 분리한다. 둘째, Custom Culture의 개인명을 남성/여성/공용으로 나누고 Fresh Founder 재명명 시 실제 상속 필드까지 동기화한다. 셋째, Recovery 중 평시 Formation planner가 계속 막힌 target write를 시도하던 churn과 대국의 목재 절대재고 때문에 Recovery가 장기간 고착되는 문제를 완화한다. 동시에 정상 성장국이 50년대 전후 32개 기술을 모두 끝내는 현상을 고려해 후기 고대~초기 중세 기술 4개를 추가한다.

---

## 1. G2A 자연주행 검증 요약

G2A PC 자연주행에서 다음이 확인되었다.

### PASS

- Snapshot CSV가 정상 다운로드되고 행 schema가 유지됨
- G2에서 카이렌에 411회 발생했던 War Preparation write-block 장기 고착 제거
- Preparation write-block은 전체 2회로 감소
- Custom Profile `joseon_g2a_example`이 장기 실행까지 유지됨
- Fresh World에서 Custom Culture `JOSEON`이 실제 founding culture로 적용됨
- Custom 국가색이 runtime/telemetry에 유지됨

### 새로 확인된 문제

- 라엔이 약 7,306 calendar-day 동안 Recovery에 남아 있음
- Recovery write-block 6,413회가 한 Formation에 집중됨
- 원인은 Recovery owner가 target을 보호하는 동안 옛 PEACETIME/BORDER planner가 같은 target 변경을 계속 시도한 것
- 장기 Recovery plateau의 목재 조건 `wood >= max(12, population×0.25)`가 정상적인 대국에도 지나치게 높은 절대재고를 요구할 수 있음
- Custom Culture founder의 화면상 `name`은 바뀌었지만 내부 `familyName/givenName`이 남아 후손에게 옛 성씨가 상속될 수 있음
- 일반 성장국은 대체로 48~56년 사이 32개 기술을 완료하여 후기 연구 목표가 빠르게 소진됨

---

## 2. 국가 외형 V2 — Fill / Border 분리

AI/Nation Profile의 국가 외형을 다음처럼 분리한다.

```json
"identity": {
  "appearance": {
    "fillColor": "#C10D46",
    "borderColor": "#E8C36A"
  }
}
```

- `fillColor`: 영토 채우기, 국가 카드, 기본 국가 식별색
- `borderColor`: 국가 외곽/국경선 강조색
- 문화색은 계속 별도 값이며 국가 외형과 독립적이다.
- 두 국가가 맞닿는 국경은 중립 중심선과 양쪽 국가 고유 borderColor를 함께 사용한다.
- 선택 국가 외곽선도 해당 국가의 borderColor를 사용한다.

### 하위호환

기존 G2A JSON의 다음 형식은 그대로 읽힌다.

```json
"identity": { "nationColor": "#315F9B" }
```

이 값은 자동으로 `appearance.fillColor`로 해석한다. `borderColor`가 없으면 기존 슬롯의 국경색을 유지한다.

---

## 3. 문화 이름 V2 — 성별 이름풀

계급/신분별 이름 차이는 아직 도입하지 않는다. 이번 버전에서는 Person의 기존 `sex`를 이용해 개인명만 세 갈래로 분리한다.

Custom Culture가 지원하는 이름풀:

- `familyCore`
- `familyShared`
- `givenMaleCore`
- `givenMaleShared`
- `givenFemaleCore`
- `givenFemaleShared`
- `givenUnisexCore`
- `givenUnisexShared`

이름 생성은 해당 성별 Core/Shared를 우선 사용하고, 공용 이름풀을 보조적으로 사용한다. 공용 이름은 남녀 모두에게 나올 수 있다.

기본 7개 문화도 동일한 인터페이스를 사용한다. 이번 버전에서는 기존 판타지 이름풀을 결정론적으로 남/여 그룹에 나눈 **1차 데이터 구조 전환**이며, 실제 언어학적 성별 이름 고증을 의미하지 않는다. 향후 문화 데이터 자체를 다듬을 수 있다.

### 기존 JSON 호환

G2A의 `givenCore/givenShared`만 가진 Custom Culture는 삭제하거나 거부하지 않는다. 각각 새 `givenUnisexCore/givenUnisexShared`로 자동 해석한다.

---

## 4. Fresh Founder 성씨 상속 수정

G2A에서는 Fresh World에 Custom Culture를 적용할 때 화면 표시용 `p.name`만 새 이름으로 바뀌고, Person 내부의 `familyName`과 `givenName`이 남을 수 있었다.

그 결과 새로 태어난 아이는 아버지의 옛 `familyName`을 상속하여 Custom Family Pool과 다른 성씨가 계속 남는 현상이 생길 수 있었다.

G2B에서는 Fresh Founder 재명명 시 반드시 동시에 갱신한다.

```text
p.familyName
p.givenName
p.name
```

따라서 Custom Culture의 성씨가 실제 세대 상속 구조에 들어간다.

진행 중인 월드에 Profile을 적용할 때 기존 주민의 문화/이름을 강제로 다시 쓰지는 않는다는 기존 정책은 유지한다.

---

## 5. Recovery Formation planner 안정화

G1A write gate 자체는 정상적으로 Recovery target을 보호하고 있었다. 문제는 보호받는 동안에도 기존 평시 Formation planner가 `BORDER` 등의 새 목표를 반복적으로 쓰려고 했다는 점이다.

G2B에서는:

- `recoveryState.active === true`인 국가는 PEACETIME/BORDER `planFormations32D()` 자체를 건너뛴다.
- Recovery owner가 지정한 실제 home target과 이동은 유지한다.
- 따라서 setter에서 수천 번 거부하기 전에 불필요한 평시 plan을 만들지 않는다.
- `recoveryPlannerSkips33G2B` telemetry로 진입 차단 횟수를 관측한다.

목표는 G2A에서 확인된 수천 회의 `FORMATION_TARGET_WRITE_BLOCKED33G1A` 및 실제로 바뀌지 않은 목표를 `FORMATION_TARGET_CHANGED32D`로 기록하는 observer churn을 제거하는 것이다.

---

## 6. Recovery Plateau 목재 조건 V2

기존의 다른 안전조건은 유지한다.

- Recovery age ≥ 720 calendar days
- true Survival 비활성
- inactive building share < 10%
- food reserve ≥ 30 days
- housing capacity ≥ population × 0.80
- average health ≥ 48

목재만 절대재고 단일 판정에서 **Stock 또는 Operational Flow** 판정으로 바꾼다.

### A. Stock 경로

```text
wood >= max(6, population × 0.05)
```

### B. Operational Flow 경로

Stock 경로를 못 넘더라도 다음을 모두 만족하면 목재 상태를 정상으로 본다.

```text
wood >= 3
building condition average >= 90
최근 maintenance wood shortfall share <= 10%
30일 평균 wood 생산/day >= max(0.05, population × 0.0008)
```

즉 목재를 계속 생산하고 유지보수를 정상적으로 수행하면서 건물 상태가 좋은 국가는 창고에 큰 절대재고를 쌓지 않았다는 이유만으로 수십 년 Recovery에 갇히지 않는다.

빠른 Recovery exit 조건과 true Survival 안전장치는 변경하지 않는다.

---

## 7. 기술 트리 32 → 36

G2A 자연주행에서는 일반 성장국이 대체로 50년대에 32개 기술을 모두 완료했다. G2B는 이미 존재하는 시스템에 직접 연결되는 후기 기술 4개를 추가한다.

### 📜 관료제 `BUREAUCRACY`

- 비용: **420 Knowledge**
- 선행: `ADMINISTRATION + RECORD_KEEPING + CURRENCY`
- 분류: 개척·행정 / AI research group `administration`
- 효과:
  - 내부 물류 경로비용 **-6%**
  - 내부 물류 수송량 **+3.5%**

새 자원이나 Gold를 생성하지 않고 기존 internal logistics 계산만 개선한다.

### 🎒 군수 행정 `MILITARY_LOGISTICS`

- 비용: **460 Knowledge**
- 선행: `FRONTIER_LOGISTICS + ROADS + ADMINISTRATION`
- 분류: 군사
- 효과:
  - Formation supply 산정 **+6**
  - 군사 이동시간 multiplier **×0.92**

병력이나 장비를 생성하지 않는다.

### 🏰 공성공학 `SIEGE_ENGINEERING`

- 비용: **500 Knowledge**
- 선행: `ENGINEERING + FORTIFICATION + IRONWORKING`
- 분류: 군사
- 효과:
  - 적 타일 securing requirement **×0.88**
  - securing 과정의 defensive firepower **×0.90**

일반 야전 battle power 자체는 올리지 않는다.

### 🔥 고급 단조 `ADVANCED_FORGING`

- 비용: **430 Knowledge**
- 선행: `IRONWORKING + ENGINEERING`
- 분류: 생산/산업
- 효과:
  - smithy 철→tools 산출계수 **0.78 → 0.88**
  - 군사장비 1단위당 iron **0.72 → 0.66**
  - 군사장비 1단위당 tools **0.045 → 0.040**
  - wood 소모는 유지

새 철/도구를 무상 생성하지 않고 기존 실물 재고 변환효율만 개선한다.

네 기술의 합계 비용은 **1,810 Knowledge**다. E1의 32개 고정 기준 6,315 Knowledge에 더하면 현재 전체 nominal tech cost는 **8,125 Knowledge**다.

---

## 8. AI Editor V1 변경

`ai-editor.html`의 국가 정체성 화면에 다음이 추가된다.

- 영토 Fill color picker + HEX
- Border color picker + HEX
- 실제 fill/border 조합 Preview
- Custom Culture 남성 이름 Core / Shared
- Custom Culture 여성 이름 Core / Shared
- Custom Culture 공용 이름 Core / Shared

검증 규칙:

- 모든 색상: `#RRGGBB`
- familyCore 최소 2개
- 남/여/공용 given Core 합계 최소 2개
- 남성은 Male Core 또는 Unisex Core 중 하나가 있어야 함
- 여성은 Female Core 또는 Unisex Core 중 하나가 있어야 함
- 각 이름 최대 5자

Built-in 문화 선택과 문화 유지 모드는 그대로 제공한다.

---

## 9. Telemetry / 검증 필드

G2B Snapshot/CSV 추가 필드:

### Global

- `techCount33G2B`
- `techCostTotal33G2B`
- `recoveryPlannerSkips33G2B`
- `genderNameSchema33G2B`
- `founderNameFieldRepairs33G2B`

### Nation

- `nationFillColor33G2B`
- `nationBorderColor33G2B`
- `recoveryWoodOperational33G2B`
- `recoveryWoodFloor33G2B`
- `recoveryWoodFlowFloor33G2B`
- `recoveryWoodProduction30G2B`
- `recoveryMaintenanceWoodShortfallShare33G2B`

G1A/G2/G2A 기존 telemetry는 유지한다.

---

## 10. 다음 자연주행에서 볼 핵심

1. Snapshot CSV가 G2B 추가 컬럼까지 정상 다운로드되는가
2. Recovery 중 `recoveryPlannerSkips33G2B`는 증가하지만 `recoveryTargetWriteBlocks33G1A`는 크게 감소하는가
3. G2A의 라엔 같은 조건에서 WOOD가 유일 blocker인 장기 Recovery가 정상적으로 해제되는가
4. Custom Culture의 자녀 성씨가 실제 Custom `familyCore/familyShared`에서 상속되는가
5. 남/여 Person이 해당 성별 이름풀을 우선 사용하는가
6. fillColor와 borderColor가 지도에서 독립적으로 표시되는가
7. 36개 기술이 연구 가능하고 새 네 기술의 효과가 실제 시스템에 도달하는가
8. 정상 성장국의 기술 포화 시점이 50년대에서 어느 정도 뒤로 이동하는가

---

## 11. 이번 버전에서 하지 않는 것

- 계급/신분별 이름풀
- 문화별 작명 문법/음운 규칙
- 자동 문화 융합
- 진행 중 Person의 강제 문화/이름 migration
- 산업시대 기술
- 화약/총기 체계
- 선박 실체/unit 시스템
- 장비 손실·회수 모델
- 전쟁 기본 battle power 재조정
- 경제 기본가격/Gold 재조정

---

## 12. 호환성

- AIProfile envelope는 계속 `format = village-observer-ai`, `version = 1`이다.
- G2A `nationColor`는 새 fillColor로 호환한다.
- G2A `givenCore/givenShared`는 새 Unisex pool로 호환한다.
- G2A 세이브를 불러오는 fallback을 유지한다.
- 새 G2B save key: `village-observer-v0-33g2b`
- 새 export 파일명은 `village-observer-v033G2B-*`를 사용한다.

---

# V0.33G2A 이전 상세 기록

아래는 기준선의 기존 상세 문서다. G2B와 충돌하는 항목은 위 G2B 규칙이 우선한다.

# Village Observer V0.33G2A (기준선 기록)

## AI / Nation Profile UX + Stabilization

- 기준선: **V0.33G2**
- 패치 날짜: **2026-10-06**
- 목적: G2의 AI Profile Editor를 **Custom 국가 제작/적용 도구 V1**로 확장하고, 자연주행에서 확인된 CSV 및 Formation owner 회귀를 닫는다.
- AIProfile 파일 포맷: **`village-observer-ai` / version 1 유지**
- 기존 Person 문화 강제 migration: **없음**
- 전쟁·경제 수치 밸런스 변경: **없음**

---

## 1. G2 자연주행에서 확인된 사항

G2 PC 자연주행과 개발자 로그에서 다음이 확인되었다.

### PASS

- arbitrary custom profile `Joseon_261005`가 Import → Registry → Nation assignment → 장기 실행까지 유지됨
- Custom Profile 값이 실제 frontier / war disposition / reserve / capability 계산에 도달함
- 카이렌의 founding culture가 `KAIREN`으로 분리되고 벨른 `KAREN`과 구별됨
- Custom Profile 적용 뒤 국가명도 시뮬레이션 진행 과정에서 정상 동기화됨

### G2A에서 수정하는 회귀

1. World 탭 Profile 교체 UI가 암묵적인 현재 선택 국가에 의존해 교체 대상을 이해하기 어려움
2. Profile을 적용하는 순간에는 `nationName`이 즉시 UI에 보이지 않을 수 있음
3. 지도에서 선택한 타일의 국가로 바로 이동할 observer bridge가 없음
4. AI Editor가 국가색/문화 정체성을 작성할 수 없음
5. G2 CSV wrapper가 실제 newline이 아니라 literal `\\n`을 사용해 Snapshot CSV schema validation이 실패함
6. 활성 War Preparation이 국가의 모든 Formation을 `WAR_PREPARATION` owner로 잡아, 실제 rally와 관계없는 Formation에서도 장기간 target write block이 발생할 수 있음

---

## 2. World 탭 AI / 국가 Profile 교체 UX

기존 G1/G2 Profile 패널은 Profile 선택과 JSON Import는 제공했지만, **어느 국가를 교체하는지 패널 자체에서 명시하지 않았다.**

G2A는 World 탭에 다음 흐름을 제공한다.

```text
교체 대상 국가 선택
        +
적용할 AI Profile 선택
        ↓
현재 국가 카드  →  적용 후 카드
        ↓
AI / 정체성 교체
```

Before / After 카드에는 다음이 표시된다.

- 국가명
- 국가색
- Profile label / id
- Built-in / Custom 여부
- founding culture
- 진행 중 월드에서 문화 변경 시 기존 주민 `cultureMix` 유지 안내

JSON Import는 Profile을 Registry에 등록할 뿐 즉시 국가를 교체하지 않는다. 사용자가 Before → After를 확인한 후 Apply 버튼을 눌러야 적용된다.

Profile 적용 시 `nationName`은 다음 simulation tick을 기다리지 않고 즉시 `Village.name`에 반영된다.

---

## 3. AI Editor → AI / Nation Editor V1

`ai-editor.html`은 기존 행동 파라미터 편집 기능을 유지하면서 optional **Nation Identity**를 작성할 수 있다.

기존 G1 JSON은 그대로 유효하다. `identity`가 없는 Profile은 본편에서 기존 국가 정체성을 보존한다.

확장 형식:

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "profile": {
    "id": "custom_id",
    "label": "Custom AI",
    "nationName": "국가명",
    "basePreset": "balanced",
    "traits": {},
    "research": {},
    "construction": {},
    "mods": {},
    "identity": {
      "nationColor": "#315f9b",
      "culture": {
        "mode": "custom",
        "id": "CUSTOM_CULTURE",
        "label": "문화 표시명",
        "color": "#7aa8c8",
        "familyCore": [],
        "familyShared": [],
        "givenCore": [],
        "givenShared": []
      }
    }
  }
}
```

`identity`는 행동 계산과 분리된 metadata/identity layer다. AI 행동은 기존 G/G1 generic profile path를 그대로 사용한다.

---

## 4. 국가색

Editor에서 Nation Color를 선택할 수 있다.

- 형식: `#RRGGBB`
- 문화색과 별도
- 적용 대상: 영토 tint/border, 국가 카드, Formation 등 `NS.NATION_COLORS`를 참조하는 국가 표시
- G2A는 초기 지도 렌더러가 캡처한 구형 local color palette 경로도 현재 `NS.NATION_COLORS`를 동적으로 읽도록 보정한다.

Profile에 `nationColor`가 없으면 현재 국가 색상을 유지한다.

---

## 5. 문화 설정

Editor에서 세 가지 모드를 선택한다.

### 5.1 현재 국가 문화 유지 — `preserve`

Profile을 적용해도 `FOUNDING_BY_NATION_ID`를 변경하지 않는다.

### 5.2 기존 기초문화 사용 — `existing`

현재 7개 founding culture 중 하나를 선택한다.

- `LUEN`
- `TER`
- `KAREN`
- `SERIA`
- `MAELA`
- `NOREA`
- `KAIREN`

### 5.3 신규 기초문화 생성 — `custom`

작성 항목:

- Culture ID
- 표시명
- 문화색
- Family Core
- Family Shared
- Given Core
- Given Shared

제약:

- Culture ID: 영문 대문자로 시작, 대문자/숫자/`_`, 2~24자
- 기본 7문화 ID를 Custom 정의로 덮어쓸 수 없음
- 표시명: 1~20자
- Core family/given pool: 각각 최소 2개
- 이름 항목: 최대 5자

Custom culture는 E4의 실제 `CULTURES`, `CULTURE_IDS`, 이름 pool, `NAME_REGISTRY`에 등록되므로 이후 E4 이름 생성 경로가 동일하게 사용한다.

---

## 6. 문화 적용 정책 — Person 연속성 보존

G2A는 Profile 교체와 주민 문화 변환을 동일시하지 않는다.

### 진행 중 월드

- 국가의 founding culture는 새 설정으로 변경 가능
- **기존 Person의 `cultureMix`는 강제 변환하지 않음**
- 정복/이주/혼합으로 형성된 실제 문화 이력을 보존

### 새 월드 첫날

정확히 Year 1 / 시작 season / Day 1에 국가 정체성을 교체하고 founding culture가 달라질 경우에만 시작 주민을 새 founding culture 100%로 초기화할 수 있다.

이 경우 시작 주민 이름도 새 문화의 Family/Given pool로 다시 생성한다.

이 규칙은 이전 세이브의 KAREN → KAIREN 같은 추론 migration과는 별개다. 그런 migration은 여전히 추가하지 않는다.

---

## 7. 지도 상단 선택 국가 Profile Card

지도 canvas 바로 위에 선택 타일의 소유 국가 요약을 표시한다.

표시 정보:

- 국가색 / 국가명
- Built-in 또는 Custom Profile
- Profile label
- 인구
- 영토 타일 수
- 기술 수
- Gold
- founding culture
- 다른 국가가 임시 점령 중이면 occupier 표시

`국가 정보 보기 →` 버튼은 해당 소유 국가를 선택하고 Nation 탭의 Overview로 이동한다.

무주지를 선택하면 국가 Profile 대신 무주지/지형 정보를 표시한다.

---

## 8. Snapshot CSV 다운로드 수정

G2 회귀 원인은 G2 telemetry wrapper의 newline 처리였다.

잘못된 형태:

```js
base.split('\\n')
lines.join('\\n')
```

이는 실제 행 구분자가 아니라 backslash + `n` 문자열을 찾는다.

G2A에서는 모든 G2 wrapper가 실제 newline을 사용한다.

```js
base.split('\n')
lines.join('\n')
```

따라서 각 snapshot row에 G2/G2A 컬럼이 정상 추가되고 기존 E14 CSV schema validator를 다시 통과할 수 있다.

다운로드 직전 validator는 유지한다. 스키마가 다시 깨지면 잘못된 CSV를 조용히 저장하는 대신 오류로 중단한다.

---

## 9. War Preparation Formation owner 범위 수정

### G2 문제

G1 owner 함수는 활성 Preparation이 하나라도 존재하면 해당 국가의 모든 field Formation에 `WAR_PREPARATION` owner를 부여했다.

그 결과 실제 rally에 참여하지 않는 Formation도 평시 HOME/BORDER target을 쓰지 못할 수 있었다.

G2 자연주행에서는 이 현상이 카이렌 한 Formation에서 장기간 반복되어 수백 회의 `FORMATION_TARGET_WRITE_BLOCKED33G1A`를 만들었다.

### G2A 규칙

`WAR_PREPARATION`은 다음 중 하나를 만족하는 Formation만 소유한다.

1. 현재 preparation의 `rallyTargets[formationId]`에 등록됨
2. `formation.v33d2IntentId`가 현재 intent와 일치
3. `formation.v33d2aPreparationIntentId`가 현재 intent와 일치

그 외 Formation은 활성 Preparation이 존재하더라도 `PEACETIME` owner를 유지한다.

우선순위 자체는 유지한다.

```text
WAR_OPERATION
> POSTWAR_WITHDRAWAL
> RECOVERY_EMERGENCY
> registered WAR_PREPARATION
> PEACETIME
```

전쟁 준비 목표, readiness, food, War Chest, Final Commitment 등의 밸런스 값은 변경하지 않는다.

---

## 10. 저장 / 로드

G2A save version:

- `0.33G2A`

저장되는 추가 identity 상태:

- 국가별 적용 Profile ID
- nationName
- nationColor
- foundingCultureId
- 적용 시점
- fresh founder reset 여부
- Custom Profile 안의 optional identity
- Custom culture 정의

Custom culture는 구버전 World.from 체인이 Person cultureMix를 normalize하기 전에 먼저 registry에 설치한다. 이후 Profile registry가 복원된 뒤 identity reference를 다시 연결한다.

---

## 11. 관측 항목

G2A Snapshot/CSV에는 다음 identity 관측값을 추가한다.

Global:

- `aiNationIdentitySchema33G2A`
- `customCultureCount33G2A`
- `profileIdentityImports33G2A`
- `profileIdentityAssignments33G2A`
- `freshFounderCultureApplications33G2A`
- `csvExports33G2A`

Nation:

- `nationColor33G2A`
- `profileIdentityCultureMode33G2A`
- `profileIdentityCultureId33G2A`

Formation owner 검증에는 기존 G1/G1A의 owner/write-block telemetry를 그대로 사용한다.

---

## 12. G2A에서 하지 않는 것

- 기존 Person 문화의 진행 중 일괄 변환
- 과거 세이브 문화 migration
- 자동 문화 융합 / 파생문화 생성
- 문화에 따른 전투/건강/출산 신규 효과
- AI Profile schema v2
- 런타임 slider로 AI를 매 tick 수정하는 기능
- 전쟁·경제 밸런스 재조정

G2A는 **Custom 국가의 정체성을 작성/적용하고 G2의 UX 및 안정화 회귀를 닫는 패치**다.

---

## 13. 다음 단계

G2A 자연주행에서 다음을 확인한 뒤 **V0.33G3 — AI Behaviour Anchor / Validation**으로 넘어간다.

핵심 검증:

1. Custom nation color가 지도/국가/군사 표시에서 일관됨
2. Custom culture 이름 생성과 founding mapping이 유지됨
3. 진행 중 Profile 교체가 기존 주민 cultureMix를 보존함
4. Snapshot CSV가 정상 다운로드되고 모든 행 column 수가 동일함
5. unrelated Formation의 Preparation write block이 사라짐
6. arbitrary Profile ID가 계속 generic AI path를 사용함

G3부터는 같은 map/seed/초기조건에서 Profile만 바꾸어 행동 차이를 측정한다.

---

# Historical Implementation Notes

아래는 G2 기준 구현 기록이며 G2A에서 삭제하지 않고 유지한다.

# V0.33G2 기준 구현 기록

## AI Profile Editor V1 + Culture / Formation Stabilization

- 기준선: **V0.33G1A**
- 패치 날짜: **2026-10-05**
- 주 작업: **Standalone AI Profile Editor V1**
- 동반 수정: **카이렌 독립 제7 문화**, **Postwar Withdrawal → War Preparation handoff 정리**
- AIProfile JSON 규격: **village-observer-ai / version 1 유지**
- 기존 세이브 문화 migration: **의도적으로 없음**

---

## 1. G1A 자연주행 검증 결과

G2는 G1A PC 자연주행 결과를 안정 기준선으로 삼는다.

G1A에서 확인된 핵심 결과:

- `formationControlConflicts = 0`
- `recoveryTargetsRehomed = 0`
- Recovery target write block = 0
- Preparation target write block만 제한적으로 관찰
- Recovery plateau exit가 실제 장기 고착 국가에서 작동
- 티아의 장기 Recovery가 `LONG_STABLE_PLATEAU`로 정상 종료

따라서 다음 두 항목은 G1A에서 CLOSED로 본다.

1. Recovery ↔ PEACETIME/BORDER target 왕복
2. 실제로 안정된 국가가 strict food threshold 때문에 Recovery에 수십 년 고착되는 문제

G2는 해당 밸런스를 재조정하지 않는다.

---

## 2. 카이렌 독립 제7 문화

### 2.1 문제

카이렌은 V0.33F5A6에서 7번째 국가/AI로 추가되었으나 당시 문화 시스템은 6개 founding culture 체계를 유지했다.

그 결과 국가 2 벨른과 국가 6 카이렌이 모두 `KAREN` 문화를 founding culture로 사용했다.

G1A 자연주행에서도 두 국가의 수도/국가 주류문화가 모두 `KAREN`으로 관찰되었다.

### 2.2 G2 변경

새 문화:

- 내부 ID: `KAIREN`
- 표시명: `카이렌계`
- 색상: `#59c7bd`

`CULTURE_IDS`는 6개에서 7개가 된다.

새 founding mapping:

```text
0 키오   -> LUEN
1 델마   -> TER
2 벨른   -> KAREN
3 라엔   -> SERIA
4 티아   -> MAELA
5 에브   -> NOREA
6 카이렌 -> KAIREN
```

### 2.3 이름 체계

KAIREN은 KAREN을 복사하지 않는다.

다음 전용 pool을 추가했다.

- Family Core
- Family Shared
- Given Core
- Given Shared

카이렌계 이름은 모음 결합이 많은 `이/에/오/아` 계열을 중심으로 구성해 벨른의 KAREN 이름과 육안으로도 구별되도록 했다.

국가명 `카이렌`은 기존 nation-name reservation 규칙에 따라 family name으로 생성되지 않는다.

### 2.4 Migration 정책

**기존 세이브의 Person `cultureMix`를 KAREN → KAIREN으로 변환하지 않는다.**

이 패치는 새 세계 기준이다.

이유:

- 현재 개발 단계에서는 이전 테스트 세이브를 이어갈 필요가 없음
- 과거 KAREN ID가 벨른/카이렌을 동시에 뜻했으므로 완전한 역사 복원은 불가능
- 불필요한 추론 migration을 엔진에 남기지 않음

구버전 세이브를 수동으로 불러올 경우 기존 Person 문화값은 그대로 유지된다.

---

## 3. Formation lifecycle 소정리

### 3.1 G1A에서 남은 경계 사례

G1A에서 전쟁 철군이 완료되는 순간 이미 다음 War Intent가 `PREPARING` 상태라면 다음 순서가 겹칠 수 있었다.

```text
POSTWAR_WITHDRAWAL 완료
-> HOME_RETURNED cleanup
-> 이미 활성인 WAR_PREPARATION owner
```

기존 G1A gate는 준비 중에는 `WAR_PREPARATION` target만 허용했기 때문에 철군의 마지막 `HOME_RETURNED` write가 block telemetry로 잡힐 수 있었다.

실제 ping-pong이나 잘못된 이동은 발생하지 않았지만 lifecycle 경계가 깨끗하지 않았다.

### 3.2 G2 규칙

War Preparation이 이미 존재하더라도 철군의 terminal cleanup은 예외적으로 허용한다.

허용되는 예외는 정확히 다음뿐이다.

- 현재 target reason이 `POSTWAR_WITHDRAWAL`
- 쓰려는 reason이 `HOME_RETURNED`
- 이어지는 target tile이 Formation의 home/core tile

이 cleanup 이후 owner가 `WAR_PREPARATION`으로 넘어가며 기존 D2 rally가 정상 target을 다시 설정한다.

따라서 전쟁 준비 자체를 약화시키거나 지연시키지 않는다.

새 관측 이벤트:

- `POSTWAR_PREPARATION_HANDOFF33G2`

Snapshot global:

- `postwarPreparationHandoffs33G2`
- `postwarHomeCleanupMarkers33G2`

---

## 4. Standalone AI Profile Editor V1

새 파일:

- `ai-editor.html`

본편 `index.html`과 독립적으로 브라우저에서 열 수 있다.

본편의 AI Profile JSON 패널에도 `AI Editor 열기` 링크를 추가했다.

Editor가 만드는 JSON은 G1에서 도입된 본편 validator와 같은 규격을 사용한다.

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "profile": { }
}
```

---

## 5. Editor Metadata

편집 가능:

- Profile ID
- Display Label
- Nation Name
- Legacy Base Preset

Profile ID 규칙:

- 영문/숫자/`_`/`-`
- 최대 48자
- 첫 글자는 영문 또는 숫자
- Built-in 7개 ID는 Import로 덮어쓸 수 없음

Built-in IDs:

```text
survival
diplomatic
expansionist
balanced
urbanist
resource_seeker
technologist
```

Built-in을 직접 수정하는 대신 `Duplicate`로 Custom ID를 만든다.

---

## 6. Traits — 10개

범위:

- `0.25 ~ 2.50`
- `1.00 = 중립`

항목:

- survival
- expansion
- trade
- urbanization
- resourceAcquisition
- technology
- production
- military
- risk
- fiscalConservatism

Traits는 한 계절의 단일 선택이 아니라 여러 시스템에 걸쳐 적용되는 장기 행동 성향이다.

---

## 7. Research Weights — 7개

범위:

- `0.25 ~ 2.50`

항목:

- food
- production
- industry
- commerce
- administration
- military
- knowledge

연구 가중치는 Knowledge를 새로 생성하지 않는다.

기존 연구 후보 점수에 대한 선호도만 바꾼다.

---

## 8. Construction Weights — 8개

범위:

- `0.25 ~ 2.50`

항목:

- farm
- sawmill
- quarry
- iron
- roads
- commerce
- military
- housing

높은 값이 실제 건물을 무료로 생성하지 않는다.

모든 건설은 기존의 다음 물리 조건을 그대로 사용한다.

- 재료
- Gold / 공동재정
- 건설 공간
- 노동
- project slot
- 기술
- 생존/전쟁 등 상위 gate

---

## 9. Seasonal Action Mods — 6개

범위:

- `-50 ~ +50`

항목:

- MAINTAIN
- FOOD
- HOUSING
- TRADE
- SECURITY
- EXPAND

Traits와 달리 이 값은 계절 정책 action score에 직접 더해지는 보정값이다.

Editor UI에서 두 개념을 별도 탭으로 분리했다.

---

## 10. Semantic Capabilities — 5개

항목:

- survivalPriority
- tradeDiplomacy
- territorialExpansion
- urbanConcentration
- resourceSeeking

범위:

- `0.00 ~ 1.00`

기본적으로 Traits에서 자동 계산한다.

자동 계산식은 본편 G1/G의 `deriveCapabilities()`와 동일하다.

### Built-in 호환 예외

기본 technologist / 카이렌 Profile은:

- `urbanization = 1.18`
- 그러나 `urbanConcentration = 0`

으로 의도적으로 설정되어 있다.

따라서 technologist를 Editor에 불러온 뒤 단순히 자동계산하면 원본과 다른 AI가 된다.

G2 Editor는 불러온 Profile의 실제 capability와 자동계산값이 다를 경우 **Override를 자동 활성화**한다.

따라서 technologist를 Duplicate하면 기존 의미가 그대로 보존된다.

사용자가 원하면 Override를 해제해 trait 기반 semantic capability로 전환할 수 있다.

---

## 11. Editor 기능

### Built-in Load

7개 기본 Profile을 reference로 불러온다.

### Duplicate

Built-in을 Custom Profile의 출발점으로 복제한다.

### Import JSON

기존 `village-observer-ai` v1 파일을 편집기로 읽는다.

### Export JSON

본편에 바로 Import 가능한 JSON을 생성한다.

Built-in ID인 상태에서는 본편 Import가 거부되므로 Editor 역시 Custom ID로 Duplicate하도록 안내한다.

### JSON Preview

현재 값을 즉시 JSON으로 표시한다.

### Validation

본편과 동일한 범위를 즉시 검증한다.

### Profile Summary

주요 trait를 막대 형태로 보여주고 현재 Profile의 대략적인 전략 성향을 설명한다.

Summary는 Editor용 설명이며 게임 계산에는 사용되지 않는다.

---

## 12. AIProfile JSON v1 Range

| 영역 | 허용 범위 |
|---|---:|
| Traits | 0.25 ~ 2.50 |
| Research | 0.25 ~ 2.50 |
| Construction | 0.25 ~ 2.50 |
| Capabilities | 0.00 ~ 1.00 |
| Action Mods | -50 ~ +50 |

Profile label 최대 40자, Nation Name 최대 20자다.

---

## 13. 본편 Custom AI 사용 절차

1. `ai-editor.html` 열기
2. Built-in Profile 불러오기 또는 Import
3. 값 편집
4. Duplicate 후 Custom ID 지정
5. JSON Export
6. `index.html` 실행
7. 관찰자 개입 탭의 `AI Profile JSON v1`에서 JSON 가져오기
8. Profile 선택
9. 적용할 국가 선택
10. `선택 국가에 적용`

Custom Profile definition과 국가의 `aiProfileId`는 기존 G1 저장 구조를 통해 save/load에 보존된다.

---

## 14. G2 Profile Telemetry

국가별 Snapshot / CSV:

- `foundingCulture33G2`
- `aiProfileSource33G2`
  - `BUILTIN`
  - `CUSTOM`
- `aiProfileFingerprint33G2`

Profile fingerprint는 현재 profile data의 작은 관측용 hash다.

동일 ID라도 Profile 값을 바꾸면 fingerprint가 달라지므로 장기 테스트에서 실제로 같은 Profile을 사용했는지 확인하기 쉽다.

Global:

- `cultureCount33G2`
- `kairenCultureReady33G2`
- `postwarPreparationHandoffs33G2`
- `postwarHomeCleanupMarkers33G2`
- `aiEditorSchema33G2`

---

## 15. 포함된 Extreme Profile Fixtures

ZIP의 `ai-profiles/`에 세 개의 검증용 Custom Profile을 포함한다.

### `g2-expansion-test.json`

- expansion = 2.50
- territorialExpansion = 1.00
- EXPAND = +40

### `g2-technology-test.json`

- technology = 2.50
- production = 2.00
- research.industry = 2.50
- research.knowledge = 2.50

### `g2-defensive-test.json`

- survival = 2.50
- expansion = 0.25
- risk = 0.25
- fiscalConservatism = 2.00

이 Profile들은 밸런스 preset이 아니다.

G2의 arbitrary custom ID와 parameter routing 회귀를 확인하기 위한 테스트 fixture다.

---

## 16. 저장

새 버전 문자열:

- `0.33G2`

새 localStorage key:

- `village-observer-v0-33g2`

과거 코드의 fallback load 자체는 유지하지만, **문화 migration은 없다.**

G2 개발/검증은 새 세계 사용을 권장한다.

---

## 17. G2에서 변경하지 않는 것

다음은 이번 범위가 아니다.

- AIProfile schema v2
- AI threshold 체계 전면 추가
- 런타임 실시간 slider 적용
- AI 행동 이유 debugger
- Profile 자동 생성/혼합
- 역사 국가 preset
- 머신러닝
- 문화 융합
- 기존 세이브의 카이렌 문화 변환
- 전쟁 밸런스
- 경제 밸런스
- Knowledge 생산량
- 연구 비용
- Recovery 조건 재조정

---

## 18. 다음 단계 — V0.33G3

G2가 기능적으로 통과하면 다음은 **AI Behaviour Anchor / Profile Validation**이다.

같은 map / 같은 초기조건에서 Profile만 바꿔 장기 결과를 비교한다.

주요 관측 후보:

- Frontier starts
- Territory growth
- War Intent 수
- 실제 전쟁 선언 수
- Technology completion timing
- 생산시설 건설
- 국제/국내 교역량
- 군사 동원
- 도시 집중도
- Treasury reserve
- Survival / Recovery 빈도

G2의 목적은 **AI를 만들 수 있게 하는 것**이고, G3의 목적은 **그 AI가 실제로 다르게 행동한다는 것을 데이터로 검증하는 것**이다.
