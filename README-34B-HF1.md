# V0.34B-HF1 — Postwar Withdrawal Access & Formation Ownership Hotfix

릴리스: 2026-10-09 / 기준선: V0.34B / 운영: 신규 자연주행 우선 / 34C 다중 타일 Settlement 통합은 여전히 별도 버전

## 1. 배경과 원인

V0.34B 92년 자연주행에서 카이렌 제1야전대 `frm32d1-6-field1`이 과거 `war33-1` 종료 후 타일 194에서 장기 고립되고, `POSTWAR_WITHDRAWAL_BLOCKED33A / NO_RETURN_PATH`를 반복 기록했다. 이와 함께 같은 부대의 `FORMATION_TARGET_CHANGED32D`가 매우 자주 기록됐다.

코드 감사에서 **V0.33D의 종전 처리**는 `v33dReturnState.allowedOwnerIds`에 해당 전쟁의 모든 참가국을 저장하지만, 뒤이어 **V0.33A의 `markWithdrawalA`**가 철수 상태를 인수하면서 단일 `opponentId`만 저장하고 D 측 상태를 삭제하는 구조가 확인됐다. A 측 `pathHomeA`는 자국 + 단일 상대국 영토만 탐색하기 때문에 다자 합동전쟁 직후 합법적인 통로가 사라질 수 있다. 또한 기존 A 측 목표 보호 로직은 이후 추가된 모든 후속 군사 계획기에 대해 일관되게 적용된다는 보장이 없다.

단, 92년의 구체적인 고립 사건이 **오직 동맹 통행권 소실만으로 발생했는지**는 실물 세이브의 해당 시점 경로와 영유권을 확인해야 확정할 수 있다. 제3국 분단·육지 단절 가능성을 고려해 별도의 최후 송환 규칙을 제공한다.

## 2. 접근권 규칙

- 종전 **해당 전쟁 참가국 전체**(`war.sideAIds`, `war.sideBIds`; 과거 포맷은 공격·방어 양국)에게만 철수 전용 통행권을 준다. 같은 편과 상대편 모두 포함한다.
- Passport는 Formation의 `v33aWithdrawal`에 `warId`, `allowedOwnerIds`, `participants`, `startedCal`, `accessSoftExpiryCal`로 저장한다. V0.33D에서 넘어온 `v33dReturnState.warId`를 우선 사용한다.
- 중립 통행 가능 지형은 계속 허용하지만, 전쟁에 참가하지 않은 제3국의 소유 타일은 평시와 동일하게 차단한다.
- 최초 유예기간 360 calendar days. 360일이 지나도 철군이 끝나지 않았다면 **철수 중인 해당 Formation에만 권한을 연장**하고 이벤트를 기록한다. 무제한 국가 간 통행권·새 전쟁작전권을 생성하지 않는다.
- Path는 원래의 지형 tradeCost, 도로계수를 사용하여 4방향 이웃에서 최단 경로를 찾고, 실제 한 타일 이동의 소요일은 기존 `militaryMoveDays33(..., 'WITHDRAWAL')`을 그대로 쓴다.
- 귀국한 Formation은 즉시 `POSTWAR_WITHDRAWAL_COMPLETED33A`, `POSTWAR_ACCESS_REVOKED34BHF1`을 기록하고 일회성 철수권을 해제한다.

## 3. 후속 AI 계획기 충돌 보호

- 후기에 추가된 평시 `Village.dailyTick`와 `Village.seasonalTick` 경로도 감싸 실제 철군 Formation의 목표, 위치, 이동시계와 Cohort 위치를 검사 전 상태로 복구한다.
- 보호 대상은 `v33aWithdrawal.active`, `v33dReturnState` 또는 `POSTWAR_WITHDRAWAL` 상태를 가진 Formations이다. 동시에 다른 전쟁에 참가한 경우 기존 전쟁 작전 제어권을 우선한다.
- 보호 중인 Formation에 대해서만 `FORMATION_TARGET_CHANGED32D`, `FORMATION_MOVEMENT32D`의 **중복 평시 로그**를 차단한다. 정상 철수 이동(`POSTWAR_WITHDRAWAL_MOVE33A/33D`)과 전투·점령 로그를 억제하지 않는다.
- 원래 V0.33A·V0.33D 철수 루틴이 같은 날 호출될 가능성을 고려하여 `_v33LastMoveCal`로 동일 날짜 이중 이동을 차단한다.

## 4. 물리적 귀환 경로가 완전히 없는 예외

- 경로가 열릴 수 있는 동안은 실제 인접 타일 이동을 우선하고, `NO_RETURN_PATH` 동안 90일 간격의 축약 로그를 유지한다.
- **종전한 전쟁의 실참전자**이면서 **철수 경로가 연속 720 calendar days 이상 차단**되고, **전체 철수 기간도 720일 이상**이고, **해당 국가가 실제 영유하는 귀환 타일이 존재할 때만** 외교적 비전투 송환을 허용한다.
- 이것은 **통상적인 군사 타일 이동이 아니다.** 인접 이동 경로가 전혀 없을 때 장기 억류 병력을 협의·송환한 것으로 추상화한다. `POSTWAR_DIPLOMATIC_REPATRIATION34BHF1` 이벤트에 출발/도착 타일, 지속일, nonCombat 표식을 남긴다.
- 기존 Formation·Cohort의 위치만 자국 안전 타일로 옮기고 같은 실제 Person과 보유 장비를 유지한다. 장비/Gold/Person을 생성하거나 제거하지 않는다. 즉시 철수권을 해제한다.
- **남은 설계 논점:** 향후 외교 시스템이 구현되면 억류·중립국 협상·해상 귀환 비용·사상 위험을 명시적 게임 규칙으로 분리할 수 있다. HF1은 장기 고착에 대한 최소 안전장치다.

## 5. 저장·내보내기와 관측

- 게임 내 표시·JSON 세이브·Devlog·CSV 파일명에 `V0.34B-HF1` 적용. 기존 34B 세이브는 게임에서 읽을 수 있지만, 구버전 완전 무손실 이관 자체는 HF1의 종료 조건이 아니다.
- Passport는 기존 Formation의 `v33aWithdrawal`에 저장되므로 저장·로드 때 이름과 참가국 목록을 보존한다.
- `VSim.V034BHF1.inspect(world)`는 기존 `VSim.V034B.inspect(world, {baseline:false})`의 ACTIVE/ABANDONED 정착지·레지스트리 오류에 철수 부대 수·차단 수·Passport 비정상 개수를 더한다.
- Snapshot/CSV에는 `activeSettlements34B`, `abandonedSettlements34B`, `settlementRegistryErrors34B`, `postwarWithdrawing34BHF1`, `postwarBlocked34BHF1`를 추가한다.
- 기존 별도 `save-validator.html`은 `v34b`가 포함된 HF1 세이브의 **정적 구조** 검사를 그대로 수행한다. 96MB 세이브 자체를 대화에 업로드할 필요는 없다.

## 6. 회귀검증 및 결과 범위

1. Playwright/Chromium: 본편 생성 및 V0.34B-HF1 버전 표기, 초기 Settlement 1:1 감사, 페이지 오류 없음.
2. 합동전쟁 참가국이 중간에 낀 3타일 복귀 경로 `[2,1,0]` 허용. 중간 타일이 무관한 제3국에 귀속되면 탐색 실패.
3. 철수 Formation은 매일 한 타일씩 순간이동하지 않으며 기존 이동시간을 사용한다. 종전시 D의 허용국 목록을 A가 인계하는 회귀 시험 통과.
4. 720일 연속 완전 단절 후 외교 송환, 철수 상태 정리 및 통행권 해제 검증.
5. 19×19, 50×50, 100×100 신규 맵 각 30일: 레지스트리 오류 0, 개발자 로그 버전 정상, CSV 열 수 검사 통과.
6. HF1 신규 세계 `serialize() → World.from()` 후 Settlement 검사 통과.

**아직 검증하지 않은 항목:** 실제 92년 세이브의 카이렌 부대 귀환 결과, 멸망국 철수·해상 수송 사례, 수십 년 이상 HF1 장기 자연주행, 대형 세계 성능 비용 정밀 비교. 이는 정상적인 후속 검증 항목으로 남긴다.

## 7. 보존 범위

- Settlement 1:1, `Tile.ownerId`의 최종 소유권 및 `v33OccupierId`의 일시 점령 의미 변경 없음.
- 경제·전투·전쟁 승패·전쟁 준비·AI 프로필·Person 출생/사망·무역·생산 계산식 변경 없음.
- 다중 타일 정착지는 V0.34C에서만 시작.

