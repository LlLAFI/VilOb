
window.VSim=window.VSim||{};(function(NS){
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[Math.floor(Math.random()*a.length)];
const TERRAIN={
 plain:{label:'평야',passable:true,duration:320,tradeCost:1,cap:{food:[1250,1750],wood:[90,170],stone:[50,110],gold:[0,0]},regen:{food:6.2,wood:.035,stone:.002,gold:0}},
 grass:{label:'초지',passable:true,duration:300,tradeCost:1,cap:{food:[1050,1550],wood:[180,330],stone:[55,125],gold:[0,0]},regen:{food:5.5,wood:.075,stone:.002,gold:0}},
 forest:{label:'숲',passable:true,duration:380,tradeCost:1.3,cap:{food:[520,850],wood:[1650,2350],stone:[75,180],gold:[0,0]},regen:{food:3.4,wood:.55,stone:.003,gold:0}},
 rock:{label:'암지',passable:true,duration:430,tradeCost:1.45,cap:{food:[230,430],wood:[70,150],stone:[1800,2650],gold:[0,0]},regen:{food:1.4,wood:.025,stone:.018,gold:0}},
 mountain:{label:'산',passable:true,duration:540,tradeCost:2.05,cap:{food:[130,280],wood:[140,300],stone:[2350,3350],gold:[0,0]},regen:{food:.8,wood:.045,stone:.022,gold:0}},
 water:{label:'물',passable:false,duration:9999,tradeCost:999,cap:{food:[0,0],wood:[0,0],stone:[0,0],gold:[0,0]},regen:{food:0,wood:0,stone:0,gold:0}}
};
const BUILDINGS={
 town_hall:{label:'회관',icon:'🏛️',capacity:4,maint:.004,storage:{food:40,wood:20,stone:20}},
 house:{label:'주택',icon:'🏠',capacity:3,maint:.0015,storage:{food:10,wood:5,stone:5}},
 storehouse:{label:'창고',icon:'📦',capacity:0,maint:.0025,storage:{food:240,wood:160,stone:160}},
 outpost:{label:'개척 거점',icon:'⛺',capacity:2,maint:.003,storage:{food:55,wood:45,stone:40}},
 palisade:{label:'방책',icon:'🛡️',capacity:0,maint:.0035,storage:{food:0,wood:0,stone:0}},
 granary:{label:'곡물창고',icon:'🌾',capacity:0,maint:.004,storage:{food:180,wood:10,stone:10}},
 market:{label:'시장',icon:'🏪',capacity:0,maint:.006,storage:{food:35,wood:20,stone:15}},
 quarry:{label:'채석장',icon:'⛏️',capacity:0,maint:.0045,storage:{food:0,wood:10,stone:85}},
 road:{label:'도로',icon:'🛣️',capacity:0,maint:.001,storage:{food:0,wood:0,stone:0}},
 farmstead:{label:'경작지',icon:'🌱',capacity:0,maint:.002,storage:{food:35,wood:0,stone:0}}
};
class Tile{
 constructor(id,x,y,terrain){this.id=id;this.x=x;this.y=y;this.terrain=terrain;this.ownerId=null;this.coreVillageId=null;this.ruin=null;this.buildings=[];this.unoccupiedDays=0;this.lastResourceDay=1;const d=TERRAIN[terrain],cap={};for(const k of ['food','wood','stone']){const [a,b]=d.cap[k];cap[k]=rand(a,b);}let gold=0;if(terrain==='rock'&&Math.random()<.24)gold=rand(35,100);if(terrain==='mountain'&&Math.random()<.42)gold=rand(70,180);cap.gold=gold;this.resourceCap=cap;this.resources={food:cap.food*(.72+Math.random()*.26),wood:cap.wood*(.72+Math.random()*.26),stone:cap.stone*(.78+Math.random()*.20),gold:cap.gold*(.85+Math.random()*.15)};}
 syncResources(day){const dt=Math.max(0,day-this.lastResourceDay);if(!dt)return;const rg=TERRAIN[this.terrain].regen;for(const k of ['food','wood','stone','gold']){let gain=rg[k]*dt;if(k==='food'&&this.hasBuilding('farmstead'))gain*=1.35;this.resources[k]=Math.min(this.resourceCap[k],this.resources[k]+gain);}this.lastResourceDay=day;}
 harvest(kind,amount,day){this.syncResources(day);const got=Math.min(Math.max(0,amount),this.resources[kind]||0);this.resources[kind]-=got;return got;}
 ratio(kind,day){this.syncResources(day);const cap=this.resourceCap[kind]||0;return cap>0?this.resources[kind]/cap:0;}
 addBuilding(type){if(!BUILDINGS[type])return false;this.buildings.push(type);return true;}
 hasBuilding(type){return this.buildings.includes(type);}
 serialize(){return{...this};}static from(d){const t=Object.assign(Object.create(Tile.prototype),d);t.buildings=t.buildings||[];t.unoccupiedDays=t.unoccupiedDays||0;t.lastResourceDay=t.lastResourceDay||1;return t;}
}
class TileMap{
 constructor(width=19,height=19){this.width=width;this.height=height;this.tiles=[];this.ruinIds=new Set();this.generate();}
 generate(){const bag=['plain','plain','grass','grass','forest','forest','forest','rock','mountain','water'];for(let y=0;y<this.height;y++)for(let x=0;x<this.width;x++){let t=pick(bag);if((x===0||y===0||x===this.width-1||y===this.height-1)&&Math.random()<.18)t='water';this.tiles.push(new Tile(this.id(x,y),x,y,t));}}
 id(x,y){return y*this.width+x;}at(x,y){return x<0||y<0||x>=this.width||y>=this.height?null:this.tiles[this.id(x,y)];}get(id){return this.tiles[id]||null;}
 neighbors4(id){const t=this.get(id);if(!t)return[];return[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>this.at(t.x+dx,t.y+dy)).filter(Boolean);}
 frontier(ownerId,territoryIds){const set=new Set();for(const id of territoryIds){const t=this.get(id);if(!t)continue;for(const n of this.neighbors4(t.id))if(n.ownerId===null&&TERRAIN[n.terrain].passable)set.add(n.id);}return[...set].map(id=>this.get(id));}
 claim(id,ownerId){const t=this.get(id);if(!t)return false;t.ownerId=ownerId;return true;}
 distance(aId,bId){const a=this.get(aId),b=this.get(bId);return a&&b?Math.abs(a.x-b.x)+Math.abs(a.y-b.y):999;}
 ownedNeighborCount(id,ownerId){return this.neighbors4(id).filter(t=>t.ownerId===ownerId).length;}
 passableTiles(){return this.tiles.filter(t=>TERRAIN[t.terrain].passable);}
 tradePathCost(sourceIds,targetIds,roadOwners=new Set()){
  const targets=new Set(targetIds),dist=new Map(),heap=[];
  const push=(item)=>{heap.push(item);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=item[0])break;heap[i]=heap[p];i=p;}heap[i]=item;};
  const pop=()=>{if(!heap.length)return null;const root=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let l=i*2+1,r=l+1;if(l>=heap.length)break;let c=r<heap.length&&heap[r][0]<heap[l][0]?r:l;if(heap[c][0]>=last[0])break;heap[i]=heap[c];i=c;}heap[i]=last;}return root;};
  for(const id of sourceIds){dist.set(id,0);push([0,id]);}
  while(heap.length){const [d,id]=pop();if(d!==dist.get(id))continue;if(targets.has(id))return d;for(const n of this.neighbors4(id)){if(!TERRAIN[n.terrain].passable)continue;let step=TERRAIN[n.terrain].tradeCost;const road=n.hasBuilding('road')||roadOwners.has(n.ownerId);if(road)step*=.72;const nd=d+step;if(nd<(dist.get(n.id)??Infinity)){dist.set(n.id,nd);push([nd,n.id]);}}}
  return Infinity;
 }
 serialize(){return{width:this.width,height:this.height,tiles:this.tiles.map(t=>t.serialize()),ruinIds:[...this.ruinIds]};}
 static from(d){const m=Object.create(TileMap.prototype);m.width=d.width;m.height=d.height;m.tiles=d.tiles.map(Tile.from);m.ruinIds=new Set(d.ruinIds||m.tiles.filter(t=>t.ruin).map(t=>t.id));return m;}
}
NS.Tile=Tile;NS.TileMap=TileMap;NS.TERRAIN=TERRAIN;NS.BUILDINGS=BUILDINGS;
})(window.VSim);

