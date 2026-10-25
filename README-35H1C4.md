# V0.35H1C4 — Diagnostic Center & Snapshot Attribution V1

Baseline **V0.35H1C3 CLOSED**. No simulation model, AI weights, World/Person economy, war/Formation rules, RNG, telemetry retention, Snapshot cadence/1,683-column schema, 43-tech tree, or checkpoint format was modified.

## A. World → Advanced Tools → Diagnostic Center

- Adds one **collapsed-by-default** diagnostic center with four categories: performance, integrity, observation/storage, and archive.
- Moves **the existing 12 dynamic diagnostic panels** from older nested `renderWorld` wrappers into a single selected panel container. It moves live DOM nodes, not copies; existing button listeners and profiler logic are unchanged.
- Existing H1A **scenario/checkpoint** panel remains **outside** the diagnostic center, with H1C gzip `.json.gz` and original JSON save/import controls still usable without selecting a profiler.
- Keeps the selected category, panel and `<details>` open state across ordinary world renders/tabs. Unselected panels stay in a hidden in-DOM parking node; old code still locates them by ID and updates its existing readouts.
- Exported Devlog now labels runtime **V0.35H1C4** while preserving saved checkpoint schema **V0.35H1B1A**.
- New center status checks are deliberately cheap (existing `isActive` / snapshot session state). **Never call full H1C1 `report(world)` per UI tick**: it scans the retained D3A food ledger.
- Captures manual profiler Start button events and rejects starts while another profiler/snapshot session is already active. Stop and export buttons are unaffected.
- Mobile layout uses wrapping groups and flexible selected-tool control. **Browser device verification is pending**; standalone Node DOM mutation tests are not a substitute for a browser smoke test.

The 35G construction/garrison/migration/routing export row is one selectable observation tool. Original D3/H3 world-statistics, F0/F1 summary cards and manual integrity audit are unaffected.

## B. Snapshot attribution

Seven additional **read-only** stage boundaries instrument the inherited protected script chain (no source edits, no skipped calculations):

`C4_PRE_E4_099`, `C4_PRE_E4_105`, `C4_E4_108`, `C4_E4_TO_F_112`, `C4_F1_115`, `C4_F5_119`, `C4_F5A_122`.

They appear inside **H1C1 → 180-day Snapshot JSON → snapshot.stages** after starting the H1C1 profiler. Timing is *nested*; compare `exclusiveMs`, never sum parent and child inclusive metrics. These probes locate the previously unallocated E4/F5A work but do not by themselves speed it up.

**No production runtime speedup is asserted.** Earlier 60-year E/F leaf timings were too small to justify a calculation rewrite safely. The prior target of 20% Snapshot acceleration is deferred until same-world, profiler-OFF A/B reveals a high-impact, side-effect-free change. Source inspection found past Snapshot callbacks that mutate repair state, so blanket pruning is forbidden.

## C. Validation

- 169 original SHA-pinned legacy blocks identical. 165 legacy scripts + one new bundled bootstrap (64 source modules) = **166 requests**; 4 CSS, 43 tech, 1,683 CSV columns.
- H1C3↔H1C4 60-day world/RNG/entry/Snapshot/D3A ledger parity: PASS.
- H1C3 90-day occupation, war/DomainEvents, gzip and historical regressions: PASS.
- H1C4 7/7 new stage probes producing real samples: PASS.
- Synthetic DOM event/state regression: 12 panels, 4 categories, button listener identity, visible gzip controls, selection and repeated rendering, profiler-start exclusivity: PASS.
- Source reconstruction, build, static CSV and H1A-HF compatibility: PASS.
- Full sequential `npm test`: **NOT VERIFIED** due tool execution limit; browser PC/mobile smoke: **NOT VERIFIED** (Chromium session did not complete in current environment).

## D. User validation

1. Deploy new Source ZIP and `npm run build` / `npm test` on your PC. Verify `V0.35H1C4` badge and World / Advanced Tools / Diagnostic Center.
2. Switch through all 4 categories and back to performance; start/stop a short H1C1 diagnostic then export JSON; check panel switching and collapsing does **not** interrupt the active profiler.
3. Use original 60-year gzip checkpoint, progress 180 days if collecting next layer attribution. Deliver H1C1 observation JSON and Devlog JSON. H1C3 D3 integrity passed in the previous 363-day run so no mandatory new 360-day run is needed unless regression appears.

Release status: built, targeted regression PASS, device/full-suite user verification pending.
