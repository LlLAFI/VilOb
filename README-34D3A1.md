# V0.34D3A1 — Food Flow Calendar & Audit Hotfix

**기준선:** V0.34D3A. **2026-10-11**. 기존의 생산/소비 수치와 D3 공동 경제권 정책은 유지합니다.

## 배경

D3A 자연주행 11년 자료와 동일 런의 Food Flow CSV(429행)를 교차 분석한 결과, D3A의 `ordinalDay()` 30회 묶음은 V0.24 이후 실제 약 90달력일 구간에 해당했고, Food Flow 헤더의 `harvestRequested`가 2회 반복되었습니다. 부패와 개척 직접 차감으로 정상적으로 소비된 식량이 `unattributedDelta`에 섞였으며, Settlement 병합/분할의 식량 귀속 변화가 순수 재고 유실과 구별되지 않았습니다.

## 구현

1. **실제 달력 30일 창:** `calendarOrdinalDay()`를 유일한 시간축으로 사용합니다. 창은 `1~30`, `31~60`, `61~90`, `91~120`일로 이어지고 실제 시뮬레이션의 30일 경계에서 마감됩니다. 실제 시뮬레이션 `advanceOneDay()`와 경제 3일 주기를 구별합니다. D3A와 달리 종료 창의 `endOrdinal`도 진짜 달력일입니다.
2. **CSV 고유 46열:** `harvestRequested` 중복을 제거하고 실제 `foodSpoiled`, `frontierFoodSpent`를 추가합니다. 기존 `harvest*`·`deposit*`·`meal*`·원격 조달 지표를 유지합니다. 이전 D3A 45열 헤더/행으로 재해석하면 안 됩니다.
3. **식량 부패 실제 차감:** 레거시 `src/legacy/021.js`의 `processFoodSpoilage` 물리 재고 차감 직후, 그 타일과 Settlement에 `foodSpoiled`를 기록합니다. 부패량이나 조건에는 손대지 않습니다.
4. **개척 식량 지출 실제 차감:** 정상 V0.20/V0.21 및 Recovery Escape의 실제 Frontier 착공 경로에서, `v.food -= cost.food` 전후의 물리 타일 재고를 비교합니다. 식량을 실제로 제공한 타일에 `frontierFoodSpent`를 기록하고 명목 비용을 임의로 더하지 않습니다. 비용과 개척 AI는 유지합니다.
5. **관측 수지:** `storageDelta = harvestStored + otherDeposited - mealReceived - otherWithdrawn - foodSpoiled - frontierFoodSpent + unattributedDelta`. 하지만 `topologyChanged` 또는 종료 재고 없음이면 `unattributedDelta`는 빈칸으로 표시해 미확정으로 남깁니다. 다른 직접 재고 쓰기, 모든 민간/군사 경로를 완전하게 분해했다고 주장하지 않습니다.
6. **활성 창 관측:** 진행 중인 현재 창도 인구·식량 노동자·Hunger 수치·비축 작업주기를 **내보내기 시점 기준**으로 채웁니다. 완결/미완결 구간은 `partial`에 구별합니다.
7. **저장 이식:** `V0.34D3A1` 전용 키로 저장합니다. `V0.34D3A` 버전 JSON을 **명시적으로 World.from으로 불러올 경우**, 물리 세계는 유지하지만 옛날 90일 Food Flow 관측 창은 **정확한 30일 데이터로 복원할 수 없으므로 폐기**하고 새 집계를 시작합니다. 로컬 D3A 자동 저장 키를 자동 검색하지 않습니다. 새 버전에서 저장한 관측 창은 재로드 시 그대로 유지합니다.
8. **호환:** 원본 169개 레거시 블록 해시 불변; 빌드 단계에서 명시적 계측 게이트만 추가합니다. Hosted와 Standalone 일치; 기존 Snapshot 1,683 / Settlement 48 / Housing 11 / Economy 24열 유지.

## 데이터 의미 주의

`foodSpoiled`와 `frontierFoodSpent`는 **저장 식량의 실제 감소량**입니다. `harvestRestoredNatural`은 창고가 수용하지 못한 **자연 원료로 되돌린 양**이므로 식량 창고의 유입량에 더하면 안 됩니다. `unattributedDelta`는 모든 누락 경로가 밝혀졌다는 보장이 없으므로 회계 검토 경고이며, 양/음 여부만으로 자원 생성/손실을 확정하지 마세요. Settlement의 구성 변경이 있는 창에서는 해당 열을 비워둡니다.

## 미변경 및 미해결

- 자연식량 회복(평야 6.2, 초지 5.5/3일), 채집 배율, 소비량(어린이 0.30/성인 0.42/3일), 부패율, Frontier 비용, 노동 배치, AIProfile, 기존 경제·군사·Gold 보존식 모두 유지.
- 카이렌의 집중적 주거 부족과 `_v29SlotKey` 4건 경고, 과거 특정 시드 849일 진행 중단의 원인은 **이번 범위 밖**.
- 60~75년 장기 자연주행은 미검증. 사용자 자연주행에는 Devlog + Snapshot V2 + Settlement + Housing + Economy + Food Flow를 권장합니다.

## 실행·검사

```bash
npm run build
node tests/test-build.mjs
node tests/test-csv.mjs
node tests/test-d3a1.cjs
node tests/test-d3a1-natural.cjs
python tests/browser-d3a-smoke.py
```

전체 과거 회귀 묶음은 `npm test`입니다. 실제 검증 결과/제한은 `TEST-34D3A1.md`를 참고하세요.
