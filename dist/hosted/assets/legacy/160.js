
/* Village Observer V0.34C1E — AI Scoring Hotpath Optimization V1.
   Optimization is local to each V0.24 candidateRows invocation: no RNG or physical-state caching.
   Legacy candidate eligibility, scoring formula and RNG draw order retained. */
(function(NS){'use strict';
const VERSION='V0.34C1E',PREVIOUS='V0.34C1D';
const states=new WeakMap(),scoringScopes=new WeakMap();
const st=w=>{let s=states.get(w);if(!s){s={scopes:0,territorySum:0,residentRows:0,aliveChecks:0,nearbyChecks:0,candidates:0,scoringScopes:0,tradeAccessBuilds:0,tradeAccessHits:0};states.set(w,s);}return s;};
const record=(w,x)=>{const s=st(w);s.scopes+=x.scopes;s.territorySum+=x.territory;s.residentRows+=x.residentRows;s.aliveChecks+=x.aliveChecks;s.nearbyChecks+=x.nearbyChecks;s.candidates+=x.candidates;};
const summarize=w=>({...st(w)});
// C1E: Only within one synchronous baseScores(v,w) evaluation, re-use the
// read-only strategic trade-access report. Every distinct baseScores evaluation
// (including TRADE -> physical choice re-evaluation) gets a fresh scope.
// No cached result can survive an AI decision or enter the serialized world.
const oldBase=NS.VillageBrain.prototype.baseScores,oldAccess=NS.Village.prototype.tradeAccess;
NS.VillageBrain.prototype.baseScores=function(v,w){
 if(!v||!w||v.territory?.size<8||v.residents?.length<35)return oldBase.call(this,v,w);
 const prev=scoringScopes.get(v),frame={world:w,has:false,report:null};scoringScopes.set(v,frame);
 st(w).scoringScopes++;
 try{return oldBase.call(this,v,w);}finally{if(prev)scoringScopes.set(v,prev);else scoringScopes.delete(v);}
};
NS.Village.prototype.tradeAccess=function(w){
 const frame=scoringScopes.get(this);
 if(!frame||frame.world!==w)return oldAccess.call(this,w);
 if(frame.has){st(w).tradeAccessHits++;return frame.report;}
 const report=oldAccess.call(this,w);
 frame.report=report;frame.has=true;st(w).tradeAccessBuilds++;
 return report;
};
NS.V034C1E={version:VERSION,record,summarize};
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSer.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREVIOUS}:d);};
const oldSnap=NS.Telemetry.prototype.snapshot;
const FIELDS=['scoringEScopes','scoringETerritorySum','scoringEResidentRows','scoringEAliveChecks','scoringENearbyChecks','scoringECandidates','scoringEBaseScopes','scoringETradeAccessBuilds','scoringETradeAccessHits'];
function values(w){const x=summarize(w);return{scoringEScopes:x.scopes,scoringETerritorySum:x.territorySum,scoringEResidentRows:x.residentRows,scoringEAliveChecks:x.aliveChecks,scoringENearbyChecks:x.nearbyChecks,scoringECandidates:x.candidates,scoringEBaseScopes:x.scoringScopes,scoringETradeAccessBuilds:x.tradeAccessBuilds,scoringETradeAccessHits:x.tradeAccessHits};}
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const sn=oldSnap.call(this,w,reason,note);if(sn?.global)Object.assign(sn.global,values(w));return sn;};
const oldCSV=NS.Telemetry.prototype.snapshotsCSV;
NS.Telemetry.prototype.snapshotsCSV=function(){const lines=oldCSV.call(this).split('\n');if(lines.length<2)return lines.join('\n');const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';lines[0]+=','+FIELDS.map(q).join(',');let i=1;for(const sn of this.snapshots||[])for(const row of sn.villages||[]){if(i>=lines.length)break;lines[i++]+=','+FIELDS.map(k=>q(sn.global?.[k]??0)).join(',');}return lines.join('\n');};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary.v034c1eRevision='ai-scoring-scoped-trade-access-and-v24-candidate-index-v1';d.worldSummary.v034c1ePerformance=summarize(w);d.worldSummary.v034c1eScope='Read-only tradeAccess memoized only within a single baseScores call, plus local CandidateRows24 residence/nearby caching for mature nations. No RNG/action/score formula changes.';return d;};
const oldSave=NS.SaveSystem;
function download(name,content,mime='application/json'){const url=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem('village-observer-v034c1e',JSON.stringify(w.serialize()));}catch(e){throw Error('세이브 저장에 실패했습니다: '+e.message);}},
 load(){const data=localStorage.getItem('village-observer-v034c1e');return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v034C1E-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034C1E-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),test=NS.V032E14?.validateCSV?.(csv);if(test&&!test.ok)throw Error('V0.34C1E CSV schema mismatch '+JSON.stringify(test.bad?.slice(0,3)));download(`village-observer-v034C1E-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader,oldWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(){const ret=oldHeader.call(this);document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el)el.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return ret;};
 NS.UI.prototype.renderWorld=function(){const ret=oldWorld.call(this);const panel=document.querySelector('.v034c1b-profiler'),w=this.world;if(!panel||!w)return ret;let el=panel.querySelector('.v034c1e-summary');if(!el){el=document.createElement('div');el.className='v034c1e-summary small muted';el.style.marginTop='4px';panel.appendChild(el);}const s=summarize(w);el.textContent='C1E AI 조회 재사용 · 교역 접근성 '+s.tradeAccessHits+'회 · 지역 후보 '+s.scopes+'회';return ret;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-10',title:'AI Scoring Hotpath Optimization V1',summary:'baseScores 내 반복되는 교역 접근성 조회를 호출 단위로 재사용하고, V0.24 지역 후보의 주민·인접 정보를 중복 계산하지 않습니다. AI 점수 공식·TRADE 물리 재평가·개척 후보 난수·게임 밸런스를 유지합니다.',sections:[['핵심',['AI 점수 내 교역 접근성 단일 조회, 지역 후보 주민/인접 정보 단일 탐색. 국가 8타일·거주민 35명 이상에만 적용']],['보존',['후보 수, 계산 순서, 난수 소비, Devlog·CSV·세이브 호환']],['성능',['C1D core07 / baseScores 실주행 A/B 검증 필요']]]});
})(window.VSim);
