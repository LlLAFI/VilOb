const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const g1=fs.readFileSync(path.join(root,'src/bootstrap/v034g1.js'),'utf8');
const s="if(opt&&opt.textContent!=='타일 (기존 장기 통계)')opt.textContent='타일 (기존 장기 통계)'";
assert.equal(g1.split(s).length-1,2,'G1 renderHeader and renderStats must not rewrite unchanged option');
const html=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
assert(html.includes('V0.34G4A1'));assert(html.includes('statsCaption'));assert(html.includes(s));
console.log('PASS G4A1 static dropdown guard + release signature');
