export class MockVectorDB {
  searchLegalDocs(query: string) {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes("fssai") || lowercaseQuery.includes("compliance") || lowercaseQuery.includes("regulation")) {
      return `FSSAI Compliance Context: Food business operators must ensure that temperature-sensitive food articles are transported in vehicles equipped with functional temperature control systems. Failure to do so leading to spoilage can result in fines up to Rs. 2,00,000 and possible suspension of license under Section 31(1) of the FSS Act, 2006.`;
    }
    
    if (lowercaseQuery.includes("liability") || lowercaseQuery.includes("pays") || lowercaseQuery.includes("spoiled") || lowercaseQuery.includes("spoilage")) {
      return `Insurance & Liability Clauses (Section 4.B - Transit Spoilage): The logistics provider (transporter) assumes full financial liability for spoilage of perishable goods if the spoilage is definitively linked to a failure of their temperature control systems (e.g., reefer unit breakdown, failure to maintain agreed temperature bands), provided it is not caused by an act of God. The consignor must provide proof of handover temperature.`;
    }

    if (lowercaseQuery.includes("delay") || lowercaseQuery.includes("late")) {
      return `Delivery Delay Penalty Clause: If delivery is delayed by more than 12 hours beyond the scheduled SLA due to non-weather and non-traffic related operational failures, the logistics provider is liable for a penalty of 5% of the total consignment value, up to a maximum of Rs. 50,000 per incident.`;
    }

    return `General Legal Context: Transport of perishable goods requires strict adherence to standard food safety guidelines. Disputes are subject to local jurisdiction. Liability is determined based on the recorded telemetry data during transit. Please specify your query for more detailed clauses.`;
  }
}
