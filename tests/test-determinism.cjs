/* V0.34C1H -> V0.34D0 zero-balance-change comparison.
 * Uses a deterministic xorshift32 RNG and compares physical state every day.
 */
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const prev=path.join(root,'tests/fixtures/v034C1H-index.html');
const curr=path.join(root,'index-standalone.html');
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function host(file,seed){
 let rand=seed>>>0,calls=0;const M=Object.create(Math);M.random=()=>{calls++;rand^=rand<<13;rand^=rand>>>17;rand^=rand<<5;return (rand>>>0)/4294967296;};
 const storage=new Map();const el=()=>({style:{},addEventListener(){},appendChild(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={console,Math:M,Date,Set,Map,WeakMap,WeakSet,JSON,TextEncoder,TextDecoder,URL,Blob,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,
  crypto:crypto.webcrypto,performance:require('perf_hooks').performance,alert:()=>{},confirm:()=>false,requestAnimationFrame:()=>{},setTimeout:()=>{},clearTimeout:()=>{},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  document:{head:el(),documentElement:el(),body:el(),getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{},createElement:el}};
 ctx.window=ctx;ctx.addEventListener=()=>{};const c=vm.createContext(ctx);const html=fs.readFileSync(file,'utf8');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
 for(let i=0;i<scripts.length;i++){try{new vm.Script(scripts[i],{filename:'script'+i}).runInContext(c,{timeout:10000});}
  catch(e){if(!/onclick/.test(e.message))throw new Error('script'+i+': '+e.stack);}}
 return{NS:ctx.VSim,reset:s=>{rand=s>>>0;calls=0;},calls:()=>calls};
}
function clean(w){const x=JSON.parse(JSON.stringify(w.serialize()));delete x.version;delete x.telemetry;
 if(x.v34c?.counters){delete x.v34c.counters.totalReviewMs;delete x.v34c.counters.maxReviewMs;}
 if(x.v32e12Stats)delete x.v32e12Stats.perf;
 if(x.v32e14Stats)delete x.v32e14Stats.perf;
 if(x.v32fStats)delete x.v32fStats.perfMilitaryReadinessMs;
 x.villages?.forEach(v=>{delete v.v034c1gPerformance;});
 return x;}
function run(days,profile){const seed=0x7811aa77;const a=host(prev,seed),b=host(curr,seed);
 a.reset(seed);const original=new a.NS.World(19,19);const source=JSON.parse(JSON.stringify(original.serialize()));
 a.reset(0x71dead23);b.reset(0x71dead23);
 const wa=a.NS.World.from(JSON.parse(JSON.stringify(source)));
 const wb=b.NS.World.from({...JSON.parse(JSON.stringify(source)),version:'V0.34D0'});
 a.NS.V034C1B?.setEnabled?.(wa,profile);b.NS.V034C1B?.setEnabled?.(wb,profile);
 assert.equal(digest(clean(wa)),digest(clean(wb)),'initial world state mismatch');
 a.reset(0x28a13789);b.reset(0x28a13789);
 for(let i=0;i<days;i++){
  wa.advanceOneDay();wb.advanceOneDay();
  const ca=digest(clean(wa)),cb=digest(clean(wb));
  assert.equal(ca,cb,`day ${i+1} world digest mismatch`);
  assert.equal(a.calls(),b.calls(),`day ${i+1} RNG mismatch`);
 }
 assert.equal(digest(wa.telemetry.entries.map(e=>({type:e.type,simTime:e.simTime,payload:e.payload}))),digest(wb.telemetry.entries.map(e=>({type:e.type,simTime:e.simTime,payload:e.payload}))), 'AI/telemetry event difference');
 return{days,profile,pass:true,rngCalls:a.calls(),firstWorldDigest:digest(clean(wa)),entryCount:wa.telemetry.entries.length,quarters:wa.v034c1bQuarterHistory?.length??null};
}
function maintenance(profile){
 const seed=0x7811aa77,a=host(prev,seed),b=host(curr,seed);
 a.reset(seed);const src=JSON.parse(JSON.stringify(new a.NS.World(19,19).serialize()));
 a.reset(0x123987ab);b.reset(0x123987ab);
 const wa=a.NS.World.from(JSON.parse(JSON.stringify(src))),wb=b.NS.World.from({...JSON.parse(JSON.stringify(src)),version:'V0.34D0'});
 a.NS.V034C1B?.setEnabled?.(wa,profile);b.NS.V034C1B?.setEnabled?.(wb,profile);
 a.reset(0x88a73341);b.reset(0x88a73341);
 for(let round=0;round<3;round++){
  for(const w of [wa,wb])for(const v of w.activeVillages){for(const o of v.maintenancePlan25?.orders||[]){o.laborDelivered=o.laborNeed*0.85;o.remoteDelivered=o.laborDelivered*0.2;}}
  for(const v of wa.activeVillages)v.processBuildingMaintenance(wa);
  for(const v of wb.activeVillages)v.processBuildingMaintenance(wb);
  assert.equal(digest(clean(wa)),digest(clean(wb)),`maintenance round ${round} mismatch`);
  assert.equal(a.calls(),b.calls(),`maintenance round ${round} RNG mismatch`);
  wa.season=(wa.season+1)%4;wb.season=(wb.season+1)%4;
 }
 return{maintenanceRounds:3,profile,pass:true,rngCalls:a.calls(),stateSHA256:digest(clean(wa))};
}
const results=[];
for(const [days,profile] of (process.env.VILOB_LONG==='1'?[[96,false]]:[[8,false],[8,true]]))results.push(run(days,profile));
if(process.env.VILOB_LONG!=='1')for(const profile of [false,true])results.push(maintenance(profile));
console.log(JSON.stringify(results,null,2));
