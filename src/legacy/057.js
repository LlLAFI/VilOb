
/* V0.34C1B observational checkpoint after script 49: 초기 군사 인력·장비 */
(function(NS){'use strict';const next=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){const P=NS.V034C1B;if(!P?.isActive(w))return next.call(this,w);
const start=P.now();try{return next.call(this,w);}finally{P.addLayer(w,this,'military32',P.now()-start);}
};})(window.VSim);
