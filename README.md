# Village Observer V0.33D1B

## Urban Construction Balance + Coalition UI Stabilization

기준 버전: **V0.33D1A**  
패치 버전: **V0.33D1B**  
접미사: **B = Balance**  
작성 기준일: **2026-09-30**

---

## 1. 패치 목적

V0.33D1A PC 자연주행에서는 Formation lifecycle, Operational Reachability, Coalition military access, 고정 기술비 6,315 Knowledge가 큰 회귀 없이 동작했다. 특히 DORMANT Formation의 물리적 유령 위치는 Telemetry에서 0으로 유지되었고, 60년대 후반에는 대부분의 국가가 40개 기술을 완성하여 기술 속도 목표도 충족했다.

반면 다음 두 축이 새 병목으로 확인되었다.

1. **도시·건설**: 건설 프로젝트가 실제 달력 기준으로 수백~수천 일을 점유하는 경우가 많아 프로젝트 슬롯이 장기간 막혔다. 동시에 주거 용량 4/8/16은 상위 주거 몇 개만으로 수도가 많은 인구를 수용하게 해 초기 수도 집중을 쉽게 완화하지 못했다.
2. **Coalition UI**: 실제 전투·저장 데이터는 `sideAIds / sideBIds`를 정상 보존했지만, B1의 병력 라벨과 A 계열 전쟁기록 패널 일부가 여전히 1:1 전쟁 시대 의미를 사용했다.

D1B는 **건설은 더 빠르게, 주거 한 단위의 수용력은 낮게, 도로는 단순하게** 재조정하고, 합동군 및 공동전쟁 표시의 UI 소유권을 D 계열 구조와 일치시키는 Balance 패치다.

---

## 2. 건설 노동량과 유지보수 기준 분리

### 2.1 핵심 원칙

V0.25 이후 `TOTAL_LABOR25`는 실제 건설시간과 유지보수 노동량의 기준을 동시에 담당했다. 이 상태에서 건설 노동량을 절반으로 줄이면 유지보수까지 자동으로 절반이 되므로 D1B에서는 두 기준을 분리한다.

- **Construction labor**: 실제 신규 건설·개축 프로젝트 진행량의 기준.
- **Maintenance baseline labor**: 분기 유지보수 필요 노동량 산정용 기준.
- 유지보수 노동율은 **분기 0.5%** 그대로 유지한다.
- 목재/석재 유지비는 **연 2%** 그대로 유지한다.
- `PUBLIC_WORKS`의 건설 노동 감소 효과는 새 Construction labor에 계속 적용한다.
- `FORTIFICATION`의 목책 건설 노동 감소 효과도 유지한다.

### 2.2 D1B 건설 노동량

| 시설 | D1A 기준 | D1B 건설 노동 | 변화 |
|---|---:|---:|---:|
| 도로 | 260 | **130** | -50.0% |
| 경작지 | 350 | **175** | -50.0% |
| 고대 주택 | 430 | **220** | -48.8% |
| 목책 | 520 | **260** | -50.0% |
| 곡물창고 | 520 | **260** | -50.0% |
| 전초기지 | 520 | **260** | -50.0% |
| 창고 | 635 | **320** | -49.6% |
| 저장고 | 635 | **320** | -49.6% |
| 채석장 | 690 | **350** | -49.3% |
| 교역소 | 690 | **350** | -49.3% |
| 학당 | 780 | **390** | -50.0% |
| 고대 시청 | 780 | **390** | -50.0% |
| 항구 | 865 | **430** | -50.3% |
| 시장 | 865 | **430** | -50.3% |
| 석재가공소 | 950 | **475** | -50.0% |
| 상인조합 | 1,040 | **520** | -50.0% |
| 심층채석장 | 1,095 | **550** | -49.8% |
| 대시장 | 1,210 | **605** | -50.0% |
| 고대 연립주거 개축 | 780 | **300** | -61.5% |
| 고대 집합주거 개축 | 1,210 | **450** | -62.8% |
| 철광산 / 제련소 / 대장간 | 600 | **300** | -50.0% |
| 병영 / 훈련장 / 무기고 | 600 | **300** | -50.0% |
| 고대 행정청 | 900 | **450** | -50.0% |

D1A 저장을 D1B로 불러올 때 진행 중 공사는 **완료율을 보존**하여 새 노동량 기준으로 변환한다. 예를 들어 430 중 215 노동일이 끝난 주택 공사는 50% 진행 상태를 보존하여 220 중 110으로 변환한다.

### 2.3 유지보수는 현행 유지

D1B의 유지보수 기준은 다음과 같이 보존된다.

- 도로 260
- 주택 430
- 연립주거 780
- 집합주거 1,210
- 철·군사시설 600
- 행정청 900
- 그 외 기존 시설도 D1A 이전 유지보수 기준을 유지

분기 필요 노동은 `maintenance baseline × 0.005`다. 즉 건설은 빨라지지만 건물 수가 늘어나면 장기 유지 부담은 그대로 축적된다.

---

## 3. 주거 수용량 재조정

주거 한 개발 단위의 수용량을 다음과 같이 변경한다.

| 주거 | D1A | D1B |
|---|---:|---:|
| 고대 주택 | 4 | **3** |
| 고대 연립주거 | 8 | **5** |
| 고대 집합주거 | 16 | **8** |

목적은 상위 주거의 공간 효율은 유지하되, 한 번의 개축이 수도의 수용력을 과도하게 늘리지 않도록 하는 것이다.

새 구조에서 용량 증가량은:

- 주택 → 연립주거: **+2**
- 연립주거 → 집합주거: **+3**

건설·개축 노동량을 동시에 크게 줄였으므로, 도시가 성장하면 소수의 초대형 주거가 문제를 해결하기보다 **더 많은 실제 건축 활동**이 발생하는 방향을 목표로 한다.

---

## 4. 도로 등급 단일화

기존 도로는 기술에 따라 자동으로:

- Lv.1: 0.78
- Lv.2: 0.62
- Lv.3: 0.48

의 이동계수를 사용했다. 물리적 도로 자체를 개축하지 않아도 `ENGINEERING / URBANIZATION` 연구 즉시 전국 도로가 자동 승급하는 구조였다.

D1B에서는 이를 폐기한다.

- 도로 없음: factor **1.00**
- **단일 도로 Lv.1: factor 0.62**
- `ENGINEERING`을 연구해도 road level은 1 유지
- `URBANIZATION`을 연구해도 road level은 1 유지

즉 새 도로의 성능은 **기존 Lv.2와 동일**하다. 향후 도로 등급을 다시 도입할 경우에는 기술 획득 즉시 전국 자동 승급이 아니라 실제 도로 개축 프로젝트로 설계하는 것을 원칙으로 한다.

D1B에서는 도로 건설비와 프로젝트 상한은 변경하지 않는다. 건설 노동 단축 + 단일 0.62 도로가 도로망 확산과 교역/군사 이동에 미치는 영향은 다음 자연주행에서 별도 관찰한다.

---

## 5. 합동군 지도 표기

D1A에서 국가색 1/n 원호 Formation ring을 도입했으나, B1의 중앙 병력 라벨은 같은 타일에 여러 국가가 있으면 동맹 여부와 관계없이 `⚔2↔3`처럼 표시했다.

D1B에서는 병력 라벨도 Coalition-aware로 수정한다.

- 같은 Side의 1개 국가: `▲3`
- 같은 Side의 2개국: 국가색 50/50 arc + `▲2+3`
- 같은 Side의 3개국: 국가색 120°씩 + `▲1+2+3`
- 실제 적대 Side가 같은 타일에 존재할 때만 `⚔A↔B`
- DORMANT / 물리적 존재가 없는 Formation은 표시하지 않음

따라서 **합동군 중첩**과 **실제 전투 접촉**의 의미를 중앙 기호에서도 분리한다.

---

## 6. Coalition 전쟁기록 UI ownership

D1A는 전쟁 데이터와 Coalition-aware 카드 함수를 추가했지만, 오래된 V0.33A `updateHistoryPanelA()`가 동일한 DOM ID를 다시 쓸 수 있어 통계창에서 중도 참전국이 사라지는 현상이 남았다.

D1B에서는:

- `v33aWarHistoryPanel`의 최종 소유자를 **V0.33D1B**로 고정한다.
- legacy A writer가 호출되더라도 D1B renderer로 즉시 위임한다.
- 표시 기준은 `sideAIds / sideBIds / winnerSide`다.
- 중도 참전국을 최종 전쟁 기록에 포함한다.
- 국가별 최근 전쟁에서도 중도 참전 전쟁을 포함한다.
- 공동 승리 / 공동 패배를 Side 기준으로 판정한다.

예: `키오 + 델마 ↔ 벨른`처럼 표시한다.

---

## 7. 기술·군사 기반 유지

### 기술

40개 기술 총 비용은 **6,315 Knowledge**로 동결한다. D1A 자연주행에서 60년대 후반 대부분의 국가가 40개를 완성하여 목표 범위에 들어왔으므로 추가 비용 조정은 하지 않는다.

### 군사

다음 D1/D1A 기반은 그대로 유지한다.

- War Intent: ASSESSING / PREPARING / READY / CANCELLED / DECLARED
- Intelligence API V0: confidence 100% proxy
- Operational Reachability
- Coalition military access
- Formation ACTIVE / DORMANT lifecycle
- Persistent Engagement
- 단계적 후퇴·회복·사기·이동 템포
- Multi-front / Multi-formation
- Person-backed casualty / manpower

실제 `PREPARING` 단계의 비축·추가 동원·장비 확보·전쟁용 도로·전략 집결은 **V0.33D2** 범위다. 불완전 정보, 정찰, 첩보, 은폐, 기만 역시 D1B 범위가 아니다.

---

## 8. D1B 관측 필드

Snapshot / CSV에 다음 D1B 필드를 추가한다.

- `constructionLaborSeparated33D1B`
- `maintenanceLaborRate33D1B`
- `roadFactor33D1B`
- `housingHouseCap33D1B`
- `housingRowCap33D1B`
- `housingCollectiveCap33D1B`
- `activeBuildProjects33D1B`
- `coalitionHistoryUIOwner33D1B`

기존 D1A의 `coalitionHistoryWars33D1A`, `operationalAccess33D1A`, `dormantPhysicalGhosts33D1A`도 그대로 유지한다.

---

## 9. 저장 호환성

- 새 저장 버전: `0.33D1B`
- localStorage key: `village-observer-v0-33d1b`
- 이전 D1A/D1/D/C3 계열 저장 fallback 유지
- D1B 저장을 다시 불러오면 주거/도로/건설 기준을 재적용한다.
- D1A 진행 중 건설 프로젝트는 진행률 보존 방식으로 D1B 노동량에 이관한다.

---

## 10. 구현 후 Smoke Test

D1B 구현 후 확인한 항목:

- 82개 `<script>` 블록 `node --check`: **syntax error 0**
- Chromium headless 부팅: **page error 0**
- 문서 제목/배지: `Village Observer V0.33D1B`
- 주거 capacity: **3 / 5 / 8**
- 건설 노동: road 130, house 220, row 300, collective 450, iron mine 300, admin office 450 확인
- 유지보수 baseline: road 260, house 430, row 780, collective 1210, iron mine 600, admin office 900 확인
- 유지보수율: **0.005 / quarter** 확인
- road factor: no road 1.00 / road Lv.1 0.62 / 기술 추가 후에도 0.62 확인
- `ROADS → ENGINEERING → URBANIZATION` 상태에서도 road level **1 / 1 / 1** 확인
- 기술 총비용: **6,315** 확인
- serialize → load round trip: **0.33D1B 유지**
- 900 simulation day short run: runtime error 0
- Snapshot D1B 필드 생성 확인
- CSV schema validation: **791 columns / bad rows 0**
- synthetic Coalition history `키오 + 델마 ↔ 벨른` 렌더링 및 `winnerSide=A` 표시 확인
- War History panel owner: **V0.33D1B** 확인

장기 자연주행 밸런스는 별도 검증이 필요하다.

---

## 11. 다음 자연주행 체크리스트

1. 초기 수도 최대 정착지 비중이 D1A보다 낮아지는가.
2. Housing Strain이 너무 이르게 폭발하지 않는가.
3. 주택/연립/집합주거의 실제 건물 수가 증가하는가.
4. `BUILDING_STARTED → COMPLETED` 달력기간 중앙값이 목표대로 크게 줄어드는가.
5. `PROJECT_CAPACITY` blocker와 AI fallback 빈도가 감소하는가.
6. 건설이 빨라진 대신 목재·석재·Gold 또는 유지보수가 새로운 자연스러운 병목으로 작동하는가.
7. 분기 `maintenanceShortfallShare25`가 장기적으로 과도하게 상승하지 않는가.
8. 단일 0.62 도로가 너무 빠르게 전 세계를 연결하지 않는가.
9. 도로망 확산으로 국제교역/국내물류/군사 이동이 과도하게 빨라지지 않는가.
10. 같은 편 Formation 중첩이 `▲2+3`과 국가색 arc로 보이는가.
11. 실제 적군 접촉에서만 `⚔` 표시가 나타나는가.
12. 79년대 같은 중도 참전 합동전쟁이 통계창과 각 참전국 최근전쟁에 남는가.
13. D1A의 `dormantPhysicalGhosts33D1A = 0`이 계속 유지되는가.
14. War Intent / Operational Reachability / Engagement에 회귀가 없는가.
15. 기술 총비용 6,315와 60년대 완성 속도가 유지되는가.

---

# 아래는 V0.33D1A 상세 기술 기록 보존본

# V0.33D1A 상세 기술 기록 (이전 기준)

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

