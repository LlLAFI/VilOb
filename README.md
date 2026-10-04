# Village Observer V0.33F5A7

## AIProfile Migration 2

V0.33F5A7은 V0.33F5A6에서 도입한 `AIProfile v1`을 실제 시뮬레이션 의사결정에 한 단계 더 연결하는 기반 패치다. 이번 버전의 목적은 카이렌만 별도 특수코드로 강화하는 것이 아니라, 향후 AI Editor에서 조절할 수치가 실제 행동 차이로 이어지도록 기존 하드코딩을 점진적으로 Profile 계층으로 이동하는 것이다.

기존 6개 기본 AI는 각자의 역사적 동작을 `legacyBase`로 사용한다. 따라서 이번 패치에서 Profile이 연결된 경로는 기존 상수를 먼저 재현한 뒤 `profile - legacyBase` 차이만 적용한다. 카이렌과 향후 Custom AI처럼 baseline과 다른 Profile 수치를 가진 AI에서만 추가 차이가 발생한다.

## 1. 카이렌 / 기술개발형

기본 7번째 국가는 계속 `카이렌`이며 Profile ID는 `technologist`다.

주요 trait:

- 생존 0.92
- 개척 0.66
- 교역 1.06
- 도시화 1.18
- 자원 확보 1.02
- 기술 1.58
- 생산 1.55
- 군사 0.82
- 위험 감수 0.88
- 재정 보수성 1.04

이번 버전에서도 이 수치가 직접 생산량, 연구속도, 전투력 같은 국가 보너스를 만들지는 않는다. Profile은 **무엇에 실제 자원·노동·건설 슬롯을 투자할지**를 바꾸는 AI 행동 계층이다.

## 2. Frontier Profile Migration

A6에서는 `expansion` trait가 주로 후보 타일 점수에 영향을 주었다. A7부터 다음 실제 개척 단계에도 반영된다.

- 자율 Frontier 시도 확률
- 동시에 유지할 수 있는 Frontier 프로젝트 수
- 자율 개척에 필요한 인구밀도
- 개척 시작 후보의 최소 점수
- 정착지별 Pioneer 잔류 성인 및 식량 reserve 기준

기존 AI는 과거 성향별 수치를 baseline으로 사용한다. 예를 들어 영토확장형의 높은 자율 개척 확률이나 도시집약형의 낮은 개척 성향은 기존 값을 유지한다. Profile에서 `expansion`을 추가로 낮춘 Custom AI는 같은 환경에서도 더 높은 밀도와 후보 품질을 요구하고, 병렬 개척 수도 줄어들 수 있다.

카이렌의 현재 V24 기준 유효 자율개척 확률은 균형형 0.38보다 낮은 약 0.287이며, 인구밀도 gate는 균형형보다 약 12% 높다. 이는 A6 자연주행에서 expansion 0.66임에도 카이렌이 57타일까지 확장한 결과를 교정하기 위한 구조적 연결이다.

## 3. 실제 연구 인프라 투자

`technology`가 높다고 Knowledge를 직접 보너스로 생성하지 않는다.

A7에서는 baseline 대비 technology가 충분히 높은 AI가 다음 조건에서 실제 `학당(schoolhouse)` 건설을 선행 검토한다.

- `ACADEMY` 기술 보유
- Survival / Recovery 비활성
- 전쟁 중이 아님
- 식량 reserve가 안정적
- 최소 2개의 건설 프로젝트 슬롯이 비어 있음
- 현재 학당 수가 인구와 technology delta로 계산된 목표보다 적음

건설은 기존 `startConstruction()`을 그대로 사용한다. 따라서 실제 목재·석재·Gold, 건축공간, 노동일과 유지보수 규칙을 모두 따른다. A7은 Knowledge 자체를 생성하지 않는다.

## 4. 실제 생산 투자 우선권

A5/A6 자연주행에서는 Production Proposal이 `PROJECT_CAP`에 자주 막혀 기술개발형의 production 1.55가 실제 시설 수로 잘 이어지지 않았다.

A7에서는 production delta가 충분히 큰 AI가 **기존 계절 건설 체인이 새 슬롯을 차지하기 전에** 생산 Proposal을 먼저 검토한다.

대상:

- 고대 경작지 → 고대 농장
- 고대 제재소
- 고대 채석장

조건:

- Survival / Recovery 비활성
- 전쟁 중이 아님
- 식량 reserve 30일 이상
- 최소 2개의 프로젝트 슬롯이 비어 있음

실행 가능한 철산업 다음 단계가 이미 존재하면 철광산·제련소·대장간의 전략 슬롯을 우선 보호한다. 생산시설 역시 기존 실제 건설/개축 함수를 사용하므로 자원이나 Gold를 생성하지 않는다.

첫 제재소는 Profile 우선도 평가에서 추가적인 도입 가중치를 받아, A4~A6에서 세계 전체 제재소가 0개로 남는 현상을 별도로 검증할 수 있게 했다.

## 5. 재정 보수성

`fiscalConservatism`, `survival`, `risk`는 이제 실제 `aiPlan.reserves`에 영향을 준다.

- 재정 보수성이 높을수록 Gold reserve 증가
- 생존 성향이 높을수록 Gold/목재/석재 reserve 소폭 증가
- 위험 감수가 높을수록 Gold reserve 감소

기존 preset은 legacy baseline과 값이 같기 때문에 A7 추가 delta는 0이다. Custom Profile이나 카이렌처럼 baseline과 다른 값만 실제 reserve를 조정한다.

## 6. 도시화와 내부이주

기존 V29 내부이주는 도시집약형만 별도 정착지 관성 기간을 사용했다.

A7에서는 그 값을 `urbanization`과 `risk` delta로 조정한다.

- 높은 도시화: 일반 내부이주 재평가가 조금 더 자주 가능
- 높은 위험 감수: 이동 관성 소폭 감소
- 낮은 도시화/위험 감수: 정착지 체류 관성이 증가 가능

기존 도시집약형 720일, 기타 기본형 900일 baseline은 그대로 유지한다. 카이렌의 현재 유효값은 약 860일이다.

## 7. 전쟁 성향

F5P2 War Intent의 기존 disposition bonus는 유지하되 Profile delta를 추가한다.

기존 baseline:

- 영토확장형 +5
- 자원개척형 +3
- 균형/도시집약형 0
- 교역외교형 -3
- 생존안정형 -5

A7 추가 조정에는 `military`, `risk`, `resourceAcquisition`, `fiscalConservatism`, `survival`이 사용된다. 기존 6개는 delta 0으로 기존값을 그대로 유지한다.

카이렌은 균형형 baseline에서 군사·위험 감수가 낮으므로 현재 유효 War Intent disposition이 약 -2.2다.

## 8. 장기 전략 프로그램

V0.33C2의 장기 Strategic Program도 Profile delta를 읽는다.

- technology → RESEARCH
- production / resourceAcquisition → IRON
- urbanization / production → URBAN
- expansion → EXPAND
- trade → TRADE
- military / risk → MILITARY
- fiscalConservatism / risk → TREASURY
- survival → FOOD

따라서 “기술개발형”이 단순히 연구 기술을 고르는 것뿐 아니라 철산업·연구·도시 투자 프로그램을 장기적으로 선택할 가능성이 높아진다.

## 9. 관측 필드

Snapshot CSV에 다음 A7 필드가 추가된다.

세계 단위:

- `aiProfileMigrationVersion33F5A7`
- `profileProductionPriorityStarts33F5A7`
- `profileResearchInfraStarts33F5A7`
- `profileResearchInfraBlocks33F5A7`
- `profileReserveAdjustments33F5A7`
- `profileFrontierStarts33F5A7`
- `profileWarAssessments33F5A7`
- `profileStrategicProgramApplications33F5A7`

국가 단위:

- `aiEffectiveFrontierChance33F5A7`
- `aiEffectiveFrontierDensityFactor33F5A7`
- `aiEffectiveWarDisposition33F5A7`
- `aiFiscalReserveMultiplier33F5A7`
- `aiMigrationGuardDays33F5A7`

A7 관측값은 AI 성향이 실제 의사결정에 어떻게 번역됐는지 확인하기 위한 값이다.

## 10. 호환성

- A6 세이브를 A7에서 로드할 수 있다.
- 기존 6국 세이브는 그대로 6국을 유지한다.
- A6 7국 세이브는 카이렌 Profile을 그대로 유지한다.
- 새 자연 세계는 7국이다.
- MapData의 Spawn A~G를 지원한다.
- A~F만 있는 기존 MapData는 기존 6개 Spawn을 변경하지 않고 카이렌 시작점만 자동 보완한다.

## 11. 이번 버전에서 하지 않는 것

- AI Profile JSON import/export
- AI Editor HTML
- Custom AI를 본편 국가 슬롯에 지정하는 UI
- 기술/생산 trait에 따른 직접적인 생산량·Knowledge 보너스
- 카이렌 전용 치트 또는 국가 능력치 보너스
- F5 Monetary Anchor 조정

AI Editor는 A7 자연주행에서 **Profile 수치 변화가 실제 결과 차이로 관측되는지** 검증한 다음 단계에서 진행한다.

## 12. 자연주행 검증 포인트

A7 데이터에서는 특히 다음을 비교한다.

1. 카이렌이 A6의 57타일처럼 낮은 expansion trait에 비해 과도하게 팽창하는지
2. 카이렌의 학당 수와 32기술 완료 시점이 기존 기술 선두국과 어떻게 달라지는지
3. 고대 제재소가 실제 자연주행에서 등장하는지
4. 농장·제재소·채석장 A7 우선착공 횟수
5. 카이렌의 철광산→제련소→대장간 완성 여부
6. 기존 6개 AI의 영토·도시·교역·전쟁 패턴이 A6 대비 급변하지 않는지
7. A7 Profile lookup이 성능에 유의미한 추가 비용을 만들지 않는지
