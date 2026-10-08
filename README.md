# Village Observer — V0.33I1A2

**Equipment Lifecycle Conservation Fix**  
패치일: 2026-10-08  
개발 기준: `index(20261008-022127).html` (V0.33I1A1)  
AI Editor 기준: `ai-editor(1).html` (V0.33G3 Editor V1)

## 1. 이 릴리스의 목적과 상태

I1A1 자연주행에서 전장 회수/유실 자체는 작동했지만 70년 주행 마지막에 에브와 티아에서 **투창 2개와 직물 방어구 2개, 총 4개가 공식 장부에서 설명되지 않는 결손**으로 남았다. I1A2는 I1A1의 전투 회수 확률을 고치는 패치가 아니라 **비전투 사망과 국적/소속 전환 중 Person이 갖고 있는 실제 장비가 제거·이동되기 전에 정산되도록 생애주기 경계를 수정**한다.

**구현 완료 / 정적·단위 회귀 검사 통과.** 모든 브라우저 환경에서 장기간 자연주행한 검증이 완료된 것은 아니다. 자연주행에서 보존 오류가 0개로 유지되는지는 다음 I1A2 데이터로 검증한다.

## 2. 원인 분석

### 2.1. 관측 자료

- 데이터: `village-observer-v033I1A1-devlog-session-2026-10-08T02-13-30-563Z.json` 및 같은 세션의 `snapshots.csv`.
- 범위: 70년 4분기 82일, 19×19 지도, 활성 국가 7개.
- 전장 장비 16개 처리: 11개 회수, 5개 유실. 회수 11개 모두 공급 노드 입고가 집계됐으며 마지막 Formation field cache는 0개였다.
- I1A1 장비 보존식 오류: 에브 **투창 1 + 직물 방어구 1**, 티아 **투창 1 + 직물 방어구 1**.
- 티아에서 **68년 1분기 90일 질병 사망한 `아델 에리아나`**는 과거 `javelin`, `padded_armor` 지급 기록이 있었다. 다음 분기 첫 장비 감사에서 해당 두 품목의 결손이 관측된다.
- 에브는 최초 CSV 결손 관측이 51년 2분기 88일이다. 이전 상세 로그는 집계/압축되어 같은 Person까지 특정할 수 없으므로 티아 사례만 직접 추적된 사례로 기술한다.

### 2.2. 확인된 실행 순서 오류

기존 V0.24 일일 인구 루틴 `dailyDemography24`는 `killPerson24`에서 `p.alive=false`로 표시한 후 `v.residents=v.residents.filter(p=>p.alive)`로 주민 배열에서 사망자를 제거한다. 반면 I1A1의 일반 장비 반환 루틴은 `Person.ageOneYear` 래퍼, `Village.dailyTick`의 `reconcile` 또는 이후 군사 감사에 의존한다. 질병·노환이 **일일 인구 처리**에서 발생한 경우, Person 객체가 군사 정산에 도달하기 전에 주민 배열에서 사라진다. 따라서 `equippedCounts`와 재고에서 동시에 해당 장비가 없어져 장부 결손이 발생할 수 있었다.

이는 전장 장비 loss resolver의 회수 확률 문제가 아니다. 전투 사망은 I1A1의 `captureBattleDeath`에서 별도로 장비를 분리하고 처리한다.

## 3. 변경 상세

### 3.1. 비전투 사망 `NONCOMBAT_DEATH`

- `killPerson24`에서 사망자 표시 전에 `V033I1.returnEquipment(v,w,p,'NONCOMBAT_DEATH')`를 호출한다.
- `weaponId`와 `armorId`가 물리적으로 반환되면 각각 원 소속 국가의 유효 공급 노드 inventory에 1개 입고되고 Person 슬롯은 `null`이 된다.
- `dailyDemography24`의 주민 필터 직전에는 다른 경로에서 이미 `alive=false`가 된 인물도 보호하도록 `PRE_REMOVAL_DEATH` 보조 검사를 추가한다.
- 슬롯이 이미 `null`이면 반환을 반복하지 않는다. 관측 이벤트도 실제 회수된 경우에만 증가한다.
- 기존에 `starvation25` 사망 뒤 일반 군사 정산에 의해 회수되던 로직은 유지한다. 노환·질병의 인구 확률과 전투 사망률은 변경하지 않는다.

### 3.2. 외부 이주 `EXTERNAL_MIGRATION`

- 기존 기근 이주/국가 간 Person 이동 코드에서 주민을 출발 국가 roster에서 제거하기 전에 원 소속 국가 장비를 회수한다.
- 이주자의 신상, 이름, 문화, 개인 소지 Gold와 기존 이주 동기는 그대로 유지한다.
- 이주 후 수용국은 필요하면 기존 실물 지급 조건에 따라 새 장비를 지급한다. 장비를 국가 사이에 순간이동하거나 새로 생성하지 않는다.

### 3.3. 평화협정 영토 양도 `PEACE_CESSION`

- 영토와 함께 국적이 변경되는 Person에 대해 `demilitarizeTransferred` 및 주민 roster 이동 **직전** 원 소속 국가 장비를 반납한다.
- 이 조치는 **주민이 장착한 장비**의 생애주기만 다룬다. 영토에 남은 군수창고 자체의 소유권/약탈/점령물자 정산 시스템은 이 릴리스에 추가하지 않는다.
- 기존 0.33F 전쟁 종결·영토 연결성·Gold 배상·인구 귀속 규칙은 유지한다.

### 3.4. 이전 I1A1 세이브의 결손 처리

장비가 이미 주민 roster에서 사라진 I1A1 저장에는 원래 장비를 회수할 사람과 위치가 남지 않는다. 그러므로 이전 결손을 소급해 재고에 더하지 않는다.

- **명시적으로 V0.33I1A1 버전 세이브를 Import/Load**하는 경우에만 각 국가/품목의 설명되지 않는 **양(+) 결손**을 1회 계산한다.
- `legacyUntrackedByItem`에 넣어 기존 회계식의 구분된 항목으로 보존하고, 새 `preI1A2UntrackedLoss`에 그 수량을 별도 표시한다.
- `MILITARY_EQUIPMENT_PRE_I1A2_DEFICIT_CARRIED` 이벤트에 국가·품목·수량·소스버전을 기록한다.
- 이미 보존 항목으로 정리된 과거 손실은 새 세이브 로드에서 다시 더하지 않는다.
- 새 세계와 신버전 저장에는 이전 결손 이전 처리를 적용하지 않는다.
- 음(-)의 결손, 즉 설명되지 않는 잉여는 자동 정리하지 않고 계속 보존 오류로 보고한다.

**주의:** 이전 데이터의 `preI1A2UntrackedLoss`가 4라고 해서 새 패치 자연주행에서 처음부터 오류 4개가 발생했다는 뜻은 아니다. 이는 이전 엔진 실행 중 발생한 설명 불가 결손의 보존적 이월 수량이다.

## 4. 장비 보존식 및 물리성

품목별 불변식:

```text
누적 생산 + legacy 마이그레이션
  = 국가 지역 재고
  + Person 장착 장비
  + Formation 회수품 cache
  + 공식 전장 유실
  + legacy 미추적 손실 (pre-I1A2 이월 포함)
```

비전투 사망, 국제 이주, 국가 귀속 변경은 **기존 장착 장비 → 원 국가 지역 재고**로 같은 품목의 수량을 이동시킨다. 누적 생산이나 전장 유실을 조정하지 않으며 Gold, Person, 식량, 목재, 철, 도구를 생성하지 않는다. 기존 지역 저장 용량을 초과한 강제 회수 시 기존 I1의 `storageOverflows` 진단을 유지한다.

I1A1 전장 회수 로직은 다음과 같이 불변이다.

| 상황 | 성공 확률 |
|---|---:|
| 진행 중 라운드 승리측 | 85% |
| 진행 중 라운드 패배측 | 55% |
| 진행 중 승패 불명 | 65% |
| Engagement 종료 패배측 일반 후퇴 | 35% |
| Engagement 종료 패배측 깊은 회복 | 20% |

- 무기/방어구 슬롯은 독립적으로 확률 판정한다.
- 회수된 현장 장비는 Formation 회수품 cache에 있다가 해당 Formation이 유효 공급 노드로 돌아올 때 재고화한다.
- 공식 회수 실패·전멸 유실은 `battleLostByItem`에 반영한다.
- 일반 부상자는 장비를 계속 보유한다.

## 5. AI 에디터 및 저장 호환

- 본편 버전: `0.33I1A2`.
- AI 에디터: `ai-editor.html` — 업로드한 `ai-editor(1).html` 원본을 변경 없이 동봉.
- `village-observer-ai` JSON v1 스키마, 7개 기본 프로필, Traits/Research/Construction/Mods/Capabilities 및 국가/문화 identity는 그대로 유지.
- 새로운 자동 로컬 저장 키: `village-observer-v0-33i1a2`.
- 불러오기: I1A2 저장 우선. 없으면 기존 I1A1 및 이전 버전 fallback.
- `NS.World.from`에서 I1A2·I1A1 로딩을 인식하며 I1A1만 구버전 결손 이월 대상으로 처리.
- `NS.World.prototype.serialize`는 기존 저장 필드를 유지하고 `v33i1a2` revision 메타데이터를 추가한다.

## 6. 텔레메트리

다음 신규 숫자 필드를 국가별 snapshot과 세계 합계, CSV에 추가한다.

| 필드 | 의미 |
|---|---|
| `equipmentNonCombatDeathRecovered33I1A2` | 비전투 사망 전 회수된 장비 item 수 |
| `equipmentExternalMigrationRecovered33I1A2` | 국제 이주 전에 원 국가가 회수한 item 수 |
| `equipmentPeaceCessionRecovered33I1A2` | 양도 주민으로부터 기존 국가가 회수한 item 수 |
| `equipmentPreI1A2UntrackedLoss33I1A2` | 이전 I1A1 저장의 역사적 미추적 결손(새 유실 아님) |
| `equipmentLifecycleReturnEvents33I1A2` | I1A2 생활 경로를 통해 성공한 Person 단위 반환 이벤트 수 |

세부 이벤트:

- `MILITARY_EQUIPMENT_LIFECYCLE_RETURN33I1A2`: Person, 원 국가, 이유, 품목, 수량.
- `MILITARY_EQUIPMENT_PRE_I1A2_DEFICIT_CARRIED`: 오래된 저장을 이관할 때 품목별 역사적 결손 수량.

기존 `equipmentBattleRecovered33I1A1`, `equipmentBattleLost33I1A1`, `equipmentRecoveryCache33I1A1`, `equipmentConservationErrors33I1A1` 및 Formation 군사 지표는 유지한다.

## 7. 검증

### 완료된 코드/단위 테스트

1. HTML inline JavaScript **125개 script 구문 검사**: 모두 통과.
2. 실제 수정된 `killPerson24` 함수의 질병 사망 테스트: 죽기 전 투창·방어구 1개씩 회수, 슬롯 비움 — 통과.
3. 수정된 `socialAndMigration` 함수의 국제 이주 테스트: 주민의 국가 변경 전에 출발 국가로 장비 2개 반환 — 통과.
4. `PEACE_CESSION` 반환 hook 및 `PRE_REMOVAL_DEATH` 이중 방지 지점의 소스 존재 검사 — 통과.
5. 이전 I1A1 결손 세이브의 레거시 이월 테스트: 결손 표시 1회, 장비 재생성 0개, 불변식 정상, 저장 메타데이터 보존 — 통과.
6. 반환 API 반복 호출 테스트: 실제 첫 반환만 집계, 두 번째 재회수 없음 — 통과.

**검증 한계:** 이 환경의 headless Chromium 접속이 정책상 차단되어 전체 UI 초기화와 장시간 실제 자연주행은 브라우저 자동화로 검증하지 못했다. 위 검사는 실행 중 인구 함수 또는 릴리스 모듈을 분리하여 호출한 단위 회귀 검사이며 장기주행 통과를 의미하지 않는다. CSV 신규 열은 기존 스키마 생성 규칙을 따르도록 작성했으나 실제 브라우저 장기 CSV Export 검증은 다음 실제 주행에서 해야 한다.

### 다음 자연주행 권장 확인 목록

- 새 세계에서 시작해 50~70년 운영했을 때 `equipmentConservationErrors33I1A1 == 0`이 유지되는가?
- `DEATH_ILLNESS`, `DEATH_OLD_AGE` 중 장착 장비 보유 사망자가 나오면 `equipmentNonCombatDeathRecovered33I1A2`가 증가하는가?
- 이주/영토 양도 발생 시 원 국가 잔여 재고와 보존식이 일치하는가?
- 전투 유실/회수 16개와 같은 작은 표본에서도 무기/방어구의 독립 회수·field cache 정산이 계속 작동하는가?
- `equipmentPreI1A2UntrackedLoss33I1A2`는 **새 세계에서 0**이며, I1A1 저장을 불러올 때만 역사적 결손을 설명하는가?
- 테스트 시 I1A1 로그의 기존 4개 결손이 새 플레이 중 발생한 오류로 혼동되지 않는가?

## 8. 범위 제외 및 알려진 후속 작업

- **I2는 미구현:** OPENING/CONTACT/MELEE 타일 내부 전투 단계, Reach/Screen, Penetration/Protection, 무기별 실효 전투력, 장비 내구도/노획.
- Formation 전멸 시 cache 정산은 이번 장기주행의 실제 표본에서 미검증. 별도 통제 시나리오로 재현이 필요하다.
- 영토 양도 때 **지역 군수창고 자체에 이미 보관된 재고**의 귀속과 전리품 처리는 이번 Person 장비 반환과 분리된 후속 과제다.
- 0.34의 다중 타일 Settlement 구조 전환 및 대규모 성능 재설계는 이 패치의 범위가 아니다.
- 공격성, 국가 AIProfile 값, 전장 피해/후퇴/평화 결과, 경제 가격, 연구 속도에는 의도적인 변경이 없다.

## 9. 실행 방법

`index.html`을 일반 데스크톱 브라우저에서 열어 실행한다. `ai-editor.html`은 별도의 독립 HTML 도구이며 게임 본편의 **세계 → AI / 국가 Profile** JSON Import 흐름에 맞춘다. ZIP에는 두 HTML과 이 README를 포함한다.

**검증 자료 권고:** `devlog JSON`과 `snapshots CSV`를 같은 세션에서 Export하고 오류 발생 시 첫 관측 연도 및 관련 `MILITARY_EQUIPMENT_*` 이벤트를 대조한다. I1A2 기준으로 다음 변경은 원인 확인 후 진행하며, I2 전투 품질 효과는 I1A2 보존 안정화 이후로 보류한다.
