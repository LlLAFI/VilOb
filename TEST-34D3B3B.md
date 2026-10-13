# V0.34D3B3B 테스트 및 제한사항

## 확인됨

- 빌드 C1H SHA-256: `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` (169 보호 블록 불변).
- Standalone/Hosted 각 **181개 JS**. 물리 회계 Food Flow 48열, Snapshot 1,683열 유지.
- `tests/test-d3b3b.cjs` 인구 약 115명·60일 B3A/B3B 결정론 4지점 PASS; 저장 이식·왕복 PASS.
- 인구 565명·30일 전체 World.advanceOneDay 합성 시나리오: 15/30일 국가별 인구/식량/목재/석재/Gold/영토, 전체 Food Flow CSV, RNG 108,483회가 동일.
- 합성 부하 전체 SIM A/B 한 차례: B3A 3,886.09ms → B3B 3,744.58ms (-3.64%); 다음 독립 반복 B3A 3,762.68ms → B3B 3,578.93ms (-4.88%). CPU 의존적 수치.
- 원본 B3A/B3B 단일 타일 food withdraw 25,000회 중앙값 210.19ms→117.16ms (-44.3%).
- V24 두·세 명 식량 10·13 실제 차감, D3A2 추가 개척 유지비, B1 13타일 병합, B3A Food Flow 이상 추출, B3 멤버십 점령 무효화: 개별 PASS.
- PC·모바일 Chromium, Standalone/Hosted 네 가지 모두 JS 오류 0건, 좌상단, title, 저장, Devlog, 패치노트 버전 `V0.34D3B3B`, 이상 CSV 버튼 1개.

## 미검증·경고

1. 60~80년 실제 인구 600~1,100명 세계에서의 성능 개선 폭은 미측정. 합성 세계 565명은 기술·건물·Settlement·전쟁 복잡도가 다름.
2. 이전 V0.34C1 성능 수준(인구 665명·24ms/일)으로의 회복은 검증되지 않았고 이번 패치의 목표치로 주장하지 않음.
3. 장시간 전체 `npm test`는 시간제한으로 끝까지 완료 확인하지 못함. 완료됐다고 표기하지 않음.
4. Food Flow의 과거 타 시드 잔차가 이번 코드로 전부 해결됐다고 주장하지 않음.
5. 차기 진짜 식량 접근·운송·구호 밸런스는 V0.34D3C에서 개발.

## 재현 명령

```bash
npm run build
node tests/test-build.mjs
node tests/test-d3b3b.cjs
VILOB_HEAVY=1 node tests/test-d3b3b.cjs
node tests/bench-stock-b3b.cjs
python tests/browser-d3b3b-smoke.py
```
