const cp=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const runner=path.join(__dirname,'g2a-checkpoint-run.cjs');
const fs=require('node:fs'),os=require('node:os'),temp=path.join(os.tmpdir(),'vilob-g2a-parity-'+process.pid+'.json');
cp.execFileSync(process.execPath,[runner,path.join(__dirname,'..','index-G2-baseline.html'),'makeSave',temp],{timeout:30000});
function run(file){return JSON.parse(cp.execFileSync(process.execPath,[runner,file,temp],{encoding:'utf8',timeout:180000,maxBuffer:5*1024*1024}));}
const old=run(path.join(__dirname,'..','index-G2-baseline.html')),next=run(path.join(__dirname,'..','index-standalone.html'));
fs.unlinkSync(temp);
assert.deepEqual(next,old,'When no delivery occurs, G2 and G2A must match in persons, physical resources and RNG');
console.log(JSON.stringify({status:'PASS',checkpoints:old.map(s=>({days:s.days,rng:s.rng,pop:s.persons.length,ownedTiles:s.stocks.length}))}));
