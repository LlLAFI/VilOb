# Village Observer V0.34F1A1 — CSV Export & Local Parity Stabilization

**기준선:** V0.34F1A  · **일자:** 2026-10-15  · **분류:** 관측/도구 회귀 핫픽스

## 이번에 고친 문제

F1A에서 새로 작성한 Food Flow CSV 내보내기 함수는 `...rows.map(...).join('\n')` 형태로, 완성된 전체 CSV 문자열을 배열에 펼쳐 **데이터 한 글자마다 줄바꿈**이 발생했다. `식량 이상 CSV`도 같은 문제가 있었다. 실제 게임의 식량 흐름 자체가 아니라 **출력 문자열 조합 오류**다.

- 신규 `src/bootstrap/v034f1a1.js`가 기존 F1A의 계산/행 생성 `V034F1A.enrich(w)`와 `V034F1A.anomalies(w)`를 **그대로 재사용**하여 각각 52열/13열 CSV를 다시 조립한다.
- **헤더 1행 + 데이터 1행당 CSV 1행**, UTF-8 BOM과 CRLF, 쉼표·큰따옴표·실제 줄바꿈이 포함된 값의 CSV quoting 지원.
- 신규 내보내기 이름 `village-observer-v034F1A1-foodflow-...csv`, `village-observer-v034F1A1-food-anomalies-...csv`.
- `F1_LEGACY`/`MIXED`/`F1A` 회계 시대, 레거시 초과비축 계측 및 점령 장부 귀속 규칙은 그대로 둔다. 데이터의 `accountingEra` 값도 F1A 그대로 유지한다. F1A1은 별도 회계 변경 시대가 아니다.

## 세계 결과 불변

- Person 신진대사, 식량 소비량, 물리 재고, 건강, Hunger, 기아·자연사, AI, 전쟁, 정착지·기술·RNG 관련 **시뮬레이션 연산을 수정하지 않음**.
- F1A 저장파일의 불러오기 지원, 기존 F1·F0 가져오기 경로 유지. 새 F1A1 세이브 버전 문자열과 로컬 저장 슬롯만 업데이트.
- 보호 레거시 소스 169개 / Snapshot CSV V2 1,683열 / 기존 F1A Food Flow 52열 계산 의미 유지.

## 35년 세이브를 업로드하지 않는 동등성 검증 방법

[benchmark-local.html](benchmark-local.html)을 PC 브라우저에서 열어 다음 파일 **3개**만 선택한다.

1. 기존 **35년 F1 세이브** (압축을 푼 원본 `.json`; 크기 제한으로 ChatGPT에 업로드하지 않음).
2. **기준 F1 `index-F1-baseline.html`**.
3. **후보 F1A1 `index.html`** (독립 실행판).

기본값 **60일 / 각 1회 / 예열 0일**로 시작하고, 통과하면 180일과 2회 교차 반복을 선택할 수 있다. 도구는 실제 HTML 버전, RNG 호출 수, 생존 인구, 세계 상태 지문, SIM/일·Snapshot 시간 등을 비교한다. **도구에서 `결과 JSON 저장`을 눌러 생성된 작은 `vilob-F1A1-local-parity.json`만 공유**하면 된다. 저장 세계의 Person 정보는 출력하지 않는다. 세이브와 HTML은 브라우저 메모리에서만 읽고 외부 전송하지 않는다.

도구의 정량 성능 비교에는 브라우저/GC/JIT 측정 편차가 존재한다. 지문은 중요한 세계 속성에 대한 비암호학적 해시이므로 모든 상태의 수학적 증명은 아니다. 실제 ×10 SIM/BATCH는 **인게임에서 별도로 측정**해야 한다.

## 검증 요약

- `npm run test:static`: PASS (186 script blocks, 1,683열 Snapshot schema).
- F1↔F1A 동일 시드 90일 및 F1A↔F1A1 동일 시드 90일 세계/RNG 비교: PASS.
- Food Flow 52열 / 이상 목록 13열, 정상 행 수 및 CSV 특수문자 직렬화: PASS.
- F1A/F1A1 세이브 가져오기·D3 물리재고 감사·점령 장부 시험: PASS.
- Chromium PC(1440×900), 모바일(390×844) 초기화 JS 오류 0.
- 실제 브라우저 **F1 파일·F1A1 파일·약 1.1MB 합성 F1 세이브 선택 후 30일 로컬 A/B 실행 및 JSON 다운로드**: RNG·인구·세계 지문 일치 PASS.

### 아직 검증하지 않은 것

- 사용자가 보유한 실제 **35년 F1 세이브**에서 60년까지 동일한 역사로 재생되는지: 세이브를 업로드받지 못했으므로 미검증. 이 이유로 로컬 검증 도구 제공.
- 이전 F1A 60년에서 벨른·에브 멸망이 F1과 달라진 원인: 미확정.
- F1A의 에브 초과비축 81건·키오 임시점령 24건의 실제 자연재현: 해당 두 경로가 재주행에서는 발동하지 않았으므로 독립 재현 필요.
- 150년 PC ×10 SIM/BATCH 1000ms 미만 목표: 별도 장기 주행 필요.

## 빌드

```
npm run build
npm run test:static
F1A1_DAYS=180 node tests/test-f1a1.cjs
```

구버전 F1A1을 포함하지 않는 세이브는 직접 고쳐서 생성하지 않으며, 세이브 내용을 ChatGPT에 제출할 필요 없다.
