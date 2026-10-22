'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../dist/hosted/assets/legacy/036.js'),'utf8');
function extract(name){const mark=`function ${name}(`,pos=source.indexOf(mark);assert(pos>=0,mark);const start=source.indexOf('{',pos);let depth=0;for(let i=start;i<source.length;i++){if(source[i]==='{')depth++;else if(source[i]==='}'&&!--depth)return source.slice(pos,i+1);}throw Error('bad extraction');}
if(source.includes('NS.V035G1.prepare(v,w)')){console.log('SKIP historical V0.35G real-person labor allocation superseded by G1; see test-35g1.cjs');process.exit(0);}
const assignments=[],blocked=[],progress=[];
const ns={V035G:{constructionScheduled(...args){assignments.push(args);const p=args[2],remote=args[4];p._v35gLastReason=remote?'PROGRESSED_SETTLEMENT':'PROGRESSED_LOCAL';p._v35gLastWorkers=args[5]},constructionBlocked(...args){blocked.push(args);const p=args[2];p._v35gLastReason=args[3];p._v35gLastWorkers=0},constructionProgress(...args){progress.push(args)}}};
const context={NS:ns,clearCycleTasks25:v=>v.residents.forEach(p=>delete p._v25CycleTask),convertAllProjects25:()=>{},allBuildProjects25:v=>v.constructionProjects.map(p=>({p,kind:'construction',type:p.type})),projectPriority25:type=>type==='road'?40:50,maintenanceBusy25:p=>(p.v25MaintenanceQueue||[]).length>0,foodWorker25:p=>p.job==='농부',convertProject25:(v,p)=>p,ensureLaborStats25:v=>v.stats||(v.stats={construction:0,constructionEffective:0}),constructionEff25:()=>1,taskWorkers25:(v,kind,id)=>v.residents.filter(p=>p._v25CycleTask?.projectKind===kind&&p._v25CycleTask.projectId===id),console};
vm.createContext(context);new vm.Script(extract('prepareConstructionTasks25')+'\nthis.prepareConstructionTasks25=prepareConstructionTasks25;').runInContext(context);
function tiles(){return new Map([[1,{id:1,ownerId:0,settlementId:'s-a',buildings:[],addBuilding(x){this.buildings.push(x)}}],[2,{id:2,ownerId:0,settlementId:'s-a',buildings:[],addBuilding(x){this.buildings.push(x)}}],[3,{id:3,ownerId:0,settlementId:'s-b',buildings:[],addBuilding(x){this.buildings.push(x)}}]])}
function person(id,home,props={}){return{id,alive:true,age:30,homeTileId:home,job:'목수',assignment:'NONE',skills:{building:50},...props}}
function project(id,tileId){return{id,tileId,type:'house',totalLabor25:30,laborProgress25:0,startDay:0}}
function run(residents,projects){const ts=tiles(),v={id:0,residents,constructionProjects:projects,foodReserveDays:()=>100,settlementReserveDays:()=>100},w={map:{get:id=>ts.get(id)},calendarOrdinalDay:()=>91};context.prepareConstructionTasks25(v,w);return{v,w,ts};}
// Scenario 1: no adult at actual site; one real person in a different tile of the same Settlement.
let x=run([person('alice',1)],[project('h1',2)]);assert.equal(x.v.residents[0]._v25CycleTask?.tileId,2);assert.equal(x.v.residents[0].workTileId,2);assert.equal(assignments.at(-1)[4],1);assert.equal(x.v.constructionProjects[0]._v35gLastReason,'PROGRESSED_SETTLEMENT');
// Scenario 2: outside Settlement must not magically commute.
x=run([person('bob',3)],[project('h2',2)]);assert.equal(x.v.residents[0]._v25CycleTask,undefined);assert.equal(x.v.constructionProjects[0]._v35gLastReason,'NO_SETTLEMENT_WORKERS');
// Scenario 3: two projects / only one worker -> exactly one task, no double use.
x=run([person('single',1)],[project('h1',2),project('h2',1)]);assert.equal(x.v.residents.filter(p=>p._v25CycleTask).length,1);assert.equal(x.v.constructionProjects.filter(p=>p._v35gLastWorkers).length,1);
// Scenario 4: maintenance, military, pioneer exclusion; unblocked third adult can work.
x=run([person('maintenance',1,{v25MaintenanceQueue:[{workRemaining:3}]}),person('soldier',1,{militaryStatus32A:'active'}),person('pioneer',1,{assignment:'PIONEER'}),person('available',1)],[project('h',2)]);assert(x.v.residents.every(p=>!p._v25CycleTask||p.id==='available'));assert.equal(x.v.residents[3]._v25CycleTask?.projectId,'h');
// Scenario 5: actual construction progress and physical building completion require labor.
const src2=source.match(/NS\.Village\.prototype\.progressConstruction=function\(w\)\{[\s\S]*?\}\};\nfunction completeAuxProjects25/);assert(src2,'actual progressConstruction missing');
ns.Village=function(){};new vm.Script(src2[0].replace(/\nfunction completeAuxProjects25$/,'')).runInContext(context);
x=run([person('builder',1)],[{...project('h',2),totalLabor25:3,startCalendarDay25:1}]);x.v.progressConstruction=ns.Village.prototype.progressConstruction;context.NS.BUILDINGS={house:{label:'주택'}};x.w.telemetry={record(){}};x.w.calendarOrdinalDay=()=>91;x.w.ordinalDay=()=>30;x.w.log=()=>{};x.v.progressConstruction(x.w);assert.equal(x.ts.get(2).buildings.includes('house'),true);assert.equal(x.v.constructionProjects.length,0);assert.equal(x.v.stats.construction,3);
// Scenario 6: no worker -> no progress/physical building.
x=run([], [{...project('h',2),totalLabor25:3}]);x.v.progressConstruction=ns.Village.prototype.progressConstruction;x.w.telemetry={record(){}};x.w.ordinalDay=()=>30;x.v.progressConstruction(x.w);assert.equal(x.ts.get(2).buildings.length,0);assert.equal(x.v.constructionProjects[0].laborProgress25,0);
console.log(JSON.stringify({status:'PASS',scenarios:6,sharedSettlementLabor:true,foreignSettlementBlocked:true,oneProjectPerPerson:true,maintenanceMilitaryPioneerProtected:true,physicalCompletionRequiresWork:true,scheduled:assignments.length,blocked:blocked.length}));
