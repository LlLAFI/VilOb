# V0.35H1B2 verification ledger

| Check | Result |
|---|---|
| Build reproducibility, protected 169 SHA, CSV V2 schema | PASS |
| 165 legacy + 1 bundled hosted JS | PASS (166 total) |
| 59 bootstrap IIFEs, original order, standalone compile | PASS |
| Nine strictly version-only header wrappers removed | PASS |
| Same-seed H1B1A↔H1B2 12-day world signature / RNG | PASS |
| B1A fixed checkpoint re-import and formation movement field preservation | PASS |
| Standard 90-day normal-world parity against H0 | PASS |
| 35A profiler regression (6-day) | PASS |
| H0 path cache regression (90-day) | PASS |
| CSV 1,683 columns and 72 duplicate names fixed | PASS |
| Full curated npm test | Not fully confirmed in constrained runtime; run locally before push |
| Real PC/mobile Chromium browser | Blocked by environment restrictions; user local validation required |
| Real 60-year wartime save A/B + complete occupation movement | User's original large file unavailable; validation required |

**Interpretation:** fewer JS requests is mechanically verified; wall-clock startup gains remain unquantified. The release intentionally preserves the prior save schema (H1B1A), including wartime rehydration behavior. No performance improvement percentage is claimed.
