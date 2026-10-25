'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(html){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const local=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date,performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v),removeItem:k=>local.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);
 for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(!m[1].trim())continue;try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}}
 return c.VSim;
}
(async()=>{
 const source=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8'),N=boot(source);
 assert.equal(N.RELEASE_VERSION,'V0.35H1C2');assert.equal(N.TECH_ORDER.length,43);
 assert(N.V035H1C&&N.V035H1B1A&&N.V035H1B2,'new and old bootstrap intact');
 assert.equal(N.V035H1B2.report().version,'V0.35H1B2','old startup profiler intact');
 const w=N.V035H1A.createWorld();for(let i=0;i<4;i++)w.advanceOneDay();
 const reference=N.V035H1A.scenario(w),text=JSON.stringify(reference);
 const zipped=await N.V035H1C.gzipCheckpoint(w,{download:false});
 assert(zipped.blob.size<Buffer.byteLength(text)/2,'gzip compresses checkpoint');
 const decompressed=zlib.gunzipSync(Buffer.from(await zipped.blob.arrayBuffer())).toString('utf8');
 assert.equal(decompressed,text,'uncompressed gzip JSON must match existing checkpoint byte for byte');
 assert.equal(zipped.report.signature,reference.perf.stateSignature);
 const raw=new Blob([text]);raw.name='checkpoint.json';const gz=zipped.blob;gz.name='checkpoint.json.gz';
 const fromRaw=await N.V035H1C.importCheckpoint(raw),fromZip=await N.V035H1C.importCheckpoint(gz);
 assert.equal(N.V035H1A.fingerprint(fromRaw),N.V035H1A.fingerprint(fromZip),'world signature same');
 assert.equal(fromRaw.v35h1a.rngState,fromZip.v35h1a.rngState,'RNG same');
 {const sa=fromRaw.serialize(),sb=fromZip.serialize();const normalize=o=>{const clone=JSON.parse(JSON.stringify(o));if(clone.testScenario)delete clone.testScenario.createdAt;if(clone.v32e11?.scenario)delete clone.v32e11.scenario.createdAt;return clone;};assert.deepEqual(normalize(sa),normalize(sb),'all serialized fields match except preexisting nondeterministic scenario createdAt');}
 for(let i=0;i<4;i++){fromRaw.advanceOneDay();fromZip.advanceOneDay();assert.equal(N.V035H1A.fingerprint(fromRaw),N.V035H1A.fingerprint(fromZip),'replay world '+i);assert.equal(fromRaw.v35h1a.rngState,fromZip.v35h1a.rngState,'replay RNG '+i);}
 const tampered=new Blob([new Uint8Array([0x1f,0x8b,0x08,0x00,0xaa,0x00,0x00,0x00])]);tampered.name='bad.json.gz';
 await assert.rejects(()=>N.V035H1C.importCheckpoint(tampered),/gzip 압축 해제/);
 const wrong=new Blob([text]);wrong.name='bad.json.gz';await assert.rejects(()=>N.V035H1C.importCheckpoint(wrong),/gzip 헤더/);
 const report=N.V035H1C.sizeReport(w);assert(report.topLevelFields.length>10);assert(report.estimateBytes>0);
 assert.equal(N.SaveSystem.exportH1ACheckpoint&&typeof N.SaveSystem.exportH1ACheckpoint,'function','legacy JSON retained');
 assert.equal(typeof N.SaveSystem.exportH1CGzipCheckpoint,'function');
 // Important defense against regression: the H1B1A legacy Formation rehydrator must be retained.
 const f=N.MilitaryFormation.from({id:'H1C-F',tileId:7,v33dAssignedWarId:'war0',v33c1NextMoveCal:889,cohortIds:['c1']});
 assert.equal(f.v33c1NextMoveCal,889);assert.equal(f.v33dAssignedWarId,'war0');
 const bundle=fs.readFileSync(path.join(root,'dist/hosted/assets/bootstrap/v035h1c2-bundle.js'),'utf8');
 assert.equal((bundle.match(/\/\* H1B2 bundled source:/g)||[]).length,62);
 assert.equal([...fs.readFileSync(path.join(root,'dist/hosted/index.html'),'utf8').matchAll(/<script\b/g)].length,166);
 console.log(JSON.stringify({status:'PASS',version:N.RELEASE_VERSION,originalBytes:Buffer.byteLength(text),gzipBytes:zipped.blob.size,ratio:+(zipped.blob.size/Buffer.byteLength(text)).toFixed(4),gzipUnchanged:true,rawGzipFullStateParity:true,replayDays:4,formation:true,csv:1683,hostedScripts:166}));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
