# V0.34H2 GitHub Pages deployment fix

The game remains V0.34H2. This package changes only two test files; no game engine, assets, runtime UI, or build workflow changes.

- `tests/test-g2a.cjs`: five outdated expectations `V0.34H1` -> `V0.34H2`.
- `tests/test-g2a-reserve.cjs`: one outdated expectation `V0.34H1` -> `V0.34H2`.

GitHub Actions build #37 failed during `npm test` due to a stale expected release version. Build/deploy halts when tests fail.

Local: `node tools/build.mjs --check-only` PASS; test-build, test-csv, test-g2a, test-g2a-reserve, test-g3, test-g3a PASS. The complete test command exceeded local time limit; further test failures not excluded.

Commit both updated files on main, and check GitHub Actions run. GitHub Pages updates only if build and deploy both succeed.
