# H1B1 Regression and Acceptance

1. `npm run build`, `npm test` (expected 13 static tests).
2. `node tests/test-35h1b1.cjs`: H1B↔H1B1 120-day same-seed RNG/state; normalized telemetry snapshots; old checkpoint restored; legacy-load-induced field mutation recovered only when source JSON signs correctly; JSON corruption and missing Person rejected; 30-day optional snapshot probe preserves state/RNG/rows.
3. `python tools/browser-35h1b-smoke.py`: Chromium desktop 1440x900 / mobile 390x844, version, old four diagnostics, H1B1 180-day button, checkpoint-diagnostic JSON button, zero page errors.
4. `node tests/test-35h1a-hf.cjs`, `node tests/test-35h1a.cjs`, `node tests/test-35h1a-parity.cjs`, `node tests/test-35h0.cjs`, and preserved G1B/G1A/H4C/economy regressions.
5. Raw 140MB 60-year checkpoint was not available to this automated suite; its full compatibility needs a local user-run acceptance test. Never disable the stored signature check to work around a failure.

Performance metrics are inclusive where marked. The selected six segment boundaries overlap as nested layers. Snapshot logging preserves the original cadence and CSV layout. Improvement magnitude must be measured on the same checkpoint/device, profiler OFF.
