# Snapshot CSV V2 스키마 안내

## 이유

V0.34C1H의 CSV는 총 **1,683열**, 중복 헤더 이름 **72쌍**을 포함합니다. 같은 이름이라도 세계 전체 집계와 국가별 값이 다른 경우가 있습니다. 따라서 값을 삭제하거나 합치지 않습니다.

## 변환

- Legacy 원본 헤더와 위치, 모든 데이터 행을 그대로 사용합니다.
- 첫 번째 동명 컬럼은 `global.이름`, 두 번째 컬럼은 `nation.이름`으로 구분합니다.
- 이름 충돌이 발생할 때는 원본 열 위치가 들어간 확정적 대체명으로 처리합니다.
- 헤더에 변동이 생겼다면 자동으로 추측해 변환하지 않고 오류를 보고합니다.
- 데이터 행은 CSV V2에서도 **바이트 동일**하도록 첫 줄의 헤더만 교체합니다.
- 정식 매핑은 `src/csv/schema-v2.json`의 `columns[index].original`, `.v2`, `.scope`를 참조합니다.

| 원래 헤더 | V2의 예시 |
|---|---|
| `hungerMealAttempts32E10` (첫 번째) | `global.hungerMealAttempts32E10` |
| `hungerMealAttempts32E10` (두 번째) | `nation.hungerMealAttempts32E10` |
| `intelMeanMilitaryConfidence33E` (첫 번째) | `global.intelMeanMilitaryConfidence33E` |
| `intelMeanMilitaryConfidence33E` (두 번째) | `nation.intelMeanMilitaryConfidence33E` |

CSV V2는 D0의 새로운 게임 규칙이 아니라 관측 파일에서 열 이름을 바꾸는 내보내기 옵션입니다. 기존 `스냅샷 CSV (Legacy)` 버튼도 유지합니다.
