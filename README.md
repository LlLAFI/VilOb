# Village Observer — V0.35H1C3

Runtime: **V0.35H1C3 · Domain Integrity & Observation Hotpath V1**.

- [H1C3 scope and migration safety](README-35H1C3.md)
- [H1C3 test report and limitations](TEST-35H1C3.md)
- [H1C2 architecture, earlier AI state separation](README-35H1C2.md)
- [H1C2 Snapshot CSV 1,683-column inventory](docs/h1c2-csv-1683-inventory.json)
- [Build and GitHub Pages](BUILD-GUIDE.md)

Build: `npm run build`, then `npm test`, then commit/push. Pages retains **165 protected legacy JS + 1 bundled bootstrap JS (63 source modules)**. Internal checkpoint save schema remains **V0.35H1B1A**. Existing H1C gzip save/load and the additive H1C2 AI state are preserved. Legacy event and Snapshot observation writers are not disabled.
