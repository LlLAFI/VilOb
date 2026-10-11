
/* V0.34C1B observational checkpoint after script 113: AI 우선투자·회복 */
(function(NS){'use strict';const next=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const P=NS.V034C1B;if(!P?.isActive(w))return next.call(this,w);
const start=P.now();try{return next.call(this,w);}finally{P.addLayer(w,this,'aiInvestment33',P.now()-start);}
};})(window.VSim);
