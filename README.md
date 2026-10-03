# Village Observer V0.33F5A1

## Stats Dropdown + Frontier Finance Gate Sync Hotfix

Base version: **V0.33F5A**  
Release date: **2026-10-03**

V0.33F5A1 is a focused stabilization patch based on the first long PC natural run of F5A. It does **not** rebalance Frontier costs, circulation ratios, fiscal reserve rates, the F5 monetary layer, War Intent, combat, occupation, or peace settlement.

The patch fixes two observed integration regressions:

1. Statistics `<select>` dropdowns closing on every simulation render tick on PC.
2. F5A Frontier finance being enforced only at payment time, while AI EXPAND feasibility and V0.32D3 diagnostics could still report the same expansion as executable / `NONE`.

---

## A1-1. Statistics dropdown stability

The previous selector protection mainly prevented repeated `<option>` replacement, but later Statistics wrappers still reassigned `.value`, changed option labels, inserted/removed options, or changed selector visibility during every tick. Desktop native `<select>` popups can close when their DOM is touched while open.

A1 adds a final strong render guard:

- if the currently focused element is any `<select>` inside `#view-stats`, the simulation tick **skips `renderStats()` entirely**;
- therefore no Statistics writer may alter option DOM, `.value`, label text, insertion/removal, or display state while the dropdown is open;
- a real user `change` event grants exactly one immediate render so the selected value is applied without waiting for an unrelated click;
- after focus leaves the selector, normal tick-based graph refresh resumes automatically.

This intentionally favors selector stability over live chart redraw while a dropdown is physically open. The simulation itself continues normally.

Telemetry adds:

- `statsRenderDeferrals33F5A1`

This counts render calls deferred by the focus guard. It is an observer/debug counter only.

---

## A1-2. Frontier finance feasibility synchronization

F5A correctly enforced the fiscal reserve at `payFrontierFinance()`, but older Frontier eligibility layers still used the legacy test `v.gold >= 6`. In the first F5A natural run this produced repeated sequences such as:

- AI chooses `EXPAND`;
- D3 reports no physical/resource blocker;
- F5A payment rejects the project because 6/7G would leave Treasury below the 40% Gold reserve floor;
- AI falls back to another action;
- the old D3 event can misleadingly report `blocker: NONE` or `SCORE`.

A1 makes the **same F5A finance quote** part of Frontier feasibility before EXPAND is treated as executable.

### V0.20 compatibility Frontier

The 6G project checks the F5A quote before `canStartFrontier20()` returns true.

### V0.21 balanced Frontier

The current best candidate is inspected first. The expected 2- or 3-Pioneer project cost is calculated as 6G or 7G and the F5A quote must pass before `canStartFrontier21()` returns true.

### V0.24 regional Frontier

The current best regional candidate is inspected, the same real 2/3-Pioneer rule determines 6G/7G, and the F5A quote must pass before `canRegionalExpand24()` returns true.

Because the existing V0.24 AI EXPAND score and autonomous Frontier pulse already depend on `canRegionalExpand24()`, this synchronizes:

- AI EXPAND availability;
- ordinary `startExpansion()` execution;
- autonomous regional expansion;
- F5A payment affordability.

No separate expansion probability or score modifier is added.

---

## A1-3. D3 expansion blocker synchronization

`expansionDiagD3()` now consults the same A1 Frontier feasibility result after its physical/population/resource checks pass.

It may therefore report the real financial cause directly:

- `FISCAL_RESERVE`
- `WAR_PREPARATION_PRIORITY`
- `INSUFFICIENT_TREASURY` where applicable

instead of falling through to `NONE` and later being converted to `SCORE` after payment rejection.

The diagnostic also carries observer fields internally:

- `financeBlocker33F5A1`
- `frontierGoldCost33F5A1`
- `frontierReserveFloor33F5A1`

Snapshot/CSV adds:

- `frontierFinanceFeasible33F5A1`
- `frontierFinanceBlocker33F5A1`

Together with the global dropdown debug field, F5A1 adds **3 CSV columns** on top of the F5A schema.

---

## A1-4. Balance intentionally unchanged

F5A1 does **not** change:

- normal Frontier nominal cost: **6G / 7G**;
- Recovery Escape nominal cost: **4G**;
- Pioneer wage share: **50%**;
- source Settlement market share: **25%**;
- actual money-supply sink: **25%**;
- normal AI Gold reserve protection: **40%**;
- Recovery AI Gold reserve protection: **15%**;
- War Chest ownership / operating-floor rules;
- physical wood / stone / food Frontier costs;
- candidate scoring, expansion chance, Pioneer counts, duration, accident risk or parallel project cap;
- F5 monetary anchor / monetary price formula;
- F5P2 War Intent 63 / 67 / 71 bands and STRONG reconnaissance;
- D2/D2A War Chest and Final Commitment;
- combat, occupation and Peace Settlement.

The 8G reserve floor observed in the F5A natural run is therefore **not rebalanced in this hotfix**. A1 first removes the feasibility/diagnostic mismatch so a later natural run can measure the reserve rule itself cleanly.

---

## A1-5. Compatibility and save chain

- Save version: `0.33F5A1`
- LocalStorage key: `village-observer-v0-33f5a1`
- Primary fallback: `village-observer-v0-33f5a`
- F5A saves are upgraded through the existing F5A loader and retain `v33f5a` finance counters.
- A1 state is stored separately as `v33f5a1`.
- Devlog / CSV / scenario export filenames use `v033F5A1`.

The original F5A finance API remains authoritative:

- `NS.V033F5A.financeQuote(...)`
- `NS.V033F5A.payFrontierFinance(...)`

A1 adds the read-only integration helper:

- `NS.V033F5A1.frontierFeasibility(...)`

---

# Retained V0.33F5A technical specification

## 1. Goal

Before F5A, active Frontier paths directly subtracted Gold from Nation Treasury:

- normal regional Frontier: **6G** for two Pioneers, **7G** for three Pioneers;
- Recovery Expansion Escape: **4G**;
- the Gold was not transferred to Person wallets or Settlement markets, so the entire amount acted as a money-supply sink.

F5A turns that payment into a real public outlay while preserving a controlled 25% sink.

For every successful Frontier Gold payment:

- **50% → participating Pioneer Person wallets**;
- **25% → source Settlement market**;
- **25% → actual money-supply sink**.

No new Gold is created.

Example for a 6G Frontier project:

- Nation spendable Treasury: -6G
- Pioneer wages: +3G total
- Source Settlement market: +1.5G
- Actual sink: 1.5G
- Expected total money-supply delta: **-1.5G**

The payment is irreversible. If the Frontier project later fails, is cancelled, loses its target tile, or loses its Pioneers, already paid wages and procurement spending are not refunded. Successful completion also creates no bonus Gold.

---

## 2. Patched Frontier paths

F5A routes the active direct-Gold Frontier paths through one common finance kernel:

1. V0.20 settlement-led Frontier compatibility path;
2. V0.21 balanced Frontier path;
3. V0.24 regional second-wave Frontier path used by later natural runs;
4. V0.33D1C Recovery Expansion Escape.

Legacy expansion code that already pays through `payBuild()` is not given a second F5A recirculation pass. This prevents double recirculation on compatibility paths.

The common entry point is exposed as:

`NS.V033F5A.payFrontierFinance(v, w, context)`

The read-only affordability calculation is exposed as:

`NS.V033F5A.financeQuote(v, w, cost, recovery)`

---

## 3. Fiscal protection

### Normal Frontier

Normal expansion preserves:

- **40% of the existing AI Gold reserve**;
- the D2A preparation/war **operating Treasury floor** when applicable;
- all Gold already separated into **War Chest**.

The effective reserve floor is the larger of the AI reserve floor and the war/preparation operating floor.

### Recovery Expansion Escape

Recovery Escape keeps its existing low 4G nominal cost and receives a softer fiscal rule so that the recovery escape mechanism is not disabled by normal peacetime reserve policy:

- **15% of AI Gold reserve** is protected instead of 40%;
- the D2A preparation/war operating floor is still fully protected;
- War Chest remains inaccessible.

### Finance block reasons

F5A records finance-stage blocks as:

- `INSUFFICIENT_TREASURY`
- `FISCAL_RESERVE`
- `WAR_PREPARATION_PRIORITY`
- `INVALID_SOURCE`
- `NO_PIONEERS`

The primary event is:

`FRONTIER_FINANCE_BLOCKED33F5A`

---

## 4. War Chest interaction

D2A War Chest remains a physically separated locked account.

F5A never withdraws from War Chest. Frontier spending only uses `v.gold`, which is the currently spendable Nation Treasury after War Chest allocation. F5A additionally reproduces the D2A-style operating floor so that Frontier projects cannot immediately consume the small Treasury buffer that preparation finance intentionally leaves available.

War Chest remains included in money-supply auditing because moving Gold into or out of War Chest is an internal account shift rather than money creation or destruction.

---

## 5. Pioneer wages and source Settlement procurement

### Pioneer wages

50% of the Gold cost is divided equally among living participating Pioneers and credited to `Person.gold29`.

The same amount is also added to `Person.income29` for accounting continuity. When `v29Stats` is available, F5A records the amount as additional wage activity.

This lets Frontier public spending re-enter the existing domestic economy through normal Person consumption.

### Source Settlement market

25% of the Gold cost is deposited into the **source Settlement** rather than the target tile.

The target tile is not yet a Settlement when expansion begins, so crediting the source market avoids creating liquidity in a non-existent market. The deposited Gold uses the existing `v29Economy.marketGold` account and participates normally in later domestic transactions, market liquidity, and fiscal circulation.

---

## 6. Money conservation audit

Every successful F5A Frontier payment performs a local conservation audit over:

- spendable Nation Treasury;
- active War Chest;
- Settlement Market Gold inside the nation;
- Gold held by living Persons in the nation.

The expected money-supply change is:

`expectedDelta = -frontierGoldCost × 0.25`

The event:

`FRONTIER_FINANCE_PAID33F5A`

records:

- project and nation IDs;
- Frontier type;
- source/target tile IDs;
- Pioneer count and IDs;
- total Gold cost;
- Pioneer wages and wage per Pioneer;
- source-market procurement amount;
- actual sink;
- Treasury before/after;
- War Chest;
- fiscal reserve floor;
- money before/after;
- expected and actual delta;
- audit difference;
- observed F5 price index;
- Recovery flag/reason where applicable.

Normal target value:

`frontierAuditMismatches33F5A = 0`

---

## 7. Telemetry and CSV

### Global fields

F5A adds:

- `frontierGoldPayments33F5A`
- `frontierGoldCost33F5A`
- `frontierGoldWages33F5A`
- `frontierGoldMarket33F5A`
- `frontierGoldSink33F5A`
- `frontierFinanceBlocks33F5A`
- `frontierAuditChecks33F5A`
- `frontierAuditMismatches33F5A`
- `recoveryFrontierPayments33F5A`

### Nation fields

F5A adds:

- `frontierGoldCostNation33F5A`
- `frontierGoldWagesNation33F5A`
- `frontierGoldMarketNation33F5A`
- `frontierGoldSinkNation33F5A`
- `frontierFinanceBlocksNation33F5A`
- `frontierStartsFinanceNation33F5A`
- `recoveryFrontierPaymentsNation33F5A`
- `frontierReserveFloor33F5A`
- `frontierTreasuryHeadroom33F5A`

F5P2 expected 1177 CSV columns. F5A appends 18 fields, so a fully populated F5A schema is expected to reach **1195 columns** when all inherited layers are present.

---

## 8. UI

The Nation Economy view receives a compact **F5A Frontier Finance** observer showing:

- cumulative Frontier Gold outlay;
- cumulative Pioneer wages;
- cumulative source-market procurement;
- cumulative actual sink;
- active Frontier project count;
- fiscal block count;
- normal/Recovery reserve policy.

The global runtime status also displays cumulative F5A finance and audit mismatch counts.

---

## 9. Pricing scope

F5A intentionally does **not** multiply Frontier Gold costs by the F5 monetary price index.

Nominal Frontier costs remain:

- 6G for a normal two-Pioneer Frontier;
- 7G for a normal three-Pioneer Frontier;
- 4G for Recovery Expansion Escape.

The current F5 price index is written to Frontier finance telemetry only as an observer field. This keeps the F5A natural-run comparison focused on circulation and reserve ownership rather than mixing it with a new nominal-cost rebalance.

---

## 10. Unchanged systems

F5A does not intentionally change:

- Frontier candidate scoring;
- autonomous expansion probabilities;
- parallel Frontier project limits;
- Pioneer selection/count rules;
- wood, stone, and food costs;
- expansion duration;
- accident, injury, death, and supply-risk rules;
- Settlement maturation and reinforcement;
- F5/F5P2 Monetary Anchor and price formula;
- War Intent 63/67/71 bands and STRONG reconnaissance;
- D2/D2A War Chest, READY, rally locks, and Final Commitment;
- combat power, casualties, occupation, War Goals, or Peace Settlement;
- equipment attrition and iron/iron-ore military demand propagation.

Equipment loss/recovery and military iron-demand propagation remain follow-up war-economy work.

---

## 11. Save compatibility

New save key:

`village-observer-v0-33f5a`

Load fallback order starts with:

- V0.33F5P2
- V0.33F5P1
- V0.33F5
- V0.33F4
- V0.33F3
- V0.33F2
- V0.33F1
- V0.33F

Exports use the `village-observer-v033F5A-*` filename prefix.

Scenario export sets `intendedVersion` to `0.33F5A`.

---

## 12. Verification performed for this patch

Static validation:

- all **105** inline JavaScript blocks in `index.html` passed `node --check`;
- V0.20, V0.21, V0.24, and D1C Recovery direct Frontier Gold paths were connected to the F5A common finance function.

Finance unit checks on the F5A kernel:

### 6G normal Frontier

Observed result:

- Treasury: `100 → 94`
- two Pioneer wallets: `+1.5G` each
- source Settlement market: `+1.5G`
- total money delta: `-1.5G`
- audit difference: `0`

### Reserve behavior

- normal Frontier with Treasury 10G / AI reserve 20G / cost 6G: blocked as `FISCAL_RESERVE`;
- same state as Recovery Escape: passes under the relaxed 15% reserve floor;
- active war-preparation floor can block an otherwise affordable Frontier as `WAR_PREPARATION_PRIORITY`.

A long natural-run balance test is still required to evaluate Frontier frequency, long-term Treasury distribution, money-location shifts, and F5 price-level response.

---

## 13. Natural-run acceptance targets

For the first F5A natural run, prioritize:

1. `frontierAuditMismatches33F5A == 0`;
2. Frontier starts do not collapse relative to F5P2 solely because of an excessively strict reserve floor;
3. PREPARING nations no longer repeatedly consume their protected fiscal buffer for Frontier expansion;
4. Frontier Gold visibly moves into Person and Settlement accounts and later re-enters consumption/tax circulation;
5. the F5P2 monetary anchor and price-index path remain stable under the reduced Frontier money sink;
6. Recovery Escape remains usable for genuinely stuck nations.

