
window.VSim=window.VSim||{};(function(NS){
const TECH={
 AGRICULTURE:{id:'AGRICULTURE',label:'농경',icon:'🌾',cost:95,req:[],branch:'생산',desc:'경작 지식을 체계화해 식량 생산 효율을 높입니다.'},
 CARPENTRY:{id:'CARPENTRY',label:'목공',icon:'🪚',cost:95,req:[],branch:'생산',desc:'목재 가공과 건축 기술을 개선합니다.'},
 MASONRY:{id:'MASONRY',label:'석공',icon:'🧱',cost:110,req:[],branch:'생산',desc:'석재 채취와 석조 건축을 개선합니다.'},
 BARTER:{id:'BARTER',label:'교역 관습',icon:'🤝',cost:90,req:[],branch:'교역',desc:'정기적인 교역 관습이 자리잡아 교역권이 넓어집니다.'},
 RECORD_KEEPING:{id:'RECORD_KEEPING',label:'기록법',icon:'📜',cost:125,req:[],branch:'지식',desc:'경험을 기록해 이후 지식 축적을 빠르게 합니다.'},
 IRRIGATION:{id:'IRRIGATION',label:'관개',icon:'💧',cost:190,req:['AGRICULTURE'],branch:'생산',desc:'평야와 초지의 식량 생산량을 크게 높입니다.'},
 GRANARY:{id:'GRANARY',label:'곡물 저장',icon:'🏚️',cost:175,req:['AGRICULTURE'],branch:'생산',desc:'곡물창고를 건설해 식량 저장 능력을 늘립니다.'},
 QUARRY:{id:'QUARRY',label:'채석장',icon:'⛏️',cost:200,req:['MASONRY'],branch:'생산',desc:'암지와 산악에 채석장을 세워 석재 채취 효율을 높입니다.'},
 CART:{id:'CART',label:'수레',icon:'🛞',cost:200,req:['CARPENTRY','BARTER'],branch:'교역',desc:'육상 운송량과 교역 가능 거리가 증가합니다.'},
 MARKET:{id:'MARKET',label:'시장',icon:'🏪',cost:215,req:['BARTER'],branch:'교역',desc:'시장 건설로 거래량과 가격 탐색 능력을 높입니다.'},
 ROADS:{id:'ROADS',label:'도로',icon:'🛣️',cost:290,req:['CART','MASONRY'],branch:'교역',desc:'정착지 도로망이 지형 이동비와 교역 운송비를 낮춥니다.'},
 CURRENCY:{id:'CURRENCY',label:'화폐제도',icon:'🪙',cost:310,req:['MARKET','RECORD_KEEPING'],branch:'교역',desc:'표준 화폐와 회계로 장거리 거래 수수료가 감소합니다.'},
 SCHOLARSHIP:{id:'SCHOLARSHIP',label:'학술 전통',icon:'📚',cost:350,req:['RECORD_KEEPING'],branch:'지식',desc:'전문 지식인이 등장해 연구 속도를 크게 높입니다.'}
};
const ORDER=['AGRICULTURE','CARPENTRY','MASONRY','BARTER','RECORD_KEEPING','IRRIGATION','GRANARY','QUARRY','CART','MARKET','ROADS','CURRENCY','SCHOLARSHIP'];
NS.TECH=TECH;NS.TECH_ORDER=ORDER;
NS.TechSystem={
 available(v){return ORDER.filter(id=>!v.technologies.has(id)&&TECH[id].req.every(r=>v.technologies.has(r)));},
 choose(v,w){const ids=this.available(v);if(!ids.length)return null;const rr=v.resourceRatios(w),fd=v.foodReserveDays(),tradeNeed=v.tradePressure(w);const score=id=>{let s=TECH[id].cost>160?5:10;if(id==='AGRICULTURE'||id==='IRRIGATION'||id==='GRANARY')s+=Math.max(0,65-fd)*.35+Math.max(0,.45-rr.food)*55;if(id==='CARPENTRY')s+=Math.max(0,.45-rr.wood)*35;if(id==='MASONRY'||id==='QUARRY')s+=Math.max(0,.38-rr.stone)*35;if(['BARTER','CART','MARKET','ROADS','CURRENCY'].includes(id))s+=tradeNeed*28+(NS.AIProfileCompat(v,'tradeDiplomacy')>.5?13:0);if(['RECORD_KEEPING','SCHOLARSHIP'].includes(id))s+=v.population()*.35+8;if(id==='ROADS')s+=Math.max(0,v.territory.size-2)*4;return s+Math.random()*3;};return ids.sort((a,b)=>score(b)-score(a))[0];}
};
})(window.VSim);

