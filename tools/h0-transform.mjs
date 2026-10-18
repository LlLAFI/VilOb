// H0 transformations are deliberately tiny and anchor-checked; C1H blocks stay SHA-protected.
export function h0Transform(source, data) {
  if (source === 'src/legacy/163.js') {
    const anchor="const status=this.q?.('runtimeStatus');if(status)status.textContent='✓ '+VERSION+' · 연간 진단 최적화';";
    if (!data.includes(anchor)) throw Error('H0: legacy annual-diagnostics success banner anchor missing');
    // The profiler itself, snapshot CSV, save chain, and renderWorld profiler remain intact.
    return data.replace(anchor, '/* H0: retired redundant C1G success banner; diagnostics retained. */');
  }
  if (source === 'src/bootstrap/v034g5.js') {
    const anchor='version:NS.RELEASE_VERSION===VERSION';
    if (!data.includes(anchor)) throw Error('H0: G5 integrity version anchor missing');
    // Parent G5 component check must remain valid when the H0 release wrapper is active.
    return data.replace(anchor,"version:(NS.RELEASE_VERSION===VERSION||NS.RELEASE_VERSION==='V0.34H0')");
  }
  return data;
}
