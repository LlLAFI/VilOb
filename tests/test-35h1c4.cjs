'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},remove(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,Response,CompressionStream,DecompressionStream,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},confirm(){return true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;vm.createContext(c);const html=fs.readFileSync(path.join(root,file),'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}return c.VSim;
}
const stable=x=>JSON.stringify(x,(k,v)=>k==='realTime'||/^(?:elapsed|wall|cpu|profile|perf|memory|heap|duration)/i.test(k)||/(?:Ms|milliseconds)(?:\d+[A-Z0-9]*)?$/i.test(k)?undefined:v);
(async()=>{
 const old=boot('tests/fixtures/v035H1C3-standalone.html'),cur=boot('index-standalone.html');
 assert.equal(old.RELEASE_VERSION,'V0.35H1C3');assert.equal(cur.RELEASE_VERSION,'V0.35H1C4');
 const a=old.V035H1A.createWorld(),b=cur.V035H1A.createWorld();
 for(let i=1;i<=60;i++){a.advanceOneDay();b.advanceOneDay();if(i%15===0){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG day '+i);assert.equal(old.V035H1A.fingerprint(a),cur.V035H1A.fingerprint(b),'world '+i);}}
 assert.equal(stable(a.telemetry.entries),stable(b.telemetry.entries));assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots));assert.equal(stable(old.V034D3A.stats(a)),stable(cur.V034D3A.stats(b)));
 assert.equal(b.serialize().version,'V0.35H1B1A');assert.equal(cur.V034D3.audit(b).ok,true);
 const blob=await cur.V035H1C.gzipCheckpoint(b,{download:false}),decoded=await cur.V035H1C.textFromCheckpoint(blob.blob),loaded=await cur.V035H1A.importCheckpoint(decoded.text);
 assert.equal(cur.V035H1A.fingerprint(loaded),cur.V035H1A.fingerprint(b));
 cur.V035H1C1.start(b);for(let i=0;i<15;i++)b.advanceOneDay();cur.V035H1B1.stopSnapshot();
 const stages=cur.V035H1C1.report(b).snapshot.stages;
 const expected=cur.V035H1C4.report().stageNames;
 const present=expected.filter(k=>stages[k]?.calls>0);
 assert(present.length>=3,`too few H1C4 stage boundaries: ${present.join(',')} / ${expected.join(',')}`);
 console.log(JSON.stringify({status:'PASS',days:60,worldRNGObservationParity:true,gzip:true,newStageCount:present.length,stages:present,legacyProtected:true}));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
