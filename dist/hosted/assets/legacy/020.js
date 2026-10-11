
window.VSim=window.VSim||{};
(function(NS){
"use strict";

/* ============================================================
   V0.12 · nation-color UI consistency + telemetry integrity fixes
   ============================================================ */

const NATION_COLORS=NS.NATION_COLORS||(NS.NATION_COLORS=['#62a8ff','#74d69c','#ff8b91','#bd9cff']);
NS.NATION_BORDER_COLORS=NS.NATION_BORDER_COLORS||['#245a8f','#2f8054','#a83d45','#6d50a0','#9a6a22','#2d8582','#9a4f82'];
const nationColor=v=>{const a=NS.NATION_COLORS||NATION_COLORS;return a[(v?.id??0)%a.length];};

/* ---------- CSV: write the nation name into the village column ---------- */
NS.Telemetry.prototype.snapshotsCSV=function(){
 const c=['simTime','ordinalDay','reason','note','village','status','brain','population','avgHealth','avgHappiness','avgEnergy','avgHunger','food','foodReserveDays','wood','stone','gold','foodStorage','woodStorage','stoneStorage','security','threat','focus','territoryTiles','occupiedTiles','resourceFoodRatio','resourceWoodRatio','resourceStoneRatio','resourceGoldRatio','expansionTarget','expansionProgress','age0_14','age15_17','age18_42','age43_64','age65plus','reproductiveWomen','reproductiveMen','technologyCount','technologies','researchTarget','researchLabel','researchProgress','researchCost','totalKnowledge','tradeCount','tradeImports','tradeExports','tradeGoldSpent','tradeGoldEarned','tradeShippingEarned','internalMigrations','externalIn','externalOut','settlements','warehouses','tradingPosts','houses','houseLimitTotal','reachableTradeNations','nearestTradeCost'];
 const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;
 const rows=[c.map(esc).join(',')];
 for(const s of this.snapshots||[])for(const v of s.villages||[]){
  rows.push(c.map(k=>{
   let value;
   if(k==='village')value=v.name??v.village??'';
   else if(Object.prototype.hasOwnProperty.call(v,k))value=v[k];
   else if(k==='simTime')value=s.simTime;
   else if(k==='ordinalDay')value=s.ordinalDay;
   else if(k==='reason')value=s.reason;
   else if(k==='note')value=s.note;
   else value='';
   return esc(value);
  }).join(','));
 }
 return rows.join('\n');
};

/* ---------- Year summaries: keep event counts synchronized through day 120 ---------- */
const record11=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){
 const e=record11.call(this,type,w,payload);
 const y=w.year||Math.max(1,Math.floor((w.ordinalDay()-1)/120)+1);
 const summary=(this.yearlySummaries||[]).find(x=>x.year===y);
 if(summary)summary.eventCounts={...(this.yearlyEventCounts?.[y]||{})};
 return e;
};

/* ---------- Internal migration: never vacate a settlement's last resident ---------- */
NS.Village.prototype.internalMigration=function(w){
 if(this.territory.size<2||this.population()<this.territory.size+4)return false;
 const candidates=this.residents.filter(p=>p.alive&&p.age>=16&&p.assignment!=='PIONEER'&&(w.ordinalDay()-(p.lastMoveDay||-9999)>180)&&this.tileResidents(p.homeTileId).filter(x=>x.alive).length>1);
 if(!candidates.length)return false;
 const settlements=[...this.territory].map(id=>w.map.get(id)).filter(Boolean);
 let best=null;
 for(const p of candidates){
  const src=w.map.get(p.homeTileId);if(!src)continue;
  const srcScore=this.settlementAttractiveness(w,src,p);
  for(const dest of settlements){
   if(dest.id===src.id)continue;
   const ds=this.settlementAttractiveness(w,dest,p),destPop=this.tileResidents(dest.id).filter(x=>x.alive).length,bonus=dest.id!==this.coreTileId&&destPop<=1?12:0,diff=ds-srcScore+bonus;
   if(!best||diff>best.diff)best={p,dest,diff};
  }
 }
 if(!best||best.diff<10||Math.random()>.52)return false;
 const from=best.p.homeTileId,a=w.map.get(from);if(!a)return false;
 best.p.homeTileId=best.dest.id;best.p.lastMoveDay=w.ordinalDay();this.migrationStats.internal++;
 w.log(`${this.name}의 ${best.p.name}이(가) (${a.x},${a.y})에서 (${best.dest.x},${best.dest.y}) 정착지로 이주했습니다.`,false,'INTERNAL_MIGRATION',{village:this.name,person:best.p.name,fromTileId:from,toTileId:best.dest.id});
 return true;
};

/* ---------- Serialization / save migration ---------- */
function attachV12World(w){NS.V011.attachWorld(w);return w;}
NS.V012={attachWorld:attachV12World,nationColors:NATION_COLORS,nationColor};

const serW11=NS.World.prototype.serialize,fromW11=NS.World.from;
NS.World.prototype.serialize=function(){const d=serW11.call(this);d.version='0.12';d.v12={nationColorUI:true,csvNationNameFix:true,yearlySummaryEventSync:true,migrationSourceProtection:true};return d;};
NS.World.from=function(d){
 if(!['0.8','0.9','0.10','0.11','0.12'].includes(d.version))throw new Error('V0.8~V0.12 세이브만 불러올 수 있습니다.');
 const source=d.version,w=fromW11(source==='0.12'?{...d,version:'0.11'}:d);
 return attachV12World(w);
};

const json11=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json11.call(this,w);d.version='0.12';d.worldSummary.csvNationNameFix=true;d.worldSummary.yearlySummaryEventSync=true;d.worldSummary.migrationSourceProtection=true;return d;};

(function(){
 const KEY12='village-observer-v0-12',KEY11='village-observer-v0-11',KEY10='village-observer-v0-10',KEY9='village-observer-v0-9',KEY8='village-observer-v0-8';
 function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 NS.SaveSystem={
  save(w){localStorage.setItem(KEY12,JSON.stringify(w.serialize()));},
  load(){const r=localStorage.getItem(KEY12)||localStorage.getItem(KEY11)||localStorage.getItem(KEY10)||localStorage.getItem(KEY9)||localStorage.getItem(KEY8);return r?NS.World.from(JSON.parse(r)):null;},
  export(w){dl(`village-observer-v012-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
  exportDevJSON(w){dl(`village-observer-v012-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
  exportDevCSV(w){dl(`village-observer-v012-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},
  async import(file){return NS.World.from(JSON.parse(await file.text()));}
 };
})();

/* ---------- UI: show the exact map nation color in the Nation tab ---------- */
if(NS.UI){
 const cards11=NS.UI.prototype.renderVillageCards,content11=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.setWorld=function(w){this.stop();this.world=attachV12World(w);this.render();};
 NS.UI.prototype.renderHeader=function(){this.q('timeLabel').textContent=this.world.timestamp();this.q('worldMood').textContent=` · ${this.world.activeVillages.length}개 국가`;this.q('playBtn').textContent=this.world.running?'⏸':'▶';document.querySelectorAll('.speed').forEach(b=>b.classList.toggle('active',+b.dataset.speed===this.world.speed));this.q('runtimeStatus').textContent='✓ V0.12 국가 색상 연동 · 로그/이주 무결성 개선';this.q('runtimeStatus').style.color='#5bd79d';};
 NS.UI.prototype.renderVillageCards=function(){
  cards11.call(this);
  const buttons=[...this.q('villageCards').querySelectorAll('.village-card')];
  this.world.villages.forEach((v,i)=>{const b=buttons[i];if(!b)return;const color=nationColor(v);b.style.setProperty('--nation-color',color);if(!b.querySelector('.v12-nation-card-color'))b.insertAdjacentHTML('afterbegin','<span class="v12-nation-card-color" aria-hidden="true"></span>');});
 };
 NS.UI.prototype.renderVillageContent=function(){
  content11.call(this);
  const v=this.world.selectedNation,el=this.q('villageContent');if(!v||!el)return;
  const color=nationColor(v);el.style.setProperty('--nation-color',color);
  if(!el.querySelector('.v12-nation-color-header'))el.insertAdjacentHTML('afterbegin',`<div class="v12-nation-color-header" title="지도에서 사용하는 ${v.name}의 국가 색상"><span class="v12-nation-color-swatch" style="background:${color}"></span><strong>${v.name}</strong><span class="small muted">지도 국가 색상</span></div>`);
 };
}

if(typeof document!=='undefined'){
 const st=document.createElement('style');
 st.textContent=`
 .village-card{position:relative;overflow:hidden;padding-top:13px}.v12-nation-card-color{position:absolute;left:0;right:0;top:0;height:5px;background:var(--nation-color,#69adff)}.village-card.selected{outline-color:var(--nation-color,#69adff);box-shadow:0 0 0 3px color-mix(in srgb,var(--nation-color,#69adff) 24%,transparent)}
 #villageContent{position:relative;border-top:5px solid var(--nation-color,var(--line))}.v12-nation-color-header{display:flex;align-items:center;gap:8px;margin:-2px 0 12px;padding-bottom:9px;border-bottom:1px solid var(--line)}.v12-nation-color-swatch{width:16px;height:16px;border-radius:5px;box-shadow:0 0 0 1px #ffffff33 inset;flex:0 0 auto}.v12-nation-color-header .muted{margin-left:auto}
 @media(max-width:600px){.v12-nation-color-header .muted{display:none}}
 `;
 document.head.appendChild(st);
}

})(window.VSim);

