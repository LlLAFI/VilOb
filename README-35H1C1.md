# Village Observer V0.35H1C1 — Observation Hotpath & Memory Optimization V1

**Runtime:** V0.35H1C1; **save/legacy checkpoint schema:** V0.35H1B1A (intentionally unchanged).

## Scope

- Adds opt-in **H1C1 180-day observation diagnostic** in World → Advanced Tools, next to the H1B1 snapshot tools. It exports a small `vilob-v035H1C1-observation-...json` with real nested observation stage timings, a snapshot-only D1 reuse counter, Telemetry lengths, and D3A 30-day ledger window/row counts. Existing H1B1 diagnostic is unchanged.
- Adds six explicit snapshot stage boundaries to the compiled bootstrap: `D1A_SETTLEMENT_LABOR`, `D2_HOUSING_AUDIT`, `D3B_ECONOMIC_OBSERVATION`, `H4_OBSERVATION_STACK`, `35F_OBSERVATION_STACK`, `35H_OBSERVATION_STACK`; the existing six E/F legacy boundaries continue to work. **Inclusive times overlap**. Sort/compare `exclusiveMs`, not the sum of `inclusiveMs`.
- Optimizes read-only D1 Settlement aggregation in the **scope of a single synchronous Telemetry.snapshot call**: reuse the base D1 aggregated rows and Person home/work index for the D1A observer, instead of building each twice. The cached references disappear in a `finally` block immediately after the snapshot. Outside snapshots, D1 calls use their original behavior.
- Build output performs exact-anchor transforms on *two bootstrap sources*, `v034d1` and `v034d1a`; preserves actual source modules for audit. No protected `src/legacy/` source block is changed, and the 169-block protected SHA stays unchanged.
- No pruning of historical Telemetry or D3A windows, no changes to snapshot timing/cadence, CSV columns, economic behavior, combat, AI, RNG, checkpoint gzip, Formation or occupation state.

## Performance status

A local Node 22 VM controlled experiment after a 90-day simulated world performed 20 repeated manual snapshots per version (4 additional warmups). Snapshot median **205.1 ms H1C → 202.7 ms H1C1**, an approximate **1.2%** improvement in that environment. This is not the 60-year world, not a browser SIM/BATCH result, and not proof that the planned 20–30% optimization target has been met.

The 90-day diagnostic recorded 12 populated stage boundaries. High-cost exclusive stages were E4-and-earlier (~474 ms total across six snapshots), F5A frontier (~190 ms), F5 monetary (~158 ms), F-prep/war (~154 ms), F4 finance (~144 ms), F1 settlement (~135 ms), and D1A labor (~100 ms), depending on warmup/noise. These guide later targeted optimization; they are **not independently measured savings**.

## How to test

1. Unpack Source ZIP into the existing GitHub repository; run `npm run build`, then `npm test`. CI still requires all tests to pass before deployment. Hosted build has 165 legacy JavaScript assets and **one bootstrap bundle** (61 constituent modules), total **166 JS requests**.
2. Load the same existing 30y or 60y JSON/gzip checkpoint and select **World → Advanced Tools → H1C1 · 관측 비용 및 D3A 장부 진단 → H1C1 180일 진단 시작**.
3. Run exactly 180 simulation days. Export **H1C1 진단 JSON**. The old H1B1 Snapshot 180-day diagnostic is still available but should not be run concurrently.
4. Confirm compressed checkpoint roundtrip, historical statistics/Devlog, and (on 60y checkpoint) wartime Formation movement and capture progress.
5. Compare profiler-OFF browser ×10 SIM/BATCH against H1C on the same machine and checkpoint before claiming improvement.

**Limitations:** This session did not have the user's actual 60-year checkpoint. Browser Chromium from this sandbox rejected local and loopback navigation by policy. Full sequential `npm test` did not finish under execution limits, although specific essential regressions passed individually. Validate those items on the user's machine before declaring this release CLOSED.
