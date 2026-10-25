'use strict';
/* H1B2: identical simulation, legacy save format, strict bundle order, UI version. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const hosted=read('dist/hosted/index.html'),rootIndex=read('index.html'),bundle=read('dist/hosted/assets/bootstrap/v035h1c3-bundle.js');
assert.equal([...hosted.matchAll(/<script\b/g)].length,166,'165 protected legacy + one bundle');
assert.equal([...rootIndex.matchAll(/<script\b/g)].length,166,'GitHub Desktop root hosted path');
assert.equal((hosted.match(/v035h1c3-bundle\.js/g)||[]).length,1);
assert.equal((bundle.match(/\/\* H1B2 bundled source:/g)||[]).length,63);
assert.deepEqual(fs.readdirSync(path.join(root,'dist/hosted/assets/bootstrap')),['v035h1c3-bundle.js'],'only bundled bootstrap published');
assert(!hosted.includes('v035h1b1a.js?'), 'old bootstrap not separately requested');
assert(!hosted.includes('V0.35H1B1A</button>'), 'version stamped before runtime');
assert.equal((bundle.match(/H1B2: redundant version-only UI wrapper omitted/g)||[]).length,9);
for(const chunk of bundle.split('/* H1B2 bundled source: ').slice(1)){
 const name=chunk.slice(0,chunk.indexOf(' */'));assert(name.endsWith('.js'),'source boundary');
}
new vm.Script(bundle,{filename:'v035h1c3-bundle.js'});
function boot(html){let seed=514;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const store=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date:class extends Date{static now(){return 1770000000000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};
 c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {N:c.VSim,store};
}
(async()=>{
 const prev=boot(read('tests/fixtures/v035H1B1A-standalone.html')),cur=boot(read('index-standalone.html'));
 assert.equal(prev.N.RELEASE_VERSION,'V0.35H1B1A');assert.equal(cur.N.RELEASE_VERSION,'V0.35H1C3');
 assert.equal(cur.N.V035H1B2.report().version,'V0.35H1B2');
 assert.equal(cur.N.TECH_ORDER.length,43);
 const a=prev.N.V035H1A.createWorld(),b=cur.N.V035H1A.createWorld();
 assert.equal(prev.N.V035H1A.fingerprint(a),cur.N.V035H1A.fingerprint(b),'initial signature');
 for(let i=0;i<12;i++){a.advanceOneDay();b.advanceOneDay();if(i%3===2){assert.equal(a.v35h1a.rngState,b.v35h1a.rngState,'RNG day '+i);assert.equal(prev.N.V035H1A.fingerprint(a),cur.N.V035H1A.fingerprint(b),'state day '+i);}}
 const stable=x=>JSON.stringify(x,(k,v)=>/^(realTime)$|(?:Ms|milliseconds|perf|Performance|Heap|latency|duration|timings)/i.test(k)?undefined:v);
 assert.equal(stable(a.telemetry.snapshots),stable(b.telemetry.snapshots),'simulation snapshot values excluding clock metrics');
 assert.equal(b.serialize().version,'V0.35H1B1A','save schema deliberately unchanged');
 const saved=JSON.stringify(prev.N.V035H1A.scenario(a));const loaded=await cur.N.V035H1A.importCheckpoint(saved);
 assert.equal(cur.N.V035H1A.fingerprint(loaded),prev.N.V035H1A.fingerprint(a),'B1A checkpoint load');
 assert.equal(cur.N.MilitaryFormation.from({id:'z',tileId:1,cohortIds:[],v33dAssignedWarId:'war-z',v33c1NextMoveCal:881}).v33c1NextMoveCal,881,'military movement field retained');
 assert(cur.N.V035H1B&&cur.N.V035H1B1&&cur.N.V035H1B1A,'profilers and wartime fix still installed');
 assert(cur.N.PATCH_NOTES.some(n=>n.version==='V0.35H1B2'));
 console.log(JSON.stringify({status:'PASS',release:cur.N.RELEASE_VERSION,hostedScripts:166,bootstrapsBundled:63,wrappersRemoved:9,parityDays:12,rng:true,checkpoint:true,tech:43,saveSchema:'V0.35H1B1A'}));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
