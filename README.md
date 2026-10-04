# Village Observer V0.33F5A3

## Mobilization Scale + Devlog Compression V1

- 기준 버전: **V0.33F5A2**
- 릴리스 날짜: **2026-10-04**
- 성격: **실제 Person 전시 동원 규모 확대 + 방어 비상동원/보충 + 종전 단계적 전역 + Devlog export 압축**

V0.33F5A3는 F5A2 PC 자연주행에서 드러난 두 문제를 다룹니다.

1. 전쟁 시스템과 Formation 수명주기는 정상화되었지만, 50~100명대 국가의 실제 전쟁이 1 vs 2, 2 vs 3 수준에 머무르는 경우가 많았습니다.
2. 62년 자연주행 Devlog가 약 58MB, 6분할까지 커졌습니다. 실제 사건 로그보다 Full Snapshot과 연간 통계의 JSON 중복이 더 큰 비중을 차지했습니다.

이번 버전은 synthetic soldier를 추가하지 않습니다. 군인은 계속 **실제 Person**이며, 현역이 늘어나는 만큼 실제 민간 노동력이 빠집니다. 동시에 runtime telemetry와 Full Snapshot CSV는 그대로 보존하고, **Devlog JSON export만 Compact 구조로 변환**합니다.

---

## 1. 평시 상비군 목표 조정

V0.32B의 평시 현역 목표는 동원 가능 Person의 약 5~9%를 기본으로 사용했습니다. A3에서는 다음과 같이 소폭 상향합니다.

| AI 성향 | 기존 기본 현역률 | A3 기본 현역률 |
|---|---:|---:|
| 교역·외교형 `diplomatic` | 5% | **7%** |
| 생존안정형 `survival` | 5.5% | **7%** |
| 도시집약형 `urbanist` | 6% | **8%** |
| 균형형 `balanced` | 7% | **9%** |
| 자원개척형 `resource_seeker` | 7.5% | **9.5%** |
| 영토확장형 `expansionist` | 9% | **11%** |

기존 전략 경계/Threat 보정은 유지하며, 평시 현역 상한은 동원 가능 인구의 **18% → 20%**로 소폭 상향합니다.

### 유지되는 제한

- `WATCHTOWERS`가 없는 국가는 기존과 같이 정상적인 평시 상비군을 운용하지 않습니다.
- Survival Mode 또는 식량 상태가 나쁘면 평시 현역 목표는 기존처럼 강하게 제한됩니다.
- 동원 가능 조건은 실제 Person 기준을 유지합니다.
  - 생존
  - 18~50세
  - 건강 45 이상
  - 부상/포로 상태가 아님
  - 실제 개척 임무로 예약된 Person이 아님

---

## 2. Wartime Manpower Target

전쟁이 선언되면 국가별·전쟁별 **전시 현역 목표**를 생성합니다.

### 공격국

AI War Preparation을 거친 공격국은 V0.33D2가 준비 단계에서 계산했던:

- `activeGoal`
- `fieldGoal`

을 가능한 경우 그대로 전쟁 목표에 승계합니다.

즉 전쟁 준비에서 9~10명의 현역을 실제로 모았다면, 선전포고 뒤 평시 목표 2~3명으로 되돌아가지 않습니다.

### 방어국

공격받은 국가는 별도의 준비 기간이 없으므로 선전포고 순간 **Emergency Mobilization 목표**를 새로 계산합니다.

고려 요소:

- 자국 동원 가능 Person 수
- 현재/목표 공격군 현역
- 현재 공격군 Formation 병력
- 현재 활성 전쟁 수
- 자국 평시 상비군 목표

전시 동원 cap은 기존 D2 전쟁준비 구조와 비슷하게 기본적으로 동원 가능 인구의 약 30% 범위를 사용하며, 다중전쟁 상황에서는 소폭 상승할 수 있습니다.

새 이벤트:

- `WARTIME_MANPOWER_TARGET33F5A3`
- `EMERGENCY_MOBILIZATION_PLANNED33F5A3`
- `WARTIME_MANPOWER_TARGET_RAISED33F5A3`

---

## 3. 전쟁 중 30일 보충동원

A2는 전쟁 중 평시 planner가 기존 현역을 전역시키는 버그를 막았지만, 전투 사망·부상으로 병력이 줄어든 뒤 새 Person을 보충하는 기능은 없었습니다.

A3에서는 활성 전쟁 중 **30 calendar-day 간격**으로 전시 목표를 확인합니다.

현재 현역이 전시 목표보다 적으면 한 번의 pulse에서 **최대 2명의 실제 Person**을 추가 동원합니다.

예시:

- 전시 목표 10
- 현재 현역 7
- 첫 pulse: 최대 2명 → 9
- 다음 30일 pulse: 최대 1명 → 10

따라서 한 번의 전투에서 Person 1명이 부상했다고 Formation 전체가 장기간 1명 규모에 머무르는 현상을 줄입니다.

### 보충 차단 조건

다음 상황에서는 기존 병력은 보호하지만 새 동원은 하지 않습니다.

- Survival Mode
- Recovery Mode
- 국가 식량 비축 30일 미만
- 추가 동원 가능한 Person 없음

새 이벤트:

- `WARTIME_MOBILIZATION_PULSE33F5A3`
- `WARTIME_REPLACEMENT_BLOCKED33F5A3`

---

## 4. Formation 규모는 기존 D 규칙 유지

Formation 분배 비율 자체는 이번 패치에서 바꾸지 않습니다.

- 평시: 현역의 약 **45%**를 야전군
- 활성 전쟁 1개: 약 **60%**
- 활성 전쟁 2개 이상: 약 **70%**

병력이 충분하면 기존 V0.33D가 최대 2~3개 Formation으로 분할합니다.

따라서 A3의 핵심은 Formation 비율을 임의로 키우는 것이 아니라 **분모인 실제 현역 Person을 전쟁 규모에 맞게 유지하는 것**입니다.

예를 들어 현역 10명이 전쟁 중 유지되면 기존 60% 규칙만으로 야전 병력 약 6명이 됩니다.

---

## 5. 종전 후 단계적 동원해제

A2의 귀환 보호 규칙은 그대로 유지합니다.

종전 후 순서:

1. 전쟁 종료
2. 외국 영토 Formation은 V0.33A return corridor로 귀환
3. 귀환 중에는 평시 planner 전역 금지
4. 귀환 완료 후 단계적 동원해제 시작
5. **30일 간격으로 최대 2명씩** 평시 목표까지 예비군으로 전환

따라서 전쟁 종료 직후 10~12명의 현역이 한 번에 2~3명으로 줄어드는 것을 방지합니다.

새 이벤트:

- `POSTWAR_DEMOBILIZATION_SCHEDULED33F5A3`
- `POSTWAR_DEMOBILIZATION_PULSE33F5A3`
- `POSTWAR_DEMOBILIZATION_COMPLETED33F5A3`

---

## 6. 군사 경제 비용

이번 버전은 군인 급여나 별도 군량 소비를 추가하지 않습니다.

현역 군인은 기존과 동일하게 실제 Person이므로 다음 민간 활동에서 빠집니다.

- 농업/채집/채광 등 일반 생산
- 건설
- 유지보수
- 일반 임금노동
- 내부 이주

따라서 현역이 3명에서 10명으로 증가하면 실제로 약 7명의 민간 노동력이 추가로 빠집니다.

Formation supply도 기존 V0.32F 규칙대로 실제 식량을 군인용으로 이중 소비하지 않고:

- 보급 가능한 아군 정착지
- 도로/경로 비용
- 식량 접근성

을 반영하는 readiness 지표로 유지합니다.

---

## 7. 장비 체계는 이번 버전에서 유지

군사 장비는 기존 실제 자원 생산을 사용합니다.

장비 1 단위 생산 기준:

- 철 약 0.72
- 목재 약 0.18
- 도구 약 0.045

무기고와 실제 smithy worker가 필요합니다.

그러나 A3에서는 장비 부족을 **동원 자체의 hard gate로 사용하지 않습니다.**

현재 자연주행에서는 중세 초반까지 장비 산업이 열리지 않는 국가가 많으므로, 장비를 동원 필수조건으로 만들면 이번 패치의 병력 규모 확대 목적과 충돌할 수 있습니다.

장비는 기존과 같이 training / supply / morale과 함께 readiness와 전투력의 품질 요소로 남습니다.

장비 손실·회수 및 철/철광석 군수수요 확대는 후속 패치 범위입니다.

---

## 8. Devlog Compression V3

### 문제

F5A2 PC 자연주행 62년 Devlog는 분할 전 기준 약 **57.6MB** 규모였습니다.

실제 측정에서는 큰 비중이 다음과 같았습니다.

- Full `snapshots[]`: 약 67%
- `yearlySummaries`: 약 16%
- 실제 사건 `entries`: 약 15%
- `settlementYearly`: 약 2%

즉 고빈도 이벤트만이 아니라, Full Snapshot/연간 통계가 JSON에서 필드명을 반복 저장하는 구조가 가장 큰 원인이었습니다.

### A3 원칙

**게임 내부 telemetry는 삭제하지 않습니다.**

- runtime `snapshots[]`: 그대로 유지
- runtime `yearlySummaries`: 그대로 유지
- runtime `settlementYearly`: 그대로 유지
- 통계 탭: 기존 Full history 사용
- Snapshot CSV: 기존 Full schema 유지

압축은 오직 **Devlog JSON export 시점**에만 수행합니다.

---

## 9. Devlog JSON export 구조

### Snapshot

기존 모든 Full Snapshot을 JSON에 반복 저장하지 않습니다.

- 가장 최신 Full Snapshot **1개만** `snapshots[]`에 보존
- 세부 장기 시계열은 Snapshot CSV가 담당

### yearlySummaries

Devlog export에서는 핵심 장기 분석 필드만 남긴 Compact annual row로 변환합니다.

주요 보존 범주:

- 인구 / 영토
- 주요 자원
- Treasury / Market / Person Gold
- 기술
- 출생/사망/기아
- 교역
- 철산업
- Frontier
- 군사 / 전쟁
- 문화
- 성능
- A3 전시동원 지표

### settlementYearly

기존 정착지 연간 기록은 이미 짧은 키 기반 Compact 구조이므로 runtime/export 모두 유지합니다.

---

## 10. 이벤트 보존 기간

### 전체 역사 상세 보존

다음 계열은 오래된 사건도 상세 로그를 유지합니다.

- 전쟁 선언/종전
- Formation 생성·이동·목표·귀환
- Engagement / Battle
- 사망·부상
- 점령/해방/평화협정
- A2 lifecycle lock
- A3 전시동원/종전전역
- 출생/사망
- 내부이주
- 기술 시작/완료
- 영토 확보 및 Frontier 주요 사건
- 주요 건설 시작/완료/업그레이드
- 국가/Recovery 주요 사건

### 최근 5년 상세

- `AI_DECISION`
- 전략 Program
- Intelligence / Recon
- War Intent
- Expansion blocker/stall
- Construction Proposal
- Road Network 진단

### 최근 2년 상세

- 국가 식량 Relay
- 유지보수 상세
- 일반/국내 Trade
- Trade Network 진단
- 시장 유동성 bridge
- Industry gate
- 건축 Gold 회계

### 최근 1년 상세

- `INTERNAL_LOGISTICS`
- `INDUSTRIAL_LOGISTICS`
- Market surplus dividend
- 반복 Fiscal circulation

기간을 넘긴 이벤트는 삭제하는 대신 `DEVLOG_AGGREGATE33F5A3` 연간 집계로 변환합니다.

집계에는 가능한 경우:

- 발생 횟수
- 국가
- 자원
- 상대/목표
- 이동량/Gold/거래량
- 유지보수 요구/실제 사용
- 주요 blocker/reason/choice 빈도

를 남깁니다.

---

## 11. Devlog 압축 예상효과

F5A2의 실제 62년 6분할 Devlog를 다시 합친 뒤 A3 export 정책과 동일한 규칙으로 재계산한 결과:

- 기존: **약 57.59 MiB**
- A3 Compact 구조 예상: **약 6.45 MiB**
- 감소율: **약 88.8%**

이는 기존 로그를 대상으로 한 재구성 추정이며, A3 실제 자연주행에서는 이벤트 구성에 따라 달라질 수 있습니다.

목표는 정상적인 60~100년 자연주행에서 Devlog splitter가 필수가 되지 않도록 하는 것입니다.

---

## 12. A3 추가 Snapshot / CSV Telemetry

### World/global

- `wartimeMobilizationPulses33F5A3`
- `emergencyMobilized33F5A3`
- `wartimeReplacements33F5A3`
- `wartimeReinforcements33F5A3`
- `wartimeReplacementBlocks33F5A3`
- `postwarDemobilized33F5A3`
- `wartimeTargetsCreated33F5A3`

### Nation

- `peacetimeActiveTarget33F5A3`
- `wartimeActiveTarget33F5A3`
- `wartimeFieldTarget33F5A3`
- `militaryPopulationShare33F5A3`
- `eligibleMobilizationShare33F5A3`
- `wartimeReplacementBlocker33F5A3`
- `emergencyMobilizedNation33F5A3`
- `wartimeReplacementsNation33F5A3`
- `postwarDemobilizedNation33F5A3`

F5A2의 1206열에 A3가 16열을 추가하며 smoke test 기준:

- **1222 columns**
- 모든 Snapshot row 동일 열 수
- `validateCSV().ok === true`

을 확인했습니다.

---

## 13. 군사 UI

국가 → 군사 탭 상단에 **A3 동원 체계** 관측 상자를 추가합니다.

표시 내용:

- 현재 현역
- 평시 목표
- 활성 전쟁 시 전시 현역 목표
- 전시 야전 목표
- 현재 실제 야전 병력
- 누적 방어 비상동원
- 누적 전시 보충
- 누적 종전 전역
- 현재 보충 blocker

AI의 의사결정 권한을 새 UI가 갖지는 않습니다.

---

## 14. 저장 / 불러오기

새 저장 키:

`village-observer-v0-33f5a3`

Fallback:

- `village-observer-v0-33f5a2`
- `village-observer-v0-33f5a1`
- `village-observer-v0-33f5a`
- `village-observer-v0-33f5p2`

A2 세이브를 A3 코드로 직접 migration하는 smoke test를 통과했습니다.

새 export 파일명:

- `village-observer-v033F5A3-save-*`
- `village-observer-v033F5A3-devlog-*`
- `village-observer-v033F5A3-snapshots-*`
- `village-observer-v033F5A3-scenario-*`

---

## 15. 이번 버전에서 변경하지 않은 것

원인 분리를 위해 다음은 그대로 유지합니다.

### 개척

- 초지/평야 2인/3인: 2 / 2.4G
- 숲: 3.5 / 4.2G
- 암지: 5 / 6G
- 산: 8 / 9.6G
- Recovery Escape: 4G 고정
- F5A 50% Pioneer / 25% Market / 25% sink
- 일반 재정 보호선

### 군사

- 실제 Person-backed 병력 원칙
- Formation 45/60/70% 배분
- 최대 Formation 분할 구조
- A2 전쟁/귀환 중 평시 전역 lock
- A2 V0.33A 종전 귀환 단일화
- 전투·사상·부상·점령 규칙
- 장비 생산량 및 장비 손실 없음

### 경제/문화/가격

- F5 Monetary Price Index / anchor 규칙
- 문화 혼합/유전 규칙
- 기존 경제/가격/교역 규칙

---

## 16. 검증 결과

### 정적 JavaScript

- inline `<script>`: **108개**
- `node --check`: **오류 0개**

### 실제 Chromium smoke test

파일 내용을 브라우저 DOM에 직접 로드하여 확인했습니다.

- 문서 제목: `Village Observer V0.33F5A3`
- 버전 배지: 정상
- 브라우저 page error: **0**
- console error: **0**
- `World.serialize().version`: `0.33F5A3`
- A2 → A3 migration: 정상

### 군사 lifecycle 단위검증

- 평시 A3 목표 적용: 정상
- 강제 전쟁 생성 후 attacker/defender wartime target 생성: 정상
- 방어국 부족 병력 보충: 한 pulse에서 목표 이하 실제 Person 추가
- 식량 20일 테스트: 추가 동원 0, blocker `FOOD_RESERVE`
- 종전 후 staged demobilization: 한 pulse 최대 **2명** 전역

### Telemetry

Devlog export 전후 runtime telemetry 배열 길이가 변하지 않는 것을 확인했습니다.

즉 Compact export가 통계 탭이나 이후 CSV 분석용 원본을 파괴하지 않습니다.

---

## 17. 다음 자연주행에서 우선 볼 항목

1. 50~80년대 실제 전쟁에서 4~8명급 Formation이 이전보다 자주 등장하는가.
2. 공격국 D2 준비 병력이 선전포고 뒤 그대로 유지되는가.
3. 방어국이 1명 상태로 대군을 맞는 대신 실제 비상동원을 하는가.
4. 전투 사망/부상 뒤 `WARTIME_MOBILIZATION_PULSE33F5A3`가 실제 보충을 수행하는가.
5. 식량위기 국가는 보충이 적절히 차단되는가.
6. 현역 증가로 민간 생산·건설·유지보수에 지나친 붕괴가 생기지 않는가.
7. 종전 귀환 완료 전 전역이 다시 발생하지 않는가.
8. 귀환 완료 뒤 전역이 최대 2명씩 단계적으로 이루어지는가.
9. 60~100년 Devlog 실제 export 크기가 목표 범위에 들어오는가.
10. Compact Devlog + Full CSV 조합만으로 기존 수준의 원인 분석이 가능한가.

