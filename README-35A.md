# V0.35A — 성능 기준선 및 정밀 프로파일러

**V0.34H4C를 기준으로 게임 규칙은 변경하지 않은 진단 전용 패치입니다.**

- 세계 탭 → 고급 도구 → `35A · 정밀 성능 계측`에서 **계측 시작**을 누릅니다. 실제 게임을 30~90일 이상 진행한 뒤 **계측 종료** → **계측 JSON**으로 작은 보고서를 저장하세요.
- 프로파일러는 기본적으로 꺼져 있으며, 켜면 22개 주요 메서드의 호출 횟수·샘플 시간·대략적인 포괄 실행시간을 측정합니다. 종료 시 원래 실행 메서드를 정확히 복원합니다.
- `estimatedInclusiveMs`는 하위 함수의 시간을 포함하므로 **행별 합계를 전체 시간으로 사용하면 안 됩니다.** 프로파일러를 켠 상태의 성능과 끈 상태의 성능도 직접 비교하지 않습니다.
- 동일 세이브 H4C↔35A A/B는 사용자의 PC에서 `npm run bench:35a -- --save "경로/90년세이브.json" --days 30 --runs 3 --warmup 3 --output 35a-ab.json`으로 실행할 수 있습니다. 원본 세이브를 업로드할 필요는 없습니다.
- 실제 90년 실세이브 A/B와 150년 성능 기준은 **아직 검증하지 않았으며** 성능 개선을 주장하지 않습니다. 처음 전달해 줄 파일은 계측 JSON이면 충분합니다.

---

# Village Observer V0.35A — Performance Baseline & Profiler V2

**Final V0.34 baseline:** `V0.34H4C`. **Patch intent:** profiling/measurement only, no simulation balance or scheduling changes.

## Changes

1. **Opt-in 35A profiler:** `세계` → `고급 도구` → `35A · 정밀 성능 계측`. Click `계측 시작`, allow the game to progress normally, then `계측 종료` and `계측 JSON`. The profiler is OFF by default, attaches 22 low-frequency timing probes only on demand and restores original function identities when stopped. Sampling is deterministic by local call counter, without consuming RNG.
2. **Scope:** total `World.advanceOneDay`, Person.act/metabolism, daily/seasonal/yearly nation work, AI seasonal decisions, construction, maintenance, internal logistics, resource deposits/withdrawals, and UI render. Each row records calls, timed calls, estimated inclusive time, sampled mean/p95/peak, and top-10 method estimates; annual sampled day statistics are included. Memory hint is included only when supported by the browser.
3. **Two performance measures intentionally separate:** F0's in-game smoothed 10× `SIM/BATCH` target remains the official 150-year metric. The opt-in 35A method timer contains its own overhead, **inclusive times overlap** and must **not** be summed into a global total. For actual speed comparisons, use the **unprofiled** A/B script.
4. **Local A/B script:** `tools/bench-35a.cjs`, compares the exact preserved `tests/baselines/index-H4C.html` with `index-standalone.html`, independently loading the same save, reseeding deterministic RNG and performing repeated alternated-order Node VM `World.advanceOneDay` trials. Reports median ms/day, input/final state hashes and RNG call count; optional separately instrumented candidate run.
5. Hosted GitHub Pages + Standalone distribution, 169 protected C1H blocks, 43 technology nodes and Snapshot CSV v2 1683 columns are maintained. No data-model migration except the version wrapper. Old H4C Save JSON remains importable; new 35A saves are only version-upgraded with no profiler fields.

## How to collect a report from an existing 90-year Save

Use the **H4C Save JSON**, not the Snapshot CSV or diagnostic JSON. Import it into V0.35A normally. Open `세계` → 고급 진단. Click `계측 시작`; run for at least 30–90 calendar days (longer to include several season boundaries); click `계측 종료` and `계측 JSON`. Share the much smaller `vilob-v035A-profile-*.json`. Do **not** send the original large Save file. Profiling is not necessary for normal play and should remain disabled otherwise.

## H4C vs V0.35A objective A/B (local Node.js >=18)

From the downloaded project root:

```bash
npm run build
npm run bench:35a -- --save "/path/to/your/90y-save.json" --days 30 --warmup 3 --runs 3 --output "35a-ab-90y.json"
```

To add a **separate** 35A method breakdown (not part of the unbiased A/B speed comparison):

```bash
npm run bench:35a -- --save "/path/to/your/90y-save.json" --days 30 --warmup 3 --runs 3 --profile --output "35a-ab-and-profile-90y.json"
```

If no `--save` is supplied, the command uses a **new synthetic 19×19 world** and must not be presented as a 90-year performance result. The script's measurement is Node VM total simulated day time, **not** actual browser 10× SIM/BATCH or wall time, and a single short run does not prove a speedup. `matchedStartEndStateAndRng` must be true for a trustworthy A/B comparison.

## Decisions / boundaries

- 35A **does not** optimize code yet and makes no claim to have reached 1,000ms / 150 years.
- Original C1H source is hash-protected and untouched; protected block refactoring deferred.
- No Web Worker, multi-threading, AI change, Person-aggregation or removal of actual stock transfer.
- Profiler report is transient, not saved to Save JSON or Snapshot CSV. Runtime overhead is observable only while explicitly enabled.
- Open performance issues: 90-year H4C F0 mean about 3,225ms and the 150-year PC target remains unverified. The original real 90y save is not in the package, so first-hand local A/B requires the user to supply it on their computer.

See `TEST-35A.md` for actual verification status.
