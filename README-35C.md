# Village Observer V0.35C — Seasonal & Administrative Hotpath V2

기준선: **V0.35B**. 35B 사용자 91일 계측에서 분기 처리의 추정 Inclusive 시간 8.81초, 내부 물류 용량 8.39초, 행정 모델 7.88초가 관측되었습니다. 이 시간들은 호출 계층 간에 중첩되므로 서로 더할 수 없습니다.

## 이번 릴리스의 실제 변경

1. **신규 `tools/35c-transform.mjs`**: 보호된 `src/legacy/064.js`의 `sameInstitutionD2` 물류 행정권 조회를 대상으로, 방금 반환된 모델의 `byTile` 타일 인덱스와 `regions` 목록을 함께 사용합니다. 지역 허브·코드·타일 포함 여부를 확인한 뒤 매칭되는 지역 객체를 그대로 사용하고, 불완전/모호한 인덱스일 때 기존 `regions.find(r=>r.tiles.includes(...))`로 되돌아갑니다. `NS.V032D.adminModel`은 **매번 종전과 같이 한 번 호출**되며 상태 갱신과 행정권 이벤트는 생략하지 않습니다. 35B의 2회→1회 행정 모델 호출 최적화도 보존합니다.
2. **신규 `src/bootstrap/v035c.js`**: 세계 → 고급 도구에 **「35C · 분기·행정 정밀 추적」** 버튼 세 개(계측 시작, 종료, JSON 저장)를 추가합니다. 기본 OFF. 원래 함수는 계측 종료 시 복원합니다. 원본 보호 레거시 169개 블록은 변경하지 않았습니다.
3. 기존 **V0.34C1B 분기 계층 체크포인트**를 35C에 연결해, 완료된 각 분기의 국가별 21개 역사적 `seasonalTick` 층별 시간과 누적 결과를 JSON으로 내보냅니다. `NS.V032D.adminModel` 공개 API 호출은 실행 문맥별(물류/분기/일일/기타) 횟수·표본시간을 기록합니다. **중요:** 오래된 코드 내부의 렉시컬 `adminModel32D()` 직접 호출은 공개 API 계측에 포함되지 않습니다. 이 호출은 C1B 행정 단계 시간에 일부 포함될 수 있으나 API 호출 횟수에 합쳐서는 안 됩니다.
4. `V0.35C` 버전, JSON 세이브, Devlog 버전, 인게임 패치노트 및 GitHub Pages 배포 경로 반영. 기존 35A·35B 프로파일러도 유지합니다.

## 90년 실세이브 측정 방법

1. **V0.35C**를 실행하고 같은 90년 세이브를 불러옵니다.
2. **세계 → 고급 도구 → 35C · 분기·행정 정밀 추적 → 「35C 계측 시작」**을 누릅니다. 35A/35B의 독립 계측이 켜져 있으면 먼저 종료해야 합니다.
3. 10배속으로 **최소 1분기 경계(90일), 가급적 180~360일**을 진행합니다.
4. **「35C 계측 종료」 → 「35C JSON 저장」**을 클릭하여 `vilob-v035C-season-admin-<연도>y.json`을 저장합니다.
5. 파일을 전달하면 높은 비용의 분기 층 및 행정 조회 원인을 분석해 차기 35D 변경 범위를 결정할 수 있습니다.

프로파일을 활성화한 상태의 게임은 타이머 호출·래퍼·기존 C1B 체크포인트의 추가 비용을 포함합니다. **프로파일 시간으로 최종 SIM 성능 개선율을 주장하지 마세요.** 공식 F0 10배속 SIM/BATCH는 별도 지표입니다.

## 채택 판정과 유보 사항

- 35B↔35C 91일 동일 세이브·동일 난수의 핵심 13개 직렬화 상태와 RNG 비교 **PASS**. 게임 상태와 관계없는 `v34c.counters.totalReviewMs/maxReviewMs` 실행시간 기록만 정규화하여 비교했습니다.
- 35B↔35C 물류 함수 스트레스 96회×3세트 Node VM 중앙값 **12.010ms → 9.927ms(17.35% 단축)**. 물류 수치 체크섬 **1704로 일치**. 단일 합성 세계 측정일 뿐 실제 90년 전체 SIM과 동일한 조건이 아닙니다.
- 35B↔35C 신규 세계 8일×3세트 계측 OFF 전체 SIM: 중앙값 **38.509 → 38.658ms/일(0.39% 느림)**. 세계 상태·RNG 일치. 즉, **전체 SIM 개선은 입증되지 않았습니다**.
- 사용자 90년 실제 Save JSON은 이번 런타임에 없어 90년 무계측 A/B 및 150년×10 목표는 미검증입니다.
- 원래 `adminModel32D`의 상태갱신/조회 **전면 분리**, 글로벌/일일 캐시 적용은 이번 릴리스에서 유보했습니다. 정확성 위험이 있고 상세 병목 정보가 아직 부족합니다.

## 검증과 배포

```bash
npm run build
npm test
node tests/test-35c.cjs
V35C_PARITY_DAYS=91 node tests/test-35c-parity.cjs
H4B_DAYS=1 node tests/test-h4b-parity.cjs
python tools/browser-35c-smoke.py
node tools/microbench-35c.cjs
npm run bench:35c -- --save "<90년-save.json>" --days 30 --warmup 3 --runs 3 --output 35c-ab.json
```

이전 H4B 추가 자연주행 검사는 소요시간이 큰 관계로 기본 `npm test`에서 제외하여 `test:extended`에 포함했습니다. 개별 검사는 별도로 PASS 확인했습니다. 이전 G5 검증의 구버전 하드코딩으로 인한 `verify().ok` 거짓 값을 현재 버전 결함과 혼동하지 않도록 H2A 테스트는 버전과 무관한 기술/구성 무결성만 확인하도록 수정했습니다.

GitHub Desktop: ZIP 전체 소스를 기존 저장소 작업 폴더에 덮어쓰기 → Commit → Push. GitHub Pages는 루트 `index.html`과 `dist/hosted/assets/`, 오프라인은 `index-standalone.html` 또는 `dist/standalone/index.html`을 사용하세요.
