#!/usr/bin/env node
/* Opt-in cleanup of old, user-backed-up HTML baselines and test artifacts.
 * Default is DRY RUN. This script never touches src/, tools/, GitHub workflows,
 * current hosted assets, or checkpoint files outside tests/fixtures.
 */
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const apply=process.argv.includes('--apply');
const keepTests=new Set(['test-build.mjs','test-csv.mjs','test-35h1b.cjs','test-35h1b1.cjs','test-35h1b1a.cjs','test-35h1b2.cjs','test-35h1c.cjs','test-35h1a-hf.cjs','test-35h1a.cjs','test-35h1a-parity.cjs','test-35h0.cjs','test-35g1b.cjs','test-35g1a.cjs','test-35g1.cjs','test-35a.cjs','test-h4c.cjs','test-g2a-reserve.cjs']);
const keepFixtures=new Set(['v034C1H-index.html','v035G1B-standalone.html','v035H0-standalone.html','v035H1A-standalone.html','v035H1A-HF-standalone.html','v035H1B-standalone.html','v035H1B1A-standalone.html','v035H1A-perf19x19A-initial.json','v035H1A-HF-perf19x19A-initial.json','v035H1B-perf19x19A-initial.json','c1h-sample.csv']);
const prune=[];
for(const name of fs.readdirSync(root)){
 if(/^index-[\w-]*baseline\.html$/i.test(name)||/^local-validator-[\w-]*\.html$/i.test(name)||/^README-(?:34|35(?!H1A\b|H1A-HF\b|H1B\b|H1B1\b|H1B1A\b|H1B2\b|H1C\b))[\w-]*\.md$/i.test(name)||/^TEST-(?:34|35(?!H1A\b|H1A-HF\b|H1B\b|H1B1\b|H1B1A\b|H1B2\b|H1C\b))[\w-]*\.md$/i.test(name))prune.push(name);
}
const testDir=path.join(root,'tests');if(fs.existsSync(testDir)){
 for(const name of fs.readdirSync(testDir)){
  const full=path.join(testDir,name);
  if(name==='fixtures')for(const f of fs.readdirSync(full)){if(!keepFixtures.has(f))prune.push(path.posix.join('tests/fixtures',f));}
  else if(!keepTests.has(name))prune.push(path.posix.join('tests',name));
 }
}
for(const f of ['dist/standalone','index-standalone.html'])if(fs.existsSync(path.join(root,f)))prune.push(f);
for(const name of [...new Set(prune)].sort()){
 const target=path.join(root,name);if(!target.startsWith(root+path.sep))throw Error('bad target');
 if(apply)fs.rmSync(target,{recursive:true,force:true});
 console.log((apply?'REMOVED ':'WOULD REMOVE ')+name);
}
console.log(JSON.stringify({mode:apply?'APPLIED':'DRY_RUN',count:prune.length,notes:'Run git add -A after applying; GitHub does not delete files simply because they are missing from a new ZIP.'}));
