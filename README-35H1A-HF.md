# Village Observer — V0.35H1A-HF

## Purpose

H1A Release Cleanup & CI Hotfix. No gameplay-balance adjustments and no changes to legacy C1H protected source. The H1A fixed-seed benchmark (`perf-19x19-a-v1`), seeded RNG, checkpoints and H0 route cache remain intact.

## Releases

- **Source ZIP**: newest `src/`, build `tools/`, curated `tests/`, essential test fixtures, `.github/workflows/pages.yml`, latest documentation, and generated `index.html` + `dist/hosted/`. No old full-HTML baseline archives, historic screenshots, all-version validator HTML, or duplicate standalone in this ZIP.
- **Standalone HTML**: available as a *separate* download. The source build also creates `index-standalone.html` and `dist/standalone/index.html`, but these generated duplicates are excluded from the Source ZIP.
- **GitHub Pages**: `npm run build` -> `npm test` -> upload `dist/hosted`. The generated `index.html` inside `dist/hosted` points to `assets/`. The root `index.html` points to `dist/hosted/assets/` for repository-root preview. Do not upload only a standalone HTML as the GitHub project source.

## Update or deploy

1. Extract the **Source ZIP** and merge/replace its matching project files in the GitHub `main` branch. Keep `.github/workflows/pages.yml`, `src/`, `tools/`, `tests/`, `package.json` and `ai-editor.html`.
2. Run `npm run prune:preview` to see candidates and `npm run prune:apply` in a cloned copy after checking the output. Then **remove the old root-level `index-*-baseline.html`, `local-validator-*.html`, large `tests/baselines/` and older `tests/fixtures/` that are no longer in the HF Source ZIP.** Uploading the new archive does not automatically delete stale GitHub files. Do not delete `src/legacy/` or `src/bootstrap/`.
3. Confirm Actions runs `npm run build` and `npm test`, then GitHub Pages deployment succeeds. On a local machine with Node.js >=18: `npm run build && npm test`.
4. Visit the deployed site and check `V0.35H1A-HF` in the version badge and H1A-HF fixed performance scenario controls in World > Advanced Tools.

## Checkpoint compatibility

- New saved world version `V0.35H1A-HF`, localStorage key `village-observer-v035h1a-hf`.
- H1A saved worlds and H1A performance checkpoint JSON files are accepted. The old `village-observer-v035h1a` localStorage key is read as fallback. Previous H0 and G1B save import pathways remain.
- `NS.V035H1A` API, the fixed seed and the H1A performance checkpoint JSON shape (`vilob-performance-anchor-v1`) are retained.
- **Known pre-existing limitation**: uninterrupted simulation and saved/reloaded simulation are not fully state-equivalent at every later point. For H-series A/B, import the **same saved checkpoint JSON** separately into each compared build.

## CI regression policy

The full historical test suite and historical HTML baselines are archived in older version backups. Only relevant, self-contained regression cases are retained here: canonical 169-block SHA + 1683 CSV schema + runtime script structure, HF↔H1A fixed-seed parity and old-checkpoint migration, H1A saved-checkpoint replay, H0 route-cache parity, G1B migration, G1A construction, food relay, H4C stock, and 35A profiler. New tests should not pin the *current release version* to an old release; check public fixed behavior and explicitly named historical fixture versions separately.

## Invariants

- 169 C1H protected blocks and exact SHA reconstruction; 165 legacy JS and four CSS blocks.
- 43 technologies; baseline construction 0.80 adult-days/day and architect x3.0.
- Snapshot CSV schema 1,683 columns.
- GitHub Pages & standalone desktop/mobile; no change to simulation formulas, AI choices or RNG consumption intended by this cleanup.

See `TEST-35H1A-HF.md` for verification.
