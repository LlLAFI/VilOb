# Build & GitHub Pages — V0.35H1A-HF

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

The runtime badge and export version is `V0.35H1A-HF`. H1A `NS.V035H1A` fixed seed/RNG/checkpoint implementation is unchanged in logic; H1A checkpoint JSON and localStorage save key are accepted. The new save key is `village-observer-v035h1a-hf`.

## CI scope

`npm test` runs the curated current-build and 11 critical regressions. The complete historical baseline archives and obsolete all-version validator HTML files are no longer distributed. This change is intentional; old-version historical comparisons can still be run from past archived releases as needed.


## V0.35H1B11

- Build: `npm run build`, CI: `npm test` (12 core regression cases), optional browser: `python tools/browser-35h1b-smoke.py`.
- H1B diagnostic: World → Advanced Tools → H1B; load the same HF 60-year checkpoint separately for baseline/A/C/D. 180d/360d opt-in measurements; export H1B JSON.
- Do not package previous `index-standalone.html`, stale `dist/standalone`, or past release HTML in the source ZIP. GitHub Actions deploys `dist/hosted`.
- `npm run prune:preview` lists old files; `npm run prune:apply` removes only old archives. H1B tests and HF executable parity fixture are protected.
