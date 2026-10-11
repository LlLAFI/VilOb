
window.VSim=window.VSim||{};
window.VSim.AIProfileCompat=function(subject,key){
 try{
  const v=subject?.brain?subject:null,b=subject?.brain||subject;
  if(window.VSim.AIProfiles?.capability&&v)return Number(window.VSim.AIProfiles.capability(v,key)||0);
  return Number(b?.aiProfileCapabilities?.[key]||0);
 }catch{return 0;}
};
