
window.VSim=window.VSim||{};
(function(NS){
'use strict';
const REV26='performance-ui-observer-stabilization';
const now26=()=>globalThis.performance?.now?performance.now():Date.now();
const clamp26=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- resident indexing: preserve Person entities, remove repeated nation-wide filters ---------- */
function bumpResidentEpoch26(v){v._v26ResidentEpoch=(v._v26ResidentEpoch||0)+1;v._v26ResidentCache=null;}
function hookPerson26(v,p){
 if(!p)return;
 if(p._v26Owner===v&&p._v26Hooked)return;
 const oldHome=p.homeTileId,oldAlive=p.alive!==false;
 try{
  Object.defineProperty(p,'homeTileId',{configurable:true,enumerable:true,get(){return this._v26HomeValue;},set(x){if(this._v26HomeValue===x)return;this._v26HomeValue=x;const owner=this._v26Owner;if(owner)bumpResidentEpoch26(owner);}});
  Object.defineProperty(p,'alive',{configurable:true,enumerable:true,get(){return this._v26AliveValue;},set(x){const b=x!==false;if(this._v26AliveValue===b)return;this._v26AliveValue=b;const owner=this._v26Owner;if(owner)bumpResidentEpoch26(owner);}});
  Object.defineProperty(p,'_v26HomeValue',{configurable:true,writable:true,enumerable:false,value:oldHome});
  Object.defineProperty(p,'_v26AliveValue',{configurable:true,writable:true,enumerable:false,value:oldAlive});
  Object.defineProperty(p,'_v26Owner',{configurable:true,writable:true,enumerable:false,value:v});
  Object.defineProperty(p,'_v26Hooked',{configurable:true,writable:true,enumerable:false,value:true});
 }catch(e){p._v26Owner=v;p._v26Hooked=true;}
}
function ensureResidentIndex26(v){
 const residents=v.residents||[];
 if(v._v26HookedLength!==residents.length){for(const p of residents)hookPerson26(v,p);v._v26HookedLength=residents.length;bumpResidentEpoch26(v);}
 const epoch=v._v26ResidentEpoch||0;
 if(v._v26ResidentCache&&v._v26ResidentCache.epoch===epoch&&v._v26ResidentCache.residentsRef===residents)return v._v26ResidentCache;
 const byHome=new Map(),alive=[];
 for(const p of residents){if(p?._v26Owner!==v)hookPerson26(v,p);if(p?.alive===false)continue;alive.push(p);const id=p.homeTileId;if(!byHome.has(id))byHome.set(id,[]);byHome.get(id).push(p);}
 return v._v26ResidentCache={epoch,residentsRef:residents,byHome,alive};
}
const tileResidents25=NS.Village.prototype.tileResidents;
NS.Village.prototype.tileResidents=function(tileId){const a=ensureResidentIndex26(this).byHome.get(tileId);return a?a.slice():[];};
try{Object.defineProperty(NS.World.prototype,'allPeople',{configurable:true,get(){const out=[];for(const v of this.activeVillages)out.push(...ensureResidentIndex26(v).alive);return out;}});}catch(e){}


/* Long-lived same-nation route cache. V0.25 already cached for only one logistics bucket;
   V0.26 keeps routes until the nation's actual topology changes. */
const internalPath25=NS.Village.prototype.internalPathCost;
function topologySig26(v){
 let sum=0,roads=0,roadHash=0,harbors=0,harborHash=0;
 for(const id of v.territory||[]){sum=(sum+id*17)%1000000007;const t=v._world?.map.get(id);if(!t)continue;for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i],cond=Number(t.buildingCondition?.[i]??100);if(cond<=0)continue;if(b==='road'){roads++;roadHash=(roadHash+id*31+i)%1000000007;}if(b==='harbor'){harbors++;harborHash=(harborHash+id*37+i)%1000000007;}}}
 const tech=['ROADS','ENGINEERING','URBANIZATION','COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'].map(k=>v.hasTech?.(k)?1:0).join('');
 return `${v.territory?.size||0}:${sum}:${roads}:${roadHash}:${harbors}:${harborHash}:${tech}`;
}
NS.Village.prototype.internalPathCost=function(fromId,toId){
 if(typeof internalPath25!=='function')return this._world?.map.distance(fromId,toId)??Infinity;
 const sig=topologySig26(this);if(!this._v26PathCache||this._v26PathCache.sig!==sig)this._v26PathCache={sig,map:new Map()};
 const a=Math.min(fromId,toId),b=Math.max(fromId,toId),key=`${a}:${b}`;if(this._v26PathCache.map.has(key))return this._v26PathCache.map.get(key);
 const cost=internalPath25.call(this,fromId,toId);this._v26PathCache.map.set(key,cost);if(this._v26PathCache.map.size>6000){const first=this._v26PathCache.map.keys().next().value;this._v26PathCache.map.delete(first);}return cost;
};

/* ---------- lightweight subsystem profiler ---------- */
function addPart26(w,key,ms){if(!w)return;const c=w._v26PerfCurrent||(w._v26PerfCurrent={});c[key]=(c[key]||0)+ms;}
function wrapWorld26(name,key){const fn=NS.World.prototype[name];if(typeof fn!=='function'||fn._v26Wrapped)return;const g=function(...args){const a=now26();try{return fn.apply(this,args);}finally{addPart26(this,key,now26()-a);}};g._v26Wrapped=true;NS.World.prototype[name]=g;}
function wrapVillage26(name,key){const fn=NS.Village.prototype[name];if(typeof fn!=='function'||fn._v26Wrapped)return;const g=function(...args){const w=args.find(x=>x&&x.map&&x.villages)||this._world,a=now26();try{return fn.apply(this,args);}finally{addPart26(w,key,now26()-a);}};g._v26Wrapped=true;NS.Village.prototype[name]=g;}
wrapWorld26('processInternalLogistics','logistics');
wrapWorld26('processAutonomousTrade','trade');
wrapWorld26('socialAndMigration','social');
wrapVillage26('dailyTick','villageDaily');
wrapVillage26('internalMigration','migration');
wrapVillage26('processBuildingMaintenance','maintenance');
wrapVillage26('progressConstruction','construction');
wrapVillage26('seasonalTick','seasonal');
const snapProfile25=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const a=now26();try{return snapProfile25.call(this,w,reason,note);}finally{addPart26(w,'telemetry',now26()-a);}};
function smoothParts26(old,cur,alpha=.28){const out={...old};for(const k of new Set([...Object.keys(old||{}),...Object.keys(cur||{})]))out[k]=(Number(old?.[k]||0)*(1-alpha)+Number(cur?.[k]||0)*alpha);return out;}

/* ---------- exact build elapsed-day bookkeeping ---------- */
function stampNewest26(v,before,arr,w){if(!arr||arr.length<=before)return;const p=arr.at(-1);if(p&&!Number.isFinite(p.startCalendarDay25))p.startCalendarDay25=Number(w.calendarOrdinalDay?.()||0);}
const startConstruction25=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,...args){const a=this.constructionProjects||[],n=a.length,r=startConstruction25.call(this,w,...args);if(r)stampNewest26(this,n,this.constructionProjects,w);return r;};
if(NS.Village.prototype.startHousingUpgrade){const startUpgrade25=NS.Village.prototype.startHousingUpgrade;NS.Village.prototype.startHousingUpgrade=function(w,...args){const n=(this.buildingUpgradeProjects||[]).length,r=startUpgrade25.call(this,w,...args);if(r)stampNewest26(this,n,this.buildingUpgradeProjects,w);return r;};}

/* ---------- claimable-land and performance telemetry ---------- */
function claimability26(w){let claimable=0,claimed=0;for(const t of w.map.tiles||[]){const terr=NS.TERRAIN?.[t.terrain];if(!terr?.passable||t.terrain==='water')continue;claimable++;if(t.ownerId!==null&&t.ownerId!==undefined)claimed++;}return{claimable,claimed,share:claimable?claimed/claimable:0,remaining:Math.max(0,claimable-claimed)};}
const snap26Base=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){
 const s=snap26Base.call(this,w,reason,note);if(!s)return s;const land=claimability26(w),p=w._v26Perf||{};
 Object.assign(s.global,{claimableNaturalTiles:land.claimable,claimedNaturalTiles:land.claimed,claimedNaturalShare:+land.share.toFixed(4),remainingClaimableNaturalTiles:land.remaining,perfSimMs26:+Number(p.simMs||0).toFixed(2),perfRenderMs26:+Number(p.renderMs||0).toFixed(2),perfMsPerDay26:+Number(p.msPerDay||0).toFixed(3),perfSpeed26:Number(w.speed||1),perfBreakdown26:Object.fromEntries(Object.entries(p.parts||{}).map(([k,v])=>[k,+Number(v).toFixed(2)]))});
 for(const r of s.villages||[]){const v=w.villages.find(x=>x.id===r.id);if(v)r.avgHunger=+v.avgHunger().toFixed(2);r.claimableNaturalTiles=land.claimable;r.claimedNaturalTiles=land.claimed;r.claimedNaturalShare=+land.share.toFixed(4);r.perfSimMs26=+Number(p.simMs||0).toFixed(2);r.perfRenderMs26=+Number(p.renderMs||0).toFixed(2);r.perfMsPerDay26=+Number(p.msPerDay||0).toFixed(3);r.perfSpeed26=Number(w.speed||1);}
 return s;
};
const csv25=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){
 const base=csv25.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['avgHunger','claimableNaturalTiles','claimedNaturalTiles','claimedNaturalShare','perfSimMs26','perfRenderMs26','perfMsPerDay26','perfSpeed26'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;
 for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k]??s.global?.[k])).join(',');}
 return lines.join('\n');
};
const json25=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json25.call(this,w);d.version='0.26';const land=claimability26(w);d.worldSummary.v26Revision=REV26;d.worldSummary.performance='resident index cache + subsystem profiler + persistent HUD';d.worldSummary.uiRendering='scroll-preserving live render';d.worldSummary.nationalBorders='dark inter-nation outline + selected nation highlight';d.worldSummary.claimableNaturalTiles=land.claimable;d.worldSummary.claimedNaturalTiles=land.claimed;d.worldSummary.claimedNaturalShare=+land.share.toFixed(4);return d;};

/* ---------- UI: scroll preservation, persistent performance readout, clearer borders ---------- */
function captureScroll26(ui){const root=document.scrollingElement||document.documentElement,ids=['villageContent','devLogPreview','chronicle'];const data={window:root?.scrollTop||window.scrollY||0,view:ui.view,els:{}};for(const id of ids){const e=document.getElementById(id);if(e)data.els[id]=e.scrollTop||0;}const view=document.getElementById(`view-${ui.view}`);if(view)data.els[`view-${ui.view}`]=view.scrollTop||0;return data;}
function restoreScroll26(s){if(!s)return;const root=document.scrollingElement||document.documentElement;if(root)root.scrollTop=s.window;else window.scrollTo(0,s.window);for(const[id,y]of Object.entries(s.els||{})){const e=document.getElementById(id);if(e)e.scrollTop=y;}}
if(NS.UI){
 const render25=NS.UI.prototype.render,header25=NS.UI.prototype.renderHeader,map25=NS.UI.prototype.renderMap,cards25=NS.UI.prototype.renderVillageCards;
 NS.UI.prototype.render=function(){const s=captureScroll26(this);try{return render25.call(this);}finally{restoreScroll26(s);if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>restoreScroll26(s));}};
 NS.UI.prototype.renderHeader=function(){header25.call(this);const p=this.world._v26Perf||this.world._v23Perf||{},speed=Math.max(1,Number(this.world.speed||1)),sim=Number(p.simMs||0),ui=Number(p.renderMs||0),per=Number((p.msPerDay??(sim/speed))||0),parts=p.parts||{};let hot='';const ranked=Object.entries(parts).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);if(ranked.length)hot=` · HOT ${ranked[0][0]} ${ranked[0][1].toFixed(0)}ms`;const el=this.q('runtimeStatus');if(el){el.textContent=`✓ V0.26 안정화 · ×${speed} · SIM ${sim.toFixed(1)}ms/batch · ${per.toFixed(1)}ms/day · UI ${ui.toFixed(1)}ms${hot}`;el.style.color=sim>550?'#ffb36b':'#5bd79d';}document.title='Village Observer V0.26';const e=document.querySelector('.eyebrow');if(e)e.textContent='Village Observer · V0.26';};
 NS.UI.prototype.start=function(){clearInterval(this.timer);this.world.running=true;this.timer=setInterval(()=>{const speed=Math.max(1,Number(this.world.speed||1));this.world._v26PerfCurrent={};const a=now26();for(let i=0;i<speed;i++)this.world.advanceOneDay();const b=now26();const scroll=captureScroll26(this);this.render();restoreScroll26(scroll);const c=now26(),old=this.world._v26Perf||{simMs:0,renderMs:0,msPerDay:0,parts:{},samples:0},alpha=(old.samples||0)>12?.22:.42,sim=b-a,render=c-b;this.world._v26Perf={simMs:old.simMs*(1-alpha)+sim*alpha,renderMs:old.renderMs*(1-alpha)+render*alpha,msPerDay:old.msPerDay*(1-alpha)+(sim/speed)*alpha,parts:smoothParts26(old.parts||{},this.world._v26PerfCurrent||{},alpha),samples:(old.samples||0)+1};this.world._v23Perf={simMs:this.world._v26Perf.simMs,renderMs:this.world._v26Perf.renderMs,samples:this.world._v26Perf.samples};this.renderHeader();},550);};
 NS.UI.prototype.renderMap=function(){map25.call(this);const g=this._mapGeom,c=this.q('worldCanvas');if(!g||!c)return;const ctx=c.getContext('2d'),m=this.world.map,{cell,ox,oy}=g,sel=this.world.selectedVillageId,edge=Math.max(1,Math.min(3.2,cell*.055)),inset=Math.max(.65,edge*.68);ctx.save();ctx.lineCap='square';/* neutral center separator */ctx.strokeStyle='rgba(4,7,10,.82)';ctx.lineWidth=edge;for(const t of m.tiles){if(t.ownerId==null)continue;const x=ox+t.x*cell,y=oy+t.y*cell;for(const[dx,dy,sx,sy,ex,ey]of[[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){const n=m.at(t.x+dx,t.y+dy);if(n&&n.ownerId===t.ownerId)continue;if(n&&n.ownerId!=null&&t.id>n.id)continue;ctx.beginPath();ctx.moveTo(x+sx*cell,y+sy*cell);ctx.lineTo(x+ex*cell,y+ey*cell);ctx.stroke();}}/* each nation gets its own colored side of the frontier */for(const t of m.tiles){if(t.ownerId==null)continue;const x=ox+t.x*cell,y=oy+t.y*cell,col=NS.NATION_BORDER_COLORS?.[Number(t.ownerId)]||NS.NATION_COLORS?.[Number(t.ownerId)]||'#dbe8f5';ctx.strokeStyle=col;ctx.lineWidth=Math.max(1,edge*.62);for(const[dx,dy,sx,sy,ex,ey]of[[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){const n=m.at(t.x+dx,t.y+dy);if(n&&n.ownerId===t.ownerId)continue;let ax=x+sx*cell,ay=y+sy*cell,bx=x+ex*cell,by=y+ey*cell;if(dx===0&&dy===-1){ay+=inset;by+=inset;}else if(dx===1){ax-=inset;bx-=inset;}else if(dx===0&&dy===1){ay-=inset;by-=inset;}else if(dx===-1){ax+=inset;bx+=inset;}ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}}if(sel!=null){const col=NS.NATION_BORDER_COLORS?.[Number(sel)]||NS.NATION_COLORS?.[Number(sel)]||'#eef5ff';ctx.strokeStyle=col;ctx.lineWidth=Math.max(edge+1,Math.min(5,cell*.085));for(const t of m.tiles){if(Number(t.ownerId)!==Number(sel))continue;const x=ox+t.x*cell,y=oy+t.y*cell;for(const[dx,dy,sx,sy,ex,ey]of[[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){const n=m.at(t.x+dx,t.y+dy);if(Number(n?.ownerId)===Number(sel))continue;ctx.beginPath();ctx.moveTo(x+sx*cell,y+sy*cell);ctx.lineTo(x+ex*cell,y+ey*cell);ctx.stroke();}}}ctx.restore();};
 if(cards25)NS.UI.prototype.renderVillageCards=function(){const el=this.q('villageCards'),sig=this.world.villages.map(v=>`${v.id}:${v.name}:${v.brain?.label}`).join('|');if(!el||el.dataset.v26Structure!==sig){cards25.call(this);if(el){el.dataset.v26Structure=sig;[...el.children].forEach((b,i)=>b.dataset.v26NationId=String(this.world.villages[i]?.id??''));}return;}for(const b of [...el.children]){const v=this.world.villages.find(x=>x.id===Number(b.dataset.v26NationId));if(!v)continue;b.classList.toggle('selected',v.id===this.world.selectedVillageId);const brain=b.querySelector('.brain'),name=b.querySelector('.name'),small=b.querySelector('.small');if(brain)brain.textContent=v.brain.label;if(name)name.textContent=v.name;if(small)small.textContent=`👥 ${v.population()} · 🗺️ ${v.territory.size} · 🪙 ${v.gold.toFixed(0)}`;}};
}

/* ---------- save/load compatibility ---------- */
function attachV26World(w){NS.V025.attachWorld(w);for(const v of w.villages||[]){v._world=w;v._v26HookedLength=-1;ensureResidentIndex26(v);}w._v26Perf=w._v26Perf||{simMs:0,renderMs:0,msPerDay:0,parts:{},samples:0};return w;}
const worldSer25=NS.World.prototype.serialize,worldFrom25=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSer25.call(this);d.version='0.26';d.v26={revision:REV26,residentIndex:true,scrollPreservation:true,borderOutline:true,performanceHUD:true};return d;};
NS.World.from=function(d){if(d.version==='0.26'){const w=worldFrom25({...d,version:'0.25'});return attachV26World(w);}return attachV26World(worldFrom25(d));};
NS.V026={attachWorld:attachV26World,claimability:claimability26,revision:REV26,ensureResidentIndex:ensureResidentIndex26};
(function(){const KEY='village-observer-v0-26',fallback=['village-observer-v0-25','village-observer-v0-24','village-observer-v0-23','village-observer-v0-22','village-observer-v0-21','village-observer-v0-20','village-observer-v0-19','village-observer-v0-18','village-observer-v0-17','village-observer-v0-16','village-observer-v0-15','village-observer-v0-14','village-observer-v0-13','village-observer-v0-12','village-observer-v0-11','village-observer-v0-10','village-observer-v0-9','village-observer-v0-8'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v026-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v026-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v026-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return attachV26World(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();
})(window.VSim);

