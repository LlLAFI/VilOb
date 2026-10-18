# Village Observer V0.34G5 — Specialized Labor & Field Recovery

- 기준선: V0.34G4A1 (통계 드롭다운 UI 수정 + G4A 식량·허기 밸런스 포함)
- 구현: 신규 기술 4개, 총 43개. 신규 직업·건물·무상 물자·군사 Person 생성 없음.
- 배포: 저장소 루트 `index.html`은 GitHub Pages용, `dist/standalone/index.html`은 오프라인 단독 실행용. `dist/hosted/index.html`과 `dist/hosted/assets/`로 서브디렉터리 호스팅 가능.
- 저장파일: V0.34G4A1 및 기존 G4/G3B 저장을 G5 엔진으로 로드하고 G5 형식으로 저장 가능. 이전 버전에서 생성한 게임 세계는 별도로 업데이트하지 않아도 됨.

## 추가 기술

| 내부 ID | 명칭 | 비용 | 선행 기술 | 효과 |
|---|---|---:|---|---|
| `INTENSIVE_FARMING` | 집약 농법 | 700 | 수리공학 + 곡물 저장·보존 | **실제 농부** 식량 산출 기본 생산배율 +0.12 합연산 |
| `MINING_TECHNIQUES` | 채굴 공법 | 700 | 철광 채굴 + 공학 | 실제 광부 석재 산출배율 +0.12, 철광산 채굴 목표량의 도구 계수에 +0.12 합연산 |
| `SYSTEMATIC_RESEARCH` | 체계적 연구법 | 850 | 학당 + 교육제도 | **실제 학당 학자** Knowledge 직업 생산계수 1.20→1.35. 국가 전체 Knowledge 계수는 별개로 유지 |
| `FIELD_REORGANIZATION` | 야전 재편술 | 750 | 군수 행정 + 관료제 | **Formation** 전투 후 사기 회복속도 +20%, 신규 REGROUPING 및 POST_BATTLE_RECOVERY 대기 약 15% 단축 |

`REGROUPING`/`POST_BATTLE_RECOVERY`는 각각 **회복 시점에 신규로 설정될 때** 적용한다. 세이브에 이미 설정되어 있던 대기시간을 소급 변경하지 않는다. 사망·부상·장비 유실·회수, Person의 Wounded 회복, Formation 전투력과 기초 군사 이동속도는 그대로 유지한다.

석재는 기존 D3A의 자연 원료 채취→생산배율→물리 입고→거절량만 원료 환원 경로를 사용한다. 철광산도 기존 채굴·자연 광맥 감소·물리 창고 한도·저장 거부 시 원료 환원을 유지한다. 채집꾼·사냥꾼·목수·철공·기타 직업은 생산보너스 대상이 아니다. 도로 기술(0.62/0.49/0.32), 신규 정착지의 왕복 1일 병합 규칙, 기존 정착지 분할·공동재고 정책은 G4A1 그대로.

## 테스트

- `node tools/build.mjs`: 원본 C1H 레거시 169개 블록 SHA 보호, 독립/호스팅 빌드, CSV Schema 1683열 검사.
- `node tests/test-g5.cjs`: 신규 기술 43개·연구 분기·직업 생산·실제 농부 식량/석재 광부 입고/철광산 작업/학자 Knowledge·Formation 대기계수·G4A1 저장 마이그레이션·180일 자연주행·물리 감사.
- `G5_DAYS=360 node tests/test-g5.cjs`: 360일 자연주행·30일 간격 무결성 회귀.
- `python tests/browser-g5-stats.py`: Chromium PC 1440×900 / 모바일 390×844 × Hosted·Standalone 네 조합, 열린 통계 드롭다운 DOM 변형 0회 확인.
- `python tests/browser-g5-local.py`: 브라우저 로컬 검증기로 이전 저장파일을 G5 엔진으로 불러와 30일 검사 후 JSON/CSV 다운로드.

통제 시험에서는 **기술이 있는 경우의 계산식**과 실제 작업 경로를 검증했다. 360일 신규 자연주행은 고급 기술 획득을 관찰하기에는 짧아 G5 기술 자연 획득과 전쟁의 장기 밸런스에 대한 증거가 아니다. 기존 59년 세계를 활용해 후기 AI 연구 및 Formations 실제 전투를 추가 관찰해야 한다.

`npm test`의 역사적 전체 결합 테스트는 특히 G3 장기 시뮬레이션 때문에 환경별 시간 제한에 걸릴 수 있다. 사용자가 즉시 실행할 핵심 검증은 위의 `test-g5.cjs` 및 브라우저 2종이다. **G4A1↔G5 90일 엄격 RNG 일치 검사는 통과 결과로 간주하지 않았다.** 동일 G4A1 엔진을 두 VM에서 실행한 대조군에서도 RNG 흐름이 달라지는 문제를 확인했기 때문이다.

## 배포

GitHub Pages에서 기존 저장소 파일을 새 ZIP의 같은 경로로 교체한 후 `index.html`을 연다. 오프라인으로는 `index-standalone.html` 또는 `dist/standalone/index.html`을 바로 연다. 대용량 원본 세이브는 `local-validator-g5.html`에서 브라우저 내부에서 불러와 진단 JSON/CSV를 내보낼 수 있다.
