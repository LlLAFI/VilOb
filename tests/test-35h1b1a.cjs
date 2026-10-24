'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(){let state=514;const math=Object.create(Math);math.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};const memory=new Map();
 const el=()=>({style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){}});
 const c={console,Math:math,Map,Set,WeakMap,JSON,Date,performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},document:{head:el(),body:el(),documentElement:el(),getElementById(){return null},createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
 for(const m of fs.readFileSync(path.join(root,'index-standalone.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return c.VSim;
}
(async()=>{
 const N=boot();assert.equal(N.RELEASE_VERSION,'V0.35H1C');assert.equal(N.TECH_ORDER.length,43);
 // Legacy from() conversion must never drop post-0.32D military fields.
 const prototype=N.MilitaryFormation.from({id:'test-form',nationId:0,cohortIds:['c'],tileId:1,status:'SECURING',v33dAssignedWarId:'war33-1',v33c1NextMoveCal:777,v33e3Concentration:{phase:'ADVANCE'}});
 assert(prototype instanceof N.MilitaryFormation);
 assert.equal(prototype.v33c1NextMoveCal,777);assert.equal(prototype.v33dAssignedWarId,'war33-1');assert.equal(prototype.v33e3Concentration.phase,'ADVANCE');
 const w=N.V035H1A.createWorld();w.testScenario={...w.testScenario,id:'e5-occupation-operations',category:'performance'};w._v32e11Scenario=w.testScenario;N.V033E5.applyFixture(w);
 assert(w.v33e5.fixture.result.ok,'active war fixture generated');assert(N.V033D.activeWars(w).length,'war should be ACTIVE');
 let op=null;for(let i=0;i<55&&!op;i++){w.advanceOneDay();op=w.map.tiles.find(t=>t.v33OccupationOperation);}
 assert(op,'securing operation exists before checkpoint');
 const source=N.V035H1A.scenario(w);const saved=JSON.parse(JSON.stringify(source));const w1=await N.V035H1A.importCheckpoint(JSON.stringify(saved));const w2=await N.V035H1A.importCheckpoint(JSON.stringify(saved));
 const ms=v=>v.v32dMilitary?.formations||[];
 for(let vi=0;vi<2;vi++){
  const original=w.villages[vi],loaded=w1.villages[vi];assert.equal(ms(loaded).length,ms(original).length);
  for(let i=0;i<ms(original).length;i++){
   const sf=ms(original)[i],lf=ms(loaded).find(x=>x.id===sf.id);assert(lf,'formation present');assert(lf instanceof N.MilitaryFormation,'formation class restored');
   assert.equal(JSON.stringify(lf),JSON.stringify(sf),'all formation movement, assignment, engagement, regroup and tactical fields preserved');
  }
 }
 assert.equal(JSON.stringify(w1.v33War),JSON.stringify(w.v33War),'war scheduling and engagement state preserved');
 assert.equal(JSON.stringify(w1.map.get(op.id).v33OccupationOperation),JSON.stringify(op.v33OccupationOperation),'ongoing occupation exact');
 assert.equal(N.V035H1A.fingerprint(w1),source.perf.stateSignature,'checkpoint fingerprint preserved');
 assert.equal(N.V035H1B1A.report().status,'RESTORED');
 assert.equal(N.V035H1B1A.report().occupationCount,1);
 // When a defending field force disengages, the existing E5 occupation pulse
 // must still progress naturally; never create synthetic soldiers or progress.
 for(const x of [w1,w2]){const def=x.villages[1],site=x.map.get(op.id),rear=N.V033E5?.ensureState?Number(w.v33e5.fixture.result.rearTileId):22;
  for(const f of ms(def))if(Number(f.tileId)===Number(site.id)){
   f.tileId=rear;f.targetTileId=rear;f.v33cRegroupUntilCal=x.calendarOrdinalDay()+120;f.v33c1NextMoveCal=x.calendarOrdinalDay()+120;
   for(const cid of f.cohortIds||[]){const c=def.military32A?.cohorts?.find(q=>String(q.id)===String(cid));if(c)c.tileId=rear;}
  }
  for(const c of def.military32A?.cohorts||[])if(c.role32B==='CORE_GARRISON'){c.v33cRoutedUntilCal=x.calendarOrdinalDay()+120;c.memberIds=[];}
 }
 const before=Number(w1.map.get(op.id).v33OccupationOperation?.progress||0);
 let maxProgress=before;
 for(let i=0;i<25;i++){w1.advanceOneDay();w2.advanceOneDay();
  assert.equal(N.V035H1A.fingerprint(w1),N.V035H1A.fingerprint(w2),'world replay '+i);
  assert.equal(w1.v35h1a.rngState,w2.v35h1a.rngState,'rng replay '+i);
  const a=w1.map.get(op.id).v33OccupationOperation,b=w2.map.get(op.id).v33OccupationOperation;
  assert.equal(JSON.stringify(a),JSON.stringify(b),'occupation replay '+i);
  maxProgress=Math.max(maxProgress,Number(a?.progress||0));
 }
 assert(maxProgress>before,'securing progresses after wartime load when defenders are absent');
 // Separate active-war rally scenario checks that restored tactical orders
 // actually resume movement rather than merely displaying preserved positions.
 const mover=N.V035H1A.createWorld(),moveFixture=N.V033E4A.setupConcentrationFixture(mover,false);
 assert(moveFixture.ok,'moving coalition fixture');
 const movementStart=N.V033D.ensureFormations(mover.villages[0],mover).map(f=>f.tileId);
 const movementCP=N.V035H1A.scenario(mover);
 const movedWorld=await N.V035H1A.importCheckpoint(JSON.stringify(movementCP));
 for(let i=0;i<42;i++)movedWorld.advanceOneDay();
 const movementEnd=N.V033D.ensureFormations(movedWorld.villages[0],movedWorld).map(f=>f.tileId);
 assert(movementEnd.some((tile,i)=>tile!==movementStart[i]),'Formation movement resumed after wartime reload');
 // Save to a new key while importing B1 and B checkpoints.
 N.SaveSystem.save(w2);assert.equal(N.SaveSystem.load().serialize().version,'V0.35H1B1A');
 assert(N.PATCH_NOTES.some(x=>x.version==='V0.35H1B1A'));
 console.log(JSON.stringify({status:'PASS',version:N.RELEASE_VERSION,warFixture:'e5-occupation-operations',formationMovement:true,formationExact:true,warStateExact:true,occupationExact:true,uncontestedProgress:[before,maxProgress],repeatLoadParityDays:25,rng:true,techs:N.TECH_ORDER.length}));
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
