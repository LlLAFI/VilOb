# V0.35H1C5 validation record (2026-10-26)

| Gate | Result | Evidence |
| --- | --- | --- |
| Source reconstruction / protected SHA | PASS | `npm run build`, 169 blocks, SHA `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64` |
| Standalone/Pages build | PASS | 165 legacy + 1 bootstrap, 65 bundle modules |
| CSV Schema V2 | PASS | 1,683 columns, 72 duplicate header fixes |
| H1C4 ↔ H1C5 daily world/RNG/log/snapshot parity | PASS | `tests/test-35h1c5.cjs`, 30 natural days |
| 12 manual Snapshot equivalence | PASS | `tests/test-35h1c5.cjs` |
| F5A full attach preserved and measured | PASS | `C5_F5A_ATTACH` sample and static anchor |
| H1B2 compatibility, checkpoint | PASS | `tests/test-35h1b2.cjs` |
| H1C gzip/CSV and V35H1C1 profiler | PASS | `tests/test-35h1c.cjs`, `tests/test-35h1c1.cjs` |
| H1C4 diagnostic UI synthetic DOM | PASS | `tests/test-35h1c4-ui.cjs` |
| H1C2/3, entire npm test and mobile/desktop Chromium | NOT VERIFIED | Tool execution limit for long tests; required before marking CLOSED |
| 60-year 180-day performance A/B | PENDING USER | 60-year checkpoint not included in this source package |

Local, profiler-OFF Node VM benchmark (Year 1 after 30 days, **not late-game**):
- H1C4 median 378.978ms, mean 367.090ms.
- H1C5 median 352.605ms, mean 355.013ms.
- 10 timed paired manual snapshots (2 warmups). Values are environment sensitive. No late-game speedup guarantee.

An initial broader optimization skipping F5A attach FAILED day-1 event-order parity and was discarded; the shipped patch retains it.
