'use strict';
// Draw the real H4A boundary renderer on a controlled 2-tile, 2-nation map.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const html=fs.readFileSync(path.join(__dirname,'../index-standalone.html'),'utf8');
const node=()=>({style:{},dataset:{},textContent:'',innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},classList:{add(){},remove(){},toggle(){}}});
const c={Math,console,performance,Map,Set,WeakMap,JSON,Date,Blob,URL,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,setTimeout(){},clearTimeout(){},requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},document:{head:node(),body:node(),documentElement:node(),createElement:node,getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},title:''}};c.window=c;c.addEventListener=()=>{};vm.createContext(c);
for(const x of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(x[1].trim())try{new vm.Script(x[1]).runInContext(c,{timeout:120000});}catch(e){if(!/onclick/.test(e.message))throw e;}
const a={x:0,y:0,ownerId:0},b={x:1,y:0,ownerId:1},black=[];
const g={save(){},restore(){},rect(){},clip(){},beginPath(){},moveTo(){},lineTo(){},stroke(){if(this.strokeStyle==='#000000')black.push(this.lineWidth);}};
const ui={world:{map:{width:2,height:1,tiles:[a,b],at:(x,y)=>y===0?[a,b][x]:undefined}},_mapGeom:{cell:20,ox:0,oy:0},h1BoundaryMode:'all',q:()=>({getContext:()=>g})};
c.VSim.V034H4A.strokeNationalBorders(ui);assert.equal(black.length,1);assert(Math.abs(black[0]-1.61)<1e-8,`Expected 70% of 2.3px but received ${black[0]}`);
ui.h1BoundaryMode='selected';c.VSim.V034H4A.strokeNationalBorders(ui);assert.equal(black.length,1,'selected mode should not add black overlay');
console.log(JSON.stringify({status:'PASS',borderWidth:black[0],expected:2.3*.7,selectedUntouched:true}));
