/* H1A-HF fast, source-backed CI regression suite. Archival comparators are kept in earlier backups. */
'use strict';
const path=require('node:path'),{spawnSync}=require('node:child_process');
const names=['test-build.mjs','test-csv.mjs','test-35h1a-hf.cjs','test-35h1b.cjs','test-35h1a.cjs','test-35h1a-parity.cjs','test-35h0.cjs','test-35g1b.cjs','test-35g1a.cjs','test-g2a-reserve.cjs','test-h4c.cjs','test-35a.cjs'];
const summary=[];
for(const name of names){
 const at=Date.now();const r=spawnSync(process.execPath,[path.join(__dirname,'..','tests',name)],{cwd:path.join(__dirname,'..'),encoding:'utf8',timeout:180000,maxBuffer:8e6});
 const status=r.error?.code==='ETIMEDOUT'?'TIMEOUT':r.status===0?'PASS':'FAIL';summary.push({test:name,status,elapsedMs:Date.now()-at});
 console.log(`${status} ${name} ${summary.at(-1).elapsedMs}ms ${(r.stdout||'').trim().split('\n').slice(-1)[0]||''}`);
 if(status!=='PASS'){console.error(r.stderr||'',r.error||'');process.exit(1)}
}
console.log(JSON.stringify({status:'PASS',tests:summary.length,summary}));
