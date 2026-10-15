'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
function boot(file,seed=0x4ab1221d){let state=seed,calls=0;const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};}
const root=path.join(__dirname,'..'),base=boot(path.join(root,'index-F1-baseline.html')),target=boot(path.join(root,'index-F1A-baseline.html'));
assert.equal(base.NS.RELEASE_VERSION,'V0.34F1');assert.equal(target.NS.RELEASE_VERSION,'V0.34F1A');
assert(target.NS.V034F1A);assert.equal(target.NS.V034F1A.columns.length,52);
const a=new base.NS.World(19,19),b=new target.NS.World(19,19);
function fingerprint(w){const x=w.serialize();return JSON.stringify({year:x.year,day:x.day,season:x.season,villages:x.villages,map:x.map,wars:x.wars,v34b:x.v34b});}
function same(label){assert.equal(base.calls(),target.calls(),label+' RNG');const aa=fingerprint(a),bb=fingerprint(b);if(aa!==bb){let i=0;while(i<aa.length&&aa[i]===bb[i])i++;throw Error(label+' mismatched at '+i+' '+aa.slice(i,i+90)+' ≠ '+bb.slice(i,i+90));}}
same('initial');const days=Math.min(360,Math.max(30,Number(process.env.F1A_DAYS||90)));
for(let i=0;i<days;i++){a.advanceOneDay();b.advanceOneDay();if(i%30===29)same('day'+(i+1));}
same('final');assert(target.NS.V034D3.audit(b).ok);
// Forced starvation-stock overflow in both worlds: exact same physical loss.
const va=a.villages[0],vb=b.villages[0];const capA=va.storageCaps.bind(va),capB=vb.storageCaps.bind(vb);
va.storageCaps=function(w){return {...capA(w),food:0.05};};vb.storageCaps=function(w){return {...capB(w),food:0.05};};
// A macro day can be required before Village.dailyTick() runs.
const ofBefore=target.NS.V034F1A.report(b).actualOverflowSpent;
for(let i=0;i<9;i++){a.advanceOneDay();b.advanceOneDay();}same('forced overflow');
const ofAfter=target.NS.V034F1A.report(b).actualOverflowSpent;
assert(ofAfter>ofBefore,'legacy overflow accounting was not triggered');
const era=target.NS.V034F1A.enrich(b);assert(era.some(r=>r.legacyOverflowFoodSpent>0),'missing overflow diagnostic');
assert(era.some(r=>r.otherWithdrawn>=r.legacyOverflowFoodSpent&&r.legacyOverflowFoodSpent>0),'no balance integration');
va.storageCaps=capA;vb.storageCaps=capB;
const saved=b.serialize();assert.equal(saved.version,'V0.34F1A');const loaded=target.NS.World.from(JSON.parse(JSON.stringify(saved)));
assert.equal(loaded.serialize().version,'V0.34F1A');assert.equal(target.NS.V034F1A.report(loaded).actualOverflowSpent,ofAfter);
const migrated=target.NS.World.from(JSON.parse(JSON.stringify(a.serialize())));assert.equal(migrated.serialize().version,'V0.34F1A');assert(target.NS.V034D3.audit(migrated).ok);
// Occupation must block shared inventory, but not move accounting to tile-ID.
const z=new target.NS.World(19,19),v=z.villages[0],t=z.map.get(v.coreTileId),before=target.NS.V034D3.members(v,t.id);
assert(before);t.v33OccupierId=z.villages[1].id;
assert.equal(target.NS.V034D3.members(v,t.id),null,'occupied tile still shares supplies');
const membership=String(t.settlementId);target.NS.V034D3A.addMetric(z,v,t.id,'otherWithdrawn',.25);
const joined=target.NS.V034D3A.rows(z).filter(r=>r.settlementId===membership);
assert(joined.some(r=>r.otherWithdrawn>=.25),'occupied stock charged to wrong ledger');
assert(joined.some(r=>r.occupationLedgerAttributions>0),'occupation attribution missing');
assert(!target.NS.V034D3A.rows(z).some(r=>r.settlementId==='tile-'+t.id&&r.otherWithdrawn>=.25),'wrong temporary tile ledger');
const f1a=target.NS.V034F1A.report(b);
console.log(JSON.stringify({status:'PASS',days,worldAndRNGParity:true,foodAudit:true,actualOverflowSpent:+ofAfter.toFixed(5),foodFlowColumns:f1a.foodFlowColumns,occupationLedger:'canonical',saveImport:true,originalCSVSchemas:true}));
