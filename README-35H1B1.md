# V0.35H1B1 — Checkpoint Integrity & Snapshot Hotpath V1

Date: 2026-10-23. Base: V0.35H1B. **This is a stabilization patch; it does not change AI/economy/battle balance or RNG rules.**

## 1. Checkpoint integrity

H1B1 recognizes `V0.35H1A`, `V0.35H1A-HF`, `V0.35H1B`, and its own `V0.35H1B1` performance checkpoint files. A checkpoint import now verifies its stored RNG, seed, and **fingerprint recomputed directly from the serialized JSON**, before calling `World.from`. It then validates the restored-world fingerprint. This separates a corrupted/unsound file from a load-induced mutation. If a load adapter changes only stored fingerprint fields (e.g., natural resources after legacy attach), H1B1 restores the exact original signed values and re-verifies the fingerprint. Any missing tile/nation/Person remains a hard error. It never creates missing people, changes RNG, or bypasses a mismatch. A compact local **체크포인트 진단 JSON** report exposes up to 48 mismatching paths with abbreviated values; the original large checkpoint stays on the user's PC.

An actual old H1B 120-day checkpoint reproduced a discrepancy in some tile natural resources (`food`, `wood`, `stone`) **immediately after `World.from`**; restored signed resource values repaired the signature. This is not proof that all 60-year checkpoints import: the user's ~140 MB 60-year save was not available to the test environment.

**Known limitation:** An uninterrupted world and a saved/reloaded world can still diverge on subsequent days due to non-fingerprint legacy attach/cache changes. The 16-hex-character fingerprint excludes many game-state fields and therefore is not a full save/load proof. For controlled performance A/B, independently reload the same checkpoint into both versions; validate RNG, fingerprint, and audits, and do not claim full determinism from signature alone.

## 2. Snapshot hotpath

- 27 historical snapshot enrichment scripts with the exact `w.villages.find(x=>Number(x.id)===Number(row.id))` lookup now use **one-scoped id index**, with native find fallback. Scope expires after each `Telemetry.snapshot()` call. Nation ids/roster semantics and snapshot output are unchanged.
- Six selected historical snapshot boundaries (E4-and-earlier / F / F1 / F4 / F5 / F5A) support optional inclusive/exclusive timing **only when H1B1 snapshot diagnostics are active**. They are nested measurement boundaries and must not be added to 35A/C/D times.
- `세계 → 고급 도구 → H1B1 · 스냅샷 내부 진단` starts a separate 180-day run and exports `vilob-v035H1B1-snapshot-...diagnostic.json`. Reimport the same checkpoint before running BASELINE, A, C, D or snapshot mode. No profiling timings are stored in world saves.
- **No verified 20–30% snapshot speedup is claimed.** Minor lookup reuse may be small relative to historical `attachWorld` overhead. Snapshot cadence, 1683-column CSV, history and resource-accounting calculations are unchanged.

## 3. Guarantees and delivery

- Protected C1H baseline 169 blocks SHA256: `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`
- 43 technologies, 1683 CSV columns, H0 path cache, H1B independent profilers preserved.
- H1B1 localStorage key `village-observer-v035h1b1`, accepts fallback H1B/H1A-HF/H1A keys and older saves via the existing chain.
- Build: `npm run build`; CI: `npm test`; `npm run prune:preview` then `npm run prune:apply` only if archival file deletion is intended. GitHub Desktop: extract the **Source ZIP** into the existing repository root, commit and push all additions/deletions.

## 4. User 60-year acceptance

1. Back up the original ~140 MB H1A-HF checkpoint, and do not overwrite it.
2. Load the old 60-year checkpoint with the H1B1 *checkpoint importer*. If failure, export `체크포인트 진단 JSON` and share only that small file.
3. If imported, export a new H1B1 checkpoint separately, reload it, verify RNG/signature and test 10 days.
4. Run the **H1B1 스냅샷 180일 진단** on the original 60-year checkpoint (reload before every trial) and share the resulting JSON. Use the H1B `BASELINE` mode independently for real timing.
5. A successful load is **not** evidence that uninterrupted-vs-reloaded future state matches; a separate full-state A/B test is needed.
