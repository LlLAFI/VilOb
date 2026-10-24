# Village Observer V0.35H1C — Save Data Optimization V1

Base: V0.35H1B2 (CLOSED). Gameplay and save schema unchanged.

## Implemented

- `World > Advanced Tools > H1C · 무손실 체크포인트` adds a primary **compressed checkpoint (.json.gz)** export, an explicit legacy **uncompressed JSON checkpoint** export, gzip/JSON import, size attribution JSON, and the latest save/import timing JSON.
- The preexisting H1A **현재 체크포인트** button defaults to gzip and the preexisting file input accepts `.json`, `.json.gz`, `.gz`; no former function of `NS.V035H1A` is removed.
- Compression uses the browser-native `CompressionStream('gzip')` over the **unchanged** `JSON.stringify(NS.V035H1A.scenario(world))` output. Decompression uses `DecompressionStream('gzip')`; the result is sent through the **original** `NS.V035H1A.importCheckpoint`, retaining H1B1 checkpoint signature reconciliation, H1B1A wartime Formation/occupation rehydration, seed/RNG validation, and scenario classification checks.
- File content sniffing checks gzip magic bytes (1f 8b); a mislabeled `.gz` or corrupt gzip fails with an explicit error. Native APIs are required for gzip, while the uncompressed fallback always remains available. Files are processed in browser memory and are not sent to a server.
- Size attribution measures UTF-8 serialized byte weights per **top-level world field and Telemetry sub-field** and emits only a small diagnostic JSON. It does not truncate, delete, or mutate telemetry, military or gameplay fields.
- gzip export reports JSON byte count, gzip bytes/ratio, world signature, RNG and separately timed stringify/compress operations. Import reports decode and legacy-restore time. These are wall times, not SIM/BATCH performance measurements.

## Deliberate non-changes

- Saved world format stays `V0.35H1B1A`; localStorage key stays `village-observer-v035h1b1a`. `NS.SaveSystem.exportH1ACheckpoint` still produces uncompressed JSON when called programmatically.
- No alterations to RNG, world tick, AI, military, settlement, Telemetry, Snapshot CSV (1683 columns), protected 169 source blocks, or the 43 technology definitions.
- Build: 165 base JS assets plus one ordered bootstrap bundle (60 bootstraps). The startup badge is `V0.35H1C`; the single bootstrap bundle is now `v035h1c-bundle.js`.

## Measurements and limitations

- The supplied initial fixed-world JSON checkpoint was ~1.4MB and compressed to ~0.136MB in Node/browser-standard gzip stream tests. Actual 60-year ~140MB result **has not been measured**; compression ratio may differ considerably.
- A smaller `.gz` download does **not** mean the `World.serialize()` or `JSON.stringify()` in-browser memory peak is smaller; all original fields are serialized before compression. No worker, incremental world serialization, or IndexedDB backend is included in V1.
- Legacy `World.from()` can rewrite the nondeterministic diagnostic `testScenario.createdAt` field at load; parity tests deliberately separate that wall-clock metadata from gameplay state. This predates H1C. Continuous run vs reload parity is not claimed.
- Real 60-year checkpoint re-import, wartime replay, and PC/mobile browser-specific memory limits require user-side acceptance tests. Keep your original 140MB checkpoint untouched until both JSON and gzip imports are verified.

## Deployment and user verification

1. Replace repo files with Source ZIP contents; `npm run build`, `npm test`; then commit/push GitHub Desktop.
2. Confirm top-left `V0.35H1C`. In World / Advanced Tools import original 60y `.json`, verify war continues.
3. Download gzip checkpoint, record new file size; **re-import it** and confirm year, population, map, Formation movement, ongoing occupation, RNG/state signature and 30–90 days of uninterrupted follow-up.
4. Export the small **저장 항목 용량 분석 JSON** and **최근 저장·불러오기 성능 JSON**. Share those, **not** the huge full checkpoint.
5. If compression APIs are unsupported or a large file causes a memory issue, retain the plain `.json` fallback and report the browser and memory situation; do not delete your original.
