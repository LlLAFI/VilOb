// G4 builds mutate only compiled output. All 169 C1H protected source blocks remain byte-identical.
const change=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)throw Error(`G4 ${label}: expected 1 anchor found ${n}`);return src.replace(from,to);};
export function g4Transform(file,src){let s=src;
 if(file==='src/legacy/154.js'){
  s=change(s,'return Number(NS.TERRAIN[t.terrain].tradeCost||1)*(road?0.62:1);','return NS.V034G4?.spatialStep?.(w,t)??(Number(NS.TERRAIN[t.terrain].tradeCost||1)*(road?0.62:1));','C-spatial-step');
 }
 if(file==='src/legacy/019.js'){
  s=change(s,'return 1-(1-base)*e;','return NS.V034G4?.civilianRoadFactor?.(w,t,e)??(1-(1-base)*e);','civilian-gradual-road');
  s=s.replaceAll('`${v.id}:${roadLevel(v)}:${[...v.territory].map(id=>{const t=w.map.get(id);return typeEff(t,\'road\')>0?', '`${v.id}:${NS.V034G4?.roadTier?.(v)??roadLevel(v)}:${[...v.territory].map(id=>{const t=w.map.get(id);return typeEff(t,\'road\')>0?');
  s=change(s,'key=`${this.id}:${a}:${b}:${roadLevel(this)}`','key=`${this.id}:${fromId}>${toId}:${NS.V034G4?.roadTier?.(this)??roadLevel(this)}`','internal-path-key');
 }
 if(file==='src/legacy/018.js'){
  s=change(s,'step*=roadFactor(roadLevel(owner));','step*=NS.V034G4?.roadFactor?.(owner)??roadFactor(roadLevel(owner));','legacy-land-route');
  s=change(s,'`${v.id}:${roadLevel(v)}:${[...v.territory].filter(id=>activeRoad(w.map.get(id))).join(\'.\')}`',
   '`${v.id}:${NS.V034G4?.roadTier?.(v)??roadLevel(v)}:${[...v.territory].filter(id=>activeRoad(w.map.get(id))).join(\'.\')}`','legacy-road-signature');
 }
 if(file==='src/legacy/037.js'){
  s=change(s,"'ROADS','ENGINEERING','URBANIZATION','COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'",
   "'ROADS','ROAD_IMPROVEMENT','POSTAL_NETWORK','ENGINEERING','URBANIZATION','COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'",'v26-topology-signature');
  s=change(s,'const a=Math.min(fromId,toId),b=Math.max(fromId,toId),key=`${a}:${b}`;',
   'const key=`${fromId}>${toId}`;', 'v26-directed-cache');
 }
 if(file==='src/legacy/038.js'){
  s=change(s,"'ROADS','ENGINEERING','URBANIZATION','COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'",
   "'ROADS','ROAD_IMPROVEMENT','POSTAL_NETWORK','ENGINEERING','URBANIZATION','COASTAL_NAVIGATION','SEAFARING','OCEAN_NAVIGATION'",'topology-signature');
  s=change(s,'const a=Math.min(fromId,toId),b=Math.max(fromId,toId),key=`${a}:${b}`;', 'const key=`${fromId}>${toId}`;', 'v27-directed-cache');
  s=change(s,'if(v._v27TopoMemo?.day===day)return v._v27TopoMemo.sig;', 'const roadTier=NS.V034G4?.roadTier?.(v)??0;if(v._v27TopoMemo?.day===day&&v._v27TopoMemo.roadTier===roadTier)return v._v27TopoMemo.sig;', 'v27-tech-refresh');
  s=change(s,'v._v27TopoMemo={day,sig};return sig;', 'v._v27TopoMemo={day,sig,roadTier};return sig;', 'v27-memo-key');
 }
 if(file==='src/legacy/126.js'){
  s=change(s,'this.resources.food=Math.min(Number(this.resourceCap?.food||0),Number(this.resources?.food||0)+extra);}}};',
   'this.resources.food=Math.min(Number(this.resourceCap?.food||0),Number(this.resources?.food||0)+extra);}}const g4Extra=NS.V034G4?.hydraulicBonus?.(this,dt)||0;if(g4Extra>0)this.resources.food=Math.min(Number(this.resourceCap?.food||0),Number(this.resources?.food||0)+g4Extra);};','hydraulic-natural-regen');
 }
 return s;
}
