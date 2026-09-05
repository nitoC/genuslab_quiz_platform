// types/pricing.ts
export interface PlanFeature {
  text: string;
  included: boolean;
  icon?: string;
}

export interface PricingPlan {
  id: string;
  tag: string;
  title: string;
  // tagline: string;
  price: string;
  period?: string;
  badge?: string;
  // buttonText: string;
  // buttonVariant: "current" | "primary" | "gradient";
  isHighlighted?: boolean;
  features: PlanFeature[];
}
