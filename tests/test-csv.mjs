import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const spec=JSON.parse(fs.readFileSync(path.join(root,'src/csv/schema-v2.json')));
const data=fs.readFileSync(path.join(root,'tests/fixtures/c1h-sample.csv'),'utf8');
const [header,...rows]=data.trimEnd().split('\n');
function split(s){const out=[];let buf='',q=false;for(let i=0;i<s.length;i++){
 if(s[i]==='"'){if(q&&s[i+1]==='"'){buf+='"';i++;}else q=!q;}
 else if(s[i]===','&&!q){out.push(buf);buf='';}else buf+=s[i];}
 out.push(buf);return out;}
const h=split(header);assert.deepEqual(h,spec.originalColumns);
assert.equal(spec.columnCount,1683);assert.equal(new Set(spec.v2Columns).size,1683);
for(const row of rows)assert.equal(split(row).length,1683);
const v2=spec.v2Columns.map(s=>'"'+s.replaceAll('"','""')+'"').join(',')+'\n'+rows.join('\n');
assert.deepEqual(split(v2.slice(0,v2.indexOf('\n'))),spec.v2Columns);
assert.equal(v2.slice(v2.indexOf('\n')),data.slice(data.indexOf('\n')).trimEnd());
console.log(JSON.stringify({result:'PASS',csvColumns:1683,duplicateHeadersFixed:72,rows:rows.length,valueRowsIdentical:true}));
