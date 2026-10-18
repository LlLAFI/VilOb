// H1 visual-only transformations. C1H source-block hashes remain unchanged.
export function h1Transform(source, input) {
 let data=input;
 function exact(before, after, label) { if (!data.includes(before)) throw Error(`H1 missing ${label} in ${source}`); data=data.replace(before,after); }
 if(source==='src/legacy/040.js') {
  exact("NS.UI.prototype.bind=function(){bind28.call(this);const sel=this.q('v15LayerSelect');if(sel&&!sel.querySelector('option[value=\"lifezone\"]'))sel.insertAdjacentHTML('beforeend','<option value=\"lifezone\">생활권</option>');};", "NS.UI.prototype.bind=function(){bind28.call(this);};",'P1 layer installation');
  exact("NS.UI.prototype.renderMap=function(){renderMap28.call(this);if(this.mapLayer==='lifezone')drawLifeZones29(this);};", "NS.UI.prototype.renderMap=function(){renderMap28.call(this);};",'P1 draw wrapper');
  const start=" NS.UI.prototype.renderTile=function(){renderTile28.call(this);if(this.mapLayer!=='lifezone')return;";
  exact(start," NS.UI.prototype.renderTile=function(){renderTile28.call(this);return;",'P1 tile inspector');
 }
 if(source==='src/legacy/154.js') {
  const begin=data.indexOf(' NS.UI.prototype.renderMap=function(...a){const r=oldMap.apply(this,a);if(!this._v34cMapLayer)return r;');
  const end=data.indexOf('\n}',begin);
  if(begin<0||end<0||!data.slice(begin,end).includes('v34cBoundaryToggle')) throw Error('H1 C settlement boundary block anchor missing');
  data=data.slice(0,begin)+" NS.UI.prototype.renderMap=function(...a){return oldMap.apply(this,a);};\n // H1 owns the settlement boundary layer and its control.\n"+data.slice(end);
 }
 if(source==='src/bootstrap/v034g5.js') {
  exact("NS.RELEASE_VERSION==='V0.34H0'", "(NS.RELEASE_VERSION==='V0.34H0'||NS.RELEASE_VERSION==='V0.34H1')",'G5 integrity H1 version');
 }
 return data;
}
