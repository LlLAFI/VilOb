'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
function engine(file){let seed=0x12345567;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const el=()=>({style:{},dataset:{},textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date,Blob,TextEncoder,TextDecoder,ArrayBuffer,Uint8Array,structuredClone,performance:require('perf_hooks').performance,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''},URL};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}return{ns:c.VSim,setSeed:x=>seed=x>>>0,getSeed:()=>seed>>>0};}
const base=engine(path.join(root,'index-standalone.html'));const next=base;
const ns=next.ns;assert.equal(ns.RELEASE_VERSION,'V0.35H1C3');assert.equal(ns.V035G1.constants.ARCH_MULT,3);
const oldSave=JSON.parse(JSON.stringify(new ns.World(19,19).serialize()));oldSave.version='V0.35G';
const w=ns.World.from(oldSave);assert.equal(w.serialize().version,'V0.35H1B1A');assert.equal(ns.TECH_ORDER.length,43);
const v=w.activeVillages[0],tile=w.map.get(v.coreTileId);
function project(id,total=9){return{id,tileId:tile.id,type:'house',totalLabor25:total,laborProgress25:0,progress:0,duration:total,reason:'TEST'};}
const test=project('g1-test');const saved=v.constructionProjects;v.constructionProjects=[test];
let calls=0;const log=w.log;w.log=function(...args){calls++;};
const beforeN=v.residents.length;
let progress=ns.V035G1.work(v,w,test,'construction');
assert(progress>=2.4-1e-9&&progress<=3.0+1e-9,`baseline must progress without assigned person: ${progress}`);assert.equal(v.residents.length,beforeN);
const t=tile;if(!t.buildings.includes('house')){const prior=ns.Village.prototype.progressConstruction;while(test.laborProgress25<test.totalLabor25-1e-6&&v.constructionProjects.length){prior.call(v,w);if(calls>3)break;}assert(test.laborProgress25>0||v.constructionProjects.length===0);}
v.constructionProjects=saved;
const a=v.residents.find(p=>p.alive&&p.age>=16&&!((p.v25MaintenanceQueue||[]).length)&&p.militaryStatus32A!=='active'&&p.assignment!=='PIONEER');
if(a){const oldJob=a.job,oldDispatch=a.v35g1Dispatch;a.job='건축가';const p=project('g1-architect');a.v35g1Dispatch={phase:'WORK',kind:'construction',projectId:p.id,tileId:p.tileId,paused:false};const none=ns.V035G1.work(v,w,{...p,id:'other'},'construction');const yes=ns.V035G1.work(v,w,p,'construction');assert(Math.abs(yes/none-3)<1e-9,`architect ratio ${yes/none}`);a.job=oldJob;a.v35g1Dispatch=oldDispatch;}
const l={id:'g1-land',tileId:tile.id,duration:200,progress:0};assert(ns.V035G1.landWork(v,w,l)>0);
const days=Number(process.env.V35G1_DAYS||90);for(let i=0;i<days;i++)w.advanceOneDay();assert(ns.V034D2.audit(w).ok);assert(ns.V034D1.audit(w).ok);
const data=JSON.parse(JSON.stringify(w.serialize()));assert.equal(data.version,'V0.35H1B1A');const reload=ns.World.from(data);assert.equal(reload.serialize().version,'V0.35H1B1A');assert(ns.V034D2.audit(reload).ok);
const r=ns.V035G1.report(reload);assert.equal(r.constants.architectMultiplier,3);const origDispatch=ns.V035G1.report(w).activeDispatches;for(const d of origDispatch)assert(r.activeDispatches.some(x=>x.personId===d.personId&&x.projectId===d.projectId&&x.phase===d.phase),'dispatch must survive save/load');assert.equal(w.telemetry.toJSON(w).version,'V0.35H1B1A');
console.log(JSON.stringify({status:'PASS',version:ns.RELEASE_VERSION,tests:['G load','base construction','physical progress','architect 3x','land baseline','natural '+days+'d','D1/D2 audit','save reload','telemetry'],people:v.residents.length,baseline:progress,architectTest:!!a,dispatches:r.activeDispatches.length}));
