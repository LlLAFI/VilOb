# Village Observer V0.33G1

## Formation Ownership + AIProfile JSON v1

V0.33G1은 V0.33G를 기준으로 두 작업을 하나의 패치로 묶는다.

1. V0.33G PC 자연주행에서 확인된 **평시/Recovery Formation 이동 제어권 충돌**을 수정한다.
2. V0.33G에서 완료한 AIProfile 하드코딩 제거 위에 **외부 AIProfile JSON v1 import/export·국가 적용·save/load 보존 기반**을 추가한다.

이번 버전은 독립형 AI Editor 자체를 만들기 전의 본편 기반 패치다. AI Editor는 이 버전에서 고정한 `village-observer-ai` JSON을 생성·편집하는 별도 UI로 이어갈 수 있다.

---

# 1. V0.33G 자연주행에서 확인된 Formation 문제

PC 자연주행에서 티아는 키오에 대한 War Intent를 `PREPARING` 상태로 유지한 채 Recovery Mode에 들어갔다.

기존 구조에서는 다음 두 규칙이 동시에 작동할 수 있었다.

- D2 War Preparation: Formation을 전쟁 준비 staging tile로 반복 집결시킨다.
- Recovery/평시 Formation planner: Recovery 우선순위에 따라 기존 rally lock을 해제하고 평시·복구 목표를 다시 부여한다.

D2A/F3는 Recovery 진입 시 rally **lock**은 해제했지만 D2의 `rallyAssign2()` 자체는 계속 실행되었다. 그 결과 같은 Formation에 대해 staging 목표와 평시/Recovery 목표가 반복해서 덮어써지는 왕복이 발생할 수 있었다.

V0.33G1은 이 문제를 target writer의 원인 지점에서 수정한다.

---

# 2. Formation 단일 제어권

G1은 각 물리 Formation에 현재의 **effective movement owner**를 기록한다.

현재 구분은 다음과 같다.

| Control owner | 의미 |
| --- | --- |
| `WAR_OPERATION` | 실제 ACTIVE 전쟁의 작전 이동 |
| `POSTWAR_WITHDRAWAL` | 종전 후 본국 귀환/철군 |
| `RECOVERY_EMERGENCY` | 평시 국가 Recovery가 Formation 제어 |
| `WAR_PREPARATION` | D2 PREPARING/READY 집결 |
| `PEACETIME` | 일반 평시 배치 |

전쟁·철군 같은 lifecycle 상태는 기존 군사 규칙을 유지한다. G1이 직접 수정한 핵심 충돌은 **Recovery와 War Preparation 사이**다.

Formation에는 관측용으로 다음 값이 유지된다.

- `v33g1ControlOwner`
- `v33g1ControlOwnerSinceCal`
- `v33g1LastOwnerChange`
- `v33g1DesiredTargetTileId`
- `v33g1DesiredTargetReason`

이 값은 이동력을 추가하거나 병력을 생성하지 않는다. 누가 Formation의 목표를 소유하고 있는지 명시하고 회귀를 진단하기 위한 상태다.

---

# 3. Recovery 중 War Preparation rally suspend

D2의 `rallyAssign2()`는 이제 Recovery 상태를 직접 확인한다.

Recovery 중이고 실제 전쟁이 시작되지 않았다면:

- staging target을 **쓰지 않는다**.
- `rallySuspended33G1 = true`가 된다.
- 최초 suspend 시 `WAR_PREPARATION_RALLY_SUSPENDED33G1`을 기록한다.
- G1 Formation owner는 `RECOVERY_EMERGENCY`가 된다.
- 평시 물리 Formation은 home/core 방향의 `RECOVERY_EMERGENCY` 목표로 re-home된다.

따라서 예전처럼

`전쟁 준비 staging → 평시 BORDER → staging → BORDER`

가 반복되지 않는다.

Recovery가 종료되었을 때 War Intent가 여전히 `PREPARING` 또는 `READY`라면:

- 다음 D2 preparation 진행에서 rally suspension이 해제된다.
- `WAR_PREPARATION_RALLY_RESUMED33G1`이 기록된다.
- Formation owner가 다시 `WAR_PREPARATION`으로 전환된다.
- 기존 D2 준비 목표와 실제 Person-backed Formation을 그대로 사용해 집결을 재개한다.

즉 Recovery는 전략적 Intent 자체를 무조건 삭제하지 않는다. **이동 제어만 일시적으로 Recovery에 넘긴다.**

---

# 4. Formation control conflict 진단

향후 같은 종류의 충돌을 장기 자연주행에서 뒤늦게 발견하지 않도록 별도 telemetry를 추가했다.

다음과 같은 상충 writer가 관측되면 `FORMATION_CONTROL_CONFLICT33G1`이 기록된다.

- effective owner가 `RECOVERY_EMERGENCY`인데 `WAR_PREPARATION` writer가 target을 쓰는 경우
- effective owner가 `WAR_PREPARATION`인데 `PEACETIME` writer가 target을 쓰는 경우

주요 누적 필드:

- `formationControlOwnerChanges33G1`
- `formationControlConflicts33G1`
- `recoveryRallySuspensions33G1`
- `recoveryRallyResumes33G1`
- `recoveryFormationRehomes33G1`

국가별 Snapshot/CSV:

- `formationControlOwners33G1`
- `formationControlConflictsNation33G1`
- `recoveryFormationRehomesNation33G1`

정상 자연주행에서 `formationControlConflicts33G1`은 원칙적으로 **0**이어야 한다.

---

# 5. F5P2 War Intent Profile telemetry 수정

V0.33G는 실제 AI 행동을 profile/capability 기반으로 전환했지만 과거 F5P2 관측 코드 일부는 여전히 `scoreComponents.brain`을 읽고 있었다.

G 이후 raw assessment에는 `profileId`가 저장되므로 해당 관측값이 없을 때 `balanced`로 잘못 표시되는 사례가 있었다.

G1은 `assessmentBrain33F5P2`가 우선 `profileId`를 읽도록 수정한다.

이 변경은 War Intent 점수나 선전포고 확률을 바꾸지 않는다. **개발자 로그의 AI 정체성 표시만 실제 계산 경로와 일치시킨다.**

---

# 6. AIProfile JSON v1

G1은 본편에서 사용할 외부 Custom AI 데이터 포맷을 처음 고정한다.

기본 envelope:

```json
{
  "format": "village-observer-ai",
  "version": 1,
  "profile": {
    "id": "my_technologist",
    "label": "산업연구형",
    "nationName": "커스텀국",
    "basePreset": "technologist",
    "traits": {
      "technology": 1.8
    }
  }
}
```

이 예시는 `technology`만 덮어쓴다. 나머지 값은 `technologist` 기본 preset에서 상속된다.

따라서 결과적으로 카이렌 preset의 예를 들면:

- `production = 1.55`
- `expansion = 0.66`
- 기존 research 가중치
- 기존 construction 가중치
- 기존 행동 mods

를 유지하면서 `technology`만 1.8로 바뀐다.

AI Editor가 모든 내부 값을 매번 완전한 JSON으로 출력할 필요가 없고, **기본 preset + 필요한 override** 구조를 사용할 수 있도록 한 것이다.

---

# 7. basePreset 규칙

`basePreset`은 다음 기본 7개만 허용한다.

- `survival`
- `diplomatic`
- `expansionist`
- `balanced`
- `urbanist`
- `resource_seeker`
- `technologist`

Custom Profile을 다른 Custom Profile의 basePreset으로 사용하는 것은 v1에서 허용하지 않는다.

이유는 다음과 같다.

- custom→custom 순환 상속 방지
- 파일 하나만으로 의미가 결정되도록 유지
- save/load 및 버전 마이그레이션 단순화
- 향후 AI Editor가 항상 예측 가능한 7개 기준점에서 시작하도록 유지

---

# 8. JSON 필드와 범위

## 8.1 traits

다음 10개를 지원한다.

- `survival`
- `expansion`
- `trade`
- `urbanization`
- `resourceAcquisition`
- `technology`
- `production`
- `military`
- `risk`
- `fiscalConservatism`

허용 범위: **0.25 ~ 2.50**

생략한 값은 `basePreset`에서 상속된다.

## 8.2 semantic capabilities

- `survivalPriority`
- `tradeDiplomacy`
- `territorialExpansion`
- `urbanConcentration`
- `resourceSeeking`

허용 범위: **0 ~ 1**

`capabilities` 자체를 생략하거나 일부 key만 쓰면, 나머지는 최종 traits에서 자동 파생된다. 따라서 일반적인 Custom AI는 capabilities를 직접 건드리지 않아도 된다.

이 필드는 과거 archetype의 특수 행동을 세밀하게 조정하려는 **고급 설정**에 해당한다.

## 8.3 research

- `food`
- `production`
- `industry`
- `commerce`
- `administration`
- `military`
- `knowledge`

허용 범위: **0.25 ~ 2.50**

생략값은 basePreset에서 상속된다.

## 8.4 construction

- `farm`
- `sawmill`
- `quarry`
- `iron`
- `roads`
- `commerce`
- `military`
- `housing`

허용 범위: **0.25 ~ 2.50**

생략값은 basePreset에서 상속된다.

## 8.5 mods

- `MAINTAIN`
- `FOOD`
- `HOUSING`
- `TRADE`
- `SECURITY`
- `EXPAND`

허용 범위: **-50 ~ +50**

생략값은 basePreset에서 상속된다.

---

# 9. ID 및 안전 규칙

Custom `profile.id`는:

- 최대 48자
- 영문/숫자/`_`/`-`만 사용
- 첫 글자는 영문 또는 숫자

기본 7개 ID는 import로 덮어쓸 수 없다.

예를 들어 Custom JSON이 `id: "balanced"`를 사용하면 가져오기가 거부된다.

AIProfile JSON은 실행 가능한 JavaScript나 callback을 포함하지 않는 **순수 데이터 포맷**이다. G의 목표였던 “ID 문자열에 행동코드를 결합하지 않는다”는 원칙을 그대로 유지한다.

---

# 10. 본편 Import / Export / 국가 적용 UI

World 탭의 기존 Save 영역 아래에 **AI Profile JSON v1** 패널이 추가된다.

지원 기능:

1. 등록된 Profile 선택
2. Profile JSON 내보내기
3. Custom Profile JSON 가져오기
4. 현재 선택 국가에 Profile 적용

가져오기와 국가 적용은 분리되어 있다.

즉 Custom JSON을 import했다고 즉시 어느 국가의 AI가 바뀌지는 않는다. 사용자가 Profile을 등록한 뒤 원하는 국가를 선택하고 **선택 국가에 적용**을 눌러야 한다.

독립형 AI Editor는 아직 포함하지 않는다.

---

# 11. Export 규칙

내보내기는 현재 registry에서 사용 중인 **정규화된 전체 Profile**을 저장한다.

따라서 부분 override로 가져온 Profile도 다시 export하면 traits/research/construction/capabilities/mods가 모두 포함된 완전한 v1 JSON이 된다.

파일명 예:

`village-observer-ai-my_technologist.json`

---

# 12. Custom AI save/load 보존

Custom Profile은 단순히 현재 브라우저 registry에만 존재하면 안 된다. 저장게임을 다시 열 때 Profile 정의가 사라지면 해당 국가가 `balanced`로 fallback될 수 있기 때문이다.

G1은 World save의 `v33g1.customProfiles[]`에 Custom 정의를 같이 저장한다.

로드 순서는 다음과 같다.

1. Save의 Custom Profile 정의를 읽는다.
2. AIProfile registry에 Custom Profile을 먼저 복구한다.
3. 그 뒤 기존 Village/Brain을 deserialize한다.
4. 국가의 `aiProfileId`를 해당 Custom Profile에 다시 연결한다.

이 순서 때문에 임의의 ID를 사용한 Custom AI도 저장 후 다시 로드했을 때 balanced로 떨어지지 않는다.

G1 save key:

`village-observer-v0-33g1`

이전 G 및 F5A8 save는 fallback load 대상이다.

---

# 13. G의 hardcode 제거 유지

G1은 V0.33G의 구조적 원칙을 그대로 유지한다.

정적 감사 기준 행동 결정용 다음 패턴은 **0건**이다.

- `brain.type === '...'`
- `brain.type==='...'`
- `brain?.type === '...'`
- `this.type === '...'`

`brain.type`/`aiProfileId` 자체는 identity와 과거 save migration을 위해 존재할 수 있지만, Custom AI의 행동을 특정 ID 문자열 비교로 결정하지 않는다.

---

# 14. 검증

## 14.1 정적 검증

- inline script: **116개**
- JavaScript syntax failure: **0**
- 행동용 profile-id 직접 비교: **0건 유지**

## 14.2 브라우저 부팅

- Chromium 실제 실행 정상
- 제목: `Village Observer V0.33G1`
- 새 자연 세계: **7개국 정상 생성**
- runtime exception: **0**
- console error: **0**

## 14.3 Formation 강제 회귀

실제 Person-backed 티아 Formation에 대해 다음 상태를 강제로 재현했다.

`PREPARING → Recovery → Recovery 종료`

Recovery 진입 후:

- owner = `RECOVERY_EMERGENCY`
- Formation target = home/core
- D2 preparation progress를 실행해도 staging target 재기록 없음
- `rallySuspended33G1 = true`

Recovery 종료 후:

- rally 자동 resume
- owner = `WAR_PREPARATION`
- 기존 preparation 집결 재개

테스트 결과:

- rally suspension: **1회**
- rally resume: **1회**
- Recovery re-home: **1회**
- control conflict: **0회**

장기 자연주행에서 티아의 과거 1,300회 이상 왕복이 제거되는지는 다음 PC 자연주행 devlog로 최종 회귀 확인한다.

## 14.4 Custom Profile JSON 상속

테스트 Profile:

- basePreset = `technologist`
- override = `technology: 1.8`

결과:

- technology = **1.8**
- production = **1.55** 상속
- expansion = **0.66** 상속
- research.industry = **1.52** 상속
- construction.sawmill = **1.42** 상속
- 생략 capability는 최종 traits에서 자동 파생

## 14.5 JSON validation

정상 거부 확인:

- 기본 preset ID 덮어쓰기
- Custom Profile을 basePreset으로 사용
- 허용 범위를 벗어난 수치
- 잘못된 format/version/id

## 14.6 Custom save/load round trip

Custom Profile을 카이렌 슬롯에 적용한 뒤:

1. World serialize
2. 런타임 registry에서 Custom ID 제거
3. serialize 데이터로 다시 load

결과:

- Custom ID 복원
- custom Profile 정의 복원
- nation assignment 복원
- override trait 값 복원

## 14.7 자연 smoke 및 CSV

추가 schema 보정 후 120일 smoke run:

- 7개국 정상
- runtime error 0
- Formation control conflict 0
- Snapshot CSV **1320 columns**
- schema validation PASS
- bad row 0

이전 구현 단계에서는 360일 smoke와 G→G1 save migration도 별도로 통과했다.

---

# 15. 이번 버전에서 변경하지 않은 것

G1은 다음 수치를 재조정하지 않는다.

- Monetary Price Anchor / freeze 조건
- Gold 집중 및 재분배
- 전쟁 선포 score 자체
- 전투력·사상자 공식
- 점령·평화협정
- Frontier 비용/개척 밸런스
- 생산시설 생산효율
- Recovery 진입/종료 임계값
- 기술 비용

Formation 수정은 **이동 명령의 소유권 충돌 제거**, AIProfile 작업은 **데이터 외부화 기반**에 한정한다.

---

# 16. 다음 단계

G1 자연주행에서 우선 확인할 항목:

1. `formationControlConflicts33G1`이 0으로 유지되는가.
2. Recovery 중 PREPARING Formation이 staging↔BORDER 왕복을 하지 않는가.
3. Recovery 종료 후 유효한 War Intent가 정상적으로 rally를 재개하는가.
4. Custom AI를 적용한 국가가 장기주행·save/load 후에도 동일 Profile을 유지하는가.
5. 기존 7개 기본 AI의 G 행동 회귀가 없는가.

위 조건이 통과하면 다음 패치는 **독립형 AI Editor v1**로 진행할 수 있다.

AI Editor는 이번에 확정한 JSON v1을 읽고 쓰는 도구로 만들며, 본편의 AI 판단 코드를 별도로 복제하지 않는다.
