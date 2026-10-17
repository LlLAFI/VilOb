# Village Observer V0.34G4 — Transportation Network & Agricultural Engineering

**기준선:** V0.34G3B (1일 병합 상한 통과, 구세이브 기존 정착지 보호)

## 신규 기술 3종 (36 → 39)

| ID | 기술명 | 연구비 | 선행 기술 | 효과 |
|---|---|---:|---|---|
| `ROAD_IMPROVEMENT` | 도로 개량술 | 650 Knowledge | `ROADS` + `ENGINEERING` | 실제 도로의 민간 경로 계수 **0.49** |
| `POSTAL_NETWORK` | 역참 제도 | 850 Knowledge | `ROAD_IMPROVEMENT` + `BUREAUCRACY` + `FRONTIER_LOGISTICS` | 실제 도로의 민간 경로 계수 **0.32** |
| `HYDRAULIC_ENGINEERING` | 수리공학 | 650 Knowledge | `IRRIGATION` + `ENGINEERING` | 가동 농업시설의 기본 자연 식량 재생 +**10%p** (합연산) |

기본 `ROADS` 계수 **0.62**는 유지. 상위 기술은 계수에 더 곱하지 않고 **0.62 → 0.49 → 0.32로 대체**한다. 물리 도로 없는 타일에는 이 기술로 인한 할인 없음. 공간 병합은 G3B의 **양방향 중심↔전 구성 타일 1.00 이하** 필수 기준이 그대로 적용된다.

### 수리공학

- 자연 식량 재생량의 **기본 지형값 × 0.10 × 농업시설의 실제 가동 효율**을 추가한다.
- 고대 경작지(`farmstead`) 기존 +35% → +45%p, 고대 농장(`ancient_farm`) 기존 +60% → +70%p(시설 정상 가동 기준).
- 같은 타일의 농업시설은 가장 유효한 시설 기준으로 한 번만 추가 보너스를 부여한다.
- 건물 상태 70 이상 완전 가동, 0~70 구간 상태 비례. 시설 부재 또는 미가동이면 0.
- 자연 자원 저장 상한은 유지. Person 직업별 채취량, Gold, 소비, 사망, 군사 공식에는 별도 보너스를 추가하지 않는다.

### 경로 정합성

- `NS.V034G4.spatialStep(w,t)`: G3/G3B 정착지 병합·공간 감사·C1H 경로의 동일 실제 도로 기준(상태 25 이상).
- `NS.V034G4.civilianRoadFactor(w,t,e)`: 일반 민간 물류 및 국제 육상 교역의 기존 도로 상태 점진적 효과를 보존하면서 국가별 최신 도로 기술계수 반영.
- V26/V27 국내 경로 캐시와 V11 국가 내부/국제 경로 캐시의 **기술 등급 및 방향을 구분**하도록 수정. V27의 같은 날 캐시는 연구 이후 기술 등급 변화에 즉시 반응한다.
- 미소유 미개척 대상에 가상의 도로를 부여하지 않는다. 군사 Formation 이동속도 공식은 변경하지 않는다.
- 이미 존재하는 G3A/G3B 다중 타일 정착지는 G3B 구세이브 보호 정책 및 기존 분할 허용치 유지. 같은 정착지 안의 D3 공동 재고 즉시 사용 유지.

### 구현 구조 및 관측

- `src/bootstrap/v034g4.js`: 새 기술 레지스트리·최고 기술 계수·가동 농장 보너스·저장형식/패치노트·표시/검증.
- `tools/g4-transform.mjs`: **빌드 출력에만** 기존 C1H 실물 경로/농장 자연회복 접점 적용. `src/legacy/` 원본 169개 블록 수정 없음.
- DEVLOG `worldSummary.v034g4`: 기술 채택 국가 수, 국가별 도로 계수, 가동 도로 타일·농업시설 수, 병합 이동비 한도.
- `VSim.V034G4.verify(world)` / `VSim.V034G4.audit(world)`: 런타임 검사 및 세계 보존 검증.

## 빌드 및 배포

```sh
npm run build
npm test
node tests/test-g4.cjs
G3B_DAYS=360 node tests/test-g3b-natural.cjs
python tests/browser-g4-smoke.py
python tests/browser-g4-local.py
```

- GitHub Pages: **저장소 루트 `index.html` + `dist/hosted/assets/` 전체**를 게시한다. GitHub Actions `.github/workflows/pages.yml`도 사용 가능.
- 독립 실행판: `index-standalone.html` 또는 `dist/standalone/index.html`.
- 대용량 세이브 검증기: `local-validator-g4.html` (완전 오프라인; 원본 세이브 파일은 서버로 전송하지 않음).

## 남겨 둔 한계 / 후속 검증

- 기존 사용자가 보유한 **111MB 실제 61년차 G3A 세이브**는 현재 빌드 컨테이너에 없으므로 G4 재주행은 사용자 PC 로컬 검증기로 진행해야 한다.
- 360일 신규 세계는 상위 기술 연구 시기 이전이므로 대형 정착지의 실제 기술별 병합과 60년 장기 균형을 증명하지는 않는다. 0.62/0.49/0.32 기술별 경로·병합 가능성은 별도의 통제 시험으로 검증했다.
- 기본 경제 경로/무역 경로는 `typeEff` 기반 도로 상태의 점진적 감소를 유지한다. 정착지 **병합 경로의 상태 25 임계값**은 G3B 방식을 유지하므로 정착지 병합과 일반 경제 경로의 도로 손상 반영은 의도적으로 완전히 동일하지 않다.
- 차기 G5: 농부·광부·학자 산출/Formation 회복 기술. G6: 외교관·스파이 Person 파견.
