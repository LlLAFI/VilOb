# Village Observer V0.34D2A — Housing Capacity & Shared Living Consistency Hotfix

**기준선:** V0.34D2 · **패치일:** 2026-10-11 · **상태:** 구현/자동회귀·370일 결정론·Chromium 데스크톱/모바일 검사 PASS, 60–75년 자연주행 미검증.

## 배경

D2 초기 자연주행(2년 1분기 11일 종료)에서 같은 시점의 D1A Settlement CSV의 주거 수용량은 112명분, D2 Housing CSV는 84명분으로 나타났습니다. 주거 인구는 125명으로 같았습니다. D2가 새 `capAt` 계산에서 `house`, `row_house`, `collective_house` 세 가지만 인정해 **회관 `town_hall`의 수용량 4명 × 7개 = 28명분**을 빠뜨린 것이 직접 원인입니다. 같은 제한이 개척 거점 `outpost`에도 적용될 수 있었습니다.

또한 D1의 개별 건물 관측은 같은 종류의 건물들 중 최고 `buildingEfficiency(type)`를 다시 사용해 서로 다른 상태의 건물을 과대 평가할 가능성이 있었고, D2에서 주택 착공은 Settlement 단위로 바뀌었지만 Person의 주거 스트레스와 최신 V0.24 일일 질병·출생 알고리즘은 타일별 주거 점유를 읽는 경로가 남았습니다.

## A. 주거 제공 건물·상태 계산의 단일 기준

- `NS.BUILDINGS[type].capacity > 0`인 **모든 물리 건물**을 주거 제공 시설로 인정합니다. 기존 회관(+4), 전초기지(+3), 고대 주택(+3), 연립(+5), 집합(+8) 등을 포함합니다. 새 양의 용량 건물도 자동 포함됩니다.
- 건물 종류별 최고 효율이 아니라 건물 **인덱스별** `buildingCondition[i]`로 효율을 계산합니다. 기존 V0.11과 동일하게 상태 **70 이상 효율 1**, 70 미만 **상태/70**을 0–1로 제한합니다. 건물 100% 주택 1개와 상태 0% 주택 1개가 함께 있다면 총 3명분입니다.
- 기존 `src/bootstrap/v034d1.js`의 D1/D1A Settlement CSV 관측, D2 공동 주거 수용량·정책·Housing CSV, D2A 독립 건물 합산 감사에서 기준을 통일합니다.
- **별도 활성 주거 지표**는 과거 V0.10 규칙을 보존합니다(기본 활성 상태 임계치, 회관·기본 주택·전초기지의 별도 임계치). `effectiveCapacity`와 `activeCapacity`는 용도가 다르며 동일 수치로 간주하지 않습니다.

## B. Person/출생·질병·주거 정책의 동일 Settlement 처리

- V0.10/V0.27 계열의 **Person 일일 주거 스트레스·행복 계산**에 하나의 Settlement 거주 인구 및 해당 생활권의 활성/실효 수용량을 사용합니다.
- 실제로 실행되는 **V0.24 `dailyDemography24`** 출생·질병의 주거 점유 계산 및 출생률 조정에 공동 수용량을 적용합니다. 기존 V0.22 이전 연간 경로의 잔존 함수도 호환성 측면에서 수정합니다.
- V0.28 별도 도시화 주거 착공 진입점은 D2의 실제 주거 해결 함수로 위임하여 레거시 타일별 중복 착공을 방지합니다. `outpost` 등 양의 수용량을 가진 물리 주거 프로젝트도 동일 Settlement 착공 대기 판단에 포함합니다.
- 건물은 실제 타일에 건설되고 부대는 기존 타일 단위로 이동합니다. Person의 `homeTileId` / `workTileId` 물리 참조와 실제 시설 슬롯은 유지합니다. **동일 Settlement 자원·시장 재고 풀링은 D3 작업**으로 보류합니다.

## C. 당일 주거 캐시·건설 원인 진단

- `NS.V034D2A.cachedHousing`은 월드별 WeakMap에 Settlement 주거 정보를 저장합니다. 날짜, 국가 주민 Epoch(생사·집 변경), 주민 배열 길이(출생), 실제 Settlement 구성, 건물 종류 및 개별 상태를 캐시 조건으로 확인합니다. 저장 파일에는 포함하지 않습니다.
- 새 `NS.V034D2A.audit(world)`는 D2 현재 수용량, D1 집계와 직접 물리 건물 상태별 합산을 서로 대조합니다. 불일치 시 `PHYSICAL_CAP`, `D1_CROSS_CAP`, `ACTIVE_CAP` 등의 오류를 보고합니다.
- 기존 `READY_FOR_HOUSING`은 실제 건축 성공을 보장하지 않으므로 더 보수적인 `SITE_READY_UNVERIFIED`를 사용합니다. 실제 Settlement 목적의 주택 신축·증축·토지정비 시도 및 성공/실패는 `worldSummary.v034d2aDiagnostics`에 요약됩니다. 자원·Gold·실제 착공 제약까지 전부 완전 예측하는 진단은 아니며, **착공 거절 뒤 불명확한 경우 `START_REJECTED_OTHER`로 보존**합니다. 읽기 전용 감사가 자원을 소비하거나 자동으로 건설을 실행하지 않습니다.

## 보존한 정책과 규격

- **국가 건설 슬롯:** 기본 3, 인구 25/60 이상 각 +1, `ADMINISTRATION`, `ENGINEERING`, `URBANIZATION` 각 +2, 최대 11. 신축·토지정비·개축·특화공사 합산 정책 유지.
- 건물별 건설 노동일·물자·Gold 비용, 지형·광맥·건축 입지, 국경·전쟁, AIProfile 가중치, 식량·물자 물류 그대로 유지.
- Snapshot CSV V2 **1,683열**, D1A Settlement CSV **48열**, D2 Housing CSV **11열**을 유지합니다. 기존 D1A CSV의 타일별 과밀 표시는 관측 참고용이며 D2A 실제 공유 부족은 Housing CSV를 사용합니다.
- 세이브 버전 `V0.34D2A`, 저장키 `village-observer-v034d2a` (현재 버전 저장·불러오기만 지원; 구버전 세이브 마이그레이션 미지원).

## 빌드·검증

```bash
npm run build
npm test
node tests/test-d2a-year.cjs    # 370일 2회 결정론 · 추가 검사
python tests/browser-smoke.py   # Chromium/Playwright 필요
```

원본 C1H JavaScript 165개와 CSS 4개 블록은 보호 SHA-256을 유지합니다. 전용 `src/bootstrap/v034d2a.js`와 `tools/d2-transform.mjs`의 명시적 연결 지점만 추가/수정합니다. Hosted/Standalone 모두 동일한 변환 소스를 사용합니다. 자세한 결과는 `TEST-34D2A.md`를 확인하세요.

**검증 한계:** 통제된 370일 반복주행과 Chrome 계열 PC·모바일 검증은 통과했지만, 실사용자의 60–75년 장기 자연주행·대규모 다중 타일 Settlement·극단적인 전쟁/점령·외부 GitHub Pages HTTP 배포는 아직 검증하지 않았습니다. 실 1–3년 자연주행에서 주거 지표 및 신규 진단을 우선 확인하세요.
