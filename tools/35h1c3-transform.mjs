/* H1C3 protected-script output transforms, original SHA-pinned sources stay untouched.
 * The event handlers are only dispatched at their existing lexical record timing.
 */
const changes={
 'src/legacy/125.js':[
  ["if(type==='WAR_DECLARED33')captureDeclaration(w,payload);else if(type==='WAR_ENDED33')captureWarEnd(w,payload);",
   "if(type==='WAR_DECLARED33'||type==='WAR_ENDED33'){const fn=type==='WAR_DECLARED33'?captureDeclaration:captureWarEnd;if(NS.V035H1C3?.DomainEvents)NS.V035H1C3.DomainEvents.handle(type,w,payload,fn);else fn(w,payload);}"],
  ["NS.V033F5A3={version:VERSION", "NS.__H1C3DomainHandlers=Object.assign(NS.__H1C3DomainHandlers||{},{WAR_DECLARED33:captureDeclaration,WAR_ENDED33:captureWarEnd});NS.V033F5A3={version:VERSION"]
 ],
 'src/legacy/114.js':[
  ["if(type==='TILE_OCCUPIED33'||type==='TILE_LIBERATED33')updateControlEvent(w,type,payload);",
   "if(type==='TILE_OCCUPIED33'||type==='TILE_LIBERATED33'){if(NS.V035H1C3?.DomainEvents)NS.V035H1C3.DomainEvents.handle(type,w,payload,(ww,pp)=>updateControlEvent(ww,type,pp));else updateControlEvent(w,type,payload);}"],
  ["NS.V033F={version:VERSION", "NS.__H1C3DomainHandlers=Object.assign(NS.__H1C3DomainHandlers||{},{TILE_OCCUPIED33:(w,p)=>updateControlEvent(w,'TILE_OCCUPIED33',p),TILE_LIBERATED33:(w,p)=>updateControlEvent(w,'TILE_LIBERATED33',p)});NS.V033F={version:VERSION"]
 ],
 'src/legacy/108.js':[
  ["const m=cultureMetrics(v,w),n=(v.residents||[]).filter(p=>p.alive).length;",
   "const m=NS.V035H1C3?.measureCall?NS.V035H1C3.measureCall('E4_CULTURE_METRICS',w,cultureMetrics,null,[v,w]):cultureMetrics(v,w),n=(v.residents||[]).filter(p=>p.alive).length;"],
  ["const ws=observerWarScan(v,w);", "const ws=NS.V035H1C3?.measureCall?NS.V035H1C3.measureCall('E4_WAR_SCAN',w,observerWarScan,null,[v,w]):observerWarScan(v,w);"]
 ],
 'src/legacy/119.js':[
  ["const z=ensure(w),m=z.monetary,parts=moneyParts(w),growth=annualGrowth(w),real=realizedPrices(w),idx=indexOf(w),active=",
   "const z=ensure(w),m=z.monetary,parts=NS.V035H1C3?.measureCall?NS.V035H1C3.measureCall('F5_MONEY_PARTS',w,moneyParts,null,[w]):moneyParts(w),growth=annualGrowth(w),real=NS.V035H1C3?.measureCall?NS.V035H1C3.measureCall('F5_REALIZED_PRICES',w,realizedPrices,null,[w]):realizedPrices(w),idx=indexOf(w),active="]
 ]
};
export function h1c3Transform(path,code){for(const [from,to] of changes[path]||[]){const n=code.split(from).length-1;if(n!==1)throw Error('H1C3 source transform anchor '+path+' count '+n+': '+from.slice(0,60));code=code.replace(from,to);}return code;}
export const H1C3_FILES=Object.keys(changes);
