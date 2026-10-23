# V0.35H1A validation — 2026-10-23

| Check | Result |
|---|---|
| Protected C1H 169-block source manifest byte-for-byte | PASS |
| 1,683-column schema identity | PASS |
| Fresh fixed seed, two independent VM environments, 60 days | PASS |
| Browser PC 1440 and mobile 390 fixed world 110 Persons / RNG / signature match | PASS |
| Two independent imports of same 60d checkpoint, next 90 days state and RNG | PASS |
| H0 ordinary (non-fixed) world vs H1A, 90 days and RNG | PASS |
| Corrupted checkpoint RNG rejected | PASS |
| H1A dedicated local-storage save, reload, and G1A construction constants | PASS |
| Settlement D2/D2A audits on test world | PASS |
| Chromium PC/mobile startup and scenario UI, zero JS errors | PASS |
| Strict uninterrupted natural run vs mid-run checkpoint continuation | **NOT PASS — small state drift after monthly/seasonal updates** |
| 60/100/150-year natural runs and real-world H0/H1A comparative speed | NOT TESTED |
| Full `npm test` suite | NOT COMPLETED |

Do not claim H1A has yet achieved the H-series 1,000ms SIM/BATCH at 150y target.
