# Village Observer V0.34F3 — Health & Happiness Lifecycle V2

기준선: **V0.34F2**. F2의 3일 실행 순서인 `work → pooled ration → one Person metabolism` 및 매 달력일의 12일 기아 사망 유예는 **그대로 보존**한다.

## 패치 내용

### 1. Health: 하나의 영양 손실
- 기존: `(1 - rationRatio) + (Hunger > 80 ? 0.65 : 0)`를 함께 차감.
- F3: `nutritionLoss = max(1 - rationRatio, 0.65 × clamp((Hunger - 60) / 40, 0, 1))`.
- `Hunger`는 **해당 주기 배급을 받은 뒤의 값**이고, 건강 손실은 주기마다 한 번 적용한다.
- 당일 부족률 및 축적된 굶주림 영향 중 **더 큰 위험 하나만** 적용한다. 예전 80 경계에서의 계단형 페널티를 제거했다.
- Health 자연 회복 `(82 - Health) × 0.002`, 고령 페널티, 위생 기술 효과, 주거 스트레스 Health 페널티는 보존한다.
- 이 공식은 굶주림이 가벼울 때의 Health 손실을 줄일 수도 있고, 충분히 배급받아도 오래 누적된 높은 Hunger가 남아 있을 때 Health 손실을 만들 수도 있는 **실질 밸런스 변경**이다.

### 2. Happiness: 단일 목표와 단일 회귀
- 이전: 행복도 65 회귀 + 하루 부족량 차감 + 환경 목표 회귀 + 축제 회귀가 순차 적용.
- F3: `Happiness += 0.016 × (target - Happiness)` **한 번만** 수행.
- 단일 목표값:
  ```
  target = clamp(54
    + 0.18 × (50 - Hunger)
    + 0.10 × (Health - 60)
    + 0.07 × (Energy - 55)
    - 8 × housingStress
    - (housingStrainDays > 20 ? 4 × housingStress : 0)
    - 8 × (1 - rationRatio)
    + festivalBonus, 15, 95)
  festivalBonus = 축제 개최 Settlement 안이면 8, 그 외 축제 중이면 3, 아니면 0
  ```
- 기존의 주거 스트레스에 의한 직접 Happiness 차감도 목표값으로 이관했다. 주거 스트레스의 Energy/Health 영향은 유지한다.
- 54/0.016 등의 새 수치는 **초기 설계값**이며, 15~60년 자연주행에서 실제 분포를 본 뒤 조정할 수 있다.

### 3. Health=0 질병 위험 수정
- 기존 `Number(p.health || 30)`은 Health가 정확히 0일 때 30으로 처리되는 오류가 있었다.
- F3는 `NS.V034F3.illnessHealthFactor(p.health)`에서 0을 실제 건강도 0으로 취급하고, 결측·비정상 입력만 기본 30으로 취급한다.
- 원래 질병 위험 공식 `1 + max(0,30 - Health) × 0.012`를 보존한다. Health=0의 배율은 1.36 (기존 오류 시 1.0).
- Health=0 자체가 즉사 조건은 아니다. Food/Hunger/Health의 기존 일일 기아 판정 규칙도 그대로다.

## 변경하지 않은 내용
- F0/F2 식량 수요(0.30/0.42), 군인 1.09배, Settlement 단위 실제 재고 출납, 배급 정책·우선순위
- Hunger 증가·감소식과 Energy 소모·충전
- F2의 작업 → 배급 → 1회 신진대사 및 달력일 기아 판정
- 전투, 장비, 병력, AI, 연구, Gold 회계, 사회·이주·출산의 **의사결정 수식**
- Health 저하에 따른 신규 생산력/노동효율 페널티는 **도입하지 않음**
- 기존 Snapshot CSV V2 1,683열과 Food Flow CSV 52열 규격

## 구조와 배포
- `src/bootstrap/v034f3.js`: 신규 영양 손실·단일 행복 목표·질병 건강 배율, F3 세이브/로드·메타데이터·패치노트.
- `tools/f3-transform.mjs`: 불변 기존 소스는 수정하지 않고, 빌드 산출물에서 `src/bootstrap/v034f0.js`와 보호된 `src/legacy/034.js` 호출부만 교체한다. 앵커가 일치하지 않으면 빌드 실패.
- `tools/build.mjs`: F3 부트스트랩 및 Hosted/Standalone 산출물 포함.
- `tests/test-f3.cjs`, `tests/browser-f3-smoke.py`: F3 단위·반복·브라우저 테스트.
- 실행: `dist/standalone/index.html` 또는 `index-standalone.html`.
- GitHub Pages 배포: 루트 `index.html`과 `dist/hosted/assets/`를 함께 유지.
- 빌드: `npm run build`; 정적·시뮬레이션 회귀: `npm test`.
- 브라우저 검사: `python tests/browser-f3-smoke.py` (Python Playwright·Chromium 필요).
- 로컬 저장 키: `village-observer-v034f3`. 이전 F2/F1A1 저장 키에서 자동 읽기 가능. 기존 F2 세이브 원본은 별도 보관 추천.

## 후속 검증
1. 15~30년 및 60년 장기 자연주행에서 Hunger·Health·Happiness 분포와 출산/사망 변화 확인.
2. F2에서 47년경 멸망한 카이렌의 장기 식량 위기를 **독립적인 원인 분석**으로 추적. 본 패치가 식량 생산/물류 문제를 해결했다고 주장하지 않음.
3. 전상자·기아·Housing F3 경계 사례를 추가 자연전쟁 실험으로 검증.
4. PC 성능 목표는 태블릿 ×10 SIM/BATCH 수치와 별도로 비교. 150년 PC 1,000ms 목표 미검증.
5. F1A1 때부터 존재했던 일부 Food Flow 30일 경계 보존식 동량 ±잔차는 별도 관측 과제.

F2 ↔ F3의 RNG·인구·세계 결과 동일성은 모델 수식 변경으로 인해 요구하지 않는다. F3 내부 동일 시드 결정론과 물리 회계·일일 실행 규칙의 일관성을 검증한다.
