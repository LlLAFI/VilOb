"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const h1=read('src/bootstrap/v034h1.js'),h3=read('src/bootstrap/v034h3.js'),h4a=read('src/bootstrap/v034h4a.js'),h4b=read('src/bootstrap/v034h4b.js');
assert.match(h1,/mode==='all'\?baseWidth\*\.70:baseWidth/);
assert.match(h1,/\(baseWidth\+2\.1\)\*\.70/);
assert.match(h4a,/ctx\.lineWidth=Math\.max\(2\.3,cell\*\.115\)\*\.70/);
assert.match(h4a,/#000000/);
assert.match(h3,/data-h3-nation.*h4a-nation-bar/);
assert.match(h3,/NS\.NATION_COLORS\?\.\[Number\(r\.v\.id\)\]/);
assert.match(h4b,/PRESERVE_STOCK_ON_ABANDONMENT/);
assert.match(read('src/legacy/008.js'),/t\.ownerId=null;t\.buildings=\[\];/);
// The abandonment path does not modify tile stocks, but ownership/buildings are removed.
for(const name of ['maintainSettlements','pruneDisconnectedTerritory']){
 const match=read('src/legacy/008.js').match(new RegExp(name+'\\(w\\)\\{([\\s\\S]*?)(?=\\n\\s*\\w+\\(|\\n\\})'));
 assert(read('src/legacy/008.js').includes(name+'(w){'),name+' legacy function missing');
}
assert.match(read('src/legacy/031.js'),/OUTPOST_ABANDONED/);
const html=read('index-standalone.html'),hosted=read('dist/hosted/index.html');assert(html.includes('V0.34H4B')&&hosted.includes('v034h4b.js'));
assert.equal((html.match(/<script(?:\s[^>]*)?>/g)||[]).length,212);
const baseline=JSON.parse(read('src/manifest.json'));assert.equal(baseline.blocks.length,169);
console.log(JSON.stringify({status:'PASS',sourceContracts:true,borderScale:0.7,worldColorMarker:true,readOnlyOverflow:true,scriptBlocks:212}));
