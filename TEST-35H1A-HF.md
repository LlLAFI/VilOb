# V0.35H1A-HF — Verification

| Verification | Status |
|---|---|
| Node build, deterministic 169-block C1H hash | PASS |
| 220 runtime JS blocks; 165 legacy scripts; four CSS; schema 1683 | PASS |
| H1A vs HF 60-day seeded-world state signature and RNG | PASS |
| Old H1A checkpoint import and old localStorage key fallback | PASS |
| Repeated checkpoint run after import (H1A-HF 90d) | PASS |
| H0 route cache and G1B migration; G1A construction | PASS |
| Food-relay and H4C stock conservation | PASS |
| Browser desktop 1440×900 & mobile 390×844 smoke | PASS; initial population 110, RNG 3074299883, signature 787a6e56dff1ce35, JS errors 0 |
| GitHub Actions-equivalent local `npm run build && npm test` | PASS (11/11 curated tests) |
| Live GitHub-hosted Pages Actions run | Requires repository push; not performed here |
| 60-year or 150-year PC natural benchmark | Not performed; this is packaging/CI hotfix |

Use `npm run build && npm test`. The historical all-versions archived test suite is no longer part of the default project ZIP; no claim is made that every historical regression was rerun.
