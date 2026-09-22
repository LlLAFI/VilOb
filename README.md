# Village Observer V0.11

V0.11 focuses on infrastructure realism, timed construction, richer resident happiness, and the first planning layer for the future AI V3 architecture.

## Version policy
V0.11 continues the pre-1.0 line. Future versions proceed as V0.12, V0.13, etc. The project does not automatically advance to V1.0.

## Major changes

### Encyclopedia UI persistence
- The Balance Encyclopedia remembers the last selected page while the simulation continues.
- Production/Resources, Logistics/Roads, Technology, etc. no longer reset to Buildings on each UI refresh.

### Building condition now scales effects
- Condition 70–100%: 100% building effect.
- Condition below 70%: effect decreases linearly toward zero.
- Condition 0%: building is inactive and provides no effect.
- Scaled systems include housing capacity, storage capacity, farmstead/quarry production bonuses, roads, trading posts, and palisade defense.
- UI distinguishes degraded buildings (yellow) from fully inactive buildings (red).

### Building collapse and frontier ruins
- Most buildings collapse after prolonged time at 0% condition.
- Outposts have a shorter 0%-condition grace period: 4 seasons.
- A collapsed frontier outpost is recorded as a building ruin.
- A tiny undeveloped frontier settlement can be abandoned and converted into a map ruin when its outpost collapses.
- Town halls and houses remain protected from automatic deletion to avoid uncontrollable housing cascades, but at 0% they provide no effect.

### Timed construction
Buildings are no longer completed instantly. Resources are committed when construction starts, then local labor advances the project over time.

Base construction work-days:
- Road: 45
- Farmstead: 60
- House: 75
- Palisade: 90
- Granary: 90
- Outpost reconstruction: 90
- Warehouse: 110
- Quarry: 120
- Trading post: 120
- Market: 150

Local adult workers and building skill affect daily construction progress. Projects can stall when a settlement has no adult labor.

### Capital roads
- The capital is no longer excluded from road construction.
- After Roads technology, the capital is the first road candidate before the network expands outward.

### Thinner road rendering
- Road lines are roughly two-thirds of their V0.10 visual thickness.
- Lv.1/Lv.2/Lv.3 road distinctions remain visible.

### Happiness system expansion
Resident happiness remains an individual 0–100 stat, but is no longer pulled almost uniformly toward ~65.
It now responds to:
- hunger and food security
- health and energy
- local housing pressure
- local building condition
- security/threat
- relationships and nearby parents
- employment
- recent relocation
- national food crisis

Happiness has a modest productivity effect of approximately -12% to +12% at the extremes.
Low happiness also reduces willingness to join pioneer groups unless risk tolerance is high. Existing birth behavior continues to use maternal happiness.

### AI V3 groundwork
V0.11 still uses Utility AI for the final seasonal action, but now maintains a planning layer above it.
Each nation calculates:
- a simple one-year forecast for population, food, wood, stone, and Gold
- its top three strategic goals
- resource reserves for food, maintenance, housing, expansion, and trade

Possible goals include Food Stability, Infrastructure Recovery, Housing Expansion, Timber Security, Territorial Expansion, Trade Network Growth, and Living Standards.
These goals influence Utility scores and are recorded in telemetry. This is groundwork for a later architecture where national goals and settlement-level actions are separated more fully.

### UI / telemetry
- Nation overview shows average happiness, construction count, top strategic goals, one-year forecast, and reserved resources.
- Resident list shows current happiness and happiness target.
- Settlement cards show effective housing capacity, local average happiness, degraded/inactive building states, and construction progress.
- Devlog adds building degradation/reactivation, construction start/completion/stall, AI goals, forecast, reserves, happiness distribution, and construction project counts.

## Compatibility
- Loads V0.8, V0.9, V0.10, and V0.11 saves.
- Saves created in V0.11 use the V0.11 schema.

## Validation performed
- 20-year autonomous simulation completed with all four nations active in the validation run.
- Capital road project correctly starts on the capital and takes time to finish.
- 35% building condition produces 50% effect; 0% provides no effect.
- Outpost 0%-condition collapse grace behavior verified.
- Save/load and V0.10-to-V0.11 migration verified.
- 100×100 map, 600-day Node simulation completed in approximately 1.7 seconds in the validation environment.
