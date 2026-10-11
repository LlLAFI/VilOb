
/* V0.34C1B observational checkpoint after script 10: 초기 정착지 핵심 */
(function(NS){'use strict';const next=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const P=NS.V034C1B;if(!P?.isActive(w))return next.call(this,w);
const start=P.now(),D=NS.V034C1D,detail=D?.beginCore?.(w,this);try{return next.call(this,w);}finally{D?.endCore?.(w,this,detail);P.addLayer(w,this,'core07',P.now()-start);}
};})(window.VSim);
