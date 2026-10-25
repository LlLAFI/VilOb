/* H1C2: conservative CSV and historical side-effect inventory. Never infer
 * that any existing column may be disabled solely from its label.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const schema=JSON.parse(fs.readFileSync(path.join(root,'src/csv/schema-v2.json'),'utf8'));
const domains={military:/war|army|battle|formation|military|siege|occup|garrison|weapon|armor|morale|commander|cohort|wound|casualty|defen/i,
 economy:/gold|price|trade|market|tax|money|treasury|finance|fiscal|commerce|wage/i,
 food:/food|hunger|starv|farm|agri|grain|nutrition/i,
 settlement:/settle|house|housing|building|labor|construction|population|urban|resident|migration|village/i,
 technology:/tech|research|academy|knowledge|scholar|school/i,
 performance:/wall|cpu|simtime|snapshot|profile|cache|elapsed|duration|costMs/i};
const columns=schema.columns.map((col,i)=>{const name=String(col.v2||'');const domain=Object.entries(domains).find(([,rule])=>rule.test(name))?.[0]||'cross-system';
 return {index:i,field:name,sourceName:col.original,kind:'OBSERVATION_TELEMETRY',domain,lifecycle:'REVIEW_REQUIRED',safeToDisable:false,reason:'CSV column reflects observation output; originating producer and its game-side effects require separate review.'};});
if(columns.length!==1683)throw Error('H1C2 inventory requires 1683 columns');
const info={format:'vilob-h1c2-static-dependency-inventory-v1',columns:columns.length,legacyProtectedBlocks:169,
 policy:'No observational producer is disabled in H1C2. Classification of output alone is not a proof of safe disabling.',
 evidence:[
  {source:'src/legacy/024.js',state:'SIMULATION_STATE',uses:'last AI_DECISION scores and fallback execution; migrated at runtime'},
  {source:'src/legacy/093.js',state:'OBSERVATION_TELEMETRY',uses:'enriches strategy log, now reads recent decision via state facade'},
  {source:'src/legacy/019.js',state:'OBSERVATION_TELEMETRY',uses:'mutates latest AI_DECISION log payload; preserved'},
  {source:'src/legacy/126.js',state:'DOMAIN_EVENT',uses:'WAR_DECLARED33 -> war target invariant repair; bridged with original timing'},
  {source:'src/legacy/114.js',state:'DOMAIN_EVENT / OBSERVATION',uses:'occupation event control updates; not yet decoupled'},
  {source:'src/legacy/110.js',state:'DOMAIN_EVENT / OBSERVATION',uses:'occupation log deduplication affects emitted events; not yet decoupled'},
  {source:'src/legacy/125.js',state:'DOMAIN_EVENT / OBSERVATION',uses:'war declaration/end capture state; not yet decoupled'},
  {source:'src/legacy/016.js',state:'OBSERVATION with legacy reads',uses:'event retention; preserved'},
  {source:'src/bootstrap/v034d3a.js',state:'OBSERVATION_TELEMETRY',uses:'30-day food ledger and CSV; preserved'},
  {source:'src/bootstrap/v035h1c1.js',state:'DIAGNOSTIC_TRACE',uses:'snapshot stage timing only while explicitly started; preserved'}
 ],columns};
fs.writeFileSync(path.join(root,'docs/h1c2-csv-1683-inventory.json'),JSON.stringify(info,null,2)+'\n');
console.log(JSON.stringify({format:info.format,columns:columns.length,domains:Object.fromEntries([...new Set(columns.map(x=>x.domain))].map(k=>[k,columns.filter(x=>x.domain===k).length])),reviewRequired:1683,removed:0}));
