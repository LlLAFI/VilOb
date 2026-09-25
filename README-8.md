# Village Observer V0.32C

**Revision:** `military-equipment-training-facilities-optimization1`  
**Base:** V0.32B  
**Release date:** 2026-09-26

## 1. Purpose

V0.32C is the third step of Military Society V1. V0.32A created the Person-backed military data model and V0.32B activated real Person mobilization, reserve registration, Cohort formation, Garrison persistence, and real civilian-labor removal. V0.32C connects that manpower system to the existing iron economy and introduces the first permanent military support facilities.

The version also contains **Optimization Pass #1**. This is deliberately conservative: it removes confirmed duplicate work and logging without flattening the historical simulation stack or removing high-observation-value systems.

Combat, formation movement, fortification, casualties, occupation, and war remain disabled in this release.

---

## 2. Military equipment V1

V0.32C introduces a national **serviceable military-equipment pool**. It is not synthetic manpower and does not create soldiers. Cohorts still contain exact real Person IDs inherited from V0.32B.

Equipment is an abstract set representing the mix of weapons, protective equipment, shields, fittings, spare parts, and similar military materiel appropriate to the current ancient/early-medieval technology level.

### Production requirements

Military equipment can be produced only when all of the following are present:

- at least one active `armory`;
- at least one real Person working as an ironworker in a `smithy`;
- available iron;
- available wood;
- available tools.

The provisioning process conserves existing resources. For each 1.0 equipment set produced, approximately:

- `0.72 iron`
- `0.18 wood`
- `0.045 tools`

are consumed through the existing real stock/withdrawal system.

Production rate is limited by the number of actual smithy workers and active armories. No equipment is created from technology alone.

### Equipment coverage

For the current V1, Cohort equipment coverage is calculated primarily against active soldiers:

`equipment coverage = serviceable equipment stock / active Person soldiers`

and is capped at 100%.

The equipment target also keeps a smaller reserve allowance for registered reserve soldiers so a state can build a modest mobilization stockpile.

Equipment is durable in V0.32C. Battle loss, capture, wear, and repair are intentionally deferred until combat becomes active.

---

## 3. Military facilities

Three permanent ancient-era buildings are added.

### Ancient Barracks (`barracks`)

Purpose:

- organizes a standing Garrison;
- improves Cohort training;
- improves local military supply readiness;
- provides a small equipment storage allowance.

Approximate base construction cost:

- Wood 32
- Stone 16
- Gold 6

The AI considers a first barracks after `WATCHTOWERS` once it actually maintains active Person soldiers, population is sufficiently mature, and food reserves are safe.

### Ancient Training Ground (`training_ground`)

Purpose:

- increases training quality;
- accelerates active soldiers' combat-skill growth indirectly through the Cohort training model.

Approximate base construction cost:

- Wood 20
- Stone 8
- Gold 4

The AI waits for an existing barracks, at least two active soldiers, a more mature population, and safe food reserves.

### Ancient Armory (`armory`)

Purpose:

- enables military-equipment production and distribution;
- adds equipment storage capacity;
- improves Cohort supply readiness.

Approximate base construction cost:

- Wood 26
- Stone 18
- Iron 4
- Gold 10

The AI requires `IRONWORKING`, a working iron economy, active manpower demand, and a smithy path before starting the first armory.

### Scope limit

V0.32C allows at most a very small first-generation military-facility footprint per nation. The purpose is to validate the economy/manpower connection before V0.32D introduces formation location and movement as a major map system.

---

## 4. Training and Cohort readiness

V0.32B already calculated a base Cohort training value from:

- actual members' combat skill;
- actual accumulated military service time.

V0.32C adds facility support:

- barracks: moderate training bonus;
- training ground: strong training bonus;
- armory: equipment readiness rather than direct training.

Cohort data now exposes:

- actual Person count;
- training;
- equipment coverage;
- morale;
- supply;
- map tile ID inherited from the current Garrison model.

No combat-power single score is introduced yet. The underlying components remain visible separately so future battle behavior can be diagnosed.

---

## 5. AI military construction

Military construction is deliberately conservative.

The AI evaluates only one military-facility start at a time and still passes through the existing construction/payment system. Therefore military facilities compete for:

- construction slots;
- build space;
- wood and stone;
- Gold;
- iron where applicable;
- real construction labor.

Existing V0.31H strategic iron-slot protection remains in force. Military construction does not bypass emergency food/housing logic or existing strategic financial reserves.

Recommended order under normal circumstances:

1. first standing Garrison appears through V0.32B;
2. barracks;
3. armory when Ironworking/smithy supply exists;
4. training ground in a larger stable state.

Actual order can differ when technology or resources are missing.

---

## 6. Optimization Pass #1

The V0.32B long-run data showed that the dominant simulation cost remains Person activity. At roughly 821 Persons, the observed run reached about 350 ms SIM time, with `personActEst` representing most of `villageDaily` cost. This means broad visual/UI trimming would not meaningfully solve the main scaling problem.

The optimization pass therefore focuses on confirmed redundancy and low-risk repeated work.

### 6.1 Military container ensure cache

V0.32A's compatibility `ensureMilitary` path rebuilt/checks military containers and Person military fields each time it was called. V0.32B calls this path frequently from military cleanup and planning.

V0.32C replaces the exposed compatibility ensure path with a resident-epoch-aware fast ensure:

- if the military container already has the correct shape, it is reused;
- Person field checks run again only when the resident epoch/count changes;
- births, deaths, migration membership changes, and loaded worlds still trigger revalidation.

Synthetic microbenchmark used for validation:

- 1,000 residents;
- 10,000 repeated `ensureMilitary` calls;
- V0.32B: about 482 ms in the validation browser run;
- V0.32C: about 1.5 ms.

This is a microbenchmark, not a claim that total simulation time improves by the same ratio.

### 6.2 Military roster cache

Repeated active/reserve/eligible scans used by C-level equipment/training calculations are cached per calendar day and resident epoch. The cache is invalidated after military planning and population membership changes.

### 6.3 Duplicate specialization diagnostic removed

`SPECIALIZATION_DIAGNOSTIC30A` is no longer recorded because V0.30B4 already produces the corrected `SPECIALIZATION_DIAGNOSTIC30B4` form.

No specialization decision logic is removed; only the superseded duplicate event is suppressed.

In the supplied V0.32B 74-year run there were 180 events of each form, so 180 redundant 30A entries would have been unnecessary under the C policy.

### 6.4 Treasury reserve-block event deduplication

If the same nation, tile, building type, and Gold cost generate the same `TREASURY_RESERVE_BLOCK` more than once on the same calendar day, only the first event is stored.

The supplied B run contained 583 reserve-block events, of which roughly 90 were exact same-day duplicates under this key definition.

The financial blocking logic still executes every time; only duplicate observation events are omitted.

### 6.5 Person.act review decision

The codebase currently contains a long historical wrapper chain around `Person.act`. A proposed C shortcut for active soldiers was benchmarked before release.

Result: the existing V0.32B compatibility marker (`assignment='PIONEER'`) already reaches an early return efficiently, and the extra C shortcut did not improve the measured active-soldier path. The shortcut was therefore **removed before release** rather than adding another layer of complexity.

This is an intentional optimization decision: not every old wrapper is removed merely because it looks complex.

### 6.6 Systems intentionally retained

The following were reviewed and kept:

- explicit Person simulation;
- 10-day aggregated internal-logistics observation events;
- detailed recent logistics needed by the flow map;
- historical save/load compatibility wrappers;
- existing PIONEER compatibility reservation for active soldiers.

The PIONEER reservation is admittedly inelegant, but removing it safely would require changing dozens of legacy civilian-labor, migration, frontier, maintenance, and industrial selectors. That refactor is deferred until a unified civilian/military role API can replace it consistently instead of partially.

---

## 7. Telemetry added in V0.32C

Nation/snapshot fields include:

- `militaryEquipmentStock32C`
- `militaryEquipmentCoverage32C`
- `militaryEquipmentMade32C`
- `militaryEquipmentIronUsed32C`
- `militaryEquipmentWoodUsed32C`
- `militaryEquipmentToolsUsed32C`
- `barracks32C`
- `trainingGrounds32C`
- `armories32C`
- `militaryFacilities32C`
- `militaryTrainingAvg32C`
- `militaryEquipmentAvg32C`
- `militaryActive32C`
- `militaryReserve32C`

World optimization telemetry includes:

- `v32cSuppressedLegacyDiagnostics`
- `v32cDedupedReserveBlocks`

New events:

- `MILITARY_FACILITY_STARTED32C`
- `MILITARY_EQUIPMENT_PRODUCED32C`

---

## 8. UI

The nation Military tab now shows:

- active / target;
- reserve / target;
- equipment coverage;
- serviceable equipment stock;
- average training;
- strategic concern;
- Ancient Barracks count;
- Ancient Training Ground count;
- Ancient Armory count;
- cumulative military-equipment production and material use;
- Cohort member names and current training/equipment/morale/supply.

No military map marker is added in C. Persistent on-map formation observation is reserved for V0.32D, where formation location and movement become actual gameplay/simulation state rather than a static Garrison-only marker.

---

## 9. Save compatibility

Primary save key:

`village-observer-v0-32c`

Fallback load chain includes:

- V0.32B
- V0.32A
- V0.31I / H / G / F / A / 31
- V0.30B4 / B3 / B2 / A / 30

A V0.32B world loaded into C receives empty/default military-equipment and military-facility state while preserving real Person military status, Cohorts, Garrisons, B statistics, and the entire previous simulation world.

---

## 10. Validation performed

Final validation included:

### Static/browser

- 50 inline scripts parsed with zero syntax errors.
- Chromium load: zero page errors and zero console errors.
- title/badge/runtime show V0.32C.
- serialized version: `0.32C`.
- revision: `military-equipment-training-facilities-optimization1`.

### Forced military scenario

A test nation was given:

- 50 real Persons;
- Administration / Watchtowers / Ironworking chain;
- real active/reserve mobilization;
- sufficient food/materials/Gold.

Results:

- military facility AI successfully started a barracks construction project;
- active soldiers remained real Person IDs in the Cohort;
- an armory + two real smithy workers produced 2.4 equipment sets;
- production consumed approximately 1.728 iron, 0.432 wood, and 0.108 tools;
- equipment coverage changed according to real active soldier count;
- no resource was created during provisioning.

### Logging optimization

Synthetic logging test:

- one legacy 30A diagnostic was suppressed;
- two identical same-day reserve-block attempts stored one event;
- optimization counters recorded both actions.

### B → C migration

A live V0.32B serialized world loaded into V0.32C successfully:

- active nations preserved;
- population preserved;
- C default military-equipment state created;
- re-serialization returned version `0.32C`.

### Natural regression

A fresh world ran through approximately year 9 in the headless regression:

- six nations remained active;
- no page/runtime errors;
- Gold trade audit mismatches remained 0;
- military facilities/equipment stayed at 0 before the required military/iron conditions emerged;
- 54 obsolete 30A diagnostic entries were suppressed in that run.

The user's longer real simulation remains the authoritative balance test for facility timing, equipment abundance, and economic impact.

---

## 11. What to watch in the next real run

For V0.32C, the most useful observations are:

1. first active Garrison year;
2. first barracks year;
3. first armory year;
4. first training-ground year;
5. equipment coverage by nation;
6. whether iron-poor nations remain under-equipped for a meaningful period;
7. whether military construction crowds out food/housing/iron-chain projects too aggressively;
8. cumulative military iron use versus civilian tools/industry;
9. training divergence between facility-rich and facility-poor nations;
10. SIM time around 700–1,000 Persons.

If C is stable, V0.32D can focus on the next major observer-facing step: **Formation location, map military layer, movement, and persistent on-map troop observation.**
