
window.VSim=window.VSim||{};
(function(NS){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const STOCK_KEYS=['food','wood','stone'];
const RES_LABEL={food:'식량',wood:'목재',stone:'석재'};

/* ============================================================
   V0.8 · Logistics + expanded technology
   World > Nation > Settlement > Person
   ============================================================ */

/* ---------- 25-tech tree ---------- */
const NEW_TECHS={
 SURVEYING:{id:'SURVEYING',label:'측량',icon:'📐',cost:260,req:['RECORD_KEEPING'],branch:'개척·행정',desc:'지형을 기록하고 경계를 측정해 개척 계획의 낭비를 줄입니다.',effects:['개척 기본 기간 -10%','중심지에서 멀어질 때 추가되는 개척 기간 감소'],eureka:'첫 외곽 정착지 확보'},
 CROP_ROTATION:{id:'CROP_ROTATION',label:'윤작',icon:'🌿',cost:340,req:['AGRICULTURE','GRANARY'],branch:'생산',desc:'경작 순환을 체계화해 평야와 초지의 장기 식량 생산력을 높입니다.',effects:[],eureka:'경작지 2곳 운영'},
 URBAN_PLANNING:{id:'URBAN_PLANNING',label:'정착지 계획',icon:'📏',cost:390,req:['MASONRY','RECORD_KEEPING'],branch:'도시',desc:'정착지의 도로와 필지를 계획해 같은 타일에 더 많은 주거를 수용합니다.',effects:['타일당 주택 한도 4 → 6'],eureka:'정착지 3곳 보유'},
 FRONTIER_LOGISTICS:{id:'FRONTIER_LOGISTICS',label:'개척 보급술',icon:'🎒',cost:460,req:['SURVEYING','CART'],branch:'개척·행정',desc:'개척대의 식량·장비 보급을 표준화해 장기 원정을 안정시킵니다.',effects:['개척 기간 -15%','개척 지연·보급손실 위험 감소','개척대 일일 식량 소모 -25%'],eureka:'정착지 3곳과 수레 기술 보유'},
 STANDARD_WEIGHTS:{id:'STANDARD_WEIGHTS',label:'도량형',icon:'⚖️',cost:470,req:['CURRENCY','RECORD_KEEPING'],branch:'교역',desc:'무게와 단위를 표준화해 거래 마찰과 운송 손실을 줄입니다.',effects:['교역 운송비 계수 -12%','회당 교역량 +10%'],eureka:'교역 5회 성공'},
 LONG_DISTANCE_TRADE:{id:'LONG_DISTANCE_TRADE',label:'장거리 상단',icon:'🐫',cost:520,req:['CART','MARKET'],branch:'교역',desc:'전문 상단이 먼 지역까지 정기적으로 왕래할 수 있게 됩니다.',effects:['교역 가능 경로 +3','회당 교역량 +20%'],eureka:'교역 12회 성공'},
 ARCHITECTURE:{id:'ARCHITECTURE',label:'건축술',icon:'🏗️',cost:520,req:['CARPENTRY','MASONRY'],branch:'도시',desc:'규격화된 구조와 시공법으로 건설 자재의 낭비를 줄입니다.',effects:['일반 건물 목재·석재 비용 -10%'],eureka:'국가 내 건물 8개 이상'},
 SANITATION:{id:'SANITATION',label:'공중위생',icon:'🧼',cost:600,req:['IRRIGATION','URBAN_PLANNING'],branch:'도시',desc:'깨끗한 물과 위생 관행이 정착되어 질병과 쇠약을 줄입니다.',effects:['질병·쇠약 사망 위험 -30%','건강 회복 보정 증가'],eureka:'인구 25명 이상'},
 ADMINISTRATION:{id:'ADMINISTRATION',label:'행정제도',icon:'📋',cost:620,req:['RECORD_KEEPING','CURRENCY'],branch:'개척·행정',desc:'정착지별 재고와 운송을 기록하여 국가 내부 물류를 효율화합니다.',effects:['국가 내부 물류량 +25%','거리로 인한 내부 물류 효율 감소 완화'],eureka:'정착지 4곳 보유'},
 ENGINEERING:{id:'ENGINEERING',label:'공학',icon:'⚙️',cost:760,req:['ARCHITECTURE','ROADS'],branch:'도시',desc:'도로와 토목 기술을 결합해 험지 건설과 개척 효율을 높입니다.',effects:['도로 목재·석재 비용 -25% 추가','암지·산악 개척 기간 -15%'],eureka:'도로가 설치된 정착지 2곳'},
 URBANIZATION:{id:'URBANIZATION',label:'도시화',icon:'🏙️',cost:800,req:['URBAN_PLANNING','ENGINEERING'],branch:'도시',desc:'고밀도 주거와 체계적 저장시설로 큰 정착지를 유지합니다.',effects:['타일당 주택 한도 6 → 8','창고 저장량 +15%'],eureka:'인구 35명 및 정착지 3곳'},
 EDUCATION:{id:'EDUCATION',label:'교육제도',icon:'🎓',cost:850,req:['SCHOLARSHIP','ADMINISTRATION'],branch:'지식',desc:'지식 전달을 제도화하여 다음 세대의 연구 역량을 높입니다.',effects:['Knowledge 획득 +15%'],eureka:'학술 전통 보유 및 인구 25명'}
};
for(const [id,t] of Object.entries(NEW_TECHS))NS.TECH[id]=t;
for(const id of Object.keys(NEW_TECHS))if(!NS.TECH_ORDER.includes(id))NS.TECH_ORDER.push(id);

/* Existing tech descriptions shown in detail modal. */
const EXISTING_EFFECTS={
 AGRICULTURE:['식량 채취량 +8%'], CARPENTRY:['목재 채취량 +12%'], MASONRY:['석재 채취량 +10%'],
 BARTER:['교역 가능 경로 +1.5','외곽 정착지에 교역소 건설 가능'], RECORD_KEEPING:['Knowledge 획득 +15%'],
 IRRIGATION:['고대 경작지 → 고대 농장 개축 해금'], GRANARY:['곡물창고 해금','곡물창고 식량 저장 +180'],
 QUARRY:['채석장 해금','암지·산 채석장 석재 생산 +22%'], CART:['교역 가능 경로 +3','교역·내부물류 운송량 증가'],
 MARKET:['시장 해금','교역량 +10','교역 운송비 계수 -18%'], ROADS:['도로 해금','도로 타일 경로비 -28%','교역 운송비 계수 -22%'],
 CURRENCY:['교역 운송비 계수 -28%','교역량 +6','교역 가능 경로 +1.7'], SCHOLARSHIP:['Knowledge 획득 +32%']
};
for(const [id,e] of Object.entries(EXISTING_EFFECTS))if(NS.TECH[id])NS.TECH[id].effects=e;

NS.TechSystem.available=function(v){return NS.TECH_ORDER.filter(id=>!v.technologies.has(id)&&NS.TECH[id].req.every(r=>v.technologies.has(r)));};
NS.TechSystem.choose=function(v,w){
 const ids=this.available(v);if(!ids.length)return null;
 const rr=v.resourceRatios(w),fd=v.foodReserveDays(),trade=v.tradePressure(w),pop=v.population(),sett=v.territory.size;
 const score=id=>{let s=12-Math.min(7,NS.TECH[id].cost/220);
  if(['AGRICULTURE','IRRIGATION','GRANARY','CROP_ROTATION'].includes(id))s+=Math.max(0,55-fd)*.32+Math.max(0,.35-rr.food)*40;
  if(['CARPENTRY','ARCHITECTURE'].includes(id))s+=Math.max(0,.35-rr.wood)*25+sett*1.3;
  if(['MASONRY','QUARRY','ENGINEERING','ADVANCED_FORGING'].includes(id))s+=Math.max(0,.30-rr.stone)*28+sett;
  if(['BARTER','CART','MARKET','ROADS','CURRENCY','STANDARD_WEIGHTS','LONG_DISTANCE_TRADE'].includes(id))s+=trade*23+(NS.AIProfileCompat(v,'tradeDiplomacy')>.5?12:0)+(v.tradeStats?.count||0)*.12;
  if(['RECORD_KEEPING','SCHOLARSHIP','EDUCATION'].includes(id))s+=pop*.24+7;
  if(['SURVEYING','FRONTIER_LOGISTICS','ADMINISTRATION','BUREAUCRACY'].includes(id))s+=sett*4+(NS.AIProfileCompat(v,'territorialExpansion')>.5?8:0);
  if(['URBAN_PLANNING','SANITATION','URBANIZATION'].includes(id))s+=Math.max(0,pop-18)*.45+sett*2;
  return s+Math.random()*3;
 };
 return ids.sort((a,b)=>score(b)-score(a))[0];
};

/* ---------- tech state, eurekas, diffusion ---------- */
function ensureV08Nation(v,w){
 v._world=w;v.eurekaClaimed=v.eurekaClaimed||[];if(v.eurekaClaimed instanceof Set===false)v.eurekaClaimed=new Set(v.eurekaClaimed);
 v.eurekaBank=v.eurekaBank||{};v.diffusionReceived=v.diffusionReceived||{};
 v.logisticsStats=v.logisticsStats||{moves:0,foodMoved:0};
 if(!Number.isFinite(v.logisticsStats.woodMoved))v.logisticsStats.woodMoved=0;
 if(!Number.isFinite(v.logisticsStats.stoneMoved))v.logisticsStats.stoneMoved=0;
 syncStorageTech(v,w);
}
function syncStorageTech(v,w){for(const id of v.territory){const t=w.map.get(id);if(t)t._v08UrbanStorage=!!v.hasTech('URBANIZATION');}}
function maybeFinishResearch(v,w){
 let guard=0;
 while(v.researchTarget&&guard++<4){const tech=NS.TECH[v.researchTarget];if(!tech||v.researchProgress+1e-9<tech.cost)break;
  v.researchProgress-=tech.cost;v.technologies.add(tech.id);const done=tech.id;v.researchTarget=null;syncStorageTech(v,w);
  w.log(`${v.name}이(가) 기술 「${tech.label}」 연구를 완료했습니다.`,true,'TECH_COMPLETED',{village:v.name,techId:done,tech:tech.label,totalKnowledge:+v.totalKnowledge.toFixed(1)});
  v.selectResearch(w,true);
 }
}
NS.Village.prototype.knowledgeMultiplier=function(){let m=1;if(this.hasTech('RECORD_KEEPING'))m*=1.15;if(this.hasTech('SCHOLARSHIP'))m*=1.32;if(this.hasTech('EDUCATION'))m*=1.15;return m;};
NS.Village.prototype.selectResearch=function(w,announce=true){
 if(this.researchTarget||this.technologies.size>=NS.TECH_ORDER.length)return;
 const id=NS.TechSystem.choose(this,w);if(!id)return;this.researchTarget=id;
 const bonus=Math.min(NS.TECH[id].cost*.25,Number(this.eurekaBank?.[id]||0));if(bonus>0){this.researchProgress+=bonus;delete this.eurekaBank[id];}
 if(announce)w.log(`${this.name}이(가) 「${NS.TECH[id].label}」 연구를 시작했습니다.`,false,'TECH_STARTED',{village:this.name,techId:id,tech:NS.TECH[id].label,cost:NS.TECH[id].cost,eurekaApplied:+bonus.toFixed(1)});
 maybeFinishResearch(this,w);
};
NS.Village.prototype.gainKnowledge=function(amount,w,source='생활'){
 if(this.status!=='active')return;ensureV08Nation(this,w);const n=amount*this.knowledgeMultiplier();this.totalKnowledge+=n;this.knowledgeBySource[source]=(this.knowledgeBySource[source]||0)+n;
 if(!this.researchTarget)this.selectResearch(w,false);if(!this.researchTarget)return;this.researchProgress+=n;maybeFinishResearch(this,w);
};
NS.Village.prototype.grantEureka=function(id,w){
 if(!NS.TECH[id]||this.technologies.has(id)||this.eurekaClaimed.has(id))return false;this.eurekaClaimed.add(id);const amount=NS.TECH[id].cost*.25;
 if(this.researchTarget===id){this.researchProgress+=amount;maybeFinishResearch(this,w);}else this.eurekaBank[id]=(this.eurekaBank[id]||0)+amount;
 w.log(`${this.name}이(가) 「${NS.TECH[id].label}」 연구 촉진 조건을 달성했습니다.`,false,'TECH_EUREKA',{village:this.name,techId:id,tech:NS.TECH[id].label,bonus:+amount.toFixed(1)});return true;
};
NS.Village.prototype.checkEurekas=function(w){
 const buildings=type=>this.buildingCount(w,type),totalBuildings=()=>[...this.territory].reduce((a,id)=>a+(w.map.get(id)?.buildings?.length||0),0);
 if(this.territory.size>=2)this.grantEureka('SURVEYING',w);
 if(buildings('farmstead')>=2)this.grantEureka('CROP_ROTATION',w);
 if(this.territory.size>=3)this.grantEureka('URBAN_PLANNING',w);
 if(this.territory.size>=3&&this.hasTech('CART'))this.grantEureka('FRONTIER_LOGISTICS',w);
 if((this.tradeStats?.count||0)>=5)this.grantEureka('STANDARD_WEIGHTS',w);
 if((this.tradeStats?.count||0)>=12)this.grantEureka('LONG_DISTANCE_TRADE',w);
 if(totalBuildings()>=8)this.grantEureka('ARCHITECTURE',w);
 if(this.population()>=25)this.grantEureka('SANITATION',w);
 if(this.territory.size>=4)this.grantEureka('ADMINISTRATION',w);
 if(buildings('road')>=2)this.grantEureka('ENGINEERING',w);
 if(this.population()>=35&&this.territory.size>=3)this.grantEureka('URBANIZATION',w);
 if(this.hasTech('SCHOLARSHIP')&&this.population()>=25)this.grantEureka('EDUCATION',w);
};

/* ---------- settlement storage ---------- */
function baseCaps(t){let c={food:45,wood:30,stone:25};for(const b of t?.buildings||[]){const s=NS.BUILDINGS[b]?.storage||{};for(const k of STOCK_KEYS){let q=s[k]||0;if(b==='warehouse'&&t._v08UrbanStorage)q*=1.15;c[k]+=q;}}return c;}
NS.V06.capsForTile=baseCaps;NS.settlementCaps=baseCaps;
NS.Village.prototype.settlementCaps=function(tileId){const t=this._world?.map.get(tileId);return t?baseCaps(t):{food:0,wood:0,stone:0};};
NS.Village.prototype.storageCaps=function(){let c={food:0,wood:0,stone:0};for(const id of this.territory){const t=this._world?.map.get(id);if(!t)continue;const q=baseCaps(t);for(const k of STOCK_KEYS)c[k]+=q[k];}return c;};
NS.Village.prototype.depositAt=function(tileId,k,amount){const t=this._world?.map.get(tileId);if(!t)return 0;t.stocks=t.stocks||{food:0,wood:0,stone:0};const cap=baseCaps(t)[k],room=Math.max(0,cap-(t.stocks[k]||0)),put=Math.min(room,Math.max(0,amount));t.stocks[k]=(t.stocks[k]||0)+put;return put;};

/* ---------- house limits ---------- */
NS.Village.prototype.houseLimit=function(){if(this.hasTech('URBANIZATION'))return 8;if(this.hasTech('URBAN_PLANNING'))return 6;return 4;};

/* ---------- construction costs ---------- */
const BUILD_COSTS={
 house:{wood:18,stone:6,gold:0},farmstead:{wood:12,stone:2,gold:0},granary:{wood:20,stone:8,gold:0},warehouse:{wood:30,stone:16,gold:0},
 trading_post:{wood:24,stone:10,gold:6},market:{wood:28,stone:12,gold:10},quarry:{wood:16,stone:6,gold:0},road:{wood:4,stone:6,gold:0},palisade:{wood:18,stone:8,gold:0},
 expansion:{wood:28,stone:8,food:18,gold:0}
};
function effectiveCost(v,type){const raw={...(BUILD_COSTS[type]||{})};let mult=v.hasTech('ARCHITECTURE') ? .90 : 1;if(type==='road'&&v.hasTech('ENGINEERING'))mult*=.75;for(const k of ['wood','stone'])if(raw[k])raw[k]=Math.max(1,Math.round(raw[k]*mult*10)/10);return raw;}
NS.V08={BUILD_COSTS,effectiveCost,capsForTile:baseCaps};

/* ---------- route-aware internal logistics ---------- */
function internalPathCost(w,v,fromId,toId){
 if(fromId===toId)return 0;const targets=new Set([toId]),dist=new Map([[fromId,0]]),heap=[[0,fromId]];
 const push=x=>{heap.push(x);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p][0]<=x[0])break;heap[i]=heap[p];i=p;}heap[i]=x;};
 const pop=()=>{const root=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let l=i*2+1,r=l+1;if(l>=heap.length)break;let c=r<heap.length&&heap[r][0]<heap[l][0]?r:l;if(heap[c][0]>=last[0])break;heap[i]=heap[c];i=c;}heap[i]=last;}return root;};
 while(heap.length){const [d,id]=pop();if(d!==dist.get(id))continue;if(targets.has(id))return d;for(const n of w.map.neighbors4(id)){if(n.ownerId!==v.id||!NS.TERRAIN[n.terrain].passable)continue;let step=NS.TERRAIN[n.terrain].tradeCost;if(n.hasBuilding('road'))step*=.72;const nd=d+step;if(nd<(dist.get(n.id)??Infinity)){dist.set(n.id,nd);push([nd,n.id]);}}}
 return Infinity;
}
function logisticsCapacity(v,w,fromId,toId,resource='food',construction=false){
 const cost=internalPathCost(w,v,fromId,toId);if(!Number.isFinite(cost))return{cost,capacity:0};
 let base={food:14,wood:12,stone:10}[resource]||10;if(v.hasTech('CART'))base+={food:8,wood:6,stone:5}[resource];
 if(v.hasTech('ADMINISTRATION'))base*=1.25;let penalty=v.hasTech('ADMINISTRATION') ? .075 : .10;
 let eff=1/(1+Math.max(0,cost-1)*penalty);const srcPop=Math.max(1,v.tileResidents(fromId).length);eff*=clamp(.75+srcPop*.05,.8,1.35);
 if(construction)base*=1.45;return{cost,capacity:Math.max(1.5,base*eff)};
}
NS.Village.prototype.internalPathCost=function(fromId,toId){return internalPathCost(this._world,this,fromId,toId);};
NS.Village.prototype.internalLogisticsCapacity=function(fromId,toId,resource='food',construction=false){return logisticsCapacity(this,this._world,fromId,toId,resource,construction);};

NS.World.prototype.processInternalLogistics=function(){
 for(const v of this.activeVillages){ensureV08Nation(v,this);const occupied=[...v.territory].filter(id=>v.tileResidents(id).length);if(occupied.length<2)continue;
  for(const rid of occupied){const rdays=v.settlementReserveDays(rid);if(rdays>=24)continue;
   const donorRows=occupied.filter(id=>id!==rid&&v.settlementReserveDays(id)>55).map(id=>({id,...logisticsCapacity(v,this,id,rid,'food',false),days:v.settlementReserveDays(id)})).filter(x=>x.capacity>0).sort((a,b)=>(b.days-a.days)||a.cost-b.cost);
   if(!donorRows.length)continue;const d=donorRows[0],donor=v.stockAt(d.id,'food'),needPop=v.tileResidents(rid).length,need=Math.max(0,needPop*.36*38-v.stockAt(rid,'food')),surplus=Math.max(0,donor-v.tileResidents(d.id).length*.36*45),qty=Math.min(d.capacity,need,surplus);if(qty<1)continue;
   const {put}=NS.V034D3A.transferWithReturn(v,d.id,rid,'food',qty);
   v.logisticsStats.moves++;v.logisticsStats.foodMoved+=put;if(put>=3)this.telemetry.record('INTERNAL_LOGISTICS',this,{village:v.name,resource:'food',qty:+put.toFixed(1),fromTileId:d.id,toTileId:rid,routeCost:+d.cost.toFixed(2),capacity:+d.capacity.toFixed(2)});
  }
 }
};

/* Plan instant-but-capacity-limited material transport for construction. */
function planResource(v,w,targetId,k,need){
 let remaining=need,plan=[];const local=Math.min(remaining,v.stockAt(targetId,k));if(local>0){plan.push([targetId,local,0]);remaining-=local;}
 const donors=[...v.territory].filter(id=>id!==targetId&&v.stockAt(id,k)>0).map(id=>({id,...logisticsCapacity(v,w,id,targetId,k,true),stock:v.stockAt(id,k)})).filter(x=>x.capacity>0).sort((a,b)=>a.cost-b.cost);
 for(const d of donors){if(remaining<=1e-9)break;const q=Math.min(remaining,d.stock,d.capacity);if(q>0){plan.push([d.id,q,d.cost]);remaining-=q;}}
 return{ok:remaining<=1e-6,plan,missing:remaining};
}
NS.Village.prototype.payBuild=function(tileId,cost){
 const w=this._world;if(!w||!this.territory.has(tileId))return false;if(this.gold+1e-9<(cost.gold||0))return false;const plans={};
 for(const k of STOCK_KEYS){const need=cost[k]||0;if(!need)continue;const p=planResource(this,w,tileId,k,need);if(!p.ok)return false;plans[k]=p;}
 this.gold-=cost.gold||0;for(const [k,p] of Object.entries(plans))for(const [id,q] of p.plan){const took=this.withdrawAt(id,k,q);if(id!==tileId&&took>0){this.logisticsStats.moves++;this.logisticsStats[k==='food'?'foodMoved':k==='wood'?'woodMoved':'stoneMoved']+=took;}}
 return true;
};

/* ---------- construction behavior ---------- */
NS.Village.prototype.buildHouse=function(w){const tiles=[...this.territory].map(id=>w.map.get(id)).filter(t=>t&&this.houseCount(t.id)<this.houseLimit(t.id));if(!tiles.length)return false;tiles.sort((a,b)=>{const ac=a.buildings.reduce((n,x)=>n+(NS.BUILDINGS[x]?.capacity||0),0),bc=b.buildings.reduce((n,x)=>n+(NS.BUILDINGS[x]?.capacity||0),0);return this.tileResidents(b.id).length/Math.max(1,bc)-this.tileResidents(a.id).length/Math.max(1,ac);});const t=tiles[0],cost=effectiveCost(this,'house');if(!this.payBuild(t.id,cost))return false;t.addBuilding('house');w.log(`${this.name}의 ${this.settlementLabel(t.id)}에 새 주택이 건설되었습니다.`,false,'BUILDING_BUILT',{nation:this.name,village:this.name,tileId:t.id,building:'house',cost,houseCount:this.houseCount(t.id),houseLimit:this.houseLimit(t.id)});return true;};
NS.Village.prototype.buildDefense=function(w){const core=w.map.get(this.coreTileId);if(!core||core.buildings.filter(x=>x==='palisade').length>=4)return false;const cost=effectiveCost(this,'palisade');if(!this.payBuild(core.id,cost))return false;core.addBuilding('palisade');w.log(`${this.name}이(가) 중심지 방책을 보강했습니다.`,false,'BUILDING_BUILT',{village:this.name,tileId:core.id,building:'palisade',cost});return true;};
NS.Village.prototype.autoInfrastructure=function(w){
 const core=w.map.get(this.coreTileId),build=(tile,type)=>{if(!tile||tile.hasBuilding(type))return false;const cost=effectiveCost(this,type);if(!this.payBuild(tile.id,cost))return false;tile.addBuilding(type);w.log(`${this.name}이(가) (${tile.x},${tile.y})에 ${NS.BUILDINGS[type].label}을(를) 건설했습니다.`,false,'BUILDING_BUILT',{village:this.name,tileId:tile.id,building:type,cost});return true;};
 if(this.hasTech('AGRICULTURE')){const t=[...this.territory].map(id=>w.map.get(id)).find(t=>['plain','grass'].includes(t.terrain)&&!t.hasBuilding('farmstead'));if(t&&build(t,'farmstead'))return;}
 if(this.hasTech('GRANARY')&&this.food>this.storageCaps(w).food*.55)if(build(core,'granary'))return;
 if(this.hasTech('MARKET'))if(build(core,'market'))return;
 if(this.hasTech('QUARRY')){const t=[...this.territory].map(id=>w.map.get(id)).find(t=>['rock','mountain'].includes(t.terrain)&&!t.hasBuilding('quarry'));if(t&&build(t,'quarry'))return;}
 if(this.hasTech('ROADS')&&this.territory.size>1){const t=[...this.territory].map(id=>w.map.get(id)).find(t=>t.id!==this.coreTileId&&!t.hasBuilding('road'));if(t)build(t,'road');}
};
NS.Village.prototype.developSettlements=function(w){
 for(const id of this.territory){const t=w.map.get(id),pop=this.tileResidents(id).length;if(!t||!pop)continue;const cap=t.buildings.reduce((a,b)=>a+(NS.BUILDINGS[b]?.capacity||0),0);
  if(pop>=Math.max(2,cap-1)&&this.houseCount(id)<this.houseLimit(id)&&!this.expansionProject){const cost=effectiveCost(this,'house');if(this.payBuild(id,cost)){t.addBuilding('house');w.log(`${this.name}의 ${this.settlementLabel(id)}에 주택이 건설되었습니다.`,false,'BUILDING_BUILT',{nation:this.name,tileId:id,building:'house',cost,houseCount:this.houseCount(id),houseLimit:this.houseLimit(id)});}}
  const c=baseCaps(t),nearFull=Math.max(t.stocks.food/c.food,t.stocks.wood/c.wood,t.stocks.stone/c.stone)>.78;
  if(nearFull&&!t.hasBuilding('warehouse')){const cost=effectiveCost(this,'warehouse');if(this.payBuild(id,cost)){t.addBuilding('warehouse');w.log(`${this.name}의 ${this.settlementLabel(id)}에 창고가 건설되었습니다.`,false,'BUILDING_BUILT',{nation:this.name,tileId:id,building:'warehouse',cost});}}
  if(id!==this.coreTileId&&pop>=3&&this.hasTech('BARTER')&&!t.hasBuilding('trading_post')){const cost=effectiveCost(this,'trading_post');if(this.payBuild(id,cost)){t.addBuilding('trading_post');w.log(`${this.name}의 ${this.settlementLabel(id)}에 교역소가 문을 열었습니다.`,true,'BUILDING_BUILT',{nation:this.name,tileId:id,building:'trading_post',cost});}}
 }
};

/* ---------- expansion ---------- */
const EXP_DURATION={grass:190,plain:210,forest:250,rock:290,mountain:360};
NS.Village.prototype.startExpansion=function(w){
 if(this.expansionProject)return false;if(this.population()<9||this.foodReserveDays()<24)return false;const adults=this.availableSettlers().sort((a,b)=>(b.skills.building+b.skills.hunting)-(a.skills.building+a.skills.hunting));if(adults.length<2||this.population()<=this.territory.size+5)return false;const cand=this.expansionCandidates(w)[0];if(!cand)return false;
 const cost=effectiveCost(this,'expansion');if(!this.payBuild(this.coreTileId,cost))return false;const t=cand.tile,pioneers=adults.slice(0,2);for(const p of pioneers)p.assignment='PIONEER';let duration=EXP_DURATION[t.terrain]||320;duration+=Math.max(0,cand.d-1)*(this.hasTech('SURVEYING')?12:18);if(this.hasTech('SURVEYING'))duration*=.90;if(this.hasTech('FRONTIER_LOGISTICS'))duration*=.85;if(this.hasTech('ENGINEERING')&&['rock','mountain'].includes(t.terrain))duration*=.85;if(t.ruin)duration=Math.max(120,duration*.70);
 this.expansionProject={targetTileId:t.id,startDay:w.ordinalDay(),progress:0,duration:Math.round(duration),pioneerIds:pioneers.map(p=>p.id),lastRiskCheck:w.ordinalDay(),stallDays:0,events:0};
 w.log(`${this.name}이(가) 중심지와 가까운 (${t.x},${t.y}) ${NS.TERRAIN[t.terrain].label} 개척을 시작했습니다.`,true,'EXPANSION_STARTED',{village:this.name,targetTileId:t.id,terrain:t.terrain,duration:this.expansionProject.duration,pioneers:pioneers.map(p=>p.name),distance:cand.d,adjacentOwned:cand.adj,ruin:!!t.ruin,cost});return true;
};
NS.Village.prototype.expansionRisk=function(w,pioneers,t){
 const good=this.hasTech('FRONTIER_LOGISTICS'),r=Math.random();const d1=good ? .09 : .13,d2=d1+(good ? .05 : .08),d3=d2+(good ? .045 : .06),d4=d3+(good ? .003 : .005);
 if(r<d1){const loss=rand(good ? 6 : 9,good ? 15 : 22);this.expansionProject.progress=Math.max(0,this.expansionProject.progress-loss);this.expansionProject.events++;w.telemetry.record('EXPANSION_EVENT',w,{village:this.name,type:'DELAY',loss,targetTileId:t.id});}
 else if(r<d2){this.withdrawAt(this.coreTileId,'food',rand(good ? 2 : 4,good ? 5 : 8));this.withdrawAt(this.coreTileId,'wood',rand(1,good ? 3 : 5));this.expansionProject.events++;w.telemetry.record('EXPANSION_EVENT',w,{village:this.name,type:'SUPPLY_LOSS',targetTileId:t.id});}
 else if(r<d3){const p=pioneers[Math.floor(Math.random()*pioneers.length)],dmg=rand(good ? 4 : 6,good ? 10 : 14);p.health=Math.max(1,p.health-dmg);this.expansionProject.events++;w.telemetry.record('EXPANSION_EVENT',w,{village:this.name,type:'INJURY',person:p.name,damage:dmg,targetTileId:t.id});}
 else if(r<d4){const p=pioneers[Math.floor(Math.random()*pioneers.length)];p.alive=false;this.expansionProject.events++;w.log(`${this.name} 개척대의 ${p.name}이(가) 사고로 사망했습니다.`,true,'DEATH_EXPANSION',{village:this.name,person:p.name,targetTileId:t.id});}
};
const progress07=NS.Village.prototype.progressExpansion;
NS.Village.prototype.progressExpansion=function(w){const p=this.expansionProject;if(!p)return;const beforeFood=this.stockAt(this.coreTileId,'food');progress07.call(this,w);if(p&&this.hasTech('FRONTIER_LOGISTICS')){const after=this.stockAt(this.coreTileId,'food'),used=Math.max(0,beforeFood-after);if(used>0)this.depositAt(this.coreTileId,'food',used*.25);}};

/* ---------- production effects ---------- */
const harvest07=NS.Village.prototype.harvestMultiplier;
NS.Village.prototype.harvestMultiplier=function(kind,t){return harvest07.call(this,kind,t);};
const tradeRange07=NS.Village.prototype.tradeRange;
NS.Village.prototype.tradeRange=function(w){let r=tradeRange07.call(this,w);if(this.hasTech('LONG_DISTANCE_TRADE'))r+=3;return r;};
const merchant07=NS.Village.prototype.merchantCapacity;
NS.Village.prototype.merchantCapacity=function(){let q=merchant07.call(this);if(this.hasTech('STANDARD_WEIGHTS'))q*=1.10;if(this.hasTech('LONG_DISTANCE_TRADE'))q*=1.20;return q;};
const fee07=NS.Village.prototype.tradeFeeMultiplier;
NS.Village.prototype.tradeFeeMultiplier=function(){let m=fee07.call(this);if(this.hasTech('STANDARD_WEIGHTS'))m*=.88;return m;};

/* ---------- population: woman-level birth + cooldown ---------- */
const age07=NS.Person.prototype.ageOneYear;
NS.Person.prototype.ageOneYear=function(w,v){
 this.age++;const ageRisk=this.age>68?Math.min(.45,(this.age-67)*.015):0,baseHealth=this.health<35?(35-this.health)*.003:0,healthRisk=baseHealth*(v.hasTech('SANITATION') ? .70 : 1),r=Math.random();
 if(r<ageRisk){this.alive=false;w.log(`${v.name}의 ${this.name}이(가) ${this.age}세로 노환으로 세상을 떠났습니다.`,true,'DEATH_OLD_AGE',{village:v.name,person:this.name,age:this.age,homeTileId:this.homeTileId});return;}
 if(r<ageRisk+healthRisk){this.alive=false;const code=this.hunger>75?'DEATH_STARVATION':'DEATH_ILLNESS',reason=code==='DEATH_STARVATION'?'영양실조':'질병과 쇠약';w.log(`${v.name}의 ${this.name}이(가) ${reason}으로 세상을 떠났습니다.`,true,code,{village:v.name,person:this.name,age:this.age,health:this.health,hunger:this.hunger,homeTileId:this.homeTileId});}
};
const metabolism07=NS.Person.prototype.metabolism;
NS.Person.prototype.metabolism=function(v,w,worked=true){metabolism07.call(this,v,w,worked);if(v.hasTech('SANITATION')&&this.alive&&this.health<86&&this.hunger<70)this.health=Math.min(100,this.health+.012);};
NS.Village.prototype.yearlyTick=function(w){
 this.residents.filter(p=>p.alive).forEach(p=>p.ageOneYear(w,this));this.residents=this.residents.filter(p=>p.alive);const men=this.residents.filter(p=>p.alive&&p.sex==='남'&&p.age>=18&&p.age<=50);if(!men.length)return;
 const now=w.ordinalDay(),women=this.residents.filter(p=>p.alive&&p.sex==='여'&&p.age>=18&&p.age<=40&&(p.birthCooldownUntilDay||-9999)<=now).sort(()=>Math.random()-.5);
 for(const mother of women){if(this.capacity(w)<=this.population())break;let home=mother.homeTileId??this.bestBirthTile(w),localCap=w.map.get(home)?.buildings.reduce((s,b)=>s+(NS.BUILDINGS[b]?.capacity||0),0)||0,localPop=this.tileResidents(home).length;if(localPop>=localCap)home=this.bestBirthTile(w);const localDays=this.settlementReserveDays(home),fd=this.foodReserveDays();let chance=fd>50?.17:fd>30?.12:fd>18?.06:.015;if(localDays<18)chance*=.35;if(mother.health<55)chance*=.55;if(mother.happiness<45)chance*=.70;if(this.hasTech('SANITATION'))chance*=1.05;if(Math.random()>=chance)continue;
  const father=men[Math.floor(Math.random()*men.length)],b=new NS.Person(this.id,`baby-${now}-${Math.random()}`,{age:0,job:'아이',health:91,hunger:14,energy:80,homeTileId:home,familyName:father?.familyName||mother.familyName,motherId:mother.id,fatherId:father?.id||null});b.currentAction='가족의 보호를 받고 있음';this.residents.push(b);mother.birthCooldownUntilDay=now+200;w.log(`${this.name}의 (${w.map.get(home).x},${w.map.get(home).y}) 정착지에서 ${b.name}이(가) 태어났습니다.`,true,'BIRTH',{village:this.name,person:b.name,homeTileId:home,mother:mother.name,father:father?.name||null});
 }
};

/* ---------- eurekas check each season ---------- */
const seasonal07=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){seasonal07.call(this,w);this.checkEurekas(w);syncStorageTech(this,w);};

/* ---------- trade diffusion ---------- */
const executeTrade07=NS.World.prototype.executeTrade;
NS.World.prototype.executeTrade=function(d){const ok=executeTrade07.call(this,d);if(!ok)return false;for(const [learner,teacher] of [[d.buyer,d.seller],[d.seller,d.buyer]]){ensureV08Nation(learner,this);const id=learner.researchTarget;if(!id||!teacher.technologies.has(id))continue;const tech=NS.TECH[id],cap=tech.cost*.12,used=learner.diffusionReceived[id]||0,grant=Math.min(tech.cost*.02,cap-used);if(grant<=0)continue;learner.diffusionReceived[id]=used+grant;learner.researchProgress+=grant;this.telemetry.record('TECH_DIFFUSION',this,{village:learner.name,from:teacher.name,techId:id,tech:tech.label,bonus:+grant.toFixed(1),received:+learner.diffusionReceived[id].toFixed(1)});maybeFinishResearch(learner,this);}return true;};

/* ---------- AI: expansion no longer depends on construction Gold ---------- */
const scores07=NS.VillageBrain.prototype.baseScores;
NS.VillageBrain.prototype.baseScores=function(v,w){const s=scores07.call(this,v,w);if(v.gold<10)s.EXPAND+=25;if(v.hasTech('SURVEYING'))s.EXPAND+=2;if(v.hasTech('FRONTIER_LOGISTICS'))s.EXPAND+=3;return s;};

/* ---------- V0.8 attach / serialization ---------- */
function attachV08World(w){NS.V07.attachWorld(w,false);for(const v of w.villages)ensureV08Nation(v,w);return w;}
NS.V08.attachWorld=attachV08World;
const serializeV07=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=serializeV07.call(this);d.eurekaClaimed=[...(this.eurekaClaimed||[])];d.eurekaBank=this.eurekaBank||{};d.diffusionReceived=this.diffusionReceived||{};return d;};
const worldSerialize07=NS.World.prototype.serialize,worldFrom07=NS.World.from;
NS.World.prototype.serialize=function(){const d=worldSerialize07.call(this);d.version='0.8';d.v08={logistics:'route-capacity',techCount:NS.TECH_ORDER.length};return d;};
NS.World.from=function(d){if(!['0.7','0.8'].includes(d.version))throw new Error('V0.7 또는 V0.8 세이브만 불러올 수 있습니다.');const source=d.version,w=worldFrom07({...d,version:'0.7'});if(source==='0.8')for(let i=0;i<w.villages.length;i++){const src=d.villages?.[i]||{};w.villages[i].eurekaClaimed=new Set(src.eurekaClaimed||[]);w.villages[i].eurekaBank=src.eurekaBank||{};w.villages[i].diffusionReceived=src.diffusionReceived||{};for(const p of w.villages[i].residents){const sp=(src.residents||[]).find(x=>x.id===p.id);if(sp&&sp.birthCooldownUntilDay!=null)p.birthCooldownUntilDay=sp.birthCooldownUntilDay;}}return attachV08World(w);};

/* ---------- telemetry ---------- */
const snap07=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,reason='AUTO',note=''){const s=snap07.call(this,w,reason,note);s.global.techCount=NS.TECH_ORDER.length;s.global.logisticsMode='distance-terrain-road-capacity';for(const r of s.villages){const v=w.villages.find(x=>x.id===r.id);if(!v)continue;r.logisticsWoodMoved=+(v.logisticsStats?.woodMoved||0).toFixed(2);r.logisticsStoneMoved=+(v.logisticsStats?.stoneMoved||0).toFixed(2);r.eurekas=(v.eurekaClaimed?.size||0);}return s;};
const json07=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=json07.call(this,w);d.version='0.8';d.worldSummary.techCount=NS.TECH_ORDER.length;d.worldSummary.internalLogistics='route-cost affects capacity; no travel time yet';return d;};

/* ---------- Save system ---------- */
(function(){const KEY8='village-observer-v0-8',KEY7='village-observer-v0-7';function dl(name,text,type='application/json'){const blob=new Blob([text],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}NS.SaveSystem={save(w){localStorage.setItem(KEY8,JSON.stringify(w.serialize()));},load(){const r=localStorage.getItem(KEY8)||localStorage.getItem(KEY7);return r?NS.World.from(JSON.parse(r)):null;},export(w){dl(`village-observer-v08-save-${w.year}y.json`,JSON.stringify(w.serialize(),null,2));},exportDevJSON(w){dl(`village-observer-v08-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w),null,2));},exportDevCSV(w){dl(`village-observer-v08-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV(),'text/csv;charset=utf-8');},async import(file){return NS.World.from(JSON.parse(await file.text()));}};})();

/* ---------- UI additions ---------- */
if(NS.UI){
 const oldHeader=NS.UI.prototype.renderHeader,oldOpen=NS.UI.prototype.openTech,oldEconomy=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.setWorld=function(w){this.stop();this.world=attachV08World(w);this.render();};
 NS.UI.prototype.renderHeader=function(){oldHeader.call(this);this.q('runtimeStatus').textContent='✓ V0.8 거리·지형 물류 / 25기술 / 개척 밸런스 작동 중';};
 NS.UI.prototype.openTech=function(id,v){oldOpen.call(this,id,v);const t=NS.TECH[id],body=this.q('techModalBody');if(t?.eureka){const div=document.createElement('div');div.className='info';div.style.marginTop='7px';const claimed=v.eurekaClaimed?.has?.(id);div.innerHTML=`<strong>연구 촉진</strong><br>${t.eureka}${claimed?' · ✓ 달성':''}<div class="small muted">달성 시 연구비의 25%가 즉시 또는 예약 보너스로 적용됩니다.</div>`;body.appendChild(div);}};
 const baseRender=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderVillageContent=function(){baseRender.call(this);if(this.sub!=='economy')return;const v=this.world.selectedNation,el=this.q('villageContent');if(!v)return;const note=document.createElement('div');note.className='v08-logistics-note';note.innerHTML='<strong>🚚 내부 물류</strong><div class="small muted">5일마다 식량 부족 정착지를 자동 보급합니다. 거리·지형·실제 도로·공급지 인구에 따라 한 번에 운송할 수 있는 양이 달라집니다. 건설용 목재·석재도 같은 운송 한도를 적용하지만 운송 시간은 아직 계산하지 않습니다.</div>';el.appendChild(note);};
}

/* CSS marker */
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent='.v08-logistics-note{margin-top:14px;padding:12px;border:1px solid rgba(120,180,255,.22);border-radius:12px;background:rgba(70,125,190,.08)}';document.head.appendChild(style);}

})(window.VSim);

