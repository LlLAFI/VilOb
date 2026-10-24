# Village Observer — V0.35H1C

Current runtime release: **V0.35H1C · Save Data Optimization V1**.

- [H1C feature changes, safeguards, and limitations](README-35H1C.md)
- [H1C tests](TEST-35H1C.md)
- [Build and GitHub Pages](BUILD-GUIDE.md)

Use `npm run build` then `npm test` before publishing. Hosted JavaScript remains **165 base scripts plus one combined bundle** (60 bootstraps). Save/checkpoint schema and localStorage save key **remain V0.35H1B1A**; this is intentional for wartime save compatibility. Keep the original 60-year checkpoint file as a backup.
