/* V0.34E-rc4h: deterministic hotfix.
 * The rc4 F5/F5A Snapshot shortcut removed observable attachWorld side
 * effects (including Settlement cache invalidation). On the user's real
 * 61-year save it changed population 556->558 and RNG calls by +156.
 * Restore BOTH original Snapshot attach(w) paths byte-for-byte, while retaining
 * rc4's separately guarded diagnostic profiler and browser A/B tool.
 * The legacy immutable source manifest is still protected by build.mjs.
 */
export function e4Transform(file, source) {
  if (file === 'src/legacy/119.js') {
    const anchor = "NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){attach(w);updateMonetary(w,false);";
    if (!source.includes(anchor)) throw Error('RC4h F5 Snapshot original attach anchor missing');
  }
  if (file === 'src/legacy/122.js') {
    const anchor = "NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){attach(w);const s=snapPrev.call(this,w,reason,note);";
    if (!source.includes(anchor)) throw Error('RC4h F5A Snapshot original attach anchor missing');
  }
  return source;
}
