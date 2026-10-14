/* Village Observer V0.34F0 — Settlement ration planning + individual survival.
 * Explicit MODEL CHANGE: physical food is withdrawn once per settlement/cycle,
 * and a deterministic weighted allocation is passed to individual residents.
 * Personal hunger/energy/health/happiness remain individually simulated.
 */
(function(NS){'use strict';
const VERSION='V0.34F0',PREVIOUS='V0.34E-rc5',KEY='village-observer-v034f0';
const D3=NS.V034D3,OBS=NS.V034D3A;
const stateByWorld=new WeakMap(), perfByWorld=new WeakMap();
const clamp=(x,lo=0,hi=100)=>Math.max(lo,Math.min(hi,Number(x)||0));
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const cal=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
function cycleState(w){const stamp=cal(w);let s=stateByWorld.get(w);if(!s||s.stamp!==stamp){s={stamp,nations:new Map(),groups:[],cycles:0,residents:0,requested:0,received:0,delivered:0,returned:0,returnFailed:0,missing:0};stateByWorld.set(w,s);}return s;}
function nationState(w,v,s){let n=s.nations.get(v);if(n)return n;
 const groups=new Map(),homeToGroup=new Map();
 for(const p of v.residents||[]){if(!p.alive)continue;const tid=Number(p.homeTileId),tile=w.map.get(tid);if(!tile||String(tile.ownerId)!==String(v.id))continue;
  const sid=tile.settlementId!=null?String(tile.settlementId):'tile-'+tid;
  let group=groups.get(sid);if(!group){group={sid,anchor:tid,members:[],v,w,started:false,rations:new Map(),used:new Set(),received:0,requested:0,delivered:0};groups.set(sid,group);s.groups.push(group);}
  group.members.push(p);homeToGroup.set(tid,group);
 }
 n={groups,homeToGroup};s.nations.set(v,n);return n;
}
function needFor(p){const base=p.age<15?.30:.42;const military=(p.assignment==='MILITARY'||p.job==='경비'||p.formationId!=null)?1.09:1;return base*military;}
function priorityFor(p,policy='BALANCED'){let weight=1;if(p.age<15)weight+=.20;else if(p.age>=65)weight+=.10;
 if(num(p.health)<40)weight+=.14; if(p.assignment==='MILITARY'||p.job==='경비')weight+=.08;
 if(['농부','채집꾼','사냥꾼','광부','목수','건축가','철공'].includes(p.job))weight+=.04;
 if(policy==='CHILD_FIRST'&&p.age<15)weight+=.3;
 if(policy==='WORK_FIRST'&&p.age>=15&&p.age<65)weight+=.22;
 return weight;
}
function allocate(members,total,policy){const arr=members.map(p=>({p,need:needFor(p),weight:priorityFor(p,policy),given:0}));
 // Weighted water filling. A complete group never consumes beyond its actual withdrawal.
 let left=Math.max(0,total),active=arr.slice();for(let round=0;round<4&&left>1e-10&&active.length;round++){
  const denom=active.reduce((sum,a)=>sum+a.need*a.weight,0);if(denom<=0)break;
  let spent=0;for(const a of active){const share=left*a.need*a.weight/denom,amount=Math.min(Math.max(0,a.need-a.given),share);a.given+=amount;spent+=amount;}
  left=Math.max(0,left-spent);active=active.filter(a=>a.need-a.given>1e-10);
 }
 if(left>1e-9){for(const a of arr){if(left<=1e-9)break;const extra=Math.min(a.need-a.given,left);a.given+=extra;left-=extra;}}
 return arr;
}
function prepare(group,s){if(group.started)return;group.started=true;const {w,v}=group,people=group.members;let requested=0;for(const p of people)requested+=needFor(p);
 group.requested=requested;s.requested+=requested;s.residents+=people.length;s.cycles++;
 // Settlement membership and stock are resolved once for the entire group.
 const m=D3?.members(v,group.anchor),available=Math.max(0,Number(v.stockAt(group.anchor,'food')||0));
 let capacity=0;
 for(const id of m?.ids||[group.anchor]){const tile=w.map.get(id);for(let i=0;i<(tile?.buildings||[]).length;i++){
  if(num(tile.buildingCondition?.[i]??100)<=0)continue;
  capacity+=Math.max(0,num(NS.BUILDINGS?.[tile.buildings[i]]?.capacity));
 }}
 group.housingStress=people.length?Math.min(1,Math.max(0,(people.length-capacity)/people.length)):0;
 const target=Math.min(requested,available),got=Math.max(0,Number(v.withdrawAt(group.anchor,'food',target)||0));
 group.received=got;s.received+=got;
 const policy=['BALANCED','CHILD_FIRST','WORK_FIRST'].includes(v.v034f0RationPolicy)?v.v034f0RationPolicy:'BALANCED';
 const allotments=allocate(people,got,policy);
 // F1 observational hook: allocation has already been determined, so this
 // cannot influence inventory, Person order, or RNG.
 if(NS.V034F1?.recordRation){let hungerHigh=0,healthLow=0;for(const person of people){if(num(person.hunger)>=85)hungerHigh++;if(num(person.health)<25)healthLow++;}
  NS.V034F1.recordRation(w,v,group,{requested,received:got,available,population:people.length,hungerHigh,healthLow});}
 for(const a of allotments)group.rations.set(a.p,a);
 // D3's physical withdrawal records the reserve as 'otherWithdrawn'. Relabel it
 // as meals in the existing 30-day ledger without creating/removing physical food.
 if(OBS){OBS.addMetric(w,v,group.anchor,'otherWithdrawn',-got);OBS.addMetric(w,v,group.anchor,'mealReceived',got);OBS.addMetric(w,v,group.anchor,'mealRequested',requested);}
 const stats=NS.V034D3?.stats?.(w);if(stats){stats.foodMealCalls+=people.length;stats.foodMealRequested+=requested;stats.foodMealReceived+=got;}
}
function survive(p,v,w,worked,amount,need,housingStress=0){
 const ratio=need>0?Math.min(1,Math.max(0,amount/need)):1;
 p.hunger=clamp(num(p.hunger)+(worked?5+Math.random()*3:4+Math.random()*2));
 p.energy=clamp(num(p.energy)-(worked?8+Math.random()*5:4+Math.random()*3));
 const before=p.hunger;
 if(amount>0){const curve=1-Math.pow(1-clamp(before/100,0,1),2);const relief=(5+Math.random()+(3+Math.random())*curve)*ratio;
  p.hunger=clamp(p.hunger-relief);
  NS.V032E11?.recordHungerRelief?.(p,v,w,before-p.hunger);
  NS.V032E12?.recordHungerCurve?.(p,v,w,before,before-p.hunger,relief);
 }
 NS.V032E10?.recordMeal?.(p,v,w,need,amount,ratio>=.8);
 p.energy=clamp(p.energy+(worked?8+Math.random()*5:10+Math.random()*5)*(.65+.35*ratio));
 p.energy+=(82-p.energy)*.035;
 let delta=(82-num(p.health))*.002-(1-ratio)*1.0;
 if(p.hunger>80)delta-=.65;
 if(p.age>60)delta-=.035;
 p.health=clamp(num(p.health)+delta);
 if(v.hasTech?.('SANITATION')&&p.alive&&p.health<86&&p.hunger<70)p.health=Math.min(100,p.health+.012);
 if(housingStress>0){p.housingStrainDays=num(p.housingStrainDays)+1;
  if(p.housingStrainDays>20){p.energy=clamp(p.energy-.035-.11*housingStress);p.happiness=clamp(p.happiness-.015-.045*housingStress);}
  if(p.housingStrainDays>45)p.health=clamp(p.health-.01-.035*housingStress);
 }else p.housingStrainDays=Math.max(0,num(p.housingStrainDays)-2);
 p.happiness=clamp(num(p.happiness)+(65-num(p.happiness))*.0025-(1-ratio)*.18);
 const target=clamp(52+(50-p.hunger)*.18+(p.health-60)*.10+(p.energy-55)*.07-8*housingStress,15,90);
 p.happinessTarget=target;p.happiness=clamp(p.happiness+(target-p.happiness)*.014);
 const festival=v.festivalState;
 if(festival&&num(festival.until)>=w.ordinalDay?.()){const ft=clamp(target+(Number(p.homeTileId)===Number(festival.tileId)?8:3),0,95);
  p.happinessTarget=ft;p.happiness=clamp(p.happiness+(ft-p.happiness)*.012);}
 if(p.hunger<95)p._v30b3Hunger100SinceCal=null;
 // One individual health/hunger experience despite collective food allocation.
 return ratio;
}
NS.Person.prototype.metabolism=function(v,w,worked=true){if(!this.alive)return;
 const s=cycleState(w),n=nationState(w,v,s),tile=w.map.get(Number(this.homeTileId)),sid=tile?.settlementId!=null?String(tile.settlementId):'tile-'+this.homeTileId;
 const group=n.groups.get(sid)||n.homeToGroup.get(Number(this.homeTileId));
 if(!group){s.missing++;survive(this,v,w,worked,false,needFor(this));return;}
 prepare(group,s);
 const a=group.rations.get(this);if(!a||group.used.has(this))return;
 group.used.add(this);group.delivered+=a.given;s.delivered+=a.given;
 survive(this,v,w,worked,a.given,a.need,group.housingStress);
};
function settleCycle(w){const s=stateByWorld.get(w);if(!s)return;
 for(const g of s.groups){if(!g.started)continue;const unused=Math.max(0,g.received-g.delivered);if(unused<1e-8)continue;
  const returned=Number(g.v.depositAt(g.anchor,'food',unused)||0);s.returned+=returned;s.returnFailed+=Math.max(0,unused-returned);
  // Actual refund is not a new production input and unused reserve is not a meal.
  // Refund is a real 'otherDeposited' entry: together with the earlier
  // allocation withdrawal it preserves the physical opening/closing ledger.
  // Report delivered consumption separately, as mealReceived includes reservations.
 }
 const next=stats(w);next.cycles+=s.cycles;next.residents+=s.residents;next.requested+=s.requested;next.consumed+=s.delivered;
 next.unspent+=s.returnFailed;next.returned+=s.returned;next.unmatched+=s.missing;
 stateByWorld.delete(w);
}
function stats(w){let s=perfByWorld.get(w);if(!s){s={cycles:0,residents:0,requested:0,consumed:0,unspent:0,returned:0,unmatched:0,years:{},lastPerfSample:-1,yearlyExceeded:0};perfByWorld.set(w,s);}return s;}
const advance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){try{return advance.apply(this,args);}finally{settleCycle(this);}};
function samplePerf(w){if(Number(w.speed)!==10)return;const p=w._v26Perf;if(!p||!Number.isFinite(p.simMs))return;const s=stats(w),index=num(p.samples);if(index<=s.lastPerfSample)return;s.lastPerfSample=index;
 const yr=Math.max(1,Number(w.year)||1),b=num(p.simMs);const r=s.years[yr]||(s.years[yr]={year:yr,samples:0,sum:0,max:0,over:0,pop:0,settlements:0});
 r.samples++;r.sum+=b;r.max=Math.max(r.max,b);if(b>=1000){r.over++;s.yearlyExceeded++;}
 r.pop=(w.villages||[]).reduce((n,v)=>n+(v.residents||[]).reduce((k,p)=>k+(p.alive?1:0),0),0);
 r.settlements=(w.v34b?.settlements||[]).filter(x=>x.lifecycle==='ACTIVE').length;
}
function performanceReport(w){const s=stats(w),years=Object.values(s.years).sort((a,b)=>a.year-b.year).map(r=>({...r,meanMs:r.samples?r.sum/r.samples:0}));
 return {version:VERSION,metric:'in-game smoothed SIM/BATCH',requiredSpeed:10,thresholdMs:1000,maxYear:150,years,allSamples:years.reduce((a,r)=>a+r.samples,0),overThresholdSamples:s.yearlyExceeded,model:{cycle:'Settlement pooled ration + Person survival',note:'old/new model numerical and RNG identity is not required'},consumption:{cycles:s.cycles,residents:s.residents,requested:s.requested,consumed:s.consumed,returned:s.returned,returnFailed:s.unspent,unmatched:s.unmatched}};
}
function download(filename,content,mime){const url=URL.createObjectURL(new Blob([content],{type:mime||'application/json'})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=oldSerialize.call(this);data.version=VERSION;const s=stats(this);data.v034f0Performance={...s,years:s.years};data.v034f0Policies=(this.villages||[]).map(v=>[v.id,v.v034f0RationPolicy||'BALANCED']);return data;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('Invalid save');const w=oldFrom(data.version===VERSION?{...data,version:PREVIOUS}:data);const prev=data.v034f0Performance;if(prev&&typeof prev==='object'){const s=stats(w);for(const k of ['cycles','residents','requested','consumed','unspent','returned','unmatched','yearlyExceeded'])s[k]=num(prev[k]);s.years=prev.years||{};s.lastPerfSample=num(w._v26Perf?.samples);}if(Array.isArray(data.v034f0Policies))for(const [id,policy] of data.v034f0Policies){const v=(w.villages||[]).find(x=>String(x.id)===String(id));if(v)v.v034f0RationPolicy=policy;}return w;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=oldJSON.call(this,w);out.version=VERSION;if(out.worldSummary){out.worldSummary.v034f0={model:'SETTLEMENT_RATION_B',metabolism:performanceReport(w).consumption,performance:performanceReport(w)};}return out;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034e-rc5');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F0-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034F0-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportF0Perf(w){download(`village-observer-v034F0-performance-${w.year}y.json`,JSON.stringify(performanceReport(w),null,2));}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const v=document.getElementById('versionBadge');if(v)v.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const prior=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const result=prior.apply(this,args),w=this.world;if(w)samplePerf(w);badge();
  if(typeof document!=='undefined'&&w){let host=document.getElementById('v034f0PerfPanel'),parent=document.getElementById('v30aPerfPanel')||document.getElementById('v034eE01Panel')||document.getElementById('runtimeStatus')||document.getElementById('versionBadge');
   if(parent?.parentElement){if(!host){host=document.createElement('div');host.id='v034f0PerfPanel';host.className='panel';host.innerHTML='<div class="section-head"><h2>F0 · 150년 성능 목표</h2><span class="tag">×10 / 1000ms</span></div><div id="v034f0PerfText" class="small muted"></div><button id="v034f0PerfExport">×10 성능 기록 JSON</button>';parent.insertAdjacentElement('afterend',host);host.querySelector('#v034f0PerfExport').onclick=()=>NS.SaveSystem.exportF0Perf(this.world);}
    const r=performanceReport(w),rows=r.years,peak=rows.reduce((v,x)=>Math.max(v,x.max),0),t=host.querySelector('#v034f0PerfText');if(t)t.textContent=`기록 ${r.allSamples}배치 · 최고 ${peak.toFixed(1)}ms · 1000ms 초과 ${r.overThresholdSamples}회 · 올해 ${w.year}년 · ×10에서만 공식 집계`;}
  }
  return result;};
}
badge();
try{window.villageObserver?.renderHeader?.();}catch(e){}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-14',title:'Settlement Metabolism B — 개인 생존·정착지 차등 배급',summary:'개별 주민의 Hunger·Health를 유지하고 식량 수요·출납을 정착지 단위로 통합합니다. 구버전과 생존 결과 및 RNG는 달라질 수 있습니다.',sections:[['정착지 배급',['기본·추가 식량 수요를 합쳐 Settlement별 배급량을 계산합니다.','아동·노약자·건강 취약자·근로자·군인에 따라 배급 우선순위를 다르게 적용하며 실제 재고에서 일괄 출납합니다.']],['개인 생존',['주민별 Hunger·Energy·Health·Happiness와 기아 누적 상태를 유지합니다.','영양 부족 정도에 따라 개인의 Hunger 완화와 건강 악화를 연속적으로 처리합니다.']],['성능·검증',['PC ×10 자연주행에서 인게임 SIM/BATCH 1000ms 미만, 150년까지 유지하는 것을 최종 목표로 삼습니다.','연도별 평활 SIM/BATCH 최고치·평균·초과 횟수와 인구·Settlement 수를 기록합니다.','F0는 모델 개편이므로 기존 버전과 RNG/수치 동등성은 요구하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034F0=Object.freeze({version:VERSION,performanceReport,recordBatch:samplePerf,metabolismStats:w=>({...stats(w)}),needFor,priorityFor,survive});
})(window.VSim);
