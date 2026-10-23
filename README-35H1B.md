# Village Observer V0.35H1B — Hotpath Attribution & Optimization V1

**Baseline:** V0.35H1A-HF · `PERF-19X19-A` seed remains `perf-19x19-a-v1` · source/hosted/standalone builds.

## Design and scope

1. **H1B diagnostic session**: `세계 → 고급 도구 → H1A/H1B 고정 성능 시나리오 → H1B 성능 진단 세션`.
   - First, load the **same locally held 30y or 60y whole-world checkpoint** for EACH mode. 140MB checkpoint uploads to ChatGPT are not necessary.
   - `BASELINE`: 180 days, no method profiler, only outer world-day timer (two clock reads/day); records days and 10-day buckets.
   - `A`: 180 days, 35A daily/Person profilers and inclusive Telemetry.snapshot time.
   - `C`: 360 days, 35C separate 21-level seasonal breakdown + administration calls and inclusive snapshots.
   - `D`: 360 days, 35D society/economy leaf profiler + inclusive snapshots.
   - Sessions automatically stop after the target number of days; operator can stop earlier. `H1B 진단 JSON` exports `vilob-v035h1b-attribution-v1` with mode/start/end checkpoint RNG and state signature, percentile stats, 10-day buckets, selected legacy profiler report, snapshot inclusive cost.
   - Never sum inclusive nested timing measurements. Independent GUI F0 SIM/BATCH and Wall stats remain the actual PC ×10 performance goal; Node VM and diagnostic timings do **not** prove a 150-year target.
2. **First safe hotpath optimization**: legacy `Village.dailyTick` post-`Person.act` adult worker and merchant census previously allocated two `.filter()` arrays and traversed the same residents twice. `tools/35h1b-transform.mjs` performs the exact two predicates in a *single ordered pass*, retaining predicate order per metric, `ordinalDay` checks and arithmetic. Original 169 immutable legacy blocks are unchanged. Never caches cross-day Person lists.
3. **Compatibility**: H1A, H1A-HF, H1B checkpoint/scenario JSON imports; prior saves via H1A/HF → H1B. H1B local storage key `village-observer-v035h1b`, fallback HF and H1A; new exports `V0.35H1B`.
4. **No balancing**: 7 baseline nations; technology 43; G1A building throughput 0.80 / architect ×3.0, G1B foreign migration; 19×19 and 1,683-column CSV. GitHub Pages standalone plus source unchanged.

## Verification

- `npm run build`, `npm test` — core 12-suite source-backed CI.
- `node tests/test-35h1b.cjs` — H1A-HF ↔ H1B 90-day seeded state/RNG parity, 4 independent diagnostic modes, HF save and checkpoint import.
- `python tools/browser-35h1b-smoke.py` — PC (1440×900), mobile (390×844) startup, H1B version, four profiler controls, 10-day baseline and no JS errors.
- `node tools/bench-h1b-ab.cjs 120 2` — **early-year** unprofiled VM A/B benchmark against archived HF executable; explicitly NOT a later-year or real-browser comparison.
- Original `src/manifest.json` SHA, 169 protected blocks, 165 script blocks, CSV 1,683 columns are preserved. Build emits 221 script tags including H1B.

## Open / deferred

- The user's large ~140MB 60-year checkpoint is not available here. The 60-year **same-file, same-PC, repeated profiler-OFF A/B** cannot be claimed yet. Need user to run diagnostic A/C/D against the **same 60-year checkpoint** and share just diagnostic JSON, no checkpoint upload.
- This release is diagnostic infrastructure plus one safe local hotpath pass; it does **not** assert a double-digit full-SIM speedup without actual late-game evidence. Based on profiler results, consider H1B follow-up or H2 for the largest measured contributor.
- 140MB checkpoint-size optimization remains H1C. The current save format and observation history are intentionally unchanged.
- Known H1A save/reload vs uninterrupted-run complete parity limitation remains. Both A/B builds must import the same checkpoint separately.
