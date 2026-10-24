# V0.35H1C validation

Commands: `npm run build`, `node tests/test-35h1c.cjs`, `node tests/test-35h1b2.cjs`, `npm test`.

The H1C test boots generated standalone distribution into a Node VM with standards-compatible CompressionStream/DecompressionStream, serializes an actual H1A fixed world, produces gzip, inflates it via an independent Node zlib implementation and byte-compares the JSON to the previous unchanged H1A scenario. It then imports both JSON and gzip through H1A validation, checks serialized states except legacy nondeterministic `createdAt`, replays RNG/state, verifies invalid gzip failure, size attribution, latest military formation rehydration fields and bundling.

H1B2 baseline test checks 12-day fixed-seed parity, legacy H1B1A checkpoint import, script count, 60-bootstraps concatenation and 9 version-only wrapper removals. Build/CSV checks verify 169 protected blocks, 43 tech, 1683 columns and 72 header duplicates corrected.

**Not automatically proven:** full 60-year 140MB browser gzip performance, all large-file heap allocation, cold/warm load improvement, wartime campaign outcome parity beyond provided smaller regressions, direct mobile browser execution, continuous-world vs restored-world parity (existing difference), and actual 150-year natural SIM/BATCH target.
