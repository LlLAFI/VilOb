/* V0.35H1C — lossless checkpoint gzip and local size attribution.
 * No game model, serialization schema, save migrations or RNG modifications.
 */
(function(NS){'use strict';
if(!NS?.V035H1A||!NS?.SaveSystem||!NS?.UI)return;
const VERSION='V0.35H1C',FORMAT='vilob-v035h1c-storage-v1';
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const human=n=>(n/1048576).toFixed(2)+' MiB';
let latest=null,busy=false;
function download(name,blob){if(typeof document==='undefined')return blob;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);return blob;}
function status(message){if(typeof document!=='undefined'){const el=document.getElementById('v035h1cStatus');if(el)el.textContent=message;}}
function assertAvailable(which){if(typeof globalThis[which]!=='function')throw Error(which+' API를 지원하지 않는 브라우저입니다. JSON 체크포인트를 이용하세요.');}
function fileName(w,ext){const seed=w?.v35h1a?.seed||'WORLD',day=w?.calendarOrdinalDay?.()??'unknown';return `vilob-PERF-${seed}-${day}d-checkpoint.${ext}`;}
function prepare(w){const t0=clock(),obj=NS.V035H1A.scenario(w),t1=clock(),text=JSON.stringify(obj),t2=clock();return {meta:{worldVersion:obj.world.version,signature:obj.perf.stateSignature,rngState:obj.perf.rngState},text,times:{serializeMs:t1-t0,stringifyMs:t2-t1},jsonBytes:new Blob([text]).size};}
async function compressText(text){assertAvailable('CompressionStream');
 const src=new Blob([text],{type:'application/json'}),stream=src.stream().pipeThrough(new CompressionStream('gzip'));
 return await new Response(stream).blob();
}
async function gzipCheckpoint(w,opts={download:true}){
 if(busy)throw Error('저장·압축 작업이 이미 진행 중입니다.');busy=true;status('원본 상태와 JSON을 생성하고 있습니다…');
 try{const p=prepare(w),start=clock();status('gzip으로 무손실 압축 중…');const blob=await compressText(p.text),end=clock();
  const r={format:FORMAT,version:VERSION,operation:'gzipExport',year:Number(w.year),calendarDay:w.calendarOrdinalDay?.()??null,originalBytes:p.jsonBytes,gzipBytes:blob.size,ratio:blob.size/p.jsonBytes,serializeMs:p.times.serializeMs,stringifyMs:p.times.stringifyMs,gzipMs:end-start,worldVersion:p.meta.worldVersion,signature:p.meta.signature,rngState:p.meta.rngState,measurement:'Times are browser wall clock and exclude download; compressed size does not indicate lower runtime heap usage.'};latest=r;
  if(opts.download!==false)download(fileName(w,'json.gz'),blob);status(`gzip 내보내기 완료 · ${human(p.jsonBytes)} → ${human(blob.size)} (${(100*r.ratio).toFixed(1)}%)`);
  return {blob,report:r};
 }catch(e){status('gzip 저장 실패: '+e.message);throw e;}finally{busy=false;}
}
async function textFromCheckpoint(file){
 if(typeof file==='string')return {text:file,compressed:false};
 if(!file||typeof file.text!=='function')throw Error('유효한 체크포인트 파일을 선택하세요.');
 const head=new Uint8Array(await file.slice(0,2).arrayBuffer()),gzip=head[0]===0x1f&&head[1]===0x8b;
 const namedGzip=/\.gz$/i.test(file.name||'');
 if(namedGzip&&!gzip)throw Error('파일 확장자가 .gz이지만 gzip 헤더가 없습니다.');
 if(!gzip)return {text:await file.text(),compressed:false};
 assertAvailable('DecompressionStream');
 try{return {text:await new Response(file.stream().pipeThrough(new DecompressionStream('gzip'))).text(),compressed:true};}
 catch(e){throw Error('gzip 압축 해제에 실패했습니다: '+e.message);}
}
async function importCheckpoint(file){
 if(busy)throw Error('저장·압축 작업이 이미 진행 중입니다.');busy=true;status('체크포인트 파일 검사 및 압축 해제 중…');
 try{const t0=clock(),decoded=await textFromCheckpoint(file),t1=clock();status('기존 서명·RNG·전쟁 상태 복원 검사 중…');
  const world=await NS.V035H1A.importCheckpoint(decoded.text),t2=clock();latest={format:FORMAT,version:VERSION,operation:'import',compressed:decoded.compressed,decodeMs:t1-t0,validateAndRestoreMs:t2-t1,year:world.year,rngState:world.v35h1a?.rngState,signature:NS.V035H1A.fingerprint(world)};
  status(`${decoded.compressed?'gzip':'JSON'} 체크포인트 불러오기 완료 · ${world.year}년`);return world;
 }catch(e){status('불러오기 실패: '+e.message);throw e;}finally{busy=false;}
}
function sizeReport(w){const start=clock(),s=w.serialize(),fields=[];let all=0;
 for(const [key,value] of Object.entries(s)){const bytes=new Blob([JSON.stringify(value)??'null']).size;all+=bytes;fields.push({key,bytes});}
 fields.sort((a,b)=>b.bytes-a.bytes);
 const telemetry=s.telemetry||s._telemetry||null,children=[];
 if(telemetry&&typeof telemetry==='object')for(const [key,value] of Object.entries(telemetry)){const bytes=new Blob([JSON.stringify(value)??'null']).size;children.push({key,bytes});}
 children.sort((a,b)=>b.bytes-a.bytes);
 const result={format:FORMAT,version:VERSION,operation:'sizeAttribution',year:w.year,calendarDay:w.calendarOrdinalDay?.(),estimateBytes:all,topLevelFields:fields,telemetryFields:children,elapsedMs:clock()-start,notes:'Measurements are serialized JSON UTF-8 byte estimates per field, not compressed bytes; add property names/delimiters for exact full JSON size. Does not remove or mutate any saved state.'};latest=result;return result;
}
function exportAnalysis(w){const r=sizeReport(w);download(`vilob-v035H1C-size-${w.year}y.json`,new Blob([JSON.stringify(r,null,2)],{type:'application/json'}));status('용량 분석 완료 · 상위 필드 '+r.topLevelFields.slice(0,3).map(x=>x.key+' '+human(x.bytes)).join(', '));return r;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const root=document.getElementById('v035h1aPanel');if(!root)return;
 if(!document.getElementById('v035h1cPanel')){
  const panel=document.createElement('div');panel.className='panel';panel.id='v035h1cPanel';panel.style.marginTop='10px';
  panel.innerHTML='<h3>H1C · 무손실 체크포인트</h3><div class="small muted">gzip 압축은 저장 데이터·서명·전쟁 명령을 변경하지 않습니다. 전체 JSON 백업도 유지됩니다.</div><div class="button-grid"><button id="v035h1cExport">압축 체크포인트 (.json.gz)</button><button id="v035h1cPlain">비압축 JSON 체크포인트</button><label class="file-btn">JSON / gzip 불러오기<input id="v035h1cImport" type="file" accept=".json,.gz,.json.gz,application/json,application/gzip"></label><button id="v035h1cSizes">저장 항목 용량 분석 JSON</button><button id="v035h1cMetrics">최근 저장·불러오기 성능 JSON</button></div><div class="small muted" id="v035h1cStatus"></div>';
  root.appendChild(panel);
  const q=id=>document.getElementById(id);
  q('v035h1cExport').onclick=async()=>{try{await gzipCheckpoint(ui.world);}catch(e){console.warn('H1C gzip',e);}};
  q('v035h1cPlain').onclick=()=>{try{NS.SaveSystem.exportH1ACheckpoint(ui.world);status('비압축 JSON 체크포인트 내보내기 완료');}catch(e){status(e.message);}};
  q('v035h1cImport').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!confirm('현재 세계를 종료하고 선택한 체크포인트를 불러올까요?'))return;const w=await importCheckpoint(f);ui.setWorld(w);ui.render?.();}catch(err){status('체크포인트 오류: '+err.message);}finally{e.target.value='';}};
  q('v035h1cSizes').onclick=()=>{try{exportAnalysis(ui.world);}catch(e){status('분석 실패: '+e.message);}};
  q('v035h1cMetrics').onclick=()=>{if(!latest){status('먼저 저장·불러오기·용량 분석을 실행하세요.');return;}download('vilob-v035H1C-storage-diagnostic.json',new Blob([JSON.stringify(latest,null,2)],{type:'application/json'}));};
 }
 // H1C becomes the default checkpoint workflow; explicitly retain legacy JSON.
 const oldButton=document.getElementById('v035h1aCheckpoint');if(oldButton&&!oldButton.dataset.h1cDefault){oldButton.dataset.h1cDefault='true';oldButton.textContent='현재 체크포인트 gzip (H1C)';oldButton.onclick=async()=>{try{await gzipCheckpoint(ui.world);}catch(e){console.warn('H1C gzip',e);}};}
 const oldImport=document.getElementById('v035h1aImport');if(oldImport&&!oldImport.dataset.h1cImport){oldImport.dataset.h1cImport='true';oldImport.accept='.json,.json.gz,.gz,application/json,application/gzip';oldImport.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!confirm('현재 세계를 종료하고 체크포인트를 불러올까요?'))return;const w=await importCheckpoint(f);ui.setWorld(w);ui.render?.();}catch(ex){status('체크포인트 오류: '+ex.message);}finally{e.target.value='';}};}
}
const prevRender=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...a){const out=prevRender.apply(this,a);install(this);return out;};
NS.SaveSystem={...NS.SaveSystem,exportH1CGzipCheckpoint:gzipCheckpoint,importH1CCheckpoint:importCheckpoint,exportH1CSizeAnalysis:exportAnalysis};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-24',title:'Save Data Optimization V1',summary:'기존 체크포인트 구조를 변경하지 않는 gzip 무손실 저장·불러오기, 이전 JSON 호환 및 저장 구성 계측.',sections:[['압축 저장',['고정 세계 체크포인트를 .json.gz 파일로 내보내고 기존 서명·RNG·전쟁 복원 체인을 통해 불러옵니다.','비압축 JSON도 별도 버튼으로 지원합니다.']],['진단',['상위 저장 항목별 UTF-8 크기와 Telemetry 내부 용량을 작은 JSON으로 추출합니다.','게임 세계·기술·전쟁 상태·CSV·관측 기록은 변경하지 않습니다.']]]});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const prevHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const r=prevHeader.apply(this,a);badge();return r;};badge();
NS.V035H1C=Object.freeze({version:VERSION,gzipCheckpoint,importCheckpoint,textFromCheckpoint,compressText,sizeReport,exportAnalysis,lastReport:()=>latest,install});
})(window.VSim);
