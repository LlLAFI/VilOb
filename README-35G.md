# Village Observer V0.35G — Construction Labor & Project Recovery V1

날짜: 2026-10-22. 기준 버전: V0.35F1. 본편 19×19 / 7개국 / 기술 43개 / CSV V2 1683열.

## 개요
52년 자연주행에서 건설 슬롯 포화, 완공에 수년~수십 년이 걸리는 공사, 52년 일부 Settlement의 주거 압박이 관측됐다. 핵심 원인 후보로 V0.25 `prepareConstructionTasks25()`가 **현장 타일 주민만** 건설 후보로 검색하고, V0.34D2가 도입한 동일 Settlement 1일 생활권을 반영하지 않은 점을 확인했다.

이 패치는 건설비 또는 프로젝트 슬롯을 조정하지 않고, **매 3일 작업 주기마다 실제 동일 Settlement 노동자를 건설 인력으로 배정**한다. 건설량·완공 시점·세계 RNG와 AI 결과는 35F1과 달라질 수 있다.

## 변경 사항

1. 일반 신축, 건물 개축, 시설 고도화: 같은 Settlement 소속의 살아 있는 성인 Person을 이용한다. 기존 물리적 타일 위치는 불변이고 현장 타일에 거주하는 사람을 먼저 선발한다.
2. 하나의 공사에 기존 최대 4명 규칙을 적용하며 한 작업 주기에 Person 하나당 공사는 최대 하나만 맡는다. 현장 밖 인력도 실제 Person이며 별도의 가상 건설 노동력은 생성하지 않는다.
3. PIONEER, 현역 군인(`militaryStatus32A === 'active'`), 유지보수 임무 큐 보유자는 공사 인력에서 제외한다. 식량 위기 시 기존 농업 인력 보호 조건을 유지한다. 노동자는 건설 주기에 일반 생산을 포기한다.
4. 연속 무인력 공사는 기존 착공 우선순위를 최대 10점 이내로 보정한다(30회 중단 주기마다 +1). 응급·생존·회복·방어 이유 공사는 추가 가산을 받지 않는다. 기본 우선순위는 그대로 유지된다.
5. 토지정비는 기존 V0.17 타일 기반 진행 규칙을 변경하지 않는다. 현장 노동자 부재를 포함한 진행/중단 기록만 추가한다. 동시 노동의 이중 소모를 피하기 위해 통합은 후속 결정이다.
6. **세계 → 고급 도구의 35F1 계측 패널 아래**에 `35G 공사별 CSV`, `35G 공사 정체 JSON` 다운로드 버튼을 추가한다. 성능 수치와 분리된 저비용 누적 카운터 및 프로젝트별 상태를 기록한다.
7. 기존 V0.35F1 세이브 가져오기 및 V0.35G 별도 저장 키 `village-observer-v035g`; G 세이브 재불러오기를 지원한다.

## 진단 파일

- `vilob-v035G-projects-<year>y.csv`: 현재 살아 있는 프로젝트 4종 (신축/개축/고도화/토지정비)의 타입, 타일, Settlement ID, 진행률, 실제 캘린더 경과일(기록이 유효할 때), 시작시각이 없을 때 추정 경과일, 마지막 진척일, 마지막 미진척 이유, 누적 무진척 작업주기, 이번 주기 근무자 수와 타일 외 지원자 수.
- `vilob-v035G-construction-<year>y.json`: 위의 현재 프로젝트와 국가별 누적 인력 배정/정체/토지정비 계측. `localEmptyRecovered`는 현장 성인이 없어도 같은 Settlement 주민으로 노동자를 배정한 횟수.
- `V0.35G` Devlog JSON의 `worldSummary.v35gConstruction`에 위 진단 스냅샷 포함.
- 기존 과거 프로젝트에 `startCalendarDay25`가 없으면 `ageCalendarDays`를 공란으로 둔다. `approxAgeCalendarDays`는 옛 3일 기준 `startDay`에서 추정한 참고값이며 정확한 시작일로 취급하지 않는다. `observedAgeCalendarDays`는 G 도입 후 최초 관측 시점부터의 경과일이다.

## 변경하지 않은 것

건물별 총 노동량/건축비/Gold 차감, 국가 건설 슬롯 상한, 기존 인력 생산 기회비용, 창고·교역소 의사결정, 전쟁·점령 통제, 물자 보존/자원·Gold 감사, 정규 CSV 열, 장비·전쟁·AIProfile 규칙.

## 실행 및 배포

- `index-standalone.html`: 단일 파일 오프라인 실행
- `index.html`: GitHub Pages 호스팅 진입점. `dist/hosted/assets`를 같은 경로로 업로드할 것.
- `dist/standalone/index.html` / `dist/hosted/index.html`: 해당 flavor의 배포 진입점.
- `npm run build` / `npm test` / `npm run test:35g`.
- `TEST-35G.md`에서 확인된 범위와 미확인 사항을 구분한다.

## 다음 실제 세이브 검증

기존 52년 F1 세이브를 35G에 불러와 3~5년(또는 최소 360일) 주행 후 `35G 공사별 CSV`, `35G 공사 정체 JSON`, Snapshots CSV, Devlog JSON을 제출한다. 특히 10년 이상 오래된 진행 중 프로젝트, 52년 카이렌의 Settlement 주거 압박 및 10배속 Wall을 비교한다. 현재 제공받은 것은 해당 세계의 Devlog/CSV이며 **52년 원본 세이브 파일은 없었으므로** 그 세계를 직접 재현해 시험하지는 못했다.
