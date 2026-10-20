// H4 release version allow-list extension; no simulation paths touched.
export function h4Transform(source,input){
 if(source==='src/bootstrap/v034g5.js'){
  const anchor="NS.RELEASE_VERSION==='V0.34H3'";
  if(!input.includes(anchor))throw Error('H4 G5 release check anchor missing');
  return input.replace(anchor,anchor+"||NS.RELEASE_VERSION==='V0.34H4'||NS.RELEASE_VERSION==='V0.34H4A'||NS.RELEASE_VERSION==='V0.34H4B'||NS.RELEASE_VERSION==='V0.34H4C'||NS.RELEASE_VERSION==='V0.35A'||NS.RELEASE_VERSION==='V0.35B'");
 }
 return input;
}
