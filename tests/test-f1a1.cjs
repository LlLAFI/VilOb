'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');
function boot(file,seed=0x4ab1221d){let state=seed,calls=0;
 const rand=Object.create(Math);rand.random=()=>{calls++;state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 const el=()=>({style:{},innerHTML:'',textContent:'',appendChild(){},addEventListener(){},insertAdjacentElement(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return []}});
 const ctx={Math:rand,console,Map,Set,WeakMap,WeakSet,JSON,Date:class extends Date{static now(){return 1791885600000;}},performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};
 ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const m of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())try{new vm.Script(m[1]).runInContext(ctx,{timeout:30000});}catch(e){if(!/onclick/.test(e.message))throw e;}
 return {NS:ctx.VSim,calls:()=>calls};
}
const base=boot(path.join(root,'index-F1A-baseline.html')),target=boot(path.join(root,'index-standalone.html'));
assert.equal(base.NS.RELEASE_VERSION,'V0.34F1A');assert.equal(target.NS.RELEASE_VERSION,'V0.34F1A1');
const A=base.NS.V034F1A,B=target.NS.V034F1A1;assert.equal(B.columns.length,52);assert.equal(B.anomalyColumns.length,13);
const a=new base.NS.World(19,19),b=new target.NS.World(19,19);
function snapshot(w){const s=w.serialize();return JSON.stringify({year:s.year,day:s.day,season:s.season,villages:s.villages,map:s.map,wars:s.wars,v34b:s.v34b});}
function parity(msg){assert.equal(base.calls(),target.calls(),msg+' RNG');assert.equal(snapshot(a),snapshot(b),msg+' world');}
parity('initial');const days=Math.min(360,Math.max(12,Number(process.env.F1A1_DAYS||90)));
for(let i=0;i<days;i++){a.advanceOneDay();b.advanceOneDay();if(i%30===29)parity('day'+(i+1));}parity('final');
assert.equal(target.NS.V034D3.audit(b).ok,true);
const standard=A.enrich(a),patched=B.csv(b);
// F1A1 modifies ONLY row formatting, not field data or accounting logic.
const csvParse=text=>{
 const rows=[];let i=0,field='',row=[],quoted=false;
 while(i<text.length){const c=text[i++];if(quoted){if(c==='"'){if(text[i]==='"'){field+='"';i++;}else quoted=false;}else field+=c;}
 else if(c==='"')quoted=true;else if(c===','){row.push(field);field='';}
 else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i]==='\n')i++;row.push(field);rows.push(row);field='';row=[];}
 else field+=c;
 }
 assert.equal(quoted,false,'unterminated quote');if(row.length||field)throw Error('missing CSV trailing newline');return rows;
};
const rows=csvParse(patched);assert.equal(rows.length,standard.length+1,'1 output row per Food Flow row');
assert.equal(rows[0].length,52);assert.deepEqual(rows[0],Array.from(B.columns));
for(let i=1;i<rows.length;i++)assert.equal(rows[i].length,52,'row width '+i);
const anomalies=csvParse(B.anomalyCSV(b));assert.equal(anomalies.length,B?A.anomalies(a).length+1:0);for(const row of anomalies)assert.equal(row.length,13);
const trick=B.serializeCSV(['name','value'],[{name:'값,"줄바꿈"\n테스트',value:42}]);assert.deepEqual(csvParse(trick),[['name','value'],['값,"줄바꿈"\n테스트','42']]);
assert.equal(b.serialize().version,'V0.34F1A1');
for(const orig of [a.serialize(),b.serialize()]){
 const w=target.NS.World.from(JSON.parse(JSON.stringify(orig)));
 assert.equal(w.serialize().version,'V0.34F1A1');assert.equal(target.NS.V034D3.audit(w).ok,true);
 assert.equal(w.year,b.year);assert.equal(w.villages.length,b.villages.length);
}
// Manual occupation: legacy ledger and new output must not change physical availability.
const v=b.villages[0],t=b.map.get(v.coreTileId);const pre=target.NS.V034D3.members(v,t.id);assert(pre);
t.v33OccupierId=b.villages[1].id;assert.equal(target.NS.V034D3.members(v,t.id),null);
target.NS.V034D3A.addMetric(b,v,t.id,'otherWithdrawn',.5);assert(target.NS.V034D3A.rows(b).some(r=>r.settlementId===String(t.settlementId)&&r.occupationLedgerAttributions>0));
assert.equal(csvParse(B.csv(b)).length,A.enrich(a).length+1,'occupation does not change row count in same period');
console.log(JSON.stringify({status:'PASS',days,worldParity:true,rngParity:true,foodFlowRows:rows.length-1,foodFlowColumns:52,anomalyRows:anomalies.length-1,anomalyColumns:13,crlf:true,csvQuoting:true,loadF1A:true,loadF1A1:true}));
