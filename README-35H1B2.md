# Village Observer V0.35H1B2 — Startup & Runtime Consolidation V1

**Base:** V0.35H1B1A (Wartime Checkpoint Continuity). This is a deployment/startup/UI-only revision.

## Changes

- Hosted build now requests **165 unchanged/transformed legacy JavaScript assets + 1 bootstrap bundle = 166 JS files**, instead of H1B1A's 223. The combined bundle contains **59 subsequent bootstrap IIFEs in their original load order** (58 preexisting + the new H1B2 finalizer), separated by semicolons.
- Build-time consolidation removes **nine strictly whitelisted, version-only header wrappers**. No wrappers touching world state, diagnostics, UI buttons, migrations, telemetry, formation, or occupation are removed.
- Initial version badge is hidden **only while loading**. It is revealed as `V0.35H1B2` after the final initializer, preventing the old version-by-version visual sequence. The HTML title and initial badge are stamped with `V0.35H1B2` at build time.
- `NS.V035H1B2.report()` and **World → Advanced Tools → H1B2 시작 성능 JSON** expose basic startup timings and resource counts. Browser navigation/resource timing may depend on cache and permissions. There is **no always-on performance sampler** in the SIM loop.
- AI editor remains separate. Both `dist/hosted` (GitHub Pages) and root `index.html` point to the same bundle. The standalone HTML preserves isolated inline IIFEs and has the same nine build-time wrapper removals.

## Deliberate non-changes

- Protected 169 source blocks, 43 technologies, 1,683 Snapshot CSV columns, game economy, AI, military, RNG and existing observability remain unchanged.
- **Save serialization and checkpoint compatibility remain at `V0.35H1B1A` format**, including the `village-observer-v035h1b1a` save key. This avoids another `World.from` adapter in a startup-only change. The *release badge* and *startup report* say H1B2. This distinction is intentional, not a partial deployment.
- `World.from()`, military formation rehydration and wartime occupation adapters are not altered. Existing H1B1A saved files and H1A/H1B checkpoint imports remain supported.
- **This does not eliminate the 165 legacy scripts, or flatten all historic save/render adapters.** The reduction is in HTTP requests and selected redundant wrappers. Parsing and executing old logic still happens once each startup.

## Validation and limitations

- Tests: `npm run build`, `node tests/test-35h1b2.cjs`, then `npm test` locally. The source bundle generator aborts if its strict anchor or script ordering changes.
- H1B1A → H1B2 same-seed short run: 12-day world fingerprint and RNG parity; B1A checkpoint re-import; identical simulation snapshot values excluding real-time perf counters. Separate 90-day standard parity, H0 and CSV regressions also checked.
- Local Chromium headless is restricted by policy in the generation environment (file:// and 127.0.0.1 blocked), so **PC/mobile browser validation and real-world loading speed improvement are not verified here**. Check both on GitHub Pages.
- The full heavy wartime 60-year checkpoint test is only possible with the user's original large checkpoint. Keep that original untouched; verify Formation movement and occupation progression after load and 30–90 days of play.

## How to compare startup

1. `npm run build` and `npm test` before pushing to GitHub.
2. Open Pages after deploy, confirm `V0.35H1B2`, that the old version flash no longer appears, and the game starts.
3. In World/Advanced Tools export **H1B2 시작 성능 JSON**. Repeat after hard reload (cold), then normal reload (warm), comparing the same browser and cache conditions. Do not infer overall SIM speedup from the request-count reduction.
4. Import your 60-year wartime checkpoint and confirm military movements, occupation progression, and H1B1A diagnostics still work. If it fails, keep the original and use the wartime diagnostic JSON.

**Next:** H1C will address large checkpoint size separately. Full historic `World.from()`/UI adapter consolidation should be done as another isolated, parity-verified revision, not as a blind delete.
