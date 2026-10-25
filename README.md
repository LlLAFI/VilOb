# Village Observer — V0.35H1C2

Runtime: **V0.35H1C2 · Simulation State & Observation Separation V1**.

- [H1C2 architecture, classifications, migration boundaries](README-35H1C2.md)
- [H1C2 test report and limitations](TEST-35H1C2.md)
- [H1C2 CSV 1,683-column classification](docs/h1c2-csv-1683-inventory.json)
- [Build and GitHub Pages](BUILD-GUIDE.md)

Build: `npm run build`, then `npm test`, then commit/push. Pages retains **165 protected legacy JS + 1 bundled bootstrap JS (62 source modules)**. Internal save version remains **V0.35H1B1A**; the additive `v35h1c2` state is backward-compatible with H1C1 saves. H1C gzip save/load is retained. **Legacy telemetry writers are not switched off** in this release.
