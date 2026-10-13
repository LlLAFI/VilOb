# V0.34E E-01 정적 실행 경로 감사

> **주의:** 아래 값은 소스에 나타난 함수 재할당 위치의 개수입니다. 실제 실행시간이나 불필요성의 증거가 아닙니다. 계측 결과를 보고 제거 여부를 결정합니다.

- 레거시 JavaScript 블록: 165개
- Bootstrap 모듈: 17개
- 검사한 JavaScript 파일: 182개

| 관찰 경로 | 소스 내 재할당/호출 위치 수 | 파일 수 |
|---|---:|---:|
| `World.advanceOneDay` | 42 | 42 |
| `World.serialize` | 147 | 147 |
| `World.from` | 148 | 148 |
| `Person.act` | 15 | 15 |
| `Person.metabolism` | 10 | 10 |
| `Person.chooseJob` | 7 | 7 |
| `Village.seasonalTick` | 61 | 61 |
| `Village.dailyTick` | 23 | 23 |
| `Telemetry.toJSON` | 148 | 147 |
| `Telemetry.snapshot` | 127 | 123 |
| `Telemetry.snapshotsCSV` | 112 | 112 |
| `UI.renderWorld` | 20 | 20 |
| `Telemetry.record.call` | 75 | 23 |
| `Event/Devlog literal` | 0 | 0 |

## 원칙

1. 실제 61년차 세이브로 측정한 전체 SIM/일과 상위 병목을 우선합니다.
2. `World.advanceOneDay`, `Person.act`, 물류·재고 경로는 동작과 결정론을 유지하며 통합합니다.
3. 구버전별 텔레메트리·CSV는 실제 UI, 저장, 회귀시험 의존성 조사 후 제거합니다.
4. CPU가 아닌 수출용 JSON 용량 감소만으로 성능 회복을 선언하지 않습니다.
5. E-01 RC는 **성능 최적화 완료 버전이 아니며** 코어 로직을 변경하지 않았습니다.
