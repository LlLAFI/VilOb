# Village Observer V0.32C1

**Revision:** `tech-tree-military-activation-stats-selector-fix`  
**Base:** V0.32C  
**Release date:** 2026-09-26

## 1. Purpose

V0.32C1 is a corrective/structural patch between V0.32C and V0.32D.

The supplied V0.32C natural run reached **92 years** with the existing economy, iron chain, Person-backed military cohorts and Gold conservation intact, but all three newly introduced military facilities remained at zero. The same run also exposed a statistics-tab usability regression where an open selector could be rebuilt/closed by live tick rendering.

C1 therefore does four things before formation movement is introduced:

1. audits the 39-technology tree and synchronizes visible descriptions with real effects;
2. selectively buffs high-cost/low-impact technologies without globally lowering research costs;
3. fixes military-facility activation, strategic slot priority and conserved Gold financing;
4. stabilizes statistics selectors while they are open/focused.

Combat and formation movement remain deferred to V0.32D/E.

---

## 2. Technology-tree audit

The global research curve is deliberately **not** reduced. V0.32C long-run data already showed meaningful technological divergence between large and small nations. C1 instead changes only specific weak/high-friction nodes and clarifies hidden effects.

### 2.1 Selective cost changes

| Technology | V0.32C | V0.32C1 |
|---|---:|---:|
| 봉수와 파수 | 540 | **500** |
| 축성술 | 570 | **500** |
| 학당 교육 | 720 | **660** |
| 공공사업 | 700 | **660** |
| 원양 항해 | 840 | **720** |

Other technology costs remain unchanged.

### 2.2 Redundant prerequisite cleanup

The following prerequisite pairs contained a parent technology that already required the other prerequisite. C1 removes the redundant edge without skipping an actual historical step:

- `WATCHTOWERS`: `SURVEYING + ADMINISTRATION` → **ADMINISTRATION**
- `FORTIFICATION`: `MASONRY + URBAN_PLANNING` → **URBAN_PLANNING**
- `COMMERCIAL_LAW`: `CURRENCY + STANDARD_WEIGHTS` → **CURRENCY**
- `SMELTING`: `IRON_MINING + MASONRY` → **IRON_MINING**

The prerequisite chain itself still forces the underlying earlier technologies where appropriate.

### 2.3 Description/effect synchronization

The technology modal now explicitly surfaces effects that were previously implemented but omitted or understated in UI text.

Key examples:

- **농경**: explicitly states that Ancient Farmstead construction is unlocked.
- **관개**: adds the implemented Farmstead worker-slot +1 description.
- **윤작**: adds the implemented Farmstead worker-slot +2 description.
- **식량 보존**: shows both spoilage reduction and starvation-risk reduction.
- **수레**: shows its logistics and starvation-risk contribution in addition to trade capacity.
- **도량형**: shows Market merchant slot +1.
- **사절단**: shows civilization-discovery and market-contact range expansion.
- **장거리 상단**: shows large discovery/contact range, Trading Post merchant slot +1 and Merchant Guild path.
- **측량 / 건축술 / 공학 / 도시화**: show the build-space bonuses already used by the urban-space system.
- **행정제도**: shows internal logistics, extra construction capacity and reserve-registration role.
- **공학**: shows industrial/quarry worker-slot growth and road-level/path improvements.
- **공공사업**: shows construction, illness and starvation effects.
- **학당 교육**: shows effective Knowledge +15%, Schoolhouse scholar slots +2 and illness-risk -8%.
- **철공**: explicitly shows Ancient Armory unlock.

---

## 3. Iron-chain Eurekas

C1 adds physical-world Eurekas to the iron chain. Eurekas still use the existing **25% research-cost bonus** system and do not directly grant technologies.

- **철광 채굴**: own at least one territory tile with a natural iron deposit.
- **제련**: have a completed Iron Mine and at least 20 Iron Ore in national stocks.
- **철공**: successfully produce Iron in a Smelter (or otherwise already hold produced Iron on migration/load).

This makes iron-rich nations enter the iron chain faster through actual resource interaction rather than a blanket research-cost cut.

---

## 4. Fortification buff

`FORTIFICATION` becomes a meaningful military-infrastructure technology rather than a minor defense-score modifier.

With 축성술:

- Palisade total defense contribution becomes **+4.0 per Palisade** (existing +2.5 plus C1 +1.5).
- Palisade wood/stone construction cost: **-15%**.
- Palisade total construction labor: **-20%**.
- **Ancient Training Ground** unlocks.
- The technology is reserved as the future prerequisite for permanent forts/strongholds and V0.32E field-fortification efficiency.

The -20% labor effect is applied per Fortification nation/project; the global Palisade base labor value is not changed.

---

## 5. Military-facility technology mapping

C1 formalizes the military support chain:

| Facility | Required technology | Additional activation conditions |
|---|---|---|
| Ancient Barracks | **WATCHTOWERS** | active Person soldiers, pop ≥ 40, food reserve ≥ 32 days |
| Ancient Armory | **IRONWORKING** | ≥2 active soldiers, Smithy, iron ≥ 5, food reserve ≥ 34 days |
| Ancient Training Ground | **FORTIFICATION** | Barracks, ≥2 active soldiers, pop ≥ 70, food reserve ≥ 38 days |

The V0.32C legacy planner can no longer start a Training Ground under WATCHTOWERS alone; the construction gate requires FORTIFICATION.

---

## 6. Military-facility activation fix

The 92-year V0.32C run had Person-backed active troops and mature iron economies, but Barracks/Training Ground/Armory counts remained zero. C1 addresses the two identified blockers.

### 6.1 Strategic construction priority

When a first-generation military facility is fully eligible:

- it is evaluated **before** normal seasonal construction;
- if the nation is at `projectCap - 1`, one slot may be reserved for the military facility;
- emergency food, critical housing/outpost, urgent defense and strategic iron-chain facilities are not blocked by this reservation;
- a freed construction slot immediately retries military activation if no higher-priority iron project occupies it first.

Events:

- `MILITARY_SLOT_RESERVED32C1`
- `MILITARY_FACILITY_ACTIVATED32C1`

### 6.2 Conserved defense finance

Barracks, Training Grounds and Armories can now use the same **strategic national funding concept** as the iron chain:

1. calculate local Settlement market surplus above its liquidity reserve;
2. include eligible remote same-nation Settlement market surplus;
3. preserve Treasury strategic reserve where possible;
4. transfer only existing Gold;
5. pay the normal build cost through the existing construction/payment path.

No Gold is created.

Event:

- `MILITARY_MARKET_POOL32C1`

The military UI and telemetry expose:

- `militaryFacilityTarget32C1`
- `militaryFacilityBlocker32C1`
- `militaryFacilityFunding32C1`
- `militaryFacilityGoldNeed32C1`
- `militaryFacilityReservedSlot32C1`

This allows future devlogs to distinguish `PROJECT_CAPACITY`, `MATERIALS`, `GOLD`, `SPACE_OR_SITE`, and no-target states instead of simply observing zero buildings.

---

## 7. Statistics selector fix

The statistics UI already contained signature-based option caching in newer layers, but the final render stack still contains several historical wrappers that can modify selector option DOM during every live render.

C1 adds a final interaction guard:

- while a statistics `<select>` is focused/open, the live simulation tick does **not** perform a full statistics redraw;
- the selector DOM therefore remains stable while the user is choosing an option;
- after focus closes/selection changes, normal live graph rendering resumes.

Covered selectors include:

- scope;
- nation;
- Settlement;
- metric;
- period;
- V0.30A/V0.31F resource selector.

This intentionally favors interaction stability over updating the chart underneath an actively open native dropdown for a fraction of a second.

---

## 8. Validation

### Static validation

- 51 inline JavaScript blocks checked with `node --check`.
- Syntax errors: **0**.

### Targeted C1 unit harness

A minimal simulation harness validates the C1 overrides independently of the browser UI:

- WATCHTOWERS cost/prerequisite patch;
- FORTIFICATION cost/prerequisite patch;
- COMMERCIAL_LAW and SMELTING redundant prerequisite removal;
- EDUCATION / PUBLIC_WORKS / OCEAN_NAVIGATION selective cost buffs;
- Fortification Palisade resource -15% and project labor -20%;
- iron-chain Eurekas;
- Barracks readiness from real active Person count;
- military market Gold financing while Treasury reserve is preserved;
- Training Ground blocked without FORTIFICATION and available with it;
- strategic construction-slot reservation;
- statistics render skipped while a selector is focused and resumed afterward.

The targeted harness completed with `ok: true`.

### Long-run validation still required

The next real natural run should specifically verify:

1. first Barracks appears naturally;
2. first Armory follows a Smithy/IRONWORKING path;
3. first equipment production occurs after Armory completion;
4. Training Ground appears only after FORTIFICATION;
5. military facilities do not crowd out emergency food/housing or the iron chain;
6. open statistics dropdowns remain stable during live ticking.

A 70–90 year run is sufficient for the first C1 validation unless military technologies emerge unusually late.

---

## 9. Compatibility

- Save version: `0.32C1`.
- Loads V0.32C through the existing compatibility chain.
- Military Cohorts remain exact real-Person membership groups.
- No combat, occupation, formation movement or synthetic manpower is introduced.
- V0.31I iron conservation and 4× geology scaling remain unchanged.
- V0.31H strategic iron industry finance/slot protection remain unchanged.
- V0.32C equipment and training formulas remain unchanged except that their required facilities can now actually activate and Training Ground is tied to FORTIFICATION.

---

## 10. Next target: V0.32D

If C1 long-run validation shows natural Barracks/Armory/Training Ground activation and stable equipment production, V0.32D can proceed to:

- persistent Formation tile locations;
- map military layer;
- Formation movement;
- Garrison ↔ field Formation transitions;
- observable troop concentrations and border deployments.

Field fortification, AI defensive lines and local combat visualization remain the following military-system steps.
