const rules=[
  ["ads",/\\b(ad|ads|advertisement|sponsored|rewarded|watch\\s+ad|remove\\s+ads|no\\s+ads)\\b/i],
  ["in_app_purchase",/\\b(buy|purchase|unlock|premium|upgrade|restore\\s+purchases|lifetime)\\b/i],
  ["subscription",/\\b(subscribe|subscription|monthly|yearly|annual|weekly|free\\s+trial|trial|renewal|per\\s+month|per\\s+year)\\b/i]
];
export function inspectMonetization(xml=""){
  const text=String(xml).replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/\\s+/g," ").trim();
  const observations=[];
  for(const [category,pattern] of rules){
    const matches=[...text.matchAll(new RegExp(pattern.source,"gi"))].map(x=>x[0]).filter(Boolean);
    if(matches.length) observations.push({category,status:"observed",evidence:[...new Set(matches)].slice(0,8),note:"Visible UI text only; integration and transaction behavior are not verified."});
  }
  if(/com\\.android\\.vending|billingclient|inappbilling/i.test(xml)) observations.push({category:"google_play_billing",status:"log_or_hierarchy_signal",evidence:["Google Play Billing-related signal"],note:"A signal does not prove successful billing integration."});
  return observations;
}
