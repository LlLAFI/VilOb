'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path'),{performance}=require('perf_hooks');
const root=path.resolve(__dirname,'..');let seed=0x12345678;const math=Object.create(Math);math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const elt=()=>({style:{},dataset:{},setAttribute(){},parentNode:null,innerHTML:'',textContent:'',appendChild(){},addEventListener(){},click(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
const ctx={Math:math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:elt(),body:elt(),documentElement:elt(),createElement:elt,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
for(const match of fs.readFileSync(path.join(root,'index-standalone.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(match[1].trim())try{new vm.Script(match[1]).runInContext(ctx,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const NS=ctx.VSim,G=NS.V034G4,G3=NS.V034G3,G3B=NS.V034G3B;
assert.equal(NS.RELEASE_VERSION,'V0.34G4');assert.equal(NS.TECH_ORDER.length,39);assert(G.verify().ok,JSON.stringify(G.verify()));
const tech=new Set(['ROADS']);
const nation=Object.create(NS.Village.prototype);nation.id=0;nation.name='교통 통제';nation.hasTech=id=>tech.has(id);nation.territory=new Set();nation.residents=[];
const tiles=[];for(let x=0;x<5;x++){const t=new NS.Tile(x,x,0,'plain');t.ownerId=0;t.buildings=['road'];t.buildingCondition=[100];t.resources.food=100;t.resourceCap.food=10000;t.lastResourceDay=1;tiles.push(t);nation.territory.add(x);}
const w={map:{get:id=>tiles[Number(id)],neighbors4:id=>{const x=Number(id);return[x-1,x+1].filter(n=>n>=0&&n<5).map(n=>tiles[n]);}},villages:[nation],activeVillages:[nation],v34b:{settlements:[]},ordinalDay:()=>1,calendarOrdinalDay:()=>1,year:1};nation._world=w;tiles.forEach(t=>t._worldRef=w);
const cost=(ids)=>G3B.travelStats(w,ids,ids[0]).max;
const route=(ids)=>G3.bothReachable(w,ids,ids[0],1);
assert.equal(G.roadFactor(nation),.62);assert(Math.abs(cost([0,1,2])-1.24)<1e-7);assert(!route([0,1,2]));
tech.add('ROAD_IMPROVEMENT');assert.equal(G.roadFactor(nation),.49);assert(Math.abs(cost([0,1,2])-.98)<1e-7);assert(route([0,1,2]));assert(!route([0,1,2,3]));
tech.add('POSTAL_NETWORK');assert.equal(G.roadFactor(nation),.32);assert(Math.abs(cost([0,1,2,3])-.96)<1e-7);assert(route([0,1,2,3]));assert(!route([0,1,2,3,4]));
assert.equal(G.spatialStep(w,tiles[2]),.32);assert(Math.abs(G.civilianRoadFactor(w,tiles[2],1)-.32)<1e-9);assert(Math.abs(G.civilianRoadFactor(w,tiles[2],.5)-.66)<1e-9);
// Bad/no road never receives technology's .32 regardless of tier.
tiles[2].buildingCondition=[20];assert.equal(G.spatialStep(w,tiles[2]),1);assert(!route([0,1,2,3]));tiles[2].buildingCondition=[100];
const roadCost=(techs)=>{tech.clear();for(const t of techs)tech.add(t);nation._v27TopoMemo=null;nation._v27PathCache=null;w._v11InternalPathCache=null;return Number(nation.internalPathCost(0,3));};
const basic=roadCost(['ROADS']),advanced=roadCost(['ROADS','ROAD_IMPROVEMENT']),postal=roadCost(['ROADS','ROAD_IMPROVEMENT','POSTAL_NETWORK']);assert(advanced<basic && postal<advanced,JSON.stringify({basic,advanced,postal}));
// Same world's caches must invalidate if tech advances on the SAME calendar day.
tech.clear();tech.add('ROADS');nation._v27TopoMemo=null;nation._v27PathCache=null;w._v11InternalPathCache=null;
const before=nation.internalPathCost(0,3);tech.add('ROAD_IMPROVEMENT');const after=nation.internalPathCost(0,3);assert(after<before,'tech completion must invalidate already-cached same-day domestic paths');
// International land-route path and same-day trade cache must share physical road tier.
const foreignTech=new Set(['ROADS']);
const foreign=Object.create(NS.Village.prototype);foreign.id=1;foreign.name='교역국';foreign.hasTech=k=>foreignTech.has(k);foreign.territory=new Set([3,4]);foreign.residents=[];foreign.tradingPosts=()=>[4];foreign.tradeRange=()=>50;
nation.tradingPosts=()=>[0];nation.tradeRange=()=>50;
for(const t of tiles.slice(3))t.ownerId=1;
w.villages=[nation,foreign];w.activeVillages=[nation,foreign];w.map.distance=(a,b)=>Math.abs(Number(a)-Number(b));w.tradeRouteCache={};w.telemetry={record(){}};w.timestamp=()=>'';w.recentTrades=[];
tech.clear();tech.add('ROADS');
const internationalOld=NS.World.prototype.routeInfo.call(w,nation,foreign).cost;
tech.add('ROAD_IMPROVEMENT');
const internationalNew=NS.World.prototype.routeInfo.call(w,nation,foreign).cost;
assert(internationalNew<internationalOld,JSON.stringify({internationalOld,internationalNew}));
// Restore local test ownership for hydraulic and inland path checks.
for(const t of tiles.slice(3))t.ownerId=0;w.villages=[nation];w.activeVillages=[nation];
// Base natural regeneration with actual farm, without tech vs with tech.
const farm=new NS.Tile(9,9,1,'plain');farm.ownerId=0;farm.buildings=['farmstead'];farm.buildingCondition=[100];farm.resourceCap.food=10000;farm.resources.food=100;farm.lastResourceDay=1;farm._worldRef=w;w.map.get=id=>Number(id)===9?farm:tiles[Number(id)];
tech.clear();tech.add('IRRIGATION');farm.syncResources(2);const noHyd=farm.resources.food;
farm.resources.food=100;farm.lastResourceDay=1;tech.add('HYDRAULIC_ENGINEERING');farm.syncResources(2);const yesHyd=farm.resources.food;assert(Math.abs(yesHyd-noHyd-.62)<1e-6,{noHyd,yesHyd});
farm.resources.food=100;farm.lastResourceDay=1;farm.buildingCondition=[35];farm.syncResources(2);const halfHyd=farm.resources.food;tech.delete('HYDRAULIC_ENGINEERING');farm.resources.food=100;farm.lastResourceDay=1;farm.syncResources(2);const halfBase=farm.resources.food;assert(Math.abs(halfHyd-halfBase-.31)<1e-6,{halfHyd,halfBase});
farm.buildingCondition=[100];farm.resources.food=9999.9;farm.lastResourceDay=1;tech.add('HYDRAULIC_ENGINEERING');farm.syncResources(2);assert(farm.resources.food<=10000,'natural stock respects physical cap');
// No agricultural infrastructure => no hydraulic bonus.
farm.resources.food=100;farm.lastResourceDay=1;farm.buildings=[];farm.buildingCondition=[];assert.equal(G.hydraulicBonus(farm,1),0);
const world=new NS.World(19,19);assert(G.verify(world).ok);const save=JSON.parse(JSON.stringify(world.serialize()));assert.equal(save.version,'V0.34G4');const loaded=NS.World.from(save);assert.equal(loaded.serialize().version,'V0.34G4');
for(let i=0;i<30;i++)loaded.advanceOneDay();const audit=G.audit(loaded);assert(audit.integrity.ok);assert.equal(audit.failures.physical,0);assert.equal(audit.failures.settlement,0);assert.equal(audit.failures.conservation,0);assert.equal(audit.failures.metabolismDuplicates,0);assert(NS.V034D3.audit(loaded).ok);
const oldFormat={...save,version:'V0.34G3B'};delete oldFormat.v034g4;const upgraded=NS.World.from(oldFormat);assert.equal(upgraded.serialize().version,'V0.34G4');
const report=loaded.telemetry.toJSON(loaded);assert.equal(report.version,'V0.34G4');assert.equal(report.worldSummary.techCount,39);assert.equal(report.worldSummary.v034g4.settlementJoinLimit,1);
console.log(JSON.stringify({status:'PASS',techCount:NS.TECH_ORDER.length,road:{basic,advanced,postal,internationalOld,internationalNew},join:{baseTwo:.62*2,improvedTwo:.49*2,postalThree:.32*3},hydraulic:{noHyd,yesHyd},save:'PASS',naturalDays:30,audit:'PASS'}));
