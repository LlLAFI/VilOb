# V0.34G4A1 validation — 2026-10-18

| Test | Result |
| --- | --- |
| Node reproducible 169 protected C1H hashes and 1683-column CSV schema | PASS |
| `node tests/test-build.mjs` and `node tests/test-csv.mjs` | PASS |
| `node tests/test-g4a.cjs` 180-day new-world and physics audit | PASS |
| `node tests/test-g4a1.cjs` option-mutation guard | PASS |
| `node tests/test-g3b.cjs` one-day bidirectional join + audits | PASS |
| `python tests/browser-g4a1-stats.py` hosted/standalone x desktop/mobile: focused `statsScope` option mutation count = 0 over 5 simulated days | PASS (4/4) |
| Dropdown focus + user change selection from nation to world, correct new value and integrity | PASS (4/4) |
| `python tests/browser-g4a1-local.py`: older G3 save import -> 30 day run -> diagnostic JSON + CSV downloads | PASS |
| Whole `npm test` chain | INCOMPLETE (execution time budget at long G3A test) |
| Actual original 59-year 9.6MB DEVLOG + 8.5MB CSV simulation under G4A1 | Not available as save; observational data evaluated separately |

Simulation formulas G4A unchanged. Browser tests validate focused option DOM stability; native OS expanded-list behavior still benefits from a user run on target device/browser.
