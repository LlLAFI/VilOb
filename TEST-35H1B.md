# V0.35H1B verification checklist

- [x] Node package build, source integrity 169 blocks / SHA, 165 source scripts, 1,683 CSV columns.
- [x] 35H1B 90-day baseline H1A-HF vs H1B fixed-seed signature/RNG parity.
- [x] Existing H1A/HF checkpoint and HF-save compatibility.
- [x] H1B BASELINE/35A/35C/35D independent profiling start → days → stop and corresponding reports.
- [x] 12 source-backed regression scripts, CI identical `npm test`.
- [x] PC and mobile Chromium UI control existence and H1B badge, 10-day baseline session, no JS errors.
- [ ] Actual 60y checkpoint (locally held by user) with profiler-OFF 180-day A/B on same PC.
- [ ] H1B field diagnostic 35A (180d), 35C/D (360d each) from independently reloaded same checkpoint.
- [ ] 360-day natural-run comparison at 60y world scale and 150-year pass.

The stage metrics are inclusive, may overlap with legacy layers. No duplicate engine cache added. The single-pass census transform preserves all original tests but carries only a small targeted efficiency gain until proven by late-game A/B.
