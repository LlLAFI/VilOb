# Village Observer V0.34H4 — Long-run Integrity & D3 Capacity Fast Path

- 기준선: **V0.34H3**. 실제 사용자 88년 세이브 JSON이 없으므로 88년 세계의 재현/최종 성능 측정은 별도 사용자 검증 사항입니다.
- 구현일: 2026-10-19.
- 범위: **석재 저장 용량 초과 진단 및 D3 공동 Settlement 조회 경량화**. 게임 규칙·AI·Person·식량/생산·외교·전투·RNG·자원 보존·기술 수 변경 없음.

## 1. 석재 STORAGE_OVERFLOW 의미 및 수정

기존 D3 감사에서 `STORAGE_OVERFLOW:st-...:stone` 경고는 물리 석재 재고가 **현재 활성 건물** 기준의 저장 용량을 넘으면 발생합니다. 저장고 건물이 비활성화/붕괴되면 용량은 감소하지만 기존 재고는 보존됩니다. 따라서 재고 생성 버그와 동일시하면 안 됩니다.

- `VSim.V034H4.storageDiagnosis(world)`는 각 정착지의 실제 재고, 현재 유효 용량, 보유 중인 물리 건물 전부가 정상 가동할 경우의 최대 용량, 초과량 및 물리 타일 ID를 산출합니다.
- `POSSIBLE_CAPACITY_CONTRACTION`: 현재 용량은 초과했지만 현존 시설이 복구될 경우의 저장 용량 내에 있는 경우. **원인을 확정하는 값이 아니라 용량 감소로 설명 가능한 유형**입니다.
- `UNEXPLAINED_OVERFLOW`: 현존 시설의 최대 용량을 기준으로도 재고가 많은 경우. 직접 재고 변경/이전 건물 철거/소유권 이전 등의 경로를 조사해야 합니다.
- **실물 재고 삭제·이동·저장 용량 임의 확장 없음**. 기존 `STORAGE_OVERFLOW` 경고도 유지하며 진단 유형을 덧붙여 표시합니다.
- 세계 → 고급 도구 → 기존 상세 진단 → `현재 세계 감사 실행`: 필요 시에만 H4 진단 실행. Devlog JSON `worldSummary.v034h4StorageDiagnosis`에도 관측 결과를 담습니다. 일반 시뮬레이션 하루/렌더링 때 전체 감사를 추가로 실행하지 않습니다.
- **88년 기록에서 관찰된 `st-0000149`, `st-0000356`, `st-0000359`, `st-0000360`, `st-0000361` 5건의 실제 원인은 이번 코드만으로 확정할 수 없습니다.** 사용자 저장 상태를 불러와 진단해야 합니다.

## 2. 제한적 성능 최적화

`src/bootstrap/v034d3.js`의 동일 Settlement 타일 조회와 공동 저장 용량 계산만 조정했습니다.

- 회원 타일 포함 여부를 기존 배열 `includes`에서 정착지별 캐시된 `Set`으로 조회; 소유권·정착지·점령 변경 시 기존 invalidation epoch를 그대로 유지.
- `settlementCaps`가 기존에 자원 6종 각각에 대해 모든 구성 타일의 건물 용량을 새로 계산하던 경로를, **타일당 한 번 계산한 결과를 6종에 나눠 합산**하도록 변경. 구성 타일의 순회 순서는 그대로 유지합니다.
- 통제된 15타일 Settlement `settlementCaps()` 15,000회 마이크로벤치마크 결과: H3 2,799.95ms / H4 1,222.29ms (2.29배). **이는 해당 함수 단독 결과이며 SIM/BATCH 평균이나 88~150년 성능 달성 여부를 의미하지 않습니다.** 장치·브라우저 환경에 따라 달라질 수 있습니다.

## 3. 릴리스 구성

- 신규 `src/bootstrap/v034h4.js`, `tools/h4-transform.mjs`, `tests/test-h4.cjs`, `tests/test-h4-parity.cjs`, `tests/baselines/index-H3.html`, `tools/bench-h4-capacity.cjs`, `tools/browser-h4-smoke.py`.
- H3의 수동 감사 화면에서 H4의 진단을 사용하도록 수정. H3·H2A 정착지/관측 UI는 그대로 유지.
- V0.34H4 로컬 저장키 `village-observer-v034h4`. H3, H2A, H2, H1, H0, G5 JSON 세이브 호환 래퍼 보존.
- 보호 원본 C1H 169개 블록 SHA256 무변경, 기술 43개, Snapshot CSV 1,683열 유지.
- `npm run build`가 루트 Pages용 `index.html`, `dist/hosted/index.html` + `dist/hosted/assets`, `index-standalone.html`과 `dist/standalone/index.html` 생성.

## 4. 검증 및 한계

검증 근거는 `TEST-34H4.md` 참조.

**검증 완료:** 빌드, GitHub Actions 동일 `npm test` 종료 코드 0, 10일 CI 기본 비교, 별도 30일 및 90일 H3/H4 고정 난수 비교(세계 주요 상태 13개 동등; wall-time 프로파일러 필드는 비교 대상 제외), 석재 진단 합성 시나리오, H2A 고아 링크 복구 회귀, PC/모바일 × Standalone/Hosted 4/4 브라우저 테스트.

**검증 불가 / 후속 과제:** 사용자 88년 Save JSON, 실제 80~150년 동등 기기 성능 비교, 원본 5개 석재 경고의 직접 원인 확정, 장시간 `npm run test:extended` 완주. 따라서 `150년 ×10 SIM/BATCH 1,000ms` 달성이나 모든 저장 초과 제거는 주장하지 않습니다.

## 5. GitHub Pages 배포

전체 ZIP을 로컬 GitHub 저장소에 반영하고 GitHub Desktop에서 Commit 및 Push합니다. Actions에서 `npm run build` → `npm test` → Pages 배포를 확인하고 `V0.34H4` 배지를 확인하세요. 로컬 사용은 `index-standalone.html`을 실행하면 됩니다.
