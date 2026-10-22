/* V0.35G1A: two numerical balance changes only. Transform G1 bootstrap at build time
 * so the V0.35G1 source, protected legacy blocks and future H technology scope remain untouched. */
export function rebalanceG1A(source){
 let s=source;
 const replace=(oldValue,newValue,label)=>{
  const first=s.indexOf(oldValue);
  if(first<0||s.indexOf(oldValue,first+oldValue.length)>=0)throw Error(`35G1A missing/ambiguous ${label}`);
  s=s.slice(0,first)+newValue+s.slice(first+oldValue.length);
 };
 replace("const VERSION='V0.35G1',PREVIOUS='V0.35G',KEY='village-observer-v035g1';", "const VERSION='V0.35G1A',PREVIOUS='V0.35G',KEY='village-observer-v035g1a';",'identity');
 replace('const BASE_DAILY=.25,LAND_PER_TICK=.55,LOCAL_PER_ADULT=.05,LOCAL_MAX=.25,ARCH_MULT=2.5,REVIEW_DAYS=30;',
         'const BASE_DAILY=.80,LAND_PER_TICK=.55,LOCAL_PER_ADULT=.05,LOCAL_MAX=.25,ARCH_MULT=3.0,REVIEW_DAYS=30;', 'only two balance constants');
 replace('const g1=d?.version===VERSION,w=priorFrom.call(this,g1?{...d,version:PREVIOUS}:d,...args);',
         "const g1=(d?.version===VERSION||d?.version==='V0.35G1'),w=priorFrom.call(this,g1?{...d,version:PREVIOUS}:d,...args);",'G1 save import');
 replace('const r=localStorage.getItem(KEY);return r?NS.World.from(JSON.parse(r)):priorSave.load?.();',
         "const r=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v035g1');return r?NS.World.from(JSON.parse(r)):priorSave.load?.();",'G1 local save fallback');
 replace("p._v35gLastReason=architect?'G1_ARCHITECT_2_5X':'G1_BASELINE';",
         "p._v35gLastReason=architect?'G1A_ARCHITECT_3_0X':'G1A_BASELINE';",'diagnostic reason');
 s=s.replaceAll('village-observer-v035G1-', 'village-observer-v035G1A-')
     .replaceAll('vilob-v035G1-construction-', 'vilob-v035G1A-construction-')
     .replaceAll('35G1 추상 건설·건축가 JSON','35G1A 추상 건설·건축가 JSON')
     .replaceAll('V0.35G1 추상 건설','V0.35G1A 추상 건설')
     .replaceAll('×2.5','×3.0')
     .replaceAll('하루 0.25','하루 0.80');
 // The release notes for G1A cover only the two approved numeric changes; keep G1 history visible.
 replace("title:'Construction Abstraction + Architect Dispatch V1',summary:'모든 유효 공사가 무인력 기본 속도로 진행되며, 실제 건축가 파견은 현장 근무 중 건설력을 ×3.0 가속합니다.',",
         "title:'Construction Speed Rebalance',summary:'기본 건설력 하루 0.25→0.80, 건축가 가속 ×2.5→×3.0. 지역 보정 +5%/성인·상한 +25%와 기술 효과는 유지합니다.',", 'release note title');
 replace("version:VERSION,date:'2026-10-22',title:'Construction Speed Rebalance'","version:VERSION,date:'2026-10-23',title:'Construction Speed Rebalance'",'patch date');
 replace("V0.35G 세이브 가져오기를 지원하며 G1 별도 저장 키를 사용합니다.","V0.35G와 G1 세이브 가져오기를 지원하며 G1A 별도 저장 키를 사용합니다.",'patch note save');
 replace("NS.V035G1=Object.freeze({version:VERSION,prepare,work,landWork,report,localFactor,constants:{BASE_DAILY,LAND_PER_TICK,ARCH_MULT,REVIEW_DAYS}});badge();",
         "NS.V035G1=Object.freeze({version:VERSION,prepare,work,landWork,report,localFactor,constants:{BASE_DAILY,LAND_PER_TICK,ARCH_MULT,REVIEW_DAYS}});NS.V035G1A=NS.V035G1;\nif(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.35G1'))NS.PATCH_NOTES.splice(1,0,{version:'V0.35G1',date:'2026-10-22',title:'Construction Abstraction + Architect Dispatch V1',summary:'무인력 기본 건설력 0.25/일, 건축가 파견 ×2.5를 도입했습니다.'});badge();",'G1 history + version alias');
 return s;
}
