import fs from 'node:fs';import crypto from 'node:crypto';import path from 'node:path';import assert from 'node:assert/strict';import vm from 'node:vm';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=fs.readFileSync(path.join(root,'index-standalone.html'),'utf8');
const hosted=fs.readFileSync(path.join(root,'dist/hosted/index.html'),'utf8');
const source=JSON.parse(fs.readFileSync(path.join(root,'src/manifest.json'),'utf8'));
const scripts=[...data.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
assert.equal(scripts.length,176);
for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i],{filename:'block-'+i});
assert.equal([...hosted.matchAll(/<script\b/g)].length,176);
const css=[...hosted.matchAll(/<link rel="stylesheet"/g)].length;assert.equal(css,4);
const js=source.blocks.filter(x=>x.type==='script');assert.equal(js.length,165);
const all=source.blocks;for(const b of all){const raw=fs.readFileSync(path.join(root,b.path));assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),b.sha256);}
const schema=JSON.parse(fs.readFileSync(path.join(root,'src/csv/schema-v2.json')));assert.equal(schema.columnCount,1683);assert.equal(new Set(schema.v2Columns).size,1683);
assert.equal(schema.duplicateExtraColumns,72);
console.log(JSON.stringify({result:'PASS',scriptBlocks:scripts.length,hostedBlocks:176,css,sourceSHA:source.sourceSha256,csvV2Columns:schema.columnCount}));
