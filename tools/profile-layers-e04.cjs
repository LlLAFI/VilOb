'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..');const html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
const el=()=>({style:{},innerHTML:'',appendChild(){},addEventListener(){},classList:{add(){},remove(){}},querySelector(){return null},querySelectorAll(){return[]}});
let random=0x11234567, rngCalls=0;const math=Object.create(Math);math.random=()=>{rngCalls++;random^=random<<13;random^=random>>>17;random^=random<<5;return(random>>>0)/4294967296;};
const ctx={Math:math,console,Map,Set,WeakMap,WeakSet,JSON,Date,performance,Blob,URL,TextEncoder,TextDecoder,Uint8Array,Uint32Array,ArrayBuffer,structuredClone,alert(){},confirm(){return false},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:el(),body:el(),documentElement:el(),createElement:el,getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},title:''}};ctx.window=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
ctx.__results={};ctx.__stack=[];ctx.__previous={};
const profileCode=`(function(){const stack=window.__stack,result=window.__results,previous=window.__previous;
for(const [name,proto,method] of [['snapshot',VSim.Telemetry?.prototype,'snapshot'],['day',VSim.World?.prototype,'advanceOneDay'],['seasonal',VSim.Village?.prototype,'seasonalTick']]){
if(!proto||!proto[method]||proto[method]===previous[name])continue;
let original=proto[method],tag=name+'-'+window.__label;
const wrapped=function(...args){const frame={tag,start:performance.now(),children:0};stack.push(frame);try{return original.apply(this,args)}finally{const ms=performance.now()-frame.start;stack.pop();let row=result[tag];if(!row)row=result[tag]={calls:0,inclusive:0,exclusive:0};row.calls++;row.inclusive+=ms;row.exclusive+=Math.max(0,ms-frame.children);if(stack.length)stack[stack.length-1].children+=ms;}};
proto[method]=wrapped;previous[name]=wrapped;
}})();`;
let seq=0;for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){if(!m[1].trim())continue;try{new vm.Script(m[1]).runInContext(ctx,{timeout:20000});}catch(e){if(!/onclick/.test(e.message))throw e;}ctx.__label=++seq;new vm.Script(profileCode).runInContext(ctx,{timeout:20000});}
const leafCode=`(function(){const stack=window.__stack,result=window.__results;
const targets=[['world',VSim.World.prototype,['socialAndMigration','processAutonomousTrade','checkExtinctions','processRuins','anomalyCheck']],['village',VSim.Village.prototype,['dailyTick','seasonalTick','maintainSettlements','processBuildingMaintenance','internalMigration','developSettlements']],['person',VSim.Person.prototype,['act','metabolism','chooseJob']]];
for(const [group,proto,methods] of targets)for(const method of methods){if(typeof proto?.[method]!=='function')continue;let original=proto[method],tag='leaf-'+group+'.'+method;
proto[method]=function(...args){let frame={tag,start:performance.now(),children:0};stack.push(frame);try{return original.apply(this,args)}finally{const ms=performance.now()-frame.start;stack.pop();let row=result[tag];if(!row)row=result[tag]={calls:0,inclusive:0,exclusive:0};row.calls++;row.inclusive+=ms;row.exclusive+=Math.max(0,ms-frame.children);if(stack.length)stack[stack.length-1].children+=ms;}};}
})();`;
new vm.Script(leafCode).runInContext(ctx,{timeout:20000});
const w=new ctx.VSim.World(19,19);w.year=61;const extra=+process.argv[2]||540;for(let i=0;i<extra;i++){const v=w.villages[i%7];v.residents.push(new ctx.VSim.Person(v.id,'p'+i,{age:25+i%30,sex:i%2?'남':'여',homeTileId:v.coreTileId,workTileId:v.coreTileId,health:95,hunger:10,energy:80}));}
const days=+process.argv[3]||18,st=performance.now();for(let d=0;d<days;d++)w.advanceOneDay();const total=performance.now()-st;
const rows=Object.entries(ctx.__results).map(([tag,o])=>({tag,calls:o.calls,ms:+o.exclusive.toFixed(2),inclusive:+o.inclusive.toFixed(2)})).sort((a,b)=>b.ms-a.ms);
console.log(JSON.stringify({total,days,rngCalls,rows:rows.slice(0,75)},null,2));
