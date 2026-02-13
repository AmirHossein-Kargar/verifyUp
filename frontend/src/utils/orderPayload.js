// Helper to translate a cart/services item into the backend order payload
// matching backend createOrderSchema: { service, priceToman, requiredDocs }

export function buildOrderPayloadFromItem(item) {
  // Documents are managed by admin, no upload required from users
  const requiredDocs = [];

  // Map planId to service name
  let serviceName = "upwork_verification"; // default

  if (item.planId === "plan1") {
    serviceName = "upwork_verification";
  } else if (item.planId === "plan2") {
    serviceName = "account_optimization";
  } else if (item.planId === "plan3") {
    serviceName = "paypal_account";
  }

  return {
    service: serviceName,
    priceToman: item.price || 0,
    requiredDocs,
  };
}
