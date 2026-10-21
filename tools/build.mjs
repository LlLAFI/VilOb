#!/usr/bin/env node
// Reproducible V0.34D0 builds. Requires only Node.js >=18.
import {d2Transform} from './d2-transform.mjs';
import {e3Transform} from './e3-transform.mjs';
import {e4Transform} from './e4-transform.mjs';
import {e5Transform} from './e5-transform.mjs';
import {f1aTransform} from './f1a-transform.mjs';
import {f2Transform} from './f2-transform.mjs';
import {f3Transform} from './f3-transform.mjs';
import {g1Transform} from './g1-transform.mjs';
import {g2Transform} from './g2-transform.mjs';
import {g3Transform} from './g3-transform.mjs';
import {g3bTransform} from './g3b-transform.mjs';
import {g4Transform} from './g4-transform.mjs';
import {g4aTransform} from './g4a-transform.mjs';
import {g5Transform} from './g5-transform.mjs';
import {h0Transform} from './h0-transform.mjs';
import {h1Transform} from './h1-transform.mjs';
import {h2Transform} from './h2-transform.mjs';
import {h2aTransform} from './h2a-transform.mjs';
import {h3Transform} from './h3-transform.mjs';
import {h4Transform} from './h4-transform.mjs';
import {h4cTransform} from './h4c-transform.mjs';
import {b35Transform} from './35b-transform.mjs';
import {c35Transform} from './35c-transform.mjs';
import {d35Transform} from './35d-transform.mjs';
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const get=p=>fs.readFileSync(path.join(root,p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(get('src/manifest.json'));
const template=get('src/template.html').toString('utf8');
const schema=JSON.parse(get('src/csv/schema-v2.json'));
const runtimeSchema={columnCount:schema.columnCount,duplicateNames:schema.duplicateNames,duplicateExtraColumns:schema.duplicateExtraColumns,originalColumns:schema.originalColumns,renames:schema.columns.filter(c=>c.original!==c.v2).map(c=>[c.index,c.v2])};
const bootstrap=get('src/bootstrap/v034d0.js').toString('utf8').replace('__D0_CSV_SCHEMA__',JSON.stringify(runtimeSchema));
const d1=get('src/bootstrap/v034d1.js').toString('utf8');
const d1a=get('src/bootstrap/v034d1a.js').toString('utf8');
const d2=get('src/bootstrap/v034d2.js').toString('utf8');
const d2a=get('src/bootstrap/v034d2a.js').toString('utf8');
const d2b=get('src/bootstrap/v034d2b.js').toString('utf8');
const d3=get('src/bootstrap/v034d3.js').toString('utf8');
const d3a=g5Transform('src/bootstrap/v034d3a.js',get('src/bootstrap/v034d3a.js').toString('utf8'));
const d3a1=get('src/bootstrap/v034d3a1.js').toString('utf8');
const d3a2=get('src/bootstrap/v034d3a2.js').toString('utf8');
const d3b=get('src/bootstrap/v034d3b.js').toString('utf8');
const d3b1=get('src/bootstrap/v034d3b1.js').toString('utf8');
const VERSION='V0.35D';
const g1=get('src/bootstrap/v034g1.js').toString('utf8');
const g1a=get('src/bootstrap/v034g1a.js').toString('utf8');
const g1b=get('src/bootstrap/v034g1b.js').toString('utf8');
const g2=get('src/bootstrap/v034g2.js').toString('utf8');
const g2a=get('src/bootstrap/v034g2a.js').toString('utf8');
const g3=get('src/bootstrap/v034g3.js').toString('utf8');
const g3a=get('src/bootstrap/v034g3a.js').toString('utf8');
const g3b=get('src/bootstrap/v034g3b.js').toString('utf8');
const g4=get('src/bootstrap/v034g4.js').toString('utf8');
const g4a=get('src/bootstrap/v034g4a.js').toString('utf8');
const g4a1=get('src/bootstrap/v034g4a1.js').toString('utf8');
const g5=h4Transform('src/bootstrap/v034g5.js',h3Transform('src/bootstrap/v034g5.js',h2aTransform('src/bootstrap/v034g5.js',h2Transform('src/bootstrap/v034g5.js',h1Transform('src/bootstrap/v034g5.js',h0Transform('src/bootstrap/v034g5.js',get('src/bootstrap/v034g5.js').toString('utf8')))))));
const h0=get('src/bootstrap/v034h0.js').toString('utf8');
const h1=get('src/bootstrap/v034h1.js').toString('utf8');
const h2=get('src/bootstrap/v034h2.js').toString('utf8');
const h2a=get('src/bootstrap/v034h2a.js').toString('utf8');
const h3=get('src/bootstrap/v034h3.js').toString('utf8');
const h4=get('src/bootstrap/v034h4.js').toString('utf8');
const h4a=get('src/bootstrap/v034h4a.js').toString('utf8');
const h4b=get('src/bootstrap/v034h4b.js').toString('utf8');
const h4c=get('src/bootstrap/v034h4c.js').toString('utf8');
const v35a=get('src/bootstrap/v035a.js').toString('utf8');
const v35b=get('src/bootstrap/v035b.js').toString('utf8');
const v35c=get('src/bootstrap/v035c.js').toString('utf8');
const v35d=get('src/bootstrap/v035d.js').toString('utf8');
const B3B_VERSION='V0.34D3B3B';
const e01=get('src/bootstrap/v034e.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34E-rc5');
const f0=g4aTransform('src/bootstrap/v034f0.js',f3Transform('src/bootstrap/v034f0.js',get('src/bootstrap/v034f0.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34F0')));
const f1=get('src/bootstrap/v034f1.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34F1');
const f1a=get('src/bootstrap/v034f1a.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34F1A');
const f1a1=get('src/bootstrap/v034f1a1.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34F1A1');
const f2=get('src/bootstrap/v034f2.js').toString('utf8');
const f3=get('src/bootstrap/v034f3.js').toString('utf8');
const d3b3b=get('src/bootstrap/v034d3b3b.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__',B3B_VERSION);
const d3b3a=get('src/bootstrap/v034d3b3a.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34D3B3A');
const d3b3=get('src/bootstrap/v034d3b3.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34D3B3');
const d3b2=get('src/bootstrap/v034d3b2.js').toString('utf8').replaceAll('__VILOB_RELEASE_VERSION__','V0.34D3B2');
if(!template.includes('<!-- VILOB_D0_BLOCK_000 -->'))throw Error('bad template');
const mode=process.argv.includes('--check-only')?'check-only':'build';
function render(flavor,assetPrefix='assets/'){
 let out=template;
 for(const block of manifest.blocks){
  const raw=get(block.path), data=raw.toString('utf8');
  if(sha(raw)!==block.sha256)throw Error('Protected legacy source changed: '+block.path);
  let transformed=data;
  if(flavor!=='baseline'){transformed=d2Transform(block.path,transformed).data;for(const fn of [e3Transform,e4Transform,e5Transform,f1aTransform,f2Transform,f3Transform,g1Transform,g2Transform,g3Transform,g3bTransform,g4Transform,g4aTransform,g5Transform])transformed=fn(block.path,transformed);
 transformed=h4Transform(block.path,h3Transform(block.path,h2aTransform(block.path,h2Transform(block.path,h1Transform(block.path,h0Transform(block.path,transformed))))));
 transformed=d35Transform(block.path,c35Transform(block.path,b35Transform(block.path,h4cTransform(block.path,transformed)))); }
  // RC2 release-only performance transform; immutable C1H reconstruction stays byte-identical.
  if(flavor!=='baseline' && block.path==='src/legacy/016.js'){
   const needle="if(this.entries.length>16000||((this.entries[0]?.ordinalDay||0)<cutoff-120))this.entries=this.entries.filter(x=>(x.ordinalDay||0)>=cutoff||x.type==='MANUAL_NOTE');";
   if(!transformed.includes(needle))throw Error('Telemetry record compaction anchor missing');
   transformed=transformed.replace(needle,`// RC2 bounded, age-aware event compaction; keep all manual notes and event counts.
   const current=w.ordinalDay(),last=this._v034eLastPruneOrdinal??-Infinity;
   if((this.entries.length>16000||(this.entries[0]?.ordinalDay||0)<cutoff-120)&&current-last>=30){
    this.entries=this.entries.filter(x=>(x.ordinalDay||0)>=cutoff||x.type==='MANUAL_NOTE');
    this._v034eLastPruneOrdinal=current;
   }`);
  }
  const entry=(flavor==='baseline'||flavor==='standalone')? block.openTag+transformed+block.closeTag:
   block.type==='script'?block.openTag.replace(/>$/,' src="'+assetPrefix+block.path.slice(4)+'?vilob='+VERSION+'">')+block.closeTag:
   '<link rel="stylesheet" href="'+assetPrefix+block.path.slice(4)+'?vilob='+VERSION+'">';
  if(!out.includes(block.marker))throw Error('Missing marker '+block.marker);
  out=out.replace(block.marker,()=>entry);
 }
 if(flavor==='baseline')return out;
 out=out.replace('<title>Village Observer V0.34C1H</title>','<title>Village Observer '+VERSION+'</title>');
 out=out.replace('>Village Observer · V0.33F</button>','>Village Observer · '+VERSION+'</button>');
 const tag=flavor==='standalone'?'<script>\n'+bootstrap+'\n</script>\n<script>\n'+d1+'\n</script>\n<script>\n'+d1a+'\n</script>\n<script>\n'+d2+'\n</script>\n<script>\n'+d2a+'\n</script>\n<script>\n'+d2b+'\n</script>\n<script>\n'+d3+'\n</script>\n<script>\n'+d3a+'\n</script>\n<script>\n'+d3a1+'\n</script>\n<script>\n'+d3a2+'\n</script>\n<script>\n'+d3b+'\n</script>\n<script>\n'+d3b1+'\n</script>\n<script>\n'+d3b2+'\n</script>\n<script>\n'+d3b3+'\n</script>\n<script>\n'+d3b3a+'\n</script>\n<script>\n'+d3b3b+'\n</script>\n<script>\n'+e01+'\n</script>\n<script>\n'+f0+'\n</script>\n<script>\n'+f1+'\n</script>\n<script>\n'+f1a+'\n</script>\n<script>\n'+f1a1+'\n</script>\n<script>\n'+f2+'\n</script>\n<script>\n'+f3+'\n</script>\n<script>\n'+g1+'\n</script>\n<script>\n'+g1a+'\n</script>\n<script>\n'+g1b+'\n</script>\n<script>\n'+g2+'\n</script>\n<script>\n'+g2a+'\n</script>\n<script>\n'+g3+'\n</script>\n<script>\n'+g3a+'\n</script>\n<script>\n'+g3b+'\n</script>\n<script>\n'+g4+'\n</script>\n<script>\n'+g4a+'\n</script>\n<script>\n'+g4a1+'\n</script>\n<script>\n'+g5+'\n</script>':
  '<script src="'+assetPrefix+'bootstrap/v034d0.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d1.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d1a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d2.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d2a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d2b.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3a1.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3a2.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3b.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3b1.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3b2.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3b3.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3b3a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034d3b3b.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034e.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034f0.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034f1.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034f1a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034f1a1.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034f2.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034f3.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g1.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g1a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g1b.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g2.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g2a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g3.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g3a.js"></script>\n<script src="'+assetPrefix+'bootstrap/v034g3b.js?vilob='+VERSION+'"></script>\n<script src="'+assetPrefix+'bootstrap/v034g4.js?vilob='+VERSION+'"></script>\n<script src="'+assetPrefix+'bootstrap/v034g4a.js?vilob='+VERSION+'"></script>\n<script src="'+assetPrefix+'bootstrap/v034g4a1.js?vilob='+VERSION+'"></script>\n<script src="'+assetPrefix+'bootstrap/v034g5.js?vilob='+VERSION+'"></script>';
 if(!out.includes('</body>'))throw Error('Missing closing body');
 const outputTag=flavor==='standalone'?tag:tag.replace(/(bootstrap\/v034[a-z0-9]+\.js)(?!\?)/g,(_,file)=>file+'?vilob='+VERSION);
 const h0Tag=flavor==='standalone'?'<script>\n'+h0+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h0.js?vilob='+VERSION+'"></script>';
 const h1Tag=flavor==='standalone'?'<script>\n'+h1+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h1.js?vilob='+VERSION+'"></script>';
 const h2Tag=flavor==='standalone'?'<script>\n'+h2+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h2.js?vilob='+VERSION+'"></script>';
 const h2aTag=flavor==='standalone'?'<script>\n'+h2a+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h2a.js?vilob='+VERSION+'"></script>';
 const h3Tag=flavor==='standalone'?'<script>\n'+h3+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h3.js?vilob='+VERSION+'"></script>';
 const h4aTag=flavor==='standalone'?'<script>\n'+h4a+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h4a.js?vilob='+VERSION+'"></script>';
 const h4bTag=flavor==='standalone'?'<script>\n'+h4b+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h4b.js?vilob='+VERSION+'"></script>';
 const h4cTag=flavor==='standalone'?'<script>\n'+h4c+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h4c.js?vilob='+VERSION+'"></script>';
 const v35aTag=flavor==='standalone'?'<script>\n'+v35a+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v035a.js?vilob='+VERSION+'"></script>';
 const v35bTag=flavor==='standalone'?'<script>\n'+v35b+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v035b.js?vilob='+VERSION+'"></script>';
 const v35cTag=flavor==='standalone'?'<script>\n'+v35c+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v035c.js?vilob='+VERSION+'"></script>';
 const v35dTag=flavor==='standalone'?'<script>\n'+v35d+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v035d.js?vilob='+VERSION+'"></script>';
 const h4Tag=flavor==='standalone'?'<script>\n'+h4+'\n</script>':'<script src="'+assetPrefix+'bootstrap/v034h4.js?vilob='+VERSION+'"></script>';
 return out.replace('</body>',outputTag+'\n'+h0Tag+'\n'+h1Tag+'\n'+h2Tag+'\n'+h2aTag+'\n'+h3Tag+'\n'+h4Tag+'\n'+h4aTag+'\n'+h4bTag+'\n'+h4cTag+'\n'+v35aTag+'\n'+v35bTag+'\n'+v35cTag+'\n'+v35dTag+'\n</body>');
}
const orig=get('tests/fixtures/v034C1H-index.html');
const rebuilt=Buffer.from(render('baseline'));
if(!orig.equals(rebuilt)||sha(rebuilt)!==manifest.sourceSha256)throw Error('C1H byte-for-byte reconstruction failed');
if(manifest.blocks.length!==169||manifest.blocks.filter(x=>x.type==='script').length!==165||manifest.blocks.filter(x=>x.type==='style').length!==4)throw Error('C1H block count mismatch');
if(schema.columnCount!==1683||new Set(schema.v2Columns).size!==schema.columnCount||schema.duplicateExtraColumns!==72)throw Error('Schema V2 identity check failed');
if(mode==='check-only'){console.log(JSON.stringify({baselineSHA256:sha(rebuilt),blocks:169,js:165,css:4,csvV2Columns:1683,success:true}));process.exit(0);}
const dist=path.join(root,'dist');fs.mkdirSync(path.join(dist,'standalone'),{recursive:true});
fs.mkdirSync(path.join(dist,'hosted','assets'),{recursive:true});
const standalone=render('standalone');
fs.writeFileSync(path.join(dist,'standalone','index.html'),standalone);
const hosted=render('hosted');fs.writeFileSync(path.join(dist,'hosted','index.html'),hosted);
const rootHosted=render('hosted','dist/hosted/assets/');fs.writeFileSync(path.join(root,'index.html'),rootHosted);
for(const block of manifest.blocks){
 const dest=path.join(dist,'hosted','assets',block.path.slice(4));
 fs.mkdirSync(path.dirname(dest),{recursive:true});let transformed=d2Transform(block.path,get(block.path).toString('utf8')).data;
 for(const fn of [e3Transform,e4Transform,e5Transform,f1aTransform,f2Transform,f3Transform,g1Transform,g2Transform,g3Transform,g3bTransform,g4Transform,g4aTransform,g5Transform])transformed=fn(block.path,transformed);
 transformed=h4Transform(block.path,h3Transform(block.path,h2aTransform(block.path,h2Transform(block.path,h1Transform(block.path,h0Transform(block.path,transformed))))));
 transformed=d35Transform(block.path,c35Transform(block.path,b35Transform(block.path,h4cTransform(block.path,transformed)))); 
 if(block.path==='src/legacy/016.js'){
  const needle="if(this.entries.length>16000||((this.entries[0]?.ordinalDay||0)<cutoff-120))this.entries=this.entries.filter(x=>(x.ordinalDay||0)>=cutoff||x.type==='MANUAL_NOTE');";
  if(!transformed.includes(needle))throw Error('Hosted telemetry anchor missing');
  transformed=transformed.replace(needle,`const current=w.ordinalDay(),last=this._v034eLastPruneOrdinal??-Infinity;
  if((this.entries.length>16000||(this.entries[0]?.ordinalDay||0)<cutoff-120)&&current-last>=30){
   this.entries=this.entries.filter(x=>(x.ordinalDay||0)>=cutoff||x.type==='MANUAL_NOTE');
   this._v034eLastPruneOrdinal=current;
  }`);
 }
 fs.writeFileSync(dest,transformed);
}
fs.mkdirSync(path.join(dist,'hosted','assets','bootstrap'),{recursive:true});
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d0.js'),bootstrap);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d1.js'),d1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d1a.js'),d1a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d2.js'),d2);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d2a.js'),d2a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d2b.js'),d2b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3.js'),d3);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3a.js'),d3a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3a1.js'),d3a1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3a2.js'),d3a2);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3b.js'),d3b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3b1.js'),d3b1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3b2.js'),d3b2);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3b3.js'),d3b3);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3b3a.js'),d3b3a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034d3b3b.js'),d3b3b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034e.js'),e01);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034f0.js'),f0);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034f1.js'),f1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034f1a.js'),f1a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034f1a1.js'),f1a1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034f2.js'),f2);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034f3.js'),f3);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g1.js'),g1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g1a.js'),g1a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g1b.js'),g1b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g2.js'),g2);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g2a.js'),g2a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g3.js'),g3);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g3a.js'),g3a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g3b.js'),g3b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g4.js'),g4);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g4a.js'),g4a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g4a1.js'),g4a1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034g5.js'),g5);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h0.js'),h0);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h1.js'),h1);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h2.js'),h2);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h2a.js'),h2a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h3.js'),h3);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h4.js'),h4);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h4a.js'),h4a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h4b.js'),h4b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v034h4c.js'),h4c);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v035a.js'),v35a);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v035b.js'),v35b);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v035c.js'),v35c);
fs.writeFileSync(path.join(dist,'hosted','assets','bootstrap','v035d.js'),v35d);
// A self-contained off-line validator embeds the exact standalone engine.
const localValidator=get('tools/local-validator.template.html').toString('utf8').replaceAll('G4','35D').replace('__ENGINE_HTML_JSON__',JSON.stringify(standalone).replace(/</g,'\\u003c'));
fs.writeFileSync(path.join(root,'local-validator-35d.html'),localValidator);
fs.writeFileSync(path.join(dist,'hosted','local-validator-35d.html'),localValidator);
// Individual downloadable index.html is the standalone build. Project root index is for GitHub Pages.
fs.writeFileSync(path.join(root,'index-standalone.html'),standalone);
const result={version:VERSION,baselineSHA256:sha(rebuilt),sourceBlocks:169,scriptBlocks:165,styleBlocks:4,hostedBytes:Buffer.byteLength(hosted),standaloneBytes:Buffer.byteLength(standalone),hostedIndexSHA256:sha(Buffer.from(hosted)),standaloneIndexSHA256:sha(Buffer.from(standalone)),csvColumns:schema.columnCount,csvDuplicateExtraColumnsFixed:schema.duplicateExtraColumns};
fs.writeFileSync(path.join(dist,'build-manifest.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
