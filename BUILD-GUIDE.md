# Build & GitHub Pages — V0.35H1C3 (historical addenda retained)

## Build from a fresh Source ZIP

Requires Node.js 18 or newer, no external npm dependencies.

```bash
npm run build
npm test
```

The build **regenerates** `dist/` from scratch. The Source ZIP intentionally excludes generated duplicate `index-standalone.html` and `dist/standalone/index.html`; they are rebuilt automatically when needed. The standalone release artifact is also supplied as an independent HTML file.

## GitHub Pages

The workflow `.github/workflows/pages.yml` runs `npm run build`, then `npm test`, then publishes `dist/hosted`. The browser-accessible entry point is `dist/hosted/index.html` with `assets/` CSS/JS plus `ai-editor.html`. Root `index.html` is also generated for repository-root preview and references `dist/hosted/assets/`.

Don't upload the ZIP binary to the repository as the website. Extract and commit the project files. The GitHub repository will still contain historical tracked files until they are explicitly removed: inspect `npm run prune:preview`, optionally run `npm run prune:apply` and commit deletions with `git add -A`.

## Version, save and scenarios

The current runtime badge and Devlog export version is `V0.35H1C3`; the **save data format** remains `V0.35H1B1A`. H1A `NS.V035H1A` fixed seed/RNG/checkpoint implementation is unchanged in logic; H1A checkpoint JSON and localStorage save key are accepted. The new save key is `village-observer-v035h1b1a`.

## CI scope

`npm test` runs the curated current-build and 13 critical regressions. The complete historical baseline archives and obsolete all-version validator HTML files are no longer distributed. This change is intentional; old-version historical comparisons can still be run from past archived releases as needed.


## V0.35H1B

- Build: `npm run build`, CI: `npm test` (12 core regression cases), optional browser: `python tools/browser-35h1b-smoke.py`.
- H1B diagnostic: World → Advanced Tools → H1B; load the same HF 60-year checkpoint separately for baseline/A/C/D. 180d/360d opt-in measurements; export H1B JSON.
- Do not package previous `index-standalone.html`, stale `dist/standalone`, or past release HTML in the source ZIP. GitHub Actions deploys `dist/hosted`.
- `npm run prune:preview` lists old files; `npm run prune:apply` removes only old archives. H1B tests and HF executable parity fixture are protected.

## V0.35H1B1A hotfix

Current runtime and new save key: `V0.35H1B1A`, `village-observer-v035h1b1a`. Use the H1B1A Source ZIP in GitHub Desktop and run `npm run build` / `npm test` before pushing. `tests/test-35h1b1a.cjs` covers mid-war Formation/occupation roundtrip and follow-on movement; `README-35H1B1A.md` details limitations. Note: this addendum supersedes old version labels above; those sections describe historical releases.

## V0.35H1B2 release note (supersedes earlier release banner instructions)

- Current **UI release**: `V0.35H1B2`. The save/checkpoint **data format remains** `V0.35H1B1A` and localStorage still uses `village-observer-v035h1b1a`; do not confuse this with an older runtime being deployed.
- Hosted Pages requests **166 JS assets**: 165 legacy modules and `assets/bootstrap/v035h1b2-bundle.js`. Source maintains separate bootstrap files for auditing; the build script creates the optimized distribution bundle automatically. `index-standalone.html` is still a standalone HTML output.
- Run `npm run build` and `npm test` before committing. Do not copy only `index.html` without its built assets.
- Verify H1B1A wartime checkpoint movement and occupation, and compare startup on the same device cold/warm. Chrome may cache prior versions until a hard reload.

## V0.35H1C release note (supersedes earlier runtime version information)

- Current **runtime badge**: `V0.35H1C`; save/checkpoint internal schema: `V0.35H1B1A` for wartime backward compatibility.
- Source ZIP -> extract into repository root, run `npm run build` and `npm test`, then commit/push. GitHub Pages hosted entry includes 165 legacy JS modules and `assets/bootstrap/v035h1c-bundle.js` (one bundled 60-script bootstrap).
- World / Advanced Tools / **H1C · 무손실 체크포인트**: save/load gzip (`.json.gz`), save/load previous `.json`, export field size JSON and timing JSON. gzip requires Chrome/Edge/Firefox versions implementing `CompressionStream` and `DecompressionStream`.
- Test actual original ~140MB 60-year file locally; never delete that source before inspecting imported gzip's military movements and occupation progression.

## V0.35H1C1 release (current)

- Current UI: **V0.35H1C1**. Save/checkpoint serialization still **V0.35H1B1A**; **H1C gzip remains lossless and backward-compatible**.
- Hosted Pages: **165 historical base JavaScript assets + `assets/bootstrap/v035h1c1-bundle.js`** (61 constituent bootstraps) = **166 external JavaScript requests**. Do not copy only root `index.html` without `dist/hosted/assets`.
- `npm run build`, then `npm test` and `npm run benchmark:h1c1` (optional and Node-specific).
- New **World → Advanced Tools → H1C1 관측 진단** runs 180 days. Capture JSON on the 60y checkpoint before deeper snapshot hotspot changes.


## V0.35H1C2 release (current)

- UI label `V0.35H1C2`, internal checkpoint base version `V0.35H1B1A` with additive `v35h1c2` AI-decision state (`schema: 1`).
- Hosted JS assets: 165 protected JS + `assets/bootstrap/v035h1c2-bundle.js` (62 ordered bootstraps). GitHub Pages also needs all generated CSS and legacy JS assets.
- Source ZIP is the source of truth; run `npm run build` and `npm test` before deployment.
- `node tools/telemetry-inventory.mjs` audits the 1,683 V2 CSV columns and regenerates `docs/h1c2-csv-1683-inventory.json` without modifying existing CSV columns.
- World → Advanced Tools → H1C2 includes the taxonomy / dependency diagnostic JSON. H1C gzip and previous Formation migration fixes remain enabled.
- **No blanket observability OFF control** is provided: several legacy record wrappers still have simulation side effects. Never disable `Telemetry.record()` globally.


## V0.35H1C3 release (current; supersedes earlier runtime references)

- Current **runtime / Devlog version**: `V0.35H1C3`. Checkpoint and localStorage save format/key intentionally remain `V0.35H1B1A` / `village-observer-v035h1b1a`.
- Hosted Pages: 165 preserved legacy JS assets + `assets/bootstrap/v035h1c3-bundle.js` containing 63 ordered bootstraps = 166 JS requests. Both source and standalone builds keep the same order and checksum-protected baseline.
- `npm run build`, `npm test`. **19 tests PASS** on the completed H1C3 development build; run again on your local GitHub Desktop checkout before push.
- World → Advanced Tools → **H1C3 · 점령 재고 / 게임 사건 무결성** exports `vilob-v035H1C3-integrity.json` with physical vs civilian-accessible stock and `calendarOrdinalDay`.
- H1C1 180-day Snapshot profiler remains the way to collect new `E4_CULTURE_METRICS`, `E4_WAR_SCAN`, `F5_MONEY_PARTS`, and `F5_REALIZED_PRICES` leaf timers; normal observation cadence and CSV schema unchanged.
- DomainEvents callbacks remain mirrored at their legacy event-record timing; do **not** disable `Telemetry.record()` globally. Keep the original ~60-year checkpoint backed up until H1C3's partial/full occupation tests have passed on the user's device.
