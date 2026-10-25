# H1C3 Verification Record — 2026-10-25

## Static, parity and occupied-inventory regression

- `npm run build`: PASS. Baseline reconstructed SHA-256 `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`, all 169 SHA-guarded protected blocks unchanged, 165 JS + 4 CSS, 1,683 CSV columns, 63 bootstraps compiled to one hosted bundle, 166 JS requests.
- `node tests/test-35h1c3.cjs`: PASS. H1C2 ↔ H1C3 fixed-seed **90 calendar days**, world fingerprint, RNG, full retained event and Snapshot values (ignoring elapsed wall clock) and D3A account ledger unchanged. Reproduces historical H1C2 `POOL` errors after hostile occupation; new D3 separates exact physical and accessible quantities, passes partial occupation, complete occupation, return after liberation; physically held inventory remains unchanged and independent world audit still detects inconsistent ownership. Four event callback types routed through DomainEvents with original event/war side-effect parity. Explicit declaration dispatch without a logged event validates the independent handler entry point (not the entire legacy pipeline). Four E/F leaf timers actually report calls when the H1C1 profiler is active. gzip and legacy save schema parity.
- `node tests/test-35h1c2.cjs`: PASS. Existing H1C1↔current 120d state/RNG/observation parity; AI recent-decision retention, repeated import, military state.
- `node tests/test-35h1c.cjs`, `node tests/test-csv.mjs`, `node tests/test-build.mjs`: PASS. Compression and CSV compatibility.
- `node tests/test-35h1b1a.cjs`: PASS. Wartime Formation save/load, movement and occupation progress.

## Limitations

- `H1C3` has **no proven 60-year Snapshot speedup**. E/F leaf timing is observation-only; do not claim a 20% improvement without a controlled same-device run.
- Existing historical `Telemetry.record` wrappers are kept ON and some game-critical side effects remain in the legacy event chain. `DomainEvents.dispatch` covers only the registered callbacks, not all effects of every event.
- User's 60-year checkpoint is not available in the build environment; the actual **14 historical `POOL` rows** must be reconfirmed on the saved 60-year run.
- Desktop/mobile Chromium local navigation may be blocked by the sandbox administrator. If so, record this as **unverified**, not PASS.
- Full `npm test` (entire curated sequential suite): **PASS, all 19/19 tests**, including H1C3, H1C2, H1C1, gzip, H1B1A wartime save, H0 routing, legacy milestone regressions, and build/CSV integrity. Chromium PC/mobile smoke attempted via local HTTP; both were blocked with `ERR_BLOCKED_BY_ADMINISTRATOR` before page navigation and are **not verified**.
