# Village Observer V0.34H2 — Nation UI Consolidation V1

- 기준: V0.34H1; 변경 일자: 2026-10-18
- 범위: **국가 7개 하위 탭 UI**의 표시·조회 개편. 실제 Person, AI 의사결정, 병력·전투, 경제 회계, 문화, 기술 43개, F0/F1 원본 계측 및 CSV 스키마는 변경하지 않는다.

## 제공 파일
- `index-standalone.html`: 단일 파일 오프라인 실행
- `index.html` 및 `dist/hosted/`: GitHub Pages 경로 (상대 자산 기준)
- `src/bootstrap/v034h2.js`: 새 국가 UI 전용 데이터 읽기·화면 조립
- `tools/h2-transform.mjs`: 레거시 169블록 보호 유지, 구형 전략 패널 표시 시 `ensureProgram33C2` 호출만 제거
- `tests/test-h2.cjs`, `tests/test-h2-parity.cjs`, `tools/browser-h2-smoke.py`: 테스트
- `local-validator-h2.html`: 로컬 저장 검증기

## 국가 탭 UI
1. **개요:** 현재 `focus`와 이미 저장된 `v33c2StrategicProgram`을 최상단에 간략 표시. 판단 기록과 점수는 접기식. 인구·실제 Settlement·영토·국고·기술·식량·행복 및 Settlement 기반 Gini/상위 3곳 집중도.
2. **주민:** 실제 생존 Person 중심. 이름 검색, 직업·실제 Settlement 필터, 이름·나이·건강·행복 정렬, 페이지당 20명. 최근 1년 출생·기아/질병/노령 사망은 보존된 Devlog 이벤트 기준; 전투·기타 사망은 별도. 개인 정보는 접기 상세.
3. **경제:** 국고·시장 Gold·Person 지갑 구분, 실제 집계 재고, Settlement별 식량·비축, 물류·시장/회계 상세. **생산·소비·순변화는 동등한 주기와 보존식이 검증된 지표가 없어 임의로 산출하지 않음**. 기존 계측 상세는 보존.
4. **교역:** 기존 경로 캐시의 연결 결과(미계측 구분), 교역 국가·방향·기간·자원 필터 및 15건 단위 페이지, 무역 호가/운송/전략 상세 보존. 교역 경로 캐시 계산을 UI에서 강제로 시작하지 않음.
5. **사회:** 세계/국가/실제 Settlement 범위의 인구·연령·직업·문화 혼합 분포. 국가 문화 정렬 패널은 기존 상세에서 확인. 별도 타일 단위 구형 선택지 사용하지 않음.
6. **군사:** 실제 `v32dMilitary.formations` + `military32A.cohorts[].memberIds` 기반 Person-backed 병력. `V033I2.formationPower`를 통한 계산형 전투력, 임무·현재 위치·목표·지휘관·훈련·사기·보급. 군수/정찰/전쟁 진단은 기존 상세로 유지. 비활성(DORMANT) Formation은 활성 합계에서 제외.
7. **기술:** 진행 중 연구, 현재 43개 기술의 분야별 완료 현황, 최근 `TECH_COMPLETED` 이벤트, 보유 기술 펼치기. 독립 기술 탭은 그대로 유지.

국가의 **정착지/타일 전용 탭(G1B)** 및 H1 지도 개편은 변경하지 않았다. 기존 국가 패널은 한 개의 접기식 `기존 상세·계측 보기`에 모으고, 교역 D5 호가판의 DOM 노드는 후속 렌더러가 참조할 수 있도록 직접 자식 위치를 보존한다.

## 보존과 알려진 제한
- G5/H0/H1 저장파일 로드 및 H2 저장·복원, 기존 H1 지도, 기술 43개, Snapshot CSV V2 1,683열, F0/F1 원본 계측 보존.
- 0.33 이하 저장 호환성은 보장하지 않는다.
- 국가 UI가 기존 패널 렌더링을 먼저 실행한 후 재구성하는 V1 단계이므로, **긴 기존 진단 DOM 자체를 완전히 제거하거나 모든 렌더링 오버헤드를 없애는 패치는 아니다**. 과거 상세를 손실 없이 유지하는 데 우선순위를 두었다.
- 사회의 세계 문화 비율은 전체 실제 생존 Person 기반이며 국가별 수도 문화 정렬률을 하나의 세계 값으로 오인하여 합산하지 않는다.
- 이번 H2에 세계 탭 F0/F1 이전, 통계의 옛 지속 교전 기록 제거 등 H3 범위는 포함하지 않았다.

## 빌드 및 검증
```
node tools/build.mjs
node tools/build.mjs --check-only
node tests/test-h2.cjs
node tests/test-h2-parity.cjs
python tools/browser-h2-smoke.py
```
`TEST-34H2.md`를 참조할 것.
