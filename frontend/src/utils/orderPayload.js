// Helper to translate a cart/services item into the backend order payload
// matching backend createOrderSchema: { service, priceToman, requiredDocs }

export function buildOrderPayloadFromItem(item) {
  // For this plan we only require one document: passport
  const requiredDocs = ["passport_front"];

  return {
    service: "upwork_verification",
    priceToman: item.price || 0,
    requiredDocs,
  };
}
