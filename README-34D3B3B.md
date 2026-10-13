# Village Observer V0.34D3B3B — Simulation Hotpath Optimization

기준: V0.34D3B3A (2026-10-13). **식량/자원 출납 한 번에 한 번의 Settlement 소속 확인**과 Food Flow 관측을 수행하도록 비보호 D3/D3A 부트스트랩을 수정했다. 원본 C1H 레거시 169블록은 바이트 수준으로 변경하지 않았다.

## 수정 사항

1. `src/bootstrap/v034d3.js`의 공유 실물 재고 `withdrawAt()`·`depositAt()`에서 **한 번 판별한 Settlement 구성(`members`)**, 출납 전 물리 재고 또는 빈 저장공간을 관측 함수에 바로 전달한다.
2. `src/bootstrap/v034d3a.js`는 `NS.V034D3A.observeWithdrawFast`·`observeDepositFast`로 동일 출납 내부에서 회계 항목을 기록한다. 기존 D3A 래퍼가 재호출하던 `members()`, 물리 재고/저장용량 계산을 제거하고 다수 회계 항목을 한 번에 기록한다.
3. 회계 행(`rowWithMembership`)에도 이미 확보한 멤버십을 전달하여 같은 30일 구간의 Settlement 조회를 중복하지 않는다.
4. 버전, 저장, Devlog, CSV 파일명, 최초 화면, 패치노트를 V0.34D3B3B로 통일하고 B3A 저장을 불러올 수 있게 했다. B3A의 식량 이상 구간 CSV·Formation 감사와 48열 Food Flow, Snapshot V2 1,683열은 그대로다.

## 변경하지 않은 항목

- 생산·소비량, 식량/Gold/목재/석재 보존 규칙, 물리적 타일 재고, Settlement 구성, AI 결정·전쟁·개척 비용
- 원래 D3 입출고 순서, D3A 실제 식량 보존과 30일 회계 수식, B3A 진단 범위
- 개발자 프로파일링 기본 OFF 원칙

## 성능 측정 — 구분해서 읽기

| 비교 | B3A | B3B | 결과 |
|---|---:|---:|---|
| 단일 타일 식량 출고 25,000회 중앙값 | 약 210.19ms | 약 117.16ms | **44.3% 단축** |
| 전체 `World.advanceOneDay()`·인구 565명 합성 세계 30일 | 3,886ms | 3,745ms | **3.64% 단축** |
| 독립적 반복 합성 테스트(565명, 30일) | 3,763ms | 3,579ms | **4.88% 단축** |
| 115~116명 초기 세계 60일 반복 | 2,898ms | 2,829ms | **2.39% 단축** |

수치는 동일 VM 환경에서 두 버전의 **동일 초기 상태·난수**를 진행한 테스트에 한정된다. 시간은 실험의 노이즈, 메모리 회수, CPU 상황에 영향을 받는다. 인구 565명을 가상으로 추가한 세계는 **실제 60년차 Settlement·기술·물류 복잡도를 재현하지 않으므로**, 과거 PC 60년차 108ms/일 수치의 개선율이라고 주장할 수 없다.

## 검증

- B3A 원본 단독 HTML을 고정된 fixture로 포함했다: `tests/fixtures/v034D3B3A-index.html`.
- `node tests/test-d3b3b.cjs` — 60일 동일 세계, 15일마다 나라별 자원·인구/영토, 30일 식량 CSV **문자 단위 동일**, RNG 횟수 일치; B3A 저장 읽기/B3B 왕복 PASS.
- `VILOB_HEAVY=1 node tests/test-d3b3b.cjs` — 주민 565명 합성 부하, 30일 자원·회계·RNG 일치 PASS.
- 개척 식량 비용 10/13, 13타일 도로 Settlement 병합, D3A·D3A2 회계, D3B3A 진단 PASS.
- Chromium PC/모바일 × Standalone/Hosted 4조합 JS 오류 0건, 초기 버전·저장 왕복·48/1,683열 PASS.
- 전체 장시간 `npm test`는 실행 제한시간으로 완료 확인하지 못했다. 60~80년 동일 실물 저장파일 A/B 및 전체 자연주행 비교는 미검증.

## 사용법

- 개인 PC/태블릿: `index-standalone.html` 혹은 `dist/standalone/index.html`을 열어 사용.
- GitHub Pages: `dist/hosted/` 전체 폴더를 배포. 루트 `index.html`은 에셋 경로를 함께 배포해야 함.
- 기존 V0.34D3B3A 저장 JSON은 불러오지만, 이전 버전에서 새 저장파일을 역으로 불러오는 호환성은 보장하지 않음.

**후속 과제:** 인구 600명대의 실제 후반 저장파일을 같은 PC·동일 실행 환경에서 B3A와 B3B 양쪽에 불러와 World.advanceOneDay의 구간별 시간과 `SIM/Wall`을 직접 대조. D3C 물류 규칙 확장 이전에 이 추가 실험이 필요하다.
