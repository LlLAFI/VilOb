# V0.35H1C5 — F5 Monetary Snapshot Deduplication + F5A Attach Attribution V1

Baseline: **V0.35H1C4**. This is a *small, guarded Snapshot optimization*, not a simulation-rule change. The earlier proposal to drop F5A `attach(w)` was **rejected**: a controlled day-1 parity test showed the ordering of `MONETARY_ANCHOR_INIT_REPAIRED33F5P1` changed. Full F5A `attach(w)` is retained.

## Applied optimization

In protected legacy block `src/legacy/119.js`, F5 `attach(w)` already executes `updateMonetary(w,false)` as its final step. Immediately afterward, the F5 `Telemetry.snapshot` wrapper called the same `updateMonetary(w,false)` again with **no intervening mutation**. The H1C5 audited release transform `tools/35h1c5-transform.mjs` removes **only** this second call. The first update remains; all nested Snapshot calculations, original callbacks, Monetary Anchor P1/P2 repairs and order-sensitive events remain. Original 169 protected source blocks are byte-identical.

In `src/legacy/122.js`, H1C5 adds read-only nested timing `C5_F5A_ATTACH` around the **unchanged** F5A `attach(w)` while an H1B1/H1C1 Snapshot profiler is running. Off-session it invokes the original attach through the existing profiler utility's no-session path. This measurement helps identify whether the next opportunity is in F5A's attach chain or in its row enrichment. The H1C1 stage report exposes the new stage automatically.

## Invariants

- World, Person, AI, war, Formation, occupation, RNG and resource flow formulas unchanged.
- Saved checkpoint schema remains **V0.35H1B1A**; H1C gzip checkpoint compatibility preserved.
- Snapshots/Devlog/D3A history retention, Snapshot cadence, 1,683 CSV columns, 43 technologies unchanged.
- 165 protected JS requests + 1 bundled bootstrap request (**65 modules**, previously 64); UI version **V0.35H1C5**; Diagnostic Center's existing 12 panels preserved.

## Local validation

- Baseline 169 SHA-protected blocks and C1H reconstruction: PASS.
- H1C4 ↔ H1C5 30-day deterministic 19×19 seed `perf-19x19-a-v1`: daily world fingerprint, RNG, events, snapshots PASS.
- Same world, 12 successive manual Snapshots: matching world fingerprints and observational values PASS.
- F5A attach profiler boundary `C5_F5A_ATTACH`: measured, 1 sample in local test PASS.
- 1-year, Node VM, **30-day world**, 10 timed manual snapshots per version after 2 warmups, profiler OFF: median H1C4 378.978ms → H1C5 352.605ms (~6.96% lower), means 367.090 → 355.013ms (~3.29% lower). **These are a narrow local benchmark, not 60-year PC or 150-year ×10 performance proof.**
- `test-build`, CSV schema, H1B2 bundle/checkpoint, H1C gzip/schema and H1C1-stage regression, H1C4 synthetic UI: PASS.
- H1C2/H1C3 long regressions, entire sequential `npm test`, real desktop/mobile Chromium: NOT VERIFIED within tool execution limits.

## User 60-year follow-up

1. Run `npm run build && npm test`, deploy/launch. Verify upper-left badge `V0.35H1C5`.
2. In World → Advanced Tools → Diagnostic Center → H1C1, import the *same* 60-year H1C4 checkpoint, then run a fresh 180-day diagnostic.
3. Export H1C1 JSON; check `C5_F5A_ATTACH` and compare `F5_MONETARY` `exclusiveMs`, `F5A_FRONTIER` `exclusiveMs`, and mean/maximum Snapshot to prior H1C4 results (408.36ms mean / 705.3ms max, 12 snapshots).
4. If possible repeat with profiler OFF and record in-game SIM/BATCH, since the 408ms value refers only to Snapshot observation cost.

Release status: **implementation built; targeted parity PASS; full-suite and 60-year user confirmation pending**.
