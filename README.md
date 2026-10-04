# Village Observer V0.33F5A8

## Recovery Essential Investment

V0.33F5A8은 V0.33F5A7 자연주행에서 확인된 **Recovery 자기잠금(deadlock)** 을 수정하는 안정화 패치다.

A7에서는 AIProfile 수치가 실제 개척량·생산투자·연구인프라·재정·도시이주·전쟁성에 연결되는 데 성공했다. 하지만 카이렌 장기주행에서 다음 순환이 확인됐다.

1. 목재/식량 여건 악화로 Recovery 진입
2. Production Proposal은 제재소 또는 고대 농장을 최우선 후보로 평가
3. A5 생산 gate가 `recoveryState.active`를 조기 Survival과 같은 `SURVIVAL` blocker로 처리
4. 회복에 필요한 시설도 착공 불가
5. Recovery가 장기간 유지되고 생산성 회복이 늦어짐

A8의 목표는 **Recovery의 우선권이나 비용을 없애는 것이 아니라, Recovery가 자기 회복수단을 금지하는 모순만 제거하는 것**이다.

---

## 1. Recovery와 진짜 Survival 분리

A5까지 생산시설 gate는 다음 세 상태를 모두 사실상 같은 `SURVIVAL` blocker로 취급했다.

- V0.30B2 조기 생존위기
- V0.30B4 계열 생존위기
- 장기 `recoveryState.active`

A8에서는 이를 분리한다.

### 진짜 Survival

다음 중 하나가 활성화되어 있으면 기존과 동일하게 **절대 우선**이다.

- `v30b2.survival.active`
- `v30b4.survival.active`

이 상태에서는 A8 Recovery Essential Investment가 작동하지 않는다.

### Recovery only

`recoveryState.active === true` 이면서 위 두 Survival이 모두 비활성일 때만 복구 필수시설을 별도로 검토한다.

---

## 2. Recovery Essential Investment 대상

A8에서 Recovery 예외를 받을 수 있는 시설은 두 종류뿐이다.

### 고대 제재소

다음과 같은 경우 복구 필수시설 후보가 된다.

- `FORESTRY` 보유
- Recovery 활성
- 진짜 Survival 비활성
- 전쟁 중이 아님
- 현재/예정 제재소가 없음 또는 목재가 회복 목표보다 낮음
- A5 Production Proposal에서 실제 후보 타일을 찾을 수 있음

Recovery 종료식의 목재 기준과 국가 목표 목재량을 함께 참고해 필요성을 계산한다.

### 고대 농장

다음과 같은 경우 복구 필수 개축 후보가 된다.

- `IRRIGATION` 보유
- Recovery 활성
- 진짜 Survival 비활성
- 전쟁 중이 아님
- 식량 비축이 42일 미만이거나 평균 Hunger가 높음
- 실제 고대 경작지가 개축 후보로 존재

---

## 3. 우선순위와 범위 제한

A8은 국가별 계절 tick 시작 시 Recovery Essential Investment를 **최대 1회** 먼저 검토한다.

복구 필수시설은 일반 Production Proposal보다 먼저 슬롯을 요청할 수 있지만 다음 원칙을 유지한다.

- 한 분기에 국가별 최대 한 개
- 실제 프로젝트 슬롯 필요
- 실제 건축공간 필요
- 실제 목재/석재/Gold 필요
- 실제 건설/개축 노동 필요
- 실제 `startConstruction()` / `startFarmUpgrade()` 사용
- 자원 또는 Gold 생성 없음
- 전쟁 중에는 예외 사용 안 함
- 고대 채석장, 학당, 도로, 상업시설, 군사시설은 Recovery 예외 대상 아님
- Frontier Expansion도 Recovery 예외 대상 아님

---

## 4. 전략 reserve 완화

자연주행 원인을 추적하면서 추가 교착이 확인됐다.

Recovery 필수시설을 Production Proposal gate에서 허용해도 기존 `startConstruction()` 내부의 다음 정책적 reserve가 다시 시설을 막을 수 있었다.

- `aiPlan.reserves` 기반 일반 건설 reserve
- V0.30B2 Treasury reserve
- V0.31H 철산업용 마지막 슬롯 예약
- V0.32C1 군사시설용 마지막 슬롯 예약

이 reserve들은 **자원 자체가 아니라 AI 정책상 남겨두는 여유분**이므로, Recovery를 직접 해결하는 시설까지 막으면 같은 자기잠금이 반복될 수 있다.

A8은 복구 필수 착공을 실제로 시도하는 짧은 구간에서만 이 정책 reserve를 완화한다.

중요:

- 실제 목재/석재/Gold 비용은 전부 차감된다.
- 실제 Project Cap은 우회하지 않는다.
- 실제 Space gate는 우회하지 않는다.
- 실제 노동일은 우회하지 않는다.
- 실제 건물 조건/기술 조건은 우회하지 않는다.
- 호출이 끝나면 기존 reserve/산업/군사 상태를 즉시 복원한다.

즉 이것은 무료 건설이나 치트가 아니라 **Recovery 목적의 긴급 예산 우선권**이다.

---

## 5. Recovery 종료 조건

A8은 Recovery 종료 조건 자체를 바꾸지 않는다.

기존 Recovery 안정 판정은 그대로 유지된다.

- 비활성 건물 비율 낮음
- 식량 비축 > 42일
- 목재 > `max(16, 인구 × 0.4)`
- 주거/수용 능력 안정
- 안정 분기 누적 후 종료

A8은 이 조건을 쉽게 만들기 위해 시설 성능을 직접 버프하지 않는다. 필요한 시설을 실제 투자로 지을 수 있게 할 뿐이다.

---

## 6. AIProfile과의 관계

A7에서 다음 연결은 유지된다.

- `expansion` → 개척 확률/병렬 수/밀도/점수 gate
- `technology` → 실제 학당 투자
- `production` → 농장/제재소/채석장 우선 투자
- `fiscalConservatism` → 전략 reserve
- `urbanization` → 내부이주 관성
- `military/risk/...` → War Intent
- Profile delta → Strategic Program

A8 Recovery Essential Investment는 **모든 AI에 공통인 안전장치**다.

생산형 AI에게 특별 보너스를 주는 것이 아니라, 어떤 Custom AI라도 Recovery에 들어간 뒤 "필요한 시설을 선호하지만 Recovery라서 영원히 못 짓는" 상태에 빠지지 않도록 한다.

시설 후보의 우선도 계산에서는 기존 `production` trait을 약하게 참고하지만, 물리 비용과 Survival 우선권은 동일하다.

---

## 7. 신규 관측 필드

### 세계 단위

- `recoveryEssentialReviews33F5A8`
- `recoveryEssentialStarts33F5A8`
- `recoveryEssentialSawmillStarts33F5A8`
- `recoveryEssentialFarmStarts33F5A8`
- `recoveryEssentialRejected33F5A8`
- `recoveryEssentialProjectCapBlocks33F5A8`
- `recoveryEssentialTrueSurvivalBlocks33F5A8`
- `recoveryEssentialWarBlocks33F5A8`
- `recoveryEssentialNoNeed33F5A8`
- `recoveryEssentialReserveOverrides33F5A8`

### 국가 단위

- `recoveryEssentialActive33F5A8`
- `recoveryEssentialLastType33F5A8`
- `recoveryEssentialLastBlocker33F5A8`
- `recoveryEssentialStartsNation33F5A8`
- `recoveryEssentialSawmillStartsNation33F5A8`
- `recoveryEssentialFarmStartsNation33F5A8`

### Devlog 이벤트

- `RECOVERY_ESSENTIAL_REVIEW33F5A8`
- `RECOVERY_ESSENTIAL_STARTED33F5A8`

Review 이벤트는 상태가 바뀔 때만 기록해 로그 폭증을 피한다.

---

## 8. 호환성

- A7 세이브를 A8에서 로드 가능
- 기존 7개 AIProfile 유지
- 기존 6국 세이브도 기존 국가 수 유지
- MapData A~G 구조 유지
- A7 Frontier/Profile/군사/경제 규칙 유지
- Snapshot CSV는 기존 전체 telemetry 뒤에 A8 필드를 추가
- Devlog Compression 정책 유지

---

## 9. 구현 검증

개발 검증에서 다음을 확인했다.

### Recovery + 목재 부족

- `FORESTRY` 보유
- Recovery 활성
- 진짜 Survival 비활성
- 실제 자원 충분

결과:

- `A8_RECOVERY_ESSENTIAL_SAWMILL` 사유로 실제 고대 제재소 건설 프로젝트 시작
- 목재/석재/Gold 실제 차감

### Recovery + 식량 부족

- `IRRIGATION` 보유
- Recovery 활성
- 진짜 Survival 비활성
- 고대 경작지 존재

결과:

- `A8_RECOVERY_ESSENTIAL_FARM` 사유로 실제 고대 농장 개축 프로젝트 시작
- 목재/석재/Gold 실제 차감

### 진짜 Survival

Recovery가 함께 켜져 있어도 `v30b2.survival.active === true`이면:

- 복구 필수 착공 0
- blocker `TRUE_SURVIVAL`

### 장기 Smoke / schema

- 360 simulation-day smoke run 정상
- Runtime / Console error 0
- A7 → A8 save migration 정상
- Snapshot CSV schema validation 통과
- CSV 1297 columns / bad rows 0

---

## 10. 다음 단계

A7에서 AIProfile의 행동 연결이 자연주행으로 확인됐고, A8에서 Recovery가 Profile 행동을 영구 무력화할 수 있는 교착을 제거했다.

따라서 다음 AI 개발 단계는 원래 계획대로:

1. **AIProfile JSON 규격 확정**
2. **Profile export/import**
3. 기본 7개 preset과 Custom Profile의 동일 로더 사용
4. 국가 슬롯에 Custom AI 지정
5. 이후 별도 **AI Editor HTML** 제작

순서로 진행한다.

F5 Monetary Anchor는 이번 버전에서 변경하지 않는다.
