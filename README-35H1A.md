# Village Observer V0.35H1A — Fixed-Seed Performance Scenario

Baseline: V0.35H0. Released 2026-10-23. **H1A adds repeatable test infrastructure, not performance optimization or a balance change.**

## Launch and usage

1. Open the distributed `index.html` (GitHub Pages) or `index-standalone.html` (offline).
2. Go to World → Advanced Tools → **H1A · 고정 성능 시나리오** → **고정 시나리오 시작**.
3. This creates the standard `perf-19x19-a-v1` natural map with seven default AI nations and a deterministic xorshift32 RNG stream. Alternatively import `tests/fixtures/v035H1A-perf19x19A-initial.json` via the **H1A checkpoint import** control (not the old generic save importer).
4. Run naturally at ×10 with precision profilers OFF when benchmarking. Auto summary signatures are captured when crossing years 20, 30, 40, 60, 75, 90, 100, 120, and 150.
5. At a desired date (e.g., 60y), click **현재 체크포인트 JSON** to export the complete world and saved RNG state. A summary signature does **not** contain the world state and is not a restorable checkpoint.
6. In each subsequent H release, import the **same** H1A checkpoint and run the **same** days. Export the `성능·상태 요약 JSON` and Devlog/Snapshots; compare actual SIM/BATCH and World state under equivalent browser/system conditions.

## RNG and scenario format

- Scenario format: `village-observer-test-scenario` v1, validationVersion 1.1, `meta.category=performance`, with additional `perf.format=vilob-performance-anchor-v1` and serialized `world.v35h1a`.
- Map seed: `perf-19x19-a-v1`. Initial construction uses a `TileMap` shell to prevent time-dependent temporary map generation from consuming unpredictable random draws.
- Initialized with seeded `xorshift32` for founding entities; subsequent simulation steps isolate and restore RNG around `World.advanceOneDay()` only, so UI draw and performance observation do not consume simulation RNG.
- G3 anchor profile experiments are **not** enabled. The baseline seven presets remain unchanged.
- Checkpoint importer validates format, serialized RNG, seed, and world state signature before accepting it; E12 runtime person invariants are verified.
- Signature is a compact diagnostic of map/people/nation state plus RNG, and deliberately excludes performance telemetry and cache internals. It is not a cryptographic proof of full state identity.

## Important reproducibility boundary

**PASS:** fresh-world same-seed runs agree in independent Node VM environments for 60 simulation days; PC (1440) and mobile (390) Chromium initialization yields exactly the same 110 Persons, RNG state `3074299883`, state signature `787a6e56dff1ce35`; independently importing the **same checkpoint** twice and advancing 90 days yields matching RNG/world signatures.

**KNOWN LIMITATION:** a world run continuously without any save can diverge slightly from one exported and re-imported at an intermediate day because older save/restore attach paths recalculate some fiscal/admin/telemetry-derived state. A 60-day checkpoint was observed to drift from its uninterrupted source after three days even though RNG was identical. Thus H1A guarantees repeatability of **reimport vs. reimport**, not strict **uninterrupted vs. reimport** parity. Benchmark only two versions starting from the **same serialized checkpoint**; do not claim parity with an uninterrupted original without a separate test. This remains a candidate for H1B-era stabilization.

For exact function/balance comparison, additionally verify independent full save state or selected invariant fields, because signatures only sample core fields.

## Invariants and build

- Unaltered C1H source baseline: 169 protected blocks SHA256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`.
- 43 technologies, snapshot CSV 1,683 columns, H0 BFS optimization, G1B housing/cross-border migration, construction base 0.80/day and architect ×3.0 retained.
- Dedicated localStorage key: `village-observer-v035h1a`, with H0/G1B fallback.
- Build: `npm run build` then `npm run test:35h1a` / `node tests/test-35h1a-parity.cjs` / `python tools/browser-35h1a-smoke.py`.
- Hosted: root `index.html` + `dist/hosted/assets/**`. Offline: `index-standalone.html`.
