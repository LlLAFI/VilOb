# Village Observer V0.35D — Society18 Hotpath Optimization

기준: **V0.35C** (2026-10-21). 35C에서 사용자가 보내준 451일·6분기 진단은 `society18` 7,882.3ms / 분기 합계 16,370.7ms(48.15%)를 확인했습니다. `society18`은 단일 문화 함수가 아닌 여러 초기 사회·경제·AI·시장·회복 함수의 묶음입니다.

## 패치 범위

1. **정착지 개발 수요: 최근 거래 인덱스 V1** — 변경하지 않은 원본 `src/legacy/025.js`를 `tools/35d-transform.mjs` 빌드 단계에서 변환합니다. `demandDevelopment()`가 3개 이상의 영토·8개 이상의 거래 기록을 가진 경우 해당 작업 내에서만 최근 120일 거래를 `Map<tileId, {qty,count}>`로 한 번 집계합니다. 각 거래의 구매/판매 타일을 기록하고, 양쪽이 같은 타일이면 단 1회만 집계하여 기존 `buyerTileId === tileId || sellerTileId === tileId` semantics를 보존합니다. 국가의 거래 기록, 날짜, AI 순서, 가격은 수정하지 않습니다. `buildHouse()` 및 일반 UI 압력 조회는 기존 로직 그대로입니다. 작업 종료 후 인덱스는 폐기됩니다(전역/일일 캐시 없음).
2. **시장가격 생산이력 단일 순회** — `localTargetPrice()`에서 각각 전체 `productionDaily`를 훑던 30일 및 120일 집계를 하나의 날짜순 스캔으로 통합하되, **각 기간 내부 합산 순서를 유지**합니다. 기간별 분모, 가중치, 가격 공식, 반올림, RNG는 그대로입니다.
3. **35D 사회·경제 상세 계측** — 새 `src/bootstrap/v035d.js`에서 세계 → 고급 도구 → `35D · 사회·경제 분기 상세 계측`을 제공합니다. 계측 시작 / 종료 / JSON 저장. 기본 OFF이며 분기 실행 안에서만 특정 내부 함수 9개를 포괄 시간·직접 시간·P95·최대·횟수로 계측합니다. 기존 C1B 21계층 체크포인트도 함께 수집합니다. 종료하면 런타임 계측 래퍼 및 C1B 활성화를 원래대로 돌립니다. AI·자원·전쟁·RNG 결과에 영향을 주지 않습니다.
4. **릴리스** — `V0.35D`, Devlog/Save 버전, 새로운 로컬저장 키(`village-observer-v035d`), 기존 버전 세이브 읽기 호환, 패치노트, Hosted + Standalone 포함. 구 버전 프로파일러는 유지합니다.

`35D` 하위 시간 항목: `demandDevelopment`, `settlementPressure`, `tradeVolumeLookup`, `localTargetPrice`, `recoveryProfile`, `updateRecovery`, `foodSpoilage`, `concernEvents`, `festivalDecision`. **이 목록은 전체 `society18`의 완전한 함수 목록이 아니므로**, 측정되지 않은 차액을 자동으로 특정 함수에 귀속시키면 안 됩니다. 포괄 시간은 계층 간 중복되며 직접(exclusive) 시간도 *계측된 하위 함수*만 뺀 값입니다.

## 90년 세이브 사용법

V0.35D로 기존 세이브를 로드 → 세계 탭 → 고급 도구 → **35D 계측 시작** → 10배속 **180~360일** 자연주행 → **35D 계측 종료 → 35D JSON 저장**. 파일 `vilob-v035D-society-<year>y.json`을 다음 세션에 제공하면 하위 9개 기능과 기존 21개 계층의 병목을 함께 분석할 수 있습니다. 35A~35C의 다른 계측을 동시에 시작하면 35D는 시작을 거부합니다.

## 성능/검증 요약

- `npm test`: **PASS (exit 0)**. 169 보호 레거시 원본 SHA 유지, 165 JS+4 CSS, 43 기술, CSV 1,683열.
- `V35D_PARITY_DAYS=91 node tests/test-35d-parity.cjs`: 일반 및 거래이력 강화 시나리오 **각각 35C↔35D, 계측 OFF/ON 상태 13개 핵심 직렬화 영역·RNG 일치**. 런타임 측정값 두 개만 정규화.
- 기존 H4C 석재 과잉 이동·국가 경계·저장시스템 테스트 PASS. Hosted/Standalone × PC/모바일 Chromium 4/4 PASS.
- 시장 생산이력 합성 스트레스: 360행 생산이력, 매 실행 420회 강제 가격 갱신, 5회 반복 중앙값 **35C 385.916ms → 35D 236.738ms (38.66% 단축)**, 가격 누적 체크섬 및 최종 가격 수치 일치.
- 신규 19×19 세계 계측 OFF 단기 `World.advanceOneDay`: 4일×3회 중앙값 **35C 43.5032ms/일 → 35D 40.2542ms/일 (7.47% 단축)**. 세계 시작/종료 상태·RNG 동일. **단기 합성 세계이며 사용자의 90년 또는 150년 실사용 성능을 대표하지 않습니다.**
- 사용자 90년 세이브 본문은 제공되지 않아 90년 무계측 동일세이브 A/B와 F0 10배속 SIM/BATCH 1,000ms 목표 판정은 **미검증**.
- 이번 버전에서 `recoveryProfile`, 외교, 축제, 군사 로직 자체를 최적화했다는 주장은 하지 않습니다. 이 부분은 계측만 추가했습니다. 전역 행정 캐시·행정 읽기/쓰기 분리 또한 유보했습니다.

## 개발 명령

```bash
npm run build
npm test
npm run test:35d
V35D_PARITY_DAYS=91 node tests/test-35d-parity.cjs
node tools/microbench-35d.cjs
python tools/browser-35d-smoke.py
npm run bench:35d -- --save "<90y-save.json>" --days 30 --warmup 3 --runs 3 --output 35d-ab.json
```

GitHub Desktop: ZIP의 파일을 전체 복사해 기존 저장소 작업 폴더 덮어쓰기 → Commit → Push. GitHub Pages 루트 `index.html`, 오프라인 `index-standalone.html`, `dist/standalone/index.html`.

### 2026-10-21 · 초기 버전 표시 UI 수정본 (V0.35D 유지)
- 최초 실행 화면의 좌상단 버전 배지가 `V0.35B`로 남아 있다가 화면 재렌더링 시 `V0.35D`로 바뀌는 문제를 수정했습니다.
- 원인: 이전 35B 부트스트랩에서 배지를 먼저 갱신하지만 35D에서는 `renderHeader()` 호출 시에만 덮어썼습니다.
- `src/bootstrap/v035d.js` 부트스트랩의 마지막에 초기 `document.title` 및 `#versionBadge`를 35D로 즉시 동기화했습니다. Hosted 최신 코드가 재로드되도록 스크립트 URL에 전용 캐시 식별자를 부여했습니다.
- 기존 세계 시뮬레이션, 저장 버전 `V0.35D`, RNG, 패치노트, CSV, 분기 계측, 게임 밸런스는 변경하지 않았습니다.
- Standalone/Hosted × PC/모바일의 최초 화면, 렌더 이후 배지, 엔진·세이브 버전 검사 4/4 PASS.
