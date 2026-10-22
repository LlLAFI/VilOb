/* 35F deterministic FAST static smoke runner. Each test is a separate process with
 * an explicit ceiling, so an old/browser-sim test cannot hang npm test forever.
 */
'use strict';
const path=require('path'),{spawnSync}=require('child_process');
const names=['test-35g1.cjs','test-35g-labor.cjs','test-35f1.cjs','test-35f.cjs','test-35e.cjs','test-build.mjs','test-csv.mjs','test-g2a-reserve.cjs','test-g3b.cjs','test-g4a1.cjs','test-h2a.cjs','test-h4b.cjs','test-h4b-storage.cjs','test-h4b-border.cjs','test-h4c.cjs','test-35a.cjs','test-35b.cjs'];
const summary=[];
for(const name of names){const at=Date.now(),r=spawnSync(process.execPath,[path.join(__dirname,'..','tests',name)],{cwd:path.join(__dirname,'..'),encoding:'utf8',timeout:45000,maxBuffer:5e6});
 const row={test:name,status:r.error?.code==='ETIMEDOUT'?'TIMEOUT':r.status===0?'PASS':'FAIL',elapsedMs:Date.now()-at};summary.push(row);
 const last=r.stdout?.trim().split('\n').slice(-1)[0]||'';process.stdout.write(`${row.status} ${name} ${row.elapsedMs}ms ${last.slice(0,240)}\n`);
 if(row.status!=='PASS'){process.stderr.write((r.stderr||'')+'\n'+(r.error?.stack||'')+'\n');process.exit(1);}
}
process.stdout.write(JSON.stringify({status:'PASS',tests:summary.length,summary})+'\n');
