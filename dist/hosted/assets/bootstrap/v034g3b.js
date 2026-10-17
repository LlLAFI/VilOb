/* V0.34G3B — One-day integration gate (existing pooled stock and G3 split preserved).
 * Integration is allowed only if from core to EVERY member and back costs <=1.00.
 * No new technology, AI, food, money, or military rules.
 */
(function(NS){'use strict';
const VERSION='V0.34G3B',PREV='V0.34G3A',KEY='village-observer-v034g3b',joinLimit=1.00,EPS=1e-8;
const config={enabled:true};
const metrics=new WeakMap();
function counter(w){let m=metrics.get(w);if(!m){m={joinRejectedOverOneDay:0,joinAcceptedWithinOneDay:0};metrics.set(w,m);}return m;}
function onCandidate(w,p){if((p.ar||p.br)&&!p.ac&&!p.bc)counter(w).joinRejectedOverOneDay++;}
function onMerge(w){counter(w).joinAcceptedWithinOneDay++;}
function travelStats(w,ids,core){
 const allowed=new Set((ids||[]).map(Number)),root=Number(core),nodes=new Map();
 if(!allowed.has(root))return {max:null,outboundMax:null,returnMax:null,unreachable:true};
 for(const id of allowed){const t=w.map?.get?.(id),v=w.villages?.find(v=>String(v.id)===String(t?.ownerId)),i=t?.buildings?.indexOf('road')??-1;
  if(!t||!NS.TERRAIN?.[t.terrain]?.passable)return {max:null,outboundMax:null,returnMax:null,unreachable:true};
  const paved=i>=0&&Number(t.buildingCondition?.[i]??100)>=25&&!!v?.hasTech?.('ROADS');
  nodes.set(id,(NS.V034G4?.spatialStep?.(w,t)??(Number(NS.TERRAIN[t.terrain].tradeCost||1)*(paved?.62:1))));
 }
 const sweep=rev=>{const dist=new Map([[root,0]]),queue=[[0,root]];while(queue.length){queue.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const [cost,id]=queue.shift();if(cost>dist.get(id)+EPS)continue;
  for(const n of w.map.neighbors4(id)){if(!allowed.has(n.id))continue;const next=cost+(rev?nodes.get(id):nodes.get(n.id));if(next>=((dist.get(n.id)??Infinity)-EPS))continue;dist.set(n.id,next);queue.push([next,n.id]);}}
  return dist.size===allowed.size?Math.max(...dist.values()):Infinity;};
 const outbound=sweep(false),back=sweep(true),maximum=Math.max(outbound,back);
 return {max:Number.isFinite(maximum)?+maximum.toFixed(5):null,outboundMax:Number.isFinite(outbound)?+outbound.toFixed(5):null,returnMax:Number.isFinite(back)?+back.toFixed(5):null,unreachable:!Number.isFinite(maximum)};
}
function inspect(w){const rows=[],settlements=w.v34b?.settlements||[];let over=0,unreachable=0,grandfathered=0;
 for(const r of settlements){if(r.lifecycle!=='ACTIVE'||!r.tileIds?.length)continue;
  const cost=travelStats(w,r.tileIds,r.coreTileId),tooFar=cost.unreachable||cost.max>joinLimit+EPS;
  if(tooFar)over++;if(cost.unreachable)unreachable++;if(tooFar&&r.v034g3bLegacy)grandfathered++;
  rows.push({id:r.id,nationId:r.nationId,coreTileId:r.coreTileId,tiles:r.tileIds.length,...cost,overOneDay:tooFar,legacy:r.v034g3bLegacy===true});
 }
 rows.sort((a,b)=>((b.max??Infinity)-(a.max??Infinity))||b.tiles-a.tiles||String(a.id).localeCompare(String(b.id)));
 return {joinLimit,activeSettlements:rows.length,overOneDaySettlements:over,unreachableSettlements:unreachable,grandfatheredOverOneDay:grandfathered,maxSettlementTravelCost:rows.length?rows[0].max:0,worstSettlements:rows.filter(x=>x.overOneDay).slice(0,15)};
}
function summary(w,{details=false}={}){const metric={...counter(w)};return details?{...metric,...inspect(w)}:metric;}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g3b={joinLimit,splitPolicy:'G3_PRESERVED',pooledStock:'D3_UNCHANGED',technologyCount:36};return d;};
NS.World.from=function(d){const isOld=d?.version&&d.version!==VERSION;const w=oldFrom(d?.version===VERSION?{...d,version:PREV}:d);
 if(isOld){ // Legacy Settlements are allowed to retain their established D3 pooled stocks.
  for(const r of w.v34b?.settlements||[])if(r.lifecycle==='ACTIVE'&&r.tileIds?.length>1)r.v034g3bLegacy=true;
 }
 return w;
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){return NS.V034G3.observe(()=>{const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v034g3b={revision:'one-day-join-only',...summary(w,{details:true}),splitPolicy:'G3_PRESERVED',pooledStock:'D3_UNCHANGED',technologyCount:36};return d;});};
function verify(w){const checks={version:NS.RELEASE_VERSION===VERSION,
  joinFixed:Math.abs(joinLimit-1)<EPS,
  g3Spatial:!!NS.V034G3?.config?.spatialEnabled,
  joinedRouteHook:typeof NS.V034C?.canJoin==='function'&&/V034G3B/.test(Function.prototype.toString.call(NS.V034C.canJoin)),
  splitUnchanged:!!NS.V034G3?.policy&&(!w||NS.V034G3.observe(()=>{const r=w.v34b?.settlements?.find(x=>x.lifecycle==='ACTIVE'&&x.tileIds?.length);if(!r)return true;const p=NS.V034G3.policy(w,r.tileIds,r.coreTileId);return Math.abs(p.join-joinLimit)<EPS&&p.split>joinLimit;})),
  g3Food:typeof NS.V034G2A?.relay==='function',
  pooledStock:typeof NS.V034D3?.audit==='function',
  deliveryCsv:!w||NS.V034G2A.csv(w).replace(/^\uFEFF/,'').split(/\r?\n/,1)[0].split(',').length===20};
 return {version:VERSION,build:'g3b-static-v1',ok:Object.values(checks).every(Boolean),tests:checks};}
function audit(w){const base=NS.V034G3A.audit(w),current=NS.V034G3.observe(()=>summary(w,{details:true}));return {...base,version:VERSION,integrity:verify(w),g3b:current};}
function refresh(){try{const w=window.villageObserver?.world,check=verify(w);document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 let notice=document.getElementById('g3aRuntimeIntegrity');if(!notice&&document.body){notice=document.createElement('div');notice.id='g3aRuntimeIntegrity';notice.style.cssText='position:relative;z-index:20;margin:2px auto 7px;max-width:1120px;border-radius:9px;padding:7px 10px;font:12px system-ui,sans-serif;background:#0c1b28';const shell=document.querySelector('.shell'),runtime=document.getElementById('runtimeStatus');if(runtime?.parentNode)runtime.parentNode.insertBefore(notice,runtime.nextSibling);else shell?.prepend?.(notice);}
 if(notice){notice.textContent=check.ok?'✓ G3B 런타임 무결성 · 신규 병합 왕복 1.00 · 기존 분할/공동 재고 유지':'⚠ G3B 런타임 무결성 실패: '+Object.keys(check.tests).filter(k=>!check.tests[k]).join(', ');notice.style.border='1px solid '+(check.ok?'#235a4c':'#a64c39');notice.style.color=check.ok?'#a9e7ca':'#ffe0a1';}
 const btn=document.getElementById('exportG2RelayBtn');if(btn)btn.textContent='G3B 구호 배송 CSV';return check;
 }catch(e){console.error('G3B integrity',e);return {ok:false,error:String(e)};}}
function download(name,data,mime='application/json'){const url=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g3a','village-observer-v034g3','village-observer-v034g2a','village-observer-v034g2','village-observer-v034g1b'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G3B-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G3B-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G3B-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'정착지 병합 왕복 1일 접근성',summary:'신규 병합은 중심지에서 모든 타일로의 왕복 경로가 각각 1.00 이하일 때만 허용하며, 기존 정착지의 공동 재고·기존 분할 여유는 유지합니다.',sections:[['병합 기준',['R2/R3/R4의 병합 이동비 상한을 모두 1.00으로 통일했습니다.','지형·실제 도로·도로 조건·타일 소유권·왕복 방향 검사를 보존하며 90일 대기는 유지합니다.']],['기존 정착지 보호',['구버전 세이브의 기존 대형 정착지는 강제로 분해하지 않으며, 기존 G3 분할 조건과 180일 유예를 유지합니다.','같은 정착지의 민간 재고 즉시 공동 이용은 변경하지 않습니다.']],['진단',['병합 거절/성공 수, 최장 이동비, 1일 접근성을 초과한 기존 정착지를 DEVLOG에 기록합니다.','신규 교통 기술 및 생산·전쟁·구호 밸런스 변경은 없습니다.']]]});
NS.V034G3B=Object.freeze({version:VERSION,joinLimit,config,onCandidate,onMerge,travelStats,inspect,summary,verify,audit,refresh});
// Read-only selected-tile indicator; the stock and path systems are unchanged.
if(NS.UI){const prev=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const result=prev.apply(this,args);
 try{const w=this.world,t=w?.map?.get?.(Number(w.selectedTileId)),box=document.querySelector('.v34c-settlement-tile');if(!t||!box)return result;
  const r=NS.V034C?.byTile?.(w,t.id);if(!r)return result;const d=travelStats(w,r.tileIds,r.coreTileId),old=box.querySelector('.v034g3b-travel-note');if(old)old.remove();
  const node=document.createElement('div');node.className='v034g3b-travel-note small muted';
  node.textContent='G3B 신규 병합 왕복 한도 1.00일 · 이 정착지 최대 접근 '+(d.unreachable?'경로 없음':d.max.toFixed(2)+'일')+(r.v034g3bLegacy?' · 기존 저장 정착지':'')+' · 병합 후 공동 재고 즉시 이용';box.appendChild(node);
 }catch(e){console.warn('G3B tile observer',e);}return result;};}
refresh();
})(window.VSim);
