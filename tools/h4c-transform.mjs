// Only physical transaction REFUNDS, after a rejected stone delivery, may
// restore already-withdrawn stock above its shrunken historical storage cap.
// All ordinary deposits continue through the H4C capacity gate.
export function h4cTransform(source,input){
 const edits={
  'src/legacy/040.js':[
   ['v.depositAt(s.id,resource,took)', 'NS.V034H4C.withReturn(v,()=>v.depositAt(s.id,resource,took))'],
   ['v.depositAt(s.id,resource,took-put)', 'NS.V034H4C.withReturn(v,()=>v.depositAt(s.id,resource,took-put))']
  ],
  'src/legacy/047.js':[
   ['v.depositAt(from,k,took-put)', 'NS.V034H4C.withReturn(v,()=>v.depositAt(from,k,took-put))']
  ],
  'src/legacy/068.js':[
   ['seller.depositAt?.(st.id,k,taken)', 'NS.V034H4C.withReturn(seller,()=>seller.depositAt?.(st.id,k,taken))'],
   ['seller.depositAt?.(st.id,k,taken-put)', 'NS.V034H4C.withReturn(seller,()=>seller.depositAt?.(st.id,k,taken-put))'],
   ['seller.depositAt?.(st.id,k,put)', 'NS.V034H4C.withReturn(seller,()=>seller.depositAt?.(st.id,k,put))']
  ]
 };
 let output=input;
 for(const [oldText,newText] of edits[source]||[]){
  if(output.includes(oldText))output=output.replace(oldText,newText); // superseded legacy paths are absent
 }
 return output;
}
