# 최신: V0.34G3 — 정착지 원형 확장 + 기아 임박 구호 안정화

상세 변경·검증: [`README-34G3.md`](README-34G3.md), [`TEST-34G3.md`](TEST-34G3.md).

> 최신 버전: **V0.34G2A** — [정착지 식량 보급 공급원 보호 안정화](README-34G2A.md) / [검증 기록](TEST-34G2A.md)

# 현재 배포: V0.34G2

정착지 단위 식량 수요·공급, V27/V28/E2 구호 단일화, 실제 물리 타일 배송 경로. [README-34G2.md](README-34G2.md) / [TEST-34G2.md](TEST-34G2.md).

이전 기준선 G1B: [README-34G1B.md](README-34G1B.md) / [TEST-34G1B.md](TEST-34G1B.md).

# 이전 배포: V0.34G1A

V0.34G1A 상세 설명: [README-34G1A.md](README-34G1A.md) / 검증: [TEST-34G1A.md](TEST-34G1A.md)

## 최신 기준 V0.34G1 (2026-10-16)

타일(Tile)/정착지(Settlement) 한국어 용어 분리 및 E2 긴급 식량 물류 관측 전용 감사. 공동 재고/배급/AI/운송/RNG는 F3 유지. 자세한 사항은 [README-34G1.md](README-34G1.md), [TEST-34G1.md](TEST-34G1.md) 참조.

# Village Observer V0.34F2

현 기준선: **V0.34F2 — Unified Person Lifecycle V1**. 상세 내용은 `README-34F2.md`, 검증은 `TEST-34F2.md` 참조.

> **최신 V0.34F1A1** — F1A Food Flow 52열·식량 이상 13열의 문자열 단위 줄바꿈 출력 버그 수정. 시뮬레이션 수식·RNG 무변경. 큰 세이브를 업로드하지 않고 PC에서 직접 F1↔F1A1 동일 세이브를 검증하는 `benchmark-local.html` 갱신. `README-34F1A1.md` / `TEST-34F1A1.md`.

> **최신 V0.34F1A** — 회계 정합성 패치. 자세한 설명: `README-34F1A.md` / `TEST-34F1A.md`. 모델·RNG는 F1 그대로이며 식량 초과비축/임시 점령 출납 기록만 정합화합니다.

# V0.34F1 최신 개발판 (2026-10-14)

**기아 붕괴 원인 추적 / 후기 SIM 진단.** F0 신진대사 B안의 식량·Health·RNG 공식은 그대로 유지. Settlement별 배급 부족 진단(최신 1,800일), 선택형 60일 SIM+Snapshot 일별 추적, F0↔F1 동일 세이브 A/B 비교를 추가했다. **114년 주행에서 4개국 멸망의 직접 원인 검증은 아직 진행 중이며, PC ×10 150년 SIM/BATCH 1000ms 미만 목표는 미달/미검증**이다.

상세: [README-34F1.md](README-34F1.md) · [TEST-34F1.md](TEST-34F1.md) · [로컬 A/B](benchmark-local.html)

---

# V0.34F0 최신 개발판

Settlement 단위 차등 배급 B안·개인별 신진대사, PC ×10 150년 SIM/BATCH 목표 기록. **최종 성능 목표 달성은 아직 확인되지 않음.** 상세 내용 `README-34F0.md`, 테스트 `TEST-34F0.md`.

---

# 현재 버전: V0.34E-rc5 (2026-10-14)

V0.34E-rc4h를 기반으로 한 내부 실험판. 예열형 로컬 A/B 측정, 3일 주기 Demography/Macro 분리 계측, 단일 노동 판단 범위의 건설 후보 탐색 정리를 포함한다. **추가 전체 SIM 성능 향상은 아직 입증되지 않았다.** 기존 RC4h의 Snapshot 복구·시뮬레이션 결정론을 유지한다.

자세한 내용: [README-34E-rc5.md](README-34E-rc5.md), [TEST-34E-rc5.md](TEST-34E-rc5.md).

---

# V0.34E-rc4h — 결정론 복구 핫픽스 (최신)

RC4에서 F5/F5A Snapshot `attachWorld` 연쇄를 생략해 실제 61년차 세이브에서 주민과 RNG 결과가 달라진 회귀를 복구하기 위해 **RC3와 정확히 동일한 Snapshot 실행 경로**로 복원했습니다. **RC4의 미검증 Snapshot 성능 단축은 철회**했으며 RC4의 3일 주기 관측 도구는 유지합니다. 아직 정식 0.34E가 아닙니다.

[RC4h 패치노트](README-34E-rc4h.md) · [RC4h 검증](TEST-34E-rc4h.md) · [로컬 벤치마크](tools/benchmark-local.html)

**사용자 주의:** 회귀를 포함한 RC4에서 새로 저장한 상태는 이미 결과가 분기됐을 수 있습니다. 되도록 RC4 이전의 61년차 원본 세이브로 시험하세요.

---

# V0.34E-rc4 개발 기준선

V0.34E-rc3 기반 RC4 내부 실험판. F5/F5A Snapshot 중복 초기화 감소, 3일 주기 성능 계측 확장 및 로컬 A/B 도구 기능 추가. 게임 밸런스/자동 Snapshot 주기 유지. **실제 61년차 사용자 저장 상태 전체 SIM 성능 개선율은 아직 미검증.** [상세](README-34E-rc4.md) · [테스트](TEST-34E-rc4.md)

# V0.34E-rc3 개발 실험판 (2026-10-13)

현재 개발 기준선은 **V0.34E-rc3**입니다. 정식 0.34E가 아닙니다. 최신 변경 사항은 [README-34E-rc3.md](README-34E-rc3.md), 검증 내용은 [TEST-34E-rc3.md](TEST-34E-rc3.md)를 참조하세요.

# 최신 실험 버전: V0.34E-rc2

E-02 이벤트 기록 반복 필터 경량화, 고빈도 계측 기본 제외, **브라우저 로컬 61년 세이브 A/B 비교 도구** 추가. Snapshot 빈도 변경은 시뮬레이션 결과 회귀가 검출되어 적용하지 않았습니다. 본 버전은 정식 E 성능 회복 완료가 아닙니다. [README-34E-rc2.md](README-34E-rc2.md) · [TEST-34E-rc2.md](TEST-34E-rc2.md)

---

# 최신 실험 버전: V0.34E-rc1

V0.34D3B3B 다음 E-01 성능 계측 실험판입니다. 게임 밸런스·핵심 연산을 변경하지 않고, **필요할 때만 실행되는 30일 함수별 프로파일러**, **동일 세이브 B3B↔E 성능 A/B 도구**, **레거시·텔레메트리 정적 감사**를 추가했습니다. 전체 성능 회복 패치가 아닙니다. 자세한 사용법: [README-34E-rc1.md](README-34E-rc1.md), 검증 한계: [TEST-34E-rc1.md](TEST-34E-rc1.md).

---

## 최신 버전: V0.34D3B3B (2026-10-13) — Simulation Hotpath Optimization

- 실제 D3 물리 재고 입출고의 **Settlement 멤버십·이전 타일 재고를 D3A Food Flow에 공유**해 중복 조회를 제거. 자원·경제·AI·군사 수식과 계측 정확도 유지.
- 원본 B3A vs B3B 식량 출고 25,000회 중앙값 **약 210ms→117ms**, 해당 경로 시간 **44% 감소**.
- 원본 B3A vs B3B **인구 565명 합성 세계 30일 전체 SIM** 시험에서 처리시간 **약 3.6~4.9% 감소** 및 물리 자원·Food Flow CSV·난수 일치. **60년 자연주행 전체 개선율은 미검증**.
- 169개 보호 레거시 해시 유지, Food Flow 48열·Snapshot 1,683열·B3A 저장 이식, PC/모바일 Hosted/Standalone 확인.
- [상세 패치노트](README-34D3B3B.md) · [검증 기록](TEST-34D3B3B.md)

---

## 최신 버전: V0.34D3B3A (2026-10-13) — Performance & Food Flow Regression Audit

- **신규 `식량 이상 구간 CSV`** 버튼: Food Flow 전체 48열 CSV와 별개로, 종료된 30일 수지 잔차 중 ±0.01 초과 행만 21열로 경량 출력합니다. 국가·정착지·구간·물리 입출고·잔차를 포함합니다.
- Devlog에 잔차 크기별 유형 및 **동일 Formation 반복 목표/전후 제어권 변경 이벤트** 감사값을 추가했습니다. 관측용으로, 미설명 재고 수지를 가상 보정하거나 군사 동작을 변경하지 않습니다.
- B2/B3/B3A 합성 후기 핫패스 시험에서 각각 722.56/187.70/185.45ms. **실제 전체 시뮬레이션 시간 개선율 아님.** B3/B3A 18일 결정론 일치.
- C1H 보호 블록 169개 SHA-256 유지, Snapshot V2 1,683열·Food Flow 48열, Hosted/Standalone·B3 저장 호환.
- [상세 패치노트](README-34D3B3A.md) · [검증 기록](TEST-34D3B3A.md)

---

## 최신 버전: V0.34D3B3 (2026-10-12) — Performance Regression Optimization V1

- D3 공동 재고 구성 타일 조회를 **변경 감지형 멤버십 캐시**로 최적화합니다. 소유권·Settlement 소속·군사 점령 상태가 실제로 변경되면 캐시를 즉시 무효화합니다. 재고·Gold는 전혀 캐시하지 않습니다.
- 식량 비축일 분모는 기존 V26 거주자 인덱스로 필요한 정착지 주민만 계산합니다. 식량 생산·소비·이주·AI·군사·개척 규칙을 변경하지 않습니다.
- D3A 식량 수확·입고의 회계 항목을 동일 30일 행에서 일괄 기록해 불필요한 조회를 줄입니다. Food Flow 48열·Snapshot 1,683열 유지.
- 보호된 C1H 원본 SHA-256 169블록 불변. 기존 B2 저장, PC/모바일 Hosted/Standalone 지원.
- 같은 합성 후기 Settlement(13타일, 주민 256명)의 B2 대비 공동 재고·식량 비축일 조회 벤치마크에서 약 **3.65배** 개선. **전체 66년 자연주행 속도 개선율을 의미하지 않습니다.**
- [상세 패치노트](README-34D3B3.md) · [검증 기록](TEST-34D3B3.md)

---

## 최신 버전: V0.34D3B2 (2026-10-12) — Food Flow Accounting & Release Integrity

V24 지역 개척 착공 시 **2인 10 / 3인 13의 실제 물리 식량 차감**을 기존 Food Flow `frontierFoodSpent`로 누락 없이 계측합니다. 30일 수지 잔차의 분류 정보도 Devlog에 추가하며, **좌상단 버전 배지가 처음부터 V0.34D3B2**로 보이도록 빌드 버전과 일치시킵니다. 경제·개척·Recovery·AI·전쟁 밸런스는 변경하지 않습니다.

- **단독 실행:** `dist/standalone/index.html` 또는 `index-standalone.html`.
- **GitHub Pages:** `dist/hosted/` 전체 배포; 루트 `index.html`은 에셋 디렉터리 필요.
- **스키마·호환:** Snapshot V2 1,683열 · Food Flow 48열 · Settlement 13타일/거리2 · B1 이전 저장 이식.
- **검증:** 실물 V24 2·3인 개척, 30일 잔차 0, PC/모바일 첫 화면 버전 B2, 기존 Node 회귀 PASS. 68~75년 장기 검증과 다른 식량 접근 문제는 OPEN.
- [상세 패치노트](README-34D3B2.md) · [시험 기록](TEST-34D3B2.md)

---

## 최신 버전: V0.34D3B1 (2026-10-12) — Road-Connected Settlement Radius 2

**정착지 통합 최대 5→13타일**, 중심지 왕복 접근비 1.00→1.24, 분할 완충 1.15→1.40으로 확대했습니다. 도로가 정상적으로 이어진 평야·초지에서는 중심에서 거리 2칸의 마름모(1+4+8)를 구성할 수 있습니다. 물리 도로 상태·기술·기존 병합/분할 유예조건은 유지합니다.

기존 정착지에 나중에 도로로 연결할 수 있는 개척 후보에 제한적인 가산점(+14)을 주되 **도로를 공짜로 건설하지 않습니다**. D3B 경제 밸런스, 물리 재고, 식량 회계와 AIProfile은 유지합니다. 저장: D3B1 신규/기존 D3B 이식; Snapshot 1683열 · Food Flow 48열.

- **독립 HTML**: `dist/standalone/index.html` 또는 `index-standalone.html`.
- **GitHub Pages**: `dist/hosted/` 전체 게시. 저장소 루트의 `index.html`은 배포용 에셋 폴더가 필요합니다.
- [D3B1 상세 패치](README-34D3B1.md) · [시험 기록](TEST-34D3B1.md)

---

## 최신 버전: V0.34D3B (2026-10-12) — Early Economic Balance & Recovery Policy V1

초반 목재 자연회복·채집 (+12%), 기초 건축비, 신규 건국 목재(+12), 정상적인 평시 노동 재배치를 조정합니다. 평범한 목재·식량·주거 압박만으로 Recovery/국가 Survival을 발동하지 않으며, **중대한 전쟁 피해와 실제 심각한 기아**에는 기존 복구 안전장치를 유지합니다. 활성 V20/V21 개척은 목재 **2명 16→14 / 3명 18→16**입니다. D3A2 실제 식량 회계와 D3 공동 물리재고는 유지합니다.

- 실행: `dist/standalone/index.html` 또는 `index-standalone.html` (단일 파일), GitHub Pages: `dist/hosted/` 전체.
- 저장: D3B 신규 + D3A2/D3A1/D3A JSON 이식. Snapshot V2 1,683열, Food Flow 48열 유지.
- 회귀: PC/모바일 Chromium, D3B 정책, 실물 식량 및 720일 단기 자연주행 PASS. 25~75년 검증은 미완료.
- [D3B 상세 패치](README-34D3B.md) · [시험 기록](TEST-34D3B.md)

---

## 최신 버전: V0.34D3A2 (2026-10-11)

**Frontier Food Accounting Hotfix:** V20 개척 진행 식량 유지비와 보급 사고의 실제 물리 식량 차감을 기록합니다. Food Flow 30일 CSV는 **48개 고유 열**이며, 기존 수지의 `frontierFoodSpent`에 누적되므로 유지비·사고비를 다시 빼지 않습니다. 개척 및 식량 밸런스는 변경하지 않았습니다.

상세 변경점: [README-34D3A2.md](README-34D3A2.md) / [검증 기록](TEST-34D3A2.md)

# Village Observer V0.34D3A1

최신: **V0.34D3A1 — Food Flow Calendar & Audit Hotfix**. D3A Food Flow 관측을 **실제 30달력일** 기준으로 수정하고, 중복된 CSV 열을 제거했습니다. 고비축 식량 부패와 개척 식량 지출을 **물리 재고 차감 시점**에 별도로 관측하며, Settlement 구성 변경 시 미설명 수지를 확정 판정하지 않습니다. 지형별 식량 회복·농업 효율·주민 소비·부패율·개척 비용은 그대로 유지합니다.

- **독립 실행:** `dist/standalone/index.html` 혹은 `index-standalone.html`
- **GitHub Pages:** `dist/hosted/` 전체 게시 (프로젝트 루트 `index.html`만 다른 폴더로 옮기면 작동하지 않습니다)
- **CSV:** Food Flow **46개 고유 열**; Snapshot V2 1,683열 / Settlement 48열 / Housing 11열 / Economy 24열은 유지
- **저장:** D3A1 전용 저장 키 `village-observer-v034d3a1`; 파일로 내보낸 D3A 세이브는 `NS.World.from`으로 이식 가능하지만, 과거의 실제 약 90일 관측 창은 30일로 쪼개지 않고 초기화됩니다
- **상세:** [README-34D3A1.md](README-34D3A1.md) · [TEST-34D3A1.md](TEST-34D3A1.md)

---

# Village Observer V0.34D3A

최신: **V0.34D3A — Food Supply & Storage Stabilization**. 일반 식량·목재·석재 채취의 창고 미입고분을 자연 원료로 복구하고, Settlement별 30일 Food Flow CSV(45열) 및 실제 원격 인출·일부 물류 반환 진단을 제공합니다. 기본 생산·소비·재생 수치는 변경하지 않습니다. 상세 내용: [README-34D3A.md](README-34D3A.md), 검증: [TEST-34D3A.md](TEST-34D3A.md).

---

# Village Observer V0.34D3 — Settlement Economy Integration V1

**최신 개발 기준선: V0.34D3 (2026-10-11).** 동일 활성 Settlement 안의 여러 타일은 민간 식량·목재·석재·철광석·철·도구 재고, 실제 저장 공간 및 Market Gold 접근을 공동 생활권으로 처리합니다. 재고·건물·군사 이동의 물리 위치는 보존하고, 서로 다른 Settlement 및 국가 간에는 기존 실제 물류·거래를 사용합니다.

- **독립 실행:** `dist/standalone/index.html` (또는 `index-standalone.html`).
- **GitHub Pages용:** 프로젝트 루트 `index.html` + `dist/hosted/assets/` 또는 `dist/hosted/index.html` + 동일 위치의 `assets/`.
- **시장:** 같은 Settlement의 부족률과 가격 신호를 공유하고, 같은 공동경제권 내부에서 자기 자신과 거래하지 않습니다. 기존 Market Gold를 보존적으로 타일 간 이전할 수 있습니다.
- **식량:** 자연회복·농업 채집·주민 소비량은 변경하지 않고, 실제 채집·보관·먹이 공급·입고 거절을 관측합니다. 자연 식량 회복 수치는 **3일 작업주기당**입니다.
- **CSV:** Snapshot V2 1,683열 / Settlement 48열 / Housing 11열 유지, 신규 **Settlement Economy 24열**.
- **저장:** V0.34D3 전용(`village-observer-v034d3`). 이전 D2B 세이브 자동 로딩은 지원하지 않습니다.
- **검증:** `npm run build`, `npm test`, `npm run test:year`, `python tests/browser-d3-smoke.py`; 기본 회귀 및 370일 2회 결정론 PASS, 60~75년 장기 미검증. 과거 고정 시드 정지 이슈는 계속 OPEN.
- **상세:** `README-34D3.md`, `TEST-34D3.md`, `RELEASE-MANIFEST-34D3.json`.

---

# Village Observer V0.34D2B — Civilian Settlement Consistency & Housing Diagnostics

**개발 기준선: V0.34D2B (2026-10-11).** V0.34D2A의 공동 주거 핫픽스에 이어, V0.27 실제 Person 일일 주거 스트레스·행복도, V0.28 통계와 내부 민간 이주 후보를 Settlement 생활권에 연결했습니다.

- **다운로드·실행:** `dist/standalone/index.html` 하나로 독립 실행. GitHub Pages에는 `dist/hosted/index.html`과 `dist/hosted/assets/`를 함께 배포합니다.
- **D2B 핵심:** 같은 Settlement 안의 타일 사이에서는 V0.28 민간 내부 이주를 수행하지 않음. 물리적인 Person 거주 타일·군사 이동·건설 입지는 유지합니다.
- **일일 생활:** V0.27 실제 Person 대사 경로의 주거 스트레스·행복도 주거 비율을 Settlement 공동 주거로 계산합니다.
- **통계:** `housingStrainedResidents28`은 현재 공동 주거 **활성** 수용량 부족 상태를 집계합니다. `housingStrainDays>20`은 별도 D2B Devlog 진단으로 유지하여 과거 누적 스트레스와 구별합니다.
- **착공 진단:** 주택 신축·주거 개축·토지정비 시도별 `byType`, `byBlocker`, 최근 36개 시도를 Devlog `v034d2bHousingDiagnostics`에 제공합니다. 출처가 확인되지 않는 거절은 `UNRESOLVED_*`로 표기합니다.
- **유지:** 건설 슬롯 기본 3~최대 11, 자재·Gold·노동·기술·경제·전쟁 규칙, 기존 1,683열 Snapshot V2·48열 Settlement·11열 Housing CSV 모두 유지.
- **저장:** D2B 버전만 현재 로드 가능. 키 `village-observer-v034d2b`; 이전 세이브 자동 변환은 지원하지 않습니다.
- **기본 시험:** `npm run build`, `npm test`, `python tests/browser-smoke.py`.
- **검증 한계:** 120일 반복 결정론과 기능별 합성 시나리오, PC·모바일 Chromium은 통과. 특정 고정 시드의 1년 이상 자연주행에서 진행 중단이 재현되어 **D2 계열 CLOSED 보류**. 이 현상은 D2A 비교 시험에서도 발견되었으나 원인 및 D2B 고유 영향 여부는 확정하지 못했습니다.
- **범위 제한:** 동일 Settlement 간 물리 이주는 제거하지만, **서로 다른 Settlement 간 기존 타일 기반 식량·서비스·직장 매력도**는 아직 유지됩니다. 완전한 경제 생활권 통합은 D3 예정입니다.

상세: `README-34D2B.md` · 시험: `TEST-34D2B.md` · 릴리스: `RELEASE-MANIFEST-34D2B.json`.

---

# Village Observer V0.34D2A — 주거 계산·생활권 정합성 핫픽스

**현재 기준선: V0.34D2A (2026-10-11).** 회관/전초기지 주거 수용량 누락 및 같은 종류 건물 상태 효율 과대 계산을 수정하고, 실제 V0.24 일일 출생·질병과 Person 주거 스트레스의 Settlement 생활권 기준을 통일했습니다.

- **단독 실행:** `dist/standalone/index.html` 또는 `index-standalone.html`
- **GitHub Pages:** 전체 프로젝트를 GitHub에 업로드하여 `dist/hosted/` 빌드 배포
- **건설 슬롯:** 기본 3, 인구·기술에 따라 최대 11개로 확대된 D2 공식 유지
- **저장:** `V0.34D2A`만 지원, 로컬 키 `village-observer-v034d2a` (이전 D2 세이브 직접 불러오기 미지원)
- **CSV:** Snapshot V2 1,683열 / D1A Settlement 48열 / D2 Housing 11열 유지
- **구현 상세:** `README-34D2A.md` · **시험:** `TEST-34D2A.md`
- **개발:** `npm run build`, `npm test`, 선택적으로 `node tests/test-d2a-year.cjs`, `python tests/browser-smoke.py`
- **검증:** 코드/120일·370일 결정론/PC·모바일 PASS; 사용자 자연주행 60–75년 미검증

---

# Village Observer V0.34D2 — Settlement 생활권 통합 · 건설 슬롯 확대

**현재 기준선: V0.34D2** (2026-10-11). D1A 노동 관측 패치에서 **실제 주거·건설 판단을 변경**합니다.

- **Settlement 생활권:** 같은 Settlement에 속한 타일은 공동 주거 용량과 민간 근무 접근성을 이용합니다. 건물의 지형/입지와 군사 유닛의 타일 이동은 보존합니다. 재고·시장 통합은 D3 예정.
- **건설 슬롯:** 기본 3개, 인구 25/60 각 +1, `ADMINISTRATION`/`ENGINEERING`/`URBANIZATION` 각 +2, 최대 **11개**. 신축·개축·토지 개발·특화 작업을 공통 집계합니다.
- **상세 변경:** `README-34D2.md` · **시험:** `TEST-34D2.md`.
- **실행:** `dist/standalone/index.html` (단일 파일), 또는 전체 프로젝트를 GitHub Pages GitHub Actions로 게시.
- **개발:** `npm run build` / `npm test`; 선택적으로 `python tests/browser-smoke.py`.
- **데이터:** D2 Housing CSV 11열 신규 · D1A Settlement CSV 48열 유지 · Snapshot CSV V2 1,683열 유지.
- **저장:** D2 자체 저장 전용(`village-observer-v034d2`). 이전 버전 세이브 불러오기 미지원.
- **현재 판정:** 구현·기본 회귀시험 PASS, 60~75년 장기 자연주행 미검증.

---

# Village Observer V0.34D1A — Labor Metrics Clarification

**현재 개발·배포 기준선은 V0.34D1A입니다.** 75년 V0.34D1 자연주행에서 발견된 노동 집계 의미 오류를 관측 전용으로 보정했습니다. 경제·고용·Person/AI 의사결정은 변경하지 않았습니다.

- **독립형 게임:** `dist/standalone/index.html` 또는 `index-standalone.html` (단일 HTML).
- **GitHub Pages:** 프로젝트 전체를 GitHub에 게시; `.github/workflows/pages.yml`이 `dist/hosted`를 빌드·배포.
- **원본 개발 소스:** `src/bootstrap/v034d0.js` → `v034d1.js` → **`v034d1a.js`**, 165개 Legacy JS와 4개 CSS는 보호 유지.
- **빌드/검사:** `npm run build` / `npm test`; 선택사항 `python tests/browser-smoke.py`.
- **D1A Settlement CSV:** 기존 32열 + 16개 노동 지표 = **48열**. `assignedJobs`와 `workersAtTile`은 원본 필드 집계로 남아 있으며 실제 고용률을 의미하지 않습니다.
- **기존 Snapshot CSV V2:** 1,683열 유지.
- **저장:** `V0.34D1A` 전용 `village-observer-v034d1a` 키; D1과 구버전 세이브 불러오기 미지원.
- 상세: `README-34D1A.md`, `TEST-34D1A.md`, `SETTLEMENT-AGGREGATE-D1A-SCHEMA.md`.

---

# Village Observer V0.34D1

**새 개발 기준선은 V0.34D1 Settlement Aggregate V1입니다.** 다중 파일 소스/이중 배포는 D0를 유지하고, 최신 정착지 읽기 전용 집계·독립 검산·세부 UI·32열 Settlement CSV를 추가했습니다.

- 독립형 게임: `dist/standalone/index.html` (또는 `index-standalone.html`)
- GitHub Pages: `dist/hosted/index.html` + 동일 폴더의 `assets/`
- 전체 프로젝트: 루트에서 `npm run build`, `npm test`; `.github/workflows/pages.yml`은 `dist/hosted` 배포
- D1 문서: `README-34D1.md`, `TEST-34D1.md`, `SETTLEMENT-AGGREGATE-D1-SCHEMA.md`
- 이전 버전의 세이브 파일 하위 호환은 필수 지원 대상이 아니며, D1의 저장키는 `village-observer-v034d1`입니다.

---

# Village Observer V0.34D0

**Multi-file Foundation & Regression Baseline** · 2026-10-11

V0.34C1H의 게임·AI·군사·경제·Settlement 규칙을 그대로 유지하는 구조 전환 패치입니다. 기존 인라인 JavaScript **165개**, CSS **4개**를 순서가 있는 소스 파일로 보관하고, Node.js의 빌드 스크립트로 두 가지 배포본을 만듭니다.

## 실행

- **다운로드한 단일 HTML 실행:** `dist/standalone/index.html` (또는 `index-standalone.html`) 하나만 사용합니다. 인터넷 연결이나 빌드 작업이 필요하지 않습니다.
- **GitHub Pages:** 저장소의 `.github/workflows/pages.yml`을 사용하려면 GitHub Pages의 배포 소스를 **GitHub Actions**로 설정해야 합니다. Actions는 `dist/hosted/`를 게시합니다. 직접 업로드하려면 `dist/hosted/index.html`과 같은 디렉터리의 `assets/` 폴더를 함께 올립니다.
- 프로젝트 루트의 `index.html`은 **다중 파일 Hosted** 진입점입니다. 반드시 `dist/hosted/assets/`과 같이 배포해야 합니다. 단일 파일 다운로드에는 루트 `index.html` 대신 `dist/standalone/index.html`을 사용하세요.

## 개발

Node.js 18 이상이 필요합니다. 외부 npm 의존성 없이 다음 명령을 실행할 수 있습니다.

```bash
npm run build
npm test
```

소스는 `src/template.html`, `src/manifest.json`, `src/legacy/`, `src/styles/`, `src/bootstrap/`에 있습니다. 패치 코드 **`src/bootstrap/v034d0.js`** 이외에는 원래 C1H 코드 블록을 수정하지 않았습니다. 빌드 도구가 169개 원본 블록을 바이트 단위로 재조립해 SHA-256 해시로 검증합니다.

## CSV V2

게임 Devlog 패널에서 **스냅샷 CSV (Legacy)** 와 **스냅샷 CSV V2**를 따로 선택할 수 있습니다. V2는 기존 1,683개 열, 모든 값, 행 및 열 순서를 유지하면서 서로 중복되던 72개 헤더 이름을 `global.` / `nation.` 접두사로 구분합니다. 전체 위치별 이름 대응은 `src/csv/schema-v2.json`에 있습니다.

## 세이브 정책

D0의 신규 세이브 키는 `village-observer-v034d0`이며, D0 저장·불러오기 및 JSON 내보내기를 지원합니다. **C1H 및 이전 버전 세이브의 하위호환은 릴리스 조건이 아닙니다.** 이전 버전의 플레이를 보존하려면 그 버전의 `index.html`을 보관하세요.

## 검증 상태

- 원본 169개 코드·스타일 블록의 재조립 해시 일치.
- JS 문법 검사 166개 스크립트 통과, CSV 스키마 1,683열 고유화.
- C1H 대비 8일 정밀 계측 ON/OFF 일별 물리 상태·이벤트·RNG 일치.
- 유지보수 정산 직접 3회 × 계측 ON/OFF 상태·RNG 일치.
- Chromium 메모리 로딩에서 PC·모바일 뷰포트 초기화, 121개 패치노트 등록, 세이브 왕복 및 CSV 검증 통과.
- **제한:** 자동화 환경에서 96일 연속 비교는 실행시간 초과로 완료하지 못했고, Hosted 외부 파일의 실제 네트워크 로딩은 브라우저 정책으로 직접 확인하지 못했습니다. 실 GitHub Pages 접속 테스트 및 장기 자연주행은 남은 검증 항목입니다.

상세 정보: `README-34D0.md`, `TEST-34D0.md`, `BUILD-GUIDE.md`, `CSV-SCHEMA-V2.md`.
