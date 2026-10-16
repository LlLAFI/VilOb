# Village Observer V0.34G2A — 공급원 보호 비축량 안정화

- 기준선: **V0.34G2**, 검증 후 사용자 자연주행 대기.
- 목적: 같은 3일 작업주기에 한 공급 정착지가 여러 곳에 식량을 배송할 때, 최초 계산한 잉여량을 반복 사용하던 G2 결함 수정.
- 원칙: **Tile = 타일 / Settlement = 정착지**. 수요·공급 판단은 정착지 전체, 배송 경로는 실제 타일 쌍. G2의 국가 내 긴급 식량 구호에만 적용.

## 변경 사항

1. 배송 시도마다 공급·수령 정착지의 **실제 D3 공동 식량 재고**와 수령 저장 여유를 새로 읽는다. 후보 검색 후 출고 직전에도 재검증한다.
2. 공급 비축 하한은 G2의 **위기 24작업주기 / 예방 40작업주기**, 최소 식량 8이라는 기존 규칙을 유지한다. `available = max(0, actualStock - max(8,cycleDemand × floor))`을 매 배송 직전 적용한다.
3. 첫 공급원이 보호 하한에 도달하거나 경로/용량/저장 공간으로 배송을 못 하면 다른 정착지 공급원으로 재탐색한다. 한 대상 정착지당 최대 서로 다른 5개 공급원, 한 국가/주기 최대 대상 4개라는 상한을 유지한다.
4. 수령 정착지에 실제 입고된 양을 곧바로 다음 필요량 계산에 반영한다. 한 공급원-수령 정착지 조합은 작업주기당 한 차례만 배송한다.
5. 실제 수송은 원래 G2의 정착지별 공동 재고 출고·입고, 실제 도로·지형 경로 최적 타일 쌍, 저장 용량 및 반환 규칙을 재사용한다. 동일 정착지 내부 배송은 불허.
6. `worldSummary.v034g2a`에 `reserveChecks`, `reserveViolations`, `maxReserveShortfall`, `donorRefreshes`, `receiverRefreshes`, `alternativeDonorsUsed`, `receiversWithMultipleDonors`가 추가되며, 기존 `worldSummary.v034g2`도 현재 G2A 긴급 구호 카운터로 제공한다. G2A 배송 CSV는 공급 전·후 재고, 보호 하한, 잉여량, 배송 후 비축일, 보호 위반 플래그를 포함한 **18열**로 확장되었다.

## 범위 밖·유지 사항

- 공급원 보호 하한 24/40 자체의 하향 조정, 기아 위기 정책 변경은 하지 않음. 카이렌 기아 위기의 상세 원인은 성숙 세이브를 이용해 추가 검증해야 함.
- 정착지 통합·병합(G3 예정), 국제 교역, 국내 상업 거래, 군사, AI 전략, 신진대사(F3)는 수정하지 않음.
- 기존 G2/G1B/G1A/G1/F3 세이브 불러오기 fallback 지원. 새로운 로컬 세이브 키 `village-observer-v034g2a`.
- Devlog와 CSV의 관측 카운터는 저장·불러오기 시 초기화. 런 타임의 300개 최근 배송 행 유지 정책은 동일.

## 빌드·테스트

```bash
npm run build
npm test
node tests/test-g2a-reserve.cjs
node tests/test-g2a-parity.cjs
G2A_DAYS=180 node tests/test-g2a.cjs
python tests/browser-g2a-smoke.py
```

`index-standalone.html` 및 `dist/standalone/index.html`은 단일 파일 실행형, 루트 `index.html`은 GitHub Pages용 다중 파일 빌드다.

### 알려진 검증 범위

- 한 공급원에 25.15작업주기(10명×0.42 = 4.2 식량/주기)가 존재하고 네 정착지가 동시에 지원을 요청할 때, 공급원이 **24주기 보호 하한 100.8**에서 정확히 멈추는 합성 시험 PASS.
- 다른 공급원이 있으면 잔여 식량·경로를 다시 검토해 다음 공급원으로 전환, 동일 정착지 배송 0, 식량 출고·입고 보존, 차단 경로에서 미배송 PASS.
- G2의 3×3/(4,2) 정착지 경계 배송 시나리오 유지, 자연주행 180일의 D3/F2 감사 및 RNG 호출, PC/모바일 Chromium Standalone/Hosted 검사 PASS.
- G2→G2A 동일 저장 상태를 바탕으로 신뢰 가능한 동일 RNG를 재설정한 30/90/180일 **배송 없는 회귀 구간**에서 개인·재고·RNG 일치 PASS.
- **사용자의 성숙한 35~36년차 G2 저장 파일로 180일 재주행한 검증은 아직 수행되지 않음.** 이전 Devlog/CSV만으로 동일 시점의 G2A 반사실 결과를 생성할 수는 없다.
