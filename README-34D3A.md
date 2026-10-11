# V0.34D3A — Food Supply & Storage Stabilization

**배포 성격:** D3 후속 식량 수확물 보존 및 30일 원인별 식량 수지 관측. 기본 기능·저장·UI·결정론 회귀시험 통과, 장기 자연주행 검증 별도 필요. **실제 60–75년 / 장기 전쟁 / 특정 고정 시드 849일 정지의 근본 원인은 검증되지 않음.**

## 변경 사항

### 1. 일반 채취물 유실 방지 (P0)

기존 010 Person 채취 경로의 농부, 채집꾼/사냥꾼, 목수, 광부는 `Tile.harvest()`로 **자연 원료를 먼저 차감**하고 `harvestMultiplier`를 적용한 생산물을 `Village.depositAt`에 입고했습니다. 저장공간이 부족하면 입고하지 못한 생산물에 대응하는 원료가 자연에서 사라질 수 있었습니다.

D3A에서는 네 종류의 일반 채취 업무가 `V034D3A.harvestAndStore`를 사용합니다. 작업당 실제 채취 원료 `raw`, 기존 생산 보정 `multiplier`, 산출 `made=raw×multiplier`, 실제 입고 `stored`를 확인하고 **미입고 산출에 비례한 원료 `raw×(made−stored)/made`만 원래 자연 타일에 환원**합니다. 생산 배율이 0이면 사용 원료 전체를 복원합니다. 이는 창고 만재 시 무상 식량·목재·석재가 생성되는 패치가 아닙니다. 채집 요청 계수·자연회복·주민 소비량은 그대로입니다.

### 2. 실제 반환량 계측

D3의 기존 `foodDepositOverflow`는 **입고 요청 중 미수용량**이며 실제 폐기량이 아닙니다. 이번 패치에서도 호환을 위해 유지됩니다. D3A는 **일반 채취 원료의 자연 반환**과 기존 물류의 **출발지 재고 반환**을 분리합니다. D3A `transferWithReturn`을 통한 국내거래, 일부 구호·국가 내부 물류 경로에서 실제 인출/수령/원상 반환/미회수 잔량을 추적합니다.

원래 프로그램의 모든 물류 경로가 이 새 계측에 포함된 것은 아닙니다. 수송·착공·거래의 일반 재고 입출고는 `otherDeposited`/`otherWithdrawn`에 함께 잡히며, 이 수치를 모두 확정적인 국제/국내 교역량이라고 해석해서는 안 됩니다. 다른 Settlement의 저장고를 무료로 공유하지 않습니다.

### 3. Food Flow 30일 CSV (45열)

**새 버튼:** `Food Flow 30일 CSV`. 종료된 30달력일 창과 진행 중 창의 Settlement별 식량 수지를 CSV로 내보냅니다. 주요 항목:

- 창 시작/종료 식량·자연 식량·저장 한도, 식량 비축 작업주기, 주민·식량 직종 인원·Hunger≥85/95 인원(시점별 관측)
- 실제 자연 식량 채집 요청/원료 차감/생산 보정 산출/창고 수령/원료 복구/미입고 산출
- 실제 관측된 자연회복(회복 함수가 실행된 범위에서만 계측), 주민 식량 지급 요청·실제 수령
- 기타 입·출고, 확인된 물류 반송·미회수, 동일 Settlement 내 **다른 실제 타일 재고 인출량**(식량·목재·석재) 및 다른 타일 저장량
- `storageDelta`, `observedFoodDelta`, `unattributedDelta`, `topologyChanged`: 타일 구성 변화·기존 직접 재고 쓰기 등 때문에 회계가 완전히 분해되지 않은 구간을 식별. **`unattributedDelta ≠ 0`만으로 물자 생성/손실 버그를 확정하지 않음.**

CSV 귀속은 이벤트 당시 Settlement ID 기준이며, 지난 사건을 새 병합/분할된 Settlement에 소급 재할당하지 않습니다. 최대 **최근 360개의 30일 창**을 메모리에 보유하며, 저장 파일에 기록해 재개 시 유지합니다. 과거 D3 저장은 자동 이식되지 않으므로 D3A 새 세계 기준으로 검증하세요.

### 4. 노동 슬롯 경고 근거

Devlog `worldSummary.v034d3aFoodFlow.laborIssues`에서 D1A `slotInfo`를 기반으로 유효하지 않은 노동 슬롯을 **관측 시점**에 한해 구체적으로 기록합니다. Person ID, 근무 타일, 저장된 슬롯키, 건물 인덱스·종류·상태·불일치 범주를 포함합니다. 고용 배정 규칙 자체는 변경하지 않습니다.

## 변경하지 않은 것

- 지형별 자연회복량(평야 6.2/3일·초지 5.5/3일 등), 농부·채집꾼 기본량, 기존 생산 배율, 식량 소비(0–14세 0.30/3일, 15세 이상 0.42/3일)
- 기존 주거·출생·AIProfile·Market Gold·시장 가격·Gold 회계·군사·점령 규칙
- D3 공동 재고 범위, 서로 다른 Settlement 간 실제 수송/가격 제약, D2 건설 슬롯 기본3~최대11개

## 호환·실행

- V2 Snapshot CSV 1,683열, D1A Settlement CSV 48열, Housing CSV 11열, D3 Settlement Economy CSV 24열 **그대로 유지**. Food Flow CSV는 신규 45열.
- **Standalone:** `dist/standalone/index.html` 또는 동일 바이트의 `index-standalone.html`. ZIP 내 루트 `index.html`은 GitHub Pages용 Hosted 참조형으로 반드시 `dist/hosted/assets`가 필요합니다.
- Hosted: `npm run build`; GitHub Actions Pages 빌드/테스트 설정 유지.
- 세이브: **V0.34D3A 전용** `village-observer-v034d3a` 키. D3와 자동 상호 호환 아님.

## 시험·미해결

`npm test`, 실제 Chromium PC/모바일 스모크, 수확/입고/반송 합성 테스트 및 동일 시드 반복 시뮬레이션 완료. 시뮬레이션에서 `World.advanceOneDay` 3회는 실제 달력 1일로 처리되는 V0.24 경로이므로, 테스트는 **실제 달력 80일 × 2회(240 호출씩)**로 정확히 표기합니다. 별도 실제 달력 370일×2와 60–75년 자연주행은 **미완료**. 더 자세한 실제 결과는 `TEST-34D3A.md` 참고.
