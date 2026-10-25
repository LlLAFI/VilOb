# V0.35H1C3 — Domain Integrity & Observation Hotpath V1

Baseline: V0.35H1C2 (60-year user run successfully completed). This release does **not** change AI, food, construction, combat, war balance, RNG, 5/15/30-day Snapshot cadence, CSV columns, or historical data retention.

## A. D3 occupation-aware inventory audit

`src/bootstrap/v034d3.js`'s `audit(w)` previously compared **all physically held member tile stock** with the civilian pool lookup at the first Settlement member tile. That lookup excludes hostile-occupied tiles, so the quantities cannot be expected to match while occupied. It falsely reported `POOL` errors in war-occupied Settlements and blocked the D3 settlement/housing/economy CSV exports.

H1C3 separates:

- **Physical stock** — raw `tile.stocks` across all owned Settlement member tiles. This is the authoritative conservation/`STOCK` and `WORLD` audit.
- **Civilian-accessible pool** — raw physical stock across only the members admitted by the existing `NS.V034D3.members(v,tid)` predicate (owned, correct active Settlement, not occupied by enemies). Compares against the same existing D3 pooled read on an accessible member.
- **Completely occupied Settlement** — no accessible member and therefore **zero accessible pool**. Never call the legacy raw-stock fallback on a hostile-occupied tile.

The public `NS.V034D3.audit(w)` still has `ok`, `errors`, `warnings`, `resources`, Settlement totals. It also adds `h1c3.physical`, `h1c3.accessible`, `h1c3.occupiedMemberTiles`, `h1c3.fullyBlockedSettlements` and `h1c3.poolChecks`. No physical inventory is moved, created, normalized or deleted. The existing `STOCK`, `WORLD_...`, D1 checks and overflow warnings continue running.

## B. DomainEvents V1 extension (compatible, not yet fully decoupled)

Protected legacy files `114.js` and `125.js` remain SHA-identical. A narrow build-time transform `tools/35h1c3-transform.mjs` captures their historical lexical callbacks at bootstrap and routes exactly their *existing* `Telemetry.record()` invocation sites through `NS.V035H1C3.DomainEvents.handle(...)`:

- `WAR_DECLARED33`: attacker/defender wartime target and emergency mobilization scheduling (plus the prior H1C2 target-invariant repair, still in lexical 126 wrapper at its original time).
- `WAR_ENDED33`: original postwar targets cleanup and delayed demobilization schedule.
- `TILE_OCCUPIED33`, `TILE_LIBERATED33`: original F-series last-control cache update.

The new `DomainEvents.dispatch(type, world, payload)` is an explicit non-observation entry point for these registered handlers. For a standalone declaration it also runs the H1C2 target invariant repair once, matching the two historical necessary callbacks. **Legacy events may have other listeners**: dispatch is not a replacement for the entire event and combat pipeline. All legacy `Telemetry.record` producers, order, handling and Devlog payloads stay enabled and unchanged; no global observation OFF option has been added.

`world.v35h1c2.aiLast` remains the authoritative cached AI recent decision; save format is still V0.35H1B1A.

## C. Snapshot leaf profiling

`tools/35h1c3-transform.mjs` also instruments narrowly scoped *read-only observation calls* (without changing outputs):

- `E4_CULTURE_METRICS` — actual `cultureMetrics(v,w)` executed when E4 Snapshot rows are constructed.
- `E4_WAR_SCAN` — `observerWarScan(v,w)` executed when E4 Snapshot rows are constructed.
- `F5_MONEY_PARTS` — Snapshot-level `moneyParts(w)`.
- `F5_REALIZED_PRICES` — Snapshot-level `realizedPrices(w)`.

All time attribution uses the pre-existing `NS.V035H1B1.measureStage` mechanism, which is a direct passthrough when no H1B1/H1C1 profiler session is active. Timings are nested: sum **exclusive** contributions, never all inclusive times. Other E/F costs are still unattributed and no 60-year speedup is claimed. A high-confidence E/F hotpath calculation rewrite is deferred until 60-year leaf evidence is available.

## D. Diagnostics metadata and exports

- Devlog export `version`/`runtimeVersion` now says **V0.35H1C3**; `saveFormatVersion` explicitly says **V0.35H1B1A**. This avoids confusing a runtime release with the checkpoint data schema.
- New **H1C3 · 점령 재고 / 게임 사건 무결성** panel in World / Advanced Tools exports `vilob-v035H1C3-integrity.json` including real `calendarOrdinalDay` and distinct legacy `ordinalDay`.
- `NS.V035H1C2.report()` remains unchanged for backwards testing; use H1C3 report for correct calendar labels.

## Build and next validation

`npm run build && npm test`. Existing 169 hash-protected baseline source blocks, 165 legacy JS, 4 styles, 1,683 CSV columns, 43 technologies remain. GitHub Pages downloads 165 legacy scripts and one bundle containing **63 ordered bootstrap source modules** (166 JS requests). Checkpoint gzip `.json.gz` and raw `.json` from H1C still work.

For the user's **actual 60-year wartime checkpoint**, import the file, continue **180–360 calendar days**, export Devlog and H1C3 integrity JSON, check all D3 audit errors disappear and real armies/occupation/civilian resources continue correctly. In a separate run, activate the H1C1 180-day observation profiler to collect the four new E/F leaf metrics; measured performance improvements are not asserted until a same-device A/B confirms them. Keep the original checkpoint backed up.
