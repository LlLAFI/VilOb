// H3: remove ONLY the obsolete V33C history *display* invocation.
// Active combat, engagement data, tile detail, statistics, and serialized
// state remain untouched. C1H protected source remains immutable.
export function h3Transform(source,input){
 if(source==='src/legacy/091.js'){
  const anchor='augmentWarBannerC(this);renderEngagementHistoryC(this);return r;';
  if(!input.includes(anchor))throw Error('H3 deprecated engagement UI anchor missing');
  return input.replace(anchor,'augmentWarBannerC(this);return r;');
 }
 if(source==='src/bootstrap/v034g5.js'){
  const anchor="NS.RELEASE_VERSION==='V0.34H2A'";
  if(!input.includes(anchor))throw Error('H3 G5 release check anchor missing');
  return input.replace(anchor,anchor+"||NS.RELEASE_VERSION==='V0.34H3'");
 }
 return input;
}
