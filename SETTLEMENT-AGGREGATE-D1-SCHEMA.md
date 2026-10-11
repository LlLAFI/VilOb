# D1 Settlement Aggregate / 별도 CSV 규격

Settlement당 한 행, 32개 고유 이름의 열. 세계 시점 현재값이며 시간에 따라 증분 누적되는 자원 창고를 따로 저장하지 않음.

- Identity: `settlementId`, `nationId`, `nationName`, `coreTileId`, `tiles`, `tileIds`
- 인구/노동: `population`, `children`, `age15Plus`, `age16Plus`, `age18Plus`, `pioneers`, `activeMilitary`, `assignedJobs`, `workersAtTile`, `inboundCommuters`, `outboundCommuters`
- 주거/건물: `housingCapacity`, `overcrowdedTiles`, `housingShortage`, `buildings`, `conditionAverage`, `conditionBelow70`, `conditionInactive`
- 금융: `marketGold`, `walletGold`. 국가 Treasury는 Settlement 합계에 포함하지 않음.
- 자원: `stock_food`, `stock_wood`, `stock_stone`, `stock_iron_ore`, `stock_iron`, `stock_tools`

`workTileId`는 외부 국가 주민이라도 해당 타일을 근무지로 기록하면 계산하며, Person 인구는 **거주지에서만** 센다. 근무지 필드가 과거 배치정보일 수 있으므로 `workersAtTile`은 배치된 근무 위치 수이지 실제 그 날의 노동 실적을 뜻하지 않는다.

Legacy/V2 Snapshot CSV 1,683개 열 구조와 데이터는 유지되며, 별도의 `Settlement CSV` 버튼으로 받는다.
