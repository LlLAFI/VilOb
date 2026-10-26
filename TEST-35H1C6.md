# V0.35H1C6 validation record (2026-10-26)

| Gate | Status | Details |
|---|---|---|
| `npm run build` | PASS | Standalone/hosted from baseline; 169 protected blocks identical and SHA `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` |
| CSV schema | PASS | 1,683 columns / 72 duplicate names disambiguated |
| H1C5→H1C6 targeted parity | PASS | `tests/test-35h1c6.cjs`: 30 natural days, daily world fingerprint/RNG/events/Snapshots; 2 manual Snapshots equal |
| F5A attach nested timing | PASS | `C5_F5A_ATTACH` and C6 nested stages captured, nonnegative inclusive/exclusive, scoped only within F5A Snapshot |
| H1B2 bootstrap consolidation | PASS | 66 bootstraps → one bundled hosted asset; 165 protected JS requests + bundle |
| H1C gzip + CSV | PASS | `tests/test-35h1c.cjs` preserved checkpoint and schema |
| H1C4 Diagnostic Center UI | PASS | `tests/test-35h1c4-ui.cjs`, 12 panels, 4 categories, existing controls |
| Long `test-35h1c1.cjs` | INCOMPLETE | exceeded local execution limit; no PASS claimed |
| Full `npm test` and longer H1C2/3 tests | NOT COMPLETE | still needed before CLOSED |
| Browser PC 1440 / mobile 390 | PASS | `python tools/browser-35h1c6-smoke.py`: correct runtime/badge, 40 attach stages, 43 technologies, no JS page errors |
| Identical 60-year 180-day user performance | AWAITING DATA | no distributable 60-year checkpoint in source package |

The year-1 Node VM sample identified substantial time *somewhere under older attach layers*, but it is not representative of the 60-year world and must not be cited as a production speedup.

**Important:** This is a guarded profiler patch, NOT a confirmed speedup. State/RNG/output parity is the release criterion.
