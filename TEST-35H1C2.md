# H1C2 Verification Status — 2026-10-25

- Source code baseline: V0.35H1C1.
- `npm run build`: PASS (169 protected source hashes, 165 legacy scripts, 4 styles, 1,683 columns; 62 bootstrap sources bundled; 166 hosted JS requests).
- `node tests/test-35h1c2.cjs`: PASS. H1C1↔H1C2 controlled 120-day world/RNG comparison; two reloads of the same H1C2 checkpoint remain identical for another 30 days, full event payloads, Snapshot values excluding wall-clock timings, annual records, D3A ledger; seven per-nation AI decisions captured, state read without current log entries, JSON/gzip checkpoint restoration, H1C1 input checkpoint accepted, wartime event order and real target invariant repair matched, Formation movement fields retained.
- `node tests/test-35h1c1.cjs`: PASS. Existing 90-day observation and stage metrics test still works.
- `node tests/test-35h1b2.cjs`: PASS. 166 hosted requests, 62 scripts ordered, version-only wrapper removals, migration test.
- `node tests/test-35h1c.cjs`: PASS. Existing gzip import/export checks and corrupted gzip rejection.
- `node tests/test-build.mjs`, `node tests/test-csv.mjs`: PASS.
- `node tools/telemetry-inventory.mjs`: PASS: 1,683/1,683 column classifications, **zero columns removed**.
- Full sequential `npm test`: attempted, but exceeded execution budget during historical heavyweight tests. Not claimed PASS.
- Actual 60-year user checkpoint and real Chromium desktop/mobile browser smoke: not verified here. Verify on user device before closing release.

**Limitations:** Stage-1 domain event bridge remains invoked from legacy record chain. No global Telemetry OFF test is possible yet. The AI simulation state exists as a persisted fallback for recent decisions, not a replacement for all historical AI log readers.

Additional scope note: The test deliberately compares **two loads of the same checkpoint** for 30-day replay. Continuous world versus restored world can already diverge on the historical H1B1A save pipeline; H1C2 does not claim to cure that pre-existing distinction.

Individually completed historical tests: `test-35h1b1a.cjs` PASS (25-day wartime repeat-load, movement and occupation), `test-35h0.cjs` PASS (90-day routing determinism), `test-35g1a.cjs` PASS, `test-g2a-reserve.cjs` PASS, `test-35a.cjs` PASS, `test-35h1a-parity.cjs` PASS. Other long-running historical suites were not confirmed here.
