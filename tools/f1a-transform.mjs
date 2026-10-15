// F1A: instrument the two historical overflow SETTER writes at their exact
// call sites. Run-time hook is observer-only; no policy, arguments or RNG moved.
export function f1aTransform(file,source){
 if(file!=='src/legacy/008.js')return source;
 const old='if(this.food>caps.food)this.food-=Math.max(.2,(this.food-caps.food)*.08);this.food=Math.min(this.food,caps.food*1.10);';
 const revised=`if(this.food>caps.food){const __f1aOverflowBefore=NS.V034F1A?.captureOverflow(this,w);this.food-=Math.max(.2,(this.food-caps.food)*.08);NS.V034F1A?.recordOverflow(this,w,__f1aOverflowBefore);}
 const __f1aFoodBeforeCap=this.food,__f1aFoodAfterCap=Math.min(this.food,caps.food*1.10);
 if(__f1aFoodAfterCap<__f1aFoodBeforeCap-1e-9){const __f1aCapBefore=NS.V034F1A?.captureOverflow(this,w);this.food=__f1aFoodAfterCap;NS.V034F1A?.recordOverflow(this,w,__f1aCapBefore);}else this.food=__f1aFoodAfterCap;`;
 if(!source.includes(old))throw Error('F1A legacy overflow transform anchor not found');
 if(source.split(old).length!==2)throw Error('F1A ambiguous overflow transform');
 return source.replace(old,revised);
}
