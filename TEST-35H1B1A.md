# V0.35H1B1A validation

- `node tools/build.mjs`: current hosted/standalone builds; legacy 169 SHA (`89e9863745b5c0dfcf30ecd2b44ec3d1befd28cc8ab1abb2392d3cd495ec8a64`) unchanged; 43 technologies; CSV 1683 columns.
- `node tests/test-35h1b1a.cjs`: wartime checkpoint with E5 occupation, E4A movement; full formation war/tactical fields retained; occupation state retained; 25-day reload/reload RNG and state parity; nonzero uncontested occupation progress; physical movement observed.
- `node tests/test-35h1b1.cjs`: previous checkpoint integrity/diagnostic regression.
- `node tests/test-35h1b.cjs`: independent baseline/A/C/D profiler diagnostics, legacy save intake and RNG-state equivalence.
- `node tests/test-35h1a.cjs`, `node tests/test-35h1a-parity.cjs`: natural fixed-seed and RNG parity.
- `npm test`: all curated regressions when available; final release should be pushed only if `npm test` passes on a local Windows clone and GitHub Actions.

**Not certified locally:** real user 60y/~140MB checkpoint; PC/mobile Chromium UI smoke if browser access blocked; uninterrupted world vs reloaded world across *all* latent historical state.
