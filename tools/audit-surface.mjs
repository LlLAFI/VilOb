#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/manifest.json')));
const sources=[...manifest.blocks.filter(x=>x.type==='script').map(x=>x.path),...fs.readdirSync(path.join(root,'src/bootstrap')).filter(x=>x.endsWith('.js')).map(x=>'src/bootstrap/'+x)].sort();
const patterns={
 'World.advanceOneDay':/NS\.World\.prototype\.advanceOneDay\s*=/g,
 'World.serialize':/NS\.World\.prototype\.serialize\s*=/g,
 'World.from':/NS\.World\.from\s*=/g,
 'Person.act':/NS\.Person\.prototype\.act\s*=/g,
 'Person.metabolism':/NS\.Person\.prototype\.metabolism\s*=/g,
 'Person.chooseJob':/NS\.Person\.prototype\.chooseJob\s*=/g,
 'Village.seasonalTick':/NS\.Village\.prototype\.seasonalTick\s*=/g,
 'Village.dailyTick':/NS\.Village\.prototype\.dailyTick\s*=/g,
 'Telemetry.toJSON':/NS\.Telemetry\.prototype\.toJSON\s*=/g,
 'Telemetry.snapshot':/NS\.Telemetry\.prototype\.snapshot\s*=/g,
 'Telemetry.snapshotsCSV':/NS\.Telemetry\.prototype\.snapshotsCSV\s*=/g,
 'UI.renderWorld':/NS\.UI\.prototype\.renderWorld\s*=/g,
 'Telemetry.record.call':/\.telemetry\??\.record\??\(/g,
 'Event/Devlog literal':/\b(?:_EVENT|_LOG|_AUDIT)\b/g
};
const rows=[];for(const [name,regex] of Object.entries(patterns)){const paths=[];let occurrences=0;for(const source of sources){const text=fs.readFileSync(path.join(root,source),'utf8');const hits=[...text.matchAll(regex)].length;if(hits){occurrences+=hits;paths.push({path:source,hits});}}rows.push({name,occurrences,files:paths.length,examples:paths.slice(-6)});}
const summary={createdFor:'V0.34E-rc1',scope:'static assignment counts (not a CPU profile and not proof of unused code)',sourceScripts:sources.length,legacyScriptBlocks:manifest.blocks.filter(x=>x.type==='script').length,bootstrapScripts:sources.length-manifest.blocks.filter(x=>x.type==='script').length,rows};
const json=JSON.stringify(summary,null,2);fs.writeFileSync(path.join(root,'docs/E01-SOURCE-AUDIT.json'),json+'\n');
const md=['# V0.34E E-01 정적 실행 경로 감사','', '> **주의:** 아래 값은 소스에 나타난 함수 재할당 위치의 개수입니다. 실제 실행시간이나 불필요성의 증거가 아닙니다. 계측 결과를 보고 제거 여부를 결정합니다.','',`- 레거시 JavaScript 블록: ${summary.legacyScriptBlocks}개`,`- Bootstrap 모듈: ${summary.bootstrapScripts}개`,`- 검사한 JavaScript 파일: ${summary.sourceScripts}개`,'','| 관찰 경로 | 소스 내 재할당/호출 위치 수 | 파일 수 |','|---|---:|---:|',...rows.map(x=>`| \`${x.name}\` | ${x.occurrences} | ${x.files} |`),'','## 원칙','','1. 실제 61년차 세이브로 측정한 전체 SIM/일과 상위 병목을 우선합니다.','2. `World.advanceOneDay`, `Person.act`, 물류·재고 경로는 동작과 결정론을 유지하며 통합합니다.','3. 구버전별 텔레메트리·CSV는 실제 UI, 저장, 회귀시험 의존성 조사 후 제거합니다.','4. CPU가 아닌 수출용 JSON 용량 감소만으로 성능 회복을 선언하지 않습니다.','5. E-01 RC는 **성능 최적화 완료 버전이 아니며** 코어 로직을 변경하지 않았습니다.',''];fs.writeFileSync(path.join(root,'docs/ARCHITECTURE-AUDIT-34E.md'),md.join('\n'));
console.log(JSON.stringify({legacy:summary.legacyScriptBlocks,bootstrap:summary.bootstrapScripts,hot:rows.filter(x=>x.occurrences>1).map(x=>[x.name,x.occurrences])}));
