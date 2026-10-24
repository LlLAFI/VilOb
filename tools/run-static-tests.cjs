/* V0.35H1B1 sequential CI runner, streamed subprocess output with explicit timeout.
 * Avoid spawnSync pipe stalls and keep terminal/GitHub Actions visibly responsive.
 */
'use strict';
const path=require('node:path'),{spawn}=require('node:child_process');
const root=path.join(__dirname,'..');
const names=['test-build.mjs','test-csv.mjs','test-35h1a-hf.cjs','test-35h1b.cjs','test-35h1b1.cjs','test-35h1b1a.cjs','test-35h1b2.cjs','test-35h1c.cjs','test-35h1a.cjs','test-35h1a-parity.cjs','test-35h0.cjs','test-35g1b.cjs','test-35g1a.cjs','test-g2a-reserve.cjs','test-h4c.cjs','test-35a.cjs'];
function execute(name){return new Promise(resolve=>{
 const start=Date.now(),child=spawn(process.execPath,[path.join(root,'tests',name)],{cwd:root,stdio:['ignore','pipe','pipe']});
 let output='',error='',timedOut=false;
 const timeout=setTimeout(()=>{timedOut=true;child.kill('SIGKILL');},150000);
 child.stdout.on('data',buf=>{output=(output+buf.toString()).slice(-250000);});
 child.stderr.on('data',buf=>{error=(error+buf.toString()).slice(-250000);});
 child.on('error',ex=>{error+='\n'+ex.message;});
 child.on('close',code=>{clearTimeout(timeout);const status=timedOut?'TIMEOUT':code===0?'PASS':'FAIL';
 console.log(`${status} ${name} ${Date.now()-start}ms ${(output.trim().split('\n').slice(-1)[0])||''}`);
 if(status!=='PASS')console.error(error||output||'Test exited with '+code);
 resolve({test:name,status,elapsedMs:Date.now()-start});});
 });}
(async()=>{const results=[];for(const name of names){results.push(await execute(name));if(results.at(-1).status!=='PASS'){process.exitCode=1;break;}}
 if(!process.exitCode)console.log(JSON.stringify({status:'PASS',tests:results.length,summary:results}));})();
