# Village Observer V0.34G3B — Settlement One-Day Integration Gate

**기준:** V0.34G3A. **범위:** 신설/추가 병합의 왕복 실제 물류 접근비용이 각각 **1.00일 이하**인지 필수 판정. 36개 기술 유지, 신규 기술 없음.

## 확정 규칙

- 신규 Settlement 병합은 기존 동일 국가/인접/실제 개발/중심지 반경/면적 조건과 더불어 **병합 후 모든 구성 타일에 대해 중심지→타일, 타일→중심지 양방향 최단 경로 이동비 각각 ≤ 1.00**을 충족해야 한다. 정확히 1.00은 허용. 경로는 해당 병합 후 Settlement의 소유 타일을 경유하며 실제 지형과 (기술 ROADS, 상태 >=25인) 물리 도로를 반영한다.
- R2/R3/R4 반경 2/3/4, 상한 13/29/49, 인구·건물 등급 조건은 유지. **이 상한은 잠재적 최대 면적이지 1일 접근성의 자동 허가가 아니다.** 기술 단계별 이동비 감소는 차기 G4 논의 대상으로 보류.
- **구버전에서 이미 합쳐진 정착지는 그대로 유지.** 분할은 이전 G3의 단계별 상한(1.40 / 3.45 / 4.69) 및 기존 대기 180일·영유권 변화에 의한 즉시 불연속 분할 규칙을 유지한다. G3B의 신규 병합 비용 1.00을 기존 정착지의 유지/분할에 적용하지 않는다.
- **같은 Settlement 내부의 민간 재고 즉시 공동 이용**(D3), 3일 작업주기, 일반/긴급 식량 구호, 군사 타일 이동·전쟁·생산·시장·Gold·RNG는 이전과 동일하다.
- 신규 병합 대기 90일과 정착지 중심 승계 기준은 보존한다.

## 주요 코드

- `src/bootstrap/v034g3.js`: 기존 정책의 신규 병합 허용 비용만 `V034G3B.joinLimit`을 사용하도록 변경. **기존 분할 허용 비용은 별도 `legacyJoin`으로 고정**, 즉 임포트된 성숙 정착지의 즉시 분할 방지.
- `src/bootstrap/v034g3b.js`: G3B 버전, G3A↔G3B save 마이그레이션, 런타임 검사, 읽기 전용 공간 접근비 진단, 신규 병합 수/비용 초과 거절 수, 안내 배지와 타일 조사기 관측.
- `tools/g3b-transform.mjs`: **보호 C1H 레거시 원본을 건드리지 않고** 빌드 출력 `legacy/154.js`의 G3 경로 판정 결과 및 최종 병합 이벤트에 계측 훅만 추가. 실제 경로 판단은 기존 `V034G3.bothReachable`와 `NS.TERRAIN`/도로 구현을 유지한다.
- `local-validator-g3b.html`: 자체 포함 브라우저 검증기. 원본 G3A/G3 세이브를 **로컬에서만** 읽어 0/30/90/180일 주행 및 소형 JSON/CSV 출력.

## 관측 지표

DEVLOG `worldSummary.v034g3b` 및 로컬 진단 `g3b`:

- `joinRejectedOverOneDay`: 기존 기하학 조건은 충족했지만 **후보 중심지 양쪽 모두** 1.00 접근 판정을 통과하지 못한 후보 평가 횟수. `90일 대기까지 마친 실제 병합 실패 수`와는 다름.
- `joinAcceptedWithinOneDay`: 신규 규칙을 통과해 **실제로 최종 병합된 횟수**.
- `maxSettlementTravelCost`: 현재 활성 정착지 전체 중 왕복 최대 비용(도달 불가면 `null`).
- `overOneDaySettlements`: 현재 1.00 제한을 초과하는 활성 정착지 수. 구버전 정착지, 이후 도로 훼손 등으로 유지 비용이 커진 정착지가 포함될 수 있으며 **오류 수가 아님**.
- `grandfatheredOverOneDay`: 구버전 불러오기에서 플래그된 정착지 가운데 1일 초과인 수.
- `worstSettlements`: 최대 15개 정착지의 중심 타일, 면적, 편도/귀환 최대 비용 등.

진단은 `VSim.V034G3B.audit(world)`, 핵심 연결 검사는 `VSim.V034G3B.verify(world)`에서 확인할 수 있다. 읽기만으로 병합/정책 카운터를 변경하지 않는다.

## 배포

- `index-standalone.html` 혹은 `dist/standalone/index.html` — 오프라인 완전 단독 실행.
- `index.html` + `dist/hosted/assets` — GitHub Pages 루트 경로용. **모든 자산을 함께 업로드**해야 한다. 배포 자산 URL은 `?vilob=V0.34G3B` 식별자를 사용.
- `dist/hosted/index.html` + `dist/hosted/assets` — dist/hosted 전용 배포.
- `local-validator-g3b.html` — 로컬 검사 독립 파일.

## 검증

`npm run build`, `npm test`, `node tests/test-g3b-natural.cjs`, `python tests/browser-g3b-smoke.py`, `python tests/browser-g3b-local.py`.

**남은 한계:** 사용자의 159MB 성숙 세이브 파일은 전달받지 않았으므로 직접 G3B에서 재주행 검증하지 못했다. 신규 세계 360일·정밀 두 걸음 거절 및 G3A 대조와 브라우저 소형 세이브 검증만 완료. 실제 61년차 세이브는 사용자 PC의 로컬 검증기로 추가 확인 권장.

**차기 로드맵(미구현):** G4 도로 개량술/역참 제도/수리공학, G5 직업별 산출 보너스/야전 재편술, G6 외교관/스파이.
