# H1C1 Verification Log — 2026-10-25

### PASS in this environment

- `npm run build`: protected 169 source blocks SHA `89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`, 165 JS, four CSS, 1,683 CSV V2 columns, 166 hosted JS asset requests, bundled bootstraps=61.
- `tests/test-35h1c1.cjs`: H1C vs H1C1 90 natural-day simulation, identical RNG, fingerprint, entire snapshot array values (excluding timing), yearly summary, events, full D3A food flow ledger, same internal save schema; 6 snapshots with 12 timing segments; 6 aggregate-cache and 6 Person-index cache hits; JSON checkpoint import and wartime movement field retention.
- `tests/test-35h1c.cjs`: gzip exact-text lossless roundtrip; gzip/raw import world identity and replay; corrupt gzip rejects; saved Formation next move and war assignment retained.
- `tests/test-35h1b1a.cjs`: wartime Formation movement and occupation state and subsequent progress; checkpoint repeat-load parity 25 days.
- `tests/test-35h1b2.cjs`: 166 scripts, 61 bundled modules, protected source version tags and 12-day cross-version parity.
- `tests/test-35h1a-hf.cjs`, `tests/test-35h1b.cjs`: HF/H1B regression and profiler modes.
- `tests/test-35h1a-parity.cjs`, `tests/test-35h0.cjs`, `tests/test-35g1a.cjs`, `tests/test-g2a-reserve.cjs`, `tests/test-build.mjs`, `tests/test-csv.mjs` passed independently.
- `npm run benchmark:h1c1`: Node 22 VM 90d simulation + 20 manual snapshot samples, median 205.1ms → 202.7ms (~1.2% in this narrow test, no guarantee).

### Not yet validated

- Full `npm test` sequential execution timed out during the older lengthy H1B1 suite. It was not marked PASS.
- PC and mobile Chromium real UI navigation was blocked by local environment restrictions. Browser asset initialization and interactions need user-side checks.
- No actual 60y gzip checkpoint available in this environment for 180d in-game perf A/B, Formation movement or D3A ledger memory-growth trend.
