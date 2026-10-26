# V0.35H1C6 — Legacy Attach Chain Attribution V1

Baseline: **V0.35H1C5**. This patch is an **observation-only guarded release**. A safe bulk `attachWorld()` skip cannot yet be justified: H1C5 proved that omitting F5A attach changes day-1 monetary-anchor event ordering.

## What changed

- Keep H1C5's single duplicate F5 monetary update removal and full F5A attach behavior unchanged.
- Add a nested, **snapshot-scoped, no-session pass-through** attribution layer for the F5A `attach()` call. The existing `C5_F5A_ATTACH` inclusive boundary is preserved. `C6_ATTACH_...` boundaries correspond to exported `NS.Vxxx.attachWorld` callbacks, including older 0.32E8–0.33C layers and 0.33D–F5P2.
- Timing is active **only** when the existing H1B1/H1C1 Snapshot profiler runs and the World is executing inside F5A Snapshot attach. An external `attachWorld(w)` during an ongoing diagnostic does not count toward these stages.
- Each stage records calls, inclusive milliseconds and **exclusive milliseconds**. Nested inclusive numbers must never be added together. The earliest measured `C6_ATTACH_32E8` stage includes *its* older, uninstrumented predecessors; its `exclusiveMs` is therefore not proof that 0.32E8's own leaf code is expensive.
- Preserve event order, all world repairs and their side effects, RNG and economic/military formulas. **No attach or normalizing operation was removed in H1C6** because the new evidence does not yet establish a safe identical-output shortcut.
- Source protection: original **169 protected blocks** and exact C1H SHA unchanged. Save format remains `V0.35H1B1A`; CSV remains **1,683 columns** and technology count 43.
- Runtime and build badge: `V0.35H1C6`. GitHub Pages retains 165 legacy requests plus one bundled bootstrap (now **66** modules); standalone remains available.

## How to measure

1. Open H1C6 and check the `V0.35H1C6` badge.
2. Restore the same **60-year H1C5 checkpoint** (NOT a new scenario/world). Navigate World → Advanced Tools → Diagnostic Center → H1C1, start the 180-day diagnostic.
3. Export `vilob-v035H1C1-observation-60y.json`. In `snapshot.stages`, compare `C5_F5A_ATTACH`, `C6_ATTACH_32E8`, `C6_ATTACH_E`, `C6_ATTACH_F5`, etc. Use `exclusiveMs`, not sums of inclusive times. `C6_ATTACH_32E8` includes the older predecessor chain and is a coarse bucket, not an identified leaf.
4. Compare against the H1C5 60-year result: Snapshot 12 calls / 4,880.5 ms total / 406.71 ms mean / 703 ms max, C5 attach 1,048.8 ms across 12 calls. The earlier H1C4 mean was 408.36 ms. These are *profiling* numbers, not SIM/BATCH results.
5. Keep 60-year Snapshot profiler data separate from in-game ×10 SIM/BATCH validation; ultimate goal is 19×19, 1–150 years, <1000ms.

## Why no broad optimization yet?

The original F5A attach chain runs real mutable migration/repair code (War Goals, occupation, monetary anchors), and H1C5 demonstrated that skipping the entire chain alters event ordering. H1C6 first determines which descendant actually dominates 60-year runtime, rather than shifting semantics based on early-game guesses. A targeted optimization can follow after a late-game 180-day C6 measurement and a controlled same-world, same-RNG, event + Snapshot data parity test.

See `TEST-35H1C6.md` for what was executed, including remaining long-run browser and regression checks.
