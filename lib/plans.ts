export type Plan = "free" | "premium" | "institutional";

export const FEATURES = {
  basicCourses: ["free", "premium", "institutional"],
  certificates: ["premium", "institutional"],
  daxAdvanced: ["premium", "institutional"],
  institutionalPanel: ["institutional"],
} as const;

export type FeatureKey = keyof typeof FEATURES;

export function canAccess(plan: Plan, feature: FeatureKey) {
  return (FEATURES[feature] as readonly Plan[]).includes(plan);
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Gratuito",
  premium: "Premium",
  institutional: "Institucional",
};
