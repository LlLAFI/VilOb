'use strict';
// RC4h regression lock: the 181 operational scripts preceding the release
// metadata/UI adapter must be byte-for-byte identical to the RC3 baseline.
// In the user-supplied 61-year benchmark, RC4 altered RNG and population.
// The rc4-only behavioral change was removal of F5/F5A attachWorld hooks.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const scripts=p=>[...fs.readFileSync(p,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const rc3=scripts(path.join(root,'tests/fixtures/v034Erc3-index.html'));
const fixed=scripts(path.join(root,'index-standalone.html'));
assert.equal(rc3.length,182);
assert.equal(fixed.length,182);
for(let i=0;i<181;i++){
 assert.equal(crypto.createHash('sha256').update(fixed[i]).digest('hex'),
  crypto.createHash('sha256').update(rc3[i]).digest('hex'),
  `operational script ${i} differs from deterministic RC3 baseline`);
}
assert.match(fixed[181], /V0\.34E-rc4h/);
const index=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
const f5= index.match(/NS\.Telemetry\.prototype\.snapshot=function\(w,reason='AUTO',note=''\)\{attach\(w\);updateMonetary\(w,false\);/g)||[];
const f5a=index.match(/NS\.Telemetry\.prototype\.snapshot=function\(w,reason='AUTO',note=''\)\{attach\(w\);const s=snapPrev\.call\(this,w,reason,note\);/g)||[];
assert.equal(f5.length,1,'F5 original attach missing');
assert.ok(f5a.length>=1,'F5A original attach missing');
console.log(JSON.stringify({result:'PASS',baseline:'V0.34E-rc3',candidate:'V0.34E-rc4h',operationalScriptsIdentical:181,metadataAdapterIntentionallyDifferent:1,f5AttachRestored:true,f5aAttachRestored:true}));
