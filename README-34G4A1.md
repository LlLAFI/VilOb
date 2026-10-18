# Village Observer V0.34G4A1 — Statistics Selector Stability

Date: 2026-10-18. Baseline: V0.34G4A. Scope: statistics UI-only hotfix.

## Fix

- G1's `mark()` and `NS.UI.prototype.renderStats` previously wrote the same caption `타일 (기존 장기 통계)` to the `<option value="settlement">` on every render tick.
- Even while legacy F5A1 prevented stats-options rebuild on an active dropdown, G1 changed the option node's text every tick, reinitializing native select dropdowns.
- Now both paths only mutate `option.textContent` when it differs from the desired label. Existing F5A1 focused-select redraw deferral remains authoritative.
- Statistics scope selection 세계/국가/타일, dependent nation/tile selectors, metrics/period and charts are unchanged.

## Unchanged

- G4A adult/child food-cycle need 0.39/0.28, Hunger gain/recovery adjustment, 12-calendar-day starvation grace.
- G4 roads 0.62/0.49/0.32 and Hydraulic Engineering; 39 technologies; G3B join path-cost limit 1.00; D3 joint settlement stocks.
- All AI, economy, diplomacy, war, RNG, and physical accounting formulas; 169 C1H protected blocks.

## Migration, builds, tests

- New save key `village-observer-v034g4a1`, version `V0.34G4A1` with fallback to G4A/G4/G3B/G3A/G3; old saves retain state.
- GitHub Pages: copy the package's root `index.html`, `dist/hosted` and relative files to repository root. Alternatively open `index-standalone.html` locally.
- `node tools/build.mjs`; `node tests/test-g4a1.cjs`; `python tests/browser-g4a1-stats.py` (desktop/mobile x hosted/standalone); `python tests/browser-g4a1-local.py`.
- Long `npm test` suite was run but hit the execution timeout during the longer G3A stage. Targeted tests PASS; see `TEST-34G4A1.md`.
