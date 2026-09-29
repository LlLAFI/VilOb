# Village Observer V0.33D1A

## Coalition + Formation Stabilization

기준 버전: **V0.33D1**  
패치 버전: **V0.33D1A**  
접미사: **A = Adjustment / 종합 보완**  
작성 기준일: **2026-09-29**

---

## 1. 패치 목적

V0.33D1 새 월드 자연주행에서는 War Intent + Intelligence Foundation 자체는 정상적으로 작동했다. 공격 의도가 바로 선전포고로 이어지지 않고 검토·준비·취소되는 흐름이 실제로 나타났고, Formation 객체도 manpower 0 시 삭제/재생성되는 대신 ACTIVE/DORMANT lifecycle을 사용하기 시작했다.

동시에 D 이전의 1:1 전쟁 시대 코드가 D/D1의 다자전 구조와 충돌하는 세 지점이 확인되었다.

1. **전장 시각화**: B1의 구형 현재-Formation 빨간 링이 D1에서도 남아, DORMANT Formation의 과거 위치를 다시 그렸다.
2. **전쟁 기록**: A 계열 War History가 `attackerId / defenderId`만 참전국으로 인식해 중도 참전 공동교전국의 이력을 누락했다.
3. **작전 경로**: D의 실제 이동기는 공동교전국 영토를 통과할 수 있으나, C3 legacy 전략 목표 탐색은 자국+적국만 경로로 인정하여 우군 영토를 통한 공격 목표를 찾지 못했다.

또한 직접적인 육상 작전 경로가 없는 국가끼리 전쟁이 성립할 경우 장기간 전투·이동 없이 War Exhaustion만 누적되는 사례가 확인되었다.

V0.33D1A는 이 네 문제를 안정화하고, 기술 진행 속도를 새 고정 기준으로 확정한다.

---

## 2. 기술 Knowledge 기준값 재설정

### 2.1 기존 누적 스케일러 폐기

V0.33C2부터 사용하던 `scaledTechCost33C2()`는 원래 기술 비용에 구간별 배율을 곱하는 방식이었다.

```text
기존 개념
base cost
→ <=200 ×0.85
→ <=400 ×0.60
→ <=600 ×0.45
→ 그 이상 ×0.35
→ 5 Knowledge 단위 반올림
```

이 방식은 당시 빠른 밸런스 조정에는 유용했지만, 버전이 누적되면서 "현재 비용의 기준값이 무엇인가"를 읽기 어렵게 만들었다.

D1A부터는 이 방식으로 기술 비용을 다시 계산하지 않는다.

- `scaledTechCost33C2()`는 역사적 호환을 위한 no-op 이름만 남긴다.
- `applyTechPace33C2()`는 기술 비용을 변경하지 않는다.
- **D1A의 40개 기술 비용표 자체가 새로운 기준값이다.**
- 로드/새 세계/Telemetry 호출 시에도 아래 고정값을 다시 적용하므로 반복 곱셈으로 비용이 계속 내려가지 않는다.

### 2.2 총 요구량

| 기준 | 40개 기술 총 Knowledge |
|---|---:|
| V0.33D1 | 7,605 |
| **V0.33D1A** | **6,315** |
| 변화 | **-1,290 (-17.0%)** |

목표는 **60년대에 대부분의 국가가 40개 기술을 완성**하도록 후기 기술 정체를 줄이되, Knowledge 생산력이 낮은 국가가 여전히 늦을 수 있는 국가별 차이는 유지하는 것이다.

### 2.3 단계별 압축

| 기술 깊이 | 성격 | D1 합계 | D1A 합계 | 변화 |
|---|---|---:|---:|---:|
| 0단계 | 시작 기술 | 370 | 345 | -6.8% |
| 1단계 | 초기 확장 | 2,270 | 2,040 | -10.1% |
| 2단계 | 중기 핵심 | 2,335 | 1,955 | -16.3% |
| 3단계 | 후기 진입 | 1,590 | 1,245 | -21.7% |
| 4단계 | 최후반 | 720 | 520 | -27.8% |
| 5단계 | 기술트리 종점 | 320 | 210 | -34.4% |
| **전체** | **40개** | **7,605** | **6,315** | **-17.0%** |

초반은 거의 유지하고, 후반으로 갈수록 감축폭을 키운다.

### 2.4 기술별 고정 비용

| 분야 | 기술 | D1 | D1A |
|---|---|---:|---:|
| 생산 | 농경 | 70 | **65** |
| 생산 | 목공 | 70 | **65** |
| 생산 | 석공 | 75 | **70** |
| 생산 | 관개 | 135 | **120** |
| 생산 | 곡물 저장 | 130 | **115** |
| 생산 | 채석장 | 145 | **130** |
| 생산 | 윤작 | 180 | **160** |
| 생산 | 임업 | 185 | **165** |
| 생산 | 식량 보존 | 215 | **180** |
| 생산 | 철광 채굴 | 235 | **195** |
| 생산 | 제련 | 235 | **185** |
| 생산 | 철공 | 215 | **155** |
| 교역 | 교역 관습 | 65 | **60** |
| 교역 | 수레 | 150 | **135** |
| 교역 | 시장 | 155 | **140** |
| 교역 | 도량형 | 215 | **195** |
| 교역 | 사절단 | 235 | **210** |
| 교역 | 연안 항해 | 195 | **165** |
| 교역 | 화폐제도 | 205 | **170** |
| 교역 | 도로 | 150 | **125** |
| 교역 | 장거리 상단 | 210 | **175** |
| 교역 | 항해술 | 215 | **170** |
| 교역 | 상법 | 215 | **170** |
| 교역 | 원양 항해 | 250 | **180** |
| 지식 | 기록법 | 90 | **85** |
| 지식 | 학술 전통 | 175 | **160** |
| 지식 | 학당 | 250 | **210** |
| 지식 | 학당 교육 | 230 | **180** |
| 개척·행정 | 측량 | 140 | **125** |
| 개척·행정 | 개척 보급술 | 190 | **160** |
| 개척·행정 | 행정제도 | 225 | **190** |
| 개척·행정 | 봉수와 파수 | 225 | **175** |
| 도시 | 정착지 계획 | 210 | **190** |
| 도시 | 건축술 | 215 | **195** |
| 도시 | 축성술 | 225 | **190** |
| 도시 | 우물과 배수 | 235 | **195** |
| 도시 | 토목술 | 240 | **185** |
| 도시 | 공공사업 | 230 | **180** |
| 도시 | 도시 발달 | 255 | **185** |
| 도시 | 도시 정비 | 320 | **210** |

---

## 3. Formation 링 시각화 안정화

### 3.1 구형 B1 현재-Formation 링 제거

V0.33B/B1의 `drawFrontB()`는 전쟁 참가국 Formation 객체에 `cohortIds`가 존재하면 실제 manpower와 관계없이 빨간 원을 그렸다.

D1에서는 Formation 객체를 DORMANT로 보존하기 때문에 이 구조가 다음 현상을 만들었다.

```text
병력 0
→ Formation DORMANT
→ 객체와 과거 tileId는 보존
→ B1 렌더러가 객체만 보고 빨간 원 표시
→ ▲ manpower 라벨은 0명이므로 표시되지 않음
→ 빈 빨간 원만 남음
```

더 나아가 전쟁 종료 시에는 활성 전쟁이 없어 원이 사라졌다가, 같은 국가가 새 전쟁에 들어가면 B1이 같은 DORMANT 객체를 다시 읽어 과거 위치에 원을 재생성했다.

D1A에서는 B1의 **현재 Formation 원 그리기 자체를 제거**한다.

B1은 다음만 담당한다.

- 전쟁 전선
- 점령/해방 시각화
- 최근 전투 마커

현재 Field Formation 링은 D multi-front renderer만 담당한다.

### 3.2 국가색 Formation 링

현재 야전군 링은 더 이상 공통 빨간색이 아니다.

- 1개 국가: 해당 국가 고유색 전체 원
- 2개 동맹국이 같은 타일: 180° + 180°
- 3개국: 120°씩
- N개국: **1/N 원호**

색을 RGB로 섞지 않고 원호를 분할하는 이유는 국가 정체성을 그대로 유지하기 위해서다.

빨강 계열은 계속 다음 의미에 사용한다.

- 적대 전선
- 전쟁 상태 강조
- 위험/교전 계열 표현

국가색 원은 **"누구의 야전군이 여기 있는가"**만 표현한다.

---

## 4. Formation lifecycle: 역사와 물리적 존재 분리

D1의 ACTIVE / DORMANT 객체 보존은 유지한다.

다만 D1A부터 DORMANT는 다음처럼 해석한다.

### ACTIVE

- 실제 active Person manpower 존재
- 지도상 물리적 야전군 존재
- `v33d1HasPhysicalPresence = true`

### DORMANT

- Formation의 ID와 이력은 보존
- 전투 사기 등 장기 Formation 정체성 보존 가능
- 마지막 실제 작전 위치를 `v33d1LastOperationalTileId`에 기록
- **현재 지도상 군대는 존재하지 않음**
- `v33d1HasPhysicalPresence = false`

### 재활성화

DORMANT Formation이 다시 manpower를 얻으면 과거 전장에서 갑자기 부활하지 않는다.

재집결 지점 후보:

1. 자국 군사시설(병영/훈련장/무기고/파수/축성)
2. 행정청
3. 도로 연결
4. 수도

후보에 점수를 주어 자국의 실제 거점에서 다시 ACTIVE가 된다. 적합한 거점이 없으면 수도를 사용한다.

재활성화 시 최근 이동 trail도 초기화한다.

---

## 5. Coalition 군사통행권

### 5.1 기본 원칙

같은 전쟁에서 같은 Side에 속한 국가는 서로의 영토를 **그 전쟁 동안만** 군사 작전용 통행 지역으로 취급한다.

예:

```text
키오 + 라엔  vs  티아

키오 영토 → 라엔 영토 → 티아 영토
           ↑
      전쟁 한정 우군 통행 가능
```

이 통행은 평시 일반 외교 통행권으로 저장되지 않는다.

우군 영토를 통과해도 점령 이벤트는 발생하지 않는다.

### 5.2 목표 탐색과 실제 이동의 경로 규칙 통일

D의 실제 `pathD()`는 이미 같은 Side의 모든 국가 영토를 통과할 수 있었다.

문제는 앞단의 C3 legacy 전략 목표 탐색이었다. 기존 `strategicTarget33()`은 자국+한 적국만 경로로 인정했기 때문에, 우군 영토를 거쳐야 하는 목표를 `WAR_HOLD` 또는 도달 불가로 판단할 수 있었다.

D1A에서는:

1. C3 legacy target 결과가 정상적으로 도달 가능하면 기존 결과를 유지한다.
2. legacy가 `WAR_HOLD`, 자기 타일, 도달 불가, 잘못된 DEFEND_CORE fallback을 반환하면
3. D의 coalition-aware `pathD()`를 사용해 적국의 실제 도달 가능한 목표를 다시 탐색한다.

즉 다음 세 단계가 같은 통행권 모델을 공유한다.

```text
전략 목표 선택
→ 경로 가능성 확인
→ 실제 이동
```

---

## 6. Operational Reachability V1

War Intent가 전력과 관계만 보고 실제로 만날 수 없는 상대와 전쟁을 시작하는 문제를 막기 위한 기반이다.

### 상태

#### `DIRECT_ACCESS`

현재 자국+대상국 영토만으로 육상 군사 경로가 존재한다.

#### `WAITING_ACCESS`

직접 경로는 없지만 우호적인 제3국 영토를 통하면 물리적 경로가 존재한다.

D1A에서는 **통행을 얻기 위한 실제 외교 행동은 아직 없다.** 따라서 최대 720일 동안 PREPARING 상태로 기다린 뒤 접근권을 얻지 못하면 Intent를 취소한다.

#### `NO_OPERATIONAL_ROUTE`

현재 구현된 육상 군사체계로는 작전 경로가 없다.

공격 의도가 충분히 높아 Intent가 생성될 수는 있으나, 재평가 후 `NO_OPERATIONAL_ROUTE` 사유로 취소된다. 실제 선전포고로 넘어가지 않는다.

#### `ALLY_ACCESS`

이미 시작된 공동전쟁에서 같은 Side의 우군 영토를 통하여 적국에 도달할 수 있다.

### 미래 확장

이 인터페이스는 이후 다음을 추가할 수 있도록 분리했다.

- 평시 군사통행권 외교
- 동맹/보호국
- 해상 수송
- 상륙전
- 봉쇄
- 정보 부족으로 인한 잘못된 경로 판단

---

## 7. 작전 경로 관측 로그

추가 이벤트:

### `MILITARY_ACCESS_OPENED33D1A`

제3국이 공동교전국으로 들어와 같은 Side 국가 사이 전쟁 한정 군사통행권이 생겼을 때 기록한다.

### `OPERATIONAL_ROUTE_AVAILABLE33D1A`

이전에는 적국에 도달할 수 없던 참전국에게 실제 작전 경로가 열렸을 때 기록한다.

### `OPERATIONAL_ROUTE_LOST33D1A`

기존 작전 경로가 사라졌을 때 기록한다.

작전 경로 감시는 30 calendar-day 간격의 저빈도 audit로 수행한다.

---

## 8. Coalition-aware War History

기존 A 계열 국가 최근 전쟁 UI는 다음만 검사했다.

```text
attackerId == nationId
또는
defenderId == nationId
```

따라서 전쟁 중간에 `WAR_JOINED33D`로 참가한 국가의 전쟁이 그 국가의 최근 전쟁 목록에 나오지 않았다.

D1A의 전쟁 기록은 다음을 기준으로 한다.

```text
sideAIds[]
sideBIds[]
winnerSide
```

### 표시 예

```text
티아+델마 ↔ 라엔
티아 ↔ 키오+라엔
```

중도 참전국 역시 최근 전쟁 목록에 나타난다.

### 결과 판정

- 단독 Side 승리: `승리`
- 복수국 Side 승리: `공동 승리`
- 복수국 Side 패배: `공동 패배`
- winnerSide 없음: `무승부/종전`

전사·부상·누적 점령도 Side 소속 국가 값을 합산/통합해 표시한다.

---

## 9. War Intent + Intelligence Foundation 유지

D1의 핵심 설계는 그대로 유지한다.

```text
World Truth
   ↓
Intelligence API
   ↓
War Intent / Strategic AI
```

D1A에서도 Intelligence confidence는 계속 **100%**다.

이번 버전에서 추가된 것은 정보 오차가 아니라 **작전 가능성이라는 새로운 전략 판단 항목**이다.

Intent UI에 현재 Operational Access 상태도 표시한다.

실제 첩보·정찰·기만·정보 decay는 아직 도입하지 않는다.

---

## 10. 저장 호환성

현재 저장 버전:

```text
0.33D1A
```

fallback 순서:

```text
0.33D1
→ 0.33D
→ 0.33C3F
→ 0.33C3
→ 0.33C2
```

D1A save에는 다음이 추가된다.

- `v33d1a.revision`
- 고정 기술비 총량
- 최근 operational route audit 시각
- 전쟁/국가별 route state

기존 D1의 War Intent / Intel Book / Formation lifecycle 상태는 그대로 보존한다.

---

## 11. Telemetry / CSV 추가

Global:

- `techCostTotal33D1A`
- `coalitionHistoryWars33D1A`
- `operationalRouteAudits33D1A`

Nation:

- `operationalAccess33D1A`
- `dormantPhysicalGhosts33D1A`

`dormantPhysicalGhosts33D1A`의 기대값은 항상 **0**이다. DORMANT인데 physical presence가 남는 회귀를 바로 찾기 위한 invariant 관측값이다.

---

## 12. V0.33D1A 검증

### JavaScript syntax

전체 inline `<script>` 블록을 분리하여 Node.js `--check` 수행.

결과:

- syntax error: **0**

### Browser runtime smoke test

Chromium DevTools Runtime에 전체 HTML을 주입하여 실제 브라우저 환경에서 startup을 검증했다.

확인 결과:

- document title: `Village Observer V0.33D1A`
- version badge: `Village Observer · V0.33D1A`
- `VSim.V033D1A.revision`: 정상
- 고정 기술 수: **40개**
- 기술비 총합: **6,315 Knowledge**
- serialize version: `0.33D1A`
- startup runtime exception: **0**

### Save / load

현재 세계를 serialize 후 `World.from()`으로 즉시 복원.

결과:

- version: `0.33D1A`
- D1A revision 복원
- 기술비 총합 6,315 유지

### CSV

Snapshot 생성 후 CSV header 검사.

확인:

- `techCostTotal33D1A` 존재
- `operationalAccess33D1A` 존재
- `dormantPhysicalGhosts33D1A` 존재

### Operational corridor synthetic test

3개 국가가 다음처럼 배치된 최소 테스트를 사용했다.

```text
A ─ C ─ B
```

A와 B는 직접 접경하지 않고 C 영토를 통해서만 연결된다.

평시:

```text
A → B = WAITING_ACCESS
via C
```

C가 A와 같은 전쟁 Side가 된 뒤:

```text
A → B = ALLY_ACCESS
via C
```

동일 물리 지형에서 Coalition 참전에 따라 작전 경로가 열리는 상태 전환이 정상적으로 확인되었다.

---

## 13. 자연주행에서 우선 확인할 항목

1. DORMANT Formation의 빈 원이 전쟁 중 남는가.
2. 전쟁 종료 후 사라진 과거 원이 새 전쟁 때 같은 위치에 재등장하는가.
3. Formation 링이 국가색으로 표시되는가.
4. 두 동맹국 Formation이 같은 타일에 있으면 1/2 arc가 정상 표시되는가.
5. 세 국가 이상이면 1/N arc가 정상 표시되는가.
6. DORMANT → ACTIVE 재활성화가 과거 전장이 아닌 자국 집결지에서 일어나는가.
7. 중도 참전국의 전쟁이 국가 최근 전쟁에 남는가.
8. 공동전쟁 승패가 winnerSide 기준으로 정상 표시되는가.
9. 우군 영토를 통과한 Formation이 우군 타일을 잘못 점령하지 않는가.
10. 키오→라엔→티아 형태의 우군 corridor를 실제로 이용하는가.
11. 접근 불가능한 두 국가가 전투 0회 장기전으로 들어가는 현상이 사라지는가.
12. `WAITING_ACCESS`가 720일 이상 무한 고착하지 않는가.
13. `OPERATIONAL_ROUTE_AVAILABLE33D1A`가 제3국 참전 후 정상 기록되는가.
14. 60년, 65년, 69년 국가별 기술 수가 새 목표에 가까워지는가.
15. 40개 기술 총비용이 어떤 save/load 후에도 6,315를 유지하는가.
16. Engagement 3~5일 라운드, Retreat, Occupation, War Exhaustion에 회귀가 없는가.

---

## 14. 다음 단계

D1A 검증이 끝나면 **V0.33D2 — Strategic War Preparation**으로 넘어갈 수 있다.

D2의 핵심 후보:

- PREPARING 중 실제 추가 동원
- 전쟁 전 식량/군수 비축
- 장비 확보
- Formation 집결
- 전쟁용 전략도로
- 두 번째 전쟁을 위한 추가 준비 부담
- 패전 경험을 준비 목표에 반영
- 상대의 잠재 동원력 평가
- `WAITING_ACCESS` 상태에서 실제 외교 통행권 요청으로 확장할 준비

그 이후 Intelligence & Reconnaissance 계열에서 D1의 100% 정확 정보 경계를 실제 불완전정보로 전환한다.

---

## 15. 요약

V0.33D1A는 새 군사 콘텐츠를 크게 추가하는 버전이 아니라, **다자전 시대에 맞게 옛 1:1 전쟁 코드의 경계를 정리하는 안정화 패치**다.

핵심은 다음 다섯 가지다.

1. **DORMANT Formation 유령 원 완전 제거 + 국가색 1/N Formation 링**
2. **Formation 역사적 정체성과 현재 물리적 존재 분리**
3. **공동교전국 군사통행권과 전략 목표 경로 통일**
4. **War Intent에 실제 작전 접근 가능성 추가 + Coalition-aware 전쟁 기록**
5. **40개 기술 비용을 반복 계산이 아닌 고정 6,315 Knowledge 기준값으로 확정**

