# Village Observer V0.33D

**패치명:** Multi-front Warfare V1  
**기준 버전:** V0.33C3F  
**날짜:** 2026-09-29

V0.33D는 C 계열에서 완성한 단일 Formation 전쟁을 **국가 단위 다중전선 지휘**로 확장한다. 핵심은 한 국가가 복수 전쟁에 참여하고, 실제 Person 병력을 여러 Field Formation으로 나누어 전쟁·전선·임무를 별도로 배정하는 것이다. C3F의 수도 우회, Deep Recovery, 패퇴 중 점령 금지, 전략도로 fallback은 그대로 유지한다.

## D 핵심 범위

1. 한 국가는 D V1에서 **최대 2개 활성 전쟁**에 동시에 참여할 수 있다. 제한값은 `MAX_WARS_D` 하나로 분리되어 이후 확장 가능하다.
2. 전쟁은 `sideAIds[] / sideBIds[] / participantIds[]`를 가지며 제3국이 기존 전쟁의 공동교전국으로 참전할 수 있다. 정식 동맹·call-to-arms는 아직 아니다.
3. 실제 현역 Person 수와 전선 수가 충분하면 최대 3개 Field Formation을 구성한다. 각 Formation은 `assignedWarId / assignedFrontId / mission`을 가진다.
4. 수도 위협 시 무조건 전군 귀환하지 않고 `INTERCEPT / SCREEN / HOLD_CORE` 중 하나를 선택하며, 복수 Formation이면 방어 임무와 기존 공세를 동시에 수행할 수 있다.
5. 같은 타일에 여러 국가·여러 Formation이 모이면 하나의 Coalition Engagement에 합류하며 기존 3~5일 라운드, 실제 Person 전사/부상, 사기·후퇴·Deep Recovery를 유지한다.
6. 활성 전쟁이 2개 이상이면 지도 상단 전쟁 현황을 드롭다운으로 전환한다. 국가 군사 탭에는 Formation별 전쟁/임무/목표/Readiness/사기/Supply를 표시한다.
7. 건물 신축·도로·업그레이드·전문화·토지정비는 지도 타일 하단에 실제 진행률 Progress Bar를 표시한다. 같은 타일에 여러 공사가 있으면 대표 bar + `×N`으로 표시한다.

## D.1 다중전쟁과 공동교전국

기존 V0.33은 사실상 한 국가가 한 War 객체에만 참여하도록 설계되어 있었다. D는 각 War를 다음처럼 확장한다.

```text
war.attackerId / defenderId   최초 전쟁 발발 주체 기록(호환성 유지)
war.sideAIds[]                A측 현재 참전국
war.sideBIds[]                B측 현재 참전국
war.participantIds[]          전체 참전국
war.d33Type                   INDEPENDENT / COALITION
war.exhaustion[nationId]      참전국별 전쟁피로
war.casualties[nationId]      참전국별 전사
war.wounded[nationId]         참전국별 부상
war.wins/losses[nationId]     참전국별 라운드 승패
```

지원되는 구조:

```text
A vs B
A vs B + A vs C
A+C vs B
A vs B+C
```

동일 두 국가가 이미 같은 War 객체에 함께 들어가 있다면 같은 편/적대 여부와 무관하게 별도 전쟁을 새로 만들지 않는다. 또한 이미 다른 War에서 서로 관계가 얽힌 국가가 동일 기존 전쟁에 중복 참전하여 모순된 편 관계를 만들지 않도록 차단한다.

AI는 90 calendar-day 저빈도 pulse에서 참전 또는 새 전쟁을 검토한다. 관계, 국경 접촉, 전력, Readiness, Food reserve와 기존 전쟁 수를 사용한다. 한 국가의 V1 동시전쟁 상한은 2이며 공격자와 피공격자 모두 같은 상한을 적용한다.

## D.2 복수 Field Formation

D는 합성 병사를 만들지 않는다. `militaryStatus32A === active`인 실제 Person을 Core Garrison과 Field Cohort들에 다시 배정한다. 전쟁 수와 현역 수에 따라 Field manpower 목표를 높이고, 실제 임무 수요가 생길 때 분할한다.

기본 상한은 3개 Formation이며 각 Field Formation은 최소 약 2명 이상이 되도록 분할 수를 제한한다. 전쟁 2개와 현역 5~6명 수준부터 제1/제2야전대가 동시에 생길 수 있다.

각 Formation의 핵심 상태:

```text
v33dAssignedWarId
v33dAssignedFrontId
v33dMission
v33dEngagementId
v33dFieldIndex
```

Formation은 한 시점에 하나의 War에만 배정되므로 같은 날 두 전쟁 loop에서 중복 이동하지 않는다.

## D.3 Mission과 수도방어 태세

D의 Mission은 작전 목표보다 한 단계 위의 임무다.

```text
OFFENSIVE   적 영토/거점 공격
INTERCEPT   접근 중인 적 Field Formation을 야전에서 요격
SCREEN      수도 인접 접근로에서 차단
HOLD_CORE   수도 타일 최종방어
LIBERATE    점령된 자국 영토 회복
RECOVERY    Deep Recovery / 후방 재편
RESERVE     즉시 전선에 투입하지 않는 예비 상태
```

적 Field Formation이 수도 2타일 이내에 들어오면 전력을 비교한다. 대략 우리 Formation이 확실히 우세하면 `INTERCEPT`, 비슷하면 `SCREEN`, 현저히 불리하거나 수도가 이미 점령되면 `HOLD_CORE`를 선택한다. 복수 Formation이면 같은 전쟁에서 방어 Mission은 우선 한 Formation만 담당하고 나머지는 공세를 유지할 수 있다.

C3의 작전 목표 종류(`CAPITAL / FIELD_ARMY / MILITARY_HUB / ADMIN_CENTER / LOGISTICS_HUB / INDUSTRIAL_HUB / TERRITORY / LIBERATE`)는 그대로 사용하며 Formation Mission 안에서 목표를 고른다.

## D.4 Coalition Engagement

D Engagement는 동일 War의 A/B side를 기준으로 한다. 같은 편의 다른 국가 Formation이 이미 전투 중인 타일에 도착하면 새 전투를 만들지 않고 기존 Engagement의 다음 라운드부터 증원으로 참가한다.

- 3~5 calendar-day 라운드 유지
- 실제 Person roster에서 전사/부상 처리
- Formation별 Battle Morale 유지
- 패배 side의 각 Formation에 기존 Retreat/Deep Recovery 적용
- 수도 Garrison도 실제 수비 병력으로 포함
- 승전 side는 3~7일 Post-battle Recovery

점령자는 해당 타일을 실제로 장악한 승전 Formation의 소속국 중 병력이 가장 큰 국가로 결정한다. 소유권 `ownerId`는 유지되고 임시 `v33OccupierId`만 변경된다.

## D.5 전쟁 종료와 개별 상태

War Exhaustion은 `war.exhaustion[nationId]`로 참전국별 계산한다. D V1의 평화 판정은 side 평균과 최고 피로도를 이용해 전쟁 전체를 종료한다. 개별 강화나 개별 참전국 탈퇴는 데이터 구조상 분리 가능하게 만들었지만 실제 협상 기능은 후속 범위다.

한 War가 끝나더라도 그 국가가 다른 War에 참가 중이면 다른 전쟁은 유지되고 Formation을 재배정한다. 종전 시 외국 영토에 남은 Formation은 비전투 `POSTWAR_WITHDRAWAL_D` corridor로 자국 영토까지 귀환한다.

## D.6 D가 Daily War Pulse를 소유

V0.33의 `advanceOneDay()`에는 lexical legacy `warPulse33()` 호출이 이미 고정되어 있다. D가 그 위에 단순히 또 pulse를 추가하면 구 전쟁 로직과 D 로직이 하루에 함께 실행될 수 있다.

D는 매 calendar-day 시작 전에 legacy root의 `lastPulseCal`을 다음 날로 pre-arm하여 inherited V0.33 war pulse를 no-op으로 만들고, 기존 일일 시뮬레이션이 끝난 뒤 **`warPulseD()`를 정확히 1회** 실행한다. 이 invariant는 복수 Formation 중복 이동과 legacy 단일전쟁 AI 재개입을 막는 핵심 회귀 조건이다.

## D.7 다중전쟁 UI

- 전쟁 1개: 기존 compact banner 유지
- 전쟁 2개 이상: `⚔ 진행 중인 전쟁 N개` + selector
- selector를 바꾸면 해당 전쟁의 전선/Formation ring을 강하게 표시
- 다른 전쟁은 약한 전선으로 함께 표시
- 군사 탭에는 각 Formation의 인원, Mission, 배정 War, 목표, Readiness, Battle Morale, Supply 표시

## D.8 건설 Progress Bar

지도 하단 bar는 시뮬레이션 시간을 새로 만들지 않는다. 기존 실제 프로젝트 값을 읽기만 한다.

```text
progress = laborProgress25 / totalLabor25
fallback = progress / duration
```

표시 대상:

- 일반 건물 신축(도로 포함)
- 주거/건물 upgrade
- specialization project
- 토지 정비

한 타일에 여러 프로젝트가 있으면 각 bar를 겹쳐 그리지 않고 평균 진행률의 대표 bar와 `×N`만 표시하며, 기존 Tile Inspector의 개별 프로젝트 상세는 유지한다.

## D.9 저장/관측

저장 키: `village-observer-v0-33d`

Fallback:

```text
0.33C3F → C3 → C2 → C1 → C → B1 → B → A → 0.33 → 0.32F
```

추가 telemetry 예시:

```text
WAR_DECLARED33D
WAR_JOINED33D
FORMATION_CREATED33D
FIELD_COHORT_FORMED33D
FORMATION_ASSIGNED33D
ENGAGEMENT_STARTED33D
ENGAGEMENT_REINFORCED33D
ENGAGEMENT_ROUND33D
ENGAGEMENT_ENDED33D
POSTWAR_WITHDRAWAL_MOVE33D
WAR_ENDED33D
```

Snapshot/CSV 추가 필드:

```text
multiWarNations33D
coalitionWars33D
maxConcurrentWarsNation33D
interventions33D
independentConcurrentDeclarations33D
activeEngagements33D
engagementRounds33D
fieldFormations33D
assignedFormations33D
constructionProgressTiles33D
activeWarCount33D
fieldFormationCount33D
assignedFormationCount33D
defenseMissions33D
offenseMissions33D
```

## D.10 회귀 검증

재시도 빌드에서 다음을 확인했다.

```text
inline scripts syntax                  79 / 79 PASS
headless startup (document injection) runtime exception 0
fresh smoke                           900 calendar advances / runtime exception 0
C3F real serializer output → D load   PASS
A-B + A-C concurrent wars             PASS
A의 2개 Formation → 서로 다른 War     PASS
one-day dual-front move               각 Formation 정확히 1회 이동
A+C vs B coalition join               PASS
모순된 중복 참전 guard                PASS
coalition engagement                  첫 라운드 + 증원 side 인식 PASS
capital defense split                 SCREEN + OFFENSIVE 동시 배정 PASS
coalition participant telemetry       atWar33 / activeWarCount 정상
mid-war D save/load                   War + Formation assignment 유지
2-war banner dropdown                 2 options PASS
construction progress observer        진행 타일 감지 PASS
CSV schema                            764 columns / mismatch 0
```

브라우저 환경의 로컬 URL 접근 정책 때문에 `file://` 직접 자동화 대신 같은 Chromium 엔진의 `Page.setDocumentContent` 방식으로 실제 DOM/Canvas/JavaScript runtime을 실행해 검증했다.

## D 범위 밖

- 점령에 걸리는 실제 시간 / 인구·도시 규모별 Occupation Progress
- 성벽·공성전
- 정식 동맹·방위조약·강제 call-to-arms
- 배상·영구 영토 할양
- 포로
- 해전/봉쇄
- 병과·장군·전술
- 수레·기병·차량 등 mobility equipment

---

# 이전 C3F 이하 기술 문서

# V0.33C3 기준 기능

V0.33C3는 C2 자연전쟁에서 드러난 **수도 반복 돌격**, **중손실 부대의 얕은 재정비 후 재돌입**, **광역국가의 도로 건설 starvation**을 정리하고, 다음 V0.33D의 복수 Formation·다중전선·다중전쟁을 받을 수 있도록 작전 수준 판단 기반을 추가하는 패치다.

이번 버전은 전투력·사상자·War Exhaustion·점령 효과의 핵심 공식을 다시 밸런싱하지 않는다. 또한 C2의 40-tech Knowledge 비용 총합 **7,605**도 변경하지 않는다. C2 장기주행에 사용된 세이브는 상당 기간을 구 기술비로 진행했기 때문에, 기술 완료 시점은 이후 더 이른 C2/C3 시작 세계에서 별도로 평가한다.

C3의 핵심 범위는 다음 네 축이다.

1. 수도를 포함한 작전 목표 다변화와 수도 공격 feasibility
2. 중손실 Formation의 `DEEP_RECOVERY`와 실제 Recovery Anchor
3. 광역국가에서도 도로가 영구 후순위가 되지 않는 전략 도로망
4. 성향별 기본 국가명 고정 + 이름/성향 독립 구조 유지

다중전쟁, 제3국 참전, 복수 야전군, Formation별 독립 전선 배정은 C3 범위가 아니며 V0.33D로 유지한다.

---

# 0.33C3 변경사항

## C3.1 Operational Targeting V1

C2까지의 전쟁 AI는 상대 수도에 높은 전략가치를 부여하고 최근 패배 경로에 페널티를 적용했지만, 수도의 실제 방어력을 공격 전력과 비교하지 않았다. 그 결과 같은 수도에서 여러 번 패배해도 `수도 → 후퇴 → Regroup → 수도`를 반복할 수 있었다.

C3는 적 영토를 다음 작전 목표 종류로 분류한다.

```text
CAPITAL          적 수도
FIELD_ARMY       적 야전 Formation
MILITARY_HUB     병영 / 훈련장 / Armory / 감시탑 / 요새
ADMIN_CENTER     행정사무소가 있는 행정 중심지
LOGISTICS_HUB    시장 / 대시장 / 교역소 / Merchant Guild / 창고 / 항구
INDUSTRIAL_HUB   철광산 / 제련소 / 대장간 / 채석장 / 석재가공소
TERRITORY        일반 적 영토
LIBERATE         적에게 점령된 자국 영토
DEFEND_CORE      자국 수도 긴급 방어
```

각 후보는 다음 요소를 합산해 평가한다.

- 목표 자체의 전략가치
- 해당 타일 인구 및 중요 시설
- 예상 이동시간
- 현재 공격 momentum
- 최근 패배 경로 페널티
- 수도라면 예상 공격력 / 예상 수도 방어력

목표 선택은 더 이상 상대 수도를 무조건 최종 목적지로 고정하지 않는다. 수도가 현재 전력으로 비현실적이면 군사거점·행정중심·물류거점·산업거점·일반 영토 등이 선택될 수 있다.

### 수도 공격 feasibility

수도 후보는 현재 Formation과 수도의 실제 수비 병력을 사용해 대략적인 전력을 추정한다.

```text
raw ratio = estimated attack power / estimated capital defense power

required modifier
= 1.00
+ Supply < 50      → +0.15
+ Battle Morale<-10→ +0.15

effective ratio = raw ratio / required modifier
```

유효전력비를 기준으로:

```text
< 0.80       수도 직접공격 보류
0.80~1.00    강한 목표점수 페널티
1.00~1.20    상황에 따라 공격 가능
>= 1.20      수도 공격 적극 고려
```

이는 전투 결과를 미리 확정하는 규칙이 아니다. 실제 Engagement는 기존 전투 계산을 그대로 사용한다. C3 판단은 **현재 관측 가능한 병력·훈련·장비·보급·사기·지형·방어시설을 이용해 공격 전에 위험도를 추정**하는 작전 AI다.

관측 이벤트:

```text
FORMATION_TARGET_SELECTED33C3
CAPITAL_ASSAULT_REJECTED33C3
CAPITAL_ASSAULT_APPROVED33C3
```

`FORMATION_TARGET_SELECTED33C3`에는 target kind, target tile, 작전점수, 이동비용, 수도 평가 시 공격/방어 추정값과 전력비를 기록한다.

## C3.2 Capital Assault Failure Memory

수도 공격 실패는 일반적인 최근 패배와 별도로 Formation에 기억된다.

```text
1회 실패    60 calendar-day 재공격 cooldown
2회 실패   120 calendar-day
3회 이상   180 calendar-day
```

- 동일 수도에 대한 최근 실패 횟수는 Formation별로 저장한다.
- 최근 실패 기억은 장기간 영구 낙인이 되지 않도록 약 720일 범위에서 판단한다.
- 2회 이상 실패한 경우 단순히 시간을 기다리는 것만으로는 부족하다.
- 마지막 수도 실패 이후 **비수도 적 영토 점령 또는 비수도 Engagement 승리** 같은 `operational progress`가 있어야 수도를 다시 검토할 수 있다.
- 수도를 실제로 돌파하면 해당 수도 공격 실패 누적을 초기화한다.

이 구조의 목적은 `수도 돌격 → 패배 → 같은 수도 돌격` 루프를 끊고, 주변 영토와 거점을 먼저 확보하는 우회 작전을 자연스럽게 만들기 위함이다.

## C3.3 Deep Recovery

C1의 1~2타일 전술 후퇴는 유지한다. 단, 패전 상태가 심각한 Formation은 더 이상 가까운 타일에서 짧게 Regroup한 뒤 바로 전선으로 복귀하지 않는다.

C3는 패전 시 다음 신호를 합쳐 `recoverySeverity`를 계산한다.

```text
전투 시작 대비 병력 손실률
현재 잔존 manpower
Battle Morale
같은 전선의 연속 패배 횟수
현재 Formation Supply
```

대표 severity 가중치:

- 손실률 25% 이상: +1 / 40% 이상: +2
- 잔존병력 2명 이하: +1 / 1명 이하: +2
- Battle Morale -8 이하: +1 / -15 이하: +2
- 2연패: +1 / 3연패 이상: +2
- Supply 45 미만: +1 / 30 미만: +2

severity가 임계값에 도달하면 `DEEP_RECOVERY`를 시작한다.

### Recovery Anchor

실제 자국 영토의 다음 시설을 후방 재편 후보로 평가한다.

```text
병영
훈련장
Armory
행정사무소
감시탑
수도
```

단순 시설 우선순위가 아니라 다음 요소를 함께 본다.

- 시설 가치
- 적 Formation과의 안전거리
- 도로 유무
- 해당 정착지 인구
- 실제 이동비용
- 적 점령 여부

선택 후 Formation은 실제 타일 경로를 따라 거점까지 다단계 철수한다. 도착 후 **30~60 calendar-day** Regroup을 수행한다.

```text
패배
→ 전술 이탈
→ 여러 타일 후방 철수
→ Recovery Anchor 도착
→ 30~60일 재편
→ WAR_READY 복귀
```

신규 이벤트:

```text
RECOVERY_ANCHOR_SELECTED33C3
DEEP_RECOVERY_STARTED33C3
DEEP_RECOVERY_ARRIVED33C3
DEEP_RECOVERY_COMPLETED33C3
```

C3는 후방 거점에서 synthetic soldier나 synthetic equipment를 생성하지 않는다. 병력·장비·Readiness 갱신은 기존 Person-backed 군사 및 Equipment 파이프라인을 유지한다.

## C3.4 Strategic Road Network

기존 `autoInfrastructure()`는 대체로 농경지 → 저장/시장/채석 → 도로 순으로 첫 실행 가능한 건물을 고르고 종료했다. 영토가 넓은 국가는 항상 새 농경지 후보가 남아 있어 도로가 오랫동안 실행 기회를 얻지 못할 수 있었다.

C3는 기존 인프라 AI 앞에 저빈도 **전략 도로 proposal**을 추가한다.

중요 거점 후보:

```text
수도
행정 중심지
군사시설 거점
상업 거점
산업 거점
고인구 정착지
외국과 접한 국경 거점
```

수도에서 해당 거점까지의 실제 자국 경로를 계산하고 다음을 이용해 도로 연결가치를 평가한다.

- 거점 종류와 가치
- 경로 길이
- 경로에서 빠진 도로 수
- 현재 국가 전체 road share

도로 proposal이 기존 인프라 긴급도보다 충분히 높거나, 광역국가인데 road share가 매우 낮으면 기존 farm-first 순서를 선점할 수 있다.

단, **Food Crisis는 hard override**다. 식량 비축이 심각한 수준이면 전략도로가 생존 인프라를 선점하지 않는다.

도로는 `startConstruction()`을 그대로 사용하므로 실제 목재·석재·노동·project capacity가 필요하다.

신규 이벤트:

```text
ROAD_NETWORK_PROPOSAL33C3
BUILDING_STARTED reason=C3_STRATEGIC_ROAD_NETWORK
```

## C3.5 Nation Name Preset

새 세계의 기본 국가명은 성향별로 고정한다.

| AI 성향 | 기본 국가명 |
|---|---|
| 생존안정형 (`survival`) | 키오 |
| 교역외교형 (`diplomatic`) | 델마 |
| 영토확장형 (`expansionist`) | 벨른 |
| 균형형 (`balanced`) | 라엔 |
| 도시집약형 (`urbanist`) | 티아 |
| 자원개척형 (`resource_seeker`) | 에브 |

이름과 성향은 하드코딩으로 동일시하지 않는다. 내부적으로 별개 속성을 유지한다.

지원 모드:

```text
DISPOSITION_FIXED   성향별 기본 이름
SHUFFLE             여섯 기본 이름을 무작위 배치
RANDOM              기존 이름 풀에서 고유 이름 무작위 선택
CUSTOM              swap API 등으로 사용자 변경
```

API:

```text
VSim.V033C3.setNameMode(mode)
VSim.V033C3.applyNationNames(world, mode)
VSim.V033C3.swapNationNames(world, nationIdA, nationIdB)
```

- 기존 저장파일은 저장된 국가명을 그대로 보존한다 (`LEGACY_PRESERVE`).
- 새 자연 세계는 기본적으로 `DISPOSITION_FIXED`를 사용한다.
- 새 MapData 세계도 기본 성향 프리셋을 적용한다.

## C3.6 UI / Observer

기존 B1/C/C1 전쟁 시각화는 유지한다.

국가-군사 탭에 작은 `C3 작전 판단` 블록을 추가한다.

표시:

- 현재 후방 재편 Formation 수
- 국가 도로 수 / 영토 수
- 최근 작전 목표 종류
- 수도 평가가 있었으면 최근 예상 전력비

상단 runtime status에는 누적 수도 공격 보류, Deep Recovery 시작, 전략도로 착공 수를 간단히 표시한다.

Snapshot/CSV 신규 필드:

```text
Global
capitalAssaultRejected33C3
capitalAssaultApproved33C3
deepRecoveryStarted33C3
deepRecoveryCompleted33C3
roadProposals33C3
roadStarts33C3
targetSelections33C3

Nation
deepRecoveringFormations33C3
maxDefeatStreak33C3
roadTiles33C3
roadShare33C3
nationNameMode33C3
```

C2 735열에서 C3는 **747열**이 된다.

## C3.7 Save / Compatibility

저장 버전:

```text
0.33C3
```

새 저장 상태에는 다음 Formation-level C3 정보가 포함된다.

- Deep Recovery 여부 / anchor / severity / 원인
- 마지막 operational progress 시점
- 같은 수도 공격 실패 횟수
- 마지막 수도 공격 실패 시점 / 타일
- 최근 작전 목표 진단

지원 fallback:

```text
0.33C2
0.33C1
0.33C
0.33B1
0.33B
0.33A
0.33
0.32F
```

C2 및 이전 저장파일에는 C3 필드가 없으므로 기본값으로 초기화한다. 기존 국가명은 변경하지 않는다.

---

# 검증

구현 후 다음 회귀검사를 수행했다.

- Inline JavaScript **78/78 syntax PASS**
- Headless Chromium exact HTML runtime exception **0**
- V0.33C2 save → C3 import PASS
- C2 저장 국가명 보존 / `LEGACY_PRESERVE` PASS
- 새 세계 성향별 고정 이름 6/6 PASS
- SHUFFLE / RANDOM / 국가명 swap API PASS
- C2 Knowledge 비용 총합 **7,605 유지** 확인
- 약한 공격군의 수도 후보: `CAPITAL_ASSAULT_REJECTED33C3(POWER)` 후 비수도 목표 선택 PASS
- 강한 공격군의 수도 후보: `CAPITAL_ASSAULT_APPROVED33C3` PASS
- Supply/Battle Morale을 반영한 effective power ratio 계산 PASS
- 동일 수도 2회 실패 기억 → `NEEDS_PROGRESS` 차단 PASS
- 수도 실패 횟수 save/load 보존 PASS
- 심각 패전 fixture: Deep Recovery 판정 + 실제 Recovery Anchor + 다단계 후퇴 PASS
- Deep Recovery 상태/후퇴경로 save/load PASS
- Deep Recovery Regroup 완료 → `DEEP_RECOVERY_COMPLETED33C3` 및 상태 해제 PASS
- 광역·저도로 국가의 전략도로 proposal 및 실제 `BUILDING_STARTED` PASS
- Food Crisis에서 전략도로 preemption 차단 PASS
- CSV **747 columns / schema mismatch 0**
- Fresh-world smoke runtime error 0

아직 C3의 핵심 작전 AI는 **사용자의 장기 자연전쟁 데이터로 최종 검증해야 한다.** fixture 검증만으로 수도 우회·후방재편 빈도와 실제 전쟁의 재미를 확정하지 않는다.

---

# 다음 단계

C3 자연주행에서 확인할 핵심은 다음이다.

1. 압도적으로 불리한 동일 수도 공격이 반복되지 않는가
2. 수도를 못 치는 군대가 주변 영토·군사/행정/물류 거점을 실제로 선택하는가
3. 중손실 Formation이 전선에서 충분히 이탈해 Recovery Anchor까지 이동하는가
4. Deep Recovery 이후 재돌입이 너무 느리거나 너무 빠르지 않은가
5. 벨른처럼 광역국가도 생존위기를 해치지 않으면서 실제 도로망을 확장하는가
6. 기존 Engagement/후퇴/War Exhaustion/점령/Person casualty가 회귀하지 않는가

이 검증이 끝나면 V0.33D에서 **복수 Formation + Formation별 전선 배정 + 다중전쟁 + 제3국 참전**으로 확장한다.

---

# 이전 버전 상세 문서

아래는 V0.33C2까지의 누적 기술 문서다.

# Village Observer V0.33C2

**패치명:** Stabilization, Pace & UI Consolidation  
**기준 버전:** V0.33C1  
**날짜:** 2026-09-29

V0.33C2는 C/C1에서 구축한 지속 교전·단계 후퇴·Regroup·전투 사기·군사 기동 기반을 유지하면서, C1 자연주행에서 확인된 장기 사기 잔류 버그와 전체 게임 페이스/UI 문제를 정리하는 안정화 패치다.

C2의 범위는 다음 여섯 가지다.

1. 종전 후 멈추던 Battle Morale 회복 수정
2. 군사 기본 이동시간 15 → 10 calendar-day
3. 현재 40개 기술의 Knowledge 비용을 60년대 완료 목표에 맞게 압축
4. 국가별 1~3년 지속 중기 전략 프로그램 도입
5. 국가-경제 탭의 개발용 진단 블록 정리
6. V0.29/V0.30 경제 표현을 하나의 「국가 경제 요약」으로 통합

다중 전쟁, 제3국 참전, 복수 야전군, Formation별 전선 배정, 비수도 전략목표의 본격 확장은 C2 범위가 아니며 다음 V0.33D 계열로 넘긴다.

---

# 0.33C2 변경사항

## C2.1 Peace-time Battle Morale Recovery Fix

C1에서는 전투 사기 자체는 Formation 단위로 정상 저장되었으나 회복 함수가 활성 전쟁의 `warPulse33()` 안에서만 호출되어 종전 후 회복이 중단되는 문제가 있었다.

C2에서는 평시 Formation/Garrison 사기 회복을 전쟁 루프에서 분리한다.

```text
전시 일반 상태      0.06 / calendar-day   (C1 유지)
RETREAT/REGROUP     0.45 / calendar-day   (C1 유지)
평시                0.10 / calendar-day   (C2)
```

- 종전 즉시 0으로 초기화하지 않는다.
- 과거 전쟁의 사기 충격은 약 1년 안팎에 걸쳐 자연스럽게 0으로 회복한다.
- C1 세이브에서 수년간 고착된 사기도 C2 로드시 마지막 사기 갱신시점과 현재 calendar-day 차이를 이용해 정상 회복한다.
- 실제 교전 Formation/Garrison별 modifier 구조는 유지한다.
- `BATTLE_MORALE_RECOVERED33C2`는 평시 회복으로 modifier가 0에 도달한 시점만 저빈도로 기록한다.

## C2.2 Military Mobility Pace

C1의 군사 이동 계산식은 유지하고 base만 변경한다.

```text
실제 이동일
= 기본 10일
× 지형 계수
× 도로 계수
× Supply 계수
× 상태 계수
× 장비 hook
× 기술 hook
```

초기 계수:

```text
평지 / 초지       ×1.00
숲                ×1.15
암지              ×1.25
산악              ×1.50
도로 한쪽         ×0.84
도로 양쪽         ×0.72
```

- 기존 15일 base → 10일 base
- 정상 평지 Formation은 대략 10일 수준
- 숲은 약 12일, 암지는 약 13일, 산악은 약 15일 수준
- 연속 도로 평지는 약 7~8일 수준까지 단축 가능
- Supply가 나쁘면 다시 증가
- RETREAT와 POSTWAR WITHDRAWAL도 같은 공통 이동 계산을 사용
- Equipment/Technology mobility hook은 C2에서도 1.0으로 유지한다.

## C2.3 Technology Pace Rebalance

C1 최종 40-tech 비용 총합은 16,080 Knowledge였다. C2는 이를 **7,605 Knowledge**로 낮춘다.

비용 압축 규칙은 C1 최종 비용을 기준으로 다음과 같다.

```text
200 이하        ×0.85
201~400         ×0.60
401~600         ×0.45
601 이상        ×0.35
```

5 Knowledge 단위로 반올림하며 최소 비용은 40이다.

목표는 모든 국가가 정확히 60년에 동시에 완료하는 것이 아니라:

```text
60년대 초반   대부분 중후반 기술 진입
60년대 중후반 선도국 40/40 도달 가능
69년 전후     다수 국가가 35~40/40에 접근
```

하는 흐름이다. Eureka, prerequisite, 국가별 연구우선순위 차이는 그대로 유지한다.

세이브 호환 시 기존 `researchProgress`와 완료 기술은 보존하며 새 비용만 적용한다.

## C2.4 Persistent Strategic Program V1

기존 AI는 forecast·top-3 goals·reserve를 보유했으나 거의 매 계절 다시 계산되어 국가의 중기 방향성이 약했다.

C2는 그 위에 국가별 **Persistent Strategic Program**을 추가한다.

프로그램 후보:

- 식량 자립
- 영토 개척
- 도시 집중
- 교역 허브
- 철산업 육성
- 연구·교육
- 군비 확장
- 재정 축적
- 전후 복구

작동 규칙:

- 기본 지속기간 540 / 720 / 900 / 1080 calendar-day 중 하나
- 1년에 한 번 재평가
- 현재 프로그램보다 다른 후보 점수가 충분히 높을 때만 중도 전환
- 심각한 식량위기·Recovery·Survival Mode는 기존 emergency logic이 프로그램보다 우선
- AI disposition이 프로그램 선택점수에 강하게 반영됨
- 프로그램은 seasonal action score와 연구 우선순위에 영향을 준다.
- 기존 `aiPlan.reserves`도 프로그램에 맞게 보정한다.
- 새로운 daily AI scan은 추가하지 않는다.

관측 이벤트:

```text
AI_STRATEGIC_PROGRAM33C2
```

Snapshot/CSV에는 현재 프로그램, 프로그램 나이, 남은 기간을 기록한다.

## C2.5 국가 경제 UI 정리

다음 블록은 **국가-경제 탭에서만 표시를 제거**한다.

- 행정권 V1.1
- 상위시설 진단
- 유지보수 자재 진단
- 정착지별 식량 비축
- Gold 순환
- E4 전략 교역망 계획
- E5 교역망 안정화
- E6 국제 운송 회계
- E7 상업 전문화
- E8 Construction Proposal V1
- E9 상업 endpoint/Proposal 검증
- E10 생존 불변조건

중요:

- 관련 시뮬레이션 기능은 삭제하지 않는다.
- devlog와 telemetry도 삭제하지 않는다.
- CSV 필드도 유지한다.
- 향후 별도 「경제 상세」/「개발자 진단」 UI로 다시 노출할 수 있다.
- E6~E10 등 다른 탭에서 사용되는 관측 UI는 해당 탭의 기존 목적을 유지한다.

## C2.6 국가 경제 요약

V0.29 국내 Gold 순환과 V0.30 행정·도시경제의 사용자 표시를 하나의 블록으로 통합한다.

표시 항목:

```text
국고 Gold
Settlement Market Gold
Person Gold
총 국내 통화량
누적 임금
누적 소비
누적 세금
공공지출
국내 거래 횟수
국내 거래량
국내 거래 Gold
행정 중심지 수
누적 행정세
누적 지역 공공지출
```

내부 회계모델은 기존 V0.29/V0.30을 그대로 사용한다.

---

# C2 Telemetry

C1의 725-column snapshot CSV에 C2 필드를 추가한다.

Global:

```text
techCostTotal33C2
strategicProgramChanges33C2
peaceMoraleTicks33C2
peaceMoraleCompleted33C2
```

Nation:

```text
strategicProgram33C2
strategicProgramLabel33C2
strategicProgramAgeDays33C2
strategicProgramRemainingDays33C2
peaceBattleMoraleMagnitude33C2
techCompletionShare33C2
```

C2 CSV는 총 **735 columns**다.

---

# C2 저장 호환성

저장 키:

```text
village-observer-v0-33c2
```

fallback:

```text
0.33C1
0.33C
0.33B1
0.33B
0.33A
0.33
0.32F
```

C1의 다음 상태는 그대로 이어받는다.

- Engagement
- staged retreat path
- Regroup
- post-battle recovery
- Battle Morale modifier
- 다음 군사 이동시각
- 최근 패배 경로
- Post-war withdrawal

C2에서 추가되는 Persistent Strategic Program도 C2 save/load에서 보존한다.

---

# C2 검증 기준

정적/fixture 기준:

```text
inline JavaScript syntax        77/77 PASS
Chromium startup/runtime        error 0 (fresh smoke)
기술 수                          40
기술 비용 총합                   7,605
군사 이동 base                  10 calendar-day
평시 Battle Morale recovery     PASS
C1 save → C2 import             PASS
국가 경제 UI 진단블록 제거        PASS
국가 경제 요약                   PASS
CSV schema                       735 columns / mismatch 0
```

자연주행에서 추가로 확인할 항목:

- 종전 후 ±Battle Morale이 실제로 0 방향으로 회복하는가
- 10일 base에서 전선 속도가 지나치게 빨라지지 않는가
- 도로/지형/Supply 차이가 여전히 눈에 보이는가
- 60년대 기술 완료 목표에 얼마나 접근하는가
- AI strategic program이 국가별로 실제 장기행동 차이를 만드는가
- FOOD physical action 비중이 C1의 약 2/3 수준에서 의미 있게 낮아지는가
- 전쟁/경제/인구의 기존 안정성이 유지되는가

---

# 다음 단계: V0.33D

C2에서는 다음을 구현하지 않는다.

- 한 국가의 복수 동시 전쟁
- 제3국 참전 / A+C vs B
- 서로 독립된 A-B, A-C 전쟁의 동시 진행
- 복수 Field Formation의 전략적 생성
- Formation별 전쟁/전선 배정
- 수도 외 전략목표의 본격적 다양화
- 다중 전쟁 UI 드롭다운

이들은 서로 강하게 연결되어 있으므로 **V0.33D — Multi-front Warfare V1**에서 하나의 구조 개편으로 다룬다.

---

# 이전 버전 상세 문서

아래에는 V0.33C1 이하의 상세 구현·회귀 기록을 그대로 보존한다.

# Village Observer V0.33C1

**패치명:** Frontline Continuity + Military Mobility Foundation  
**기준 버전:** V0.33C  
**날짜:** 2026-09-29

V0.33C 자연전쟁에서는 Persistent Engagement 자체는 의도대로 작동했다. `CONTACT_SWEEP` 일일 반복은 사라지고 하나의 전투가 3~5일 간격의 라운드로 지속되었으며, 전선이 실제로 87→88→89→90→수도처럼 이동하는 장면도 자연스럽게 나타났다.

다만 장기주행에서 세 가지 전술적 문제가 확인되었다.

1. 자국 점령지가 하나라도 생기면 `strategicTarget33()`이 공격 목표 후보를 버리고 점령지 회복만 선택해, 승전 직후에도 전선을 포기하고 방향을 돌리는 경우가 있었다.
2. 패전 Formation은 한 칸 후퇴한 즉시 `REGROUPING`에 들어갔지만 승전군은 정상 이동 주기로 곧 따라붙을 수 있어, 실제 C 자연주행에서는 Regroup 시작 29회 중 21회가 재정비 종료 전에 다시 교전에 걸렸다.
3. 전투 사기는 라운드 승리 +3 / 패배 -7을 적용하고 있었지만 Field Cohort 동기화가 Person 행복도 평균으로 `morale`을 다시 계산하여 전투 사기 효과가 지속되지 않았다.

C1은 이 세 문제를 함께 정리하면서, 장차 수레·기병·철도·차량·로봇 등으로 확장할 수 있도록 **군사 이동시간을 하나의 공통 계산 프레임워크로 전환**한다.

핵심 흐름은 다음과 같다.

```text
Engagement 종료
→ 패전군 RETREATING
→ 안전한 후방 1~2타일 단계 철수
→ 짧은 DISENGAGEMENT
→ REGROUPING 15~30일
→ 전투 사기 회복
→ WAR_READY

승전군
→ POST_BATTLE_RECOVERY 3~7일
→ 전선 momentum 유지
→ 점령지 회복 / 추격 / 수도 방어를 함께 점수화
→ 다음 전략 목표 결정
```

군사 이동은 더 이상 모든 상황에서 고정 15일/타일이 아니다.

```text
실제 이동일
= 기본 15일
× 지형 계수
× 도로 계수
× 보급 계수
× 상태 계수
× 장비 hook
× 기술 hook
```

C1에서는 장비·기술 hook은 **1.0**으로 유지한다. 현재 Equipment Coverage는 주로 무기/군장 의미이므로 단순히 장비가 많다는 이유로 이동속도가 빨라지지 않는다. 향후 실제 이동지원 장비와 기술을 별도로 연결할 수 있게 구조만 마련한다.

---

# 0.33C1 변경사항

## C1.1 Retreat & Disengagement

패전 야전 Formation은 더 이상 첫 후퇴 타일에서 즉시 장기 재정비를 시작하지 않는다.

- 교전 붕괴 직후 안전한 후방 경로를 최대 2타일까지 계산
- 첫 후퇴는 즉시 수행
- 두 번째 후퇴가 가능하면 `RETREATING` 상태에서 단계적으로 이동
- 단계 후퇴가 끝난 뒤 `REGROUPING` 시작
- 후퇴 경로는 자국 소유·통행 가능 타일을 우선하고 적 야전군과 거리를 벌리는 방향을 선호
- 후퇴 중/초기 재정비 중에는 `DISENGAGEMENT` 보호시간을 적용
- 승전군이 보호 중인 패전군이 있는 다음 타일로 즉시 진입하려 하면 짧게 대기 후 다시 판단

신규 관측 이벤트:

- `FORMATION_RETREATING33C1`
- `FORMATION_RETREAT_MOVE33C1`
- `ENGAGEMENT_DEFERRED_RETREAT33C1`
- `PURSUIT_HELD_DISENGAGEMENT33C1`

기존 `FORMATION_RETREAT33`, `FORMATION_REGROUP_STARTED33C`, `FORMATION_REGROUP_COMPLETED33C`도 계속 사용한다.

## C1.2 Winner Post-Battle Recovery

Engagement에서 승리한 Field Formation도 바로 다음 행동으로 넘어가지 않는다.

- Engagement 종료 후 3~7일 `POST_BATTLE_RECOVERY`
- 지속 라운드가 길수록 정비시간이 조금 증가
- 정비 중 일반 전쟁 이동 금지
- 완료 후 `WAR_READY` 복귀
- 최근 승리 전선 방향은 약 30일간 momentum으로 기억

신규 이벤트:

- `FORMATION_POST_BATTLE_RECOVERY_STARTED33C1`
- `FORMATION_POST_BATTLE_RECOVERY_COMPLETED33C1`

이 변경의 목적은 추격을 없애는 것이 아니라 `전투 → 붕괴 → 후퇴 → 승전군 정비 → 재추격`의 전술적 리듬을 만드는 것이다.

## C1.3 Strategic Target Continuity

기존 C까지는 자국 점령지가 하나라도 있으면 `occupiedOwn`이 전략 후보 전체를 대체했다. C1에서는 다음 후보들을 동시에 점수화한다.

- 점령당한 일반 자국 영토 해방
- 적 영토 공격
- 적 수도/core
- 최근 승리 축선의 momentum
- 최근 반복 패배 경로 페널티
- 직접 위협받는 자국 수도 방어

일반 점령지는 **높은 가중치**를 받지만 절대 우선은 아니다. 따라서 승전군이 전선 돌파 직후 적군을 계속 압박하는 편이 전략적으로 더 가치가 높으면 공격축을 유지할 수 있다.

예외:

- 자국 수도/core가 실제 점령됨 → 즉시 최우선 해방
- 적 야전군이 자국 수도 2타일 이내에 접근 → 수도 방어 후보에 긴급 가중치

## C1.4 Military Mobility Foundation

공통 이동 함수 `militaryMoveDays`를 추가하고 전쟁 이동, 평시 Formation 이동, 종전 후 철군에 연결한다.

초기 지형 계수:

| 지형 | 계수 |
|---|---:|
| 평야 | 1.00 |
| 초지 | 1.00 |
| 숲 | 1.15 |
| 암지 | 1.25 |
| 산악 | 1.50 |

도로 계수:

- 출발·도착 타일 모두 도로: ×0.72
- 한쪽만 도로: ×0.84
- 도로 없음: ×1.00

보급 계수:

- Supply 70 이상: ×1.00
- 50~69: ×1.05
- 30~49: ×1.12
- 30 미만: ×1.22

상태 계수:

- 일반 전쟁/평시 이동: ×1.00
- 종전 철군: ×0.92
- 패전 단계 후퇴: ×0.48

따라서 보급이 정상인 평지·무도로 Formation은 기존과 같은 약 **15일/타일**을 유지한다. 산악에서는 느려지고, 연속 도로망에서는 크게 빨라진다.

경로 탐색도 단순 타일 수가 아니라 예상 군사 이동일을 사용한다. 따라서 향후에는 더 긴 도로 경로가 짧은 험지 경로보다 빠른 선택이 될 수 있다.

장비/기술 이동계수는 현재 1.0이다. 향후 다음 요소를 별도 연결할 수 있다.

- 수레/군수 운송
- 기병/기계화
- 철도
- 차량
- 가상 자동화/로봇 병력

## C1.5 Persistent Battle Morale

사기를 두 층으로 분리한다.

```text
Base Morale
= 실제 소속 Person 행복도 평균

Battle Morale Modifier
= 실제 전투 승패의 지속 효과

Effective Morale
= Base Morale + Battle Morale Modifier
```

전투 결과:

- 해당 라운드 승리 Formation: `+3`
- 해당 라운드 패배 Formation: `-7`
- 최소 -35 / 최대 +18
- 국가 전체가 아니라 실제 교전에 참여한 Formation/Garrison에만 적용

회복:

- `REGROUPING` / `RETREATING`: 하루 약 0.45씩 0 방향으로 회복
- 그 밖의 전쟁 상태: 하루 약 0.06씩 천천히 0 방향으로 회복

Field Formation 동기화는 이제 Person 행복도 평균을 **Base Morale**로만 갱신하고 Battle Morale Modifier를 보존한다. 따라서 연패한 패잔병은 실제 다음 교전 Readiness에서 불리하고, 재정비 시간이 전투력 회복에도 의미를 가진다.

## C1.6 Observer / Telemetry

`FORMATION_INVASION_MOVE33`에 다음 C1 정보가 추가된다.

- `moveDays33C1`
- `nextMoveCal33C1`
- `targetKind33C1`
- 지형/도로/보급/상태 이동계수

별도 `FORMATION_MOBILITY33C1` 이벤트도 기록한다.

군사 UI에는 Formation별로 다음을 표시한다.

- 현재 상태
- 다음 이동까지 남은 일수
- 기본 사기
- 전투 사기 modifier
- 유효 사기
- 최근 이동일수와 지형/도로/보급 계수

Snapshot/CSV 추가 필드:

Global:

- `retreatMoves33C1`
- `postBattleRecoveries33C1`
- `militaryMoveSamples33C1`
- `avgMilitaryMoveDays33C1`

Nation:

- `retreatingFormations33C1`
- `postBattleRecoveryFormations33C1`
- `fieldBattleMoraleModifier33C1`
- `fieldBaseMorale33C1`
- `fieldEffectiveMorale33C1`
- `nextMilitaryMoveDays33C1`

V0.33C의 715열에서 **725열**로 확장된다.

## C1.7 Save Compatibility

- V0.33C / B1 / B / A / 0.33 저장 호환
- 저장 버전: `0.33C1`
- 신규 저장 키: `village-observer-v0-33c1`
- 기존 C `v33c.state`에 C1 Formation/Garrison 확장 상태도 함께 보존

추가 보존 대상:

- 단계 후퇴 경로 / 다음 후퇴 시각
- disengagement 종료일
- regroup 기간
- post-battle recovery 종료일
- Battle Morale Modifier / 마지막 회복일
- momentum 종료일 / 최근 승리 전장
- 다음 Formation 이동 가능일
- 최근 이동 modifier 정보

## C1.8 범위 유지

C1에서 바꾸지 않는 것:

- Engagement 3~5일 라운드 구조
- 기존 `forcePower33`의 기본 Training/Equipment/Supply/Morale 구성
- Person 사상자 확률
- 임시 점령 생산 65%
- 점령 보급 페널티
- 선전포고 점수
- War Exhaustion 공식
- 종전 조건
- War Goal / 배상 / 영구 영토 할양
- 장비 생산 밸런스
- 외교 기억

단, Battle Morale Modifier가 이제 실제로 지속되므로 **동일 전투력 공식 안에서 Morale 입력값의 역사성이 생긴다.** 따라서 장기 자연주행에서 연승 snowball 강도는 별도 관측 대상이다.

## C1.9 Regression Verification

구현 후 확인:

- inline JavaScript **76/76 syntax PASS**
- Chromium startup/runtime error 0
- V0.33C 저장 → C1 import PASS
- C1 serialize/load 후 retreat path, disengagement, post-battle recovery, battle morale, next move state 유지 PASS
- 평지/산악/연속도로 이동일 차등 동작 확인
- fixture 기준 3연승 시 승전 Formation `Battle Morale +9`, 패전 Formation `-21` 지속 확인
- Engagement 붕괴 후 패전 Formation 단계 후퇴/Regroup 및 승전 Formation Post-Battle Recovery 확인
- 일반 점령지 존재 시 공격 목표 후보가 완전히 제거되지 않음 확인
- 자국 core 점령 시 core 즉시 최우선 확인
- CSV **725 columns / mismatch 0**
- fresh-world 1000 advance call smoke: runtime error 0

35년 이후 장기 자연전쟁은 사용자 자연주행 로그로 추가 검증한다.

---

# Village Observer V0.33C

**패치명:** Engagement + Tactical Tempo V1  
**기준 버전:** V0.33B1  
**날짜:** 2026-09-29


V0.33B/B1은 전쟁 시각화 계열로 **C 착수 시점에 마감(CLOSED)** 한다. B1 자연주행에서는 지도 가독성 자체는 만족스러운 수준에 도달했지만, 같은 전장 특히 수도/핵심 타일에서 `CONTACT_SWEEP`가 매일 독립 `BATTLE33`을 만들며 사실상 하나의 장기 공방전을 수십 개 전투로 쪼개는 현상이 확인되었다.

V0.33C는 이 현상을 제거하는 것이 아니라, 자연주행에서 재미있게 나타난 **수도 공방전·전선 고착·돌파/후퇴의 리듬을 정식 지속 교전(Engagement) 상태로 승격**한다.

핵심 흐름은 다음과 같다.

```text
적군 접촉
→ ENGAGEMENT_STARTED33C
→ 3~5일 간격 Engagement Round
→ 같은 전투력/사상자 공식으로 BATTLE33 기록
→ 연속 패배 또는 최대 라운드에서 BREAK
→ 패배 야전 Formation 후퇴
→ 15~30일 REGROUPING
→ 최근 패배 경로 임시 회피
→ 승자가 실제 잔존 수비가 없을 때만 점령
```

수도/core에서는 기존 지형·시설·CORE_GARRISON 방어를 그대로 사용하면서, 일반 전장보다 **한 번 더 연속 패배해야 붕괴**하도록 하여 장기 방어가 조금 더 쉽게 발생한다. 패배한 CORE_GARRISON은 20~35일 `ROUTED` 상태로 전투에서 빠졌다가 자동 복귀한다.

중요하게도 C는 다음 기존 공식을 바꾸지 않는다.

- 전투력 계산식
- 실제 Person 사상자 확률
- 점령지 생산 65%
- 점령 보급 페널티
- AI 선전포고 점수
- War Exhaustion 계산
- 종전 조건

---

# 0.33C 변경사항

## C.1 Persistent Engagement

동일 타일에 적대 병력이 동시에 존재하면 더 이상 매일 `CONTACT_SWEEP` 전투를 바로 실행하지 않는다. 대신 War 내부에 `engagements33C[]`를 생성한다.

각 Engagement는 다음 상태를 보존한다.

- Engagement ID / War ID / Tile ID
- 교전 양국
- 시작·종료 calendar day
- 라운드 수
- 양측 라운드 승수
- 연속 패배 수
- 최근 승자 / 다음 라운드 예정일
- 수도/core 교전 여부
- 최종 승자·패자·종료 이유

교전 중 Formation은 `ENGAGED` 상태가 되어 일반 전쟁 이동에서 제외된다.

## C.2 Tactical Tempo

Engagement의 전투 라운드는 **3~5 calendar-day 간격**으로 진행된다. 각 라운드는 기존 V0.33 `forcePower33`, 방어 지형 계수, 실제 Person 사상자 공식을 그대로 사용하고 `BATTLE33`로 기록한다.

붕괴 기준:

```text
일반 전장: 3연속 라운드 패배 또는 최대 6라운드
수도/core 방어: 4연속 라운드 패배 또는 최대 7라운드
```

최대 라운드까지 승부가 나지 않으면 누적 라운드 승수를 우선하고, 동률이면 현재 잔존 전투력을 비교해 전선을 정리한다.

이 변경으로 기존 자연주행에서 15일 연속 매일 생성되던 수도 `CONTACT_SWEEP`가 하나의 10~30일 Engagement와 몇 개의 의미 있는 라운드로 묶인다.

## C.3 Regroup

Engagement 또는 기존 즉시 전투에서 패배해 후퇴한 Field Formation은 **15~30일 `REGROUPING`** 상태가 된다.

- 재정비 중 전쟁 이동 금지
- 완료 후 자동 `WAR_READY` 복귀
- 최근 패배 타일과 패배 연속 횟수를 Formation에 기록
- 최근 360일 내 같은 패배 타일을 다시 통과하는 전략 목표에는 임시 페널티
- 패배가 누적될수록 경로 페널티 증가
- 승리 시 패배 streak 일부 완화

대체 경로가 없다면 기존 경로를 완전히 금지하지 않는다. 따라서 막힌 전선에서도 AI가 영구 정지하지 않는다.

## C.4 Core Garrison Routed State

CORE_GARRISON은 기존과 같이 수도에서 실제 Person 병력으로 Engagement에 참가한다. 야전 Formation과 달리 후퇴할 수 없으므로 수도 방어가 붕괴하면 20~35일간 `ROUTED` 상태로 전투 판정에서 제외된다.

이 기간 공격군이 남아 있고 다른 실제 수비 병력이 없으면 기존 임시 점령 규칙으로 수도를 점령할 수 있다. Routed 기간이 끝나면 Garrison은 다시 정상 수비 판정에 들어온다.

## C.5 Devlog / Observer

신규 이벤트:

- `ENGAGEMENT_STARTED33C`
- `ENGAGEMENT_ROUND33C`
- `ENGAGEMENT_ENDED33C`
- `FORMATION_REGROUP_STARTED33C`
- `FORMATION_REGROUP_COMPLETED33C`
- `GARRISON_ROUTED33C`

`BATTLE33`도 유지하며 Engagement 라운드에는 `source: ENGAGEMENT_ROUND`, `engagementId`, `engagementRound`를 추가한다. 기존 B/B1 Battlefield Observer는 그대로 `BATTLE33`을 읽으므로 시각화 호환성이 유지된다.

Statistics에는 `지속 교전 기록` 패널을 추가하여 날짜, 지속일, 라운드, 승자, 수도 교전 여부를 확인할 수 있다. 지도 타일 Inspector와 전쟁 배너에서도 현재 Engagement/재정비 수를 볼 수 있다.

지속 교전으로 적대 Formation이 같은 타일에 여러 날 공존할 수 있으므로 중앙 병력 표시는 합계 하나가 아니라 `⚔3↔2`처럼 **양측 현재 Field manpower를 분리해 표시**한다. B1의 병력 가독성 원칙을 C에서도 유지한다.

## C.6 Save Compatibility

- V0.33B1 / B / A / 0.33 저장 호환
- Engagement 자체는 기존 `v33.war.wars[].engagements33C[]`에 저장
- `MilitaryFormation.from()` / `MilitaryCohort.from()`이 확장 필드를 기본적으로 버리므로 C 전용 `v33c.state`에 다음을 별도 보존
  - Formation engagement ID
  - regroup 종료일
  - 최근 패배 tile / 날짜 / streak
  - CORE_GARRISON routed 종료일

B1 저장을 C로 불러오면 Engagement/Regroup 상태가 없는 정상 전쟁 상태로 시작하고, 이후 접촉부터 C 규칙이 적용된다.

## C.7 Telemetry / CSV

세계 snapshot 신규 필드:

- `activeEngagements33C`
- `engagementsStarted33C`
- `engagementsEnded33C`
- `engagementRounds33C`
- `capitalEngagements33C`
- `regroupingFormations33C`

국가 row 신규 필드:

- `engagedFormations33C`
- `regroupingFormations33C`

CSV는 V0.33B1의 707열에서 **715열**로 확장된다.

## C.8 회귀 검증

최종 배포본 기준:

```text
inline script syntax          75 / 75 PASS
Chromium startup/runtime      error 0
B1 save -> C import           PASS
Engagement start              round 1 / immediate retreat 없음 PASS
3~5 day round cadence         4,4,4,5 day fixture PASS
legacy CONTACT_SWEEP          fixture 0회 PASS
3연속 패배 break              PASS
패배 Formation regroup        PASS
Engagement save/load          active state + formation link 유지 PASS
core pure-garrison break      수도 점령 + routed 처리 PASS
CSV schema                    715 columns / mismatch 0
```

장기 자연주행은 실제 전쟁이 시작되는 35년 이후 사용자 관찰 데이터로 추가 검증한다.

---

아래는 기준이 된 V0.33B의 상세 기술 기록이다. V0.33B는 V0.33A 자연전쟁에서 확인된 **전투·점령의 지도 가시성 부족**을 보완하는 관측/시각화 패치였다. 전투 계산, 선전포고, 사상자, 후퇴, 점령 효과, War Exhaustion과 종전 규칙은 변경하지 않는다.

V0.33A에서는 실제 전투와 점령/해방이 정상 발생했지만, 기존 V0.33 점령 overlay와 V0.33A 전선 overlay가 `renderWorld()` 계층에 연결되어 실제 지도 탭의 `renderMap()`에서 기대한 대로 표시되지 않는 구조가 확인되었다. V0.33B는 전쟁 overlay를 **지도 렌더 단계에 직접 연결**하고, 전투 이벤트를 짧게 보존하는 소형 observer cache를 추가한다.

핵심 사용자 경험은 다음과 같다.

```text
전쟁 발생
→ 지도 상단 전쟁 배너
→ 점령지: 원소유국 색 + 점령국 사선/테두리/깃발
→ BATTLE33 발생: ⚔ + 충돌 링
→ 패배 Formation 실제 후퇴
→ 최근 전투 흔적 45일 유지
→ 타일 선택 시 전투력·승자·사상자 확인
```

점령은 여전히 임시 통제이며 `ownerId`를 바꾸지 않는다. 이번 버전은 승전 보상, 배상, 영구 영토 할양, War Goal / Peace Outcome을 추가하지 않는다.

---


V0.33B1은 V0.33B 자연전쟁 관찰에서 확인된 **최근 전투 마커와 현재 Formation 병력 숫자의 시각적 충돌**을 수정하는 소규모 UI 안정화 패치다. 전투 계산·사상자·후퇴·점령·War Exhaustion·AI 선전포고·종전 규칙은 변경하지 않는다.

전투 지도 정보의 우선순위는 다음과 같이 고정한다.

```text
좌상단  최근 전투 ⚔ / 반복 시 ⚔×N
중앙    현재 Field Formation 병력 ▲N  ← 최상위 가독성
우상단  현재 점령 ⚑
외곽    최근 전투의 얇은 충돌 링 / 전선 / 점령 테두리
```

---

# 0.33B1 변경사항

## B1.1 전투 마커 재배치

- 중앙의 큰 검은 원과 대형 `⚔`를 제거한다.
- 최근 전투는 타일 좌상단의 작은 배지로 이동한다.
- 0~15일은 배지 + 선명한 얇은 외곽 링, 16~30일은 배지 + 약한 링, 31~45일은 흐린 배지만 남긴다.
- 46일 이후 제거되는 기존 TTL은 유지한다.

## B1.2 Formation 병력 숫자 최우선

군사 지도(`military32D`)에서는 전쟁 overlay를 모두 그린 뒤 현재 Formation 병력 라벨을 마지막에 한 번 더 렌더한다. 따라서 `▲2`, `▲3` 같은 실제 Person 기반 병력 숫자는 최근 전투 흔적보다 항상 위에 표시된다.

## B1.3 반복 전투 합산

최근 45일 동안 같은 타일에서 전투가 반복되면 지도에는 여러 아이콘을 겹치지 않고 하나의 `⚔×N` 배지로 합산한다. Tile Inspector에도 같은 기간 해당 타일의 전투 횟수를 표시한다. observer 원본 `recentBattles[]`는 그대로 보존하므로 전투 상세 데이터는 잃지 않는다.

## B1.4 호환성 / 데이터

- V0.33B 및 V0.33A 저장 호환
- 기존 `v33b.observer` 구조 유지
- `recentBattleMarkers33B`, `recentBattleSites33B`, `recentTerritoryEffects33B` 유지
- CSV **707열 유지**
- 시뮬레이션 밸런스 변경 없음

---

# 0.33B 변경사항

## B.1 지도 전쟁 overlay 연결 수정

V0.33/V0.33A의 전쟁 시각 요소 일부가 `renderWorld()`에 연결되어 실제 지도 탭에서 약하거나 누락될 수 있었다. V0.33B는 다음 요소를 `UI.renderMap()` 이후의 전장 overlay로 직접 연결한다.

- 현재 임시 점령
- 활성 전쟁의 국가 간 전선
- 참전 Field Formation 강조 링
- 최근 점령/해방 효과
- 최근 전투 흔적

따라서 줌 인/아웃, 지도 재렌더, 일반 시뮬레이션 tick에서도 같은 전쟁 표시가 유지된다.

## B.2 점령지 시각화 강화

점령은 영토 소유권 이전이 아니므로 원래 Nation 색을 유지한다. 그 위에 점령국 시각 요소를 겹친다.

- 점령국 색 대각선 hatch
- 어두운 외곽 backing + 점령국 색 굵은 테두리
- 타일 우상단 점령 코너 표식 / `⚑`
- `TILE_OCCUPIED33` 직후 20일간 점령 외곽 효과
- `TILE_LIBERATED33` 직후 20일간 해방 외곽 효과

이 방식은 `ownerId`와 `v33OccupierId`를 동시에 읽을 수 있게 한다.

## B.3 Battlefield Observer

`BATTLE33`가 발생할 때만 작은 observer cache를 갱신한다. 지도 렌더 시 전체 devlog를 재검색하지 않는다.

최근 전투 표시는 다음 TTL을 사용한다.

```text
0~15 calendar-day   강한 ⚔ + 충돌 링
16~30 day           중간 강도
31~45 day           흐린 전투 흔적
46 day+             자동 제거
```

같은 타일에서 여러 번 전투가 발생하면 지도에는 가장 최근 전투를 우선 표시한다.

cache 상한:

- 최근 전투 최대 24건
- 최근 점령/해방 효과 최대 24건

## B.4 타일 전투 상세

최근 45일 내 전투가 있었던 타일을 선택하면 Tile Inspector 하단에 다음을 표시한다.

- 교전국
- 양측 전투력
- 승전국
- 전사자 합계
- 부상자 합계
- 전투 지형

현재 점령 중인 타일이면 점령국과 원소유국도 함께 표시한다.

## B.5 전쟁 배너 강화

활성 전쟁 배너는 기존 교전국·경과일·전투 수에 더해 다음을 표시한다.

- 공격국 현재 점령 타일 수
- 방어국 현재 점령 타일 수
- 최근 45일 내 가장 최근 전투 승자
- 최근 전투가 몇 calendar-day 전인지

모바일에서는 메타 정보를 다음 줄로 내려 표시한다.

## B.6 저장 / 불러오기

V0.33B에서 생성된 최근 전투/점령 observer는 `v33b.observer`에 저장한다.

- `recentBattles[]`
- `recentTerritoryEvents[]`

V0.33B 세이브를 다시 불러오면 TTL 안의 전투 흔적이 그대로 유지된다. V0.33A 세이브도 호환되며 기존 전쟁/점령 상태는 유지된다. 다만 V0.33A에는 B 전용 최근 전투 cache가 존재하지 않으므로, 저장파일에 남아 있지 않은 과거의 짧은 전투 흔적을 새로 복원하지는 않는다. 이후 발생하는 전투부터 정상 기록한다.

## B.7 Telemetry / CSV

세계 snapshot에 다음 관측 필드를 추가한다.

- `recentBattleMarkers33B`
- `recentBattleSites33B`
- `recentTerritoryEffects33B`

CSV schema는 V0.33A 704열에서 **V0.33B 707열**로 확장된다.

## B.8 이번 버전에서 변경하지 않는 규칙

- 전투력 공식
- 실제 Person 전사/부상 확률
- 후퇴 규칙
- 침공 경로 규칙
- 점령지 생산 65% 규칙
- 점령 보급 페널티
- War Exhaustion
- AI 선전포고 조건
- 종전 조건
- 승전 보상 / 배상 / 영토 할양

즉 V0.33B는 **전쟁의 결과를 바꾸는 패치가 아니라 이미 발생하는 전쟁을 보이게 만드는 패치**다.

## B.9 회귀 검증

최종 배포본 기준:

```text
inline script syntax      74 / 74 PASS
Chromium startup/runtime  error 0
전쟁 배너                 점령 수 + 최근 승자 표시 PASS
점령 지도 overlay         hatch/border/flag PASS
BATTLE33 지도 marker      ⚔ + ring PASS
Tile Inspector            전투력/승자/사상자 PASS
B observer save/load      1 -> 1 유지 PASS
V0.33A save import         전쟁/점령 상태 유지 PASS
TTL cleanup               battle 46d / territory 21d 제거 PASS
natural smoke             3년 4분기까지 runtime error 0
CSV                        707 columns / mismatch 0
```


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


---

# 0.33C3F 추가 기술 메모

## 패퇴 중 점령/해방 불변조건

C3까지 `occupationSweep33()`는 전쟁 당사국 Field Formation이 적 영토에 존재하고 수비대가 없으면 Formation 상태와 무관하게 점령을 적용했다. 따라서 Deep Recovery 중 후방으로 이동하는 패전군도 지나간 적 영토를 점령할 수 있었다. C3F는 occupation sweep 전에 비점령 상태를 검사한다.

```text
RETREATING
REGROUPING
POST_BATTLE_RECOVERY
WITHDRAWING
POSTWAR_WITHDRAWAL
v33c3DeepRecovery = true
v33aWithdrawal active
```

위 상태에서는 점령과 해방을 모두 건너뛴다. 정상 공격 Formation의 `FORMATION_INVASION_MOVE33 -> occupy33()` 경로는 유지된다.

## 수도 Transit Avoidance

C3는 수도 자체를 공격할지 여부는 판단했지만, 수도 뒤편의 물류/군사 목표까지 가는 최단경로가 수도를 통과하면 의도하지 않은 수도전이 발생할 수 있었다. C3F는 수도 feasibility가 거부된 동안 Formation에 `v33c3AvoidCapitalTransitUntilCal`과 수도 타일을 저장한다.

비수도 목표의 `pathWar33()`는 이 기간에 적 수도를 passable node에서 제외한다. 수도 자체가 목표일 때는 이 제한을 적용하지 않는다. 현재 전력으로 수도 공격이 다시 허용되면 제한은 즉시 해제된다.

## 전략도로 Candidate Fallback

C3의 `roadProposal33C3()`는 전략 경로의 첫 missing-road 타일 하나만 반환했다. 그 타일이 공간·공사 조건 등으로 거부되면 다음 분기에도 같은 타일을 반복 시도할 수 있었다. C3F는 경로상의 건설 가능한 missing-road 후보 목록을 유지하고, preempt가 승인된 경우 최대 6개 후보를 순차 시도한다.

관측 이벤트:

- `ROAD_NETWORK_CANDIDATE_REJECTED33C3F`
- `ROAD_NETWORK_FALLBACK_STARTED33C3F`

Snapshot/CSV 추가 전역 필드:

- `roadCandidateRejects33C3F`
- `roadFallbackStarts33C3F`

## 저장 호환성

- V0.33C3F 저장 키: `village-observer-v0-33c3f`
- V0.33C3 → C3F 직접 로드 지원
- 기존 C3 Formation의 수도 실패/Deep Recovery 상태 유지
- C3F는 수도 transit avoidance 상태도 저장/복원

## 범위 밖

- 점령 진행시간/점령 인력 요구량
- 다국가 참전
- 한 국가의 복수 동시전쟁
- 복수 Field Formation 및 전선 배정
- 전쟁 목표/배상/영구 영토 할양

위 항목은 C3F 이후 별도 버전에서 다룬다.
