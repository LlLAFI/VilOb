# Village Observer V0.10

V0.10 focuses on national AI decision quality, a scarcer timber economy, road progression, settlement maintenance visibility, and an in-game balance encyclopedia.

## Major changes

### Nation overview
- The Nation > Overview screen now shows total food in addition to average/minimum reserve days.
- A compact AI assessment shows the nation's current strategic mode, wood stock relative to target, and inactive-building share.

### Timber economy
Natural wood regeneration was reduced substantially:
- Plain: 0.012/day
- Grass: 0.028/day
- Forest: 0.220/day
- Rock: 0.008/day
- Mountain: 0.015/day

Internal logistics now redistributes wood roughly every 15 days when one settlement has a large surplus and another is short. Timber-surplus nations also stage wood at trading posts, and autonomous trade values wood imports more strongly when the buyer has low timber stocks or poor natural timber reserves.

### Smarter AI
The utility AI now evaluates multiple signals together instead of leaning mainly on one national statistic:
- population-weighted food stress
- average food reserve
- housing occupancy
- wood and stone stocks versus target
- inactive-building share / average condition
- reachable trade partners
- settlement density and years since the last expansion
- frontier availability, settler availability, threat and relations

Each nation also keeps short policy memory. Repeating the same non-urgent policy for many seasons gains a diminishing score, while genuinely urgent problems can still keep the same policy active. AI decision logs now include `strategyMode`, detailed signals, and repeat penalties.

### Housing strain
Residents living in settlements whose active housing capacity is below population accumulate housing strain. Prolonged strain gradually affects energy, happiness, then health, and makes migration toward settlements with real active capacity more attractive.

### Settlement maintenance UI
Nation > Settlements now shows per-settlement seasonal upkeep requirements:
- wood
- stone
- local labor

Inactive buildings are individually highlighted in yellow and display their current condition. The summary line is also yellow only when an inactive building exists.

### Roads
Road bonuses now apply only to tiles that actually contain an active road building. Owning the Roads technology no longer turns every owned tile into a road implicitly.

Road levels automatically improve with technology:
- Lv.1 Dirt Road — Roads technology — path cost x0.78
- Lv.2 Stone Road — Engineering — path cost x0.62
- Lv.3 Trunk Road — Urbanization — path cost x0.48

Road tiles and adjacent road connections are visible on the map, with R1/R2/R3 markers.

### Trade routes
Recent trades are grouped by route before rendering. Repeated trades over the same endpoints therefore remain a dashed line instead of multiple dashed lines stacking into an apparent solid line. Routes remain visible for 180 days and fade with age.

### Balance Codex
A new `Codex` bottom tab contains live V0.10 balance values:
- building construction costs
- seasonal maintenance costs and labor
- building capacity/storage/effects
- resident production formulas
- terrain regeneration values
- expansion cost
- internal logistics rules
- road levels and path modifiers
- all technology costs and effects

This is intended to reduce the need to inspect source code or ask externally whenever a balance value is needed.

## Compatibility
- V0.10 saves load directly.
- V0.9 and V0.8 saves can be migrated into V0.10.
- V0.10 uses its own localStorage key: `village-observer-v0-10`.

## Versioning
The project remains in the 0.x series. The next versions are expected to be V0.11, V0.12, and so on. It will not become V1.0 unless explicitly requested.
