'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.id='';this.children=[];this.parentElement=null;this.style={};this.dataset={};this.attributes={};this.hidden=false;this.open=false;this.textContent='';this.value='';this.onclick=null;this.listeners={};}
 appendChild(child){if(child.parentElement){const arr=child.parentElement.children;arr.splice(arr.indexOf(child),1);}this.children.push(child);child.parentElement=this;return child;}
 addEventListener(kind,fn){this.listeners[kind]=fn;}
 setAttribute(k,v){this.attributes[k]=v;}
 replaceChildren(...children){for(const ch of this.children)ch.parentElement=null;this.children=[];for(const ch of children)this.appendChild(ch);}
 querySelector(sel){if(sel[0]==='#')return this.find(x=>x.id===sel.slice(1));return null;}
 querySelectorAll(sel){return sel==='[data-group]'?this.all(x=>!!x.dataset.group):[];}
 find(fn){for(const child of this.children){if(fn(child))return child;const found=child.find(fn);if(found)return found;}return null;}
 all(fn){let out=[];for(const child of this.children){if(fn(child))out.push(child);out.push(...child.all(fn));}return out;}
 remove(){if(this.parentElement){const a=this.parentElement.children;a.splice(a.indexOf(this),1);this.parentElement=null;}}
}
const document={body:new Element('body'),title:'',createElement:t=>new Element(t),getElementById(id){return this.body.find(el=>el.id===id);}};
const mk=(name,parent)=>{const e=new Element();e.id=name;parent.appendChild(e);return e;};
const advanced=mk('h3Advanced',document.body),legacy=mk('h3Diagnostics',advanced);
let old=mk('v035aProfilePanel',legacy);
for(const id of ['v035bAdminPanel','v035cPanel','v035dPanel','v035ePanel','v035fPanel','v035gConstructionExports','v035h1aPanel','v035h1bPanel','v035h1b1Panel','v035h1c1Panel','v035h1c2Panel','v035h1c3Panel'])old=mk(id,old);
const btn=mk('oldExistingStartButton',old);let clicked=0;btn.onclick=()=>clicked++;
const NS={UI:class UI{renderWorld(){this.renders=(this.renders||0)+1;return 'world';}renderHeader(){}},V035H1C3:{},V035H1B1:{snapshotReport:()=>null},V035H1B:{isActive:()=>false},V035A:{isActive:()=>false},PATCH_NOTES:[]};
const ctx={window:{VSim:NS},document,console};vm.createContext(ctx);
const source=fs.readFileSync(path.join(__dirname,'../src/bootstrap/v035h1c4.js'),'utf8');new vm.Script(source).runInContext(ctx);
NS.V035H1C1={report(){throw Error('expensive ledger must never be scanned on UI render');}};
const ui=new NS.UI();ui.world={year:60};assert.equal(ui.renderWorld(),'world');
const center=document.getElementById('v035h1c4Center'),dock=document.getElementById('v035h1c4CheckpointDock');assert(center&&dock);
assert.equal(document.getElementById('v035h1aPanel').parentElement,dock,'checkpoint remains visible outside diagnostic center');
assert.equal(document.getElementById('v035h1c1Panel').parentElement.id,'v035h1c4Active','one selected panel');
assert.equal(document.getElementById('v035aProfilePanel').parentElement.id,'v035h1c4Parking','unselected old panel parked');
assert.equal(document.getElementById('v035h1c3Panel').parentElement.id,'v035h1c4Parking','H1C3 still present and hidden');
const nav=document.getElementById('v035h1c4Nav'),integrity=nav.children.find(x=>x.dataset.group==='integrity');integrity.onclick();
assert.equal(document.getElementById('v035h1c3Panel').parentElement.id,'v035h1c4Active','select integrity category');
assert.equal(document.getElementById('oldExistingStartButton'),btn,'original event handler node preserved');btn.onclick();assert.equal(clicked,1);
const select=document.getElementById('v035h1c4Select');select.value='v035h1c2Panel';select.onchange();assert.equal(document.getElementById('v035h1c2Panel').parentElement.id,'v035h1c4Active');
center.open=true;center.listeners.toggle();ui.renderWorld();assert.equal(document.getElementById('v035h1c4Center'),center,'rerender preserves container');assert.equal(document.getElementById('v035h1c4Center').open,true,'user toggle preserved');
assert.equal(document.getElementById('v035h1aPanel').parentElement,dock,'rerender preserves checkpoint');assert.equal(NS.V035H1C4.catalog.length,12);
// Run the click-capture guard with an active profiler; old button handler must
// not be reached and the UI must say which running tool to stop.
NS.V035A.isActive=()=>true;
let blocked=false;const fakeButton={id:'v035cStart',dataset:{},closest(){return this;}};
center.listeners.click({target:fakeButton,preventDefault(){},stopImmediatePropagation(){blocked=true;}});
assert(blocked,'prevent conflicting profiler start');
assert(document.getElementById('v035h1c4Status').textContent.includes('중복 계측 방지'));
NS.V035A.isActive=()=>false;
console.log(JSON.stringify({status:'PASS',catalog:12,categories:4,preservedControls:true,selection:true,stableRerender:true,checkpointOutsideCenter:true}));
