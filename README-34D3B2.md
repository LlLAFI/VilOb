# V0.34D3B2 — Food Flow Accounting & Release Integrity

릴리스: 2026-10-12 · 기준선 V0.34D3B1 · **계측·버전 정합성 패치, 밸런스 수정 없음**

## 무엇이 수정되었나

1. **V24 지역 개척 착공 식량 계측 연결:** 원본 `src/legacy/034.js`의 `startRegionalFrontier24`에서 금고·자재·인력·AI가 실제 착공에 성공한 경우에만, `v.food -= cost.food` 전후의 Settlement 물리 식량 재고 차이를 계측합니다. 2인 개척 10 / 3인 개척 13 식량을 실제 출금 타일에 귀속합니다. Food Flow 기존 `frontierFoodSpent` 합산 항목에 정확히 한 번 추가하고, V20 개척 유지비·사고비 및 V20/V21/Recovery 착공 경로를 다시 집계하지 않습니다.
2. **30일 식량 수지 관측 사전 스냅샷:** V24 차감 전에 실제 국가 영토 내 Settlement별 시작 재고를 확정합니다. 일부 재고가 여러 타일에서 인출되더라도 차감 후 최초 열람으로 인해 개시 재고가 사후 값이 되는 오류를 피합니다. 계산된 비용은 직접 보정하거나 가상 식량으로 메우지 않습니다.
3. **Devlog 계측 개선:** `worldSummary.v034d3b2Audit`에 지역 개척 횟수·비용 요청 합계·실제 지출 합계·차이 건수, `residuals`에 구성 변경 없는 Food Flow 관측 구간의 잔차 유형별 집계를 추가합니다. 양수·음수의 미설명 잔차를 숨기지 않습니다. 48열 CSV 구조를 유지합니다.
4. **빌드 버전 단일화:** `tools/build.mjs`의 릴리스 `VERSION`을 빌드 타이틀·최초 HTML 버전 배지·마지막 부트스트랩 버전·빌드 메타데이터에 사용합니다. 최종 부트스트랩 로딩 후 기존 UI의 `renderHeader()`를 재호출해 과거 D3A 표기가 남는 문제를 수정합니다. 새 세계·저장 불러오기 및 반복 렌더링에도 최신 B2 배지를 표시합니다. Devlog, Snapshot/Settlement/Housing/Economy/Food Flow 다운로드명과 저장 메타데이터도 B2로 변경합니다.
5. **저장 호환:** B2 저장 왕복과 B1 이전 버전의 기존 `NS.World.from` 호환 경로를 유지합니다. B1에서 누락된 과거 Food Flow 수지를 소급해 수정하지 않고 이식 이후 착공부터 계측합니다. `save-validator.html`은 B2에도 13타일/중심 거리 2 검사를 적용합니다.

## 변경하지 않는 요소

- 식량·목재·석재 생산, 자연 회복, 소비, 부패, Gold 금융, 개척민 수·착공비, 확장 판단 및 AIProfile 수치.
- 도로 0.62, Settlement JOIN 1.24 / SPLIT 1.40, 중심거리 2 / 최대 13타일, 주거·시장·군사·Recovery.
- Snapshot V2 1,683열, Food Flow 48열, 기존 Settlement 및 경제·주거 CSV 규격.

## 구현 및 자료

- 기존 C1H 레거시 165 JS + 4 CSS 소스는 **해시 불변**. `tools/d2-transform.mjs`의 검증되는 단일 V24 착공 앵커에만 이벤트 측정 훅을 삽입합니다.
- 새 런타임: `src/bootstrap/v034d3b2.js`, 항상 D3B1 다음 실행. Hosted/Standalone 빌드에 **178개 JS 블록**.
- 단독 HTML: `dist/standalone/index.html` 또는 `index-standalone.html`. GitHub Pages: `dist/hosted/index.html` 및 `dist/hosted/assets/` 전체 또는 프로젝트 루트 `index.html`+`dist/hosted/assets/`.
- 상세 검증: [TEST-34D3B2.md](TEST-34D3B2.md).

## 남은 OPEN

- 이전 D3B1의 68년 자연주행에서 보고된 260개 유효 식량 잔차 전체가 이 패치로 해결됐다고 주장하지 않습니다. V24 비용과 일치하는 반복 잔차는 직접적으로 설명할 수 있지만, 다른 개척 경로·이주·지역 변화 및 기타 물리 차감 경로는 새로운 자연주행을 통해 관측해야 합니다.
- 국가 내부 식량 접근, 작은 Settlement의 기아, 인구 분산, 후반 주거 편중, 25~75년 자연주행은 **D3C/D3D**의 별도 과제입니다.
