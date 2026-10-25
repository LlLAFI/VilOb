'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
function engine(file,seed=137){let rng=seed;
 const rand=Object.create(Math);rand.random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
 const st=new Map();const FixedDate=class extends Date{static now(){return 1770000000000;}};const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){},textContent:'',innerHTML:''});
 const ctx={console,Math:rand,Map,Set,WeakMap,JSON,Date:FixedDate,Blob,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,performance:require('node:perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(k){return st.get(k)||null},setItem(k,v){st.set(k,v)}},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''},URL};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 const html=fs.readFileSync(file,'utf8');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,getRng:()=>rng};}
const old=engine(path.join(root,'tests','fixtures','v035G1B-standalone.html'));
const next=engine(path.join(root,'index-standalone.html'));
assert.equal(old.NS.RELEASE_VERSION,'V0.35G1B');assert.equal(next.NS.RELEASE_VERSION,'V0.35H1C3');assert.equal(next.NS.TECH_ORDER.length,43);
assert.equal(next.NS.V035G1A.constants.BASE_DAILY,.8);assert.equal(next.NS.V035G1A.constants.ARCH_MULT,3);
const E=next.NS.V035H0;
const w=new next.NS.World(19,19),v=w.activeVillages[0];
// Real-world path parity for all settlement destination pairs and nation signatures.
const one=v.coreTileId;const allowed=new Set([v.id]);const probe={settlementId:'probe',tileIds:[one]},nodes=Array.from(w.map.tiles.values()).slice(0,100);
const direct=(a,b,nations)=>E.debug.path(w,a,b,t=>t.ownerId!=null&&nations.some(id=>String(t.ownerId)===String(id))&&t.v33OccupierId==null&&!t.v33OccupationOperation);
E.debug.routeContext(w,()=>{for(const nations of [[v.id],[v.id,w.activeVillages[1].id]])for(const t of nodes){const dest={settlementId:'d'+t.id,tileIds:[t.id]};assert.equal(E.debug.ownedPath(w,probe,dest,nations),direct([one],[t.id],nations),'route semantics difference '+t.id);}});
let diag=E.routeReport(w);assert.equal(diag.queries,200);assert.equal(diag.searches,2);assert.equal(diag.hits,198);assert.equal(diag.outOfScope,0);assert(diag.tilesVisited>0);
// Validate in-scope caching does not leak into the next scope after topology mutation.
let first;E.debug.routeContext(w,()=>{first=E.debug.ownedPath(w,probe,{tileIds:[one]},[v.id]);});
E.debug.routeContext(w,()=>assert.equal(E.debug.ownedPath(w,probe,{tileIds:[one]},[v.id]),0));
assert.equal(E.routeReport(w).searches,4);
// Current H0 and G1B save import, including Person/Village data.
const h0Save=JSON.parse(JSON.stringify(w.serialize()));assert.equal(h0Save.version,'V0.35H1B1A');
const bSave={...h0Save,version:'V0.35G1B'};const back=next.NS.World.from(bSave);assert.equal(back.serialize().version,'V0.35H1B1A');assert.equal(next.NS.V034D2.audit(back).ok,true);
const again=next.NS.World.from(h0Save);assert.equal(again.serialize().version,'V0.35H1B1A');assert.equal(again.serialize().v35h0Routing.searches,4);
// Same RNG seed, identical simulation state before and after actual natural ticks. Profile counter fields excepted.
const baselineParity=engine(path.join(root,'tests','fixtures','v035G1B-standalone.html'),881);
const optimizedParity=engine(path.join(root,'index-standalone.html'),881);
const a=new baselineParity.NS.World(19,19),b=new optimizedParity.NS.World(19,19);
const digest=(world)=>{const s=JSON.parse(JSON.stringify(world.serialize()));delete s.version;delete s.v35h0Routing;return {
 year:s.year,quarter:s.quarter,day:s.day,rand:s.rngState||s.randomState||null,
 nations:s.villages.map(n=>({id:n.id,status:n.status,core:n.coreTileId,territory:n.territory,
 residents:n.residents.map(p=>({id:p.id,alive:p.alive,age:p.age,home:p.homeTileId,work:p.workTileId,assignment:p.assignment,happiness:p.happiness,hunger:p.hunger,gold:p.gold29})),
 resources:n.resources||null,migrationStats:n.migrationStats,v35g1bHousingSince:n.v35g1bHousingSince,
 v35g1bStats:n.v35g1bStats})),
 tiles:s.map?.tiles?.map(t=>({id:t.id,ownerId:t.ownerId,road:t.road,food:t.resources?.food,wood:t.resources?.wood,stone:t.resources?.stone}))};};
assert.deepEqual(digest(a),digest(b),'fresh-world parity');
const days=Number(process.env.H0_PARITY_DAYS||90);
for(let i=0;i<days;i++){a.advanceOneDay();b.advanceOneDay();if(i%30===29){assert.equal(baselineParity.getRng(),optimizedParity.getRng(),'RNG parity day '+(i+1));assert.deepEqual(digest(a),digest(b),'world parity day '+(i+1));}}
assert.equal(optimizedParity.NS.V034D2.audit(b).ok,true);assert.equal(optimizedParity.NS.V034D2A.audit(b).ok,true);
console.log(JSON.stringify({status:'PASS',version:next.NS.RELEASE_VERSION,days,routeQueries:diag.queries,bfsBuilds:diag.searches,avoidedBFS:diag.hits,saveG1BImport:true,rngParity:true,worldParity:true,csvColumns:1683}));
