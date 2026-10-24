# V0.35H1B1A — Wartime Checkpoint Continuity

**Base:** V0.35H1B1. **Scope:** active-war save/load restoration only. No combat, AI, casualty, occupation-speed or economy rebalance.

## Root cause and fix

The inherited `MilitaryFormation.from` in the original 0.32D source rebuilt a Formation from an older field subset, silently dropping military fields introduced by later 0.33C–I patches (war assignment, movement schedule, regroup/concentration metadata). Several legacy world-loading attach hooks can also re-plan formations, operations and war scheduling during deserialization. The H1B1 fingerprint does not cover those complete military states, so a fingerprint PASS did not guarantee war continuity.

`src/bootstrap/v035h1b1a.js` preserves the complete saved field set of each military Formation, including its typed prototype, and restores the **authenticated saved** Formation, occupation-operation, war and planner state after the existing loader chain. No formations are fabricated: missing/extra formations cause a load error. It does not grant extra progress, advance timers, or use simulation RNG.

The patch also exposes a small **전쟁 복원 진단 JSON** button in the H1A tools panel. It reports restoration discrepancies, active wars, current Formation locations/movement schedules and ongoing occupation progress without exporting the world or its 140MB checkpoint.

## Loading older saves

The current runtime is V0.35H1B1A. H1A-HF/H1B/H1B1 fixed-scenario checkpoints remain importable. Save the original checkpoint somewhere safe; do not overwrite it during validation. The original H1B1 signature/resource checking is retained. A fresh localStorage save uses key `village-observer-v035h1b1a` and can auto-migrate known predecessor keys.

## Verification

`npm run build` and `npm test` build source and run the current suite. Additional direct case: `node tests/test-35h1b1a.cjs` runs real engine wartime fixtures E5 (occupation) and E4A (field movement), saves/reloads mid-war, compares Formation and occupation data, then continues for multiple days. It verifies 25-day repeat-load RNG/state parity and actual military advance and occupation progress on an uncontested target. Legacy source hash, technology count and CSV schema remain unchanged.

The real user-owned ~140MB 60-year checkpoint is **not available to automated tests**. Only reloading that original file on the user's PC and verifying actual Formation movement and occupation progress can close this incident. A restore/reload world may still diverge from an uninterrupted world due other pre-existing load/attach behavior; this patch validates military persistence, not whole-engine uninterrupted-run equivalence.

## Reproduction and acceptance on GitHub Pages

1. Deploy H1B1A Source ZIP with `npm run build`, `npm test`, commit/push.
2. Keep original 60y checkpoint unchanged; import it to H1B1A; confirm year progresses.
3. Compare active Formation `tileId`, `targetTileId`, next-move and military events over 30–90 in-game days; movement can be delayed by regrouping, terrain or active combat.
4. Check active occupation progress on an uncontested tile; if it still freezes, download **전쟁 복원 진단 JSON** after a few simulation days and send only that JSON for analysis.

## Scope deliberately deferred

H1B2 handles historical bootstrap version flicker/startup wrapper consolidation. H1C handles 140MB checkpoint reduction. Neither is part of this urgent wartime-load patch.
