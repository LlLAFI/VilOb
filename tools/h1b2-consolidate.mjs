/* Build-output-only H1B2 consolidation. Source bootstraps remain auditable.
 * Whitelist is deliberately exact: never remove a wrapper with secondary UI,
 * simulation, migration, cache, or profiler side-effects.
 */
import fs from 'node:fs';
const removes={
 'v034h2a.js': ["if(NS.UI){const before=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const result=before.apply(this,args);refresh();return result;};}"],
 'v034h4.js': ["if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const out=oldHeader.apply(this,args);refresh();return out;};}"],
 'v034d3b3b.js': ["if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const v=old.apply(this,args);renderVersion();return v;};}renderVersion();"],
 'v035h1b.js': ["if(NS.UI){const h=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=h.apply(this,args);badge();return r;};}"],
 'v035h1b1.js': ["const h=NS.UI?.prototype.renderHeader;if(h)NS.UI.prototype.renderHeader=function(...args){const r=h.apply(this,args);const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;return r;};"],
 'v035h1b1a.js': ["const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=oldHeader.apply(this,args);const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;return r;};"],
 'v035h1a.js': [
 "NS.UI.prototype.renderHeader=function(...args){const r=prevHeader.apply(this,args);badge();return r;};",
 "NS.UI.prototype.render=function(...args){const r=prevAll.apply(this,args);badge();return r;};",
 "NS.UI.prototype.renderViews=function(...args){const r=prevViews.apply(this,args);badge();return r;};"
 ],
};
export const REMOVALS=Object.values(removes).reduce((n,arr)=>n+arr.length,0);
export function optimizeBootstrap(name,source){let out=source;for(const target of removes[name]||[]){if(!out.includes(target))throw Error('H1B2 unsafe consolidation; audited header anchor changed: '+name+' '+target.slice(0,64));if(out.split(target).length!==2)throw Error('H1B2 ambiguous consolidation: '+name);out=out.replace(target,'/* H1B2: redundant version-only UI wrapper omitted */');}return out;}
const extract=(html,base)=>[...html.matchAll(/<script src="([^"]*?bootstrap\/([a-z0-9]+\.js)(?:\?vilob=[^"]*)?)"><\/script>/g)].map(m=>({...{full:m[0],file:m[2],src:m[1]},start:m.index,end:m.index+m[0].length}));
function hostedBundle(html,files){const m=extract(html);if(m.length!==files.length||m.some((v,i)=>v.file!==files[i]))throw Error('H1B2 unexpected hosted bootstrap order/count');const slice=html.slice(m[0].start,m.at(-1).end);const without=slice.replace(/<script src="[^"]*"><\/script>/g,'').trim();if(without)throw Error('H1B2 non-script element in bootstrap segment');const prefix=m[0].src.slice(0,m[0].src.lastIndexOf('bootstrap/'));const link='<script src="'+prefix+'bootstrap/v035h1c4-bundle.js?vilob=V0.35H1C4"></script>';return html.slice(0,m[0].start)+link+html.slice(m.at(-1).end);}
function standaloneOptimize(html,files){const script=[...html.matchAll(/<script>\n([\s\S]*?)\n<\/script>/g)];if(script.length<files.length)throw Error('H1B2 insufficient inline bootstrap scripts');const selected=script.slice(-files.length);let out=html;
 for(let i=selected.length-1;i>=0;i--){const m=selected[i],content=optimizeBootstrap(files[i],m[1]);out=out.slice(0,m.index)+'<script>\n'+content+'\n</script>'+out.slice(m.index+m[0].length);}return out;
}
function gate(html){if(!html.includes('</head>'))throw Error('No head for H1B2 startup gate');return html.replace('</head>','<style id="vilob-h1b2-startup-gate">#versionBadge{visibility:hidden!important}</style>\n</head>');}
export function consolidate({root,dist,assetNames}){
 const sourceHtml=fs.readFileSync(dist+'/hosted/index.html','utf8');const rootHtml=fs.readFileSync(root+'/index.html','utf8');
 const files=extract(sourceHtml).map(x=>x.file);
 if(files.length!==64||files.at(-1)!=='v035h1c4.js'||assetNames!==64)throw Error('H1B2 bootstrap list not expected 63');
 const scripts=files.map(name=>optimizeBootstrap(name,fs.readFileSync(dist+'/hosted/assets/bootstrap/'+name,'utf8')));
 for(let i=0;i<scripts.length;i++)if(!scripts[i].trim().endsWith('})(window.VSim);'))throw Error('Bootstrap not isolated IIFE: '+files[i]);
 // Explicit semicolon is a script-boundary separator: no inter-script global
 // declarations, scope nesting, or load order are changed.
 const bundled=scripts.map((s,i)=>'/* H1B2 bundled source: '+files[i]+' */\n'+s+'\n;').join('\n');
 fs.writeFileSync(dist+'/hosted/assets/bootstrap/v035h1c4-bundle.js',bundled);
 // Compiled individual bootstrap assets have no HTML consumers after bundling.
 // Keep their original sources in src/bootstrap/ for audit/rebuild.
 for(const name of files)fs.rmSync(dist+'/hosted/assets/bootstrap/'+name);
 fs.writeFileSync(dist+'/hosted/index.html',gate(hostedBundle(sourceHtml,files)));
 fs.writeFileSync(root+'/index.html',gate(hostedBundle(rootHtml,files)));
 const standalonePath=dist+'/standalone/index.html';const standalone=standaloneOptimize(fs.readFileSync(standalonePath,'utf8'),files);
 fs.writeFileSync(standalonePath,gate(standalone));fs.writeFileSync(root+'/index-standalone.html',gate(standalone));
 return {bundledBootstrapScripts:files.length,removedVersionOnlyWrappers:REMOVALS,hostedScriptRequests:165+1,bootstrapBundleBytes:Buffer.byteLength(bundled)};
}
