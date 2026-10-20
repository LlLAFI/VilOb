# V0.35B — Administrative Logistics Hotpath Optimization

**기준선: V0.35A.** 이 패치는 물류 용량 계산의 반복 행정 모델 조회를 절감합니다. 생산량, 물류 용량 수식, AI, Person, 정착지, 저장 초과·반송, Gold, 전투, RNG와 기술 효과는 변경하지 않습니다.

## 실제 변경

- `src/legacy/064.js`의 보호 블록은 원본 그대로입니다. `tools/35b-transform.mjs`가 해당 레거시 블록의 `sameInstitutionD2()`만 변환합니다.
- 기존 경로: 동일 물류 용량 평가에서 출발 타일의 `regionForTileD2()`와 도착 타일의 `regionForTileD2()`가 각각 `NS.V032D.adminModel()`을 호출했습니다(2회).
- 개선 경로: `adminModelD2(v,w)`를 **한 번만** 평가한 뒤 동일한 `regions.find(r=>r.tiles.includes(...))` 의미로 두 타일의 소속을 검색합니다(1회). `adminEfficiency`, `officeOperational` 등의 수식과 기존 결과 객체는 그대로 유지합니다.
- **전역 캐시나 하루 단위 캐시는 추가하지 않았습니다.** `adminModel()`이 행정 등록, 임시 권역, 제도화 등 상태를 갱신할 수 있기 때문입니다. 확장 캐싱은 별도의 상태 유효성 검증 후 추진해야 합니다.
- `src/bootstrap/v035b.js`가 버전/세이브/패치노트/UI를 연결하고 선택형 세부 행정 모델 계측을 추가합니다. 기본 OFF, 시작·종료로 원본 함수 참조를 복구합니다. 기존 V0.35A profiler, CSV 1,683열, 기술 43개, 169 보호 블록 유지.
- 세계 탭 고급도구: `35A 정밀 계측`과 함께 `35B · 행정 모델 호출 상세계측`을 사용할 수 있습니다. 내보내는 35B profiler JSON에 `v035bAdminDetail`도 포함됩니다.

## 통제 성능 결과와 한계

- 특정 물류 용량 호출: V0.35A의 행정 모델 호출 **2회 → 1회** (정적·동적 검증 완료).
- 동일한 시작 세이브를 바탕으로 인위적으로 넓힌 `19×19` 국가 행정권에서 96회 반복한 Node VM 함수 단위 시험: 3회 중앙값 **29.230ms → 22.881ms (약 21.72% 단축)**. 최종 계산 체크섬 일치. 이는 **함수 단위 스트레스 시험이지, 실제 90년 세계나 전체 SIM 성능 개선율이 아닙니다.**
- 생성 직후의 합성 세계에서 3일×3회 전체 SIM A/B: 중앙값 **102.890ms/일 → 120.823ms/일 (17.43% 느림)**. 시작·종료 상태/RNG 일치. 매우 짧은 시험이고 측정 변동이 크므로 **전체 SIM의 개선은 입증되지 않았습니다.**
- 35A 사용자의 90년 계측 JSON에는 호출 시간과 횟수만 있고 **완전한 Save 상태는 없습니다**. 따라서 해당 세계의 30~90일 A/B와 공식 150년·10배속·1000ms 목표는 아직 미검증입니다.

## 재현

```bash
npm run build
node tests/test-35b.cjs
V35B_PARITY_DAYS=30 node tests/test-35b-parity.cjs
npm run bench:35b -- --save "/path/to/90y-save.json" --days 30 --warmup 3 --runs 3 --output 35b-ab-90y.json
node tools/microbench-35b.cjs
python tools/browser-35b-smoke.py
```

`bench:35b`는 입력 Save JSON을 PC 로컬에서 사용하며 대화에 업로드하지 않습니다. Node VM의 ms/일과 브라우저 F0 SIM/BATCH의 10배속 지표는 같은 측정값이 아닙니다. 최종 채택 여부는 **동일 기기·동일 세이브·계측 OFF A/B 반복**으로 판단해야 합니다.

## 배포

전체 ZIP을 GitHub Desktop 작업 폴더에 반영 → Commit → Push origin. 배포 후 [Village Observer](https://lllafi.github.io/VilOb/)에 V0.35B가 표시되는지 확인합니다. GitHub Pages는 `index.html` + `dist/hosted/assets/*`, 로컬 실행은 `index-standalone.html`/`dist/standalone/index.html`을 사용합니다.
