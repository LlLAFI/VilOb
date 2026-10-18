// H2 release recognition only; protected legacy source SHA identities unchanged.
export function h2Transform(source,input){
 let s=input;
 if(source==='src/legacy/093.js'){
  const before='const p=ensureProgram33C2(v,ui.world,false),now=CAL33C2(ui.world)';
  if(!s.includes(before))throw Error('H2 strategy panel side effect anchor missing');
  s=s.replace(before,'const p=v.v33c2StrategicProgram;if(!p)return;const now=CAL33C2(ui.world)');
 }
 if(source==='src/bootstrap/v034g5.js'){
  const target="NS.RELEASE_VERSION==='V0.34H1'";
  if(!s.includes(target))throw Error('H2 G5 integrity version anchor missing');
  s=s.replace(target,"(NS.RELEASE_VERSION==='V0.34H1'||NS.RELEASE_VERSION==='V0.34H2')");
 }
 return s;
}
