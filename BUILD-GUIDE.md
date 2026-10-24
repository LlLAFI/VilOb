# Build & GitHub Pages — V0.35H1B1A

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

The runtime badge and export version is `V0.35H1B1A`. H1A `NS.V035H1A` fixed seed/RNG/checkpoint implementation is unchanged in logic; H1A checkpoint JSON and localStorage save key are accepted. The new save key is `village-observer-v035h1b1a`.

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
