/* V0.34D0 -- multi-file source foundation, reproducible dual build and CSV V2.
 * No simulation/historical patch rules are changed by D0.
 * The build embeds SCHEMA_V2 as JSON; the source file is build-time only.
 */
(function(NS){'use strict';
const VERSION='V0.34D0',PREVIOUS='V0.34C1H',SAVE_KEY='village-observer-v034d0';
const SCHEMA_V2=__D0_CSV_SCHEMA__;
const v2ColumnNames=SCHEMA_V2.originalColumns.slice();
for(const [index,name] of SCHEMA_V2.renames)v2ColumnNames[index]=name;
const proto=NS.World?.prototype;
if(!proto||!NS.SaveSystem||!NS.Telemetry)throw Error('D0 bootstrap must execute after legacy script #164');
const originalSerialize=proto.serialize, originalFrom=NS.World.from;
proto.serialize=function(){const data=originalSerialize.call(this);data.version=VERSION;return data;};
// This version adapter is load-only. Old versions are not a release compatibility contract.
NS.World.from=function(data){
 if(!data||data.version!==VERSION)throw Error('V0.34D0 저장 파일만 지원합니다. 이전 버전은 해당 버전에서 열어 주세요.');
 return originalFrom({...data,version:PREVIOUS});
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const data=oldJSON.call(this,w);data.version=VERSION;
 if(data.worldSummary)data.worldSummary.v034d0Revision='multi-file-build-and-csv-v2';
 return data;};
function csvHeaderParts(line){
 const out=[];let field='',quote=false;
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'){
   if(quote&&line[i+1]==='"'){field+='"';i++;}
   else quote=!quote;
  }else if(ch===','&&!quote){out.push(field);field='';}
  else field+=ch;
 }
 if(quote)throw Error('CSV 헤더의 따옴표가 닫히지 않았습니다.');
 out.push(field);return out;
}
function csvV2(csv){
 const end=csv.indexOf('\n');if(end<0)throw Error('Snapshot CSV 헤더가 없습니다.');
 const original=csvHeaderParts(csv.slice(0,end).replace(/\r$/,''));
 if(original.length!==SCHEMA_V2.originalColumns.length)throw Error(`D0 CSV 스키마 길이 불일치: ${original.length} / ${SCHEMA_V2.columnCount}`);
 for(let i=0;i<original.length;i++)if(original[i]!==SCHEMA_V2.originalColumns[i])throw Error(`D0 CSV 스키마 변동: ${i}번 열 (${original[i]})`);
 const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
 return v2ColumnNames.map(q).join(',')+csv.slice(end);
}
function download(filename,content,type){const u=URL.createObjectURL(new Blob([content],{type:type||'application/json'}));
 const a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const originalSave=NS.SaveSystem;
NS.SaveSystem={...originalSave,
 save(w){try{localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('D0 세이브 저장 실패: '+e.message);}},
 load(){const s=localStorage.getItem(SAVE_KEY);return s?NS.World.from(JSON.parse(s)):null;},
 export(w){download(`village-observer-v034D0-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D0-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);
  if(check&&!check.ok)throw Error('D0 legacy CSV 행·열 오류 '+JSON.stringify(check.bad?.slice(0,3)));
  download(`village-observer-v034D0-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');},
 exportDevCSVV2(w){const csv=csvV2(w.telemetry.snapshotsCSV()),check=NS.V032E14?.validateCSV?.(csv);
  if(check&&!check.ok)throw Error('D0 CSV V2 행·열 오류 '+JSON.stringify(check.bad?.slice(0,3)));
  download(`village-observer-v034D0-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
NS.V034D0={version:VERSION,saveKey:SAVE_KEY,csvV2,schema:{version:2,columnCount:SCHEMA_V2.columnCount,duplicateNames:SCHEMA_V2.duplicateNames,duplicateExtraColumns:SCHEMA_V2.duplicateExtraColumns,originalColumns:SCHEMA_V2.originalColumns,v2Columns:v2ColumnNames},sourceMode:'manifest-original-order'};
function addCSVButton(){
 const legacy=document.getElementById('exportLogCsvBtn');if(!legacy||document.getElementById('exportLogCsvV2Btn'))return;
 legacy.textContent='스냅샷 CSV (Legacy)';
 const b=document.createElement('button');b.id='exportLogCsvV2Btn';b.textContent='스냅샷 CSV V2';b.title='중복 헤더 없는 1,683열 CSV. 데이터와 열 순서는 Legacy와 동일';
 b.addEventListener('click',()=>{
  try{const w=window.villageObserver?.world;if(!w)throw Error('현재 세계가 없습니다.');NS.SaveSystem.exportDevCSVV2(w);}
  catch(e){console.error('D0 CSV V2',e);alert('CSV V2 저장 실패: '+e.message);}
 });
 legacy.insertAdjacentElement('afterend',b);
}
if(NS.UI){const header=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(){const result=header.call(this);document.title='Village Observer '+VERSION;
  const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';
  return result;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({
 version:VERSION,date:'2026-10-11',title:'Multi-file Foundation + Regression Baseline',
 summary:'165개 JS·4개 CSS의 원래 실행 순서를 유지하면서 Hosted/단일 HTML 이중 빌드 구조를 도입하고, 중복 헤더 없는 Snapshot CSV V2를 추가합니다. 시뮬레이션 밸런스는 변경하지 않습니다.',
 sections:[
  ['개발 구조',['원본 실행 순서와 각 script/style 실행 경계를 유지하는 Manifest 관리 개발 소스.','GitHub Pages용 Hosted와 단독 실행 index.html을 동일한 소스로 빌드합니다.','기존 코드·스크립트 순서의 SHA-256 및 빌드 재현성 검사를 제공합니다.']],
  ['관측 데이터',['Legacy CSV는 그대로 제공하며, 1,683열 CSV V2는 중복 헤더 72개를 고유 이름으로 구분합니다.','값·행·열 순서는 그대로 유지하고 열 변경은 schema-v2.json에서 추적합니다.']],
  ['저장 및 범위',['D0 전용 저장 키를 사용하며 이전 버전 세이브는 필수 호환 대상이 아닙니다.','Settlement·전투·인구·경제·AI·난수 규칙에는 변경이 없습니다.']]
 ]
});
addCSVButton();
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D0 initial header',e);}
})(window.VSim);
