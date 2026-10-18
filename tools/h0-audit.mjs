#!/usr/bin/env node
// Static source inventory for H1-H3. Counts are references, not runtime timings or dead-code proof.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/manifest.json'),'utf8'));
const sources=[...manifest.blocks.filter(b=>b.type==='script').map(b=>b.path),...fs.readdirSync(path.join(root,'src/bootstrap')).filter(f=>f.endsWith('.js')).map(f=>'src/bootstrap/'+f)].sort();
const src=new Map(sources.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
const template=fs.readFileSync(path.join(root,'src/template.html'),'utf8');
const ids=[...new Set([...template.matchAll(/\bid="([\w-]+)"/g)].map(x=>x[1]))];
const methods=['render','renderHeader','renderMap','renderTile','renderVillageContent','renderWorld','renderStats','renderTech','renderCodex','setWorld'];
const runtimeRefs=['runtimeStatus','g3aRuntimeIntegrity','statsScope','villageContent','villageSubtabs','worldCanvas','tileInspector','v034f0PerfPanel','v034f1FoodPanel','v30aPerfPanel','chronicle','devLogPreview'];
const counts={};
for(const method of methods){const files=[];for(const [file,data] of src){const count=[...data.matchAll(new RegExp(`(?:NS\\.UI\\.prototype\\.${method}\\s*=|\\b${method}\\s*\\()`, 'g'))].length;if(count)files.push({file,count});}counts[method]={occurrences:files.reduce((a,b)=>a+b.count,0),files};}
const references={};
for(const id of [...new Set([...ids,...runtimeRefs])]){
 const candidates=[];for(const [file,data] of src){if(data.includes(id))candidates.push(file);}
 references[id]={template:ids.includes(id),files:candidates};
}
const screens={
 '지도':['renderMap','renderTile','worldCanvas','tileInspector','runtimeStatus'],
 '국가·개요':['renderVillageContent','villageContent'],
 '국가·주민':['renderVillageContent','villageContent'],
 '국가·경제':['renderVillageContent','villageContent'],
 '국가·교역':['renderVillageContent','villageContent'],
 '국가·사회':['renderVillageContent','villageContent'],
 '국가·군사':['renderVillageContent','villageContent'],
 '국가·기술':['renderVillageContent','villageContent'],
 '통계·교전기록':['renderStats','render','statsScope'],
 '세계':['renderWorld','chronicle','devLogPreview'],
 '상단 상태':['renderHeader','runtimeStatus','g3aRuntimeIntegrity']};
const candidates=[
 {target:'C1G 고정 성공 문구',source:'src/legacy/163.js',status:'H0에서 안전 제거',engineEffect:'연간 진단 캐시·CSV·World.renderWorld 유지'},
 {target:'구형 생활권 지도 레이어',source:'src/legacy/040.js',status:'H1에서 UI 제거',engineEffect:'Settlement/Person 로직 검증 후 별도 유지'},
 {target:'V0.33C 지속 교전 패널',source:'src/legacy/091.js',status:'H3에서 교체 후 제거',engineEffect:'현재 전쟁·엔진 engagements33D 유지'},
 {target:'0.33 이하 저장 전용 분기',source:'복수 World.from / SaveSystem',status:'호환성 의무 해제·물리 삭제 보류',engineEffect:'0.34 복원 경유 체인이 소비하므로 전체 호출 관계 조사 필요'},
 {target:'G5 무결성 정상 메시지',source:'src/bootstrap/v034g5.js',status:'H0에서 정상표시만 숨김',engineEffect:'G5 검사/실패 경고 유지'},
 {target:'F0/F1 프로파일러 DOM',source:'src/bootstrap/v034f0.js / v034f1.js',status:'H3에서 위치 이동',engineEffect:'renderHeader 의존 계측 스케줄 유지'}
];
const data={version:'V0.34H0',scope:'static source inventory; not a runtime profiler or dead-code finding',protectedBlocks:manifest.blocks.length,sources:sources.length,templateIds:ids,methods:counts,domReferences:references,screens,candidates};
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/H0-UI-DEPENDENCIES.json'),JSON.stringify(data,null,2)+'\n');
const md=['# V0.34H0 — 화면·렌더러 의존성 지도','', '> 정적 검색 결과다. 참조 횟수는 실제 호출 횟수/성능 병목/삭제 가능 여부를 입증하지 않는다. 동적으로 생성되는 DOM, 클로저 후킹, bootstrap이 추가한 영역은 별도 브라우저 검증이 필요하다.','',`- 보호된 레거시 블록 **${manifest.blocks.length}개** (원본 SHA 유지)`,`- 조사 JS 파일 **${sources.length}개**`,`- 템플릿 정적 DOM id **${ids.length}개**`,'','## 11개 검토 화면과 공통 연결 지점','','| 화면 | 공통 렌더 함수/DOM |','|---|---|',...Object.entries(screens).map(([name, refs])=>`| ${name} | ${refs.map(x=>'`'+x+'`').join(', ')} |`),'','## 렌더 후킹 수 (정적 참조 포함)','','| 함수 | 감지한 정적 패턴 수 | 관련 파일 수 |','|---|---:|---:|',...Object.entries(counts).map(([name, row])=>`| \`${name}\` | ${row.occurrences} | ${row.files.length} |`),'','## 레거시 보존/제거 결정','','| 대상 | 근거 파일 | 처리 |','|---|---|---|',...candidates.map(x=>`| ${x.target} | \`${x.source}\` | ${x.status} |`),'','## H1~H3 구현 경계','','- H1: 맵 레이어·정착지 국가색 완전 경계·타일 상세. `renderMap`/`renderTile` 후킹 순서 보존.','- H2: 국가 7개 하위탭의 `renderVillageContent` 우선순위 재구성. 실제 Person·Settlement 데이터 참조 검증.','- H3: 세계/통계/상단 상태, C1G UI 제거, F0/F1 이동 시 헤더 계측 의존성 유지.','- 모든 단계에서 G5 저장/복원·1683열 CSV·장비/Gold/재고/기술 43개 회귀.','','## 정적 ID의 실제 참조 (사용처 파악용)','','| DOM ID | 템플릿 | 소스 파일 수 |','|---|---:|---:|',...Object.entries(references).map(([id,v])=>`| \`${id}\` | ${v.template?'Y':'—'} | ${v.files.length} |`),''];
fs.writeFileSync(path.join(root,'docs/H0-UI-DEPENDENCIES.md'),md.join('\n')+'\n');
console.log(JSON.stringify({status:'PASS',sources:sources.length,templateIds:ids.length,methodHooks:Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,v.occurrences]))}));
