# D1A Settlement CSV 스키마

- **48열**, Settlement당 1행, 인코딩 UTF-8 BOM, 열명 고유.
- 기존 D1의 32열은 모두 **순서와 정의를 유지**합니다. 특히 `assignedJobs`는 비무직 `job` 문자열을 가진 모든 연령의 Person 수이며, `workersAtTile`은 모든 연령의 `workTileId` 기준 근무지 필드 기록 수입니다. **실제 근로자 수가 아닙니다.**

추가 16열:

| 열명 | 의미 |
|---|---|
| `civilianEligible15` | 15세 이상, 현역 군사 및 Pioneer가 아닌 생존 주민 |
| `occupationTagged15` | 노동 후보 중 구체적 직업명 보유 |
| `unemployed15` | 노동 후보 중 `무직` 또는 `실업` |
| `slotKeyTagged15` | 노동 후보 중 `_v29SlotKey` 값 존재 |
| `facilitySlotAssigned15` | 건물 인덱스·시설·직종이 현재 타일과 일치하는 물리 슬롯 기록 |
| `informalSlotAssigned15` | 현재 비시설 슬롯 규칙에 맞는 야외·임시 슬롯 기록 |
| `workTileAssigned15` | 노동 후보 중 유효한 정수 `workTileId` 지정 |
| `nonFacilityOccupation15` | 직업명은 있으나 슬롯 키가 없는 노동 후보 |
| `outboundWorkAssigned15` | 거주 Settlement 밖/유효하지 않은 위치를 근무지로 기록한 노동 후보 |
| `inboundWorkAssigned15` | 외부 Settlement 거주 노동 후보 중 이 Settlement에 근무지를 기록한 인원 |
| `workLocationOtherTile15` | 거주 타일과 근무지 필드 타일이 다른 노동 후보 |
| `workLocationForeign15` | 근무지 필드가 타국 소유이거나 유효하지 않은 노동 후보 |
| `workTileDangling15` | 근무지 필드가 존재하지만 타일이 없거나 소유국이 없는 노동 후보 |
| `militaryExcluded15` | 15세 이상 생존 주민 중 현역 군사 인원 (개척과 중복 가능) |
| `pioneerExcluded15` | 15세 이상 생존 주민 중 Pioneer 인원 (현역 군사와 중복 가능) |
| `slotStructuralWarnings` | 슬롯 키가 현재 건물·타일·직종과 일치하지 않는 노동 후보 수. **진단 경고**이며 자동 수정 대상이 아님 |

`facilitySlotAssigned15`, `informalSlotAssigned15`는 **배정 기록의 구조 정합성**을 뜻하며 시설별 최종 생산 실적, 근무 시간, 실제 급여 수령, 고용 슬롯 점유율을 뜻하지 않습니다.

기존 1,683열 Snapshot CSV V2 형식은 그대로 유지됩니다. `NS.V034D1A`의 동일 시간 재조회는 실제 게임 상태를 바꾸지 않습니다.
