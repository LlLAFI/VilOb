
window.VSim=window.VSim||{};(function(NS){
'use strict';
const REV30A='v030-adjustment-stability-observer-finance';
const PRICE_RES30A={food:{label:'🌾 식량',world:'price_food',nation:'price_food',settlement:'pf'},wood:{label:'🪵 목재',world:'price_wood',nation:'price_wood',settlement:'pw'},stone:{label:'🪨 석재',world:'price_stone',nation:'price_stone',settlement:'ps'}};
const ANNUAL_WORLD30A=['treasuryGold30','marketGold30','personGold30','moneySupply30','observedGoldSource30','observedGoldSink30','adminCenters30','adminLevy30','regionalGrants30','perfSimMs26','perfRenderMs26','perfMsPerDay26','perfSpeed26','perfWallMs27','perfChunkDays27','perfYieldCount27','maintenanceWoodShortfall30A','maintenanceStoneShortfall30A'];
const ANNUAL_NATION30A=['treasuryGold30','marketGold30','personGold30','moneySupply30','adminCenters30','adminLevy30','regionalGrants30','maintenanceWoodNeed30A','maintenanceWoodUsed30A','maintenanceWoodShortfall30A','maintenanceStoneNeed30A','maintenanceStoneUsed30A','maintenanceStoneShortfall30A'];
const clampA=(v,a,b)=>Math.max(a,Math.min(b,v));
function yOf30A(s){return Number(s?.year||Math.max(1,Math.floor((Number(s?.ordinalDay||1)-1)/120)+1));}
function copyFinite30A(dst,src,keys){if(!dst||!src)return;for(const k of keys)if(Number.isFinite(Number(src[k])))dst[k]=Number(src[k]);}
function patchAnnual30A(t,s){if(!s)return;const y=yOf30A(s),sum=(t.yearlySummaries||[]).find(x=>Number(x.year)===y);if(sum){sum.global=sum.global||{};copyFinite30A(sum.global,s.global,ANNUAL_WORLD30A);for(const row of s.villages||[]){const n=(sum.nations||[]).find(x=>Number(x.id)===Number(row.id));copyFinite30A(n,row,ANNUAL_NATION30A);}}
 t.performanceYearly30A=Array.isArray(t.performanceYearly30A)?t.performanceYearly30A:[];const g=s.global||{},perf={year:y,population:Number(g.population||0),msPerDay:Number(g.perfMsPerDay26||0),simMs:Number(g.perfSimMs26||0),renderMs:Number(g.perfRenderMs26||0),wallMs:Number(g.perfWallMs27||0),speed:Number(g.perfSpeed26||0),chunkDays:Number(g.perfChunkDays27||0),yields:Number(g.perfYieldCount27||0)};if(Object.values(perf).some((v,i)=>i>1&&Number(v)>0)){const i=t.performanceYearly30A.findIndex(x=>Number(x.year)===y);if(i>=0)t.performanceYearly30A[i]=perf;else t.performanceYearly30A.push(perf);t.performanceYearly30A.sort((a,b)=>a.year-b.year);}}
function backfill30A(w){const t=w?.telemetry;if(!t)return;for(const s of t.snapshots||[])patchAnnual30A(t,s);}

/* V0.30 annual summary fields were written after the legacy annual compactor. Copy them back after every snapshot. */
const snap30A=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap30A.call(this,w,reason,note);patchAnnual30A(this,s);return s;};
const teleSer30A=NS.Telemetry.prototype.serialize;
NS.Telemetry.prototype.serialize=function(){const d=teleSer30A.call(this);d.performanceYearly30A=this.performanceYearly30A||[];return d;};
const teleJson30A=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=teleJson30A.call(this,w);d.version='0.30A';d.performanceYearly30A=this.performanceYearly30A||[];Object.assign(d.worldSummary,{v30ARevision:REV30A,performanceTelemetry:'independent persistent performance panel + annual performance history',annualStatsFix:'V0.30 Gold/admin/performance snapshot fields are copied into world/nation yearly summaries',regionalFinance30A:'0.38%/30d levy on market cash above population/demand liquidity reserve; higher administrative ranks collect more efficiently',specializationDiagnostics:'yearly high-tier facility prerequisite diagnostics without lowering construction thresholds',maintenanceDiagnostics:'quarterly wood/stone maintenance need, actual use and shortfall telemetry'});return d;};

/* Maintenance material diagnostics: measure actual material consumed inside the maintenance pass. */
function stockTotal30A(v,w,k){let q=0;for(const id of v.territory||[])q+=Number(w.map.get(id)?.stocks?.[k]||0);return q;}
function maintenanceNeed30A(v,k){let q=0;for(const id of v.territory||[]){const t=v._world?.map.get(id);if(!t)continue;for(const b of t.buildings||[])q+=Number(NS.V09?.MAINT_BASE?.[b]?.[k]||0)*.02/4;}return q;}
const maint30A=NS.Village.prototype.processBuildingMaintenance;
NS.Village.prototype.processBuildingMaintenance=function(w){const wn=maintenanceNeed30A(this,'wood'),sn=maintenanceNeed30A(this,'stone'),wb=stockTotal30A(this,w,'wood'),sb=stockTotal30A(this,w,'stone'),r=maint30A.call(this,w),wa=stockTotal30A(this,w,'wood'),sa=stockTotal30A(this,w,'stone'),wu=Math.max(0,wb-wa),su=Math.max(0,sb-sa);this.v30aMaintenance={woodNeed:wn,woodUsed:wu,woodShortfall:wn?clampA(1-wu/wn,0,1):0,stoneNeed:sn,stoneUsed:su,stoneShortfall:sn?clampA(1-su/sn,0,1):0,calendarDay:Number(w.calendarOrdinalDay?.()||0)};w.telemetry?.record?.('MAINTENANCE_MATERIAL_SUMMARY30A',w,{village:this.name,woodNeed:+wn.toFixed(2),woodUsed:+wu.toFixed(2),woodShortfallShare:+this.v30aMaintenance.woodShortfall.toFixed(3),stoneNeed:+sn.toFixed(2),stoneUsed:+su.toFixed(2),stoneShortfallShare:+this.v30aMaintenance.stoneShortfall.toFixed(3)});return r;};

/* High-tier facility diagnostics. Thresholds are not relaxed in A; we expose likely blockers first. */
function countBuilding30A(v,type){let n=0;for(const id of v.territory||[])n+=(v._world?.map.get(id)?.buildings||[]).filter(x=>x===type).length;return n;}
/* C1G: the V30A annual diagnostic owns a short-lived flow index. No cache survives the diagnostic.
 * The original fallback remains for unsupported query shapes/out-of-scope calls. The index retains
 * per-tile chronological addition order and the legacy inclusive endpoint/ordinal-day semantics.
 */
let diagFlowScope30A=null;
function buildDiagFlows30A(w,now,scope){
 const rows=new Map(),entries=w.telemetry?.entries||[],allowed=scope.tileSet;
 for(const e of entries){
  scope.scanned++;
  if(!['TRADE','DOMESTIC_TRADE29'].includes(e.type))continue;
  const age=now-Number(e.ordinalDay||0);if(age>240)continue;
  const p=e.payload,stone=p?.resource==='stone',within120=!(age>120),qty=Number(p?.qty||0);
  const a=Number(e.type==='DOMESTIC_TRADE29'?p?.fromTileId:p?.sellerTileId),b=Number(e.type==='DOMESTIC_TRADE29'?p?.toTileId:p?.buyerTileId);
  for(const id of (a===b?[a]:[a,b])){
   if(Number.isNaN(id)||!allowed.has(id))continue;
   let r=rows.get(id);if(!r){r={all120:{qty:0,count:0},stone120:{qty:0,count:0},stone240:{qty:0,count:0}};rows.set(id,r);}
   if(within120){r.all120.qty+=qty;r.all120.count++;if(stone){r.stone120.qty+=qty;r.stone120.count++;}}
   if(stone){r.stone240.qty+=qty;r.stone240.count++;}
  }
  scope.accepted++;
 }
 scope.indexBuilds++;return rows;
}
function recentFlow30A(v,w,tileId,days=120,resource=null){
 const scope=diagFlowScope30A;
 if(scope?.world===w&&scope.useIndex&&(days===120&&(resource==null||resource==='stone')||days===240&&resource==='stone')){
  if(!scope.index){const start=scope.enabled?performance.now():0;scope.index=buildDiagFlows30A(w,scope.now,scope);if(scope.enabled)scope.indexMs+=performance.now()-start;}
  scope.hits++;
  const r=scope.index.get(Number(tileId));const field=days===240?'stone240':resource==='stone'?'stone120':'all120';
  const x=r?.[field];return x?{qty:x.qty,count:x.count}:{qty:0,count:0};
 }
 const now=w.ordinalDay();let qty=0,count=0;
 for(const e of w.telemetry?.entries||[]){if(!['TRADE','DOMESTIC_TRADE29'].includes(e.type)||now-Number(e.ordinalDay||0)>days)continue;if(resource&&e.payload?.resource!==resource)continue;const a=e.type==='DOMESTIC_TRADE29'?e.payload?.fromTileId:e.payload?.sellerTileId,b=e.type==='DOMESTIC_TRADE29'?e.payload?.toTileId:e.payload?.buyerTileId;if(Number(a)!==Number(tileId)&&Number(b)!==Number(tileId))continue;qty+=Number(e.payload?.qty||0);count++;}
 if(scope?.world===w)scope.fallbacks++;return{qty,count};
}
function resourceTotal30A(v,k){let q=0;for(const id of v.territory||[])q+=Number(v._world?.map.get(id)?.stocks?.[k]||0);return q;}
function specialDiag30A(v,w){if(v._v30aSpecDiagYear===w.year)return;v._v30aSpecDiagYear=w.year;
 const prev=diagFlowScope30A,enabled=!!NS.V034C1G?.enabled(w),started=enabled?performance.now():0;
 const scope={world:w,now:w.ordinalDay(),enabled,index:null,indexBuilds:0,indexMs:0,hits:0,scanned:0,accepted:0,fallbacks:0,skippedActive:0,skippedDelegated:0,useIndex:false,tileSet:null,expectedQueries:0};diagFlowScope30A=scope;
 try{
 const wood=resourceTotal30A(v,'wood'),stone=resourceTotal30A(v,'stone'),gold=Number(v.gold||0),tiles=[...v.territory].map(id=>w.map.get(id)).filter(Boolean),out={};
 const defs=[['merchant_guild','trading_post',24,38,24,['LONG_DISTANCE_TRADE','COMMERCIAL_LAW']],['grand_market','market',30,46,32,['CURRENCY','COMMERCIAL_LAW']],['deep_quarry','quarry',18,32,20,['QUARRY']],['stoneworks',null,16,28,22,['MASONRY']]];
 // Small nations can perform fewer than four trade-flow reads. Avoid constructing an index then.
 scope.expectedQueries=defs.reduce((n,[to,base])=>{
  if(countBuilding30A(v,to)>0||to==='stoneworks'&&NS.V030B3?.stoneworksDiagnostic)return n;
  return n+(base?tiles.filter(t=>(t.buildings||[]).includes(base)).length:tiles.length*2);
 },0);
 scope.useIndex=scope.expectedQueries>=4;
 if(scope.useIndex)scope.tileSet=new Set(tiles.map(t=>Number(t.id)));
 for(const [to,base,gc,wc,sc,techs] of defs){
  const active=countBuilding30A(v,to);
  if(active){scope.skippedActive++;out[to]={active,status:'ACTIVE'};continue;}
  if(to==='stoneworks'&&NS.V030B3?.stoneworksDiagnostic){scope.skippedDelegated++;out[to]=NS.V030B3.stoneworksDiagnostic(v,w);continue;}
  const bases=base?countBuilding30A(v,base):tiles.length,tech=techs.some(x=>v.hasTech?.(x)),flowBase=base?tiles.filter(t=>(t.buildings||[]).includes(base)):tiles,maxFlow=flowBase.reduce((m,t)=>Math.max(m,recentFlow30A(v,w,t.id,120,to==='deep_quarry'||to==='stoneworks'?'stone':null).qty),0),blockers=[];
  if(base&&bases===0)blockers.push('NO_BASE_BUILDING');if(!tech)blockers.push('TECH');if(gold+1e-9<gc)blockers.push('TREASURY_GOLD');if(wood+1e-9<wc)blockers.push('WOOD');if(stone+1e-9<sc)blockers.push('STONE');if(['merchant_guild','grand_market'].includes(to)&&maxFlow<(to==='merchant_guild'?45:60))blockers.push('THROUGHPUT');if(to==='deep_quarry'&&!flowBase.some(t=>['rock','mountain'].includes(t.terrain)))blockers.push('TERRAIN');if(to==='stoneworks'){let pressure=false;for(const t of tiles){const f=recentFlow30A(v,w,t.id,240,'stone').qty,p=Number(t.marketState?.prices?.stone||.46);if(f>=28||p>=.69){pressure=true;break;}}if(!pressure)blockers.push('STONE_PROCESSING_DEMAND');}out[to]={active:0,bases,tech,treasury:+gold.toFixed(2),wood:+wood.toFixed(1),stone:+stone.toFixed(1),maxFlow120:+maxFlow.toFixed(1),blockers:blockers.length?blockers:['TRIGGER_SCORE_OR_SPACE']};
 }
 v.v30aSpecializationDiag=out;w.telemetry?.record?.('SPECIALIZATION_DIAGNOSTIC30A',w,{village:v.name,year:w.year,facilities:out});
 }finally{diagFlowScope30A=prev;NS.V034C1G?.record?.(w,v,scope,enabled?performance.now()-started:null);}
}
const season30A=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const r=season30A.call(this,w);specialDiag30A(this,w);return r;};

/* Extend V0.30 snapshot rows with maintenance diagnostics, then copy to annual summaries. */
const snapMaint30A=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snapMaint30A.call(this,w,reason,note);let wn=0,wu=0,sn=0,su=0;for(const row of s?.villages||[]){const v=(NS.V035H1B1?.lookupVillage?.(w,row.id)??w.villages.find(x=>Number(x.id)===Number(row.id))),m=v?.v30aMaintenance||{};Object.assign(row,{maintenanceWoodNeed30A:+Number(m.woodNeed||0).toFixed(2),maintenanceWoodUsed30A:+Number(m.woodUsed||0).toFixed(2),maintenanceWoodShortfall30A:+Number(m.woodShortfall||0).toFixed(4),maintenanceStoneNeed30A:+Number(m.stoneNeed||0).toFixed(2),maintenanceStoneUsed30A:+Number(m.stoneUsed||0).toFixed(2),maintenanceStoneShortfall30A:+Number(m.stoneShortfall||0).toFixed(4)});wn+=Number(m.woodNeed||0);wu+=Number(m.woodUsed||0);sn+=Number(m.stoneNeed||0);su+=Number(m.stoneUsed||0);}if(s?.global)Object.assign(s.global,{maintenanceWoodShortfall30A:wn?clampA(1-wu/wn,0,1):0,maintenanceStoneShortfall30A:sn?clampA(1-su/sn,0,1):0});patchAnnual30A(this,s);return s;};

/* CSV analysis: keep V0.30A diagnostic columns alongside the existing snapshot rows. */
const csv30A=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const base=csv30A.call(this),lines=base.split('\n');if(!lines.length)return base;const extra=['observedGoldSource30','observedGoldSink30','maintenanceWoodNeed30A','maintenanceWoodUsed30A','maintenanceWoodShortfall30A','maintenanceStoneNeed30A','maintenanceStoneUsed30A','maintenanceStoneShortfall30A'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;lines[0]+=','+extra.map(esc).join(',');let i=1;for(const s of this.snapshots||[])for(const v of s.villages||[]){if(i>=lines.length)break;lines[i++]+=','+extra.map(k=>esc(v[k]??s.global?.[k])).join(',');}return lines.join('\n');};

/* Save/load: A is a compatibility wrapper over the 0.30 data model. */
const worldSer30A=NS.World.prototype.serialize,worldFrom30A=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSer30A.call(this);d.version='0.30A';d.v30a={revision:REV30A,nations:(this.villages||[]).map(v=>({id:v.id,maintenance:v.v30aMaintenance||null,specializationDiag:v.v30aSpecializationDiag||null})),performanceYearly:this.telemetry?.performanceYearly30A||[]};return d;};
NS.World.from=function(d){if(d?.version==='0.30A'){const w=worldFrom30A({...d,version:'0.30'});w.telemetry.performanceYearly30A=d.v30a?.performanceYearly||d.telemetry?.performanceYearly30A||[];for(const x of d.v30a?.nations||[]){const v=w.villages.find(q=>Number(q.id)===Number(x.id));if(v){v.v30aMaintenance=x.maintenance||v.v30aMaintenance;v.v30aSpecializationDiag=x.specializationDiag||v.v30aSpecializationDiag;}}backfill30A(w);return w;}const w=worldFrom30A(d);backfill30A(w);return w;};

/* Stats: one price metric + commodity selector, and fixed V0.30 yearly data. */
function priceRows30A(ui){const scope=ui.statsScope||'nation',r=ui.statsResource30A||'food',key=PRICE_RES30A[r]?.[scope],period=Number(ui.statsPeriod||0),now=ui.world.year;let rows=[];if(scope==='world')rows=(ui.world.telemetry.yearlySummaries||[]).map(x=>({year:x.year,value:x.global?.[key]}));else if(scope==='nation'){const id=Number(ui.statsNationId??ui.world.selectedVillageId);rows=(ui.world.telemetry.yearlySummaries||[]).map(x=>({year:x.year,value:(x.nations||[]).find(n=>Number(n.id)===id)?.[key]}));}else{const id=Number(ui.statsNationId??ui.world.selectedVillageId),tile=Number(ui.statsSettlementId??ui.world.selectedTileId);rows=(ui.world.telemetry.settlementYearly?.[`${id}:${tile}`]||[]).map(x=>({year:x.y,value:x[key]}));}rows=rows.filter(x=>Number.isFinite(Number(x.value))).map(x=>({year:Number(x.year),value:Number(x.value)}));if(period>0)rows=rows.filter(x=>x.year>=Math.max(1,now-period+1));return rows;}
function drawRows30A(ui,rows,label,empty='이 조건에서 표시할 연간 기록이 없습니다.'){const canvas=ui.q('statsCanvas');if(!canvas)return;const wrap=canvas.parentElement,W=Math.max(300,Math.min(920,wrap?.clientWidth||760)),H=350,dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);const pad={l:58,r:18,t:24,b:38};ctx.font='12px system-ui';ctx.fillStyle='#93a6bf';if(!rows.length){ctx.fillText(empty,24,45);return;}let min=Math.min(...rows.map(x=>x.value)),max=Math.max(...rows.map(x=>x.value));if(min===max){min=Math.max(0,min-1);max+=1;}const margin=(max-min)*.08||1;min=Math.max(0,min-margin);max+=margin;const x0=pad.l,cw=W-pad.l-pad.r,ch=H-pad.t-pad.b,xf=y=>rows.length===1?x0+cw/2:x0+(y-rows[0].year)/(rows.at(-1).year-rows[0].year||1)*cw,yf=x=>pad.t+(max-x)/(max-min)*ch;ctx.strokeStyle='#2a3d58';for(let i=0;i<=4;i++){const y=pad.t+ch*i/4,val=max-(max-min)*i/4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+cw,y);ctx.stroke();ctx.fillStyle='#93a6bf';ctx.textAlign='right';ctx.fillText(Math.abs(val)>=1000?Math.round(val).toLocaleString():val.toFixed(Math.abs(max-min)<10?2:1),x0-7,y+4);}ctx.strokeStyle='#69adff';ctx.lineWidth=2.5;ctx.beginPath();rows.forEach((r,i)=>{const x=xf(r.year),y=yf(r.value);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.fillStyle='#eef5ff';ctx.textAlign='left';ctx.font='700 13px system-ui';ctx.fillText(label,pad.l,pad.t-7);ctx.font='11px system-ui';ctx.fillStyle='#93a6bf';ctx.textAlign='center';for(const i of [0,Math.floor((rows.length-1)/2),rows.length-1].filter((v,i,a)=>a.indexOf(v)===i))ctx.fillText(`${rows[i].year}년`,xf(rows[i].year),H-14);const last=rows.at(-1);ctx.fillStyle='#eef5ff';ctx.textAlign='right';ctx.fillText(`최근 ${last.year}년 · ${last.value.toLocaleString(undefined,{maximumFractionDigits:3})}`,W-pad.r,pad.t-7);}
function ensureResourceSelect30A(ui){let sel=document.getElementById('statsResource30A');if(!sel){sel=document.createElement('select');sel.id='statsResource30A';sel.innerHTML=Object.entries(PRICE_RES30A).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');ui.q('statsPeriod')?.insertAdjacentElement('beforebegin',sel);sel.addEventListener('change',()=>{ui.statsResource30A=sel.value;ui.renderStats();});}sel.value=ui.statsResource30A||'food';return sel;}
function captureBuildingOpen30A(ui){const tile=ui._v30aRenderedDetailTile;if(tile==null)return;const set=new Set();for(const d of ui.q('villageContent')?.querySelectorAll('.v29-building-group[open]')||[]){const name=d.querySelector('summary strong')?.textContent?.trim();if(name)set.add(name);}ui._v30aBuildingOpen=ui._v30aBuildingOpen||{};ui._v30aBuildingOpen[tile]=[...set];}
function restoreBuildingOpen30A(ui,tile){const wanted=new Set(ui._v30aBuildingOpen?.[tile]||[]);for(const d of ui.q('villageContent')?.querySelectorAll('.v29-building-group')||[]){const name=d.querySelector('summary strong')?.textContent?.trim();if(name&&wanted.has(name))d.open=true;}ui._v30aRenderedDetailTile=tile;}
function perfPanel30A(ui){const w=ui.world,p=w._v26Perf||w._v23Perf||{},q=w._v27Perf||{},parts=p.parts||{},leaf=q.parts||{},rank=Object.entries({...parts,...leaf}).filter(([,v])=>Number(v)>0).sort((a,b)=>b[1]-a[1]),hist=w.telemetry?.performanceYearly30A||[],last=hist.at(-1),sim=Number(p.simMs||0),speed=Math.max(1,Number(w.speed||1)),per=Number(p.msPerDay!=null?p.msPerDay:(sim/speed)),render=Number(p.renderMs||0),wall=Number(q.wallMs||0),chunk=Number(q.chunkDays||0),yields=Number(q.yields||0),hot=rank.slice(0,3).map(([k,v])=>`${k} ${Number(v).toFixed(1)}ms`).join(' · ');let el=document.getElementById('v30aPerfPanel');if(!el){el=document.createElement('div');el.id='v30aPerfPanel';el.className='panel';const panels=document.querySelectorAll('#view-world .panel');(panels[1]||panels[0])?.insertAdjacentElement('beforebegin',el);}el.innerHTML=`<div class="section-head"><div><h2>성능 관측</h2><div class="muted small">패치노트와 분리된 고정 telemetry · 연간 기록 ${hist.length}년</div></div><span class="tag">인구 ${w.allPeople?.length||0}</span></div><div class="v30a-perf-grid"><span>SIM/day <b>${per.toFixed(1)}ms</b></span><span>SIM batch <b>${sim.toFixed(1)}ms</b></span><span>Render <b>${render.toFixed(1)}ms</b></span><span>Wall <b>${wall.toFixed(1)}ms</b></span><span>Speed <b>×${speed}</b></span><span>Chunk/Yield <b>${chunk}d / ${yields}</b></span></div><div class="small muted">HOT ${hot||'아직 측정 없음'}${last?` · 연간 최근 ${last.year}년 ${Number(last.msPerDay||0).toFixed(1)}ms/day`:''}</div>`;}

if(NS.UI){const headerA=NS.UI.prototype.renderHeader,contentA=NS.UI.prototype.renderVillageContent,statsA=NS.UI.prototype.renderStats,worldA=NS.UI.prototype.renderWorld,setWorldA=NS.UI.prototype.setWorld;
 NS.UI.prototype.setWorld=function(w){setWorldA.call(this,w);backfill30A(this.world);};
 NS.UI.prototype.renderHeader=function(){headerA.call(this);const el=this.q('runtimeStatus');if(el)el.textContent=el.textContent.replace('V0.30','V0.30A');document.title='Village Observer V0.30A';const e=document.querySelector('.eyebrow');if(e)e.textContent='Village Observer · V0.30A';const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>V0.30A</strong>';};
 NS.UI.prototype.renderVillageContent=function(){captureBuildingOpen30A(this);contentA.call(this);if(this.sub==='settlements'){const tile=Number(this.selectedSettlementDetailId??this.world.selectedTileId);if(Number.isFinite(tile))restoreBuildingOpen30A(this,tile);}if(this.sub==='economy'){const v=this.world.selectedNation,m=v?.v30aMaintenance,diag=v?.v30aSpecializationDiag,root=this.q('villageContent');if(root&&m&&!root.querySelector('.v30a-maint-box')){root.insertAdjacentHTML('afterbegin',`<div class="v30-box v30a-maint-box"><strong>🛠️ 유지보수 자재 진단</strong><div class="small">목재 필요 ${Number(m.woodNeed||0).toFixed(1)} / 사용 ${Number(m.woodUsed||0).toFixed(1)} · 부족 ${(Number(m.woodShortfall||0)*100).toFixed(0)}%</div><div class="small">석재 필요 ${Number(m.stoneNeed||0).toFixed(1)} / 사용 ${Number(m.stoneUsed||0).toFixed(1)} · 부족 ${(Number(m.stoneShortfall||0)*100).toFixed(0)}%</div></div>`);}if(root&&diag&&!root.querySelector('.v30a-spec-box')){const rows=Object.entries(diag).map(([k,x])=>`<div><b>${NS.BUILDINGS?.[k]?.label||k}</b><span>${x.status==='ACTIVE'?'가동 중':(x.blockers||[]).join(' · ')}</span></div>`).join('');root.insertAdjacentHTML('afterbegin',`<div class="v30-box v30a-spec-box"><strong>🔎 상위시설 진단</strong><div class="v30-regions">${rows}</div></div>`);}}};
 NS.UI.prototype.renderStats=function(){if(/^price_(food|wood|stone)$/.test(this.statsMetric||'')){this.statsResource30A=(this.statsMetric||'price_food').split('_')[1];this.statsMetric='avgPrice30A';}const requested=this.statsMetric,isPrice=requested==='avgPrice30A';if(isPrice)this.statsMetric='population';backfill30A(this.world);statsA.call(this);if(isPrice)this.statsMetric=requested;const metric=this.q('statsMetric'),res=ensureResourceSelect30A(this);for(const k of Object.keys(PRICE_RES30A)){metric?.querySelector(`option[value="price_${k}"]`)?.remove();}if(metric&&!metric.querySelector('option[value="avgPrice30A"]'))metric.insertAdjacentHTML('beforeend','<option value="avgPrice30A">평균 가격</option>');if(isPrice&&metric)metric.value='avgPrice30A';res.style.display=isPrice?'':'none';if(isPrice){const label=`평균 가격 · ${PRICE_RES30A[this.statsResource30A||'food'].label}`;drawRows30A(this,priceRows30A(this),label);const note=this.q('statsNote');if(note)note.textContent='V0.30A: 가격 통계는 상품 선택형입니다. 이후 자원이 늘어나도 같은 선택기를 확장합니다.';}};
 NS.UI.prototype.renderWorld=function(){worldA.call(this);perfPanel30A(this);};
}

/* A patch note is intentionally compact; detailed rules live in README. */
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.30A'))NS.PATCH_NOTES.unshift({version:'V0.30A',date:'2026-09-25',title:'V0.30 보완',summary:'V0.30 장기주행에서 확인된 UI 상태·연간 통계·재정·관측 문제를 보완했습니다.',sections:[['수정',['정착지 건물 상세 펼침 상태가 게임 틱 렌더 뒤에도 유지됩니다.','세계/국가 Gold·행정 V0.30 지표를 연간 요약에도 기록합니다.','가격 통계를 평균 가격 + 상품 선택 방식으로 통합했습니다.']],['재정·행정',['시장 운전자금을 보호한 뒤 잉여 Settlement Gold에 30일당 0.38% 기본 행정세를 적용합니다.','도시·주요 도시의 징수 효율을 높이고 다중 행정 중심지가 더 현실적인 규모에서 형성되도록 조건을 완화했습니다.']],['관측',['성능 수치를 패치노트와 분리한 고정 성능 관측 패널·연간 history에 저장합니다.','유지보수 목재/석재 부족과 상위 상업·석재시설의 미등장 원인을 별도 telemetry로 기록합니다.']]]});

/* Dedicated save key for the lettered adjustment patch. */
(function(){const KEY='village-observer-v0-30a',fallback=['village-observer-v0-30','village-observer-v0-29','village-observer-v0-28','village-observer-v0-27','village-observer-v0-26','village-observer-v0-25','village-observer-v0-24','village-observer-v0-23'];function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){let r=localStorage.getItem(KEY);for(const k of fallback)if(!r)r=localStorage.getItem(k);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v030A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){dl(`village-observer-v030A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportDevCSV(w){dl(`village-observer-v030A-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));},async importMap(file){return NS.V030.attachWorld(NS.V019.worldFromMapData(JSON.parse(await file.text())));}};})();

if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent=`.v30a-perf-grid{display:grid;grid-template-columns:repeat(3,minmax(110px,1fr));gap:6px;margin:8px 0}.v30a-perf-grid span{padding:7px 8px;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.035);font-size:10px}.v30a-perf-grid b{float:right}.v30a-spec-box .v30-regions>div{font-size:9px}@media(max-width:650px){.v30a-perf-grid{grid-template-columns:repeat(2,1fr)}}`;document.head.appendChild(st);}
NS.V030A={revision:REV30A,backfill:backfill30A};
})(window.VSim);
