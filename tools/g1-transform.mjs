// V0.34G1: read-only probes at existing E2 food-relay decision points.
// Keep the immutable 0.34C1H legacy manifest and all food decisions unchanged.
const inject=(src,anchor,extra,label)=>{
  const count=src.split(anchor).length-1;
  if(count!==1)throw new Error(`G1 probe anchor ${label}: expected 1, found ${count}`);
  return src.replace(anchor,anchor+extra);
};
export function g1Transform(file,source){
 if(file!=='src/legacy/069.js')return source;
 let s=source;
 const indexReturn='return{states,donors24,donors30};';
 s=inject(s,indexReturn,'', 'food-index');
 s=s.replace(indexReturn,'NS.V034G1?.observeFoodIndex?.(v,w,states,donors24,donors30);'+indexReturn);
 const anchor='fallback=Math.max(2,carrier*2.8/(1+cost*.08)),cap=Math.max(Number(regular?.capacity||0),fallback),z={cal:now,cost,cap};';
 s=inject(s,anchor,'NS.V034G1?.observePair?.(v,w,d,r,regular,z);','food-pair');
 const ship='s.recentFoodDonor[r.id]=best.d.id;';
 s=inject(s,ship,"NS.V034G1?.observeShipment?.(v,w,best.d.id,r.id,put,best.cost);",'food-shipment');
 return s;
}
