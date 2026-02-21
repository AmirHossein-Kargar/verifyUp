/**
 * Order tracking steps for user-facing stepper UI (4 steps only).
 * in_progress and delivered removed per requirement.
 */
export const TRACKING_STEPS = [
  { key: "placed", label: "ثبت سفارش", labelEn: "Order Placed" },
  { key: "confirmed", label: "تایید سفارش", labelEn: "Order Confirmed" },
  { key: "processing", label: "در حال پردازش", labelEn: "Processing" },
  { key: "completed", label: "تکمیل شده", labelEn: "Completed" },
];

/** Legacy status to tracking step key (for backward compatibility) */
export const LEGACY_TO_STEP = {
  pending_docs: "placed",
  in_review: "processing",
  needs_resubmit: "processing",
  approved: "completed",
  completed: "completed",
  in_progress: "completed",
  delivered: "completed",
  rejected: "rejected",
};

export function getCurrentStepIndex(status) {
  const stepKey = LEGACY_TO_STEP[status] || status;
  const idx = TRACKING_STEPS.findIndex((s) => s.key === stepKey);
  return idx >= 0 ? idx : 0;
}

export function getStepStatus(stepKey, order) {
  if (!order) return "pending";
  const status = order.status;
  const stepKeyFromStatus = LEGACY_TO_STEP[status] || status;
  const history = order.statusHistory || [];
  const stepIndex = TRACKING_STEPS.findIndex((s) => s.key === stepKey);
  const currentIndex = getCurrentStepIndex(status);

  if (stepKey === "rejected" || status === "rejected") {
    return stepKey === "rejected" ? "completed" : "pending";
  }

  const hasInHistory = history.some((e) => (LEGACY_TO_STEP[e.status] || e.status) === stepKey);
  if (hasInHistory || stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

export function getStepTimestamp(stepKey, order) {
  const history = order?.statusHistory || [];
  const entry = history.find(
    (e) => (LEGACY_TO_STEP[e.status] || e.status) === stepKey
  );
  return entry?.timestamp || null;
}
