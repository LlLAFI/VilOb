# V0.35A Verification Report

Baseline: V0.34H4C. Scope: instrumentation only; engine, RNG, Person, AI, battle, Gold, physical economy unchanged.

## Coverage

- Source: 169 C1H protected files (165 JS + 4 CSS), byte-perfect baseline SHA-256 check.
- Packaging: `npm run build` produced hosted + standalone; release and save versions both V0.35A.
- Profiler: opt-in on / stop restores exact method objects; off-by-default; top-10, annual rows, sample count, F0 reporting; no `v035a` field in saved world.
- Parity: same H4C world, seeded RNG, baseline H4C vs 35A (both profiled and unprofiled), 13 canonical state sections plus RNG source equal for 30 days (`npm run test:35a`).
- Local benchmark runner: first small synthetic 19×19 3-day A/B has equal start/final digests and RNG; this is a tooling smoke test, **not an optimization claim**.
- Original user's H4C 90y raw Save JSON not present: a true 90y A/B and 150y endurance run **not performed**.

## Timing caveats

- `estimatedInclusiveMs` extrapolates method sample means to call counts; nested calls overlap. Do not sum method totals or compare instrumented and uninstrumented runs as if equally timed.
- Node VM benchmark numbers cannot substitute for browser 10× SIM/BATCH or Wall. Use repeated same-machine runs and collect Chrome/browser F0 separately.
- Timed samples are exact for the sampled calls, but estimates need multiple days and repeat observations; P95 may be unstable at low sample counts.

## Test commands

```bash
npm run build
npm test
npm run test:35a
python tools/browser-35a-smoke.py
npm run bench:35a -- --days 3 --warmup 1 --runs 1 --output /tmp/35a-smoke.json
```

## 실제 최종 실행 결과 (2026-10-20)

| 검증 항목 | 최종 결과 |
|---|---|
| `npm run build` | PASS; V0.35A Standalone + Hosted 생성 |
| `npm test` | **PASS, 종료 코드 0** |
| `npm run test:35a` | **PASS**; H4C↔35A 30일/13개 상태 + RNG 일치, 계측 켠 상태도 일치 |
| H4B legacy 1일 회귀 | PASS |
| `python tools/browser-35a-smoke.py` | **PASS 4/4**; Standalone·Hosted 각각 PC/모바일 |
| `npm run bench:35a -- --days 3 --warmup 1 --runs 1 --profile` | PASS; H4C↔35A synthetic state and RNG same, profiler 3일 기록 |
| 169개 보호 C1H 블록·43기술·CSV 1683열 | PASS |
| 실제 사용자 90년 원본 Save A/B | **미실행** (해당 파일 미제공) |
| 150년 ×10 1,000ms 목표 | **미검증/미달성 상태 유지** |

브라우저 결과의 세부 사항: `docs/35A-BROWSER-RESULTS.json`.

